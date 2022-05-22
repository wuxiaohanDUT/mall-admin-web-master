<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜素</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="listQuery.beginTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="listQuery.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总科创积分:">
            {{this.totalScore}}
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" >
        <el-table-column label="得分时间" width="450" align="center">
          <template slot-scope="scope">{{scope.row.achieveTime}}</template>
        </el-table-column>
        <el-table-column label="积分数" width="450" align="center">
          <template slot-scope="scope">{{scope.row.points}}</template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="getDetail(scope.$index)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
    </div>
    <el-dialog title="科创项目详细信息" :visible.sync="dialogVisible1" width="70%" >
      <el-descriptions class="margin-top"  border>
        <el-descriptions-item  label="项目名称">{{ this.detail.awardType}}</el-descriptions-item>
        <el-descriptions-item  label="项目参与者">{{this.detail.participantNames.join(" ")}}</el-descriptions-item>
        <el-descriptions-item  label="获奖级别">{{this.detail.awardLevel}}</el-descriptions-item>
        <el-descriptions-item  label="获奖时间">{{ this.detail.achieveTime.slice(0, 10)}}</el-descriptions-item>
        <el-descriptions-item  label="指导老师">{{ this.detail.instructorNames }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script>
import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
import {formatDate} from '@/utils/date';
import {getRuleByTypeName} from "../../../api/type";
import {agreeForm, deleteForm, getFormList, getUserScoreRecords, rejectForm} from "../../../api/form";
import {
  getPaperDetail,
  getProjectDetail,
  getProjectDetailById,
  getProjectDetailByProjectId
} from "../../../api/project";
import {getFormImg} from "../../../api/upload";
import store from "../../../store";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 999,
  keyword: null,
  applicantId: null,
  reviewerId: null,
  beginTime: null,
  endTime: null
};
const defaultFlashPromotion = {
  id: null,
  title: null,
  startDate: null,
  endDate: null,
  status: 0
};
export default {
  name: 'flashPromotionList',
  data() {
    return {
      userId: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      flashPromotion: Object.assign({}, defaultFlashPromotion),
      isEdit: false,
      applicantId: null,
      reviewerId: null,
      detail: {
        awardType:'',
        participantNames: [],
        awardLevel: '',
        achieveTime: '',
        instructorNames: '',
        paperName:'',
        collection:'',
        publicationTime:'',
        publicationPeriodical:'',
        authorNames:[],
      },
      imgs: [],
      dialogVisible1: false,
      dialogVisible2: false,
      type:'',
      totalScore: null,
    }
  },
  created() {
    this.userId = store.getters.userId;
    this.getList();
  },
  filters: {
    formatActiveStatus(row) {
      let nowTime = new Date().getTime();
      if (nowTime >= row.startDate && nowTime <= row.endDate) {
        return '活动进行中';
      } else if (nowTime > row.endDate) {
        return '活动已结束';
      } else {
        return '活动未开始';
      }
    },
    formatDate(time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.totalScore = 0;
      this.getList();
    },
    handleSizeChange(val) {
      this.totalScore = 0;
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.totalScore = 0;
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.flashPromotion = Object.assign({},defaultFlashPromotion);
    },
    handleShowSessionList() {
      this.$router.push({path: '/sms/flashSession'})
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, {status: row.status}).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
        this.getList();
      });
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFlash(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.flashPromotion = Object.assign({},row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateFlash(this.flashPromotion.id,this.flashPromotion).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else {
          createFlash(this.flashPromotion).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        }
      })
    },
    handleSelectSession(index,row){
      this.$router.push({path:'/sms/selectSession',query:{flashPromotionId:row.id}})
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      getUserScoreRecords(this.userId, this.listQuery.beginTime, this.listQuery.endTime, this.listQuery.pageNum, this.listQuery.pageSize).then(res => {
        this.listLoading = false;
        this.list = res.data.data;
        for (let i = 0; i < this.list.length; i++) {
          let a = new Date(this.list[i].achieveTime)
          const date = new Date(a);
          const Y = date.getFullYear() + '-';
          const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
          // const s = date.getSeconds(); // 秒
          const dateString = Y + M + D;
          // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
          this.list[i].achieveTime = dateString
          this.totalScore += this.list[i].points
        }
      })
    },
    getDetail(index) {
      let projectId = this.list[index].projectId
      getProjectDetailByProjectId(projectId).then(res => {
        if (res.data.success) {
          this.detail = res.data.data
          this.dialogVisible1 = true
        }
        }
      )
    },
  }
}
</script>
<style></style>


