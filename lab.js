/* Laboratorios interactivos (SVG + cálculo en directo). Lab.def(id, (host, opts)=>{…}); Lab.mount(id, host, opts). */
(function(g){
'use strict';
const E=g.Estudio, L=E.L, b=E.b, R=E.rich;
const Lab={defs:{}};
Lab.def=(id,fn)=>{ Lab.defs[id]=fn; };
Lab.mount=(id,host,o)=>{ const fn=Lab.defs[id]; if(!fn){ host.innerHTML=`<p class="muted">[lab: ${id}]</p>`; return; } fn(host,o||{}); };

/* ---------- utilidades ---------- */
const RG=0.082;              // atm·L/(mol·K)
const num=(x,d)=>E.num(x,d||3);
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
const ln=Math.log, log10=Math.log10;
Lab.bisect=(f,lo,hi,n=200)=>{ let flo=f(lo); for(let i=0;i<n;i++){ const m=(lo+hi)/2, fm=f(m); if((fm<0)===(flo<0)){ lo=m; flo=fm; } else hi=m; } return (lo+hi)/2; };
const slider=(id,label,min,max,step,v,unit)=>`<label><span>${L(label)} <span class="lv" id="${id}-v">${v}${unit?' '+unit:''}</span></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
Lab.slider=slider;
const sp=(c,f,ph)=>`${c>1?c+' ':''}{${f}}${ph?`<small>(${ph})</small>`:''}`;

/* =====================================================================
   REACTOR: equilibrio gaseoso (homogéneo o heterogéneo) en recipiente rígido
   ===================================================================== */
const RXS={
  nh3:{eq:'N₂ + 3H₂ ⇌ 2NH₃',sp:[['N2',-1,'g'],['H2',-3,'g'],['NH3',2,'g']],T:600,K:0.0317,type:'p',dH:-92,n0:[1,2,0],inert:0.5,V:1.2,
       src:b('Datos como 2022-23 ordinaria (Kp de 4NH₃ ⇌ 2N₂ + 6H₂ = 996 → Kp = 996<sup>−1/2</sup>)','2022-23 ohiko deialdiko datuak (4NH₃ ⇌ 2N₂ + 6H₂: Kp = 996 → Kp = 996<sup>−1/2</sup>)')},
  wgs:{eq:'CO + H₂O ⇌ CO₂ + H₂',sp:[['CO',-1,'g'],['H2O',-1,'g'],['CO2',1,'g'],['H2',1,'g']],T:631,K:16,type:'c',dH:-41,n0:[0.4,0.3,0.15,0.15],inert:0,V:10,
       src:b('Como 2024-25 extraordinaria (Kc = 16 a 358 °C)','2024-25 ez-ohiko deialdian bezala (Kc = 16, 358 °C-an)')},
  so3:{eq:'2SO₂ + O₂ ⇌ 2SO₃',sp:[['SO2',-2,'g'],['O2',-1,'g'],['SO3',2,'g']],T:1000,K:3.33,type:'p',dH:-198,n0:[2,1,0],inert:1,V:50,
       src:b('Como 2019-20 ordinaria (Kp = 3,33 a 1000 K)','2019-20 ohiko deialdian bezala (Kp = 3,33, 1000 K-ean)')},
  sf6:{eq:'SF₆ ⇌ SF₄ + 2F',sp:[['SF6',-1,'g'],['SF4',1,'g'],['F',2,'g']],T:900,K:0.96,type:'c',dH:616,n0:[1.5,0,0],inert:0,V:1,
       src:b('Como 2024-25 ordinaria (Kc = 0,96 a 627 °C)','2024-25 ohiko deialdian bezala (Kc = 0,96, 627 °C-an)')},
  meoh:{eq:'CO + 2H₂ ⇌ CH₃OH',sp:[['CO',-1,'g'],['H2',-2,'g'],['CH3OH',1,'g']],T:1700,K:162,type:'c',dH:-91,n0:[0.26,0.26,0],inert:0.26,V:2,
       src:b('Como 2023-24 ordinaria (Kc ≈ 162 deducida del primer experimento)','2023-24 ohiko deialdian bezala (Kc ≈ 162, lehen esperimentutik ateratakoa)')},
  feo:{eq:'FeO(s) + CO ⇌ Fe(s) + CO₂',sp:[['FeO',-1,'s'],['CO',-1,'g'],['Fe',1,'s'],['CO2',1,'g']],T:1273,K:0.403,type:'p',dH:-11,n0:[0.42,0.2,0,0],inert:0.8,V:60,
       src:b('Como 2020-21 extraordinaria (Kp = 0,1624 con coeficiente 2 → Kp = 0,403 con coeficiente 1)','2020-21 ez-ohiko deialdian bezala (2 koefizientearekin Kp = 0,1624 → 1 koefizientearekin Kp = 0,403)')},
  fe3o4:{eq:'Fe₃O₄(s) + 4H₂ ⇌ 3Fe(s) + 4H₂O',sp:[['Fe3O4',-1,'s'],['H2',-4,'g'],['Fe',3,'s'],['H2O',4,'g']],T:1123,K:0.22,type:'p',dH:151,n0:[3,23,0,0],inert:23,V:1000,
       src:b('Como 2022-23 extraordinaria (Kp = 0,22 a 850 °C)','2022-23 ez-ohiko deialdian bezala (Kp = 0,22, 850 °C-an)')},
};
Lab.RXS=RXS;
/* resuelve el avance ξ (mol) de equilibrio. n0: moles iniciales por especie. Devuelve {xi, n, reached, limitedBy} */
function solveRx(rx,n0,V,T,K){
  const S=rx.sp; let lo=-Infinity, hi=Infinity;
  S.forEach(([f,nu],i)=>{ const bnd=-n0[i]/nu; if(nu<0) hi=Math.min(hi,bnd); else lo=Math.max(lo,bnd); });
  if(lo>hi) return null;
  const gas=S.map((s,i)=>[s,i]).filter(([s])=>s[2]==='g');
  const dn=gas.reduce((a,[s])=>a+s[1],0);
  const conv=rx.type==='p'?ln(RG*T/V):ln(1/V);
  const f=xi=>gas.reduce((a,[s,i])=>a+s[1]*ln(Math.max(1e-300,n0[i]+s[1]*xi)),0)+dn*conv-ln(K);
  const eps=1e-12*(Math.abs(hi-lo)+1);
  const flo=f(lo+eps), fhi=f(hi-eps);
  let xi, reached=true, limitedBy=null;
  if(flo>0){ xi=lo; reached=false; limitedBy=S.find(([fm,nu],i)=>nu>0&&Math.abs(-n0[i]/nu-lo)<1e-12); }
  else if(fhi<0){ xi=hi; reached=false; limitedBy=S.find(([fm,nu],i)=>nu<0&&Math.abs(-n0[i]/nu-hi)<1e-12); }
  else xi=Lab.bisect(f,lo+eps,hi-eps);
  const n=S.map(([fm,nu],i)=>Math.max(0,n0[i]+nu*xi));
  return {xi,n,reached,limitedBy};
}
Lab.solveRx=solveRx;
const Qof=(rx,n,V,T)=>{ let q=1; rx.sp.forEach(([f,nu,ph],i)=>{ if(ph!=='g') return; const c=rx.type==='p'?n[i]*RG*T/V:n[i]/V; q*=Math.pow(Math.max(c,1e-300),nu); }); return q; };

Lab.def('reactor',(host,o)=>{
  const TX={
    rx:b('Reacción','Erreakzioa'), V:b('Volumen V','Bolumena V'), inert:b('Gas inerte (N₂/Ar)','Gas geldoa (N₂/Ar)'), n0:b('Moles iniciales','Hasierako molak'),
    sp:b('Especie','Espeziea'), ini:b('Inicial','Hasiera'), chg:b('Cambio','Aldaketa'), eq:b('Equilibrio','Oreka'), y:b('y<sub>i</sub>','y<sub>i</sub>'), P:b('P<sub>i</sub> (atm)','P<sub>i</sub> (atm)'),
    Ptot:b('P total','P totala'), conv:b('Conversión X','Konbertsioa X'), dir:b('Al empezar','Hasieran'),
    right:b('Q < K → avanza a la derecha','Q < K → eskuinera aurreratzen da'), left:b('Q > K → retrocede a la izquierda','Q > K → ezkerrera atzeratzen da'), atEq:b('Q = K → ya en equilibrio','Q = K → orekan dago jada'),
    pert:b('Perturba el equilibrio (parte del estado actual)','Oreka perturbatu (uneko egoeratik abiatuta)'),
    comp:b('Comprimir (V ÷ 2)','Konprimitu (V ÷ 2)'), exp:b('Expandir (V × 2)','Hedatu (V × 2)'), inV:b('+ inerte a V constante','+ geldoa V konstantean'), inP:b('+ inerte a P constante','+ geldoa P konstantean'),
    addR:b('+ reactivo','+ erreaktiboa'), remP:b('− retirar producto (50 %)','− produktua kendu (% 50)'), heat:b('Calentar +50 K','Berotu +50 K'), cool:b('Enfriar −50 K','Hoztu −50 K'), reset:b('↺ Reiniciar','↺ Berrabiarazi'),
    noeq:b('No se alcanza el equilibrio: se agota','Ez da oreka lortzen: agortu egiten da'), limR:b('reactivo limitante','erreaktibo mugatzailea'),
    legend:b('Barra clara rayada: moles antes · barra llena: moles en el nuevo equilibrio','Barra argi marraduna: lehengo molak · barra betea: oreka berriko molak'),
    solid:b('sólido: no entra en K','solidoa: ez da K-n sartzen'), ktxt:b('dato','datua'),
  };
  let key=o.rx||'nh3', st=null;
  function init(){ const rx=RXS[key]; st={n0:rx.n0.slice(),inert:rx.inert,V:rx.V,T:rx.T,K:rx.K,ref:rx.n0.slice(),prev:null,log:null}; }
  init();
  function limIndex(rx,ref){ let best=-1,bv=Infinity; rx.sp.forEach(([f,nu],i)=>{ if(nu<0&&ref[i]>0){ const r=ref[i]/(-nu); if(r<bv){ bv=r; best=i; } } }); return best; }
  function ctrl(){
    const rx=RXS[key], S=rx.sp, Ktxt=rx.type==='p'?'K<sub>p</sub>':'K<sub>c</sub>';
    host.innerHTML=`<div class="lab">
      <div class="ctrl"><label>${L(TX.rx)}<select data-k="rx">${Object.entries(RXS).map(([k,r])=>`<option value="${k}" ${k===key?'selected':''}>${r.eq}</option>`).join('')}</select></label>
        ${slider('lv-V',TX.V,+(Math.min(rx.V/10,st.V)).toPrecision(2),+Math.max(rx.V*4,st.V*1.5).toPrecision(2),+(rx.V/50).toPrecision(2),+st.V.toPrecision(3),'L')}</div>
      <div class="eqbox">${rx.eq}<small id="lv-k">${Ktxt} = ${num(st.K)} · T = ${Math.round(st.T)} K · ${L(rx.src)}</small></div>
      <div class="ctrl">${S.map(([f,nu,ph],i)=>{ const mx=+Math.max(1,rx.n0[i]*3,st.n0[i]*1.5).toPrecision(2); return slider('lv-n'+i,{es:'n₀ '+f,eu:'n₀ '+f},0,mx,+(mx/100).toPrecision(2),+st.n0[i].toPrecision(3),'mol'); }).join('')}
        ${(()=>{ const mx=+Math.max(1,rx.inert*3,st.inert*1.5).toPrecision(2); return slider('lv-in',TX.inert,0,mx,+(mx/100).toPrecision(2),+st.inert.toPrecision(3),'mol'); })()}</div>
      <div class="out" id="lv-out"></div>
      <b class="count">${L(TX.pert)}</b>
      <div class="btns"><button data-p="comp">${L(TX.comp)}</button><button data-p="exp">${L(TX.exp)}</button><button data-p="inV">${L(TX.inV)}</button><button data-p="inP">${L(TX.inP)}</button>
        <button data-p="addR">${L(TX.addR)}</button><button data-p="remP">${L(TX.remP)}</button><button data-p="heat">${L(TX.heat)}</button><button data-p="cool">${L(TX.cool)}</button><button data-p="reset">${L(TX.reset)}</button></div></div>`;
    update();
  }
  function update(){
    const rx=RXS[key], S=rx.sp, sol=solveRx(rx,st.n0,st.V,st.T,st.K), out=host.querySelector('#lv-out');
    const setv=(id,v,u)=>{ const el=host.querySelector('#'+id+'-v'); if(el) el.textContent=v+(u?' '+u:''); };
    setv('lv-V',+st.V.toPrecision(3),'L'); setv('lv-in',+st.inert.toPrecision(3),'mol'); S.forEach((s,i)=>setv('lv-n'+i,+st.n0[i].toPrecision(3),'mol'));
    const kel=host.querySelector('#lv-k'); if(kel) kel.innerHTML=`${rx.type==='p'?'K<sub>p</sub>':'K<sub>c</sub>'} = ${num(st.K)} · T = ${Math.round(st.T)} K · ${L(rx.src)}`;
    if(!sol){ out.innerHTML='<p>—</p>'; return; }
    const n=sol.n, gasN=S.reduce((a,s,i)=>a+(s[2]==='g'?n[i]:0),0)+st.inert, Pt=gasN*RG*st.T/st.V;
    const q0=Qof(rx,st.n0,st.V,st.T), dir=Math.abs(q0/st.K-1)<1e-3?'eq':q0<st.K?'r':'l';
    const li=limIndex(rx,st.ref), X=li>=0?Math.max(0,(st.ref[li]-n[li])/st.ref[li]):0;
    const before=st.prev||st.n0;
    const cols=S.length+1, W=420, H=240, pad=10, bw=Math.min(70,(W-pad*2)/cols*0.6), maxv=Math.max(...n,...before,st.inert,0.001)*1.15;
    const x=i=>pad+(i+0.5)*(W-pad*2)/cols, y=v=>H-30-(v/maxv)*(H-64);
    const ac=cssv('--c-oreka'), rc=cssv('--c-azido'), ic=cssv('--ink-3');
    const sub=t=>t.replace(/(\d+)/g,d=>[...d].map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join(''));
    let bars='';
    S.concat([['inert',0,'g']]).forEach((s,i)=>{
      const isIn=s[0]==='inert', v=isIn?st.inert:n[i], v0=isIn?st.inert:before[i], col=isIn?ic:(s[1]<0?rc:ac);
      bars+=`<rect x="${x(i)-bw/2}" y="${y(v0)}" width="${bw}" height="${H-30-y(v0)}" fill="url(#hatch)" stroke="${col}" stroke-opacity=".5"/>`;
      bars+=`<rect x="${x(i)-bw/2+bw*0.18}" y="${y(v)}" width="${bw*0.64}" height="${H-30-y(v)}" fill="${col}" rx="3"/>`;
      bars+=`<text x="${x(i)}" y="${y(Math.max(v,v0))-6}" text-anchor="middle" class="svgmono" font-size="15">${E.num(v,3).replace(/<sup>/g,'^').replace(/<[^>]+>/g,'')}</text>`;
      bars+=`<text x="${x(i)}" y="${H-10}" text-anchor="middle" class="svgtxt" font-size="16" font-weight="600">${isIn?'N₂/Ar':sub(s[0])}${s[2]==='s'?' (s)':''}</text>`;
    });
    const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="moles"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${cssv('--surface-2')}"/><line x1="0" y1="0" x2="0" y2="6" stroke="${cssv('--line')}" stroke-width="3"/></pattern></defs>
      <line x1="${pad}" y1="${H-30}" x2="${W-pad}" y2="${H-30}" stroke="${cssv('--line')}"/>${bars}</svg>`;
    const rows=S.map(([f,nu,ph],i)=>{ const yi=ph==='g'?n[i]/gasN:null;
      return `<tr><td>{${f}}${ph==='s'?' (s)':''}</td><td>${num(st.n0[i])}</td><td>${nu>0?'+':'−'}${Math.abs(nu)===1?'':Math.abs(nu)}ξ</td><td><b>${num(n[i])}</b></td><td>${yi==null?'—':E.fix(yi,3)}</td><td>${yi==null?L(TX.solid):num(yi*Pt)}</td></tr>`; }).join('')+
      (st.inert?`<tr><td>N₂/Ar</td><td>${num(st.inert)}</td><td>0</td><td><b>${num(st.inert)}</b></td><td>${E.fix(st.inert/gasN,3)}</td><td>${num(st.inert/gasN*Pt)}</td></tr>`:'');
    out.innerHTML=`<figure class="fig">${svg}<figcaption>${L(TX.legend)}</figcaption></figure>
      <div class="readout"><div class="stat"><b>${num(Pt)}</b><span>${L(TX.Ptot)} (atm)</span></div><div class="stat"><b>${E.fix(X*100,1)} %</b><span>${L(TX.conv)}${li>=0?' ('+sub(S[li][0])+')':''}</span></div>
        <div class="stat"><b style="font-size:15px">${L(dir==='eq'?TX.atEq:dir==='r'?TX.right:TX.left)}</b><span>${L(TX.dir)}: Q = ${num(q0)}</span></div></div>
      ${sol.reached?'':`<div class="callout c-warn"><b class="t">!</b>${L(TX.noeq)} ${R('{'+(sol.limitedBy||[''])[0]+'}')}.</div>`}
      <div class="tw"><table><thead><tr><th>${L(TX.sp)}</th><th>${L(TX.ini)}</th><th>${L(TX.chg)}</th><th>${L(TX.eq)}</th><th>${L(TX.y)}</th><th>${L(TX.P)}</th></tr></thead><tbody>${R(rows)}</tbody></table></div>
      <p class="count">ξ = ${num(sol.xi)} mol · ${L(TX.limR)}: ${li>=0?R('{'+S[li][0]+'}'):'—'}</p>
      ${st.log?`<div class="msg">${st.log}</div>`:''}`;
    st.lastEq=n; st.lastP=Pt;
  }
  function explain(kind,old){
    const rx=RXS[key], dn=rx.sp.reduce((a,s)=>a+(s[2]==='g'?s[1]:0),0);
    const q=Qof(rx,st.n0,st.V,st.T), d=Math.abs(q/st.K-1)<1e-3?0:q<st.K?1:-1;
    const dirT=d===0?b('no hay desplazamiento (Q = K)','ez dago desplazamendurik (Q = K)'):d>0?b('Q < K → se desplaza a la <b>derecha</b>','Q < K → <b>eskuinera</b> desplazatzen da'):b('Q > K → se desplaza a la <b>izquierda</b>','Q > K → <b>ezkerrera</b> desplazatzen da');
    const why={
      comp:b(`Al reducir V todas las presiones parciales se duplican. Con Δn<sub>gas</sub> = ${dn}, Q cambia por un factor 2<sup>${dn}</sup>.`,`V txikitzean presio partzial guztiak bikoizten dira. Δn<sub>gas</sub> = ${dn} denez, Q 2<sup>${dn}</sup> faktorez aldatzen da.`),
      exp:b(`Al duplicar V todas las presiones parciales se reducen a la mitad (Δn<sub>gas</sub> = ${dn}).`,`V bikoiztean presio partzial guztiak erdira jaisten dira (Δn<sub>gas</sub> = ${dn}).`),
      inV:b('A volumen constante el inerte no cambia ni n<sub>i</sub> ni V: las P<sub>i</sub> de los reactivos y productos siguen igual. Solo sube la P total.','Bolumen konstantean geldoak ez ditu n<sub>i</sub> ez V aldatzen: erreaktibo eta produktuen P<sub>i</sub> berdin geratzen dira. P totala bakarrik igotzen da.'),
      inP:b('A presión constante, el inerte obliga a aumentar V: las P<sub>i</sub> de las especies que reaccionan bajan, como en una expansión.','Presio konstantean, geldoak V handitzera behartzen du: erreakzionatzen duten espezieen P<sub>i</sub> jaisten dira, hedapen batean bezala.'),
      addR:b('Añadir un reactivo gaseoso baja Q.','Erreaktibo gaseoso bat gehitzeak Q jaisten du.'),
      remP:b('Retirar producto baja Q.','Produktua kentzeak Q jaisten du.'),
      heat:b(`Calentar cambia K (ΔH ≈ ${rx.dH} kJ, aproximado; van 't Hoff): K pasa de ${num(old)} a ${num(st.K)}.`,`Berotzeak K aldatzen du (ΔH ≈ ${rx.dH} kJ, gutxi gorabehera; van 't Hoff): K ${num(old)}-tik ${num(st.K)}-ra pasatzen da.`),
      cool:b(`Enfriar cambia K (ΔH ≈ ${rx.dH} kJ): K pasa de ${num(old)} a ${num(st.K)}.`,`Hozteak K aldatzen du (ΔH ≈ ${rx.dH} kJ): K ${num(old)}-tik ${num(st.K)}-ra pasatzen da.`),
    }[kind];
    return `${L(why)} → ${L(dirT)}.`;
  }
  host.addEventListener('input',e=>{
    const t=e.target, id=t.id; if(!id) return; const v=+t.value;
    if(id==='lv-V'){ st.V=v; } else if(id==='lv-in'){ st.inert=v; } else if(id.startsWith('lv-n')){ const i=+id.slice(4); st.n0[i]=v; st.ref[i]=v; }
    st.prev=null; st.log=null; update();
  });
  host.addEventListener('change',e=>{ if(e.target.dataset.k==='rx'){ key=e.target.value; init(); ctrl(); } });
  host.addEventListener('click',e=>{
    const p=e.target.closest('[data-p]'); if(!p) return; const k=p.dataset.p, rx=RXS[key];
    if(k==='reset'){ init(); ctrl(); return; }
    const eq=st.lastEq.slice(); st.prev=eq; st.n0=eq.slice(); let old=st.K;
    if(k==='comp') st.V/=2; else if(k==='exp') st.V*=2;
    else if(k==='inV') st.inert+=Math.max(0.5,st.inert);
    else if(k==='inP'){ const add=Math.max(0.5,st.inert); const ng=rx.sp.reduce((a,s,i)=>a+(s[2]==='g'?eq[i]:0),0)+st.inert; st.inert+=add; st.V*= (ng+add)/ng; }
    else if(k==='addR'){ const i=rx.sp.findIndex(s=>s[1]<0&&s[2]==='g'); const add=Math.max(0.2,eq[i]*0.5); st.n0[i]+=add; st.ref[i]+=add; }
    else if(k==='remP'){ rx.sp.forEach((s,i)=>{ if(s[1]>0&&s[2]==='g') st.n0[i]*=0.5; }); }
    else if(k==='heat'||k==='cool'){ const T2=st.T+(k==='heat'?50:-50); st.K=st.K*Math.exp(-rx.dH*1000/8.314*(1/T2-1/st.T)); st.T=T2; }
    st.log=explain(k,old);
    ctrl();
  });
  ctrl();
});

