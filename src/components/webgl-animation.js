// WebGL Animation Component for Homepage
export function initWebGLAnimation() {
  const canvas = document.getElementById('gl');
  if (!canvas) return;
  
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, depth: true, stencil: false, premultipliedAlpha: true });
  if (!gl) { console.log('WebGL not supported'); return; }

  // ---------- Resize / DPR ----------
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const W = Math.max(1, Math.floor(w * dpr));
    const H = Math.max(1, Math.floor(h * dpr));
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  window.addEventListener('resize', resize);

  // ---------- Minimal math ----------
  const M4 = {
    identity: () => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
    multiply: (a,b) => {
      const o = new Float32Array(16);
      for (let i=0;i<4;i++) for (let j=0;j<4;j++) {
        o[i*4+j] = a[i*4+0]*b[0*4+j] + a[i*4+1]*b[1*4+j] + a[i*4+2]*b[2*4+j] + a[i*4+3]*b[3*4+j];
      }
      return o;
    },
    perspective: (fovy, aspect, near, far) => {
      const f = 1 / Math.tan(fovy * 0.5);
      const nf = 1 / (near - far);
      return new Float32Array([
        f/aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far+near)*nf, -1,
        0, 0, (2*far*near)*nf, 0
      ]);
    },
    translate: (tx,ty,tz) => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]),
    scale: (sx,sy,sz) => new Float32Array([sx,0,0,0, 0,sy,0,0, 0,0,sz,0, 0,0,0,1]),
    rotateX: (r)=>{const c=Math.cos(r),s=Math.sin(r);return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);},
    rotateY: (r)=>{const c=Math.cos(r),s=Math.sin(r);return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);},
    rotateZ: (r)=>{const c=Math.cos(r),s=Math.sin(r);return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);},
    lookAt: (eye, target, up) => {
      const z = norm(sub(eye, target));
      const x = norm(cross(up, z));
      const y = cross(z, x);
      return new Float32Array([
        x[0], y[0], z[0], 0,
        x[1], y[1], z[1], 0,
        x[2], y[2], z[2], 0,
        -dot(x,eye), -dot(y,eye), -dot(z,eye), 1
      ]);
    }
  };
  const sub = (a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const cross = (a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const dot = (a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const len = (v)=>Math.hypot(v[0],v[1],v[2]);
  const norm = (v)=>{const L=len(v)||1; return [v[0]/L,v[1]/L,v[2]/L];};

  // ---------- Shaders ----------
  const VS = `
  attribute vec3 a_position;
  attribute vec3 a_normal;
  uniform mat4 u_proj,u_view,u_model;
  varying vec3 vN;
  varying vec3 vW;
  void main(){
    vec4 w = u_model * vec4(a_position,1.0);
    vW = w.xyz;
    vN = mat3(u_model) * a_normal;
    gl_Position = u_proj * u_view * w;
  }`;

  const FS = `
  precision highp float;
  varying vec3 vN;
  varying vec3 vW;
  uniform vec3 u_lightDir;
  uniform vec3 u_faceColor;
  uniform vec3 u_edgeColor;
  uniform int u_isLine;
  void main(){
    if(u_isLine==1){
      gl_FragColor = vec4(u_edgeColor, 1.0);
      return;
    }
    vec3 N = normalize(vN);
    vec3 V = normalize(-vW);
    float diff = max(dot(N, u_lightDir), 0.0);
    float rim = pow(1.0 - max(dot(N, V), 0.0), 2.0);
    vec3 base = u_faceColor;
    vec3 col = base * (0.20 + 0.80 * diff) + rim * vec3(0.35,0.55,1.0) * 0.35;
    gl_FragColor = vec4(col, 0.95);
  }`;

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(vs, fs){
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  const prog = program(VS, FS);
  gl.useProgram(prog);

  const loc = {
    pos: gl.getAttribLocation(prog, 'a_position'),
    nrm: gl.getAttribLocation(prog, 'a_normal'),
    u_proj: gl.getUniformLocation(prog, 'u_proj'),
    u_view: gl.getUniformLocation(prog, 'u_view'),
    u_model: gl.getUniformLocation(prog, 'u_model'),
    u_lightDir: gl.getUniformLocation(prog, 'u_lightDir'),
    u_faceColor: gl.getUniformLocation(prog, 'u_faceColor'),
    u_edgeColor: gl.getUniformLocation(prog, 'u_edgeColor'),
    u_isLine: gl.getUniformLocation(prog, 'u_isLine'),
  };

  // ---------- Geometry ----------
  const V = [
    [ 1,  1,  1],
    [ 1, -1, -1],
    [-1,  1, -1],
    [-1, -1,  1],
  ];
  const F = [ [0,1,2], [0,3,1], [0,2,3], [1,3,2] ];

  const triPos = [];
  const triNrm = [];
  for (const [a,b,c] of F) {
    const p0 = V[a], p1 = V[b], p2 = V[c];
    const e1 = sub(p1,p0), e2 = sub(p2,p0);
    const n = norm(cross(e1,e2));
    triPos.push(...p0, ...p1, ...p2);
    triNrm.push(...n, ...n, ...n);
  }
  const triPosBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triPosBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triPos), gl.STATIC_DRAW);

  const triNrmBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triNrmBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triNrm), gl.STATIC_DRAW);

  const E = [ [0,1],[0,2],[0,3],[1,2],[1,3],[2,3] ];
  const linePos = [];
  for (const [i,j] of E) linePos.push(...V[i], ...V[j]);
  const lineBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePos), gl.STATIC_DRAW);

  // ---------- GL state ----------
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(0,0,0,0);

  // ---------- Interaction (orbit only; zoom disabled) ----------
  let rotX = 0.5, rotY = 0.9;
  const distMin = 2.0, distMax = 6.0;
  let dist = distMax; // start fully zoomed out

  let isDown=false, px=0, py=0;
  canvas.addEventListener('mousedown', e=>{
    isDown=true; 
    px=e.clientX; 
    py=e.clientY;
    e.preventDefault(); // Prevent text selection while dragging
  });
  window.addEventListener('mouseup', ()=>isDown=false);
  window.addEventListener('mousemove', e=>{
    if(!isDown) return;
    const dx = e.clientX - px, dy = e.clientY - py; px=e.clientX; py=e.clientY;
    rotY += dx * 0.005; rotX += dy * 0.005; rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX));
    e.preventDefault(); // Prevent any default behavior while dragging
  });

  // Only prevent scrolling when dragging the 3D model
  canvas.addEventListener('wheel', e => { 
    if (isDown) {
      e.preventDefault(); 
    }
  }, { passive: false });

  // ---------- Render loop ----------
  const lightDir = (()=>{
    const v = [-0.6, 0.75, 0.3];
    const L = Math.hypot(...v) || 1;
    return new Float32Array([v[0]/L, v[1]/L, v[2]/L]);
  })();
  const faceColor = [0.0, 0.49, 0.64]; // #007EA4 converted to RGB (0, 126, 164)
  const edgeColor = [0.0, 0.69, 0.84]; // Lighter shade of brand blue

  function bindAttrib(buf, loc, size){
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  let t0 = performance.now();
  function tick(now){
    resize();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = canvas.width / canvas.height;
    const proj = M4.perspective(50*Math.PI/180, aspect, 0.1, 100.0);

    const auto = now * 0.0004 * Math.PI * 2;

    const eye = [ Math.cos(rotY)*Math.cos(rotX)*dist, Math.sin(rotX)*dist, Math.sin(rotY)*Math.cos(rotX)*dist ];
    const view = M4.lookAt(eye, [0,0,0], [0,1,0]);

    let model = M4.identity();
    model = M4.multiply(model, M4.rotateY(auto));
    model = M4.multiply(model, M4.rotateZ(auto*0.7));
    model = M4.multiply(model, M4.scale(0.8, 0.8, 0.8));

    gl.useProgram(prog);
    gl.uniformMatrix4fv(loc.u_proj, false, proj);
    gl.uniformMatrix4fv(loc.u_view, false, view);
    gl.uniformMatrix4fv(loc.u_model, false, model);
    gl.uniform3fv(loc.u_lightDir, lightDir);
    gl.uniform3fv(loc.u_faceColor, faceColor);
    gl.uniform3fv(loc.u_edgeColor, edgeColor);

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);

    gl.uniform1i(loc.u_isLine, 0);
    bindAttrib(triPosBuf, loc.pos, 3);
    bindAttrib(triNrmBuf, loc.nrm, 3);
    gl.drawArrays(gl.TRIANGLES, 0, triPos.length/3);

    gl.disable(gl.POLYGON_OFFSET_FILL);

    gl.uniform1i(loc.u_isLine, 1);
    bindAttrib(lineBuf, loc.pos, 3);
    gl.disableVertexAttribArray(loc.nrm);
    gl.lineWidth(1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.drawArrays(gl.LINES, 0, linePos.length/3);
    gl.disable(gl.BLEND);

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
