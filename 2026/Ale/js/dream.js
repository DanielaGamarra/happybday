// Dreamy look: gradient-maps the scene into Monument Valley style pastels (plum, bubblegum, peach, cream),
// keeping a little of each object's own hue so grass, water and the tram stay readable.
import * as THREE from 'three';

const frag = /* glsl */`
precision highp float;
uniform sampler2D tColor;
uniform float night;
varying vec2 vUv;
vec3 rgb2hsv(vec3 c) { vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g)); vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10; return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x); }
vec3 hsv2rgb(vec3 c) { vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0); return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y); }
vec3 ramp(float t) {
  vec3 a = vec3(0.30, 0.20, 0.46), b = vec3(0.62, 0.38, 0.78), c = vec3(1.0, 0.50, 0.74), d = vec3(1.0, 0.76, 0.70), e = vec3(1.0, 0.96, 0.92);
  if (t < 0.25) return mix(a, b, t / 0.25);
  if (t < 0.5) return mix(b, c, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c, d, (t - 0.5) / 0.25);
  return mix(d, e, (t - 0.75) / 0.25);
}
void main() {
  vec4 c0 = texture2D(tColor, vUv);
  if (c0.a < 0.001) { gl_FragColor = vec4(0.0); return; }
  vec3 c = pow(c0.rgb / c0.a, vec3(0.4545));
  float L = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 g = ramp(clamp(L * 1.08 + 0.06, 0.0, 1.0));
  vec3 h = rgb2hsv(c);
  // pastel version of the object's own colour
  vec3 own = hsv2rgb(vec3(h.x, h.y * 0.62, min(1.0, h.z * 0.8 + 0.28)));
  vec3 col = mix(g, own, 0.52 + 0.15 * night);
  // glowing things stay bright and a touch gold
  col = mix(col, vec3(1.0, 0.93, 0.78), smoothstep(0.8, 0.98, L) * night);
  gl_FragColor = vec4(col * c0.a, c0.a);
}`;

export function installDream(renderer) {
  const rt = new THREE.WebGLRenderTarget(2, 2, { samples: 4 });
  const mat = new THREE.ShaderMaterial({ uniforms: { tColor: { value: rt.texture }, night: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: frag, depthTest: false, depthWrite: false, transparent: true, premultipliedAlpha: true });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false;
  const qs = new THREE.Scene(); qs.add(quad);
  const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const size = new THREE.Vector2(), raw = renderer.render.bind(renderer);
  renderer.ink = { night: 0 };
  renderer.render = (scene, camera) => {
    if (renderer.getRenderTarget() || scene === qs) return raw(scene, camera);
    renderer.getDrawingBufferSize(size);
    if (rt.width !== size.x || rt.height !== size.y) rt.setSize(size.x, size.y);
    mat.uniforms.night.value = renderer.ink.night;
    renderer.setRenderTarget(rt); raw(scene, camera);
    renderer.setRenderTarget(null); raw(qs, qc);
  };
}
