import "cesium/Source/Widgets/widgets.css";
import Cartesian3 from "cesium/Source/Core/Cartesian3.js";
import CesiumMath from "cesium/Source/Core/Math.js";
import CesiumViewer from "cesium/Source/Widgets/Viewer/Viewer.js";
import createOsmBuildings from "cesium/Source/Scene/createOsmBuildings.js";
import Ion from "cesium/Source/Core/Ion.js";
import viewerCesiumNavigationMixin from "cesium-navigation-es6/viewerCesiumNavigationMixin.js";
import viewerLayerControlMixin from "../widgets/LayerControl/viewerLayerControlMixin.js";
import viewerMapOptionsMixin from "../widgets/MapOptions/viewerMapOptionsMixin.js";
// import viewerModelBuilderMixin from "../widgets/ModelBuilder/viewerModelBuilderMixin.js";
import {insertHtml,getElement} from "../common/util.js";
import ViewerHtml from "./Viewer.html";

class Viewer {
    get container() {
        return this._container;
    }
    get cesiumViewer() {
        return this._cesiumViewer;
    }

    constructor(container = "simpleCesium", options = {}) {
        this._container = getElement(container);
        this._cesiumViewer = undefined;

        this.init(this._container, options);
    }

    init(container = "simpleCesium") {
        if (!container){
            return;
        }

        insertHtml(container, ViewerHtml, () => {
            const viewer = new CesiumViewer("cesiumContainer", {
                creditContainer: "creditContainer"
            });

            // Add the mainContainer property to viewer.
            Object.defineProperties(viewer, {
                scMainContainer: {
                    get: function () {
                        return container;
                    }
                },
                scWidgetsContainer: {
                    get: function () {
                        return getElement(".cesiumContainer .sc-widgets");
                    }
                },
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
            viewer.extend(viewerLayerControlMixin);
            viewer.extend(viewerMapOptionsMixin);
            // viewer.extend(viewerModelBuilderMixin);

            this._cesiumViewer = viewer;
        })
    }
}

export default Viewer;