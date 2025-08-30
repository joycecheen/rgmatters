(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))f(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const v of c.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&f(v)}).observe(document,{childList:!0,subtree:!0});function m(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function f(a){if(a.ep)return;a.ep=!0;const c=m(a);fetch(a.href,c)}})();function z(n=""){const t=window.location.hostname.includes("github.io")?"/rgmatters/":"";return`
    <nav class="nav">
      <div class="container nav__bar">
        <div class="logo">
          <a href="${t}index.html">
            <div class="logo__icon"></div>
          </a>
        </div>
        <button class="nav__toggle" aria-label="Toggle navigation menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav__links">
          <li><a href="${t}index.html" ${n==="home"?'class="is-active"':""}>Home</a></li>
          <li><a href="${t}technology.html" ${n==="technology"?'class="is-active"':""}>Our Technology</a></li>
          <li><a href="${t}products.html" ${n==="products"?'class="is-active"':""}>Our Products</a></li>
          <li><a href="${t}about.html" ${n==="about"?'class="is-active"':""}>About Us</a></li>
          <li><a class="btn" href="${t}contact.html" ${n==="contact"?'class="btn is-active"':""}>Contact Us</a></li>
        </ul>
      </div>
    </nav>
  `}function V(){const n=document.querySelector(".nav__toggle"),t=document.querySelector(".nav__links");n&&t&&(n.addEventListener("click",()=>{t.classList.toggle("active"),n.classList.toggle("active"),t.classList.contains("active")?document.body.classList.add("nav-open"):document.body.classList.remove("nav-open")}),t.querySelectorAll("a").forEach(f=>{f.addEventListener("click",()=>{t.classList.remove("active"),n.classList.remove("active"),document.body.classList.remove("nav-open")})}),document.addEventListener("click",f=>{!n.contains(f.target)&&!t.contains(f.target)&&(t.classList.remove("active"),n.classList.remove("active"),document.body.classList.remove("nav-open"))}))}function q(){const n=window.location.hostname.includes("github.io")?"/rgmatters/":"";return`
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
              <li><a href="${n}index.html">Home</a></li>
              <li><a href="${n}technology.html">Our Technology</a></li>
              <li><a href="${n}products.html">Our Products</a></li>
              <li><a href="${n}about.html">About Us</a></li>
              <li><a href="${n}contact.html">Contact</a></li>
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
  `}function G(n=""){const t=document.body;switch(t.classList.remove("home","contact-page","technology-page","products-page","about-page"),n){case"home":t.classList.add("home");break;case"contact":t.classList.add("contact-page");break;case"technology":t.classList.add("technology-page");break;case"products":t.classList.add("products-page");break;case"about":t.classList.add("about-page");break;default:t.classList.add("home")}const m=z(n),f=q();t.insertAdjacentHTML("afterbegin",m),t.insertAdjacentHTML("beforeend",f),V()}function X(){const n=window.location.pathname,t=n.split("/").pop();return console.log("Path:",n),console.log("Filename:",t),t===""||t==="index.html"||n.endsWith("/")?"home":t==="contact.html"?"contact":t==="technology.html"?"technology":t==="products.html"?"products":t==="about.html"?"about":n.includes("contact")?"contact":n.includes("technology")?"technology":n.includes("products")?"products":n.includes("about")?"about":"home"}function K(){const n=document.getElementById("gl");if(!n)return;const t=n.getContext("webgl",{antialias:!0,alpha:!0,depth:!0,stencil:!1,premultipliedAlpha:!0});if(!t){console.log("WebGL not supported");return}function m(){const e=Math.min(window.devicePixelRatio||1,2),o=n.clientWidth,i=n.clientHeight,r=Math.max(1,Math.floor(o*e)),s=Math.max(1,Math.floor(i*e));(n.width!==r||n.height!==s)&&(n.width=r,n.height=s,t.viewport(0,0,r,s))}new ResizeObserver(m).observe(n),window.addEventListener("resize",m);const a={identity:()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),multiply:(e,o)=>{const i=new Float32Array(16);for(let r=0;r<4;r++)for(let s=0;s<4;s++)i[r*4+s]=e[r*4+0]*o[0+s]+e[r*4+1]*o[4+s]+e[r*4+2]*o[8+s]+e[r*4+3]*o[12+s];return i},perspective:(e,o,i,r)=>{const s=1/Math.tan(e*.5),u=1/(i-r);return new Float32Array([s/o,0,0,0,0,s,0,0,0,0,(r+i)*u,-1,0,0,2*r*i*u,0])},translate:(e,o,i)=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,e,o,i,1]),scale:(e,o,i)=>new Float32Array([e,0,0,0,0,o,0,0,0,0,i,0,0,0,0,1]),rotateX:e=>{const o=Math.cos(e),i=Math.sin(e);return new Float32Array([1,0,0,0,0,o,i,0,0,-i,o,0,0,0,0,1])},rotateY:e=>{const o=Math.cos(e),i=Math.sin(e);return new Float32Array([o,0,-i,0,0,1,0,0,i,0,o,0,0,0,0,1])},rotateZ:e=>{const o=Math.cos(e),i=Math.sin(e);return new Float32Array([o,i,0,0,-i,o,0,0,0,0,1,0,0,0,0,1])},lookAt:(e,o,i)=>{const r=y(c(e,o)),s=y(v(i,r)),u=v(r,s);return new Float32Array([s[0],u[0],r[0],0,s[1],u[1],r[1],0,s[2],u[2],r[2],0,-L(s,e),-L(u,e),-L(r,e),1])}},c=(e,o)=>[e[0]-o[0],e[1]-o[1],e[2]-o[2]],v=(e,o)=>[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]],L=(e,o)=>e[0]*o[0]+e[1]*o[1]+e[2]*o[2],x=e=>Math.hypot(e[0],e[1],e[2]),y=e=>{const o=x(e)||1;return[e[0]/o,e[1]/o,e[2]/o]},N=`
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
  }`,O=`
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
  }`;function T(e,o){const i=t.createShader(e);if(t.shaderSource(i,o),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(i));return i}function U(e,o){const i=t.createProgram();if(t.attachShader(i,T(t.VERTEX_SHADER,e)),t.attachShader(i,T(t.FRAGMENT_SHADER,o)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(i));return i}const d=U(N,O);t.useProgram(d);const l={pos:t.getAttribLocation(d,"a_position"),nrm:t.getAttribLocation(d,"a_normal"),u_proj:t.getUniformLocation(d,"u_proj"),u_view:t.getUniformLocation(d,"u_view"),u_model:t.getUniformLocation(d,"u_model"),u_lightDir:t.getUniformLocation(d,"u_lightDir"),u_faceColor:t.getUniformLocation(d,"u_faceColor"),u_edgeColor:t.getUniformLocation(d,"u_edgeColor"),u_isLine:t.getUniformLocation(d,"u_isLine")},p=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],I=[[0,1,2],[0,3,1],[0,2,3],[1,3,2]],A=[],k=[];for(const[e,o,i]of I){const r=p[e],s=p[o],u=p[i],h=c(s,r),W=c(u,r),C=y(v(h,W));A.push(...r,...s,...u),k.push(...C,...C,...C)}const P=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,P),t.bufferData(t.ARRAY_BUFFER,new Float32Array(A),t.STATIC_DRAW);const S=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,S),t.bufferData(t.ARRAY_BUFFER,new Float32Array(k),t.STATIC_DRAW);const H=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],b=[];for(const[e,o]of H)b.push(...p[e],...p[o]);const B=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,B),t.bufferData(t.ARRAY_BUFFER,new Float32Array(b),t.STATIC_DRAW),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(0,0,0,0);let g=.5,w=.9,F=6,_=!1,M=0,E=0;n.addEventListener("mousedown",e=>{_=!0,M=e.clientX,E=e.clientY,e.preventDefault()}),window.addEventListener("mouseup",()=>_=!1),window.addEventListener("mousemove",e=>{if(!_)return;const o=e.clientX-M,i=e.clientY-E;M=e.clientX,E=e.clientY,w+=o*.005,g+=i*.005,g=Math.max(-Math.PI/2,Math.min(Math.PI/2,g)),e.preventDefault()}),n.addEventListener("wheel",e=>{_&&e.preventDefault()},{passive:!1});const $=(()=>{const e=[-.6,.75,.3],o=Math.hypot(...e)||1;return new Float32Array([e[0]/o,e[1]/o,e[2]/o])})(),Y=[0,.49,.64],j=[0,.69,.84];function R(e,o,i){t.bindBuffer(t.ARRAY_BUFFER,e),t.enableVertexAttribArray(o),t.vertexAttribPointer(o,i,t.FLOAT,!1,0,0)}performance.now();function D(e){m(),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);const o=n.width/n.height,i=a.perspective(50*Math.PI/180,o,.1,100),r=e*4e-4*Math.PI*2,s=[Math.cos(w)*Math.cos(g)*F,Math.sin(g)*F,Math.sin(w)*Math.cos(g)*F],u=a.lookAt(s,[0,0,0],[0,1,0]);let h=a.identity();h=a.multiply(h,a.rotateY(r)),h=a.multiply(h,a.rotateZ(r*.7)),h=a.multiply(h,a.scale(.8,.8,.8)),t.useProgram(d),t.uniformMatrix4fv(l.u_proj,!1,i),t.uniformMatrix4fv(l.u_view,!1,u),t.uniformMatrix4fv(l.u_model,!1,h),t.uniform3fv(l.u_lightDir,$),t.uniform3fv(l.u_faceColor,Y),t.uniform3fv(l.u_edgeColor,j),t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(1,1),t.uniform1i(l.u_isLine,0),R(P,l.pos,3),R(S,l.nrm,3),t.drawArrays(t.TRIANGLES,0,A.length/3),t.disable(t.POLYGON_OFFSET_FILL),t.uniform1i(l.u_isLine,1),R(B,l.pos,3),t.disableVertexAttribArray(l.nrm),t.lineWidth(1),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE),t.drawArrays(t.LINES,0,b.length/3),t.disable(t.BLEND),requestAnimationFrame(D)}requestAnimationFrame(D)}document.addEventListener("DOMContentLoaded",()=>{const n=X();console.log("Current path:",window.location.pathname),console.log("Detected page:",n),console.log("Body classes before:",document.body.className),G(n),console.log("Body classes after:",document.body.className),n==="home"&&K()});
