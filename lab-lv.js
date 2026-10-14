/* T4 · Diagramas interactivos de equilibrio líquido-vapor (Pxy y Txy). */
(function(g){
'use strict';
const E=g.Estudio, Lab=g.Lab, b=E.b, L=E.L, N=E.num;
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'currentColor';
const clip=(x,a,c)=>Math.max(a,Math.min(c,x));
const bis=(f,a,c)=>{ let fa=f(a); for(let i=0;i<90;i++){ const m=(a+c)/2, fm=f(m); if((fa<0)===(fm<0)){a=m;fa=fm;}else c=m; } return (a+c)/2; };
const systems={
  b300:{name:b('Benceno–tolueno · 300 K','Bentzeno–tolueno · 300 K'),pa:103.1,pb:32.06,unit:'mmHg'},
  b80:{name:b('Benceno–tolueno · 80 °C','Bentzeno–tolueno · 80 °C'),pa:753,pb:290,unit:'mmHg'},
  exam:{name:b('A–B · examen 2019–20 ext. 1','A–B · 2019–20 ez-ohikoa 1. ariketa'),pa:250,pb:1610,unit:'mmHg'}
};
const tSystems={
  bt:{name:b('Benceno–tolueno (Antoine)','Bentzeno–toluenoa (Antoine)'),P:760,unit:'mmHg',A:{n:b('Benceno','Bentzenoa'),a:6.90565,b:1211.033,c:220.79},B:{n:b('Tolueno','Toluenoa'),a:6.95464,b:1344.8,c:219.48},form:'log₁₀ P(mmHg) = A − B/(C + T[°C])'},
  mw:{name:b('MEK–agua · examen 2024–25','MEK–ura · 2024–25 azterketa'),P:1,unit:'bar',A:{n:b('MEK','MEK'),a:3.99,b:1150.21,c:63.9},B:{n:b('Agua','Ura'),a:3.24,b:643.75,c:198.04},form:'log₁₀ P(bar) = A − B/(T[K] − C)'}
};

Lab.def('pxy',(host,o)=>{
  let key=o.system||'b300', z=.5, P=67.58, pa=systems[key].pa, pb=systems[key].pb;
  const tx={sys:b('Sistema','Sistema'),za:b('Composición global z<sub>A</sub>','z<sub>A</sub> konposizio globala'),pr:b('Presión P','P presioa'),pa:b('P° de A','A-ren P°'),pb:b('P° de B','B-ren P°'),curve:b('burbuja: composición líquida x<sub>A</sub>','burbuila: x<sub>A</sub> likido-konposizioa'),dew:b('rocío: composición vapor y<sub>A</sub>','ihintza: y<sub>A</sub> lurrun-konposizioa'),reg:b('Estado','Egoera'),liq:b('Líquido subenfriado','Likido azpihoztua'),vap:b('Vapor sobrecalentado','Lurrun gainberotua'),lv:b('Líquido + vapor en equilibrio','Orekan dagoen likidoa + lurruna'),click:b('Toca el diagrama para mover el estado global (z, P).','Ukitu diagrama egoera globala (z, P) mugitzeko.'),lever:b('Regla de la palanca','Palankaren legea'),liquid:b('Fracción de líquido L/F','L/F likido-frakzioa'),vapor:b('Fracción de vapor V/F','V/F lurrun-frakzioa'),outside:b('Fuera de la región bifásica no hay dos fases para aplicar la palanca.','Bi faseko eremutik kanpo ez dago palanka aplikatzeko bi faserik.'),first:b('A más volátil','A lurrunkorragoa'),label:b('A más volátil · P en','A lurrunkorragoa · P'),};
  host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(tx.sys)}<select id="pxy-system">${Object.entries(systems).map(([k,s])=>`<option value="${k}" ${k===key?'selected':''}>${L(s.name)}</option>`).join('')}</select></label>
    ${Lab.slider('pxy-z',tx.za,.02,.98,.01,z,'—')}${Lab.slider('pxy-P',tx.pr,5,1700,1,P,systems[key].unit)}
    ${Lab.slider('pxy-pa',tx.pa,10,1800,1,pa,systems[key].unit)}${Lab.slider('pxy-pb',tx.pb,10,1800,1,pb,systems[key].unit)}</div><div class="out" id="pxy-out"></div></div>`;
  const sv=(id,v,u,d=3)=>{const el=host.querySelector('#'+id+'-v');if(el)el.textContent=N(v,d)+(u?' '+u:'');};
  function ranges(){ const hm=Math.max(pa,pb)*1.12, sp=host.querySelector('#pxy-P'); sp.min=+(hm*0.02).toPrecision(2); sp.max=+hm.toPrecision(3); sp.step=+(hm/800).toPrecision(2); sp.value=P;
    ['#pxy-pa','#pxy-pb'].forEach(id=>{ const el=host.querySelector(id); el.step=0.01; }); host.querySelector('#pxy-pa').value=pa; host.querySelector('#pxy-pb').value=pb; }
  function update(){
    const unit=systems[key].unit, hi=Math.max(pa,pb)*1.12, x0=48,x1=407,y0=235,y1=32,W=420,H=280;
    const X=x=>x0+x*(x1-x0), Y=p=>y0-clip(p/hi,0,1)*(y0-y1), pB=x=>x*pa+(1-x)*pb;
    const pD=y=>1/(y/pa+(1-y)/pb), pBubble=pB(z), pDew=pD(z);
    const region=P>pBubble?'liq':P<pDew?'vap':'lv';
    let x=null,y=null,vf=null,lf=null;
    if(region==='lv') { x=clip((P-pb)/(pa-pb),0,1); y=clip((1/P-1/pb)/(1/pa-1/pb),0,1); if(Math.abs(y-x)>1e-9){vf=clip((z-x)/(y-x),0,1);lf=1-vf;} }
    const points=Array.from({length:81},(_,i)=>{const a=i/80;return {x:X(a),b:Y(pB(a)),d:Y(pD(a))};});
    const bp=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.b.toFixed(1)}`).join(' ');
    const dp=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.d.toFixed(1)}`).join(' ');
    const band=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.b.toFixed(1)}`).join(' ')+points.slice().reverse().map(q=>`L${q.x.toFixed(1)} ${q.d.toFixed(1)}`).join(' ')+' Z';
    const tie=region==='lv'?`<line x1="${X(x)}" y1="${Y(P)}" x2="${X(y)}" y2="${Y(P)}" stroke="var(--accent)" stroke-width="3" stroke-dasharray="5 4"/><circle cx="${X(x)}" cy="${Y(P)}" r="5" fill="var(--c-lv)"/><circle cx="${X(y)}" cy="${Y(P)}" r="5" fill="var(--c-azido)"/><text x="${X(x)}" y="${Y(P)-9}" text-anchor="middle" class="svgmono" font-size="14">x=${N(x,2)}</text><text x="${X(y)}" y="${Y(P)-9}" text-anchor="middle" class="svgmono" font-size="14">y=${N(y,2)}</text>`:'';
     const status=region==='liq'?tx.liq:region==='vap'?tx.vap:tx.lv;
    host.querySelector('#pxy-z-v').textContent=N(z,2); sv('pxy-P',P,unit,4); sv('pxy-pa',pa,unit,4); sv('pxy-pb',pb,unit,4);
    host.querySelector('#pxy-out').innerHTML=`<figure class="fig"><svg id="pxy-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${L(b('Diagrama Pxy interactivo','Pxy diagrama interaktiboa'))}">
      <path d="${band}" fill="var(--c-lv)" opacity=".10"/>
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="var(--ink-3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--ink-3)"/>
      ${[0,.25,.5,.75,1].map(a=>`<line x1="${X(a)}" y1="${y0}" x2="${X(a)}" y2="${y0+4}" stroke="var(--ink-3)"/><text x="${X(a)}" y="${y0+18}" text-anchor="middle" class="svgmono" font-size="13">${a.toFixed(2)}</text>`).join('')}
      <text x="${x1}" y="${y0+39}" text-anchor="end" class="svgtxt" font-size="14">x_A · y_A</text><text x="${x0}" y="${y1-12}" text-anchor="middle" class="svgmono" font-size="13">P (${unit})</text>${[0,1,2,3,4].map(k=>{const pv=hi*k/4;return `<line x1="${x0-4}" y1="${Y(pv)}" x2="${x0}" y2="${Y(pv)}" stroke="var(--ink-3)"/><text x="${x0-6}" y="${Y(pv)+4}" text-anchor="end" class="svgmono" font-size="11">${Math.round(pv)}</text>`;}).join('')}
      <text x="${x0+55}" y="${y1+20}" class="svgtxt" font-size="14">${L(b('Líquido','Likidoa'))}</text><text x="${x1-8}" y="${y0-9}" text-anchor="end" class="svgtxt" font-size="14">${L(b('Vapor','Lurruna'))}</text>
      <path d="${bp}" fill="none" stroke="var(--c-lv)" stroke-width="3"/><path d="${dp}" fill="none" stroke="var(--c-azido)" stroke-width="3" stroke-dasharray="7 4"/>
      <line x1="${X(z)}" y1="${Y(P)}" x2="${X(z)}" y2="${y0}" stroke="var(--ink-3)" stroke-dasharray="3 4"/><line x1="${x0}" y1="${Y(P)}" x2="${X(z)}" y2="${Y(P)}" stroke="var(--ink-3)" stroke-dasharray="3 4"/>
      ${tie}<circle cx="${X(z)}" cy="${Y(P)}" r="7" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>
      </svg><figcaption><span style="color:var(--c-lv);font-weight:700">━━</span> ${L(tx.curve)} &nbsp; <span style="color:var(--c-azido);font-weight:700">╍╍</span> ${L(tx.dew)}<br>${L(tx.click)}</figcaption></figure>
      <div class="readout"><div class="stat"><b>${N(pBubble,4)} ${unit}</b><span>${L(b('P de burbuja para z','z-rako burbuila-presioa'))}</span></div><div class="stat"><b>${N(pDew,4)} ${unit}</b><span>${L(b('P de rocío para z','z-rako ihintz-presioa'))}</span></div><div class="stat"><b>${L(status)}</b><span>${L(tx.reg)}</span></div>
       <div class="stat"><b>${pa>=pb?'A':'B'}</b><span>${L(tx.first)}</span></div>${region==='lv'?`<div class="stat"><b>${N(x,3)} / ${N(y,3)}</b><span>${L(b('xA líquido / yA vapor','xA likidoa / yA lurruna'))}</span></div><div class="stat"><b>${N(lf,3)} / ${N(vf,3)}</b><span>${L(tx.liquid)} / ${L(tx.vapor)}</span></div>`:`<div class="stat"><b>z<sub>A</sub> = ${N(z,3)}</b><span>${L(b('composición global','konposizio globala'))}</span></div>`}</div>
      ${region==='lv'?`<p class="msg">${L(tx.lever)}: z = (L/F)x + (V/F)y. ${L(b('El punto global queda entre las composiciones de ambas fases.','Egoera-puntu globala bi faseen konposizioen artean dago.'))}</p>`:`<p class="msg">${L(tx.outside)}</p>`}`;
  }
  host.addEventListener('input',e=>{const t=e.target;if(t.id==='pxy-z')z=+t.value;else if(t.id==='pxy-P')P=+t.value;else if(t.id==='pxy-pa')pa=+t.value;else if(t.id==='pxy-pb')pb=+t.value;else return;update();});
  host.addEventListener('change',e=>{if(e.target.id==='pxy-system'){key=e.target.value;pa=systems[key].pa;pb=systems[key].pb;const sa=host.querySelector('#pxy-pa'),sb=host.querySelector('#pxy-pb');sa.value=pa;sb.value=pb;P=(pa+pb)/2;ranges();update();}});
  host.addEventListener('pointerdown',e=>{if(e.target.id!=='pxy-svg')return; e.target.setPointerCapture?.(e.pointerId);});
  host.addEventListener('click',e=>{const svg=e.target.closest('#pxy-svg');if(!svg)return;const r=svg.getBoundingClientRect(),xx=(e.clientX-r.left)/r.width*420,yy=(e.clientY-r.top)/r.height*280;if(xx<48||xx>407||yy<32||yy>235)return;z=clip((xx-48)/(407-48),.02,.98);const hi=Math.max(pa,pb)*1.12;P=clip((235-yy)/(235-32)*hi,5,1700);host.querySelector('#pxy-z').value=z;host.querySelector('#pxy-P').value=P;update();});
  ranges(); update();
});