/* =====================================================================
   Q frente a K: barra logarítmica con la dirección del desplazamiento
   ===================================================================== */
Lab.def('qk',(host,o)=>{
  let lq=o.lq!=null?o.lq:-1, lk=o.lk!=null?o.lk:1;
  const TX={q:b('log Q','log Q'),k:b('log K','log K'),r:b('Q < K: faltan productos → la reacción avanza hacia la DERECHA (se consumen reactivos)','Q < K: produktuak falta dira → erreakzioa ESKUINERA doa (erreaktiboak kontsumitzen dira)'),
    l:b('Q > K: sobran productos → la reacción va hacia la IZQUIERDA (se forman reactivos)','Q > K: produktuak soberan → erreakzioa EZKERRERA doa (erreaktiboak sortzen dira)'),e:b('Q = K: el sistema está en equilibrio, no cambia nada','Q = K: sistema orekan dago, ez da ezer aldatzen')};
  host.innerHTML=`<div class="lab"><div class="ctrl">${slider('qk-q',TX.q,-6,6,0.1,lq)}${slider('qk-k',TX.k,-6,6,0.1,lk)}</div><div class="out"></div></div>`;
  function draw(){
    const W=420,H=130,x=v=>24+(v+6)/12*(W-48);
    host.querySelector('#qk-q-v').textContent=lq; host.querySelector('#qk-k-v').textContent=lk;
    const d=Math.abs(lq-lk)<0.05?'e':lq<lk?'r':'l';
    const ac=cssv('--accent'), qc=cssv('--c-pila');
    host.querySelector('.out').innerHTML=`<svg viewBox="0 0 ${W} ${H}"><line x1="30" y1="60" x2="${W-30}" y2="60" stroke="${cssv('--line')}" stroke-width="6" stroke-linecap="round"/>
      ${[-6,-4,-2,0,2,4,6].map(v=>`<text x="${x(v)}" y="92" text-anchor="middle" class="svgmono" font-size="13">10${v<0?'⁻':''}${String(Math.abs(v)).replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}</text>`).join('')}
      <line x1="${x(lk)}" y1="30" x2="${x(lk)}" y2="78" stroke="${ac}" stroke-width="3"/><text x="${x(lk)}" y="22" text-anchor="middle" class="svgtxt" font-weight="700" fill="${ac}">K</text>
      <circle cx="${x(lq)}" cy="60" r="10" fill="${qc}"/><text x="${x(lq)}" y="${115}" text-anchor="middle" class="svgtxt" font-weight="700">Q</text>
      ${d!=='e'?`<path d="M${x(lq)} 60 L${x(lk)+(d==='r'?-14:14)} 60" stroke="${qc}" stroke-width="3" marker-end="url(#ar)"/>`:''}
      <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${qc}"/></marker></defs></svg>
      <div class="msg">${L(TX[d])}</div>`;
  }
  host.addEventListener('input',e=>{ if(e.target.id==='qk-q') lq=+e.target.value; if(e.target.id==='qk-k') lk=+e.target.value; draw(); });
  draw();
});

g.Lab=Lab;
})(window);
