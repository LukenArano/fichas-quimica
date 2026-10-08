/* Contenido y generadores del módulo Equilibrio químico: ruta de 7 unidades. */
(function(g){
'use strict';
const E=g.Estudio, num=E.num, shuf=E.shuffle, pick=E.pick;
const EQ={};
const f=x=>`{${x}}`;
const L=(t,b)=>`<div class="lesson">${b}</div>`;
const eqbox=(h,s)=>`<div class="eqbox">${h}${s?`<small>${s}</small>`:''}</div>`;
const call=(t,c,b)=>`<div class="callout" style="--cc:var(--c-${c})"><b class="t">${t}</b>${b}</div>`;

/* ---------- reacciones y expresiones ---------- */
const R=(r,p,dH)=>({r,p,dH});
const RX={
  haber: R([[1,'N2','g'],[3,'H2','g']],[[2,'NH3','g']],-92),
  so3:   R([[2,'SO2','g'],[1,'O2','g']],[[2,'SO3','g']],-198),
  hi:    R([[1,'H2','g'],[1,'I2','g']],[[2,'HI','g']],-9),
  n2o4:  R([[1,'N2O4','g']],[[2,'NO2','g']],57),
  no2:   R([[2,'NO','g'],[1,'O2','g']],[[2,'NO2','g']],-114),
  pcl5:  R([[1,'PCl5','g']],[[1,'PCl3','g'],[1,'Cl2','g']],88),
  no:    R([[1,'N2','g'],[1,'O2','g']],[[2,'NO','g']],181),
  meoh:  R([[1,'CO','g'],[2,'H2','g']],[[1,'CH3OH','g']],-91),
  caco3: R([[1,'CaCO3','s']],[[1,'CaO','s'],[1,'CO2','g']],178),
  boud:  R([[1,'C','s'],[1,'CO2','g']],[[2,'CO','g']],172),
  fe:    R([[3,'Fe','s'],[4,'H2O','g']],[[1,'Fe3O4','s'],[4,'H2','g']],-151),
  nh4cl: R([[1,'NH4Cl','s']],[[1,'NH3','g'],[1,'HCl','g']],176),
  nahco3:R([[2,'NaHCO3','s']],[[1,'Na2CO3','s'],[1,'H2O','g'],[1,'CO2','g']],129),
  agcl:  R([[1,'Ag^+','aq'],[1,'Cl^-','aq']],[[1,'AgCl','s']]),
  hac:   R([[1,'CH3COOH','aq'],[1,'H2O','l']],[[1,'CH3COO^-','aq'],[1,'H3O^+','aq']]),
};
EQ.RX=RX;
const sp=([c,fm,s])=>`${c>1?c+' ':''}{${fm}}(${s})`;
const eqStr=rx=>rx.r.map(sp).join(' + ')+' ⇌ '+rx.p.map(sp).join(' + ');
EQ.eqStr=eqStr;
const gasN=l=>l.filter(x=>x[2]==='g').reduce((a,x)=>a+x[0],0);
const dn=rx=>gasN(rx.p)-gasN(rx.r);
EQ.dn=dn;

function term(fm,c,mode){
  const b='['+E.chem(fm)+']';
  if(mode==='mult') return (c>1?c+'·':'')+b;
  if(mode==='noexp'||c===1) return b;
  return b+'<sup>'+c+'</sup>';
}
const frac=(n,d)=>d?`<span class="frac"><span>${n}</span><span>${d}</span></span>`:n;
function kexpr(rx,o={}){
  const mode=o.mode||'exp', inc=s=>o.solids||s==='g'||s==='aq';
  const join=o.sum?' + ':'';
  let nu=rx.p.filter(x=>inc(x[2])).map(x=>term(x[1],x[0],mode)).join(join);
  let de=rx.r.filter(x=>inc(x[2])).map(x=>term(x[1],x[0],mode)).join(join);
  if(o.sum){ if(nu.includes('+')) nu='('+nu+')'; if(de.includes('+')) de='('+de+')'; }
  if(!nu) nu='1'; if(!de) de='';
  if(o.inv){ [nu,de]=[de||'1',nu==='1'?'':nu]; if(!de) de=''; }
  return `${o.sym||'K<sub>c</sub>'} = ${frac(nu,de)}`;
}
EQ.kexpr=kexpr;

function qKc(rx){
  rx=rx||pick([RX.haber,RX.so3,RX.hi,RX.n2o4,RX.no2,RX.pcl5,RX.caco3,RX.boud,RX.fe,RX.nh4cl,RX.nahco3,RX.agcl,RX.hac]);
  const right=kexpr(rx);
  const hasPure=rx.r.concat(rx.p).some(x=>x[2]==='s'||x[2]==='l');
  const multi=rx.r.concat(rx.p).some(x=>x[0]>1);
  let cand=[kexpr(rx,{inv:true})];
  if(hasPure) cand.push(kexpr(rx,{solids:true}));
  if(multi) cand.push(kexpr(rx,{mode:'mult'}),kexpr(rx,{mode:'noexp'}));
  cand.push(kexpr(rx,{sum:true}));
  cand=[...new Set(cand)].filter(c=>c!==right);
  const ds=shuf(cand).slice(0,3);
  let why='Productos arriba, reactivos abajo, cada concentración elevada a su coeficiente.';
  if(hasPure) why+=' Los sólidos y líquidos puros no aparecen: su concentración es constante y queda absorbida en K.';
  return {tag:'Expresión de K',q:`Escribe la expresión de ${'K<sub>c</sub>'} para: ${eqStr(rx)}`,opts:shuf([{t:right,ok:1},...ds.map(t=>({t}))]),why:why+`<div class="eqbox" style="margin-top:8px">${right}</div>`};
}
EQ.qKc=qKc;

/* ---------- Le Châtelier ---------- */
const PERT={
  addR:'añade más',remP:'retira',addP:'añade más',remR:'retira',compress:'comprime',expand:'expande',heat:'calienta',cool:'enfría',cat:'cat',inert:'inert',solid:'solid'
};
function lcShift(rx,p){
  const d=dn(rx), exo=rx.dH<0;
  switch(p.k){
    case 'addR': case 'remP': return 'R';
    case 'addP': case 'remR': return 'L';
    case 'compress': return d<0?'R':d>0?'L':'N';
    case 'expand': return d<0?'L':d>0?'R':'N';
    case 'heat': return exo?'L':'R';
    case 'cool': return exo?'R':'L';
    default: return 'N';
  }
}
EQ.lcShift=lcShift;
function genLC(){
  const rx=pick([RX.haber,RX.so3,RX.n2o4,RX.no2,RX.pcl5,RX.no,RX.meoh,RX.hi,RX.caco3]);
  const fl=rx.r.filter(x=>x[2]!=='s'), fp=rx.p.filter(x=>x[2]!=='s');
  const d=dn(rx), exo=rx.dH<0, nl=gasN(rx.r), nr=gasN(rx.p);
  const kinds=['compress','expand','heat','cool','cat','inert'];
  if(fl.length) kinds.push('addR','remR');
  if(fp.length) kinds.push('addP','remP');
  if(rx.r.some(x=>x[2]==='s')) kinds.push('solid','solid');
  const k=pick(kinds); let txt, why, sh;
  const R_='A la derecha (más productos)', L_='A la izquierda (más reactivos)', N_='No se desplaza';
  if(k==='addR'){ const x=pick(fl); txt=`Se añade más ${f(x[1])} al recipiente (T y V constantes).`; why=`Sube [${E.chem(x[1])}] → Q &lt; K → para volver a Q = K se consume ${f(x[1])}: el sistema se desplaza a la derecha.`; }
  else if(k==='remR'){ const x=pick(fl); txt=`Se retira parte del ${f(x[1])} del recipiente.`; why=`Baja [${E.chem(x[1])}] → Q &gt; K → el sistema repone reactivo: se desplaza a la izquierda.`; }
  else if(k==='addP'){ const x=pick(fp); txt=`Se añade más ${f(x[1])} al recipiente.`; why=`Sube [${E.chem(x[1])}] → Q &gt; K → el sistema consume producto: se desplaza a la izquierda.`; }
  else if(k==='remP'){ const x=pick(fp); txt=`Se va retirando ${f(x[1])} conforme se forma.`; why=`Baja [${E.chem(x[1])}] → Q &lt; K → el sistema fabrica más producto: se desplaza a la derecha. (Es la idea de extraer el producto para completar una reacción.)`; }
  else if(k==='compress'||k==='expand'){
    const c=k==='compress';
    txt=c?'Se reduce el volumen del recipiente a la mitad (T constante).':'Se duplica el volumen del recipiente (T constante).';
    why=d===0?`Gas a la izquierda: ${nl} mol; a la derecha: ${nr} mol. Es igual en los dos lados, así que cambiar el volumen no favorece a ninguno: no hay desplazamiento.`
      :`Moles de gas: izquierda ${nl}, derecha ${nr}. ${c?'Al comprimir sube la presión y el sistema la rebaja desplazándose hacia el lado con menos moles de gas':'Al expandir baja la presión y el sistema la compensa desplazándose hacia el lado con más moles de gas'}: ${lcShift(rx,{k})==='R'?'la derecha':'la izquierda'}.`;
  }
  else if(k==='heat'||k==='cool'){
    const h=k==='heat';
    txt=`Se ${h?'calienta':'enfría'} el sistema a volumen constante.`;
    why=`ΔH = ${rx.dH} kJ: la reacción directa es ${exo?'exotérmica (el calor es como un producto)':'endotérmica (el calor es como un reactivo)'}. Al ${h?'calentar':'enfriar'}, el sistema ${h?'absorbe':'repone'} calor desplazándose a la ${lcShift(rx,{k})==='R'?'derecha':'izquierda'}. Además, esta es la única perturbación que <b>cambia el valor de K</b>.`;
  }
  else if(k==='cat'){ txt='Se añade un catalizador.'; why='El catalizador acelera por igual la reacción directa y la inversa. Se llega antes al equilibrio, pero la posición y K no cambian.'; }
  else if(k==='inert'){ txt='Se añade helio (gas inerte) a volumen constante.'; why='A volumen constante las concentraciones de los reactivos y productos no cambian, así que Q sigue igual a K: no hay desplazamiento. (Distinto sería añadirlo a presión constante: el volumen aumentaría.)'; }
  else { const s=pick(rx.r.filter(x=>x[2]==='s')); txt=`Se añade más ${f(s[1])}(s) al recipiente.`; why='La concentración de un sólido puro es constante y no aparece en Q ni en K: añadir más sólido no desplaza el equilibrio.'; }
  sh=k==='cat'||k==='inert'||k==='solid'?'N':lcShift(rx,{k});
  return {tag:'Le Châtelier',q:`En el equilibrio ${eqStr(rx)} (ΔH = ${rx.dH} kJ): ${txt} ¿Hacia dónde se desplaza?`,
    opts:[{t:R_,ok:sh==='R'},{t:L_,ok:sh==='L'},{t:N_,ok:sh==='N'}],why,fixed:1};
}
EQ.genLC=genLC;

/* ---------- Q frente a K ---------- */
const QT=[
 {rx:RX.hi,K:4,sp:['H2','I2','HI'],sets:[[.5,.5,1],[.5,.5,.5],[.2,.2,.8],[1,.25,1],[.1,.4,.2],[.1,.1,.5]],Q:c=>c[2]*c[2]/(c[0]*c[1]),qe:'[HI]²/([H₂][I₂])'},
 {rx:RX.n2o4,K:.4,sp:['N2O4','NO2'],sets:[[.1,.2],[.1,.1],[.05,.2],[.5,.4],[.04,.2],[.4,.4]],Q:c=>c[1]*c[1]/c[0],qe:'[NO₂]²/[N₂O₄]'},
 {rx:R([[1,'A','g'],[1,'B','g']],[[1,'C','g']]),K:10,sp:['A','B','C'],sets:[[.2,.5,1],[.5,.5,1],[.1,.1,.5],[.4,.25,1],[.2,.2,.2],[.05,.2,.4]],Q:c=>c[2]/(c[0]*c[1]),qe:'[C]/([A][B])'},
 {rx:RX.so3,K:40,sp:['SO2','O2','SO3'],sets:[[.1,.1,.2],[.1,.1,.1],[.1,.1,.4],[.2,.5,.4],[.05,.1,.2],[.2,.1,.4]],Q:c=>c[2]*c[2]/(c[0]*c[0]*c[1]),qe:'[SO₃]²/([SO₂]²[O₂])'},
 {rx:RX.caco3,K:.04,sp:['CO2'],sets:[[.02],[.08],[.04],[.01]],Q:c=>c[0],qe:'[CO₂]'},
];
function genQ(numeric){
  const t=pick(QT), c=pick(t.sets), q=t.Q(c);
  const conc=t.sp.map((s,i)=>`[${E.chem(s)}] = ${num(c[i])} M`).join(', ');
  const eqTxt=eqStr(t.rx);
  const base=`Para ${eqTxt} a cierta T, K<sub>c</sub> = ${num(t.K)}. En un instante: ${conc}.`;
  if(numeric) return {num:1,tol:.03,tag:'Calcula Q',label:'Q',ans:q,q:base+' Calcula Q.',why:`Q = ${t.qe} = ${num(q)}. ${q<t.K?'Q &lt; K → irá hacia productos.':q>t.K?'Q &gt; K → irá hacia reactivos.':'Q = K → ya está en equilibrio.'}`};
  const eq=Math.abs(q/t.K-1)<1e-9, right=q<t.K;
  return {tag:'Q frente a K',q:base+' ¿Qué ocurrirá?',opts:[{t:'Se forman más productos (derecha)',ok:!eq&&right},{t:'Se forman más reactivos (izquierda)',ok:!eq&&!right},{t:'Ya está en equilibrio',ok:eq}],fixed:1,
    why:`Q = ${t.qe} = ${num(q)}${t.rx===RX.caco3?' (los sólidos no cuentan)':''}. Comparando con K = ${num(t.K)}: ${eq?'Q = K, el sistema está en equilibrio.':right?'Q &lt; K → hay "poco producto": la reacción avanza a la derecha.':'Q &gt; K → hay "demasiado producto": la reacción retrocede a la izquierda.'}`};
}
EQ.genQ=genQ;

/* ---------- Kp y Kc ---------- */
const KPRX=[RX.haber,RX.so3,RX.n2o4,RX.pcl5,RX.hi,RX.meoh,RX.no2];
function genDn(){
  const rx=pick(KPRX), d=dn(rx);
  const op=[...new Set([d,-d,d+1,d-1,0].filter(x=>x!==d))].slice(0,3);
  return {tag:'Δn gaseoso',q:`Calcula Δn (moles de gas de productos − reactivos) para: ${eqStr(rx)}`,opts:shuf([{t:String(d).replace('-','−'),ok:1},...op.map(x=>({t:String(x).replace('-','−')}))]),
    why:`Productos: ${gasN(rx.p)} mol gas · Reactivos: ${gasN(rx.r)} mol gas → Δn = ${gasN(rx.p)} − ${gasN(rx.r)} = <b>${d}</b>.`};
}
function genKp(){
  const rx=pick([RX.haber,RX.n2o4,RX.pcl5,RX.so3,RX.meoh]), d=dn(rx);
  const T=pick([300,400,500,600,700]), Kc=pick([0.5,2,10,0.05,25]);
  const Kp=Kc*Math.pow(0.082*T,d);
  return {num:1,tol:.04,tag:'K<sub>p</sub> a partir de K<sub>c</sub>',label:'Kp',ans:Kp,q:`Para ${eqStr(rx)}, K<sub>c</sub> = ${num(Kc)} a ${T} K. Calcula K<sub>p</sub> (R = 0,082 atm·L/(mol·K)).`,
    why:`Δn = ${gasN(rx.p)} − ${gasN(rx.r)} = ${d}.<br>K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup> = ${num(Kc)} × (0,082 × ${T})<sup>${d}</sup> = ${num(Kc)} × ${num(0.082*T)}<sup>${d}</sup> = <b>${num(Kp)}</b>`};
}

/* ---------- cálculos ICE ---------- */
function iceHI(){
  const a=pick([0.50,1.00,0.80,0.40]), s=pick([2,3,4,5]), K=s*s, x=a*s/(2+s), hi=2*x;
  return {num:1,tol:.03,tag:'Tabla ICE',label:'[HI] en M',ans:hi,q:`En un recipiente de 1,0 L hay inicialmente ${num(a)} M de ${f('H2')} y ${num(a)} M de ${f('I2')}, sin ${f('HI')}. Para ${f('H2')} + ${f('I2')} ⇌ 2 ${f('HI')}, K<sub>c</sub> = ${K}. ¿Cuánto vale [${E.chem('HI')}] en el equilibrio?`,
    why:`<b>I</b>: H₂ = ${num(a)}, I₂ = ${num(a)}, HI = 0<br><b>C</b>: −x, −x, +2x<br><b>E</b>: ${num(a)}−x, ${num(a)}−x, 2x<br>K = (2x)²/(${num(a)}−x)² = ${K} → como es un cuadrado perfecto: 2x/(${num(a)}−x) = √${K} = ${s}<br>2x = ${s}·${num(a)} − ${s}x → x = ${s}·${num(a)}/${s+2} = ${num(x)}<br>[HI] = 2x = <b>${num(hi)} M</b>`};
}
function iceN2O4(){
  const K=pick([0.4,0.2,0.1,0.5]), c=pick([0.5,1.0,0.2]);
  const x=(-K+Math.sqrt(K*K+16*K*c))/8, no2=2*x, n2o4=c-x;
  return {num:1,tol:.03,tag:'Tabla ICE (cuadrática)',label:'[NO₂] en M',ans:no2,q:`Se introduce ${num(c)} M de ${f('N2O4')} en un recipiente vacío. A cierta T: ${f('N2O4')} ⇌ 2 ${f('NO2')}, K<sub>c</sub> = ${num(K)}. Calcula [${E.chem('NO2')}] en el equilibrio.`,
    why:`<b>I</b>: N₂O₄ = ${num(c)}, NO₂ = 0 · <b>C</b>: −x, +2x · <b>E</b>: ${num(c)}−x, 2x<br>K = (2x)²/(${num(c)}−x) = ${num(K)} → 4x² + ${num(K)}x − ${num(K*c)} = 0<br>x = [−${num(K)} + √(${num(K)}² + 16·${num(K)}·${num(c)})]/8 = ${num(x)}<br>[NO₂] = 2x = <b>${num(no2)} M</b> · [N₂O₄] = ${num(n2o4)} M<br>Comprobación: (${num(no2)})²/${num(n2o4)} = ${num(no2*no2/n2o4)} ✔`};
}
function iceK(){
  const a=1.00, x=pick([0.2,0.4,0.5,0.6,0.7]), hi=2*x, K=hi*hi/((a-x)*(a-x));
  return {num:1,tol:.03,tag:'Calcular K desde el equilibrio',label:'Kc',ans:K,q:`Se mezclan ${num(a)} mol de ${f('H2')} y ${num(a)} mol de ${f('I2')} en un recipiente de 1,0 L. En el equilibrio hay ${num(hi)} mol de ${f('HI')}. Calcula K<sub>c</sub> de ${f('H2')} + ${f('I2')} ⇌ 2 ${f('HI')}.`,
    why:`Se formó ${num(hi)} mol de HI = 2x → x = ${num(x)}.<br>[H₂] = [I₂] = ${num(a)} − ${num(x)} = ${num(a-x)} M · [HI] = ${num(hi)} M<br>K<sub>c</sub> = [HI]²/([H₂][I₂]) = ${num(hi)}²/(${num(a-x)})² = <b>${num(K)}</b>`};
}
function genKman(){
  const K=pick([2,4,5,10,0.5,0.2]), ty=pick(['inv','dob','sum']);
  if(ty==='inv') return {num:1,tol:.02,tag:'Manipular K',label:'K',ans:1/K,q:`Para A ⇌ B, K = ${num(K)}. ¿Cuánto vale K para la reacción inversa B ⇌ A?`,why:`Invertir la reacción invierte K: 1/${num(K)} = <b>${num(1/K)}</b>.`};
  if(ty==='dob') return {num:1,tol:.02,tag:'Manipular K',label:'K',ans:K*K,q:`Para A ⇌ B, K = ${num(K)}. ¿Cuánto vale K para 2 A ⇌ 2 B?`,why:`Multiplicar la ecuación por n eleva K a la n: K′ = K² = ${num(K)}² = <b>${num(K*K)}</b>.`};
  const K2=pick([3,5,0.1]); return {num:1,tol:.02,tag:'Manipular K',label:'K',ans:K*K2,q:`A ⇌ B tiene K<sub>1</sub> = ${num(K)} y B ⇌ C tiene K<sub>2</sub> = ${num(K2)}. ¿Cuánto vale K para A ⇌ C?`,why:`Al sumar reacciones se multiplican las constantes: K = K<sub>1</sub>·K<sub>2</sub> = ${num(K)} × ${num(K2)} = <b>${num(K*K2)}</b>.`};
}

/* ---------- Ksp ---------- */
const SAL=[['AgCl',1.8e-10,2],['BaSO4',1.1e-10,2],['AgBr',5.4e-13,2],['CaF2',3.9e-11,3],['PbI2',9.8e-9,3]];
function genKsp(){
  const [s,K,n]=pick(SAL), sol=n===2?Math.sqrt(K):Math.cbrt(K/4);
  const ions={AgCl:['Ag^+','Cl^-',1,1],BaSO4:['Ba^2+','SO4^2-',1,1],AgBr:['Ag^+','Br^-',1,1],CaF2:['Ca^2+','F^-',1,2],PbI2:['Pb^2+','I^-',1,2]}[s];
  const ex=n===2?`K<sub>sp</sub> = s·s = s² → s = √K<sub>sp</sub>`:`K<sub>sp</sub> = s·(2s)² = 4s³ → s = ∛(K<sub>sp</sub>/4)`;
  return {num:1,tol:.04,tag:'Solubilidad',label:'s en mol/L',ans:sol,q:`${f(s)}(s) ⇌ ${f(ions[0])}(aq) + ${ions[3]>1?ions[3]+' ':''}${f(ions[1])}(aq), K<sub>sp</sub> = ${num(K)}. Calcula la solubilidad molar s (en mol/L).`,
    why:`Si se disuelven s mol/L: [${E.chem(ions[0])}] = s${ions[3]>1?' y ['+E.chem(ions[1])+'] = 2s':' y ['+E.chem(ions[1])+'] = s'}.<br>${ex} = ${n===2?`√(${num(K)})`:`∛(${num(K/4)})`} = <b>${num(sol)} mol/L</b>`};
}

/* ================= UNIDADES ================= */
const U=[];

/* 1 */
U.push({id:'u1',n:1,title:'Reacciones reversibles y equilibrio dinámico',sub:'Qué pasa realmente cuando «ya no cambia nada».',
 lesson:()=>L('',`
  <p>Hasta ahora, una reacción química «terminaba» cuando se acababa el reactivo. Muchas reacciones <b>no terminan</b>: los productos pueden volver a dar reactivos. Se escriben con doble flecha:</p>
  ${eqbox(E.rich('{N2O4}(g) ⇌ 2 {NO2}(g)'),'incoloro ⇌ marrón rojizo')}
  <h3>La película del equilibrio</h3>
  <ol><li><b>Al empezar</b> solo hay N₂O₄: la reacción directa va rápido y la inversa vale 0 (no hay NO₂).</li>
  <li>Según se forma NO₂, la inversa <b>acelera</b> y la directa <b>frena</b> (hay menos N₂O₄).</li>
  <li>Llega un momento en que <b>v<sub>directa</sub> = v<sub>inversa</sub></b>. Desde ahí, por cada molécula de N₂O₄ que se rompe, otra se forma. Las concentraciones <b>dejan de cambiar</b>.</li></ol>
  ${EQ.chart1()}
  ${call('Tres ideas que hay que asimilar','eq',`<ul><li><b>Es dinámico</b>: la reacción no se detiene; ocurre en los dos sentidos a la vez.</li><li><b>Concentraciones constantes</b>, no iguales: pueden ser muy distintas, solo dejan de variar.</li><li>Exige un <b>sistema cerrado</b> y T constante. Si el CO₂ de la caliza escapa, no hay equilibrio.</li></ul>`)}
  <p>Además, el estado de equilibrio es el mismo si partes de reactivos, de productos o de una mezcla (con la misma cantidad total de materia y la misma T).</p>`),
 cards:[
  ['¿Qué significa la doble flecha ⇌?','Reacción <b>reversible</b>: ocurre a la vez la reacción directa (reactivos → productos) y la inversa.'],
  ['¿Qué condición cinética define el equilibrio?','<b>v<sub>directa</sub> = v<sub>inversa</sub></b> (no que valgan cero).'],
  ['¿Se detiene la reacción cuando se alcanza el equilibrio?','No: es un equilibrio <b>dinámico</b>. Ambas reacciones continúan a la misma velocidad, por eso nada cambia a escala macroscópica.'],
  ['En el equilibrio, ¿las concentraciones de reactivos y productos son iguales?','No. Son <b>constantes</b>, y pueden ser muy distintas. Solo dejan de variar con el tiempo.'],
  ['¿Qué requisitos tiene un equilibrio?','Sistema <b>cerrado</b> (no entra ni sale materia) y <b>temperatura constante</b>.'],
  ['¿Partiendo de productos se llega al mismo equilibrio?','Sí. Si la cantidad total de materia y la T son las mismas, el estado de equilibrio es el mismo desde cualquier lado.'],
 ],
 quiz:()=>shuf([
  {tag:'Idea de equilibrio',q:'¿Qué se cumple exactamente cuando una reacción reversible alcanza el equilibrio?',opts:[{t:'La velocidad directa es igual a la inversa',ok:1},{t:'La velocidad directa y la inversa valen cero'},{t:'Las concentraciones de reactivos y productos son iguales'},{t:'Se ha consumido todo el reactivo'}],why:'En el equilibrio v<sub>d</sub> = v<sub>i</sub> ≠ 0. Por eso las concentraciones se mantienen constantes, aunque la reacción sigue ocurriendo.'},
  {tag:'Dinámico',q:'Una mezcla de N₂O₄ y NO₂ mantiene un color marrón constante en un tubo cerrado. ¿Qué podemos afirmar?',opts:[{t:'Las dos reacciones siguen ocurriendo con igual velocidad',ok:1},{t:'Las dos reacciones se han detenido'},{t:'Solo ocurre la reacción directa'},{t:'Solo ocurre la reacción inversa'}],why:'Color constante = concentraciones constantes. Es un equilibrio dinámico, no una parada.'},
  {tag:'Concentraciones',q:'En el equilibrio A ⇌ B, ¿qué afirmación es correcta?',opts:[{t:'[A] y [B] son constantes, pero no tienen por qué ser iguales',ok:1},{t:'[A] = [B] siempre'},{t:'[A] sigue disminuyendo lentamente'},{t:'[B] es siempre mayor que [A]'}],why:'Equilibrio ≠ igualdad de concentraciones. La proporción la fija la constante de equilibrio (unidad 2).'},
  {tag:'Condiciones',q:'¿En cuál de estas situaciones puede alcanzarse un equilibrio químico?',opts:[{t:'CaCO₃(s) ⇌ CaO(s) + CO₂(g) en un recipiente cerrado a T constante',ok:1},{t:'La misma reacción en un recipiente abierto (el CO₂ escapa)'},{t:'Una vela quemándose al aire'},{t:'Una pila alcalina descargándose'}],why:'Un equilibrio necesita sistema cerrado: si el CO₂ escapa, la reacción directa sigue hasta agotar el CaCO₃.'},
  {tag:'Gráficas',q:'En una gráfica de [reactivo] frente al tiempo, la curva se vuelve horizontal. ¿Qué significa?',opts:[{t:'Se alcanzó el equilibrio: las concentraciones ya no cambian',ok:1},{t:'La reacción se ha parado'},{t:'Se ha acabado el reactivo'},{t:'La reacción se ha vuelto irreversible'}],why:'Meseta = concentraciones constantes = equilibrio. La reacción no se ha parado, solo se ha igualado v<sub>d</sub> y v<sub>i</sub>.'},
  {tag:'Cinética',q:'Se parte solo de reactivos. Al principio, la velocidad de la reacción inversa es…',opts:[{t:'Cero, y va aumentando según aparecen productos',ok:1},{t:'La máxima'},{t:'Igual a la directa'},{t:'Siempre mayor que la directa'}],why:'Sin productos no hay nada que revierta. La inversa crece con [productos] hasta igualar a la directa.'},
  {tag:'Mismo equilibrio',q:'Se prepara A ⇌ B partiendo solo de A en un recipiente, y partiendo solo de B (misma cantidad de materia) en otro, a la misma T. Al final…',opts:[{t:'Los dos llegan al mismo equilibrio',ok:1},{t:'El que parte de A tiene más A'},{t:'El que parte de B tiene más B'},{t:'Solo el que parte de A alcanza equilibrio'}],why:'El equilibrio no «recuerda» de dónde vienes: solo depende de T y de la cantidad total de materia.'},
 ])});

/* 2 */
U.push({id:'u2',n:2,title:'La constante de equilibrio K<sub>c</sub>',sub:'Escribirla, interpretarla y manipularla.',
 lesson:()=>L('',`
  <p>Para una reacción general <b>a A + b B ⇌ c C + d D</b>, a una T dada, el cociente siguiente toma <b>siempre el mismo valor</b> cuando el sistema está en equilibrio:</p>
  ${eqbox('K<sub>c</sub> = '+frac('[C]<sup>c</sup>·[D]<sup>d</sup>','[A]<sup>a</sup>·[B]<sup>b</sup>'),'ley de acción de masas · concentraciones en mol/L en el equilibrio')}
  <h3>Reglas para escribirla</h3>
  <ol><li><b>Productos arriba, reactivos abajo.</b></li><li>Cada concentración se <b>eleva a su coeficiente</b> estequiométrico.</li><li>Los <b>sólidos y líquidos puros no aparecen</b> (su concentración es constante y se integra en K). El disolvente (agua) tampoco.</li><li>Solo cuentan gases (g) y especies disueltas (aq).</li></ol>
  ${eqbox(E.rich('{N2}(g) + 3 {H2}(g) ⇌ 2 {NH3}(g)'))}
  ${eqbox(kexpr(RX.haber))}
  ${eqbox(E.rich('{CaCO3}(s) ⇌ {CaO}(s) + {CO2}(g)'))}
  ${eqbox(kexpr(RX.caco3),'solo el gas aparece')}
  <h3>¿Qué dice el valor de K?</h3>
  <table><thead><tr><th>K</th><th>En el equilibrio…</th></tr></thead><tbody>
  <tr><td>K ≫ 1 (&gt; 10³)</td><td>Predominan los <b>productos</b>; la reacción es casi completa.</td></tr>
  <tr><td>K ≈ 1</td><td>Cantidades apreciables de reactivos y de productos.</td></tr>
  <tr><td>K ≪ 1 (&lt; 10⁻³)</td><td>Predominan los <b>reactivos</b>; casi no se forma producto.</td></tr></tbody></table>
  ${call('Lo que K no dice','af','K no dice <b>qué tan rápido</b> se llega al equilibrio (eso es cinética). Una K enorme puede ser una reacción lentísima.')}
  <h3>Cómo cambia K si manipulas la ecuación</h3>
  <ul><li><b>Invertir</b> la reacción → <b>1/K</b>.</li><li><b>Multiplicar</b> los coeficientes por n → <b>K<sup>n</sup></b>.</li><li><b>Sumar</b> reacciones → se <b>multiplican</b> sus K.</li></ul>
  ${call('K depende solo de…','eq','la <b>temperatura</b> (y de cómo escribas la ecuación). No cambia con las concentraciones, el volumen, la presión ni un catalizador.')}`),
 cards:[
  ['Expresión de K<sub>c</sub> para aA + bB ⇌ cC + dD','K<sub>c</sub> = [C]<sup>c</sup>[D]<sup>d</sup> / ([A]<sup>a</sup>[B]<sup>b</sup>). Productos arriba, reactivos abajo, coeficientes como exponentes.'],
  ['¿Qué especies <b>no</b> aparecen en K<sub>c</sub>?','Sólidos puros, líquidos puros y el disolvente. Solo gases y especies en disolución.'],
  ['K<sub>c</sub> de 2SO₂(g) + O₂(g) ⇌ 2SO₃(g)','K<sub>c</sub> = [SO₃]² / ([SO₂]²[O₂])'],
  ['K<sub>c</sub> de CaCO₃(s) ⇌ CaO(s) + CO₂(g)','K<sub>c</sub> = [CO₂] (los sólidos no aparecen).'],
  ['K ≫ 1 ¿qué indica?','En el equilibrio hay mucho producto: reacción casi completa.'],
  ['K ≪ 1 ¿qué indica?','En el equilibrio hay sobre todo reactivo: casi no se forma producto.'],
  ['¿De qué depende el valor de K?','<b>Solo de la temperatura</b> (para una ecuación dada). No de [ ], V, P ni catalizador.'],
  ['Si invierto la reacción, ¿qué pasa con K?','La nueva K′ = <b>1/K</b>.'],
  ['Si multiplico la reacción por 2, ¿qué pasa con K?','K′ = <b>K²</b> (en general K<sup>n</sup>).'],
  ['Si sumo dos reacciones, ¿cuánto vale K total?','K = K<sub>1</sub> · K<sub>2</sub>'],
 ],
 quiz:()=>[qKc(),qKc(),qKc(RX.caco3),
  {tag:'Magnitud de K',q:'Una reacción tiene K<sub>c</sub> = 3×10⁻²⁰ a 25 °C. ¿Qué podemos decir?',opts:[{t:'Prácticamente no se forman productos en el equilibrio',ok:1},{t:'La reacción es muy rápida'},{t:'La reacción es casi completa'},{t:'Hay igual cantidad de reactivos y productos'}],why:'K ≪ 1 → el equilibrio está muy desplazado hacia los reactivos. No dice nada sobre la velocidad.'},
  {tag:'De qué depende K',q:'¿Cuál de estas acciones <b>cambia</b> el valor de K<sub>c</sub> de una reacción?',opts:[{t:'Cambiar la temperatura',ok:1},{t:'Añadir catalizador'},{t:'Aumentar la concentración de un reactivo'},{t:'Reducir el volumen del recipiente'}],why:'K solo depende de T. El resto puede desplazar el equilibrio, pero K se mantiene (el sistema se reajusta hasta recuperarla).'},
  genKman(),genKman(),
 ]});

/* 3 */
U.push({id:'u3',n:3,title:'K<sub>p</sub>: la constante con presiones',sub:'Para gases: presiones parciales y relación con K<sub>c</sub>.',
 lesson:()=>L('',`
  <p>Con gases es habitual trabajar con presiones parciales en vez de concentraciones. Se escribe igual, pero con <b>P<sub>i</sub></b> (en atm):</p>
  ${eqbox('K<sub>p</sub> = '+frac('P<sub>C</sub><sup>c</sup>·P<sub>D</sub><sup>d</sup>','P<sub>A</sub><sup>a</sup>·P<sub>B</sub><sup>b</sup>'))}
  <ul><li>Presión parcial: <b>P<sub>i</sub> = x<sub>i</sub>·P<sub>total</sub></b> (x = fracción molar) o también P<sub>i</sub> = n<sub>i</sub>RT/V = [i]·RT.</li>
  <li>Ley de Dalton: P<sub>total</sub> = ΣP<sub>i</sub>.</li><li>Igual que antes, <b>sólidos y líquidos no aparecen</b>.</li></ul>
  <h3>De una a otra</h3>
  ${eqbox('K<sub>p</sub> = K<sub>c</sub>·(RT)<sup>Δn</sup>','Δn = (moles de gas en productos) − (moles de gas en reactivos) · R = 0,082 atm·L/(mol·K) · T en kelvin')}
  <ul><li>Solo cuentan los <b>coeficientes de gases</b> (los sólidos y líquidos se ignoran al calcular Δn).</li>
  <li>Si <b>Δn = 0</b> → K<sub>p</sub> = K<sub>c</sub> (ej.: H₂ + I₂ ⇌ 2HI).</li></ul>
  ${eqbox(E.rich('{N2}(g) + 3 {H2}(g) ⇌ 2 {NH3}(g)'),'Δn = 2 − (1 + 3) = −2  →  K<sub>p</sub> = K<sub>c</sub>(RT)<sup>−2</sup>')}
  ${call('Trampa frecuente','af','La T de la fórmula va en <b>kelvin</b>: 25 °C = 298 K. Y en CaCO₃(s) ⇌ CaO(s) + CO₂(g) el Δn es <b>+1</b>, no +2: los sólidos no cuentan.')}`),
 cards:[
  ['Expresión de K<sub>p</sub>','Igual que K<sub>c</sub> pero con presiones parciales (atm) de los gases: K<sub>p</sub> = P<sub>C</sub><sup>c</sup>P<sub>D</sub><sup>d</sup> / (P<sub>A</sub><sup>a</sup>P<sub>B</sub><sup>b</sup>).'],
  ['Relación entre K<sub>p</sub> y K<sub>c</sub>','K<sub>p</sub> = K<sub>c</sub>·(RT)<sup>Δn</sup>'],
  ['¿Qué es Δn?','Moles de gas de los productos <b>menos</b> moles de gas de los reactivos (según coeficientes). Sólidos y líquidos no cuentan.'],
  ['¿Cuándo K<sub>p</sub> = K<sub>c</sub>?','Cuando Δn = 0 (mismos moles de gas a ambos lados).'],
  ['Valor de R y unidad de T','R = 0,082 atm·L/(mol·K). T siempre en <b>kelvin</b> (K = °C + 273).'],
  ['Presión parcial de un gas','P<sub>i</sub> = x<sub>i</sub>·P<sub>total</sub> (Dalton). También P<sub>i</sub> = [i]·RT.'],
  ['Δn de N₂ + 3H₂ ⇌ 2NH₃','2 − (1 + 3) = <b>−2</b>'],
 ],
 quiz:()=>shuf([genDn(),genDn(),genDn(),genKp(),genKp(),
  {tag:'Trampa de sólidos',q:'¿Cuánto vale Δn para CaCO₃(s) ⇌ CaO(s) + CO₂(g)?',opts:[{t:'+1',ok:1},{t:'+2'},{t:'0'},{t:'−1'}],why:'Solo cuenta el gas: 1 mol de CO₂ − 0 mol de gas en reactivos = +1.'},
  {tag:'Cuándo coinciden',q:'¿En cuál de estas reacciones K<sub>p</sub> = K<sub>c</sub>?',opts:[{t:eqStr(RX.hi),ok:1},{t:eqStr(RX.haber)},{t:eqStr(RX.n2o4)},{t:eqStr(RX.so3)}],why:'Solo cuando Δn = 0: H₂ + I₂ ⇌ 2HI tiene 2 mol de gas a cada lado.'},
 ])});

/* 4 */
U.push({id:'u4',n:4,title:'El cociente Q: ¿hacia dónde va el sistema?',sub:'Comparar Q con K para predecir la dirección.',
 lesson:()=>L('',`
  <p>El <b>cociente de reacción Q</b> tiene exactamente la misma fórmula que K, pero se calcula con las concentraciones de <b>cualquier instante</b>, esté o no en equilibrio. K es solo el valor que toma Q en el equilibrio.</p>
  ${eqbox('Q = '+frac('[C]<sup>c</sup>[D]<sup>d</sup>','[A]<sup>a</sup>[B]<sup>b</sup>')+' (en un instante cualquiera)')}
  <h3>La regla de oro</h3>
  <table><thead><tr><th>Comparación</th><th>Significado</th><th>Sentido</th></tr></thead><tbody>
  <tr><td><b>Q &lt; K</b></td><td>Hay «poco producto»</td><td>Avanza a la <b>derecha</b> (se forman productos)</td></tr>
  <tr><td><b>Q = K</b></td><td>Equilibrio</td><td>No hay cambio neto</td></tr>
  <tr><td><b>Q &gt; K</b></td><td>Hay «demasiado producto»</td><td>Retrocede a la <b>izquierda</b> (se forman reactivos)</td></tr></tbody></table>
  ${call('Cómo recordarlo','cj','El sistema siempre intenta que Q <b>se iguale a K</b>. Si Q es más pequeño, tiene que crecer → más producto (numerador). Si Q es mayor, tiene que bajar → menos producto.')}
  <h3>Ejemplo resuelto</h3>
  <p>H₂ + I₂ ⇌ 2HI con K<sub>c</sub> = 4. Se mezclan [H₂] = 0,2 M, [I₂] = 0,2 M, [HI] = 0,8 M.</p>
  <p>Q = (0,8)²/(0,2·0,2) = 0,64/0,04 = <b>16</b>. Como Q &gt; K (16 &gt; 4) el sistema retrocede: se consume HI y se forma más H₂ e I₂ hasta que Q baje a 4.</p>
  ${call('Casos extremos','eq','Solo reactivos: Q = 0 → siempre hacia la derecha. Solo productos: Q → ∞ → siempre hacia la izquierda. Con sólidos, ignóralos al calcular Q igual que en K.')}`),
 cards:[
  ['¿Qué es el cociente de reacción Q?','La misma expresión que K, calculada con las concentraciones de <b>cualquier instante</b>.'],
  ['Q &lt; K ¿hacia dónde se desplaza?','Hacia la <b>derecha</b> (se forman productos) hasta que Q = K.'],
  ['Q &gt; K ¿hacia dónde se desplaza?','Hacia la <b>izquierda</b> (se forman reactivos) hasta que Q = K.'],
  ['Q = K ¿qué significa?','El sistema ya está en equilibrio. No hay cambio neto.'],
  ['Diferencia entre Q y K','K es fija (según T) y solo vale en equilibrio. Q se puede calcular siempre y va cambiando hasta igualar a K.'],
  ['Mezclo solo reactivos: ¿Q?','Q = 0 (no hay productos) → siempre avanza a la derecha.'],
 ],
 quiz:()=>shuf([genQ(),genQ(),genQ(),genQ(),genQ(true),genQ(true),
  {tag:'Idea de Q',q:'¿Cuál es la diferencia entre Q y K?',opts:[{t:'K se cumple solo en el equilibrio; Q se puede calcular en cualquier instante',ok:1},{t:'Q usa presiones y K concentraciones'},{t:'Q siempre vale 1'},{t:'No hay diferencia'}],why:'Misma fórmula, distinto momento. Q evoluciona hasta valer K.'},
 ])});

/* 5 */
U.push({id:'u5',n:5,title:'Principio de Le Châtelier',sub:'Predecir cómo responde un equilibrio a una perturbación.',
 lesson:()=>L('',`
  <p><b>Si se perturba un sistema en equilibrio, el sistema se desplaza en el sentido que contrarresta (en parte) la perturbación</b> hasta alcanzar un nuevo equilibrio.</p>
  <p>Detrás hay siempre lo mismo: la perturbación hace que <b>Q ≠ K</b>, y el sistema se mueve hasta que Q = K otra vez (unidad 4). Pruébalo en el <b>Laboratorio</b>.</p>
  <h3>1 · Cambiar la concentración</h3>
  <ul><li>Añadir reactivo o retirar producto → <b>derecha</b>. Añadir producto o retirar reactivo → <b>izquierda</b>.</li><li>K <b>no cambia</b>. Añadir un sólido o líquido puro no hace nada.</li></ul>
  <h3>2 · Cambiar el volumen / la presión (solo importa si hay gases)</h3>
  <ul><li>Comprimir (↑P) → hacia el lado con <b>menos moles de gas</b>. Expandir (↓P) → hacia el lado con <b>más moles de gas</b>.</li><li>Si Δn = 0 → <b>sin efecto</b>.</li>
  <li><b>Gas inerte</b> a V constante: no cambia nada (las concentraciones son las mismas). Si se añade a P constante, el volumen aumenta y equivale a expandir.</li></ul>
  <h3>3 · Cambiar la temperatura</h3>
  <p>Trata el calor como un reactivo o un producto:</p>
  <table><thead><tr><th>Reacción</th><th>Calentar (↑T)</th><th>Enfriar (↓T)</th><th>K al calentar</th></tr></thead><tbody>
  <tr><td><b>Exotérmica</b> (ΔH &lt; 0): reactivos ⇌ productos + calor</td><td>Izquierda</td><td>Derecha</td><td>baja</td></tr>
  <tr><td><b>Endotérmica</b> (ΔH &gt; 0): reactivos + calor ⇌ productos</td><td>Derecha</td><td>Izquierda</td><td>sube</td></tr></tbody></table>
  ${call('Única que cambia K','af','De todas las perturbaciones, <b>solo la temperatura modifica el valor de K</b>. Concentración, volumen o presión desplazan el equilibrio, pero K queda igual.')}
  <h3>4 · Catalizador</h3>
  <p>Acelera por igual las dos reacciones: se llega antes al equilibrio pero <b>no lo desplaza</b> ni cambia K.</p>
  <h3>Aplicación: síntesis de Haber</h3>
  ${eqbox(E.rich('{N2}(g) + 3 {H2}(g) ⇌ 2 {NH3}(g)  ΔH = −92 kJ'),'exotérmica y con 4 mol → 2 mol de gas')}
  <p>Para más NH₃ conviene <b>alta presión</b> (menos moles de gas a la derecha) y <b>baja T</b> (exotérmica). Pero a baja T es demasiado lenta, así que en la industria se trabaja a ~450 °C, ~200 atm y con catalizador de hierro, y se retira el NH₃ líquido para seguir desplazando a la derecha.</p>`),
 cards:[
  ['Enuncia el principio de Le Châtelier','Si se perturba un equilibrio, el sistema se desplaza en el sentido que <b>contrarresta</b> la perturbación hasta un nuevo equilibrio.'],
  ['Añado reactivo: ¿hacia dónde?','Hacia la <b>derecha</b> (consume el reactivo añadido). K no cambia.'],
  ['Retiro un producto: ¿hacia dónde?','Hacia la <b>derecha</b> (repone el producto retirado).'],
  ['Aumento la presión (comprimo): ¿hacia dónde?','Hacia el lado con <b>menos moles de gas</b>. Si Δn = 0, no hay efecto.'],
  ['Aumento la temperatura de una reacción exotérmica','Se desplaza a la <b>izquierda</b> y K <b>disminuye</b> (el calor es un producto).'],
  ['Aumento la temperatura de una reacción endotérmica','Se desplaza a la <b>derecha</b> y K <b>aumenta</b> (el calor es un reactivo).'],
  ['¿Qué efecto tiene un catalizador en el equilibrio?','Ninguno sobre la posición ni sobre K. Solo hace que se alcance antes.'],
  ['Añado un gas inerte a volumen constante','No hay desplazamiento: las concentraciones no cambian, Q sigue siendo igual a K.'],
  ['¿Qué perturbación modifica K?','<b>Solo la temperatura.</b>'],
  ['Añado más sólido puro (p. ej. CaCO₃) al equilibrio','No hay efecto: los sólidos no aparecen en Q ni en K.'],
 ],
 quiz:()=>shuf([genLC(),genLC(),genLC(),genLC(),genLC(),genLC(),
  {tag:'K y perturbaciones',q:'¿Cuál de estas perturbaciones modifica el <b>valor</b> de K?',opts:[{t:'Un cambio de temperatura',ok:1},{t:'Añadir un reactivo'},{t:'Comprimir el recipiente'},{t:'Añadir un catalizador'}],why:'Solo T cambia K. Las demás desplazan (o no) el equilibrio con K constante.'},
  {tag:'Haber',q:'Para obtener más NH₃ en N₂ + 3H₂ ⇌ 2NH₃ (ΔH &lt; 0), termodinámicamente conviene…',opts:[{t:'Alta presión y baja temperatura',ok:1},{t:'Baja presión y alta temperatura'},{t:'Alta presión y alta temperatura'},{t:'Baja presión y baja temperatura'}],why:'Alta P favorece el lado con menos moles de gas (NH₃); baja T favorece la exotérmica. En la práctica se compromete por la velocidad (≈450 °C y catalizador).'},
 ])});

/* 6 */
U.push({id:'u6',n:6,title:'Cálculos con tabla ICE',sub:'De concentraciones iniciales a las de equilibrio (y al revés).',
 lesson:()=>L('',`
  <p>La tabla <b>ICE</b> (Inicial · Cambio · Equilibrio) organiza cualquier cálculo de equilibrio. Se rellena con la <b>estequiometría</b>: lo que reacciona se reparte según los coeficientes, usando una incógnita <b>x</b>.</p>
  <h3>Pasos</h3>
  <ol><li>Ecuación ajustada y expresión de K.</li><li>Fila <b>I</b>: concentraciones iniciales (0 si no hay).</li><li>Fila <b>C</b>: reactivos <b>−coef·x</b>, productos <b>+coef·x</b> (si no sabes el sentido, usa Q vs K).</li><li>Fila <b>E</b>: I + C.</li><li>Sustituye la fila E en K y resuelve x.</li><li>Calcula las concentraciones y <b>comprueba</b> que cumplen K.</li></ol>
  <h3>Ejemplo A · con raíz cuadrada exacta</h3>
  <p>H₂ + I₂ ⇌ 2HI, K<sub>c</sub> = 4, [H₂]₀ = [I₂]₀ = 0,50 M.</p>
  <div class="tw"><table><thead><tr><th></th><th>H₂</th><th>I₂</th><th>HI</th></tr></thead><tbody>
  <tr><td>I</td><td>0,50</td><td>0,50</td><td>0</td></tr><tr><td>C</td><td>−x</td><td>−x</td><td>+2x</td></tr><tr><td>E</td><td>0,50−x</td><td>0,50−x</td><td>2x</td></tr></tbody></table></div>
  <p>K = (2x)²/(0,50−x)² = 4 → 2x/(0,50−x) = 2 → 2x = 1 − 2x → <b>x = 0,25</b>. Resultado: [H₂] = [I₂] = 0,25 M, [HI] = 0,50 M. Comprobación: 0,50²/0,25² = 4 ✔</p>
  <h3>Ejemplo B · ecuación de segundo grado</h3>
  <p>N₂O₄ ⇌ 2NO₂, K<sub>c</sub> = 0,40, [N₂O₄]₀ = 0,50 M. Fila C: −x, +2x. K = (2x)²/(0,50−x) = 0,40 → 4x² + 0,40x − 0,20 = 0 → x = 0,179. [NO₂] = 0,36 M, [N₂O₄] = 0,32 M.</p>
  ${call('Aproximación de x pequeña','cj','Si K es muy pequeña (≲ 10⁻³ con concentraciones ~0,1 M), x ≪ c₀ y puedes escribir c₀ − x ≈ c₀. Comprueba después que x/c₀ &lt; 5 %; si no, resuelve la cuadrática completa.')}
  <h3>Al revés: calcular K</h3>
  <p>Si te dan las cantidades iniciales y <b>una</b> de equilibrio, con la fila C deduces x y completas la fila E. Luego K = E sustituidas.</p>`),
 cards:[
  ['¿Qué significan las letras ICE?','<b>I</b>nicial · <b>C</b>ambio · <b>E</b>quilibrio.'],
  ['Signos y coeficientes en la fila C','Reactivos: <b>−(coef)·x</b>. Productos: <b>+(coef)·x</b>. Para 2A ⇌ B: A = −2x, B = +x.'],
  ['Fila E','E = I + C (concentraciones de equilibrio en función de x). Es la que se sustituye en K.'],
  ['¿Cuándo se puede despreciar x frente a la concentración inicial?','Cuando K es muy pequeña y x/c₀ &lt; 5 %. Siempre se comprueba después.'],
  ['Qué hacer si x no es despreciable','Resolver la ecuación de segundo grado completa y quedarte con la raíz físicamente razonable (positiva y que no deje concentraciones negativas).'],
  ['Último paso de cualquier cálculo ICE','<b>Comprobar</b>: sustituir las concentraciones de equilibrio en K y ver que la dan.'],
 ],
 quiz:()=>shuf([iceHI(),iceHI(),iceN2O4(),iceK(),iceK(),
  {tag:'Fila C',q:'Para 2 NH₃ ⇌ N₂ + 3 H₂ empezando solo con NH₃, ¿cuál es la fila C?',opts:[{t:'NH₃: −2x · N₂: +x · H₂: +3x',ok:1},{t:'NH₃: −x · N₂: +x · H₂: +x'},{t:'NH₃: +2x · N₂: −x · H₂: −3x'},{t:'NH₃: −2x · N₂: +2x · H₂: +6x'}],why:'Los coeficientes se reparten: se consumen 2x de NH₃ y se forman x de N₂ y 3x de H₂. Solo hay reactivo al inicio, así que avanza hacia productos.'},
  {tag:'Aproximación',q:'En un cálculo ICE, K = 1×10⁻⁶, [A]₀ = 0,10 M. ¿Qué es razonable?',opts:[{t:'Aproximar 0,10 − x ≈ 0,10 y comprobarlo después',ok:1},{t:'Es obligatorio resolver la cuadrática'},{t:'Suponer que x es mayor que 0,10'},{t:'No se puede calcular'}],why:'Con K tan pequeña, x será minúscula frente a 0,10 M. Se aproxima y se verifica que x/0,10 &lt; 5 %.'},
 ])});

/* 7 */
U.push({id:'u7',n:7,title:'Equilibrios en disolución: K<sub>a</sub>, K<sub>w</sub> y K<sub>sp</sub>',sub:'Lo mismo de siempre aplicado a ácidos y a sales poco solubles.',
 lesson:()=>L('',`
  <p>Todo lo anterior se aplica sin cambios a los equilibrios en agua. Solo cambian los nombres de la constante:</p>
  <table><thead><tr><th>Equilibrio</th><th>Constante</th></tr></thead><tbody>
  <tr><td>${E.rich('{CH3COOH}(aq) + {H2O}(l) ⇌ {CH3COO^-}(aq) + {H3O^+}(aq)')}</td><td>${kexpr(RX.hac,{sym:'K<sub>a</sub>'})}<br><small class="muted">el H₂O líquido no aparece</small></td></tr>
  <tr><td>2 H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq)</td><td>K<sub>w</sub> = [H₃O⁺][OH⁻] = 1,0×10<sup>−14</sup></td></tr>
  <tr><td>${E.rich('{AgCl}(s) ⇌ {Ag^+}(aq) + {Cl^-}(aq)')}</td><td>K<sub>sp</sub> = [Ag⁺][Cl⁻]</td></tr></tbody></table>
  <p>El <b>producto de solubilidad K<sub>sp</sub></b> es la K de la disolución de una sal poco soluble (el sólido no aparece).</p>
  <h3>¿Precipita o no?</h3>
  <p>Calcula Q (producto de iones con las concentraciones reales) y compárala con K<sub>sp</sub>, como siempre: <b>Q &gt; K<sub>sp</sub> → precipita</b> · Q = K<sub>sp</sub> → saturada · Q &lt; K<sub>sp</sub> → se disuelve más.</p>
  <h3>Solubilidad a partir de K<sub>sp</sub></h3>
  <p>Si se disuelven <b>s</b> mol/L: para AgCl, [Ag⁺] = [Cl⁻] = s → K<sub>sp</sub> = s². Para CaF₂, [Ca²⁺] = s y [F⁻] = 2s → K<sub>sp</sub> = s·(2s)² = 4s³.</p>
  <h3>Efecto del ion común (Le Châtelier otra vez)</h3>
  <p>Si ya hay Cl⁻ en la disolución (por ejemplo NaCl), el equilibrio AgCl(s) ⇌ Ag⁺ + Cl⁻ se desplaza a la izquierda: <b>el AgCl se disuelve menos</b>. Igual, el acetato de sodio reduce la ionización del ácido acético.</p>
  ${call('Conexión con Ácido-base','cj','K<sub>a</sub>·K<sub>b</sub> = K<sub>w</sub> y todo el cálculo de pH de ácidos débiles es una tabla ICE con K = K<sub>a</sub>. Practícalo en el módulo <a href="acido-base.html">Ácido-base</a>.')}`),
 cards:[
  ['¿Qué es K<sub>a</sub> en términos de equilibrio?','La K<sub>c</sub> de HA + H₂O ⇌ A⁻ + H₃O⁺: K<sub>a</sub> = [A⁻][H₃O⁺]/[HA]. El agua líquida no aparece.'],
  ['¿Qué es K<sub>sp</sub>?','Producto de solubilidad: K de la disolución de una sal poco soluble. AgCl: K<sub>sp</sub> = [Ag⁺][Cl⁻].'],
  ['K<sub>sp</sub> de CaF₂','K<sub>sp</sub> = [Ca²⁺][F⁻]² = s·(2s)² = 4s³'],
  ['Q &gt; K<sub>sp</sub> ¿qué ocurre?','<b>Precipita</b> sólido hasta que Q = K<sub>sp</sub>.'],
  ['Efecto del ion común','Añadir un ion que ya está en el equilibrio lo desplaza hacia el sólido (o hacia el ácido sin ionizar): <b>reduce la solubilidad</b>.'],
  ['¿Cuánto vale K<sub>w</sub>?','1,0×10<sup>−14</sup> a 25 °C: K de 2H₂O ⇌ H₃O⁺ + OH⁻.'],
 ],
 quiz:()=>shuf([genKsp(),genKsp(),qKc(RX.agcl),qKc(RX.hac),
  {tag:'Precipitación',q:'Se mezclan disoluciones de forma que Q = [Ag⁺][Cl⁻] = 5×10⁻⁹ y K<sub>sp</sub>(AgCl) = 1,8×10⁻¹⁰. ¿Qué ocurre?',opts:[{t:'Precipita AgCl',ok:1},{t:'No precipita; se disuelve más sólido'},{t:'Está justo saturada'},{t:'No se puede saber sin conocer el volumen'}],why:'Q = 5×10⁻⁹ &gt; K<sub>sp</sub> = 1,8×10⁻¹⁰ → hay «demasiados iones»: precipita hasta que Q = K<sub>sp</sub>.'},
  {tag:'Ion común',q:'¿Cómo cambia la solubilidad del AgCl al disolverlo en NaCl 0,1 M frente a agua pura?',opts:[{t:'Disminuye',ok:1},{t:'Aumenta'},{t:'No cambia'},{t:'Se anula'}],why:'El Cl⁻ añadido desplaza AgCl(s) ⇌ Ag⁺ + Cl⁻ hacia el sólido (Le Châtelier). K<sub>sp</sub> no cambia.'},
  {tag:'Misma idea',q:'La ionización de un ácido débil HA en agua se estudia con la misma herramienta que cualquier equilibrio. ¿Cuál?',opts:[{t:'La tabla ICE con K = K<sub>a</sub>',ok:1},{t:'Solo la estequiometría directa, sin equilibrio'},{t:'Una tabla donde x nunca se desprecia'},{t:'La ley de Dalton'}],why:'HA + H₂O ⇌ A⁻ + H₃O⁺ es un equilibrio más: I, C, E y sustituir en K<sub>a</sub>.'},
 ])});

EQ.UNITS=U;

/* ---------- gráfica de la unidad 1 ---------- */
EQ.chart1=function(){
  const W=300,H=170,pl=34,pr=10,pt=12,pb=28, tmax=10;
  const X=t=>pl+(W-pl-pr)*t/tmax, Y=(v,m)=>pt+(H-pt-pb)*(1-v/m);
  const line=(fn,m,col)=>{ let d=''; for(let i=0;i<=60;i++){ const t=tmax*i/60; d+=(i?'L':'M')+X(t).toFixed(1)+' '+Y(fn(t),m).toFixed(1); } return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>`; };
  const ex=t=>1-Math.exp(-t/1.6);
  const axes=(lab)=>`<path d="M${pl} ${pt}V${H-pb}H${W-pr}" fill="none" stroke="var(--ink-3)" stroke-width="1.2"/><text x="${(pl+W-pr)/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--ink-2)">tiempo</text><text x="10" y="${pt+(H-pt-pb)/2}" font-size="11" fill="var(--ink-2)" transform="rotate(-90 10 ${pt+(H-pt-pb)/2})" text-anchor="middle">${lab}</text><line x1="${X(5.5)}" x2="${X(5.5)}" y1="${pt}" y2="${H-pb}" stroke="var(--ink-3)" stroke-dasharray="4 4"/><text x="${X(5.5)+4}" y="${pt+10}" font-size="10" fill="var(--ink-2)">equilibrio</text>`;
  const c1=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Concentraciones frente al tiempo">${axes('concentración')}${line(t=>1-0.6*ex(t),1,'var(--c-af)')}${line(t=>1.2*ex(t),1.3,'var(--c-bf)')}<text x="${X(8)}" y="${Y(.35,1)}" font-size="11" fill="var(--c-af)">N₂O₄</text><text x="${X(8)}" y="${Y(1.2,1.3)-6}" font-size="11" fill="var(--c-bf)">NO₂</text></svg>`;
  const c2=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Velocidades frente al tiempo">${axes('velocidad')}${line(t=>1-0.5*ex(t),1.1,'var(--c-af)')}${line(t=>0.5*ex(t),1.1,'var(--c-bf)')}<text x="${X(8)}" y="${Y(.5,1.1)-16}" font-size="11" fill="var(--c-af)">v directa</text><text x="${X(8)}" y="${Y(.5,1.1)+20}" font-size="11" fill="var(--c-bf)">v inversa</text></svg>`;
  return `<figure class="chartwrap" style="margin:0"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px">${c1}${c2}</div><figcaption>Izquierda: las concentraciones se estabilizan. Derecha: las dos velocidades convergen y se igualan (no son cero).</figcaption></figure>`;
};

g.EQ=EQ;
})(window);