Lab.def('txy',(host,o)=>{
  let key=o.system||'bt', z=.4, T=90;
  const tx={sys:b('Sistema y Antoine','Sistema eta Antoine'),z:b('Composición global z<sub>A</sub>','z<sub>A</sub> konposizio globala'),temp:b('Temperatura T','T tenperatura'),pressure:b('Presión constante','Presio konstantea'),bubble:b('curva de burbuja · x<sub>A</sub>','burbuila-kurba · x<sub>A</sub>'),dew:b('curva de rocío · y<sub>A</sub>','ihintza-kurba · y<sub>A</sub>'),liq:b('Líquido subenfriado','Likido azpihoztua'),vap:b('Vapor sobrecalentado','Lurrun gainberotua'),lv:b('Líquido + vapor en equilibrio','Orekan dagoen likidoa + lurruna'),reg:b('Estado','Egoera'),liquid:b('Fracción de líquido L/F','L/F likido-frakzioa'),vapor:b('Fracción de vapor V/F','V/F lurrun-frakzioa'),touch:b('Toca el diagrama para elegir z y T.','Ukitu diagrama z eta T aukeratzeko.'),formula:b('Constantes y forma usadas','Erabilitako konstanteak eta forma'),outside:b('Fuera de la región L+V no hay línea de reparto ni regla de la palanca.','L+V eremutik kanpo ez dago lotura-lerrorik ez palankaren legerik.')};
   const pp=(c,t)=>{const temp=key==='bt'?t:t+273.15;return key==='bt'?Math.pow(10,c.a-c.b/(c.c+temp)):Math.pow(10,c.a-c.b/(temp-c.c));};
  function roots(s){const a=tSystems[key].A, bb=tSystems[key].B, p=tSystems[key].P;
    const tb=x=>bis(t=>x*pp(a,t)+(1-x)*pp(bb,t)-p,key==='bt'?50:20,key==='bt'?160:180);
    const td=y=>bis(t=>y/pp(a,t)+(1-y)/pp(bb,t)-1/p,key==='bt'?50:20,key==='bt'?160:180);
    return {tb,td};}
  host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(tx.sys)}<select id="txy-system">${Object.entries(tSystems).map(([k,s])=>`<option value="${k}" ${k===key?'selected':''}>${L(s.name)}</option>`).join('')}</select></label>${Lab.slider('txy-z',tx.z,.02,.98,.01,z,'—')}${Lab.slider('txy-T',tx.temp,40,150,.5,T,'°C')}</div><div class="eqbox" id="txy-formula"></div><div class="out" id="txy-out"></div></div>`;
  const X=x=>48+x*359;
  function update(){
    const s=tSystems[key],a=s.A,bb=s.B,p=s.P,{tb,td}=roots(),br=tb(z),dr=td(z);
    const region=T<br?'liq':T>dr?'vap':'lv';
    const bubA=pp(a,T),bubB=pp(bb,T); let x=null,y=null,vf=null,lf=null;
    if(region==='lv'){
      x=clip((p-bubB)/(bubA-bubB),0,1);
      y=clip((1/p-1/bubB)/(1/bubA-1/bubB),0,1);
      vf=clip((z-x)/(y-x),0,1);lf=1-vf;
    }
    const tmin=Math.min(tb(0),td(0),tb(1),td(1))-4,tmax=Math.max(tb(0),td(0),tb(1),td(1))+4;
    const x0=48,x1=407,y0=235,y1=32,Y=v=>y0-(v-tmin)/(tmax-tmin)*(y0-y1);
    const points=Array.from({length:81},(_,i)=>{const q=i/80;return {x:X(q),b:Y(tb(q)),d:Y(td(q))};});
    const bp=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.b.toFixed(1)}`).join(' ');
    const dp=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.d.toFixed(1)}`).join(' ');
    const band=points.map((q,i)=>`${i?'L':'M'}${q.x.toFixed(1)} ${q.b.toFixed(1)}`).join(' ')+points.slice().reverse().map(q=>`L${q.x.toFixed(1)} ${q.d.toFixed(1)}`).join(' ')+' Z';
    host.querySelector('#txy-z-v').textContent=N(z,2);host.querySelector('#txy-T-v').textContent=N(T,1)+' °C';
    host.querySelector('#txy-formula').innerHTML=`${L(tx.formula)}<br><small>${L(a.n)}: A=${a.a}, B=${a.b}, C=${a.c} · ${L(bb.n)}: A=${bb.a}, B=${bb.b}, C=${bb.c} · P=${s.P} ${s.unit}</small>`;
    const status=region==='liq'?tx.liq:region==='vap'?tx.vap:tx.lv;
    host.querySelector('#txy-out').innerHTML=`<figure class="fig"><svg id="txy-svg" viewBox="0 0 420 280" role="img" aria-label="${L(b('Diagrama Txy interactivo','Txy diagrama interaktiboa'))}">
      <path d="${band}" fill="var(--c-lv)" opacity=".10"/><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="var(--ink-3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--ink-3)"/>
      ${[0,.25,.5,.75,1].map(q=>`<text x="${X(q)}" y="${y0+18}" text-anchor="middle" class="svgmono" font-size="13">${q.toFixed(2)}</text>`).join('')}
      <text x="${x1}" y="${y0+39}" text-anchor="end" class="svgtxt" font-size="14">x_A · y_A</text><text x="${x0}" y="${y1-12}" text-anchor="middle" class="svgmono" font-size="13">T (°C)</text>${[0,1,2,3,4].map(k=>{const tv=tmin+(tmax-tmin)*k/4;return `<line x1="${x0-4}" y1="${Y(tv)}" x2="${x0}" y2="${Y(tv)}" stroke="var(--ink-3)"/><text x="${x0-6}" y="${Y(tv)+4}" text-anchor="end" class="svgmono" font-size="11">${Math.round(tv)}</text>`;}).join('')}
      <text x="${x0+5}" y="${y1+18}" class="svgtxt" font-size="13">${L(b('Vapor','Lurruna'))}</text><text x="${x1-4}" y="${y0-8}" text-anchor="end" class="svgtxt" font-size="13">${L(b('Líquido','Likidoa'))}</text>
      <path d="${bp}" fill="none" stroke="var(--c-lv)" stroke-width="3"/><path d="${dp}" fill="none" stroke="var(--c-azido)" stroke-width="3" stroke-dasharray="7 4"/>
      <line x1="${X(z)}" y1="${Y(T)}" x2="${X(z)}" y2="${y0}" stroke="var(--ink-3)" stroke-dasharray="3 4"/><line x1="${x0}" y1="${Y(T)}" x2="${X(z)}" y2="${Y(T)}" stroke="var(--ink-3)" stroke-dasharray="3 4"/>
      ${region==='lv'?`<line x1="${X(x)}" y1="${Y(T)}" x2="${X(y)}" y2="${Y(T)}" stroke="var(--accent)" stroke-width="3" stroke-dasharray="5 4"/><circle cx="${X(x)}" cy="${Y(T)}" r="5" fill="var(--c-lv)"/><circle cx="${X(y)}" cy="${Y(T)}" r="5" fill="var(--c-azido)"/><text x="${X(x)}" y="${Y(T)-9}" text-anchor="middle" class="svgmono" font-size="14">x=${N(x,2)}</text><text x="${X(y)}" y="${Y(T)-9}" text-anchor="middle" class="svgmono" font-size="14">y=${N(y,2)}</text>`:''}
      <circle cx="${X(z)}" cy="${Y(T)}" r="7" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/></svg><figcaption><span style="color:var(--c-lv);font-weight:700">━━</span> ${L(tx.bubble)} &nbsp; <span style="color:var(--c-azido);font-weight:700">╍╍</span> ${L(tx.dew)}<br>${L(tx.touch)}</figcaption></figure>
       <div class="readout"><div class="stat"><b>${N(br,3)} °C</b><span>${L(b('T de burbuja para z','z-rako burbuila-tenperatura'))}</span></div><div class="stat"><b>${N(dr,3)} °C</b><span>${L(b('T de rocío para z','z-rako ihintz-tenperatura'))}</span></div><div class="stat"><b>${L(status)}</b><span>${L(tx.reg)}</span></div><div class="stat"><b>${pp(a,T)>=pp(bb,T)?'A':'B'}</b><span>${L(b('Componente más volátil','Osagai lurrunkorrena'))}</span></div>${region==='lv'?`<div class="stat"><b>${N(x,3)} / ${N(y,3)}</b><span>${L(b('xA líquido / yA vapor','xA likidoa / yA lurruna'))}</span></div><div class="stat"><b>${N(lf,3)} / ${N(vf,3)}</b><span>${L(tx.liquid)} / ${L(tx.vapor)}</span></div>`:''}</div>
       ${key==='mw'?`<p class="msg">${L(b('Dato del examen: A=3,24 para el agua da ≈4,8 bar a 450 K; el valor real es ≈9,3 bar. El laboratorio usa el dato impreso.','Azterketako datua: urarentzat A=3,24 erabilita ≈4,8 bar lortzen dira 450 K-an; benetako balioa ≈9,3 bar da. Laborategiak inprimatutako datua erabiltzen du.'))}</p>`:''}
       ${region==='lv'?`<p class="msg">z = (L/F)x + (V/F)y; ${L(b('la composición global queda entre x y y.','konposizio globala x eta y-ren artean dago.'))}</p>`:`<p class="msg">${L(tx.outside)}</p>`}`;
  }
  host.addEventListener('input',e=>{if(e.target.id==='txy-z')z=+e.target.value;else if(e.target.id==='txy-T')T=+e.target.value;else return;update();});
  host.addEventListener('change',e=>{if(e.target.id==='txy-system'){key=e.target.value;T=key==='bt'?95:100;host.querySelector('#txy-T').value=T;update();}});
  host.addEventListener('click',e=>{const svg=e.target.closest('#txy-svg');if(!svg)return;const r=svg.getBoundingClientRect(),xx=(e.clientX-r.left)/r.width*420,yy=(e.clientY-r.top)/r.height*280;if(xx<48||xx>407||yy<32||yy>235)return;const s=tSystems[key],{tb,td}=roots();z=clip((xx-48)/359,.02,.98);const lo=Math.min(tb(0),td(0),tb(1),td(1))-4,hi=Math.max(tb(0),td(0),tb(1),td(1))+4;T=clip(hi-(yy-32)/203*(hi-lo),40,150);host.querySelector('#txy-z').value=z;host.querySelector('#txy-T').value=T;update();});
  update();
});
})(window);
