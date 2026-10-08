/* Contenido y generadores del módulo Ácido-base. Constantes a 25 °C. */
(function(g){
'use strict';
const E=g.Estudio, KW=1e-14;
const AB={};

/* Pares ácido/base. t: AF ácido fuerte · AD ácido débil · BD base débil (el ácido es el catión).
   ka (ácido) o kb (base) en los débiles; cls: la especie base se puede preguntar como «base débil». */
const PARES=[
 {a:'HCl',   b:'Cl^-',     an:'ácido clorhídrico', bn:'ion cloruro',   t:'AF'},
 {a:'HBr',   b:'Br^-',     an:'ácido bromhídrico', bn:'ion bromuro',   t:'AF'},
 {a:'HI',    b:'I^-',      an:'ácido yodhídrico',  bn:'ion yoduro',    t:'AF'},
 {a:'HNO3',  b:'NO3^-',    an:'ácido nítrico',     bn:'ion nitrato',   t:'AF'},
 {a:'H2SO4', b:'HSO4^-',   an:'ácido sulfúrico',   bn:'ion hidrogenosulfato', t:'AF', nota:'Solo el primer H es fuerte; el segundo (HSO4^-) es un ácido débil.'},
 {a:'HClO4', b:'ClO4^-',   an:'ácido perclórico',  bn:'ion perclorato',t:'AF'},
 {a:'HF',     b:'F^-',       an:'ácido fluorhídrico', bn:'ion fluoruro',  t:'AD', ka:6.8e-4, cls:1, nota:'Aunque es un haluro, el HF es débil (el enlace H–F es muy fuerte).'},
 {a:'HNO2',   b:'NO2^-',     an:'ácido nitroso',      bn:'ion nitrito',   t:'AD', ka:4.5e-4, cls:1},
 {a:'HCOOH',  b:'HCOO^-',    an:'ácido fórmico (metanoico)', bn:'ion formiato', t:'AD', ka:1.8e-4, cls:1},
 {a:'CH3COOH',b:'CH3COO^-',  an:'ácido acético (etanoico)',  bn:'ion acetato',  t:'AD', ka:1.8e-5, cls:1, nota:'Solo el H del grupo –COOH es ácido; los tres H del CH3 no se ceden.'},
 {a:'HCN',    b:'CN^-',      an:'ácido cianhídrico',  bn:'ion cianuro',   t:'AD', ka:4.9e-10, cls:1},
 {a:'HClO',   b:'ClO^-',     an:'ácido hipocloroso',  bn:'ion hipoclorito', t:'AD', ka:3.0e-8, cls:1},
 {a:'H2CO3',  b:'HCO3^-',    an:'ácido carbónico',    bn:'ion hidrogenocarbonato', t:'AD', ka:4.3e-7},
 {a:'H3PO4',  b:'H2PO4^-',   an:'ácido fosfórico',    bn:'ion dihidrogenofosfato', t:'AD', ka:7.5e-3},
 {a:'HSO4^-', b:'SO4^2-',    an:'ion hidrogenosulfato', bn:'ion sulfato', t:'AD', ka:1.2e-2},
 {a:'HCO3^-', b:'CO3^2-',    an:'ion hidrogenocarbonato', bn:'ion carbonato', t:'AD', ka:4.7e-11, cls:1},
 {a:'NH4^+',     b:'NH3',     an:'ion amonio',     bn:'amoníaco',    t:'BD', kb:1.8e-5, cls:1},
 {a:'CH3NH3^+',  b:'CH3NH2',  an:'ion metilamonio',bn:'metilamina',  t:'BD', kb:4.4e-4, cls:1},
 {a:'C5H5NH^+',  b:'C5H5N',   an:'ion piridinio',  bn:'piridina',    t:'BD', kb:1.7e-9, cls:1},
 {a:'C6H5NH3^+', b:'C6H5NH2', an:'ion anilinio',   bn:'anilina',     t:'BD', kb:4.3e-10, cls:1},
];
PARES.forEach((p,i)=>{ p.i=i;
  if(p.t==='AD'){ p.kb=KW/p.ka; } else if(p.t==='BD'){ p.ka=KW/p.kb; }
});
AB.PARES=PARES;

const BASES_F=[['LiOH','hidróxido de litio'],['NaOH','hidróxido de sodio'],['KOH','hidróxido de potasio'],['RbOH','hidróxido de rubidio'],['CsOH','hidróxido de cesio'],
  ['Ca(OH)2','hidróxido de calcio'],['Sr(OH)2','hidróxido de estroncio'],['Ba(OH)2','hidróxido de bario']];
AB.BASES_F=BASES_F;

const f=x=>`{${x}}`;                 // marca de fórmula
const num=E.num;
const pK=k=>(-Math.log10(k)).toFixed(2).replace('.',',');

/* ---------- fichas ---------- */
const DECKS=[{k:'af',n:'Ácidos fuertes'},{k:'bf',n:'Bases fuertes'},{k:'ad',n:'Ácidos débiles'},{k:'bd',n:'Bases débiles'},{k:'cj',n:'Conjugados'},{k:'cn',n:'Conceptos'}];
AB.DECKS=DECKS;
const top=(form,name)=>`<div class="backtop"><span class="formula">${E.chem(form)}</span><div class="namebig">${name}</div></div>`;
const dl=rows=>`<dl class="names">${rows.map(([t,d])=>`<dt>${E.rich(t)}</dt><dd>${E.rich(d)}</dd>`).join('')}</dl>`;
const note=(h)=>`<div class="note">${E.rich(h)}</div>`;
const bigF=s=>`<span class="formula${s.length>9?' long':''}">${E.chem(s)}</span>`;

AB.cards=function(){
  const C=[];
  // ácidos fuertes y débiles (lado ácido)
  PARES.forEach(p=>{
    if(p.t==='AF'){
      C.push({key:'af-'+p.i,deck:'af',chip:['Ácido fuerte','af'],fchip:['¿Fuerte o débil?','cn'],
        front:bigF(p.a),
        back:top(p.a,p.an)+dl([['Tipo','Ácido <b>fuerte</b>: se ioniza ~100 %.'],['Reacción',`${f(p.a)} + ${f('H2O')} → ${f('H3O^+')} + ${f(p.b)}`],['Conjugada',`${f(p.b)} (${p.bn}): base <b>despreciable</b>, no capta H⁺ del agua.`]])
          +note(p.nota?p.nota:`Al ser conjugada de un ácido fuerte, ${f(p.b)} es espectador: sus sales con Na⁺ o K⁺ dan disolución neutra.`)});
    } else if(p.t==='AD'){
      C.push({key:'ad-'+p.i,deck:'ad',chip:['Ácido débil','ad'],fchip:['¿Fuerte o débil?','cn'],
        front:bigF(p.a),
        back:top(p.a,p.an)+dl([['Tipo','Ácido <b>débil</b>: ionización parcial, equilibrio ⇌.'],['K_a',`${num(p.ka)} (pK_a = ${pK(p.ka)})`],['Reacción',`${f(p.a)} + ${f('H2O')} ⇌ ${f('H3O^+')} + ${f(p.b)}`],['Conjugada',`${f(p.b)} (${p.bn}): base débil, K_b = ${num(p.kb)}`]])
          +note(p.nota||`K_a·K_b = K_w. Como ${f(p.a)} es un ácido débil, su conjugada ${f(p.b)} sí capta algo de H⁺: sus sales dan pH básico.`)});
    }
  });
  // bases débiles
  PARES.filter(p=>p.t==='BD').forEach(p=>{
    C.push({key:'bd-'+p.i,deck:'bd',chip:['Base débil','bd'],fchip:['¿Fuerte o débil?','cn'],
      front:bigF(p.b),
      back:top(p.b,p.bn)+dl([['Tipo','Base <b>débil</b>: capta H⁺ solo en parte.'],['K_b',`${num(p.kb)} (pK_b = ${pK(p.kb)})`],['Reacción',`${f(p.b)} + ${f('H2O')} ⇌ ${f(p.a)} + ${f('OH^-')}`],['Conjugada',`${f(p.a)} (${p.an}): ácido débil, K_a = ${num(p.ka)}`]])
        +note(`Las aminas y el amoníaco son bases por el par libre del N, que acepta un H⁺. Su ácido conjugado (el catión) da disoluciones de pH ácido.`)});
  });
  // bases fuertes
  BASES_F.forEach(([fm,nm],i)=>{
    const n=fm==='Ca(OH)2'||fm==='Sr(OH)2'||fm==='Ba(OH)2'?2:1;
    C.push({key:'bf-'+i,deck:'bf',chip:['Base fuerte','bf'],fchip:['¿Fuerte o débil?','cn'],
      front:bigF(fm),
      back:top(fm,nm)+dl([['Tipo','Base <b>fuerte</b>: se disocia por completo en agua.'],['Reacción',`${f(fm)} → ${f(fm.replace(/\(OH\)2|OH/,'')+(n===2?'^2+':'^+'))} + ${n===2?'2 ':''}${f('OH^-')}`],['[OH⁻]',n===2?`Aporta <b>2</b> OH⁻ por fórmula: [OH⁻] = 2·c`:`1 OH⁻ por fórmula: [OH⁻] = c`],['Conjugada',`El catión metálico es espectador (neutro). La base real es ${f('OH^-')}, cuya conjugada es ${f('H2O')}.`]])
        +note(n===2?'Los hidróxidos de Ca, Sr y Ba son fuertes pero poco solubles: la fuerza (disociación total de lo que se disuelve) no es la solubilidad.':'Todos los hidróxidos del grupo 1 son bases fuertes y muy solubles.')});
  });
  // conjugados: ácido → base y base → ácido
  PARES.forEach(p=>{
    const ra=p.t==='AF'?'base despreciable (espectador)':`base débil, K_b = ${num(p.kb)}`;
    const rb=p.t==='BD'?`ácido débil, K_a = ${num(p.ka)}`:`ácido ${p.t==='AF'?'fuerte':'débil'}`;
    C.push({key:'cj-a'+p.i,deck:'cj',chip:['Conjugado','cj'],fchip:['Conjugado','cn'],
      front:`<div class="prompt"><span class="count">Base conjugada de</span>${bigF(p.a)}</div>`,
      back:top(p.b,p.bn)+dl([['Cómo',`${f(p.a)} − H⁺ = ${f(p.b)}`],['Fuerza',ra]])+note(`Quitar un H⁺ baja la carga en 1. Par: ${f(p.a)} / ${f(p.b)}.`)});
    C.push({key:'cj-b'+p.i,deck:'cj',chip:['Conjugado','cj'],fchip:['Conjugado','cn'],
      front:`<div class="prompt"><span class="count">Ácido conjugado de</span>${bigF(p.b)}</div>`,
      back:top(p.a,p.an)+dl([['Cómo',`${f(p.b)} + H⁺ = ${f(p.a)}`],['Fuerza',rb]])+note(`Añadir un H⁺ sube la carga en 1. Par: ${f(p.a)} / ${f(p.b)}.`)});
  });
  // conceptos
  CONCEPTOS.forEach((c,i)=>C.push({key:'cn-'+i,deck:'cn',chip:['Concepto','cn'],fchip:['Concepto','cn'],
    front:`<div style="font-family:var(--font-display);font-size:clamp(22px,4.4vw,32px);font-weight:500;line-height:1.3;text-wrap:balance">${E.rich(c[0])}</div>`,
    back:`<div class="backtop"><div class="namebig" style="font-size:clamp(18px,3.4vw,24px)">${E.rich(c[0])}</div></div><div class="lesson" style="font-size:17px">${E.rich(c[1])}</div>`}));
  return C;
};

const CONCEPTOS=[
 ['¿Qué es un ácido y una base según Brønsted–Lowry?','<b>Ácido</b>: especie que <b>cede</b> un protón (H⁺). <b>Base</b>: especie que lo <b>acepta</b>. Lo importante es la transferencia de H⁺ entre dos especies.'],
 ['¿Qué es un par ácido-base conjugado?','Dos especies que se diferencian en un único H⁺: <b>HA / A⁻</b>. Ejemplos: {NH4^+}/{NH3}, {H2CO3}/{HCO3^-}, {H3O^+}/{H2O}.'],
 ['Ácido fuerte: ¿qué significa «fuerte»?','Se ioniza <b>prácticamente al 100 %</b> en agua: {HA} + {H2O} → {A^-} + {H3O^+} (flecha en un solo sentido). La [H₃O⁺] es igual a la concentración del ácido.'],
 ['Ácido débil: ¿qué significa «débil»?','Se ioniza <b>solo en parte</b> y de forma reversible: {HA} + {H2O} ⇌ {A^-} + {H3O^+}. Se describe con {K_a} (pequeña).'],
 ['«Fuerte» ¿es lo mismo que «concentrado»?','<b>No.</b> Fuerza = cuánto se ioniza. Concentración = cuánto hay por litro. Ejemplos: HCl 0,001 M es fuerte y diluido; ácido acético 17 M (glacial) es débil y concentrado.'],
 ['Relación entre {K_a} de un ácido y {K_b} de su base conjugada','{K_a}·{K_b} = {K_w} = 1,0×10^-14 (a 25 °C). Equivalente: pK_a + pK_b = 14.'],
 ['Si un ácido es más fuerte, ¿cómo es su base conjugada?','<b>Más débil.</b> Cuanto más fácil cede H⁺ el ácido, menos ganas tiene su conjugada de recuperarlo. Por eso Cl⁻ (conjugada de HCl) no hace nada y CN⁻ (conjugada de HCN, ácido muy débil) sí es una base apreciable.'],
 ['¿Qué es una especie anfótera (anfiprótica)?','Puede <b>ceder o aceptar</b> H⁺ según con quién reaccione: {H2O}, {HCO3^-}, {H2PO4^-}, {HS^-}, {HSO4^-}.'],
 ['¿Qué es {K_w} y cuánto vale?','Constante de autoionización del agua: {K_w} = [{H3O^+}]·[{OH^-}] = 1,0×10^-14 a 25 °C. En agua pura, [H₃O⁺] = [OH⁻] = 10^-7 M.'],
 ['Fórmulas de pH y pOH','pH = −log[{H3O^+}] · pOH = −log[{OH^-}] · pH + pOH = 14 (a 25 °C).'],
 ['Disolución ácida, neutra y básica','Ácida: pH &lt; 7 ([H₃O⁺] &gt; [OH⁻]). Neutra: pH = 7. Básica: pH &gt; 7. Cada unidad de pH es un factor 10 en [H₃O⁺].'],
 ['¿Por qué el ion {Cl^-} no cambia el pH del agua?','Es la conjugada de un ácido fuerte (HCl): tan débil como base que no capta H⁺ del agua. Es un <b>espectador</b>. Igual con {Br^-}, {I^-}, {NO3^-}, {ClO4^-}.'],
 ['¿Por qué una disolución de acetato de sodio es básica?','El Na⁺ es espectador, pero el acetato es la base conjugada de un ácido débil: {CH3COO^-} + {H2O} ⇌ {CH3COOH} + {OH^-}. Se forman OH⁻ → pH &gt; 7.'],
 ['¿Por qué una disolución de cloruro de amonio es ácida?','El Cl⁻ es espectador, pero el {NH4^+} es el ácido conjugado de una base débil: {NH4^+} + {H2O} ⇌ {NH3} + {H3O^+}. Se forman H₃O⁺ → pH &lt; 7.'],
 ['¿Los cationes Na⁺, K⁺, Ca²⁺ afectan al pH?','No. Son los «restos» de bases fuertes (conjugadas despreciables). No reaccionan con el agua.'],
 ['Ácidos dipróticos: ¿se pierden los H igual de fácil?','No. {K_a1} ≫ {K_a2}: el segundo H sale con más dificultad (hay que arrancarlo de un anión). Ej.: {H2CO3} (4,3×10^-7) → {HCO3^-} (4,7×10^-11). En el {H2SO4}, el primer H es fuerte y el segundo, débil.'],
 ['Cómo escribir la conjugada de una especie','Ácido → su base: <b>quita un H⁺</b> (la carga baja 1). Base → su ácido: <b>añade un H⁺</b> (la carga sube 1). Ej.: {HCO3^-} → {CO3^2-} (base) o {H2CO3} (ácido).'],
 ['¿Qué es el pK_a y cómo se compara?','pK_a = −log {K_a}. <b>Menor pK_a = ácido más fuerte.</b> Ej.: HF (3,17) es más fuerte que HCN (9,31).'],
 ['Receta para el pH de un ácido débil de concentración c','Plantea {K_a} = x²/(c − x). Si x ≪ c: <b>x ≈ √({K_a}·c)</b>. Comprueba que x/c &lt; 5 %; si no, resuelve la cuadrática. Después pH = −log x.'],
 ['Al diluir un ácido débil, ¿su grado de ionización sube o baja?','<b>Sube</b> (ley de dilución de Ostwald): hay menos H₃O⁺ y A⁻ por litro, y el equilibrio se desplaza hacia los productos. Pero el pH también sube (la [H₃O⁺] total baja).'],
];
AB.CONCEPTOS=CONCEPTOS;

/* ---------- test de opción múltiple ---------- */
const shuf=E.shuffle, pick=E.pick;
const CLASES=['Ácido fuerte','Ácido débil','Base fuerte','Base débil'];
function especies(){
  const L=[];
  PARES.forEach(p=>{
    if(p.t==='AF') L.push({f:p.a,c:0,why:`${f(p.a)} está en la lista de ácidos fuertes: se ioniza por completo. Su conjugada ${f(p.b)} es despreciable.`});
    if(p.t==='AD'&&p.a!=='HCO3^-') L.push({f:p.a,c:1,why:`${f(p.a)} es un ácido débil (K_a = ${num(p.ka)}): ionización parcial. Su conjugada ${f(p.b)} es una base débil.`});
    if(p.t==='BD') L.push({f:p.b,c:3,why:`${f(p.b)} es una base débil (K_b = ${num(p.kb)}): capta H⁺ solo en parte.`});
    if(p.t==='BD') L.push({f:p.a,c:1,why:`${f(p.a)} es el ácido conjugado de la base débil ${f(p.b)}: es un ácido débil (K_a = ${num(p.ka)}).`});
    if(p.t!=='BD'&&p.cls) L.push({f:p.b,c:3,why:`${f(p.b)} es la base conjugada del ácido débil ${f(p.a)}: base débil (K_b = ${num(p.kb)}).`});
  });
  BASES_F.forEach(([fm])=>L.push({f:fm,c:2,why:`${f(fm)} es un hidróxido del grupo 1 o de Ca, Sr, Ba: base fuerte (disociación completa).`}));
  return L;
}
const SALES=[
 ['NaCl','neutra','Na⁺ (conjugado de base fuerte) y Cl⁻ (conjugada de ácido fuerte) son espectadores.'],
 ['KNO3','neutra','K⁺ y NO₃⁻ vienen de KOH (fuerte) y HNO₃ (fuerte): ninguno reacciona con el agua.'],
 ['LiBr','neutra','Li⁺ y Br⁻ vienen de LiOH y HBr, ambos fuertes.'],
 ['NaF','básica','F⁻ es la conjugada del HF (ácido débil): F⁻ + H₂O ⇌ HF + OH⁻.'],
 ['CH3COONa','básica','El acetato es la conjugada del ácido acético (débil): produce OH⁻.'],
 ['NaCN','básica','CN⁻ es la conjugada del HCN (muy débil), así que es una base apreciable (K_b = 2,0×10⁻⁵).'],
 ['NaClO','básica','ClO⁻ es la conjugada del HClO (débil): produce OH⁻.'],
 ['NH4Cl','ácida','NH₄⁺ es el ácido conjugado del NH₃ (base débil): NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺. El Cl⁻ no hace nada.'],
 ['NH4NO3','ácida','NH₄⁺ cede H⁺ al agua; el NO₃⁻ es espectador.'],
];
function qClasificar(){
  const e=pick(especies());
  return {tag:'Clasificar',q:`¿Cómo se clasifica ${f(e.f)} en agua?`,opts:CLASES.map((c,i)=>({t:c,ok:i===e.c})),why:e.why,fixed:1};
}
function qConjBase(){
  const p=pick(PARES);
  const others=shuf(PARES.filter(x=>x.b!==p.b&&x.b!==p.a)).slice(0,3);
  return {tag:'Conjugados',q:`¿Cuál es la base conjugada de ${f(p.a)}?`,opts:shuf([{t:f(p.b),ok:true},...others.map(o=>({t:f(o.b)}))]),
    why:`Quita un H⁺: ${f(p.a)} → ${f(p.b)} (${p.bn}).`};
}
function qConjAcid(){
  const p=pick(PARES);
  const others=shuf(PARES.filter(x=>x.a!==p.a&&x.a!==p.b)).slice(0,3);
  return {tag:'Conjugados',q:`¿Cuál es el ácido conjugado de ${f(p.b)}?`,opts:shuf([{t:f(p.a),ok:true},...others.map(o=>({t:f(o.a)}))]),
    why:`Añade un H⁺: ${f(p.b)} → ${f(p.a)} (${p.an}).`};
}
function qMasFuerte(){
  const w=PARES.filter(p=>p.t==='AD'&&p.a!=='H2CO3'); const t=shuf(w).slice(0,3).sort((a,b)=>b.ka-a.ka);
  const txt=t.map(p=>`${f(p.a)} (K_a = ${num(p.ka)})`).join('; ');
  if(Math.random()<.5) return {tag:'Fuerza relativa',q:`¿Cuál de estos ácidos es el más fuerte?`,opts:shuf(t.map((p,i)=>({t:f(p.a),ok:i===0}))),why:`Más K_a = más fuerte. ${txt}.`};
  const d=t[t.length-1];
  return {tag:'Fuerza relativa',q:`¿Cuál de estas bases es la más fuerte?`,opts:shuf(t.map(p=>({t:f(p.b),ok:p===d}))),why:`La base conjugada más fuerte es la del ácido más débil: ${f(d.a)} (${num(d.ka)}) es el de menor K_a. ${txt}.`};
}
function qSal(){
  const s=pick(SALES), op=['ácida','neutra','básica'];
  return {tag:'pH de sales',q:`Se disuelve ${f(s[0])} en agua. La disolución resultante es…`,opts:op.map(o=>({t:o,ok:o===s[1]})),why:s[2],fixed:1};
}
const FIJAS=[
 {tag:'Fuerte vs concentrado',q:'Disolución A: HCl 0,001 M. Disolución B: ácido acético 1 M. ¿Cuál tiene el menor pH?',opts:[{t:'La B (acético 1 M): pH ≈ 2,4',ok:1},{t:'La A (HCl 0,001 M): pH = 3,0'},{t:'Las dos igual, porque son ácidos'},{t:'No se puede saber sin K_a'}],
  why:'HCl 0,001 M: pH = 3. Acético 1 M: x = √(1,8×10⁻⁵·1) = 4,2×10⁻³ → pH 2,4. El débil muy concentrado puede acidificar más que el fuerte muy diluido: fuerza ≠ concentración.'},
 {tag:'Constantes',q:'Un ácido HA tiene K_a = 1×10⁻⁵. ¿Cuánto vale K_b de A⁻?',opts:[{t:'1×10⁻⁹',ok:1},{t:'1×10⁻⁵'},{t:'1×10⁻¹⁹'},{t:'1×10⁻⁷'}],why:'K_b = K_w/K_a = 10⁻¹⁴/10⁻⁵ = 10⁻⁹.'},
 {tag:'pH',q:'Una disolución tiene pH = 3. ¿Cuánto vale [OH⁻]?',opts:[{t:'1×10⁻¹¹ M',ok:1},{t:'1×10⁻³ M'},{t:'1×10⁻⁷ M'},{t:'3×10⁻¹¹ M'}],why:'pOH = 14 − 3 = 11 → [OH⁻] = 10⁻¹¹ M.'},
 {tag:'Anfóteros',q:'¿Cuál de estas especies es anfótera (puede actuar como ácido y como base)?',opts:[{t:f('HCO3^-'),ok:1},{t:f('Cl^-')},{t:f('NH4^+')},{t:f('CO3^2-')}],why:'HCO₃⁻ puede ceder un H⁺ (→ CO₃²⁻) o captar uno (→ H₂CO₃). Las otras solo hacen una de las dos cosas.'},
 {tag:'Pares conjugados',q:'¿Cuál de estos es un par ácido-base conjugado?',opts:[{t:`${f('H2SO4')} / ${f('SO4^2-')}`},{t:`${f('NH4^+')} / ${f('NH3')}`,ok:1},{t:`${f('HCl')} / ${f('OH^-')}`},{t:`${f('H3O^+')} / ${f('OH^-')}`}],why:'Un par conjugado difiere en un solo H⁺. NH₄⁺/NH₃ lo cumple; H₂SO₄/SO₄²⁻ difiere en dos H⁺ (el par es H₂SO₄/HSO₄⁻).'},
 {tag:'Dilución',q:'Al diluir un ácido débil con agua, su grado de ionización…',opts:[{t:'aumenta',ok:1},{t:'disminuye'},{t:'no cambia'},{t:'pasa a ser 100 %'}],why:'Ley de dilución de Ostwald: al diluir, el equilibrio se desplaza hacia los iones. Aun así, la [H₃O⁺] total baja y el pH sube.'},
 {tag:'Ácidos dipróticos',q:'En el H₂SO₄ en agua, ¿qué ocurre con los dos H?',opts:[{t:'El primero se ioniza por completo; el segundo, solo en parte',ok:1},{t:'Los dos se ionizan por completo'},{t:'Ninguno se ioniza por completo'},{t:'El segundo es más fácil de perder que el primero'}],why:'H₂SO₄ → H⁺ + HSO₄⁻ (completa). HSO₄⁻ ⇌ H⁺ + SO₄²⁻ (K_a = 1,2×10⁻²).'},
 {tag:'Neutralización',q:'¿Qué produce la reacción entre un ácido y una base (neutralización) además de agua?',opts:[{t:'Una sal',ok:1},{t:'Un óxido'},{t:'Un hidruro'},{t:'Un gas siempre'}],why:'Ácido + hidróxido → sal + agua. Ej.: HCl + NaOH → NaCl + H₂O.'},
];
AB.testQs=function(n=10){
  const gens=[qClasificar,qClasificar,qConjBase,qConjAcid,qMasFuerte,qSal,qSal];
  const out=[], seen=new Set();
  const fijas=shuf(FIJAS).slice(0,3);
  fijas.forEach(q=>out.push(Object.assign({},q,{opts:shuf(q.opts.map(o=>Object.assign({},o)))})));
  let guard=0;
  while(out.length<n&&guard++<200){ const q=pick(gens)(); if(seen.has(q.q)) continue; seen.add(q.q); out.push(q); }
  return shuf(out);
};

/* ---------- problemas de pH ---------- */
const nf=(x,d=2)=>x.toFixed(d).replace('.',',');
const lg=x=>-Math.log10(x);
function pHAF(){
  const a=pick(['HCl','HNO3','HBr','HClO4']), c=pick([0.1,0.05,0.01,0.002,0.5,0.001,0.02]);
  const ph=lg(c);
  return {num:1,abs:0.05,tag:'Ácido fuerte',label:'pH',ans:ph,ansText:nf(ph),q:`Calcula el pH de ${f(a)} ${nf(c,c<0.01?3:2)} M (ácido fuerte).`,
    why:`Ácido fuerte: se ioniza por completo → [H₃O⁺] = c = ${num(c)} M.<br>pH = −log(${num(c)}) = <b>${nf(ph)}</b>`};
}
function pHBF(){
  const b=pick(['NaOH','KOH','Ba(OH)2','Ca(OH)2','LiOH']), c=pick([0.1,0.05,0.01,0.002,0.02]); const n=/\(OH\)2/.test(b)?2:1;
  const oh=n*c, poh=lg(oh), ph=14-poh;
  return {num:1,abs:0.05,tag:'Base fuerte',label:'pH',ans:ph,ansText:nf(ph),q:`Calcula el pH de ${f(b)} ${nf(c,c<0.01?3:2)} M (base fuerte).`,
    why:`${n===2?'Cada fórmula libera <b>2</b> OH⁻: [OH⁻] = 2·c = '+num(oh)+' M.':'Disociación completa: [OH⁻] = c = '+num(oh)+' M.'}<br>pOH = −log(${num(oh)}) = ${nf(poh)}<br>pH = 14 − ${nf(poh)} = <b>${nf(ph)}</b>`};
}
const ADS=[PARES[9],PARES[10],PARES[11],PARES[16]];  // acético, HCN, HClO, NH4+
function pHAD(){
  const p=pick(ADS), c=pick([0.1,0.05,0.2,0.5,0.01]);
  const x=(-p.ka+Math.sqrt(p.ka*p.ka+4*p.ka*c))/2, ph=lg(x), xa=Math.sqrt(p.ka*c);
  return {num:1,abs:0.05,tag:'Ácido débil',label:'pH',ans:ph,ansText:nf(ph),q:`Calcula el pH de ${f(p.a)} ${nf(c,2)} M. K_a = ${num(p.ka)}.`,
    why:`${f(p.a)} + ${f('H2O')} ⇌ ${f(p.b)} + ${f('H3O^+')}<br>K_a = x²/(c − x) ≈ x²/c → x = √(K_a·c) = √(${num(p.ka)} × ${nf(c)}) = ${num(xa)} M<br>Comprobación: x/c = ${nf(xa/c*100,1)} % &lt; 5 % ✔<br>pH = −log x = <b>${nf(ph)}</b>`};
}
const BDS=[PARES[16],PARES[18],PARES[19]];  // NH3, piridina, anilina
function pHBD(){
  const p=pick(BDS), c=pick([0.1,0.05,0.2,0.5,0.01]);
  const x=(-p.kb+Math.sqrt(p.kb*p.kb+4*p.kb*c))/2, poh=lg(x), ph=14-poh, xa=Math.sqrt(p.kb*c);
  return {num:1,abs:0.05,tag:'Base débil',label:'pH',ans:ph,ansText:nf(ph),q:`Calcula el pH de ${f(p.b)} ${nf(c,2)} M. K_b = ${num(p.kb)}.`,
    why:`${f(p.b)} + ${f('H2O')} ⇌ ${f(p.a)} + ${f('OH^-')}<br>x = [OH⁻] ≈ √(K_b·c) = √(${num(p.kb)} × ${nf(c)}) = ${num(xa)} M (${nf(xa/c*100,1)} % de c ✔)<br>pOH = ${nf(poh)} → pH = 14 − ${nf(poh)} = <b>${nf(ph)}</b>`};
}
const SALB=[[PARES[9],'CH3COONa'],[PARES[10],'NaCN'],[PARES[11],'NaClO']];
function pHSal(){
  const [p,s]=pick(SALB), c=pick([0.1,0.2,0.05,0.5]);
  const x=Math.sqrt(p.kb*c), poh=lg(x), ph=14-poh;
  return {num:1,abs:0.06,tag:'Sal básica',label:'pH',ans:ph,ansText:nf(ph),q:`Calcula el pH de ${f(s)} ${nf(c,2)} M. K_a(${f(p.a)}) = ${num(p.ka)}.`,
    why:`El Na⁺ es espectador; ${f(p.b)} es la base conjugada de un ácido débil.<br>K_b = K_w/K_a = ${num(KW)}/${num(p.ka)} = ${num(p.kb)}<br>[OH⁻] ≈ √(K_b·c) = ${num(x)} M → pOH = ${nf(poh)}<br>pH = 14 − ${nf(poh)} = <b>${nf(ph)}</b>`};
}
function pHInv(){
  const ph=pick([2,2.5,3,3.5,4,4.5,5,9,10.5,11]), acid=ph<7;
  const h=Math.pow(10,-ph), oh=Math.pow(10,-(14-ph));
  return {num:1,tol:0.04,tag:'pH → concentración',label:'Concentración en M',ans:acid?h:oh,q:`Una disolución tiene pH = ${nf(ph,1)}. ¿Cuánto vale ${acid?'[H₃O⁺]':'[OH⁻]'} (en M)?`,
    why:acid?`[H₃O⁺] = 10<sup>−pH</sup> = 10<sup>−${nf(ph,1)}</sup> = <b>${num(h)}</b> M`:`pOH = 14 − ${nf(ph,1)} = ${nf(14-ph,1)} → [OH⁻] = 10<sup>−${nf(14-ph,1)}</sup> = <b>${num(oh)}</b> M`};
}
AB.phQs=function(n=8){
  const gens=[pHAF,pHAF,pHBF,pHAD,pHAD,pHBD,pHSal,pHInv];
  const out=[], seen=new Set(); let guard=0;
  while(out.length<n&&guard++<100){ const q=pick(gens)(); if(seen.has(q.q)) continue; seen.add(q.q); out.push(q); }
  return out;
};

g.AB=AB;
})(window);
