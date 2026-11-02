const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav'),furnitureMenu=document.querySelector('.furniture-menu');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');if(furnitureMenu)furnitureMenu.open=false}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu()});

const track=document.querySelector('.projects'),arrows=document.querySelector('.arrows'),prev=document.querySelector('.prev'),next=document.querySelector('.next');
let requestedGalleryStop=null;
function galleryStops(){const cards=[...track.querySelectorAll('.project')],max=Math.max(0,track.scrollWidth-track.clientWidth);if(!cards.length)return [0];const first=cards[0].getBoundingClientRect().left;const values=[0,...cards.map(card=>Math.max(0,Math.min(max,card.getBoundingClientRect().left-first))),max].sort((a,b)=>a-b);return values.filter((value,index)=>index===0||value-values[index-1]>1)}
function updateGalleryControls(){const max=Math.max(0,track.scrollWidth-track.clientWidth),position=requestedGalleryStop??track.scrollLeft;arrows.hidden=max<=2;prev.disabled=position<=1;next.disabled=position>=max-1}
function scrollGalleryTo(left,behavior){requestedGalleryStop=left;track.scrollTo({left,behavior});if(Math.abs(track.scrollLeft-left)<=1)requestedGalleryStop=null;updateGalleryControls()}
arrows.addEventListener('click',e=>{const button=e.target.closest('button');if(!button||button.disabled)return;const position=requestedGalleryStop??track.scrollLeft,stops=galleryStops();const target=button===next?stops.find(stop=>stop>position+1):[...stops].reverse().find(stop=>stop<position-1);if(target===undefined)return;scrollGalleryTo(target,matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth')});
track.addEventListener('scroll',()=>{if(requestedGalleryStop!==null&&Math.abs(track.scrollLeft-requestedGalleryStop)<=1)requestedGalleryStop=null;updateGalleryControls()},{passive:true});
track.addEventListener('scrollend',()=>{requestedGalleryStop=null;updateGalleryControls()});
for(const event of ['pointerdown','touchstart','wheel'])track.addEventListener(event,()=>{requestedGalleryStop=null;updateGalleryControls()},{passive:true});
track.addEventListener('focusin',event=>{const card=event.target.closest('.project');if(!card)return;const frame=track.getBoundingClientRect(),photo=card.getBoundingClientRect();if(photo.left>=frame.left-1&&photo.right<=frame.left+track.clientWidth+1)return;const first=track.querySelector('.project').getBoundingClientRect().left,left=photo.left-first,right=left+photo.width;const candidates=galleryStops().filter(stop=>left>=stop-1&&right<=stop+track.clientWidth+1);if(candidates.length)scrollGalleryTo(candidates.reduce((a,b)=>Math.abs(a-track.scrollLeft)<Math.abs(b-track.scrollLeft)?a:b),'auto')});
window.addEventListener('resize',()=>{requestedGalleryStop=null;const stops=galleryStops(),target=stops.reduce((a,b)=>Math.abs(a-track.scrollLeft)<Math.abs(b-track.scrollLeft)?a:b);scrollGalleryTo(target,'auto')});updateGalleryControls();
