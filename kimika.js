/* Kimika: estructura del curso, renderizado de lecciones por bloques, ejercicios y progreso.
   Los temas se registran con Kimika.topic({...}) desde los archivos t-*.js. */
(function(g){
'use strict';
const E=g.Estudio, L=E.L, R=E.rich, b=E.b, $=E.$;
const K={};

/* ---------- temas en orden de aprendizaje ---------- */
K.TOPICS=[
  {id:'oinarriak',   sym:'mol', tile:'0',   ref:'—',     col:'oinarri',
   title:b('Fundamentos','Oinarriak'), sub:b('Concentraciones, estequiometría, gases y tablas ICE','Kontzentrazioak, estekiometria, gasak eta ICE taulak')},
  {id:'oreka',       sym:'⇌',  tile:'T2',  ref:'T2',    col:'oreka',
   title:b('Equilibrio químico','Oreka kimikoa'), sub:b('Kc, Kp, conversión, gases inertes y Le Châtelier','Kc, Kp, konbertsioa, gas geldoak eta Le Châtelier')},
  {id:'azidobase',   sym:'pH', tile:'3.1', ref:'3.1',   col:'azido',
   title:b('Ácido-base','Azido-basea'), sub:b('pH, mezclas, neutralización, tampones y carbonato','pH-a, nahasteak, neutralizazioa, indargetzaileak eta karbonatoa')},
  {id:'hauspeatzea', sym:'Kps',tile:'3.2', ref:'3.2',   col:'hausp',
   title:b('Precipitación','Hauspeatzea'), sub:b('Kps, Qps, ion común, precipitación fraccionada y pH','Kps, Qps, ioi komuna, hauspeatze zatikatua eta pH-a')},
  {id:'pilak',       sym:'E°', tile:'3.3', ref:'3.3.1', col:'pila',
   title:b('Redox y pilas','Erredoxa eta pilak'), sub:b('Ajuste, potenciales, Nernst, K y Faraday','Doiketa, potentzialak, Nernst, K eta Faraday')},
  {id:'elektrolisia',sym:'e⁻', tile:'3.3', ref:'3.3.2', col:'elek',
   title:b('Electrólisis','Elektrolisia'), sub:b('Electrólisis competitiva, sobrepotencial y leyes de Faraday','Elektrolisi lehiakorra, gaintentsioa eta Faradayren legeak')},
  {id:'lv',          sym:'Pxy',tile:'T4',  ref:'T4',    col:'lv',
   title:b('Equilibrio líquido-vapor','Likido-lurrun oreka'), sub:b('Presión de vapor, Raoult-Dalton, burbuja y rocío, Pxy/Txy','Lurrun-presioa, Raoult-Dalton, burbuila eta ihintza, Pxy/Txy')},
];
K.byId=id=>K.TOPICS.find(t=>t.id===id);
K.EXAM_DEFAULT='2026-12-15';

/* ---------- registro de temas ---------- */
const REG={};
K.topic=def=>{ REG[def.id]=def; };
K.get=id=>REG[id];

/* ---------- progreso ---------- */
K.store=id=>E.makeStore('kimika-'+id,{prog:{},decks:null,units:{},ex:{},open:false,tab:'ruta'});
K.hub=E.makeStore('kimika-hub',{exam:K.EXAM_DEFAULT,az:{}});
K.progress=id=>{
  const def=REG[id]; let st={units:{},ex:{},prog:{}};
  try{ const r=localStorage.getItem('kimika-'+id); if(r) st=Object.assign(st,JSON.parse(r)); }catch(e){}
  const nu=def?def.units.length:0, du=def?def.units.filter(u=>st.units[u.id]&&st.units[u.id].done).length:0;
  const nx=def&&def.exercises?def.exercises.length:0, dx=Object.values(st.ex||{}).filter(x=>x&&x.ok).length;
  const now=Date.now(), due=Object.values(st.prog||{}).filter(p=>p.due<=now).length;
  return {nu,du,nx,dx,due,pct:nu?du/nu:0};
};

/* ---------- textos de interfaz del curso ---------- */
const T={
  key:b('Idea clave','Ideia nagusia'), warn:b('Error frecuente','Ohiko akatsa'), fix:b('Corrección de los apuntes','Apunteen zuzenketa'),
  exam:b('En los exámenes','Azterketetan'), note:b('Nota','Oharra'), formula:b('Fórmula','Formula'), vars:b('Qué es cada símbolo','Ikur bakoitza zer den'),
  use:b('Cuándo se usa','Noiz erabili'), cond:b('Condiciones','Baldintzak'), errs:b('Cuidado','Kontuz'), method:b('Método','Metodoa'),
  example:b('Ejemplo resuelto','Adibide ebatzia'), nextStep:b('Siguiente paso','Hurrengo urratsa'), showAll:b('Ver todo','Dena ikusi'),
  result:b('Resultado','Emaitza'), check:b('Comprobación','Egiaztapena'), checklist:b('¿Lo dominas?','Menderatzen duzu?'),
  hint:b('Pista','Pista'), sol:b('Solución','Ebazpena'), hideSol:b('Ocultar solución','Ebazpena ezkutatu'),
  data:b('Datos','Datuak'), unknown:b('Incógnitas','Ezezagunak'), level:b('Nivel','Maila'), skill:b('Competencia','Gaitasuna'),
  original:b('Ejercicio original (creado para practicar, no es de examen)','Ariketa originala (praktikatzeko sortua, ez da azterketakoa)'),
  rubric:b('Criterios de corrección','Zuzentzeko irizpideak'), errsEx:b('Errores frecuentes','Ohiko akatsak'),
  lv:[b('Básico','Oinarrizkoa'),b('Aplicación','Aplikazioa'),b('Tipo examen','Azterketa motakoa'),b('Avanzado','Aurreratua')],
  terms:b('Vocabulario','Hiztegia'),
};
K.T=T;

/* ---------- bloques de lección ---------- */
let exSeq=0;
const call=(cls,title,body)=>`<div class="callout ${cls}"><b class="t">${L(title)}</b>${R(body)}</div>`;
const BL={
  h:x=>`<h3>${R(x)}</h3>`,
  p:x=>`<p>${R(x)}</p>`,
  key:x=>call('c-key',T.key,x),
  warn:x=>call('c-warn',T.warn,x),
  fix:x=>call('c-fix',T.fix,x),
  note:x=>call('c-note',T.note,x),
  exam:x=>call('c-exam',T.exam,x),
  html:x=>L(x),
  ul:x=>`<ul>${x.map(i=>`<li>${R(i)}</li>`).join('')}</ul>`,
  steps:(x,t)=>`<div class="method"><b class="t">${L(t||T.method)}</b><ol>${x.map(i=>`<li>${R(i)}</li>`).join('')}</ol></div>`,
  check:x=>`<div class="method chk"><b class="t">${L(T.checklist)}</b><ul>${x.map(i=>`<li>${R(i)}</li>`).join('')}</ul></div>`,
  f:x=>`<div class="fcard"><div class="fmain">${R(x.f)}</div>${x.name?`<div class="fname">${R(x.name)}</div>`:''}
    ${x.vars?`<table class="fvars"><tbody>${x.vars.map(([s,d,u])=>`<tr><td class="s">${R(s)}</td><td>${R(d)}</td><td class="u">${u?R(u):''}</td></tr>`).join('')}</tbody></table>`:''}
    ${x.use?`<p><b>${L(T.use)}:</b> ${R(x.use)}</p>`:''}${x.cond?`<p><b>${L(T.cond)}:</b> ${R(x.cond)}</p>`:''}${x.err?`<p class="ferr"><b>${L(T.errs)}:</b> ${R(x.err)}</p>`:''}</div>`,
  tbl:x=>`<div class="tw"><table>${x.head?`<thead><tr>${x.head.map(h=>`<th>${R(h)}</th>`).join('')}</tr></thead>`:''}<tbody>${x.rows.map(r=>`<tr>${r.map(c=>`<td>${R(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
  ex:x=>{ const id='ex'+(++exSeq);
    return `<div class="worked" id="${id}" data-shown="0"><div class="wh"><span class="pill">${L(T.example)}</span>${x.title?` <b>${R(x.title)}</b>`:''}</div>
      <div class="wq">${R(x.q)}</div>
      <ol class="wsteps">${x.steps.map((s,i)=>`<li hidden>${R(s)}</li>`).join('')}</ol>
      ${x.res?`<div class="wres" hidden><b>${L(T.result)}:</b> ${R(x.res)}</div>`:''}
      ${x.check?`<div class="wchk" hidden><b>${L(T.check)}:</b> ${R(x.check)}</div>`:''}
      <div class="row wbtns"><button class="primary" data-a="k:step" data-v="${id}">${L(T.nextStep)}</button><button class="ghost" data-a="k:all" data-v="${id}">${L(T.showAll)}</button></div></div>`; },
  lab:(id,o)=>`<div class="labslot" data-lab="${id}" data-o='${o?JSON.stringify(o).replace(/'/g,'&#39;'):''}'></div>`,
  svg:x=>`<figure class="fig">${L(x.svg||x)}${x.cap?`<figcaption>${R(x.cap)}</figcaption>`:''}</figure>`,
  terms:x=>`<div class="terms"><b class="t">${L(T.terms)}</b>${x.map(([es,eu])=>`<span class="term"><span lang="es">${R(es)}</span><span class="sep">·</span><span lang="eu">${R(eu)}</span></span>`).join('')}</div>`,
  cols:x=>`<div class="cols">${x.map(c=>`<div>${K.blocks(c)}</div>`).join('')}</div>`,
};
K.blocks=arr=>(arr||[]).map(bk=>{ const [t,...a]=bk; const fn=BL[t]; return fn?fn(...a):''; }).join('');
K.mountLabs=root=>{ (root||document).querySelectorAll('.labslot').forEach(el=>{ if(el.dataset.done) return; el.dataset.done=1; let o={}; try{ o=el.dataset.o?JSON.parse(el.dataset.o):{}; }catch(e){} if(g.Lab) g.Lab.mount(el.dataset.lab,el,o); }); };
function stepEx(id){ const w=document.getElementById(id); if(!w) return; const hid=w.querySelector('.wsteps li[hidden]');
  if(hid){ hid.hidden=false; hid.classList.add('appear'); }
  if(!w.querySelector('.wsteps li[hidden]')){ w.querySelectorAll('.wres,.wchk').forEach(x=>x.hidden=false); const bt=w.querySelector('.wbtns'); if(bt) bt.remove(); } }
E.act('k:step',id=>stepEx(id));
E.act('k:all',id=>{ const w=document.getElementById(id); if(!w) return; w.querySelectorAll('[hidden]').forEach(x=>x.hidden=false); const bt=w.querySelector('.wbtns'); if(bt) bt.remove(); });

/* ---------- ejercicios con pistas y solución ---------- */
/* ej: {id, lvl(0-3), skill, title, q, data?, unk?, parts:[{q, ans, tol|abs, unit, label}], hints:[], sol:[pasos], res, check, errs, rubric} */
K.exercise=(x,state)=>{
  const st=state||{};
  const hintsShown=st.h||0;
  return `<article class="exer" id="x-${x.id}">
    <div class="xhead"><span class="xid">${x.id}</span><span class="pill lv${x.lvl}">${L(T.lv[x.lvl])}</span>${x.skill?`<span class="count">${R(x.skill)}</span>`:''}${st.ok?'<span class="pill okp">✓</span>':''}</div>
    ${x.title?`<h3>${R(x.title)}</h3>`:''}
    <div class="xq">${R(x.q)}</div>
    ${x.data?`<div class="xdata"><b>${L(T.data)}:</b> ${R(x.data)}</div>`:''}
    ${x.unk?`<div class="xdata"><b>${L(T.unknown)}:</b> ${R(x.unk)}</div>`:''}
    ${(x.parts||[]).map((p,i)=>{ const ps=(st.p||{})[i]||{};
      return `<form class="xpart" data-form="k:ans" data-x="${x.id}" data-i="${i}" autocomplete="off">
        <div class="xpq">${R(p.q)}</div>
        <div class="numform"><input type="text" inputmode="decimal" autocapitalize="off" spellcheck="false" placeholder="${E.esc(L(p.label)||L(T.result))}${p.unit?' ('+E.esc(L(p.unit).replace(/<[^>]+>/g,''))+')':''}" value="${ps.v?E.esc(ps.v):''}" ${ps.ok?'disabled':''}>
        ${ps.ok?'':`<button class="primary" type="submit">${E.u('check')}</button>`}</div>
        ${ps.v!=null&&ps.v!==''?`<div class="verdict ${ps.ok?'ok':'bad'}">${ps.ok?E.u('right'):E.u('notQuite')}</div>`:''}</form>`; }).join('')}
    <div class="xhints">${(x.hints||[]).slice(0,hintsShown).map((h,i)=>`<div class="callout c-hint"><b class="t">${L(T.hint)} ${i+1}</b>${R(h)}</div>`).join('')}</div>
    <div class="row">${(x.hints||[]).length>hintsShown?`<button class="ghost" data-a="k:hint" data-v="${x.id}">${L(T.hint)} ${hintsShown+1}/${x.hints.length}</button>`:''}
      <button class="${st.sol?'ghost':'primary'}" data-a="k:sol" data-v="${x.id}">${L(st.sol?T.hideSol:T.sol)}</button></div>
    ${st.sol?`<div class="xsol"><ol>${x.sol.map(s=>`<li>${R(s)}</li>`).join('')}</ol>
      ${x.res?`<div class="wres"><b>${L(T.result)}:</b> ${R(x.res)}</div>`:''}
      ${x.check?`<div class="wchk"><b>${L(T.check)}:</b> ${R(x.check)}</div>`:''}
      ${x.errs?`<div class="callout c-warn"><b class="t">${L(T.errsEx)}</b>${R(x.errs)}</div>`:''}
      ${x.rubric?`<div class="callout c-note"><b class="t">${L(T.rubric)}</b>${R(x.rubric)}</div>`:''}</div>`:''}
  </article>`;
};

g.Kimika=K;
})(window);
