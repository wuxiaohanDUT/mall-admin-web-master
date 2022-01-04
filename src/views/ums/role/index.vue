<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               ref="loginForm"
               label-position="left">
        <h2 class="login-title color-main">积分规则设置</h2>
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
        <el-form-item prop="password" label="积分数目:">
          <el-select v-model="points" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleSubmmit">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>
<script>
import {getAllType, updateRule} from "../../../api/type";
export default {
  data() {
    return {
      options: [],
      arr:[
        {
          typeId: 1,
          typeName: '蓝桥杯',
          awardLevel: ['一等奖', '二等奖', '三等奖']
        },
        {
          typeId: 2,
          typeName: '大学生数学竞赛',
          awardLevel: ['市级奖', '省级奖', '国家级奖']
        }
      ],
      arr2:[],
      value: '',
      typeName: '',
      awardLevel: '',
      points: '',
      checkedObj: '',
      checkedId: ''
    }
  },
  created() {
    getAllType().then(result => {
      let data = result.data.data
      this.arr = data
    })
    for (let i = 1; i <= 100; i++) {
      this.options.push(i);
    }
  },
  methods: {
    typeSelectChange() {
      console.log(this.checkedId);
      this.awardLevel = '';
      this.arr2 = this.arr[this.checkedId].awardLevel;
    },
    handleSubmmit() {
      console.log(this.arr[this.checkedId].typeId);
      console.log(this.awardLevel);
      console.log(this.points);
      updateRule(this.arr[this.checkedId].typeId, this.awardLevel, this.points).then(result => {
        let data = result.data;
        if (!data.success) {
          this.$message.error('更新失败');
        } else {
          this.$message.success('更新成功');
        }
      })
    }
  }
}
</script>
<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409EFF;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409EFF;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>


