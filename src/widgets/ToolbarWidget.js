import {ToolbarTypeEnum, ToolbarItemTypeEnum} from '../common/Enums';
import {Util} from '../common/Util';
import {MapObjectBase} from '../core/MapObjectBase';

/**
 * 工具栏微件。
 *
 * @example
 * ```
 * // 位置暂时设置在顶部
 * const container = this.map.options.container;
 * const element = window.document.createElement('div');
 * container.appendChild(element);
 * new ToolbarWidget({
 *     map: this.map,
 *     element: element,
 *     visible: true,
 *     items: [
 *         {
 *             'type': 'default',
 *             'name': '标题1',
 *             'desc': '测试测试测试。',
 *             'visible': true,
 *             'enabled': true,
 *             'checked': false,
 *             'checkbox': false,
 *             'image': 'assets/image/toolbar/png_map3d_32x32.png',
 *             'click': '',
 *             'mode': 'combobox',
 *             'expandOnClick': true,
 *             'closeOnClick': true,
 *             'more': false,
 *             'items': [
 *                 {
 *                     'type': 'default',
 *                     'name': '测试按钮1',
 *                     'desc': '测试',
 *                     'visible': true,
 *                     'enabled': true,
 *                     'checked': false,
 *                     'checkbox': false,
 *                     'image': 'assets/image/toolbar/png_map2d_32x32.png',
 *                     'click': 'window.alert("测试1")',
 *                     'closeOnClick': true,
 *                 },
 *             ],
 *         },
 *         {
 *             'type': 'default',
 *             'name': '标题2',
 *             'desc': '测试测试测试',
 *             'visible': true,
 *             'enabled': true,
 *             'checked': false,
 *             'checkbox': false,
 *             'image': 'assets/image/toolbar/png_lab_32x32.png',
 *             'click': '',
 *             'expandOnClick': true,
 *             'closeOnClick': true,
 *             'more': false,
 *             'items': [
 *                 {
 *                     'type': 'default',
 *                     'name': '测试按钮2',
 *                     'desc': '测试',
 *                     'visible': true,
 *                     'enabled': true,
 *                     'checked': false,
 *                     'checkbox': false,
 *                     'image': 'assets/image/toolbar/png_function_32x32.png',
 *                     'click': 'window.alert("测试2")',
 *                     'closeOnClick': true,
 *                 },
 *             ],
 *         },
 *     ],
 * })();
 * ```
 * @category 微件
 * @author Helsing
 * @since 2022/3/29 14:35
 */
export class ToolbarWidget extends MapObjectBase {
    /**
     * 顶层容器元素。
     *
     * @type {HTMLElement}
     * @private
     */
    element;
    /**
     * HTML内容。
     *
     * @type {string}
     * @private
     */
    html;
    /**
     * 子集。
     *
     * @type {Array}
     * @private
     */
    items = [];

    /**
     * 工具栏微件。
     *
     * @param {Object|string} options 选项。当传入字符串时，参数表示元素ID。
     */
    constructor(options) {
        super(options);

        this.init();
    }

    /**
     * 初始化。
     */
    init() {
        // 初始化参数
        if (typeof (this.options) === 'object') {
            if (Util.isElement(this.options)) {
                this.element = this.options;
                this.options = {element: this.element, id: this.id, name: this.name};
            } else {
                this.element = Util.getElement(this.options.element) || Util.getElementById(this.options.id);
            }
        } else if (typeof (this.options) === 'string') {
            this.element = Util.getElement(this.options);
            this.options = {element: this.element, id: this.id, name: this.name};
        }

        if (!this.element) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.bottom = '30px';
            div.style.left = '0';
            div.style.width = '100%';
            div.style.height = 'fit-content';
            div.style.pointerEvents = 'none';
            this.map.container.appendChild(div);
            this.element = div;
        }

        // 如果选项中的ID为空，则使用GUID创建ID
        if (!this.element.id) {
            this.element.id = Util.getGuid();
        }

        // 设置控件可见状态
        const visible = this.options.visible ?? true;
        if (!visible) {
            this.element.style.display = 'none';
        }

        typeof this.options === 'object' && (this._toolbarType = this.options.type);
        !this._toolbarType && (this._toolbarType = ToolbarTypeEnum.TOP);
        this._toolbarType = this._toolbarType.toLowerCase();

