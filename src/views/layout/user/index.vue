<template>
  <div class="user">
    <el-card class="box-card">
      <!-- :inline="true" 可以让表单域变为行内的表单域-->
      <el-form :inline="true" :model="searchForm" ref="searchForm" label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model.trim="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model.trim="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="searchForm.role_id" placeholder="请选择">
            <el-option key="1" label="超级管理员" value="1"></el-option>
            <el-option key="2" label="管理员" value="2"></el-option>
            <el-option key="3" label="老师" value="3"></el-option>
            <el-option key="4" label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="clear">清除</el-button>
          <el-button type="primary" @click="addUser">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table empty-text :data="userList" style="width: 100%">
        <el-table-column type="index" label="序号" width="auto"></el-table-column>
        <el-table-column prop="username" label="用户名" width="auto"></el-table-column>
        <el-table-column prop="phone" label="电话" width="auto"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="auto"></el-table-column>
        <el-table-column prop="role" label="角色" width="auto"></el-table-column>
        <el-table-column prop="remark" label="备注" width="auto"></el-table-column>
        <el-table-column label="状态" width="auto">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color:red">禁用</span>
            <span v-if="scope.row.status==1" style="color:#6ac144">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id,scope.row.status)"
              :type="scope.row.status==0?'success':'info'"
            >{{scope.row.status==0?"启用":"禁用"}}</el-button>
            <el-button type="danger" @click="deleteUser(scope.row.id,scope.row.username)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:25px;text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <userAddOrUpdata ref="userAddOrUpdata"></userAddOrUpdata>
  </div>
</template>

<script>
import userAddOrUpdata from "./user-add-or-updata";
export default {
  name: "user",
  components: {
    userAddOrUpdata
  },
  data() {
    return {
      searchForm: {
        username: "", //昵称
        email: "", //邮箱
        role_id: "" //角色数字
      },
      page: 1, //查询时候的页码
      limit: 2, //查询的条数
      userList: [], //展示用的数据
      total: 0 //分页用的总条数
    };
  },
  methods: {
    async getUserList() {
      const res = await this.$axios({
        method: "get",
        url: "/user/list",
        params: {
          // username:this.searchForm.username,
          // email:this.searchForm.email,
          // role_id:this.searchForm.role_id,
          //以上代码可以用展开运算符
          ...this.searchForm,
          page: this.page,
          limit: this.limit
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.userList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    //搜索
    search() {
      this.page = 1; //搜索前要把页码返回第一页
      this.getUserList();
    },
    //清除
    clear() {
      // this.searchForm.username = '',
      // this.searchForm.email = '',
      // this.searchForm.role_id = '',
      // Element提供的重置表单方法,注意每个表单项el-from-item要绑定prop属性
      this.$refs.searchForm.resetFields();
      this.search();
    },
    //改变用户状态
    async changeStatus(id, status) {
      const res = await this.$axios({
        method: "post",
        url: "/user/status",
        data: {
          id
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        status == 0
          ? this.$message.success("启用账户成功")
          : this.$message.warning("账户已被禁用");
        this.search();
      }
    },
    //删除
    deleteUser(id, username) {
      this.$confirm(`是否删除账号: ${username} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/user/remove",
            data: { id }
          });
          // console.log(res);
          if (res.data.code == 200) {
            this.$message.success(`账号:${username}已被删除!`);
            this.search();
          }
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    //分页条数发生改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getUserList();
    },
    //分页当前页码发生改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getUserList();
    },
    //新增用户
    addUser() {
      //把user-add-or-updata子组件的dialogVisible的值改为true就可以显示出增加组件
      this.$refs.userAddOrUpdata.dialogVisible = true;
      this.$refs.userAddOrUpdata.mode = "add";
      this.$nextTick(() => {
        this.$refs.userAddOrUpdata.$refs.addForm.resetFields(); //打开表单前清空表单
      });
    },
    //编辑用户
    editUser(info) {
      //把user-add-or-updata子组件的dialogVisible的值改为true就可以显示出增加组件
      this.$refs.userAddOrUpdata.dialogVisible = true;
      this.$refs.userAddOrUpdata.mode = "edit";
      // this.$refs.userAddOrUpdata.userinfo =JSON.parse(JSON.stringify(info));//直接对象展开赋值//深拷贝(重新创建一个数据)
      // this.$refs.userAddOrUpdata.userinfo ={...info};//直接对象展开赋值//深拷贝一层(重新创建一个数据)
      // this.$refs.userAddOrUpdata.userinfo =info;//直接对象展开赋值//浅拷贝(只是把地址赋值)
      this.$nextTick(() => {
        this.$refs.userAddOrUpdata.$refs.addForm.resetFields(); //打开表单前清空表单
        this.$refs.userAddOrUpdata.addForm = { ...info };
      });
      // console.log(info);
    }
  },
  created() {
    this.getUserList();
  }
};
</script>

<style lang="less">
.user {
  .box-card {
    margin-bottom: 20px;
  }
}
</style>