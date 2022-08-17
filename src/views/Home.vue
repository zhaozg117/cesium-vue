<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import { Viewer, ArcGisMapServerImageryProvider } from "cesium";
const { v4: uuidv4 } = require("uuid");
export default {
  name: "Home",
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    this.initViewer("cesiumContainer");
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

    //改变底图
    changeMap(mapIndex) {
      this.viewer.imageryLayers.removeAll(true); //删除所有底图
      let imageryProvider;
      switch (mapIndex) {
        case 0: //影像
          imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
            url:
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          });
          break;
        case 1: //电子街道
          imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
            url:
              " https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
          });
          break;
        case 2: //蓝色底图
          imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
            url:
              "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
          });
          break;
        case 3: //灰色底图
          imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
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
    },
  },
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100vw;
  height: 90vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
