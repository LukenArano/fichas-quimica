/* Motor común de los módulos de estudio: idioma (castellano/euskera), guardado local,
   repetición espaciada (Leitner), fichas giratorias y tandas de preguntas.
   Cualquier texto puede ser una cadena o un objeto {es:'…', eu:'…'}; E.L() elige el idioma activo. */
(function(g){
'use strict';
const E = {};
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clone = o=>JSON.parse(JSON.stringify(o));
const shuffle = a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pick = a=>a[Math.floor(Math.random()*a.length)];
Object.assign(E,{$,$$,esc,clone,shuffle,pick});

/* ---------- idioma ---------- */
const LANGKEY='kimika-lang';
let lang='eu';
try{ const l=localStorage.getItem(LANGKEY); if(l==='eu'||l==='es') lang=l; }catch(e){}
document.documentElement.lang=lang;
const isBi=o=>o&&typeof o==='object'&&!Array.isArray(o)&&('es' in o||'eu' in o);
E.isBi=isBi;
E.lang=()=>lang;
E.L=o=>isBi(o)?(o[lang]!=null?o[lang]:o.es):o;
E.b=(es,eu)=>({es,eu});
const langCbs=[];
E.onLang=fn=>langCbs.push(fn);
E.setLang=l=>{ if(l!=='es'&&l!=='eu') return; lang=l; try{ localStorage.setItem(LANGKEY,l); }catch(e){} document.documentElement.lang=l; langCbs.forEach(f=>f(l)); };
const UI={
  es:{knew:'Lo sabía',doubt:'Dudé',didnt:'No lo sabía',again1:'otra vez',soon:'pronto',decks:'Mazos',smart:'Inteligente',all:'Todas',
      noDecks:'No hay mazos seleccionados',chooseDecks:'Elige uno o varios mazos arriba.',sessionDone:'Sesión terminada',upToDate:'Todo al día',
      leftNew:n=>`Te quedan ${n} fichas nuevas en estos mazos.`,allSeen:'Ya has visto todas las fichas de estos mazos.',nextRev:w=>`El próximo repaso toca ${w}.`,
      learnN:n=>`Aprender ${n} nuevas`,reviewAll:'Repasar todas igualmente',smartRev:'repaso inteligente',thinkFlip:'Piensa la respuesta · toca para girar',
      keysHint:'Teclado: espacio para girar, 1-2-3 para puntuar.',flip:'Girar ficha',
      mastered:'dominadas',reviewing:'repasando',learning:'aprendiendo',fresh:'nuevas',due:'pendientes',
      lv:{nueva:'nueva',dominada:'dominada',repasando:'repasando',aprendiendo:'aprendiendo'},
      inHours:'en unas horas',tomorrow:'mañana',inDays:d=>d===1?'en 1 día':`en ${d} días`,
      check:'Comprobar',dunno:'No sé',write:'Puedes escribir 0,0013 · 1.3e-3 · 1,3x10^-3',yourAns:'Tu respuesta',
      right:'Correcto',wrong:'Incorrecto',notQuite:'No exactamente',answer:'respuesta',next:'Siguiente',seeResult:'Ver resultado',
      questions:'Preguntas',of:'de',hits:'aciertos',result:'Resultado',pctHits:'Aciertos',toReview:'Para repasar',missed:'Lo que fallaste',
      noMiss:'Sin fallos. Buen trabajo.',another:'Otra tanda',
      resetQ:'Borrar progreso de este módulo…',resetSure:'Se borrará todo tu progreso aquí.',cancel:'Cancelar',del:'Borrar'},
  eu:{knew:'Banekien',doubt:'Zalantza',didnt:'Ez nekien',again1:'berriz',soon:'laster',decks:'Sortak',smart:'Adimentsua',all:'Denak',
      noDecks:'Ez dago sortarik hautatuta',chooseDecks:'Aukeratu sorta bat edo gehiago goian.',sessionDone:'Saioa amaituta',upToDate:'Dena egunean',
      leftNew:n=>`${n} txartel berri geratzen zaizkizu sorta hauetan.`,allSeen:'Sorta hauetako txartel guztiak ikusi dituzu.',nextRev:w=>`Hurrengo errepasoa: ${w}.`,
      learnN:n=>`${n} berri ikasi`,reviewAll:'Denak errepasatu hala ere',smartRev:'errepaso adimentsua',thinkFlip:'Pentsatu erantzuna · ukitu buelta emateko',
      keysHint:'Teklatua: zuriunea buelta emateko, 1-2-3 puntuatzeko.',flip:'Txartelari buelta eman',
      mastered:'menderatuta',reviewing:'errepasatzen',learning:'ikasten',fresh:'berriak',due:'egiteke',
      lv:{nueva:'berria',dominada:'menderatuta',repasando:'errepasatzen',aprendiendo:'ikasten'},
      inHours:'ordu batzuk barru',tomorrow:'bihar',inDays:d=>d===1?'egun 1 barru':`${d} egun barru`,
      check:'Egiaztatu',dunno:'Ez dakit',write:'Idatz dezakezu: 0,0013 · 1.3e-3 · 1,3x10^-3',yourAns:'Zure erantzuna',
      right:'Zuzena',wrong:'Okerra',notQuite:'Ez guztiz',answer:'erantzuna',next:'Hurrengoa',seeResult:'Emaitza ikusi',
      questions:'Galderak',of:'/',hits:'asmatuta',result:'Emaitza',pctHits:'Asmatuak',toReview:'Errepasatzeko',missed:'Huts egin dituzunak',
      noMiss:'Hutsik gabe. Lan bikaina.',another:'Beste sorta bat',
      resetQ:'Modulu honetako aurrerapena ezabatu…',resetSure:'Hemengo aurrerapen guztia ezabatuko da.',cancel:'Utzi',del:'Ezabatu'}
};
E.UI=UI;
E.u=k=>{ const v=UI[lang][k]; return v!=null?v:UI.es[k]; };

/* ---------- texto químico: {H2O}, {NH4^+}, {SO4^2-}, {K_a}, {10^-14} ---------- */
E.chem = s=>String(s)
  .replace(/([A-Za-z\)\]])(\d+)/g,'$1<sub>$2</sub>')
  .replace(/_\(([^)]+)\)/g,'<sub>$1</sub>')
  .replace(/_([A-Za-zÀ-ÿ]+)/g,'<sub>$1</sub>')
  .replace(/\^\(([^)]+)\)/g,'<sup>$1</sup>')
  .replace(/\^([+\-−]?\d*[+\-−]?)/g,(m,c)=>c?'<sup>'+c.replace(/-/g,'−')+'</sup>':m);
