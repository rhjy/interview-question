<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i class="el-icon-s-fold setheight"></i>
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
      <el-aside>
        <!-- Aside content -->
        左边导航
      </el-aside>

      <el-main>
        <!-- Main content -->
        主体
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token";
export default {
  data() {
    return {
      username: "",
      avatar: ""
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
  .el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
}
</style>