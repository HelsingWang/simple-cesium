/**
 * 对象基类。
 *
 * @alias ObjectBase
 * @category 核心
 * @class
 * @author Helsing
 * @since 2019/08/14
 */
import {Util} from '../common/Util';

export class ObjectBase {
    /**
     * 选项。
     *
     * @type {Object}
     * @private
     */
    #options = {};
    /**
     * 属性。
     *
     * @type {Object}
     * @private
     */
    #properties = {};

    /**
     * 获取或设置选项。
     *
     * @type {Object}
     */
    get options() {
        return this.#options;
    }

    set options(value) {
        this.#options = value;
    }

    /**
     * 获取或设置属性。
     *
     * @type {Object}
     */
    get properties() {
        return this.#properties;
    }

    set properties(value) {
        this.#properties = value;
    }

    /**
     * 获取或设置ID。
     *
     * @type {string}
     */
    get id() {
        return this.#properties?.id;
    }

    set id(value) {
        this.#properties.id = value;
    }

    /**
     * 获取或设置名称。
     *
     * @type {string}
     */
    get name() {
        return this.#properties?.name;
    }

    set name(value) {
        this.#properties.name = value;
    }

    /**
     * 获取或设置描述。
     *
     * @type {string}
     */
    get desc() {
        return this.#properties?.desc;
    }

    set desc(value) {
        this.#properties.desc = value;
    }

    /**
     * 对象基类。
     *
     * @constructor
     * @param {Object} [options] 选项。
     */
    constructor(options = {}) {
        this.#options = options ?? {};
        this.#properties = {...this.#options};

        this.id = this.#options.id ?? Util.getGuid();
        this.name = this.#options.name ?? 'ScObject';
        this.desc = this.#options.desc ?? 'Sc对象';
    }
}