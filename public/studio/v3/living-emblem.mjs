// Original interactive interpretation of the supplied emblem.
// Three.js r180, MIT. Full upstream notice is retained in runtime/THREE-LICENSE.txt.
import * as THREE from './runtime/three.module.min.js'
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v))
export async function mountEmblem(host,{reducedMotion=false,onFailure=()=>{},onReset=()=>{},onViewChange=()=>{}}={}){
 const data=await fetch(new URL('./emblem-geometry.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Geometry unavailable');return r.json()})
 let disposed=false,frame=0,drag=null,lastTime=0,viewYaw=0,viewPitch=0
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1.25:1.6))
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25
 const canvas=renderer.domElement;canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive folded emblem. Arrow keys rotate; Home resets. Vertical touch gestures scroll.')
 canvas.style.touchAction='pan-y';host.append(canvas)
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,30);camera.position.set(0,0,8.1)
 const environment=document.createElement('canvas');environment.width=1024;environment.height=512
 const c=environment.getContext('2d');c.fillStyle='#15101d';c.fillRect(0,0,1024,512)
 for(const[x,y,w,h,color]of[[70,35,80,390,'#d9d7e1'],[400,20,190,110,'#b7aac9'],[790,120,42,300,'#8c64bc'],[950,100,28,330,'#e7d4bf']]){const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#15101d');g.addColorStop(.18,color);g.addColorStop(.82,color);g.addColorStop(1,'#15101d');c.fillStyle=g;c.fillRect(x,y,w,h)}
 const texture=new THREE.CanvasTexture(environment);texture.mapping=THREE.EquirectangularReflectionMapping
 const generator=new THREE.PMREMGenerator(renderer),env=generator.fromEquirectangular(texture);scene.environment=env.texture;texture.dispose();generator.dispose()
 scene.add(new THREE.HemisphereLight(0xd4c4ee,0x17101e,.8))
 const key=new THREE.DirectionalLight(0xe5ddf5,2.3);key.position.set(-3,4,5);scene.add(key)
 const edge=new THREE.DirectionalLight(0x9351e6,2);edge.position.set(3,-1,-2);scene.add(edge)
 const group=new THREE.Group();scene.add(group)
 const meshes=data.parts.map((part,index)=>{
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));g.setIndex(part.indices);g.computeVertexNormals()
  const mat=new THREE.MeshPhysicalMaterial({color:index?0x8957cb:0x77717f,metalness:.96,roughness:.27,clearcoat:.08,side:THREE.DoubleSide})
  mat.polygonOffset=true;mat.polygonOffsetFactor=1;mat.polygonOffsetUnits=1
  const mesh=new THREE.Mesh(g,mat);group.add(mesh)
  const pairs=[],rows=112,cols=28
  for(let j=0;j<=rows;j+=8)for(let i=0;i<cols;i++)pairs.push(j*(cols+1)+i,j*(cols+1)+i+1)
  for(let i=0;i<=cols;i+=7)for(let j=0;j<rows;j++)pairs.push(j*(cols+1)+i,(j+1)*(cols+1)+i)
  const wireGeo=new THREE.BufferGeometry();wireGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(pairs.length*3),3))
  const wire=new THREE.LineSegments(wireGeo,new THREE.LineBasicMaterial({color:0xe4c6f2,transparent:true,opacity:.25}));wire.visible=false;group.add(wire)
  return{mesh,wire,pairs,base:Float32Array.from(part.positions),flat:Float32Array.from(part.flat)}
 })
 const target={yaw:0,pitch:0,unfold:0},current={...target},velocity={yaw:0,pitch:0,unfold:0}
 let shown=true
 function render(now=0){
  if(disposed)return;frame=0;const dt=Math.min(.04,Math.max(.008,(now-lastTime)/1000||.016));lastTime=now;let unsettled=false
  for(const k of ['yaw','pitch','unfold']){if(reducedMotion){current[k]=target[k];velocity[k]=0}else{velocity[k]+=(target[k]-current[k])*145*dt;velocity[k]*=Math.exp(-19*dt);current[k]+=velocity[k]*dt;if(Math.abs(target[k]-current[k])>.0001||Math.abs(velocity[k])>.0001)unsettled=true}}
  group.rotation.set(current.pitch,current.yaw,0)
  meshes.forEach(({mesh,wire,pairs,base,flat},i)=>{const attribute=mesh.geometry.attributes.position;for(let p=0;p<base.length;p++)attribute.array[p]=base[p]+(flat[p]-base[p])*current.unfold;attribute.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.position.x=(i?1:-1)*current.unfold*.12;wire.position.copy(mesh.position);wire.visible=current.unfold>.08;const lines=wire.geometry.attributes.position;for(let j=0;j<pairs.length;j++)for(let k=0;k<3;k++)lines.array[j*3+k]=attribute.array[pairs[j]*3+k];lines.needsUpdate=true})
  canvas.dataset.yaw=current.yaw.toFixed(3);canvas.dataset.unfold=current.unfold.toFixed(3);renderer.render(scene,camera)
  if(unsettled&&shown)frame=requestAnimationFrame(render)
 }
 function request(){if(!disposed&&!frame&&shown)frame=requestAnimationFrame(render)}
 const resize=new ResizeObserver(()=>{const{width,height}=host.getBoundingClientRect();if(width&&height){renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();request()}});resize.observe(host)
 const visible=new IntersectionObserver(([e])=>{shown=e.isIntersecting;if(shown)request();else{cancelAnimationFrame(frame);frame=0}});visible.observe(host)
 const down=e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,yaw:target.yaw,pitch:target.pitch,engaged:false,id:e.pointerId}}
 const move=e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.engaged){if(Math.abs(dy)>Math.abs(dx)+8&&e.pointerType==='touch'){drag=null;return}if(Math.abs(dx)<6)return;drag.engaged=true;canvas.setPointerCapture(e.pointerId)}target.yaw=clamp(drag.yaw+dx*.006,-1.12,1.12);target.pitch=clamp(drag.pitch+dy*.003,-.33,.33);request()}else if(e.pointerType==='mouse'){const rect=canvas.getBoundingClientRect();target.yaw=clamp(viewYaw+((e.clientX-rect.left)/rect.width-.5)*.22,-1.12,1.12);target.pitch=clamp(viewPitch+((e.clientY-rect.top)/rect.height-.5)*.12,-.33,.33);request()}}
 const up=()=>{if(drag?.engaged){viewYaw=target.yaw;viewPitch=target.pitch;onViewChange('free')}drag=null}
 const leave=()=>{if(!drag){target.yaw=viewYaw;target.pitch=viewPitch;request()}}
 const keyboard=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='Home'){viewYaw=viewPitch=target.yaw=target.pitch=target.unfold=0;onReset()}else{if(e.key==='ArrowLeft')target.yaw=clamp(target.yaw-.16,-1.12,1.12);else if(e.key==='ArrowRight')target.yaw=clamp(target.yaw+.16,-1.12,1.12);else target.pitch=clamp(target.pitch+(e.key==='ArrowUp'?-.08:.08),-.33,.33);viewYaw=target.yaw;viewPitch=target.pitch;onViewChange('free')}request()}}
 const lost=e=>{e.preventDefault();onFailure('The 3D view is unavailable. The original identity is shown instead.')}
 for(const[name,fn]of [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['pointerleave',leave],['keydown',keyboard],['webglcontextlost',lost]])canvas.addEventListener(name,fn)
 request()
 return{
  view(name){viewYaw=target.yaw=name==='side'?.95:name==='perspective'?.48:0;viewPitch=target.pitch=name==='perspective'?-.1:0;request()},
  unfold(value){target.unfold=clamp(value,0,1);request()},
  reset(){viewYaw=viewPitch=target.yaw=target.pitch=target.unfold=0;request()},
  dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();visible.disconnect();for(const{mesh,wire}of meshes){mesh.geometry.dispose();mesh.material.dispose();wire.geometry.dispose();wire.material.dispose()}env.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove()}
 }
}
