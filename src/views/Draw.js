import * as Cesium from "cesium";
const { Cartesian3, ScreenSpaceEventHandler, ScreenSpaceEventType } = Cesium;
const { v4: uuidv4 } = require("uuid");
class Drawer {
  handler = null;
  constructor(viewer) {
    this.viewer = viewer;
    this.tempEntities = [];
    this.preEntity = null;
    // 开启深度检测
    viewer.scene.globe.depthTestAgainstTerrain = true;
    this.initHandler();
  }

  initHandler() {
    this.handler = new ScreenSpaceEventHandler(this.viewer.canvas);
  }

  drawPointEvent() {
    if (!this.handler) this.initHandler();
    let { handler, viewer } = this;
    let tempPoints = [];
    let position = [];
    let tempEntities = this.tempEntities;
    //左键点击操作
    handler.setInputAction((click) => {
      //调用获取位置信息的接口
      let ray = viewer.camera.getPickRay(click.position);
      position = viewer.scene.globe.pick(ray, viewer.scene);
      tempPoints.push(position);
      let tempLength = tempPoints.length;
      //调用绘制点的接口
      let point = this.drawPoint(tempPoints[tempPoints.length - 1]);
      tempEntities.push(point);
      if (tempLength > 1) {
        let pointline = this.drawPolyline([
          tempPoints[tempPoints.length - 2],
          tempPoints[tempPoints.length - 1],
        ]);
        tempEntities.push(pointline);
      } else {
        // tooltip.innerHTML = "请绘制下一个点，右键结束";
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //右键点击操作
    handler.setInputAction((click) => {
      tempPoints = [];
      handler.destroy(); //关闭事件句柄
      handler = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  drawPolyineEvent() {
    if (!this.handler) this.initHandler();
    let { handler, viewer } = this;
    let tempEntities = this.tempEntities;
    let position = [];
    let tempPoints = [];
    /*   handler.setInputAction(function(e) {
      const entity = viewer.scene.pick(e.endPosition);
      if (this.preEntity && this.preEntity.polyline) {
        this.preEntity.polyline.material = new Cesium.PolylineGlowMaterialProperty(
          {
            color: Cesium.Color.GOLD,
          }
        );
      }

      if (!entity || entity.id) return false;
      entity.id.polyline.material = new Cesium.PolylineGlowMaterialProperty({
        color: Cesium.Color.GREEN,
      });
      this.preEntity = entity.id;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE); */
    //左键点击操作
    handler.setInputAction((click) => {
      //调用获取位置信息的接口
      let ray = viewer.camera.getPickRay(click.position);
      position = viewer.scene.globe.pick(ray, viewer.scene);
      tempPoints.push(position);
      let tempLength = tempPoints.length;
      //调用绘制点的接口
      let point = this.drawPoint(tempPoints[tempPoints.length - 1]);
      tempEntities.push(point);
      if (tempLength > 1) {
        let pointline = this.drawPolyline([
          tempPoints[tempPoints.length - 2],
          tempPoints[tempPoints.length - 1],
        ]);
        tempEntities.push(pointline);
      } else {
        // tooltip.innerHTML = "请绘制下一个点，右键结束";
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //右键点击操作
    handler.setInputAction((click) => {
      tempPoints = [];
      handler.destroy(); //关闭事件句柄
      handler = null;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  drawPolygonEvent() {
    let { handler, viewer } = this;
    let tempEntities = this.tempEntities;
    let position = [];
    let tempPoints = [];
    if (!this.handler) this.initHandler();
    //鼠标移动事件
    handler.setInputAction((movement) => {},
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //左键点击操作
    handler.setInputAction((click) => {
      //调用获取位置信息的接口
      let ray = viewer.camera.getPickRay(click.position);
      position = viewer.scene.globe.pick(ray, viewer.scene);
      tempPoints.push(position);
      let tempLength = tempPoints.length;
      //调用绘制点的接口
      let point = this.drawPoint(position);
      tempEntities.push(point);
      if (tempLength > 1) {
        let pointline = this.drawPolyline([
          tempPoints[tempPoints.length - 2],
          tempPoints[tempPoints.length - 1],
        ]);
        tempEntities.push(pointline);
      } else {
        // tooltip.innerHTML = "请绘制下一个点，右键结束";
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //右键点击操作
    handler.setInputAction((click) => {
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
          let pointline = this.drawPolyline([
            tempPoints[tempPoints.length - 1],
            tempPoints[0],
          ]);
          tempEntities.push(pointline);
          this.drawPolygon(tempPoints);
          tempEntities.push(tempPoints);
          handler.destroy(); //关闭事件句柄
          handler = null;
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

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
  }

  drawPolyline(positions, _config) {
    let viewer = this.viewer;
    if (positions.length < 1) return;
    let config = _config ?? {};
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
      },
    });
  }

  drawPolygon(positions, _config) {
    let viewer = this.viewer;
    if (positions.length < 2) return;
    let config = _config ?? {};
    return viewer.entities.add({
      name: "面几何对象",
      polygon: {
        hierarchy: positions,
        material: config.color
          ? new Cesium.Color.fromCssColorString(config.color).withAlpha(0.2)
          : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(0.2),
      },
    });
  }

  clear() {
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
  }
}

export default Drawer;
