/* Lección 04 · Esta es mi familia — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, speak, dialogHTML, grade, MARK, tl } = SC;

  /* Lección 04 · Esta es mi familia — 학습 데이터 */
  const D = {
    skills: {
      fam: 'Familia 가족 어휘',
      pos: 'Posesivos 소유형용사',
      dem: 'Demostrativos 지시사',
      ver: 'Verbos tener · estar · ser',
      int: 'Interrogativos cuánto · quién',
      des: 'Descripción 외모·성격',
      num: 'Números 101–9.000',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '가족 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '파울라의 가족 사진', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '토레스 가족 나무', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '가르시아 가족 나무 (듣기)', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '우리 가족 나무 그리기', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '가족에 대해 묻고 답하기', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'd2', label: 'Diálogo 2', kr: '후안과 크리스티나', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a5', label: 'Actividad 5', kr: '가족 소개 · 외모 · 성격', group: 'Diálogo 2', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: 'casado · soltero · hijo único', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '숫자 101 ~ 9.000', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '화폐 · 지폐 세기', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '듣고 숫자 쓰기', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    familia: [
      { e: '👴', es: 'el abuelo', kr: '할아버지' }, { e: '👵', es: 'la abuela', kr: '할머니' },
      { e: '👨', es: 'el padre', kr: '아버지' }, { e: '👩', es: 'la madre', kr: '어머니' },
      { e: '👦', es: 'el hijo', kr: '아들' }, { e: '👧', es: 'la hija', kr: '딸' },
      { e: '🧑', es: 'el hermano', kr: '형제 (형·오빠·남동생)' }, { e: '👱‍♀️', es: 'la hermana', kr: '자매 (누나·언니·여동생)' },
      { e: '👶', es: 'el nieto', kr: '손자' }, { e: '👶🏻', es: 'la nieta', kr: '손녀' },
      { e: '🧔', es: 'el tío', kr: '삼촌 · 외삼촌 · 고모부 …' }, { e: '👩‍🦰', es: 'la tía', kr: '이모 · 고모 · 숙모 …' },
      { e: '🧒', es: 'el primo', kr: '사촌 (남)' }, { e: '👧🏻', es: 'la prima', kr: '사촌 (여)' },
      { e: '🧒🏽', es: 'el sobrino', kr: '조카 (남)' }, { e: '👧🏽', es: 'la sobrina', kr: '조카 (여)' },
      { e: '🤵', es: 'el esposo', kr: '남편' }, { e: '👰', es: 'la esposa', kr: '아내' }
    ],

    /* Diálogo 1 — 교재 하이라이트 그대로 */
    dialogo1: [
      { who: 'Amigo', es: '¡Hola, Paula! ¿Qué es eso?' },
      { who: 'Paula', es: 'Es una foto de mi familia.' },
      { who: 'Amigo', es: '[¿Cuántos sois en tu familia?]' },
      { who: 'Paula', es: '[En mi familia somos cinco.]' },
      { who: 'Paula', es: 'Mira, esta del centro es mi abuela y a su derecha están mis padres. Este es mi hermano y esta soy yo.' },
      { who: 'Amigo', es: '[¿Eres la mayor?]' },
      { who: 'Paula', es: 'No, soy la menor. [Mi hermano tiene veinte años y yo tengo dieciséis.]' },
      { who: 'Amigo', es: '¡Tienes una familia preciosa!' },
      { who: 'Paula', es: '¡Gracias!' }
    ],

    dialogo2: [
      { who: 'Juan', es: 'Tienes una familia grande, ¿verdad?' },
      { who: 'Cristina', es: 'Pues, sí. Mis padres tienen cinco hermanos y tengo muchos tíos y primos.' },
      { who: 'Juan', es: '[¿Cuántos años tienen tus padres?]' },
      { who: 'Cristina', es: 'Mi padre tiene cincuenta años y mi madre tiene la misma edad.' },
      { who: 'Juan', es: '¿Cómo son?' },
      { who: 'Cristina', es: 'Son muy simpáticos y trabajadores, pero a veces son estrictos conmigo.' },
      { who: 'Juan', es: '[¿A qué se dedican tus padres?]' },
      { who: 'Cristina', es: 'Mi padre es maestro de una escuela. Mi madre es enfermera y trabaja en un hospital grande cerca de mi casa.' },
      { who: 'Juan', es: '¿Tienes hermanos?' },
      { who: 'Cristina', es: '[No, soy hija única.] ¿Y tú? ¿Cuántos hermanos tienes?' },
      { who: 'Juan', es: '[Yo tengo dos hermanas pequeñas.] Soy [el mayor] de los tres.' }
    ],

    /* Actividad 2 — TRANSCRIPCIONES */
    trans2a: 'Luis y Antonia tienen un hijo y dos hijas. El hijo mayor se llama Javier. Sus hijas se llaman Sara y Lucía. Javier y Lucía están solteros. Sara está casada con David y tienen un hijo y una hija. Su hijo se llama Raimón y su hija se llama Teresa.',
    trans2b: 'Soy la hermana de Sara. Mi madre se llama Antonia y mi padre se llama Luis. Soy soltera y tengo dos sobrinos.',

    /* Actividad 7 — números */
    nums: [[101, 'ciento uno'], [102, 'ciento dos'], [157, 'ciento cincuenta y siete'], [198, 'ciento noventa y ocho'], [200, 'doscientos'], [300, 'trescientos'],
      [400, 'cuatrocientos'], [500, 'quinientos'], [600, 'seiscientos'], [700, 'setecientos'], [800, 'ochocientos'], [900, 'novecientos'],
      [1000, 'mil'], [2000, 'dos mil'], [5350, 'cinco mil trescientos cincuenta'], [7000, 'siete mil'], [9502, 'nueve mil quinientos dos']],

    /* Actividad 9 — TRANSCRIPCIONES */
    dial9: [
      ['¿Qué número de autobús tomas?', 'El 750.', '750', ['el setecientos cincuenta', 'setecientos cincuenta']],
      ['¿Cuál es tu número de asiento?', 'El 105.', '105', ['el ciento cinco', 'ciento cinco']],
      ['¿Está lejos tu pueblo?', 'Sí, a unos 500 kilómetros.', '500', ['quinientos kilómetros', 'quinientos', 'a unos quinientos kilómetros']],
      ['¿Cuánto vale este ordenador?', '870 euros.', '870', ['ochocientos setenta euros', 'ochocientos setenta']],
      ['¿Cuántos años tiene este árbol?', 'Casi 200 años.', '200', ['doscientos años', 'doscientos', 'casi doscientos años']],
      ['¿Cuántas páginas tiene el libro?', 'Unas 900 páginas.', '900', ['novecientas páginas', 'novecientas', 'unas novecientas páginas']]
    ],

    utiles: [
      ['Esta es mi familia.', '이게 우리 가족이야.'], ['Estos son mis hermanos.', '이 사람들이 내 형제들이야.'],
      ['¿Cuántos hermanos tienes?', '형제가 몇 명이야?'], ['Tengo un hermano.', '형제가 한 명 있어.'],
      ['¿Qué hacen tus padres?', '부모님은 무슨 일을 하셔?'], ['Mi padre es profesor y mi madre es enfermera.', '아버지는 선생님이시고 어머니는 간호사셔.'],
      ['¿Cuántos años tienes?', '몇 살이야?'], ['Tengo dieciséis años.', '열여섯 살이야.'],
      ['¿Tu tío está soltero o casado?', '너희 삼촌은 미혼이야, 기혼이야?'], ['Está soltero.', '미혼이야.'],
      ['¿Cuál es la moneda de tu país?', '너희 나라 화폐는 뭐야?'], ['Es el won.', '원(won)이야.']
    ],

    examBank: [
      { p: 'Esta es ____ familia. <i>(나의)</i>', a: ['mi'], s: 'pos' },
      { p: '¿Cómo se llaman ____ padres? <i>(너의)</i>', a: ['tus'], s: 'pos' },
      { p: 'Ana y Luis son hermanos. ____ madre es enfermera. <i>(그들의)</i>', a: ['su'], s: 'pos' },
      { p: '____ abuelos viven en Busan. <i>(우리의)</i>', a: ['nuestros'], s: 'pos' },
      { p: '____ son mis hermanos. <i>(이 사람들, 남)</i>', a: ['estos'], s: 'dem' },
      { p: '____ chica de allí es mi prima. <i>(저, 멀리)</i>', a: ['aquella'], s: 'dem' },
      { p: '¿Cuántos años ____ tu padre? <i>(tener)</i>', a: ['tiene'], s: 'ver' },
      { p: 'Yo ____ dieciséis años. <i>(tener)</i>', a: ['tengo'], s: 'ver' },
      { p: 'Mi tío ____ soltero. <i>(estar)</i>', a: ['está'], s: 'ver' },
      { p: 'Mis padres ____ muy trabajadores. <i>(ser)</i>', a: ['son'], s: 'ver' },
      { p: 'En mi familia ____ cinco. <i>(ser, nosotros)</i>', a: ['somos'], s: 'ver' },
      { p: '¿____ hermanos tienes? <i>(몇 명)</i>', a: ['cuántos'], s: 'int' },
      { p: '¿____ personas hay en tu familia? <i>(몇 명)</i>', a: ['cuántas'], s: 'int' },
      { p: '¿____ es esa chica? — Es mi hermana.', a: ['quién'], s: 'int' },
      { p: '¿____ son ellos? — Son mis abuelos.', a: ['quiénes'], s: 'int' },
      { p: 'El padre de mi madre es mi abuelo ____.', a: ['materno'], s: 'fam' },
      { p: 'No tengo hermanos. Soy hija ____.', a: ['única'], s: 'fam' },
      { p: 'Mi madre es muy ____. <i>(generoso)</i>', a: ['generosa'], s: 'des' },
      { p: 'Hay ____ euros. <i>(500)</i>', a: ['quinientos'], s: 'num' },
      { p: 'El libro tiene ____ páginas. <i>(300)</i>', a: ['trescientas'], s: 'num' }
    ]
  };

  /* ---------- 도우미 ---------- */
  const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
  const nameAns = (n, full) => [n, 'Es ' + n + '.', ...(full ? [full, 'Es ' + full + '.'] : [])];
  const relAns = r => { const base = r.replace(/^(el|la) /, ''), f = base.split(' ')[0], a = /a$/.test(f) || f === 'madre' ? 'la ' : 'el '; return [base, a + base, 'mi ' + base, 'es ' + a + base, 'es mi ' + base]; };
  const blurBtn = (s, btnSel, boxSel, on, off) => { $(btnSel, s).onclick = e => { const t = $(boxSel, s); t.classList.toggle('blur'); e.currentTarget.textContent = t.classList.contains('blur') ? on : off; }; };

  /* 가족 나무 (HTML + SVG) — 노드마다 채점 빈칸(ans) 가능
     c = { id, sec, skill, gens, G, nodes:[{k,x,g,av,name?,ans?,fixed?,badge?}], couples:[[k,k]], kids:[{p:[k,k]|k, c:[k…]}], names?:true, bank? } */
  function famTree(c) {
    const G = c.G || 170, H = c.gens * G - 10, AY = 28;
    const N = {}; c.nodes.forEach(n => { N[n.k] = n; });
    const draft = sel(c.id + '_v', {});
    const nmSt = c.names ? sel(c.id + '_n', {}) : null;
    const blanks = c.nodes.filter(n => n.ans);
    blanks.forEach(n => reg(c.id + '-' + n.k, c.sec, c.skill));
    const ln = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || ''}" vector-effect="non-scaling-stroke"/>`;
    let svg = '', rings = '';
    (c.couples || []).forEach(([a, b]) => {
      const A = N[a], B = N[b], y = A.g * G + AY;
      svg += ln(A.x, y, B.x, y, 'cp');
      rings += `<span class="ft-ring" style="left:${(A.x + B.x) / 20}%;top:${y}px">💍</span>`;
    });
    (c.kids || []).forEach(k => {
      let px, py;
      if (Array.isArray(k.p)) { const A = N[k.p[0]], B = N[k.p[1]]; px = (A.x + B.x) / 2; py = A.g * G + AY; } else { const A = N[k.p]; px = A.x; py = A.g * G + (c.tall || 118); }
      const ch = k.c.map(x => N[x]), by = ch[0].g * G - 14;
      svg += ln(px, py, px, by);
      const xs = ch.map(n => n.x).concat(px);
      svg += ln(Math.min(...xs), by, Math.max(...xs), by);
      ch.forEach(n => { svg += ln(n.x, by, n.x, n.g * G + 2); });
    });
    const node = n => `<div class="fn ${n.fixed ? 'me' : ''}" data-k="${n.k}" style="left:${n.x / 10}%;top:${n.g * G}px">
        <span class="fav" ${n.name ? `data-say="${esc(n.name)}"` : ''}>${n.av}${n.badge ? `<i>${n.badge}</i>` : ''}</span>
        ${n.name ? `<b class="fnm">${n.name}</b>` : ''}${n.fixed ? `<b class="fyo">${n.fixed}</b>` : ''}
        ${n.ans ? `<span class="fbl"><input class="cz ft" data-k="${n.k}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(n.ph || '?')}"><span class="fmk"></span></span>` : ''}
        ${nmSt && !n.fixed ? `<input class="fnin" data-k="${n.k}" placeholder="이름 (선택)" autocomplete="off" spellcheck="false">` : ''}
      </div>`;
    const w = el(`<div class="ftw">${c.title ? `<div class="item-p">${c.title}</div>` : ''}${c.bank ? `<div class="ybox wordbank">${c.bank}</div>` : ''}
      <div class="ft-scroll"><div class="ftree" style="height:${H}px"><svg class="ft-svg" viewBox="0 0 1000 ${H}" preserveAspectRatio="none">${svg}</svg>${rings}${c.nodes.map(node).join('')}</div></div>
      ${blanks.length ? `<div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">채점하기</button><span class="fscore"></span></div>` : ''}</div>`);
    const paint = (inp, k) => {
      const it = SC.items()[c.id + '-' + k]; if (!it) return;
      const sp = inp.nextElementSibling;
      inp.classList.remove('ok', 'half', 'no'); inp.classList.add(it.last >= 1 ? 'ok' : it.last > 0 ? 'half' : 'no');
      sp.innerHTML = MARK(it.last) + (it.last >= 1 ? '' : `<small>${tl(N[k].ans[0])}</small>`);
    };
    $$('input.ft', w).forEach(inp => {
      const k = inp.dataset.k, it = SC.items()[c.id + '-' + k];
      if (it && it.v != null) { inp.value = it.v; paint(inp, k); } else if (draft[k]) inp.value = draft[k];
      inp.addEventListener('input', () => { draft[k] = inp.value; save(); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('.chk', w).click(); });
    });
    if (nmSt) $$('input.fnin', w).forEach(inp => { inp.value = nmSt[inp.dataset.k] || ''; inp.addEventListener('input', () => { nmSt[inp.dataset.k] = inp.value; save(); if (c.onName) c.onName(); }); });
    if (blanks.length) {
      $('.chk', w).onclick = () => {
        let tot = 0;
        $$('input.ft', w).forEach(inp => {
          const k = inp.dataset.k, r = grade(inp.value || ' ', N[k].ans), sc = r.empty ? 0 : r.score;
          record(c.id + '-' + k, sc, r.empty ? ['otro'] : r.errs, { v: inp.value });
          paint(inp, k); tot += sc;
        });
        $('.fscore', w).innerHTML = `${MARK(tot / blanks.length)} <b>${Math.round(tot * 10) / 10} / ${blanks.length}</b>`;
      };
      $('.rst', w).onclick = () => { $$('input.ft', w).forEach(inp => { inp.value = ''; inp.classList.remove('ok', 'half', 'no'); inp.nextElementSibling.innerHTML = ''; draft[inp.dataset.k] = ''; }); save(); $('.fscore', w).innerHTML = ''; };
    }
    return w;
  }

  /* 지폐 그림 */
  const BILL = {
    eur: { u: '€', c: { 5: '#9aa3a8', 10: '#e0636b', 20: '#5b8fd6', 50: '#f08a3c', 100: '#3fa45b', 200: '#e3c13b', 500: '#a46bb8' } },
    usd: { u: '$', c: { 1: '#9fb59a', 5: '#b7a9c9', 10: '#e2c46f', 20: '#9fcf9a', 50: '#e7a6a6', 100: '#8fc3d1' } },
    mxn: { u: '$', c: { 20: '#4aa3d9', 100: '#e8a23c', 200: '#5fb06a', 500: '#c87a5a' } },
    krw: { u: '₩', c: { 1000: '#6d8fd1', 5000: '#e6915a', 10000: '#5fb06a', 50000: '#e9b93a' } }
  };
  const bills = (cur, list) => `<div class="bills">${list.map((d, i) => `<span class="bill" style="background:${BILL[cur].c[d] || '#bbb'};--r:${(i - (list.length - 1) / 2) * 7}deg"><b>${d.toLocaleString('de-DE')}</b><small>${BILL[cur].u}</small></span>`).join('')}</div>`;

  const B = {};

  B.vocab = () => {
    const txt = 'Para la mayoría de españoles e hispanoamericanos la familia es lo más importante en sus vidas. Los padres, hijos, hermanos, nietos, tíos, primos, sobrinos, etc. son el núcleo de las relaciones personales.';
    const txt2 = 'En Hispanoamérica, aunque últimamente se están produciendo cambios, todavía es común ver familias numerosas porque cada familia tiene tres o más hijos.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${txt} ${say(txt)}</p><p class="lead">${txt2} ${say(txt2)}</p>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요</h3><div class="fg"></div>
      ${tip('남성형 <b>-o</b> → 여성형 <b>-a</b> (hijo → hija, tío → tía). 복수 남성형은 남녀를 함께 가리켜요: <b>los padres</b> = 부모님, <b>los hermanos</b> = 형제자매, <b>los abuelos</b> = 조부모님.')}
      <h3 class="h3">② 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요 (el / la 까지!)</h3><div class="items two"></div>
      <h3 class="h3">③ 성격(carácter)일까, 외모(aspecto físico)일까? — 표현을 누르고 칸을 누르세요</h3><div class="sb"></div>`);
    put(s, '.fg', flipGrid(D.familia));
    ['la abuela', 'el hijo', 'la hermana', 'el nieto', 'la tía', 'el primo', 'la sobrina', 'el esposo'].map(w => D.familia.find(x => x.es === w)).forEach((a, i) => put(s, '.items', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'fam', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`, ph: 'el / la …', answers: [a.es] })));
    put(s, '.sb', sortBoard({ id: 'voc-sb', sec: 'vocab', skill: 'des', cols: [{ k: 'c', label: '😊 Carácter 성격' }, { k: 'a', label: '👀 Aspecto físico 외모' }],
      chips: [['simpático', 'c'], ['trabajador', 'c'], ['generoso', 'c'], ['estricto', 'c'], ['activo', 'c'], ['alegre', 'c'],
        ['alto', 'a'], ['bajo', 'a'], ['delgado', 'a'], ['rubio', 'a'], ['moreno', 'a'], ['guapo', 'a']] }));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 소유형용사 (Posesivos: formas átonas) — 명사 <u>앞</u>에!</h3>
        <div class="blocks"><span class="bk o">mi</span><span class="bk s">hermano</span><span class="small">→</span><span class="bk o">mis</span><span class="bk s">hermanos</span></div>
        <div class="blocks"><span class="bk o">nuestra</span><span class="bk s">madre</span><span class="small">→</span><span class="bk o">nuestras</span><span class="bk s">madres</span></div>
        <div class="legend-mini"><span class="bk o">소유형용사</span><span class="bk s">소유되는 명사 (수·성 일치)</span></div>
        ${tip('소유형용사는 <b>가진 사람</b>이 아니라 <b>뒤의 명사</b>에 맞춰요: <b>mis</b> padres (내 부모님), <b>su</b> hijo (그의/그녀의/당신의 아들).<br><b>nuestro · vuestro</b> 만 남성/여성(-o/-a)이 있어요. <b>mi</b>(나의) ≠ <b>mí</b>(전치사 뒤 "나"), <b>tu</b>(너의) ≠ <b>tú</b>(너).')}
        <div class="g1a"></div><div class="g1b"></div></div>
      <div class="gcard"><h3>2. 지시형용사 · 지시대명사 (Demostrativos)</h3>
        <table class="dt"><tr><th></th><th>남성 단수</th><th>여성 단수</th><th>남성 복수</th><th>여성 복수</th><th>중성</th></tr>
          <tr><th>이 (나에게 가까이) 👇</th><td>este</td><td>esta</td><td>estos</td><td>estas</td><td>esto</td></tr>
          <tr><th>그 (너에게 가까이) 👉</th><td>ese</td><td>esa</td><td>esos</td><td>esas</td><td>eso</td></tr>
          <tr><th>저 (둘 다에게 멀리) 🔭</th><td>aquel</td><td>aquella</td><td>aquellos</td><td>aquellas</td><td>aquello</td></tr></table>
        ${tip('명사 앞이면 지시형용사: <b>esta</b> foto (이 사진). 혼자 쓰면 지시대명사: <b>Esta</b> es mi familia. (이쪽이 우리 가족이야.)<br>무엇인지 모를 때는 중성 <b>esto / eso</b>: ¿Qué es <b>eso</b>?')}
        <div class="g2a"></div><div class="items two g2b"></div></div>
      <div class="gcard"><h3>3. tener · estar · ser (Presente de indicativo)</h3>
        <div class="vt3"><div class="g3a"></div><div class="g3b"></div><div class="g3c"></div></div>
        <table class="dt"><tr><th>동사</th><th>쓰임</th><th>예문</th></tr>
          <tr><td><b>tener</b></td><td>나이 · 가족이 있다</td><td>Tengo dieciséis <b>años</b>. / Tengo dos hermanos.</td></tr>
          <tr><td><b>estar</b></td><td>결혼 여부(상태) · 위치</td><td>Mi tío <b>está</b> soltero. / A su derecha <b>están</b> mis padres.</td></tr>
          <tr><td><b>ser</b></td><td>누구인지 · 성격 · 외모 · 직업</td><td>Esta <b>es</b> mi abuela. / <b>Son</b> simpáticos. / <b>Es</b> enfermera.</td></tr></table>
        ${tip('나이는 <b>tener</b>! "Soy 16 años"(✕) → <b>Tengo 16 años</b>(○). 한국어 "나는 16살이다"에 속지 마세요.')}
        <div class="g3d"></div></div>
      <div class="gcard"><h3>4. 의문사 cuánto · quién</h3>
        <div class="blocks"><span class="bk v">¿Cuántos</span><span class="bk s">hermanos</span><span class="bk o">tienes?</span></div>
        <div class="blocks"><span class="bk v">¿Cuántas</span><span class="bk s">personas</span><span class="bk o">hay en tu familia?</span></div>
        <div class="blocks"><span class="bk p">¿Quién</span><span class="bk o">es</span><span class="bk s">él?</span><span class="small">→</span><span class="bk p">¿Quiénes</span><span class="bk o">son</span><span class="bk s">ellos?</span></div>
        ${tip('<b>cuánto</b>는 뒤 명사에 맞춰 <b>cuánto · cuánta · cuántos · cuántas</b>. <b>quién</b>은 복수일 때 <b>quiénes</b>. 의문사에는 항상 악센트!')}
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 숫자 101 ~ 9.000</h3>
        <table class="dt"><tr><th>100</th><td>cien</td><th>101</th><td>ciento uno</td></tr>
          <tr><th>200</th><td>doscientos/as</td><th>300</th><td>trescientos/as</td></tr><tr><th>400</th><td>cuatrocientos/as</td><th>500</th><td><b>quinientos/as</b></td></tr>
          <tr><th>600</th><td>seiscientos/as</td><th>700</th><td><b>setecientos/as</b></td></tr><tr><th>800</th><td>ochocientos/as</td><th>900</th><td><b>novecientos/as</b></td></tr>
          <tr><th>1.000</th><td>mil</td><th>2.000</th><td>dos mil</td></tr></table>
        ${tip('딱 100은 <b>cien</b>, 101~199는 <b>ciento</b> … (ciento uno). 1.000은 <b>mil</b> ("un mil" ✕).<br>200~900은 여성 명사 앞에서 <b>-as</b>: <b>doscientas</b> personas, <b>novecientas</b> páginas.<br><b>y</b>는 십의 자리와 일의 자리 사이에만: ciento cincuenta <b>y</b> siete.')}
        <div class="g5"></div></div>`);
    put(s, '.g1a', cloze({ id: 'g1a', sec: 'gram', skill: 'pos', title: '표를 완성하세요. (단수 명사 · 복수 명사)', cls: 'table2', text:
      [['yo', 'mi', 'mis'], ['tú', 'tu', 'tus'], ['él / ella / usted', 'su', 'sus'], ['nosotros/as', 'nuestro', 'nuestros'], ['vosotros/as', 'vuestro', 'vuestros'], ['ellos / ellas / ustedes', 'su', 'sus']]
        .map(([p, a, b]) => `<p><span>${p}</span>[${a}] hermano · [${b}] hermanos</p>`).join('') }));
    put(s, '.g1b', cloze({ id: 'g1b', sec: 'gram', skill: 'pos', title: '알맞은 소유형용사를 쓰세요.', cls: 'lines', text:
      ['¿Cómo se llaman [tus] padres? <i>(너의)</i>', 'Paula y [su] hermano. <i>(그녀의)</i>', '[Nuestra] abuela tiene ochenta años. <i>(우리의)</i>', 'Ellos viven con [sus] abuelos. <i>(그들의)</i>'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'dem', title: '알맞은 지시사를 쓰세요.', cls: 'lines', text:
      ['[Este] es mi hermano. <i>(이 · 남)</i>', '[Estos] son mis padres. <i>(이 · 남 복수)</i>', '¿Qué es [eso]? <i>(그것 · 중성)</i>', '[Aquellos] chicos son mis primos. <i>(저 · 남 복수)</i>'].map(x => `<p>${x}</p>`).join('') }));
    [['👵 (가까이) 이분은 우리 할머니야.', ['Esta es mi abuela.']], ['👧👧 (멀리) 저 여자아이들은 내 사촌들이야.', ['Aquellas son mis primas.', 'Aquellas chicas son mis primas.', 'Aquellas niñas son mis primas.']]]
      .forEach(([p, a], i) => put(s, '.g2b', writeItem({ id: 'g2b-' + i, sec: 'gram', skill: 'dem', prompt: p, answers: a })));
    const conj = (id, v, f) => cloze({ id, sec: 'gram', skill: 'ver', title: `<b>${v}</b>`, cls: 'table2 mini', text:
      ['yo', 'tú', 'él / ella / usted', 'nosotros/as', 'vosotros/as', 'ellos / ellas / ustedes'].map((p, i) => `<p><span>${p}</span>[${f[i]}]</p>`).join('') });
    put(s, '.g3a', conj('g3a', 'tener', ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen']));
    put(s, '.g3b', conj('g3b', 'estar', ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están']));
    put(s, '.g3c', conj('g3c', 'ser', ['soy', 'eres', 'es', 'somos', 'sois', 'son']));
    put(s, '.g3d', cloze({ id: 'g3d', sec: 'gram', skill: 'ver', title: 'tener · estar · ser 중 알맞은 형태를 쓰세요.', cls: 'lines', text:
      ['Mi hermano [tiene] veinte años.', 'Mis tíos [están] casados.', 'En mi familia [somos] cinco.', 'Mis padres [son] muy simpáticos.', '¿Cuántos hermanos [tienes] tú?'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'int', title: 'cuánto(s/a/as) · quién(es) 을 쓰세요.', cls: 'lines', text:
      ['¿[Cuántos] hermanos tienes?', '¿[Cuántas] personas hay en tu familia?', '¿[Quién] es ella? — Es mi prima.', '¿[Quiénes] son ellos? — Son mis tíos.'].map(x => `<p>${x}</p>`).join('') }));
    [[345, ['trescientos cuarenta y cinco']], ['600 personas', ['seiscientas personas']]]
      .forEach(([n, a], i) => put(s, '.g5', writeItem({ id: 'g5-' + i, sec: 'gram', skill: 'num', prompt: `<b class="bignum">${typeof n === 'number' ? n.toLocaleString('de-DE') : n}</b> 를 글자로 쓰세요.`, answers: a })));
  };

  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Paula habla de su familia con su amigo.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <div class="photo"><span class="ph-t">📷 Foto de la familia de Paula</span><div class="ph-row"><span>👨<small>padre</small></span><span>👩<small>madre</small></span><span class="mid">👵<small>abuela<br>(centro)</small></span><span>👦<small>hermano · 20</small></span><span>👱‍♀️<small>Paula · 16</small></span></div></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cuántas personas hay en tu familia?</span><span class="hlc c1">En mi familia hay cinco personas.</span><span class="hlc c2">¿Eres la mayor de tus hermanos?</span><span class="hlc c0">Soy cuatro años menor que mi hermano.</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blurBtn(s, '#hide1', '#d1txt', '본문 보기', '본문 가리기');
    [['En la familia de Paula son cinco.', 'Verdadero'], ['Paula es la mayor.', 'Falso'], ['El hermano de Paula tiene veinte años.', 'Verdadero'], ['La abuela está a la derecha de los padres.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'fam', prompt: p, options: ['Verdadero', 'Falso'], answer: a, explain: i === 3 ? 'Esta del centro es mi abuela y <b>a su derecha</b> están mis padres. — 부모님이 할머니의 오른쪽에 있어요.' : '' })));
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'ver', cls: 'lines', text: [
      '<b class="who">Amigo:</b> ¡Hola, Paula! ¿Qué es eso?', '<b class="who">Paula:</b> Es una foto de mi familia.', '<b class="who">Amigo:</b> ¿[Cuántos] [sois] en tu familia?',
      '<b class="who">Paula:</b> En mi familia [somos] cinco. Mira, [esta] del centro es mi abuela y a su derecha [están] mis padres. Este es mi hermano y esta [soy] yo.',
      '<b class="who">Amigo:</b> ¿Eres la [mayor]?', '<b class="who">Paula:</b> No, soy la [menor]. Mi hermano [tiene] veinte años y yo tengo [dieciséis].'].map(x => `<p>${x}</p>`).join('') }));
    [['"¿Cuántos sois en tu familia?" → <b>hay</b> 를 써서 바꾸세요.', ['¿Cuántas personas hay en tu familia?']],
      ['"En mi familia somos cinco." → <b>hay … personas</b> 로 바꾸세요.', ['En mi familia hay cinco personas.']],
      ['"¿Eres la mayor?" → <b>de tus hermanos</b> 를 넣어 쓰세요.', ['¿Eres la mayor de tus hermanos?']],
      ['나는 우리 형보다 네 살 어려. <span class="small">(… años menor que …)</span>', ['Soy cuatro años menor que mi hermano.']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'int', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '가족 사진을 보여 주며 친구와 이야기하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¿Qué es eso?\nB: Es una foto de mi familia.',
      must: [{ re: '¿\\s*cu[aá]nt(os|as)' + W1, label: '¿Cuántos/as …? 질문' }, { re: W0 + '(somos|hay) (\\p{L}+) (personas)?', label: 'somos … / hay … personas' },
        { re: W0 + '(este|esta|estos|estas)' + W1, label: '지시사 este / esta / estos / estas' }, { re: W0 + '(tengo|tiene|tienen) [\\p{L}\\d ]{1,25}a[nñ]os', label: '나이 (tener … años)' },
        { re: W0 + '(mayor|menor)' + W1, label: 'mayor / menor' }],
      model: 'A: ¿Qué es eso? B: Es una foto de mi familia. En mi familia somos cuatro. Este es mi padre y esta es mi madre. A: ¿Eres el mayor? B: Sí, soy el mayor. Mi hermana tiene doce años y yo tengo quince.' }));
  };

  /* Actividad 1 — 토레스 가족 */
  const TORRES = {
    nodes: [
      { k: 'dora', x: 430, g: 0, av: '👵🏼', name: 'Dora Lucía Ortega de Torres' }, { k: 'javier', x: 570, g: 0, av: '👴🏻', name: 'Javier Torres Gómez' },
      { k: 'estela', x: 70, g: 1, av: '👱🏼‍♀️', name: 'Estela Ramírez Castillo' }, { k: 'ernesto', x: 210, g: 1, av: '👨🏼‍🦰', name: 'Ernesto Torres Ortega' },
      { k: 'paula', x: 350, g: 1, av: '👩🏼‍🦰', name: 'Paula Torres Ortega' }, { k: 'andrea', x: 510, g: 1, av: '👩🏼', name: 'Andrea Torres Ortega' },
      { k: 'pedro', x: 650, g: 1, av: '👨🏼‍🦰', name: 'Pedro Ruiz Reyes' }, { k: 'raul', x: 830, g: 1, av: '👱🏼‍♂️', name: 'Raúl Torres Ortega' },
      { k: 'amanda', x: 70, g: 2, av: '👧🏼', name: 'Amanda Torres Ramírez' }, { k: 'guillermo', x: 210, g: 2, av: '👦🏼', name: 'Guillermo Torres Ramírez' },
      { k: 'ernestito', x: 350, g: 2, av: '🧒🏼', name: 'Ernestito Torres Ramírez' }, { k: 'clarisa', x: 510, g: 2, av: '👱🏼‍♀️', name: 'Clarisa Ruiz Torres' },
      { k: 'marisa', x: 650, g: 2, av: '👧🏼', name: 'Marisa Ruiz Torres' }
    ],
    couples: [['dora', 'javier'], ['estela', 'ernesto'], ['andrea', 'pedro']],
    kids: [{ p: ['dora', 'javier'], c: ['ernesto', 'paula', 'andrea', 'raul'] }, { p: ['estela', 'ernesto'], c: ['amanda', 'guillermo', 'ernestito'] }, { p: ['andrea', 'pedro'], c: ['clarisa', 'marisa'] }]
  };
  const MARISA = { dora: 'abuela', javier: 'abuelo', estela: 'tía', ernesto: 'tío', paula: 'tía', andrea: 'madre', pedro: 'padre', raul: 'tío', amanda: 'prima', guillermo: 'primo', ernestito: 'primo', clarisa: 'hermana' };
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'a) Mira el árbol genealógico de la familia Torres y contesta las siguientes preguntas.', { kr: '아바타를 누르면 이름을 들을 수 있어요. 💍 = 부부' })}
      <div class="tree1"></div>
      <h3 class="h3">✍️ 완전한 문장으로 대답하세요</h3><div class="items qa"></div>
      <h2 class="act-title">b) Di el nombre de los miembros de la familia Torres.</h2><div class="items two nm"></div>
      <h2 class="act-title">⭐ c) 마리사(Marisa)의 입장에서 — 가족 나무 빈칸에 관계를 쓰세요</h2>
      ${tip('마리사에게 Paula는? → 엄마(Andrea)의 자매니까 <b>tía</b>. 성(남/여)에 맞게 <b>-o / -a</b> 를 쓰세요.')}
      <div class="tree1c"></div>`);
    put(s, '.tree1', famTree({ id: 'a1t', sec: 'a1', skill: 'fam', gens: 3, G: 150, ...TORRES }));
    [['¿Cuántos hijos tienen Dora y Javier?', 'Tienen cuatro hijos.', 'Dora y Javier'], ['¿Cuántas hermanas tiene Raúl?', 'Tiene dos hermanas.', 'Raúl'], ['¿Cuántos sobrinos tiene Paula?', 'Tiene cinco sobrinos.', 'Paula'],
      ['¿Cuántos primos tiene Marisa?', 'Tiene tres primos.', 'Marisa'], ['¿Cuántos nietos tienen Dora y Javier?', 'Tienen cinco nietos.', 'Dora y Javier']]
      .forEach(([q, a, who], i) => put(s, '.qa', writeItem({ id: 'a1a-' + i, sec: 'a1', skill: i % 2 ? 'ver' : 'fam', prompt: `${i + 1}) ${q} ${say(q)}`, ph: a.split(' ')[0] + ' …',
        answers: [a, `${who} ${a.charAt(0).toLowerCase()}${a.slice(1)}`, a.split(' ').slice(1).join(' ')] })));
    const three = perms(['Amanda', 'Clarisa', 'Marisa']).flatMap(p => [`${p[0]}, ${p[1]} y ${p[2]}`, `${p[0]}, ${p[1]}, ${p[2]}`, `Son ${p[0]}, ${p[1]} y ${p[2]}.`]);
    [['Es el esposo de Andrea.', nameAns('Pedro', 'Pedro Ruiz Reyes')], ['Es la hermana de Guillermo.', nameAns('Amanda', 'Amanda Torres Ramírez')], ['Es la madre de Raúl.', nameAns('Dora', 'Dora Lucía Ortega de Torres').concat(nameAns('Dora Lucía'))],
      ['Es el abuelo de Clarisa y Marisa.', nameAns('Javier', 'Javier Torres Gómez')], ['Es la sobrina de Paula. <span class="small">(3명)</span>', three], ['Es la esposa de Javier.', nameAns('Dora', 'Dora Lucía Ortega de Torres').concat(nameAns('Dora Lucía'))]]
      .forEach(([p, a], i) => put(s, '.nm', writeItem({ id: 'a1b-' + i, sec: 'a1', skill: 'fam', prompt: `${i + 1}) ${p}`, ph: '이름', answers: a })));
    put(s, '.tree1c', famTree({ id: 'a1c', sec: 'a1', skill: 'fam', gens: 3, G: 150,
      nodes: TORRES.nodes.map(n => n.k === 'marisa' ? { ...n, name: 'Marisa', fixed: 'YO' } : { ...n, name: n.name.split(' ')[0], ans: MARISA[n.k] ? relAns(MARISA[n.k]) : null, ph: '¿…?' }),
      couples: TORRES.couples, kids: TORRES.kids }));
  };

  /* Actividad 2 — 가르시아 가족 (듣기) */
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Mira este árbol genealógico de la familia García y complétalo con los nombres correspondientes.', { listen: true, kr: '▶ 듣기 → 가족 나무 빈칸에 이름을 쓰세요. (대본은 처음에 가려져 있어요)' })}
      <h3 class="h3"><span class="hp">🎧</span> a) Árbol genealógico de la familia García <button class="btn ghost sm" id="p2a">▶ 듣기</button> <button class="btn ghost sm" id="h2a">대본 보기</button></h3>
      <p class="lead blur" id="t2a">${D.trans2a}</p>
      <div class="tree2"></div>
      <h3 class="h3"><span class="hp">🎧</span> b) Escucha y di qué miembro de la familia está hablando. <button class="btn ghost sm" id="p2b">▶ 듣기</button> <button class="btn ghost sm" id="h2b">대본 보기</button></h3>
      <p class="lead blur" id="t2b">${D.trans2b}</p>
      <div class="items b2"></div>
      <h3 class="h3">✍️ 받아쓰기 — 대본을 다시 듣고 빈칸을 채우세요</h3><div class="c2"></div>
      <h3 class="h3">✍️ 가르시아 가족 소개 문장 쓰기</h3><div class="items two w2"></div>`);
    $('#p2a', s).onclick = e => speak(D.trans2a, e.currentTarget);
    $('#p2b', s).onclick = e => speak(D.trans2b, e.currentTarget);
    blurBtn(s, '#h2a', '#t2a', '대본 보기', '대본 가리기');
    blurBtn(s, '#h2b', '#t2b', '대본 보기', '대본 가리기');
    const NM = ['Luis', 'Antonia', 'Javier', 'Sara', 'David', 'Lucía', 'Raimón', 'Teresa'];
    put(s, '.tree2', famTree({ id: 'a2t', sec: 'a2', skill: 'fam', gens: 3, G: 140, tall: 95,
      bank: '이름 상자: ' + shuffle(NM).map(n => `<span>${n}</span>`).join(''),
      nodes: [{ k: 'luis', x: 420, g: 0, av: '👴🏻', ans: ['Luis'] }, { k: 'antonia', x: 580, g: 0, av: '👵🏼', ans: ['Antonia'] },
        { k: 'javier', x: 160, g: 1, av: '👱🏼‍♂️', ans: ['Javier'] }, { k: 'sara', x: 400, g: 1, av: '👱🏼‍♀️', ans: ['Sara'] }, { k: 'david', x: 560, g: 1, av: '👨🏼‍🦰', ans: ['David'] },
        { k: 'lucia', x: 820, g: 1, av: '👩🏼‍🦰', badge: '👓', ans: ['Lucía'] },
        { k: 'raimon', x: 410, g: 2, av: '👦🏼', ans: ['Raimón'] }, { k: 'teresa', x: 550, g: 2, av: '👧🏼', ans: ['Teresa'] }],
      couples: [['luis', 'antonia'], ['sara', 'david']],
      kids: [{ p: ['luis', 'antonia'], c: ['javier', 'sara', 'lucia'] }, { p: ['sara', 'david'], c: ['raimon', 'teresa'] }] }));
    put(s, '.b2', writeItem({ id: 'a2b', sec: 'a2', skill: 'fam', prompt: '말하는 사람은 누구인가요? <span class="small">¿Quién está hablando?</span>', ph: 'Es …', answers: nameAns('Lucía').concat(['Está hablando Lucía.', 'Lucía está hablando.']) }));
    put(s, '.c2', cloze({ id: 'a2c', sec: 'a2', skill: 'ver', cls: 'lines', text: [
      'Luis y Antonia [tienen] un hijo y dos [hijas].', 'El hijo [mayor] se llama Javier. [Sus] hijas se llaman Sara y Lucía.', 'Javier y Lucía [están] [solteros].',
      'Sara está [casada] con David y tienen un hijo y una hija.', 'Soy la [hermana] de Sara. Soy [soltera] y tengo dos [sobrinos].'].map(x => `<p>${x}</p>`).join('') }));
    [['¿Quién es Raimón? <span class="small">(Sara와 David의 …)</span>', ['Es el hijo de Sara y David.', 'Raimón es el hijo de Sara y David.', 'Es el hijo de David y Sara.']],
      ['¿Quién es Teresa? <span class="small">(Luis와 Antonia의 …)</span>', ['Es la nieta de Luis y Antonia.', 'Teresa es la nieta de Luis y Antonia.', 'Es la nieta de Antonia y Luis.']],
      ['¿Quién es Javier? <span class="small">(Raimón의 …)</span>', ['Es el tío de Raimón.', 'Javier es el tío de Raimón.']],
      ['¿Quién es David? <span class="small">(Sara의 …)</span>', ['Es el esposo de Sara.', 'David es el esposo de Sara.', 'Es el marido de Sara.', 'David es el marido de Sara.']]]
      .forEach(([p, a], i) => put(s, '.w2', writeItem({ id: 'a2w-' + i, sec: 'a2', skill: 'int', prompt: p, ph: 'Es el / la …', answers: a })));
  };

  /* Actividad 3 — 나의 가족 나무 */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Dibuja el árbol genealógico de tu familia.', { kr: '그림 대신 — 가족 나무의 관계 빈칸을 쓰고(채점), 아래 칸에 우리 가족 이름을 적어 나만의 나무를 완성하세요.' })}
      ${tip('아빠 쪽 = <b>paterno/a</b> (abuelo paterno 친할아버지), 엄마 쪽 = <b>materno/a</b> (abuela materna 외할머니).')}
      <div class="tree3"></div>
      <h3 class="h3">✍️ 나의 가족 나무를 글로 설명하세요</h3><div class="f3"></div>`);
    const R = { ap: 'abuelo paterno', bp: 'abuela paterna', am: 'abuelo materno', bm: 'abuela materna', ti: 'tío', pa: 'padre', ma: 'madre', ta: 'tía', pr: 'primo', hm: 'hermano mayor', hn: 'hermana menor', pa2: 'prima' };
    const AV = { ap: '👴🏻', bp: '👵🏻', am: '👴🏻', bm: '👵🏻', ti: '🧔🏻', pa: '👨🏻', ma: '👩🏻', ta: '👩🏻‍🦱', pr: '🧒🏻', hm: '👦🏻', yo: '🙋', hn: '👧🏻', pa2: '👧🏻' };
    const X = { ap: 80, bp: 220, am: 640, bm: 780, ti: 70, pa: 300, ma: 440, ta: 860, pr: 70, hm: 230, yo: 370, hn: 510, pa2: 860 };
    const Gn = { ap: 0, bp: 0, am: 0, bm: 0, ti: 1, pa: 1, ma: 1, ta: 1, pr: 2, hm: 2, yo: 2, hn: 2, pa2: 2 };
    put(s, '.tree3', famTree({ id: 'a3t', sec: 'a3', skill: 'fam', gens: 3, G: 175, tall: 140, names: true,
      nodes: Object.keys(X).map(k => k === 'yo' ? { k, x: X[k], g: 2, av: AV[k], fixed: 'YO' } : { k, x: X[k], g: Gn[k], av: AV[k], ans: relAns(R[k]), ph: '¿…?' }),
      couples: [['ap', 'bp'], ['am', 'bm'], ['pa', 'ma']],
      kids: [{ p: ['ap', 'bp'], c: ['ti', 'pa'] }, { p: ['am', 'bm'], c: ['ma', 'ta'] }, { p: ['pa', 'ma'], c: ['hm', 'yo', 'hn'] }, { p: 'ti', c: ['pr'] }, { p: 'ta', c: ['pa2'] }] }));
    put(s, '.f3', freeItem({ id: 'a3-f', sec: 'a3', rows: 6, prompt: '우리 가족 나무를 5문장 이상으로 소개하세요. (누가 누구인지, 이름, 형제 수)',
      ph: 'Mi abuelo paterno se llama … Mis padres se llaman …',
      must: [{ re: W0 + 'se llaman?' + W1, label: '이름 (se llama / se llaman) 2번 이상', min: 2 }, { re: W0 + 'abuel[oa]s? (patern[oa]s?|matern[oa]s?)' + W1, label: 'abuelo/a paterno/a · materno/a' },
        { re: W0 + '(mi|mis)' + W1, label: '소유형용사 mi / mis 3번 이상', min: 3 }, { re: W0 + '(tengo|no tengo) [\\p{L} ]{0,20}(herman[oa]s?|t[ií][oa]s?|prim[oa]s?)', label: 'tengo … hermanos / tíos / primos' }],
      minWords: 30,
      model: 'Mi abuelo paterno se llama Minho y mi abuela paterna se llama Sunja. Mis padres se llaman Jiwon y Mina. Tengo un hermano mayor y una hermana menor. Mi tío es el hermano de mi padre. Tengo dos primos.' }));
  };

  /* Actividad 4 — 묻고 답하기 */
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Haz preguntas a tu compañero sobre su familia.', { kr: '① 질문을 스페인어로 쓰고 ② 나에 대한 대답도 써 보세요.' })}
      <div class="pm4"></div>
      <h3 class="h3">✍️ ① 질문 쓰기 (¿ ? 부호까지!)</h3><div class="items two q4"></div>
      <h3 class="h3">✍️ ② 나의 대답 쓰기</h3><div class="items r4"></div>`);
    put(s, '.pm4', pairMatch({ id: 'a4p', sec: 'a4', skill: 'fam', title: '상자 속 표현과 뜻을 연결하세요.', pairs: [['hermano mayor', '형 · 오빠'], ['hermano menor', '남동생'], ['hijo único', '외아들 (형제가 없는 아들)'], ['abuelo paterno', '친할아버지'], ['abuelo materno', '외할아버지']] }));
    const Q = [['부모님 성함이 어떻게 되셔?', ['¿Cómo se llaman tus padres?']],
      ['(부모님은) 몇 살이셔?', ['¿Cuántos años tienen?', '¿Cuántos años tienen tus padres?', '¿Qué edad tienen?', '¿Qué edad tienen tus padres?']],
      ['형제 있어? 형제가 몇 명이야?', ['¿Tienes hermanos? ¿Cuántos hermanos tienes?']],
      ['너희 형제들은 결혼했어?', ['¿Están casados tus hermanos?', '¿Tus hermanos están casados?']],
      ['조카 있어?', ['¿Tienes sobrinos?']],
      ['삼촌이나 이모(고모) 있어?', ['¿Tienes tíos o tías?', '¿Tienes tíos?']],
      ['사촌이 몇 명이야?', ['¿Cuántos primos tienes?']],
      ['조부모님 계셔? 같이 살아?', ['¿Tienes abuelos? ¿Vives con ellos?']]];
    Q.forEach(([p, a], i) => put(s, '.q4', writeItem({ id: 'a4q-' + i, sec: 'a4', skill: i === 1 || i === 2 || i === 6 ? 'int' : 'ver', prompt: `${i + 1}) ${p}`, ph: '¿…?', answers: a })));
    const M = [[{ re: W0 + 'se llaman?' + W1, label: 'se llama(n) …' }],
      [{ re: W0 + '(tiene|tienen) [\\p{L}\\d ]{1,40}a[nñ]os', label: 'tiene(n) … años' }],
      [{ re: W0 + '(tengo|no tengo)' + W1, label: '(No) tengo …' }, { re: W0 + '(herman[oa]s?|hij[oa] [uú]nic[oa])' + W1, label: 'hermanos / hijo único' }],
      [{ re: W0 + '(est[aá]n?|no est[aá]n?) (casad|solter)', label: 'está(n) casado/a(s) · soltero/a(s)' }, { re: W0 + '(mi|mis)' + W1, label: 'mi / mis' }],
      [{ re: W0 + '(tengo|no tengo)' + W1, label: '(No) tengo …' }, { re: W0 + 'sobrin[oa]s?' + W1, label: 'sobrinos' }],
      [{ re: W0 + '(tengo|no tengo)' + W1, label: '(No) tengo …' }, { re: W0 + 't[ií][oa]s?' + W1, label: 'tíos / tías' }],
      [{ re: W0 + '(tengo|no tengo)' + W1, label: '(No) tengo …' }, { re: W0 + 'prim[oa]s?' + W1, label: 'primos' }],
      [{ re: W0 + '(tengo|no tengo)' + W1, label: '(No) tengo abuelos …' }, { re: W0 + '(vivo|no vivo)' + W1, label: '(No) vivo con ellos' }]];
    const BQ = ['¿Cómo se llaman tus padres?', '¿Cuántos años tienen?', '¿Tienes hermanos? ¿Cuántos hermanos tienes?', '¿Están casados tus hermanos?', '¿Tienes sobrinos?', '¿Tienes tíos o tías?', '¿Cuántos primos tienes?', '¿Tienes abuelos? ¿Vives con ellos?'];
    BQ.forEach((q, i) => put(s, '.r4', freeItem({ id: 'a4r-' + i, sec: 'a4', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, ph: ['Mis padres se llaman …', 'Mi padre tiene … años y mi madre …', 'Sí, tengo … / No, soy hijo único.', 'Sí, mi hermano está casado. / No, mis hermanos están solteros.', 'No, no tengo sobrinos.', 'Sí, tengo dos tíos y …', 'Tengo … primos.', 'Sí, tengo … No vivo con ellos.'][i], must: M[i] })));
  };

  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Juan y Cristina hablan de los miembros de su familia.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 쓰세요</h3><div class="d2c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Qué edad tienen tus padres?</span><span class="hlc c1">¿Cuál es la profesión de tus padres?</span><span class="hlc c2">No tengo hermanos.</span><span class="hlc c0">Yo tengo dos hermanos menores.</span><span class="hlc c1">el hijo mayor</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blurBtn(s, '#hide2', '#d2txt', '본문 보기', '본문 가리기');
    [['Los padres de Cristina tienen cincuenta años.', 'Verdadero'], ['La madre de Cristina es maestra.', 'Falso'], ['Cristina tiene muchos hermanos.', 'Falso'], ['Juan es el mayor de los tres hermanos.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'fam', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'ver', cls: 'lines', text: [
      '<b class="who">Juan:</b> ¿[Cuántos] años tienen tus padres?', '<b class="who">Cristina:</b> Mi padre [tiene] cincuenta años y mi madre tiene la misma [edad].',
      '<b class="who">Juan:</b> ¿Cómo [son]?', '<b class="who">Cristina:</b> Son muy [simpáticos] y [trabajadores], pero a veces son estrictos conmigo.',
      '<b class="who">Juan:</b> ¿A qué se [dedican] tus padres?', '<b class="who">Cristina:</b> Mi padre es [maestro] de una escuela. Mi madre es [enfermera].', '<b class="who">Juan:</b> Yo tengo dos hermanas [pequeñas]. Soy el [mayor] de los tres.'].map(x => `<p>${x}</p>`).join('') }));
    [['¿Cuántos años tienen tus padres?', '¿Qué edad …?', ['¿Qué edad tienen tus padres?']],
      ['¿A qué se dedican tus padres?', '¿Cuál es la profesión …?', ['¿Cuál es la profesión de tus padres?']],
      ['No, soy hija única.', 'No tengo …', ['No, no tengo hermanos.', 'No tengo hermanos.']],
      ['Yo tengo dos hermanas pequeñas.', '… menores', ['Yo tengo dos hermanas menores.', 'Tengo dos hermanas menores.']],
      ['Soy el mayor de los tres.', 'el hijo mayor', ['Soy el hijo mayor.', 'Soy el hijo mayor de los tres.']]]
      .forEach(([o, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: i < 2 ? 'int' : 'fam', prompt: `${o} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 6, prompt: '친구와 부모님의 나이 · 성격 · 직업, 형제에 대해 묻고 답하는 대화를 쓰세요.',
      ph: 'A: ¿Cuántos años tienen tus padres?\nB: Mi padre tiene …',
      must: [{ re: '¿\\s*(cu[aá]ntos a[nñ]os|qu[eé] edad) tienen?', label: '나이 묻기 (¿Cuántos años / Qué edad …?)' }, { re: W0 + '(tiene|tienen|tengo) [\\p{L}\\d ]{1,30}a[nñ]os', label: '나이 답하기 (tiene … años)' },
        { re: '¿\\s*c[oó]mo son' + W1, label: '¿Cómo son?' }, { re: W0 + '(es|son) (muy )?(simp[aá]tic|trabajador|estrict|generos|activ|alegre|amable|divertid|seri|tranquil|inteligente)', label: '성격 (es / son + 형용사)' },
        { re: W0 + '(es|son) (maestr|profesor|enfermer|m[eé]dic|ingenier|abogad|ama de casa|funcionari|estudiante|empleado|empleada|cociner|polic[ií]a)|se dedica', label: '직업' }],
      model: 'A: ¿Cuántos años tienen tus padres? B: Mi padre tiene cuarenta y ocho años y mi madre tiene cuarenta y cinco. A: ¿Cómo son? B: Son muy simpáticos y generosos. A: ¿A qué se dedican? B: Mi padre es ingeniero y mi madre es profesora.' }));
  };

  B.a5 = () => {
    const s = sec('a5', `${actHead(5, '¿Cómo son los miembros de tu familia? Habla con tu compañero siguiendo el modelo.')}
      ${modelo('Mi padre se llama Kise Park.<br>Tiene 48 años.<br>Es profesor de la universidad. Es generoso y activo.')}
      <h3 class="h3">① 성격 — 반대말끼리 연결하세요</h3><div class="pm5"></div>
      <h3 class="h3">② 외모 — 표현을 누르고 그림을 누르세요</h3><div class="mp5"></div>
      <h3 class="h3">③ 성·수 일치 — 형용사를 알맞게 바꾸세요</h3>
      ${tip('-o 형용사: generos<b>o</b> → generos<b>a</b> → generos<b>os</b> / generos<b>as</b>. -e 형용사는 성이 같아요: alegre → alegre<b>s</b>. trabajador → trabajador<b>a</b> → trabajador<b>es</b>.')}
      <div class="c5"></div>
      <h3 class="h3">④ 카드를 보고 modelo처럼 쓰세요</h3><div class="card5"></div><div class="items w5"></div>
      <h3 class="h3">⑤ 우리 가족 소개 — 1) ~ 6) 를 완성하세요</h3><div class="items f5"></div>`);
    put(s, '.pm5', pairMatch({ id: 'a5p', sec: 'a5', skill: 'des', pairs: [['simpático', 'antipático'], ['trabajador', 'perezoso'], ['generoso', 'tacaño'], ['activo', 'tranquilo'], ['alto', 'bajo'], ['joven', 'mayor']] }));
    put(s, '.mp5', matchPics({ id: 'a5m', sec: 'a5', skill: 'des', cols: 3, items: [{ e: '👨‍🦲', es: 'es calvo' }, { e: '🧔', es: 'tiene barba' }, { e: '👱‍♀️', es: 'es rubia' }, { e: '👩‍🦰', es: 'es pelirroja' }, { e: '🤓', es: 'lleva gafas' }, { e: '👵', es: 'es mayor' }] }));
    put(s, '.c5', cloze({ id: 'a5c', sec: 'a5', skill: 'des', cls: 'lines', text: [
      'Mi madre es muy [generosa]. <i>(generoso)</i>', 'Mis abuelos son [simpáticos]. <i>(simpático)</i>', 'Mi hermana es [trabajadora]. <i>(trabajador)</i>',
      'Mis tías son [alegres]. <i>(alegre)</i>', 'Mi prima es [alta] y [rubia]. <i>(alto, rubio)</i>'].map(x => `<p>${x}</p>`).join('') }));
    $('.card5', s).innerHTML = `<div class="pcard"><span class="pc-e">👵🏻</span><dl><dt>relación</dt><dd>mi abuela</dd><dt>nombre</dt><dd>Carmen</dd><dt>edad</dt><dd>72</dd><dt>carácter</dt><dd>alegre · cariñosa</dd></dl></div>
      <div class="pcard"><span class="pc-e">🧔🏻</span><dl><dt>relación</dt><dd>mi tío</dd><dt>nombre</dt><dd>Jorge</dd><dt>edad</dt><dd>39</dd><dt>profesión · carácter</dt><dd>médico · simpático</dd></dl></div>`;
    [['👵🏻 이름', ['Mi abuela se llama Carmen.']], ['👵🏻 나이 (숫자를 글자로)', ['Tiene setenta y dos años.', 'Mi abuela tiene setenta y dos años.']], ['👵🏻 성격', ['Es alegre y cariñosa.', 'Mi abuela es alegre y cariñosa.', 'Es cariñosa y alegre.']],
      ['🧔🏻 이름', ['Mi tío se llama Jorge.']], ['🧔🏻 나이 (숫자를 글자로)', ['Tiene treinta y nueve años.', 'Mi tío tiene treinta y nueve años.']], ['🧔🏻 직업 · 성격', ['Es médico. Es simpático.', 'Es médico y es simpático.', 'Es médico y simpático.']]]
      .forEach(([p, a], i) => put(s, '.w5', writeItem({ id: 'a5w-' + i, sec: 'a5', skill: i % 3 === 1 ? 'num' : i % 3 === 0 ? 'pos' : 'des', prompt: p, answers: a })));
    const ADJ = '(simp[aá]tic|antip[aá]tic|trabajador|perezos|generos|taca[nñ]|activ|tranquil|alegre|amable|estrict|divertid|seri|inteligente|cari[nñ]os|alt|baj|delgad|gord|guap|rubi|moren|pelirroj|calv|joven|mayor|simp[aá]tic)';
    [['Mi abuelo/a', 'abuel'], ['Mi madre', 'madre'], ['Mi hermano/a', 'herman'], ['Mi primo/a favorito/a', 'prim'], ['Mi tío/a favorito/a', 't[ií]'], ['Yo', 'yo']].forEach(([w, r], i) => {
      const yo = i === 5;
      put(s, '.f5', freeItem({ id: 'a5f-' + i, sec: 'a5', rows: 3, prompt: `${i + 1}) ${w} …`,
        ph: yo ? 'Yo me llamo … Tengo … años. Soy …' : `${w.replace(/\/a( favorito\/a)?/, '')} se llama … Tiene … años. Es …`,
        must: yo ? [{ re: W0 + 'me llamo' + W1, label: 'Yo me llamo …' }, { re: W0 + 'tengo [\\p{L}\\d ]{1,30}a[nñ]os', label: 'Tengo … años' }, { re: W0 + 'soy' + W1, label: 'Soy + 형용사' }]
          : [{ re: W0 + 'mi ' + r, label: `${w.split(' ').slice(0, 2).join(' ')}` }, { re: W0 + 'se llama' + W1, label: 'se llama …' }, { re: W0 + 'tiene [\\p{L}\\d ]{1,30}a[nñ]os', label: 'Tiene … años' }, { re: W0 + 'es (muy )?' + ADJ, label: 'Es + 성격/외모 형용사' }] }));
    });
  };

  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Con tu compañero habla de tu familia utilizando las siguientes palabras.')}
      <div class="ybox wordbank"><span>casado</span><span>soltero</span><span>viudo</span><span>divorciado</span><span>hijo único</span><span>el mayor</span><span>el menor</span></div>
      ${tip('결혼 여부는 보통 <b>estar</b>: Mi tío <b>está</b> soltero. / Mis padres <b>están</b> casados. (soltero는 ser도 가능: Soy soltero.)<br>여자면 -a: casad<b>a</b>, solter<b>a</b>, viud<b>a</b>, divorciad<b>a</b>, hij<b>a</b> únic<b>a</b>, <b>la</b> mayor, <b>la</b> menor.')}
      <h3 class="h3">① 교재 속 인물로 연습 — 빈칸을 채우세요</h3><div class="c6"></div>
      <h3 class="h3">② 성에 맞게 바꿔 쓰세요</h3><div class="items two w6"></div>
      <h3 class="h3">③ 우리 가족 이야기 — 1) ~ 6) 를 완성하세요</h3><div class="items f6"></div>`);
    put(s, '.c6', cloze({ id: 'a6c', sec: 'a6', skill: 'fam', cls: 'lines', text: [
      'Cristina no tiene hermanos. Es hija [única].', 'Juan tiene dos hermanas pequeñas. Es [el mayor] de los tres.', 'Paula tiene un hermano de veinte años. Ella es [la menor].',
      'Sara [está] [casada] con David.', 'Javier y Lucía no están casados. Están [solteros].', 'Mi abuelo no tiene esposa porque ella murió. Está [viudo].'].map(x => `<p>${x}</p>`).join('') }));
    [['Mi tía + (soltero)', ['Mi tía está soltera.', 'Mi tía es soltera.']], ['Mi abuela + (viudo)', ['Mi abuela está viuda.', 'Mi abuela es viuda.']],
      ['Yo (여자) + (hijo único)', ['Soy hija única.', 'Yo soy hija única.']], ['Mis primos + (casado)', ['Mis primos están casados.']]]
      .forEach(([p, a], i) => put(s, '.w6', writeItem({ id: 'a6w-' + i, sec: 'a6', skill: 'ver', prompt: p, answers: a })));
    const EC = 'casad[oa]s?|solter[oa]s?|viud[oa]s?|divorciad[oa]s?|hij[oa] [uú]nic[oa]|(el|la) (mayor|menor)';
    ['Yo soy', 'Mi abuelo/a es', 'Mi padre es', 'Mi madre es', 'Mi tío/a favorito/a es', 'Mi primo/a favorito/a es'].forEach((p, i) =>
      put(s, '.f6', freeItem({ id: 'a6f-' + i, sec: 'a6', line: true, prompt: `${i + 1}) ${p} ________.`, ph: p.replace(/ es$/, ' está …').replace('Yo soy', 'Yo soy …'),
        must: [{ re: W0 + '(' + EC + ')' + W1, label: '상자의 표현 (casado, soltero, viudo, hijo único, el mayor …)' }, { re: W0 + '(soy|es|est[aá]|estoy)' + W1, label: 'ser / estar' }] })));
  };

  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Escucha y repite estos números.', { listen: true, kr: '🔊 를 눌러 듣고, 숫자를 스페인어 글자로 쓰세요.' })}
      <div class="c7"></div>
      <h3 class="h3">🎧 듣고 숫자 쓰기 — 🔊 만 듣고 숫자(아라비아 숫자)로 쓰세요</h3><div class="items two l7"></div>`);
    put(s, '.c7', cloze({ id: 'a7c', sec: 'a7', skill: 'num', cls: 'numgrid', text: D.nums.map(([n, w]) => `<p><b class="nbig">${n}</b>${say(w)}<br>[${w}]</p>`).join('') }));
    [[350, 'trescientos cincuenta'], [1200, 'mil doscientos'], [4700, 'cuatro mil setecientos'], [999, 'novecientos noventa y nueve']]
      .forEach(([n, w], i) => put(s, '.l7', writeItem({ id: 'a7l-' + i, sec: 'a7', skill: 'num', prompt: `${i + 1}) ${say(w)} <span class="small">듣기</span>`, ph: '숫자', answers: [String(n), n.toLocaleString('de-DE')] })));
  };

  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'a) Busca la palabra ‘moneda’ en el diccionario. ¿Cuál es la moneda de tu país?')}
      <div class="ybox"><p>🇪🇺 Unión Europea : <b>euro / céntimo</b></p><p>🇺🇸 Estados Unidos : <b>dólar / centavo</b></p><p>🇲🇽 México : <b>peso / centavo</b></p><p>🇰🇷 Corea del Sur : <b>won</b></p></div>
      <div class="pm8"></div><div class="items w8a"></div>
      <h2 class="act-title">b) Observa estos billetes. ¿Cuántos wones/pesos/euros/dólares hay?</h2>
      ${modelo('Hay ochocientos ochenta y cinco euros.')}
      ${tip('지폐를 모두 더한 뒤 <b>Hay + 숫자(글자) + 화폐(복수)</b>. 복수형: euro<b>s</b>, dólar<b>es</b>, peso<b>s</b>, won<b>es</b>. 1.000 이상은 <b>mil</b>: 66.000 = sesenta y seis mil.')}
      <div class="items b8"></div>
      <h3 class="h3">⭐ 더 연습하기</h3><div class="items b8x"></div>`);
    put(s, '.pm8', pairMatch({ id: 'a8p', sec: 'a8', skill: 'fam', title: '나라와 화폐를 연결하세요.', pairs: [['🇪🇸 España', 'el euro'], ['🇺🇸 Estados Unidos', 'el dólar'], ['🇲🇽 México', 'el peso'], ['🇰🇷 Corea del Sur', 'el won'], ['🇯🇵 Japón', 'el yen']] }));
    put(s, '.w8a', writeItem({ id: 'a8a', sec: 'a8', skill: 'int', prompt: '¿Cuál es la moneda de tu país? <span class="small">(한국)</span>', ph: 'Es el …', answers: ['Es el won.', 'La moneda de mi país es el won.', 'El won.', 'La moneda de Corea es el won.', 'Es el won coreano.'] }));
    const BL = [['eur', [500, 200, 100, 50, 20, 10, 5], 'ochocientos ochenta y cinco', 'euros'], ['usd', [100, 50, 20, 10, 5, 1], 'ciento ochenta y seis', 'dólares'],
      ['mxn', [100, 200, 20, 500], 'ochocientos veinte', 'pesos'], ['krw', [50000, 5000, 10000, 1000], 'sesenta y seis mil', 'wones']];
    const unit = u => u === 'wones' ? ['wones', 'wons'] : [u];
    BL.forEach(([c, l, w, u], i) => { const it = writeItem({ id: 'a8b-' + i, sec: 'a8', skill: 'num', prompt: `${i + 1}) ${bills(c, l)}`, ph: 'Hay …', answers: unit(u).flatMap(x => [`Hay ${w} ${x}.`, `${w} ${x}`]) }); it.classList.add('billq'); put(s, '.b8', it); });
    [['eur', [200, 50, 5], 'doscientos cincuenta y cinco', 'euros'], ['krw', [1000, 1000, 5000], 'siete mil', 'wones'], ['mxn', [500, 500, 200, 20], 'mil doscientos veinte', 'pesos']]
      .forEach(([c, l, w, u], i) => { const it = writeItem({ id: 'a8x-' + i, sec: 'a8', skill: 'num', prompt: `${i + 5}) ${bills(c, l)}`, ph: 'Hay …', answers: unit(u).flatMap(x => [`Hay ${w} ${x}.`, `${w} ${x}`]) }); it.classList.add('billq'); put(s, '.b8x', it); });
  };

  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Escucha los diálogos y escribe los números que oigas.', { listen: true, kr: '▶ 대화를 듣고 ① 숫자로 쓰고 ② 그 숫자를 스페인어 글자로 쓰세요.' })}
      ${tip('명사가 여성이면 200~900도 여성형: <b>novecientas</b> páginas. 남성 명사는 그대로: <b>quinientos</b> kilómetros.')}
      <div class="d9"></div>`);
    D.dial9.forEach(([q, a, n, w], i) => {
      const box = el(`<div class="dl9"><div class="dl9h"><b>${i + 1})</b> <button class="btn ghost sm pl">▶ 대화 듣기</button> <button class="btn ghost sm hd">대본 보기</button><span class="scr blur">A: ${q}<br>B: ${a}</span></div><div class="items two"></div></div>`);
      $('.pl', box).onclick = e => playLines([{ who: 'A', es: q }, { who: 'B', es: a }], e.currentTarget);
      $('.hd', box).onclick = e => { const t = $('.scr', box); t.classList.toggle('blur'); e.currentTarget.textContent = t.classList.contains('blur') ? '대본 보기' : '대본 가리기'; };
      put(box, '.items', writeItem({ id: 'a9n-' + i, sec: 'a9', skill: 'num', prompt: '① 숫자', ph: '0', answers: [n] }));
      put(box, '.items', writeItem({ id: 'a9w-' + i, sec: 'a9', skill: 'num', prompt: '② 글자로', ph: 'Spanish', answers: w }));
      put(s, '.d9', box);
    });
  };

  SC.lesson({
    num: '04',
    title: 'Esta es mi familia',
    ttsTest: 'Esta es mi familia. Tengo dieciséis años.',
    cover: {
      emoji: '👨‍👩‍👧‍👦<small>🌳 💍 💶</small>',
      bg: 'linear-gradient(135deg,#6b2a1a 0%,#a0442a 55%,#f0a23c 100%)',
      tema: ['La familia · El estado civil · La edad', 'Identificación de personas', 'El carácter · El aspecto físico · Monedas y billetes', 'Números del 101 al 9.000'],
      com: ['Hablar sobre la familia', 'Preguntar y decir la edad', 'Describir el aspecto físico y el carácter de una persona'],
      gram: ['Posesivos: formas átonas', 'Adjetivos y pronombres demostrativos', 'Presente de indicativo: <i>tener, estar, ser</i>', 'Interrogativos: <i>cuánto, quién</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      Amigo: { g: 'm', av: '🧑🏼', side: 'l' }, Paula: { g: 'f', av: '👱🏼‍♀️', side: 'r' },
      Juan: { g: 'm', av: '🧑🏻‍🦱', side: 'l' }, Cristina: { g: 'f', av: '👩🏼‍🦰', side: 'r' },
      A: { av: '🙋🏻‍♂️', side: 'l' }, B: { av: '🙋🏽‍♀️', side: 'r' }
    },
    errLabels: { concordancia: '성·수 일치 (mi/mis, -o/-a)', pronombre: '지시사 · 대명사', conjugacion: '동사 변화 (tener · estar · ser)', estructura: '문장 구조' },
    errTips: {
      acento: 'años, tío, tía, único, simpático, cuántos, quién … 악센트와 ñ도 철자예요. 시험에서는 감점됩니다.',
      concordancia: '소유형용사·형용사는 뒤/앞 명사에 맞춰요: mis padres, nuestra madre, mi madre es generosa.',
      pronombre: '이 este/esta/estos/estas · 그 ese/esa · 저 aquel/aquella',
      conjugacion: 'tener: tengo, tienes, tiene, tenemos, tenéis, tienen / estar: estoy, estás, está … / ser: soy, eres, es, somos, sois, son',
      estructura: '나이는 tener: Tengo 16 años (○) / Soy 16 años (✕). 결혼 여부는 estar: Está casado.'
    },
    classify(ti, ta) {
      if (ti.length * 2 < ta.length) return 'otro';
      const VT = ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'], VS = ['soy', 'eres', 'es', 'somos', 'sois', 'son'], VE = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];
      if (ta.some(w => VT.includes(w)) && ta.includes('años') && ti.some(w => VS.includes(w))) return 'estructura';
      const P = ['mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras'];
      if (ti.filter(w => P.includes(w)).join() !== ta.filter(w => P.includes(w)).join()) return 'concordancia';
      const DM = ['este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'aquellos', 'aquellas', 'esto', 'eso'];
      if (ti.filter(w => DM.includes(w)).join() !== ta.filter(w => DM.includes(w)).join()) return 'pronombre';
      const V = [...VT, ...VS, ...VE];
      if (ti.filter(w => V.includes(w)).join() !== ta.filter(w => V.includes(w)).join()) return 'conjugacion';
      return null;
    },
    errRules: [
      { re: W0 + '(soy|es|eres|son|somos) (\\d+|\\p{L}+( y \\p{L}+)?) a[nñ]os' + W1, t: 'estructura', msg: '나이는 tener: "Tengo 16 años" (Soy … años ✕)' },
      { re: W0 + 'anos' + W1, t: 'acento', msg: '"años" — ñ 를 꼭 쓰세요' },
      { re: W0 + 'esta(?= (casad|solter|viud|divorciad))', t: 'acento', msg: '"está casado/soltero" (동사 estar의 악센트)' },
      { re: W0 + '(es|son) casad[oa]s?' + W1, t: 'estructura', msg: '결혼 여부는 estar: "está casado / están casados"' },
      { re: W0 + 'mis (padre|madre|hermano|hermana|abuelo|abuela|t[ií]o|t[ií]a|primo|prima|hijo|hija|sobrino|sobrina|familia)' + W1, t: 'concordancia', msg: 'mis + 복수 명사 / 단수면 mi' },
      { re: W0 + 'mi (padres|hermanos|hermanas|abuelos|abuelas|t[ií]os|t[ií]as|primos|primas|hijos|hijas|sobrinos)' + W1, t: 'concordancia', msg: '복수 명사 앞은 mis (mis padres)' },
      { re: W0 + 'cu[aá]ntos (personas|hermanas|primas|t[ií]as|hijas|p[aá]ginas)' + W1, t: 'concordancia', msg: '여성 복수 명사 → cuántas' },
      { re: W0 + '(cincocientos|cinco cientos|sietecientos|siete cientos|nuevecientos|nueve cientos)' + W1, t: 'conjugacion', msg: '불규칙: quinientos · setecientos · novecientos' },
      { re: W0 + 'un mil' + W1, t: 'estructura', msg: '1.000 = mil ("un mil" ✕)' },
      { re: W0 + 'cien (y )?(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)' + W1, t: 'estructura', msg: '101~199는 ciento …: ciento uno, ciento cincuenta' }
    ],
    accWords: ['único', 'única', 'tío', 'tía', 'tíos', 'tías', 'simpáticos', 'simpáticas', 'dieciséis', 'veintidós', 'veintitrés', 'veintiséis', 'céntimo', 'céntimos', 'dólar', 'dólares', 'cariñoso', 'cariñosa', 'pequeñas', 'pequeños', 'preciosa'].filter(w => /[áéíóúñ]/.test(w)),
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['Estos son mis hermanos.', '¿Cuántos hermanos tienes?', 'Mi padre es profesor y mi madre es enfermera.', '¿Tu tío está soltero o casado?', '¿Cuál es la moneda de tu país?', 'Tengo dieciséis años.'],
    utilSkill: 'fam',
    proverbio: { es: 'Hay un solo niño bello en el mundo y cada madre lo tiene.', e: '🤱', answer: '고슴도치도 제 새끼는 함함하다고 한다',
      options: ['피는 물보다 진하다', '고슴도치도 제 새끼는 함함하다고 한다', '가화만사성', '부전자전'],
      kr: '"세상에 아름다운 아이는 단 하나뿐인데, 모든 엄마가 그 아이를 가지고 있다" (José Martí) — 어느 엄마에게나 자기 아이가 세상에서 제일 예쁘다는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Enseña las fotos de tu familia → 글로 쓰기',
        icons: ['📷', '👨‍👩‍👧‍👦', '🗣️'],
        questions: ['¿Quién es? — Presenta a cada miembro de tu familia (nombre y relación).', '¿Qué hace? — ¿A qué se dedica cada uno?', '¿Cuántos años tiene y cómo es? — Edad, carácter y aspecto físico.'],
        minWords: 45,
        hint: '가족 어휘 · mi/mis · este/esta · tener … años · ser + 성격 · estar casado 를 활용하면 높은 점수!',
        ph: 'Esta es mi familia. En mi familia somos cuatro. Este es mi padre, se llama …',
        connectors: ['y', 'pero', 'también', 'porque', 'además', 'e'],
        rubric: [
          { k: 'fam', label: '가족 구성원 3명 이상', max: 10, min: 3, re: 'padres?|madre|herman[oa]s?|abuel[oa]s?|t[ií][oa]s?|prim[oa]s?|sobrin[oa]s?|hij[oa]s?|esposo|esposa', ax: 'Contenido' },
          { k: 'nom', label: '이름 (se llama / me llamo)', max: 8, re: 'se llaman?|me llamo', ax: 'Contenido' },
          { k: 'eda', label: '나이 (tiene … años)', max: 10, re: '(tienen?|tengo) (\\d+|\\p{L}+( \\p{L}+){0,3}) a[nñ]os', ax: 'Contenido' },
          { k: 'pro', label: '직업 (qué hace)', max: 8, re: '(es|son|soy) (profesor|profesora|maestr[oa]s?|m[eé]dic[oa]s?|enfermer[oa]s?|estudiantes?|ingenier[oa]s?|abogad[oa]s?|ama de casa|funcionari[oa]s?|emplead[oa]s?|cociner[oa]s?|polic[ií]a|secretari[oa]|dependient[ea]s?)|trabajan?|estudian?|se dedican?', ax: 'Contenido' },
          { k: 'car', label: '성격 · 외모 (cómo es)', max: 8, re: '(es|son|soy) (muy )?(simp[aá]tic[oa]s?|trabajador(a|es|as)?|generos[oa]s?|activ[oa]s?|alegres?|amables?|estrict[oa]s?|divertid[oa]s?|inteligentes?|alt[oa]s?|baj[oa]s?|delgad[oa]s?|guap[oa]s?|rubi[oa]s?|moren[oa]s?|seri[oa]s?|tranquil[oa]s?|cari[nñ]os[oa]s?|j[oó]venes|joven|mayor(es)?)', ax: 'Contenido' },
          { k: 'pos', label: '소유형용사 · 지시사 (mi, mis, este, esta …) 4번 이상', max: 8, min: 4, re: 'mi|mis|su|sus|nuestr[oa]s?|este|esta|estos|estas', ax: 'Gramática' },
          { k: 'est', label: 'estar / 가족 상태 (casado, soltero, hijo único, el mayor …)', max: 8, re: '(est[aá]n?|estoy|soy|es) (casad[oa]s?|solter[oa]s?|viud[oa]s?|divorciad[oa]s?)|hij[oa] [uú]nic[oa]|(el|la) (mayor|menor)|somos (\\p{L}+)', ax: 'Gramática' }
        ],
        model: 'Esta es mi familia. En mi familia somos cinco. Este es mi padre. Se llama Minho y tiene cuarenta y ocho años. Es ingeniero y es muy trabajador. Esta es mi madre, se llama Sora. Tiene cuarenta y cinco años y es enfermera. Es alta y muy simpática. Estos son mis hermanos. Mi hermano tiene veinte años y está soltero. Yo soy la menor y tengo dieciséis años.'
      }
    },
    build: B
  });
})();
