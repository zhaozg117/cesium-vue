<template>
  <div>
    <el-row type="flex" :gutter="20">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="addDem()">复位</el-button>
          <el-button type="primary" @click="draw('point')">绘制点</el-button>
          <el-button type="primary" @click="draw('polyline')">绘制线</el-button>
          <el-button type="primary" @click="draw('polygon')">绘制面</el-button>
          <el-button type="primary" @click="clearDrawEntities">清空</el-button>
        </div>
      </el-col>
    </el-row>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
const { v4: uuidv4 } = require("uuid");
export default {
  name: "Map",
  mounted() {
    this.init();
  },

  data() {
    return {
      handler: null,
      viewer: null,
      tempEntities: [],
      preEntity: null,
    };
  },
  methods: {
    init() {
      this.viewer = new Cesium.Viewer("cesiumContainer");

      // let imageryLayers = viewer.imageryLayers;

      // let googleMap = new Cesium.UrlTemplateImageryProvider({
      //   url: "http://www.google.com/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}"
      // });

      // imageryLayers.addImageryProvider(googleMap);

      // fly
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          114.296063,
          30.55245,
          20000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0,
        },
        duration: 2, // fly time 10s
      });
    },

    initHandler() {
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    },

    // init() {
    //   this.$refs.refCesium.initMap();
    //   this.viewer = this.$refs.refCesium.viewer;
    //   this.addDem();
    // },
    addDem() {
      let that = this;
      that.viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "../dem/ASTGTM_N29E087D",
      });
      that.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          87.42919921875,
          28.700224692776988,
          67863.0
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-45.0),
          roll: 0.0,
        },
      });
    },
    /**
     * 根据类型绘制对象
     * @param type point、polyline、polygon
     */
    draw(type) {
      //绘制点
      let that = this;
      let viewer = this.viewer;
      let tempEntities = this.tempEntities;
      let position = [];
      let tempPoints = [];
      // 开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      switch (type) {
        case "point":
          // 监听鼠标左键
          handler.setInputAction(function(movement) {
            // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
            let ray = viewer.camera.getPickRay(movement.position);
            // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
            position = viewer.scene.globe.pick(ray, viewer.scene);
            let point = that.drawPoint(position);
            tempEntities.push(point);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          // 左键双击停止绘制
          handler.setInputAction(function() {
            handler.destroy(); //关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
          // 右击单击停止绘制
          handler.setInputAction(function() {
            handler.destroy(); //关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
        case "polyline":
          //鼠标移动事件
          handler.setInputAction(function(e) {
            const entity = that.viewer.scene.pick(e.endPosition);
            if (entity && entity.id) {
              that.preEntity = entity.id;
              console.log("*****entity:", entity.id.polyline.material);

              entity.id.polyline.material = new Cesium.PolylineGlowMaterialProperty(
                {
                  color: Cesium.Color.GREEN,
                }
              );
            } else {
              if (!that.preEntity) {
                return false;
              }

              that.preEntity.polyline.material = new Cesium.PolylineGlowMaterialProperty(
                {
                  color: Cesium.Color.GOLD,
                }
              );
            }
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          //左键点击操作
          handler.setInputAction(function(click) {
            //调用获取位置信息的接口
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            //调用绘制点的接口
            let point = that.drawPoint(tempPoints[tempPoints.length - 1]);
            tempEntities.push(point);
            if (tempLength > 1) {
              let pointline = that.drawPolyline([
                tempPoints[tempPoints.length - 2],
                tempPoints[tempPoints.length - 1],
              ]);
              tempEntities.push(pointline);
            } else {
              // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          //右键点击操作
          handler.setInputAction(function(click) {
            tempPoints = [];
            handler.destroy(); //关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
        case "polygon":
          //鼠标移动事件
          handler.setInputAction(function(movement) {},
          Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          //左键点击操作
          handler.setInputAction(function(click) {
            //调用获取位置信息的接口
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            //调用绘制点的接口
            let point = that.drawPoint(position);
            tempEntities.push(point);
            if (tempLength > 1) {
              let pointline = that.drawPolyline([
                tempPoints[tempPoints.length - 2],
                tempPoints[tempPoints.length - 1],
              ]);
              tempEntities.push(pointline);
            } else {
              // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          //右键点击操作
          handler.setInputAction(function(click) {
            let cartesian = viewer.camera.pickEllipsoid(
              click.position,
              viewer.scene.globe.ellipsoid
            );

            if (cartesian) {
              let tempLength = tempPoints.length;
              if (tempLength < 3) {
                alert("请选择3个以上的点再执行闭合操作命令");
              } else {
                //闭合最后一条线
                let pointline = that.drawPolyline([
                  tempPoints[tempPoints.length - 1],
                  tempPoints[0],
                ]);
                tempEntities.push(pointline);
                that.drawPolygon(tempPoints);
                tempEntities.push(tempPoints);
                handler.destroy(); //关闭事件句柄
                handler = null;
              }
            }
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
      }
    },
    drawPoint(position, config) {
      let viewer = this.viewer;
      let config_ = config ? config : {};
      return viewer.entities.add({
        name: "点几何对象",
        id: uuidv4(),
        position: position,
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    },
    drawPolyline(positions, config_) {
      let viewer = this.viewer;
      if (positions.length < 1) return;
      let config = config_ ? config_ : {};
      return viewer.entities.add({
        name: "线几何对象",
        id: uuidv4(),
        polyline: {
          positions: positions,
          width: 3.0,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: config.color
              ? new Cesium.Color.fromCssColorString(config.color)
              : Cesium.Color.GOLD,
          }),
          // depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
          //   color: config.color
          //     ? new Cesium.Color.fromCssColorString(config.color)
          //     : Cesium.Color.GOLD,
          // }),
          // clampToGround: true,
        },
      });
    },
    drawPolygon(positions, config_) {
      let viewer = this.viewer;
      if (positions.length < 2) return;
      let config = config_ ? config_ : {};
      return viewer.entities.add({
        name: "面几何对象",
        polygon: {
          hierarchy: positions,
          material: config.color
            ? new Cesium.Color.fromCssColorString(config.color).withAlpha(0.2)
            : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(0.2),
        },
      });
    },
    /**
     * 清除实体
     */
    clearDrawEntities() {
      let viewer = this.viewer;
      this.tempEntities = [];
      // 清除之前的实体
      const entitys = viewer.entities._entities._array;
      let length = entitys.length;
      // 倒叙遍历防止实体减少之后entitys[f]不存在
      for (let f = length - 1; f >= 0; f--) {
        if (
          entitys[f]._name &&
          (entitys[f]._name === "点几何对象" ||
            entitys[f]._name === "线几何对象" ||
            entitys[f]._name === "面几何对象")
        ) {
          viewer.entities.remove(entitys[f]);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
