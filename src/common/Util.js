/**
 * 公共函数工具类。
 *
 * @alias Util
 * @category 工具类
 * @class
 * @static
 * @author Helsing
 * @since 2023/11/10
 */
export class Util {
    //#region Ajax

    /**
     * ajax请求
     *
     * @author Helsing
     * @date 2019/11/07
     * @param {object} options 选项。
     * @param {String} options.type 请求类型。
     * @param {String} options.url 请求地址。
     * @param {Object} options.data 请求数据。
     * @param {String} options.dataType 返回的数据类型。
     * @param {Boolean} options.async 异步方式，默认为true。
     * @param {Function} options.success 请求成功回调。
     * @param {Function} options.error 请求失败回调。
     * @returns {String} 同步模式下返回字符串。
     * @example
     ajax({
     type:"get/post",
     url:"请求的地址",
     data:{},
     success:function(data){
       console.log(data);
     }
 })
     */
    static ajax(options) {
        // 创建一个ajax对象
        const xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft,XMLHTTP');
        // data参数处理：{a:1,b:2} => a=1&b=2
        let str = '';
        for (let key in options.data) {
            if (options.data.hasOwnProperty(key)) {
                str += '&' + key + '=' + options.data[key];
            }
        }
        str = str.slice(1);

        if (options.dataType === 'json') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/json');
            xhr.responseType = 'json';
        } else if (options.dataType === 'xml') {
            xhr.overrideMimeType && xhr.overrideMimeType('text/xml');// 或"application/xml"
            xhr.responseType = 'document';
        } else if (options.dataType === 'html' || options.dataType === 'htm') {
            xhr.overrideMimeType && xhr.overrideMimeType('text/html');
            //xhr.responseType = "document";
        } else if (options.dataType === 'xhtml') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/xhtml+xml');
            //xhr.responseType = "document";
        } else if (options.dataType === 'js') {
            xhr.overrideMimeType && xhr.overrideMimeType('text/javascript');
        } else if (options.dataType === 'css') {
            xhr.overrideMimeType && xhr.overrideMimeType('text/xml');
        } else if (options.dataType === 'txt') {
            xhr.overrideMimeType && xhr.overrideMimeType('text/plain');
        } else if (options.dataType === 'pdf') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/pdf');
        } else if (options.dataType === 'swf') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/x-shockwave-flash');
        } else if (options.dataType === 'jar') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/java-archive');
        } else if (options.dataType === 'jar') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/java-archive');
        } else if (options.dataType === 'tar') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/x-tar');
        } else if (options.dataType === 'rar') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/x-rar-compressed');
        } else if (options.dataType === '7z') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/x-7z-compressed');
        } else if (options.dataType === 'bin') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/octet-stream');
        } else if (options.dataType === 'docx') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        } else if (options.dataType === 'xls') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/vnd.ms-excel');
        } else if (options.dataType === 'xlsx') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        } else if (options.dataType === 'ppt') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/vnd.ms-powerpoint');
        } else if (options.dataType === 'pptx') {
            xhr.overrideMimeType && xhr.overrideMimeType('application/vnd.openxmlformats-officedocument.presentationml.presentation');
        } else if (options.dataType === 'bmp') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/bmp');
        } else if (options.dataType === 'png') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/png');
        } else if (options.dataType === 'gif') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/gif');
        } else if (options.dataType === 'ico') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/vnd.microsoft.icon');
        } else if (options.dataType === 'jpg' || options.dataType === 'jpeg') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/jpeg');
        } else if (options.dataType === 'tif' || options.dataType === 'tiff') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/tiff');
        } else if (options.dataType === 'svg') {
            xhr.overrideMimeType && xhr.overrideMimeType('image/svg+xml');
        } else if (options.dataType === 'mp3') {
            xhr.overrideMimeType && xhr.overrideMimeType('audio/mpeg');
        } else if (options.dataType === 'aac') {
            xhr.overrideMimeType && xhr.overrideMimeType('audio/aac');
        } else if (options.dataType === 'wav') {
            xhr.overrideMimeType && xhr.overrideMimeType('audio/wav');
        } else if (options.dataType === 'mid' || options.dataType === 'midi') {
            xhr.overrideMimeType && xhr.overrideMimeType('audio/midi audio/x-midi');
        } else if (options.dataType === 'avi') {
            xhr.overrideMimeType && xhr.overrideMimeType('video/x-msvideo');
        } else if (options.dataType === 'mpeg') {
            xhr.overrideMimeType && xhr.overrideMimeType('video/mpeg');
        }

        if (options.type === 'get') {
            const url = options.url + '?' + str;
            xhr.open('get', url, options.async || true);
            xhr.send();
        } else if (options.type === 'post') {
            xhr.open('post', options.url, options.async || true);
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(str);
        }

        if (typeof (options.async) === 'undefined' || options.async === true) { // 异步模式
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // 当请求成功的时候将请求的数据传递给成功回调函数
                    typeof (options.success) === 'function' && options.success(xhr.response);
                } else if (xhr.status !== 200) {
                    //当失败的时候将服务器的状态传递给失败的回调函数
                    typeof (options.error) === 'function' && options.error(xhr.status);
                }
            };
        } else { //同步模式
            if (xhr.readyState === 4 && xhr.status === 200) {
                return xhr.response;
            }
        }
    }

    /**
     * get请求。
     *
     * @author Helsing
     * @date 2019/11/07
     * @param {Object|String} options 选项。
     * @param {String} options.url 请求地址。
     * @param {Object} options.data 请求数据。
     * @param {String} options.dataType 返回的数据类型。
     * @param {Boolean} options.async 异步方式，默认为true。
     * @param {Function} options.success 请求成功回调。
     * @param {Function} options.error 请求失败回调。
     * @param {Object} data 请求数据。
     * @param {Function} success 请求成功回调。
     * @param {String} dataType 返回的数据类型。
     * @returns {String} 同步模式下返回字符串。
     * @example
     get({
     url:"请求的地址",
     data:{},
     success:function(data){
       console.log(data)
     }
 })
     或
     get(url, data=>console.log(data), "html")
     */
    static get(options, data = undefined, success = undefined, dataType = undefined) {
        let newOptions;
        if (typeof options === 'string') {
            if (typeof (data) === 'function') {
                dataType = dataType || success;
                success = data;
                data = undefined;
            }
            newOptions = {
                url: options,
                data: data,
                success: success,
                dataType: dataType
            };
        } else {
            newOptions = options;
        }
        if (newOptions) {
            newOptions.type = 'get';
            return this.ajax(newOptions);
        }
    }

    /**
     * post请求。
     *
     * @author Helsing
     * @date 2019/11/08
     * @param {object} options 选项。
     * @param {String} options.url 请求地址。
     * @param {Object} options.data 请求数据。
     * @param {String} options.dataType 返回的数据类型。
     * @param {Boolean} options.async 异步方式，默认为true。
     * @param {Function} options.success 请求成功回调。
     * @param {Function} options.error 请求失败回调。
     * @param {Object} data 请求数据。
     * @param {String} dataType 返回的数据类型。
     * @param {Function} success 请求成功回调。
     * @returns {String} 同步模式下返回字符串。
     * @example
     post({
     url:"请求的地址",
     data:{},
     success:function(data){
       console.log(data)
     }
 })
     */
    static post(options, data = undefined, success = undefined, dataType = undefined) {
        let newOptions;
        if (typeof (options) === 'string') {
            if (typeof (data) === 'function') {
                dataType = dataType || success;
                success = data;
                data = undefined;
            }
            newOptions = {
                url: options,
                data: data,
                success: success,
                dataType: dataType
            };
        } else {
            newOptions = options;
        }
        if (newOptions) {
            newOptions.type = 'post';
            return this.ajax(newOptions);
        }
    }

    /**
     * 读取JSON文件。
     *
     * @author Helsing
     * @date 2019/11/07
     * @param {String} url 文件地址。
     * @param {Boolean|Function} async 异步方式，默认为异步模式。
     * @param {Function} callback 回调函数。
     * @returns {String} 文本内容。
     */
    static getJSON(url, async = true, callback = undefined) {
        let arr2 = true;
        let arr3 = callback;

        //创建一个ajax对象
        const xhr = new XMLHttpRequest() || new ActiveXObject('Microsoft.XMLHTTP');
        xhr.overrideMimeType && xhr.overrideMimeType('application/json');
        xhr.responseType = 'json';
        xhr.open('GET', url, async); // 异步方式
        xhr.send();

        if (typeof async === 'boolean') {
            arr2 = async;
        } else if (typeof async === 'function') {
            arr3 = async;
        }

        if (arr2) { // 异步模式
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    typeof arr3 === 'function' && arr3(xhr.response);
                }
            };
        } else { //同步模式
            if (xhr.readyState === 4 && xhr.status === 200) {
                return xhr.response;
            }
        }
    }

    //#endregion

    //#region DOM

    /**
     * 判断对象是否为元素。
     *
     * @author Helsing
     * @date 2019/12/24
     * @param {Object} obj 对象
     * @returns {Boolean} 是或否
     */
    static isElement(obj) {
        return (typeof HTMLElement === 'object')
            ? (obj instanceof HTMLElement)
            : !!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string');
    }

    /**
     * 根据元素ID获取元素。
     *
     * @param {string|HTMLElement|HTMLElement[]} id 元素的ID（如果输入参数为对象，则直接返回该对象；如果输入参数为数组，则返回会第一个对象；如果输入的元素为其他字符串格式，则默认为查询字符串，但这并不安全）。
     * @returns {HTMLElement} element 元素。
     */
    static getElementById(id) {
        let element = undefined;
        if (typeof (id) === 'string') {
            if (id.indexOf('#') < 0 && id.indexOf('.') < 0 && id.indexOf(' ') < 0) {
                element = document.getElementById(id);
            } else {
                element = document.querySelector(id);
            }
        } else if (typeof (id) === 'object') {
            if (this.isElement(id)) {
                element = id;
            } else if (id instanceof Array) {
                const length = id.length;
                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        if (this.isElement(id[i])) {
                            element = id[i];
                            break;
                        }
                    }
                }
            }
        }
        return element;
    }

    /**
     * 获取元素。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String|HTMLElement|Array} query 查询文本（如果输入参数为对象，则直接返回该对象；如果输入参数为数组，则返回会第一个对象）
     * @returns {HTMLElement} element 元素
     */
    static getElement(query) {
        let element = undefined;
        if (typeof (query) === 'string') {
            if (query.indexOf('#') < 0 && query.indexOf('.') < 0 && query.indexOf(' ') < 0) {
                element = document.getElementById(query);
            } else {
                element = document.querySelector(query);
            }
        } else if (typeof (query) === 'object') {
            if (this.isElement(query)) {
                element = query;
            } else if (query instanceof Array) {
                const length = query.length;
                if (length > 0) {
                    for (let i = 0; i < length; i++) {
                        if (this.isElement(query[i])) {
                            element = query[i];
                            break;
                        }
                    }
                }
            }
        }
        return element;
    }

    /**
     * 创建或获取元素。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String} id 元素ID。
     * @param {String|Function} handler 元素组成文本或元素创建函数。
     * @param {String|HTMLElement|Array} parent 父元素（如果输入参数为数组，则返回会第一个对象）。
     * @returns {HTMLElement} 元素。
     */
    static getOrCreateElement(id, handler, parent) {
        let element = document.getElementById(id);
        parent && (parent = this.getElement(parent));
        !parent && (parent = document.body);
        if (!element) {
            if (typeof (handler) === 'string') {
                parent.insertAdjacentHTML('beforeend', handler);
            } else if (typeof (handler) === 'function') {
                handler();
            }
            element = document.getElementById(id);
        }
        return element;
    }

    /**
     * 获取元素集合。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String|HTMLElement|Array} query 查询文本（如果输入参数为对象，则返回具有该对象的数组；如果输入参数为数组，直接返回数组）
     * @returns {Array} elements 元素集合
     */
    static getElements(query) {
        let elements = undefined;
        if (typeof (query) === 'string') {
            if (query.indexOf('#') < 0 && query.indexOf('.') < 0 && query.indexOf(' ') < 0) {
                const element = document.getElementById(query);
                elements = [];
                elements.push(element);
            } else {
                elements = document.querySelectorAll(query);
            }
        } else if (typeof (query) === 'object') {
            if (this.isElement(query)) {
                elements = [];
                elements.push(query);
            } else if (query instanceof Array) {
                const length = query.length;
                if (length > 0) {
                    elements = [];
                    let element;
                    for (let i = 0; i < length; i++) {
                        element = query[i];
                        if (this.isElement(element)) {
                            elements.push(element);
                        }
                    }
                    (elements.length === 0) && (elements = undefined);
                }
            }
        }
        return elements;
    }

    /**
     * 获取子元素集合。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String|HTMLElement|Array} parent 查询文本
     * @param {String} query 查询文本
     * @returns {Array} elements 元素集合
     */
    static getChildElement(parent, query) {
        let element = undefined;
        parent = this.getElement(parent);
        if (parent) {
            element = query ? parent.querySelector(query) : parent.children[0];
        }
        return element;
    }

    /**
     * 获取子元素集合。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String|HTMLElement|Array} parent 查询文本
     * @param {String} query 查询文本
     * @returns {Array} elements 元素集合
     */
    static getChildElements(parent, query) {
        let elements = undefined;
        const parents = this.getElements(parent);
        if (parents && parents.length > 0) {
            elements = [];
            for (let i = 0; i < parents.length; i++) {
                const children = query ? parents[i].querySelectorAll(query) : parents[i].children;
                if (children && children.length > 0) {
                    elements.push.apply(elements, children);
                }
            }
        }
        return elements;
    }

    /**
     * 添加样式类。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组
     * @param {String} className 类名称
     */
    static addCssClass(srcNodeRef, className) {
        if (srcNodeRef && className) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    let element = srcNodeRef[i];
                    if (element.classList) {
                        for (let j = 0; j < className.split(" ").length; j++) {
                            element.classList.add(className.split(' ')[j]);
                        }
                    }
                }
            } else if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    let element = document.getElementById(srcNodeRef);
                    if (element) {
                        for (let j = 0; j < className.split(" ").length; j++) {
                            element.classList.add(className.split(' ')[j]);
                        }
                    }
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        let element = elements[i];
                        for (let j = 0; j < className.split(" ").length; j++) {
                            element.classList.add(className.split(' ')[j]);
                        }
                    }
                }
            } else {
                for (let j = 0; j < className.split(" ").length; j++) {
                    srcNodeRef.classList.add(className.split(' ')[j]);
                }
            }
        }
    }

    /**
     * 设置样式。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组
     * @param {String} cssText 样式内容
     */
    static setStyle(srcNodeRef, cssText) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    srcNodeRef[i].style.cssText = cssText;
                }
            } else if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    const element = document.getElementById(srcNodeRef);
                    element && (element.style.cssText = cssText);
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.cssText = cssText;
                    }
                }
            } else if (srcNodeRef instanceof HTMLElement) {
                srcNodeRef.style.cssText = cssText;
            }
        }
    }

    /**
     * 获取CSS。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement} srcNodeRef 元素ID、查询值或元素
     * @param {String} property 属性
     */
    static getCss(srcNodeRef, property) {
        if (srcNodeRef) {
            let element;
            if (typeof srcNodeRef === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    element = document.getElementById(srcNodeRef);
                } else {
                    element = document.querySelector(srcNodeRef);
                }
            } else {
                element = srcNodeRef;
            }
            if (element.hasOwnProperty('currentStyle')) { // 旧版IE
                return element.currentStyle[property];
            } else {
                return window.getComputedStyle(element, null)[property];
            }
        }
    }

    /**
     * 设置CSS。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {Element|HTMLElement|String} srcNodeRef 元素ID、元素或数组。
     * @param {String} property 属性。
     * @param {String} value 值。
     */
    static setCss(srcNodeRef, property, value) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    srcNodeRef[i].style.setProperty(property, value);
                }
            } else if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    const element = document.getElementById(srcNodeRef);
                    element && (element.style.setProperty(property, value));
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].style.setProperty(property, value);
                    }
                }
            } else if (srcNodeRef instanceof HTMLElement) {
                srcNodeRef.style.setProperty(property, value);
            }
        }
    }

    /**
     * 设置属性。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组
     * @param {String} attribute 属性
     * @param {String} value 值
     */
    static setAttribute(srcNodeRef, attribute, value) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    srcNodeRef[i].setAttribute(attribute, value);
                }
            } else if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    const element = document.getElementById(srcNodeRef);
                    element && (element.setAttribute(attribute, value));
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].setAttribute(attribute, value);
                    }
                }
            } else {
                srcNodeRef.setAttribute(attribute, value);
            }
        }
    }

    /**
     * 获取元素的值。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement} srcNodeRef 元素ID、查询值或元素
     */
    static getInnerText(srcNodeRef) {
        if (srcNodeRef) {
            let element;
            if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    element = document.getElementById(srcNodeRef);
                } else {
                    element = document.querySelector(srcNodeRef);
                }
            } else {
                element = srcNodeRef;
            }
            return element.innerText;
        }
    }

    /**
     * 设置元素的值。
     *
     * @author Helsing
     * @date 2019/11/12
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {String} value 值。
     */
    static setInnerText(srcNodeRef, value) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < srcNodeRef.length; i++) {
                    let element = srcNodeRef[i];
                    if (this.isElement(element)) {
                        element.innerText = value;
                    }
                }
            } else if (typeof (srcNodeRef) === 'string') {
                if (srcNodeRef.indexOf('#') < 0 && srcNodeRef.indexOf('.') < 0 && srcNodeRef.indexOf(' ') < 0) {
                    let element = document.getElementById(srcNodeRef);
                    element && (element.innerText = value);
                } else {
                    const elements = document.querySelectorAll(srcNodeRef);
                    for (let i = 0; i < elements.length; i++) {
                        elements[i].innerText = value;
                    }
                }
            } else {
                if (this.isElement(srcNodeRef)) {
                    srcNodeRef.innerText = value;
                }
            }
        }
    }

    /**
     * 获取元素绝对纵坐标。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {String|Element|HTMLElement} srcNodeRef 元素ID、查询文本或元素对象。
     * @returns {number} 偏移。
     */
    static getAbsoluteTop(srcNodeRef) {
        if (typeof (srcNodeRef) === 'string') {
            srcNodeRef = this.getElement(srcNodeRef);
        }
        if (srcNodeRef instanceof HTMLElement) {
            let offset = srcNodeRef.offsetTop;
            srcNodeRef.offsetParent !== null && (offset += this.getAbsoluteTop(srcNodeRef.offsetParent));
            return offset;
        }
    }

    /**
     * 获取元素绝对横坐标。
     *
     * @author Helsing
     * @date 2019/11/14
     * @param {Element|HTMLElement} srcNodeRef 元素ID、查询文本或元素对象。
     * @returns {number} 偏移。
     */
    static getAbsoluteLeft(srcNodeRef) {
        if (typeof (srcNodeRef) === 'string') {
            srcNodeRef = this.getElement(srcNodeRef);
        }
        let offset = srcNodeRef.offsetLeft;
        srcNodeRef.offsetParent !== null && (offset += this.getAbsoluteLeft(srcNodeRef.offsetParent));
        return offset;
    }

    /**
     * 显示或隐藏元素。
     *
     * @author Helsing
     * @date 2019/12/24
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {Boolean} show 显示或隐藏。
     * @param {String} display 指定display的样式值，默认为inherit。
     */
    static showOrHideElement(srcNodeRef, show, display) {
        display = display || 'inherit';
        const elements = this.getElements(srcNodeRef);
        if (elements && elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                if (typeof show === 'boolean') {
                    element.style.setProperty('display', show ? display : 'none');
                } else {
                    const state = this.getCss(element, 'display');
                    element.style.setProperty('display', state === 'none' ? display : 'none');
                }
            }
        }
    }

    /**
     * 显示元素。
     *
     * @author Helsing
     * @date 2019/12/24
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组
     * @param {String} display 指定display的样式值，默认为inherit
     */
    static showElement(srcNodeRef, display) {
        this.showOrHideElement(srcNodeRef, true, display);
    }

    /**
     * 显示元素。
     *
     * @author Helsing
     * @date 2019/12/24
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {String} display 指定display的样式值，默认为inherit。
     */
    static hideElement(srcNodeRef, display) {
        this.showOrHideElement(srcNodeRef, false, display);
    }

    /**
     * 动态插入html内容
     *
     * @param {String|HTMLElement} srcNodeRef 元素ID或元素。
     * @param {Object|String} options 选项或html内容。
     * @param {String} options.content html内容。
     * @param {String} options.type 追加方式（append：元素内末尾追加；prepend：元素内起始处追加；before：元素前面追加；after：元素后面追加；replace：替换）。
     * @param {function} options.callback 回调函数。
     * @param {Number} options.delay 回调延迟。
     */
    static insertHtml(srcNodeRef, options) {
        let html = options, type = arguments[2] || 'append', callback = arguments[3], delay = arguments[4] || 100;
        const element = this.getElement(srcNodeRef);
        if (element) {
            if (typeof (options) === 'string') {
                if (typeof (type) === 'function') {
                    delay = callback;
                    callback = type;
                    type = undefined;
                }
                type = type || 'append';
                type = type.toLowerCase();
            } else if (typeof (options) === 'object') {
                type = options.type || 'append';
                type = type.toLowerCase();
                html = options.content;
                callback = options.callback;
                delay = options.delay;
            }

            if (type === 'append') {
                element.insertAdjacentHTML('afterbegin', html);
            } else if (type === 'prepend') {
                element.insertAdjacentHTML('beforeend', html);
            } else if (type === 'after') {
                element.insertAdjacentHTML('afterend', html);
            } else if (type === 'before') {
                element.insertAdjacentHTML('beforebegin', html);
            } else if (type === 'replace') {
                element.innerHTML = '';
                element.insertAdjacentHTML('afterbegin', html);
            }

            if (typeof (callback) === 'function') {
                setTimeout(callback, delay || 100);
            }
        }
    }

    /**
     * 动态加载html页面。
     *
     * @param {String|HTMLElement} srcNodeRef 元素ID或元素。
     * @param {Object|String} options 选项或页面url。
     * @param {String} options.pageUrl 页面url。
     * @param {String} options.type 追加方式（append：元素内末尾追加；prepend：元素内起始处追加；before：元素前面追加；after：元素后面追加；replace：替换）。
     * @param {function} options.callback 回调函数。
     * @param {Number} options.delay 回调延迟。
     */
    static loadHtml(srcNodeRef, options) {
        let url = options, type = arguments[2] || 'replace', callback = arguments[3], delay = arguments[4] || 100;
        if (typeof (options) === 'object') {
            url = options.pageUrl;
            type = options.type || 'replace';
            callback = options.callback;
            delay = options.delay || 100;
        }
        get(url, html => this.insertHtml(srcNodeRef, html, type, callback, delay), 'html');
    }

    /**
     * 绑定事件。
     *
     * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
     * @param {String|Function} [eventName='click'] 事件名称。
     * @param {Function} [eventFunction] 事件方法。
     */
    static bindEvent(srcNodeRef, eventName = 'click', eventFunction = () => {
        console.log(eventName + ' event fired.');
    }) {
        // 两参数重载
        if (typeof eventName === 'function') {
            eventFunction = eventName;
            eventName = 'click';
        }

        const elements = this.getElements(srcNodeRef);
        if (elements && elements.length > 0) {
            const length = elements.length;
            for (let i = 0; i < length; i++) {
                elements[i].addEventListener(eventName, eventFunction, false);
            }
        }
    }

    /**
     * 为UL元素绑定鼠标停留事件。
     *
     * @param {string|HTMLElement} srcNodeRefLi li元素ID或元素。
     * @param {string|HTMLElement} srcNodeRefUl ul元素ID或元素。
     * @param {Document|Element} [liNodeFrom] 列表项源DOM。
     * @param {Document|Element} [ulNodeFrom] 列表容器源DOM。
     */
    static bindUListMouseHoverEvent(srcNodeRefLi, srcNodeRefUl, liNodeFrom = document, ulNodeFrom = document) {
        const li = this.getElement(srcNodeRefLi, liNodeFrom);
        const ul = this.getElement(srcNodeRefUl, ulNodeFrom);
        if (li) {
            li.onmouseover = function () {
                if (ul) {
                    ul.style.display = 'inherit';
                }
            };
            li.onmouseout = function () {
                if (ul) {
                    ul.style.display = 'none';
                }
            };
        }
    }

    /**
     * 绑定拖拽动作。
     *
     * @param {string|Element|HTMLElement|HTMLElement[]} srcNodeRef 拖拽的元素。
     * @param {string|Element|HTMLElement} moveNodeRef 要移动的元素。
     * @param {Document|Element} [srcNodeFrom] 源目标DOM。
     * @param {Document|Element} [moveNodeFrom] 移动目标DOM。
     */
    static bindMovingAction(srcNodeRef, moveNodeRef, srcNodeFrom = document, moveNodeFrom = document) {
        if (srcNodeRef) {
            if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
                for (let i = 0; i < length; i++) {
                    this.bindMovingAction(srcNodeRef[i], moveNodeRef, srcNodeFrom, moveNodeFrom);
                }
            } else if (typeof (srcNodeRef) === 'string') {
                const elements = this.getElements(srcNodeRef, srcNodeFrom);
                for (let i = 0; i < elements.length; i++) {
                    this.bindMovingAction(elements[i], moveNodeRef, srcNodeFrom, moveNodeFrom);
                }
            } else {
                if (!moveNodeRef) {
                    moveNodeRef = srcNodeRef;
                } else {
                    moveNodeRef = this.getElement(moveNodeRef, moveNodeFrom);
                }
                // 拖拽功能主要触发三个事件：onmousedown\onmousemove\onmouseup
                // 点击某物体时，用drag对象即可，move和up是全局区域，也就是整个文档通用，
                // 应该使用document对象，而不是drag对象，否则，采用drag对象时物体只能往右方或下方移动。
                srcNodeRef.onmousedown = function (event) {
                    const e = event;
                    const diffX = e.clientX - moveNodeRef.offsetLeft; //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离
                    const diffY = e.clientY - moveNodeRef.offsetTop;
                    /*低版本ie bug:物体被拖出浏览器可是窗口外部时，还会出现滚动条，
                     解决方法是采用ie浏览器独有的2个方法setCapture()\releaseCapture(),这两个方法，
                     可以让鼠标滑动到浏览器外部也可以捕获到事件，而我们的bug就是当鼠标移出浏览器的时候，
                     限制超过的功能就失效了。用这个方法，即可解决这个问题。注：这两个方法用于onmousedown和onmouseup中*/
                    // eslint-disable-next-line no-prototype-builtins
                    if (moveNodeRef.hasOwnProperty('setCapture')) {
                        moveNodeRef.setCapture();
                    }
                    // 鼠标移动
                    document.onmousemove = function (event) {
                        const e = event;
                        let left = e.clientX - diffX;
                        let top = e.clientY - diffY;
                        //控制拖拽物体的范围只能在浏览器视窗内，不允许出现滚动条
                        if (left < 0) {
                            left = 0;
                        } else if (left > window.innerWidth - moveNodeRef.offsetWidth) {
                            left = window.innerWidth - moveNodeRef.offsetWidth;
                        }
                        if (top < 0) {
                            top = 0;
                        } else if (top > window.innerHeight - moveNodeRef.offsetHeight) {
                            top = window.innerHeight - moveNodeRef.offsetHeight;
                        }
                        //移动时重新得到物体的距离，解决拖动时出现晃动的现象
                        moveNodeRef.style.left = left + 'px';
                        moveNodeRef.style.top = top + 'px';
                        moveNodeRef.style.bottom = 'auto';
                    };
                    // 鼠标弹起
                    document.onmouseup = function () {
                        this.onmousemove = null;
                        this.onmouseup = null; //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
                        //修复低版本ie bug
                        // eslint-disable-next-line no-prototype-builtins
                        if (moveNodeRef.hasOwnProperty('releaseCapture')) {
                            moveNodeRef.releaseCapture();
                        }
                    };
                };
            }
        }
    }

    /**
     * 动态调用方法。
     *
     * @param {string} code 代码.
     */
    static dynamicExecuteFunction(code) {
        if (!code) {
            return;
        }

        // 预处理代码
        const solveCode = code.replace(/\(.*\)$/, '');

        const arr = solveCode.split('.');
        if (!arr || arr.length === 0) {
            //console.log("动态调用函数错误：函数为空！");
            return;
        }

        arr[arr.length - 1] += code.substr(code.indexOf('('));

        const func = arr[arr.length - 1];
        if (!/^.*\(.*\)$/.test(func)) {
            console.warn('动态调用函数错误：非法的函数名！');
            return;
        }
        // 处理函数体。
        let funcBody = window;
        if (arr.length > 1) {
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === 'window') {
                    funcBody = window;
                } else if (arr[i] === 'this') {
                    funcBody = this;
                } else {
                    funcBody = funcBody[arr[i]];
                }
                if (!funcBody) {
                    break;
                }
            }
        }
        // 处理函数名。
        const funcName = func.replace(/\(.*\)$/, ''); // 去掉括号及括号中的内容，方法名：func
        // 处理函数参数（目前仅支持字符型、数值型、布尔型）。
        const params = func.replace(funcName, '').trim().replace(/(^\()|(\)$)/g, ''); // 去掉字符的括号，参数：(p1,p2,p3)
        const paramsArr = params.split(','); // 分割参数
        for (let i = 0; i < paramsArr.length; i++) {
            let param = paramsArr[i].trim();
            if (param.indexOf('\'') < 0) { // 不包含引号的单独处理，目前仅支持布尔型和数值型
                if (param?.toLowerCase() === 'true' || param?.toLowerCase() === 'false') {
                    if (param.toLowerCase() === 'true') {
                        param = true;
                    } else if (param.toLowerCase() === 'false') {
                        param = false;
                    }
                } else if (/^([-+])?\d+(\.\d+)?$/.test(param)) {
                    param = Number(param);
                }
            } else { // 包含引号的判定为字符串
                param = param.replace(/(^')|('$)|(^")|("$)/g, ''); // 去掉字符的引号
            }
            paramsArr[i] = param;
        }
        // 动态执行函数。
        if (funcBody && typeof funcBody[funcName] === 'function') {
            if (params && params.length > 0) {
                funcBody[funcName](...paramsArr);
            } else {
                funcBody[funcName]();
            }
        }
    }

    //#endregion

    //#region ID

    /**
     * 获取全球唯一ID。
     *
     * @param {boolean} [removeMinus=true] 是否去除“-”号。
     * @param {boolean} [uppercase=false] 大写。
     * @param {string} [prefix='s'] 前缀。
     * @returns {string} GUID。
     */
    static getGuid(removeMinus = true, uppercase = false, prefix = 's') {
        let d = new Date().getTime();
        let result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        if (removeMinus) {
            result = result.replace(/-/g, '');
        }
        if (uppercase === true) {
            result = result.toUpperCase();
        } else {
            result = result.toLowerCase();
        }

        return (uppercase ? prefix.toUpperCase() : prefix) + result.replace(new RegExp('-', 'g'), '').substring(1);
    }

    //#endregion

    //#region string

    /**
     * 移除文本中的注释内容。
     *
     * @param {string} str 输入文本
     * @returns {string} 输出文本
     */
    static removeComments(str) {
        // 替换块注释
        let reg = /\/\*[\w\W]*?\*\//g;
        let ret = str.replace(reg, ' ');
        // 替换单行注释
        reg = /^\s+\/\/[\w\W]*?$/gm;
        ret = ret.replace(reg, '');
        // 替换后置单行注释
        ret = ret.replace(/^([\w\W]*?)([^:]\/\/[\w\W]*?)$/gm, '$1');
        return ret;
    }

    /**
     * 首字母小写。
     *
     * @param {string} str 输入文本
     * @returns {string} 输出文本
     */
    static caseCamel(str) {
        if (str && typeof str === 'string') {
            return str.replace(str[0], str[0].toLowerCase());
        }
    }

    //#endregion
}