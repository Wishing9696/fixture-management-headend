<template>
  <div class="fixture-import">
    <el-card shadow="always">
      <el-table :data="fixtures" style="width: 100%">
        <el-table-column prop="fixtureName" label="夹具名称"></el-table-column>
        <el-table-column prop="number" label="夹具数量"></el-table-column>
        <el-table-column prop="fixtureType" label="夹具类型"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope)" type="text" size="small">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="dialogFormVisible=true">添加夹具</el-button>
      <el-button type="primary" @click="uploadbutton">上传</el-button>
      <el-dialog title="新增夹具" :visible.sync="dialogFormVisible" @opened="dialogOpened">
        <el-form :model="form" ref="form" label-position="top">
          <el-form-item label="夹具名称" :label-width="formLabelWidth" prop="fixtureName">
            <el-input v-model="form.fixtureName" autocomplete="off" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="夹具数量" :label-width="formLabelWidth" prop="number">
            <el-input-number v-model="form.number" :min="1" style="width:120px"></el-input-number>
          </el-form-item>
          <el-form-item label="夹具类型" :label-width="formLabelWidth" prop="fixtureType">
            <el-select v-model="form.fixtureType" placeholder="请选择夹具类型" style="width:80%">
              <el-option label="设备" value="设备"></el-option>
              <el-option label="耗材" value="耗材"></el-option>
              <el-option label="夹具" value="夹具"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="addokbutton" style="centre">完成</el-button>
            <el-button type="primary" @click="addcancelbutton">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
let host = require("../../../serverConfig.js").default.host;
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        fixtureName: "",
        number: 1,
        fixtureType: ""
      },
      fixtures: [],
      formLabelWidth: "100px"
    };
  },
  methods: {
    dialogOpened(e) {
      this.$refs["form"].resetFields();
    },
    addokbutton() {
      let data = {};
      Object.assign(data, this.form);
      this.fixtures.push(data);
      this.dialogFormVisible = false;
    },
    addcancelbutton() {
      this.dialogFormVisible = false;
    },
    deleteRow(row) {
      this.fixtures.splice(row.$index, 1);
    },
    uploadbutton() {
      let that = this;
      for (let f of this.fixtures) {
      }

      axios.post(`${host}/uploadfixtures`, this.fixtures).then(() => {
        this.$alert("上传成功", "Message", {
          callback: function() {
            that.$refs["fixtures"].resetFileds();
          }
        });
      });
    }
  }
};
</script>

<style>
.fixture-import {
  margin-top: 10px;
}
.fixturename {
  width: 40%;
}

.fixturecode {
  width: 40%;
}
.okbutton {
  margin-left: 30%;
}
.el-table {
  margin-bottom: 10px;
}
</style>

