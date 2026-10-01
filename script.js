const $=id=>document.getElementById(id);
const cv=$('c'),g=cv.getContext('2d');
$('title').textContent=CONFIG.titulo;
let W,H,S,dpr=Math.min(devicePixelRatio||1,2);
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);S=Math.min(W,H*0.8)/620}
addEventListener('resize',size);size();
// Partículas (anillos con giro propio, como el polvo de la galaxia)
const R=[95,150,205,260,315],P=[];
for(let i=0;i<2600;i++){const k=i%R.length,r=R[k]+(Math.random()+Math.random()+Math.random()-1.5)*34;P.push({a:Math.random()*6.283,r,y:(Math.random()-.5)*10,s:Math.random()*1.4+.4,v:60/r})}
for(let i=0;i<260;i++)P.push({a:Math.random()*6.283,r:340+Math.random()*180,y:(Math.random()-.5)*60,s:Math.random()*.9+.3,v:.05});
// Autitos y palabras: posiciones FIJAS y ordenadas (giran todos juntos, nunca se mezclan)
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const placed=[],I=[];
function spot(a,b){let best,bd=-1;for(let k=0;k<400;k++){const r=a+rnd()*(b-a),an=rnd()*6.283,x=Math.cos(an)*r,z=Math.sin(an)*r;let d=1e9;for(const p of placed)d=Math.min(d,Math.hypot(x-p.x,z-p.z));if(d>bd){bd=d;best={r,a:an,x,z}}}placed.push(best);return best}
const n=CONFIG.autos.length;
CONFIG.autos.forEach((c,i)=>{const r=105+i*(210/Math.max(1,n-1)),a=i*2.39996;placed.push({x:Math.cos(a)*r,z:Math.sin(a)*r});const im=new Image();im.src=c.img;I.push({type:'car',c,im,a,r,y:0})});
CONFIG.palabras.forEach(w=>{const p=spot(90,335);I.push({type:'w',w,a:p.a,r:p.r,y:(rnd()-.5)*16})});
let rot=0,tilt=1.12,vr=0,t=0,drag=null,moved=0,hits=[];
function proj(a,r,y){const x=Math.cos(a+rot)*r,z=Math.sin(a+rot)*r;const y2=y*Math.cos(tilt)-z*Math.sin(tilt),z2=y*Math.sin(tilt)+z*Math.cos(tilt);const s=700/(700+z2*S);return[x*S*s+W/2,y2*S*s+H*.52,s,z2]}
function frame(){requestAnimationFrame(frame);t+=.016;rot+=.0022+vr;vr*=.95;
 g.fillStyle='#000';g.fillRect(0,0,W,H);
 const c=proj(0,0,0),gr=g.createRadialGradient(c[0],c[1],0,c[0],c[1],200*S);gr.addColorStop(0,'#1a6bff55');gr.addColorStop(1,'#0000');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(const p of P){const q=proj(p.a+t*p.v*.5,p.r,p.y);g.globalAlpha=Math.min(1,.35+q[2]*.5);g.fillStyle=p.r>335?'#9bb8d9':(p.r<120?'#8fe0ff':'#cfeaff');g.fillRect(q[0],q[1],p.s*q[2],p.s*q[2])}
 g.globalAlpha=1;
 g.save();g.translate(c[0],c[1]);g.scale(1,Math.max(.25,Math.cos(Math.PI/2-tilt)*.9));
 g.shadowColor='#2aa7ff';g.shadowBlur=30;g.strokeStyle='#4cc3ff';g.lineWidth=5*S;g.beginPath();g.arc(0,0,34*S,0,6.283);g.stroke();
 g.shadowBlur=0;g.fillStyle='#000';g.beginPath();g.arc(0,0,30*S,0,6.283);g.fill();g.restore();
 const L=I.map(o=>({o,q:proj(o.a,o.r,o.y+Math.sin(t*1.2+o.a*3)*3)})).sort((a,b)=>b.q[3]-a.q[3]);hits=[];
 g.textAlign='center';g.textBaseline='middle';
 for(const{o,q}of L){g.globalAlpha=Math.min(1,.45+q[2]*.45);
  if(o.type==='car'){const im=o.im,w=105*S*q[2]*1.25,hh=w*im.naturalHeight/(im.naturalWidth||1);g.shadowColor='#38b6ff';g.shadowBlur=16;if(im.complete&&hh>0)g.drawImage(im,q[0]-w/2,q[1]-hh/2,w,hh);g.shadowBlur=0;hits.push({o,x:q[0],y:q[1],r:Math.max(w*.5,24)})}
  else{g.font=(17*S*q[2]*1.1)+'px "Patrick Hand",cursive';g.fillStyle='#7fd0ff';g.shadowColor='#1b86d6';g.shadowBlur=8;g.fillText(o.w,q[0],q[1]);g.shadowBlur=0}}
 g.globalAlpha=1}
frame();
// Interacción
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};moved=0;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);rot+=dx*.008;vr=dx*.0008;tilt=Math.max(.45,Math.min(1.5,tilt+dy*.005));drag={x:e.clientX,y:e.clientY}});
cv.addEventListener('pointerup',e=>{drag=null;if(moved<8){let b=null,d=1e9;for(const h of hits){const m=Math.hypot(h.x-e.clientX,h.y-e.clientY);if(m<h.r&&m<d){d=m;b=h}}if(b)openCard(b.o.c)}});
const ov=$('ov');
function openCard(c){$('ce').innerHTML='<img alt="" src="'+c.img+'">';$('ct').textContent=c.titulo;$('cm').textContent=c.mensaje;ov.style.display='flex';chime()}
$('cx').onclick=()=>ov.style.display='none';ov.onclick=e=>{if(e.target===ov)ov.style.display='none'};
// Música: usa tu archivo si existe; si no, una melodía suave de relleno
let ac,mg,timer,step=0,usingSong=false;const song=new Audio(CONFIG.musica);song.loop=true;
const CH=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],fq=m=>440*Math.pow(2,(m-69)/12);
function tone(m,d,v,type){const o=ac.createOscillator(),gn=ac.createGain(),t0=ac.currentTime;o.type=type;o.frequency.value=fq(m);gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+.05);gn.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(gn);gn.connect(mg);o.start(t0);o.stop(t0+d+.1)}
function chime(){if(ac&&!usingSong)tone(84,1.2,.12,'sine')}
function startSynth(){if(timer)return;timer=setInterval(()=>{const ch=CH[Math.floor(step/8)%4],i=step%8;if(i===0)ch.forEach(m=>tone(m-12,4.2,.05,'triangle'));tone(ch[i%3]+12,1.4,.045,'sine');step++},500)}
$('intro').onclick=function(){
 ac=new (window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.9;mg.connect(ac.destination);
 song.play().then(()=>{usingSong=true}).catch(startSynth);
 this.style.opacity=0;setTimeout(()=>this.remove(),800)};
$('music').onclick=()=>$('file').click();
$('file').onchange=()=>{const fl=$('file').files[0];if(!fl)return;clearInterval(timer);timer=null;song.src=URL.createObjectURL(fl);song.play();usingSong=true;$('music').textContent='🎵 Cambiar canción'};
