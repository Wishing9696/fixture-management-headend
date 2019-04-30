<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">PC计划调整核实</label>
      </div>
      <div v-if="authed">
        <el-date-picker
          v-model="pickerdate"
          align="right"
          type="datetime"
          placeholder="请选择需要配置的日期"
          :picker-options="pickerOptions"
          @change="choosedate"
        ></el-date-picker>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="changeFun"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="计划"></el-table-column>
          <el-table-column prop="sd" label="sd"></el-table-column>
          <el-table-column prop="line" sortable label="线体"></el-table-column>
          <el-table-column prop="pn" label="pn"></el-table-column>
          <el-table-column prop="startdt" sortable label="开始日期" column-key="date"></el-table-column>
          <el-table-column prop="enddt" label="结束日期" column-key="date"></el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 10px" @click="adjustplans">配置选中项</el-button>
        <el-dialog title="计划调整" :visible.sync="planadjust">
          <el-form :model="adjust">
            <el-card>
              <span>
                <h1>{{adjust.line}}</h1>
                <h4>日期：{{adjust.dateymd}}</h4>
              </span>
              <span v-for="p in adjust.plans" :key="p.id">
                <span>
                  <h3>计划：{{p.name}}</h3>
                </span>
                <p>开始日期：{{p.startdateymd}} --- 结束日期：{{p.startdateymd}}</p>
                <el-table :data="p.fixtures">
                  <el-table-column prop="name" label="夹具名称"></el-table-column>
                  <el-table-column prop="number" label="夹具数量"></el-table-column>
                  <el-table-column prop="type" label="夹具类型"></el-table-column>
                </el-table>
              </span>
            </el-card>
            <el-card>
              <span>
                <h2>设备-夹具</h2>
              </span>
              <b>
                <el-table :data="adjust.count">
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="number" label="数量"></el-table-column>
                  <el-table-column prop="type" label="夹具类型"></el-table-column>
                  <el-table-column prop="datail" fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="editrow(scope)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </b>
              <el-dialog title="修改数量" append-to-body :visible.sync="editdialog">
                <el-form :model="editdialogform">
                  <el-form-item label="夹具数量">
                    <el-input-number v-model="editdialogform.number"></el-input-number>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="saveedit">确认</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
              <el-button type="primary" style="margin-top: 10px" @click="savecount">确认线体所需夹具总数</el-button>
            </el-card>
          </el-form>
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
      result: [],
      tableData: [],
      multipleSelection: [],
      planadjust: false,
      adjust: {
        line: "",
        date: "",
        plans: ""
      },
      pickerdate: "",
      line: {},
      editdialog: false,
      editdialogform: {
        number: 0
      },
      row: [],
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
      }
    };
  },
  methods: {
    auth() {
      if (this.pwdForm.pwd === "hsconductor4") {
        this.authed = true;
      } else {
        this.typeofbutton = "danger";
      }
    },
    async choosedate() {
      this.tableData = [];
      //gettabledata
      await axios
        .get(`${host}/plan/getPlansByDate?date=${this.pickerdate.getTime()}`)
        .then(res => {
          this.result = res.data;
        })
        .catch(err => {
          console.log(err);
        });
      for (let r of this.result) {
        let startdate = this.datehandle(r.startdate);
        let enddate = this.datehandle(r.enddate);
        this.tableData.push({
          id: r.id,
          sd: r.sd,
          name: r.name,
          line: r.line,
          pn: r.pn,
          startdate: r.startdate,
          enddate: r.enddate,
          startdt: startdate,
          enddt: enddate,
          fixtures: r.fixtures
        });
      }
    },
    datehandle(datestring) {
      var date = new Date(parseInt(datestring));
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    async adjustplans() {
      let a = this.multipleSelection[0].line;
      for (let m of this.multipleSelection) {
        if (a !== m.line) {
          alert("请选择同一条线体进行配置！");
          throw "multi lines!!";
        }
      }
      this.planadjust = true;
      let pis = [];
      for (let m of this.multipleSelection) {
        pis.push({ id: m.id });
      }
      console.log(pis)
      await axios
        .post(
          `${host}/plan/getPlansDetailsByIds?date=${this.pickerdate.getTime()}`,
          pis
        )
        .then(res => {
          this.adjust = res.data;
        })
        .catch(err => {
          console.log(err);
        });

    },
    changeFun(val) {
      this.multipleSelection = val;
    },
    editrow(row) {
      this.editdialog = true;
      this.editdialogform.number = row.row.number;
      this.row = row;
    },
    saveedit(row) {
      this.row.row.number = this.editdialogform.number;
      this.editdialog = false;
    },
    async savecount() {
        let adjs = {
        line:this.adjust.line,
        date:this.adjust.date,
        dateymd:this.adjust.dateymd,
        plans:this.adjust.plans,
        conductor_fixtures: this.adjust.count
      }
      await axios
        .post(`${host}/adjustment`, adjs)
        .then(res => {
          alert("upload success!")
        })
        .catch(err => {
          console.log(err);
          alert("upload failed!")
        });

      this.planadjust = false;
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
.el-dialog__title {
  font-size: 30px
}
.product-config .pwd {
  width: 15%;
  min-width: 200px;
}
.planconfig {
  margin-top: 2%;
}
#pwd-button {
  margin-left: 20px;
}
</style>