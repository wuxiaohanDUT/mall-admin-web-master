<template> 
  <div class="space">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="获奖类型名称"
        width="500">
        <template slot-scope="scope">
          <i class="el-icon-info"></i>
          <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="获奖等级种类"
        width="500">
        <template slot-scope="scope">
              <el-tag size="medium" v-for="item in scope.row.awardLevel" >
                {{ item }}
              </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="增加">
        <template slot="header" slot-scope="scope">
          <el-button type="success" round @click="handleAdd">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增获奖类型" :visible.sync="addDialogVisible" >
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="typeName"
          label="类型名称">
          <el-input v-model="dynamicValidateForm.typeName"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(level, index) in dynamicValidateForm.awardlevels"
          :label="'获奖等级' + index"
          :key="level.key"
          :prop="'awardlevels.' + index + '.value'"
          :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }">
          <el-input v-model="level.value"></el-input><el-button @click.prevent="removeDomain(level)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button @click="addDomain">新增获奖等级</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {getAllType, deleteType, addType} from "../../../api/type";
export default {
  data() {
    return {
      addDialogVisible:false,
      tableData: [],
      dynamicValidateForm: {
        awardlevels: [{
          value: ''
        }],
        typeName: ''
      },
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.deleteOneType(this.tableData[index].typeId);
    },
    handleAdd() {
      this.addDialogVisible = true;
    },
    getAll() {
      getAllType().then(result => {
        let data = result.data;
        if (!data.success) {
          this.$message.error('获取数据失败');
        } else {
          this.tableData = data.data
        }
      })
    },
    deleteOneType(typeId) {
      console.log(typeId)
      deleteType(typeId).then(result => {
        let data = result.data
        if (!data.success) {
          this.$message.error('删除失败');
        } else {
          this.$message.success('删除成功');
          this.getAll();
        }
      })
    },
    addOneType(typeName, awardLevel){
      addType(typeName, awardLevel).then(result => {
        let data = result.data
        if (!data.success) {
          this.$message.error('添加失败');
        } else {
          this.$message.success('添加成功');
          this.getAll();
        }
      })
    },
    submitForm(formName) {
      console.log(this.dynamicValidateForm);
      let awardlevel = [];
      let awardlevels = this.dynamicValidateForm.awardlevels;
      for (let i = 0; i < awardlevels.length; i++) {
        awardlevel.push(awardlevels[i].value);
      }
      this.addOneType(this.dynamicValidateForm.typeName, awardlevel);
      this.addDialogVisible = false;
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.awardlevels.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.awardlevels.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.awardlevels.push({
        value: '',
        key: Date.now()
      });
    }
  }
}
</script>
<style>
.space a {
  display: inline-block;
  padding: .5em 1em;
}
</style>


