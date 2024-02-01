import * as Cesium from 'cesium';
import {Util} from '../../common/Util';
import {MapOptionsViewModel} from './MapOptionsViewModel';
import MapOptionsHtml from './MapOptions.html';

export class MapOptions {

    /**
     * Gets the parent container.
     * @memberOf MapOptions.prototype
     * @type {Element}
     */
    get container() {
        return this._container;
    }

    /**
     * Gets the view model.
     * @memberOf MapOptions.prototype
     * @type {MapOptionsViewModel}
     */
    get viewModel() {
        return this._viewModel;
    }

    constructor(viewer, options = {}) {
        this._element = undefined;
        this._container = undefined;
        this._viewModel = undefined;
        this._onDestroyListeners = [];

        if (!Cesium.defined(viewer)) {
            throw new Cesium.DeveloperError('viewer is required.');
        }
        if (!Cesium.defined(options)) {
            throw new Cesium.DeveloperError('container is required.');
        }

        const that = this;
        let container = options.container;
        typeof options === 'string' && (container = options);
        container = Util.getElement(container);
        const element = document.createElement('div');
        element.className = 'sc-widget sc-widget-mapOptions';
        Util.insertHtml(element, {
            content: MapOptionsHtml, delay: 1000, callback: () => {
                Util.bindEvent('.sc-widget-mapOptions .sc-widget-bar-close', 'click', function () {
                    that.destroy();
                });
            }
        });
        container.appendChild(element);
        const viewModel = new MapOptionsViewModel(viewer);

        this._viewModel = viewModel;
        this._element = element;
        this._container = container;

        // 绑定viewModel和element
        Cesium.knockout.applyBindings(viewModel, element);
    }

    /**
     * @returns {Boolean} true if the object has been destroyed, false otherwise.
     */
    isDestroyed() {
        return false;
    }

    /**
     * Destroys the widget. Should be called if permanently.
     * removing the widget from layout.
     */
    destroy() {
        if (Cesium.defined(this._element)) {
            Cesium.knockout.cleanNode(this._element);
            Cesium.defined(this._container) && this._container.removeChild(this._element);
        }
        delete this._element;
        delete this._container;

        Cesium.defined(this._viewModel) && this._viewModel.destroy();
        delete this._viewModel;

        for (let i = 0; i < this._onDestroyListeners.length; i++) {
            this._onDestroyListeners[i]();
        }

        return Cesium.destroyObject(this);
    }

    addOnDestroyListener(callback) {
        if (typeof callback === 'function') {
            this._onDestroyListeners.push(callback);
        }
    }
}