E.rich = t=>{ t=E.L(t); return t==null?'':String(t).replace(/\{([^{}]+)\}/g,(_,f)=>'<span class="fx">'+E.chem(f)+'</span>')
  .replace(/\b(p?K)_([a-zA-Z]+\d?)/g,'$1<sub>$2</sub>')
  .replace(/×10\^(-?\d+)/g,(m,e)=>'×10<sup>'+e.replace('-','−')+'</sup>'); };

/* número → "1,8×10^-5" con superíndice */
E.num = (x,d=3)=>{
  if(x===0) return '0';
  if(!isFinite(x)) return '–';
  const a=Math.abs(x);
  if(a<0.01||a>=1e5){ const e=Math.floor(Math.log10(a)); let m=x/Math.pow(10,e); m=+m.toPrecision(d); if(Math.abs(m)>=10){ m/=10; return E.num(m*Math.pow(10,e+1),d); } return String(m).replace('.',',')+'×10<sup>'+String(e).replace('-','−')+'</sup>'; }
  return String(+x.toPrecision(d)).replace('.',',');
};
/* número con decimales fijos ("2,88") */
E.fix = (x,d=2)=>isFinite(x)?x.toFixed(d).replace('.',','):'–';

/* ---------- guardado ---------- */
E.makeStore = (key,def)=>{
  let st=clone(def);
  try{ const r=localStorage.getItem(key); if(r){ const o=JSON.parse(r); st=Object.assign(clone(def),o); } }catch(e){}
  const store={ get st(){ return st; }, save(){ try{ localStorage.setItem(key,JSON.stringify(st)); }catch(e){} }, reset(){ st=clone(def); this.save(); } };
  return store;
};

