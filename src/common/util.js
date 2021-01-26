/**
 * 判断对象是否为元素。
 *
 * @author Helsing
 * @date 2019/12/24
 * @param {Object} obj 对象
 * @returns {Boolean} 是或否
 */
function isElement(obj) {
    return (typeof HTMLElement === 'object')
        ? (obj instanceof HTMLElement)
        : !!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string');
}

/**
 * 获取元素。
 *
 * @author Helsing
 * @date 2019/11/14
 * @param {String|HTMLElement|Array} query 查询文本（如果输入参数为对象，则直接返回该对象；如果输入参数为数组，则返回会第一个对象）
 * @returns {HTMLElement} element 元素
 */
function getElement(query) {
    let element = undefined;
    if (typeof (query) === "string") {
        if (query.indexOf("#") < 0 && query.indexOf(".") < 0 && query.indexOf(" ") < 0) {
            element = document.getElementById(query);
        } else {
            element = document.querySelector(query);
        }
    } else if (typeof (query) === "object") {
        if (isElement(query)) {
            element = query;
        } else if (query instanceof Array) {
            const length = query.length;
            if (length > 0) {
                for (let i = 0; i < length; i++) {
                    if (isElement(query[i])) {
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
function getOrCreateElement(id, handler, parent) {
    let element = document.getElementById(id);
    parent && (parent = getElement(parent));
    !parent && (parent = document.body);
    if (!element) {
        if (typeof (handler) === "string") {
            parent.insertAdjacentHTML('beforeend', handler);
        } else if (typeof (handler) === "function") {
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
function getElements(query) {
    let elements = undefined;
    if (typeof (query) === "string") {
        if (query.indexOf("#") < 0 && query.indexOf(".") < 0 && query.indexOf(" ") < 0) {
            const element = document.getElementById(query);
            elements = [];
            elements.push(element);
        } else {
            elements = document.querySelectorAll(query);
        }
    } else if (typeof (query) === "object") {
        if (isElement(query)) {
            elements = [];
            elements.push(query);
        } else if (query instanceof Array) {
            const length = query.length;
            if (length > 0) {
                elements = [];
                let element;
                for (let i = 0; i < length; i++) {
                    element = query[i];
                    if (isElement(element)) {
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
function getChildElement(parent, query) {
    let element = undefined;
    parent = getElement(parent);
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
function getChildElements(parent, query) {
    let elements = undefined;
    const parents = getElements(parent);
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
function addCssClass(srcNodeRef, className) {
    if (srcNodeRef && className) {
        if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
            for (let i = 0; i < srcNodeRef.length; i++) {
                let element = srcNodeRef[i];
                if (element.classList) {
                    for (let j = 0; j < className.split(" ").length; j++) {
                        element.classList.add(className.split(" ")[j]);
                    }
                }
            }
        } else if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                let element = document.getElementById(srcNodeRef);
                if (element) {
                    for (let j = 0; j < className.split(" ").length; j++) {
                        element.classList.add(className.split(" ")[j]);
                    }
                }
            } else {
                const elements = document.querySelectorAll(srcNodeRef);
                for (let i = 0; i < elements.length; i++) {
                    let element = elements[i];
                    for (let j = 0; j < className.split(" ").length; j++) {
                        element.classList.add(className.split(" ")[j]);
                    }
                }
            }
        } else {
            for (let j = 0; j < className.split(" ").length; j++) {
                srcNodeRef.classList.add(className.split(" ")[j]);
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
function setStyle(srcNodeRef, cssText) {
    if (srcNodeRef) {
        if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
            for (let i = 0; i < srcNodeRef.length; i++) {
                srcNodeRef[i].style.cssText = cssText;
            }
        } else if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
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
function getCss(srcNodeRef, property) {
    if (srcNodeRef) {
        let element;
        if (typeof srcNodeRef === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                element = document.getElementById(srcNodeRef);
            } else {
                element = document.querySelector(srcNodeRef);
            }
        } else {
            element = srcNodeRef;
        }
        if (element.hasOwnProperty("currentStyle")) { // 旧版IE
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
function setCss(srcNodeRef, property, value) {
    if (srcNodeRef) {
        if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
            for (let i = 0; i < srcNodeRef.length; i++) {
                srcNodeRef[i].style.setProperty(property, value);
            }
        } else if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
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
function setAttribute(srcNodeRef, attribute, value) {
    if (srcNodeRef) {
        if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
            for (let i = 0; i < srcNodeRef.length; i++) {
                srcNodeRef[i].setAttribute(attribute, value);
            }
        } else if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
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
function getInnerText(srcNodeRef) {
    if (srcNodeRef) {
        let element;
        if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
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
function setInnerText(srcNodeRef, value) {
    if (srcNodeRef) {
        if (srcNodeRef instanceof Array && srcNodeRef.length > 0) {
            for (let i = 0; i < srcNodeRef.length; i++) {
                let element = srcNodeRef[i];
                if (isElement(element)) {
                    element.innerText = value;
                }
            }
        } else if (typeof (srcNodeRef) === "string") {
            if (srcNodeRef.indexOf("#") < 0 && srcNodeRef.indexOf(".") < 0 && srcNodeRef.indexOf(" ") < 0) {
                let element = document.getElementById(srcNodeRef);
                element && (element.innerText = value);
            } else {
                const elements = document.querySelectorAll(srcNodeRef);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].innerText = value;
                }
            }
        } else {
            if (isElement(srcNodeRef)) {
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
function getAbsoluteTop(srcNodeRef) {
    if (typeof (srcNodeRef) === "string") {
        srcNodeRef = getElement(srcNodeRef);
    }
    if (srcNodeRef instanceof HTMLElement) {
        let offset = srcNodeRef.offsetTop;
        srcNodeRef.offsetParent !== null && (offset += getAbsoluteTop(srcNodeRef.offsetParent));
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
function getAbsoluteLeft(srcNodeRef) {
    if (typeof (srcNodeRef) === "string") {
        srcNodeRef = getElement(srcNodeRef);
    }
    let offset = srcNodeRef.offsetLeft;
    srcNodeRef.offsetParent !== null && (offset += getAbsoluteLeft(srcNodeRef.offsetParent));
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
function showOrHideElement(srcNodeRef, show, display) {
    display = display || "inherit";
    const elements = getElements(srcNodeRef);
    if (elements && elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (typeof show === "boolean") {
                element.style.setProperty("display", show ? display : "none");
            } else {
                const state = getCss(element, "display");
                element.style.setProperty("display", state === "none" ? display : "none");
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
function showElement(srcNodeRef, display) {
    showOrHideElement(srcNodeRef, true, display);
}

/**
 * 显示元素。
 *
 * @author Helsing
 * @date 2019/12/24
 * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
 * @param {String} display 指定display的样式值，默认为inherit。
 */
function hideElement(srcNodeRef, display) {
    showOrHideElement(srcNodeRef, false, display);
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
function insertHtml(srcNodeRef, options) {
    let html = options, type = arguments[2] || "append", callback = arguments[3], delay = arguments[4] || 100;
    const element = getElement(srcNodeRef);
    if (element) {
        if (typeof (options) === "string") {
            if (typeof (type) === "function") {
                delay = callback;
                callback = type;
                type = undefined;
            }
            type = type || "append";
            type = type.toLowerCase();
        } else if (typeof (options) === "object") {
            type = options.type || "append";
            type = type.toLowerCase();
            html = options.content;
            callback = options.callback;
            delay = options.delay;
        }

        if (type === "append") {
            element.insertAdjacentHTML("afterbegin", html);
        } else if (type === "prepend") {
            element.insertAdjacentHTML("beforeend", html);
        } else if (type === "after") {
            element.insertAdjacentHTML("afterend", html);
        } else if (type === "before") {
            element.insertAdjacentHTML("beforebegin", html);
        } else if (type === "replace") {
            element.innerHTML = "";
            element.insertAdjacentHTML("afterbegin", html);
        }

        if (typeof (callback) === "function") {
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
function loadHtml(srcNodeRef, options) {
    let url = options, type = arguments[2] || "replace", callback = arguments[3], delay = arguments[4] || 100;
    if (typeof (options) === "object") {
        url = options.pageUrl;
        type = options.type || "replace";
        callback = options.callback;
        delay = options.delay || 100;
    }
    get(url, html => insertHtml(srcNodeRef, html, type, callback, delay), "html");
}

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
function ajax(options) {
    // 创建一个ajax对象
    const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft,XMLHTTP");
    // data参数处理：{a:1,b:2} => a=1&b=2
    let str = "";
    for (let key in options.data) {
        if (options.data.hasOwnProperty(key)) {
            str += "&" + key + "=" + options.data[key];
        }
    }
    str = str.slice(1);

    if (options.dataType === "json") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/json");
        xhr.responseType = "json";
    } else if (options.dataType === "xml") {
        xhr.overrideMimeType && xhr.overrideMimeType("text/xml");// 或"application/xml"
        xhr.responseType = "document";
    } else if (options.dataType === "html" || options.dataType === "htm") {
        xhr.overrideMimeType && xhr.overrideMimeType("text/html");
        //xhr.responseType = "document";
    } else if (options.dataType === "xhtml") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/xhtml+xml");
        //xhr.responseType = "document";
    } else if (options.dataType === "js") {
        xhr.overrideMimeType && xhr.overrideMimeType("text/javascript");
    } else if (options.dataType === "css") {
        xhr.overrideMimeType && xhr.overrideMimeType("text/xml");
    } else if (options.dataType === "txt") {
        xhr.overrideMimeType && xhr.overrideMimeType("text/plain");
    } else if (options.dataType === "pdf") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/pdf");
    } else if (options.dataType === "swf") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/x-shockwave-flash");
    } else if (options.dataType === "jar") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/java-archive");
    } else if (options.dataType === "jar") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/java-archive");
    } else if (options.dataType === "tar") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/x-tar");
    } else if (options.dataType === "rar") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/x-rar-compressed");
    } else if (options.dataType === "7z") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/x-7z-compressed");
    } else if (options.dataType === "bin") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/octet-stream");
    } else if (options.dataType === "docx") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } else if (options.dataType === "xls") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/vnd.ms-excel");
    } else if (options.dataType === "xlsx") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } else if (options.dataType === "ppt") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/vnd.ms-powerpoint");
    } else if (options.dataType === "pptx") {
        xhr.overrideMimeType && xhr.overrideMimeType("application/vnd.openxmlformats-officedocument.presentationml.presentation");
    } else if (options.dataType === "bmp") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/bmp");
    } else if (options.dataType === "png") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/png");
    } else if (options.dataType === "gif") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/gif");
    } else if (options.dataType === "ico") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/vnd.microsoft.icon");
    } else if (options.dataType === "jpg" || options.dataType === "jpeg") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/jpeg");
    } else if (options.dataType === "tif" || options.dataType === "tiff") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/tiff");
    } else if (options.dataType === "svg") {
        xhr.overrideMimeType && xhr.overrideMimeType("image/svg+xml");
    } else if (options.dataType === "mp3") {
        xhr.overrideMimeType && xhr.overrideMimeType("audio/mpeg");
    } else if (options.dataType === "aac") {
        xhr.overrideMimeType && xhr.overrideMimeType("audio/aac");
    } else if (options.dataType === "wav") {
        xhr.overrideMimeType && xhr.overrideMimeType("audio/wav");
    } else if (options.dataType === "mid" || options.dataType === "midi") {
        xhr.overrideMimeType && xhr.overrideMimeType("audio/midi audio/x-midi");
    } else if (options.dataType === "avi") {
        xhr.overrideMimeType && xhr.overrideMimeType("video/x-msvideo");
    } else if (options.dataType === "mpeg") {
        xhr.overrideMimeType && xhr.overrideMimeType("video/mpeg");
    }

    if (options.type === "get") {
        const url = options.url + "?" + str;
        xhr.open("get", url, options.async || true);
        xhr.send();
    } else if (options.type === "post") {
        xhr.open("post", options.url, options.async || true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(str)
    }

    if (typeof (options.async) === "undefined" || options.async === true) { // 异步模式
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 当请求成功的时候将请求的数据传递给成功回调函数
                typeof (options.success) === "function" && options.success(xhr.response)
            } else if (xhr.status !== 200) {
                //当失败的时候将服务器的状态传递给失败的回调函数
                typeof (options.error) === "function" && options.error(xhr.status);
            }
        }
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
function get(options, data = undefined, success = undefined, dataType = undefined) {
    let newOptions;
    if (typeof options === "string") {
        if (typeof (data) === "function") {
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
        newOptions.type = "get";
        return ajax(newOptions)
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
function post(options, data = undefined, success = undefined, dataType = undefined) {
    let newOptions;
    if (typeof (options) === "string") {
        if (typeof (data) === "function") {
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
        newOptions.type = "post";
        return ajax(newOptions)
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
function getJSON(url, async = true, callback = undefined) {
    let arr2 = true;
    let arr3 = callback;

    //创建一个ajax对象
    const xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    xhr.overrideMimeType && xhr.overrideMimeType("application/json");
    xhr.responseType = 'json';
    xhr.open("GET", url, async); // 异步方式
    xhr.send();

    if (typeof async === "boolean") {
        arr2 = async;
    } else if (typeof async === "function") {
        arr3 = async;
    }

    if (arr2) { // 异步模式
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                typeof arr3 === "function" && arr3(xhr.response);
            }
        }
    } else { //同步模式
        if (xhr.readyState === 4 && xhr.status === 200) {
            return xhr.response;
        }
    }
}

/**
 * 绑定事件。
 *
 * @author Helsing
 * @date 2019/11/12
 * @param {String|HTMLElement|Array} srcNodeRef 元素ID、元素或数组。
 * @param {String|Function} [eventName='click'] 事件名称。
 * @param {Function} [eventFunction] 事件方法。
 */
function bindEvent(srcNodeRef, eventName = "click", eventFunction = () => {
    console.log(eventName + " event fired.")
}) {
    // 两参数重载
    if (typeof eventName === "function"){
        eventFunction = eventName;
        eventName = "click";
    }

    const elements = getElements(srcNodeRef);
    if (elements && elements.length > 0) {
        const length = elements.length;
        for (let i = 0; i < length; i++) {
            elements[i].addEventListener(eventName, eventFunction, false)
        }
    }
}

export {
    addCssClass,
    ajax,
    bindEvent,
    getAbsoluteTop,
    getAbsoluteLeft,
    getChildElement,
    getChildElements,
    getElement,
    getInnerText,
    getJSON,
    getOrCreateElement,
    hideElement,
    insertHtml,
    loadHtml,
    post,
    setAttribute,
    setCss,
    setStyle,
    setInnerText,
    showElement,
}