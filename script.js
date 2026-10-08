const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const header=$('#top'),burger=$('#burger'),links=$('#links');

/* ---- smooth anchor scrolling (eased, interruptible) ---- */
let raf;const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function smoothTo(y){
 cancelAnimationFrame(raf);navLock=true;setHidden(false);const from=scrollY,d=y-from;
 if(reduce||Math.abs(d)<2){scrollTo(0,y);return setTimeout(()=>navLock=false,150)}
 const t0=performance.now(),dur=Math.min(1400,500+Math.abs(d)*.35);
 const step=t=>{const k=Math.min(1,(t-t0)/dur);scrollTo(0,from+d*ease(k));if(k<1)raf=requestAnimationFrame(step);else setTimeout(()=>{navLock=false;acc=0},150)};
 raf=requestAnimationFrame(step);
}
const stopAuto=()=>{cancelAnimationFrame(raf);navLock=false};
addEventListener('wheel',stopAuto,{passive:true});
addEventListener('touchstart',stopAuto,{passive:true});
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const t=$(a.getAttribute('href'));if(!t)return;e.preventDefault();closeMenu();
 smoothTo(a.getAttribute('href')==='#home'?0:t.getBoundingClientRect().top+scrollY-70);
}));

/* ---- header glass + hide on scroll down, parallax photos (one rAF per frame) ---- */
let lastY=scrollY,acc=0,tick=false,navLock=false;const imgs=$$('.photo:not(.photo--gate):not(.photo--pasture) img.p');
function setHidden(h){if(header.classList.contains('hide')!==h)header.classList.toggle('hide',h)}
function onFrame(){
 tick=false;const y=Math.max(0,scrollY),vh=innerHeight,d=y-lastY;lastY=y;
 header.classList.toggle('solid',y>30);
 if(y<120||navLock||links.classList.contains('open')||y+vh>=document.documentElement.scrollHeight-2)setHidden(false);  // always visible near top / bottom / while menu open
 else if(d!==0){
  if(Math.sign(d)!==Math.sign(acc))acc=0;           // direction changed: start counting again
  acc+=d;
  if(acc>40)setHidden(true);                          // scrolled down ~40px in one go
  else if(acc<-12)setHidden(false);                   // any real scroll up brings it back
 }
 if(!reduce)imgs.forEach(im=>{const r=im.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
  im.style.transform=`translate3d(0,${(((r.top+r.height/2-vh/2)/vh)*-46).toFixed(1)}px,0) scale(1.06)`});
}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onFrame)}},{passive:true});
header.addEventListener('focusin',()=>setHidden(false));
onFrame();

/* ---- mobile menu ---- */
function closeMenu(){links.classList.remove('open');burger.classList.remove('open');burger.setAttribute('aria-expanded','false')}
burger.onclick=()=>{const o=links.classList.toggle('open');burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)};
addEventListener('keydown',e=>e.key==='Escape'&&closeMenu());

/* ---- scroll reveal ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* ---- active nav link ---- */
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.links a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
['home','about','team','vision','contact'].forEach(id=>spy.observe($('#'+id)));

/* ---- team slider: auto-advances every 15s (progress bar IS the timer) ---- */
const track=$('#track'),slides=[...track.children],n=slides.length,bars=$('#bars'),slider=$('.slider');
let i=0,hover=false,visible=false,touching=false;
slides.forEach((_,k)=>{const b=document.createElement('button');b.setAttribute('aria-label','Slide '+(k+1));b.onclick=()=>go(k);bars.appendChild(b)});
function go(k){
 i=(k+n)%n;track.style.transform=`translateX(-${i*100}%)`;
 slides.forEach((s,j)=>{s.classList.toggle('active',j===i);s.setAttribute('aria-hidden',j!==i)});
 [...bars.children].forEach(b=>b.classList.remove('on'));
 void bars.offsetWidth;                       // restart the 15s fill animation
 bars.children[i].classList.add('on');
}
function setPause(){bars.classList.toggle('paused',hover||touching||!visible||document.hidden)}
bars.addEventListener('animationend',e=>{if(e.animationName==='fill')go(i+1)});
$('#prev').onclick=()=>go(i-1);$('#next').onclick=()=>go(i+1);
slider.addEventListener('mouseenter',()=>{hover=true;setPause()});
slider.addEventListener('mouseleave',()=>{hover=false;setPause()});
slider.addEventListener('focusin',()=>{hover=true;setPause()});
slider.addEventListener('focusout',()=>{hover=false;setPause()});
document.addEventListener('visibilitychange',setPause);
new IntersectionObserver(es=>{visible=es[0].isIntersecting;setPause()},{threshold:.35}).observe(slider);
let sx=0,sy=0;
track.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;touching=true;setPause()},{passive:true});
track.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;touching=false;setPause();if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(i+(dx<0?1:-1))});
go(0);setPause();

/* ---- contact form (front-end only: connect to Formspree/Netlify/your backend) ---- */
$('#form').addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;
 const bad=[...f.querySelectorAll('[required]')].filter(x=>!x.value.trim()||(x.type==='email'&&!/^\S+@\S+\.\S+$/.test(x.value)));
 if(bad.length){bad[0].focus();bad.forEach(x=>x.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:320,easing:'ease-in-out'}));return}
 f.classList.add('sent');$('#ok').classList.add('show');
});
$('#yr').textContent=new Date().getFullYear();
