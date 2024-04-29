uniform sampler2D colorTexture;
uniform sampler2D depthTexture;
uniform float u_radius;
uniform vec4 u_centerEC;
uniform vec3 u_planeNormalEC;

in vec2 v_textureCoordinates;
out vec4 fragColor;

/**
 * UV坐标转眼睛坐标。
 *
 * @param uv 纹理坐标。
 * @param depth 深度。
 */
vec4 toEye(in vec2 uv, in float depth)
{
    vec2 xy = vec2((uv.x * 2.0 - 1.0), (uv.y * 2.0 - 1.0));
    vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);
    posInCamera = posInCamera / posInCamera.w;
    return posInCamera;
}

/**
 * 获取深度。
 *
 * @param depth 结构深度。
 */
float getDepth(in vec4 depth)
{
    float z_window = czm_unpackDepth(depth);
    z_window = czm_reverseLogDepth(z_window);
    float n_range = czm_depthRange.near;
    float f_range = czm_depthRange.far;
    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
}

/**
 * 获取点在平面上的投影坐标。
 *
 * @param planeNormal 平面法向量。
 * @param planeOrigin 平面上的点。
 * @param point 平面外的点。
 */
vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)
{
    // 获取平面外的点到平面上点的向量。
    vec3 v01 = point - planeOrigin;
    // 计算平面法向量与v01向量的点积。
    // ----------------------------------------
    // 点乘的结果表示向量a在向量b方向上的投影与向量b的乘积，反映了两个向量在方向上的相似度，结果越大越相似。
    // 基于结果可以判断这两个向量是否是同一方向，是否正交垂直。
    // 值>0，则方向基本相同，夹角在0°到90°之间；
    // 值=0，则正交，相互垂直；
    // 值<0，则方向基本相反，夹角在90°到180°之间。
    // ----------------------------------------
    float d = dot(planeNormal, v01);
    // 获取点的投影。
    return (point - planeNormal * d);
}

/**
 * 窗体坐标转眼睛坐标。
 */
vec4 getPositionEC(){
    return czm_windowToEyeCoordinates(gl_FragCoord);
}

/**
 * 获取标准坐标。
 */
vec3 getNormalEC(){
    return vec3(1.0);
}

/**
 * 深度值线性拉伸。
 *
 * @param depth 深度。
 */
float linearDepth(float depth)
{
    float far = czm_currentFrustum.y;
    float near = czm_currentFrustum.x;
    return (2.0 * near) / (far + near - depth * (far - near));
}

float edgeDetection(float length)
{
    float directions[3];
    directions[0] = -1.0;
    directions[1] = 0.0;
    directions[2] = 1.0;

    float scalars[3];
    scalars[0] = 3.0;
    scalars[1] = 10.0;
    scalars[2] = 3.0;

    float padx = 1.0 / czm_viewport.z;
    float pady = 1.0 / czm_viewport.w;

    float horizEdge = 0.0;
    float vertEdge = 0.0;

    for (int i = 0; i < 3; ++i) {
        float dir = directions[i];
        float scale = scalars[i];

        horizEdge -= texture(depthTexture, v_textureCoordinates + vec2(-padx, dir * pady)).x * scale;
        horizEdge += texture(depthTexture, v_textureCoordinates + vec2(padx, dir * pady)).x * scale;

        vertEdge -= texture(depthTexture, v_textureCoordinates + vec2(dir * padx, -pady)).x * scale;
        vertEdge += texture(depthTexture, v_textureCoordinates + vec2(dir * padx, pady)).x * scale;
    }

    float len = sqrt(horizEdge * horizEdge + vertEdge * vertEdge);
    float alpha = len > length ? 1.0 : 0.0;
    return alpha;
}

/**
 * 主函数。
 */
void main() {
    // 釉色 = 结构二维(颜色纹理, 纹理坐标)。
    fragColor = texture(colorTexture, v_textureCoordinates);

    // 获取深度，传入参数：结构二维(深度纹理, 纹理坐标)。
    float depth = getDepth(texture(depthTexture, v_textureCoordinates));
    // float depth = czm_readDepth(depthTexture, v_textureCoordinates);

    // 纹理坐标转眼睛坐标。
    vec4 eyePosition = toEye(v_textureCoordinates, depth);
    // 获取世界坐标。
    vec4 worldPosition = czm_inverseView * eyePosition;

    /*
    // 窗体坐标转眼睛坐标。
    vec4 windowEC = getPositionEC();
    // 获取视窗的分辨率，z:width, w:height。
    vec2 resolution = czm_viewport.zw;
    // 获取纹理坐标。
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    */

    // 获取投影坐标。
    vec3 prj = pointProjectOnPlane(u_planeNormalEC.xyz, u_centerEC.xyz, eyePosition.xyz);

    // 自定义混色方案。
    float dis = length(eyePosition.xyz - u_centerEC.xyz);
    if (dis > u_radius){
        dis = 1.0;
    } else{
        dis = 0.2;
    }

    float alpha = edgeDetection(0.25); // linearDepth(depth);
    vec4 c = vec4(dis, 0.0, 0.0, alpha);

    // 混色。
    fragColor = mix(texture(colorTexture, v_textureCoordinates), c, 0.8);
}
