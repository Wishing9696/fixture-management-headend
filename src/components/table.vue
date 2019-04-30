<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">报表</label>
      </div>
      <div v-if="authed">
        <el-select v-model="state" placeholder="请选择" style="width:600px" @change="selectstate">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div v-if="flop" style="margin-top:10px">
          <el-input v-model="planidentifer" placeholder="请输入项目名或项目PN号" style="width:300px"></el-input>
          <el-button type="primary" style="margin-left:30px" @click="handleflop">查看此项目夹具清单</el-button>
          <h3>{{flopdetail}}</h3>
          <el-table :data="floptabledata" style="margin-top:10px">
            <el-table-column prop="name" label="夹具名称"></el-table-column>
            <el-table-column prop="number" label="夹具数量"></el-table-column>
            <el-table-column prop="type" label="夹具类型"></el-table-column>
          </el-table>
        </div>
        <div v-else-if="fl" style="margin-top:10px">
          <el-date-picker v-model="fldatepicker" @change="handlefl" style="width:300px"></el-date-picker>
          <el-button type="primary" @click="handleexport" style="margin-left:30px">导出选中项</el-button>
          <el-table
            :data="fltabledata"
            style="margin-top:10px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="30px"></el-table-column>
            <el-table-column prop="fixturename" label="名称" sortable width="150px"></el-table-column>
            <el-table-column prop="fixturenumber" label="数量" width="150px"></el-table-column>
            <el-table-column prop="fixturedistribution" label="分布"></el-table-column>
          </el-table>
        </div>
        <div v-else-if="ul">
          <el-table :data="ultabledata" style="margin-top:10px">
            <el-table-column prop="fixturename" label="夹具名称"></el-table-column>
            <el-table-column prop="fixturenumber" label="夹具数量"></el-table-column>
            <el-table-column prop="fixturetype" label="夹具类型"></el-table-column>
          </el-table>
        </div>
        <div v-else-if="sc">
          <el-date-picker v-model="scdatepicker" style="margin-top:10px;width:300px"></el-date-picker>
          <el-autocomplete
            class="sc-input"
            style="margin-top:10px;width:500px"
            v-model="scmodel"
            :fetch-suggestions="querySearch"
            placeholder="请输入夹具名称"
            @select="handlescselect"
          ></el-autocomplete>
          <ve-line :data="chartdata" :settings="chartSettings" :colors="colors"></ve-line>
        </div>
        <div v-else></div>
      </div>
      <div v-else>
        <el-form :model="pwdForm" label-position="left" label-width="80px" @submit.native.prevent>
          <el-form-item label="认证密码">
            <el-input
              v-model="pwdForm.pwd"
              placeholder="请输入密码"
              type="password"
              @keyup.enter.native="auth"
              class="pwd"
            ></el-input>
            <el-button id="pwd-button" :type="typeofbutton" @click="auth">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import XLSX from "xlsx";

import axios from "axios";
let host = require("../../serverConfig.js").default.host;

export default {
  name: "fixtureconfiguration",
  data() {
    return {
      authed: false,
      typeofbutton: "primary",
      pwdForm: {
        pwd: ""
      },
      state: "",
      flop: false,
      fl: false,
      ul: false,
      sc: false,
      flopdetail: "",
      planidentifer: "",
      floptabledata: [],
      fldatepicker: "",
      fltabledata: [],
      fllist: [],
      ultabledata: [],
      scdatepicker:"",
      fixtures: [],
      scmodel: "",
      colors:['#EE1289', '#1C86EE'],
      chartSettings: {
        metrics: ["实际使用情况", "计划使用情况"],
        dimension: ["线体"]
      },
      chartdata: {
        colomns: ["线体", "实际使用情况", "计划使用情况"],
        rows: []
      },
      options: [
        {
          value: "fixturelistofaplan",
          label: "某项目的夹具清单"
        },
        {
          value: "fixturelist",
          label: "资源清单"
        },
        {
          value: "unavailablelist",
          label: "异常资源"
        },
        {
          value: "servicecondition",
          label: "某资源使用情况"
        }
      ]
    };
  },
  methods: {
    auth() {
      if (this.pwdForm.pwd === "hsme1") {
        this.authed = true;
      } else {
        this.typeofbutton = "danger";
      }
    },
    selectstate() {
      if (this.state === "fixturelistofaplan") {
        this.flop = true;
        this.fl = this.ul = this.sc = false;
      } else if (this.state === "fixturelist") {
        this.fl = true;
        this.flop = this.ul = this.sc = false;
      } else if (this.state === "unavailablelist") {
        this.ul = true;
        this.flop = this.fl = this.sc = false;
        this.handleul();
      } else if (this.state === "servicecondition") {
        this.sc = true;
        this.flop = this.fl = this.ul = false;
      } else {
        this.flop = this.fl = this.ul = this.sc = false;
      }
    },
    handleflop() {
      axios
        .get(`${host}/product/getProductByPlanIdentfier?planid=${this.planidentifer}`)
        .then(res => {
          let results = res.data;
          console.log(res.data)
          this.flopdetail = ""
          this.floptabledata = results
        })
        .catch(err => {
          console.log(err);
          this.flopdetail = "error!";
        });
    },
    handlefl() {
      axios
        .get(`${host}/fixturelist?date=${this.fldatepicker}`)
        .then(res => {
          let results = res.data;
          this.fltabledata = results;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleexport() {
      var sheet = XLSX.utils.json_to_sheet(this.multipleSelection);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet);
      XLSX.writeFile(wb, this.fldatepicker + ".xlsx");
    },
    handleul() {
      axios
        .get(`${host}/unavailablelist`)
        .then(res => {
          let results = res.data;
          this.ultabledata = results;
        })
        .catch(err => {
          console.log(err);
        });
    },
    querySearch(queryString, cb) {
      var fixtures = this.fixtures;
      var results = queryString
        ? fixtures.filter(this.createFilter(queryString))
        : fixtures;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return fixture => {
        return (
          fixture.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handlescselect() {
      axios
        .get(`${host}/usageofaresource?date=${this.scdatepicker}&fixturename=${this.scmodel}`)
        .then(res => {
          let results = res.data;
          this.chartdata.rows = results;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    axios
      .get(`${host}/fixture`)
      .then(res => {
        let results = res.data;
        for (let a of results) {
          this.fixtures.push({ value: a.name });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scope>
.product-config {
  width: 70%;
  margin: 0 auto;
  margin-top: 5%;
}
.el-select {
  width: 50%;
}
.product-config .pwd {
  width: 15%;
  min-width: 200px;
}
#pwd-button {
  margin-left: 20px;
}
</style>