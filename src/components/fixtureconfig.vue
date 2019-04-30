
<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">夹具配置</label>
      </div>
      <div v-if="authed">
        <el-button type="primary" @click="addnew">新增夹具</el-button>
        <p>
          <el-input v-model="name" placeholder="输入夹具名称以查询夹具" style="width:300px"></el-input>
          <el-button type="primary" @click="search" style="margin-left:10px">查找</el-button>
        </p>
        <el-table :data="tabledata">
          <el-table-column label="name" prop="name" sortable></el-table-column>
          <el-table-column label="库存" prop="a_amount"></el-table-column>
          <el-table-column label="异常" prop="u_amount"></el-table-column>
          <el-table-column label="类型" prop="type" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 30px;">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="current_change"
          ></el-pagination>
        </div>
        <el-dialog :title="formtitle" :visible.sync="addnewfixture">
          <el-form :model="form" ref="form" label-position="top">
            <el-form-item label="夹具名称" :label-width="formLabelWidth" prop="fixtureName">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="夹具库存数量（不包括异常夹具）" :label-width="formLabelWidth" prop="a_amount">
              <el-input-number v-model="form.a_amount" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="夹具异常数量）" :label-width="formLabelWidth" prop="u_amount">
              <el-input-number v-model="form.u_amount" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="夹具类型" :label-width="formLabelWidth" prop="type">
              <el-select v-model="form.type" placeholder="请选择夹具类型">
                <el-option label="设备" value="设备"></el-option>
                <el-option label="耗材" value="耗材"></el-option>
                <el-option label="夹具" value="夹具"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" @click="addokbutton">完成</el-button>
              <el-button type="primary" @click="addcancelbutton">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <div v-else>
        <el-form :model="pwdForm" label-position="left" label-width="80px" @submit.native.prevent>
          <el-form-item label="认证密码">
            <el-input
              v-model="pwdForm.pwd"
              maxlength="20"
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
      name: "",
      total: 0,
      tabledata: [],
      formtitle: "",
      addnewfixture: false,
      formLabelWidth: "300px",
      form: { name: "", a_amount: 0, u_amount: 0, type: "" }
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
    current_change: function(currentPage) {
      this.currentPage = currentPage;
    },
    search() {
      axios.get(`${host}/fixture?name=${this.name}`).then(res => {
        this.tabledata = res.data;
      });
    },
    addnew() {
      this.addnewfixture = true;
      this.formtitle = "新增夹具";
    },
    async addokbutton() {
      if (
        this.form.name === "" ||
        this.form.a_amount === 0 ||
        this.form.type === ""
      ) {
        alert("请完整填写此表！");
        return;
      }
      if (this.formtitle === "新增夹具") {
        let data = {};
        Object.assign(data, this.form);
        await axios
          .post(`${host}/fixture`, data)
          .then(res => {
            this.initfixtures();
            this.addnewfixture = false;
            alert("上传成功");
            this.form = {name: "", a_amount: 0, u_amount: 0, type: ""};
          })
          .catch(err => {
            alert("上传错误！");
          });
      } else {
        await axios
          .patch(`${host}/fixture/${this.form.id}`, this.form)
          .then(res => {
            this.initfixtures();
            alert("上传成功");
            this.addnewfixture = false;
            this.form = {name: "", a_amount: 0, u_amount: 0, type: ""};
          })
          .catch(err => {
            console.log(err);
            alert("上传错误！");
          });
      }
    },
    addcancelbutton() {
      this.addnewfixture = false;
    },
    handleEdit(index, row) {
      this.addnewfixture = true;
      this.formtitle = "编辑 " + row.name;
      this.form = row;
    },
    handleDelete(index, row) {
      this.$confirm("确定删除此条？")
        .then(() => {
          axios
            .delete(`${host}/fixture/${row.id}`)
            .then(res => {
              this.initfixtures();
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
    initfixtures() {
      axios.get(`${host}/fixture`).then(res => {
        this.tabledata = res.data;
      });
    }
  },
  mounted() {
    this.initfixtures();
  }
};
</script>

<style>
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