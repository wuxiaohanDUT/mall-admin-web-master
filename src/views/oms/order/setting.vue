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
          <el-form-item label="年级">
            <el-select v-model="listQuery.year" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="院系">
            <el-select v-model="listQuery.college" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" >
        <el-table-column label="学号" width="300" align="center">
          <template slot-scope="scope">{{scope.row.userId}}</template>
        </el-table-column>
        <el-table-column label="姓名" width="300" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="班级" width="300" align="center">
          <template slot-scope="scope">{{scope.row.userClass}}</template>
        </el-table-column>
        <el-table-column label="积分数量" width="300" align="center">
          <template slot-scope="scope">{{scope.row.points}}</template>
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
import {
  agreeForm,
  deleteForm,
  exportUserPointsExcel,
  getFormList,
  getUserPoints,
  getUserScoreRecords,
  rejectForm
} from "../../../api/form";
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
  endTime: null,
  year: null,
  college: null
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
      options: [],
      options1: ['软件学院', '电信学院', '微电子学院', '经济管理学院', '化工学院', '国际信息与软件学院']
    }
  },
  created() {
    this.userId = store.getters.userId;
    this.getList();
    let year = new Date().getFullYear();
    for(let i = -5; i <= 2; i++) {
      this.options.push(year + i)
    }
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
      getUserPoints(this.listQuery.beginTime, this.listQuery.endTime, this.listQuery.year, this.listQuery.college).then(res => {
        this.listLoading = false;
        this.list = res.data.data;
      })
    },
    exportUserPointsExcel() {
      exportUserPointsExcel(this.listQuery.beginTime, this.listQuery.endTime, this.listQuery.year, this.listQuery.college).then(res => {
        const link = document.createElement('a')
        //定义文件名
        const fileName ="导出数据表.xlsx";  //后面必须加.xlsx，否则文件导出打开会提示文损坏之类的....
        // const fileName = '自定义命名的表格名' + new Date().getTime()+'.xlsx';  //返回时间戳
        //  blob(size,type) Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型(注：有的需要res.data看后台返回的实际数据参数了)
        let blob = new Blob([res], {type: 'application/vnd.ms-excel'})
        //如果您设置 display:none，将隐藏整个元素，如果您设置 visibility:hidden，元素的内容将不可见，但元素保持原来的位置和大小。
        link.style.display = 'none'
        //URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。该URL可用于指定源 object(blob)的内容。
        link.href = URL.createObjectURL(blob)
        //download="filename" 属性规定被下载的超链接目标。filename规定作为文件名来使用的文本。
        link.download = fileName //下载的文件名
        //link(a)是一个dom元素（一个标签），向body中插入了一个dom(a)元素。
        document.body.appendChild(link)
        //创建一个a链接 使用a.click()模拟点击
        link.click()
        //removeChild() 方法指定元素的某个指定的子节点。以 Node 对象返回被删除的节点，如果节点不存在则返回 null。
        document.body.removeChild(link)
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


