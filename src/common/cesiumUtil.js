import CallbackProperty from "cesium/Source/DataSources/CallbackProperty.js";
import Cartesian3 from "cesium/Source/Core/Cartesian3.js";
import Cartographic from "cesium/Source/Core/Cartographic.js";
import CesiumMath from "cesium/Source/Core/Math.js";
import Color from "cesium/Source/Core/Color.js";
import defined from "cesium/Source/Core/defined.js";
import Ellipsoid from "cesium/Source/Core/Ellipsoid.js";
import HeadingPitchRoll from "cesium/Source/Core/HeadingPitchRoll.js";
// import HeightReference from "cesium/Source/Scene/HeightReference.js";
import JulianDate from "cesium/Source/Core/JulianDate.js";
import Model from "cesium/Source/Scene/Model.js";
import ScreenSpaceEventType from "cesium/Source/Core/ScreenSpaceEventType.js";
import ScreenSpaceEventHandler from "cesium/Source/Core/ScreenSpaceEventHandler.js";
import Transforms from "cesium/Source/Core/Transforms.js";

/**
 * 加载GLTF数据。
 *
 * @author Helsing
 * @date 2018/11/09
 * @param {Viewer} viewer Cesium视窗。
 * @param {Object} layer 图层对象。
 * @param {String} layer.url 数据地址。
 * @param {Number[]} layer.position 坐标点。
 * @param {Number[]} [layer.orientation=[0,0,0]] 方位。
 * @param {Number} [layer.minimumPixelSize=0] 最小像素值。
 * @param {Number} [layer.maximumScale=20000] 最大比例尺。
 * @param {Number} [layer.scale=1] 比例。
 * @param {String} [layer.mode='ENTITY'] 加载模式：ENTITY|PRIMITIVE。
 * @param {Boolean} [layer.zoomTo=false] 是否缩放到图形。
 * @param {String} [layer.id] 图层id。
 * @return {Entity|Primitive} 实体对象。
 */
function loadGltf(viewer, layer) {
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
    const mode = layer.mode || "ENTITY";
    if (mode.toUpperCase() === "ENTITY") {
        ret = viewer.entities.add({
            name: url,
            position: position,
            orientation: orientation,
            model: {
                uri: url,
                minimumPixelSize: minimumPixelSize,
                maximumScale: maximumScale,
                scale: scale,
                id: id,
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
            id: id,
            // scene: viewer.scene
        }));
        // modelPrimitive.readyPromise.then(function(model) {});
    }
    return ret;
}

/**
 * 移动GLTF模型。
 *
 * @author Helsing
 * @date 2020/01/24
 * @param {Viewer} viewer Cesium视窗。
 */
function moveGltf(viewer) {
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
 * @author Helsing
 * @date 2020/01/24
 * @param {Viewer} viewer Cesium视窗。
 * @param {Function} callback 回调函数。
 */
function selectGltf(viewer, callback) {
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
            }, 500)
            typeof callback === "function" && callback(pickedObject);
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * 改变坐标点的高度。
 *
 * @author Helsing
 * @date 2020/01/19
 * @param {Cartesian3} cartesian3 笛卡尔坐标点。
 * @param {Number} height 高度。
 * @param {Ellipsoid} ellipsoid 椭球。
 * @return {Cartesian3} 新的坐标点（注意：原坐标点不变）。
 */
function changeHeight(cartesian3, height, ellipsoid = Ellipsoid.WGS84) {
    if (defined(cartesian3)) {
        const oldCartographic = Cartographic.fromCartesian(cartesian3); // 高度调整前的弧度坐标
        const newCartographic = new Cartographic(oldCartographic.longitude, oldCartographic.latitude, height); // 高度调整后的弧度坐标
        return ellipsoid.cartographicToCartesian(newCartographic);
    }
}

export {
    loadGltf,
    moveGltf,
    selectGltf,
    changeHeight
}