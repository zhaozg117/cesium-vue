<template>
  <div class="cesium-home pr-20 pl-20 pt-20 pb-20">
    <el-select v-model="mapIndex" @change="changeMap">
      <el-option
        v-for="item in options"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div id="cesiumContainer" class="mt-20"></div>
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Viewer, Cartesian3, ArcGisMapServerImageryProvider } from "cesium";
const { v4: uuidv4 } = require("uuid");
export default {
  name: "Home",
  data() {
    return {
      viewer: null,
      mapIndex: 0,
      options: [
        { label: "影像", value: 0 },
        { label: "电子街道", value: 1 },
        { label: "蓝色底图", value: 2 },
        { label: "灰色底图", value: 3 },
      ],
    };
  },
  mounted() {
    this.initViewer("cesiumContainer");
    this.flyToHome(this.viewer);
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    //初始化viewer
    initViewer(el) {
      this.viewer = new Viewer(el, {
        infoBox: false,
        selectionIndicator: false,
        navigation: false,
        animation: false,
        shouldAnimate: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        imageryProvider: new ArcGisMapServerImageryProvider({
          url:
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        }),
      });
    },

    flyToHome(viewer) {
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          116.15570068359374,
          25.751661745845244,
          77134.63356016901
        ),
        // orientation: {
        //   heading: Cesium.Math.toRadians(0),
        //   pitch: Cesium.Math.toRadians(0),
        //   roll: 0.0,
        // },
        duration: 3,
      });
    },

    //改变底图
    changeMap(mapIndex) {
      this.viewer.imageryLayers.removeAll(true); //删除所有底图
      let imageryProvider;
      switch (mapIndex) {
        case 0: //影像
          imageryProvider = new ArcGisMapServerImageryProvider({
            url:
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          });
          break;
        case 1: //电子街道
          imageryProvider = new ArcGisMapServerImageryProvider({
            url:
              " https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
          });
          break;
        case 2: //蓝色底图
          imageryProvider = new ArcGisMapServerImageryProvider({
            url:
              "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
          });
          break;
        case 3: //灰色底图
          imageryProvider = new ArcGisMapServerImageryProvider({
            url:
              "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer",
          });
          break;
      }
      this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    },

    destroy() {
      this.viewer.entities.removeAll();
      this.viewer.imageryLayers.removeAll(true);
      this.viewer.destroy();
      this.viewer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  // width: 100;
  height: calc(100vh - 180px);
  overflow: hidden;
}
</style>