        // html内容
        this._htmlLeft = '<div><div><span title="隐藏工具栏"> </span></span></div><div><ul>';
        this._htmlRight = '</ul></div>'
            + '<div title="移动工具栏"' + (this._toolbarType !== 'float' ? ' style="display:none;"' : '') + '>&nbsp;</div>'
            + '</div>'
            + '<div><span title="显示工具栏" class="icon-up">&nbsp;</span></div>';
        this._htmlCenter = '';

        // 根据工具栏类型设置不同的样式
        let className = 'helsing-toolbar helsing-toolbar-top';
        if (this._toolbarType === ToolbarTypeEnum.TOP) {
            className = 'helsing-toolbar helsing-toolbar-top';
        } else if (this._toolbarType === ToolbarTypeEnum.BOTTOM) {
            className = 'helsing-toolbar helsing-toolbar-bottom';
        } else if (this._toolbarType === ToolbarTypeEnum.LEFT) {
            className = 'helsing-toolbar helsing-toolbar-left';
        } else if (this._toolbarType === ToolbarTypeEnum.RIGHT) {
            className = 'helsing-toolbar helsing-toolbar-right';
        } else if (this._toolbarType === ToolbarTypeEnum.FLOAT) {
            className = 'helsing-toolbar helsing-toolbar-float';
        } else if (this._toolbarType === ToolbarTypeEnum.TAB) {
            className = 'helsing-toolbar helsing-toolbar-tab';
        }
        //$("#" + this._elementId).addClass(className);

        for (let i = 0; i < className.split(" ").length; i++) {
            this.element.classList.add(className.split(' ')[i]);
        }

