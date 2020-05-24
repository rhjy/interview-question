<template>
  <div class="user">
    <el-card class="box-card">
      <!-- :inline="true" 可以让表单域变为行内的表单域-->
      <el-form :inline="true" :model="searchForm" ref="searchForm" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role_id" placeholder="请选择">
            <el-option key="1" label="超级管理员" value="1"></el-option>
            <el-option key="2" label="管理员" value="2"></el-option>
            <el-option key="3" label="老师" value="3"></el-option>
            <el-option key="4" label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default">清除</el-button>
          <el-button type="primary">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card></el-card>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      searchForm: {
        username: "", //昵称
        email: "", //邮箱
        role_id: "" //角色数字
      }
    };
  },
  methods: {
    search() {}
  }
};
</script>

<style lang="less">
.user{
  .box-card {
    margin-bottom: 20px;
  }
}
</style>