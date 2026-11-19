// Ink look: re-draws each frame as a hand-inked illustration.
// Scene renders to a target, then a full-screen pass draws wobbly outlines (depth + tone edges)
// and turns shading into paper white, hatching, cross-hatching and solid ink.
import * as THREE from 'three';

const frag = /* glsl */`
precision highp float;
uniform sampler2D tColor, tDepth;
uniform vec2 res;
uniform float span, px, night;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float D(vec2 uv) { return texture2D(tDepth, uv).r * span; }
vec4 C(vec2 uv) { return texture2D(tColor, uv); }
float hatch(vec2 p, float ang, float gap, float w) {
  float s = sin(ang), c = cos(ang);
  float t = p.x * c + p.y * s + (noise(p * 0.035) - 0.5) * 5.0;
  float d = abs(fract(t / gap) - 0.5) * gap;
  return 1.0 - smoothstep(w - 0.6, w + 0.6, d);
}
void main() {
  vec2 fc = vUv * res;
  // hand wobble: low-frequency drift of where we sample
  vec2 wob = (vec2(noise(fc / (60.0 * px)), noise(fc / (60.0 * px) + 31.7)) - 0.5) * 1.1 * px;
  vec2 uv = vUv + wob / res;
  vec2 o = px * 1.35 / res;
  vec4 c0 = C(uv);
  float d00 = D(uv + vec2(-o.x, -o.y)), d10 = D(uv + vec2(0.0, -o.y)), d20 = D(uv + vec2(o.x, -o.y));
  float d01 = D(uv + vec2(-o.x, 0.0)), d21 = D(uv + vec2(o.x, 0.0));
  float d02 = D(uv + vec2(-o.x, o.y)), d12 = D(uv + vec2(0.0, o.y)), d22 = D(uv + vec2(o.x, o.y));
  float dc = D(uv);
  // Laplacian: zero on flat or sloped planes, spikes at creases and silhouettes
  float lap = abs(d01 + d21 + d10 + d12 + 0.5 * (d00 + d20 + d02 + d22) - 6.0 * dc);
  float eD = smoothstep(0.09, 0.2, lap);
  vec4 a00 = C(uv + vec2(-o.x, -o.y)), a10 = C(uv + vec2(0.0, -o.y)), a20 = C(uv + vec2(o.x, -o.y));
  vec4 a01 = C(uv + vec2(-o.x, 0.0)), a21 = C(uv + vec2(o.x, 0.0));
  vec4 a02 = C(uv + vec2(-o.x, o.y)), a12 = C(uv + vec2(0.0, o.y)), a22 = C(uv + vec2(o.x, o.y));
  float lx = lum(a20.rgb) + 2.0 * lum(a21.rgb) + lum(a22.rgb) - lum(a00.rgb) - 2.0 * lum(a01.rgb) - lum(a02.rgb);
  float ly = lum(a02.rgb) + 2.0 * lum(a12.rgb) + lum(a22.rgb) - lum(a00.rgb) - 2.0 * lum(a10.rgb) - lum(a20.rgb);
  float eL = smoothstep(0.75, 1.0, length(vec2(lx, ly)));
  float ax = a20.a + 2.0 * a21.a + a22.a - a00.a - 2.0 * a01.a - a02.a, ay = a02.a + 2.0 * a12.a + a22.a - a00.a - 2.0 * a10.a - a20.a;
  float eA = smoothstep(0.5, 1.2, length(vec2(ax, ay)));
  // ink breaks: lines fade in and out a little, like a pen lifting
  float maxA = max(max(max(a00.a, a10.a), max(a20.a, a01.a)), max(max(a21.a, a02.a), max(a12.a, a22.a)));
  float solid = step(0.95, maxA); // only ink lines around solid objects, never on the shadow floor
  float edge = max(eA * solid, max(eD, eL) * solid);
  // tones
  float L = pow(lum(c0.rgb / max(c0.a, 0.001)), 0.4545);
  vec2 hp = fc / px;
  float h1 = hatch(hp, 0.785, 6.0, 0.75);
  float h2 = hatch(hp, -0.785, 6.0, 0.75);
  // clean and friendly: white fills, solid ink only for the darkest bits (windows, wheels)
  float ink = L < 0.2 ? 1.0 : 0.0;
  ink = max(ink, edge);
  vec3 paper = vec3(0.985, 0.975, 0.955), inkC = vec3(0.07, 0.065, 0.06);
  vec3 col = mix(paper, inkC, ink);
  // bright things at night (windows, lamps, the glowing name) stay paper white
  col = mix(col, paper, smoothstep(0.82, 0.95, L) * night);
  float alpha = max(c0.a, edge);
  if (c0.a < 0.95 && edge < 0.5) {
    // see-through things (cast shadows, glows): cross-hatch shadows, drop the rest
    float sh = step(0.12, c0.a) * step(L, 0.4) * hatch(hp, 0.785, 8.0, 0.7);
    col = inkC; alpha = sh * 0.55;
  }
  gl_FragColor = vec4(col * alpha, alpha);
}`;

export function installInk(renderer) {
  const rt = new THREE.WebGLRenderTarget(2, 2, { depthBuffer: true });
  rt.depthTexture = new THREE.DepthTexture(2, 2);
  rt.depthTexture.type = THREE.UnsignedIntType;
  const mat = new THREE.ShaderMaterial({
    uniforms: { tColor: { value: rt.texture }, tDepth: { value: rt.depthTexture }, res: { value: new THREE.Vector2() }, span: { value: 300 }, px: { value: 1 }, night: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: frag, depthTest: false, depthWrite: false, transparent: true, premultipliedAlpha: true,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  quad.frustumCulled = false;
  const qs = new THREE.Scene(); qs.add(quad);
  const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const size = new THREE.Vector2();
  const raw = renderer.render.bind(renderer);
  renderer.ink = { night: 0 };
  renderer.render = (scene, camera) => {
    if (renderer.getRenderTarget() || scene === qs) return raw(scene, camera);
    renderer.getDrawingBufferSize(size);
    if (rt.width !== size.x || rt.height !== size.y) rt.setSize(size.x, size.y);
    mat.uniforms.res.value.copy(size);
    mat.uniforms.span.value = camera.far - camera.near;
    mat.uniforms.px.value = renderer.getPixelRatio();
    mat.uniforms.night.value = renderer.ink.night;
    renderer.setRenderTarget(rt); raw(scene, camera);
    renderer.setRenderTarget(null); raw(qs, qc);
  };
}