        return true;
    }

    /**
     * 获取HTML内容。
     *
     * @returns {string} HTML内容
     */
    getContent() {
        this.html = this._htmlLeft + this._htmlCenter + this._htmlRight;
        return this.html;
    }

    /**
     * 构建节点。
     *
     * @param {Item[]} items 节点集合。
     * @param {Item[]} tools 工具集合。
     * @param {Item} parent 父节点。
     * @param {string} barType 工具类型
     * @returns {string}
     */
    buildItems(items, tools, parent, barType) {
        let ret = '';
        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                parent && (item.parent = parent);
                if (!item.id) {
                    item.id = 'toolbarItem_' + Util.getGuid(true);
                }
                let itemContent = '<li id="' + item.id + '">'
                    + '<a' + (barType !== 'tab' ? (' title="' + (item.desc || item.name) + '"') : '') + '>'
                    + '<span style="' + (item.type === ToolbarItemTypeEnum.TEXT ? 'display:none;' : '') + (item.image ? 'background: url(' + item.image + ') center /16px no-repeat;' : '') + '">&nbsp;</span>'
                    + '<p style="' + (item.type === ToolbarItemTypeEnum.IMAGE ? 'display:none;' : '') + '">' + item.name + '</p>'
                    + '</a>'
                    + '<span title="更多" class="helsing-more helsing-more-right"' + ' style="' + (!item.more ? 'display:none;' : '') + '">&nbsp;</span>'
                    + '<div style="display:none;"></div>'
                    + '<span style="display:none;"><em></em></span>';
                if (item.items && item.items.length > 0) {
                    itemContent += '<ul>';
                    itemContent += this.buildItems(item.items, tools, item, barType);
                    itemContent += '</ul></li>';
                } else {
                    itemContent += '</li>';
                }

                ret += itemContent;
                tools.push(item);
            }
        }
        return ret;
    }

    /**
     * 绑定工具栏的显示/隐藏按钮事件。
     */
    bindOperationButtonEvent() {
        // 移动按钮单击事件
        const moveButtons = this.element.querySelectorAll('div:nth-child(1) > div:nth-child(3)');
        if (moveButtons && moveButtons.length > 0) {
            for (let i = 0; i < moveButtons.length; i++) {
                const moveButton = moveButtons[i];
                Util.bindMovingAction(moveButton, this.element);
            }
        }

        // 隐藏按钮单击事件
        // const hideButtons = this.element.querySelectorAll("div:nth-child(1) > div:nth-child(1) span");
        // 如果选择器按上面的写法写，则顶部工具栏会取错，不知为何，改成下面的写法
        const hideButtons = this.element.querySelector('div:nth-child(1)').querySelectorAll('div:nth-child(1) > span');
        if (hideButtons && hideButtons.length > 0) {
            for (let i = 0; i < hideButtons.length; i++) {
                const hideButton = hideButtons[i];
                hideButton.addEventListener('click', function (event) {
                    if (event && event.target && event.target.parentElement && event.target.parentElement.parentElement) {
                        if (event.target.parentElement.parentElement.style.getPropertyValue('flex-direction') === 'column') {
                            event.target.parentElement.parentElement.style.display = 'none';
                        } else {
                            event.target.parentElement.parentElement.style.display = 'none';
                        }
                        event.target.parentElement.parentElement.nextElementSibling['style'].display = 'block';
                    }
                }, false);
            }
        }

        // 显示按钮单击事件
        const showButtons = this.element.querySelectorAll('div:nth-child(2) span');
        if (showButtons && showButtons.length > 0) {
            for (let i = 0; i < showButtons.length; i++) {
                const showButton = showButtons[i];
                showButton.addEventListener('click', function (event) {
                    if (event && event.target && event.target.parentElement && event.target.parentElement.previousElementSibling) {
                        if (event.target.parentElement.previousElementSibling['style'].getPropertyValue('flex-direction') === 'column') {
                            event.target.parentElement.previousElementSibling['style'].display = '';
                        } else {
                            event.target.parentElement.previousElementSibling['style'].display = '';
                        }
                        event.target.parentElement.style.display = '';
                    }
                }, false);
            }
        }
    }

    /**
     * 添加所有图层。
     *
     * @param {Object} [srcData] 选项。
     */
    addAll(srcData) {
        if (!srcData) {
            srcData = this.options;
        }
        if (typeof (srcData) === 'object') {
            this._htmlCenter = '';
            this.html = '';
            this.items = [];

            // 一次性递归加载
            //let itemContent = this.buildItems(srcData.items, this.items, undefined, this._toolbarType);
            //this._htmlCenter += itemContent;

            // 首次加载+子项递归加载
            for (let i = 0; i < srcData.items.length; i++) {
                const item = srcData.items[i];
                if (!item.id) {
                    item.id = 'toolbarItem_' + Util.getGuid(true);
                }
                let itemContent = '<li id="' + item.id + '">'
                    + '<a' + (this._toolbarType !== 'tab' ? (' title="' + (item.desc || item.name) + '"') : '') + '>'
                    + '<span style="' + (item.type === ToolbarItemTypeEnum.TEXT ? 'display:none;' : '') + (item.image ? 'background: url(' + item.image + ') center /16px no-repeat;' : '') + '">&nbsp;</span>'
                    + '<p style="' + (item.type === ToolbarItemTypeEnum.IMAGE ? 'display:none;' : '') + '">' + item.name + '</p>'
                    + '</a>'
                    + '<span title="更多" class="helsing-more helsing-more-down"' + ' style="' + (!item.more ? 'display:none;' : '') + '">&nbsp;</span>'
                    + '<div style="display:none;"></div>'
                    + '<span style="display:none;"><em></em></span>';
                if (item.items && item.items.length > 0) {
                    itemContent += '<ul>';
                    itemContent += this.buildItems(item.items, this.items, item, this._toolbarType);
                    itemContent += '</ul></li>';
                } else {
                    itemContent += '</li>';
                }
                this._htmlCenter += itemContent;
                this.items.push(item);
            }
        }
    }

    /**
     * 添加工具。
     *
     * @param {Object} srcData JSON对象
     * @param {string} [srcData.id] 工具ID。
     * @param {string} [srcData.type] 工具类型（default：图标+名称，image：图标，text：名称）。
     * @param {string} [srcData.name] 工具名称。
     * @param {string} [srcData.desc] 工具描述。
     * @param {string} [srcData.image] 工具图标。
     */
    add(srcData) {
        if (typeof (srcData) === 'object') {
            if (!srcData.id) {
                srcData.id = 'toolbarItem_' + Util.getGuid(true);
            }
            const toolContent = '<li id="' + srcData.id + '" title="' + (srcData.desc || srcData.name) + '">'
                + '<a>'
                + (srcData.type === ToolbarItemTypeEnum.TEXT ? '<span' + (srcData.image ? ' style="background: url(' + srcData.image + ') center /16px no-repeat;"' : '') + '>&nbsp;</span>' : '')
                + (srcData.type === ToolbarItemTypeEnum.IMAGE ? '' : srcData.name) + '</a></li>';
            this._htmlCenter += toolContent;
            this.items.push(srcData);
        }
    }

    /**
     * 启动控件使其生效。
     *
     * @param {string} [type] HTML操作类型，默认值REPLACE。
     * @param {function} [callback] 回调函数。
     */
    startUp(type, callback) {
        const that = this;
        Util.insertHtml(this.element, this.getContent(), type || 'REPLACE', function () {
            // 绑定工具栏的显示/隐藏按钮事件
            that.bindOperationButtonEvent();
            // 绑定工具按钮事件
            for (let i = 0; i < that.items.length; i++) {
                const /** @type {Item} */t = that.items[i];
                if (t.visible === false) {
                    if (document.getElementById(t.id)) {
                        document.getElementById(t.id).style.display = 'none';
                    }
                    //$("#" + t.id).hide();
                }
                if (document.getElementById(t.id)) {
                    (function (t) {
                        // 按钮单击事件
                        document.getElementById(t.id).querySelector('a').addEventListener('click', function (e) {
                            (function (e, t) {
                                // 单击时关闭
                                if (t.closeOnClick) {
                                    const ul = Util.getElement('#' + t.id + ' > ul');
                                    if (ul) {
                                        // 获取自己的菜单状态
                                        const display = Util.getCss('#' + t.id + ' > ul', 'display');
                                        // 关闭所有菜单
                                        Util.setCss('.helsing-toolbar > div:nth-child(1) > div:nth-child(2) > ul > li ul', 'display', 'none');
                                        // 恢复自己的菜单状态
                                        t.closeOnClick && Util.setCss('#' + t.id + ' > ul', 'display', display);
                                    } else {
                                        Util.setCss('.helsing-toolbar > div:nth-child(1) > div:nth-child(2) > ul > li ul', 'display', 'none');
                                    }
                                }
                                if (t.expandOnClick) { // 自动下拉菜单
                                    const ul = e.currentTarget['parentNode'].getElementsByTagName('ul')[0];
                                    ul && (ul.style.display = (Util.getCss(ul, 'display') === 'none') ? 'inherit' : 'none');
                                } else {
                                    Util.dynamicExecuteFunction.apply(that, [t.click]);//eval(t.click);
                                }

                                // 下拉框模式
                                if (t.parent && t.parent.mode === 'combobox') {
                                    Util.setCss('#' + t.parent.id + ' > a > span', 'background-image', Util.getCss('#' + t.id + ' > a > span', 'background-image'));
                                    Util.setInnerText('#' + t.parent.id + ' > a > p', Util.getInnerText('#' + t.id + ' > a > p'));
                                }
                                // 弹框模式
                                if (t.mode === 'popup' && t.popup) {
                                    // 动态加载页面
                                    const /** @type {HTMLElement} */element = document.querySelector('#' + t.id + ' > div');
                                    if (element && t.popup.html && t.popup.html !== '') {
                                        if (Util.getCss(element, 'display') === 'none') {
                                            element.style.display = '';
                                            Util.setCss('#' + t.id + ' > span:nth-child(4)', 'display', '');
                                            if (!element.innerHTML) {
                                                (function (t) {
                                                    Util.loadHtml(element, t.popup.html, 'REPLACE', function () {
                                                        Util.dynamicExecuteFunction.apply(that, [t.popup.success]); //eval(t.popup.success);
                                                        // 修正窗体大小
                                                        let width = element.offsetWidth;
                                                        let height = element.offsetHeight;

                                                        // 宽度限制
                                                        if (width > window.innerWidth) {
                                                            width = window.innerWidth;
                                                        }
                                                        if (!t.popup.width && width < 200) {
                                                            width = 200;
                                                        }
                                                        element.style.width = t.popup.width || (width + 'px');

                                                        // 高度自适应
                                                        // 高度自适应后会出现滚动条，直接使用给定高度
                                                        // if (height > window.innerHeight) {
                                                        //     height = window.innerHeight;
                                                        // }
                                                        // element.style.height = t.popup.height || (height + 'px');
                                                        t.popup.height && (element.style.height = t.popup.height);

                                                        // 修正窗体位置
                                                        let left = Util.getAbsoluteLeft(element);
                                                        let top = Util.getAbsoluteTop(element);
                                                        width = element.offsetWidth;
                                                        height = element.offsetHeight;

                                                        if (left < 0) {
                                                            left = 0;
                                                        }
                                                        if (window.innerWidth - left < width) {
                                                            left = window.innerWidth - width;
                                                        }

                                                        if (top < 0) {
                                                            top = 0;
                                                        }
                                                        if (window.innerHeight - top < height) {
                                                            top = window.innerHeight - height;
                                                        }

                                                        if (['top', 'bottom', 'float', 'tab'].indexOf(that.options.type) >= 0) {
                                                            element.style.left = (element.offsetLeft + left - Util.getAbsoluteLeft(element) - 20) + 'px';
                                                        }
                                                        if (['left', 'right'].indexOf(that.options.type) >= 0) {
                                                            element.style.top = (element.offsetTop + top - Util.getAbsoluteTop(element) - 20) + 'px';
                                                        }

                                                    });
                                                })(t);
                                                if (t.popup.css) {
                                                    Util.loadModuleFile(t.popup.css);
                                                }
                                                if (t.popup.js) {
                                                    /*ignore-begin*/
                                                    // require([t.popup.js], function (mod) {
                                                    //     mod.init && mod.init();
                                                    // });

                                                    // import(t.popup.js).then(mod => {
                                                    //     mod.init && mod.init();
                                                    // })
                                                    /*ignore-end*/
                                                }
                                            }
                                        } else {
                                            element.style.display = 'none';
                                            Util.setCss('#' + t.id + ' > span:nth-child(4)', 'display', 'none');
                                            if (t.popup.destroyOnClose) {
                                                t.popup.js && Util.unloadModuleFile(t.popup.js);//requirejs.undef(t.popup.js);
                                                t.popup.css && Util.unloadModuleFile(t.popup.css);
                                                element.innerHTML = '';
                                            }
                                        }
                                    }
                                }

                            })(e, t);
                        }, false);
                    })(t);
                }
            }

            // 【Tab工具栏】鼠标悬停事件
            const tabElements = Util.getElements(' .helsing-toolbar-tab > div:nth-child(1) > div:nth-child(2) > ul > li');
            for (let i = 0; i < tabElements.length; i++) {
                const liElement = tabElements[i];
                const ulElement = liElement.getElementsByTagName('ul')[0];
                Util.bindUListMouseHoverEvent(liElement, ulElement);
            }

            Util.bindEvent(' .helsing-toolbar-tab > div:nth-child(1) > div:nth-child(2) > ul > li > a', 'mouseover', function (e) {
                const ul = e.target.parentNode.getElementsByTagName('ul')[0];
                ul && (ul.style.display = 'inherit');
            });
            Util.bindEvent(' .helsing-toolbar-tab > div:nth-child(1) > div:nth-child(2) > ul > li > a', 'mouseout', function (e) {
                const ul = e.target.parentNode.getElementsByTagName('ul')[0];
                ul && (ul.style.display = 'none');
            });

            // 【更多】按钮单击事件
            Util.bindEvent('#' + that.element.id + ' .helsing-more', 'click', function (e) {
                const ul = e.target.parentNode.getElementsByTagName('ul')[0];
                ul.style.display = (Util.getCss(ul, 'display') === 'none') ? 'inherit' : 'none';
            });

            // 回调
            if (typeof (callback) === 'function') {
                callback();
            }
        }, 100);
    }
}