/* ---------- repetición espaciada ---------- */
const DAY=864e5, IV=[0,1,2,4,8,16];
E.DAY=DAY;
E.srs = store=>{
  const P=k=>store.st.prog[k];
  const level=k=>{ const p=P(k); if(!p) return 'nueva'; if(p.b>=3) return 'dominada'; if(p.b>=2) return 'repasando'; return 'aprendiendo'; };
  return {
    P, level,
    grade(k,gr){ const now=Date.now(); const p=store.st.prog[k]||{b:0,seen:0,ok:0,ko:0,due:now}; p.seen++;
      if(gr===0){ p.b=0; p.ko++; p.due=now; } else if(gr===1){ p.b=Math.max(1,p.b); p.ok++; p.due=now+IV[p.b]*DAY*0.5; }
      else { p.b=Math.min(5,p.b+1); p.ok++; p.due=now+IV[p.b]*DAY; }
      store.st.prog[k]=p; store.save(); },
    nextGap(k){ const p=P(k); const d=IV[Math.min(5,(p?p.b:0)+1)]; return E.u('inDays')(d); },
    whenText(t){ const d=Math.round((t-Date.now())/DAY*2)/2; if(d<=0.5) return E.u('inHours'); if(d<=1) return E.u('tomorrow'); return E.u('inDays')(Math.ceil(d)); },
  };
};

/* ---------- acciones por data-a ---------- */
const handlers={}, submits={};
E.act = (name,fn)=>{ handlers[name]=fn; };
E.onSubmit = (name,fn)=>{ submits[name]=fn; };
document.addEventListener('click',e=>{ const a=e.target.closest('[data-a]'); if(a&&handlers[a.dataset.a]) handlers[a.dataset.a](a.dataset.v,a,e); });
document.addEventListener('submit',e=>{ const f=e.target.closest('[data-form]'); if(f&&submits[f.dataset.form]){ e.preventDefault(); submits[f.dataset.form](f); } });
let keyHandler=null;
E.keys = fn=>{ keyHandler=fn; };
document.addEventListener('keydown',e=>{ if(e.target.matches&&e.target.matches('input,select,textarea')) return; if(keyHandler) keyHandler(e); });

E.seg = (act,cur,opts)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button data-a="${act}" data-v="${v}" aria-pressed="${cur===v}">${E.L(l)}</button>`).join('')}</div>`;

