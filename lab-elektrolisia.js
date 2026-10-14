/* Laboratorios de electrólisis: escalera de potenciales y ley de Faraday. */
(function(g){
'use strict';
const E=g.Estudio, L=E.L, b=E.b, Lab=g.Lab;
const num=(x,d=3)=>E.num(x,d), cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#888';
const log10=x=>Math.log10(x);

const systems={
  nacl:{name:b('NaCl acuoso (salmuera)','NaCl urtsua (gatzun-disoluzioa)'),cl:5,na:1},
  cuso4:{name:b('CuSO₄ acuoso','CuSO₄ urtsua'),cu:.1},
  nickel:{name:b('NiSO₄ + Fe³⁺ acuoso','NiSO₄ + Fe³⁺ urtsua'),ni:.1,fe3:.1,fe2:.1},
  acid:{name:b('H₂SO₄ acuoso','H₂SO₄ urtsua')},
  molten:{name:b('NaCl fundido','NaCl urtua'),molten:true}
};
const fmtE=x=>`${x>=0?'+':''}${num(x,3)} V`;
const red=(label,eq,E0,n,Q)=>({label,eq,E:E0-0.05916/n*log10(Q),eta:'none'});

Lab.def('escalera',(host,o)=>{
  let sys=o.system||'nacl', ph=7, etaH=.35, etaO=.60, active='inert';
  const TX={sys:b('Sistema','Sistema'),ph:b('pH','pH'),h:b('Sobrepotencial H₂','H₂-ren gaintentsioa'),o:b('Sobrepotencial O₂','O₂-ren gaintentsioa'),el:b('Ánodo','Anodoa'),inert:b('Electrodo inerte','Elektrodo inertea'),cu:b('Ánodo activo de Cu','Cu-anodo aktiboa'),cat:b('Cátodo','Katodoa'),theory:b('E teórico','E teorikoa'),real:b('E con sobrepotencial','E gaintentsioarekin'),min:b('Fuente mínima ideal','Iturri idealaren gutxienekoa'),winC:b('Se reduce','Erreduzitu egiten da'),winA:b('Se oxida','Oxidatu egiten da'),axis:b('Potencial de reducción E (V)','Erredukzio-potentziala E (V)'),caption:b('Los círculos son potenciales de reducción teóricos; las flechas muestran el desplazamiento real por el sobrepotencial.','Zirkuluak erredukzio-potentzial teorikoak dira; gezien bidez gaintentsioak eragindako benetako desplazamendua erakusten da.')};
  host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(TX.sys)}<select id="el-sys">${Object.entries(systems).map(([k,v])=>`<option value="${k}" ${k===sys?'selected':''}>${L(v.name)}</option>`).join('')}</select></label><label>${L(b('Material del ánodo','Anodoaren materiala'))}<select id="el-active"><option value="inert">${L(TX.inert)}</option><option value="cu">${L(TX.cu)}</option></select></label></div><div class="ctrl">${Lab.slider('el-ph',TX.ph,0,14,.1,ph,'')}${Lab.slider('el-h',TX.h,0,.8,.01,etaH,'V')}${Lab.slider('el-o',TX.o,0,.8,.01,etaO,'V')}</div><div class="eqbox" id="el-eq"></div><div class="out" id="el-out"></div></div>`;
  function candidates(){
     const s=systems[sys]; let cath=[], an=[];
    if(s.molten){
      cath.push({label:b('Na⁺ / Na','Na⁺ / Na'),eq:'Na⁺(l) + e⁻ → Na(l)',E:-2.712,eta:'none'});
      an.push({label:b('Cl₂ / Cl⁻','Cl₂ / Cl⁻'),eq:'Cl₂(g) + 2e⁻ → 2Cl⁻(l)',E:1.358,eta:'none'});
    }else{
      if(sys==='nacl'){
        cath.push(red(b('H₂O / H₂','H₂O / H₂'),'2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)',-.828,2,Math.pow(10,2*(ph-14))));
        cath.push(red(b('Na⁺ / Na','Na⁺ / Na'),'Na⁺(aq) + e⁻ → Na(s)',-2.714,1,1));
      }
      if(sys==='cuso4'){
        cath.push(red(b('Cu²⁺ / Cu','Cu²⁺ / Cu'),'Cu²⁺(aq) + 2e⁻ → Cu(s)',.340,2,1/s.cu));
        cath.push(red(b('H₂O / H₂','H₂O / H₂'),'2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)',-.828,2,Math.pow(10,2*(ph-14))));
         an.push(red(b('O₂ / H₂O','O₂ / H₂O'),'O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)',1.229,4,Math.pow(10,4*ph)));
      }
      if(sys==='nickel'){
        cath.push(red(b('Fe³⁺ / Fe²⁺','Fe³⁺ / Fe²⁺'),'Fe³⁺(aq) + e⁻ → Fe²⁺(aq)',.771,1,s.fe2/s.fe3));
        cath.push(red(b('Ni²⁺ / Ni','Ni²⁺ / Ni'),'Ni²⁺(aq) + 2e⁻ → Ni(s)',-.230,2,1/s.ni));
        cath.push(red(b('H₂O / H₂','H₂O / H₂'),'2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)',-.828,2,Math.pow(10,2*(ph-14))));
        an.push(red(b('O₂ / H₂O','O₂ / H₂O'),'O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)',1.229,4,Math.pow(10,4*ph)));
      }
      if(sys==='acid'){
         cath.push(red(b('H⁺ / H₂','H⁺ / H₂'),'2H⁺(aq) + 2e⁻ → H₂(g)',0,2,Math.pow(10,2*ph)));
         an.push(red(b('O₂ / H₂O','O₂ / H₂O'),'O₂(g) + 4H⁺(aq) + 4e⁻ → 2H₂O(l)',1.229,4,Math.pow(10,4*ph)));
      }
      if(sys==='nacl' || sys==='acid' || sys==='cuso4' || sys==='nickel'){
        if(ph>=7){
          // Neutral/basic form of oxygen evolution has the same reversible potential.
          an=an.filter(x=>x.label.es!=='O₂ / H₂O');
          an.push(red(b('O₂ / OH⁻','O₂ / OH⁻'),'O₂(g) + 2H₂O(l) + 4e⁻ → 4OH⁻(aq)',.401,4,Math.pow(10,4*(ph-14))));
        }
        if(sys==='nacl') an.push(red(b('Cl₂ / Cl⁻','Cl₂ / Cl⁻'),'Cl₂(g) + 2e⁻ → 2Cl⁻(aq)',1.358,2,s.cl*s.cl));
        if(sys==='nacl' && ph<7){
          cath=cath.filter(x=>x.label.es!=='H₂O / H₂');
           cath.push(red(b('H⁺ / H₂','H⁺ / H₂'),'2H⁺(aq) + 2e⁻ → H₂(g)',0,2,Math.pow(10,2*ph)));
        }
      }
      if(active==='cu' && sys!=='molten') an.push(red(b('Cu²⁺ / Cu (ánodo activo)','Cu²⁺ / Cu (anodo aktiboa)'),'Cu²⁺(aq) + 2e⁻ → Cu(s)',.340,2,10));
    }
    cath=cath.map(x=>({...x,real:x.E-(x.label.es.includes('H₂')?etaH:0)}));
    an=an.map(x=>({...x,real:x.E+(x.label.es.startsWith('O₂')?etaO:0)}));
    const bestC=cath.reduce((a,x)=>x.real>a.real?x:a,cath[0]);
    const bestA=an.reduce((a,x)=>x.real<a.real?x:a,an[0]);
    return {cath,an,bestC,bestA,emin:bestA.real-bestC.real};
  }
  function draw(){
    const {cath,an,bestC,bestA,emin}=candidates(), W=420,H=330, top=46,bottom=285,lo=-3.2,hi=2.1,y=v=>bottom-(v-lo)/(hi-lo)*(bottom-top), xC=135,xA=322;
    const axis=cssv('--ink-3'), line=cssv('--line'), cC=cssv('--c-elek'), cA=cssv('--c-pila'), good=cssv('--ok'),warn=cssv('--warn');
    const marks=(arr,x,col,winner)=>arr.map((q,i)=>{const yy=y(q.E), yr=y(q.real), selected=q===winner;const off=i%2?20:-20;
      return `<line x1="${x}" y1="${yy}" x2="${x}" y2="${yr}" stroke="${selected?good:col}" stroke-width="2.5" marker-end="url(#ep-${x})"/><circle cx="${x}" cy="${yy}" r="5.5" fill="${col}"/><circle cx="${x}" cy="${yr}" r="${selected?8:5}" fill="${selected?good:col}"/><text x="${x+off}" y="${yr-7}" text-anchor="${off>0?'start':'end'}" class="svgtxt" font-size="13" font-weight="${selected?'700':'400'}">${E.L(q.label)} ${selected?'★':''}</text>`;}).join('');
    const ticks=[];for(let v=-3;v<=2;v+=1)ticks.push(`<line x1="48" y1="${y(v)}" x2="380" y2="${y(v)}" stroke="${line}" stroke-dasharray="3 5"/><text x="40" y="${y(v)+4}" text-anchor="end" class="svgmono" font-size="12">${v.toFixed(0)}</text>`);
    const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${E.L(b('Escalera de potenciales','Potentzialen eskailera'))}"><defs><marker id="ep-${xC}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${cC}"/></marker><marker id="ep-${xA}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${cA}"/></marker></defs>${ticks.join('')}<line x1="48" y1="${top}" x2="48" y2="${bottom}" stroke="${axis}" stroke-width="1.5"/><text x="49" y="24" class="svgtxt" font-size="13">${L(TX.axis)}</text><text x="${xC}" y="${bottom+24}" text-anchor="middle" class="svgtxt" font-size="15" font-weight="700">${L(TX.cat)}</text><text x="${xA}" y="${bottom+24}" text-anchor="middle" class="svgtxt" font-size="15" font-weight="700">${L(TX.el)}</text>${marks(cath,xC,cC,bestC)}${marks(an,xA,cA,bestA)}</svg>`;
     host.querySelector('#el-eq').innerHTML=`<div>${L(systems[sys].name)}</div><small>${L(b('Se comparan los E de reducción; en el ánodo gana el menor E ajustado.','Erredukzio-E-ak alderatzen dira; anodoan E doitu txikiena gailentzen da.'))}</small>`;
    host.querySelector('#el-out').innerHTML=`<figure class="fig">${svg}<figcaption>${L(TX.caption)}</figcaption></figure><div class="readout"><div class="stat"><b>${E.L(bestC.label)}</b><span>${L(TX.winC)} · ${fmtE(bestC.real)}</span></div><div class="stat"><b>${E.L(bestA.label)}</b><span>${L(TX.winA)} · ${fmtE(bestA.real)}</span></div><div class="stat"><b>${num(Math.max(0,emin))} V</b><span>${L(TX.min)} = E<sub>ánodo,real</sub> − E<sub>cátodo,real</sub></span></div></div><p class="muted">${L(b(`E<sub>mín</sub> = ${fmtE(bestA.real)} − (${fmtE(bestC.real)}) = ${num(emin)} V. En la idealización termodinámica una fuente con este voltaje iguala los potenciales; en la práctica se necesita superar pérdidas óhmicas y cinéticas.`, `E<sub>min</sub> = ${fmtE(bestA.real)} − (${fmtE(bestC.real)}) = ${num(emin)} V. Idealizazio termodinamikoan tentsio horrek potentzialak berdintzen ditu; praktikan erresistentzia ohmikoak eta zinetikoak gainditu behar dira.`))}</p>`;
    for(const [id,v,u] of [['el-ph',ph,''],['el-h',etaH,'V'],['el-o',etaO,'V']]){const el=host.querySelector('#'+id+'-v');if(el)el.textContent=`${v}${u?' '+u:''}`;}
  }
  host.addEventListener('input',e=>{const id=e.target.id;if(id==='el-ph')ph=+e.target.value;else if(id==='el-h')etaH=+e.target.value;else if(id==='el-o')etaO=+e.target.value;else return;draw();});
  host.addEventListener('change',e=>{if(e.target.id==='el-sys')sys=e.target.value;else if(e.target.id==='el-active')active=e.target.value;else return;draw();});
  draw();
});

