<template>
  <el-container class="layout">
    <!-- 顶部栏 -->
    <el-header class="header">
      <div class="left">
        <i class="el-icon-s-fold setheight" @click="isCollapse = !isCollapse"></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">{{username}} 欢迎你</span>
        <el-button type="primary" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 左边导航部分 -->
      <el-aside style="width: auto;">
        <!-- :router="true"开启嵌套路由  index="/layout/chart"设置二级路由地址-->
        <el-menu
          :router="true"
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
        >
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>
          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右面主体部分 -->
      <el-main>
        <!-- 嵌套路由 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token";
export default {
  data() {
    return {
      isCollapse: false, //menu是否展开
      username: "", //用户名字
      avatar: "", //用户头像
      defaultActive: "" //当前路由值
    };
  },
  methods: {
    async getUserInfo() {
      const res = await this.$axios({
        method: "get",
        url: "/info"
        // headers: {
        //   token: getToken()
        // }
        //已经在请求拦截器设置请求头带上token
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.username = res.data.data.username;
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
      }
    },
    logout() {
      this.$confirm("确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //发送退出请求
          const res = await this.$axios({
            method: "get",
            url: "/logout"
          });
          console.log(res);
          if (res.data.code == 200) {
            removeToken(); //删除token
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  },
  created() {
    this.defaultActive = this.$route.fullPath;
    this.getUserInfo();
  }
};
</script>

<style lang='less'>
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        columns: #49a1ff;
      }
      .setheight {
        font-size: 20px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-main {
    background-color: #e8e9ec;
  }
  .el-menu {
    border-right: 0px solid #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>