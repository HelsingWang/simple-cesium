import * as Cesium from 'cesium';
import {ObjectBase} from './ObjectBase';
import {Util} from '../common/Util';

/**
 * 地图对象基类。
 *
 * @alias MapBaseObject
 * @category 核心
 * @class
 * @extends ObjectBase
 * @author Helsing
 * @since 2019/12/09
 */
export class MapObjectBase extends ObjectBase {
    /**
     * 三维地图。
     *
     * @type {ScMap}
     */
    get map() {
        return this.properties?.map;
    }

    set map(value) {
        this.properties.map = value;
    }

    /**
     * 三维视窗。
     *
     * @type {Cesium.Viewer}
     */
    get viewer() {
        return this.properties?.viewer;
    }

    set viewer(value) {
        this.properties.viewer = value;
    }

    /**
     * 三维基类。
     *
     * @constructor
     * @param {Object} [options] 选项。
     */
    constructor(options = {}) {
        // 兼容 new Class(viewer, options) 传参模式
        let viewer;
        if (options instanceof Cesium.Viewer){
            viewer = options;
            options =  arguments[1] ?? {};
        }

        super(options);

        this.id = this.options?.id ?? Util.getGuid();
        this.name = this.options?.name ?? 'ScMapObject';
        this.desc = this.options?.desc ?? 'Sc地图对象';

        if (viewer) {
            this.viewer = viewer;
            this.map = {viewer: viewer};
        } else {
            if (this.map) {
                this.viewer = this.map.viewer;
            } else if (this.viewer) {
                this.map = {viewer: this.viewer};
            }
        }
    }
}