Lab.def('faraday',(host,o)=>{
  const species={
    Cu:{label:b('Cu²⁺ → Cu(s)','Cu²⁺ → Cu(s)'),eq:'Cu²⁺ + 2e⁻ → Cu',e:2,coef:1,M:63.546},
    Ni:{label:b('Ni²⁺ → Ni(s)','Ni²⁺ → Ni(s)'),eq:'Ni²⁺ + 2e⁻ → Ni',e:2,coef:1,M:58.693},
    Ag:{label:b('Ag⁺ → Ag(s)','Ag⁺ → Ag(s)'),eq:'Ag⁺ + e⁻ → Ag',e:1,coef:1,M:107.868},
    Al:{label:b('Al³⁺ → Al(s)','Al³⁺ → Al(s)'),eq:'Al³⁺ + 3e⁻ → Al',e:3,coef:1,M:26.982},
    H2:{label:b('H₂(g)','H₂(g)'),eq:'2H⁺ + 2e⁻ → H₂',e:2,coef:1,M:2.016,gas:true},
    O2:{label:b('O₂(g)','O₂(g)'),eq:'2H₂O → O₂ + 4H⁺ + 4e⁻',e:4,coef:1,M:31.998,gas:true},
    Cl2:{label:b('Cl₂(g)','Cl₂(g)'),eq:'2Cl⁻ → Cl₂ + 2e⁻',e:2,coef:1,M:70.90,gas:true}
  };
   let selected=o.sp||'Cu', I=2,tmin=60,T=298.15,P=1,Ecell=2;
   const TX={sp:b('Producto','Produktua'),i:b('Intensidad','Intentsitatea'),t:b('Tiempo','Denbora'),temp:b('Temperatura','Tenperatura'),pres:b('Presión del gas','Gasaren presioa'),voltage:b('Tensión de la celda','Zelularen tentsioa'),q:b('Carga eléctrica','Karga elektrikoa'),ne:b('Moles de electrones','Elektroi-molak'),np:b('Moles de producto','Produktu-molak'),mass:b('Masa depositada','Metatutako masa'),vol:b('Volumen de gas','Gas-bolumena'),flow:b('Cadena de cálculo en directo','Zuzeneko kalkulu-katea'),rx:b('Semirreacción elegida','Hautatutako erdi-erreakzioa'),f:b('Constante de Faraday F = 96 485 C·mol⁻¹','Faradayren konstantea F = 96 485 C·mol⁻¹'),energy:b('Energía y potencia suponiendo tensión constante.','Energia eta potentzia, tentsio konstantea dela suposatuz.')};
   host.innerHTML=`<div class="lab"><div class="ctrl"><label>${L(TX.sp)}<select id="fa-sp">${Object.entries(species).map(([k,v])=>`<option value="${k}" ${k===selected?'selected':''}>${L(v.label)}</option>`).join('')}</select></label>${Lab.slider('fa-i',TX.i,.1,20,.1,I,'A')}${Lab.slider('fa-t',TX.t,1,1440,1,tmin,'min')}</div><div class="ctrl">${Lab.slider('fa-T',TX.temp,273,373,1,T,'K')}${Lab.slider('fa-P',TX.pres,.2,5,.1,P,'atm')}${Lab.slider('fa-E',TX.voltage,.1,10,.1,Ecell,'V')}</div><div class="eqbox" id="fa-eq"></div><div class="out" id="fa-out"></div></div>`;
  function draw(){
     const s=species[selected], Q=I*tmin*60, ne=Q/96485, np=ne*s.coef/s.e, mass=np*s.M, volume=s.gas?np*.082057*T/P:null, energy=Q*Ecell, power=energy/(tmin*60);
     const cols=[cssv('--c-elek'),cssv('--c-pila'),cssv('--accent'),cssv('--ok')], W=420,H=205;
     const sup={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','−':'⁻','-':'⁻'};
     const svgNum=x=>num(x).replace(/×10<sup>(.*?)<\/sup>/g,(_,p)=>'×10'+[...p].map(c=>sup[c]||c).join(''));
     const vals=[svgNum(I),svgNum(Q),svgNum(ne),svgNum(np)];
     const pos=[[10,30],[225,30],[225,112],[10,112]], lbl=['I (A)','Q (C) · It','n(e⁻) · Q/F','n(prod) · n(e⁻)p/e'];
     const nodes=vals.map((v,i)=>{const [x,y]=pos[i];return `<rect x="${x}" y="${y}" width="185" height="60" rx="10" fill="var(--surface)" stroke="${cols[i]}" stroke-width="2"/><text x="${x+92.5}" y="${y+26}" text-anchor="middle" class="svgtxt" font-size="16" font-weight="700">${v}</text><text x="${x+92.5}" y="${y+47}" text-anchor="middle" class="svgmono" font-size="13">${lbl[i]}</text>`;}).join('');
     const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${E.L(TX.flow)}"><defs><marker id="far-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="${cssv('--ink-3')}"/></marker></defs>${nodes}<path d="M195 60h26M317 91v17M225 142h-23" fill="none" stroke="${cssv('--ink-3')}" stroke-width="2" marker-end="url(#far-a)"/><text x="210" y="197" text-anchor="middle" class="svgtxt" font-size="14">${s.gas?`${L(TX.vol)} = nRT/P`:`${L(TX.mass)} = n·M`}</text></svg>`;
    host.querySelector('#fa-eq').innerHTML=`${L(TX.rx)}: <b>${s.eq}</b><small>${L(TX.f)}</small>`;
     host.querySelector('#fa-out').innerHTML=`<p class="count">${L(TX.flow)}</p><figure class="fig">${svg}</figure><div class="readout"><div class="stat"><b>${num(Q)} C</b><span>${L(TX.q)} = I·t</span></div><div class="stat"><b>${num(ne)} mol</b><span>${L(TX.ne)} = Q/F</span></div><div class="stat"><b>${num(np)} mol</b><span>${L(TX.np)} (${selected})</span></div>${s.gas?`<div class="stat"><b>${num(volume)} L</b><span>${L(TX.vol)} a ${num(T,4)} K, ${num(P,3)} atm</span></div>`:`<div class="stat"><b>${num(mass)} g</b><span>${L(TX.mass)} (${num(s.M,5)} g/mol)</span></div>`}<div class="stat"><b>${num(energy/1000)} kJ</b><span>W = Q·E (${num(Ecell,3)} V)</span></div><div class="stat"><b>${num(power)} W</b><span>P = W/t = I·E</span></div></div><p class="muted">${L(b('Hipótesis: rendimiento farádico del 100 %, corriente y tensión constantes; gas ideal y presión parcial fijada por el control.','Suposizioak: % 100eko Faraday-errendimendua, korronte eta tentsio konstanteak; gas ideala eta kontrolak ezarritako presio partziala.'))}</p>`;
     for(const [id,v,u] of [['fa-i',I,'A'],['fa-t',tmin,'min'],['fa-T',T,'K'],['fa-P',P,'atm'],['fa-E',Ecell,'V']]){const el=host.querySelector('#'+id+'-v');if(el)el.textContent=`${v}${u?' '+u:''}`;}
  }
   host.addEventListener('input',e=>{const id=e.target.id;if(id==='fa-i')I=+e.target.value;else if(id==='fa-t')tmin=+e.target.value;else if(id==='fa-T')T=+e.target.value;else if(id==='fa-P')P=+e.target.value;else if(id==='fa-E')Ecell=+e.target.value;else return;draw();});
  host.addEventListener('change',e=>{if(e.target.id==='fa-sp'){selected=e.target.value;draw();}});
  draw();
});
})(window);
