<template> 
  <div class="app-container">
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" >
        <el-table-column label="论文名称" width="250" align="center">
          <template slot-scope="scope">{{scope.row.paperName}}</template>
        </el-table-column>
        <el-table-column label="发表期刊" width="250" align="center">
          <template slot-scope="scope">{{scope.row.publicationPeriodical}}</template>
        </el-table-column>
        <el-table-column label="收录期刊" width="250" align="center">
          <template slot-scope="scope">{{scope.row.collection}}</template>
        </el-table-column>
        <el-table-column label="发表时间" width="250" align="center">
          <template slot-scope="scope">{{scope.row.publicationTime}}</template>
        </el-table-column>
        <el-table-column label="文章作者" width="250" align="center">
          <template slot-scope="scope">{{scope.row.authorNames.join(' ')}}</template>
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
  </div>
</template>
<script>
import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
import {formatDate} from '@/utils/date';
import {getRuleByTypeName} from "../../../api/type";
import {agreeForm, deleteForm, getFormList, rejectForm} from "../../../api/form";
import {getPaperDetail, getPapersByUserId, getProjectDetail} from "../../../api/project";
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
    this.applicantId = store.getters.userId;
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
        getPapersByUserId(this.userId, this.listQuery.pageNum, this.listQuery.pageSize).then(res => {
          this.listLoading = false;
          this.list = res.data.data;
          for (let i = 0; i < this.list.length; i++) {
            let a = new Date(this.list[i].publicationTime)
            const date = new Date(a);
            const Y = date.getFullYear() + '-';
            const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
            // const s = date.getSeconds(); // 秒
            const dateString = Y + M + D;
            // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
            this.list[i].publicationTime = dateString
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
    }
  }
}
</script>
<style></style>


