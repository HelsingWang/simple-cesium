import 'cesium/Source/Widgets/widgets.css';
import {
    BoundingSphere,
    Cartesian3,
    EllipseGeometry,
    Ion,
    Math as CesiumMath,
    Rectangle,
    RectangleGeometry,
    Viewer
} from 'cesium';
import createOsmBuildingsAsync from '/node_modules/@cesium/engine/Source/Scene/createOsmBuildingsAsync';
import viewerCesiumNavigationMixin from 'cesium-navigation-es6/viewerCesiumNavigationMixin';
import {viewerLayerControlMixin} from '../mixins/LayerControl/viewerLayerControlMixin';
import {viewerMapOptionsMixin} from '../mixins/MapOptions/viewerMapOptionsMixin';
import {Util} from '../common/Util';
import {CesiumUtil} from '../common/CesiumUtil';
import {ObjectBase} from './ObjectBase';
import ViewerHtml from './SimpleMap.html';
import {RadarScanCircleMaterial} from '../materials/RadarScanCircleMaterial';

/**
 * 地图。
 *
 * @alias ScMap
 * @category 核心
 * @class
 * @extends ObjectBase
 * @example
 * @author Helsing
 * @since 2020/12/30
 */
export class SimpleMap extends ObjectBase {
    /**
     * 地图容器。
     *
     * @returns {HTMLElement}
     */
    get container() {
        return this.properties?.container;
    }

    /**
     * 三维视窗。
     *
     * @returns {Viewer}
     */
    get viewer() {
        return this.properties?.viewer;
    }

    /**
     * 构造地图。
     *
     * @param container 地图容器。
     * @param options 选项。
     */
    constructor(container = 'simpleCesium', options = {}) {
        super(options);

        this.properties.viewer = undefined;
        this.properties.container = Util.getElement(container);
        this.init(this.properties.container, options);
    }

