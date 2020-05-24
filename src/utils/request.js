import Vue from 'vue'
import axios from 'axios'
import { getToken, removeToken } from "./token"
import router from "@/router/index"
// 设置基础路径 
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
//允许携带axios
axios.defaults.withCredentials = true

// http request 请求拦截器
axios.interceptors.request.use((config) => {
    // console.log(config);
    const token = getToken()
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.token = token  //请求头加上token//config.headers.token的token名取决于后端取名
    }
    return config
}, (err) => {
    return Promise.reject(err)
})

//响应拦截器
axios.interceptors.response.use((response) => {
    if (response.data.code == 206) {//token过期
        //提示
        alert('登录已过期,请重新登录');
        //删除token
        removeToken();
        //跳回登陆页
        //不能使用 this.$router.push('/login');
        //而是应该导入router然后使用
        router.push('/login')
        //阻止继续执行
        return;
    }
    return response;
}, (err) => {
    return Promise.reject(err)
})

//把axios挂载在Vue上
Vue.prototype.$axios = axios