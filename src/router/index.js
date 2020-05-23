import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Login from "@/views/login";
import Layout from "@/views/layout";
//获得token函数
import { getToken } from "@/utils/token"

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/layout", component: Layout },
  ],
});
//全局导航守卫
router.beforeEach((to, form, next) => {

  if (to.fullPath == "/login") {
    next()
  } else {
    const token = getToken()
    if (token) {
      next()
    } else {
      alert('请先登录!');
      next("/login")
    }
      
  }
})

export default router;
