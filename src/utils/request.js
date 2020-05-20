import Vue from 'vue'
import axios from 'axios'

// 设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
//允许携带axios
axios.defaults.withCredentials = true

//把axios挂载在Vue上
Vue.prototype.$axios = axios