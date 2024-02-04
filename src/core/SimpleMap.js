import ViewerHtml from './SimpleMap.html';
import 'cesium/Source/Widgets/widgets.css';
import * as Cesium from 'cesium';
import viewerCesiumNavigationMixin from 'cesium-navigation-es6/viewerCesiumNavigationMixin';
import {viewerLayerControlMixin} from '../mixins/LayerControl/viewerLayerControlMixin';
import {viewerMapOptionsMixin} from '../mixins/MapOptions/viewerMapOptionsMixin';
import {Util} from '../common/Util';
import {CesiumUtil} from '../common/CesiumUtil';
import {ObjectBase} from './ObjectBase';
import {RadarScanCircleMaterial} from '../materials/RadarScanCircleMaterial';
import {Test} from '../test/Test';

/**
 * 地图。
 *
 * @alias ScMap
 * @category 核心
 * @class
 * @extends ObjectBase
 * @example
 * ````
 * const map = new SimpleMap('simpleCesium', {});
 * ````
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
     * @returns {Cesium.Viewer}
     */
    get viewer() {
        return this.properties?.viewer;
    }

    /**
     * 测试。
     *
     * @type {Test}
     * @private
     */
    _test;

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
    }

    /**
     * 启动地图。
     */
    startUp() {
        const container = this.properties.container;
        if (!container) {
            return;
        }

        Util.insertHtml(container, ViewerHtml, async () => {
            const viewer = new Cesium.Viewer('cesiumContainer', {
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
                const tileset = await Cesium.createOsmBuildingsAsync();
                viewer.scene.primitives.add(tileset);
                tileset['name'] = 'OsmBuildings';
            } catch (error) {
                console.warn(`Error creating tileset: ${error}`);
            }

            // Fly to New York.
            viewer.scene.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(121.4814, 31.2424, 500),
                orientation: {
                    heading: Cesium.Math.toRadians(103),
                    pitch: Cesium.Math.toRadians(-12)
                }
            });

            // Set imagery source to ArcGIS World Imagery.
            viewer.baseLayerPicker.viewModel.selectedImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[3];
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNWZjMjczZi00YzgxLTRlNGYtODVhMi1lNjhlNWU4OGQwMmYiLCJpZCI6MTUzNjYsImlhdCI6MTYwNjcwMzA0OH0.PJbk3DIs2DJIwP7KvWe6Z8a7aZOygIHQ1qIVjLtlQeI';

            // Load mixins。
            viewer.extend(viewerCesiumNavigationMixin, {});
            viewer.extend(viewerLayerControlMixin);
            // viewer.extend(viewerMapOptionsMixin);

            this.properties.viewer = viewer;

            // 测试。
            this._test = new Test({map: this});
        });
    }

    /**
     * 销毁地图。
     */
    destroy(){
        this.properties.viewer?.destroy();
        this.properties.viewer = null;
        this._test = null;
        this.options = null;
        this.properties = null;
    }

    //#region 公共函数

    //#region 视图

    /**
     * 切換地图场景模式。
     *
     * @param {string|number} mode 地圖场景模式。取值范围：'25d'或1，'2d'或2，'3d'或3。
     */
    changeSceneMode(mode) {
        // 如果OsmBuildings只能在三维模式下显示，因此切换时应该关闭图层
        const osmBuildings = CesiumUtil.getPrimitiveByField(this.viewer.scene.primitives, 'OsmBuildings');
        osmBuildings.show = !(mode !== 3 && mode !== '3d');
        CesiumUtil.changeSceneMode(this.viewer, mode);
    }

    /**
     * 获取相机信息。
     */
    getCameraInfo() {
        const result = CesiumUtil.getCameraInfo(this.viewer.camera);
        console.log(result);
        window.alert(result);
    }

    /**
     * 拾取点坐标。
     */
    pickPoint() {
        CesiumUtil.pickPoint(this.viewer, position => {
            const result = CesiumUtil.cartesian3ToDegrees(position);
            console.log(result);
            window.alert(result);
        });
    }

    //#endregion

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
     */
    startAnimation() {
        CesiumUtil.startAnimation(this.viewer);
    }

    /**
     * 停止动画。
     */
    stopAnimation() {
        CesiumUtil.stopAnimation(this.viewer);
    }

    /**
     * 重置动画。
     */
    resetAnimation() {
        CesiumUtil.resetAnimation(this.viewer);
    }

    //#endregion

    //#region 材质

    /**
     * 矩形材质。
     *
     * @param {Object} [options] 选项。
     */
    rectMaterial(options = {}) {
        const position = CesiumUtil.getCesiumPosition(options?.position || [80, 39]);
        const radius = options.radius ?? 40000.0;
        const name = options.name || '矩形材质';
        const type = options.type ?? 0.0;
        const zoomTo = options.zoomTo ?? true;
        CesiumUtil.addSimplePrimitiveFeature(this.viewer.scene.primitives, {
            name: name,
            geometry: new Cesium.RectangleGeometry({
                rectangle: Cesium.Rectangle.fromCartesianArray([
                    CesiumUtil.translate(position, [-radius, radius, 0]),
                    CesiumUtil.translate(position, [radius, -radius, 0])
                ])
            }),
            material: new RadarScanCircleMaterial({
                ...options.uniforms,
                type: type
            })
        });
        zoomTo && this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, radius * 1.5));
    }

    /**
     * 圆形材质。
     *
     * @param {Object} [options] 选项。
     */
    circleMaterial(options = {}) {
        const position = CesiumUtil.getCesiumPosition(options?.position || [80, 40]);
        const radius = options.radius ?? 40000.0;
        const name = options.name || '圆形材质';
        const type = options.type ?? 0.0;
        const zoomTo = options.zoomTo ?? true;
        CesiumUtil.addSimplePrimitiveFeature(this.viewer.scene.primitives, {
            name: name,
            geometry: new Cesium.EllipseGeometry({
                center: position,
                semiMajorAxis: radius,
                semiMinorAxis: radius,
                rotation: Cesium.Math.toRadians(60.0)
            }),
            material: new RadarScanCircleMaterial({
                ...options,
                type: type
            })
        });
        zoomTo && this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(position, radius * 1.5));
    }

    //#endregion

    //#region 模型

    /**
     * 模型压平。
     *
     * @param {number[][]} [positions] 选项。
     * @param {number} flatteningHeight
     */
    flattenModel(positions, flatteningHeight = 0) {
        CesiumUtil.customShader({
            type: 'flatten',
            viewer: this.viewer,
            tileset: CesiumUtil.getPrimitiveByField(this.viewer.scene.primitives, 'OsmBuildings'),
            flatteningHeight: flatteningHeight,
            position: [121.49515381925019, 31.241921435952527, 20],
            positions: [
                [-74.02372777557211, 40.718217523711246, -30],
                [-73.97464276679615, 40.70330045475742, -30],
                [-73.99762041526566, 40.68374393726614, -30],
                [-74.02904008497174, 40.697554233666715, -30]
            ]
        });

        /*const viewer = this.viewer;
        const tileset = options.tileset || CesiumUtil.getPrimitiveByField(viewer.scene.primitives, 'OsmBuildings');
        const positions = options.positions || [
            [-74.02372777557211, 40.718217523711246, -30],
            [-73.97464276679615, 40.70330045475742, -30],
            [-73.99762041526566, 40.68374393726614, -30],
            [-74.02904008497174, 40.697554233666715, -30]
        ];
        // 如果是GLTF模型，则设置为模型的中心。
        // const center = tileset.boundingSphere.center;
        const center = CesiumUtil.getCesiumPosition([121.49515381925019, 31.241921435952527, 20]);
        const modelCenterMat = new Matrix4();
        const inverseModelCenterMat = new Matrix4();
        Transforms.eastNorthUpToFixedFrame(center, viewer.scene.globe.ellipsoid, modelCenterMat);
        Matrix4.inverse(modelCenterMat, inverseModelCenterMat);
        const flatteningHeight = options.flatteningHeight ?? 0;

        tileset.customShader = new CustomShader({
            // lightingModel: LightingModel.UNLIT,
            uniforms: {
                u_flatteningHeight: {
                    type: UniformType.FLOAT,
                    value: flatteningHeight
                },
                u_modelCenterMat: {
                    type: UniformType.MAT4,
                    value: modelCenterMat
                },
                u_inverseModelCenterMat: {
                    type: UniformType.MAT4,
                    value: inverseModelCenterMat
                },
                u_drag: {
                    type: UniformType.VEC2,
                    value: new Cartesian2(0.0, 0.0)
                },
                u_time: {
                    type: UniformType.FLOAT,
                    value: 0
                }
            },
            vertexShaderText: `
                void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
                   // ========
                   // 模型压平
                   // ========
                   // 模型世界坐标的齐次坐标 = 中心点逆矩阵 * Cesium模型转换矩阵 * 模型局部坐标的齐次坐标
                   vec4 worldPosition = u_inverseModelCenterMat * czm_model * vec4(vsInput.attributes.positionMC, 1.0);
                   // 当模型世界坐标的z值大于压平高度值时，将z值设为高度值。
                   if (worldPosition.z > u_flatteningHeight) {
                     worldPosition.z = u_flatteningHeight;
                   }
                   // 模型局部坐标的齐次坐标 = Cesium模型转换逆矩阵 * 中心点矩阵 * 模型世界坐标的齐次坐标
                   vec4 modelPosition = czm_inverseModel * u_modelCenterMat * worldPosition;
                   // 模型局部坐标赋值
                   // vsOutput.positionMC = modelPosition.xyz;

                   // 直接设置模型的Z轴高度值，简单粗暴，但问题很多
                   // vsOutput.positionMC.z = u_flatteningHeight ;

                   // 炸开模型
                   vsOutput.positionMC += 0.01 * u_drag.x * vsInput.attributes.normalMC;
                }
            `,
            fragmentShaderText: `
                void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
                {
                    vec3 modelPosition = fsInput.attributes.positionMC;
                    vec3 cameraPosition = fsInput.attributes.positionEC;
                    vec4 worldPosition = czm_inverseModelView * vec4(fsInput.attributes.positionEC, 1.0);
                    vec2 uv = fsInput.attributes.positionMC.xy;
                    float distance = length(gl_PointCoord - 0.5);
                    float helsing_frame = fract(czm_frameNumber / 720.0);
                    helsing_frame = abs(helsing_frame - 0.5) * 2.0;

                    // material.diffuse.g = -cameraPosition.z / 1.0e4;
                    // material.diffuse = 0.2 * fsInput.attributes.color_0.rgb;

                    // 霓虹灯
                    float interval = mod(helsing_frame, 1.0); // mod(u_time / 5.0, 1.0);
                    material.diffuse += vec3(0.1, 0.2, 0.3) + modelPosition.z / 1.0e4 - interval;

                    // 模型渐变
                    float helsing_colorDepth = 20.0;
                    float helsing_lineHeight = 500.0;
                    // material.diffuse *= vec3(modelPosition.z / helsing_colorDepth);

                    // 发光线
                    float helsing_diff = step(0.005, abs(clamp(worldPosition.z / helsing_lineHeight, 0.0, 1.0) - helsing_frame));
                    material.diffuse += material.diffuse * (1.0 - helsing_diff);

                    // pbr
                    material.specular = vec3(0.1, 0.6, 1.0);
                    material.roughness = 0.1;
                }
            `
        });

        /!*tileset.customShader = new CustomShader({
            uniforms: {
                u1pos: {
                    type: UniformType.VEC3,
                    value: CesiumUtil.getCesiumPosition(positions[0])
                },
                u2pos: {
                    type: UniformType.VEC3,
                    value: CesiumUtil.getCesiumPosition(positions[1])
                },
                u3pos: {
                    type: UniformType.VEC3,
                    value: CesiumUtil.getCesiumPosition(positions[2])
                },
                u4pos: {
                    type: UniformType.VEC3,
                    value: CesiumUtil.getCesiumPosition(positions[3])
                }
            },
            vertexShaderText: `
                void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
                    vec3 p = vsOutput.positionMC;
                    float px = p.x;
                    float py = p.z;
                    float pz = p.z;
                    vec4 u1posMC = czm_inverseModel * vec4(u1pos,1.);
                    vec4 u2posMC = czm_inverseModel * vec4(u2pos,1.);
                    vec4 u3posMC = czm_inverseModel * vec4(u3pos,1.);
                    vec4 u4posMC = czm_inverseModel * vec4(u4pos,1.);
                    bool flag = false;
                    vec4 tem1;
                    vec4 tem2;

                    for(int i=0;i<4;i++){
                        if(i == 0) {
                            tem1 = u1posMC;
                            tem2 = u4posMC;
                        }
                        else if(i == 1){
                            tem1 = u2posMC;
                            tem2 = u1posMC;
                        }
                        else if(i == 2){
                            tem1 = u3posMC;
                            tem2 = u2posMC;
                        }
                        else {
                            tem1 = u4posMC;
                            tem2 = u3posMC;
                        }

                        float sx = tem1.x;
                        float sy = tem1.y;
                        float sz = tem1.z;
                        float tx = tem2.x;
                        float ty = tem2.y;
                        float tz = tem2.z;

                        if((sy < py && ty >= py) || (sy >= py && ty < py)) {
                            float x = sx + (py - sy) * (tx - sx) / (ty - sy);
                            if(x > px) {
                                flag = !flag;
                            }
                        }

                        // if((sz < pz && tz >= pz) || (sz >= pz && tz < pz)) {
                        //     float x = sx + (pz - sz) * (tx - sx) / (tz - sz);
                        //     if(x > px) {
                        //         flag = !flag;
                        //     }
                        // }
                    }
                    if(flag){
                        vsOutput.positionMC.z = tem1.z ;
                        // vsOutput.positionMC.y = tem1.y ;
                    }
                }
            `
        });*!/

        let dragActive = false;
        const dragCenter = new Cartesian2();
        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            const pickedFeature = viewer.scene.pick(movement.position);
            if (!pickedFeature) {
                return;
            }

            viewer.scene.screenSpaceCameraController.enableInputs = false;

            // set the new drag center
            dragActive = true;
            movement.position.clone(dragCenter);
        }, ScreenSpaceEventType.LEFT_DOWN);

        const scratchDrag = new Cartesian2();
        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            if (dragActive) {
                // get the mouse position relative to the center of the screen
                const drag = Cartesian3.subtract(
                    movement.endPosition,
                    dragCenter,
                    scratchDrag
                );

                // Update uniforms
                tileset.customShader.setUniform('u_drag', drag);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);

        viewer.screenSpaceEventHandler.setInputAction((movement) => {
            viewer.scene.screenSpaceCameraController.enableInputs = true;
            dragActive = false;
        }, ScreenSpaceEventType.LEFT_UP);

        const startTime = performance.now();
        viewer.scene.postUpdate.addEventListener(() => {
            const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
            tileset.customShader .setUniform('u_time', elapsedTimeSeconds);
        });*/
    }

    /**
     * 模型炸开。
     */
    explodeModel() {
        CesiumUtil.customShader({
            type: 'explode',
            viewer: this.viewer,
            tileset: CesiumUtil.getPrimitiveByField(this.viewer.scene.primitives, 'OsmBuildings')
        });
    }

    /**
     * 模型渲染。
     */
    renderModel() {
        CesiumUtil.customShader({
            type: 'render',
            viewer: this.viewer,
            tileset: CesiumUtil.getPrimitiveByField(this.viewer.scene.primitives, 'OsmBuildings')
        });
    }

    //#endregion

    //#region 分析

    viewShedAnalyse() {
        //TODO:可视域分析
        //ViewShedAnalysis(this.viewer);
    }

    //#endregion

    //#endregion

    //#region 测试

    test() {
        this._test.execute();
    }

    //#endregion
}
