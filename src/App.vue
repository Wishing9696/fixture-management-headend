<template>
  <div id="app">
    <div class="head">
      <strong>HANSONG</strong>
    </div>
    <div class="navi">
      <el-menu
        router
        mode="horizontal"
        default-active="/"
        background-color="#7A7A7A"
        text-color="#FFFFFF"
        active-text-color="#EEC591"
        class="firstmenu"
        style="margin:0 auto;text-align:center"
      >
        <el-submenu index="/me" style="width:120px;height:40px">
          <template slot="title">ME</template>
          <el-menu-item index="/fixtureconfig">夹具配置</el-menu-item>
          <el-menu-item index="/checkplan">计划数量调整确认</el-menu-item>
          <el-menu-item index="/table">报表</el-menu-item>
        </el-submenu>
        <el-submenu index="/npi" style="width:120px;height:40px">
          <template slot="title">NPI</template>
          <el-menu-item index="/projectfixturerequirements">项目夹具需求配置</el-menu-item>
        </el-submenu>
        <el-submenu index="/PC" style="width:120px;height:40px">
          <template slot="title">PC</template>
          <el-menu-item index="/planimport">计划导入</el-menu-item>
        </el-submenu>
        <el-submenu index="/conductor" style="width:120px;height:40px">
          <template slot="title">Conductor</template>
          <el-menu-item index="/PCplanadjustmentverification">PC计划调整核实</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div>
      <router-view/>
    </div>
  </div>
</template>


<script>
export default {
  name: "App"
};
</script>

<style>
.head {
  color: red;
  margin-left: 10px;
  font-size: 40px;
}
.navi {
  background-color:darkgrey;
  height: 60px;
}
.firstmenu {
  width: 480px;
  height: 40px;
}
</style>
