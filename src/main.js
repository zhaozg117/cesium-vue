import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/style/reset.scss";
// import "@/style/element/base-variable.scss";
import "@/style/common.scss";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

window.Cesium = Cesium;
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
