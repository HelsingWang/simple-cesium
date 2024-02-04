import {ObjectBase} from '../core/ObjectBase';

/**
 * 测试。
 *
 * @alias Test
 * @category 测试
 * @class
 * @extends ObjectBase
 * @example
 * ````
 * const test = new Test({map: map});
 * ````
 * @author Helsing
 * @since 2024/2/2
 */
export class Test extends ObjectBase {
    /**
     * 三维视窗。
     *
     * @returns {SimpleMap}
     */
    get map() {
        return this.properties?.map;
    }

    constructor(options) {
        super(options);
    }

    execute() {
        // ■ 自定义材质测试
        /*this.map.rectMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 39],
            zoomTo: true
        })
        this.map.rectMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 39],
            type: 1.2,
        })
        this.map.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[82, 39],
            type: 2.1,
        })
        this.map.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[83, 39],
            type: 2.2,
        })
        this.map.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 39],
            type: 2.3,
        })
        this.map.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 39],
            type: 2.4,
        })
        this.map.circleMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 38],
        })
        this.map.circleMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 38],
            type: 1.2,
        })
        this.map.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[82, 38],
            type: 2.1,
        })
        this.map.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[83, 38],
            type: 2.2,
        })
        this.map.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 38],
            type: 2.3,
        })
        this.map.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 38],
            type: 2.4,
        })*/

        // ■ 雷达扫描测试
        /*this.map.circleMaterial({
            name: '雷达扫描',
            zoomTo: true,
            position: [85, 38],
            type: 2.4,
            color: 'rgb(0,255,50)',
            backgroundColor: 'rgba(0,255,50,0.2)',
            sectorColor: 'rgb(0,255,50)',
            radians: Math.PI * 3 / 8,
            offset: 0.2
        });*/

        // ■ 着色器坐标测试

    }
}
