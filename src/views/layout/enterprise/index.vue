<template>
  <div>
    <el-card class="searchBox">
      <el-form :inline="true" :model="searchForm" ref="searchForm" label-width="80px">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model.trim="searchForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model.trim="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model.trim="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <el-button type="primary" @click="add">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="enterpriseList" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="auto"></el-table-column>
        <el-table-column prop="eid" label="企业编号" width="auto"></el-table-column>
        <el-table-column prop="name" label="企业名称" width="auto"></el-table-column>
        <el-table-column prop="username" label="创建者" width="auto"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" width="auto"></el-table-column>
        <el-table-column label="状态" width="auto">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:red">禁用</span>
            <span v-if="scope.row.status == 1" style="color:#6ac144">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="auto">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id,scope.row.status)"
              :type="scope.row.status == 1?'info': 'success'"
            >{{scope.row.status == 1 ? "禁用":"启用"}}</el-button>
            <el-button type="danger" @click="remove(scope.row.id,scope.row.name)">删除</el-button>
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
    <addOrEdit ref="addOrEdit"></addOrEdit>
  </div>
</template>

<script>
import addOrEdit from "./enterprise-add-or-edit";
export default {
  name: "Enterprise",
  components: {
    addOrEdit
  },
  data() {
    return {
      searchForm: {
        eid: "", //企业名称
        name: "", //企业id
        username: "", //用户名
        status: "" //状态
      },
      page: 1, //页码
      limit: 2, //一页显示多少个
      enterpriseList: [], //企业数据
      total: 0 //总条数
    };
  },
  methods: {
    //搜索
    async getEnterpriseList() {
      const res = await this.$axios({
        method: "get",
        url: "/enterprise/list",
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    search() {
      this.page = 1;
      this.getEnterpriseList();
    },
    //清除
    clear() {
      this.$refs.searchForm.resetFields();
      this.search();
    },
    //改变企业状态
    async changeStatus(id, status) {
      const res = await this.$axios({
        method: "post",
        url: "/enterprise/status",
        data: {
          id
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        status == 0
          ? this.$message.success("启用企业账户成功")
          : this.$message.warning("企业账户已被禁用");
        this.search();
      }
    },
    remove(id, name) {
      this.$confirm(`是否删除企业账号 ${name}?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios({
            method: "post",
            url: "/enterprise/remove",
            data: { id }
          });
          // console.log(res);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search(); //刷新页面
          }
        })
        .catch(() => {});
    },
    //分页条数发生改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getEnterpriseList();
    },
    //分页当前页码发生改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getEnterpriseList();
    },
    add() {
      this.$refs.addOrEdit.mode = "add";
      this.$refs.addOrEdit.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrEdit.$refs.addForm.resetFields();
      });
    },
    edit(info) {
      this.$refs.addOrEdit.mode = "edit";
      this.$refs.addOrEdit.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrEdit.addForm = { ...info };
      });
    }
  },
  created() {
    this.getEnterpriseList();
  }
};
</script>

<style>
.searchBox {
  margin-bottom: 25px;
}
</style>