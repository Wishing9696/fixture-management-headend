<template>
  <div class="unavailable-fixture">
    <el-card>
      <el-input class="inline-input" v-model="fixturename" style="width: 80%" placeholder="请输入夹具名"></el-input>
      <el-button size="small" type="primary" @click="okbutton">查询</el-button>
      <el-table :data="values" style="width: 100%">
        <el-table-column prop="fixturename" label="夹具名称"></el-table-column>
        <el-table-column prop="fixturenumber" label="夹具数量"></el-table-column>
        <el-table-column prop="fixturetype" label="夹具类型"></el-table-column>
        <el-table-column prop="instorage" label="库存"></el-table-column>
        <el-table-column prop="unavailable" label="异常"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-for="value in values"
          :prop="value.prop"
          :label="value.label"
          :key="value.index"
        ></el-table-column>
      </el-table>
      <el-dialog title="编辑" :visible.sync="dialogVisible">
        <el-form :model="form">
          <el-form-item label="库存数量" value="instorage">
            <el-input-number v-model="form.instorage"></el-input-number>
          </el-form-item>
          <el-form-item label="异常数量" value="unavailable">
            <el-input-number v-model="form.unavailable"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="save" type="primary">保存</el-button>
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
      values: [],
      fixturename: "",
      dialogVisible: false,
      form: {
        instorage: 0,
        unavailable: 0
      }
    };
  },
  methods: {
    getfixturedetails(fixturename) {
      //getfixturenames
      axios
        .get(`${host}/fixturedetails?fixturename=${fixturename}`)
        .then(res => {
          let values = res.data;
          this.values = values;
        })
        .catch(e => {
          console.log(e);
        });
    },
    okbutton() {
      this.getfixturedetails(this.fixturename);
    },
    handleClick(row) {
      this.dialogVisible = true;
      this.form = row;
    },
    save() {
      axios
        .post(`${host}/savefixturesedit`, this.values)
        .then(res => {})
        .catch(err => {
          console.log(err);
        });
      this.dialogVisible = false;
    }
  }
};
</script>

<style>
.unavailable-fixture {
  margin-top: 10px;
}
.el-input input {
  width: 100%;
}
</style>
