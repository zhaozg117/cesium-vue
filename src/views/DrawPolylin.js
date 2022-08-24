var line = undefined; //全局线对象
var linearr = []; //线的坐标存储
//鼠标点击事件监听
handler.setInputAction(function(event) {
  //获取世界坐标点
  var pick = viewer.camera.getPickRay(event.position);
  var cartesian = scene.globe.pick(pick, viewer.scene);
  //如果世界坐标点存在
  if (cartesian) {
    linearr.push(cartesian);
    //添加一个线对象
    if (!line) {
      line = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(function() {
            return linearr;
          }, false),
          width: 3,
          material: Cesium.Color.RED,
          clampToGround: true,
        },
      });
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//鼠标移动事件监听
handler.setInputAction(function(event) {
  var pick = viewer.camera.getPickRay(event.endPosition);
  var cartesian = scene.globe.pick(pick, viewer.scene);
  if (cartesian) {
    if (line) {
      debugger;
      //考虑在鼠标移动的一瞬间,linearr应该增加一个坐标点,当再次移动时,该坐标点应该更换
      linearr[linearr.length - 1] = cartesian;
      console.log(linearr);
    }
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
