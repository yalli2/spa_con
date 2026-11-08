/* Lección 02 · ¿De dónde eres? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, speak, dialogHTML, clozeFromDialog, MARK } = SC;

  /* Lección 02 · ¿De dónde eres? — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Países 나라 · 어휘',
      nac: 'Nacionalidades 국적',
      ser: 'Ser 동사',
      hab: 'Hablar · Lenguas 언어',
      int: 'Interrogativos 의문사',
      num: 'Números 11~30',
      col: 'Colores 색깔',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '스페인어권 나라 지도', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '비앙카와 스페인 친구', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '세계지도 · 나라와 수도', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '사진 보고 나라 맞히기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '¿De dónde eres? · 반말/존댓말', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '나라 ↔ 국적 연결', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '낱말 찾기 (Sopa de letras)', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'd2', label: 'Diálogo 2', kr: '엔리케와 수미', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a6', label: 'Actividad 6', kr: '언어 묻고 답하기', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '질문 만들기 · 내 대답', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '유명인의 국적과 언어', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '숫자 11~30', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '¿De qué color es? ¿Cuántos hay?', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    /* Antes de empezar — 교재 원문 */
    texto1: 'El idioma español es una lengua muy importante porque en muchos países hablan español. Es el idioma nacional y oficial de Argentina, Bolivia, Chile, Colombia, Costa Rica, Cuba, Ecuador, España, El Salvador, Guatemala, Guinea Ecuatorial en África, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, Puerto Rico, Uruguay y Venezuela. En Belice y algunos lugares de los Estados Unidos mucha gente habla español.',
    texto2: 'En España, además de español o castellano, se hablan también otras lenguas como el catalán (Cataluña), el gallego (Galicia) y el euskera (País Vasco). Del mismo modo en muchos países de América Latina se hablan también lenguas nativas como el guaraní, el náhuatl, el quechua, el aimara y otras lenguas.',

    /* 스페인어권 나라 [ISO id, 이름, 수도, 한국어] */
    hisp: [
      ['032', 'Argentina', 'Buenos Aires', '아르헨티나'], ['068', 'Bolivia', 'Sucre (sede del gobierno: La Paz)', '볼리비아'], ['152', 'Chile', 'Santiago', '칠레'],
      ['170', 'Colombia', 'Bogotá', '콜롬비아'], ['188', 'Costa Rica', 'San José', '코스타리카'], ['192', 'Cuba', 'La Habana', '쿠바'],
      ['218', 'Ecuador', 'Quito', '에콰도르'], ['724', 'España', 'Madrid', '스페인'], ['222', 'El Salvador', 'San Salvador', '엘살바도르'],
      ['320', 'Guatemala', 'Ciudad de Guatemala', '과테말라'], ['226', 'Guinea Ecuatorial', 'Malabo', '적도기니'], ['340', 'Honduras', 'Tegucigalpa', '온두라스'],
      ['484', 'México', 'Ciudad de México', '멕시코'], ['558', 'Nicaragua', 'Managua', '니카라과'], ['591', 'Panamá', 'Ciudad de Panamá', '파나마'],
      ['600', 'Paraguay', 'Asunción', '파라과이'], ['604', 'Perú', 'Lima', '페루'], ['630', 'Puerto Rico', 'San Juan', '푸에르토리코'],
      ['858', 'Uruguay', 'Montevideo', '우루과이'], ['862', 'Venezuela', 'Caracas', '베네수엘라'], ['214', 'República Dominicana', 'Santo Domingo', '도미니카공화국']
    ],

    /* Actividad 1 — 교재 표 그대로 [id, 이름, 대륙키, 수도] */
    mundo: [
      ['392', 'Japón', 'as', 'Tokio'], ['156', 'China', 'as', 'Pekín'], ['410', 'Corea del Sur', 'as', 'Seúl'],
      ['276', 'Alemania', 'eu', 'Berlín'], ['724', 'España', 'eu', 'Madrid'], ['250', 'Francia', 'eu', 'París'], ['826', 'Inglaterra', 'eu', 'Londres'],
      ['380', 'Italia', 'eu', 'Roma'], ['620', 'Portugal', 'eu', 'Lisboa'], ['756', 'Suiza', 'eu', 'Berna'], ['643', 'Rusia', 'eu', 'Moscú'],
      ['840', 'Estados Unidos', 'an', 'Washington'], ['124', 'Canadá', 'an', 'Ottawa'], ['484', 'México', 'an', 'Ciudad de México'],
      ['320', 'Guatemala', 'ac', 'Ciudad de Guatemala'], ['222', 'El Salvador', 'ac', 'San Salvador'], ['340', 'Honduras', 'ac', 'Tegucigalpa'],
      ['032', 'Argentina', 'as2', 'Buenos Aires'], ['076', 'Brasil', 'as2', 'Brasilia'], ['068', 'Bolivia', 'as2', 'Sucre'], ['152', 'Chile', 'as2', 'Santiago'],
      ['170', 'Colombia', 'as2', 'Bogotá'], ['604', 'Perú', 'as2', 'Lima'], ['862', 'Venezuela', 'as2', 'Caracas']
    ],
    continentes: [{ k: 'as', label: 'Asia' }, { k: 'eu', label: 'Europa' }, { k: 'an', label: 'América del Norte' }, { k: 'ac', label: 'América Central' }, { k: 'as2', label: 'América del Sur' }],

    dialogo1: [
      { who: 'Chico', es: '¡Hola! Eres nueva en esta clase, ¿verdad?' },
      { who: 'Bianca', es: 'Sí, me llamo Bianca. Soy estudiante de intercambio.' },
      { who: 'Chico', es: '¿De [dónde] eres?' },
      { who: 'Bianca', es: 'Soy [italiana].' },
      { who: 'Chico', es: 'Entonces, ¿eres de Roma?' },
      { who: 'Bianca', es: 'No, soy de Milán. ¿Y tú? ¿De dónde eres?' },
      { who: 'Chico', es: 'Yo soy [español].' },
      { who: 'Bianca', es: '¿De qué [parte] de España eres?' },
      { who: 'Chico', es: 'Soy de Madrid, la [capital].' },
      { who: 'Chico', es: '[Encantado].' },
      { who: 'Bianca', es: '[Encantada].' }
    ],

    dialogo2: [
      { who: 'Enrique', es: '¡Hola, Sumi! Oye, tú, ¿[cuántas] lenguas [hablas]?' },
      { who: 'Sumi', es: '[Hablo] cuatro idiomas: coreano, chino, inglés y un poco de español. ¿Y tú?' },
      { who: 'Enrique', es: '¡Cuatro lenguas! ¡Qué envidia! Yo solo hablo español [e] inglés.' },
      { who: 'Sumi', es: '¿Qué lengua [se habla] en México?' },
      { who: 'Enrique', es: 'Se habla español.' },
      { who: 'Sumi', es: '¿Cómo [se dice] "Thank you so much" en español?' },
      { who: 'Enrique', es: 'Se dice "[Muchas gracias]".' }
    ],

    /* Actividad 8 — SOLUCIONES 기준 */
    famosos: [
      { n: 'Ann Hathaway', e: '🎬', av: '👩🏻', job: 'actriz', p: 'Estados Unidos', nac: 'estadounidense', l: 'inglés' },
      { n: 'Yuna Kim', e: '⛸️', av: '👩🏻', job: 'patinadora', p: 'Corea', nac: 'coreana', l: 'coreano', alt: 'Corea del Sur' },
      { n: 'Angela Merkel', e: '🏛️', av: '👩🏼', job: 'política', p: 'Alemania', nac: 'alemana', l: 'alemán' },
      { n: 'Frida Kahlo', e: '🎨', av: '👩🏽', job: 'pintora', p: 'México', nac: 'mexicana', l: 'español' },
      { n: 'Kate Middleton', e: '👑', av: '👩🏼', job: 'princesa', p: 'Inglaterra', nac: 'inglesa', l: 'inglés' },
      { n: 'Fidel Castro', e: '🚬', av: '🧔🏻', job: 'político', p: 'Cuba', nac: 'cubano', l: 'español' }
    ],

    /* Actividad 9 — TRANSCRIPCIONES */
    a9: [
      { q: '¿Cuántos libros hay?', a: 'Hay doce.', n: 12, ans: ['Hay doce.', 'Doce.', 'Hay doce libros.'] },
      { q: '¿Qué número de asiento tienes?', a: 'El quince.', n: 15, ans: ['El quince.', 'Quince.', 'Es el quince.', 'Tengo el quince.', 'Tengo el número quince.'] },
      { q: '¿Cuántos años tienes?', a: 'Dieciocho años.', n: 18, ans: ['Dieciocho años.', 'Tengo dieciocho años.', 'Dieciocho.'] },
      { q: '¿Qué día es hoy?', a: 'El veintidós de mayo.', n: 22, ans: ['El veintidós de mayo.', 'Hoy es el veintidós de mayo.', 'Es el veintidós de mayo.', 'Hoy es veintidós de mayo.'] },
      { q: '¿Qué edad tienes?', a: 'Veintitrés.', n: 23, ans: ['Veintitrés.', 'Veintitrés años.', 'Tengo veintitrés años.'] },
      { q: '¿En qué página estamos?', a: 'La página veintiséis.', n: 26, ans: ['La página veintiséis.', 'En la página veintiséis.', 'Estamos en la página veintiséis.'] }
    ],
    numeros: { 11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince', 16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve', 20: 'veinte',
      21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 24: 'veinticuatro', 25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete', 28: 'veintiocho', 29: 'veintinueve', 30: 'treinta' },

    /* Actividad 10 — SOLUCIONES 기준 */
    a10: [
      { e: '🍌', obj: 'los plátanos', n: 12, col: 'amarillos', w: 'doce', per: 6 },
      { e: '🐈‍⬛', obj: 'los gatos', n: 21, col: 'negros', w: 'veintiuno', w2: 'veintiún', per: 7 },
      { e: '🪑', obj: 'las sillas', n: 15, col: 'azules', w: 'quince', per: 5, bg: '#3f6fd8' },
      { e: '🐩', obj: 'los perros', n: 23, col: 'blancos', w: 'veintitrés', per: 6, bg: '#f4f4f4' },
      { e: '📗', obj: 'los libros', n: 16, col: 'verdes', w: 'dieciséis', per: 8 },
      { e: '🏀', obj: 'los balones', n: 27, col: 'naranja', w: 'veintisiete', per: 9 }
    ],

    colores: [
      { es: 'rojo', kr: '빨간색', c: '#d62f2f' }, { es: 'amarillo', kr: '노란색', c: '#f5c400' }, { es: 'azul', kr: '파란색', c: '#2a6fd0' },
      { es: 'verde', kr: '초록색', c: '#2e9d5b' }, { es: 'blanco', kr: '흰색', c: '#ffffff' }, { es: 'negro', kr: '검은색', c: '#222' },
      { es: 'naranja', kr: '주황색', c: '#f28a21' }, { es: 'rosa', kr: '분홍색', c: '#f49ac1' }, { es: 'gris', kr: '회색', c: '#9a9a9a' },
      { es: 'marrón', kr: '갈색', c: '#7b4a26' }, { es: 'morado', kr: '보라색', c: '#7d4bb5' }
    ],

    utiles: [
      ['¿De dónde eres?', '어디 출신이야?'], ['Soy de Corea.', '나는 한국 출신이야.'],
      ['¿De dónde es María?', '마리아는 어디 출신이야?'], ['Es de España. Es española.', '스페인 출신이야. 스페인 사람이야.'],
      ['¿Cuántos perros hay?', '개가 몇 마리 있어?'], ['Hay veintiún perros blancos.', '흰 개가 스물한 마리 있어.'],
      ['¿De qué color es la rosa?', '장미는 무슨 색이야?'], ['Es roja.', '빨간색이야.'],
      ['¿Qué lenguas hablas?', '어떤 언어들을 해?'], ['Hablo coreano, inglés y español.', '한국어, 영어, 스페인어를 해.'],
      ['¿Qué lengua se habla en México?', '멕시코에서는 어떤 언어를 써?'], ['Se habla español.', '스페인어를 써.'],
      ['¿Cómo se dice "Thank you" en español?', '"Thank you"를 스페인어로 뭐라고 해?'], ['Se dice "Gracias".', '"Gracias"라고 해.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '¿De dónde ____ tú? <i>(ser)</i>', a: ['eres'], s: 'ser' },
      { p: 'Yo ____ de Corea. <i>(ser)</i>', a: ['soy'], s: 'ser' },
      { p: '¿De dónde ____ usted? <i>(ser)</i>', a: ['es'], s: 'ser' },
      { p: 'Bianca y Marco ____ italianos. <i>(ser)</i>', a: ['son'], s: 'ser' },
      { p: 'Sumi ____ cuatro idiomas. <i>(hablar)</i>', a: ['habla'], s: 'hab' },
      { p: 'Nosotros ____ español en clase. <i>(hablar)</i>', a: ['hablamos'], s: 'hab' },
      { p: '¿Qué lengua se ____ en Brasil? <i>(hablar)</i>', a: ['habla'], s: 'hab' },
      { p: 'Yo hablo español ____ inglés. <i>(그리고)</i>', a: ['e'], s: 'hab' },
      { p: '¿____ lenguas hablas? <i>(몇 개)</i>', a: ['Cuántas'], s: 'int' },
      { p: '¿____ es tu apellido?', a: ['Cuál'], s: 'int' },
      { p: '¿De ____ color es la rosa?', a: ['qué'], s: 'int' },
      { p: '¿De ____ eres? <i>(어디)</i>', a: ['dónde'], s: 'int' },
      { p: 'Frida Kahlo es ____. <i>(México)</i>', a: ['mexicana'], s: 'nac' },
      { p: 'Mi amigo John es ____. <i>(Inglaterra)</i>', a: ['inglés'], s: 'nac' },
      { p: 'Ana y Lucía son ____. <i>(España)</i>', a: ['españolas'], s: 'nac' },
      { p: 'Los plátanos son ____. <i>(노란색)</i>', a: ['amarillos'], s: 'col' },
      { p: 'Las sillas son ____. <i>(파란색)</i>', a: ['azules'], s: 'col' },
      { p: 'Hay ____ perros blancos. <i>(21)</i>', a: ['veintiún'], s: 'num' },
      { p: 'Dieciséis más siete son ____. <i>(16 + 7)</i>', a: ['veintitrés'], s: 'num' },
      { p: '¿Cómo se ____ "Thank you" en español?', a: ['dice'], s: 'hab' }
    ]
  };

  /* ---------- 지도 (Natural Earth 기반 SVG, map.js) ---------- */
  const MAP = window.L02MAP || { world: [], am: [], es: [], gq: [] };
  const HISP_IDS = D.hisp.map(h => h[0]);
  const ALSO_IDS = ['084', '840'];                         // 스페인어를 많이 쓰는 곳 (Belice, Estados Unidos)
  const SMALL = ['222', '188', '591', '630', '214', '320', '340', '558', '858', '192', '226', '756', '620', '410', '826'];
  const paths = (arr, hi, cls) => arr.map(([id, d]) => `<path class="cty ${hi(id)}" data-id="${id}" d="${d}"/>`).join('') +
    arr.filter(([id]) => SMALL.includes(id) && hi(id).includes('hi')).map(([id, , x, y]) => `<circle class="dot ${cls || ''}" data-id="${id}" cx="${x}" cy="${y}" r="${cls === 'w' ? 3.6 : 5}"/>`).join('');
  function hispSVG() {
    const hi = id => HISP_IDS.includes(id) ? 'hi' : ALSO_IDS.includes(id) ? 'also' : '';
    return `<svg class="lmap hisp" viewBox="0 0 690 620" role="img" aria-label="스페인어권 지도">
      <svg x="0" y="0" width="480" height="620" viewBox="0 0 480 620"><rect class="msea" width="480" height="620"/>${paths(MAP.am, hi)}
        <text class="sea-t" x="40" y="380">Océano Pacífico</text><text class="sea-t" x="345" y="150">Océano Atlántico</text></svg>
      <svg x="492" y="34" width="190" height="140" viewBox="0 0 190 140"><rect class="msea" width="190" height="140"/>${paths(MAP.es, hi)}</svg>
      <rect class="inset" x="492" y="34" width="190" height="140"/><text class="ins-t" x="492" y="26">Europa</text>
      <svg x="492" y="214" width="190" height="140" viewBox="0 0 190 140"><rect class="msea" width="190" height="140"/>${paths(MAP.gq, hi)}</svg>
      <rect class="inset" x="492" y="214" width="190" height="140"/><text class="ins-t" x="492" y="206">África</text>
      <g class="legend-map" transform="translate(492,390)"><rect class="lg-hi" width="16" height="12"/><text x="22" y="11">스페인어 공용어</text>
        <rect class="lg-also" y="22" width="16" height="12"/><text x="22" y="33">스페인어 사용자 많음</text></g>
    </svg>`;
  }
  function worldSVG() {
    const ids = D.mundo.map(m => m[0]);
    const hi = id => ids.includes(id) ? 'hi' : '';
    return `<svg class="lmap world" viewBox="0 0 800 420" role="img" aria-label="세계지도"><rect class="msea" width="800" height="420" rx="14"/>${paths(MAP.world, hi, 'w')}</svg>`;
  }
  /* 지도 찾기 퀴즈 + 탐험 모드 — 클릭 → ○✕ 채점 */
  function mapGame(o) {
    /* o: { root, svg, prefix, sec, skill, targets:[{id, es, info}], explore:(id)=>html|null } */
    const st = sel(o.prefix, { i: 0, mode: 'quiz' });
    o.targets.forEach((t, i) => reg(o.prefix + '-' + i, o.sec, o.skill));
    const w = el(`<div class="mapgame"><div class="mode"><button data-m="quiz">🎯 찾기 퀴즈</button><button data-m="exp">🔍 지도 탐험</button></div>
      <div class="mq-bar"></div><div class="map-wrap">${o.svg}</div><div class="mq-res"></div></div>`);
    const svg = $('svg', w), bar = $('.mq-bar', w);
    const items = SC.items();
    const shapes = id => $$(`[data-id="${id}"]`, svg);
    const paintDone = () => {
      $$('.cty, .dot', svg).forEach(p => p.classList.remove('ok', 'no', 'cur', 'blink'));
      o.targets.forEach((t, i) => { const it = items[o.prefix + '-' + i]; if (it && st.mode === 'quiz') shapes(t.id).forEach(p => p.classList.add(it.last >= 1 ? 'ok' : 'no')); });
    };
    const done = () => o.targets.filter((t, i) => items[o.prefix + '-' + i] && items[o.prefix + '-' + i].last >= 1).length;
    const drawBar = () => {
      $$('.mode button', w).forEach(b => b.classList.toggle('on', b.dataset.m === st.mode));
      w.classList.toggle('exp', st.mode === 'exp');
      if (st.mode === 'exp') { bar.innerHTML = '<span class="small">나라를 누르면 이름과 수도가 나와요. 🔊로 발음도 들어 보세요.</span>'; return; }
      if (st.i >= o.targets.length) {
        bar.innerHTML = `<span class="mq-t">🏁 끝! <b>${done()} / ${o.targets.length}</b> ${MARK(done() / o.targets.length)}</span> <button class="btn ghost sm again">🔁 다시 하기</button>`;
        $('.again', bar).onclick = () => { st.i = 0; save(); drawBar(); paintDone(); };
        return;
      }
      const t = o.targets[st.i];
      bar.innerHTML = `<span class="mq-n">${st.i + 1} / ${o.targets.length}</span> <span class="mq-t">¿Dónde está <b>${esc(t.es)}</b>? ${say(t.es)}</span> <button class="btn ghost sm skip">건너뛰기</button>`;
      $('.skip', bar).onclick = () => answer(null);
    };
    function answer(id) {
      const i = st.i, t = o.targets[i], good = id === t.id;
      record(o.prefix + '-' + i, good ? 1 : 0, good ? [] : ['otro'], {});
      shapes(t.id).forEach(p => p.classList.add(good ? 'ok' : 'blink'));
      if (!good && id) shapes(id).forEach(p => p.classList.add('no'));
      $('.mq-res', w).innerHTML = good ? `<span class="good">${MARK(1)} ¡Muy bien! ${esc(t.es)}</span>` : `${MARK(0)} <span class="ans">${esc(t.es)}</span>는 깜빡이는 곳이에요.`;
      st.i++; save();
      setTimeout(() => { drawBar(); paintDone(); }, good ? 500 : 1300);
    }
    svg.addEventListener('click', e => {
      const p = e.target.closest('[data-id]'); if (!p) return;
      const id = p.dataset.id;
      if (st.mode === 'exp') {
        const html = o.explore(id);
        $$('.cur', svg).forEach(x => x.classList.remove('cur'));
        if (html) { shapes(id).forEach(x => x.classList.add('cur')); $('.mq-res', w).innerHTML = html; } else $('.mq-res', w).innerHTML = '<span class="small">이 과의 학습 대상 나라가 아니에요.</span>';
        return;
      }
      if (st.i >= o.targets.length) return;
      answer(id);
    });
    $$('.mode button', w).forEach(b => b.onclick = () => { st.mode = b.dataset.m; save(); $('.mq-res', w).innerHTML = ''; drawBar(); paintDone(); });
    drawBar(); paintDone();
    return w;
  }

  const B = {};
  const blurBtn = (s, btn, box, a, b) => { $(btn, s).onclick = e => { const t = $(box, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? a : b; }; };

  B.vocab = () => {
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <div class="read-box"><span class="rb-e">👩‍🏫🗺️</span><p class="lead">${esc(D.texto1)} ${say(D.texto1)}</p></div>
      <h3 class="h3">① 스페인어권 지도 — 🔍 탐험 모드로 나라와 수도를 익히고, 🎯 찾기 퀴즈를 풀어 보세요</h3>
      ${tip('교재 목록에는 없지만 <b>República Dominicana</b>(도미니카공화국)도 스페인어가 공용어인 나라예요. 지도에 함께 표시했어요. 연한 노란색은 공용어는 아니지만 스페인어를 쓰는 사람이 많은 곳(Belice, Estados Unidos)이에요.')}
      <div class="mapq"></div>
      <h3 class="h3">② 쓰기 연습 — 우리말 나라 이름을 스페인어로 쓰세요 (악센트까지!)</h3><div class="items two w"></div>
      <div class="read-box r2"><span class="rb-e">👨‍🏫🗣️</span><p class="lead">${esc(D.texto2)} ${say(D.texto2)}</p></div>
      <h3 class="h3">③ 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">④ 어디에서 쓰는 언어일까요? — 표현을 누르고 알맞은 칸을 누르세요</h3><div class="sb"></div>`);
    const QZ = ['484', '032', '724', '604', '152', '226'];
    put(s, '.mapq', mapGame({ prefix: 'vm', sec: 'vocab', skill: 'voc', svg: hispSVG(),
      targets: QZ.map(id => { const h = D.hisp.find(x => x[0] === id); return { id, es: h[1] }; }),
      explore: id => {
        const h = D.hisp.find(x => x[0] === id);
        if (h) { const t = `${h[1]}. La capital es ${h[2].replace(/ \(.*\)/, '')}.`; return `<div class="cinfo"><b>${h[1]}</b> <small>${h[3]}</small> ${say(t)}<br>La capital: <b>${h[2]}</b></div>`; }
        if (id === '084') return `<div class="cinfo"><b>Belice</b> <small>벨리즈</small> ${say('Belice')}<br>공용어는 영어지만 스페인어를 쓰는 사람이 많아요.</div>`;
        if (id === '840') return `<div class="cinfo"><b>Estados Unidos</b> <small>미국</small> ${say('Estados Unidos')}<br>스페인어를 쓰는 사람이 4천만 명이 넘어요.</div>`;
        if (id === '076') return `<div class="cinfo"><b>Brasil</b> <small>브라질</small> ${say('Brasil')}<br>남미에서 가장 큰 나라지만 <b>portugués</b>(포르투갈어)를 써요!</div>`;
        return null;
      } }));
    [['멕시코', 'México'], ['스페인', 'España'], ['페루', 'Perú'], ['파나마', 'Panamá'], ['적도기니', 'Guinea Ecuatorial']].forEach(([k, a], i) =>
      put(s, '.w', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `🗺️ ${k}`, answers: [a] })));
    [['En Brasil se habla español.', 'Falso'], ['El español es el idioma oficial de Guinea Ecuatorial.', 'Verdadero'],
      ['En Cataluña se habla también catalán.', 'Verdadero'], ['El guaraní es una lengua de España.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'voc-vf' + i, sec: 'vocab', skill: 'hab', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.sb', sortBoard({ id: 'voc-sb', sec: 'vocab', skill: 'hab', cols: [{ k: 'E', label: '🇪🇸 España' }, { k: 'A', label: '🌎 América Latina' }],
      chips: [['el catalán', 'E'], ['el gallego', 'E'], ['el euskera', 'E'], ['el guaraní', 'A'], ['el náhuatl', 'A'], ['el quechua', 'A']] }));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. ser — "~이다", 출신 · 국적 말하기</h3>
        <div class="blocks"><span class="bk p">(Yo)</span><span class="bk v">soy</span><span class="bk o">de</span><span class="bk s">Corea</span><span class="small">출신 = ser de + 나라</span></div>
        <div class="blocks"><span class="bk p">(Yo)</span><span class="bk v">soy</span><span class="bk s">coreano / coreana</span><span class="small">국적 = ser + 국적 형용사</span></div>
        ${tip('ser 는 불규칙 동사! 주어(yo, tú…)는 동사 형태로 알 수 있어서 자주 생략해요.<br>국적은 <b>소문자</b>로 써요: Soy <b>c</b>oreana. (나라 이름은 대문자: Corea)')}
        <div class="g1a"></div><div class="g1b"></div></div>
      <div class="gcard"><h3>2. hablar — -ar 규칙 동사</h3>
        <div class="blocks"><span class="bk v">habl-</span><span class="bk o">-o · -as · -a · -amos · -áis · -an</span></div>
        ${tip('<b>se habla</b> + 언어: "~어를 쓴다(사용된다)" — ¿Qué lengua <b>se habla</b> en México? <b>Se habla</b> español. (= <b>Hablan</b> español.)<br><b>y → e</b> : i-/hi- 로 시작하는 단어 앞에서는 y 대신 e — español <b>e</b> inglés')}
        <div class="g2a"></div><div class="g2b"></div></div>
      <div class="gcard"><h3>3. 인칭대명사 yo · tú · usted</h3>
        <table class="acu"><tr><th></th><th class="agr">tú (반말) 🧑‍🤝‍🧑</th><th class="dis">usted (존댓말) 🙇</th></tr>
          <tr><td>누구에게?</td><td class="agr">친구, 가족, 또래</td><td class="dis">선생님, 어른, 처음 만난 사람</td></tr>
          <tr><td>ser</td><td class="agr">¿De dónde <b>eres</b>? ${say('¿De dónde eres?')}</td><td class="dis">¿De dónde <b>es</b> usted? ${say('¿De dónde es usted?')}</td></tr>
          <tr><td>hablar</td><td class="agr">¿Qué lenguas <b>hablas</b>?</td><td class="dis">¿Qué lenguas <b>habla</b> usted?</td></tr></table>
        ${tip('usted 는 "당신"이지만 동사는 <b>3인칭(él/ella와 같은 형태)</b>을 써요. 줄여서 <b>Ud.</b> 라고도 써요. 주어 tú 에는 악센트!(tu = 너의)')}
        <div class="items g3"></div></div>
      <div class="gcard"><h3>4. 의문사 (Interrogativos)</h3>
        <div class="cgrid">
          <div class="ccard"><span class="emo">❓</span><b>¿Qué …?</b><small>무엇 / 어떤</small><br><i>¿Qué lenguas hablas?</i></div>
          <div class="ccard"><span class="emo">☝️</span><b>¿Cuál …?</b><small>어느 것 / 무엇 (+ es)</small><br><i>¿Cuál es tu apellido?</i></div>
          <div class="ccard"><span class="emo">🔢</span><b>¿Cuánto/a/os/as …?</b><small>얼마나 / 몇</small><br><i>¿Cuántos perros hay?</i></div>
          <div class="ccard"><span class="emo">📍</span><b>¿Dónde …?</b><small>어디</small><br><i>¿De dónde eres?</i></div></div>
        ${tip('의문사에는 항상 <b>악센트</b>와 <b>¿ ?</b> — ¿qué? ¿cuál? ¿cuánto? ¿dónde?<br><b>cuánto</b>는 뒤 명사의 성·수에 맞춰요: ¿cuánt<b>as</b> lenguas? (la lengua) / ¿cuánt<b>os</b> idiomas? (el idioma)')}
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 국적 형용사의 성 · 수</h3>
        <table class="dt"><tr><th>유형</th><th>남성 단수</th><th>여성 단수</th><th>남성 복수</th><th>여성 복수</th></tr>
          <tr><td>-o → -a</td><td>mexican<b>o</b></td><td>mexican<b>a</b></td><td>mexican<b>os</b></td><td>mexican<b>as</b></td></tr>
          <tr><td>자음 + a</td><td>español</td><td>español<b>a</b></td><td>español<b>es</b></td><td>español<b>as</b></td></tr>
          <tr><td>-és / -án (악센트 사라짐!)</td><td>ingl<b>é</b>s · alem<b>á</b>n</td><td>ingl<b>e</b>sa · alem<b>a</b>na</td><td>ingleses · alemanes</td><td>inglesas · alemanas</td></tr>
          <tr><td>-ense (남녀 같음)</td><td colspan="2">estadounidense · canadiense</td><td colspan="2">estadounidenses · canadienses</td></tr></table>
        <div class="g5"></div></div>
      <div class="gcard"><h3>6. 색깔 형용사 (Adjetivos de color)</h3>
        <div class="swatches">${D.colores.map(c => `<span class="sw"><i style="background:${c.c}"></i><b>${c.es}</b><small>${c.kr}</small>${say(c.es)}</span>`).join('')}</div>
        ${tip('색깔도 명사에 성·수를 맞춰요: la rosa roj<b>a</b> / los plátanos amarill<b>os</b> / las sillas azul<b>es</b>.<br><b>naranja, rosa</b>는 형태가 그대로: Son <b>de color naranja</b>.')}
        <div class="g6"></div></div>
      <div class="gcard"><h3>7. 숫자 11~30 쓰기 규칙</h3>
        ${tip('16~19 = <b>dieci</b> + 숫자 (dieciséis) · 21~29 = <b>veinti</b> + 숫자 (veintiuno)<br>악센트 주의: diecis<b>é</b>is, veintid<b>ó</b>s, veintitr<b>é</b>s, veintis<b>é</b>is<br>남성 명사 앞 21 → <b>veintiún</b>: Hay veintiún perros.')}
        <div class="g7"></div></div>`);
    put(s, '.g1a', cloze({ id: 'g1a', sec: 'gram', skill: 'ser', title: 'ser 활용표를 완성하세요.', cls: 'table2', text:
      [['yo', 'soy'], ['tú', 'eres'], ['él / ella / usted', 'es'], ['nosotros/as', 'somos'], ['vosotros/as', 'sois'], ['ellos / ellas / ustedes', 'son']].map(([a, b]) => `<p><span>${a}</span>[${b}]</p>`).join('') }));
    put(s, '.g1b', cloze({ id: 'g1b', sec: 'gram', skill: 'ser', title: 'ser 를 알맞게 쓰세요.', cls: 'lines', text:
      ['¿De dónde [eres] tú?', '¿De dónde [es] usted?', 'Ellos [son] de México.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'hab', title: 'hablar 활용표를 완성하세요.', cls: 'table2', text:
      [['yo', 'hablo'], ['tú', 'hablas'], ['él / ella / usted', 'habla'], ['nosotros/as', 'hablamos'], ['vosotros/as', 'habláis'], ['ellos / ellas / ustedes', 'hablan']].map(([a, b]) => `<p><span>${a}</span>[${b}]</p>`).join('') }));
    put(s, '.g2b', cloze({ id: 'g2b', sec: 'gram', skill: 'hab', title: 'hablar 를 알맞게 쓰세요.', cls: 'lines', text:
      ['Yo [hablo] coreano [e] inglés.', 'En México [hablan] español.'].map(x => `<p>${x}</p>`).join('') }));
    [['👨‍🏫 선생님께: ¿De dónde ___?', 'es usted'], ['🧒 동생에게: ¿Qué lenguas ___?', 'hablas']]
      .forEach(([p, a], i) => put(s, '.g3', choiceItem({ id: 'g3-' + i, sec: 'gram', skill: 'ser', prompt: p, options: i < 1 ? ['eres', 'es usted'] : ['hablas', 'habla usted'], answer: a })));
    [['¿Y tú? ¿Qué lenguas hablas?', ['¿Y usted? ¿Qué lenguas habla?', '¿Y usted? ¿Qué lenguas habla usted?']]]
      .forEach(([p, a], i) => put(s, '.g3', writeItem({ id: 'g3w-' + i, sec: 'gram', skill: 'ser', prompt: `tú → <b>usted</b> : ${p}`, answers: a })));
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'int', title: '알맞은 의문사를 쓰세요. (qué · cuál · cuántos/as · dónde)', cls: 'lines', text:
      ['¿[Cuál] es tu apellido?', '¿[Cuántas] lenguas hablas?', '¿[Cuántos] idiomas hablas?', '¿De [dónde] eres?', '¿De [qué] color es la rosa?'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g5', cloze({ id: 'g5', sec: 'gram', skill: 'nac', title: '괄호 속 국적을 주어에 맞게 바꿔 쓰세요.', cls: 'lines', text:
      ['Ana y Eva son [españolas]. <i>(español)</i>', 'Mi madre es [japonesa]. <i>(japonés)</i>', 'Mis amigos son [ingleses]. <i>(inglés)</i>'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g6', cloze({ id: 'g6', sec: 'gram', skill: 'col', title: '괄호 속 색깔을 명사에 맞게 쓰세요.', cls: 'lines', text:
      ['La rosa es [roja]. <i>(rojo)</i> 🌹', 'Las sillas son [azules]. <i>(azul)</i> 🪑', 'La casa es [blanca]. <i>(blanco)</i> 🏠'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g7', cloze({ id: 'g7', sec: 'gram', skill: 'num', title: '숫자를 스페인어로 쓰세요.', cls: 'lines', text:
      ['16 → [dieciséis]', '22 → [veintidós]', '21 perros → Hay [veintiún] perros.'].map(x => `<p>${x}</p>`).join('') }));
  };

  const ISP = /soy (de )?[a-záéíóúñ]+/.source;
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Dos amigos se conocen en la clase y hablan de su nacionalidad.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">Soy de Italia.</span><span class="hlc c1">Soy de España.</span><span class="hlc c2">¿De qué ciudad eres?</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blurBtn(s, '#hide1', '#d1txt', '본문 보기', '본문 가리기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'ser', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['Soy italiana. → <span class="chip">Soy de Italia.</span> 처럼 나라 이름으로', ['Soy de Italia.', 'Yo soy de Italia.']],
      ['Yo soy español. → 나라 이름으로', ['Soy de España.', 'Yo soy de España.']],
      ['¿De qué parte de España eres? → <span class="chip">ciudad</span> 로', ['¿De qué ciudad eres?', '¿De qué ciudad de España eres?']],
      ['Soy de Corea. → 국적 형용사로 (나는 한국 사람이야)', ['Soy coreano.', 'Soy coreana.', 'Yo soy coreano.', 'Yo soy coreana.']]].forEach(([p, a], i) =>
      put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: i === 3 ? 'nac' : 'ser', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '새 친구와 처음 만나 출신을 묻고 답하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¡Hola! Eres nuevo en esta clase, ¿verdad?\nB: Sí, me llamo …',
      must: [{ re: '¿\\s*de d[oó]nde eres', label: '¿De dónde eres?' }, { re: W0 + 'soy de' + W1, label: 'Soy de + 나라/도시' },
        { re: W0 + 'soy (?!de' + W1 + ')[a-záéíóúñ]+(an[oa]|[eé]s|esa|[aá]n|ana|ol|ola|ense|[ei]ñ[oa]|[oa])' + W1, label: 'Soy + 국적 (coreano/a …)' },
        { re: '¿\\s*de qu[eé] (parte|ciudad)', label: '¿De qué parte / ciudad …?' }, { re: W0 + 'encantad[oa]' + W1, label: 'Encantado/a' }],
      model: 'A: ¡Hola! Eres nueva en esta clase, ¿verdad? B: Sí, me llamo Sofía. A: ¿De dónde eres? B: Soy mexicana. A: ¿De qué parte de México eres? B: Soy de Monterrey. ¿Y tú? A: Soy coreano, de Busan. Encantado. B: Encantada.' }));
  };

  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'a) Escucha, repite los nombres y ubícalos en el mapa.', { listen: true, kr: '🔊로 이름을 듣고 따라 말한 뒤, 🎯 퀴즈에서 지도 위 나라를 눌러 찾으세요. (Inglaterra = 영국 전체로 표시)' })}
      <div class="mapq"></div>
      <table class="cont"><tr>${D.continentes.map(c => `<th>${c.label}</th>`).join('')}</tr>
        <tr>${D.continentes.map(c => `<td>${D.mundo.filter(m => m[2] === c.k).map(m => `<span>${m[1]} ${say(m[1])}</span>`).join('')}</td>`).join('')}</tr></table>
      <h3 class="h3">✍️ 대륙별로 분류하기 — 표를 가리고 해 보세요</h3><div class="sb"></div>
      <h2 class="act-title">b) ¿Cuál es la capital de cada país?</h2>
      ${modelo('La capital de Corea es Seúl.')}
      <div class="ybox wordbank">수도 상자: ${shuffle(['Tokio', 'París', 'Londres', 'Berlín', 'Ciudad de México', 'Lima', 'Roma', 'Moscú']).map(c => `<span>${c}</span>`).join('')}</div>
      <div class="items two cap"></div>`);
    put(s, '.mapq', mapGame({ prefix: 'a1m', sec: 'a1', skill: 'voc', svg: worldSVG(),
      targets: ['392', '410', '276', '250', '826', '643', '840', '124', '076', '604'].map(id => ({ id, es: D.mundo.find(m => m[0] === id)[1] })),
      explore: id => { const m = D.mundo.find(x => x[0] === id); return m ? `<div class="cinfo"><b>${m[1]}</b> ${say(m[1])} · ${D.continentes.find(c => c.k === m[2]).label}<br>La capital: <b>${m[3]}</b></div>` : null; } }));
    put(s, '.sb', sortBoard({ id: 'a1-sb', sec: 'a1', skill: 'voc', cols: D.continentes,
      chips: [['Corea del Sur', 'as'], ['Suiza', 'eu'], ['Canadá', 'an'], ['Honduras', 'ac'], ['Guatemala', 'ac'], ['Bolivia', 'as2']] }));
    [['Japón', 'Tokio'], ['Francia', 'París'], ['Inglaterra', 'Londres'], ['Alemania', 'Berlín'], ['México', 'Ciudad de México'], ['Perú', 'Lima']]
      .forEach(([p, c], i) => put(s, '.cap', writeItem({ id: 'a1-c' + i, sec: 'a1', skill: 'voc', prompt: `${i + 1}) <b>${p}</b>`, ph: `La capital de ${p} es …`,
        answers: [`La capital de ${p} es ${c}.`, `${c} es la capital de ${p}.`] })));
  };

  B.a2 = () => {
    const s = sec('a2', `${actHead(2, '¿Qué países te sugieren estas fotos?', { kr: '교재 사진 대신 그림 카드로 — 나라 이름을 누른 뒤 카드를 누르세요.' })}<div class="mp"></div>
      <h3 class="h3">✍️ 문장으로 쓰기 — ser de + 나라</h3>${modelo('¿De dónde es el tango? → El tango es de Argentina.')}<div class="items two w2"></div>`);
    put(s, '.mp', matchPics({ id: 'a2m', sec: 'a2', skill: 'voc', cols: 4, items: [
      { e: '✝️⛰️', es: 'Brasil', cap: 'el Cristo Redentor' }, { e: '🤠🎺', es: 'México', cap: 'los mariachis' },
      { e: '🗽', es: 'Estados Unidos', cap: 'la Estatua de la Libertad' }, { e: '🗼', es: 'Francia', cap: 'la Torre Eiffel' },
      { e: '🏰', es: 'Italia', cap: 'la Torre de Pisa' }, { e: '🐂', es: 'España', cap: 'el toro y el torero' },
      { e: '💃🕺', es: 'Argentina', cap: 'el tango' }, { e: '🏔️🧀', es: 'Suiza', cap: 'los Alpes' }] }));
    [['💃 ¿De dónde es el tango?', ['El tango es de Argentina.', 'Es de Argentina.']], ['🤠 ¿De dónde son los mariachis?', ['Los mariachis son de México.', 'Son de México.']],
      ['🏰 ¿De qué país es la Torre de Pisa?', ['La Torre de Pisa es de Italia.', 'Es de Italia.']]]
      .forEach(([p, a], i) => put(s, '.w2', writeItem({ id: 'a2-' + i, sec: 'a2', skill: 'ser', prompt: p, answers: a })));
  };

  B.a3 = () => {
    const card = (av, n, p, c) => `<div class="pcard"><span class="av">${av}</span><b>${n}</b><small>${p} · ${c}</small></div>`;
    const s = sec('a3', `${actHead(3, 'Habla con tus compañeros siguiendo el diálogo.', { kr: '인물 카드의 정보로 대화를 완성하세요.' })}
      <div class="grid2"><div>${modelo(`<div class="pc2">${card('🧑🏻', 'A: Minho', 'Corea', 'Busan')}${card('👩🏼', 'B: Lucía', 'España', 'Sevilla')}</div>`, 'a) informal')}<div class="c3a"></div></div>
        <div>${modelo(`<div class="pc2">${card('👩🏻‍💼', 'A: Sra. Kim', 'Corea', 'Seúl')}${card('👨🏽‍💼', 'B: Sr. García', 'México', 'Guadalajara')}</div>`, 'b) formal')}<div class="c3b"></div></div></div>
      ${tip('informal(tú) ↔ formal(usted): <b>eres → es</b>, <b>¿Y tú? → ¿Y usted?</b>')}
      <h3 class="h3">✍️ 존댓말(usted)로 바꿔 쓰세요</h3><div class="items w3"></div>
      <h3 class="h3">✍️ 나의 정보로 대화 쓰기 (informal)</h3><div class="f3"></div>`);
    put(s, '.c3a', cloze({ id: 'a3a', sec: 'a3', skill: 'ser', cls: 'lines', text: ['A: ¿De dónde eres?', 'B: Soy de [España].', 'A: ¿De qué parte de [España] eres?', 'B: Soy de [Sevilla]. ¿Y tú? ¿De dónde eres?', 'A: Soy de [Corea], de [Busan].'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.c3b', cloze({ id: 'a3b', sec: 'a3', skill: 'ser', cls: 'lines', text: ['A: ¿De dónde [es] usted?', 'B: Soy de [México].', 'A: ¿De qué parte de México es?', 'B: Soy de [Guadalajara]. ¿Y [usted]? ¿De dónde es?', 'A: Soy de Corea, de [Seúl].'].map(x => `<p>${x}</p>`).join('') }));
    [['¿De qué parte de España eres?', ['¿De qué parte de España es usted?', '¿De qué parte de España es?']], ['¿Y tú? ¿De dónde eres?', ['¿Y usted? ¿De dónde es?', '¿Y usted? ¿De dónde es usted?']]]
      .forEach(([p, a], i) => put(s, '.w3', writeItem({ id: 'a3-w' + i, sec: 'a3', skill: 'ser', prompt: p, answers: a })));
    put(s, '.f3', freeItem({ id: 'a3-f', sec: 'a3', rows: 5, ph: 'A: ¿De dónde eres?\nB: Soy de …',
      must: [{ re: '¿\\s*de d[oó]nde eres', label: '¿De dónde eres?' }, { re: W0 + 'soy de' + W1, label: 'Soy de … (2번 이상)', min: 2 }, { re: '¿\\s*de qu[eé] parte de', label: '¿De qué parte de … eres?' }, { re: '¿\\s*y t[uú]\\s*\\?', label: '¿Y tú?' }],
      model: 'A: ¿De dónde eres? B: Soy de Chile. A: ¿De qué parte de Chile eres? B: Soy de Valparaíso. ¿Y tú? ¿De dónde eres? A: Soy de Corea, de Incheon.' }));
  };

  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Relaciona los países con los adjetivos de nacionalidad.')}<div class="pmx"></div>
      <h3 class="h3">✍️ 여성형으로 쓰기 — 그녀는 ~ 사람이에요</h3>${modelo('María es de México. → Es mexicana.')}<div class="items two w4"></div>`);
    put(s, '.pmx', pairMatch({ id: 'a4p', sec: 'a4', skill: 'nac', pairs: [['México', 'mexicano'], ['Argentina', 'argentino'], ['España', 'español'], ['Italia', 'italiano'], ['Corea', 'coreano'], ['Japón', 'japonés'],
      ['Inglaterra', 'inglés'], ['Francia', 'francés'], ['Alemania', 'alemán'], ['China', 'chino'], ['Brasil', 'brasileño'], ['Estados Unidos', 'estadounidense'], ['Rusia', 'ruso']] }));
    [['Lucía', 'España', 'española'], ['Anna', 'Alemania', 'alemana'], ['Yuki', 'Japón', 'japonesa'], ['Sarah', 'Estados Unidos', 'estadounidense']]
      .forEach(([n, p, a], i) => put(s, '.w4', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'nac', prompt: `👩 ${n} es de ${p}.`, ph: 'Es …', answers: [`Es ${a}.`, `${n} es ${a}.`, `Ella es ${a}.`] })));
  };

  /* Actividad 5 — Sopa de letras (교재 그대로) */
  const SOPA = ['EBXNIIRJYNE', 'BEVMTEUMEMN', 'CHINAKSIREX', 'OSADLPALOFE', 'RQUEINGLESA', 'ECUTALEMANA', 'ARGENTINAXS', 'NEFRANCESAD', 'ABRASILEÑAL', 'XMEXICANARD'];
  const SOPA_W = [['coreana', 2, 0, 8, 0], ['italiana', 0, 4, 7, 4], ['rusa', 0, 6, 3, 6], ['china', 2, 0, 2, 4], ['inglesa', 4, 4, 4, 10],
    ['alemana', 5, 4, 5, 10], ['argentina', 6, 0, 6, 8], ['francesa', 7, 2, 7, 9], ['brasileña', 8, 1, 8, 9], ['mexicana', 9, 1, 9, 8]];
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Sopa de letras', { listen: true })}
      <h2 class="act-title">a) Encuentra diez nacionalidades que están en género femenino.</h2>
      <p class="small">단어의 <b>첫 글자</b>를 누르고 <b>마지막 글자</b>를 누르세요. (가로 →, 세로 ↓)</p>
      <div class="sopa-wrap"><div class="sopa"></div><div class="sopa-side"><div class="sopa-list"></div>
        <div class="item-row"><button class="btn ghost sm rst">처음부터</button><button class="btn ghost sm rev">정답 보기</button></div><div class="sopa-sc"></div></div></div>
      <h2 class="act-title">b) Escucha y comprueba. <button class="btn ghost sm" id="p5">▶ 정답 듣기</button></h2>
      <h3 class="h3">✍️ 남성형으로 바꿔 쓰세요 (악센트 주의!)</h3><div class="items two w5"></div>`);
    const st = sel('a5', { f: [], rev: false });
    SOPA_W.forEach((w, i) => reg('a5-s' + i, 'a5', 'nac'));
    const grid = $('.sopa', s);
    grid.innerHTML = SOPA.map((row, r) => [...row].map((ch, c) => `<button class="sc" data-r="${r}" data-c="${c}">${ch}</button>`).join('')).join('');
    let start = null;
    const cellsOf = ([, r0, c0, r1, c1]) => { const out = [], n = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0)); for (let k = 0; k <= n; k++) out.push([r0 + Math.sign(r1 - r0) * k, c0 + Math.sign(c1 - c0) * k]); return out; };
    const paint = () => {
      $$('.sc', grid).forEach(b => { b.className = 'sc'; });
      SOPA_W.forEach((w, i) => {
        const f = st.f.includes(i); if (!f && !st.rev) return;
        cellsOf(w).forEach(([r, c]) => { const b = $(`.sc[data-r="${r}"][data-c="${c}"]`, grid); b.classList.add(f ? 'f' + (i % 5) : 'rv'); });
      });
      if (start) $(`.sc[data-r="${start[0]}"][data-c="${start[1]}"]`, grid).classList.add('st');
      $('.sopa-list', s).innerHTML = SOPA_W.map((w, i) => `<span class="sw-w ${st.f.includes(i) ? 'ok' : st.rev ? 'no' : ''}">${st.f.includes(i) || st.rev ? w[0] : '? ' + '_ '.repeat(w[0].length - 1).trim()}</span>`).join('');
      $('.sopa-sc', s).innerHTML = `${MARK(st.f.length / 10)} <b>${st.f.length} / 10</b>`;
    };
    grid.addEventListener('click', e => {
      const b = e.target.closest('.sc'); if (!b) return;
      const p = [+b.dataset.r, +b.dataset.c];
      if (!start) { start = p; paint(); return; }
      const [r0, c0] = start, [r1, c1] = p; start = null;
      const i = SOPA_W.findIndex(w => (w[1] === r0 && w[2] === c0 && w[3] === r1 && w[4] === c1) || (w[1] === r1 && w[2] === c1 && w[3] === r0 && w[4] === c0));
      if (i >= 0 && !st.f.includes(i)) {
        st.f.push(i); save();
        if (!st.rev) record('a5-s' + i, 1, [], {});
        speak(SOPA_W[i][0]);
      } else if (i < 0) { b.classList.add('bad'); setTimeout(paint, 400); return; }
      paint();
    });
    $('.rst', s).onclick = () => { st.f = []; st.rev = false; start = null; save(); paint(); };
    $('.rev', s).onclick = () => { st.rev = true; SOPA_W.forEach((w, i) => { if (!st.f.includes(i)) record('a5-s' + i, 0, ['otro'], {}); }); save(); paint(); };
    $('#p5', s).onclick = e => playLines([{ who: 'x', es: 'Vertical: coreana, italiana, rusa.' }, { who: 'x', es: 'Horizontal: china, inglesa, alemana, argentina, francesa, brasileña, mexicana.' }], e.currentTarget);
    paint();
    [['inglesa', 'inglés'], ['alemana', 'alemán'], ['francesa', 'francés'], ['brasileña', 'brasileño']]
      .forEach(([f, m], i) => put(s, '.w5', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: 'nac', prompt: `👩 ${f} → 👨 ?`, answers: [m] })));
  };

  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Enrique le pregunta a Sumi sobre las lenguas que habla.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cuántos idiomas hablas?</span><span class="hlc c1">Hablan</span><span class="hlc c2">Mil gracias / Muchísimas gracias</span></div>
      ${tip('<b>la lengua</b> → ¿cuánt<b>as</b> lenguas? / <b>el idioma</b> → ¿cuánt<b>os</b> idiomas? (idioma 는 -a 로 끝나도 남성 명사!)')}
      <div class="items rep"></div>
      <h3 class="h3">c) 나의 언어 이야기 쓰기</h3><div class="f2"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blurBtn(s, '#hide2', '#d2txt', '본문 보기', '본문 가리기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'hab', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['Sumi habla cuatro idiomas.', 'Verdadero'], ['Enrique habla tres lenguas.', 'Falso'], ['"Thank you so much" en español se dice "De nada".', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'hab', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['¿Cuántas lenguas hablas? → <span class="chip">idiomas</span>', ['¿Cuántos idiomas hablas?']],
      ['En México se habla español. → <span class="chip">hablan</span>', ['En México hablan español.', 'Hablan español en México.']],
      ['Sumi: 나는 한국어와 영어를 해. <span class="small">(y → e 주의)</span>', ['Hablo coreano e inglés.', 'Yo hablo coreano e inglés.']]]
      .forEach(([p, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: i === 0 ? 'int' : 'hab', prompt: p, answers: a })));
    put(s, '.f2', freeItem({ id: 'd2f', sec: 'd2', rows: 4, prompt: '¿Cuántas lenguas hablas? ¿Qué lenguas hablas? — 2~3문장으로 쓰세요.', ph: 'Hablo dos idiomas: …',
      must: [{ re: W0 + 'hablo' + W1, label: 'Hablo …' }, { re: W0 + '(dos|tres|cuatro|cinco|un|una) (idiomas?|lenguas?)' + W1, label: '숫자 + idiomas/lenguas' }, { re: '(coreano|ingl[eé]s|espa[nñ]ol|chino|japon[eé]s|franc[eé]s|alem[aá]n)', label: '언어 이름' }],
      model: 'Hablo tres idiomas: coreano, inglés y un poco de español. Mi madre habla coreano y japonés.' }));
  };

  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Habla con tus compañeros siguiendo el diálogo.')}
      ${modelo('¿Qué lenguas hablas? — Hablo ________.<br>¿Qué lengua se habla en ________? — Se habla ________.<br>¿Cómo se dice "________" en ________? — Se dice ________.')}
      <h3 class="h3">① ¿Qué lengua se habla en …? — 대답을 쓰세요</h3><div class="items two l6"></div>
      <h3 class="h3">② ¿Cómo se dice … en español? — 대답을 쓰세요</h3><div class="items two c6"></div>
      <h3 class="h3">③ ¿Qué lenguas hablas? — 나의 대답</h3><div class="f6"></div>`);
    [['Brasil', 'portugués'], ['Francia', 'francés'], ['Japón', 'japonés'], ['Argentina', 'español']]
      .forEach(([p, l], i) => { const q = `¿Qué lengua se habla en ${p}?`; put(s, '.l6', writeItem({ id: 'a6-l' + i, sec: 'a6', skill: 'hab', prompt: `${q} ${say(q)}`, ph: 'Se habla …', answers: [`Se habla ${l}.`, `En ${p} se habla ${l}.`, `Hablan ${l}.`, `En ${p} hablan ${l}.`] })); });
    [['Hello', 'Hola'], ['Thank you', 'Gracias'], ['Good morning', 'Buenos días'], ['Goodbye', 'Adiós']]
      .forEach(([en, es], i) => { const q = `¿Cómo se dice "${en}" en español?`; put(s, '.c6', writeItem({ id: 'a6-c' + i, sec: 'a6', skill: 'hab', prompt: `${q} ${say(q)}`, ph: 'Se dice …', answers: [`Se dice "${es}".`, `Se dice ${es}.`, `"${es}".`] })); });
    put(s, '.f6', freeItem({ id: 'a6-f', sec: 'a6', line: true, ph: 'Hablo coreano, inglés y …', must: [{ re: W0 + 'hablo' + W1, label: 'Hablo …' }, { re: '(coreano|ingl[eé]s|espa[nñ]ol|chino|japon[eé]s|franc[eé]s|alem[aá]n|ruso|italiano|portugu[eé]s)', label: '언어 이름 (소문자)' }],
      model: 'Hablo coreano, inglés y un poco de español.' }));
  };

  const A7 = ['¿Cuál es su apellido?', '¿Cómo te llamas?', '¿Qué lenguas hablas?', '¿De dónde eres tú?'];
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'a) Elabora cuatro preguntas con las palabras del recuadro.')}
      <div class="ybox wordbank">${['dónde', 'Cuál', 'Cómo', 'su', 'lenguas', 'te', 'Qué', 'llamas', 'eres', 'hablas', 'De', 'es', 'apellido', 'tú'].map(w => `<span>${w}</span>`).join('')}</div>
      <div class="c7"></div>
      <h2 class="act-title"><span class="hp">🎧</span> b) Escucha y comprueba. Ahora escribe tus respuestas a esas preguntas.</h2>
      <p class="small">▶ 버튼으로 질문을 듣고 받아쓴 뒤, 아래에 나의 대답을 쓰세요.</p>
      <div class="items dict"></div>
      <h3 class="h3">✍️ 나의 대답</h3><div class="ans7"></div>`);
    put(s, '.c7', cloze({ id: 'a7c', sec: 'a7', skill: 'int', cls: 'lines', text:
      ['1) ¿Cuál [es] [su] [apellido]?', '2) ¿[Cómo] te [llamas]?', '3) ¿Qué [lenguas] [hablas]?', '4) ¿[De] [dónde] [eres] tú?'].map(x => `<p>${x}</p>`).join('') }));
    A7.forEach((q, i) => {
      const w = writeItem({ id: 'a7-d' + i, sec: 'a7', skill: 'int', prompt: `${i + 1}) <button class="btn ghost sm pq">▶ 듣기</button>`, ph: '¿ … ?', answers: i === 3 ? [q, '¿De dónde eres?'] : [q] });
      $('.pq', w).onclick = e => speak(q, e.currentTarget);
      put(s, '.dict', w);
    });
    put(s, '.ans7', freeItem({ id: 'a7-a', sec: 'a7', rows: 4, prompt: A7.map((q, i) => `${i + 1}) ${q} ${say(q)}`).join('<br>') + '<br><span class="small">네 질문에 차례로 한 문장씩 대답하세요.</span>',
      ph: '1) Mi apellido es …\n2) Me llamo …\n3) Hablo …\n4) Soy de …',
      must: [{ re: W0 + 'mi apellido es' + W1, label: '1) Mi apellido es …' }, { re: W0 + 'me llamo' + W1, label: '2) Me llamo …' }, { re: W0 + 'hablo' + W1, label: '3) Hablo …' }, { re: W0 + 'soy de' + W1, label: '4) Soy de …' }],
      model: 'Mi apellido es Kim. Me llamo Kim Minji. Hablo coreano, inglés y un poco de español. Soy de Corea, de Seúl.' }));
  };

  B.a8 = () => {
    const s = sec('a8', `${actHead(8, '¿De dónde son estas personas? ¿Qué lengua hablan? Contesta siguiendo el modelo.', { kr: '교재 사진 대신 인물 카드로 구성했어요.' })}
      <div class="cgrid fam">${D.famosos.map((f, i) => `<div class="ccard"><span class="emo">${f.av}${f.e}</span><b>${i + 1}) ${f.n}</b><small>${f.job} · ${f.p}</small></div>`).join('')}</div>
      ${modelo('Ann Hathaway es de Estados Unidos.<br>Es estadounidense y habla inglés.')}
      ${tip('여자는 여성형 국적: Yuna Kim es corean<b>a</b> / Fidel Castro es cuban<b>o</b>. 국적·언어는 소문자로!')}
      <h3 class="h3">① modelo처럼 두 문장으로 쓰세요</h3><div class="items w8"></div>
      <h3 class="h3">② 내가 좋아하는 유명인 소개하기</h3><div class="f8"></div>`);
    D.famosos.forEach((f, i) => {
      const ps = f.alt ? [f.p, f.alt] : [f.p];
      const ans = ps.flatMap(p => [`${f.n} es de ${p}. Es ${f.nac} y habla ${f.l}.`, `Es de ${p}. Es ${f.nac} y habla ${f.l}.`, `${f.n} es de ${p}, es ${f.nac} y habla ${f.l}.`]);
      put(s, '.w8', writeItem({ id: 'a8-' + i, sec: 'a8', skill: 'ser', prompt: `${f.av}${f.e} <b>${f.n}</b> <span class="small">(${f.p})</span>`, ph: `${f.n} es de …`, answers: ans }));
    });
    put(s, '.f8', freeItem({ id: 'a8-f', sec: 'a8', rows: 3, ph: 'Messi es de Argentina. Es argentino y habla español.',
      must: [{ re: W0 + 'es de' + W1, label: 'es de + 나라' }, { re: W0 + 'es [a-záéíóúñ]+(an[oa]|[eé]s|esa|[aá]n|ana|ol|ola|ense|[ei]ñ[oa]|[oa])' + W1, label: 'es + 국적' }, { re: W0 + 'habla' + W1, label: 'habla + 언어' }],
      model: 'Son Heung-min es de Corea. Es coreano y habla coreano e inglés.' }));
  };

  B.a9 = () => {
    const miss = [12, 15, 18, 22, 23, 26];
    const cell = n => miss.includes(n) ? `<p class="miss"><span class="nn">[${n}]</span><span class="nw">[${D.numeros[n]}]</span></p>` : `<p><span class="nn">${n}</span><span class="nw">${D.numeros[n]}</span></p>`;
    const s = sec('a9', `${actHead(9, 'Escucha y escribe los números que faltan.', { listen: true, kr: '대본을 들으며 빈칸에 숫자와 스페인어 단어를 쓰세요.' })}
      <h3 class="h3"><button class="btn ghost sm" id="p9">▶ 전체 듣기</button> <button class="btn ghost sm" id="h9">대본 보기</button></h3>
      <div id="t9" class="blur">${dialogHTML(D.a9.flatMap(x => [{ who: 'A', es: x.q }, { who: 'B', es: '-' + x.a }]))}</div>
      <div class="ng"></div>
      <h3 class="h3">✍️ 질문에 대답 쓰기 — 대본의 숫자를 스페인어 글자로</h3><div class="items two w9"></div>
`);
    $('#p9', s).onclick = e => playLines(D.a9.flatMap(x => [{ who: 'A', es: x.q }, { who: 'B', es: x.a }]), e.currentTarget);
    blurBtn(s, '#h9', '#t9', '대본 보기', '대본 가리기');
    const rows = [[11, 17], [18, 24], [25, 30]];
    put(s, '.ng', cloze({ id: 'a9g', sec: 'a9', skill: 'num', cls: 'numgrid', text: rows.map(([a, b]) => `<div class="nrow">${Array.from({ length: b - a + 1 }, (_, k) => cell(a + k)).join('')}</div>`).join('') }));
    D.a9.forEach((x, i) => put(s, '.w9', writeItem({ id: 'a9-' + i, sec: 'a9', skill: 'num', prompt: `${x.q} ${say(x.q)} <span class="chip">${i === 3 ? '22/5' : x.n}</span>`, answers: x.ans })));
  };

  B.a10 = () => {
    const s = sec('a10', `${actHead(10, '¿De qué color es? ¿Cuántos hay? Habla siguiendo el modelo.', { kr: '그림을 세어 보고 색깔과 개수를 문장으로 쓰세요.' })}
      ${modelo('<div class="m10"><div>¿De qué color son las rosas?<br>-Son rojas.<br>¿Cuántas hay?<br>-Hay once.</div><div class="cnt" style="--per:6">' + '<i>🌹</i>'.repeat(11) + '</div></div>')}
      <div class="p10"></div>
      <h3 class="h3">✍️ 나의 물건 — 색깔과 개수 쓰기</h3><div class="f10"></div>`);
    D.a10.forEach((x, i) => {
      const icons = Array.from({ length: x.n }, () => `<i${x.bg ? ` style="background:${x.bg}"` : ''}>${x.e}</i>`).join('');
      const fem = /^las /.test(x.obj);
      const box = el(`<div class="c10"><div class="ch">${i + 1})</div><div class="cnt" style="--per:${x.per}">${icons}</div><div class="items qa"></div></div>`);
      const q1 = `¿De qué color son ${x.obj}?`, q2 = fem ? '¿Cuántas hay?' : '¿Cuántos hay?';
      const colA = x.col === 'naranja' ? ['Son de color naranja.', 'Son naranja.', 'Son naranjas.'] : [`Son ${x.col}.`];
      const numA = [`Hay ${x.w}.`, `Hay ${x.w2 || x.w} ${x.obj.split(' ')[1]}.`];
      box.querySelector('.qa').append(writeItem({ id: 'a10-c' + i, sec: 'a10', skill: 'col', prompt: `${q1} ${say(q1)}`, ph: 'Son …', answers: colA }),
        writeItem({ id: 'a10-n' + i, sec: 'a10', skill: 'num', prompt: `${q2} ${say(q2)}`, ph: 'Hay …', answers: numA }));
      put(s, '.p10', box);
    });
    put(s, '.f10', freeItem({ id: 'a10-f', sec: 'a10', rows: 3, prompt: '내 방이나 필통 속 물건 2가지의 색깔과 개수를 쓰세요.', ph: 'Hay doce lápices. Son azules. …',
      must: [{ re: W0 + 'hay (once|doce|trece|catorce|quince|diecis[eé]is|diecisiete|dieciocho|diecinueve|veinte|veinti[a-záéíóúñ]+|treinta|un[oa]?|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)' + W1, label: 'Hay + 숫자 (2번)', min: 2 },
        { re: W0 + '(es|son) (de color )?(roj|amarill|blanc|negr|morad)[oa]s?' + W1 + '|' + W0 + '(es|son) (de color )?(azul(es)?|verdes?|gris(es)?|naranja|rosa|marr[oó]n(es)?)' + W1, label: 'Es / Son + 색깔' }],
      model: 'En mi estuche hay doce lápices. Son amarillos. También hay dos gomas. Son blancas.' }));
  };

  SC.lesson({
    num: '02',
    title: '¿De dónde eres?',
    ttsTest: '¡Hola! ¿De dónde eres? Soy de Corea.',
    cover: {
      emoji: '🌎🗣️<small>¿De dónde eres?</small>',
      bg: 'linear-gradient(135deg,#6b2418 0%,#a3412a 55%,#f2a23a 100%)',
      tema: ['Países y nacionalidades', 'Lenguas', 'Colores', 'Los números del 11 al 30'],
      com: ['Preguntar y decir qué lenguas hablan'],
      gram: ['Interrogativos: <i>cuál, cuánto, dónde, qué</i>', 'Presente de indicativo: <i>ser, hablar</i>', 'Pronombres personales: <i>yo, tú, usted</i>', 'Adjetivos de color']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      Chico: { name: 'Chico', av: '👦🏻', side: 'l' }, Bianca: { av: '👱🏼‍♀️', side: 'r' },
      Enrique: { av: '👨🏽', side: 'l' }, Sumi: { av: '👩🏻', side: 'r' }, A: { av: '🙋', side: 'l' }, B: { av: '🧑‍🏫', side: 'r' }, x: { name: '정답', av: '📢', side: 'l' }
    },
    errLabels: { conjugacion: '동사 변화 (ser · hablar)', concordancia: '성 · 수 일치 (국적 · 색깔)', estructura: '문장 구조 · 어순' },
    errTips: {
      acento: 'México, Perú, Panamá, Japón, inglés, alemán, dieciséis, veintidós … 악센트도 철자예요. 의문사(qué, cuál, dónde, cuántos)에도 꼭!',
      concordancia: '국적·색깔 형용사는 명사의 성·수에 맞춰요: Ella es mexicana / Ellos son ingleses / Las sillas son azules.',
      conjugacion: 'ser: soy, eres, es, somos, sois, son / hablar: hablo, hablas, habla, hablamos, habláis, hablan',
      estructura: '출신은 "Soy de + 나라(Corea)", 국적은 "Soy + 국적(coreano/a)" — "Soy de coreano"(✕)',
      pronombre: 'tú(반말) ↔ usted(존댓말, 동사는 3인칭): ¿De dónde eres? / ¿De dónde es usted?'
    },
    classify(ti, ta) {
      const SER = ['soy', 'eres', 'es', 'somos', 'sois', 'son'];
      const vi = ti.filter(w => SER.includes(w) || /^habl/.test(w)).join(), va = ta.filter(w => SER.includes(w) || /^habl/.test(w)).join();
      if (vi !== va && ti.length === ta.length) return 'conjugacion';
      if ((ti.includes('cuantos') && ta.includes('cuántas')) || (ti.includes('cuantas') && ta.includes('cuántos')) || (ti.includes('cuántos') && ta.includes('cuántas')) || (ti.includes('cuántas') && ta.includes('cuántos'))) return 'concordancia';
      return null;
    },
    errRules: [
      { re: W0 + 'yo (es|eres|son)' + W1, t: 'conjugacion', msg: 'yo → soy' },
      { re: W0 + 't[uú] (es|soy|son)' + W1, t: 'conjugacion', msg: 'tú → eres' },
      { re: W0 + 'yo (habla|hablas|hablan)' + W1, t: 'conjugacion', msg: 'yo → hablo' },
      { re: W0 + 'soy de (coreano|coreana|espa[nñ]ol|espa[nñ]ola|italiano|italiana|mexicano|mexicana|ingl[eé]s|inglesa|japon[eé]s|japonesa|chino|franc[eé]s|alem[aá]n)' + W1, t: 'estructura', msg: 'Soy de + 나라 / Soy + 국적 (Soy de Corea · Soy coreano)' },
      { re: W0 + 'soy (corea|espa[nñ]a|italia|m[eé]xico|jap[oó]n|francia|alemania|inglaterra|per[uú]|argentina)' + W1, t: 'estructura', msg: '나라 이름 앞에는 de: Soy de Corea' },
      { re: W0 + 'hablo (corea|espa[nñ]a|inglaterra|jap[oó]n|francia|alemania|italia)' + W1, t: 'estructura', msg: '언어 이름: coreano, español, inglés, japonés …' },
      { re: W0 + 'cu[aá]ntos lenguas' + W1, t: 'concordancia', msg: 'la lengua → ¿cuántas lenguas?' },
      { re: W0 + 'cu[aá]ntas idiomas' + W1, t: 'concordancia', msg: 'el idioma → ¿cuántos idiomas?' },
      { re: W0 + 'y(?= h?[ií](?![eéa]))', t: 'estructura', msg: 'i-/hi- 앞의 y → e (español e inglés)' },
      { re: W0 + 'veintiuno (perros|gatos|libros|a[nñ]os|idiomas|pa[ií]ses)' + W1, t: 'concordancia', msg: '남성 명사 앞 → veintiún' }
    ],
    accWords: ['méxico', 'japón', 'perú', 'panamá', 'canadá', 'país', 'países', 'bogotá', 'seúl', 'parís', 'berlín', 'moscú', 'asunción', 'catalán', 'guaraní', 'náhuatl',
      'española', 'españolas', 'españoles', 'brasileño', 'brasileña', 'dieciséis', 'veintidós', 'veintitrés', 'veintiséis', 'veintiún', 'áfrica', 'américa', 'marrón', 'habláis', 'muchísimas'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿De dónde es María?', '¿Qué lengua se habla en México?', 'Hay veintiún perros blancos.', '¿De qué color es la rosa?', 'Hablo coreano, inglés y español.', 'Es de España. Es española.'],
    utilSkill: 'ser',
    proverbio: { es: 'Matar dos pájaros de un tiro.', e: '🐤🐤', answer: '일석이조', options: ['일석이조', '소 잃고 외양간 고친다', '누워서 떡 먹기', '하늘의 별 따기'], kr: '"한 번 쏘아 새 두 마리를 잡는다" — 한 가지 일로 두 가지 이득을 얻는다는 뜻이에요. (一石二鳥)' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Presentación: un país que me interesa → 글로 쓰기',
        icons: ['🛕', '⚽', '🏝️', '⛪', '🏔️', '🌆'],
        html: `<div class="tip"><span class="tip-ic">💡</span><div>관심 있는 나라 하나를 골라 발표문을 쓰세요. 예)
          <i>Perú está en América del Sur. · En Perú hablan español y quechua. · Es famoso por Machu Picchu. · La capital es Lima. · Las ciudades más importantes son …</i></div></div>`,
        questions: ['¿En qué continente está el país?', '¿Qué lenguas hablan en ese país?', '¿Por qué es famoso?', '¿Cuál es la capital?', '¿Cuáles son las ciudades más importantes?'],
        minWords: 40,
        hint: 'ser(es/son) · hablar(hablan/se habla) · 국적 형용사 · y/e/pero 를 활용하면 높은 점수!',
        ph: 'Me interesa México. México está en América del Norte. …',
        connectors: ['y', 'e', 'pero', 'porque', 'también', 'además', 'sobre todo', 'por eso'],
        rubric: [
          { k: 'cont', label: '대륙 (Está en América / Europa …)', max: 8, re: 'am[eé]rica( del (sur|norte)| central| latina)?|europa|asia|[aá]frica|ocean[ií]a', ax: 'Contenido' },
          { k: 'len', label: '언어 (hablan / se habla)', max: 8, re: 'hablan|se habla|habla', ax: 'Contenido' },
          { k: 'fam', label: '유명한 이유 (es famoso por …)', max: 8, re: 'famos[oa]s?', ax: 'Contenido' },
          { k: 'cap', label: '수도 (La capital es …)', max: 8, re: 'capital', ax: 'Contenido' },
          { k: 'ciu', label: '주요 도시 (ciudades importantes)', max: 6, re: 'ciudad(es)?', ax: 'Contenido' },
          { k: 'ser', label: 'ser 활용 (es / son) 4번 이상', max: 8, re: 'es|son', min: 4, ax: 'Gramática' },
          { k: 'nac', label: '언어 · 국적 형용사', max: 7, re: 'espa[nñ]ol(a|es|as)?|ingl[eé]s(a|es|as)?|franc[eé]s(a|es|as)?|alem[aá]n(a|es|as)?|portugu[eé]s(a|es|as)?|italian[oa]s?|chin[oa]s?|japon[eé]s(a|es|as)?|corean[oa]s?|quechua|guaran[ií]|aimara|n[aá]huatl|catal[aá]n|gallego|euskera|rus[oa]s?|(mexican|peruan|argentin|colombian|chilen|cuban|venezolan|ecuatorian|bolivian|brasile[nñ]|uruguay|paraguay)[oa]s?|estadounidenses?', ax: 'Gramática' },
          { k: 'adj', label: 'más / muy + 형용사', max: 7, re: '(m[aá]s|muy) [a-záéíóúñ]+', ax: 'Gramática' }
        ],
        model: 'Me interesa Perú. Perú está en América del Sur. En Perú hablan español, pero también hablan quechua y aimara. Es famoso por Machu Picchu y por su comida. La capital es Lima. Las ciudades más importantes son Lima, Cusco y Arequipa. Cusco es una ciudad muy bonita. Además, la gente es muy simpática.'
      }
    },
    build: B
  });
})();
