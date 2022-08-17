import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },

  {
    path: "/home",
    name: "Home",
    meta: {
      title: "Home",
      isAuthRequired: true,
      // hiddenInMenu: true
    },
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },

  {
    path: "/plotting",
    name: "plotting",
    component: () =>
      import(/*webpackChunkName */ "../views/plotting/Plotting.vue"),
    meta: {
      title: "动态绘制",
      isAuthRequired: true,
      // hiddenInMenu: true
    },
    children: [
      {
        path: "point",
        name: "drawPoint",
        meta: {
          title: "绘制点",
          isAuthRequired: true,
          // hiddenInMenu: true
        },
        component: () =>
          import(
            /* webpackChunkName: "DrawPoint" */ "../views/plotting/DrawPoint.vue"
          ),
      },
      {
        path: "polyline",
        name: "drawPolyLine",
        meta: {
          title: "绘制线",
          isAuthRequired: true,
          // hiddenInMenu: true
        },
        component: () =>
          import(
            /* webpackChunkName: "DrawPolyLine" */ "../views/plotting/DrawPolyline.vue"
          ),
      },
      {
        path: "polygon",
        name: "drawPolygon",
        meta: {
          title: "绘制点",
          isAuthRequired: true,
          // hiddenInMenu: true
        },
        component: () =>
          import(
            /* webpackChunkName: "DrawPolygon" */ "../views/plotting/DrawPolygon.vue"
          ),
      },
    ],
  },
  {
    path: "/map",
    name: "Map",
    component: () => import(/* webpackChunkName: "map" */ "../views/Map.vue"),
    meta: {
      title: "地图",
      isAuthRequired: true,
      // hiddenInMenu: true
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
