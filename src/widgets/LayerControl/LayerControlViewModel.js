import defined from "cesium/Source/Core/defined.js";
import defaultValue from "cesium/Source/Core/defaultValue.js";
import destroyObject from "cesium/Source/Core/destroyObject.js";
import DeveloperError from "cesium/Source/Core/DeveloperError.js";
import EventHelper from "cesium/Source/Core/EventHelper.js";
import Model from "cesium/Source/Scene/Model.js";
import PrimitiveCollection from "cesium/Source/Scene/PrimitiveCollection.js";
import ScreenSpaceEventHandler from "cesium/Source/Core/ScreenSpaceEventHandler.js";
import CesiumTerrainProvider from "cesium/Source/Core/CesiumTerrainProvider.js";
import EllipsoidTerrainProvider from "cesium/Source/Core/EllipsoidTerrainProvider.js";
import IonResource from "cesium/Source/Core/IonResource.js";
import knockout from "cesium/Source/ThirdParty/knockout.js";

class LayerControlViewModel {
    constructor(viewer) {
        if (!defined(viewer)) {
            throw new DeveloperError("viewer is required");
        }

        const that = this;
        const scene = viewer.scene;
        const canvas = scene.canvas;
        const eventHandler = new ScreenSpaceEventHandler(canvas);

        this._viewer = viewer;
        this._eventHandler = eventHandler;
        this._removePostRenderEvent = scene.postRender.addEventListener(function () {
            that._update();
        });
        this._subscribes = [];
        this.primitiveLayers = [];
        this.entityLayers = [];
        this.imageryLayers = [];
        this.terrainLayers = [];


        Object.assign(this, {
            "viewerShadows": defaultValue(viewer.shadows, false),
        })
        knockout.track(this);
        const props = [
            ["viewerShadows", viewer, "shadows"]
        ];
        props.forEach(value => this._subscribe(value[0], value[1], value[2]));

        const helper = new EventHelper();
        // 底图加载完成后的事件
        helper.add(viewer.scene.globe.tileLoadProgressEvent, function (event) {
            if (event === 0) {
                that._updatePrimitiveLayers();
                that._updateEntityLayers();
                that._updateImageryLayers();
                that._updateTerrainLayers();
            }
        });
    }

    destroy() {
        this._eventHandler.destroy();
        this._viewer.scene.postRender.removeEventListener(this._removePostRenderEvent);
        for (let i = this._subscribes.length - 1; i >= 0; i--) {
            this._subscribes[i].dispose();
            this._subscribes.pop();
        }
        return destroyObject(this);
    }

    _update() {

    }

    _subscribe(name, obj, prop) {
        const that = this;
        const result = knockout
            .getObservable(that, name)
            .subscribe(() => {
                obj[prop] = that[name];
                that._viewer.scene.requestRender();
            });
        this._subscribes.push(result);
    }

    _updatePrimitiveLayers() {
        const layers = this._viewer.scene.primitives;
        const count = layers.length;
        this.primitiveLayers.splice(0, this.primitiveLayers.length);
        for (let i = count - 1; i >= 0; --i) {
            const layer = layers.get(i);
            if (!layer.name) {
                if (layer.isCesium3DTileset) {
                    layer.url && (layer.name = layer.url.substring(0, layer.url.lastIndexOf("/"))
                        .replace(/^(.*[\/\\])?(.*)*$/, '$2'));
                } else if (layer instanceof Model) {
                    layer._resource && (layer.name = layer._resource.url.replace(/^(.*[\/\\])?(.*)*(\.[^.?]*.*)$/, '$2'));
                } else if (layer instanceof PrimitiveCollection) {
                    layer.name = `PrimitiveCollection_${layer._guid}`;
                }
            }
            !layer.name && (layer.name = "[未命名]");
            this.primitiveLayers.push(layer);
            knockout.track(layer, ["show", "name"]);
        }
    }

    _updateEntityLayers() {
        const layers = this._viewer.entities.values;
        const count = layers.length;
        this.entityLayers.splice(0, this.entityLayers.length);
        for (let i = count - 1; i >= 0; --i) {
            const layer = layers[i];
            !layer.name && (layer.name = "[未命名]");
            layer.name = layer.name.replace(/^(.*[\/\\])?(.*)*(\.[^.?]*.*)$/, '$2')
            this.entityLayers.push(layer);
            knockout.track(layer, ["show", "name"]);
        }
    }

    _updateImageryLayers() {
        const layers = this._viewer.imageryLayers;
        const count = layers.length;
        this.imageryLayers.splice(0, this.imageryLayers.length);
        for (let i = count - 1; i >= 0; --i) {
            const layer = layers.get(i);
            if (!layer.name) {
                layer.name = layer.imageryProvider._resource.url;
            }
            !layer.name && (layer.name = "[未命名]");
            this.imageryLayers.push(layer);
            knockout.track(layer, ["alpha", "show", "name"]);
        }
    }

    _updateTerrainLayers() {
        const that = this;
        this.terrainLayers.splice(0, this.terrainLayers.length);
        const layer = this._viewer.terrainProvider;

        const realLayers = that._viewer.terrainProvider._layers;
        const realShow = !!(realLayers && realLayers.length > 0);
        if (!layer.name && realShow) {
            layer.name = realLayers[0].resource._url + realLayers[0].tileUrlTemplates;
        }
        !layer.name && (layer.name = "[默认地形]");
        // 定义show属性
        !defined(layer.show) && Object.defineProperties(layer, {
            show: {
                get: function () {
                    return realShow;
                },
                configurable: true
            },
        });

        if (realShow !== layer.show) {
            let terrainProvider;
            if (!layer.show) {
                // add a simple terain so no terrain shall be preseneted
                terrainProvider = new EllipsoidTerrainProvider();
            } else {
                // enable the terain
                terrainProvider = new CesiumTerrainProvider({
                    url: IonResource.fromAssetId(3956),//'//cesiumjs.org/stk-terrain/tilesets/world/tiles',
                    requestWaterMask: true
                });
            }
            that._viewer.terrainProvider = terrainProvider;
        }

        this.terrainLayers.push(layer);
        knockout.track(layer, ["alpha", "show", "name"]);

    }
}

export default LayerControlViewModel;