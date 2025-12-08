// Vertex Shader
export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment Shader with Simplex Noise for water distortion
export const fragmentShader = `
  uniform float uTime;
  uniform sampler2D uTexture;
  varying vec2 vUv;

  // Simplex Noise Function (Standard generic noise algo)
  // This creates organic, cloud-like patterns instead of robotic sine waves
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
              -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // WAVE CONFIGURATION
    float speed = 0.4;
    float scale = 3.0; // How "big" the ripples are
    float strength = 0.02; // How much they distort the image

    // Calculate noise based on UV and Time
    float noiseValue = snoise(vec2(uv.x * scale, uv.y * scale - uTime * speed));
    
    // Distort the UV coordinates
    vec2 distortedUv = uv + vec2(noiseValue * strength);

    // Fetch color from the texture using distorted UVs
    vec4 color = texture2D(uTexture, distortedUv);

    gl_FragColor = color;
  }
`
