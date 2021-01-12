import defined from "cesium/Source/Core/defined.js";
import destroyObject from "cesium/Source/Core/destroyObject.js";
import DeveloperError from "cesium/Source/Core/DeveloperError.js";
import ScreenSpaceEventHandler from "cesium/Source/Core/ScreenSpaceEventHandler.js";
import knockout from "cesium/Source/ThirdParty/knockout.js";

class MapOptionsViewModel {
    constructor(viewer, container) {
        if (!defined(viewer)) {
            throw new DeveloperError("viewer is required");
        }
        if (!defined(container)) {
            throw new DeveloperError("container is required");
        }

        const that = this;
        const scene = viewer.scene;
        const globe = scene.globe;
        const canvas = scene.canvas;
        const eventHandler = new ScreenSpaceEventHandler(canvas);

        this._scene = viewer.scene;
        this._eventHandler = eventHandler;
        this._removePostRenderEvent = scene.postRender.addEventListener(function () {
            that._update();
        });
        this._subscribes = [];

        Object.assign(this,{"viewerShadows":false,
            "globeEnableLighting":false,
            "globeShowGroundAtmosphere":true,
            "globeTranslucencyEnabled":false,
            "globeShow":false,
            "globeDepthTestAgainstTerrain":false,
            "globeWireFrame":false,
            "sceneSkyAtmosphereShow":true,
            "sceneFogEnabled":true,
            "sceneRequestRenderMode":false,
            "sceneLogarithmicDepthBuffer":false,
            "sceneDebugShowFramesPerSecond":false,
            "sceneDebugShowFrustumPlanes":false,
            "sceneEnableCollisionDetection":false,
            "sceneBloomEnabled":false})
        knockout.track(this);
        /*knockout.track(this, [
            "viewerShadows",
            "globeEnableLighting",
            "globeShowGroundAtmosphere",
            "globeTranslucencyEnabled",
            "globeShow",
            "globeDepthTestAgainstTerrain",
            "globeWireFrame",
            "sceneSkyAtmosphereShow",
            "sceneFogEnabled",
            "sceneRequestRenderMode",
            "sceneLogarithmicDepthBuffer",
            "sceneDebugShowFramesPerSecond",
            "sceneDebugShowFrustumPlanes",
            "sceneEnableCollisionDetection",
            "sceneBloomEnabled"
        ]);*/
        const props = [
            ["viewerShadows", viewer, "shadows"],
            ["globeEnableLighting", globe, "enableLighting"],
            ["globeShowGroundAtmosphere", globe, "showGroundAtmosphere"],
            ["globeTranslucencyEnabled", globe.translucency, "enabled"],
            ["globeShow", globe, "show"],
            ["globeDepthTestAgainstTerrain", globe, "depthTestAgainstTerrain "],
            ["globeWireFrame", globe._surface.tileProvider._debug, "wireframe "],
            ["sceneSkyAtmosphereShow", scene.skyAtmosphere, "show"],
            ["sceneFogEnabled", scene.fog, "enabled"],
            ["sceneRequestRenderMode", scene, "requestRenderMode"],
            ["sceneLogarithmicDepthBuffer", scene, "logarithmicDepthBuffer"],
            ["sceneDebugShowFramesPerSecond", scene, "debugShowFramesPerSecond"],
            ["sceneDebugShowFrustumPlanes", scene, "debugShowFrustumPlanes"],
            ["sceneEnableCollisionDetection", scene.screenSpaceCameraController, "enableCollisionDetection"],
            ["sceneBloomEnabled", scene.postProcessStages.bloom, "enabled"]
        ];
        props.forEach(value => this.subscribe(value[0], value[1], value[2]));

        // this._frustumsSubscription = knockout
        //     .getObservable(this, "sceneFrustums")
        //     .subscribe(function (val) {
        //         scene.debugShowFrustums = val;
        //         scene.requestRender();
        //     });
        // if (name === "sceneBloomEnabled"){
        //     bloom.uniforms.glowOnly = false;
        //     bloom.uniforms.contrast = 128;
        //     bloom.uniforms.brightness = -0.3;
        //     bloom.uniforms.delta = 1.0;
        //     bloom.uniforms.sigma = 3.78;
        //     bloom.uniforms.stepSize = 5.0;
        // }
    }

    _update() {

    }

    destroy() {
        this._eventHandler.destroy();
        this._removePostRenderEvent();
        // this._frustumsSubscription.dispose();
        for (let i = this._subscribes.length - 1; i >= 0; i--) {
            this._subscribes[i].dispose();
            this._subscribes.pop();
        }
        return destroyObject(this);
    }

    subscribe(name, obj, prop) {
        const that = this;
        const result = knockout
            .getObservable(that, name)
            .subscribe(() => {
                obj[prop] = that[name];
                that._scene.requestRender();
                if (name === "sceneEnableCollisionDetection"){
                    obj[prop] = !that[name];
                }
            });
        this._subscribes.push(result);
        console.log(this.globeShowGroundAtmosphere);
    }
}

export default MapOptionsViewModel;