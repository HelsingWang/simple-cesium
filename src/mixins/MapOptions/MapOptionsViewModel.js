import * as Cesium from 'cesium';
import knockout from '/node_modules/@cesium/widgets/Source/ThirdParty/knockout';

export class MapOptionsViewModel {
    constructor(viewer) {
        if (!Cesium.defined(viewer)) {
            throw new Cesium.DeveloperError('viewer is required');
        }

        const that = this;
        const scene = viewer.scene;
        const globe = scene.globe;
        const canvas = scene.canvas;
        const eventHandler = new Cesium.ScreenSpaceEventHandler(canvas);

        this._viewer = viewer;
        this._eventHandler = eventHandler;
        this._removePostRenderEvent = scene.postRender.addEventListener(function () {
            that._update();
        });
        this._subscribes = [];

        Object.assign(this, {
            'viewerShadows': Cesium.defaultValue(viewer.shadows, false),
            'globeEnableLighting': Cesium.defaultValue(globe.enableLighting, false),
            'globeShowGroundAtmosphere': Cesium.defaultValue(globe.showGroundAtmosphere, true),
            'globeTranslucencyEnabled': Cesium.defaultValue(globe.translucency.enabled, false),
            'globeShow': Cesium.defaultValue(globe.show, true),
            'globeDepthTestAgainstTerrain': Cesium.defaultValue(globe.depthTestAgainstTerrain, false),
            'globeWireFrame': Cesium.defaultValue(globe._surface.tileProvider._debug.wireFrame, false),
            'sceneSkyAtmosphereShow': Cesium.defaultValue(scene.skyAtmosphere.show, true),
            'sceneFogEnabled': Cesium.defaultValue(scene.fog.enabled, true),
            'sceneRequestRenderMode': Cesium.defaultValue(scene.requestRenderMode, false),
            'sceneLogarithmicDepthBuffer': Cesium.defaultValue(scene.logarithmicDepthBuffer, false),
            'sceneDebugShowFramesPerSecond': Cesium.defaultValue(scene.debugShowFramesPerSecond, false),
            'sceneDebugShowFrustumPlanes': Cesium.defaultValue(scene.debugShowFrustumPlanes, false),
            'sceneEnableCollisionDetection': Cesium.defaultValue(scene.enableCollisionDetection, false),
            'sceneBloomEnabled': Cesium.defaultValue(scene.postProcessStages.bloom.enabled, false)
        });
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
            ['viewerShadows', viewer, 'shadows'],
            ['globeEnableLighting', globe, 'enableLighting'],
            ['globeShowGroundAtmosphere', globe, 'showGroundAtmosphere'],
            ['globeTranslucencyEnabled', globe.translucency, 'enabled'],
            ['globeShow', globe, 'show'],
            ['globeDepthTestAgainstTerrain', globe, 'depthTestAgainstTerrain'],
            ['globeWireFrame', globe._surface.tileProvider._debug, 'wireframe'],
            ['sceneSkyAtmosphereShow', scene.skyAtmosphere, 'show'],
            ['sceneFogEnabled', scene.fog, 'enabled'],
            ['sceneRequestRenderMode', scene, 'requestRenderMode'],
            ['sceneLogarithmicDepthBuffer', scene, 'logarithmicDepthBuffer'],
            ['sceneDebugShowFramesPerSecond', scene, 'debugShowFramesPerSecond'],
            ['sceneDebugShowFrustumPlanes', scene, 'debugShowFrustumPlanes'],
            ['sceneEnableCollisionDetection', scene.screenSpaceCameraController, 'enableCollisionDetection'],
            ['sceneBloomEnabled', scene.postProcessStages.bloom, 'enabled']
        ];
        props.forEach(value => this._subscribe(value[0], value[1], value[2]));

        // this._frustumsSubscription = knockout
        //     .getObservable(this, "sceneFrustums")
        //     .subscribe(function (val) {
        //         scene.debugShowFrustums = val;
        //         scene.requestRender();
        //     });
    }

    destroy() {
        this._eventHandler.destroy();
        this._viewer.scene.postRender.removeEventListener(this._removePostRenderEvent);
        // this._frustumsSubscription.dispose();
        for (let i = this._subscribes.length - 1; i >= 0; i--) {
            this._subscribes[i].dispose();
            this._subscribes.pop();
        }
        return Cesium.destroyObject(this);
    }

    _update() {

    }

    _subscribe(name, obj, prop) {
        const that = this;
        const result = Cesium.knockout
            .getObservable(that, name)
            .subscribe(() => {
                obj[prop] = that[name];
                that._viewer.scene.requestRender();
                if (name === 'sceneEnableCollisionDetection') {
                    obj[prop] = !that[name];
                } else if (name === 'globeTranslucencyEnabled') {
                    obj.frontFaceAlpha = 0.5;
                } else if (name === 'sceneBloomEnabled') {
                    obj.uniforms.glowOnly = false;
                    obj.uniforms.contrast = 128;
                    obj.uniforms.brightness = -0.3;
                    obj.uniforms.delta = 1.0;
                    obj.uniforms.sigma = 3.78;
                    obj.uniforms.stepSize = 5.0;
                }
            });
        this._subscribes.push(result);
    }
}
