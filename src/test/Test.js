import {ObjectBase} from '../core/ObjectBase';
import TestFS from '../shaders/Test.fs.glsl';
import LinearDepthFS from '../shaders/LinearDepth.fs.glsl';
import EdgeDetectionFS from '../shaders/EdgeDetection.fs.glsl';
import {CesiumUtil} from '../common/CesiumUtil';
import * as Cesium from 'cesium';

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
        const map = this.map;
        const viewer = map.viewer;

        // ■ 自定义材质测试
        /*map.rectMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 39],
            zoomTo: true
        })
        map.rectMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 39],
            type: 1.2,
        })
        map.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[82, 39],
            type: 2.1,
        })
        map.rectMaterial({
            name: '中心向外渐变矩形材质',
            position:[83, 39],
            type: 2.2,
        })
        map.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 39],
            type: 2.3,
        })
        map.rectMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 39],
            type: 2.4,
        })
        map.circleMaterial({
            name: 'x轴向渐变矩形材质',
            type: 1.1,
            position:[80, 38],
        })
        map.circleMaterial({
            name: 'y轴向渐变矩形材质',
            position:[81, 38],
            type: 1.2,
        })
        map.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[82, 38],
            type: 2.1,
        })
        map.circleMaterial({
            name: '中心向外部渐变矩形材质',
            position:[83, 38],
            type: 2.2,
        })
        map.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[84, 38],
            type: 2.3,
        })
        map.circleMaterial({
            name: '外部向中心渐变矩形材质',
            position:[85, 38],
            type: 2.4,
        })*/

        // ■ 雷达扫描测试
        /*map.circleMaterial({
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
        /*const radius = 1000;
        const cartesian3Center = Cesium.Cartesian3.fromDegrees(121.4814, 31.2424, 0);
        const cartesian4Center = new Cesium.Cartesian4(
            cartesian3Center.x,
            cartesian3Center.y,
            cartesian3Center.z,
            1
        );
        const scratchCartesian4Center = new Cesium.Cartesian4();
        const scratchCartesian3Normal = new Cesium.Cartesian3();
        CesiumUtil.addPostProcessStages(viewer.postProcessStages, {
            name: 'PostProcessStageCompositeTest',
            items: [
                {
                    name: 'PostProcessStageLinearDepth',
                    fragmentShader: LinearDepthFS,
                },
                {
                    name: 'PostProcessStageEdgeDetection',
                    fragmentShader: EdgeDetectionFS,
                    uniforms: {
                        length : 0.25,
                        color : Cesium.Color.clone(Cesium.Color.BLACK)
                    }
                },
                /!*{
                    name: 'PostProcessStageTest',
                    fragmentShader: TestFS,
                    uniforms: {
                        u_radius: radius,
                        u_centerEC: () => {
                            Cesium.Matrix4.multiplyByVector(
                                viewer.camera.viewMatrix,
                                cartesian4Center,
                                scratchCartesian4Center
                            );
                            return scratchCartesian4Center;
                        },
                        u_planeNormalEC: () => {
                            Cesium.Cartesian3.normalize(
                                cartesian3Center,
                                scratchCartesian3Normal
                            );
                            return scratchCartesian3Normal;
                        }
                    }
                }*!/
            ]
        });
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(cartesian3Center, radius));*/
    }
}
