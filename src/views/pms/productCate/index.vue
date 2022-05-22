<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
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
          <el-form-item label="申请人ID：">
            <el-input v-model="listQuery.applicantId" class="input-width" placeholder="申请人ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="审核人ID：">
            <el-input v-model="listQuery.reviewerId" class="input-width" placeholder="审核人ID" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" >
        <el-table-column label="工单类型" width="110" align="center">
          <template slot-scope="scope">{{scope.row.formTypeDes}}</template>
        </el-table-column>
        <el-table-column label="申请人名称" width="110" align="center">
          <template slot-scope="scope">{{scope.row.applicantName}}</template>
        </el-table-column>
        <el-table-column label="申请人ID" width="110" align="center">
          <template slot-scope="scope">{{scope.row.applicantId}}</template>
        </el-table-column>
        <el-table-column label="工单状态" width="110" align="center">
          <template slot-scope="scope">{{scope.row.formStatusDescription}}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="110" align="center">
          <template slot-scope="scope">{{scope.row.submitTime}}</template>
        </el-table-column>
        <el-table-column label="审核时间" width="110" align="center">
          <template slot-scope="scope">{{scope.row.passTime}}</template>
        </el-table-column>
        <el-table-column label="审核人名称" width="110" align="center">
          <template slot-scope="scope">{{scope.row.reviewerName}}</template>
        </el-table-column>
        <el-table-column label="审核人ID" width="110" align="center">
          <template slot-scope="scope">{{scope.row.reviewerId}}</template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="getDetail(scope.$index)">查看详情</el-button>
            <el-button
              size="mini"
              type="success"
              @click="pass(scope.$index)">通过</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="reject(scope.$index)">拒绝</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="revert(scope.$index)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="科创项目详细信息" :visible.sync="dialogVisible1" width="70%" >
      <el-descriptions class="margin-top"  border>
        <el-descriptions-item v-if=" type == 0" label="项目名称">{{ this.detail.awardType}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 0" label="项目参与者">{{this.detail.participantNames.join(" ")}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 0" label="获奖级别">{{this.detail.awardLevel}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 0" label="获奖时间">{{ this.detail.achieveTime.slice(0, 10)}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 0" label="指导老师">{{ this.detail.instructorNames }}</el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <h3>证明材料</h3>
      <el-card title="图片" class="block" >
        <el-image v-for="url in imgs" :key="url" :src="url" style="width: 200px; height: 200px" :preview-src-list="imgs">
        </el-image>
      </el-card>
    </el-dialog>
    <el-dialog title="科研论文详细信息" :visible.sync="dialogVisible2" width="70%">
      <el-descriptions class="margin-top"  border>
        <el-descriptions-item v-if=" type == 1" label="论文名称">{{ this.detail.paperName}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 1" label="项目参与者">{{this.detail.authorNames.join(" ")}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 1" label="发表期刊">{{this.detail.publicationPeriodical}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 1" label="获奖时间">{{ this.detail.publicationTime.slice(0, 10)}}</el-descriptions-item>
        <el-descriptions-item v-if=" type == 1" label="收录期刊">{{ this.detail.collection }}</el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <h3>证明材料</h3>
      <el-card title="图片" class="block" >
        <el-image v-for="url in imgs" :key="url" :src="url" style="width: 200px; height: 200px" :preview-src-list="imgs">
        </el-image>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
import {formatDate} from '@/utils/date';
import {getRuleByTypeName} from "../../../api/type";
import {agreeForm, deleteForm, getFormList, rejectForm} from "../../../api/form";
import {getPaperDetail, getProjectDetail} from "../../../api/project";
import {getFormImg} from "../../../api/upload";
import store from "../../../store";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null,
  applicantId: null,
  reviewerId: null,
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
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
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
      getFormList(this.listQuery.applicantId, this.listQuery.reviewerId, this.listQuery.pageNum, this.listQuery.pageSize,
      false, false, false, false, false).then(res => {
        this.listLoading = false;
        this.list = res.data.data;
        for (let i = 0; i < this.list.length; i++) {
          let a = new Date(this.list[i].submitTime)
          let b = new Date(this.list[i].passTime)
          const date = new Date(a);
          const Y = date.getFullYear() + '-';
          const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
          const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
          // const s = date.getSeconds(); // 秒
          const dateString = Y + M + D;
          // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
          this.list[i].submitTime = dateString
          if (this.list[i].passTime != null) {
            const date1 = new Date(b);
            const Y1 = date1.getFullYear() + '-';
            const M1 = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '-';
            const D1 = (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + '  ';
            const h1 = (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':';
            const m1 = (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes());
            this.list[i].passTime = Y1 + M1 + D1
          }
        }
      })
    },
    getDetail(index) {
      let formId = this.list[index].formId
      let type = this.list[index].formType
      this.type = type
      getFormImg(formId).then(res => {
        if (res.data.success) {
          this.imgs = res.data.data
        }
      })
      if (type == 0) {
        getProjectDetail(formId).then(res => {
          if (res.data.success) {
            this.detail = res.data.data
            this.dialogVisible1 = true
          }
        })
      } else {
        getPaperDetail(formId).then(res => {
          if (res.data.success) {
            this.detail = res.data.data
            this.dialogVisible2 = true
          }
        })
      }
      },
    pass(index) {
      let formId = this.list[index].formId
      let formStatus = this.list[index].formStatus
      if(formStatus == '0') {
        agreeForm(formId, this.userId).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList();
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.error('只能通过待审核状态的工单')
      }
    },
    revert(index) {
      let formId = this.list[index].formId
      let formStatus = this.list[index].formStatus
      if (formStatus == '1') {
        deleteForm(formId, this.userId).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList();
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.error('只能撤销审核通过的工单')
      }
    },
    reject(index) {
      let formId = this.list[index].formId
      let formStatus = this.list[index].formStatus
      if(formStatus == '0') {
        rejectForm(formId, this.userId).then(res => {
          if (res.data.success) {
            this.$message.success('操作成功')
            this.getList();
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.error('只能拒绝待审核状态的工单')
      }
    }
  }
}
</script>
<style></style>


