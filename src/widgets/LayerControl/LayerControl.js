import defined from "cesium/Source/Core/defined.js";
import DeveloperError from "cesium/Source/Core/DeveloperError.js";
import destroyObject from "cesium/Source/Core/destroyObject.js";
import knockout from "cesium/Source/ThirdParty/knockout.js";
import {bindEvent,getElement,insertHtml} from "../../common/util.js";
import LayerControlViewModel from "./LayerControlViewModel.js";
import LayerControlHtml from "./LayerControl.html";

class LayerControl {

    /**
     * Gets the parent container.
     * @memberOf LayerControl.prototype
     * @type {Element}
     */
    get container() {
        return this._container;
    }
    /**
     * Gets the view model.
     * @memberOf LayerControl.prototype
     * @type {LayerControlViewModel}
     */
    get viewModel() {
        return this._viewModel;
    }

    constructor(viewer, options={}) {
        this._element = undefined;
        this._container= undefined;
        this._viewModel= undefined;
        this._onDestroyListeners= [];

        if (!defined(viewer)) {
            throw new DeveloperError("viewer is required.");
        }
        if (!defined(options)) {
            throw new DeveloperError("container is required.");
        }

        const that = this;
        let container = options.container;
        typeof options === "string" && (container = options);
        container = getElement(container);
        const element = document.createElement("div");
        element.className = "sc-widget sc-widget-layerControl";
        insertHtml(element, {
            content: LayerControlHtml, delay:1000, callback: () => {
                bindEvent(".sc-widget-layerControl .sc-widget-bar-close", "click", function () {
                    that.destroy();
                })
                bindEvent(".sc-widget-layerControl .sc-widget-updatePrimitiveLayers", "click", function () {
                    that._viewModel._updatePrimitiveLayers();
                })
                bindEvent(".sc-widget-layerControl .sc-widget-updateEntityLayers", "click", function () {
                    that._viewModel._updateEntityLayers();
                })
                bindEvent(".sc-widget-layerControl .sc-widget-updateImageryLayers", "click", function () {
                    that._viewModel._updateImageryLayers();
                })
                bindEvent(".sc-widget-layerControl .sc-widget-updateTerrainLayers", "click", function () {
                    that._viewModel._updateTerrainLayers();
                })
            }
        });
        container.appendChild(element);
        const viewModel = new LayerControlViewModel(viewer, element);

        this._viewModel = viewModel;
        this._element = element;
        this._container = container;

        // 绑定viewModel和element
        knockout.applyBindings(viewModel, element);
    }

    /**
     * @returns {Boolean} true if the object has been destroyed, false otherwise.
     */
    isDestroyed () {
        return false;
    }

    /**
     * Destroys the widget. Should be called if permanently.
     * removing the widget from layout.
     */
    destroy () {
        if (defined(this._element)) {
            knockout.cleanNode(this._element);
            defined(this._container) && this._container.removeChild(this._element);
        }
        delete this._element;
        delete this._container;

        defined(this._viewModel) && this._viewModel.destroy();
        delete this._viewModel;

        for (let i = 0; i < this._onDestroyListeners.length; i++) {
            this._onDestroyListeners[i]();
        }

        return destroyObject(this);
    }

    addOnDestroyListener(callback) {
        if (typeof callback === 'function') {
            this._onDestroyListeners.push(callback)
        }
    }
}

export default LayerControl;