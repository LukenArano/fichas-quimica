/* Laborategi bisualak: azido diprotikoen espezie-banaketa eta azido/Base balorazioa. */
(function(g){
'use strict';
const Lab=g.Lab,E=g.Estudio,b=(eu,es)=>E.b(es,eu),L=E.L,num=E.num;
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'var(--accent)';
const slider=Lab.slider;
const fmt=x=>Number(x).toLocaleString(E.lang()==='eu'?'eu-ES':'es-ES',{maximumFractionDigits:3});

/* α(H2A), α(HA−), α(A2−), en pH y pKa variables. */
const alpha=(ph,pka1,pka2)=>{
 const h=10**(-ph),k1=10**(-pka1),k2=10**(-pka2),d=h*h+k1*h+k1*k2;
 return [h*h/d,k1*h/d,k1*k2/d];
};
Lab.def('carbonato',(host,o)=>{
 let ph=+(o.pH??7),pka1=+(o.pka1??6.301),pka2=+(o.pka2??10.301);
 const TX={
  ph:b('pH-ha','pH'),p1:b('pKa₁ (−log Ka₁)','pKa₁ (−log Ka₁)'),p2:b('pKa₂ (−log Ka₂)','pKa₂ (−log Ka₂)'),
  frac:b('Frakzio molarra','Fracción molar'),dom:b('Espezie nagusia','Especie dominante'),
  sp:[b('H₂CO₃','H₂CO₃'),b('HCO₃⁻','HCO₃⁻'),b('CO₃²⁻','CO₃²⁻')],
  lead:[b('azido karbonikoa (H₂CO₃)','ácido carbónico (H₂CO₃)'),b('bikarbonatoa (HCO₃⁻)','bicarbonato (HCO₃⁻)'),b('karbonatoa (CO₃²⁻)','carbonato (CO₃²⁻)')],
  cap:b('pKa balioak aldatuz, edozein azido diprotikoren banaketa azter dezakezu.','Al cambiar pKa puedes explorar la distribución de cualquier ácido diprótico.'),
  axes:b('Espezie-frakzioa','Fracción de especie'),cross:b('gurutzaguneak: pH=pKa','cruces: pH=pKa')
 };
 host.innerHTML=`<div class="lab"><div class="ctrl">${slider('cb-ph',TX.ph,0,14,.01,ph)}${slider('cb-pka1',TX.p1,0,12,.01,pka1)}${slider('cb-pka2',TX.p2,1,14,.01,pka2)}</div><div class="out" id="cb-out"></div></div>`;
 const out=host.querySelector('#cb-out');
 function draw(){
  const p1=host.querySelector('#cb-pka1'),p2=host.querySelector('#cb-pka2');
  if(+p2.value<=+p1.value){ if(document.activeElement===p2) p1.value=Math.max(0,+p2.value-.01); else p2.value=Math.min(14,+p1.value+.01); }
  ph=+host.querySelector('#cb-ph').value;pka1=+p1.value;pka2=+p2.value;
  host.querySelector('#cb-ph-v').textContent=fmt(ph);host.querySelector('#cb-pka1-v').textContent=fmt(pka1);host.querySelector('#cb-pka2-v').textContent=fmt(pka2);
  const a=alpha(ph,pka1,pka2),dom=a.indexOf(Math.max(...a));
  const W=420,H=250,x0=42,y0=205,w=360,h=174,x=p=>x0+p/14*w,y=v=>y0-v*h;
  const colors=['var(--c-azido)','var(--accent)','var(--c-pila)'];
  const curves=[0,1,2].map(j=>{let d='';for(let i=0;i<=140;i++){const p=i/10,v=alpha(p,pka1,pka2)[j];d+=(i?'L':'M')+x(p).toFixed(1)+' '+y(v).toFixed(1)+' ';}return `<path d="${d}" fill="none" stroke="${colors[j]}" stroke-width="3"/>`;}).join('');
  const pmarks=[pka1,pka2].map((v,i)=>`<line x1="${x(v)}" y1="${y0-h}" x2="${x(v)}" y2="${y0}" stroke="var(--ink-3)" stroke-dasharray="4 5"/><text x="${x(v)}" y="${y0-h-8}" text-anchor="middle" class="svgmono" font-size="13">pKa${i+1}</text>`).join('');
  const ticks=[0,.2,.4,.6,.8,1].map(v=>`<line x1="${x0-4}" y1="${y(v)}" x2="${x0+w}" y2="${y(v)}" stroke="var(--line)" stroke-width=".7"/><text x="${x0-8}" y="${y(v)+4}" text-anchor="end" class="svgmono" font-size="12">${v.toFixed(1)}</text>`).join('');
  const pts=a.map((v,i)=>`<circle cx="${x(ph)}" cy="${y(v)}" r="${i===dom?6:4}" fill="${colors[i]}" stroke="var(--surface)" stroke-width="1.5"/>`).join('');
  const legend=TX.sp.map((s,i)=>`<span style="display:inline-flex;align-items:center;gap:5px;margin:3px 10px 3px 0"><i style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${colors[i]}"></i>${L(s)} · ${fmt(a[i])}</span>`).join('');
  const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L(b('Fracciones α frente al pH','Fracciones α frente al pH'))}"><text x="12" y="20" class="svgtxt" font-size="13">α</text>${ticks}<line x1="${x0}" y1="${y0}" x2="${x0+w}" y2="${y0}" stroke="var(--ink-3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0-h}" stroke="var(--ink-3)"/>${Array.from({length:8},(_,i)=>`<text x="${x(i*2)}" y="${y0+19}" text-anchor="middle" class="svgmono" font-size="12">${i*2}</text>`).join('')}<text x="${x0+w}" y="${y0+37}" text-anchor="end" class="svgtxt" font-size="13">pH</text>${pmarks}${curves}${pts}</svg>`;
  out.innerHTML=`<figure class="fig">${svg}<figcaption>${L(TX.cross)} · pKa₁=${fmt(pka1)}, pKa₂=${fmt(pka2)}</figcaption></figure><div class="msg"><b>${L(TX.dom)}:</b> ${L(TX.lead[dom])}</div><p class="count">${L(TX.frac)}: ${legend}</p><p class="muted">${L(TX.cap)}</p>`;
 }
 host.addEventListener('input',e=>{if(['cb-ph','cb-pka1','cb-pka2'].includes(e.target.id))draw();});
 draw();
});

/* Exact charge-balance pH for a monoprotic strong or weak acid titrated by NaOH. */
function exactPH(kind,ka,na,va,cb,vb){
 const v=va+vb,ct=na/v,naion=cb*vb/v,cl=kind==='strong'?na/v:0,kw=1e-14;
 const charge=logh=>{
  const h=10**logh,oh=kw/h,a=kind==='strong'?cl:ct*ka/(ka+h);
  return h+naion-oh-a;
 };
 let lo=-16,hi=2;
 for(let i=0;i<180;i++){const m=(lo+hi)/2;if(charge(m)>0)hi=m;else lo=m;}
 return -(lo+hi)/2;
}
Lab.def('valoracion',(host,o)=>{
 let kind=o.kind||'weak',ca=+(o.ca??.1),vaMl=+(o.va??25),cb=+(o.cb??.1),vbMl=+(o.vb??0),pka=+(o.pka??4.745);
 const TX={
  acidType:b('Azido mota','Tipo de ácido'),strong:b('Sendoa (HCl)','Fuerte (HCl)'),weak:b('Ahula (HAc)','Débil (HAc)'),
  ca:b('Azidoaren hasierako kontzentrazioa','Concentración inicial del ácido'),va:b('Azidoaren bolumena','Volumen de ácido'),cb:b('NaOH-ren kontzentrazioa','Concentración de NaOH'),vb:b('Gehitutako NaOH bolumena','Volumen de NaOH añadido'),pka:b('pKa azido ahularentzat','pKa para ácido débil'),
  pH:b('pH','pH'),eq:b('Baliokidetasuna','Equivalencia'),eqShort:b('Baliok.','Equiv.'),buffer:b('Buffer-eremua','Zona tampón'),excess:b('Base soberakina','Exceso de base'),acid:b('Azido soberakina','Exceso de ácido'),sig:b('Erreakzio esanguratsua','Reacción significativa'),
  sigAcid:b('Azido ahularen disoziazioa: HA ⇌ H⁺ + A⁻; baliokidetasun aurretik HA/A⁻ buffer-parea dago.','Disociación del ácido débil: HA ⇌ H⁺ + A⁻; antes de equivalencia coexiste el tampón HA/A⁻.'),
  sigStrong:b('H₃O⁺ + OH⁻ → 2H₂O kuantitatiboa; azido soberan dago.','H₃O⁺ + OH⁻ → 2H₂O cuantitativa; queda ácido en exceso.'),
  sigEq:b('Baliokidetasunean azidoa neutralizatu da; azido ahularen gatza bada, A⁻-ren hidrolisiak pH-a finkatzen du.','En equivalencia se ha neutralizado el ácido; si era débil, la hidrólisis de A⁻ fija el pH.'),
  sig0w:b('Oraindik ez da NaOH-rik gehitu: azido ahularen disoziazio partziala da erreakzio esanguratsua (HA ⇌ H⁺ + A⁻, K<sub>a</sub>).','Aún no se ha añadido NaOH: la reacción significativa es la disociación parcial del ácido débil (HA ⇌ H⁺ + A⁻, K<sub>a</sub>).'),
  sig0s:b('Oraindik ez da NaOH-rik gehitu: azido sendoa guztiz disoziatuta dago; [H₃O⁺] = C.','Aún no se ha añadido NaOH: el ácido fuerte está totalmente disociado; [H₃O⁺] = C.'),
  sigOH:b('NaOH soberan: OH⁻-ren neutralizazioak mugatzen du pH-a.','NaOH en exceso: el OH⁻ sobrante determina el pH.'),
  xaxis:b('Gehitutako NaOH (mL)','NaOH añadido (mL)'),yaxis:b('pH','pH'),curve:b('Balorazio-kurba','Curva de valoración'),
  legend:b('kurba zehatza (karga-balantzea)','curva exacta (balance de carga)'),equation:b('Ekuazio-doiketa: HA + OH⁻ → A⁻ + H₂O (ahula) edo H₃O⁺ + OH⁻ → 2H₂O (sendoa).','Reacciones: HA + OH⁻ → A⁻ + H₂O (débil) o H₃O⁺ + OH⁻ → 2H₂O (fuerte).')
 };
 host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(TX.acidType)} <select id="vt-kind"><option value="strong">${L(TX.strong)}</option><option value="weak">${L(TX.weak)}</option></select></label>${slider('vt-ca',TX.ca,.01,.5,.005,ca,'M')}${slider('vt-va',TX.va,10,100,1,vaMl,'mL')}${slider('vt-cb',TX.cb,.01,.5,.005,cb,'M')}${slider('vt-vb',TX.vb,0,100,1,vbMl,'mL')}${slider('vt-pka',TX.pka,2,10,.01,pka)}</div><div class="eqbox">${L(TX.equation)}</div><div class="out" id="vt-out"></div></div>`;
 host.querySelector('#vt-kind').value=kind;
 const out=host.querySelector('#vt-out');
 function draw(){
  kind=host.querySelector('#vt-kind').value;ca=+host.querySelector('#vt-ca').value;vaMl=+host.querySelector('#vt-va').value;cb=+host.querySelector('#vt-cb').value;vbMl=+host.querySelector('#vt-vb').value;pka=+host.querySelector('#vt-pka').value;
  for(const [id,v] of [['vt-ca',ca],['vt-va',vaMl],['vt-cb',cb],['vt-vb',vbMl],['vt-pka',pka]]){const lab=host.querySelector(`#${id}-v`);if(lab)lab.textContent=fmt(v)+(id.includes('ca')||id.includes('cb')?' M':id.includes('va')||id.includes('vb')?' mL':'');}
  const na=ca*vaMl/1000,eqMl=na/cb*1000,actual=exactPH(kind,10**(-pka),na,vaMl/1000,cb,vbMl/1000);
  const equal=Math.abs(vbMl-eqMl)<Math.max(.15,eqMl*.002),before=vbMl<eqMl,zone=equal?'eq':before?(kind==='weak'&&vbMl>0?'buffer':'acid'):'excess';
  const sig=zone==='eq'?TX.sigEq:zone==='excess'?TX.sigOH:zone==='buffer'?TX.sigAcid:(vbMl<=0?(kind==='weak'?TX.sig0w:TX.sig0s):TX.sigStrong);
  const W=420,H=255,x0=48,y0=218,w=355,h=186,xmax=Math.max(50,eqMl*1.65,vbMl*1.12),x=v=>x0+v/xmax*w,y=p=>y0-p/14*h;
  const pts=[];for(let i=0;i<=120;i++){const v=xmax*i/120,p=exactPH(kind,10**(-pka),na,vaMl/1000,cb,v/1000);pts.push((i?'L':'M')+x(v).toFixed(2)+' '+y(Math.max(0,Math.min(14,p))).toFixed(2));}
  const tickx=[0,eqMl/2,eqMl,xmax].filter((v,i,a)=>v>=0&&a.findIndex(q=>Math.abs(q-v)<.1)===i).map(v=>`<line x1="${x(v)}" y1="${y0}" x2="${x(v)}" y2="${y0+5}" stroke="var(--ink-3)"/><text x="${x(v)}" y="${y0+20}" text-anchor="middle" class="svgmono" font-size="12">${fmt(v)}</text>`).join('');
  const ticky=[0,2,4,6,8,10,12,14].map(p=>`<line x1="${x0}" y1="${y(p)}" x2="${x0+w}" y2="${y(p)}" stroke="var(--line)" stroke-width=".6"/><text x="${x0-7}" y="${y(p)+4}" text-anchor="end" class="svgmono" font-size="12">${p}</text>`).join('');
  const sx=cssv('--c-azido'),buf=cssv('--accent'),bx=cssv('--c-oreka');
  const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${L(TX.curve)}"><rect x="${x0}" y="${y0-h}" width="${Math.max(0,x(eqMl)-x0)}" height="${h}" fill="${kind==='weak'?buf:sx}" opacity=".07"/><rect x="${x(eqMl)}" y="${y0-h}" width="${Math.max(0,x0+w-x(eqMl))}" height="${h}" fill="${bx}" opacity=".08"/>${ticky}<line x1="${x0}" y1="${y0}" x2="${x0+w}" y2="${y0}" stroke="var(--ink-3)"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0-h}" stroke="var(--ink-3)"/>${tickx}<path d="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3"/><line x1="${x(eqMl)}" y1="${y0-h}" x2="${x(eqMl)}" y2="${y0}" stroke="var(--ink-3)" stroke-dasharray="4 4"/><circle cx="${x(vbMl)}" cy="${y(actual)}" r="6" fill="${cssv('--c-azido')}" stroke="var(--surface)" stroke-width="2"/><text x="${x0+w}" y="${y0+39}" text-anchor="end" class="svgtxt" font-size="13">${L(TX.xaxis)}</text><text x="15" y="${y0-h}" class="svgtxt" font-size="13">pH</text><text x="${x(eqMl)}" y="${y0-h+14}" text-anchor="middle" class="svgtxt" font-size="12">${L(TX.eq)}</text></svg>`;
  const zoneText=zone==='eq'?TX.eq:zone==='excess'?TX.excess:zone==='buffer'?TX.buffer:TX.acid;
  out.innerHTML=`<figure class="fig">${svg}<figcaption>${L(TX.legend)} · ${L(TX.eq)}: ${fmt(eqMl)} mL</figcaption></figure><div class="readout"><div class="stat"><b>${fmt(actual)}</b><span>${L(TX.pH)} @ ${fmt(vbMl)} mL</span></div><div class="stat"><b>${zone==='eq'?L(TX.eqShort):L(zoneText)}</b><span>${L(TX.sig)}</span></div></div><div class="msg">${L(sig)}</div>`;
 }
 host.addEventListener('input',e=>{if(e.target.id&&e.target.id.startsWith('vt-'))draw();});
 host.addEventListener('change',e=>{if(e.target.id==='vt-kind')draw();});
 draw();
});
})(window);
