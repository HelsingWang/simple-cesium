import {
    CallbackProperty,
    Cartesian3,
    Cartographic,
    Math as CesiumMath,
    Color,
    defined,
    Ellipsoid,
    HeadingPitchRoll,
    //HeightReference,
    JulianDate,
    Model,
    ScreenSpaceEventType,
    ScreenSpaceEventHandler,
    Transforms,
    SceneMode,
    Cartesian2,
    PrimitiveCollection,
    Matrix4,
    Matrix3,
    GeometryInstance,
    MaterialAppearance,
    Material, GroundPolylinePrimitive, Primitive, GroundPrimitive, SampledPositionProperty
} from 'cesium';
import {Util} from './Util';

/**
 * Cesium函数工具类。
 *
 * @alias Util
 * @category 工具类
 * @class
 * @static
 * @author Helsing
 * @since 2023/11/10
 */
export class CesiumUtil {
    //#region GLTF
    /**
     * 加载GLTF数据。
     *
     * @param {Viewer} viewer Cesium视窗。
     * @param {Object} layer 图层对象。
     * @param {string} layer.url 数据地址。
     * @param {number[]} layer.position 坐标点。
     * @param {number[]} [layer.orientation=[0,0,0]] 方位。
     * @param {number} [layer.minimumPixelSize=0] 最小像素值。
     * @param {number} [layer.maximumScale=20000] 最大比例尺。
     * @param {number} [layer.scale=1] 比例。
     * @param {string} [layer.mode='ENTITY'] 加载模式：ENTITY|PRIMITIVE。
     * @param {boolean} [layer.zoomTo=false] 是否缩放到图形。
     * @param {string} [layer.id] 图层id。
     * @return {Entity|Primitive}
     */
    static loadGltf(viewer, layer) {
        const url = layer.url;
        const id = layer.id;

        let position, realPosition;
        if (layer.position instanceof CallbackProperty) {
            position = layer.position;
            realPosition = position.getValue(JulianDate.fromIso8601(new Date().toISOString()));
        } else if (layer.position instanceof Cartesian3) {
            realPosition = position = layer.position;
        } else {
            realPosition = position = Cartesian3.fromDegrees(layer.position[0], layer.position[1], layer.position[2]);
        }

        let hpr = new HeadingPitchRoll(0, 0, 0);
        if (layer.orientation) {
            const heading = CesiumMath.toRadians(layer.orientation[0]) || 0;
            const pitch = CesiumMath.toRadians(layer.orientation[1]) || 0; // CesiumMath.toRadians(90);
            const roll = CesiumMath.toRadians(layer.orientation[2]) || 0;
            hpr = new HeadingPitchRoll(heading, pitch, roll);
        }

        const orientation = Transforms.headingPitchRollQuaternion(realPosition, hpr);
        const minimumPixelSize = layer.minimumPixelSize || 0;
        const maximumScale = layer.maximumScale || 20000;
        const scale = layer.scale || 1;

        let ret;
        const mode = layer.mode || 'ENTITY';
        if (mode.toUpperCase() === 'ENTITY') {
            ret = viewer.entities.add({
                name: url,
                position: position,
                orientation: orientation,
                model: {
                    uri: url,
                    minimumPixelSize: minimumPixelSize,
                    maximumScale: maximumScale,
                    scale: scale,
                    id: id
                }
            });
        } else {
            const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr, viewer.scene.globe.ellipsoid, Transforms.LocalFrameToFixedFrame);
            ret = viewer.scene.primitives.add(Model.fromGltf({
                url: url,
                modelMatrix: modelMatrix,
                minimumPixelSize: minimumPixelSize,
                maximumScale: maximumScale,
                scale: scale,
                id: id
                // scene: viewer.scene
            }));
            // modelPrimitive.readyPromise.then(function(model) {});
        }
        return ret;
    }

    /**
     * 移动GLTF模型。
     *
     * @param {Viewer} viewer Cesium视窗。
     */
    static moveGltf(viewer) {
        const handler = new ScreenSpaceEventHandler(viewer.canvas);
        let pickedObject = null;
        let leftDownFlag = false;

        handler.setInputAction(function (movement) {
            pickedObject = viewer.scene.pick(movement.position);
            if (defined(pickedObject) && pickedObject.primitive instanceof Model) {
                leftDownFlag = true;
                document.body.style.cursor = 'move';
                viewer.scene.screenSpaceCameraController.enableRotate = false; // 锁定相机
                pickedObject.primitive.color = new Color(1, 1, 1, .5); // 选中模型后高亮
                pickedObject.primitive.silhouetteSize = 3.0; // 选中模型后高亮
            }
        }, ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function () {
            if (defined(pickedObject) && pickedObject.primitive instanceof Model) {
                pickedObject.primitive.color = new Color(1, 1, 1, 1);
                pickedObject.primitive.silhouetteSize = 0;
                leftDownFlag = false;
                pickedObject = null;
                viewer.scene.screenSpaceCameraController.enableRotate = true; // 解除锁定相机
                handler.destroy(); // 销毁左键监听事件
                document.body.style.cursor = 'default';
            }
        }, ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction((movement) => {
            if (leftDownFlag && defined(pickedObject) && pickedObject.primitive instanceof Model && pickedObject.primitive.modelMatrix) {
                const ray = viewer.camera.getPickRay(movement.endPosition);
                const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                const headingPitchRoll = Transforms.fixedFrameToHeadingPitchRoll(pickedObject.primitive.modelMatrix, Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame);
                Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Ellipsoid.WGS84, Transforms.eastNorthUpToFixedFrame, pickedObject.primitive.modelMatrix);
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    }

    /**
     * 选择GLTF模型。
     *
     * @param {Viewer} viewer Cesium视窗。
     * @param {function} callback 回调函数。
     */
    static selectGltf(viewer, callback) {
        const handler = new ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
            const pickedObject = viewer.scene.pick(movement.position);
            if (defined(pickedObject) && !pickedObject.primitive.isCesium3DTileset) {
                document.body.style.cursor = 'pointer';
                pickedObject.primitive.color = new Color(1, 1, 1, .5); // 选中模型后高亮
                pickedObject.primitive.silhouetteSize = 3.0; // 选中模型后高亮
                setTimeout(() => {
                    document.body.style.cursor = 'default';
                    pickedObject.primitive.color = new Color(1, 1, 1, 1);
                    pickedObject.primitive.silhouetteSize = 0;
                    handler.destroy();
                }, 500);
                typeof callback === 'function' && callback(pickedObject);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    }

    //#endregion

    //#region Primitive

    /**
     * 根据字段获取图元。
     *
     * @param {PrimitiveCollection} collection 图元集合。
     * @param {string} fieldValue 字段值。
     * @param {string} fieldName 字段名称。
     * @return {Primitive|GroundPrimitive|*} 图元对象
     */
    static getPrimitiveByField(collection, fieldValue, fieldName = 'name') {
        let result;
        for (let i = 0; i < collection.length; i++) {
            const primitive = collection.get(i);
            if (primitive[fieldName] === fieldValue) {
                result = primitive;
            } else if (primitive instanceof PrimitiveCollection) {
                // 如果图元类型为集合，则进行递归。
                result = this.getPrimitiveByField(primitive, fieldValue, fieldName);
            }
            if (result) {
                break;
            }
        }
        return result;
    }

    /**
     * 添加简易图元。
     *
     * @param {PrimitiveCollection} collection 图元集合。
     * @param {Object} options 选项。
     * @param {string} options.geometryType 几何类型。
     * @param {Geometry} options.geometry 几何图形。
     * @param {Material} [options.material] 材质。
     * @param {string|Color} [options.color] 颜色。
     * @param {number[]} [options.position] 位置。
     * @param {number} [options.heading] 偏移角。
     * @param {number} [options.pitch] 俯仰角。
     * @param {number} [options.roll] 翻滚角。
     * @param {boolean} [options.flat] 是否扁平化。
     * @param {boolean} [options.faceForward] 是否面向前面。
     * @param {boolean} [options.translucent] 是否半透明。
     * @param {boolean} [options.closed] 是否闭合。
     * @param {boolean} [options.vertexShaderSource] 顶点着色器代码。
     * @param {boolean} [options.fragmentShaderSource] 片元着色器代码。
     * @param {boolean} [options.asynchronous] 是否异步。
     * @param {boolean} [options.clampToGround] 是否贴地。
     * @return {Primitive|GroundPrimitive|GroundPolylinePrimitive} 图元。
     */
    static addSimplePrimitiveFeature(collection, options) {
        if (options) {
            let modelMatrix;
            if (options.position) {
                modelMatrix = Transforms.eastNorthUpToFixedFrame(this.getCesiumPosition(options.position));
                Matrix4.multiplyByMatrix3(modelMatrix, Matrix3.fromHeadingPitchRoll(HeadingPitchRoll.fromDegrees(options.heading ?? 0, options.pitch ?? 0, options.roll ?? 0)), modelMatrix);
            }
            const data = {
                geometryInstances: [
                    new GeometryInstance({
                        geometry: options.geometry
                        /*attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(options.color))
                        }*/
                    })
                ],
                appearance: new MaterialAppearance({
                    material: options.material || new Material({
                        fabric: {
                            type: 'Color',
                            uniforms: {
                                color: this.getCesiumColor(options.color)
                            }
                        }
                    }),
                    flat: options.flat ?? false,
                    faceForward: options.faceForward ?? false,
                    translucent: options.translucent ?? true,
                    closed: options.closed ?? false,
                    vertexShaderSource: options.vertexShaderSource,
                    fragmentShaderSource: options.fragmentShaderSource
                }),
                asynchronous: options.asynchronous ?? false,
                modelMatrix: modelMatrix
            };
            let primitive;
            if (options.geometryType === 'polyline') {
                primitive = options.clampToGround ? new GroundPolylinePrimitive(data) : new Primitive(data);
            } else {
                primitive = options.clampToGround ? new GroundPrimitive(data) : new Primitive(data);
            }

            // 自定义属性
            primitive['id'] = options['id'] ?? Util.getGuid();
            primitive['name'] = options['name'] ?? 'SimplePrimitiveFeature';
            primitive['desc'] = options['text'] ?? '简易图元要素';
            primitive['layerId'] = options['layerId'] ?? 'PRIMITIVE_FEATURE_LAYER';
            primitive['layerName'] = options['layerName'] ?? 'PrimitiveFeatureLayer';
            primitive['layerDesc'] = options['layerDesc'] ?? '图元要素图层';

            collection.add(primitive);

            return primitive;
        }
    }

    //#endregion

    //#region 动画时间轴

    /**
     * 开启动画。
     *
     * @param {Viewer} viewer 三维视窗
     */
    static startAnimation(viewer) {
        viewer.clock.shouldAnimate = true; // 启动
    }

    /**
     * 停止动画。
     *
     * @param {Viewer} viewer 三维视窗
     */
    static stopAnimation(viewer) {
        viewer.clock.shouldAnimate = false; // 停止
    }

    /**
     * 重置时间轴。
     *
     * @param {Viewer} viewer 三维视窗
     */
    static resetAnimation(viewer) {
        viewer.clockViewModel.currentTime = JulianDate.fromDate(new Date());
    }

    /**
     * 设置时间轴。
     *
     * @param {Viewer} viewer 三维视窗。
     * @param {JulianDate|Date|string} date 时间。
     */
    static setAnimationTime(viewer, date) {
        let julianDate;
        if (typeof date === 'string') {
            julianDate = JulianDate.fromDate(new Date(date));
        } else {
            if (date instanceof Date) {
                julianDate = JulianDate.fromDate(date);
            } else if (date instanceof JulianDate) {
                julianDate = date;
            }
        }
        julianDate && (viewer.clockViewModel.currentTime = julianDate);
    }

    //#endregion

    //#region 转换

    /**
     * 获取Cesium引擎使用的颜色对象。
     *
     * @param {string|Color} color CSS颜色字符串。如果传入的是"random"字符串，则返回一个随机颜色值；如果传入的是Cesium.Color对象，则返回对象本身。
     * @return {Color} Cesium颜色对象。
     */
    static getCesiumColor(color) {
        let result = Color.WHITE;
        if (color instanceof Color) {
            result = color;
        } else if (typeof color === 'string') {
            if (color?.toLowerCase() === 'random') {
                result = Color.fromRandom();
            } else if (color?.toLowerCase() === 'transparent') {
                result = Color.TRANSPARENT;
            } else {
                result = Color.fromCssColorString(color);
            }
        }
        !result && (result = Color.WHITE);
        return result;
    }

    /**
     * 获取Cesium引擎使用的世界坐标对象。
     *
     * @param position 原始坐标点。
     * @return {Cartesian3 | SampledPositionProperty | CallbackProperty} 返回值类型为坐标点、采样点属性或回调属性。
     */
    static getCesiumPosition(position) {
        let result;
        if (position instanceof Cartesian3) {
            result = position;
        } else if (position instanceof Cartographic) {
            result = Cartographic.toCartesian(position);
        } else if (position instanceof Array && position.length >= 0) {
            result = Cartesian3.fromDegrees(position[0], position[1], position[2]);
        } else if (position instanceof SampledPositionProperty || position instanceof CallbackProperty) {
            result = position;
        }
        return result;
    }

    /**
     * 改变坐标点的高度。
     *
     * @param {Cartesian3} position 笛卡尔坐标点。
     * @param {number} height 高度。
     * @param {boolean} [add] 是否新增高度，而不是替换。
     * @param {Ellipsoid} [ellipsoid] 椭球。
     * @return {Cartesian3} 新的坐标点（注意：原坐标点不变）。
     */
    static changeHeight(position, height, add = false, ellipsoid = Ellipsoid.WGS84) {
        if (defined(position)) {
            const oldCartographic = Cartographic.fromCartesian(position); // 高度调整前的弧度坐标
            const newCartographic = new Cartographic(oldCartographic.longitude, oldCartographic.latitude, add ? oldCartographic.height + height : height); // 高度调整后的弧度坐标
            return ellipsoid.cartographicToCartesian(newCartographic);
        }
    }

    //#endregion

    //#region 数学

    /**
     * 将一个点向某个方向（xyz三个距离分量）平移一段距离。
     *
     * @param position 起点。
     * @param distanceArr 距离数组。
     * @return 返回平移后的坐标。
     */
    static translate(position, distanceArr) {
        const startWorldMatrix = Transforms.eastNorthUpToFixedFrame(position);
        const translationMatrix = new Matrix4();
        const resultMatrix = new Matrix4();
        Matrix4.setTranslation(Matrix4.IDENTITY, new Cartesian3(distanceArr[0] ?? 0, distanceArr[1] ?? 0, distanceArr[2] ?? 0), translationMatrix);
        Matrix4.multiply(startWorldMatrix, translationMatrix, resultMatrix);
        const result = new Cartesian3();
        Matrix4.getTranslation(resultMatrix, result);
        return result;
    }

    //#endregion

    //#region 视图

    /**
     * 切换二三维模式。
     *
     * @param {Viewer} viewer Cesium查看器
     * @param {SceneMode|string|number} mode 模式：25d或1，2d或2，3d或3
     */
    static changeSceneMode(viewer, mode) {
        /*
        let rectangle = viewer.camera.computeViewRectangle();
        */

        /** @type {SceneMode} */
        let sceneMode = SceneMode.SCENE3D;
        if (mode) {
            if (mode === '25d') {
                sceneMode = SceneMode.COLUMBUS_VIEW; //1
            } else if (mode === '2d') {
                sceneMode = SceneMode.SCENE2D; //2
            } else if (mode === '3d') {
                sceneMode = SceneMode.SCENE3D; //3
            } else {
                sceneMode = mode;
            }
        } else {
            const currentMode = viewer.scene.mode;
            const modes = [SceneMode.COLUMBUS_VIEW, SceneMode.SCENE2D, SceneMode.SCENE3D];
            for (let i = 0; i < modes.length; i++) {
                const m = modes[i];
                if (m === currentMode) {
                    if (i === modes.length - 1) {
                        sceneMode = modes[0];
                        break;
                    } else {
                        sceneMode = modes[i + 1];
                    }
                }
            }
        }

        if (sceneMode === SceneMode.COLUMBUS_VIEW) {
            viewer.scene.morphToColumbusView(0);
        } else if (sceneMode === SceneMode.SCENE2D) {
            const cartographic = viewer.scene.camera.positionCartographic;
            let position = viewer.camera.pickEllipsoid(new Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
            position = this.changeHeight(position, cartographic.height);

            viewer.scene.morphTo2D(0);
            /* // 定位有问题，故取消动画效果
            if (rectangle) {
                setTimeout(function () {
                    viewer.camera.flyTo({
                        destination: rectangle
                    });
                }, 2000);
            }
            */
            setTimeout(() => {
                viewer.camera.setView({
                    destination: position,
                    orientation: new HeadingPitchRoll(viewer.scene.camera.heading, viewer.scene.camera.pitch, viewer.scene.camera.roll)
                });
            }, 300);
        } else if (sceneMode === SceneMode.SCENE3D) {
            // 二维切三维无法定位，故取消动画效果
            viewer.scene.morphTo3D(0);
        }

    }

    //#endregion
}