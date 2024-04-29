uniform sampler2D depthTexture;

in vec2 v_textureCoordinates;
out vec4 fragColor;

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

/**
 * 主函数。
 */
void main(void)
{
    float depth = czm_readDepth(depthTexture, v_textureCoordinates);
    fragColor = vec4(linearDepth(depth));
}
