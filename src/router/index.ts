import { createRouter, createWebHistory } from "vue-router";

// 开启历史模式
const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "",
    }
  ]
});

export default router;