    init(container = 'simpleCesium') {
        if (!container) {
            return;
        }

        Util.insertHtml(container, ViewerHtml, async () => {
            const viewer = new Viewer('cesiumContainer', {
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

            // Load OSM buildings.
            try {
                const tileset = await createOsmBuildingsAsync();
                viewer.scene.primitives.add(tileset);
                tileset['name'] = 'OsmBuildings';
            } catch (error) {
                console.warn(`Error creating tileset: ${error}`);
            }

            // Fly to New York.
            viewer.scene.camera.flyTo({
                destination: Cartesian3.fromDegrees(-74.019, 40.6912, 750),
                orientation: {
                    heading: CesiumMath.toRadians(20),
                    pitch: CesiumMath.toRadians(-20)
                }
            });

            // Set imagery source to ArcGIS World Imagery.
            viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[3];
            Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWZjMjczZi00YzgxLTRlNGYtODVhMi1lNjhlNWU4OGQwMmYiLCJpZCI6MTUzNjYsImlhdCI6MTYwNjcwMzA0OH0.PJbk3DIs2DJIwP7KvWe6Z8a7aZOygIHQ1qIVjLtlQeI';

            // Load mixins。
            viewer.extend(viewerCesiumNavigationMixin, {});
            viewer.extend(viewerLayerControlMixin);
            // viewer.extend(viewerMapOptionsMixin);

            this.properties.viewer = viewer;
        });
    }

    //#region 公共函数

    /**
     * 切換地图场景模式。
     *
     * @param {string|number} mode 地圖场景模式。取值范围：'25d'或1，'2d'或2，'3d'或3。
     * @example
     * ````
     * const map = new ThreeBox.Map('mapContainer');
     * // 切换地图模式，切换到二维模式。
     * map.changeSceneMode(‘2d’);
     * ````
     * @author Helsing
     * @since 2019/08/02
     */
    changeSceneMode(mode) {
        // 如果OsmBuildings只能在三维模式下显示，因此切换时应该关闭图层
        const osmBuildings = CesiumUtil.getPrimitiveByField(this.viewer.scene.primitives, 'OsmBuildings');
        osmBuildings.show = !(mode !== 3 && mode !== '3d');
        CesiumUtil.changeSceneMode(this.viewer, mode);
    }

    //#region 控制

    /**
     * 显示地图选项面板。
     */
    showMapOptions() {
        !this.viewer['scMapOptions'] && this.viewer.extend(viewerMapOptionsMixin);
    }

    /**
     * 显示地图选项面板。
     */
    showLayerControl() {
        !this.viewer['scLayerControl'] && this.viewer.extend(viewerLayerControlMixin);
    }

    /**
     * 启动动画。
     *
     * @author Helsing
     * @since 2020/05/21
     * @example
     * ````
     * const map = new ThreeBox.Map('mapContainer');
     * map.startAnimation();
     */
    startAnimation() {
        CesiumUtil.startAnimation(this.viewer);
    }

    /**
     * 停止动画。
     *
     * @author Helsing
     * @since 2020/05/21
     * @example
     * ````
     * const map = new ThreeBox.Map('mapContainer');
     * map.stopAnimation();
     */
    stopAnimation() {
        CesiumUtil.stopAnimation(this.viewer);
    }

    /**
     * 重置动画。
     *
     * @author Helsing
     * @since 2020/05/21
     * @example
     * ````
     * const map = new ThreeBox.Map('mapContainer');
     * map.resetAnimation();
     */
    resetAnimation() {
        CesiumUtil.resetAnimation(this.viewer);
    }

    //#endregion

    //#region 材质

    rectMaterial(options) {
        const position = CesiumUtil.getCesiumPosition(options?.position || [80, 39]);
        const radius = options.radius ?? 40000.0;
        const name = options.name || '矩形材质';
        const type = options.type ?? 0.0;
        const zoomTo = options.zoomTo ?? false;
        CesiumUtil.addSimplePrimitiveFeature(this.viewer.scene.primitives, {
            name: name,
            geometry: new RectangleGeometry({
                rectangle: Rectangle.fromCartesianArray([
                    CesiumUtil.translate(position, [-radius, radius, 0]),
                    CesiumUtil.translate(position, [radius, -radius, 0])
                ])
            }),
            material: new RadarScanCircleMaterial({
                ...options.uniforms,
                type: type
            })
        });
        zoomTo && this.viewer.camera.flyToBoundingSphere(new BoundingSphere(position, radius * 1.5));
    }

    circleMaterial(options) {
        const position = CesiumUtil.getCesiumPosition(options?.position || [80, 40]);
        const radius = options.radius ?? 40000.0;
        const name = options.name || '圆形材质';
        const type = options.type ?? 0.0;
        const zoomTo = options.zoomTo ?? false;
        CesiumUtil.addSimplePrimitiveFeature(this.viewer.scene.primitives, {
            name: name,
            geometry: new EllipseGeometry({
                center: position,
                semiMajorAxis: radius,
                semiMinorAxis: radius,
                rotation: CesiumMath.toRadians(60.0)
            }),
            material: new RadarScanCircleMaterial({
                ...options,
                type: type
            })
        });
        zoomTo && this.viewer.camera.flyToBoundingSphere(new BoundingSphere(position, radius * 1.5));
    }

    //#endregion

    //#endregion

    test() {
        /*this.rectMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 39],
            zoomTo: true
        })
        this.rectMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 39],
            type: 1.2,
        })
        this.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[82, 39],
            type: 2.1,
        })
        this.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[83, 39],
            type: 2.2,
        })
        this.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 39],
            type: 2.3,
        })
        this.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 39],
            type: 2.4,
        })
        this.circleMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 38],
        })
        this.circleMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 38],
            type: 1.2,
        })
        this.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[82, 38],
            type: 2.1,
        })
        this.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[83, 38],
            type: 2.2,
        })
        this.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 38],
            type: 2.3,
        })
        this.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 38],
            type: 2.4,
        })*/
        this.circleMaterial({
            name: '雷达扫描',
            zoomTo: true,
            position: [85, 38],
            type: 2.4,
            color: 'rgb(0,255,50)',
            backgroundColor: 'rgba(0,255,50,0.2)',
            sectorColor: 'rgb(0,255,50)',
            radians: Math.PI * 3 / 8,
            offset: 0.2
        });
    }
}