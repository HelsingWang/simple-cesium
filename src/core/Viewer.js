import "cesium/Source/Widgets/widgets.css";
import Cartesian3 from "cesium/Source/Core/Cartesian3.js";
import CesiumMath from "cesium/Source/Core/Math.js";
import CesiumViewer from "cesium/Source/Widgets/Viewer/Viewer.js";
import createOsmBuildings from "cesium/Source/Scene/createOsmBuildings.js";
import Ion from "cesium/Source/Core/Ion.js";
import viewerCesiumNavigationMixin from "cesium-navigation-es6/viewerCesiumNavigationMixin.js";
// import ViewerLayerControlMixin from "../widgets/LayerControl/viewerLayerControlMixin.js";
import ViewerMapOptionsMixin from "../widgets/MapOptions/ViewerMapOptionsMixin.js";

class Viewer {
    constructor() {
        this.init();
    }

    init() {
        const viewer = new CesiumViewer("cesiumContainer", {
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

        // 添加插件
        viewer.extend(viewerCesiumNavigationMixin, {});
        // viewer.extend(ViewerLayerControlMixin);
        viewer.extend(ViewerMapOptionsMixin);
    }
}

export default Viewer;