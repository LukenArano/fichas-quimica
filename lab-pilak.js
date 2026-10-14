/* Laboratorios de electroquímica: pilas de Nernst y escala de potenciales. */
(function(g){
'use strict';
const E=g.Estudio, b=E.b, L=E.L, R=E.rich, Lab=g.Lab;
const F=96485, S=0.0592, ln10=Math.LN10;
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'currentColor';
const nfmt=(x,d=3)=>E.num(x,d);
const subs=s=>String(s).replace(/([A-Za-z)])(\d+)/g,'$1<sub>$2</sub>');

/* Las especies y sus coeficientes son los de la semirreacción de reducción. */
const H={
 zn:{name:'Zn²⁺/Zn',e0:-0.763,n:2,lo:[['Zn²⁺',1]],hi:[['Zn(s)',1]],aq:'Zn²⁺'},
 cu:{name:'Cu²⁺/Cu',e0:0.342,n:2,lo:[['Cu²⁺',1]],hi:[['Cu(s)',1]],aq:'Cu²⁺'},
 ag:{name:'Ag⁺/Ag',e0:0.799,n:1,lo:[['Ag⁺',1]],hi:[['Ag(s)',1]],aq:'Ag⁺',silver:true},
 co:{name:'Co²⁺/Co',e0:-0.280,n:2,lo:[['Co²⁺',1]],hi:[['Co(s)',1]],aq:'Co²⁺'},
 pb:{name:'Pb²⁺/Pb',e0:-0.1263,n:2,lo:[['Pb²⁺',1]],hi:[['Pb(s)',1]],aq:'Pb²⁺'},
 ni:{name:'Ni²⁺/Ni',e0:-0.230,n:2,lo:[['Ni²⁺',1]],hi:[['Ni(s)',1]],aq:'Ni²⁺'},
 fe:{name:'Fe²⁺/Fe',e0:-0.440,n:2,lo:[['Fe²⁺',1]],hi:[['Fe(s)',1]],aq:'Fe²⁺'},
 fe3:{name:'Fe³⁺/Fe²⁺ (Pt)',e0:0.771,n:1,lo:[['Fe³⁺',1]],hi:[['Fe²⁺',1]],aq:'Fe³⁺',aq2:'Fe²⁺',ion:true},
 cr:{name:'Cr₂O₇²⁻/Cr³⁺ (Pt)',e0:1.330,n:6,lo:[['Cr₂O₇²⁻',1],['H⁺',14]],hi:[['Cr³⁺',2],['H₂O(l)',7]],aq:'Cr₂O₇²⁻',aq2:'Cr³⁺',ion:true,acid:true},
 h2:{name:'H⁺/H₂ (Pt)',e0:0,n:2,lo:[['H⁺',2]],hi:[['H₂(g)',1]],aq:'H⁺',gas:true,acid:true},
 agcl:{name:'AgCl(s)/Ag (Cl⁻)',e0:0.799+S*Math.log10(1.8e-10),n:1,lo:[['AgCl(s)',1]],hi:[['Ag(s)',1],['Cl⁻',1]],aq:'Cl⁻',silver:true,insol:true},
 niOOH:{name:'NiO(OH)/Ni(OH)₂ (OH⁻)',e0:0.490,n:1,lo:[['NiO(OH)(s)',1],['H₂O(l)',1]],hi:[['Ni(OH)₂(s)',1],['OH⁻',1]],aq:'OH⁻',basic:true}
};
const opts=Object.entries(H).map(([k,x])=>`<option value="${k}">${x.name}</option>`).join('');
function activity(key,side,state){
 const h=H[key], a=Math.pow(10,state[side+'a']), z=Math.pow(10,state[side+'z']), ph=state[side+'ph'];
 const conc={}; conc[h.aq]=a; if(h.aq2) conc[h.aq2]=z;
 conc['H⁺']=Math.pow(10,-ph); conc['OH⁻']=Math.pow(10,ph-14);
 let q=1;
 for(const [s,v] of h.lo) if(s!=='H₂O(l)') q/=Math.pow(conc[s]||1,v);
 for(const [s,v] of h.hi) if(s!=='H₂O(l)') q*=Math.pow(conc[s]||1,v);
 if(h.gas) q/=1;
 return {E:h.e0-S/h.n*Math.log10(q),E0:h.e0,a,z,ph,conc};
}
function fmtSpecies(s){return s.replace(/\(s\)/g,'<sub>(s)</sub>').replace(/\(g\)/g,'<sub>(g)</sub>').replace(/\(l\)/g,'<sub>(l)</sub>');}
function combine(an,ca){
 const m=new Map(); const put=(s,v)=>m.set(s,(m.get(s)||0)+v);
 an.lo.forEach(([s,v])=>put(s,v)); an.hi.forEach(([s,v])=>put(s,-v));
 ca.lo.forEach(([s,v])=>put(s,v)); ca.hi.forEach(([s,v])=>put(s,-v));
 const eN=an.n*ca.n/gcd(an.n,ca.n), aa=eN/an.n, cc=eN/ca.n;
 const mm=new Map(); const add=(s,v)=>mm.set(s,(mm.get(s)||0)+v);
 an.lo.forEach(([s,v])=>add(s,v*aa)); an.hi.forEach(([s,v])=>add(s,-v*aa));
 ca.lo.forEach(([s,v])=>add(s,v*cc)); ca.hi.forEach(([s,v])=>add(s,-v*cc));
 for(const [s,v] of [...mm]) if(Math.abs(v)<1e-10) mm.delete(s);
 const left=[],right=[];
 for(const [s,v] of mm) (v>0?left:right).push(`${Math.abs(v)===1?'':Math.abs(v)}${fmtSpecies(s)}`);
 const eq=(left.length?left.join(' + '):'e⁻')+' → '+(right.length?right.join(' + '):'e⁻');
 return {n:eN,aa,cc,eq,mm};
}
function gcd(a,b){return b?gcd(b,a%b):a;}
function halfE(key,state,side,chloride){
 const h=H[key], ac=activity(key,side,state); let value=ac.E;
 if(h.silver&&chloride>0){
   const ag=key==='ag'?Math.min(ac.a,1.8e-10/chloride):null;
   if(ag!=null) value=h.e0+S*Math.log10(Math.max(ag,1e-300));
   else if(key==='agcl') value=h.e0-S*Math.log10(chloride);
 }
 return value;
}
function bilingualText(es,eu){return L(b(es,eu));}
function oxLabel(h){return h.aq==='OH⁻'||h.aq==='H⁺'?`[${h.aq}]: ${L(b('lo fija el pH','pH-ak finkatzen du'))}`:`log₁₀ [${h.aq}]`;}
function redLabel(h){return h.aq2?`log₁₀ [${h.aq2}]`:L(b('forma reducida: sólido o gas (a = 1)','forma erreduzitua: solidoa edo gasa (a = 1)'));}

Lab.def('pila',(host,o)=>{
 const startA=o.a||'zn', startB=o.c||'cu';
 const st={a:startA,c:startB,aa:-1,az:-1,aph:1,ca:-1,cz:-1,cph:1,cl:0};
 host.innerHTML=`<div class="lab">
  <div class="ctrl two">
   <label>${L(b('Semicelda A','A erdi-zelda'))}<select id="pila-a">${opts}</select></label>
   <label>${L(b('Semicelda B','B erdi-zelda'))}<select id="pila-c">${opts}</select></label>
  </div>
  <div class="ctrl two"><p><b>A:</b> <span id="pila-la">[especie A]</span> · <span id="pila-laz">[especie reducida A]</span></p><p><b>B:</b> <span id="pila-lc">[especie B]</span> · <span id="pila-lcz">[especie reducida B]</span></p></div>
  <div class="ctrl two">
   ${Lab.slider('pila-aa',b('log₁₀ actividad oxidada A','A-ren oxidatutako espeziearen log₁₀ aktibitatea'),-8,0,0.1,-1)}
   ${Lab.slider('pila-ca',b('log₁₀ actividad oxidada B','B-ren oxidatutako espeziearen log₁₀ aktibitatea'),-8,0,0.1,-1)}
   ${Lab.slider('pila-az',b('log₁₀ actividad reducida A','A-ren erreduzitutako espeziearen log₁₀ aktibitatea'),-8,0,0.1,-1)}
   ${Lab.slider('pila-cz',b('log₁₀ actividad reducida B','B-ren erreduzitutako espeziearen log₁₀ aktibitatea'),-8,0,0.1,-1)}
   ${Lab.slider('pila-aph',b('pH semicelda A','A erdi-zelularen pH-a'),0,14,0.1,1)}
   ${Lab.slider('pila-cph',b('pH semicelda B','B erdi-zelularen pH-a'),0,14,0.1,1)}
  </div>
  <div class="btns"><button type="button" data-pila="cl">${L(b('Añadir Cl⁻ a la semicelda de Ag','Cl⁻ gehitu Ag-ren erdi-zeldari'))}</button><button type="button" data-pila="reset">${L(b('Restablecer concentraciones','Kontzentrazioak berrezarri'))}</button></div>
  <div class="out" id="pila-out" aria-live="polite"></div></div>`;
 host.querySelector('#pila-a').value=startA; host.querySelector('#pila-c').value=startB;
 const ids=['aa','az','aph','ca','cz','cph']; ids.forEach(k=>st[k]=+host.querySelector('#pila-'+k).value);
 function draw(){
  const ha=H[st.a], hc=H[st.c], ea=halfE(st.a,st, 'a',st.cl), ec=halfE(st.c,st,'c',st.cl);
  const aIsCath=ea>ec, cat=aIsCath?ha:hc, an=aIsCath?hc:ha, Ecat=Math.max(ea,ec), Ean=Math.min(ea,ec), ep=Ecat-Ean;
  const cell=combine(an,cat), E0=cat.e0-an.e0, logK=cell.n*E0/S, dG=-cell.n*F*E0/1000;
  const Ktxt=logK>300?'10<sup>'+nfmt(logK,3)+'</sup>':logK< -300?'< 10<sup>−300</sup>':nfmt(Math.pow(10,logK),3);
  const oxSide=aIsCath?'B':'A', redSide=aIsCath?'A':'B';
  const canCl=ha.silver||hc.silver;
  const labels={A:ha.name,B:hc.name};
  const svg=`<svg viewBox="0 0 420 235" role="img" aria-label="${bilingualText('Esquema de una pila galvánica','Pila galbaniko baten eskema')}">
   <defs><marker id="pil-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>
   <style>@keyframes pilak-electron-flow{from{transform:translateX(0)}to{transform:translateX(${aIsCath?'-200px':'200px'})}}.pilak-electron{animation:pilak-electron-flow 1.8s ease-in-out infinite alternate}@media(prefers-reduced-motion:reduce){.pilak-electron{animation:none}}</style>
   <path d="M105 48V24H315V48" fill="none" stroke="var(--ink-2)" stroke-width="2"/><path d="${aIsCath?'M310 24H110':'M110 24H310'}" fill="none" stroke="var(--accent)" stroke-width="2.5" marker-end="url(#pil-arrow)"/>
   <circle class="pilak-electron" cx="${aIsCath?310:110}" cy="24" r="4" fill="var(--accent)"/>
   <text x="210" y="17" text-anchor="middle" class="svgtxt" font-size="15" fill="var(--accent)">${L(b('e⁻: ánodo → cátodo','e⁻: anodoa → katodoa'))}</text>
   <path d="M126 92 C145 92 145 142 164 142 H256 C275 142 275 92 294 92" fill="none" stroke="var(--c-pila)" stroke-width="7" stroke-linecap="round"/>
   <path d="M126 92 C145 92 145 142 164 142 H256 C275 142 275 92 294 92" fill="none" stroke="var(--surface)" stroke-width="2" stroke-dasharray="4 7"/>
   <text x="210" y="165" text-anchor="middle" class="svgtxt" font-size="14">${L(b('puente salino','gatz-zubia'))}</text>
   <path d="M72 65V164Q72 174 82 174H144Q154 174 154 164V65" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/><path d="M266 65V164Q266 174 276 174H338Q348 174 348 164V65" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>
   <path d="M78 117H148V164Q148 168 144 168H82Q78 168 78 164Z" fill="var(--c-azido)" opacity=".24"/><path d="M272 117H342V164Q342 168 338 168H276Q272 168 272 164Z" fill="var(--c-oreka)" opacity=".24"/>
   <line x1="113" y1="52" x2="113" y2="148" stroke="var(--ink-2)" stroke-width="5"/><line x1="307" y1="52" x2="307" y2="148" stroke="var(--ink-2)" stroke-width="5"/>
   <text x="113" y="193" text-anchor="middle" class="svgtxt" font-size="14">${aIsCath?L(b('cátodo (+)','katodoa (+)')):L(b('ánodo (−)','anodoa (−)'))}</text>
   <text x="307" y="193" text-anchor="middle" class="svgtxt" font-size="14">${aIsCath?L(b('ánodo (−)','anodoa (−)')):L(b('cátodo (+)','katodoa (+)'))}</text>
   <rect x="178" y="49" width="64" height="35" rx="7" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/><text x="210" y="72" text-anchor="middle" class="svgmono" font-size="17">${nfmt(ep,3)} V</text>
   <text x="113" y="214" text-anchor="middle" class="svgmono" font-size="13">${labels.A}</text><text x="307" y="214" text-anchor="middle" class="svgmono" font-size="13">${labels.B}</text></svg>`;
  const out=host.querySelector('#pila-out');
  out.innerHTML=`<figure class="fig">${svg}<figcaption>${L(b('El ánodo se determina por el potencial real más bajo; la flecha indica el flujo externo de electrones.','Anodoa benetako potentzial txikienak zehazten du; geziak kanpoko elektroien fluxua adierazten du.'))}</figcaption></figure>
   <div class="readout"><div class="stat"><b>${nfmt(ea,4)} V</b><span>A · E<sub>real</sub> (${nfmt(ha.e0,3)} V°)</span></div><div class="stat"><b>${nfmt(ec,4)} V</b><span>B · E<sub>real</sub> (${nfmt(hc.e0,3)} V°)</span></div><div class="stat"><b>${nfmt(ep,4)} V</b><span>E<sub>pila</sub> = E<sub>cát</sub> − E<sub>án</sub></span></div></div>
   <div class="eqbox"><b>${L(b('Reacción global (sentido espontáneo)','Erreakzio globala (noranzko berezkoa)'))}</b><br>${st.a===st.c?L(b('Pila de concentración: el mismo par en las dos semiceldas, E° = 0; solo la diferencia de actividades genera tensión.','Kontzentrazio-pila: bikote bera bi erdi-zeldetan, E° = 0; aktibitate-diferentziak bakarrik sortzen du tentsioa.')):cell.eq}<small>${L(b('Electrones intercambiados','Trukatutako elektroiak'))}: n = ${cell.n} · ${L(b('A ánodo','A anodo'))}: ${an.name} · ${L(b('cátodo','katodoa'))}: ${cat.name}</small></div>
   <div class="readout"><div class="stat"><b>${Ktxt}</b><span>K° = 10<sup>nE°/0,0592</sup> (${L(b('log₁₀ K','log₁₀ K'))} = ${nfmt(logK,3)})</span></div><div class="stat"><b>${nfmt(dG,2)} kJ·mol⁻¹</b><span>ΔG° = −nFE°</span></div></div>
   ${canCl?`<p class="msg">${L(b('Cl⁻ añadido','Gehitutako Cl⁻'))}: ${st.cl? nfmt(st.cl,3)+' M':'0 M'}${st.cl?` · E<sub>Ag/AgCl</sub>=${nfmt(0.799+S*Math.log10(1.8e-10)-S*Math.log10(st.cl),3)} V`:''}</p>`:''}
   <p class="muted">${L(b('Los valores de E° se mantienen; la concentración y el pH mueven Ereal mediante Nernst.','E° balioak finko mantentzen dira; kontzentrazioak eta pH-ak E<sub>erreal</sub> aldatzen dute Nernsten bidez.'))}</p>`;
   host.querySelector('[data-pila="cl"]').disabled=!canCl;
  ['a','c'].forEach(side=>{
   const h=H[st[side]], name=side==='a'?'A':'B';
   host.querySelector('#pila-l'+side).innerHTML=oxLabel(h);
   host.querySelector('#pila-l'+side+'z').innerHTML=redLabel(h);host.querySelector('#pila-'+side+'a').disabled=h.aq==='OH⁻'||h.aq==='H⁺';host.querySelector('#pila-'+side+'z').disabled=!h.aq2;
  });
  ['aa','az','ca','cz'].forEach(k=>host.querySelector('#pila-'+k+'-v').textContent=E.fix(st[k],1));
  ['aph','cph'].forEach(k=>host.querySelector('#pila-'+k+'-v').textContent=E.fix(st[k],1));
 }
 host.addEventListener('input',ev=>{const id=ev.target.id;if(id&&id.startsWith('pila-')){const k=id.slice(5);if(k in st)st[k]=+ev.target.value;draw();}});
 host.addEventListener('change',ev=>{if(ev.target.id==='pila-a')st.a=ev.target.value;if(ev.target.id==='pila-c')st.c=ev.target.value;draw();});
 host.addEventListener('click',ev=>{const btn=ev.target.closest('[data-pila]');if(!btn)return;if(btn.dataset.pila==='cl'){st.cl=Math.min(1,st.cl+0.05);draw();}if(btn.dataset.pila==='reset'){st.cl=0;['aa','az','ca','cz'].forEach(k=>{st[k]=-1;host.querySelector('#pila-'+k).value=-1;});['aph','cph'].forEach(k=>{st[k]=1;host.querySelector('#pila-'+k).value=1;});draw();}});
 draw();
});

Lab.def('escala',(host,o)=>{
 const st={a:o.a||'zn',c:o.c||'cu',aa:-1,az:-1,aph:1,ca:-1,cz:-1,cph:1};
 host.innerHTML=`<div class="lab"><div class="ctrl two"><label>${L(b('Electrodo A','A elektrodoa'))}<select id="esc-a">${opts}</select></label><label>${L(b('Electrodo B','B elektrodoa'))}<select id="esc-c">${opts}</select></label>
  ${['aa','ca','az','cz'].map((k,i)=>`<label><span><span id="esc-l${k}">${L(b('log₁₀ actividad','aktibitatearen log₁₀a'))}</span> <span class="lv" id="esc-${k}-v">−1</span></span><input id="esc-${k}" type="range" min="-8" max="0" step="0.1" value="-1"></label>`).join('')}
  <label><span>${L(b('pH A','A-ren pH-a'))} <span class="lv" id="esc-aph-v">1,0</span></span><input id="esc-aph" type="range" min="0" max="14" step="0.1" value="1"></label><label><span>${L(b('pH B','B-ren pH-a'))} <span class="lv" id="esc-cph-v">1,0</span></span><input id="esc-cph" type="range" min="0" max="14" step="0.1" value="1"></label></div><div class="out" id="esc-out"></div></div>`;
 host.querySelector('#esc-a').value=st.a;host.querySelector('#esc-c').value=st.c;
 ['aa','az','ca','cz','aph','cph'].forEach(k=>st[k]=+host.querySelector('#esc-'+k).value);
 function draw(){const ea=halfE(st.a,st,'a',0),ec=halfE(st.c,st,'c',0),ha=H[st.a],hc=H[st.c],cat=ea>ec?'A':'B';const W=420,Hh=300,y=v=>260-(v+0.9)/2.5*225;
  const er=L(b('E real','E erreala'));host.querySelector('#esc-laa').innerHTML='A · '+oxLabel(ha);host.querySelector('#esc-lca').innerHTML='B · '+oxLabel(hc);host.querySelector('#esc-laz').innerHTML='A · '+redLabel(ha);host.querySelector('#esc-lcz').innerHTML='B · '+redLabel(hc);[['aa',ha,'aq'],['ca',hc,'aq'],['az',ha,'aq2'],['cz',hc,'aq2']].forEach(([k,h,f])=>{host.querySelector('#esc-'+k).disabled=f==='aq'?(h.aq==='OH⁻'||h.aq==='H⁺'):!h.aq2;});
  const marks=[{s:'A · E°',v:ha.e0,col:'var(--c-azido)',dash:'6 4'},{s:'A · '+er,v:ea,col:'var(--c-azido)'},{s:'B · E°',v:hc.e0,col:'var(--c-oreka)',dash:'6 4'},{s:'B · '+er,v:ec,col:'var(--c-oreka)'}];
  const ticks=[];for(let v=-0.8;v<=1.41;v+=0.4)ticks.push(`<line x1="72" y1="${y(v)}" x2="365" y2="${y(v)}" stroke="var(--line)"/><text x="62" y="${y(v)+5}" text-anchor="end" class="svgmono" font-size="13">${E.fix(v,1)} V</text>`);
  const bars=marks.map((m,i)=>{const x=118+i*65;return `<line x1="${x}" y1="${y(m.v)}" x2="${x+42}" y2="${y(m.v)}" stroke="${m.col}" stroke-width="${m.dash?2:5}" ${m.dash?`stroke-dasharray="${m.dash}"`:''}/><text x="${x+21}" y="${y(m.v)-7}" text-anchor="middle" class="svgmono" font-size="12">${E.fix(m.v,3)}</text><text x="${x+21}" y="282" text-anchor="middle" class="svgtxt" font-size="13">${m.s}</text>`;}).join('');
  host.querySelector('#esc-out').innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${L(b('Escala de potenciales de reducción','Erredukzio-potentzialen eskala'))}">${ticks.join('')}${bars}</svg><div class="msg"><b>${L(b('Se reduce','Erredukzioa'))}: ${cat} (${cat==='A'?ha.name:hc.name})</b> · <b>${L(b('Se oxida','Oxidazioa'))}: ${cat==='A'?'B':'A'} (${cat==='A'?hc.name:ha.name})</b><br>E<sub>${L(b('cátodo','katodoa'))}</sub> = ${E.fix(Math.max(ea,ec),3)} V ≥ E<sub>${L(b('ánodo','anodoa'))}</sub> = ${E.fix(Math.min(ea,ec),3)} V → E<sub>${L(b('pila','pila'))}</sub> = ${E.fix(Math.abs(ea-ec),3)} V.</div>`;
  ['aa','az','ca','cz','aph','cph'].forEach(k=>host.querySelector('#esc-'+k+'-v').textContent=E.fix(st[k],1));
 }
 host.addEventListener('input',ev=>{const k=ev.target.id&&ev.target.id.slice(4);if(k in st)st[k]=+ev.target.value;draw();});
 host.addEventListener('change',ev=>{if(ev.target.id==='esc-a')st.a=ev.target.value;if(ev.target.id==='esc-c')st.c=ev.target.value;draw();});draw();
});
})(window);
