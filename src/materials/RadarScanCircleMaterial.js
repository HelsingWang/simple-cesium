import * as Cesium from 'cesium';
import {CesiumUtil} from '../common/CesiumUtil';

/**
 * 雷达扫描材质。
 *
 * @class
 * @author Helsing
 * @since 2023/11/11
 */
export class RadarScanCircleMaterial extends Cesium.Material {
    /**
     * 构造雷达扫描材质。
     *
     * @param options 选项。
     * @constructor
     */
    constructor(options = {}) {
        const newOptions = {
            fabric: {
                type: options.type || 'RadarScanCircle',
                uniforms: options.uniforms || {
                    type: options.type ?? 0.0,
                    color: CesiumUtil.getCesiumColor(options.color || 'rgb(0,255,255)'),
                    backgroundColor: CesiumUtil.getCesiumColor(options.backgroundColor || 'rgba(0,255,255,0.2)'),
                    sectorColor: CesiumUtil.getCesiumColor(options.sectorColor || 'rgba(255,0,0,0.8)'),
                    time: options.time ?? 0.00,
                    count: options.count ?? 5.0,
                    gradient: options.gradient ?? 0.01,
                    width: options.width ?? 0.004,
                    radians: options.radians ?? 0.00,
                    offset: options.offset ?? 0.0
                },
                source: options.shaderSource || `
                    uniform float type;
                    uniform vec4 color;
                    uniform vec4 backgroundColor;
                    uniform vec4 sectorColor;
                    uniform float count;
                    uniform float radians;
                    uniform float width;
                    uniform float offset;
    
                    czm_material czm_getMaterial(czm_materialInput materialInput)
                    {
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        vec2 st = materialInput.st;
                        float dis = distance(st, vec2(0.5));
                        
                        // test
                        if (type == 1.1){
                            material.diffuse = color.rgb;
                            material.alpha = st.s;
                        } else if (type == 1.2){
                            material.diffuse = color.rgb;
                            material.alpha = st.t;
                        } else if (type == 2.1){
                            material.diffuse = color.rgb;
                            material.alpha = dis;
                        } else if (type == 2.2){
                            material.diffuse = color.rgb;
                            material.alpha = dis * 2.0;
                        } else if (type == 2.3){
                            material.diffuse = color.rgb;
                            material.alpha = clamp(1.0 - dis * 2.0, 0.0, 1.0);
                        } else if (type == 2.4){
                            material.diffuse = color.rgb;
                            material.alpha = 0.7071 - dis;
                        }
                        
                        // material
                        float alpha;
                        vec3 diffuse;
                        
                        // 绘制圆圈
                        float sp = 1.0 / count / 2.0;
                        float m = mod(dis, sp);
                                                 
                        alpha = step(sp * (1.0 - width * 10.0), m);
                        // alpha = clamp(alpha, 0.2, 1.0);
                        if (alpha < backgroundColor.a){
                            alpha = backgroundColor.a;
                            diffuse = backgroundColor.rgb;
                        } else {
                            diffuse = color.rgb;
                        }
                        material.alpha = alpha;
                        material.diffuse = diffuse;
                        
                        // 绘制十字线
                        if ((st.s > 0.5 - width / 2.0 && st.s < 0.5 + width / 2.0) || (st.t > 0.5 - width / 2.0 && st.t < 0.5 + width / 2.0)) {
                            alpha = color.a;

                            material.alpha = alpha;
                            material.diffuse = color.rgb;
                        }
                        
                        // 绘制光晕
                        float ma = mod(dis + offset, 0.5);
                        if (ma < 0.25){
                            alpha = ma * 3.0 + alpha;
                        } else{
                            alpha = 3.0 * (0.5 - ma) + alpha;
                        }                           
                        material.alpha = alpha;
                        material.diffuse = sectorColor.rgb;

                        // 绘制扇区
                        vec2 xy = materialInput.st;
                        float rx = xy.x - 0.5;
                        float ry = xy.y - 0.5;
                        float at = atan(ry, rx);
                        // 半径
                        float radius = sqrt(rx * rx + ry * ry);
                        // 扇区叠加旋转角度
                        float current_radians = at + radians;
                        xy = vec2(cos(current_radians) * radius, sin(current_radians) * radius);
                        xy = vec2(xy.x + 0.5, xy.y + 0.5);

                        // 扇区渐变色渲染
                        if (xy.y - xy.x < 0.0 && xy.x > 0.5 && xy.y > 0.5){
                            material.alpha = alpha + backgroundColor.a;
                            material.diffuse = sectorColor.rgb;
                        }
                        return material;
                    }
                `
            },
            translucent: options.translucent ?? true
        };
        super(newOptions);
    }
}
