<template>
  <el-dialog
    center
    :visible.sync="dialogVisible"
    class="addUserList"
    width="600px"
    @close=" dialogVisible = false"
  >
    <div slot="title" class="title">{{mode == "add" ? "新增用户":"编辑用户" }}</div>
    <el-form :model="addForm" ref="addForm" label-width="80px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="addForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="addForm.role_id" placeholder="请选择">
          <el-option label="超级管理员" value="1"></el-option>
          <el-option label="管理员" value="2"></el-option>
          <el-option label="老师" value="3"></el-option>
          <el-option label="学生" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="addForm.status" placeholder="请选择状态">
          <el-option label="禁用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注">
        <el-input v-model="addForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer">
      <el-button @click=" dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      mode: "", //模式,add代表新增 edit代表修改
      id: "",
      addForm: {
        username: "",
        email: "",
        phone: "",
        role_id: "",
        status: "",
        remark: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { max: "6" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("手机号不能为空"));
                return;
              }
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                callback(new Error("请输入正确的手机号码"));
                return;
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        role_id: [
          { required: true, message: "角色不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // //编辑用户前获取用户信息
    // async getUserInfo() {
    //   const res = await this.$axios({
    //     method: "get",
    //     url:'/info'
    //   });
    //   console.log(res);
    // },

    submit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return;
        }
        let res = null;
        //判断是新增还是编辑
        if (this.mode == "add") {
          //新增
          res = await this.$axios({
            method: "post",
            url: "/user/add",
            data: this.addForm
          });
          console.log(res);
        } else {
          //编辑
        }
        if (res.data.code == 200) {
            //提示
          this.$message.success(this.mode == "add" ? "新增成功" : "修改成功");
          //关闭弹窗
          this.dialogVisible = false;
          //刷新父组件页面数据
          this.$parent.search()
        }else{
            this.$message.error(res.data.message)
        }
      });
    }
  },
  created() {
    if (this.mode == "edit") {
      this.getUserInfo();
    }
  }
};
</script>

<style lang="less">
.addUserList {
  .el-dialog__header {
    padding: 0;
    .title {
      text-align: center;
      background-color: #0e9cfa;
      color: #fff;
      height: 53px;
      line-height: 53px;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
}
</style>