/* ---------- selector de idioma ---------- */
E.langSwitch = ()=>`<div class="langsw" role="group" aria-label="Hizkuntza / Idioma"><button data-a="lang" data-v="es" aria-pressed="${lang==='es'}">ES</button><button data-a="lang" data-v="eu" aria-pressed="${lang==='eu'}">EU</button></div>`;
E.act('lang',v=>{ E.setLang(v); $$('.langsw button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===lang)); });

/* ---------- cabecera común ---------- */
E.header = ({tile,sym,title,sub,current,lang:withLang})=>{
  const mods=[['index.html',{es:'← Inicio',eu:'← Hasiera'},'home'],['formulacion.html',{es:'Formulación',eu:'Formulazioa'},'form']];
  return `<header class="top"><div class="brand"><a class="tile" href="index.html" aria-label="Kimika"><small>${tile}</small>${sym}</a><div><h1>${E.L(title)}</h1><p id="subtitle">${E.L(sub)}</p></div></div>${withLang===false?'':E.langSwitch()}</header>
  <nav class="modnav" aria-label="Módulos">${mods.map(([h,n,k])=>`<a href="${h}"${k===current?' aria-current="page"':''}>${E.L(n)}</a>`).join('')}</nav>`;
};

/* ---------- fichas (Leitner) ---------- */
/* cfg: {store, cards:[{key,deck,front,back,chip:[texto,color]}], decks:[{k,n}], newPer}; front/back pueden ser funciones (se evalúan en cada render) */
const val=v=>typeof v==='function'?v():E.L(v);
E.flash = cfg=>{
  const store=cfg.store, S=E.srs(store), newPer=cfg.newPer||15;
  let s=null, mode='smart', host=null;
  const avail=d=>!cfg.avail||cfg.avail(d);
  const allCards=()=>typeof cfg.cards==='function'?cfg.cards():cfg.cards;
  const sel=()=>{ const on=store.st.decks||cfg.decks.map(d=>d.k); return allCards().filter(c=>on.includes(c.deck)&&avail(c.deck)); };
  const byKey=k=>allCards().find(c=>c.key===k);
  function build(){
    const p=sel(), now=Date.now(); let q;
    if(mode==='libre') q=shuffle(p);
    else { const due=p.filter(c=>S.P(c.key)&&S.P(c.key).due<=now).sort((a,b)=>S.P(a.key).due-S.P(b.key).due);
      q=[...due,...shuffle(p.filter(c=>!S.P(c.key))).slice(0,newPer)]; }
    s={q:q.map(c=>c.key),i:0,flipped:false,res:[0,0,0],re:{}};
  }
  function chips(){
    const on=store.st.decks||cfg.decks.map(d=>d.k), all=allCards();
    return `<div class="filters"><span class="lbl">${E.u('decks')}</span>${cfg.decks.filter(d=>avail(d.k)).map(d=>{ const n=all.filter(c=>c.deck===d.k).length;
      return `<button class="chipbtn" data-a="f:deck" data-v="${d.k}" aria-pressed="${on.includes(d.k)}">${E.L(d.n)} <span class="n">${n}</span></button>`; }).join('')}</div>`;
  }
  function meter(){
    const p=sel(), cnt={dominada:0,repasando:0,aprendiendo:0,nueva:0}; p.forEach(c=>cnt[S.level(c.key)]++);
    const tot=p.length||1, now=Date.now(), due=p.filter(c=>S.P(c.key)&&S.P(c.key).due<=now).length;
    const seg=[['dominada','var(--ok)'],['repasando','var(--accent)'],['aprendiendo','var(--warn)']];
    return `<div class="meterrow"><div class="meter" aria-hidden="true">${seg.map(([k,col])=>cnt[k]?`<i style="width:${cnt[k]/tot*100}%;background:${col}"></i>`:'').join('')}</div>
      <div class="legend"><span style="--dot:var(--ok)">${cnt.dominada} ${E.u('mastered')}</span><span style="--dot:var(--accent)">${cnt.repasando} ${E.u('reviewing')}</span><span style="--dot:var(--warn)">${cnt.aprendiendo} ${E.u('learning')}</span><span style="--dot:var(--line)">${cnt.nueva} ${E.u('fresh')}</span><span style="--dot:var(--bad)">${due} ${E.u('due')}</span></div></div>`;
  }
  const lvl=k=>E.u('lv')[S.level(k)];
  function render(h){
    host=h||host; E.keys(key);
    if(!s) build();
    const p=sel();
    const head=`${chips()}${meter()}<div class="bar">${E.seg('f:mode',mode,[['smart',E.u('smart')],['libre',E.u('all')]])}</div>`;
    if(!p.length){ host.innerHTML=`<div class="rules">${head}<section class="panel"><h2>${E.u('noDecks')}</h2><p class="muted">${E.u('chooseDecks')}</p></section></div>`; return; }
    if(s.i>=s.q.length){
      const now=Date.now(), left=p.filter(c=>!S.P(c.key)).length, done=s.q.length>0;
      const next=p.filter(c=>S.P(c.key)&&S.P(c.key).due>now).sort((a,b)=>S.P(a.key).due-S.P(b.key).due)[0];
      host.innerHTML=`<div class="rules">${head}<section class="panel"><h2>${done?E.u('sessionDone'):E.u('upToDate')}</h2>
        ${done?`<div class="summary"><div class="stat"><b>${s.res[2]}</b><span>${E.u('knew')}</span></div><div class="stat"><b>${s.res[1]}</b><span>${E.u('doubt')}</span></div><div class="stat"><b>${s.res[0]}</b><span>${E.u('didnt')}</span></div></div>`:''}
        <p class="muted">${left?E.u('leftNew')(left):E.u('allSeen')} ${next?E.u('nextRev')(S.whenText(S.P(next.key).due)):''}</p>
        <div class="row">${left?`<button class="primary" data-a="f:more">${E.u('learnN')(Math.min(left,newPer))}</button>`:''}<button class="${left?'ghost':'primary'}" data-a="f:libre">${E.u('reviewAll')}</button></div></section></div>`;
      return;
    }
    const c=byKey(s.q[s.i]);
    if(!c){ s.i++; return render(); }
    const fch=c.fchip||c.chip;
    host.innerHTML=`<div class="rules">${head}
      <div class="bar"><span class="count">${s.i+1} / ${s.q.length}${mode==='smart'?' · '+E.u('smartRev'):''}</span><span class="count">${lvl(c.key)}</span></div>
      <div class="progress"><i style="width:${s.i/s.q.length*100}%"></i></div>
      <div class="stage"><div class="card${s.flipped?' flipped':''}" id="card" data-a="f:flip" role="button" tabindex="0" aria-label="${E.u('flip')}"><div class="inner">
        <div class="face front" style="--cc:var(--c-${fch[1]})"><div class="facehead"><span class="chip">${E.L(fch[0])}</span><span></span></div><div class="big">${val(c.front)}</div><div class="hintline">${E.u('thinkFlip')}</div></div>
        <div class="face back" style="--cc:var(--c-${c.chip[1]})"><div class="facehead"><span class="chip">${E.L(c.chip[0])}</span><span class="lvl">${lvl(c.key)}</span></div>${val(c.back)}</div>
      </div></div></div>
      <div class="grades" id="grades" ${s.flipped?'':'hidden'}>
        <button class="gbtn g0" data-a="f:grade" data-v="0">${E.u('didnt')}<small>${E.u('again1')} · 1</small></button>
        <button class="gbtn g1" data-a="f:grade" data-v="1">${E.u('doubt')}<small>${E.u('soon')} · 2</small></button>
        <button class="gbtn g2" data-a="f:grade" data-v="2">${E.u('knew')}<small>${S.nextGap(c.key)} · 3</small></button></div>
      <p class="hintline" ${s.flipped?'hidden':''} id="fliphint">${E.u('keysHint')}</p></div>`;
  }
  function flip(){ if(!s||s.i>=s.q.length) return; s.flipped=!s.flipped; $('#card').classList.toggle('flipped',s.flipped); $('#grades').hidden=!s.flipped; $('#fliphint').hidden=s.flipped; }
  function grade(v){ if(!s||!s.flipped) return; const k=s.q[s.i]; S.grade(k,v); s.res[v]++;
    if(v===0&&(s.re[k]||0)<2){ s.re[k]=(s.re[k]||0)+1; s.q.splice(Math.min(s.q.length,s.i+4),0,k); }
    s.i++; s.flipped=false; render(); }
  function key(e){ if(e.key===' '||e.key==='Enter'){ e.preventDefault(); flip(); } else if(['1','2','3'].includes(e.key)) grade(+e.key-1); }
  const api={
    render(h){ AF=api; render(h); }, reset(){ s=null; }, flip, grade,
    mode(v){ mode=v; build(); render(); },
    more(){ mode='smart'; build(); render(); },
    libre(){ mode='libre'; build(); render(); },
    deck(v){ const on=(store.st.decks||cfg.decks.map(d=>d.k)).slice(); const i=on.indexOf(v); if(i>=0) on.splice(i,1); else on.push(v); store.st.decks=on; store.save(); build(); render(); },
  };
  return api;
};
let AF=null;
E.act('f:flip',()=>AF&&AF.flip());
E.act('f:grade',v=>AF&&AF.grade(+v));
E.act('f:mode',v=>AF&&AF.mode(v));
E.act('f:more',()=>AF&&AF.more());
E.act('f:libre',()=>AF&&AF.libre());
E.act('f:deck',v=>AF&&AF.deck(v));

/* ---------- tandas de preguntas ---------- */
/* pregunta de opciones: {q, opts:[{t,ok}], why}   numérica: {num:true, q, ans, tol (relativa) | abs, why, label, ansText}
   Todos los textos pueden ser {es,eu}.  cfg: {build:()=>[preguntas], onFinish(res), title, extra(res)→html} */
function parseNum(str){
  str=String(str).trim().replace(/\s+/g,'').replace(/,/g,'.').replace(/−/g,'-');
  let m=str.match(/^(-?[\d.]+)(?:e([+-]?\d+))?$/i);
  if(m) return parseFloat(m[1]+(m[2]?'e'+m[2]:''));
  m=str.match(/^(-?[\d.]+)[x×*·]10\^?\(?([+-]?\d+)\)?$/i);
  if(m) return parseFloat(m[1])*Math.pow(10,+m[2]);
  m=str.match(/^10\^?\(?([+-]?\d+)\)?$/i);
  if(m) return Math.pow(10,+m[1]);
  return NaN;
}
E.parseNum=parseNum;
E.numOk=(v,q)=>q.abs!=null?Math.abs(v-q.ans)<=q.abs:Math.abs(v-q.ans)<=Math.abs(q.ans)*(q.tol||0.03);
E.quiz = cfg=>{
  let s=null, host=null, finished=false;
  const title=()=>E.L(typeof cfg.title==='function'?cfg.title():cfg.title)||E.u('questions');
  function start(){ const qs=cfg.build(); qs.forEach(q=>{ if(q.opts&&!q.fixed) q.opts=shuffle(q.opts); }); s={qs,i:0,score:0,miss:[]}; finished=false; }
  function cur(){ return s.qs[s.i]; }
  function render(h){
    host=h||host; E.keys(key); if(!s) start();
    if(s.i>=s.qs.length){ summary(); return; }
    const q=cur(), n=s.qs.length;
    let body;
    if(q.num){
      body=`<form class="numform" data-form="q:num" autocomplete="off"><input id="qinput" type="text" inputmode="decimal" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${esc(E.L(q.label)||E.u('yourAns'))}" value="${q.done?esc(q.given||''):''}" ${q.done?'disabled':''}>
        ${q.done?'':`<button class="primary" type="submit">${E.u('check')}</button><button class="ghost" type="button" data-a="q:skip">${E.u('dunno')}</button>`}</form>
        <p class="hintline" style="text-align:left">${E.u('write')}</p>`;
    } else {
      body=`<div class="opts">${q.opts.map((o,i)=>`<button class="opt${q.done?(o.ok?' right':(q.pick===i?' wrong':'')):''}" data-a="q:pick" data-v="${i}" ${q.done?'disabled':''}><span class="k">${i+1}</span><span>${E.rich(o.t)}</span></button>`).join('')}</div>`;
    }
    let after='';
    if(q.done){
      after=`<div class="verdict ${q.right?'ok':'bad'}">${q.right?E.u('right'):(q.num?E.u('notQuite'):E.u('wrong'))}${q.num&&!q.right?` · ${E.u('answer')}: ${E.L(q.ansText)||E.num(q.ans)}`:''}</div>
        ${q.why?`<div class="why">${E.rich(q.why)}</div>`:''}
        <div class="row"><button class="primary" data-a="q:next">${s.i+1<n?E.u('next'):E.u('seeResult')}</button></div>`;
    }
    host.innerHTML=`<div class="rules"><div class="bar"><span class="count">${title()} · ${s.i+1} ${E.u('of')} ${n}</span><span class="count">${s.score} ${E.u('hits')}</span></div>
      <div class="progress"><i style="width:${s.i/n*100}%"></i></div>
      <section class="panel"><div class="lesson">${q.tag?`<span class="count">${E.L(q.tag)}</span>`:''}<div style="font-size:19px;line-height:1.45">${E.rich(q.q)}</div></div>${body}${after}</section></div>`;
    if(q.num&&!q.done){ const i=$('#qinput'); if(i) i.focus({preventScroll:true}); }
  }
  function finish(q,right,given){ q.done=true; q.right=right; q.given=given; if(right) s.score++; else s.miss.push(q); render(); }
  function summary(){
    const n=s.qs.length, pct=Math.round(s.score/n*100);
    if(!finished){ finished=true; if(cfg.onFinish) cfg.onFinish({score:s.score,total:n,pct}); }
    host.innerHTML=`<div class="rules"><section class="panel"><h2>${title()}: ${s.score} ${E.u('of')} ${n}</h2>
      <div class="summary"><div class="stat"><b>${pct}%</b><span>${E.u('pctHits')}</span></div><div class="stat"><b>${n-s.score}</b><span>${E.u('toReview')}</span></div></div>
      ${s.miss.length?`<h3>${E.u('missed')}</h3><div class="rules">${s.miss.map(q=>`<div class="why"><div>${E.rich(q.q)}</div>${q.why?`<div class="muted" style="margin-top:6px">${E.rich(q.why)}</div>`:''}</div>`).join('')}</div>`:`<p class="muted">${E.u('noMiss')}</p>`}
      ${cfg.extra?cfg.extra({score:s.score,total:n,pct}):''}
      <div class="row"><button class="primary" data-a="q:again">${E.u('another')}</button></div></section></div>`;
  }
  function key(e){
    if(!s||s.i>=s.qs.length) return; const q=cur();
    if(!q.num&&!q.done&&['1','2','3','4','5'].includes(e.key)){ const b=$$('[data-a="q:pick"]')[+e.key-1]; if(b) b.click(); }
    else if(q.done&&e.key==='Enter'){ e.preventDefault(); next(); }
  }
  function next(){ s.i++; render(); }
  const api={
    render(h){ AQ=api; render(h); }, restart(){ s=null; },
    pick(v){ if(!s) return; const q=cur(); if(q.done) return; q.pick=+v; finish(q,!!q.opts[+v].ok); },
    next, again(){ start(); render(); },
    skip(){ const q=cur(); if(q&&!q.done) finish(q,false,''); },
    submit(){ const q=cur(); if(!q||q.done) return; const raw=$('#qinput').value; const v=parseNum(raw);
      if(isNaN(v)){ $('#qinput').style.borderColor='var(--bad)'; return; }
      finish(q,E.numOk(v,q),raw); },
  };
  return api;
};
let AQ=null;
E.act('q:pick',v=>AQ&&AQ.pick(v));
E.act('q:next',()=>AQ&&AQ.next());
E.act('q:again',()=>AQ&&AQ.again());
E.act('q:skip',()=>AQ&&AQ.skip());
E.onSubmit('q:num',()=>AQ&&AQ.submit());

/* ---------- borrar progreso (dos pasos) ---------- */
E.resetBlock = ()=>`<div class="row" id="resetrow" style="margin-top:8px"><button class="ghost" data-a="r:1">${E.u('resetQ')}</button></div>`;
E.wireReset = (store,after)=>{
  E.act('r:1',(v,a)=>{ a.closest('.row').innerHTML=`<span class="muted">${E.u('resetSure')}</span><button class="ghost" data-a="r:0">${E.u('cancel')}</button><button class="primary" style="background:var(--bad)" data-a="r:2">${E.u('del')}</button>`; });
  E.act('r:0',(v,a)=>{ a.closest('.row').outerHTML=E.resetBlock(); });
  E.act('r:2',()=>{ store.reset(); after(); });
};

g.Estudio=E;
})(window);
