import 'cesium/Source/Widgets/widgets.css';
import {
    Cartesian3,
    Math as CesiumMath,
    Viewer as CesiumViewer,
    Ion
} from 'cesium';
import createOsmBuildingsAsync from '/node_modules/@cesium/engine/Source/Scene/createOsmBuildingsAsync';
import viewerCesiumNavigationMixin from 'cesium-navigation-es6/viewerCesiumNavigationMixin';
import {viewerLayerControlMixin} from '../widgets/LayerControl/viewerLayerControlMixin';
import {viewerMapOptionsMixin} from '../widgets/MapOptions/viewerMapOptionsMixin';
import {Util} from '../common/Util';
import ViewerHtml from './ScMap.html';

export class ScMap {
    _container;
    _cesiumViewer;

    get container() {
        return this._container;
    }

    get cesiumViewer() {
        return this._cesiumViewer;
    }

    constructor(container = 'simpleCesium', options = {}) {
        this._container = Util.getElement(container);
        this._cesiumViewer = undefined;

        this.init(this._container, options);
    }

    init(container = 'simpleCesium') {
        if (!container) {
            return;
        }

        Util.insertHtml(container, ViewerHtml, async () => {
            const viewer = new CesiumViewer('cesiumContainer', {
                creditContainer: 'creditContainer'
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
                        return Util.getElement('.cesiumContainer .sc-widgets');
                    }
                }
            });

            // viewer.scene.primitives.add(createOsmBuildings());
            try {
                const tileset = await createOsmBuildingsAsync();
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.log(`Error creating tileset: ${error}`);
            }

            viewer.scene.camera.flyTo({
                destination: Cartesian3.fromDegrees(-74.019, 40.6912, 750),
                orientation: {
                    heading: CesiumMath.toRadians(20),
                    pitch: CesiumMath.toRadians(-20)
                }
            });
            // 默认切换地图源到ArcGIS World Imagery
            viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[3];
            Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWZjMjczZi00YzgxLTRlNGYtODVhMi1lNjhlNWU4OGQwMmYiLCJpZCI6MTUzNjYsImlhdCI6MTYwNjcwMzA0OH0.PJbk3DIs2DJIwP7KvWe6Z8a7aZOygIHQ1qIVjLtlQeI';

            // 添加插件
            viewer.extend(viewerCesiumNavigationMixin, {});
            viewer.extend(viewerLayerControlMixin);
            viewer.extend(viewerMapOptionsMixin);
            // viewer.extend(viewerModelBuilderMixin);

            this._cesiumViewer = viewer;
        });
    }
}