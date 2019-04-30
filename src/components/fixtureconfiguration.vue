<template>
  <div class="product-config">
    <el-card shadow="always">
      <div slot="header">
        <label style="display: block; font-size: 30px;">夹具配置</label>
      </div>
      <div v-if="authed">
        <el-form
          :model="fixtureconfigurationForm"
          ref="fixtureconfiguration"
          label-position="lefts"
        >
          <div class="block">
            <span class="configurationoption">请选择配置项：</span>
            <el-cascader
              :options="options"
              :show-all-levels="false"
              @change="optionchanged"
            ></el-cascader>
          </div>
        </el-form>        
        <router-view></router-view>
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
export default {
  name: "fixtureconfiguration",
  data() {
    return {
      fixtureconfigurationForm: {
        // model: {},
        // selectFields: [],
        // scans: []
      },
      authed: false,
      lendorreturnstate: false,
      repairorscrapstate: false,
      batchimportstate: false,
      singleimportstate: false,
      stockinquirystate: false,
      typeofbutton: "primary",
      pwdForm: {
        pwd: ""
      },
      options: [
        {
          value: "fixtureimport",
          label: "导入夹具",
        },
        {
          value: "stockinquiry",
          label: "库存查询"
        },
        {
          value: "unavailablefixture",
          label: "异常夹具"
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
    optionchanged(e) {
      let path = e[0];
      this.$router.push(`/fixtureconfiguration/${path}`)
    }
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