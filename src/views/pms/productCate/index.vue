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
        <el-table-column label="工单类型" width="150" align="center">
          <template slot-scope="scope">{{scope.row.formTypeDes}}</template>
        </el-table-column>
        <el-table-column label="申请人名称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.applicantName}}</template>
        </el-table-column>
        <el-table-column label="申请人ID" width="150" align="center">
          <template slot-scope="scope">{{scope.row.applicantId}}</template>
        </el-table-column>
        <el-table-column label="工单状态" width="150" align="center">
          <template slot-scope="scope">{{scope.row.formStatusDescription}}</template>
        </el-table-column>
        <el-table-column label="申请时间" width="150" align="center">
          <template slot-scope="scope">{{scope.row.submitTime}}</template>
        </el-table-column>
        <el-table-column label="审核时间" width="150" align="center">
          <template slot-scope="scope">{{scope.row.passTime}}</template>
        </el-table-column>
        <el-table-column label="审核人名称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.reviewerName}}</template>
        </el-table-column>
        <el-table-column label="审核人ID" width="150" align="center">
          <template slot-scope="scope">{{scope.row.reviewerId}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="getDetail(scope.$index)">查看详情</el-button>
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
  </div>
</template>
<script>
import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
import {formatDate} from '@/utils/date';
import {getRuleByTypeName} from "../../../api/type";
import {getFormList} from "../../../api/form";
import {getPaperDetail, getProjectDetail} from "../../../api/project";
import {getFormImg} from "../../../api/upload";
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
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      flashPromotion: Object.assign({}, defaultFlashPromotion),
      isEdit: false,
      applicantId: null,
      reviewerId: null,
      detail: null,
      imgs: null,
    }
  },
  created() {
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
      getFormList(this.listQuery.applicantId, this.listQuery.reviewerId, this.listQuery.pageNum, this.listQuery.pageSize).then(res => {
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
          const dateString = Y + M + D + h + m;
          // console.log('dateString', dateString); // > dateString 2021-07-06 14:23
          this.list[i].submitTime = dateString
          if (this.list[i].passTime != null) {
            const date1 = new Date(b);
            const Y1 = date1.getFullYear() + '-';
            const M1 = (date1.getMonth() + 1 < 10 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1) + '-';
            const D1 = (date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()) + '  ';
            const h1 = (date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':';
            const m1 = (date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes());
            this.list[i].passTime = Y1 + M1 + D1 + h1 + m1
          }
        }
      })
    },
    getDetail(index) {
      let formId = this.list[index].formId
      let type = this.list[index].formType
      console.log(formId)
      getFormImg(formId).then(res => {
        if (res.data.success) {
          this.imgs = res.data.data
        }
      })
      if (type == 0) {
        getProjectDetail(formId).then(res => {
          if (res.data.success) {
            this.detail = res.data.data
          }
        })
      } else {
        getPaperDetail(formId).then(res => {
          if (res.data.success) {
            this.detail = res.data.data
          }
        })
      }
      console.log(this.detail)
      console.log(this.imgs)
    }
  }
}
</script>
<style></style>


