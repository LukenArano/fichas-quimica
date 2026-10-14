/* Laboratorios de equilibrio de solubilidad. */
(function(g){
'use strict';
const E=g.Estudio,b=E.b,L=E.L,Lab=g.Lab;
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
const num=(x,d=3)=>E.num(x,d);
const pow10=x=>Math.pow(10,x);
const fitRanges=host=>host.querySelectorAll('.lab input[type="range"]').forEach(el=>{el.style.width='calc(100% - 4px)';el.style.maxWidth='100%';});

/* Precipitación fraccionada de dos hidróxidos divalentes. */
Lab.def('fraccionada',(host,o)=>{
  const salts=[{name:'Co²⁺ / Co(OH)₂',k:5.9e-15,mw:93,col:'--c-azido'},
    {name:'Mn²⁺ / Mn(OH)₂',k:1.9e-13,mw:89,col:'--c-oreka'}];
  const c0=1e-4,V=1000;
  host.innerHTML=`<div class="lab"><div class="ctrl">${Lab.slider('frac-log',b('[OH⁻] añadido (escala logarítmica)','Gehitutako [OH⁻] (eskala logaritmikoa)'),-8,-2,0.02,-5.1,'')}</div><div class="out" id="frac-out"></div></div>`;
  fitRanges(host);
  function draw(){
    const lg=+host.querySelector('#frac-log').value, oh=pow10(lg);
    host.querySelector('#frac-log-v').textContent=`${num(oh)} M`;
    const remaining=salts.map(s=>Math.min(c0,s.k/(oh*oh)));
    const starts=salts.map(s=>Math.sqrt(s.k/c0));
    const ppt=remaining.map(x=>Math.max(0,c0-x));
    const first=Math.min(...starts), second=Math.max(...starts);
    const maxPure=Math.max(0,c0-salts[0].k/(second*second))*V*salts[0].mw;
    const W=420,H=244,x0=48,y0=188,ww=350,hh=150;
    const xlog=x=>x0+(x+8)/6*ww, ylog=c=>y0-((Math.log10(Math.max(c,1e-9))+9)/5)*hh;
    const curves=salts.map((s,si)=>{
      let d=''; for(let j=0;j<=100;j++){const x=-8+j*0.06, ohx=pow10(x), c=Math.min(c0,s.k/(ohx*ohx)); d+=(j?'L':'M')+xlog(x).toFixed(1)+' '+ylog(c).toFixed(1)+' ';}
      return `<path d="${d}" fill="none" stroke="${cssv(s.col)}" stroke-width="3"/>`;
    }).join('');
    const marks=starts.map((x,i)=>`<line x1="${xlog(Math.log10(x))}" y1="30" x2="${xlog(Math.log10(x))}" y2="${y0}" stroke="${cssv(salts[i].col)}" stroke-dasharray="5 4"/><text x="${xlog(Math.log10(x))}" y="${i===0?24:12}" text-anchor="middle" class="svgtxt" font-size="13">${i===0?'Co':'Mn'} ${L(b('inicio','hasiera'))}</text>`).join('');
    const nowX=xlog(lg), points=remaining.map((c,i)=>`<circle cx="${nowX}" cy="${ylog(c)}" r="5" fill="${cssv(salts[i].col)}"/>`).join('');
    const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kontzentrazioa OH-rekin"><line x1="${x0}" y1="${y0}" x2="${W-15}" y2="${y0}" stroke="var(--ink-3)"/><line x1="${x0}" y1="30" x2="${x0}" y2="${y0}" stroke="var(--ink-3)"/>${[-8,-6,-4,-2].map(x=>`<text x="${xlog(x)}" y="210" text-anchor="middle" class="svgmono" font-size="13">10${String(x).replace('-','⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}</text>`).join('')}<text x="405" y="234" text-anchor="end" class="svgtxt" font-size="13">[OH⁻] (M)</text><text x="4" y="22" class="svgmono" font-size="13">log[M]</text>${curves}${marks}<line x1="${nowX}" y1="30" x2="${nowX}" y2="${y0}" stroke="var(--accent)" stroke-width="2"/>${points}</svg>`;
    const statusEs=oh<first?'Aún no precipita ningún hidróxido.':oh<second?'Precipita Co(OH)₂ puro.':'Precipitan ambos hidróxidos.';
    const statusEu=oh<first?'Oraindik ez da hidroxidorik hauspeatzen.':oh<second?'Co(OH)₂ purua hauspeatzen ari da.':'Bi hidroxidoak hauspeatzen ari dira.';
    host.querySelector('#frac-out').innerHTML=`<figure class="fig">${svg}<figcaption>${L(b('Log de la concentración de catión que permanece disuelto frente a [OH⁻]. Líneas discontinuas: comienzo de precipitación.','Disolbatuta geratzen den katioiaren kontzentrazioaren logaritmoa [OH⁻]-ren aurrean. Marra etenak: hauspeatzen hasteko unea.'))}</figcaption></figure><div class="readout"><div class="stat"><b>${num(starts[0])} M</b><span>${L(b('Inicio Co(OH)₂','Co(OH)₂-ren hasiera'))}</span></div><div class="stat"><b>${num(starts[1])} M</b><span>${L(b('Inicio Mn(OH)₂','Mn(OH)₂-ren hasiera'))}</span></div></div><p>${L(b(statusEs,statusEu))}</p><div class="tw"><table><thead><tr><th>${L(b('Especie','Espeziea'))}</th><th>${L(b('Queda (M)','Geratzen da (M)'))}</th><th>${L(b('Precipitado (%)','Hauspeatua (%)'))}</th></tr></thead><tbody>${salts.map((s,i)=>{const pct=E.fix(ppt[i]/c0*100,2);return `<tr><td>${s.name}</td><td>${num(remaining[i])}</td><td>${L(b(pct+' %','% '+pct))}</td></tr>`;}).join('')}</tbody></table></div><p class="count">${L(b('Máximo precipitado puro de Co(OH)₂ antes de que empiece Mn(OH)₂','Mn(OH)₂ hasi aurretik lor daitekeen Co(OH)₂ hauspeakin puruaren gehienekoa'))}: ${E.fix(maxPure,2)} g</p>`;
  }
  host.addEventListener('input',e=>{if(e.target.id==='frac-log')draw();}); draw();
});

/* Solubilidad de un hidróxido y pH de precipitación. */
Lab.def('solpH',(host,o)=>{
  const initN=o.n||2, initK=o.logKps||-11, initC=o.logC||-3;
  host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(b('Estequiometría n en M(OH)ₙ','n estekiometrikoa M(OH)ₙ-n'))}<select id="sp-n"><option value="1">n = 1</option><option value="2" selected>n = 2</option><option value="3">n = 3</option></select></label>${Lab.slider('sp-k',b('log₁₀ Kps','log₁₀ Kps'),-36,-4,0.1,initK,'')}${Lab.slider('sp-c',b('log₁₀ concentración inicial del catión','katioiaren hasierako kontzentrazioaren log₁₀'),-8,0,0.05,initC,'M')}${Lab.slider('sp-ph',b('pH','pH'),0,14,0.05,7,'')}</div><div class="out" id="sp-out"></div></div>`;
  fitRanges(host);
  host.querySelector('#sp-n').value=initN;
  function draw(){
    const n=+host.querySelector('#sp-n').value, lk=+host.querySelector('#sp-k').value, lc=+host.querySelector('#sp-c').value, ph=+host.querySelector('#sp-ph').value;
    const k=pow10(lk), c=pow10(lc), oh=pow10(ph-14), s=k/pow10((ph-14)*n), pHstart=14+(lk-lc)/n;
    host.querySelector('#sp-k-v').textContent=E.fix(lk,1);host.querySelector('#sp-c-v').textContent=`${E.fix(lc,2)} M`;host.querySelector('#sp-ph-v').textContent=E.fix(ph,2);
    let path=''; for(let i=0;i<=100;i++){const p=i*0.14, ss=Math.min(1e3,k/pow10((p-14)*n));const x=45+p/14*350,y=184-(Math.max(-12,Math.min(3,Math.log10(ss)))+12)/15*145;path+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}
    const x=45+ph/14*350, y=184-(Math.max(-12,Math.min(3,Math.log10(Math.min(1e3,s))))+12)/15*145;
    const svg=`<svg viewBox="0 0 420 232" role="img" aria-label="s versus pH"><line x1="45" y1="184" x2="400" y2="184" stroke="var(--ink-3)"/><line x1="45" y1="30" x2="45" y2="184" stroke="var(--ink-3)"/><path d="${path}" fill="none" stroke="var(--c-hausp)" stroke-width="3"/>${[0,2,4,6,8,10,12,14].map(p=>`<text x="${45+p/14*350}" y="205" text-anchor="middle" class="svgmono" font-size="13">${p}</text>`).join('')}<text x="400" y="226" text-anchor="end" class="svgtxt" font-size="13">pH</text><text x="4" y="22" class="svgmono" font-size="13">log s</text><circle cx="${x}" cy="${y}" r="6" fill="var(--accent)"/><line x1="${x}" y1="${y}" x2="${x}" y2="184" stroke="var(--accent)" stroke-dasharray="4 4"/></svg>`;
    host.querySelector('#sp-out').innerHTML=`<figure class="fig">${svg}<figcaption>${L(b('Curva de solubilidad molar s frente a pH; el punto marca las condiciones seleccionadas.','Disolbagarritasun molarraren s kurba pH-aren arabera; puntuak hautatutako baldintzak adierazten ditu.'))}</figcaption></figure><div class="eqbox">${L(b('M(OH)ₙ(s) ⇌ Mⁿ⁺ + n OH⁻','M(OH)ₙ(s) ⇌ Mⁿ⁺ + n OH⁻'))} · Kps = [Mⁿ⁺][OH⁻]ⁿ</div><div class="readout"><div class="stat"><b>${num(s)} M</b><span>${L(b('s = Kps/[OH⁻]ⁿ','s = Kps/[OH⁻]ⁿ'))}</span></div><div class="stat"><b>${E.fix(pHstart,2)}</b><span>${L(b('pH de inicio para la concentración elegida','Hautatutako kontzentrazioan hauspeatzen hasteko pH-a'))}</span></div></div><p>${L(b(`A pH ${E.fix(ph,2)}: [OH⁻] = ${num(oh)} M; s = ${num(k)}/${num(oh)}<sup>${n}</sup> = ${num(s)} M.`,`${E.fix(ph,2)} pH-an: [OH⁻] = ${num(oh)} M; s = ${num(k)}/${num(oh)}<sup>${n}</sup> = ${num(s)} M.`))} ${L(b(`El catión empieza a precipitar cuando pH supera ${E.fix(pHstart,2)} (para [M]₀ = ${num(c)} M).`,`Katioia ${E.fix(pHstart,2)} pH-tik gora hauspeatzen hasten da ([M]₀ = ${num(c)} M denean).`))}</p>`;
  }
  host.addEventListener('input',e=>{if(e.target.id.startsWith('sp-'))draw();});host.addEventListener('change',e=>{if(e.target.id==='sp-n')draw();}); draw();
});

/* Mezcla con precipitación de A_aB_b: se resuelve el avance por bisección. */
Lab.def('vaso',(host,o)=>{
  const cfg={va:50,vb:50,ca:0.01,cb:0.01,lk:-8,a:1,bb:1};
  host.innerHTML=`<div class="lab"><div class="ctrl">${Lab.slider('be-va',b('Volumen disolución A','A disoluzioaren bolumena'),10,200,1,cfg.va,'mL')}${Lab.slider('be-vb',b('Volumen disolución B','B disoluzioaren bolumena'),10,200,1,cfg.vb,'mL')}${Lab.slider('be-ca',b('[A] inicial','Hasierako [A]'),0.001,0.1,0.001,cfg.ca,'M')}${Lab.slider('be-cb',b('[B] inicial','Hasierako [B]'),0.001,0.1,0.001,cfg.cb,'M')}${Lab.slider('be-k',b('log₁₀ Kps','log₁₀ Kps'),-14,-2,0.1,cfg.lk,'')}</div><div class="ctrl"><label>${L(b('Coeficiente a de AₐBᵦ','AₐBᵦ-ko A-ren a koefizientea'))}<select id="be-a"><option>1</option><option>2</option><option>3</option></select></label><label>${L(b('Coeficiente b de AₐBᵦ','AₐBᵦ-ko B-ren b koefizientea'))}<select id="be-b"><option>1</option><option>2</option><option>3</option></select></label></div><div class="out" id="be-out"></div></div>`;
  fitRanges(host);
  function draw(){
    const get=id=>+host.querySelector('#'+id).value; Object.assign(cfg,{va:get('be-va'),vb:get('be-vb'),ca:get('be-ca'),cb:get('be-cb'),lk:get('be-k'),a:get('be-a'),bb:get('be-b')});
    ['be-va','be-vb','be-ca','be-cb'].forEach(id=>{const u=id.endsWith('v')?'mL':'M';});
    host.querySelector('#be-va-v').textContent=cfg.va+' mL';host.querySelector('#be-vb-v').textContent=cfg.vb+' mL';host.querySelector('#be-ca-v').textContent=E.fix(cfg.ca,3)+' M';host.querySelector('#be-cb-v').textContent=E.fix(cfg.cb,3)+' M';host.querySelector('#be-k-v').textContent=E.fix(cfg.lk,1);
    const V=(cfg.va+cfg.vb)/1000, nA=cfg.ca*cfg.va/1000,nB=cfg.cb*cfg.vb/1000,K=pow10(cfg.lk);
    const Q0=Math.pow(nA/V,cfg.a)*Math.pow(nB/V,cfg.bb);
    const xmax=Math.min(nA/cfg.a,nB/cfg.bb); let xprec=0;
    if(Q0>K){let lo=0,hi=xmax*(1-1e-12);for(let i=0;i<160;i++){const mid=(lo+hi)/2,qa=Math.max(1e-300,(nA-cfg.a*mid)/V),qb=Math.max(1e-300,(nB-cfg.bb*mid)/V),q=Math.pow(qa,cfg.a)*Math.pow(qb,cfg.bb);if(q>K)lo=mid;else hi=mid;}xprec=(lo+hi)/2;}
    const af=(nA-cfg.a*xprec)/V,bf=(nB-cfg.bb*xprec)/V,Qf=Math.pow(af,cfg.a)*Math.pow(bf,cfg.bb);
    const svg=`<svg viewBox="0 0 420 190" role="img" aria-label="Prezipitatua duen ontzia"><path d="M125 25 L145 165 Q210 178 275 165 L295 25" fill="var(--surface-2)" stroke="var(--ink-3)" stroke-width="3"/><path d="M139 100 L151 160 Q210 171 269 160 L281 100 Z" fill="var(--c-oinarri)" opacity=".25"/><path d="M151 148 Q210 141 269 148 L267 161 Q210 173 153 161 Z" fill="var(--c-hausp)"/><text x="210" y="78" text-anchor="middle" class="svgtxt" font-size="17">${L(b('disoluzioa','disoluzioa'))}</text><text x="210" y="158" text-anchor="middle" class="svgtxt" font-size="13">${xprec?L(b('hauspeakina','hauspeakina')):L(b('solidorik ez','solidurik ez'))}</text></svg>`;
    host.querySelector('#be-out').innerHTML=`<figure class="fig">${svg}<figcaption>${L(b('Volumen final = suma de volúmenes; concentración inicial después de mezclar = moles/volumen total.','Azken bolumena bolumenen batura da; nahastu ondoko hasierako kontzentrazioa = molak/bolumen osoa.'))}</figcaption></figure><div class="readout"><div class="stat"><b>${num(Q0)}</b><span>Qps ${L(b('antes de precipitar','hauspeatu aurretik'))}</span></div><div class="stat"><b>${num(K)}</b><span>Kps</span></div><div class="stat"><b>${E.fix(xprec*1000,4)} mmol</b><span>${L(b('avance precipitado','hauspeatutako aurrerapena'))}</span></div></div><p class="msg">${Q0<K?'Qps < Kps: '+L(b('no precipita.','ez da hauspeatzen.')):Q0===K?'Qps = Kps: '+L(b('disolución justo saturada.','disoluzioa ase dago.')):'Qps > Kps: '+L(b('precipita hasta alcanzar el equilibrio.','orekara iritsi arte hauspeatzen da.'))} ${L(b('Tras el equilibrio','Oreka ondoren'))}: [A] = ${num(af)} M; [B] = ${num(bf)} M; Qps = ${num(Qf)}.</p><p class="count">${L(b('Kps se define para','Kps honela definitzen da'))} A<sub>${cfg.a}</sub>B<sub>${cfg.bb}</sub>(s) ⇌ ${cfg.a}A + ${cfg.bb}B; ${L(b('moles de sólido','solidoaren molak'))} = ξ = ${num(xprec)} mol.</p>`;
  }
  host.addEventListener('input',e=>{if(e.target.id.startsWith('be-'))draw();});host.addEventListener('change',e=>{if(e.target.id==='be-a'||e.target.id==='be-b')draw();});draw();
});
})(window);
