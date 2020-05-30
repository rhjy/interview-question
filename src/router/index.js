import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//路由地址
import Login from "@/views/login";
import Layout from "@/views/layout";
//layout下面的二级页面
import Chart from "@/views/layout/chart"
import User from "@/views/layout/user"
import Enterprise from "@/views/layout/enterprise"
import Question from "@/views/layout/question"
import Subject from "@/views/layout/subject"
import Welcome from "@/views/layout/welcome"

import Child1 from "../test/parent-child/child1.vue"
import Child2 from "../test/parent-child/child2.vue"
import Parent from "../test/parent-child/parent.vue"

//获得token函数
import { getToken } from "@/utils/token"

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/parent", component: Parent, children: [
        { path: 'child1', component: Child1 },
        { path: 'child2', component: Child2 },
      ]
    },
    {
      path: "/layout", component: Layout, children: [
        { path: 'chart', component: Chart }, //嵌套路由不用加/
        { path: 'user', component: User },
        { path: 'enterprise', component: Enterprise },
        { path: 'question', component: Question },
        { path: 'subject', component: Subject },
        { path: 'welcome', component: Welcome },
      ]
    },
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
