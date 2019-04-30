<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">计划数量调整确认</label>
      </div>
      <div v-if="authed">
        <span class="dateright">请选择日期：</span>
        <el-date-picker
          v-model="pickerdate"
          align="right"
          type="date"
          placeholder="请选择需要配置的日期"
          :picker-options="pickerOptions"
          @change="choosedate"
        ></el-date-picker>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="line" sortable label="线体"></el-table-column>
          <el-table-column prop="dateymd" label="日期" column-key="date"></el-table-column>
          <el-table-column prop="checked" label="核对" column-key="checked"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="showall(scope.row)" type="text" size="small">查看详情</el-button>
              <el-button @click="deleterow(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="showothers">
          <el-card>
            <span>
              <h1>{{options.line}}---{{options.dateymd}}</h1>
            </span>
          </el-card>
          <el-card>
            <p v-for="plan in options.plans" :key="plan.id">
              <b>计划名 : {{plan.name}} --- 开始日期: {{plan.startdateymd}} --- 结束日期:{{plan.enddateymd}}</b>
            </p>
          </el-card>
          <el-card>
            <p>设备/夹具</p>
            <p v-for="c in options.conductor_fixtures" :key="c.name">
              {{c.name}} : {{c.number}} ----- {{c.type}}
              ---调整：
              <el-input-number
                v-model="c.me_number"
                :min="1"
                label="备注"
                size="small"
                style="width:150px"
              ></el-input-number>
            </p>
          </el-card>
          <el-button @click="savechange" type="primary" style="margin-top: 10px">确认</el-button>
        </el-dialog>
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
import axios from "axios";
import { constants } from "crypto";
let host = require("../../serverConfig.js").default.host;
export default {
  name: "fixtureconfiguration",
  data() {
    return {
      fixtureconfigurationForm: {
        model: {},
        selectFields: [],
        scans: []
      },
      authed: false,
      typeofbutton: "primary",
      pickerdate: "",
      tableData: [],
      options: {

      },
      showothers: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      pwdForm: {
        pwd: ""
      }
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
    datehandle(datestring) {
      var date = new Date(datestring);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    choosedate() {
      this.tableData = [];
      let d = this.datehandle(this.pickerdate);
      axios
        .get(`${host}/adjustment/getAdjustmentsByDate?dateymd=${d}`)
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showall(row) {
      this.showothers = true;
      this.options = row;
    },

    deleterow(row) {
      this.$confirm("确定删除此条？")
        .then(() => {
          axios
            .delete(`${host}/adjustment/${row.id}`)
            .then(res => {
              this.choosedate();
              alert("删除成功！");
            })
            .catch(err => {
              console.log(err);
              alert("删除失败!");
            });
        })
        .catch(err => {
          console.log(err);
        });
    },

    savechange() {
      this.options.checked = 1
      axios
        .patch(`${host}/adjustment/${this.options.id}`, this.options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      this.showothers = false;
    }
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