import { useEffect, useRef } from "react";

const vertSrc = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragSrc = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}

float warpedFbm(vec3 p) {
  vec3 q = vec3(
    fbm(p + vec3(0.0, 0.0, 0.0)),
    fbm(p + vec3(5.2, 1.3, 2.8)),
    fbm(p + vec3(1.7, 9.2, 3.1))
  );
  return fbm(p + 4.0 * q);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.15;

  vec2 mouse = u_mouse;
  mouse.x *= u_resolution.x / u_resolution.y;

  float mouseDistance = length(st - mouse);
  float mouseInfluence = smoothstep(0.5, 0.0, mouseDistance) * 0.3;

  vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
  vec2 p = st - center;

  float r = length(p) * 2.5;
  float a = atan(p.y, p.x);

  vec3 pos1 = vec3(p * 1.5, t * 0.7 + mouseInfluence * 5.0);
  vec3 pos2 = vec3(p * 2.0 + vec2(3.7, 1.2), t * 0.5 + mouseInfluence * 4.0);

  float pattern1 = warpedFbm(pos1);
  float pattern2 = warpedFbm(pos2);

  float pattern = mix(pattern1, pattern2, 0.5 + 0.5 * sin(t * 0.3));

  float spiral = sin(a * 3.0 + r * 4.0 - t * 0.8 + pattern * 2.0 + mouseInfluence * 10.0) * 0.5 + 0.5;
  float radial = sin(r * 3.14159 * 2.0 - t * 0.5 + pattern * 1.5) * 0.5 + 0.5;
  float fractalDetail = sin(a * 7.0 + r * 8.0 + t * 0.4 + pattern * 3.0) * 0.5 + 0.5;

  float finalPattern = spiral * 0.4 + radial * 0.35 + fractalDetail * 0.25;

  vec3 color1 = vec3(0.212, 0.204, 0.780);
  vec3 color2 = vec3(0.0, 0.404, 0.439);
  vec3 color3 = vec3(0.941, 0.718, 0.173);
  vec3 bgColor = vec3(0.075, 0.075, 0.071);

  float patternMix = smoothstep(0.3, 0.7, finalPattern);
  vec3 color = mix(
    mix(color1, color2, smoothstep(0.0, 0.5, patternMix)),
    mix(color2, color3, smoothstep(0.5, 1.0, patternMix)),
    patternMix
  );

  float edgeFade = smoothstep(0.0, 0.3, 1.0 - r);
  color = mix(bgColor, color, edgeFade);

  color += vec3(snoise(vec3(st * 30.0, t * 0.1)) * 0.03);

  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + fract(u_time * 0.1) * 100.0) * 43758.5453) * 0.04 - 0.02;
  color += grain;

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function FractalShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef([0.5, 0.5]);
  const mouseTargetRef = useRef([0.5, 0.5]);
  const mouseActiveRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
    });
    if (!gl) return;

    const compileShader = (src: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vertSrc, gl.VERTEX_SHADER);
    const fs = compileShader(fragSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseTargetRef.current = [
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight,
      ];
      mouseActiveRef.current = true;
    };

    const onMouseOut = () => {
      mouseActiveRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);

    const startTime = performance.now();

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      if (mouseActiveRef.current) {
        mouseRef.current[0] +=
          (mouseTargetRef.current[0] - mouseRef.current[0]) * 0.05;
        mouseRef.current[1] +=
          (mouseTargetRef.current[1] - mouseRef.current[1]) * 0.05;
      }

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current[0], mouseRef.current[1]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}
