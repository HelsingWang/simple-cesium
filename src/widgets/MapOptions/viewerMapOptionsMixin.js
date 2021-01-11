import defined from "cesium/Source/Core/defined.js";
import DeveloperError from "cesium/Source/Core/DeveloperError.js";
import MapOptions from "./MapOptions.js";
import "./MapOptions.css"

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
function viewerMapOptionsMixin(viewer, options = {}) {
    if (!defined(viewer)) {
        throw new DeveloperError("viewer is required.");
    }

    const container = document.createElement("div");
    container.className = "sc-widget-container";
    viewer.container.appendChild(container);
    const widget = new MapOptions(
        viewer, {container: container}
    );

    // Remove the mapOptions property from viewer.
    widget.addOnDestroyListener((function (viewer) {
        return function () {
            defined(container) && viewer.container.removeChild(container);
            delete viewer.mapOptions;
        }
    })(viewer))

    // Add the mapOptions property to viewer.
    Object.defineProperties(viewer, {
        mapOptions: {
            get: function () {
                return widget;
            },
        },
    });
}

export default viewerMapOptionsMixin;