/**
 * 工具栏节点。
 */
class Item {
    /**
     * ID。
     * @type {string}
     */
    id;
    /**
     * 名称。
     * @type {string}
     */
    name;
    /**
     * 描述。
     * @type {string}
     */
    desc;
    /**
     * 类型。
     * @type {string}
     */
    type;
    /**
     * 图标。
     * @type {string}
     */
    image;
    /**
     * 更多。
     * @type {string}
     */
    more;
    /**
     * 模式。
     * @type {string}
     */
    mode;
    /**
     * 弹窗。
     * @type {Object}
     */
    popup = {
        /**
         * 页面。
         * @type {string}
         */
        html: undefined,
        /**
         * 脚本。
         * @type {string}
         */
        js: undefined,
        /**
         * 样式。
         * @type {string}
         */
        css: undefined,
        /**
         * 宽度。
         * @type {string}
         */
        width: undefined,
        /**
         * 高度。
         * @type {string}
         */
        height: undefined,
        /**
         * 关闭时销毁。
         * @type {boolean}
         */
        destroyOnClose: undefined,
        /**
         * 高度。
         * @type {function}
         */
        success: undefined
    };
    /**
     * 单击事件。
     * @type {string}
     */
    click;
    /**
     * 点击时展开。
     * @type {boolean}
     */
    expandOnClick;
    /**
     * 点击时关闭。
     * @type {boolean}
     */
    closeOnClick;
    /**
     * 是否可见。
     * @type {boolean}
     */
    visible;
    /**
     * 父节点。
     * @type {Item}
     */
    parent;
    /**
     * 子集。
     * @type {Item[]}
     */
    items;
}