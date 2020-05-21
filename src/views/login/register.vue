<template>
  <div class="register">
    <el-dialog :visible.sync="dialogVisible" width="600px" @close="dialogVisible = false">
      <div slot="title" class="title">用户注册</div>
      <el-form :model="registerForm" ref="registerForm" :rules="rules" label-width="16%">
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            name="image"
            class="avatar-uploader"
            :action="uploadAction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称" prop="username">
          <el-input v-model.trim="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.trim="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="registerForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="图形码" prop="code">
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model.trim="registerForm.code"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="getCode" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="registerForm.rcode"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button @click="getRcode">获取用户验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      imageUrl: "", //用户头像
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads", //注册时上传用户头像
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms", //获取图形验证码
      dialogVisible: false,
      registerForm: {
        avatar: "", //头像地址
        username: "", //用户名
        email: "", //邮箱
        phone: "13802987741", //手机号
        password: "", //密码
        code: "",
        rcode: "" //验证码
      },
      rules: {
        avatar: [{ required: true, message: "头像为空", trigger: "blur" }],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { max: "6" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
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
                callback(new Error("请输入手机号"));
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
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码最小6位,最大16位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入图形码", trigger: "blur" },
          { min: 4, max: 4, message: "图形码必须为4位", trigger: "blur" }
        ],
        rcode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码必须为4位", trigger: "blur" },
          // { type: "number", message: "验证码必须为数字", trigger: "blur" }//配合v-model.number使用,不然一般输入数字都变成字符串
        ]
      }
    };
  },
  methods: {
    //获取图形码
    getCode() {
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&num=" +
        (new Date() - 0); //重新获取图形验证码
    },
    //获取验证码
    //promise方式发送请求
    // getRcode() {
    //   this.$axios({
    //     method: "post",
    //     url: "/sendsms",
    //     data: {
    //       code: this.registerForm.code,
    //       phone: this.registerForm.phone
    //     }
    //   }).then(res => {
    //     console.log(res);
    //     if(res.data.code == 200){
    //       this.registerForm.rcode = res.data.data.captcha
    //       this.$message.success("获取验证码成功")
    //     }else{
    //       this.$message.error(res.data.message)
    //     }
    //     this.getCode()//重新获取图形验证码
    //   });
    // }

    // async/await方式发送请求//获取验证码
    async getRcode() {
      const res = await this.$axios({
        method: "post",
        url: "/sendsms",
        data: {
          code: this.registerForm.code,
          phone: this.registerForm.phone
        }
      });

      if (res.data.code == 200) {
        this.registerForm.rcode = res.data.data.captcha.toString(); //返回的是数值,转成字符串类型
        this.$message.success("获取验证码成功");
      } else {
        this.$message.error(res.data.message);
      }

      this.getCode(); //重新获取图形验证码
    },
    //上传成功过后调用的函数
    handleAvatarSuccess(res) {
      console.log(res);
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerForm.avatar = res.data.file_path;
    },
    //上传前的函数
    beforeAvatarUpload(file) {
      const isimage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isimage) {
        this.$message.error("上传头像图片只能是 JPG,PNG,GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isimage && isLt2M;
    },
    //注册
    submit() {
      this.$refs.registerForm.validate(async valid => {
        if (!valid) {
          return;
        }
        const res = await this.$axios({
          method: "post",
          url: "/register",
          data: this.registerForm
        });
        console.log(res);
        if (res.data.code == 200) {
          //弹出消息
          this.$message.success("注册成功");
          //关掉注册页面
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.register {
  .title {
    height: 53px;
    background: #03c0f9;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-left: 100px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-dialog__footer {
    text-align: center;
  }
}
</style>