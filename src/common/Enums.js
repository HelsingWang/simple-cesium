/**
 * 元素停靠枚举。
 *
 * @category 枚举
 * @enum
 */
export var ElementAlignEnum;
(function (ElementAlignEnum) {
    /** 左上角 */
    ElementAlignEnum["TOP_LEFT"] = "top-left";
    /** 上方 */
    ElementAlignEnum["TOP_CENTER"] = "top-center";
    /** 右上角 */
    ElementAlignEnum["TOP_RIGHT"] = "top-right";
    /** 左侧 */
    ElementAlignEnum["CENTER_LEFT"] = "center-left";
    /** 中间 */
    ElementAlignEnum["CENTER_CENTER"] = "center-center";
    /** 右侧 */
    ElementAlignEnum["CENTER_RIGHT"] = "center-right";
    /** 左下角 */
    ElementAlignEnum["BOTTOM_LEFT"] = "bottom-left";
    /** 下方 */
    ElementAlignEnum["BOTTOM_CENTER"] = "bottom-center";
    /** 右下角 */
    ElementAlignEnum["BOTTOM_RIGHT"] = "bottom-right";
})(ElementAlignEnum || (ElementAlignEnum = {}));

/**
 * 微件类型枚举。
 *
 * @category 枚举
 * @enum
 */
export var WidgetTypeEnum;
(function (WidgetTypeEnum) {
    /** 微件。 */
    WidgetTypeEnum["WIDGET"] = "WIDGET";
    /** 工具栏。 */
    WidgetTypeEnum["TOOLBAR"] = "TOOLBAR";
    /** 方位。 */
    WidgetTypeEnum["ORIENTATION"] = "ORIENTATION";
    /** 鹰眼图。 */
    WidgetTypeEnum["OVERVIEW"] = "OVERVIEW";
    /** 底图切换。 */
    WidgetTypeEnum["MAP_SWITCH"] = "MAP_SWITCH";
    /** 图层树。 */
    WidgetTypeEnum["LAYER_TREE"] = "LAYER_TREE";
    /** 缩放。 */
    WidgetTypeEnum["ZOOM"] = "ZOOM";
    /** 比例尺。 */
    WidgetTypeEnum["SCALE"] = "SCALE";
    /** 测量。 */
    WidgetTypeEnum["MEASURE"] = "MEASURE";
    /** 导航罗盘。 */
    WidgetTypeEnum["NAVIGATION"] = "NAVIGATION";
})(WidgetTypeEnum || (WidgetTypeEnum = {}));

/**
 * 工具栏类型枚举。
 *
 * @category 枚举
 * @enum
 */
export var ToolbarTypeEnum;
(function (ToolbarTypeEnum) {
    /** 上 */
    ToolbarTypeEnum["TOP"] = "top";
    /** 下 */
    ToolbarTypeEnum["BOTTOM"] = "bottom";
    /** 左 */
    ToolbarTypeEnum["LEFT"] = "left";
    /** 右 */
    ToolbarTypeEnum["RIGHT"] = "right";
    /** 浮动 */
    ToolbarTypeEnum["FLOAT"] = "float";
    /** 选项卡 */
    ToolbarTypeEnum["TAB"] = "tab";
})(ToolbarTypeEnum || (ToolbarTypeEnum = {}));

/**
 * 工具按钮类型枚举。
 *
 * @category 枚举
 * @enum
 */
export var ToolbarItemTypeEnum;
(function (ToolbarItemTypeEnum) {
    /** 图标和文字 */
    ToolbarItemTypeEnum['DEFAULT'] = 'DEFAULT';
    /** 仅图标 */
    ToolbarItemTypeEnum['IMAGE'] = 'IMAGE';
    /** 仅文字 */
    ToolbarItemTypeEnum['TEXT'] = 'TEXT';
})(ToolbarItemTypeEnum || (ToolbarItemTypeEnum = {}));
