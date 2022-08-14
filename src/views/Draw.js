
function drawPolygon(newCesium) {
  var floatingPoint;
  var activePolygon;
  var handler = newCesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction(function(click) {
    var position =viewer.scene.pickPosition(click.position);
    if(Cesium.defined(location.cartesian)){var cartesian =location.cartesian;if(activeShapePoints.length === 0){
  
  floatingPoint=creatPoint(cartesian);
  
  activeShapePoints.push(cartesian);var dynamicPositions = new Cesium.CallbackProperty(function() {returnactiveShapePoints;
  
  },false);
  
  activePolygon=createPolygon(dynamicPositions);
  
  }
  
  activeShapePoints.push(cartesian);
  
  creatPoint(cartesian);
  
  }
  
  },Cesium.ScreenSpaceEventType.LEFT_CLICK);
  
  handler.setInputAction(function(movement) {if(Cesium.defined(floatingPoint)){if(Cesium.defined(location.endPosition)){
  
  floatingPoint.position.setValue(location.endPosition);
  
  activeShapePoints.pop();
  
  activeShapePoints.push(location.endPosition);
  
  }
  
  }
  
  },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  
  handler.setInputAction(function(movement) {
  
  handler.destroy();for(var i=0;i
  
  viewer.entities.remove(Points[i]);
  
  }
  
  Points=[];
  
  },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);functioncreatePolygon(positionData) {varpolygon;
  
  polygon=viewer.entities.add({
  
  name:'polygon',
  
  positions : positionData,
  
  polygon:{
  
  hierarchy : positionData,
  
  perPositionHeight:true,
  
  material: Cesium.Color.RED.withAlpha(0.7),
  
  outline:true,
  
  outlineColor: Cesium.Color.YELLOW.withAlpha(1)
  
  }
  
  });returnpolygon;
  
  }
  
  }