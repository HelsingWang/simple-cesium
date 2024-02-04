import * as Cesium from 'cesium';
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
     * @param {Cesium.Viewer} viewer Cesium视窗。
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
        if (layer.position instanceof Cesium.CallbackProperty) {
            position = layer.position;
            realPosition = position.getValue(Cesium.JulianDate.fromIso8601(new Date().toISOString()));
        } else if (layer.position instanceof Cesium.Cartesian3) {
            realPosition = position = layer.position;
        } else {
            realPosition = position = Cesium.Cartesian3.fromDegrees(layer.position[0], layer.position[1], layer.position[2]);
        }

        let hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
        if (layer.orientation) {
            const heading = Cesium.Math.toRadians(layer.orientation[0]) || 0;
            const pitch = Cesium.Math.toRadians(layer.orientation[1]) || 0; // CesiumMath.toRadians(90);
            const roll = Cesium.Math.toRadians(layer.orientation[2]) || 0;
            hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        }

        const orientation = Cesium.Transforms.headingPitchRollQuaternion(realPosition, hpr);
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
            const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr, viewer.scene.globe.ellipsoid, Cesium.Transforms.LocalFrameToFixedFrame);
            ret = viewer.scene.primitives.add(Cesium.Model.fromGltf({
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
     * @param {Cesium.Viewer} viewer Cesium视窗。
     */
    static moveGltf(viewer) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        let pickedObject = null;
        let leftDownFlag = false;

        handler.setInputAction(function (movement) {
            pickedObject = viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.Model) {
                leftDownFlag = true;
                document.body.style.cursor = 'move';
                viewer.scene.screenSpaceCameraController.enableRotate = false; // 锁定相机
                pickedObject.primitive.color = new Cesium.Color(1, 1, 1, .5); // 选中模型后高亮
                pickedObject.primitive.silhouetteSize = 3.0; // 选中模型后高亮
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function () {
            if (Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.Model) {
                pickedObject.primitive.color = new Cesium.Color(1, 1, 1, 1);
                pickedObject.primitive.silhouetteSize = 0;
                leftDownFlag = false;
                pickedObject = null;
                viewer.scene.screenSpaceCameraController.enableRotate = true; // 解除锁定相机
                handler.destroy(); // 销毁左键监听事件
                document.body.style.cursor = 'default';
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction((movement) => {
            if (leftDownFlag && Cesium.defined(pickedObject) && pickedObject.primitive instanceof Cesium.Model && pickedObject.primitive.modelMatrix) {
                const ray = viewer.camera.getPickRay(movement.endPosition);
                const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                const headingPitchRoll = Cesium.Transforms.fixedFrameToHeadingPitchRoll(pickedObject.primitive.modelMatrix, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame);
                Cesium.Transforms.headingPitchRollToFixedFrame(cartesian, headingPitchRoll, Cesium.Ellipsoid.WGS84, Cesium.Transforms.eastNorthUpToFixedFrame, pickedObject.primitive.modelMatrix);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    /**
     * 选择GLTF模型。
     *
     * @param {Cesium.Viewer} viewer Cesium视窗。
     * @param {function} callback 回调函数。
     */
    static selectGltf(viewer, callback) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function (movement) {
            const pickedObject = viewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject) && !pickedObject.primitive.isCesium3DTileset) {
                document.body.style.cursor = 'pointer';
                pickedObject.primitive.color = new Cesium.Color(1, 1, 1, .5); // 选中模型后高亮
                pickedObject.primitive.silhouetteSize = 3.0; // 选中模型后高亮
                setTimeout(() => {
                    document.body.style.cursor = 'default';
                    pickedObject.primitive.color = new Cesium.Color(1, 1, 1, 1);
                    pickedObject.primitive.silhouetteSize = 0;
                    handler.destroy();
                }, 500);
                typeof callback === 'function' && callback(pickedObject);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
            } else if (primitive instanceof Cesium.PrimitiveCollection) {
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
                modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(this.getCesiumPosition(options.position));
                Cesium.Matrix4.multiplyByMatrix3(modelMatrix, Cesium.Matrix3.fromHeadingPitchRoll(Cesium.HeadingPitchRoll.fromDegrees(options.heading ?? 0, options.pitch ?? 0, options.roll ?? 0)), modelMatrix);
            }
            const data = {
                geometryInstances: [
                    new Cesium.GeometryInstance({
                        geometry: options.geometry
                        /*attributes: {
                            color: ColorGeometryInstanceAttribute.fromColor(Color.fromCssColorString(options.color))
                        }*/
                    })
                ],
                appearance: new Cesium.MaterialAppearance({
                    material: options.material || new Cesium.Material({
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
                primitive = options.clampToGround ? new Cesium.GroundPolylinePrimitive(data) : new Cesium.Primitive(data);
            } else {
                primitive = options.clampToGround ? new Cesium.GroundPrimitive(data) : new Cesium.Primitive(data);
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
     * @param {Cesium.Viewer} viewer 三维视窗
     */
    static startAnimation(viewer) {
        viewer.clock.shouldAnimate = true; // 启动
    }

    /**
     * 停止动画。
     *
     * @param {Cesium.Viewer} viewer 三维视窗
     */
    static stopAnimation(viewer) {
        viewer.clock.shouldAnimate = false; // 停止
    }

    /**
     * 重置时间轴。
     *
     * @param {Cesium.Viewer} viewer 三维视窗
     */
    static resetAnimation(viewer) {
        viewer.clockViewModel.currentTime = Cesium.JulianDate.fromDate(new Date());
    }

    /**
     * 设置时间轴。
     *
     * @param {Cesium.Viewer} viewer 三维视窗。
     * @param {JulianDate|Date|string} date 时间。
     */
    static setAnimationTime(viewer, date) {
        let julianDate;
        if (typeof date === 'string') {
            julianDate = Cesium.JulianDate.fromDate(new Date(date));
        } else {
            if (date instanceof Date) {
                julianDate = Cesium.JulianDate.fromDate(date);
            } else if (date instanceof Cesium.JulianDate) {
                julianDate = date;
            }
        }
        julianDate && (viewer.clockViewModel.currentTime = julianDate);
    }

    //#endregion

    //#region 转换

    /**
     * 屏幕坐标转世界坐标。
     *
     * @param scene 三维场景。
     * @param windowCoordinates 屏幕坐标。
     * @param [result] 返回值。
     */
    static cartesian2ToCartesian3(scene, windowCoordinates, result) {
        let pick;
        if (windowCoordinates instanceof Cesium.Cartesian2) {
            pick = windowCoordinates;
        } else if (windowCoordinates instanceof Array) {
            pick = Cesium.Cartesian2.fromArray(windowCoordinates);
        }
        if (scene.pickPositionSupported) {
            const ray = scene.camera.getPickRay(pick);
            if (Cesium.defined(ray)) {
                result = scene.globe.pick(ray, scene, result);
                if (!result) {
                    result = scene.camera.pickEllipsoid(pick, scene.globe.ellipsoid, result);
                }
            }
        }
        return result;
    }

    /**
     * 世界坐标转经纬度坐标。
     *
     * @param worldCoordinates 世界坐标。
     * @param [ellipsoid] 空间参考椭球。
     */
    static cartesian3ToDegrees(worldCoordinates, ellipsoid) {
        const cartographic = Cesium.Cartographic.fromCartesian(worldCoordinates, ellipsoid);
        return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height];
    }

    /**
     * 获取Cesium引擎使用的颜色对象。
     *
     * @param {string|Color} color CSS颜色字符串。如果传入的是"random"字符串，则返回一个随机颜色值；如果传入的是Cesium.Color对象，则返回对象本身。
     * @return {Color} Cesium颜色对象。
     */
    static getCesiumColor(color) {
        let result = Cesium.Color.WHITE;
        if (color instanceof Cesium.Color) {
            result = color;
        } else if (typeof color === 'string') {
            if (color?.toLowerCase() === 'random') {
                result = Cesium.Color.fromRandom();
            } else if (color?.toLowerCase() === 'transparent') {
                result = Cesium.Color.TRANSPARENT;
            } else {
                result = Cesium.Color.fromCssColorString(color);
            }
        }
        !result && (result = Cesium.Color.WHITE);
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
        if (position instanceof Cesium.Cartesian3) {
            result = position;
        } else if (position instanceof Cesium.Cartographic) {
            result = Cesium.Cartographic.toCartesian(position);
        } else if (position instanceof Array && position.length >= 0) {
            result = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);
        } else if (position instanceof Cesium.SampledPositionProperty || position instanceof Cesium.CallbackProperty) {
            result = position;
        }
        return result;
    }

    /**
     * 改变坐标点的高度。
     *
     * @param {Cesium.Cartesian3} position 笛卡尔坐标点。
     * @param {number} height 高度。
     * @param {boolean} [add] 是否新增高度，而不是替换。
     * @param {Cesium.Ellipsoid} [ellipsoid] 椭球。
     * @return {Cesium.Cartesian3} 新的坐标点（注意：原坐标点不变）。
     */
    static changeHeight(position, height, add = false, ellipsoid = Cesium.Ellipsoid.WGS84) {
        if (Cesium.defined(position)) {
            const oldCartographic = Cesium.Cartographic.fromCartesian(position); // 高度调整前的弧度坐标
            const newCartographic = new Cesium.Cartographic(oldCartographic.longitude, oldCartographic.latitude, add ? oldCartographic.height + height : height); // 高度调整后的弧度坐标
            return Cesium.Ellipsoid.cartographicToCartesian(newCartographic);
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
        const startWorldMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
        const translationMatrix = new Cesium.Matrix4();
        const resultMatrix = new Cesium.Matrix4();
        Cesium.Matrix4.setTranslation(Cesium.Matrix4.IDENTITY, new Cesium.Cartesian3(distanceArr[0] ?? 0, distanceArr[1] ?? 0, distanceArr[2] ?? 0), translationMatrix);
        Cesium.Matrix4.multiply(startWorldMatrix, translationMatrix, resultMatrix);
        const result = new Cesium.Cartesian3();
        Cesium.Matrix4.getTranslation(resultMatrix, result);
        return result;
    }

    //#endregion

    //#region 视图

    /**
     * 切换二三维模式。
     *
     * @param {Cesium.Viewer} viewer Cesium查看器
     * @param {SceneMode|string|number} mode 模式：25d或1，2d或2，3d或3
     */
    static changeSceneMode(viewer, mode) {
        /*
        let rectangle = viewer.camera.computeViewRectangle();
        */

        /** @type {SceneMode} */
        let sceneMode = Cesium.SceneMode.SCENE3D;
        if (mode) {
            if (mode === '25d') {
                sceneMode = Cesium.SceneMode.COLUMBUS_VIEW; //1
            } else if (mode === '2d') {
                sceneMode = Cesium.SceneMode.SCENE2D; //2
            } else if (mode === '3d') {
                sceneMode = Cesium.SceneMode.SCENE3D; //3
            } else {
                sceneMode = mode;
            }
        } else {
            const currentMode = viewer.scene.mode;
            const modes = [Cesium.SceneMode.COLUMBUS_VIEW, Cesium.SceneMode.SCENE2D, Cesium.SceneMode.SCENE3D];
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

        if (sceneMode === Cesium.SceneMode.COLUMBUS_VIEW) {
            viewer.scene.morphToColumbusView(0);
        } else if (sceneMode === Cesium.SceneMode.SCENE2D) {
            const cartographic = viewer.scene.camera.positionCartographic;
            let position = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
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
                    orientation: new Cesium.HeadingPitchRoll(viewer.scene.camera.heading, viewer.scene.camera.pitch, viewer.scene.camera.roll)
                });
            }, 300);
        } else if (sceneMode === Cesium.SceneMode.SCENE3D) {
            // 二维切三维无法定位，故取消动画效果
            viewer.scene.morphTo3D(0);
        }

    }

    /**
     * 获取相机视角信息。
     *
     * @param {Camera} camera 三维视窗。
     * @param {string} lineBreak 换行符。
     * @return {string} JSON格式字符串。
     */
    static getCameraInfo(camera, lineBreak = '\n') {
        let text = '';
        text += 'longitude: ' + Cesium.Math.toDegrees(camera.positionCartographic.longitude) + ',' + lineBreak;
        text += 'latitude: ' + Cesium.Math.toDegrees(camera.positionCartographic.latitude) + ',' + lineBreak;
        text += 'height: ' + camera.positionCartographic.height + ',' + lineBreak;
        text += 'heading: ' + Cesium.Math.toDegrees(camera.heading) + ',' + lineBreak;
        text += 'pitch: ' + Cesium.Math.toDegrees(camera.pitch) + ',' + lineBreak;
        text += 'roll: ' + Cesium.Math.toDegrees(camera.roll) + ',' + lineBreak;
        return text;
    }

    /**
     * 点击拾取坐标信息。
     *
     * @param {Cesium.Viewer} viewer 三维视窗。
     * @param {function} callback 回调函数。
     */
    static pickPoint(viewer, callback) {
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction((movement) => {
            handler.destroy();
            typeof callback === 'function' && callback(viewer.scene.pickPosition(movement.position));
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //#endregion

    //#region 着色器

    /**
     * 模型压平。
     *
     * @param {Object} [options] 选项。
     */
    static customShader(options = {}) {
        const type = options.type || 'render';
        const viewer = options.viewer;
        const tileset = options.tileset;
        // const positions = options.positions;
        // 如果是GLTF模型，则设置为模型的中心。
        // const center = tileset.boundingSphere.center;
        const center = this.getCesiumPosition(options.position || [121.49515381925019, 31.241921435952527, 20]);
        const modelCenterMat = new Cesium.Matrix4();
        const inverseModelCenterMat = new Cesium.Matrix4();
        Cesium.Transforms.eastNorthUpToFixedFrame(center, viewer.scene.globe.ellipsoid, modelCenterMat);
        Cesium.Matrix4.inverse(modelCenterMat, inverseModelCenterMat);
        const flatteningHeight = options.flatteningHeight ?? 0;
        let vertexShaderText;
        let fragmentShaderText;

        switch (type) {
            case 'flatten' :
                vertexShaderText = `
                    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {                  
                    // 模型世界坐标的齐次坐标 = 中心点逆矩阵 * Cesium模型转换矩阵 * 模型局部坐标的齐次坐标
                    vec4 worldPosition = u_inverseModelCenterMat * czm_model * vec4(vsInput.attributes.positionMC, 1.0);
                    // 当模型世界坐标的z值大于压平高度值时，将z值设为高度值。
                    if (worldPosition.z > u_flatteningHeight) {
                        worldPosition.z = u_flatteningHeight;
                    }
                    // 模型局部坐标的齐次坐标 = Cesium模型转换逆矩阵 * 中心点矩阵 * 模型世界坐标的齐次坐标
                    vec4 modelPosition = czm_inverseModel * u_modelCenterMat * worldPosition;
                    // 模型局部坐标赋值
                    vsOutput.positionMC = modelPosition.xyz;
                    
                    // 直接设置模型的Z轴高度值，简单粗暴，但问题很多
                    // vsOutput.positionMC.z = u_flatteningHeight ;
                    }
                `;
                break;
            case 'explode' :
                vertexShaderText = `
                    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {                  
                       // 炸开模型
                       vsOutput.positionMC += 0.01 * u_drag.x * vsInput.attributes.normalMC;
                    }
                `;
                break;
            case 'render':
            default:
                fragmentShaderText = `
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
                        material.diffuse *= vec3(modelPosition.z / helsing_colorDepth);
                        
                        // 发光线
                        float helsing_diff = step(0.005, abs(clamp(worldPosition.z / helsing_lineHeight, 0.0, 1.0) - helsing_frame));
                        material.diffuse += material.diffuse * (1.0 - helsing_diff);
                        
                        // pbr
                        material.specular = vec3(0.1, 0.6, 1.0);
                        material.roughness = 0.1;
                    }
                `;
                break;
        }

        tileset.customShader = new Cesium.CustomShader({
            // lightingModel: LightingModel.UNLIT,
            uniforms: {
                u_flatteningHeight: {
                    type: Cesium.UniformType.FLOAT,
                    value: flatteningHeight
                },
                u_modelCenterMat: {
                    type: Cesium.UniformType.MAT4,
                    value: modelCenterMat
                },
                u_inverseModelCenterMat: {
                    type: Cesium.UniformType.MAT4,
                    value: inverseModelCenterMat
                },
                u_drag: {
                    type: Cesium.UniformType.VEC2,
                    value: new Cesium.Cartesian2(0.0, 0.0)
                },
                u_time: {
                    type: Cesium.UniformType.FLOAT,
                    value: 0
                }
            },
            vertexShaderText: vertexShaderText,
            fragmentShaderText: fragmentShaderText
        });

        /*tileset.customShader = new CustomShader({
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
        });*/

        if (type === 'explode') {
            let dragActive = false;
            const dragCenter = new Cesium.Cartesian2();
            const scratchDrag = new Cesium.Cartesian2();
            const startTime = performance.now();

            viewer.screenSpaceEventHandler.setInputAction((movement) => {
                const pickedFeature = viewer.scene.pick(movement.position);
                if (!pickedFeature) {
                    return;
                }

                viewer.scene.screenSpaceCameraController.enableInputs = false;

                // set the new drag center
                dragActive = true;
                movement.position.clone(dragCenter);
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            viewer.screenSpaceEventHandler.setInputAction((movement) => {
                if (dragActive) {
                    // get the mouse position relative to the center of the screen
                    const drag = Cesium.Cartesian3.subtract(
                        movement.endPosition,
                        dragCenter,
                        scratchDrag
                    );

                    // Update uniforms
                    tileset.customShader.setUniform('u_drag', drag);
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            viewer.screenSpaceEventHandler.setInputAction(() => {
                viewer.scene.screenSpaceCameraController.enableInputs = true;
                dragActive = false;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);

            viewer.scene.postUpdate.addEventListener(() => {
                const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
                tileset.customShader.setUniform('u_time', elapsedTimeSeconds);
            });
        }
    }

    //#endregion
}
