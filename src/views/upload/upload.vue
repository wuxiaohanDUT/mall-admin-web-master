<template>
  <div >
         <el-dialog title="导入源数据库表单信息" :visible.sync="dialogVisible1">
      <el-form ref="importFormRef" :model="importForm"  label-width="130px">
        <el-form-item label="病种kgCode:" prop="kgCode" >
          <el-input v-model="importForm.kgCode" ></el-input>
        </el-form-item>
        <el-form-item label="目标数据库URL:" prop="targetUrl" >
          <el-input v-model="importForm.targetUrl"></el-input>
        </el-form-item>
        <el-form-item label="目标数据库账号:" prop="targetUsername" >
          <el-input v-model="importForm.targetUsername"></el-input>
        </el-form-item>
        <el-form-item label="目标数据库密码: " prop="targetPassword" >
          <el-input v-model="importForm.targetPassword"></el-input>
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
            <div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且不超过5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitImportForm">开始导入</el-button>
          <el-button type="info" @click="dialogVisible = false">关闭窗口</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {uploadForm} from '@/api/upload'
  export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      dialogVisible1:true,
      importForm:{
      kgCode:'',
      targetUrl:'',
      targetUsername:'',
      targetPassword:'',
      },
      fileList: []
    }
  },
  mounted(){
    this.drawLine();
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
        // 使用form表单的数据格式
        const params = new FormData()
        // 将上传文件数组依次添加到参数paramsData中
        this.fileList.forEach((x) => {
          params.append('file', x.file)
        });
        // 将输入表单数据添加到params表单中
        params.append('kgCode', this.importForm.kgCode)
        params.append('targetUrl', this.importForm.targetUrl)
        params.append('targetUsername', this.importForm.targetUsername)
        params.append('targetPassword', this.importForm.targetPassword)
		//这里根据自己封装的axios来进行调用后端接口
        uploadForm(params).then(res => {
          if (res.data.success) {
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
      }
  }
}
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
