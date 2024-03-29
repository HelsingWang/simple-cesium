import * as Cesium from 'cesium';
import {MapOptions} from './MapOptions';
import './MapOptions.css';

/**
 * A mixin which adds the MapOptions widget to the Viewer widget.
 * Rather than being called directly, this function is normally passed as
 * a parameter to {@link Viewer#extend}, as shown in the example below.
 *
 * @function
 * @param {Viewer} viewer The viewer instance.
 * @param {Object} [options={}] The options.
 * @exception {DeveloperError} viewer is required.
 * @demo {@link http://helsing.wang:8888/simple-cesium | MapOptions Demo}
 * @example
 * var viewer = new Cesium.Viewer('cesiumContainer');
 * viewer.extend(viewerMapOptionsMixin);
 */
export function viewerMapOptionsMixin(viewer, options = {}) {
    if (!Cesium.defined(viewer)) {
        throw new Cesium.DeveloperError('viewer is required.');
    }

    const container = document.createElement('div');
    container.className = 'sc-widget-container';
    const parent = viewer.scWidgetsContainer || viewer.container;
    parent.appendChild(container);
    const widget = new MapOptions(
        viewer, {container: container}
    );

    // Remove the mapOptions property from viewer.
    widget.addOnDestroyListener((function (viewer) {
        return function () {
            Cesium.defined(container) && container.parentNode.removeChild(container);
            delete viewer.scMapOptions;
        };
    })(viewer));

    // Add the mapOptions property to viewer.
    Object.defineProperties(viewer, {
        scMapOptions: {
            get: function () {
                return widget;
            },
            configurable: true
        }
    });
}
