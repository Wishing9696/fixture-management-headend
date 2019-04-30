<template>
  <div class="stockin-quiry">
    <el-card>
      <el-input class="inline-input" v-model="fixturename" style="width: 80%" placeholder="请输入夹具名"></el-input>
      <el-button size="small" type="primary" @click="okbutton">查询</el-button>
      <el-table :data="values" style="width: 100%">
        <el-table-column prop="fixturename" label="夹具名称"></el-table-column>
        <el-table-column prop="fixturenumber" label="夹具数量"></el-table-column>
        <el-table-column prop="fixturetype" label="夹具类型"></el-table-column>
        <el-table-column
          v-for="value in values"
          :prop="value.prop"
          :label="value.label"
          :key="value.index"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
let host = require("../../../serverConfig.js").default.host;
export default {
  data() {
    return {
      input: "",
      tabledata: [],
      values: [],
      fixturename: "",
      //namesOptions: []
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
        .catch(err => {
          console.log(err);
        });
    },
    okbutton() {
      this.getfixturedetails(this.fixturename)
    }
  }
};
</script>

<style>
.stockin-quiry {
  margin-top: 10px;
}
.el-input input {
  width: 100%;
}
</style>
