/* Laborategiak: kontzentrazioak, nahaste ionikoak eta bisekzioa. */
(function(g){
'use strict';
const E=g.Estudio, L=E.L, bi=E.b, b=(eu,es)=>bi(es,eu);
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
const fmt=(x,d=3)=>E.num(x,d).replace(/<[^>]+>/g,'');
let seq=0;

/* 1 L disoluzio oinarri: solutu bakarra eta ura, eta bolumen finkoko erreferentzia. */
g.Lab.def('conc',(host,o)=>{
  const uid='oc'+(++seq), M0=+(o.M||58.44), rho0=+(o.rho||1.04);
  let M=M0,rho=rho0, mode='M';
  let total=1000*rho;
  const maxPctFor=m=>m===58.44?26.4:m===180.16?50:m===98.08?98.3:67;
  const controls=`<div class="lab"><div class="ctrl">
     <label>${L(bi('Soluto','Solutua'))}<select id="${uid}-solute"><option value="58.44" data-rho="1.04">NaCl · 58,44 g/mol</option><option value="180.16" data-rho="1.06">${L(b('glukosa','glucosa'))} · 180,16 g/mol</option><option value="98.08" data-rho="1.06">H₂SO₄ · 98,08 g/mol</option><option value="342.30" data-rho="1.10">${L(b('sakarosa','sacarosa'))} · 342,30 g/mol</option></select></label>
    ${g.Lab.slider(uid+'-rho',bi('Densidad de disolución','Disoluzioaren dentsitatea'),1.00,1.40,0.01,rho,'g/mL')}
    ${g.Lab.slider(uid+'-M',bi('Molaridad','Molaritatea'),0.05,8,0.01,1,'mol/L')}
    ${g.Lab.slider(uid+'-m',bi('Molalidad','Molalitatea'),0.05,12,0.01,1,'mol/kg')}
    ${g.Lab.slider(uid+'-w',bi('% en masa','Masa-ehunekoa'),0.5,80,0.1,5,'%')}
    ${g.Lab.slider(uid+'-x',bi('Fracción molar','Frakzio molarra'),0.001,0.8,0.001,0.02,'x')}
  </div><div class="out" id="${uid}-out"></div></div>`;
  host.innerHTML=controls;
  const MW=18.015;
  function from(which,v){
    let n;
    if(which==='M') n=v;
    else if(which==='m') n=(v*total/1000)/(1+v*M/1000);
    else if(which==='w') n=(v/100)*total/M;
    else { const a=(1-v)*MW/v; n=total/(M+a); }
    return n;
  }
  function values(n){
    const ms=n*M, water=total-ms, nw=water/MW;
     const masspct=100*ms/total;
     return {n,ms,water, molarity:n, molality:n/(water/1000), masspct, x:n/(n+nw), valid:Number.isFinite(n)&&water>0&&ms>=0&&masspct<=maxPctFor(M)+1e-8};
  }
  function lim(k){ const wmax=maxPctFor(M)/100, r=wmax*MW/(M*(1-wmax)); return {M:[.05,Math.min(8,total*wmax/M)],m:[.05,1000*wmax/(M*(1-wmax))],w:[.5,wmax*100],x:[.001,r/(1+r)]}[k]; }
  const fromClamped=(k,v)=>{ const [a,z]=lim(k); return values(from(k,Math.max(a,Math.min(z,v)))); };
  let state=values(from('M',1));
  function setLabValue(k,v,unit,d=3){ const el=host.querySelector('#'+uid+'-'+k+'-v'); if(el) el.textContent=fmt(v,d)+(unit?' '+unit:''); }
   function draw(active){
     const out=host.querySelector('#'+uid+'-out');
     const wmax=maxPctFor(M)/100, maxM=Math.min(8,total*wmax/M), maxm=1000*wmax/(M*(1-wmax)), ratio=wmax*18.015/(M*(1-wmax)), maxx=ratio/(1+ratio), limits={M:maxM,m:maxm,w:wmax*100,x:maxx};
     Object.entries(limits).forEach(([key,value])=>{const el=host.querySelector('#'+uid+'-'+key);if(el)el.max=value;});
     if(!state.valid){['rho','M','m','w','x'].forEach(key=>{const val=host.querySelector('#'+uid+'-'+key+'-v');if(val)val.textContent=L(b('ezin kalkulatu','no calculable'));});out.innerHTML=`<p class="callout c-warn">${L(b('Konbinazio hori ezinezkoa da: solutu-kantitateak ezarritako disolbagarritasuna gainditzen du edo disolbatzaile-masa nulua/negatiboa uzten du. Doitu kontrola edo aukeratu beste solutu bat.','Combinación imposible: la cantidad de soluto supera la solubilidad configurada o deja una masa de disolvente nula/negativa. Ajusta el control o elige otro soluto.'))}</p>`;return;}
    const {ms,water}=state, h=170,W=420,left=72,boxW=150,boxH=120,scale=boxH/Math.max(ms,water,1);
    const solH=Math.min(boxH,ms*scale), waterH=Math.min(boxH,water*scale), c=cssv('--accent'), wcol=cssv('--c-oinarri');
    const svg=`<svg viewBox="0 0 ${W} 210" role="img" aria-label="${L(bi('Composición de un litro de disolución','Disoluzio litro baten osaera'))}">
      <rect x="${left}" y="20" width="${boxW}" height="${boxH}" rx="8" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2"/>
      <rect x="${left+3}" y="${20+boxH-solH}" width="${boxW-6}" height="${solH}" fill="${c}" opacity=".9"/>
      <rect x="${left+3}" y="${20+boxH-solH-waterH}" width="${boxW-6}" height="${waterH}" fill="${wcol}" opacity=".75"/>
      <text x="${left+boxW+18}" y="65" class="svgtxt" font-size="16">${L(bi('soluto','solutua'))}: ${fmt(ms,3)} g</text>
      <text x="${left+boxW+18}" y="98" class="svgtxt" font-size="16">${L(bi('disolvente','disolbatzailea'))}: ${fmt(water,3)} g</text>
      <text x="${left+boxW/2}" y="165" text-anchor="middle" class="svgmono" font-size="14">1,000 L · ${fmt(total,3)} g</text></svg>`;
    out.innerHTML=`<figure class="fig">${svg}<figcaption>${L(bi('Caja proporcional: masas de soluto y agua contenidas en 1 L de disolución. Modelo binario, sin contracción de volumen adicional.','Kutxa proportzionala: disoluzio-litro batean dauden solutuaren eta uraren masak. Eredu bitarra, bolumen-uzkurdura gehigarririk gabe.'))}</figcaption></figure>
      <div class="readout"><div class="stat"><b>${fmt(state.molarity)}</b><span>M · mol/L</span></div><div class="stat"><b>${fmt(state.molality)}</b><span>m · mol/kg</span></div><div class="stat"><b>${fmt(state.masspct,3)} %</b><span>${L(b('masa','masa'))}</span></div><div class="stat"><b>${fmt(state.x,4)}</b><span>x<sub>soluto</sub></span></div></div>`;
     setLabValue('M',state.molarity,'mol/L'); setLabValue('m',state.molality,'mol/kg'); setLabValue('w',state.masspct,'%'); setLabValue('x',state.x,'x',4); setLabValue('rho',rho,'g/mL',3);
      const minmax={M:[.05,maxM],m:[.05,maxm],w:[.5,wmax*100],x:[.001,maxx]};
     [['M',state.molarity],['m',state.molality],['w',state.masspct],['x',state.x]].forEach(([key,value])=>{const el=host.querySelector('#'+uid+'-'+key);if(!el)return;el.max=minmax[key][1];el.value=Math.max(minmax[key][0],Math.min(minmax[key][1],value));});
     if(active && active!=='rho') { const el=host.querySelector('#'+uid+'-'+active); if(el) el.value=active==='M'?state.molarity:active==='m'?state.molality:active==='w'?state.masspct:state.x; }
  }
   host.querySelector('#'+uid+'-solute').addEventListener('change',e=>{M=+e.target.value;rho=+e.target.selectedOptions[0].dataset.rho;total=1000*rho;const r=host.querySelector('#'+uid+'-rho');if(r)r.value=rho;state=fromClamped(mode,+host.querySelector('#'+uid+'-'+mode).value);draw(mode);});
  host.addEventListener('input',e=>{
    const id=e.target.id, v=+e.target.value;
    if(id===uid+'-rho'){rho=v;total=1000*rho;const current=state;state=fromClamped(mode,current[mode==='M'?'molarity':mode==='m'?'molality':mode==='w'?'masspct':'x']);}
    else if(id===uid+'-M'||id===uid+'-m'||id===uid+'-w'||id===uid+'-x'){
      mode=id.slice(uid.length+1); const key=mode==='M'?'molarity':mode==='m'?'molality':mode==='w'?'masspct':'x'; state=values(from(mode,v));
    }
    draw(id===uid+'-rho'?null:mode);
  });
  draw();
});

/* Bi gatz guztiz disoziatu: NaCl(aq) + CaCl2(aq) -> Na+, Ca2+ eta Cl- ioien balantzea. */
g.Lab.def('mezcla',(host)=>{
  const uid='om'+(++seq); let v1=0.50,c1=0.40,v2=0.35,c2=0.25;
  host.innerHTML=`<div class="lab"><div class="ctrl">
    ${g.Lab.slider(uid+'-v1',b('1. ontziko bolumena','Volumen del vaso 1'),0.10,1.50,0.01,v1,'L')}
    ${g.Lab.slider(uid+'-c1',b('NaCl kontzentrazioa','Concentración de NaCl'),0.05,1.00,0.01,c1,'M')}
    ${g.Lab.slider(uid+'-v2',b('2. ontziko bolumena','Volumen del vaso 2'),0.10,1.50,0.01,v2,'L')}
    ${g.Lab.slider(uid+'-c2',b('CaCl₂ kontzentrazioa','Concentración de CaCl₂'),0.05,1.00,0.01,c2,'M')}
  </div><div class="out"></div></div>`;
  const labels=['Na⁺','Ca²⁺','Cl⁻'];
  function draw(){
    const V=v1+v2, end=[c1*v1/V,c2*v2/V,(c1*v1+2*c2*v2)/V], startA=[c1,0,c1],startB=[0,c2,2*c2],max=Math.max(...end,...startA,...startB,0.1)*1.16;
    const W=420,H=230,xs=[88,210,332],base=188,chart=130, colors=[cssv('--c-oinarri'),cssv('--c-azido'),cssv('--accent')];
    let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L(b('Kontzentrazioak nahastu aurretik eta ondoren','Concentraciones antes y después de mezclar'))}"><line x1="24" y1="${base}" x2="396" y2="${base}" stroke="var(--line)"/>`;
    labels.forEach((lab,i)=>{const ha=startA[i]/max*chart,hb=startB[i]/max*chart,hc=end[i]/max*chart,x=xs[i];
      svg+=`<rect x="${x-38}" y="${base-ha}" width="22" height="${ha}" fill="${colors[i]}" opacity=".48"/><rect x="${x-11}" y="${base-hb}" width="22" height="${hb}" fill="${colors[i]}" opacity=".72"/><rect x="${x+17}" y="${base-hc}" width="22" height="${hc}" fill="${colors[i]}" rx="3"/>
      <text x="${x+28}" y="${base-hc-6}" text-anchor="middle" class="svgmono" font-size="13">${fmt(end[i],3)}</text><text x="${x}" y="215" text-anchor="middle" class="svgtxt" font-size="16" font-weight="700">${lab}</text>`;
    });
    svg+=`<text x="18" y="22" class="svgtxt" font-size="14">${L(b('1. ontzia','Vaso 1'))} · ${L(b('2. ontzia','Vaso 2'))} · ${L(b('nahastuta','Mezcla'))}</text></svg>`;
    host.querySelector('.out').innerHTML=`<figure class="fig">${svg}<figcaption>${L(b('Barrenak: 1. ontzia (ezker), 2.a (erdikoa), nahasketa (eskuin). Bolumenak gehigarriak direla suposatzen da.','Barras: vaso 1 (izquierda), vaso 2 (centro), mezcla (derecha). Se suponen volúmenes aditivos.'))}</figcaption></figure><div class="readout">${labels.map((s,i)=>`<div class="stat"><b>${fmt(end[i])} M</b><span>[${s}] ${L(b('nahastean','en la mezcla'))}</span></div>`).join('')}</div><p class="count">V<sub>tot</sub> = ${fmt(V)} L · [Cl⁻]<sub>final</sub> = ([NaCl]V₁ + 2[CaCl₂]V₂)/V<sub>tot</sub></p>`;
    [[uid+'-v1',v1,'L'],[uid+'-v2',v2,'L'],[uid+'-c1',c1,'M'],[uid+'-c2',c2,'M']].forEach(([id,v,u])=>{const el=host.querySelector('#'+id+'-v');if(el)el.textContent=fmt(v,2)+' '+u;});
  }
  host.addEventListener('input',e=>{const id=e.target.id,v=+e.target.value;if(id===uid+'-v1')v1=v;else if(id===uid+'-v2')v2=v;else if(id===uid+'-c1')c1=v;else if(id===uid+'-c2')c2=v;draw();}); draw();
});

/* Bisection step-by-step on x² + Ka·x − Ka·C = 0; root is in [0,C]. */
g.Lab.def('bisekzioa',(host)=>{
  const uid='ob'+(++seq); let Ka=0.0018,C=0.10,lo=0,hi=C,steps=0;
   host.innerHTML=`<div class="lab"><div class="ctrl">${g.Lab.slider(uid+'-ka',b('Kₐ','Kₐ'),0.0001,0.02,0.0001,Ka,'')}${g.Lab.slider(uid+'-c',b('Hasierako kontzentrazioa C','Concentración inicial C'),0.02,0.50,0.01,C,'M')}</div><div class="btns"><button class="primary" style="background:var(--accent);color:var(--accent-ink)" data-bis="next">${L(b('Hurrengo urratsa','Siguiente paso'))}</button><button data-bis="reset">${L(b('Berrabiarazi','Reiniciar'))}</button></div><div class="out"></div></div>`;
  const f=x=>x*x+Ka*x-Ka*C;
  function reset(){lo=0;hi=C;steps=0;}
  function draw(){
    const root=(-Ka+Math.sqrt(Ka*Ka+4*Ka*C))/2, xmid=(lo+hi)/2;
    const xmin=0,xmax=C*1.08,W=420,H=225,Lp=42,Rp=12,Tp=20,Bp=42, pw=W-Lp-Rp,ph=H-Tp-Bp;
    const ys=[f(0),f(C),f(xmid),f(root)], ymin=Math.min(...ys,0),ymax=Math.max(...ys,0), pad=(ymax-ymin)*.13||1e-4;
    const Y0=ymin-pad,Y1=ymax+pad,xx=x=>Lp+(x-xmin)/(xmax-xmin)*pw,yy=y=>Tp+(Y1-y)/(Y1-Y0)*ph;
    let d='';for(let i=0;i<=64;i++){const x=xmax*i/64;d+=(i?'L':'M')+xx(x).toFixed(1)+' '+yy(f(x)).toFixed(1)+' ';}
    const out=host.querySelector('.out');
    out.innerHTML=`<figure class="fig"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="f(x) eta bisekzio-tartea"><line x1="${Lp}" y1="${yy(0)}" x2="${W-Rp}" y2="${yy(0)}" stroke="var(--ink-3)"/><line x1="${xx(xmid)}" y1="${Tp}" x2="${xx(xmid)}" y2="${H-Bp}" stroke="var(--accent)" stroke-dasharray="5 4"/><path d="${d}" fill="none" stroke="var(--c-oinarri)" stroke-width="3"/><circle cx="${xx(root)}" cy="${yy(0)}" r="5" fill="var(--ok)"/><circle cx="${xx(xmid)}" cy="${yy(f(xmid))}" r="5" fill="var(--accent)"/><text x="${xx(lo)}" y="${H-12}" text-anchor="middle" class="svgmono" font-size="13">${fmt(lo,5)}</text><text x="${xx(hi)}" y="${H-12}" text-anchor="middle" class="svgmono" font-size="13">${fmt(hi,5)}</text><text x="${xx(root)}" y="${Tp+12}" text-anchor="middle" class="svgtxt" font-size="13">${L(b('erroa','raíz'))}</text><text x="${W-Rp}" y="${H-12}" text-anchor="end" class="svgmono" font-size="14">x</text></svg><figcaption>f(x) = x² + Kₐx − KₐC</figcaption></figure><div class="readout"><div class="stat"><b>${steps}</b><span>${L(b('urrats','pasos'))}</span></div><div class="stat"><b>[${fmt(lo,5)}; ${fmt(hi,5)}]</b><span>${L(b('erro-tartea','intervalo de raíz'))}</span></div><div class="stat"><b>${fmt(root,6)} M</b><span>${L(b('erro zehatza','raíz exacta'))}</span></div></div><p class="count">x<sub>erdia</sub> = ${fmt(xmid,6)} · f(x<sub>erdia</sub>) = ${fmt(f(xmid),7)} · ${L(b('Erroa tartean dago; f-ren zeinua aztertu eta tartea erdira murriztu.','La raíz está acotada: se mira el signo de f y se reduce a la mitad el intervalo.'))}</p>`;
    const k=host.querySelector('#'+uid+'-ka-v'),c=host.querySelector('#'+uid+'-c-v');if(k)k.textContent=fmt(Ka,4);if(c)c.textContent=fmt(C,3)+' M';
  }
  host.addEventListener('input',e=>{if(e.target.id===uid+'-ka')Ka=+e.target.value;if(e.target.id===uid+'-c'){C=+e.target.value;reset();}draw();});
  host.addEventListener('click',e=>{const a=e.target.closest('[data-bis]');if(!a)return;if(a.dataset.bis==='reset')reset();else{const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m;steps++;}draw();});draw();
});
})(window);
