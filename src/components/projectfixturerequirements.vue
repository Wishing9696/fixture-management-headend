<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">项目夹具需求配置</label>
      </div>
      <div v-if="authed">
        <el-form :model="product" ref="product" label-position="left">
          <div class="product-pn" style="margin-top: 10px">
            <span>P/N号 ：</span>
            <el-autocomplete
              class="inline-input"
              v-model="product.pn"
              style="width: 25%"
              clearable
              :fetch-suggestions="querySearch"
              placeholder="请输入P/N号"
              @focus="getallpn"
              @select="handleSelectedpn"
            ></el-autocomplete>
          </div>
          <div class="product-name" style="margin-top: 10px">
            <span>产品名 ：</span>
            <el-input v-model="product.name" placeholder="请输入产品名" style="width: 25%"></el-input>
          </div>
          <div class="product-fixture" style="margin-top: 10px">
            <span>夹具列表：</span>
            <el-table :data="product.fixtures" style="width: 100%">
              <el-table-column prop="name" label="夹具名称"></el-table-column>
              <el-table-column prop="number" label="数量"></el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button @click="deleteRow(scope)" type="text" size="small">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="warning" @click="dialogFormVisible=true">添加夹具</el-button>
            <el-button type="primary" @click="saveall">保存全部</el-button>
            <el-dialog title="新增夹具" :visible.sync="dialogFormVisible" @opened="dialogOpened">
              <el-form :model="form" ref="form" label-position="top">
                <el-form-item label="夹具名称" :label-width="formLabelWidth" prop="fixtureName">
                  <el-autocomplete
                    class="inline-input"
                    v-model="form.name"
                    style="width: 80%"
                    :fetch-suggestions="querySearch2"
                    placeholder="请输入夹具名"
                    @focus="getfixturenames"
                    @select="handleSelectedFixture"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="夹具数量" :label-width="formLabelWidth" prop="number">
                  <el-input-number v-model="form.number" :min="1" style="width:180px"></el-input-number>
                  <el-tag v-model="form.a_amount" style="margin-left:10px">总量：{{form.a_amount}}</el-tag>
                </el-form-item>
                <el-form-item label="夹具类型" :label-width="formLabelWidth" prop="fixtureType">
                  <el-select
                    v-model="form.type"
                    placeholder="夹具类型"
                    style="width:80%"
                    :disabled="true"
                  >
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
          </div>
        </el-form>
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
  name: "projectfixturerequirments",
  data() {
    return {
      product: {
        name: "",
        pn: "",
        fixtures: []
      },
      authed: false,
      typeofbutton: "primary",
      pwdForm: {
        pwd: ""
      },
      input: "",
      isExisted: false,
      fixture_isExisted: false,
      selectvalue: [],
      namesOptions: [],
      fixturesOptions: [],
      dialogFormVisible: false,
      form: {
        name: "",
        number: 0,
        a_amount: "",
        type: ""
      },

      formLabelWidth: "100px"
    };
  },
  methods: {
    auth() {
      if (this.pwdForm.pwd === "hsnpi2") {
        this.authed = true;
      } else {
        this.typeofbutton = "danger";
      }
    },
    getallpn() {
      this.namesOptions = [];
      this.product = { name: "", pn: "", fixtures: [] };
      axios
        .get(`${host}/product`)
        .then(res => {
          for (let i in res.data) {
            this.namesOptions.push({
              value: res.data[i].pn,
              label: res.data[i].pn,
              id: res.data[i].id
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async handleSelectedpn(item) {
      this.product = { name: "", pn: "", fixtures: [] };
      await axios
        .get(`${host}/product/getConfigById?id=${item.id}`)
        .then(res => {
          this.product = res.data[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    querySearch(queryString, cb) {
      var names = this.namesOptions;
      var results = queryString
        ? names.filter(this.createFilter(queryString))
        : names;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return name => {
        return (
          name.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    getfixturenames() {
      this.fixturesOptions = [];
      axios
        .get(`${host}/fixture`)
        .then(res => {
          for (let i in res.data) {
            this.fixturesOptions.push({
              value: res.data[i].name,
              label: res.data[i].name,
              id: res.data[i].id
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    querySearch2(queryString, cb) {
      var fixtures = this.fixturesOptions;
      var results = queryString
        ? fixtures.filter(this.createFilter2(queryString))
        : fixtures;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter2(queryString) {
      return fixture => {
        return (
          fixture.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    async handleSelectedFixture(item) {
      await axios
        .get(`${host}/fixture?id=${item.id}`)
        .then(res => {
          this.form = res.data[0];
        })
        .catch(err => {
          console.log(err);
        });
    },
    dialogOpened(e) {
      this.$refs["form"].resetFields();
    },
    addokbutton() {
      let data = {};
      Object.assign(data, this.form);
      console.log(data);
      this.product.fixtures.push(data);

      this.dialogFormVisible = false;
    },
    addcancelbutton() {
      this.dialogFormVisible = false;
    },
    deleteRow(row) {
      this.product.fixtures.splice(row.$index, 1);
    },
    saveall() {
      try {
        if (this.product.pn === "") {
          alert("请完善表格");
          throw "pn empty!";
        }
        let fs = [];
        for (let f of this.product.fixtures) {
          fs.push({
            id: f.id,
            number: f.number
          });
        }
        let p = {
          pn: this.product.pn,
          name: this.product.name,
          fixtures: fs
        };
        if (this.product.id === undefined) {
          axios
            .post(`${host}/product`, p)
            .then(res => {
              alert("上传成功，请刷新页面");
              // this.$router.replace("/refresh");
            })
            .catch(err => {
              alert("上传失败，请刷新页面后重试");
              throw err;
            });
        } else {
          axios
            .patch(`${host}/product/${this.product.id}`, p)
            .then(res => {
              alert("上传成功，请刷新页面");
              // this.$router.replace("/refresh");
            })
            .catch(err => {
              alert("上传失败，请刷新页面后重试");
              throw err;
            });
        }
      } catch (err) {
        alert(err);
      }
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