(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))m(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const v of c.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&m(v)}).observe(document,{childList:!0,subtree:!0});function h(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function m(a){if(a.ep)return;a.ep=!0;const c=h(a);fetch(a.href,c)}})();function V(r=""){return`
    <nav class="nav">
      <div class="container nav__bar">
        <div class="logo">
          <a href="index.html">
            <div class="logo__icon"></div>
          </a>
        </div>
        <button class="nav__toggle" aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav__links">
          <li><a href="index.html" ${r==="home"?'class="is-active"':""}>Home</a></li>
          <li><a href="technology.html" ${r==="technology"?'class="is-active"':""}>Our Technology</a></li>
          <li><a href="products.html" ${r==="products"?'class="is-active"':""}>Our Products</a></li>
          <li><a href="about.html" ${r==="about"?'class="is-active"':""}>About Us</a></li>
          <li><a class="btn" href="contact.html" ${r==="contact"?'class="btn is-active"':""}>Contact Us</a></li>
        </ul>
      </div>
    </nav>
  `}function q(){const r=document.querySelector(".nav__toggle"),t=document.querySelector(".nav__links");r&&t&&(r.addEventListener("click",()=>{t.classList.toggle("active"),r.classList.toggle("active")}),t.querySelectorAll("a").forEach(m=>{m.addEventListener("click",()=>{t.classList.remove("active"),r.classList.remove("active")})}))}function G(){return`
    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <!-- Left Column: Logo and Tagline -->
          <div class="footer__column">
            <div class="footer__logo">
              <div class="footer__logo-icon"></div>
            </div>
            <div class="footer__tagline">
              <p>Hybrid Materials for Radiation</p>
              <p>Scintillation and Detection</p>
            </div>
          </div>

          <!-- Middle Column: Quick Links -->
          <div class="footer__column">
            <h3 class="footer__title">Quick Links</h3>
            <ul class="footer__links">
              <li><a href="index.html">Home</a></li>
              <li><a href="technology.html">Our Technology</a></li>
              <li><a href="products.html">Our Products</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Right Column: Contact Info -->
          <div class="footer__column">
            <h3 class="footer__title">Contact Us</h3>
            <div class="footer__contact">
              <div class="footer__contact-item">
                <svg class="footer__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>info@rgmatters.com</span>
              </div>
              <div class="footer__contact-item">
                <svg class="footer__icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="#007EA4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div class="footer__address">
                  <span>1729 W. Paul Dirac Drive</span>
                  <span>Tallahassee, FL 32303</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="footer__bottom">
          <hr class="footer__divider">
          <p class="footer__copyright">© 2025 Roentgen Matters LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `}function X(r=""){const t=document.body;switch(t.classList.remove("home","contact-page","technology-page","products-page","about-page"),r){case"home":t.classList.add("home");break;case"contact":t.classList.add("contact-page");break;case"technology":t.classList.add("technology-page");break;case"products":t.classList.add("products-page");break;case"about":t.classList.add("about-page");break;default:t.classList.add("home")}const h=V(r),m=G();t.insertAdjacentHTML("afterbegin",h),t.insertAdjacentHTML("beforeend",m),q()}function $(){const r=window.location.pathname;return r==="/"||r==="/index.html"?"home":r.includes("contact")?"contact":r.includes("technology")?"technology":r.includes("products")?"products":r.includes("about")?"about":"home"}function K(){const r=document.getElementById("gl");if(!r)return;const t=r.getContext("webgl",{antialias:!0,alpha:!0,depth:!0,stencil:!1,premultipliedAlpha:!0});if(!t){console.log("WebGL not supported");return}function h(){const e=Math.min(window.devicePixelRatio||1,2),o=r.clientWidth,n=r.clientHeight,i=Math.max(1,Math.floor(o*e)),s=Math.max(1,Math.floor(n*e));(r.width!==i||r.height!==s)&&(r.width=i,r.height=s,t.viewport(0,0,i,s))}new ResizeObserver(h).observe(r),window.addEventListener("resize",h);const a={identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),multiply:(e,o)=>{const n=new Float32Array(16);for(let i=0;i<4;i++)for(let s=0;s<4;s++)n[i*4+s]=e[i*4+0]*o[0+s]+e[i*4+1]*o[4+s]+e[i*4+2]*o[8+s]+e[i*4+3]*o[12+s];return n},perspective:(e,o,n,i)=>{const s=1/Math.tan(e*.5),u=1/(n-i);return new Float32Array([s/o,0,0,0,0,s,0,0,0,0,(i+n)*u,-1,0,0,2*i*n*u,0])},translate:(e,o,n)=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,e,o,n,1]),scale:(e,o,n)=>new Float32Array([e,0,0,0,0,o,0,0,0,0,n,0,0,0,0,1]),rotateX:e=>{const o=Math.cos(e),n=Math.sin(e);return new Float32Array([1,0,0,0,0,o,n,0,0,-n,o,0,0,0,0,1])},rotateY:e=>{const o=Math.cos(e),n=Math.sin(e);return new Float32Array([o,0,-n,0,0,1,0,0,n,0,o,0,0,0,0,1])},rotateZ:e=>{const o=Math.cos(e),n=Math.sin(e);return new Float32Array([o,n,0,0,-n,o,0,0,0,0,1,0,0,0,0,1])},lookAt:(e,o,n)=>{const i=A(c(e,o)),s=A(v(n,i)),u=v(i,s);return new Float32Array([s[0],u[0],i[0],0,s[1],u[1],i[1],0,s[2],u[2],i[2],0,-L(s,e),-L(u,e),-L(i,e),1])}},c=(e,o)=>[e[0]-o[0],e[1]-o[1],e[2]-o[2]],v=(e,o)=>[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]],L=(e,o)=>e[0]*o[0]+e[1]*o[1]+e[2]*o[2],D=e=>Math.hypot(e[0],e[1],e[2]),A=e=>{const o=D(e)||1;return[e[0]/o,e[1]/o,e[2]/o]},O=`
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
  }`,N=`
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
  }`;function T(e,o){const n=t.createShader(e);if(t.shaderSource(n,o),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(n));return n}function U(e,o){const n=t.createProgram();if(t.attachShader(n,T(t.VERTEX_SHADER,e)),t.attachShader(n,T(t.FRAGMENT_SHADER,o)),t.linkProgram(n),!t.getProgramParameter(n,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(n));return n}const d=U(O,N);t.useProgram(d);const l={pos:t.getAttribLocation(d,"a_position"),nrm:t.getAttribLocation(d,"a_normal"),u_proj:t.getUniformLocation(d,"u_proj"),u_view:t.getUniformLocation(d,"u_view"),u_model:t.getUniformLocation(d,"u_model"),u_lightDir:t.getUniformLocation(d,"u_lightDir"),u_faceColor:t.getUniformLocation(d,"u_faceColor"),u_edgeColor:t.getUniformLocation(d,"u_edgeColor"),u_isLine:t.getUniformLocation(d,"u_isLine")},g=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],I=[[0,1,2],[0,3,1],[0,2,3],[1,3,2]],y=[],k=[];for(const[e,o,n]of I){const i=g[e],s=g[o],u=g[n],f=c(s,i),z=c(u,i),C=A(v(f,z));y.push(...i,...s,...u),k.push(...C,...C,...C)}const S=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,S),t.bufferData(t.ARRAY_BUFFER,new Float32Array(y),t.STATIC_DRAW);const P=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,P),t.bufferData(t.ARRAY_BUFFER,new Float32Array(k),t.STATIC_DRAW);const H=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],w=[];for(const[e,o]of H)w.push(...g[e],...g[o]);const B=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,B),t.bufferData(t.ARRAY_BUFFER,new Float32Array(w),t.STATIC_DRAW),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(0,0,0,0);let _=.5,b=.9,F=6,p=!1,M=0,E=0;r.addEventListener("mousedown",e=>{p=!0,M=e.clientX,E=e.clientY,e.preventDefault()}),window.addEventListener("mouseup",()=>p=!1),window.addEventListener("mousemove",e=>{if(!p)return;const o=e.clientX-M,n=e.clientY-E;M=e.clientX,E=e.clientY,b+=o*.005,_+=n*.005,_=Math.max(-Math.PI/2,Math.min(Math.PI/2,_)),e.preventDefault()}),r.addEventListener("wheel",e=>{p&&e.preventDefault()},{passive:!1});const Y=(()=>{const e=[-.6,.75,.3],o=Math.hypot(...e)||1;return new Float32Array([e[0]/o,e[1]/o,e[2]/o])})(),j=[0,.49,.64],W=[0,.69,.84];function R(e,o,n){t.bindBuffer(t.ARRAY_BUFFER,e),t.enableVertexAttribArray(o),t.vertexAttribPointer(o,n,t.FLOAT,!1,0,0)}performance.now();function x(e){h(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const o=r.width/r.height,n=a.perspective(50*Math.PI/180,o,.1,100),i=e*4e-4*Math.PI*2,s=[Math.cos(b)*Math.cos(_)*F,Math.sin(_)*F,Math.sin(b)*Math.cos(_)*F],u=a.lookAt(s,[0,0,0],[0,1,0]);let f=a.identity();f=a.multiply(f,a.rotateY(i)),f=a.multiply(f,a.rotateZ(i*.7)),f=a.multiply(f,a.scale(.8,.8,.8)),t.useProgram(d),t.uniformMatrix4fv(l.u_proj,!1,n),t.uniformMatrix4fv(l.u_view,!1,u),t.uniformMatrix4fv(l.u_model,!1,f),t.uniform3fv(l.u_lightDir,Y),t.uniform3fv(l.u_faceColor,j),t.uniform3fv(l.u_edgeColor,W),t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(1,1),t.uniform1i(l.u_isLine,0),R(S,l.pos,3),R(P,l.nrm,3),t.drawArrays(t.TRIANGLES,0,y.length/3),t.disable(t.POLYGON_OFFSET_FILL),t.uniform1i(l.u_isLine,1),R(B,l.pos,3),t.disableVertexAttribArray(l.nrm),t.lineWidth(1),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE),t.drawArrays(t.LINES,0,w.length/3),t.disable(t.BLEND),requestAnimationFrame(x)}requestAnimationFrame(x)}document.addEventListener("DOMContentLoaded",()=>{const r=$();X(r),r==="home"&&K()});
