<template>
  <div>
    <el-dialog title="科创项目申请" :visible.sync="dialogVisible1">
      <el-form ref="importFormRef" :model="importForm"  label-width="130px">
        <el-form-item prop="username" label="获奖类型:">
          <el-select v-model="checkedId" placeholder="请选择" @change="typeSelectChange()">
            <el-option
              v-for="(item, index) in arr"
              :key="item.typeId"
              :label="item.typeName"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="获奖等级:">
          <el-select v-model="awardLevel" placeholder="请选择">
            <el-option
              v-for="item in arr2"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label = "获奖日期:" prop="date">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'参与者' + (index + 1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <el-input v-model="domain.value" placeholder="请输入参与者学号"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item label="指导老师:" prop="instructors" >
          <el-input v-model="instructors" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="description" >
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="description"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="上传文件:" prop="excel">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="httpRequest"
            :before-upload="beforeUpload"
            :on-exceed="handleExceed"
            :limit="2">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.png文件，且不超过5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitImportForm">开始导入</el-button>
          <el-button type="info" @click="dialogVisible = false">关闭窗口</el-button>
          <el-button @click="addDomain">新增参与者</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {getAllType} from "../../../api/type";
import store from "../../../store";
import {addFormImg, addProjectForm} from "../../../api/upload";
export default {
  data () {
    return {
      userId: '',
      dialogVisible1: true,
      importForm: {
        kgCode: '',
        targetUrl: '',
        targetUsername: '',
        targetPassword: '',
      },
      fileList: [],
      arr: [],
      checkedId: '',
      awardLevel: '',
      dynamicValidateForm: {
        domains: [{
          value: ''
        }],
      },
      description: '',
      instructors: '',
      date: '',
      formId: '',
    }
  },
  created() {
    this.userId = store.getters.userId;
    getAllType().then(result => {
      let data = result.data.data
      this.arr = data
    })
  },
  methods: {
    httpRequest(option) {
      this.fileList.push(option)
    },
    // 上传前处理
    beforeUpload(file) {
      let fileSize = file.size
      const FIVE_M= 5*1024*1024;
      //大于5M，不允许上传
      if(fileSize>FIVE_M){
        this.$message.error("最大上传5M")
        return  false
      }
      //判断文件类型，必须是xlsx格式
      let fileName = file.name
      let reg = /^.+(\.png)$/
      if(!reg.test(fileName)){
        this.$message.error("只能上传png!")
        return false
      }
      return true
    },
    // 文件数量过多时提醒
    handleExceed() {
      this.$message({ type: 'error', message: '最多支持2个附件上传' })
    },
    submitImportForm() {
      console.log(this.arr[this.checkedId]);
      console.log(this.awardLevel);
      console.log(this.dynamicValidateForm.domains);
      console.log(this.instructors);
      console.log(this.description);
      console.log(this.date)
      console.log(this.userId)
      var participantIds = []
      for (let i = 0; i < this.dynamicValidateForm.domains.length; i++) {
        participantIds.push(this.dynamicValidateForm.domains[i].value)
      }
      addProjectForm(this.userId, this.arr[this.checkedId].typeId, this.awardLevel, participantIds, this.instructors, this.date, 1, this.description).then(res => {
        this.formId = res.data.data
        if (res.data.data) {
          // 使用form表单的数据格式
          const params = new FormData()
          // 将上传文件数组依次添加到参数paramsData中
          this.fileList.forEach((item) => {
            params.append('files', item.file)
          });
          // 将输入表单数据添加到params表单中
          //params.append('kgCode', this.importForm.kgCode)
          //params.append('targetUrl', this.importForm.targetUrl)
          //params.append('targetUsername', this.importForm.targetUsername)
          //params.append('targetPassword', this.importForm.targetPassword)
          params.append('formId', this.formId)
          //这里根据自己封装的axios来进行调用后端接口
          addFormImg(params).then(res => {
            if (res.data.data.success) {
              this.$message({
                message: "导入成功",
                type: "success"
              })
            }else{
              this.$message({
                message: "导入失败",
                type: "error"
              })
            }
            this.$refs.importFormRef.resetFields()//清除表单信息
            this.$refs.upload.clearFiles()//清空上传列表
            this.fileList = []//集合清空
            this.dialogVisible1 = false//关闭对话框
          })
        } else {
          this.$message({
            message: "导入失败",
            type: "error"
          })
        }
      })
    },
    typeSelectChange() {
      console.log(this.checkedId);
      this.awardLevel = '';
      this.arr2 = this.arr[this.checkedId].awardLevel;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now()
      });
    }
  }
}
</script>
<style></style>


