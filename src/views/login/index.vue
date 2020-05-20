<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <el-form :model="loginForm" class="login-form" ref="loginFormRef" :rules="rules">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="22">
            <el-col :span="16">
              <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="codeURL" @click="getCode" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCheck"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button @click="loginClick" style="width:100%" size="medium" type="primary">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" size="medium" type="primary" @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
    <!-- 注册页面 -->
    <register ref="register"></register>
  </div>
</template>

<script>
//保存token
import {setToken} from "@/utils/token"
//调用子组件
import register from "./register"
export default {
  name: "Login",
  components:{
    register
  },
  data() {
    return {
      codeURL: process.env.VUE_APP_BASEURL + "/captcha?type=login", //验证码地址
      loginForm: {
        phone: "18511111111", //手机号
        password: "12345678", //密码
        code: "", //验证码
        isCheck: false //是否同意
      },
      rules: {
        phone: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入是手机号");
                return;
              }
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                callback("请输入正确的手机号码");
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
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "长度必须为4位", trigger: "blur" }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback("是否同意用户协议和隐私条款");
                return;
              }
              callback(); //一定要写成功的callback,不然提交时valid验证返回不了true
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getCode() {
      this.codeURL =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=login&num=" +
        (new Date() - 0); //重新获取验证码,注意要加上随机数避免浏览器不发送请求
    },
    loginClick() {
      // this.$refs.loginFormRef.validate((valid)=> {
      //   if (valid) {
      //     this.$axios({
      //       method: "post",
      //       url: "/login", //登陆地址
      //       data: this.loginForm
      //     }).then(res => {
      //       // console.log(res);
      //       if(res.data.code == 200){
      //           this.$message.success('登陆成功')
      //       }else{
      //           this.$message.error(res.data.message);
      //           this.getCode() //重新获取验证码
      //       }
      //     });
      //   }
      // });

      // async异步做法(async和await搭配使用)
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const res =await this.$axios({
          method: "post",
          url: "/login", //登陆地址
          data: this.loginForm
        });
        console.log(res);
        
        if (res.data.code == 200) {
          // 提醒
          this.$message.success("登陆成功");
          //保存token
          setToken(res.data.data.token)
        } else {
          this.$message.error(res.data.message);
          this.getCode(); //重新获取验证码
        }
      });
    },
    register(){
      this.$refs.register.dialogVisible = true
    }
  },
  created() {
    // console.log("开发阶段", process.env.VUE_APP_BASEURL);
  }
};
</script>

<style>
</style>