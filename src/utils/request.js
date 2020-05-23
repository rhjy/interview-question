import Vue from 'vue'
import axios from 'axios'
import { getToken } from "./token"
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

//把axios挂载在Vue上
Vue.prototype.$axios = axios