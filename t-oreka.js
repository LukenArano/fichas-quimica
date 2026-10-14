/* T2 · Equilibrio químico / Oreka kimikoa. Contenido bilingüe, generadores de práctica y ejercicios originales. */
(function(g){
'use strict';
const E=g.Estudio, K=g.Kimika, b=E.b, num=E.num, fix=E.fix, pick=E.pick, shuf=E.shuffle;
const RG=0.082;
const r=(a,c,d=2)=>+(a+Math.random()*(c-a)).toFixed(d);
const ax=(id,n,es,eu)=>`<a href="azterketak.html#${id}-${n}">${id.replace('-o',' ohikoa').replace('-e',' ez-ohikoa')} · ${n}</a>`;
const frac=(n,d)=>`<span class="frac"><span>${n}</span><span>${d}</span></span>`;
const opt=(t,ok)=>({t,ok:ok?1:0});
const mcq=(tag,q,ok,bad,why)=>({tag,q,opts:[opt(ok,1),...bad.map(x=>opt(x))],why});
const nq=(tag,q,ans,why,o={})=>Object.assign({num:true,tag,q,ans,why,tol:0.03},o);
const pickN=(arr,n)=>shuf(arr).slice(0,n);
const TAG={
  K:b('Constante K','K konstantea'), Q:b('Q frente a K','Q eta K'), lim:b('Reactivo limitante','Erreaktibo mugatzailea'), X:b('Conversión','Konbertsioa'),
  gas:b('Gases','Gasak'), kp:b('Kp y Kc','Kp eta Kc'), met:b('Método','Metodoa'), het:b('Heterogéneo','Heterogeneoa'), lc:b('Le Châtelier','Le Châtelier'),
};

/* ---------------- diagramas SVG ---------------- */
const svgTime=()=>{
  const W=520,H=210, x0=46,y0=170, w=440, h=140;
  const curve=(f)=>{ let d=''; for(let i=0;i<=60;i++){ const t=i/60; d+=(i?'L':'M')+(x0+t*w).toFixed(1)+' '+(y0-f(t)*h).toFixed(1); } return d; };
  const A=t=>0.9-0.55*(1-Math.exp(-t*7)), P=t=>0.62*(1-Math.exp(-t*7));
  const rf=t=>0.95*Math.exp(-t*6)+0.25*(1-Math.exp(-t*6)), rr=t=>0.25*(1-Math.exp(-t*6));
  return b(`<div class="figrow"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Concentraciones frente al tiempo">
   <g>${axes(x0,y0,w,h,'t','[ ]')}<path d="${curve(A)}" stroke="var(--c-azido)" stroke-width="3" fill="none"/><path d="${curve(P)}" stroke="var(--c-oreka)" stroke-width="3" fill="none"/>
   <rect x="${x0+w*0.55}" y="${y0-h}" width="${w*0.45}" height="${h}" fill="var(--accent)" opacity=".07"/><text x="${x0+w*0.78}" y="${y0-h+16}" text-anchor="middle" class="svgmono" font-size="12">EQUILIBRIO</text>
   <text x="${x0+8}" y="${y0-0.9*h-6}" class="svgtxt" font-size="17" fill="var(--c-azido)">reactivos</text><text x="${x0+w*0.3}" y="${y0-0.5*h+4}" class="svgtxt" font-size="17" fill="var(--c-oreka)">productos</text></g></svg>
   <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Velocidades frente al tiempo"><g>${axes(x0,y0,w,h,'t','r')}<path d="${curve(rf)}" stroke="var(--c-azido)" stroke-width="3" fill="none"/><path d="${curve(rr)}" stroke="var(--c-oreka)" stroke-width="3" fill="none" stroke-dasharray="7 5"/>
   <text x="${x0+12}" y="${y0-0.95*h+4}" class="svgtxt" font-size="17" fill="var(--c-azido)">r directa</text><text x="${x0+w*0.2}" y="${y0-0.05*h-8}" class="svgtxt" font-size="17" fill="var(--c-oreka)">r inversa</text>
   <text x="${x0+w*0.78}" y="${y0-0.25*h-10}" text-anchor="middle" class="svgtxt" font-size="13" font-weight="700">r<tspan font-size="10" dy="3">dir</tspan><tspan dy="-3"> = r</tspan><tspan font-size="10" dy="3">inv</tspan></text></g></svg></div>`,
  `<div class="figrow"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Kontzentrazioak denboraren arabera">
   <g>${axes(x0,y0,w,h,'t','[ ]')}<path d="${curve(A)}" stroke="var(--c-azido)" stroke-width="3" fill="none"/><path d="${curve(P)}" stroke="var(--c-oreka)" stroke-width="3" fill="none"/>
   <rect x="${x0+w*0.55}" y="${y0-h}" width="${w*0.45}" height="${h}" fill="var(--accent)" opacity=".07"/><text x="${x0+w*0.78}" y="${y0-h+16}" text-anchor="middle" class="svgmono" font-size="12">OREKA</text>
   <text x="${x0+8}" y="${y0-0.9*h-6}" class="svgtxt" font-size="17" fill="var(--c-azido)">erreaktiboak</text><text x="${x0+w*0.3}" y="${y0-0.5*h+4}" class="svgtxt" font-size="17" fill="var(--c-oreka)">produktuak</text></g></svg>
   <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Abiadurak denboraren arabera"><g>${axes(x0,y0,w,h,'t','r')}<path d="${curve(rf)}" stroke="var(--c-azido)" stroke-width="3" fill="none"/><path d="${curve(rr)}" stroke="var(--c-oreka)" stroke-width="3" fill="none" stroke-dasharray="7 5"/>
   <text x="${x0+12}" y="${y0-0.95*h+4}" class="svgtxt" font-size="17" fill="var(--c-azido)">r zuzena</text><text x="${x0+w*0.2}" y="${y0-0.05*h-8}" class="svgtxt" font-size="17" fill="var(--c-oreka)">r alderantzizkoa</text>
   <text x="${x0+w*0.78}" y="${y0-0.25*h-10}" text-anchor="middle" class="svgtxt" font-size="13" font-weight="700">r<tspan font-size="10" dy="3">zuz</tspan><tspan dy="-3"> = r</tspan><tspan font-size="10" dy="3">ald</tspan></text></g></svg></div>`);
};
function axes(x0,y0,w,h,xl,yl){ return `<line x1="${x0}" y1="${y0}" x2="${x0+w}" y2="${y0}" stroke="var(--ink-3)" stroke-width="1.5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0-h-8}" stroke="var(--ink-3)" stroke-width="1.5"/>
  <text x="${x0+w}" y="${y0+18}" text-anchor="end" class="svgmono" font-size="13">${xl}</text><text x="${x0-8}" y="${y0-h}" text-anchor="end" class="svgmono" font-size="13">${yl}</text>`; }

/* tabla de moles (ICE) como figura */
const iceTbl=(sp,rows,lbl)=>({head:[lbl[0],...sp],rows:rows});

/* diagrama de flujo del método (reactor rígido) */
const svgFlow=()=>{
  const mk=(L,eqs)=>{ let y=8, out='';
    L.forEach((t,i)=>{ const c=i===6?'var(--c-pila)':i===8?'var(--c-exam)':'var(--accent)';
      out+=`<rect x="10" y="${y}" width="400" height="50" rx="10" fill="var(--surface)" stroke="${c}" stroke-width="2"/>
        <circle cx="38" cy="${y+25}" r="15" fill="${c}"/><text x="38" y="${y+31}" text-anchor="middle" font-size="16" font-weight="700" fill="var(--surface)" class="svgtxt">${i+1}</text>
        <text x="64" y="${y+22}" class="svgtxt" font-size="17" font-weight="700">${t}</text><text x="64" y="${y+42}" class="svgmono" font-size="13">${eqs[i]}</text>`;
      if(i<L.length-1) out+=`<path d="M210 ${y+50} L210 ${y+64}" stroke="var(--ink-3)" stroke-width="2" marker-end="url(#fa)"/>`;
      y+=68; });
    return `<svg class="flow" viewBox="0 0 420 ${y}" role="img"><defs><marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)"/></marker></defs>${out}</svg>`; };
  const eqs=['aA + bB ⇌ cC + dD','n₀ (+ inerte)','nᵢ = nᵢ₀ + νᵢ·ξ','n_T = n_T0 + Δn·ξ','Pᵢ = nᵢRT/V  ·  [i] = nᵢ/V','K = f(ξ)','0 < ξ < ξmax','X, %vol, P_T, V…','Q vs K → nueva tabla'];
  return b(mk(['Ecuación ajustada','Moles iniciales','Tabla con ξ','Moles totales','Presiones o concentraciones','Ecuación de K','Resolver ξ (raíz física)','Lo que piden','¿Perturbación?'],eqs),
           mk(['Ekuazio doitua','Hasierako molak','Taula ξ-rekin','Mol totalak','Presioak edo kontzentrazioak','K-ren ekuazioa','ξ ebatzi (erro fisikoa)','Eskatzen dena','Perturbazioa?'],eqs));
};

/* ===================================================================
   UNIDADES
   =================================================================== */
const U=[];

/* ---------- U1 ---------- */
const RXK=[
  {eq:'N2(g) + 3H2(g) ⇌ 2NH3(g)', k:frac('[NH<sub>3</sub>]<sup>2</sup>','[N<sub>2</sub>][H<sub>2</sub>]<sup>3</sup>'), bad:[frac('[N<sub>2</sub>][H<sub>2</sub>]<sup>3</sup>','[NH<sub>3</sub>]<sup>2</sup>'),frac('2[NH<sub>3</sub>]','[N<sub>2</sub>]·3[H<sub>2</sub>]'),frac('[NH<sub>3</sub>]','[N<sub>2</sub>][H<sub>2</sub>]')]},
  {eq:'CaCO3(s) ⇌ CaO(s) + CO2(g)', k:'[CO<sub>2</sub>]', bad:[frac('[CaO][CO<sub>2</sub>]','[CaCO<sub>3</sub>]'),frac('[CaCO<sub>3</sub>]','[CO<sub>2</sub>]'),frac('[CaO]','[CaCO<sub>3</sub>]')]},
  {eq:'Fe3O4(s) + 4H2(g) ⇌ 3Fe(s) + 4H2O(g)', k:frac('[H<sub>2</sub>O]<sup>4</sup>','[H<sub>2</sub>]<sup>4</sup>'), bad:[frac('[Fe]<sup>3</sup>[H<sub>2</sub>O]<sup>4</sup>','[Fe<sub>3</sub>O<sub>4</sub>][H<sub>2</sub>]<sup>4</sup>'),frac('[H<sub>2</sub>O]','[H<sub>2</sub>]'),frac('[H<sub>2</sub>]<sup>4</sup>','[H<sub>2</sub>O]<sup>4</sup>')]},
  {eq:'2SO2(g) + O2(g) ⇌ 2SO3(g)', k:frac('[SO<sub>3</sub>]<sup>2</sup>','[SO<sub>2</sub>]<sup>2</sup>[O<sub>2</sub>]'), bad:[frac('[SO<sub>3</sub>]','[SO<sub>2</sub>][O<sub>2</sub>]'),frac('[SO<sub>2</sub>]<sup>2</sup>[O<sub>2</sub>]','[SO<sub>3</sub>]<sup>2</sup>'),frac('2[SO<sub>3</sub>]','2[SO<sub>2</sub>] + [O<sub>2</sub>]')]},
  {eq:'CH3COOH(aq) + H2O(l) ⇌ CH3COO^-(aq) + H3O^+(aq)', k:frac('[CH<sub>3</sub>COO<sup>−</sup>][H<sub>3</sub>O<sup>+</sup>]','[CH<sub>3</sub>COOH]'), bad:[frac('[CH<sub>3</sub>COO<sup>−</sup>][H<sub>3</sub>O<sup>+</sup>]','[CH<sub>3</sub>COOH][H<sub>2</sub>O]'),frac('[CH<sub>3</sub>COOH]','[CH<sub>3</sub>COO<sup>−</sup>][H<sub>3</sub>O<sup>+</sup>]'),'[CH<sub>3</sub>COO<sup>−</sup>][H<sub>3</sub>O<sup>+</sup>]']},
  {eq:'SF6(g) ⇌ SF4(g) + 2F(g)', k:frac('[SF<sub>4</sub>][F]<sup>2</sup>','[SF<sub>6</sub>]'), bad:[frac('[SF<sub>4</sub>]·2[F]','[SF<sub>6</sub>]'),frac('[SF<sub>6</sub>]','[SF<sub>4</sub>][F]<sup>2</sup>'),frac('[SF<sub>4</sub>][F]','[SF<sub>6</sub>]')]},
];
function q1expr(){ const x=pick(RXK); const hasS=/\((s|l)\)/.test(x.eq);
  return mcq(TAG.K,b(`Expresión de K<sub>c</sub> para: {${x.eq.replace(/\(([a-z]+)\)/g,'_($1)')}}`,`K<sub>c</sub>-ren adierazpena: {${x.eq.replace(/\(([a-z]+)\)/g,'_($1)')}}`),'K<sub>c</sub> = '+x.k,x.bad.map(t=>'K<sub>c</sub> = '+t),
    b('Productos arriba y reactivos abajo, cada uno elevado a su coeficiente. '+(hasS?'Los sólidos, líquidos puros y el disolvente (H₂O) no aparecen: su actividad es 1.':''),'Produktuak goian eta erreaktiboak behean, bakoitza bere koefizientera berretuta. '+(hasS?'Solidoak, likido puruak eta disolbatzailea (H₂O) ez dira agertzen: haien aktibitatea 1 da.':''))); }
function q1manip(){
  const K0=+(pick([2.5,4.6,1.8,6.3,3.3,8.0])*Math.pow(10,pick([-5,-3,-2,0,1,2]))).toPrecision(2);
  const ops=[
    [b('se invierte la ecuación','ekuazioa alderantzikatzen da'),1/K0,b('Invertir → K′ = 1/K.','Alderantzikatu → K′ = 1/K.')],
    [b('se multiplican todos los coeficientes por 2','koefiziente guztiak 2z biderkatzen dira'),K0*K0,b('Coeficientes × n → K′ = Kⁿ. Aquí K².','Koefizienteak × n → K′ = Kⁿ. Hemen K².')],
    [b('se dividen todos los coeficientes entre 2','koefiziente guztiak 2z zatitzen dira'),Math.sqrt(K0),b('Coeficientes × ½ → K′ = K<sup>1/2</sup> = √K.','Koefizienteak × ½ → K′ = K<sup>1/2</sup> = √K.')],
    [b('se invierte y se multiplica por 2','alderantzikatu eta 2z biderkatzen da'),1/(K0*K0),b('Invertir y ×2 → K′ = 1/K².','Alderantzikatu eta ×2 → K′ = 1/K².')],
  ];
  const [d,ans,why]=pick(ops);
  return nq(TAG.K,b(`Una reacción tiene K = ${num(K0)}. ¿Cuánto vale K′ si ${d.es}?`,`Erreakzio batek K = ${num(K0)} du. Zenbat da K′ ${d.eu}?`),ans,why);
}
function q1dir(){
  const Kv=+(pick([1.2,3.5,6,8.8])*Math.pow(10,pick([-4,-2,0,1,3]))).toPrecision(2);
  const f=pick([0.01,0.1,0.5,2,10,100]); const Qv=+(Kv*f).toPrecision(2);
  const R_=b('Hacia la derecha (se forman productos)','Eskuinera (produktuak sortzen dira)'), L_=b('Hacia la izquierda (se forman reactivos)','Ezkerrera (erreaktiboak sortzen dira)'), N_=b('No se desplaza: ya está en equilibrio','Ez da desplazatzen: orekan dago jada');
  const ok=Qv<Kv?R_:L_;
  return mcq(TAG.Q,b(`En un instante Q = ${num(Qv)} y K = ${num(Kv)}. ¿Hacia dónde evoluciona el sistema?`,`Une batean Q = ${num(Qv)} eta K = ${num(Kv)}. Nora eboluzionatzen du sistemak?`),ok,[Qv<Kv?L_:R_,N_],
    b(`Q ${Qv<Kv?'<':'>'} K: ${Qv<Kv?'hay menos productos de los que corresponden al equilibrio → avanza a la derecha':'hay más productos de los que corresponden al equilibrio → retrocede a la izquierda'}.`,`Q ${Qv<Kv?'<':'>'} K: ${Qv<Kv?'orekan egongo liratekeenak baino produktu gutxiago daude → eskuinera':'orekan egongo liratekeenak baino produktu gehiago daude → ezkerrera'}.`));
}
const C1=[
  ()=>mcq(TAG.K,b('¿De qué depende el valor de K?','Zeren menpe dago K-ren balioa?'),b('Solo de la temperatura (y de cómo se escribe la ecuación)','Tenperaturaren menpe bakarrik (eta ekuazioa nola idazten den)'),
     [b('De las concentraciones iniciales','Hasierako kontzentrazioen menpe'),b('De la presión total','Presio totalaren menpe'),b('Del catalizador','Katalizatzailearen menpe')],
     b('Con la misma ecuación ajustada, K solo cambia con T. Las concentraciones iniciales cambian el punto de equilibrio, no K.','Ekuazio doitu berarekin, K T-rekin bakarrik aldatzen da. Hasierako kontzentrazioek oreka-puntua aldatzen dute, ez K.')),
  ()=>mcq(TAG.K,b('En el equilibrio químico…','Oreka kimikoan…'),b('las velocidades directa e inversa son iguales y las concentraciones no cambian','zuzeneko eta alderantzizko erreakzioen abiadurak berdinak dira eta kontzentrazioak ez dira aldatzen'),
     [b('la reacción se detiene por completo','erreakzioa guztiz gelditzen da'),b('las concentraciones de reactivos y productos son iguales','erreaktiboen eta produktuen kontzentrazioak berdinak dira'),b('K vale siempre 1','K beti 1 da')],
     b('Es un equilibrio dinámico: las dos reacciones siguen ocurriendo a la misma velocidad.','Oreka dinamikoa da: bi erreakzioek abiadura berean jarraitzen dute.')),
  ()=>mcq(TAG.K,b('K = 1,0×10^-30 a 25 °C. Esto significa que…','K = 1,0×10^-30 25 °C-an. Horrek esan nahi du…'),b('en el equilibrio casi no hay productos','orekan ia ez dagoela produkturik'),
     [b('la reacción es muy rápida','erreakzioa oso azkarra dela'),b('en el equilibrio casi no hay reactivos','orekan ia ez dagoela erreaktiborik'),b('la reacción es irreversible hacia la derecha','erreakzioa eskuinera itzulezina dela')],
     b('K ≪ 1: el equilibrio está desplazado hacia los reactivos. K no dice nada de la velocidad.','K ≪ 1: oreka erreaktiboetara desplazatuta dago. K-k ez du abiaduraz ezer esaten.')),
  ()=>mcq(TAG.lc,b('¿Cuál de estas herramientas es <b>cuantitativa</b> para predecir el desplazamiento?','Zein da desplazamendua aurreikusteko tresna <b>kuantitatiboa</b>?'),b('Calcular Q y compararlo con K','Q kalkulatu eta K-rekin alderatu'),
     [b('El principio de Le Châtelier','Le Châtelierren printzipioa'),b('Mirar el color de la mezcla','Nahastearen kolorea begiratu'),b('Comparar las masas de reactivos y productos','Erreaktiboen eta produktuen masak alderatu')],
     b('Le Châtelier es cualitativo (dice hacia dónde). Q frente a K es cuantitativo y además permite calcular el nuevo equilibrio. (La diapositiva de los apuntes lo tiene al revés.)','Le Châtelier kualitatiboa da (nora esaten du). Q eta K alderatzea kuantitatiboa da eta oreka berria kalkulatzeko balio du. (Apunteetako diapositiban alderantziz dago.)')),
  ()=>mcq(TAG.K,b('Un catalizador añadido a un sistema en equilibrio…','Orekan dagoen sistema bati katalizatzailea gehitzean…'),b('no cambia K ni la composición de equilibrio; solo hace que se llegue antes','ez ditu K ez orekako konposizioa aldatzen; lehenago iristen da bakarrik'),
     [b('desplaza el equilibrio a la derecha','oreka eskuinera desplazatzen du'),b('aumenta K','K handitzen du'),b('aumenta la conversión máxima','gehieneko konbertsioa handitzen du')],
     b('Acelera por igual la reacción directa y la inversa.','Erreakzio zuzena eta alderantzizkoa berdin azkartzen ditu.')),
];
U.push({id:'o1',short:b('K y Q','K eta Q'),title:b('Equilibrio dinámico, K y Q','Oreka dinamikoa, K eta Q'),sub:b('Qué es el equilibrio, cómo se escribe K y cómo se predice el sentido de la reacción','Zer den oreka, K nola idazten den eta erreakzioaren noranzkoa nola aurreikusten den'),
blocks:[
  ['p',b('En la realidad <b>todas las reacciones son reversibles</b>: los reactivos dan productos y los productos vuelven a dar reactivos. Al principio la reacción directa es rápida y la inversa lenta; con el tiempo ambas velocidades se igualan. A partir de ese momento las concentraciones <b>ya no cambian</b>, aunque las dos reacciones siguen ocurriendo: es un <b>equilibrio dinámico</b>.','Errealitatean <b>erreakzio guztiak itzulgarriak dira</b>: erreaktiboek produktuak ematen dituzte eta produktuek berriz erreaktiboak. Hasieran erreakzio zuzena azkarra da eta alderantzizkoa motela; denborarekin bi abiadurak berdintzen dira. Une horretatik aurrera kontzentrazioak <b>ez dira aldatzen</b>, nahiz eta bi erreakzioek jarraitu: <b>oreka dinamikoa</b> da.')],
  ['svg',{svg:svgTime(),cap:b('Izquierda: concentraciones frente al tiempo. Derecha: velocidades directa e inversa. El equilibrio empieza cuando r<sub>dir</sub> = r<sub>inv</sub>.','Ezkerrean: kontzentrazioak denboraren arabera. Eskuinean: abiadura zuzena eta alderantzizkoa. Oreka r<sub>zuz</sub> = r<sub>ald</sub> denean hasten da.')}],
  ['f',{name:b('Ley de acción de masas (Guldberg y Waage)','Masa-ekintzaren legea (Guldberg eta Waage)'),f:'aA + bB ⇌ cC + dD &nbsp;→&nbsp; K<sub>c</sub> = '+frac('[C]<sup>c</sup>[D]<sup>d</sup>','[A]<sup>a</sup>[B]<sup>b</sup>'),
    vars:[['[i]',b('concentración molar <b>de equilibrio</b> de la especie i','i espeziearen <b>orekako</b> kontzentrazio molarra'),'mol/L'],['a, b, c, d',b('coeficientes estequiométricos de la ecuación ajustada','ekuazio doituko koefiziente estekiometrikoak'),''],['K<sub>c</sub>',b('constante de equilibrio en concentraciones','kontzentrazioetako oreka-konstantea'),'(mol/L)<sup>Δn</sup>']],
    use:b('Siempre que el sistema esté en equilibrio. Con las concentraciones de equilibrio se calcula K, o con K se calculan las concentraciones.','Sistema orekan dagoenean. Orekako kontzentrazioekin K kalkulatzen da, edo K-rekin kontzentrazioak.'),
    cond:b('Solo entran gases (g) y especies disueltas (aq). Los <b>sólidos, líquidos puros y el disolvente</b> no entran (actividad = 1). K depende solo de T y de cómo se escribe la ecuación.','Gasak (g) eta disolbatutako espezieak (aq) bakarrik sartzen dira. <b>Solidoak, likido puruak eta disolbatzailea</b> ez dira sartzen (aktibitatea = 1). K T-ren eta ekuazioa idazteko moduaren menpe bakarrik dago.'),
    err:b('Escribir coeficientes multiplicando en vez de como exponentes; poner productos abajo; incluir sólidos.','Koefizienteak biderkatzaile gisa idaztea berretzaile gisa idatzi beharrean; produktuak behean jartzea; solidoak sartzea.')}],
  ['tbl',{head:[b('Si a la ecuación le haces…','Ekuazioari hau egiten badiozu…'),b('la nueva constante es…','konstante berria…'),b('Ejemplo (N₂O₄ ⇌ 2NO₂, K = 4,64×10^-3)','Adibidea (N₂O₄ ⇌ 2NO₂, K = 4,64×10^-3)')],rows:[
    [b('invertirla','alderantzikatu'),'K′ = 1/K',b('2NO₂ ⇌ N₂O₄: K′ = 216','2NO₂ ⇌ N₂O₄: K′ = 216')],
    [b('multiplicar los coeficientes por n','koefizienteak n-z biderkatu'),'K′ = K<sup>n</sup>',b('½N₂O₄ ⇌ NO₂: K′ = √K = 0,068','½N₂O₄ ⇌ NO₂: K′ = √K = 0,068')],
    [b('sumar dos reacciones','bi erreakzio batu'),'K = K<sub>1</sub>·K<sub>2</sub>',b('las constantes se multiplican','konstanteak biderkatu egiten dira')]]}],
  ['key',b('<b>K ≫ 1</b>: en el equilibrio predominan los productos. <b>K ≪ 1</b>: predominan los reactivos. Cuando K es enorme (p. ej. una combustión) se trata la reacción como <b>irreversible</b>: avanza hasta agotar el reactivo limitante (X = 100 %).','<b>K ≫ 1</b>: orekan produktuak nagusitzen dira. <b>K ≪ 1</b>: erreaktiboak nagusitzen dira. K oso handia denean (adib. errekuntza batean) erreakzioa <b>itzulezintzat</b> hartzen da: erreaktibo mugatzailea agortu arte aurreratzen da (X = % 100).')],
  ['f',{name:b('Cociente de reacción','Erreakzio-zatidura'),f:b('Q = '+frac('[C]<sub>t</sub><sup>c</sup>[D]<sub>t</sub><sup>d</sup>','[A]<sub>t</sub><sup>a</sup>[B]<sub>t</sub><sup>b</sup>')+' &nbsp; (misma forma que K, en cualquier instante t)','Q = '+frac('[C]<sub>t</sub><sup>c</sup>[D]<sub>t</sub><sup>d</sup>','[A]<sub>t</sub><sup>a</sup>[B]<sub>t</sub><sup>b</sup>')+' &nbsp; (K-ren forma bera, edozein t unetan)'),
    use:b('Para saber si un sistema está en equilibrio y hacia dónde va a evolucionar: <b>Q &lt; K → derecha</b> · <b>Q = K → equilibrio</b> · <b>Q &gt; K → izquierda</b>.','Sistema bat orekan dagoen eta nora eboluzionatuko duen jakiteko: <b>Q &lt; K → eskuinera</b> · <b>Q = K → oreka</b> · <b>Q &gt; K → ezkerrera</b>.'),
    err:b('En castellano se llama <b>cociente de reacción</b> (la traducción de los apuntes dice «fracción de reacción»).','Gaztelaniaz <b>cociente de reacción</b> esaten zaio (apunteen itzulpenak «fracción de reacción» dio).')}],
  ['lab','qk',{lq:-1,lk:1}],
  ['ex',{title:b('Manipular K y predecir el sentido','K manipulatu eta noranzkoa aurreikusi'),q:b('Para N₂O₄(g) ⇌ 2NO₂(g), K<sub>c</sub> = 4,64×10^-3 a 25 °C. (a) ¿Cuánto vale K para 2NO₂ ⇌ N₂O₄? (b) Un recipiente contiene [N₂O₄] = 0,050 M y [NO₂] = 0,030 M. ¿Está en equilibrio? ¿Hacia dónde evoluciona?','N₂O₄(g) ⇌ 2NO₂(g) erreakziorako, K<sub>c</sub> = 4,64×10^-3 25 °C-an. (a) Zenbat da K 2NO₂ ⇌ N₂O₄ erreakziorako? (b) Ontzi batean [N₂O₄] = 0,050 M eta [NO₂] = 0,030 M daude. Orekan al dago? Nora eboluzionatzen du?'),
    steps:[b('(a) La ecuación pedida es la inversa → K′ = 1/K = 1/(4,64×10^-3) = <b>216</b>.','(a) Eskatutako ekuazioa alderantzizkoa da → K′ = 1/K = 1/(4,64×10^-3) = <b>216</b>.'),
      b('(b) Calculo Q con las concentraciones de ese instante: Q = [NO₂]²/[N₂O₄] = 0,030²/0,050 = 0,018.','(b) Q une horretako kontzentrazioekin kalkulatzen dut: Q = [NO₂]²/[N₂O₄] = 0,030²/0,050 = 0,018.'),
      b('Comparo: Q = 0,018 &gt; K = 0,00464 → hay «demasiado» NO₂.','Alderatu: Q = 0,018 &gt; K = 0,00464 → NO₂ «gehiegi» dago.'),
      b('El sistema evoluciona hacia la <b>izquierda</b>: parte del NO₂ se convierte en N₂O₄ hasta que Q = K.','Sistemak <b>ezkerrera</b> eboluzionatzen du: NO₂-aren zati bat N₂O₄ bihurtzen da Q = K izan arte.')],
    res:b('K′ = 216; Q &gt; K → hacia la izquierda.','K′ = 216; Q &gt; K → ezkerrera.')}],
  ['fix',b('Diapositiva de Le Châtelier (T2): dice «cuantitativamente → Le Châtelier; cualitativamente → comparar Q y K». Es al revés: <b>Le Châtelier es cualitativo</b> y la <b>comparación Q–K es cuantitativa</b> (la propia diapositiva tiene «(???)»).','Le Châtelierren diapositiba (T2): «kuantitatiboki → Le Châtelier; kualitatiboki → Q eta K alderatu» dio. Alderantziz da: <b>Le Châtelier kualitatiboa da</b> eta <b>Q–K konparazioa kuantitatiboa</b> (diapositibak berak «(???)» du).')],
  ['terms',[[b('equilibrio dinámico','equilibrio dinámico'),'oreka dinamikoa'],['constante de equilibrio','oreka-konstantea'],['cociente de reacción','erreakzio-zatidura'],['ley de acción de masas','masa-ekintzaren legea'],['reversible / irreversible','itzulgarria / itzulezina']]],
],
quiz:()=>[q1expr(),q1expr(),q1manip(),q1manip(),q1dir(),q1dir(),...pickN(C1,3).map(f=>f())],
cards:[
  [b('¿Qué es un equilibrio dinámico?','Zer da oreka dinamikoa?'),b('Estado en el que r<sub>directa</sub> = r<sub>inversa</sub>: las concentraciones son constantes, pero las dos reacciones siguen ocurriendo.','r<sub>zuzena</sub> = r<sub>alderantzizkoa</sub> den egoera: kontzentrazioak konstanteak dira, baina bi erreakzioek jarraitzen dute.')],
  [b('¿Qué especies NO entran en K?','Zein espezie EZ dira K-n sartzen?'),b('Sólidos, líquidos puros y el disolvente (agua). Su actividad es 1.','Solidoak, likido puruak eta disolbatzailea (ura). Haien aktibitatea 1 da.')],
  [b('K de la reacción inversa','Alderantzizko erreakzioaren K'),'K′ = 1/K'],
  [b('K si multiplico los coeficientes por n','K koefizienteak n-z biderkatzen baditut'),'K′ = K<sup>n</sup>'],
  [b('Q < K, Q = K, Q > K','Q < K, Q = K, Q > K'),b('Q < K → derecha · Q = K → equilibrio · Q > K → izquierda','Q < K → eskuinera · Q = K → oreka · Q > K → ezkerrera')],
  [b('¿De qué depende K?','Zeren menpe dago K?'),b('Solo de T (y de cómo se escribe la ecuación). No de las concentraciones iniciales, ni de P, ni del catalizador.','T-ren menpe bakarrik (eta ekuazioa nola idazten den). Ez hasierako kontzentrazioen, ez P-ren, ez katalizatzailearen menpe.')],
]});

/* ---------- U2 ---------- */
const RXL=[
  {eq:'N2 + 3H2 → 2NH3',A:'N2',B:'H2',a:1,b:3,P:'NH3',p:2},
  {eq:'CO + 2H2 → CH3OH',A:'CO',B:'H2',a:1,b:2,P:'CH3OH',p:1},
  {eq:'2SO2 + O2 → 2SO3',A:'SO2',B:'O2',a:2,b:1,P:'SO3',p:2},
  {eq:'CH4 + 2O2 → CO2 + 2H2O',A:'CH4',B:'O2',a:1,b:2,P:'CO2',p:1},
];
function q2lim(){ const x=pick(RXL); let nA=r(0.5,4,1), nB=r(0.5,6,1); if(Math.abs(nA/x.a-nB/x.b)<0.05) nB+=0.7;
  const limA=nA/x.a<nB/x.b;
  return mcq(TAG.lim,b(`Para {${x.eq}} se mezclan ${fix(nA,1)} mol de {${x.A}} y ${fix(nB,1)} mol de {${x.B}}. ¿Cuál es el reactivo limitante?`,`{${x.eq}} erreakziorako ${fix(nA,1)} mol {${x.A}} eta ${fix(nB,1)} mol {${x.B}} nahasten dira. Zein da erreaktibo mugatzailea?`),
    `{${limA?x.A:x.B}}`,[`{${limA?x.B:x.A}}`,b('Ninguno: están en proporción estequiométrica','Bat ere ez: proportzio estekiometrikoan daude')],
    b(`Divide moles entre coeficiente: {${x.A}} ${fix(nA,1)}/${x.a} = ${fix(nA/x.a,2)}; {${x.B}} ${fix(nB,1)}/${x.b} = ${fix(nB/x.b,2)}. El menor es el limitante.`,`Zatitu molak koefizientez: {${x.A}} ${fix(nA,1)}/${x.a} = ${fix(nA/x.a,2)}; {${x.B}} ${fix(nB,1)}/${x.b} = ${fix(nB/x.b,2)}. Txikiena da mugatzailea.`)); }
function q2conv(){ const x=pick(RXL); const n0=r(1,5,1), X=pick([0.25,0.4,0.6,0.75,0.82,0.9]); const nf=n0*(1-X);
  return nq(TAG.X,b(`Se parte de ${fix(n0,1)} mol del reactivo limitante y en el equilibrio quedan ${fix(nf,3)} mol. Conversión X (en %):`,`Erreaktibo mugatzailearen ${fix(n0,1)} moletik abiatzen da eta orekan ${fix(nf,3)} mol geratzen dira. Konbertsioa X (%-tan):`),X*100,
    b(`X = (n₀ − n)/n₀ = (${fix(n0,1)} − ${fix(nf,3)})/${fix(n0,1)} = ${fix(X*100,1)} %.`,`X = (n₀ − n)/n₀ = (${fix(n0,1)} − ${fix(nf,3)})/${fix(n0,1)} = % ${fix(X*100,1)}.`),{tol:0.02,label:'X (%)'}); }
function q2prod(){ const x=pick(RXL); const nB=r(1,6,1), X=pick([0.3,0.5,0.6,0.8]); const nA=nB/x.b*x.a*1.6;
  const xi=X*nB/x.b, ans=x.p*xi;
  return nq(TAG.X,b(`{${x.eq}}: se parten de ${fix(nA,2)} mol de {${x.A}} y ${fix(nB,1)} mol de {${x.B}} (limitante). Si X = ${X*100} %, ¿cuántos moles de {${x.P}} se forman?`,`{${x.eq}}: ${fix(nA,2)} mol {${x.A}} eta ${fix(nB,1)} mol {${x.B}} (mugatzailea). X = % ${X*100} bada, zenbat mol {${x.P}} sortzen dira?`),ans,
    b(`Reaccionan X·n₀ = ${fix(X*nB,3)} mol de {${x.B}} → ξ = ${fix(X*nB,3)}/${x.b} = ${fix(xi,3)} mol → n({${x.P}}) = ${x.p}·ξ = ${fix(ans,3)} mol.`,`X·n₀ = ${fix(X*nB,3)} mol {${x.B}} erreakzionatzen dute → ξ = ${fix(X*nB,3)}/${x.b} = ${fix(xi,3)} mol → n({${x.P}}) = ${x.p}·ξ = ${fix(ans,3)} mol.`),{label:'mol'}); }
const C2=[
  ()=>mcq(TAG.X,b('La conversión X de una reacción se calcula respecto…','Erreakzio baten X konbertsioa honi buruz kalkulatzen da…'),b('al reactivo limitante','erreaktibo mugatzaileari'),[b('al reactivo en exceso','soberan dagoen erreaktiboari'),b('al producto principal','produktu nagusiari'),b('a la mezcla total','nahaste osoari')],
    b('X = moles de limitante que reaccionan / moles iniciales de limitante. En el examen 2024-25 ext. el limitante era el H₂O.','X = erreakzionatzen duten mugatzailearen molak / mugatzailearen hasierako molak. 2024-25 ez-ohikoan mugatzailea H₂O zen.')),
  ()=>mcq(TAG.lim,b('La relación entre las cantidades de reactivos y productos que da una ecuación ajustada es…','Ekuazio doitu batek ematen duen erreaktiboen eta produktuen arteko erlazioa…'),b('molar (moles)','molarra (molak)'),[b('másica (gramos)','masikoa (gramoak)'),b('volumétrica siempre, también en líquidos','bolumetrikoa beti, likidoetan ere'),b('de concentraciones en % masa','% masako kontzentrazioena')],
    b('Los coeficientes cuentan partículas → moles. Primero pasa los gramos a moles.','Koefizienteek partikulak zenbatzen dituzte → molak. Lehenik gramoak moletara pasa.')),
  ()=>mcq(TAG.X,b('En una reacción reversible que ha alcanzado el equilibrio…','Oreka lortu duen erreakzio itzulgarri batean…'),b('X < 100 %: queda reactivo limitante sin reaccionar','X < % 100: erreaktibo mugatzailea geratzen da erreakzionatu gabe'),[b('X = 100 % siempre','X = % 100 beti'),b('el limitante se agota y K = 0','mugatzailea agortzen da eta K = 0'),b('X no se puede calcular','X ezin da kalkulatu')],
    b('Solo si K es enorme (reacción «irreversible») se agota el limitante.','K oso handia denean bakarrik («itzulezina») agortzen da mugatzailea.')),
];
U.push({id:'o2',short:b('Conversión','Konbertsioa'),title:b('Reactivo limitante, avance y conversión','Erreaktibo mugatzailea, aurrerapena eta konbertsioa'),sub:b('La tabla de moles con ξ: la herramienta que usarás en todos los problemas','ξ-dun mol-taula: problema guztietan erabiliko duzun tresna'),
blocks:[
  ['p',b('Los coeficientes de una ecuación ajustada indican una relación <b>molar</b>, no másica. Por eso todo problema empieza pasando datos (gramos, litros, % en volumen…) a <b>moles</b>.','Ekuazio doitu baten koefizienteek erlazio <b>molarra</b> adierazten dute, ez masikoa. Horregatik problema guztiak datuak (gramoak, litroak, bolumen-%…) <b>moletara</b> pasatuz hasten dira.')],
  ['f',{name:b('Reactivo limitante (E.M.)','Erreaktibo mugatzailea (E.M.)'),f:b('el de menor &nbsp;n<sub>i,0</sub> / |ν<sub>i</sub>|','n<sub>i,0</sub> / |ν<sub>i</sub>| txikiena duena'),
    vars:[['n<sub>i,0</sub>',b('moles iniciales del reactivo i','i erreaktiboaren hasierako molak'),'mol'],['ν<sub>i</sub>',b('coeficiente estequiométrico (negativo para reactivos)','koefiziente estekiometrikoa (negatiboa erreaktiboentzat)'),'']],
    use:b('Siempre antes de hablar de conversión. Si los cocientes son iguales, los reactivos están en proporción estequiométrica y ambos son limitantes.','Konbertsioaz hitz egin aurretik beti. Zatidurak berdinak badira, erreaktiboak proportzio estekiometrikoan daude eta biak dira mugatzaileak.')}],
  ['f',{name:b('Avance de reacción y conversión','Erreakzioaren aurrerapena eta konbertsioa'),f:'n<sub>i</sub> = n<sub>i,0</sub> + ν<sub>i</sub>·ξ &nbsp;&nbsp;·&nbsp;&nbsp; X = '+frac('n<sub>EM,0</sub> − n<sub>EM</sub>','n<sub>EM,0</sub>')+' = '+frac('|ν<sub>EM</sub>|·ξ','n<sub>EM,0</sub>'),
    vars:[['ξ',b('avance (moles de «reacción» tal como está escrita). Los apuntes lo llaman x','aurrerapena (idatzita dagoen «erreakzioaren» molak). Apunteek x deitzen diote'),'mol'],['X',b('fracción del limitante que ha reaccionado','erreakzionatu duen mugatzailearen frakzioa'),'– o %']],
    use:b('Una sola incógnita (ξ) describe toda la composición. Si conoces X, conoces ξ, y al revés.','Ezezagun bakar batek (ξ) konposizio osoa deskribatzen du. X ezagutzen baduzu, ξ ezagutzen duzu, eta alderantziz.'),
    err:b('Calcular X con el reactivo en exceso; olvidar el coeficiente al pasar de ξ a moles.','X soberako erreaktiboarekin kalkulatzea; ξ-tik moletara pasatzean koefizientea ahaztea.')}],
  ['steps',[b('Escribe y <b>ajusta</b> la ecuación.','Idatzi eta <b>doitu</b> ekuazioa.'),b('Columna <b>inicial</b>: moles de cada especie, también productos iniciales e inertes.','<b>Hasierako</b> zutabea: espezie bakoitzaren molak, hasierako produktuak eta geldoak barne.'),b('Columna <b>cambio</b>: ν<sub>i</sub>·ξ (− para reactivos, + para productos).','<b>Aldaketa</b> zutabea: ν<sub>i</sub>·ξ (− erreaktiboentzat, + produktuentzat).'),b('Columna <b>equilibrio</b>: n<sub>i,0</sub> + ν<sub>i</sub>ξ. Suma: n<sub>T</sub> = n<sub>T,0</sub> + Δn<sub>gas</sub>·ξ.','<b>Oreka</b> zutabea: n<sub>i,0</sub> + ν<sub>i</sub>ξ. Batura: n<sub>T</sub> = n<sub>T,0</sub> + Δn<sub>gas</sub>·ξ.'),b('Comprueba que ningún n<sub>i</sub> sale negativo: 0 &lt; ξ &lt; n<sub>EM,0</sub>/|ν<sub>EM</sub>|.','Egiaztatu n<sub>i</sub> bat ere ez dela negatiboa: 0 &lt; ξ &lt; n<sub>EM,0</sub>/|ν<sub>EM</sub>|.')],b('Tabla de moles en 5 pasos','Mol-taula 5 urratsetan')],
  ['ex',{title:b('Preparación de la mezcla de un examen (2022-23 ordinaria)','Azterketa bateko nahastea prestatzea (2022-23 ohikoa)'),
    q:b('Se usan 28,7 L de aire en condiciones normales (78 % N₂ en volumen) y 2,5 mol de una mezcla 80 % H₂ / 20 % Ar. Reacción: N₂ + 3H₂ ⇌ 2NH₃. En el equilibrio la conversión es del 82 %. Construye la tabla de moles.','28,7 L aire erabiltzen dira baldintza normaletan (% 78 N₂ bolumenean) eta 2,5 mol nahaste (% 80 H₂ / % 20 Ar). Erreakzioa: N₂ + 3H₂ ⇌ 2NH₃. Orekan konbertsioa % 82 da. Egin mol-taula.'),
    steps:[b('N₂: V = 0,78·28,7 = 22,39 L; en c.n. 1 mol ocupa 22,4 L → n = 22,39/22,4 = <b>1,00 mol</b>.','N₂: V = 0,78·28,7 = 22,39 L; b.n.-tan mol batek 22,4 L hartzen ditu → n = 22,39/22,4 = <b>1,00 mol</b>.'),
      b('H₂ = 0,80·2,5 = <b>2,0 mol</b>; Ar = 0,50 mol (inerte: está en la tabla pero no reacciona).','H₂ = 0,80·2,5 = <b>2,0 mol</b>; Ar = 0,50 mol (geldoa: taulan dago baina ez du erreakzionatzen).'),
      b('Limitante: N₂ → 1,00/1 = 1,00; H₂ → 2,0/3 = 0,667 → <b>H₂</b>.','Mugatzailea: N₂ → 1,00/1 = 1,00; H₂ → 2,0/3 = 0,667 → <b>H₂</b>.'),
      b('X = 0,82 → reaccionan 0,82·2,0 = 1,64 mol H₂ → ξ = 1,64/3 = 0,547 mol.','X = 0,82 → 0,82·2,0 = 1,64 mol H₂ erreakzionatzen dute → ξ = 1,64/3 = 0,547 mol.'),
      b('Equilibrio: N₂ = 1,00 − 0,547 = 0,453; H₂ = 2,0 − 1,64 = 0,360; NH₃ = 2·0,547 = 1,093; Ar = 0,500 → n<sub>T</sub> = 2,406 mol.','Oreka: N₂ = 1,00 − 0,547 = 0,453; H₂ = 2,0 − 1,64 = 0,360; NH₃ = 2·0,547 = 1,093; Ar = 0,500 → n<sub>T</sub> = 2,406 mol.')],
    res:b('% vol (= % mol): N₂ 18,8 · H₂ 15,0 · NH₃ 45,4 · Ar 20,8 (coincide con la solución oficial).','Bolumen-% (= mol-%): N₂ 18,8 · H₂ 15,0 · NH₃ 45,4 · Ar 20,8 (ebazpen ofizialarekin bat dator).'),
    check:b('n<sub>T</sub> = n<sub>T,0</sub> + Δn·ξ = 3,50 + (−2)(0,547) = 2,406 ✓.','n<sub>T</sub> = n<sub>T,0</sub> + Δn·ξ = 3,50 + (−2)(0,547) = 2,406 ✓.')}],
  ['warn',b('El inerte (N₂, Ar) <b>no aparece en K</b>, pero sí cuenta en los moles totales y en la presión total.','Geldoa (N₂, Ar) <b>ez da K-n agertzen</b>, baina mol totaletan eta presio totalean bai.')],
  ['exam',b(`La tabla con ξ aparece en todos los problemas de equilibrio: ${ax('2022-23-o',1)}, ${ax('2023-24-o',1)}, ${ax('2024-25-e',1)}…`,`ξ-dun taula oreka-problema guztietan agertzen da: ${ax('2022-23-o',1)}, ${ax('2023-24-o',1)}, ${ax('2024-25-e',1)}…`)],
  ['terms',[['reactivo limitante','erreaktibo mugatzailea'],['reactivo en exceso','soberako erreaktiboa'],['avance de reacción','erreakzioaren aurrerapena'],['conversión','konbertsioa'],['condiciones normales','baldintza normalak']]],
],
quiz:()=>[q2lim(),q2lim(),q2conv(),q2conv(),q2prod(),q2prod(),...pickN(C2,2).map(f=>f())],
cards:[
  [b('¿Cómo identifico el reactivo limitante?','Nola identifikatzen dut erreaktibo mugatzailea?'),b('El de menor n₀/coeficiente.','n₀/koefiziente txikiena duena.')],
  [b('Definición de conversión X','X konbertsioaren definizioa'),'X = (n<sub>EM,0</sub> − n<sub>EM</sub>)/n<sub>EM,0</sub>'],
  [b('Moles de i en función de ξ','i-ren molak ξ-ren funtzioan'),'n<sub>i</sub> = n<sub>i,0</sub> + ν<sub>i</sub>ξ'],
  [b('Moles totales de gas en función de ξ','Gas-mol totalak ξ-ren funtzioan'),'n<sub>T</sub> = n<sub>T,0</sub> + Δn<sub>gas</sub>·ξ'],
  [b('Volumen molar en condiciones normales','Bolumen molarra baldintza normaletan'),b('22,4 L/mol (0 °C, 1 atm)','22,4 L/mol (0 °C, 1 atm)')],
]});

/* ---------- U3 ---------- */
const RXD=[['N2 + 3H2 ⇌ 2NH3',-2],['2SO2 + O2 ⇌ 2SO3',-1],['CO + H2O ⇌ CO2 + H2',0],['SF6 ⇌ SF4 + 2F',2],['CO + 2H2 ⇌ CH3OH',-2],['N2O4 ⇌ 2NO2',1],['PCl5 ⇌ PCl3 + Cl2',1],['CaCO3(s) ⇌ CaO(s) + CO2',1],['Fe3O4(s) + 4H2 ⇌ 3Fe(s) + 4H2O',0]];
function q3kp(){ const [eq,dn]=pick(RXD.filter(x=>x[1]!==0)); const T=pick([500,600,700,850,1000,1200]); const Kc=+(pick([1.5,2.4,3.6,5.2,8.1])*Math.pow(10,pick([-3,-1,0,1,2]))).toPrecision(2);
  const Kp=Kc*Math.pow(RG*T,dn);
  return nq(TAG.kp,b(`{${eq}} (todo gas salvo indicación). K<sub>c</sub> = ${num(Kc)} a ${T} K. Calcula K<sub>p</sub>.`,`{${eq}} (dena gasa, adierazi ezean). K<sub>c</sub> = ${num(Kc)} ${T} K-ean. Kalkulatu K<sub>p</sub>.`),Kp,
    b(`Δn<sub>gas</sub> = ${dn}. K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup> = ${num(Kc)}·(0,082·${T})<sup>${dn}</sup> = ${num(Kp)}.`,`Δn<sub>gas</sub> = ${dn}. K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup> = ${num(Kc)}·(0,082·${T})<sup>${dn}</sup> = ${num(Kp)}.`)); }
function q3dn(){ const [eq,dn]=pick(RXD); const all=[-2,-1,0,1,2];
  return mcq(TAG.kp,b(`Δn<sub>gas</sub> para {${eq}}:`,`Δn<sub>gas</sub> {${eq}} erreakziorako:`),'Δn = '+dn,shuf(all.filter(v=>v!==dn)).slice(0,3).map(v=>'Δn = '+v),
    b('Δn = Σ coeficientes de productos gaseosos − Σ coeficientes de reactivos gaseosos. Los sólidos no cuentan.','Δn = gas-egoerako produktuen koefizienteen batura − gas-egoerako erreaktiboen koefizienteen batura. Solidoak ez dira kontuan hartzen.')); }
function q3pi(){ const n=[r(0.5,3,2),r(0.5,3,2),r(0.2,1.5,2)], V=pick([2,5,10,20]), T=pick([400,500,600,800]); const i=pick([0,1,2]); const nm=['CO','H2O','N2'][i];
  const Pi=n[i]*RG*T/V;
  return nq(TAG.gas,b(`Una mezcla con ${fix(n[0],2)} mol CO, ${fix(n[1],2)} mol H₂O y ${fix(n[2],2)} mol N₂ ocupa ${V} L a ${T} K. Presión parcial de {${nm}} (atm):`,`${fix(n[0],2)} mol CO, ${fix(n[1],2)} mol H₂O eta ${fix(n[2],2)} mol N₂ dituen nahaste batek ${V} L hartzen ditu ${T} K-ean. {${nm}}-ren presio partziala (atm):`),Pi,
    b(`P<sub>i</sub> = n<sub>i</sub>RT/V = ${fix(n[i],2)}·0,082·${T}/${V} = ${fix(Pi,3)} atm (o bien y<sub>i</sub>·P<sub>T</sub>).`,`P<sub>i</sub> = n<sub>i</sub>RT/V = ${fix(n[i],2)}·0,082·${T}/${V} = ${fix(Pi,3)} atm (edo y<sub>i</sub>·P<sub>T</sub>).`),{label:'atm'}); }
function q3rise(){ const nu=pick([1,2]); const X=pick([0.2,0.3,0.4,0.5,0.6]); const P0=r(1,6,1);
  const eq=nu===1?'PCl5 ⇌ PCl3 + Cl2':'SF6 ⇌ SF4 + 2F'; const P1=P0*(1+nu*X);
  return nq(TAG.gas,b(`En un recipiente rígido a T constante se introduce solo el reactivo de {${eq}} a ${fix(P0,1)} atm. En el equilibrio P = ${fix(P1,3)} atm. Conversión X (%):`,`Ontzi zurrun batean, T konstantean, {${eq}} erreakzioaren erreaktiboa bakarrik sartzen da ${fix(P0,1)} atm-tan. Orekan P = ${fix(P1,3)} atm. Konbertsioa X (%):`),X*100,
    b(`V y T constantes → P ∝ n<sub>T</sub>. n<sub>T</sub> = n₀(1 + ${nu}X) → P/P₀ = 1 + ${nu}X = ${fix(P1/P0,3)} → X = ${fix(X*100,1)} %.`,`V eta T konstante → P ∝ n<sub>T</sub>. n<sub>T</sub> = n₀(1 + ${nu}X) → P/P₀ = 1 + ${nu}X = ${fix(P1/P0,3)} → X = % ${fix(X*100,1)}.`),{tol:0.02,label:'X (%)'}); }
const C3=[
  ()=>mcq(TAG.gas,b('Un gas inerte presente en el reactor…','Erreaktorean dagoen gas geldo bat…'),b('cuenta en n<sub>T</sub> y en P<sub>T</sub>, pero no aparece en K','n<sub>T</sub>-n eta P<sub>T</sub>-n kontatzen da, baina ez da K-n agertzen'),[b('no cuenta en nada','ez da ezertan kontatzen'),b('aparece en el denominador de K','K-ren izendatzailean agertzen da'),b('cambia el valor de K','K-ren balioa aldatzen du')],
    b('Sus moles suman a la presión total (Dalton) y a la fracción molar de los demás.','Gas geldoaren molak presio osoan kontuan hartzen dira (Dalton), eta gainerako gasen frakzio molarrak txikitzen dituzte.')),
  ()=>mcq(TAG.gas,b('Para gases ideales, el % en volumen de una mezcla coincide con…','Gas idealentzat, nahaste baten bolumen-% honen berdina da…'),b('el % en moles (fracción molar × 100)','mol-% (frakzio molarra × 100)'),[b('el % en masa','masa-%'),b('la presión total','presio totala'),b('la densidad','dentsitatea')],
    b('A P y T iguales, volumen ∝ moles (Avogadro).','P eta T berdinetan, bolumena ∝ molak (Avogadro).')),
  ()=>mcq(TAG.kp,b('¿Cuándo K<sub>p</sub> = K<sub>c</sub>?','Noiz K<sub>p</sub> = K<sub>c</sub>?'),b('Cuando Δn<sub>gas</sub> = 0','Δn<sub>gas</sub> = 0 denean'),[b('Siempre a 25 °C','Beti 25 °C-an'),b('Cuando hay un inerte','Geldo bat dagoenean'),b('Nunca','Inoiz ez')],
    b('K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>; si Δn = 0, el factor vale 1 (p. ej. CO + H₂O ⇌ CO₂ + H₂).','K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>; Δn = 0 bada, faktorea 1 da (adib. CO + H₂O ⇌ CO₂ + H₂).')),
];
U.push({id:'o3',short:b('Gases y Kp','Gasak eta Kp'),title:b('Gases: Dalton, Kp y Kc','Gasak: Dalton, Kp eta Kc'),sub:b('Presiones parciales, moles totales y la relación entre Kp y Kc','Presio partzialak, mol totalak eta Kp eta Kc-ren arteko erlazioa'),
blocks:[
  ['f',{name:b('Ley de los gases ideales','Gas idealen legea'),f:'P·V = n<sub>T</sub>·R·T',vars:[['P',b('presión total','presio totala'),'atm'],['V',b('volumen del recipiente','ontziaren bolumena'),'L'],['n<sub>T</sub>',b('moles totales de gas (¡incluido el inerte!)','gas-mol totalak (geldoa barne!)'),'mol'],['R',b('0,082','0,082'),'atm·L/(mol·K)'],['T',b('temperatura absoluta','tenperatura absolutua'),'K']],
    use:b('Para pasar de P, V, T a moles (y al revés). En un reactor <b>rígido</b> (V constante) a T constante: P<sub>1</sub>/P<sub>0</sub> = n<sub>T,1</sub>/n<sub>T,0</sub>.','P, V, T-tik moletara pasatzeko (eta alderantziz). Erreaktore <b>zurrun</b> batean (V konstantea) T konstantean: P<sub>1</sub>/P<sub>0</sub> = n<sub>T,1</sub>/n<sub>T,0</sub>.'),
    cond:b('Comportamiento ideal: presiones bajas y temperaturas altas respecto a la de condensación. (Los apuntes dicen «P ≤ 1 atm y T ≈ 0 °C»: no es una condición real.) En este curso todas las mezclas de gases se tratan como ideales.','Portaera ideala: presio baxuak eta tenperatura altuak kondentsazio-tenperaturarekiko. (Apunteek «P ≤ 1 atm eta T ≈ 0 °C» diote: ez da benetako baldintza.) Ikasgai honetan gas-nahaste guztiak idealtzat hartzen dira.'),
    err:b('T en °C en vez de K; olvidar el inerte en n<sub>T</sub>.','T °C-tan K-tan beharrean; geldoa n<sub>T</sub>-n ahaztea.')}],
  ['f',{name:b('Ley de Dalton','Daltonen legea'),f:'P<sub>i</sub> = y<sub>i</sub>·P<sub>T</sub> = '+frac('n<sub>i</sub>RT','V')+' &nbsp;·&nbsp; P<sub>T</sub> = Σ P<sub>i</sub>',vars:[['y<sub>i</sub>',b('fracción molar = n<sub>i</sub>/n<sub>T</sub> (= fracción en volumen)','frakzio molarra = n<sub>i</sub>/n<sub>T</sub> (= bolumen-frakzioa)'),'–'],['P<sub>i</sub>',b('presión parcial de i','i-ren presio partziala'),'atm']]}],
  ['f',{name:b('Kp y su relación con Kc','Kp eta Kc-ren arteko erlazioa'),f:'K<sub>p</sub> = '+frac('P<sub>C</sub><sup>c</sup>P<sub>D</sub><sup>d</sup>','P<sub>A</sub><sup>a</sup>P<sub>B</sub><sup>b</sup>')+' &nbsp;·&nbsp; K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>',
    vars:[['Δn',b('Σ ν de productos gaseosos − Σ ν de reactivos gaseosos','produktu gaseosoen Σ ν − erreaktibo gaseosoen Σ ν'),''],['P<sub>i</sub>',b('presiones parciales de equilibrio','orekako presio partzialak'),'atm']],
    use:b('Con gases es casi siempre más cómodo trabajar con presiones. Cuando el examen da K<sub>c</sub> (2024-25: K<sub>c</sub> = 16, K<sub>c</sub> = 0,96) usa concentraciones n<sub>i</sub>/V.','Gasekin presioekin lan egitea erosoagoa da ia beti. Azterketak K<sub>c</sub> ematen duenean (2024-25: K<sub>c</sub> = 16, K<sub>c</sub> = 0,96) erabili n<sub>i</sub>/V kontzentrazioak.'),
    err:b('Contar sólidos en Δn; usar R = 8,314 con presiones en atm.','Solidoak Δn-n kontatzea; R = 8,314 erabiltzea presioak atm-tan direnean.')}],
  ['key',b('Truco de examen: escribe K<sub>p</sub> en función de los <b>moles</b>: P<sub>i</sub> = n<sub>i</sub>·(RT/V). Así K<sub>p</sub> = [Π n<sub>i</sub><sup>ν<sub>i</sub></sup>]·(RT/V)<sup>Δn</sup>. Si Δn = 0, ni V ni P importan.','Azterketako trikimailua: idatzi K<sub>p</sub> <b>molen</b> funtzioan: P<sub>i</sub> = n<sub>i</sub>·(RT/V). Horrela K<sub>p</sub> = [Π n<sub>i</sub><sup>ν<sub>i</sub></sup>]·(RT/V)<sup>Δn</sup>. Δn = 0 bada, ez V-k ez P-k dute eraginik.')],
  ['ex',{title:b('Kp a partir de la composición (2019-20 ordinaria, a)','Kp konposiziotik (2019-20 ohikoa, a)'),
    q:b('2SO₂ + O₂ ⇌ 2SO₃ a 1000 K con N₂ inerte. En el equilibrio: P(SO₃) = 0,4 atm, P(N₂) = 2,0 atm, relación molar O₂/SO₂ = 48 y P<sub>T</sub> = 7,3 atm. Calcula K<sub>p</sub>.','2SO₂ + O₂ ⇌ 2SO₃ 1000 K-ean N₂ geldoarekin. Orekan: P(SO₃) = 0,4 atm, P(N₂) = 2,0 atm, O₂/SO₂ erlazio molarra = 48 eta P<sub>T</sub> = 7,3 atm. Kalkulatu K<sub>p</sub>.'),
    steps:[b('Dalton: P(SO₂) + P(O₂) = 7,3 − 0,4 − 2,0 = 4,9 atm.','Dalton: P(SO₂) + P(O₂) = 7,3 − 0,4 − 2,0 = 4,9 atm.'),
      b('La relación molar es la de presiones: P(O₂) = 48·P(SO₂) → 49·P(SO₂) = 4,9 → P(SO₂) = 0,10 atm; P(O₂) = 4,8 atm.','Erlazio molarra presioena da: P(O₂) = 48·P(SO₂) → 49·P(SO₂) = 4,9 → P(SO₂) = 0,10 atm; P(O₂) = 4,8 atm.'),
      b('K<sub>p</sub> = P(SO₃)²/(P(SO₂)²·P(O₂)) = 0,4²/(0,10²·4,8) = 0,16/0,048.','K<sub>p</sub> = P(SO₃)²/(P(SO₂)²·P(O₂)) = 0,4²/(0,10²·4,8) = 0,16/0,048.')],
    res:'K<sub>p</sub> = 3,33 atm<sup>−1</sup>',check:b('Coincide con la solución oficial (3,33).','Ebazpen ofizialarekin bat dator (3,33).')}],
  ['ex',{title:b('Presión que sube: SF₆ (2024-25 ordinaria, a)','Igotzen den presioa: SF₆ (2024-25 ohikoa, a)'),
    q:b('1,5 mol de SF₆ en un depósito de 1 L a 627 °C: SF₆ ⇌ SF₄ + 2F. En el equilibrio la presión es un 80 % mayor que la inicial. Calcula X y K<sub>c</sub>.','1,5 mol SF₆ 1 L-ko depositu batean 627 °C-an: SF₆ ⇌ SF₄ + 2F. Orekan presioa hasierakoa baino % 80 handiagoa da. Kalkulatu X eta K<sub>c</sub>.'),
    steps:[b('Tabla: SF₆ 1,5 − ξ; SF₄ ξ; F 2ξ → n<sub>T</sub> = 1,5 + 2ξ.','Taula: SF₆ 1,5 − ξ; SF₄ ξ; F 2ξ → n<sub>T</sub> = 1,5 + 2ξ.'),
      b('V y T constantes → P<sub>eq</sub>/P<sub>0</sub> = n<sub>T</sub>/n<sub>0</sub> = 1,80 → 1,5 + 2ξ = 2,7 → ξ = 0,60 mol → X = 0,60/1,5 = <b>0,40</b>.','V eta T konstante → P<sub>eq</sub>/P<sub>0</sub> = n<sub>T</sub>/n<sub>0</sub> = 1,80 → 1,5 + 2ξ = 2,7 → ξ = 0,60 mol → X = 0,60/1,5 = <b>0,40</b>.'),
      b('Concentraciones (V = 1 L): [SF₆] = 0,90; [SF₄] = 0,60; [F] = 1,20 M.','Kontzentrazioak (V = 1 L): [SF₆] = 0,90; [SF₄] = 0,60; [F] = 1,20 M.'),
      b('K<sub>c</sub> = 0,60·1,20²/0,90 = <b>0,96</b> (mol/L)².','K<sub>c</sub> = 0,60·1,20²/0,90 = <b>0,96</b> (mol/L)².')],
    res:b('X = 0,40; K<sub>c</sub> = 0,96 M² (K<sub>p</sub> = K<sub>c</sub>(RT)² ≈ 5,2×10^3 atm²).','X = 0,40; K<sub>c</sub> = 0,96 M² (K<sub>p</sub> = K<sub>c</sub>(RT)² ≈ 5,2×10^3 atm²).'),
    check:b('La solución oficial da «0,96» sin decir que es K<sub>c</sub>: indica siempre qué constante es y sus unidades.','Ebazpen ofizialak «0,96» ematen du K<sub>c</sub> dela esan gabe: adierazi beti zein konstante den eta haren unitateak.')}],
  ['lab','reactor',{rx:'sf6'}],
  ['terms',[['presión parcial','presio partziala'],['fracción molar','frakzio molarra'],['gas inerte','gas geldoa'],['composición volumétrica','konposizio bolumetrikoa'],['recipiente rígido','ontzi zurruna']]],
],
quiz:()=>[q3dn(),q3dn(),q3kp(),q3kp(),q3pi(),q3rise(),q3rise(),...pickN(C3,2).map(f=>f())],
cards:[
  [b('Ley de Dalton','Daltonen legea'),'P<sub>i</sub> = y<sub>i</sub>P<sub>T</sub> = n<sub>i</sub>RT/V · P<sub>T</sub> = ΣP<sub>i</sub>'],
  [b('Relación Kp–Kc','Kp–Kc erlazioa'),'K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>, R = 0,082, T en K'],
  [b('Reactor rígido, T constante: relación P–n','Erreaktore zurruna, T konstantea: P–n erlazioa'),'P<sub>1</sub>/P<sub>0</sub> = n<sub>T,1</sub>/n<sub>T,0</sub>'],
  [b('¿El inerte entra en K?','Geldoa K-n sartzen da?'),b('No. Pero sí en n<sub>T</sub> y P<sub>T</sub>.','Ez. Baina n<sub>T</sub>-n eta P<sub>T</sub>-n bai.')],
  [b('% en volumen de un gas ideal','Gas ideal baten bolumen-%'),b('= % en moles = 100·y<sub>i</sub>','= mol-% = 100·y<sub>i</sub>')],
]});

/* ---------- U4 ---------- */
function q4quad(){ const c0=r(0.2,1.2,2), Kc=+(pick([0.02,0.05,0.1,0.25,0.5,1.2])).toPrecision(2);
  const x=(-Kc+Math.sqrt(Kc*Kc+4*Kc*c0))/2;
  return nq(TAG.met,b(`PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), K<sub>c</sub> = ${num(Kc)}. Se parte de [PCl₅]₀ = ${fix(c0,2)} M sin productos. [Cl₂] en el equilibrio (M):`,`PCl₅(g) ⇌ PCl₃(g) + Cl₂(g), K<sub>c</sub> = ${num(Kc)}. [PCl₅]₀ = ${fix(c0,2)} M-tik abiatzen da produkturik gabe. Orekako [Cl₂] (M):`),x,
    b(`x²/(${fix(c0,2)} − x) = ${num(Kc)} → x² + ${num(Kc)}x − ${num(Kc*c0)} = 0 → x = ${num(x)} M (raíz positiva y menor que c₀).`,`x²/(${fix(c0,2)} − x) = ${num(Kc)} → x² + ${num(Kc)}x − ${num(Kc*c0)} = 0 → x = ${num(x)} M (erro positiboa eta c₀ baino txikiagoa).`),{label:'M'}); }
function q4KfromP(){ const n0=r(0.5,2,2), V=pick([1,2,5]), T=pick([500,600,800]), X=pick([0.2,0.3,0.4,0.5]);
  const c0=n0/V, Kc=(c0*X)*(c0*X)/(c0*(1-X));
  return nq(TAG.met,b(`Se introducen ${fix(n0,2)} mol de PCl₅ en un recipiente rígido de ${V} L a ${T} K. En el equilibrio la presión total es un ${X*100} % mayor que la inicial. K<sub>c</sub>:`,`${fix(n0,2)} mol PCl₅ sartzen dira ${V} L-ko ontzi zurrun batean ${T} K-ean. Orekan presio totala hasierakoa baino % ${X*100} handiagoa da. K<sub>c</sub>:`),Kc,
    b(`n<sub>T</sub> = n₀(1 + X) → X = ${X}. [PCl₅] = ${num(c0*(1-X))}, [PCl₃] = [Cl₂] = ${num(c0*X)} M → K<sub>c</sub> = ${num(Kc)}.`,`n<sub>T</sub> = n₀(1 + X) → X = ${X}. [PCl₅] = ${num(c0*(1-X))}, [PCl₃] = [Cl₂] = ${num(c0*X)} M → K<sub>c</sub> = ${num(Kc)}.`)); }
function q4comp(){ const nA=r(0.6,2,2), X=pick([0.4,0.5,0.6,0.7]), nin=r(0.2,1,2);
  const xi=X*nA/2, n=[nA-2*xi, nA*1.5-xi, 2*xi, nin], nt=n.reduce((a,c)=>a+c,0);
  return nq(TAG.met,b(`2SO₂ + O₂ ⇌ 2SO₃. Se parte de ${fix(nA,2)} mol SO₂, ${fix(nA*1.5,2)} mol O₂ y ${fix(nin,2)} mol N₂. Si X(SO₂) = ${X*100} %, ¿qué % en volumen de SO₃ hay en el equilibrio?`,`2SO₂ + O₂ ⇌ 2SO₃. ${fix(nA,2)} mol SO₂, ${fix(nA*1.5,2)} mol O₂ eta ${fix(nin,2)} mol N₂-tik abiatzen da. X(SO₂) = % ${X*100} bada, zenbat da orekako SO₃-aren bolumen-%?`),n[2]/nt*100,
    b(`ξ = X·n(SO₂)/2 = ${fix(xi,3)} mol. SO₃ = ${fix(n[2],3)}; n<sub>T</sub> = ${fix(nt,3)} (¡con el N₂!) → % = ${fix(n[2]/nt*100,1)}.`,`ξ = X·n(SO₂)/2 = ${fix(xi,3)} mol. SO₃ = ${fix(n[2],3)}; n<sub>T</sub> = ${fix(nt,3)} (N₂-a barne!) → % = ${fix(n[2]/nt*100,1)}.`),{tol:0.02,label:'%'}); }
const C4=[
  ()=>mcq(TAG.met,b('Al resolver la ecuación de K obtienes ξ = −0,3 y ξ = 0,45 mol, con n₀(limitante)/|ν| = 0,5. ¿Cuál vale?','K-ren ekuazioa ebaztean ξ = −0,3 eta ξ = 0,45 mol lortzen dituzu, n₀(mugatzailea)/|ν| = 0,5 izanik. Zein da ona?'),'ξ = 0,45',['ξ = −0,3',b('Las dos','Biak'),b('Ninguna','Bat ere ez')],
    b('Solo vale la raíz que deja todos los moles ≥ 0: 0 &lt; ξ &lt; 0,5 (si no hay productos iniciales).','Mol guztiak ≥ 0 uzten dituen erroa bakarrik da ona: 0 &lt; ξ &lt; 0,5 (hasierako produkturik ez badago).')),
  ()=>mcq(TAG.met,b('Problema tipo 2023-24: «con un primer experimento se alcanza X = 60 % y P = 43 atm; ¿cuántos moles hay que introducir para X = 88 %?». ¿Cuál es el primer paso?','2023-24 motako problema: «lehen esperimentu batean X = % 60 eta P = 43 atm lortzen dira; zenbat mol sartu behar dira X = % 88 lortzeko?». Zein da lehen urratsa?'),b('Calcular K con el primer experimento','K lehen esperimentuarekin kalkulatu'),[b('Suponer que K = 1','K = 1 dela suposatu'),b('Aplicar Le Châtelier','Le Châtelier aplikatu'),b('Calcular la masa de la mezcla','Nahastearen masa kalkulatu')],
    b('K no se da: se obtiene del primer equilibrio (mismo reactor, misma T) y luego se usa para el segundo.','K ez da ematen: lehen orekatik ateratzen da (erreaktore bera, T bera) eta gero bigarrenerako erabiltzen da.')),
];
U.push({id:'o4',short:b('Método','Metodoa'),title:b('Método completo: reactor rígido','Metodo osoa: erreaktore zurruna'),sub:b('Los problemas de equilibrio gaseoso del examen, paso a paso','Azterketako gas-oreka problemak, urratsez urrats'),
blocks:[
  ['p',b('Desde 2022-23, <b>todos los exámenes</b> tienen un problema de equilibrio gaseoso: reactor rígido y cerrado, a veces con un inerte, a veces con un sólido. Casi siempre se repite el mismo esquema.','2022-23tik, <b>azterketa guztiek</b> dute gas-oreka problema bat: erreaktore zurrun eta itxia, batzuetan geldo batekin, beste batzuetan solido batekin. Ia beti eskema bera errepikatzen da.')],
  ['svg',{svg:svgFlow(),cap:b('El método en 9 pasos. La incógnita suele ser ξ, el volumen V o los moles iniciales n₀.','Metodoa 9 urratsetan. Ezezaguna ξ, V bolumena edo n₀ hasierako molak izan ohi da.')}],
  ['steps',[b('<b>Ecuación</b> ajustada y tipo de constante que te dan (K<sub>p</sub> o K<sub>c</sub>, ¿para qué coeficientes?).','Ekuazio <b>doitua</b> eta ematen duten konstante mota (K<sub>p</sub> edo K<sub>c</sub>, zein koefizienteetarako?).'),
    b('<b>Moles iniciales</b> de todo, inertes incluidos. Pasa % vol, litros en c.n., gramos… a moles.','Guztiaren <b>hasierako molak</b>, geldoak barne. Bolumen-%, b.n.-ko litroak, gramoak… moletara pasa.'),
    b('<b>Tabla</b> con ξ (inicial, cambio, equilibrio).','ξ-dun <b>taula</b> (hasiera, aldaketa, oreka).'),
    b('<b>n<sub>T</sub></b> en el equilibrio = n<sub>T,0</sub> + Δn·ξ.','Orekako <b>n<sub>T</sub></b> = n<sub>T,0</sub> + Δn·ξ.'),
    b('<b>P<sub>i</sub> = n<sub>i</sub>RT/V</b> (o [i] = n<sub>i</sub>/V). Si conoces P<sub>T</sub>: n<sub>T</sub> = P<sub>T</sub>V/RT → ξ sale directamente.','<b>P<sub>i</sub> = n<sub>i</sub>RT/V</b> (edo [i] = n<sub>i</sub>/V). P<sub>T</sub> ezagutzen baduzu: n<sub>T</sub> = P<sub>T</sub>V/RT → ξ zuzenean ateratzen da.'),
    b('Sustituye en <b>K</b> → una ecuación con una incógnita.','Ordezkatu balioak <b>K-ren adierazpenean</b> → ezezagun bakarreko ekuazioa.'),
    b('<b>Resuelve</b> (2.º grado, o tanteo/calculadora si es de grado alto) y elige la raíz física.','<b>Ebatzi</b> (2. mailakoa, edo saiakera/kalkulagailua maila altukoa bada) eta aukeratu erro fisikoa.'),
    b('Calcula <b>lo que piden</b>: X, % vol, P<sub>T</sub>, V…','Kalkulatu <b>eskatzen dena</b>: X, bolumen-%, P<sub>T</sub>, V…'),
    b('¿Hay un segundo apartado con <b>perturbación</b>? Parte del equilibrio anterior como estado inicial (unidad 6).','Bigarren atal bat dago <b>perturbazio</b> batekin? Aurreko oreka hasierako egoeratzat hartu (6. unitatea).')],b('Método del reactor rígido','Erreaktore zurrunaren metodoa')],
  ['ex',{title:b('Ejemplo completo (original, nivel examen)','Adibide osoa (originala, azterketa-mailakoa)'),
    q:b('1,00 mol de CO, 2,00 mol de H₂ y 1,00 mol de N₂ (inerte) se introducen en un reactor rígido de 10,0 L a 500 K: CO + 2H₂ ⇌ CH₃OH(g). En el equilibrio P<sub>T</sub> = 12,3 atm. (a) Conversión; (b) K<sub>c</sub> y K<sub>p</sub>; (c) volumen necesario para X = 60 %.','1,00 mol CO, 2,00 mol H₂ eta 1,00 mol N₂ (geldoa) 10,0 L-ko erreaktore zurrun batean sartzen dira 500 K-ean: CO + 2H₂ ⇌ CH₃OH(g). Orekan P<sub>T</sub> = 12,3 atm. (a) Konbertsioa; (b) K<sub>c</sub> eta K<sub>p</sub>; (c) X = % 60 lortzeko behar den bolumena.'),
    steps:[b('Tabla: CO 1 − ξ; H₂ 2 − 2ξ; CH₃OH ξ; N₂ 1 → n<sub>T</sub> = 4 − 2ξ.','Taula: CO 1 − ξ; H₂ 2 − 2ξ; CH₃OH ξ; N₂ 1 → n<sub>T</sub> = 4 − 2ξ.'),
      b('n<sub>T</sub> = PV/RT = 12,3·10,0/(0,082·500) = 3,00 mol → 4 − 2ξ = 3 → ξ = 0,50 mol.','n<sub>T</sub> = PV/RT = 12,3·10,0/(0,082·500) = 3,00 mol → 4 − 2ξ = 3 → ξ = 0,50 mol.'),
      b('CO y H₂ están en proporción 1:2 → ambos limitantes: X = ξ/1 = <b>50 %</b>.','CO eta H₂ 1:2 proportzioan daude → biak mugatzaileak: X = ξ/1 = <b>% 50</b>.'),
      b('[CO] = 0,050; [H₂] = 0,100; [CH₃OH] = 0,050 M → K<sub>c</sub> = 0,050/(0,050·0,100²) = <b>100</b> M<sup>−2</sup>.','[CO] = 0,050; [H₂] = 0,100; [CH₃OH] = 0,050 M → K<sub>c</sub> = 0,050/(0,050·0,100²) = <b>100</b> M<sup>−2</sup>.'),
      b('K<sub>p</sub> = K<sub>c</sub>(RT)<sup>−2</sup> = 100/41,0² = <b>0,0595</b> atm<sup>−2</sup>.','K<sub>p</sub> = K<sub>c</sub>(RT)<sup>−2</sup> = 100/41,0² = <b>0,0595</b> atm<sup>−2</sup>.'),
      b('(c) X = 60 % → ξ = 0,60: CO 0,40; H₂ 0,80; CH₃OH 0,60. K<sub>c</sub> = (0,60/V)/[(0,40/V)(0,80/V)²] = 2,344·V² = 100 → V = <b>6,53 L</b>.','(c) X = % 60 → ξ = 0,60: CO 0,40; H₂ 0,80; CH₃OH 0,60. K<sub>c</sub> = (0,60/V)/[(0,40/V)(0,80/V)²] = 2,344·V² = 100 → V = <b>6,53 L</b>.')],
    res:b('X = 50 %; K<sub>c</sub> = 100; K<sub>p</sub> = 0,0595; V = 6,53 L (comprimir favorece el lado con menos moles).','X = % 50; K<sub>c</sub> = 100; K<sub>p</sub> = 0,0595; V = 6,53 L (konprimitzeak gas-mol gutxiago dituen aldea bultzatzen du).'),
    check:b('Al reducir V de 10 a 6,5 L la conversión sube de 50 a 60 %: coherente con Le Châtelier (Δn = −2).','V 10etik 6,5 L-ra jaistean konbertsioa % 50etik % 60ra igotzen da: Le Châtelierrekin bat dator (Δn = −2).')}],
  ['lab','reactor',{rx:'nh3'}],
  ['warn',b('Ecuaciones de grado 3 o más: no intentes despejar. Prueba valores de ξ en el intervalo permitido (o usa el modo «solve» de la calculadora) hasta que K cuadre con 3 cifras. Justifica siempre que la raíz es física.','Hirugarren mailako edo goragoko ekuazioak: ez saiatu eskuz ebazten. Probatu ξ-ren balioak baimendutako tartean (edo erabili kalkulagailuaren «solve» modua), K-ren balioa hiru zifra esanguratsutan bat etorri arte. Justifikatu beti erroa fisikoa dela.')],
  ['exam',b(`Exactamente este esquema: ${ax('2022-23-o',1)} (NH₃ con Ar; volumen y presión), ${ax('2023-24-o',1)} (CH₃OH; K del primer experimento), ${ax('2024-25-o',3)} (SF₆), ${ax('2024-25-e',1)} (CO + H₂O).`,`Hain zuzen eskema hau: ${ax('2022-23-o',1)} (NH₃ Ar-rekin; bolumena eta presioa), ${ax('2023-24-o',1)} (CH₃OH; lehen esperimentuko K), ${ax('2024-25-o',3)} (SF₆), ${ax('2024-25-e',1)} (CO + H₂O).`)],
],
quiz:()=>[q4quad(),q4quad(),q4KfromP(),q4KfromP(),q4comp(),q4comp(),...C4.map(f=>f())],
cards:[
  [b('Si conoces P<sub>T</sub>, V y T en el equilibrio…','Orekako P<sub>T</sub>, V eta T ezagutzen badituzu…'),b('n<sub>T</sub> = P<sub>T</sub>V/RT y de n<sub>T</sub> = n<sub>T,0</sub> + Δn·ξ sale ξ directamente.','n<sub>T</sub> = P<sub>T</sub>V/RT eta n<sub>T</sub> = n<sub>T,0</sub> + Δn·ξ-tik ξ zuzenean ateratzen da.')],
  [b('¿Qué raíz elijo al resolver K?','Zein erro aukeratzen dut K ebaztean?'),b('La que deja todos los moles ≥ 0 (0 < ξ < ξ<sub>max</sub>).','Mol guztiak ≥ 0 uzten dituena (0 < ξ < ξ<sub>max</sub>).')],
  [b('Problema con dos experimentos en el mismo reactor y T','Bi esperimentu erreaktore eta T berean'),b('1.º → calcula K. 2.º → usa esa K con las nuevas condiciones.','1.a → K kalkulatu. 2.a → K hori baldintza berriekin erabili.')],
  [b('K<sub>p</sub> en función de moles','K<sub>p</sub> molen funtzioan'),'K<sub>p</sub> = Π n<sub>i</sub><sup>ν<sub>i</sub></sup> · (RT/V)<sup>Δn</sup>'],
]});

/* ---------- U5 ---------- */
function q5feo(){ const K2=+(pick([0.09,0.16,0.25,0.36,0.64,1.44])).toFixed(2); const K1=Math.sqrt(K2), X=K1/(1+K1);
  return nq(TAG.het,b(`2FeO(s) + 2CO(g) ⇌ 2Fe(s) + 2CO₂(g) tiene K<sub>p</sub> = ${fix(K2,2)}. Se introduce CO puro (con FeO en exceso). Conversión del CO (%):`,`2FeO(s) + 2CO(g) ⇌ 2Fe(s) + 2CO₂(g) erreakzioak K<sub>p</sub> = ${fix(K2,2)} du. CO purua sartzen da (FeO soberan). CO-aren konbertsioa (%):`),X*100,
    b(`Con coeficiente 1: K = √${fix(K2,2)} = ${fix(K1,3)} = P(CO₂)/P(CO) = X/(1 − X) → X = K/(1 + K) = ${fix(X*100,1)} %.`,`1 koefizientearekin: K = √${fix(K2,2)} = ${fix(K1,3)} = P(CO₂)/P(CO) = X/(1 − X) → X = K/(1 + K) = % ${fix(X*100,1)}.`),{tol:0.02,label:'X (%)'}); }
function q5caco3(){ const Kp=r(0.1,0.6,2), V=pick([2,5,10]), T=pick([1073,1123,1173]);
  const n=Kp*V/(RG*T);
  return nq(TAG.het,b(`CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = ${fix(Kp,2)} a ${T} K. Se calienta CaCO₃ en exceso en un recipiente de ${V} L vacío. Moles de CO₂ en el equilibrio:`,`CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = ${fix(Kp,2)} ${T} K-ean. CaCO₃ soberan berotzen da ${V} L-ko ontzi huts batean. Orekako CO₂ molak:`),n,
    b(`K<sub>p</sub> = P(CO₂) → n = P·V/RT = ${fix(Kp,2)}·${V}/(0,082·${T}) = ${num(n)} mol (no depende de cuánto CaCO₃ haya, siempre que no se agote).`,`K<sub>p</sub> = P(CO₂) → n = P·V/RT = ${fix(Kp,2)}·${V}/(0,082·${T}) = ${num(n)} mol (ez dago CaCO₃ kantitatearen menpe, agortzen ez den bitartean).`),{label:'mol'}); }
const C5=[
  ()=>mcq(TAG.het,b('Fe₃O₄(s) + 4H₂(g) ⇌ 3Fe(s) + 4H₂O(g). Si se duplica el volumen a T constante…','Fe₃O₄(s) + 4H₂(g) ⇌ 3Fe(s) + 4H₂O(g). Bolumena bikoizten bada T konstantean…'),b('el equilibrio no se desplaza (Δn<sub>gas</sub> = 0)','oreka ez da desplazatzen (Δn<sub>gas</sub> = 0)'),[b('se desplaza a la derecha','eskuinera desplazatzen da'),b('se desplaza a la izquierda','ezkerrera desplazatzen da'),b('K se reduce a la mitad','K erdira jaisten da')],
    b('4 moles de gas a cada lado: K<sub>p</sub> = (n<sub>H₂O</sub>/n<sub>H₂</sub>)⁴ no depende de V.','4 mol gas alde bakoitzean: K<sub>p</sub> = (n<sub>H₂O</sub>/n<sub>H₂</sub>)⁴ ez dago V-ren menpe.')),
  ()=>mcq(TAG.het,b('¿Qué ocurre si añades más sólido (CaCO₃) a CaCO₃(s) ⇌ CaO(s) + CO₂(g) en equilibrio?','Zer gertatzen da orekan dagoen CaCO₃(s) ⇌ CaO(s) + CO₂(g) sistemari solido (CaCO₃) gehiago gehitzen badiozu?'),b('Nada: el sólido no aparece en K','Ezer ez: solidoa ez da K-n agertzen'),[b('Se forma más CO₂','CO₂ gehiago sortzen da'),b('Se consume CO₂','CO₂ kontsumitzen da'),b('Aumenta K','K handitzen da')],
    b('La «concentración» (actividad) de un sólido puro es constante; añadir sólido no cambia Q.','Solido puru baten «kontzentrazioa» (aktibitatea) konstantea da; solidoa gehitzeak ez du Q aldatzen.')),
  ()=>mcq(TAG.het,b('«Cantidad mínima de magnetita para alcanzar el equilibrio» (2022-23 ext.) significa…','«Oreka lortzeko magnetita kantitate minimoa» (2022-23 ez-ohikoa) honakoa da…'),b('justo la que reacciona hasta el equilibrio (n = ξ)','orekara arte erreakzionatzen duena hain zuzen (n = ξ)'),[b('la que hace K = 1','K = 1 egiten duena'),b('la estequiométrica con todo el H₂','H₂ guztiarekin estekiometrikoa dena'),b('cero, el sólido no importa','zero, solidoak ez du axola')],
    b('Si hubiera menos, el sólido se agotaría antes de llegar a Q = K y no habría equilibrio.','Gutxiago egongo balitz, solidoa Q = K izan aurretik agortuko litzateke eta ez legoke orekarik.')),
];
U.push({id:'o5',short:b('Heterogéneos','Heterogeneoak'),title:b('Equilibrios heterogéneos','Oreka heterogeneoak'),sub:b('Sólidos que reaccionan con gases: óxidos de hierro, carbonatos','Gasekin erreakzionatzen duten solidoak: burdin oxidoak, karbonatoak'),
blocks:[
  ['p',b('Un equilibrio es <b>heterogéneo</b> cuando las especies están en fases distintas. En los exámenes son típicos los óxidos de hierro reducidos con CO o H₂ (3 veces desde 2020).','Oreka bat <b>heterogeneoa</b> da espezieak fase desberdinetan daudenean. Azterketetan ohikoak dira CO edo H₂-rekin erreduzitutako burdin oxidoak (3 aldiz 2020tik).')],
  ['f',{name:b('Constante con sólidos','Konstantea solidoekin'),f:'FeO(s) + CO(g) ⇌ Fe(s) + CO<sub>2</sub>(g) &nbsp;→&nbsp; K<sub>p</sub> = '+frac('P<sub>CO₂</sub>','P<sub>CO</sub>')+' = '+frac('n<sub>CO₂</sub>','n<sub>CO</sub>')+' = K<sub>c</sub>',
    use:b('Si Δn<sub>gas</sub> = 0, K es un cociente de moles: no dependen de V, de P<sub>T</sub> ni del inerte. Partiendo solo de CO: X = K/(1 + K).','Δn<sub>gas</sub> = 0 bada, K molen zatidura da: ez dago V-ren, P<sub>T</sub>-ren edo gas geldoaren mende. CO bakarrik hasieran: X = K/(1 + K).'),
    cond:b('Los sólidos no aparecen en K, pero <b>deben existir</b>: si un sólido reactivo se agota antes de que Q = K, no hay equilibrio.','Solidoak ez dira K-n agertzen, baina <b>egon behar dute</b>: erreaktibo solido bat Q = K izan aurretik agortzen bada, ez dago orekarik.'),
    err:b('Usar K de la ecuación con coeficiente 2 como si fuera la de coeficiente 1 (2020-21: K<sub>p</sub> = 0,1624 para 2FeO → K = √0,1624 = 0,403 para 1FeO).','2 koefizientedun ekuazioaren K erabiltzea 1 koefizientekoa balitz bezala (2020-21: K<sub>p</sub> = 0,1624 2FeO-rako → K = √0,1624 = 0,403 1FeO-rako).')}],
  ['ex',{title:b('Conversión del CO (2020-21 extraordinaria)','CO-aren konbertsioa (2020-21 ez-ohikoa)'),
    q:b('2FeO(s) + 2CO(g) ⇌ 2Fe(s) + 2CO₂(g), K<sub>p</sub> = 0,1624 a 1000 °C. Entra una mezcla con CO y N₂ (inerte) en un reactor con FeO en exceso. ¿Qué fracción del CO se convierte?','2FeO(s) + 2CO(g) ⇌ 2Fe(s) + 2CO₂(g), K<sub>p</sub> = 0,1624 1000 °C-an. CO eta N₂ (geldoa) dituen nahastea FeO soberan duen erreaktorera sartzen da. CO-aren zein frakzio bihurtzen da?'),
    steps:[b('K<sub>p</sub> = (P<sub>CO₂</sub>/P<sub>CO</sub>)² = 0,1624 → P<sub>CO₂</sub>/P<sub>CO</sub> = √0,1624 = 0,403.','K<sub>p</sub> = (P<sub>CO₂</sub>/P<sub>CO</sub>)² = 0,1624 → P<sub>CO₂</sub>/P<sub>CO</sub> = √0,1624 = 0,403.'),
      b('Si entran n moles de CO: CO = n(1 − X), CO₂ = nX → X/(1 − X) = 0,403.','n mol CO sartzen badira: CO = n(1 − X), CO₂ = nX → X/(1 − X) = 0,403.'),
      b('X = 0,403/1,403 = <b>0,287</b>. El N₂ y la presión (1,7 atm) no influyen.','X = 0,403/1,403 = <b>0,287</b>. N₂-ak eta presioak (1,7 atm) ez dute eraginik.')],
    res:b('X(CO) = 28,7 % (solución oficial: 0,287 ✓).','X(CO) = % 28,7 (ebazpen ofiziala: 0,287 ✓).')}],
  ['ex',{title:b('Sólido que se agota: descomposición del CaCO₃','Agortzen den solidoa: CaCO₃-aren deskonposizioa'),
    q:b('10,0 g de CaCO₃ (M = 100 g/mol) se calientan a 1073 K en un recipiente vacío de 5,0 L: CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = 0,236. (a) ¿Qué % se descompone? (b) ¿Volumen mínimo para que se descomponga todo?','10,0 g CaCO₃ (M = 100 g/mol) 1073 K-era berotzen dira 5,0 L-ko ontzi huts batean: CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = 0,236. (a) Zenbat % deskonposatzen da? (b) Zein da dena deskonposatzeko bolumen minimoa?'),
    steps:[b('K<sub>p</sub> = P<sub>CO₂</sub> = 0,236 atm mientras quede CaCO₃.','K<sub>p</sub> = P<sub>CO₂</sub> = 0,236 atm CaCO₃ geratzen den bitartean.'),
      b('n(CO₂) = PV/RT = 0,236·5,0/(0,082·1073) = 0,0134 mol → descompone 0,0134/0,100 = <b>13,4 %</b>.','n(CO₂) = PV/RT = 0,236·5,0/(0,082·1073) = 0,0134 mol → 0,0134/0,100 = <b>% 13,4</b> deskonposatzen da.'),
      b('(b) Para descomponer los 0,100 mol con P = 0,236 atm: V = nRT/P = 0,100·0,082·1073/0,236 = <b>37,3 L</b>. Con V mayor se agota el sólido y P &lt; K<sub>p</sub>: ya no hay equilibrio.','(b) 0,100 molak P = 0,236 atm-rekin deskonposatzeko: V = nRT/P = 0,100·0,082·1073/0,236 = <b>37,3 L</b>. V handiagoarekin solidoa agortu egiten da eta P &lt; K<sub>p</sub>: ez dago orekarik.')],
    res:b('13,4 %; V<sub>min</sub> = 37,3 L.','% 13,4; V<sub>min</sub> = 37,3 L.')}],
  ['key',b('<b>Retirar continuamente un producto gaseoso</b> (2023-24 ext. b) impide que se llegue a Q = K: la reacción sigue hasta que se agota un reactivo (el gas o el sólido). Haz un balance de reactivo limitante, no de equilibrio.','<b>Produktu gaseoso bat etengabe kentzeak</b> (2023-24 ez-ohikoa b) Q = K izatea eragozten du: erreakzioak jarraitzen du erreaktibo bat agortu arte (gasa edo solidoa). Egin erreaktibo mugatzailearen balantzea, ez orekarena.')],
  ['lab','reactor',{rx:'fe3o4'}],
  ['exam',b(`${ax('2020-21-e',1)} (FeO/CO con vapor de agua y Dalton), ${ax('2022-23-e',2)} (magnetita + H₂: K<sub>p</sub>, sólido mínimo, añadir H₂), ${ax('2023-24-e',1)} (Fe₃O₄ + CO; retirar CO₂).`,`${ax('2020-21-e',1)} (FeO/CO ur-lurrunarekin eta Dalton), ${ax('2022-23-e',2)} (magnetita + H₂: K<sub>p</sub>, solido minimoa, H₂ gehitu), ${ax('2023-24-e',1)} (Fe₃O₄ + CO; CO₂ kendu).`)],
  ['terms',[['equilibrio heterogéneo','oreka heterogeneoa'],['sólido','solidoa'],['magnetita (Fe₃O₄)','magnetita (Fe₃O₄)'],['óxido ferroso (FeO)','oxido ferrosoa (FeO)'],['cantidad mínima','kantitate minimoa']]],
],
quiz:()=>[q5feo(),q5feo(),q5caco3(),q5caco3(),...C5.map(f=>f()),q1expr()],
cards:[
  [b('K de CaCO₃(s) ⇌ CaO(s) + CO₂(g)','CaCO₃(s) ⇌ CaO(s) + CO₂(g)-ren K'),'K<sub>p</sub> = P<sub>CO₂</sub> · K<sub>c</sub> = [CO₂]'],
  [b('Conversión de CO con FeO en exceso','CO-aren konbertsioa FeO soberan'),'X = K/(1 + K)'],
  [b('Heterogéneo con Δn<sub>gas</sub> = 0: ¿influye V?','Heterogeneoa Δn<sub>gas</sub> = 0-rekin: V-k eragiten du?'),b('No: K es un cociente de moles.','Ez: K molen zatidura da.')],
  [b('Cantidad mínima de sólido para alcanzar el equilibrio','Oreka lortzeko solido kantitate minimoa'),b('n<sub>min</sub> = lo que reacciona hasta Q = K (ξ·coeficiente).','n<sub>min</sub> = Q = K izan arte erreakzionatzen duena (ξ·koefizientea).')],
]});

/* ---------- U6 ---------- */
const LCR=[
  {eq:'N2 + 3H2 ⇌ 2NH3',dn:-2,dH:-92},{eq:'2SO2 + O2 ⇌ 2SO3',dn:-1,dH:-198},{eq:'N2O4 ⇌ 2NO2',dn:1,dH:57},{eq:'CO + H2O ⇌ CO2 + H2',dn:0,dH:-41},
  {eq:'PCl5 ⇌ PCl3 + Cl2',dn:1,dH:88},{eq:'CO + 2H2 ⇌ CH3OH',dn:-2,dH:-91},{eq:'N2 + O2 ⇌ 2NO',dn:0,dH:181},
];
function q6(){
  const x=pick(LCR);
  const P=[
    ['comp',b('se comprime (V ÷ 2) a T constante','konprimitu egiten da (V ÷ 2) T konstantean'),x.dn<0?'R':x.dn>0?'L':'N'],
    ['exp',b('se aumenta el volumen a T constante','bolumena handitzen da T konstantean'),x.dn<0?'L':x.dn>0?'R':'N'],
    ['heat',b('se calienta','berotu egiten da'),x.dH>0?'R':'L'],['cool',b('se enfría','hoztu egiten da'),x.dH>0?'L':'R'],
    ['inV',b('se añade argón a volumen constante','argona gehitzen da bolumen konstantean'),'N'],
    ['inP',b('se añade argón a presión constante','argona gehitzen da presio konstantean'),x.dn<0?'L':x.dn>0?'R':'N'],
    ['cat',b('se añade un catalizador','katalizatzaile bat gehitzen da'),'N'],
    ['addR',b('se añade más reactivo','erreaktibo gehiago gehitzen da'),'R'],['remP',b('se retira producto','produktua kentzen da'),'R'],
  ];
  const [k,d,ans]=pick(P);
  const T={R:b('Hacia la derecha','Eskuinera'),L:b('Hacia la izquierda','Ezkerrera'),N:b('No se desplaza','Ez da desplazatzen')};
  const why={comp:b(`Al comprimir aumentan todas las P<sub>i</sub>; con Δn = ${x.dn} el sistema va hacia el lado con menos moles de gas${x.dn===0?' (aquí son iguales → nada)':''}.`,`Konprimitzean P<sub>i</sub> guztiak handitzen dira; Δn = ${x.dn} izanik, sistema gas-mol gutxiago dituen aldera doa${x.dn===0?' (hemen berdinak → ezer ez)':''}.`),
    exp:b(`Al expandir el sistema va hacia el lado con más moles de gas (Δn = ${x.dn}).`,`Hedatzean sistema gas-mol gehiago dituen aldera doa (Δn = ${x.dn}).`),
    heat:b(`ΔH = ${x.dH} kJ: calentar favorece el sentido endotérmico (y cambia K).`,`ΔH = ${x.dH} kJ: berotzeak noranzko endotermikoa faboratzen du (eta K aldatzen du).`),
    cool:b(`ΔH = ${x.dH} kJ: enfriar favorece el sentido exotérmico (y cambia K).`,`ΔH = ${x.dH} kJ: hozteak noranzko exotermikoa faboratzen du (eta K aldatzen du).`),
    inV:b('A V constante las P<sub>i</sub> de las especies que reaccionan no cambian: Q = K.','V konstantean erreakzionatzen duten espezieen P<sub>i</sub> ez dira aldatzen: Q = K.'),
    inP:b('A P constante el volumen crece: equivale a una expansión.','P konstantean bolumena handitzen da: hedapen baten baliokidea da.'),
    cat:b('El catalizador no cambia ni K ni Q.','Katalizatzaileak ez ditu ez K ez Q aldatzen.'),
    addR:b('Añadir reactivo baja Q por debajo de K.','Erreaktiboa gehitzeak Q K-ren azpitik jaisten du.'),remP:b('Retirar producto baja Q por debajo de K.','Produktua kentzeak Q K-ren azpitik jaisten du.')}[k];
  return mcq(TAG.lc,b(`{${x.eq}} (gases, ΔH = ${x.dH} kJ) en equilibrio: ${d.es}. ¿Hacia dónde se desplaza?`,`{${x.eq}} (gasak, ΔH = ${x.dH} kJ) orekan: ${d.eu}. Nora desplazatzen da?`),T[ans],Object.keys(T).filter(z=>z!==ans).map(z=>T[z]),why);
}
function q6num(){ const K0=r(2,9,1); const n=r(0.5,1.5,2);
  const x=n*Math.sqrt(K0)/(1+Math.sqrt(K0)), add=r(0.3,1.2,2);
  const f=y=>(x+y)*(x+y)-K0*(n-x-y)*(n-x+add-y); let lo=0,hi=n-x; for(let i=0;i<100;i++){ const m=(lo+hi)/2; if(f(m)<0) lo=m; else hi=m; } const y=(lo+hi)/2;
  const X2=(x+y)/n;
  return nq(TAG.lc,b(`CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = ${fix(K0,1)}. Se parte de ${fix(n,2)} mol de CO y ${fix(n,2)} mol de H₂O y se alcanza el equilibrio. Luego se añaden ${fix(add,2)} mol de H₂O. Nueva conversión del CO (%):`,`CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = ${fix(K0,1)}. ${fix(n,2)} mol CO eta ${fix(n,2)} mol H₂O-tik abiatu eta oreka lortzen da. Gero ${fix(add,2)} mol H₂O gehitzen dira. CO-aren konbertsio berria (%):`),X2*100,
    b(`1.er equilibrio: x/(n−x) = √K → x = ${fix(x,3)}. Tras añadir: (x+y)² = K(n−x−y)(n−x+${fix(add,2)}−y) → y = ${fix(y,3)} → X = ${fix(X2*100,1)} % (sube, como predice Le Châtelier).`,`1. oreka: x/(n−x) = √K → x = ${fix(x,3)}. Gehitu ondoren: (x+y)² = K(n−x−y)(n−x+${fix(add,2)}−y) → y = ${fix(y,3)} → X = % ${fix(X2*100,1)} (igo egiten da, Le Châtelierrek dioen bezala).`),{tol:0.02,label:'X (%)'}); }
U.push({id:'o6',short:b('Perturbaciones','Perturbazioak'),title:b('Perturbaciones: Le Châtelier y Q','Perturbazioak: Le Châtelier eta Q'),sub:b('Qué pasa al comprimir, añadir, retirar o calentar, y cómo se calcula el nuevo equilibrio','Zer gertatzen den konprimitzean, gehitzean, kentzean edo berotzean, eta oreka berria nola kalkulatzen den'),
blocks:[
  ['p',b('<b>Principio de Le Châtelier</b>: si se perturba un sistema en equilibrio, el sistema reacciona en el sentido que contrarresta la perturbación. Es una regla <b>cualitativa</b>. Para calcular, usa Q: aplica la perturbación, calcula Q y compárala con K.','<b>Le Châtelierren printzipioa</b>: orekan dagoen sistema bat perturbatzen bada, sistemak perturbazioaren eraginari aurre egiten dion noranzkoan erreakzionatzen du. Erregela <b>kualitatiboa</b> da. Kalkulatzeko, erabili Q: aplikatu perturbazioa, kalkulatu Q eta alderatu K-rekin.')],
  ['tbl',{head:[b('Perturbación','Perturbazioa'),b('Desplazamiento','Desplazamendua'),b('¿Cambia K?','K aldatzen da?')],rows:[
    [b('+ reactivo / − producto','+ erreaktiboa / − produktua'),b('derecha','eskuinera'),b('no','ez')],
    [b('+ producto / − reactivo','+ produktua / − erreaktiboa'),b('izquierda','ezkerrera'),b('no','ez')],
    [b('comprimir (V↓, P↑)','konprimitu (V↓, P↑)'),b('hacia menos moles de gas (Δn = 0: nada)','gas-mol gutxiago dituen aldera (Δn = 0: ezer ez)'),b('no','ez')],
    [b('expandir (V↑)','hedatu (V↑)'),b('hacia más moles de gas','gas-mol gehiago dituen aldera'),b('no','ez')],
    [b('inerte a V constante','geldoa V konstantean'),b('ninguno','ezer ez'),b('no','ez')],
    [b('inerte a P constante','geldoa P konstantean'),b('como una expansión','hedapen bat bezala'),b('no','ez')],
    [b('añadir sólido o líquido puro','solido edo likido purua gehitu'),b('ninguno','ezer ez'),b('no','ez')],
    [b('calentar','berotu'),b('sentido endotérmico','noranzko endotermikoa'),b('<b>sí</b>','<b>bai</b>')],
    [b('enfriar','hoztu'),b('sentido exotérmico','noranzko exotermikoa'),b('<b>sí</b>','<b>bai</b>')],
    [b('catalizador','katalizatzailea'),b('ninguno (se llega antes)','ezer ez (lehenago iristen da)'),b('no','ez')]]}],
  ['steps',[b('Toma los moles del <b>equilibrio anterior</b> como nuevo estado inicial.','Hartu <b>aurreko orekako</b> molak hasierako egoera berritzat.'),b('Aplica la perturbación (nuevo V, moles añadidos o retirados, inerte…).','Aplikatu perturbazioa (V berria, gehitutako edo kendutako molak, geldoa…).'),b('Calcula Q y compárala con K (la misma K si T no cambia) → sentido.','Kalkulatu Q eta alderatu K-rekin (K bera T aldatzen ez bada) → noranzkoa.'),b('Nueva tabla con un nuevo avance y (positivo si va a la derecha) y resuelve K.','Taula berria aurrerapen berri batekin y (positiboa eskuinera badoa) eta ebatzi K.')],b('Nuevo equilibrio, cuantitativo','Oreka berria, kuantitatiboki')],
  ['ex',{title:b('Compresión: ¿se duplica la presión? (como 2024-25 ord., b)','Konpresioa: presioa bikoizten da? (2024-25 ohikoa, b bezala)'),
    q:b('N₂O₄ ⇌ 2NO₂, K<sub>c</sub> = 0,0589 a 350 K. Con 0,0400 mol de N₂O₄ en 1,00 L, en el equilibrio X = 45 % y P = 1,66 atm. Se comprime isotérmicamente a 0,50 L. ¿Nueva P? ¿Es el doble?','N₂O₄ ⇌ 2NO₂, K<sub>c</sub> = 0,0589 350 K-ean. 0,0400 mol N₂O₄ 1,00 L-tan: orekan X = % 45 eta P = 1,66 atm. Isotermikoki konprimitzen da 0,50 L-ra. P berria? Bikoitza al da?'),
    steps:[b('Recién comprimido, todas las concentraciones se duplican → Q = 2·K &gt; K → va a la <b>izquierda</b> (hacia 1 mol de gas).','Konprimitu eta berehala kontzentrazio guztiak bikoizten dira → Q = 2·K &gt; K → <b>ezkerrera</b> doa (gas-mol bat dagoen aldera).'),
      b('Más simple: plantea desde el inicio con V = 0,50 L: c₀ = 0,080 M; (2y)²/(0,080 − y) = 0,0589 → y = 0,0277 M → X = 34,7 %.','Errazago: hasieratik planteatu V = 0,50 L-rekin: c₀ = 0,080 M; (2y)²/(0,080 − y) = 0,0589 → y = 0,0277 M → X = % 34,7.'),
      b('c<sub>T</sub> = 0,080 + y = 0,1077 M → P = c<sub>T</sub>RT = 0,1077·0,082·350 = <b>3,09 atm</b>.','c<sub>T</sub> = 0,080 + y = 0,1077 M → P = c<sub>T</sub>RT = 0,1077·0,082·350 = <b>3,09 atm</b>.'),
      b('3,09 &lt; 2·1,66 = 3,33 atm: no se duplica porque al comprimir parte del NO₂ se convierte en N₂O₄ y disminuyen los moles de gas.','3,09 &lt; 2·1,66 = 3,33 atm: ez da bikoizten, konprimitzean NO₂-aren zati bat N₂O₄ bihurtzen delako eta gas-molak gutxitzen direlako.')],
    res:b('P = 3,09 atm (no 3,33): el sistema compensa en parte la compresión.','P = 3,09 atm (ez 3,33): sistemak konpresioa partzialki konpentsatzen du.')}],
  ['ex',{title:b('Añadir reactivo para subir la conversión','Erreaktiboa gehitu konbertsioa igotzeko'),
    q:b('CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = 4,0. Se parte de 1,0 mol de CO y 1,0 mol de H₂O. (a) Conversión del CO. (b) ¿Cuántos moles de H₂O (totales, desde el inicio) hacen falta para que X(CO) = 90 %?','CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = 4,0. 1,0 mol CO eta 1,0 mol H₂O-tik abiatzen da. (a) CO-aren konbertsioa. (b) Zenbat mol H₂O (guztira, hasieratik) behar dira X(CO) = % 90 izateko?'),
    steps:[b('Δn = 0 → V se cancela. (a) x²/(1 − x)² = 4 → x/(1 − x) = 2 → x = 2/3 → X = <b>66,7 %</b>.','Δn = 0 → V ezabatzen da. (a) x²/(1 − x)² = 4 → x/(1 − x) = 2 → x = 2/3 → X = <b>% 66,7</b>.'),
      b('(b) Con X = 0,90: CO = 0,10; CO₂ = H₂ = 0,90; H₂O = n − 0,90.','(b) X = 0,90-rekin: CO = 0,10; CO₂ = H₂ = 0,90; H₂O = n − 0,90.'),
      b('4,0 = 0,90²/[0,10·(n − 0,90)] → n − 0,90 = 2,025 → n = <b>2,93 mol</b> de H₂O (añadir 1,93 mol).','4,0 = 0,90²/[0,10·(n − 0,90)] → n − 0,90 = 2,025 → n = <b>2,93 mol</b> H₂O (1,93 mol gehitu).')],
    res:b('66,7 %; 2,93 mol de H₂O en total.','% 66,7; 2,93 mol H₂O guztira.'),check:b('Exceso de un reactivo → más conversión del otro: Le Châtelier ✓.','Erreaktibo baten soberakina → bestearen konbertsio handiagoa: Le Châtelier ✓.')}],
  ['lab','reactor',{rx:'so3'}],
  ['f',{name:b('Ecuación de van \'t Hoff (ampliación)','van \'t Hoff-en ekuazioa (zabalkuntza)'),f:'ln '+frac('K<sub>2</sub>','K<sub>1</sub>')+' = −'+frac('ΔH°','R')+'·('+frac('1','T<sub>2</sub>')+' − '+frac('1','T<sub>1</sub>')+')',
    vars:[['ΔH°',b('entalpía de reacción','erreakzio-entalpia'),'J/mol'],['R','8,314','J/(mol·K)']],
    use:b('Para cuantificar cómo cambia K con T. No aparece en los apuntes; la solución de 2021-22 ext. (cuyo enunciado no tenemos) calcula una temperatura, probablemente con ella.','K T-rekin nola aldatzen den kuantifikatzeko. Ez dago apunteetan; 2021-22 ez-ohikoaren ebazpenak (enuntziatua ez dugu) tenperatura bat kalkulatzen du, ziurrenik honekin.')}],
  ['fix',b('Ejemplo numérico de compresión de los apuntes (N₂ + 3H₂ ⇌ 2NH₃: 2/6/2 M → 4/12/4 → «nuevo equilibrio» 2/6/8 M). La dirección es correcta, pero los números <b>no cumplen la K</b> inicial (K<sub>c</sub> pasa de 9,3×10^-3 a 0,148). Tómalo solo como ilustración.','Apunteetako konpresio-adibide numerikoa (N₂ + 3H₂ ⇌ 2NH₃: 2/6/2 M → 4/12/4 → «oreka berria» 2/6/8 M). Norabidea zuzena da, baina zenbakiek <b>ez dute hasierako K betetzen</b> (K<sub>c</sub> 9,3×10^-3-tik 0,148ra pasatzen da). Hartu ilustrazio gisa bakarrik.')],
  ['exam',b(`${ax('2019-20-o',2)} (compresión del SO₃ a 15 atm), ${ax('2022-23-o',1)}b (nuevo volumen para X = 85 %), ${ax('2022-23-e',2)}c (añadir H₂ para duplicar P<sub>H₂O</sub>), ${ax('2024-25-o',3)}b (comprimir a la mitad), ${ax('2024-25-e',1)}b (añadir CO y H₂O).`,`${ax('2019-20-o',2)} (SO₃-aren konpresioa 15 atm-ra), ${ax('2022-23-o',1)}b (bolumen berria X = % 85erako), ${ax('2022-23-e',2)}c (H₂ gehitu P<sub>H₂O</sub> bikoizteko), ${ax('2024-25-o',3)}b (erdira konprimitu), ${ax('2024-25-e',1)}b (CO eta H₂O gehitu).`)],
  ['terms',[['perturbación','perturbazioa'],['desplazamiento','desplazamendua'],['comprimir isotérmicamente','isotermikoki konprimitu'],['exotérmica / endotérmica','exotermikoa / endotermikoa'],['catalizador','katalizatzailea']]],
],
quiz:()=>[q6(),q6(),q6(),q6(),q6(),q6num(),q6num(),q1dir()],
cards:[
  [b('Comprimir un sistema gaseoso en equilibrio','Orekan dagoen gas-sistema bat konprimitu'),b('Se desplaza hacia el lado con menos moles de gas (si Δn = 0, nada). K no cambia.','Gas-mol gutxiagoko aldera desplazatzen da (Δn = 0 bada, ezer ez). K ez da aldatzen.')],
  [b('Inerte a V constante vs a P constante','Geldoa V konstantean vs P konstantean'),b('V cte: nada. P cte: como una expansión (hacia más moles de gas).','V konstantean: ez da desplazatzen. P konstantean: hedapen baten antzera (gas-mol gehiago dituen aldera).')],
  [b('Única perturbación que cambia K','K aldatzen duen perturbazio bakarra'),b('La temperatura.','Tenperatura.')],
  [b('Al comprimir a V/2, ¿P<sub>eq</sub> se duplica?','V/2-ra konprimitzean, P<sub>eq</sub> bikoizten da?'),b('Solo si Δn = 0. Si Δn ≠ 0, el sistema compensa y P sube menos del doble (si va hacia menos moles).','Δn = 0 bada bakarrik. Δn ≠ 0 bada, sistemak konpentsatzen du eta P bikoitza baino gutxiago igotzen da (gas-mol gutxiago dituen aldera badoa).')],
  [b('Cómo calcular el nuevo equilibrio','Oreka berria nola kalkulatu'),b('Equilibrio anterior → perturbación → Q vs K → nueva tabla con y → resolver con la misma K.','Aurreko oreka → perturbazioa → Q vs K → taula berria y-rekin → K berarekin ebatzi.')],
]});

/* ===================================================================
   EJERCICIOS ORIGINALES
   =================================================================== */
const X=[
 {id:'O-01',lvl:0,skill:b('Manipular K; K<sub>p</sub>↔K<sub>c</sub>','K manipulatu; K<sub>p</sub>↔K<sub>c</sub>'),title:b('Tres formas de escribir una reacción','Erreakzio bat idazteko hiru modu'),
  q:b('Para 2NO(g) + O₂(g) ⇌ 2NO₂(g), K<sub>c</sub> = 1,2×10^4 a 500 K.','2NO(g) + O₂(g) ⇌ 2NO₂(g) erreakziorako, K<sub>c</sub> = 1,2×10^4 500 K-ean.'),
  parts:[{q:b('a) K<sub>p</sub> a 500 K (atm<sup>−1</sup>)','a) K<sub>p</sub> 500 K-ean (atm<sup>−1</sup>)'),ans:292.7},{q:b('b) K<sub>c</sub> de 2NO₂ ⇌ 2NO + O₂','b) 2NO₂ ⇌ 2NO + O₂-ren K<sub>c</sub>'),ans:8.333e-5},{q:b('c) K<sub>c</sub> de NO + ½O₂ ⇌ NO₂','c) NO + ½O₂ ⇌ NO₂-ren K<sub>c</sub>'),ans:109.5}],
  hints:[b('Δn<sub>gas</sub> = 2 − 3 = −1.','Δn<sub>gas</sub> = 2 − 3 = −1.'),b('Invertir → 1/K; dividir coeficientes entre 2 → √K.','Alderantzikatu → 1/K; koefizienteak 2z zatitu → √K.')],
  sol:[b('K<sub>p</sub> = K<sub>c</sub>(RT)<sup>−1</sup> = 1,2×10^4/(0,082·500) = <b>293 atm<sup>−1</sup></b>.','K<sub>p</sub> = K<sub>c</sub>(RT)<sup>−1</sup> = 1,2×10^4/(0,082·500) = <b>293 atm<sup>−1</sup></b>.'),b('Inversa: 1/1,2×10^4 = <b>8,33×10^-5</b> M.','Alderantzizkoa: 1/1,2×10^4 = <b>8,33×10^-5</b> M.'),b('Mitad de coeficientes: √(1,2×10^4) = <b>110</b> M<sup>−1/2</sup>.','Koefiziente guztiak 2z zatituta: √(1,2×10^4) = <b>110</b> M<sup>−1/2</sup>.')],
  res:b('293 atm⁻¹; 8,33×10⁻⁵ M; 110 M<sup>−1/2</sup>','293 atm⁻¹; 8,33×10⁻⁵ M; 110 M<sup>−1/2</sup>'),errs:b('Usar Δn = +1 (al revés) o elevar al cuadrado en vez de hacer la raíz.','Δn = +1 erabiltzea (alderantziz) edo karratura berretzea erroa egin beharrean.')},
 {id:'O-02',lvl:0,skill:b('Reactivo limitante y conversión','Erreaktibo mugatzailea eta konbertsioa'),title:b('Síntesis de amoníaco sin equilibrio','Amoniakoaren sintesia orekarik gabe'),
  q:b('Se mezclan 3,0 mol de H₂ y 2,0 mol de N₂ (N₂ + 3H₂ → 2NH₃) y se forman 0,90 mol de NH₃.','3,0 mol H₂ eta 2,0 mol N₂ nahasten dira (N₂ + 3H₂ → 2NH₃) eta 0,90 mol NH₃ sortzen dira.'),
  parts:[{q:b('a) Conversión del reactivo limitante (%)','a) Erreaktibo mugatzailearen konbertsioa (%)'),ans:45,tol:0.02},{q:b('b) Moles de N₂ que quedan','b) Geratzen diren N₂ molak'),ans:1.55}],
  hints:[b('Limitante: compara 3,0/3 con 2,0/1.','Mugatzailea: alderatu 3,0/3 eta 2,0/1.'),b('0,90 mol NH₃ → ξ = 0,45 mol.','0,90 mol NH₃ → ξ = 0,45 mol.')],
  sol:[b('H₂: 3,0/3 = 1,0 &lt; N₂: 2,0/1 = 2,0 → limitante <b>H₂</b>.','H₂: 3,0/3 = 1,0 &lt; N₂: 2,0/1 = 2,0 → mugatzailea <b>H₂</b>.'),b('ξ = 0,90/2 = 0,45 mol → H₂ reaccionado = 3·0,45 = 1,35 mol → X = 1,35/3,0 = <b>45 %</b>.','ξ = 0,90/2 = 0,45 mol → erreakzionatutako H₂ = 3·0,45 = 1,35 mol → X = 1,35/3,0 = <b>% 45</b>.'),b('N₂ = 2,0 − 0,45 = <b>1,55 mol</b>.','N₂ = 2,0 − 0,45 = <b>1,55 mol</b>.')],
  res:b('X = 45 %; 1,55 mol N₂','X = % 45; 1,55 mol N₂'),errs:b('Calcular X sobre el N₂ (22,5 %).','X N₂-aren gainean kalkulatzea (% 22,5).')},
 {id:'O-03',lvl:1,skill:b('Dalton','Dalton'),title:b('Presiones parciales de una mezcla','Nahaste baten presio partzialak'),
  q:b('2,0 mol de CO, 1,0 mol de H₂O(g) y 0,50 mol de N₂ en un recipiente de 20 L a 600 K.','2,0 mol CO, 1,0 mol H₂O(g) eta 0,50 mol N₂ 20 L-ko ontzi batean 600 K-ean.'),
  parts:[{q:b('a) Presión total (atm)','a) Presio totala (atm)'),ans:8.61},{q:b('b) Presión parcial del CO (atm)','b) CO-aren presio partziala (atm)'),ans:4.92},{q:b('c) % en volumen de N₂','c) N₂-aren bolumen-%'),ans:14.29,tol:0.02}],
  hints:[b('n<sub>T</sub> = 3,5 mol.','n<sub>T</sub> = 3,5 mol.')],
  sol:[b('P<sub>T</sub> = 3,5·0,082·600/20 = <b>8,61 atm</b>.','P<sub>T</sub> = 3,5·0,082·600/20 = <b>8,61 atm</b>.'),b('P<sub>CO</sub> = (2,0/3,5)·8,61 = <b>4,92 atm</b>.','P<sub>CO</sub> = (2,0/3,5)·8,61 = <b>4,92 atm</b>.'),b('% vol N₂ = 0,50/3,5·100 = <b>14,3 %</b>.','N₂-aren bolumen-% = 0,50/3,5·100 = <b>% 14,3</b>.')],res:'8,61 atm; 4,92 atm; 14,3 %'},
 {id:'O-04',lvl:1,skill:b('Equilibrio homogéneo con K<sub>c</sub>','Oreka homogeneoa K<sub>c</sub>-rekin'),title:b('Disociación del PCl₅','PCl₅-aren disoziazioa'),
  q:b('Se introducen 0,50 mol de PCl₅ en un recipiente rígido de 2,0 L a 523 K: PCl₅ ⇌ PCl₃ + Cl₂, K<sub>c</sub> = 0,042.','0,50 mol PCl₅ 2,0 L-ko ontzi zurrun batean sartzen dira 523 K-ean: PCl₅ ⇌ PCl₃ + Cl₂, K<sub>c</sub> = 0,042.'),
  parts:[{q:b('a) [Cl₂] en el equilibrio (M)','a) Orekako [Cl₂] (M)'),ans:0.0836},{q:b('b) Grado de disociación (%)','b) Disoziazio-gradua (%)'),ans:33.4,tol:0.02},{q:b('c) Presión total (atm)','c) Presio totala (atm)'),ans:14.31},{q:b('d) K<sub>p</sub>','d) K<sub>p</sub>'),ans:1.80}],
  hints:[b('c₀ = 0,25 M; x²/(0,25 − x) = 0,042.','c₀ = 0,25 M; x²/(0,25 − x) = 0,042.'),b('Concentración total = 0,25 + x.','Kontzentrazio totala = 0,25 + x.')],
  sol:[b('x² + 0,042x − 0,0105 = 0 → x = <b>0,0836 M</b>.','x² + 0,042x − 0,0105 = 0 → x = <b>0,0836 M</b>.'),b('α = 0,0836/0,25 = <b>33,4 %</b>.','α = 0,0836/0,25 = <b>% 33,4</b>.'),b('P = (0,25 + 0,0836)·0,082·523 = <b>14,3 atm</b>.','P = (0,25 + 0,0836)·0,082·523 = <b>14,3 atm</b>.'),b('K<sub>p</sub> = K<sub>c</sub>·RT = 0,042·42,9 = <b>1,80 atm</b>.','K<sub>p</sub> = K<sub>c</sub>·RT = 0,042·42,9 = <b>1,80 atm</b>.')],
  res:'0,0836 M; 33,4 %; 14,3 atm; K<sub>p</sub> = 1,80',check:b('Sustituyendo: 0,0836²/0,1664 = 0,0420 ✓.','Ordezkatuz: 0,0836²/0,1664 = 0,0420 ✓.')},
 {id:'O-05',lvl:2,skill:b('Reactor rígido con inerte (tipo examen)','Erreaktore zurruna geldoarekin (azterketa motakoa)'),title:b('Metanol: de la presión a la constante','Metanola: presiotik konstantera'),
  q:b('1,00 mol CO, 2,00 mol H₂ y 1,00 mol N₂ en un reactor rígido de 10,0 L a 500 K: CO + 2H₂ ⇌ CH₃OH(g). En el equilibrio P = 12,3 atm.','1,00 mol CO, 2,00 mol H₂ eta 1,00 mol N₂ 10,0 L-ko erreaktore zurrun batean 500 K-ean: CO + 2H₂ ⇌ CH₃OH(g). Orekan P = 12,3 atm.'),
  parts:[{q:b('a) Conversión (%)','a) Konbertsioa (%)'),ans:50,tol:0.02},{q:b('b) K<sub>c</sub> (M<sup>−2</sup>)','b) K<sub>c</sub> (M<sup>−2</sup>)'),ans:100},{q:b('c) % vol de CH₃OH','c) CH₃OH-aren bolumen-%'),ans:16.67,tol:0.02},{q:b('d) Volumen del reactor para X = 60 % (L)','d) X = % 60 izateko erreaktorearen bolumena (L)'),ans:6.53}],
  hints:[b('n<sub>T</sub> = PV/RT y n<sub>T</sub> = 4 − 2ξ.','n<sub>T</sub> = PV/RT eta n<sub>T</sub> = 4 − 2ξ.'),b('Para d) escribe K<sub>c</sub> con n<sub>i</sub>/V y despeja V.','d)-rako idatzi K<sub>c</sub> n<sub>i</sub>/V-rekin eta askatu V.')],
  sol:[b('n<sub>T</sub> = 12,3·10/(0,082·500) = 3,00 → ξ = 0,50 → X = <b>50 %</b>.','n<sub>T</sub> = 12,3·10/(0,082·500) = 3,00 → ξ = 0,50 → X = <b>% 50</b>.'),b('K<sub>c</sub> = 0,050/(0,050·0,100²) = <b>100</b>.','K<sub>c</sub> = 0,050/(0,050·0,100²) = <b>100</b>.'),b('% CH₃OH = 0,50/3,00 = <b>16,7 %</b>.','CH₃OH-aren % = 0,50/3,00 = <b>% 16,7</b>.'),b('0,60V²/(0,40·0,64) = 100 → V = <b>6,53 L</b>.','0,60V²/(0,40·0,64) = 100 → V = <b>6,53 L</b>.')],
  res:'50 %; 100 M⁻²; 16,7 %; 6,53 L',rubric:b('Tabla de moles con inerte (25 %) · n<sub>T</sub> desde PV = nRT (25 %) · K<sub>c</sub> con unidades (25 %) · despeje de V y discusión (25 %).','Mol-taula geldoarekin (% 25) · n<sub>T</sub> PV = nRT-tik (% 25) · K<sub>c</sub> unitateekin (% 25) · V askatu eta eztabaidatu (% 25).')},
 {id:'O-06',lvl:2,skill:b('Subida de presión → K; compresión','Presio-igoera → K; konpresioa'),title:b('N₂O₄ en un recipiente rígido','N₂O₄ ontzi zurrun batean'),
  q:b('0,0400 mol de N₂O₄ en un recipiente rígido de 1,00 L a 350 K (N₂O₄ ⇌ 2NO₂). En el equilibrio la presión es un 45 % mayor que la inicial.','0,0400 mol N₂O₄ 1,00 L-ko ontzi zurrun batean 350 K-ean (N₂O₄ ⇌ 2NO₂). Orekan presioa hasierakoa baino % 45 handiagoa da.'),
  parts:[{q:'a) K<sub>c</sub>',ans:0.0589},{q:'b) K<sub>p</sub> (atm)',ans:1.69},{q:b('c) Presión de equilibrio tras comprimir a 0,500 L (atm)','c) 0,500 L-ra konprimitu ondorengo oreka-presioa (atm)'),ans:3.09}],
  hints:[b('n<sub>T</sub> = n₀(1 + X) → X = 0,45.','n<sub>T</sub> = n₀(1 + X) → X = 0,45.'),b('Para c) plantea de nuevo con c₀ = 0,080 M.','c)-rako planteatu berriro c₀ = 0,080 M-rekin.')],
  sol:[b('[N₂O₄] = 0,022, [NO₂] = 0,036 M → K<sub>c</sub> = 0,036²/0,022 = <b>0,0589</b>.','[N₂O₄] = 0,022, [NO₂] = 0,036 M → K<sub>c</sub> = 0,036²/0,022 = <b>0,0589</b>.'),b('K<sub>p</sub> = K<sub>c</sub>·RT = 0,0589·28,7 = <b>1,69 atm</b>.','K<sub>p</sub> = K<sub>c</sub>·RT = 0,0589·28,7 = <b>1,69 atm</b>.'),b('4y²/(0,080 − y) = 0,0589 → y = 0,0277 → P = 0,1077·0,082·350 = <b>3,09 atm</b> (no 2·1,66 = 3,33).','4y²/(0,080 − y) = 0,0589 → y = 0,0277 → P = 0,1077·0,082·350 = <b>3,09 atm</b> (ez 2·1,66 = 3,33).')],
  res:'0,0589; 1,69 atm; 3,09 atm'},
 {id:'O-07',lvl:1,skill:b('Heterogéneo, sólido que se agota','Heterogeneoa, agortzen den solidoa'),title:b('Calcinación de la caliza','Kareharriaren kaltzinazioa'),
  q:b('10,0 g de CaCO₃ (M = 100) a 1073 K en un recipiente vacío de 5,0 L: CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = 0,236.','10,0 g CaCO₃ (M = 100) 1073 K-ean 5,0 L-ko ontzi huts batean: CaCO₃(s) ⇌ CaO(s) + CO₂(g), K<sub>p</sub> = 0,236.'),
  parts:[{q:b('a) % de CaCO₃ descompuesto','a) Deskonposatutako CaCO₃-aren %'),ans:13.41,tol:0.02},{q:b('b) Volumen mínimo para descomponerlo todo (L)','b) Dena deskonposatzeko bolumen minimoa (L)'),ans:37.3}],
  hints:[b('Mientras quede sólido, P<sub>CO₂</sub> = K<sub>p</sub>.','Solidoa geratzen den bitartean, P<sub>CO₂</sub> = K<sub>p</sub>.')],
  sol:[b('n = 0,236·5/(0,082·1073) = 0,0134 mol → <b>13,4 %</b>.','n = 0,236·5/(0,082·1073) = 0,0134 mol → <b>% 13,4</b>.'),b('V = 0,100·0,082·1073/0,236 = <b>37,3 L</b>.','V = 0,100·0,082·1073/0,236 = <b>37,3 L</b>.')],res:'13,4 %; 37,3 L'},
 {id:'O-08',lvl:2,skill:b('Heterogéneo Δn = 0; sólido mínimo','Heterogeneoa Δn = 0; solido minimoa'),title:b('Reducción de magnetita con CO','Magnetitaren erredukzioa CO-rekin'),
  q:b('Fe₃O₄(s) + CO(g) ⇌ 3FeO(s) + CO₂(g), K<sub>p</sub> = 1,15 a 700 °C. En un reactor de 3,0 L se introducen 0,100 mol de Fe₃O₄, 0,150 mol de CO y 0,050 mol de N₂.','Fe₃O₄(s) + CO(g) ⇌ 3FeO(s) + CO₂(g), K<sub>p</sub> = 1,15 700 °C-an. 3,0 L-ko erreaktore batean 0,100 mol Fe₃O₄, 0,150 mol CO eta 0,050 mol N₂ sartzen dira.'),
  parts:[{q:b('a) Moles de CO₂ en el equilibrio','a) Orekako CO₂ molak'),ans:0.0802},{q:b('b) % vol de CO en el gas','b) Gaseko CO-aren bolumen-%'),ans:34.9,tol:0.02},{q:b('c) Masa mínima de Fe₃O₄ para llegar al equilibrio (g; M = 231,5)','c) Orekara iristeko Fe₃O₄ masa minimoa (g; M = 231,5)'),ans:18.57},{q:b('d) Presión total (atm)','d) Presio totala (atm)'),ans:5.32}],
  hints:[b('K = n(CO₂)/n(CO) y n(CO) + n(CO₂) = 0,150.','K = n(CO₂)/n(CO) eta n(CO) + n(CO₂) = 0,150.')],
  sol:[b('n(CO₂) = 1,15/2,15·0,150 = <b>0,0802 mol</b>; n(CO) = 0,0698.','n(CO₂) = 1,15/2,15·0,150 = <b>0,0802 mol</b>; n(CO) = 0,0698.'),b('Gas total 0,200 mol (los moles de gas no cambian) → % CO = <b>34,9 %</b> (CO₂ 40,1 %, N₂ 25,0 %).','Gas totala 0,200 mol (gas-molak ez dira aldatzen) → CO % = <b>% 34,9</b> (CO₂ % 40,1, N₂ % 25,0).'),b('Fe₃O₄ mínimo = ξ = 0,0802 mol → <b>18,6 g</b> (hay 23,15 g: sí se alcanza).','Fe₃O₄ minimoa = ξ = 0,0802 mol → <b>18,6 g</b> (23,15 g daude: lortzen da).'),b('P = 0,200·0,082·973/3,0 = <b>5,32 atm</b>.','P = 0,200·0,082·973/3,0 = <b>5,32 atm</b>.')],res:'0,0802 mol; 34,9 %; 18,6 g; 5,32 atm'},
 {id:'O-09',lvl:3,skill:b('Perturbación por adición','Gehiketa bidezko perturbazioa'),title:b('Más vapor de agua, más conversión','Ur-lurrun gehiago, konbertsio handiagoa'),
  q:b('CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = 4,0. Se parte de 1,0 mol de CO y 1,0 mol de H₂O en un recipiente rígido. Una vez en equilibrio se añade 1,0 mol de H₂O.','CO + H₂O ⇌ CO₂ + H₂, K<sub>c</sub> = 4,0. 1,0 mol CO eta 1,0 mol H₂O-tik abiatzen da ontzi zurrun batean. Orekan dagoenean 1,0 mol H₂O gehitzen da.'),
  parts:[{q:b('a) Conversión del CO en el primer equilibrio (%)','a) CO-aren konbertsioa lehen orekan (%)'),ans:66.67,tol:0.02},{q:b('b) Conversión del CO tras añadir el agua (%)','b) CO-aren konbertsioa ura gehitu ondoren (%)'),ans:84.53,tol:0.02},{q:b('c) Moles de H₂O a añadir sobre el equilibrio inicial para X = 90 %','c) X = % 90 lortzeko hasierako orekari gehitu beharreko H₂O molak'),ans:1.925}],
  hints:[b('Δn = 0: trabaja con moles.','Δn = 0: molekin lan egin.'),b('Tras añadir: (2/3 + y)² = 4(1/3 − y)(4/3 − y).','Gehitu ondoren: (2/3 + y)² = 4(1/3 − y)(4/3 − y).')],
  sol:[b('x/(1−x) = 2 → X = <b>66,7 %</b>.','x/(1−x) = 2 → X = <b>% 66,7</b>.'),b('Resolviendo: y = 0,179 → CO₂ = 0,845 → X = <b>84,5 %</b>.','Ebatziz: y = 0,179 → CO₂ = 0,845 → X = <b>% 84,5</b>.'),b('Con X = 0,90: H₂O<sub>eq</sub> = 0,81/(4·0,10) = 2,025 → H₂O total = 2,925 → sobre el 1,0 inicial hay que añadir <b>1,93 mol</b>.','X = 0,90-rekin: H₂O<sub>eq</sub> = 0,81/(4·0,10) = 2,025 → H₂O totala = 2,925 → hasierako 1,0ari <b>1,93 mol</b> gehitu behar zaizkio.')],
  res:'66,7 %; 84,5 %; 1,93 mol',errs:b('Olvidar que tras la adición el sistema parte del equilibrio anterior, no del inicio.','Gehiketaren ondoren sistema aurreko orekatik abiatzen dela ahaztea, ez hasieratik.')},
 {id:'O-10',lvl:3,skill:b('Compresión con inerte; K<sub>p</sub> en moles','Konpresioa geldoarekin; K<sub>p</sub> moletan'),title:b('Trióxido de azufre bajo presión','Sufre trioxidoa presiopean'),
  q:b('2SO₂ + O₂ ⇌ 2SO₃, K<sub>p</sub> = 3,33 atm<sup>−1</sup> a 1000 K. Se cargan 2,0 mol SO₂, 1,0 mol O₂ y 1,0 mol N₂ en un reactor rígido de 50 L.','2SO₂ + O₂ ⇌ 2SO₃, K<sub>p</sub> = 3,33 atm<sup>−1</sup> 1000 K-ean. 2,0 mol SO₂, 1,0 mol O₂ eta 1,0 mol N₂ 50 L-ko erreaktore zurrun batean kargatzen dira.'),
  parts:[{q:b('a) Conversión del SO₂ (%)','a) SO₂-aren konbertsioa (%)'),ans:59.7,tol:0.02},{q:b('b) Presión total (atm)','b) Presio totala (atm)'),ans:5.58},{q:b('c) Conversión si el reactor fuera de 25 L (%)','c) Konbertsioa erreaktorea 25 L-koa balitz (%)'),ans:65.9,tol:0.02}],
  hints:[b('K<sub>p</sub> = (2ξ)²/[(2 − 2ξ)²(1 − ξ)] · V/(RT).','K<sub>p</sub> = (2ξ)²/[(2 − 2ξ)²(1 − ξ)] · V/(RT).'),b('Es de grado 3: tantea ξ entre 0,5 y 0,7.','3. mailakoa da: probatu ξ 0,5 eta 0,7 artean.')],
  sol:[b('Tanteando: ξ = 0,597 → X = <b>59,7 %</b>.','Saiakeraz: ξ = 0,597 → X = <b>% 59,7</b>.'),b('n<sub>T</sub> = 4 − ξ = 3,403 → P = 3,403·0,082·1000/50 = <b>5,58 atm</b>.','n<sub>T</sub> = 4 − ξ = 3,403 → P = 3,403·0,082·1000/50 = <b>5,58 atm</b>.'),b('Con V = 25 L: ξ = 0,659 → X = <b>65,9 %</b> (comprimir favorece SO₃, Δn = −1).','V = 25 L-rekin: ξ = 0,659 → X = <b>% 65,9</b> (konprimitzeak SO₃ faboratzen du, Δn = −1).')],
  res:'59,7 %; 5,58 atm; 65,9 %',check:b('Compruébalo en el laboratorio «reactor» (reacción 2SO₂ + O₂).','Egiaztatu «erreaktorea» laborategian (2SO₂ + O₂ erreakzioa).')},
];

/* ===================================================================
   RESUMEN, VOCABULARIO, INTRO
   =================================================================== */
K.topic({id:'oreka',units:U,exercises:X,
 labs:[['reactor',{rx:'nh3'},b('Reactor de equilibrio','Oreka-erreaktorea')],['qk',{},b('Q frente a K','Q eta K')]],
 intro:[
  ['p',b('<b>Prioridad alta.</b> Un problema de equilibrio gaseoso ha salido en 8 de 10 exámenes, y en <b>todos</b> desde 2022-23. Suele valer 3-4 puntos.','<b>Lehentasun handia.</b> Gas-oreka problema bat 10 azterketatik 8tan atera da, eta 2022-23tik <b>guztietan</b>. 3-4 puntu balio izan ohi ditu.')],
 ],
 vocab:[
  ['equilibrio químico','oreka kimikoa'],['constante de equilibrio','oreka-konstantea'],['cociente de reacción','erreakzio-zatidura'],['reactivo limitante','erreaktibo mugatzailea'],
  ['conversión','konbertsioa'],['avance de reacción','erreakzioaren aurrerapena'],['presión parcial','presio partziala'],['fracción molar','frakzio molarra'],
  ['gas inerte','gas geldoa'],['reactor cerrado y rígido','erreaktore itxi eta zurruna'],['comprimir isotérmicamente','isotermikoki konprimitu'],['composición volumétrica','konposizio bolumetrikoa'],
  ['condiciones normales','baldintza normalak'],['equilibrio heterogéneo','oreka heterogeneoa'],['perturbación','perturbazioa'],['desplazamiento del equilibrio','orekaren desplazamendua'],
  ['reacción reversible','erreakzio itzulgarria'],['reacción irreversible','erreakzio itzulezina'],['exotérmica','exotermikoa'],['endotérmica','endotermikoa'],['catalizador','katalizatzailea'],
  ['hacia la derecha / izquierda','eskuinera / ezkerrera'],['grado de disociación','disoziazio-gradua'],['magnetita','magnetita'],['retirar (un producto)','(produktu bat) kendu / atera'],
 ].map(([es,eu])=>[es,eu]),
 summary:[
  [['h',b('Formulario','Formulategia')],['tbl',{head:[b('Qué','Zer'),b('Fórmula','Formula'),b('Notas','Oharrak')],rows:[
    [b('Constante','Konstantea'),'K<sub>c</sub> = Π[i]<sup>ν<sub>i</sub></sup> · K<sub>p</sub> = ΠP<sub>i</sub><sup>ν<sub>i</sub></sup>',b('sin sólidos, líquidos puros ni disolvente','solidorik, likido pururik eta disolbatzailerik gabe')],
    [b('Relación','Erlazioa'),'K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>',b('R = 0,082; T en K; Δn solo gases','R = 0,082; T K-tan; Δn gasak bakarrik')],
    [b('Manipular K','K manipulatu'),'1/K · K<sup>n</sup> · K<sub>1</sub>K<sub>2</sub>',b('invertir · ×n · sumar','alderantzikatu · ×n · batu')],
    [b('Moles','Molak'),'n<sub>i</sub> = n<sub>i,0</sub> + ν<sub>i</sub>ξ · n<sub>T</sub> = n<sub>T,0</sub> + Δn·ξ',b('inerte en n<sub>T</sub>','geldoa n<sub>T</sub>-n')],
    [b('Conversión','Konbertsioa'),'X = (n<sub>EM,0</sub> − n<sub>EM</sub>)/n<sub>EM,0</sub>',b('respecto al limitante','mugatzaileari dagokionez')],
    [b('Gases','Gasak'),'PV = n<sub>T</sub>RT · P<sub>i</sub> = y<sub>i</sub>P<sub>T</sub> = n<sub>i</sub>RT/V',b('% vol = % mol','bolumen-% = mol-%')],
    [b('Rígido, T cte','Zurruna, T kte'),'P<sub>1</sub>/P<sub>0</sub> = n<sub>T,1</sub>/n<sub>T,0</sub>',b('subida de presión → ξ','presio-igoera → ξ')],
    [b('Heterogéneo Δn = 0','Heterogeneoa Δn = 0'),'K = n<sub>prod</sub>/n<sub>reac</sub> · X = K/(1+K)',b('no depende de V ni P','ez dago V eta P-ren menpe')],
    [b('Sentido','Noranzkoa'),'Q &lt; K → · Q = K · Q &gt; K ←',b('Q con valores del instante','Q uneko balioekin')],
    ['van \'t Hoff','ln(K<sub>2</sub>/K<sub>1</sub>) = −ΔH°/R·(1/T<sub>2</sub> − 1/T<sub>1</sub>)',b('ampliación','zabalkuntza')]]}]],
  [['h',b('Errores que debes evitar','Saihestu beharreko akatsak')],['ul',[
    b('T en °C (siempre en K). R = 0,082 con atm y L.','T °C-tan (beti K-tan). R = 0,082 atm eta L-rekin.'),
    b('Olvidar el inerte al calcular n<sub>T</sub>, P<sub>T</sub> o el % en volumen.','Geldoa ahaztea n<sub>T</sub>, P<sub>T</sub> edo bolumen-% kalkulatzean.'),
    b('Meter sólidos en K o en Δn.','Solidoak K-n edo Δn-n sartzea.'),
    b('Usar la K dada para otros coeficientes (2FeO frente a FeO: K frente a √K).','Beste koefiziente batzuetarako emandako K erabiltzea (2FeO vs FeO: K vs √K).'),
    b('Calcular la conversión con el reactivo en exceso.','Konbertsioa soberako erreaktiboarekin kalkulatzea.'),
    b('Quedarse con una raíz que da moles negativos.','Mol negatiboak ematen dituen erroa hartzea.'),
    b('Tras una perturbación, partir del estado inicial en vez del equilibrio anterior.','Perturbazio baten ondoren, hasierako egoeratik abiatzea, aurreko orekatik abiatu beharrean.'),
    b('No indicar si la K calculada es K<sub>c</sub> o K<sub>p</sub>, ni sus unidades.','Kalkulatutako K K<sub>c</sub> edo K<sub>p</sub> den eta haren unitateak ez adieraztea.')]]],
  [['check',[b('Escribo K<sub>c</sub> y K<sub>p</sub> de cualquier reacción (también heterogénea).','Edozein erreakzioren K<sub>c</sub> eta K<sub>p</sub> idazten ditut (heterogeneoa ere).'),
    b('Construyo la tabla de moles con ξ, con inerte y productos iniciales.','ξ-dun mol-taula egiten dut, geldoarekin eta hasierako produktuekin.'),
    b('Paso de P<sub>T</sub> a ξ en un reactor rígido.','Erreaktore zurrun batean P<sub>T</sub>-tik ξ-ra pasatzen naiz.'),
    b('Resuelvo ecuaciones de grado 2 y tanteo las de grado 3-4.','2. mailako ekuazioak ebazten ditut eta 3-4. mailakoak saiakeraz.'),
    b('Predigo y calculo el efecto de comprimir, añadir inerte, añadir o retirar especies.','Konprimitzearen, geldoa gehitzearen, espezieak gehitu edo kentzearen eragina aurreikusi eta kalkulatzen dut.'),
    b('Sé cuándo un sólido limita el equilibrio (cantidad mínima, retirada continua de producto).','Badakit noiz mugatzen duen solido batek oreka (kantitate minimoa, produktuaren etengabeko kentzea).')]]],
  [['h',b('Correcciones a los apuntes (T2)','Apunteen zuzenketak (T2)')],['ul',[
    b('Le Châtelier es <b>cualitativo</b>; Q frente a K es <b>cuantitativo</b> (la diapositiva lo invierte).','Le Châtelier <b>kualitatiboa</b> da; Q eta K alderatzea <b>kuantitatiboa</b> (diapositibak alderantziz du).'),
    b('El ejemplo numérico de compresión del NH₃ no respeta K (solo ilustra la dirección).','NH₃-aren konpresio-adibide numerikoak ez du K-ren balioa betetzen (norabidea bakarrik erakusten du).'),
    b('Gas ideal: presiones bajas y temperaturas altas, no «P ≤ 1 atm y T ≈ 0 °C».','Gas ideala: presio baxuak eta tenperatura altuak, ez «P ≤ 1 atm eta T ≈ 0 °C».'),
    b('Q se llama «cociente de reacción» en castellano.','Q-ri gaztelaniaz «cociente de reacción» esaten zaio.'),
    b('3CaO·SiO₂ se forma con 3CaO + SiO₂ (la ecuación de la diapositiva no está ajustada).','3CaO·SiO₂ 3CaO eta SiO₂ erreakzionatzean sortzen da (diapositibako ekuazioa ez dago doituta).')]]],
 ],
});
})(window);
