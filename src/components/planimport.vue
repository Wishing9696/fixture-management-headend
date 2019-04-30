<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">计划导入</label>
      </div>
      <div v-if="authed">
        <el-card shadow="always">
          <input
            type="file"
            id="inputexcel"
            ref="filElem"
            name="inputexcel"
            style="display:none"
            @change="getfile"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
          <el-button size="small" :type="typeoffilebutton" @click="choosefile">点击上传Excel文件</el-button>
          <el-button type="primary" style="margin-left: 80px" @click="uploadfile">确定上传</el-button>
          <el-tag type="info" size="medium" :style="tagstyle">{{filename}}</el-tag>
          <el-table :data="tabledata" style="width: 100%">
            <el-table-column label="SD号" prop="sd"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="pn" prop="pn"></el-table-column>
            <el-table-column label="开始日期" prop="startdate"></el-table-column>
            <el-table-column label="结束日期" prop="enddate"></el-table-column>
            <el-table-column label="线体" prop="line"></el-table-column>
          </el-table>
        </el-card>
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
      fixtureconfigurationForm: {
        model: {},
        selectFields: [],
        scans: []
      },
      authed: false,
      typeofbutton: "primary",
      typeoffilebutton: "primary",
      pwdForm: {
        pwd: ""
      },
      filename: "",
      tagstyle: "display:none",
      tabledata: []
    };
  },
  methods: {
    auth() {
      if (this.pwdForm.pwd === "hspc3") {
        this.authed = true;
      } else {
        this.typeofbutton = "danger";
      }
    },
    choosefile() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
      this.typeoffilebutton = "success";
    },
    getfile(e) {
      this.filename = this.$refs.filElem.files[0].name;
      this.tagstyle = "display:inline";
      this.handlestyle = "display:inline";

      const files = e.target.files;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          let dt = [];
          for (let w in ws) {
            let exist = 0;
            for (let i in ws[w]) {
              if (
                i === "SD号" ||
                i === "pn" ||
                i === "名称" ||
                i === "开始日期" ||
                i === "结束日期" ||
                i === "线体"
              ) {
                exist++;
              }
            }
            if (exist != 6) {
              alert("上传失败，请检查文件指定项是否存在。");
              throw "uploadfailed!";
            }
            dt.push({
              sd: ws[w].SD号,
              pn: ws[w].pn,
              name:ws[w].名称,
              startdate:
                ws[w].开始日期 * 24 * 60 * 60 * 1000 + Date.parse("1899-12-30"),
              enddate:
                ws[w].结束日期 * 24 * 60 * 60 * 1000 + Date.parse("1899-12-30"),
              line: ws[w].线体
            });
          }
          this.tabledata = dt;
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    async uploadfile() {
      let plans = this.tabledata;

      try {
        for (let p of plans) {
          await axios.post(`${host}/plan`, p);
        }

        alert("upload success");
      } catch (e) {
        alert("fail");
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
</style>