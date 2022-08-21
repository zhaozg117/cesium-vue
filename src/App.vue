<template>
  <div id="app">
    <header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        router
        active-text-color="#ffd04b"
      >
        <template v-for="route in menus">
          <c-menu-item :key="route.path" :route="route" />
        </template>
        <!-- <el-menu-item index="home">Home</el-menu-item>
        <el-submenu index="plotting">
          <template slot="title">动态标绘</template>
          <el-menu-item index="/plotting/point">绘制点</el-menu-item>
          <el-menu-item index="polyline">绘制线</el-menu-item>
          <el-menu-item index="polygon">绘制面</el-menu-item>
        </el-submenu>
        <el-menu-item index="plot">军事标会</el-menu-item>
        <el-menu-item index="4">
          <a href="https://www.ele.me" target="_blank">订单管理</a>
        </el-menu-item> -->
      </el-menu>
    </header>
    <router-view />
  </div>
</template>

<script>
import CMenuItem from "@/components/CustomMenuItem.vue";
export default {
  name: "App",
  components: { CMenuItem },
  data() {
    return {
      activeIndex: "home",
      menus: [],
    };
  },
  created() {
    this.menus = this.$router.options.routes;
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  color: var(--color-text-primary);
  background-color: #10161b;
}
</style>
