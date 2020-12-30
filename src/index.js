import "/css/main.css";
import "/node_modules/cesium/Source/Widgets/widgets.css";
// import * as Cesium from "/node_modules/cesium/Source/Cesium.js";
import Viewer from "/node_modules/cesium/Source/Widgets/Viewer/Viewer.js";
import createOsmBuildings from "/node_modules/cesium/Source/Scene/createOsmBuildings.js";
import Cartesian3 from "/node_modules/cesium/Source/Core/Cartesian3.js";
import CesiumMath from "/node_modules/cesium/Source/Core/Math.js";
import Ion from "/node_modules/cesium/Source/Core/Ion.js";

const viewer = new Viewer("cesiumContainer", {
    creditContainer: "creditContainer"
});
viewer.scene.primitives.add(createOsmBuildings());
viewer.scene.camera.flyTo({
    destination: Cartesian3.fromDegrees(-74.019, 40.6912, 750),
    orientation: {
        heading: CesiumMath.toRadians(20),
        pitch: CesiumMath.toRadians(-20),
    },
});
// 默认切换地图源到OpenStreetMap
viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[6];
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWZjMjczZi00YzgxLTRlNGYtODVhMi1lNjhlNWU4OGQwMmYiLCJpZCI6MTUzNjYsImlhdCI6MTYwNjcwMzA0OH0.PJbk3DIs2DJIwP7KvWe6Z8a7aZOygIHQ1qIVjLtlQeI';