/* Lección 08 · ¿Qué haces normalmente por la tarde? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem,
    matchPics, flipGrid, clock, dclock, dialogHTML, playLines, speak, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, MARK } = SC;

  /* ---------- 시각 표현 도우미 ---------- */
  const NUM = { 1: 'una', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez', 11: 'once', 12: 'doce' };
  const MIN = { 5: 'cinco', 10: 'diez', 15: 'cuarto', 20: 'veinte', 25: 'veinticinco', 30: 'media' };
  const MINN = { 5: 'cinco', 10: 'diez', 15: 'quince', 20: 'veinte', 25: 'veinticinco', 30: 'treinta', 35: 'treinta y cinco', 40: 'cuarenta', 45: 'cuarenta y cinco', 50: 'cincuenta', 55: 'cincuenta y cinco' };
  const hn = n => { n = ((n - 1) % 12 + 12) % 12 + 1; return (n === 1 ? 'la ' : 'las ') + NUM[n]; };
  /* 'las siete y media' 같은 시각 핵심 표현(여러 변형) */
  function cores(h, m) {
    const out = [];
    if (m === 0) out.push(hn(h) + ' en punto', hn(h));
    else if (m <= 30) { out.push(hn(h) + ' y ' + MIN[m]); if (m === 15 || m === 30) out.push(hn(h) + ' y ' + MINN[m]); }
    else { const r = 60 - m; out.push(hn(h + 1) + ' menos ' + (r === 15 ? 'cuarto' : MINN[r])); if (r === 15) out.push(hn(h + 1) + ' menos quince'); out.push(hn(h) + ' y ' + MINN[m]); }
    return out;
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const horaAns = (h, m) => cores(h, m).map(c => (c.startsWith('la ') ? 'Es ' : 'Son ') + c + '.');
  /* 템플릿 속 {T} 를 'a las …' 로 바꿔 정답 변형 만들기 (suf: 'de la mañana' 등 선택 꼬리) */
  const withT = (tpls, h, m, suf) => tpls.flatMap(t => cores(h, m).flatMap(c => {
    const a = 'a ' + c, list = [t.replace('{T}', a)];
    if (suf) list.push(t.replace('{T}', a + ' ' + suf));
    return list.map(x => cap(x));
  }));
  const pad = n => String(n).padStart(2, '0');
  const yp = (a, b) => [`${a} y ${b}.`, `${a}, pero ${b}.`];

  const FREQ = '(siempre|casi siempre|casi nunca|normalmente|generalmente|en general|a menudo|a veces|de vez en cuando|nunca|todos los (d[ií]as|meses|a[nñ]os|fines de semana|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bados|domingos)|todas las (semanas|ma[nñ]anas|tardes|noches)|cada (d[ií]a|semana|mes|a[nñ]o|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|fin de semana)|(una|dos|tres|cuatro|cinco|seis|\\d+) (vez|veces) (al|a la|por) (d[ií]a|semana|mes|a[nñ]o)|los (lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bados|domingos|fines de semana))';

  /* Lección 08 — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vocabulario 장소·어휘',
      hor: 'Hora 시각·요일',
      ref: 'Reflexivos 재귀동사',
      rut: 'Rutina 일과 동사',
      fre: 'Frecuencia 빈도',
      tar: 'Tareas 집안일',
      lib: 'Escritura libre 자유작문'
    },
    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '스페인의 영업시간', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '로베르토와 로시오', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '시계와 시각 연결', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '빈도표 · ¿Con qué frecuencia?', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '집안일 돕기', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '페드로의 시간표', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'd2', label: 'Diálogo 2', kr: '파울라와 오스카르', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a5', label: 'Actividad 5', kr: '그림 묘사 · 재귀동사', group: 'Diálogo 2', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '약국 영업시간', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '후안의 하루 (듣기)', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '직업과 빈도', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '¿Qué quieres hacer?', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '생활 습관 질문에 답하기', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    lugares: [
      { es: 'supermercado', art: 'el', kr: '슈퍼마켓', e: '🛒' },
      { es: 'tienda', art: 'la', kr: '가게', e: '🏪' },
      { es: 'grandes almacenes', art: 'los', kr: '백화점', e: '🏬' },
      { es: 'banco', art: 'el', kr: '은행', e: '🏦' },
      { es: 'oficina de correos', art: 'la', kr: '우체국', e: '📮' },
      { es: 'ayuntamiento', art: 'el', kr: '시청', e: '🏛️' },
      { es: 'restaurante', art: 'el', kr: '식당', e: '🍽️' },
      { es: 'cafetería', art: 'la', kr: '카페', e: '☕' },
      { es: 'farmacia', art: 'la', kr: '약국', e: '💊' }
    ],

    /* Antes de empezar — Horarios (시: 소수) */
    horarios: [
      { n: 'Comidas', kr: '식사 (아침·점심·저녁)', e: '🍳', seg: [[8, 10], [13.5, 15.5], [20.5, 23]], meal: true },
      { n: 'Tiendas', kr: '가게', e: '🏪', seg: [[9.5, 13.5], [16.5, 20]] },
      { n: 'Supermercados y grandes almacenes', kr: '슈퍼마켓·백화점', e: '🛒', seg: [[10, 21]] },
      { n: 'Bancos', kr: '은행', e: '🏦', seg: [[10, 14]] },
      { n: 'Farmacia', kr: '약국', e: '💊', seg: [[9.5, 13.5], [16.5, 20]] },
      { n: 'Restaurantes', kr: '식당', e: '🍽️', seg: [[13.5, 15.5], [20.5, 23]] },
      { n: 'Cafeterías y bares', kr: '카페·바', e: '☕', seg: [[17, 22]] }
    ],

    dialogo1: [
      { who: 'Rocío', es: '¿A qué hora te levantas?' },
      { who: 'Roberto', es: 'Me levanto a las siete en punto y después me ducho.' },
      { who: 'Rocío', es: '¿Y después?' },
      { who: 'Roberto', es: 'Normalmente desayuno con mis padres y mi hermano a las ocho menos cuarto. Casi siempre tomo leche y tostadas, pero [a veces], tomo cereales con leche.' },
      { who: 'Rocío', es: 'Y luego, ¿qué haces?' },
      { who: 'Roberto', es: 'Mi hermano y yo nos vamos al colegio. Salimos de casa a las ocho y media [más o menos] y siempre vamos andando.' },
      { who: 'Rocío', es: '¿A qué hora llegas al colegio?' },
      { who: 'Roberto', es: 'A las nueve menos diez llego al colegio. Las clases [empiezan] [todos los días] a las nueve.' }
    ],

    dialogo2: [
      { who: 'Paula', es: '¿Qué haces en un día normal?' },
      { who: 'Óscar', es: '[Generalmente], me levanto a las seis de la mañana. Después me lavo la cara, me peino, desayuno y me cepillo los dientes. Salgo de casa a las siete de la mañana y llego a la escuela a las ocho. Mis clases empiezan a las ocho y media de la mañana y [terminan] a las cuatro y media de la tarde.' },
      { who: 'Paula', es: '¿Qué haces después de las clases?' },
      { who: 'Óscar', es: 'Generalmente, juego al fútbol con mis amigos. [Regreso] a casa a las seis y media de la tarde. Ceno con mi familia, reviso mis correos electrónicos y veo la televisión. Normalmente, me acuesto a [medianoche]. Y tú, ¿qué haces en un día normal?' },
      { who: 'Paula', es: 'Es casi igual a tu rutina diaria. Pero, después de las clases, voy a la cafetería con mis amigos para charlar.' },
      { who: 'Óscar', es: 'Bueno.' }
    ],

    /* Actividad 1 — 교재 시계 a~h (시, 분) */
    relojes: [[1, 30], [1, 0], [6, 15], [7, 45], [11, 40], [9, 40], [2, 25], [5, 30]],
    act1: [['Son las seis y cuarto.', 2], ['Son las ocho menos cuarto.', 3], ['Son las cinco y media.', 7], ['Es la una en punto.', 1],
      ['Es la una y media.', 0], ['Son las doce menos veinte.', 4], ['Son las dos y veinticinco.', 6], ['Son las diez menos veinte.', 5]],

    /* Actividad 2 — 빈도표 */
    a2rows: [
      { es: 'Levantarme tarde', v: 'me levanto tarde' }, { es: 'Dormir ocho horas', v: 'duermo( ocho horas)?' },
      { es: 'Ir al colegio andando', v: 'voy al colegio' }, { es: 'Cenar fuera de casa', v: 'ceno fuera' },
      { es: 'Escribir cartas', v: 'escribo cartas' }, { es: 'Ver la televisión', v: 'veo la tele(visi[oó]n)?' },
      { es: 'Hacer deporte', v: 'hago deporte' }, { es: 'Comprar libros de literatura <small>(novela, poesía, etc.)</small>', v: 'compro libros' },
      { es: 'Visitar a mis familiares <small>(tíos, primos, abuelos, etc.)</small>', v: 'visito a mis' }
    ],
    a2cols: [
      { es: 'Todos los días', re: 'todos los d[ií]as|cada d[ií]a', w: 100 }, { es: 'A menudo', re: 'a menudo', w: 70 },
      { es: 'A veces', re: 'a veces', w: 45 }, { es: 'Casi nunca', re: 'casi nunca', w: 15 },
      { es: 'Nunca', re: '(?<!casi )nunca', w: 3 }, { es: 'Los fines de semana', re: 'los fines de semana|cada fin de semana', w: 30 }
    ],

    tareas: [
      { es: 'planchar', e: '👔', yo: 'plancho', tu: 'planchas', kr: '다림질하다' },
      { es: 'hacer la cama', e: '🛏️', yo: 'hago la cama', tu: 'haces la cama', kr: '침대를 정리하다' },
      { es: 'poner la mesa', e: '🍽️', yo: 'pongo la mesa', tu: 'pones la mesa', kr: '상을 차리다' },
      { es: 'barrer', e: '🧹', yo: 'barro', tu: 'barres', kr: '쓸다' },
      { es: 'ordenar la habitación', e: '🧸', yo: 'ordeno (mi|la) habitaci[oó]n', tu: 'ordenas la habitación', kr: '방을 정리하다' },
      { es: 'fregar los platos', e: '🧽', yo: 'friego los platos', tu: 'friegas los platos', kr: '설거지하다' }
    ],

    /* Actividad 4 — 페드로의 시간표 */
    horasA4: ['9.00', '10.00', '11.00', '12.00', '12.30', '13.30', '14.15'],
    tablaA4: [
      ['Matemáticas', 'Educación Plástica', 'Inglés', 'Inglés', 'Historia'],
      ['(1)[Lengua Española]', 'Matemáticas', '(4)[Geografía]', 'Historia', '(6)[Educación Física]'],
      ['Inglés', 'Lengua Española', 'Música', 'Matemáticas', 'Lengua Española'],
      'Recreo',
      ['(2)[Música]', 'Educación Física', 'Historia', 'Geografía', 'Educación Plástica'],
      ['Geografía', '(3)[Historia]', 'Francés', 'Música', 'Geografía'],
      ['Francés', '#', '#', '(5)[Educación Plástica]', 'Inglés']
    ],
    script4: 'El lunes a las diez tengo lengua española y a las doce y media tengo música. El martes a la una y media de la tarde tengo historia. Los miércoles tengo geografía a las diez de la mañana después de inglés. El jueves tengo educación plástica a las dos y cuarto. El viernes a las diez tengo educación física. Ah, se me olvidaba, estudio francés los lunes a las dos y cuarto de la tarde. Y al mediodía, a las doce, estoy jugando porque estoy en el recreo.',
    script7: 'Juan va al colegio a las ocho. Las clases empiezan a las ocho y media. Las clases terminan a las cuatro de la tarde. Los martes y viernes tiene clases de piano en una academia. Los fines de semana queda con sus amigos para ir al cine o jugar al tenis.',

    /* Actividad 5 — 그림 묘사 (교재 6쌍) */
    act5: [
      { a: { e: '🧔🏻👕', es: 'se quita la camisa' }, b: { e: '👩🏻👟', es: 'se pone los zapatos' }, ans: yp('Él se quita la camisa', 'ella se pone los zapatos') },
      { a: { e: '👨🏻‍💼🚪', es: 'se va' }, b: { e: '👦🏻🎒', es: 'llega a casa' }, ans: [...yp('El marido se va', 'el niño llega a casa'), ...yp('El padre se va', 'el niño llega a casa'), ...yp('Él se va', 'el niño llega a casa')] },
      { a: { e: '🧒🏻🚿', es: 'se ducha' }, b: { e: '👦🏻👦🏻🛁', es: 'se bañan' }, ans: yp('Él se ducha', 'ellos se bañan') },
      { a: { e: '👩🏻📺', es: 've la televisión' }, b: { e: '👨🏻📰', es: 'lee el periódico' }, ans: [...yp('Ella ve la televisión', 'él lee el periódico'), ...yp('Ella ve la tele', 'él lee el periódico')] },
      { a: { e: '🧔🏻🪒', es: 'se afeita' }, b: { e: '👧🏻🪥', es: 'se lava los dientes' }, ans: [...yp('Él se afeita', 'ella se lava los dientes'), ...yp('Él se afeita', 'ella se cepilla los dientes')] },
      { a: { e: '👩🏻🛌', es: 'se acuesta' }, b: { e: '🙆🏻‍♂️⏰', es: 'se levanta' }, ans: [...yp('Ella se acuesta', 'él se levanta').reverse()] }
    ],

    act9: [
      { e: '☕💬', es: 'ir a charlar en la cafetería', ans: ['Quiero ir a charlar en la cafetería.', 'Quiero charlar en la cafetería.', 'Quiero ir a la cafetería.', 'Quiero ir a la cafetería a charlar.'] },
      { e: '🎾', es: 'jugar al tenis', ans: ['Quiero jugar al tenis.'] },
      { e: '🛍️', es: 'ir de compras', ans: ['Quiero ir de compras.'] },
      { e: '🎧', es: 'escuchar música', ans: ['Quiero escuchar música.'] },
      { e: '😴', es: 'dormir', ans: ['Quiero dormir.'] },
      { e: '🏊', es: 'nadar', ans: ['Quiero nadar.', 'Quiero ir a nadar.'] }
    ],

    utiles: [
      ['¿Qué hora es?', '몇 시예요?'],
      ['Es la una. / Son las diez. / Son las cinco menos cuarto.', '1시예요. / 10시예요. / 5시 15분 전이에요.'],
      ['¿A qué hora te levantas normalmente?', '보통 몇 시에 일어나?'],
      ['Normalmente me levanto a las siete.', '보통 7시에 일어나.'],
      ['¿Qué haces normalmente los sábados por la mañana?', '토요일 오전에는 보통 뭐 해?'],
      ['Normalmente me levanto tarde y luego hago la compra.', '보통 늦게 일어나고 그다음에 장을 봐.'],
      ['¿Con qué frecuencia escribes a tus amigos?', '친구들에게 얼마나 자주 편지를 써?'],
      ['Les escribo dos veces al mes.', '한 달에 두 번 (그들에게) 써.']
    ],

    examBank: [
      { p: '¿Qué hora ____? — Es la una.', a: ['es'], s: 'hor' },
      { p: '____ las cinco menos cuarto. <i>(ser)</i>', a: ['son'], s: 'hor' },
      { p: '____ la una y media. <i>(ser)</i>', a: ['es'], s: 'hor' },
      { p: 'Desayuno ____ las ocho menos cuarto.', a: ['a'], s: 'hor' },
      { p: 'Yo ____ levanto a las siete en punto.', a: ['me'], s: 'ref' },
      { p: 'Mi hermano y yo ____ vamos al colegio.', a: ['nos'], s: 'ref' },
      { p: 'Óscar ____ ducha por la mañana.', a: ['se'], s: 'ref' },
      { p: '¿A qué hora te ____? <i>(acostarse)</i>', a: ['acuestas'], s: 'ref' },
      { p: 'Los niños se ____ en la bañera. <i>(bañarse)</i>', a: ['bañan'], s: 'ref' },
      { p: 'Las clases ____ a las nueve. <i>(empezar)</i>', a: ['empiezan'], s: 'rut' },
      { p: 'Yo ____ a casa a las seis. <i>(volver)</i>', a: ['vuelvo'], s: 'rut' },
      { p: 'Yo ____ de casa a las siete. <i>(salir)</i>', a: ['salgo'], s: 'rut' },
      { p: 'Yo ____ ocho horas al día. <i>(dormir)</i>', a: ['duermo'], s: 'rut' },
      { p: 'La farmacia ____ a las ocho de la tarde. <i>(cerrar)</i>', a: ['cierra'], s: 'voc' },
      { p: '¿Con qué ____ comes fuera de casa? <i>(빈도)</i>', a: ['frecuencia'], s: 'fre' },
      { p: '____ voy al cine. <i>(전혀 ~않다)</i>', a: ['nunca'], s: 'fre' },
      { p: 'Les escribo dos ____ al mes.', a: ['veces'], s: 'fre' },
      { p: 'Hago deporte una vez ____ semana.', a: ['a la', 'por'], s: 'fre' },
      { p: 'Yo ____ los platos. <i>(fregar)</i>', a: ['friego'], s: 'tar' },
      { p: 'Normalmente me acuesto a ____. <i>(자정)</i>', a: ['medianoche', 'las doce'], s: 'rut' }
    ]
  };

  const B = {};
  const hideBtn = (s, btn, box, a, b) => { $(btn, s).onclick = e => { const t = $(box, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? b : a; }; };

  /* ================= Antes de empezar ================= */
  B.vocab = () => {
    const txt = 'El horario de trabajo en las oficinas y despachos puede ser intensivo (de 8:00 a 15:00 horas) o dividido en dos partes (de 9:00 a 14:00 y de 16:00 a 19:00), de lunes a viernes con una jornada laboral de 8 horas (40 horas semanales).';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${txt} ${say(txt.replace(/(\d+):00/g, '$1'))}</p>
      <div class="hor-list"><b>Horarios</b><ul>
        <li>Desayuno: 8:00 h~10:00 h, Almuerzo (Comida): 13:30 h~15:30 h, Cena: 20:30 h~23:00 h</li>
        <li>Tiendas: 9:30 h~13:30 h, 16:30 h~20:00 h</li>
        <li>Supermercados y grandes almacenes: 10:00 h~21:00 h (o 22:00 h)</li>
        <li>Bancos: 10:00 h~14:00 h</li>
        <li>Farmacia: 9:30 h~13:30 h, 16:30 h~20:00 h (farmacia de guardia: abierta las 24 horas del día)</li>
        <li>Restaurantes: 13:30 h~15:30 h, 20:30 h~23:00 h</li>
        <li>Cafeterías y bares: 17:00 h~22:00 h</li></ul></div>
      ${tip('스페인은 점심(comida)을 <b>13:30~15:30</b>에 먹고, 저녁(cena)은 <b>20:30 이후</b>에 먹어요. 그래서 가게·약국은 점심시간에 문을 닫는 <b>horario partido</b>(쪼개진 영업시간)가 많아요.')}
      <h3 class="h3">① 장소 카드 — 눌러서 뜻을 확인하세요</h3><div class="fg"></div>
      <h3 class="h3">② 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요 (관사 포함 가능)</h3><div class="items two wl"></div>
      <h3 class="h3">③ 🕒 영업시간 그래프 — 막대를 움직여 시각을 바꿔 보세요</h3>
      <div class="tline-wrap"><div class="tl-ctl"><span class="tl-clk"></span><span class="tl-d"></span><span class="tl-t"></span>
        <input type="range" class="tl-rng" min="7" max="24" step="0.25" value="15"></div><div class="tline"></div></div>
      <h3 class="h3">④ ¿Está abierto o cerrado? — 그래프를 보고 고르세요</h3><div class="items two ch"></div>
      <h3 class="h3">⑤ 영업시간 질문에 답하세요</h3><div class="items wh"></div>`);
    put(s, '.fg', flipGrid(D.lugares.map(l => ({ e: l.e, es: l.es, kr: l.kr }))));
    D.lugares.forEach((l, i) => put(s, '.wl', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${l.e}</span> ${l.kr}`, answers: [l.es, `${l.art} ${l.es}`] })));
    /* 영업시간 타임라인 */
    const T0 = 7, T1 = 24, pct = x => (x - T0) / (T1 - T0) * 100;
    const fmt = x => `${pad(Math.floor(x))}:${pad(Math.round((x % 1) * 60))}`;
    let ticks = ''; for (let h = 8; h <= 24; h += 2) ticks += `<span style="left:${pct(h)}%">${h}</span>`;
    $('.tline', s).innerHTML = D.horarios.map(r => `<div class="tl-row ${r.meal ? 'meal' : ''}"><span class="tl-n">${r.e} <b>${r.n}</b><small>${r.kr}</small></span>
        <span class="tl-track">${r.seg.map(([a, b]) => `<i style="left:${pct(a)}%;width:${pct(b) - pct(a)}%" title="${fmt(a)}~${fmt(b)}"></i>`).join('')}<em class="tl-now"></em></span><span class="tl-st"></span></div>`).join('') +
      `<div class="tl-row axis"><span class="tl-n"></span><span class="tl-track ax">${ticks}<em class="tl-now"></em></span><span class="tl-st"></span></div>`;
    const upd = () => {
      const x = +$('.tl-rng', s).value, h = Math.floor(x), m = Math.round((x % 1) * 60);
      $('.tl-d', s).innerHTML = dclock(fmt(x));
      $('.tl-clk', s).innerHTML = clock(h, m);
      const part = h < 12 ? 'de la mañana' : h < 21 ? 'de la tarde' : 'de la noche';
      $('.tl-t', s).innerHTML = `<b>${horaAns(h % 24, m)[m === 0 ? 1 : 0].replace(/\.$/, '')} ${h === 24 ? '' : part}</b>`;
      $$('.tl-now', s).forEach(n => n.style.left = pct(x) + '%');
      $$('.tl-row:not(.axis)', s).forEach((row, i) => {
        const open = D.horarios[i].seg.some(([a, b]) => x >= a && x < b);
        row.classList.toggle('open', open);
        $('.tl-st', row).innerHTML = D.horarios[i].meal ? (open ? '🍴' : '') : open ? '🟢 abierto' : '🔴 cerrado';
      });
    };
    $('.tl-rng', s).oninput = upd; upd();
    [['15:00', 'Son las tres de la tarde. ¿Está abierto el banco?', 'No, está cerrado.'],
      ['15:00', 'Son las tres de la tarde. ¿Está abierta la tienda?', 'No, está cerrada.'],
      ['20:30', 'Son las ocho y media de la tarde. ¿Está abierto el supermercado?', 'Sí, está abierto.'],
            ['23:00', 'Son las once de la noche. ¿Está abierto el bar?', 'No, está cerrado.']].forEach(([t, q, a], i) => {
      const f = /abierta/.test(q) ? 'a' : 'o';
      put(s, '.ch', choiceItem({ id: 'voc-ch' + i, sec: 'vocab', skill: 'voc', prompt: `${dclock(t)} ${q}`, options: [`Sí, está abiert${f}.`, `No, está cerrad${f}.`], answer: a }));
    });
    [['🏦 ¿A qué hora abren los bancos?', withT(['Abren {T}.', '{T}.', 'Los bancos abren {T}.'], 10, 0, 'de la mañana')],
      ['🏪 ¿A qué hora cierran las tiendas por la tarde?', withT(['Cierran {T}.', '{T}.', 'Las tiendas cierran {T}.'], 8, 0, 'de la tarde')],
      ['🍽️ ¿A qué hora cierran los restaurantes por la noche?', withT(['Cierran {T}.', '{T}.', 'Los restaurantes cierran {T}.'], 11, 0, 'de la noche')]]
      .forEach(([p, a], i) => put(s, '.wh', writeItem({ id: 'voc-w' + i, sec: 'vocab', skill: 'hor', prompt: `${p} ${say(p.replace(/^\S+ /, ''))}`, ph: 'Abren a las …', answers: a })));
  };

  /* ================= Gramática ================= */
  const RUT = [
    { e: '⏰', es: 'despertarse', kr: '잠에서 깨다 (e→ie)' }, { e: '🛏️', es: 'levantarse', kr: '일어나다' },
    { e: '🚿', es: 'ducharse', kr: '샤워하다' }, { e: '🛁', es: 'bañarse', kr: '목욕하다' },
    { e: '🧼', es: 'lavarse la cara', kr: '세수하다' }, { e: '🪥', es: 'cepillarse los dientes', kr: '이를 닦다' },
    { e: '💇', es: 'peinarse', kr: '머리를 빗다' }, { e: '🪒', es: 'afeitarse', kr: '면도하다' },
    { e: '👔', es: 'vestirse', kr: '옷을 입다 (e→i)' }, { e: '👟', es: 'ponerse los zapatos', kr: '신발을 신다' },
    { e: '👕', es: 'quitarse la camisa', kr: '셔츠를 벗다' }, { e: '🛌', es: 'acostarse', kr: '잠자리에 들다 (o→ue)' }
  ];
  const FREQ_ORDER = ['siempre', 'casi siempre', 'a menudo', 'a veces', 'casi nunca', 'nunca'];
  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 시각 말하기 — ¿Qué hora es?</h3>
        <div class="blocks"><span class="bk v">Es</span><span class="bk p">la</span><span class="bk s">una</span><span class="bk o">y media</span><span class="small">1시만 단수!</span></div>
        <div class="blocks"><span class="bk v">Son</span><span class="bk p">las</span><span class="bk s">dos · tres … doce</span><span class="bk o">y cuarto / menos diez</span></div>
        <div class="clkface-demo"></div>
        ${tip('30분까지는 <b>y</b>(더하기), 31분부터는 다음 시각에서 <b>menos</b>(빼기): 7:45 = Son las <b>ocho menos cuarto</b>.<br>정각은 <b>en punto</b> · 15분은 <b>cuarto</b> · 30분은 <b>media</b>. 오전/오후는 <b>de la mañana / de la tarde / de la noche</b>.')}
        <div class="items two g1"></div>
        <h3 class="h3">⏱ 시계 맞추기 — 문장에 맞게 시곗바늘을 돌리세요</h3><div class="setclk"></div>
        <div class="g1c"></div></div>
      <div class="gcard"><h3>2. 재귀대명사 (Pronombres reflexivos) — "나 자신을"</h3>
        <div class="blocks"><span class="bk p">(Yo)</span><span class="bk o">me</span><span class="bk v">levanto</span><span class="bk s">a las siete</span></div>
        <div class="legend-mini"><span class="bk p">주어 (생략 가능)</span><span class="bk o">재귀대명사</span><span class="bk v">동사 (주어에 맞게)</span></div>
        ${tip('동사원형은 <b>levantar<u>se</u></b>처럼 끝에 -se가 붙어요. 활용할 때는 se를 떼어 <b>동사 앞</b>으로: me · te · se · nos · os · se.<br>levantar(누군가를 일으키다) ↔ <b>levantarse</b>(내가 일어나다)')}
        <div class="g2a"></div></div>
      <div class="gcard"><h3>3. 일과 재귀동사 (Verbos reflexivos)</h3>
        <div class="fg2"></div>
        ${tip('몸의 부위에는 소유사 대신 <b>정관사</b>: Me lavo <b>la</b> cara (✕ mi cara) · Me cepillo <b>los</b> dientes.')}
        <div class="items two g3"></div></div>
      <div class="gcard"><h3>4. 일과에 자주 쓰는 불규칙 동사</h3>
        <table class="dt irr"><tr><th>동사원형</th><th>yo</th><th>특징</th></tr>
          <tr><td>empezar</td><td>empiezo · empiezan</td><td>e → ie</td></tr><tr><td>volver</td><td>vuelvo</td><td>o → ue</td></tr>
          <tr><td>dormir</td><td>duermo</td><td>o → ue</td></tr><tr><td>acostarse</td><td>me acuesto</td><td>o → ue</td></tr>
          <tr><td>salir · hacer · poner</td><td>salgo · hago · pongo</td><td>yo 형 -go</td></tr><tr><td>fregar</td><td>friego</td><td>e → ie</td></tr></table>
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 빈도 표현 (Expresiones de frecuencia)</h3>
        <div class="freq">${[['siempre', '항상', 100], ['casi siempre', '거의 항상', 90], ['todos los días / cada día', '매일', 85], ['normalmente / generalmente', '보통', 75], ['a menudo', '자주', 60], ['a veces', '가끔', 42], ['de vez en cuando', '이따금', 30], ['casi nunca', '거의 ~않다', 12], ['nunca', '전혀 ~않다', 2]]
          .map(([e, k, p]) => `<div class="fr"><span class="fl">${e} ${say(e.split(' / ')[0])}</span><span class="fbar"><i style="width:${p}%"></i></span><span class="fk">${k}</span></div>`).join('')}</div>
        <div class="blocks"><span class="bk s">una vez</span><span class="bk s">dos veces</span><span class="bk o">al día · a la semana · al mes · al año</span><span class="small">하루에/일주일에/한 달에/일 년에 한 번·두 번</span></div>
        ${tip('<b>nunca</b>가 동사 앞이면 no 없이: <b>Nunca</b> voy al cine. / 동사 뒤면 no와 함께: <b>No</b> voy <b>nunca</b> al cine.<br>질문: <b>¿Con qué frecuencia</b> haces deporte?')}
        <div class="item sortq"><div class="item-p">자주 하는 순서대로 누르세요 (많이 → 적게)</div><div class="sort-line"></div><div class="sort-bank"></div><div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">확인</button><span class="mkbox"></span></div></div>
        <div class="items g5"></div></div>
      <div class="gcard"><h3>6. 요일 (Días de la semana)</h3>
        ${tip('요일은 <b>소문자</b>로 써요. <b>el lunes</b> = 이번 월요일에 / <b>los lunes</b> = 매주 월요일마다. sábado·domingo 만 복수형에 -s: los sábados, los domingos.')}
        <div class="g6"></div></div>`);
    /* 1. 시각 */
    $('.clkface-demo', s).innerHTML = [[1, 0], [2, 15], [3, 30], [4, 45], [5, 10], [6, 40]].map(([h, m]) => `<div class="cd">${clock(h, m)}<b>${horaAns(h, m)[0]}</b>${say(horaAns(h, m)[0])}</div>`).join('');
    [[3, 0], [1, 15], [9, 45], [12, 35]].forEach(([h, m], i) =>
      put(s, '.g1', writeItem({ id: 'g1-' + i, sec: 'gram', skill: 'hor', prompt: `<span class="clk-sm">${clock(h, m)}</span> ¿Qué hora es?`, ph: 'Son las …', answers: horaAns(h, m) })));
    /* 시계 맞추기 위젯 */
    const SET = [['Son las tres y cuarto.', 3, 15], ['Es la una menos diez.', 12, 50], ['Son las cuatro menos cuarto.', 3, 45]];
    const sv = sel('g1set', {});
    SET.forEach(([t, h, m], i) => {
      reg('g1s-' + i, 'gram', 'hor');
      const st = sv[i] || (sv[i] = { h: 12, m: 0 });
      const box = el(`<div class="sc"><div class="sc-q">${i + 1}) ${t} ${say(t)}</div><div class="sc-face"></div>
        <div class="sc-btn"><button class="btn ghost sm" data-k="h-">− 시</button><button class="btn ghost sm" data-k="h+">+ 시</button><button class="btn ghost sm" data-k="m-">− 5분</button><button class="btn ghost sm" data-k="m+">+ 5분</button></div>
        <div class="item-row"><span class="sc-d"></span><button class="btn chk">확인</button><span class="mkbox"></span></div></div>`);
      const draw = () => { $('.sc-face', box).innerHTML = clock(st.h, st.m); $('.sc-d', box).innerHTML = dclock(`${pad(st.h)}:${pad(st.m)}`); };
      $$('[data-k]', box).forEach(b => b.onclick = () => {
        const k = b.dataset.k;
        if (k === 'h+') st.h = st.h % 12 + 1; if (k === 'h-') st.h = (st.h + 10) % 12 + 1;
        if (k === 'm+') st.m = (st.m + 5) % 60; if (k === 'm-') st.m = (st.m + 55) % 60;
        save(); draw();
      });
      $('.chk', box).onclick = () => {
        const ok = st.h % 12 === h % 12 && st.m === m;
        record('g1s-' + i, ok ? 1 : 0, ok ? [] : ['otro'], {});
        $('.mkbox', box).innerHTML = MARK(ok ? 1 : 0) + (ok ? '' : ` <span class="ans">${pad(h)}:${pad(m)}</span>`);
      };
      const prev = SC.items()['g1s-' + i]; if (prev) $('.mkbox', box).innerHTML = MARK(prev.last);
      draw(); put(s, '.setclk', box);
    });
    put(s, '.g1c', cloze({ id: 'g1c', sec: 'gram', skill: 'hor', cls: 'lines', title: '빈칸을 채우세요.', text: [
      '¿Qué hora es? — [Es] la una.', '¿A qué hora te levantas? — Me levanto [a] las siete.',
      `${dclock('22:00')} Son las diez de la [noche].`].map(x => `<p>${x}</p>`).join('') }));
    /* 2. 재귀대명사 표 */
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'ref', cls: 'table2', title: 'levantarse 활용표를 완성하세요.', text:
      [['yo', 'me levanto'], ['tú', 'te levantas'], ['él / ella / usted', 'se levanta'], ['nosotros/as', 'nos levantamos'], ['vosotros/as', 'os levantáis'], ['ellos / ellas / ustedes', 'se levantan']]
        .map(([a, b]) => `<p><span>${a}</span> [${b}]</p>`).join('') }));
    /* 3. 재귀동사 */
    put(s, '.fg2', flipGrid(RUT));
    [['🚿 ducharse', 'yo', ['Me ducho.', 'Yo me ducho.']], ['🪥 cepillarse los dientes', 'nosotros', ['Nos cepillamos los dientes.', 'Nosotros nos cepillamos los dientes.']],
      ['🛌 acostarse', 'mi padre', ['Mi padre se acuesta.']], ['🧼 lavarse la cara', 'tú (질문)', ['¿Te lavas la cara?']]]
      .forEach(([v, p, a], i) => put(s, '.g3', writeItem({ id: 'g3-' + i, sec: 'gram', skill: 'ref', prompt: `${v} → <b>${p}</b>`, answers: a })));
    /* 4. 불규칙 동사 */
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'rut', cls: 'lines', title: '괄호 안의 동사를 알맞게 바꾸세요.', text: [
      'Yo [salgo] de casa a las siete. <i>(salir)</i>', 'Las clases [empiezan] a las nueve. <i>(empezar)</i>',
      'Yo [vuelvo] a casa a las seis. <i>(volver)</i>', 'Yo [duermo] ocho horas. <i>(dormir)</i>', 'Me [acuesto] a medianoche. <i>(acostarse)</i>'].map(x => `<p>${x}</p>`).join('') }));
    /* 5. 빈도 정렬 */
    reg('g5-sort', 'gram', 'fre');
    const sq = $('.sortq', s); let ord = [];
    const draw = () => {
      ord = []; $('.sort-line', sq).innerHTML = '';
      $('.sort-bank', sq).innerHTML = shuffle(FREQ_ORDER).map(f => `<button class="tok">${f}</button>`).join('');
      $$('.sort-bank .tok', sq).forEach(b => b.onclick = () => { if (b.disabled) return; b.disabled = true; ord.push(b.textContent); $('.sort-line', sq).insertAdjacentHTML('beforeend', `<span class="tok in">${ord.length}. ${b.textContent}</span>`); });
    };
    draw();
    $('.rst', sq).onclick = draw;
    $('.chk', sq).onclick = () => { if (ord.length < FREQ_ORDER.length) return; const ok = ord.join() === FREQ_ORDER.join(); record('g5-sort', ok ? 1 : 0, ok ? [] : ['otro'], {}); $('.mkbox', sq).innerHTML = MARK(ok ? 1 : 0) + (ok ? '' : ` <span class="ans">${FREQ_ORDER.join(' › ')}</span>`); };
    [['"No voy nunca al cine." → <b>nunca</b>를 문장 맨 앞으로', ['Nunca voy al cine.']],
      ['"Nunca como carne." → <b>nunca</b>를 동사 뒤로 (no 필요!)', ['No como nunca carne.', 'No como carne nunca.']],
      ['나는 일주일에 두 번 운동을 해. <span class="small">(hacer deporte)</span>', ['Hago deporte dos veces a la semana.', 'Hago deporte dos veces por semana.', 'Dos veces a la semana hago deporte.']]]
      .forEach(([p, a], i) => put(s, '.g5', writeItem({ id: 'g5-' + i, sec: 'gram', skill: 'fre', prompt: p, answers: a })));
    /* 6. 요일 */
    put(s, '.g6', cloze({ id: 'g6', sec: 'gram', skill: 'hor', cls: 'lines days', title: '월요일부터 일요일까지 순서대로 쓰세요.', text:
      '<p>lunes › [martes] › [miércoles] › [jueves] › [viernes] › [sábado] › [domingo]</p>' }));
  };

  /* ================= Diálogo 1 ================= */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Roberto habla con Rocío en una cafetería.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 들은 말을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">🕖 로베르토의 아침 타임라인 — 3인칭(él)으로 동사를 쓰세요</h3><div class="d1t"></div>
      <h3 class="h3">✍️ 내용 확인 — 질문에 문장으로 답하세요</h3><div class="items two d1q"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">de vez en cuando</span><span class="hlc c1">aproximadamente</span><span class="hlc c2">comienzan</span><span class="hlc c0">cada día</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    hideBtn(s, '#hide1', '#d1txt', '본문 가리기', '본문 보기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'rut', cls: 'lines', text: [
      '<b class="who">Rocío:</b> ¿A qué hora te levantas?', '<b class="who">Roberto:</b> Me [levanto] a las siete en punto y después me [ducho].',
      '<b class="who">Roberto:</b> Normalmente desayuno con mis padres y mi hermano a las ocho menos cuarto. Casi siempre tomo leche y tostadas, pero [a veces], tomo cereales con leche.',
      '<b class="who">Roberto:</b> Mi hermano y yo nos vamos al colegio. Salimos de casa a las ocho y media [más o menos] y siempre vamos andando.',
      '<b class="who">Roberto:</b> A las nueve menos diez llego al colegio. Las clases [empiezan] [todos los días] a las nueve.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.d1t', cloze({ id: 'd1t', sec: 'd1', skill: 'ref', cls: 'tlc', text: [
      [7, 0, 'Se [levanta] y se [ducha].'], [7, 45, '[Desayuna] con sus padres.'], [8, 30, 'Roberto y su hermano [salen] de casa.'],
      [8, 50, '[Llega] al colegio.'], [9, 0, 'Las clases [empiezan|comienzan].']]
      .map(([h, m, t]) => `<div class="tc">${clock(h, m)}${dclock(`${pad(h)}:${pad(m)}`)}<p>${t}</p></div>`).join('') }));
    [['¿A qué hora se levanta Roberto?', withT(['Se levanta {T}.', 'Roberto se levanta {T}.', '{T}.'], 7, 0)],
      ['¿Cómo van al colegio Roberto y su hermano?', ['Van andando.', 'Siempre van andando.', 'Van al colegio andando.', 'Siempre van al colegio andando.', 'Andando.']],
      ['¿A qué hora empiezan las clases?', withT(['Empiezan {T}.', 'Las clases empiezan {T}.', '{T}.'], 9, 0)]]
      .forEach(([q, a], i) => put(s, '.d1q', writeItem({ id: 'd1q-' + i, sec: 'd1', skill: i % 3 ? 'rut' : 'hor', prompt: `${q} ${say(q)}`, answers: a })));
    [['Casi siempre tomo leche y tostadas, pero <u>a veces</u> tomo cereales con leche.', 'de vez en cuando', ['Casi siempre tomo leche y tostadas, pero de vez en cuando tomo cereales con leche.']],
      ['Salimos de casa a las ocho y media <u>más o menos</u>.', 'aproximadamente', ['Salimos de casa a las ocho y media aproximadamente.', 'Salimos de casa aproximadamente a las ocho y media.']],
      ['Las clases <u>empiezan</u> a las nueve.', 'comienzan', ['Las clases comienzan a las nueve.']],
      ['Las clases empiezan <u>todos los días</u> a las nueve.', 'cada día', ['Las clases empiezan cada día a las nueve.', 'Cada día las clases empiezan a las nueve.', 'Las clases empiezan a las nueve cada día.']]]
      .forEach(([p, k, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: i === 2 ? 'rut' : 'fre', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '친구와 아침 일과에 대해 묻고 답하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¿A qué hora te levantas?\nB: Me levanto a las …',
      must: [{ re: '¿\\s*a qu[eé] hora', label: '¿A qué hora …? 질문' }, { re: W0 + 'me (levanto|ducho|despierto|visto|lavo|peino|acuesto)' + W1, label: '재귀동사 1인칭 (me levanto / me ducho …)' },
        { re: W0 + 'a la una|a las (dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|\\d+)' + W1, label: 'a las + 시각' }, { re: FREQ, label: '빈도 표현 (siempre, a veces …)' },
        { re: '(de vez en cuando|aproximadamente|comienzan?|cada d[ií]a)', label: 'b)의 표현 1개 이상' }],
      model: 'A: ¿A qué hora te levantas? B: Me levanto a las seis y media y después me ducho. A: ¿Y desayunas en casa? B: Sí, casi siempre tomo pan y leche, pero de vez en cuando tomo fruta. Salgo de casa a las siete y media aproximadamente.' }));
  };

  /* ================= Actividad 1 — 시계 연결 ================= */
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Une cada reloj con su hora correspondiente.', { kr: '문장 옆의 알파벳 버튼을 눌러 알맞은 시계를 고르세요.' })}
      <div class="a1-wrap"><div class="a1-list"></div><div class="a1-clocks"></div></div>
      <div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk m">채점하기</button><span class="mscore"></span></div>
      <h3 class="h3">✍️ 디지털 시계를 보고 시각을 스페인어로 쓰세요</h3><div class="items two w1"></div>`);
    const LET = 'abcdefgh', st = sel('a1m');
    D.act1.forEach((x, i) => reg('a1-m' + i, 'a1', 'hor'));
    $('.a1-clocks', s).innerHTML = D.relojes.map(([h, m], j) => `<div class="a1c" data-j="${j}"><span class="lt">${LET[j]}.</span>${clock(h, m)}<span class="who-l"></span></div>`).join('');
    $('.a1-list', s).innerHTML = D.act1.map(([t], i) => `<div class="a1r" data-i="${i}"><span class="a1t">${i + 1}) ${t} ${say(t)}</span><span class="tg">${[...LET].map((l, j) => `<button data-j="${j}">${l}</button>`).join('')}</span><span class="mkbox"></span></div>`).join('');
    const paint = () => {
      $$('.a1r', s).forEach(r => $$('.tg button', r).forEach(b => b.classList.toggle('on', st[r.dataset.i] === +b.dataset.j)));
      $$('.a1c', s).forEach(c => { const i = Object.keys(st).find(k => st[k] === +c.dataset.j); $('.who-l', c).textContent = i != null ? `← ${+i + 1})` : ''; c.classList.toggle('on', i != null); });
    };
    $$('.a1r', s).forEach(r => $$('.tg button', r).forEach(b => b.onclick = () => {
      const j = +b.dataset.j; Object.keys(st).forEach(k => { if (st[k] === j) delete st[k]; }); st[r.dataset.i] = j; save(); paint();
    }));
    $('.rst', s).onclick = () => { Object.keys(st).forEach(k => delete st[k]); save(); $$('.a1r .mkbox', s).forEach(m => m.innerHTML = ''); $('.mscore', s).innerHTML = ''; paint(); };
    $('.m', s).onclick = () => {
      let ok = 0;
      D.act1.forEach(([t, j], i) => { const g = st[i] === j; if (g) ok++; record('a1-m' + i, g ? 1 : 0, g ? [] : ['otro'], {}); $(`.a1r[data-i="${i}"] .mkbox`, s).innerHTML = MARK(g ? 1 : 0) + (g ? '' : ` <span class="ans">${LET[j]}</span>`); });
      $('.mscore', s).innerHTML = `${MARK(ok / 8)} <b>${ok} / 8</b>`;
    };
    paint();
    [[3, 10], [12, 0], [1, 45], [6, 35]].forEach(([h, m], i) =>
      put(s, '.w1', writeItem({ id: 'a1-w' + i, sec: 'a1', skill: 'hor', prompt: `${dclock(`${pad(h)}:${pad(m)}`)} ¿Qué hora es?`, ph: 'Son las …', answers: horaAns(h, m) })));
  };

  /* ================= Actividad 2 — 빈도표 ================= */
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'a) ¿Cuándo haces estas cosas? Señálalo con un círculo(○).', { kr: '각 줄에서 나에게 맞는 칸을 하나씩 누르세요. 아래에 나의 생활 습관 그래프가 그려져요.' })}
      <div class="ftab-wrap"><table class="ftab"></table></div>
      <h3 class="h3">📊 나의 생활 습관 그래프</h3><div class="freq a2g"></div>
      <h2 class="act-title">b) Habla con tus compañeros utilizando las frases de a) como en el modelo.</h2>
      ${modelo('A: ¿Con qué frecuencia comes fuera de casa?<br>B: A veces como fuera de casa con mis amigos.')}
      <h3 class="h3">✍️ 질문 쓰기 — ¿Con qué frecuencia …? (tú 형으로)</h3><div class="items two q2"></div>
      <h3 class="h3">✍️ 대답 쓰기 — 표에서 고른 칸대로 4문장 이상 (1인칭)</h3><div class="f2"></div>`);
    const st = sel('a2', {});
    const tb = $('.ftab', s);
    const paint = () => {
      tb.innerHTML = `<tr><th></th>${D.a2cols.map(c => `<th>${c.es}</th>`).join('')}</tr>` + D.a2rows.map((r, i) => `<tr><th>${r.es}</th>${D.a2cols.map((c, j) => `<td data-i="${i}" data-j="${j}">${st[i] === j ? '<span class="circ">○</span>' : ''}</td>`).join('')}</tr>`).join('');
      $$('td', tb).forEach(td => td.onclick = () => { const i = td.dataset.i, j = +td.dataset.j; if (st[i] === j) delete st[i]; else st[i] = j; save(); paint(); });
      $('.a2g', s).innerHTML = D.a2rows.map((r, i) => { const c = D.a2cols[st[i]]; return `<div class="fr"><span class="fl">${r.es.replace(/<small>.*<\/small>/, '')}</span><span class="fbar"><i style="width:${c ? c.w : 0}%"></i></span><span class="fk">${c ? c.es : '—'}</span></div>`; }).join('');
    };
    paint();
    [['dormir ocho horas', '¿Con qué frecuencia duermes ocho horas?'], ['ver la televisión', '¿Con qué frecuencia ves la televisión?'],
      ['hacer deporte', '¿Con qué frecuencia haces deporte?'], ['visitar a tus familiares', '¿Con qué frecuencia visitas a tus familiares?']]
      .forEach(([k, a], i) => put(s, '.q2', writeItem({ id: 'a2-q' + i, sec: 'a2', skill: 'fre', prompt: `<span class="chip">${k}</span>`, ph: '¿Con qué frecuencia …?', answers: [a] })));
    put(s, '.f2', freeItem({ id: 'a2-f', sec: 'a2', skill: 'fre', rows: 5, ph: 'A veces ceno fuera de casa con mis amigos. Nunca escribo cartas.',
      needMsg: '먼저 표에서 4줄 이상 ○를 표시하세요.',
      must: () => {
        const rows = Object.keys(st).map(Number);
        if (rows.length < 4) return null;
        return rows.map(i => {
          const r = D.a2rows[i], c = D.a2cols[st[i]];
          return { re: `(${c.re})[^.!?\\n]*${r.v}|${r.v}[^.!?\\n]*(${c.re})`, label: `${r.es.replace(/<small>.*<\/small>/, '')} + ${c.es.toLowerCase()}` };
        });
      },
      model: 'Los fines de semana me levanto tarde. Duermo ocho horas a menudo. Voy al colegio andando todos los días. A veces ceno fuera de casa con mis amigos. Nunca escribo cartas.' }));
  };

  /* ================= Actividad 3 — 집안일 ================= */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, '¿Ayudas en casa? Di con qué frecuencia. Pregunta a tus compañeros.')}
      <div class="ybox wordbank">${D.tareas.map(t => `<span>${t.es}</span>`).join('')}</div>
      <div class="mp3"></div>
      ${modelo('Yo ordeno mi habitación a menudo. Y tú, ¿con qué frecuencia ordenas la habitación?')}
      ${tip('<b>fregar</b>는 e → ie: yo <b>friego</b>, tú <b>friegas</b>. <b>hacer · poner</b>는 yo 형이 <b>hago · pongo</b>.')}
      <h3 class="h3">✍️ 친구에게 묻는 질문 쓰기</h3><div class="items two q3"></div>
      <h3 class="h3">✍️ 나는 집안일을 얼마나 자주 하나요? — 3가지 이상</h3><div class="f3"></div>`);
    put(s, '.mp3', matchPics({ id: 'a3m', sec: 'a3', skill: 'tar', cols: 6, title: '그림에 알맞은 집안일 표현을 연결하세요.', items: D.tareas.map(t => ({ e: t.e, es: t.es, cap: t.kr })) }));
    D.tareas.forEach((t, i) => i % 2 && put(s, '.q3', writeItem({ id: 'a3-q' + i, sec: 'a3', skill: 'tar', prompt: `${t.e} <span class="chip">${t.es}</span>`, ph: '¿Con qué frecuencia …?', answers: [`¿Con qué frecuencia ${t.tu}?`, ...(i === 4 ? ['¿Con qué frecuencia ordenas tu habitación?'] : [])] })));
    put(s, '.f3', freeItem({ id: 'a3-f', sec: 'a3', skill: 'tar', rows: 4, ph: 'Yo hago la cama todos los días. A veces friego los platos …',
      must: [{ re: W0 + '(' + D.tareas.map(t => t.yo).join('|') + ')' + W1, label: '집안일 동사 1인칭 3번 (plancho, hago la cama, pongo la mesa, barro, ordeno, friego)', min: 3 },
        { re: FREQ, label: '빈도 표현 3번', min: 3 }],
      model: 'Yo hago la cama todos los días. A veces pongo la mesa y friego los platos después de cenar. Nunca plancho, porque mi madre plancha la ropa.' }));
  };

  /* ================= Actividad 4 — 시간표 ================= */
  B.a4 = () => {
    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const table = `<table class="sched"><tr><th></th>${DAYS.map(d => `<th>${d}</th>`).join('')}</tr>${D.tablaA4.map((r, i) => `<tr><th>${D.horasA4[i]}</th>${typeof r === 'string' ? `<td colspan="5" class="rec">${r}</td>` :
      r.map(c => c === '#' ? '<td class="gray"></td>' : /^\(\d\)/.test(c) ? `<td class="bl"><small>${c.slice(0, 3)}</small>${c.slice(3)}</td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
    const s = sec('a4', `${actHead(4, 'a) Escucha el horario de Pedro y escribe las asignaturas correspondientes en los huecos.', { listen: true })}
      <h3 class="h3"><button class="btn ghost sm" id="play4">▶ 페드로의 말 듣기</button> <button class="btn ghost sm" id="show4">대본 보기</button></h3>
      <div id="s4" class="script blur"><p>${D.script4}</p></div>
      <div class="sch"></div>
      <h2 class="act-title">b) Escucha de nuevo y contesta.</h2><div class="items b4"></div>
      <h3 class="h3">⭐ 시간표 더 읽기</h3><div class="items two c4"></div>`);
    $('#play4', s).onclick = e => speak(D.script4, e.currentTarget);
    hideBtn(s, '#show4', '#s4', '대본 가리기', '대본 보기');
    $('#show4', s).textContent = '대본 보기';
    put(s, '.sch', cloze({ id: 'a4t', sec: 'a4', skill: 'hor', cls: 'schc', text: table }));
    [['1) ¿Qué días de la semana tiene Pedro Matemáticas?', ['Tiene el lunes, el martes y el jueves.', 'Tiene matemáticas el lunes, el martes y el jueves.', 'El lunes, el martes y el jueves.', 'Los lunes, los martes y los jueves.', 'Tiene matemáticas los lunes, los martes y los jueves.', 'Pedro tiene matemáticas el lunes, el martes y el jueves.']],
      ['2-a) ¿A qué hora tiene Pedro clase de Lengua Española <u>los lunes</u>?', withT(['{T}.', 'Tiene clase de lengua española {T}.', 'Los lunes {T}.', 'La tiene {T}.'], 10, 0, 'de la mañana')],
      ['2-b) ¿Y <u>los martes y viernes</u>?', withT(['{T}.', 'Tiene clase de lengua española {T}.', 'Los martes y viernes {T}.', 'La tiene {T}.'], 11, 0, 'de la mañana')],
      ['3) ¿Qué asignatura tiene Pedro después de Historia los miércoles?', ['Tiene francés.', 'Francés.', 'Después de historia tiene francés.', 'Los miércoles después de historia tiene francés.', 'Pedro tiene francés.']]]
      .forEach(([q, a], i) => put(s, '.b4', writeItem({ id: 'a4-b' + i, sec: 'a4', skill: 'hor', prompt: q, answers: a })));
    [['¿Qué asignatura tiene Pedro el viernes a las nueve?', ['Historia', 'Inglés', 'Música'], 'Historia'],
      ['¿A qué hora es el recreo?', ['A las doce', 'A las once', 'A las doce y media'], 'A las doce'],
      ['¿Qué día tiene Pedro Francés a las dos y cuarto?', ['El lunes', 'El miércoles', 'El viernes'], 'El lunes']]
      .forEach(([q, o, a], i) => put(s, '.c4', choiceItem({ id: 'a4-c' + i, sec: 'a4', skill: 'hor', prompt: q, options: o, answer: a })));
  };

  /* ================= Diálogo 2 ================= */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Dos amigos hablan sobre la rutina diaria. Óscar le cuenta a Paula lo que hace normalmente.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 오스카르의 하루</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">🕕 오스카르의 하루 타임라인 — 3인칭(él)으로 쓰세요</h3><div class="d2t"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">en general</span><span class="hlc c1">acaban</span><span class="hlc c2">vuelvo</span><span class="hlc c0">a las doce de la noche</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) Y tú, ¿qué haces en un día normal? — 나의 하루 쓰기</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    hideBtn(s, '#hide2', '#d2txt', '본문 가리기', '본문 보기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'ref', cls: 'lines', text: [
      'Generalmente, me [levanto] a las seis de la mañana. Después me [lavo] la cara, me [peino], desayuno y me [cepillo] los dientes.',
      'Salgo de casa a las siete de la mañana y llego a la escuela a las ocho. Mis clases empiezan a las ocho y media de la mañana y [terminan] a las cuatro y media de la tarde.',
      'Generalmente, juego al fútbol con mis amigos. [Regreso] a casa a las seis y media de la tarde. Ceno con mi familia, reviso mis correos electrónicos y veo la televisión. Normalmente, me [acuesto] a [medianoche].'].map(x => `<p>${x}</p>`).join('') }));
    [['Óscar se levanta a las seis de la mañana.', 'Verdadero'], ['Óscar sale de casa a las ocho de la mañana.', 'Falso'],
      ['Las clases de Óscar terminan a las cuatro y media de la tarde.', 'Verdadero'], ['Óscar se acuesta a las diez de la noche.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'rut', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.d2t', cloze({ id: 'd2t', sec: 'd2', skill: 'ref', cls: 'tlc', text: [
      [6, 0, 'Se [levanta].'], [7, 0, '[Sale] de casa.'], [8, 30, 'Sus clases [empiezan|comienzan].'],
      [16, 30, 'Sus clases [terminan|acaban].'], [18, 30, '[Regresa|Vuelve] a casa.'], [0, 0, 'Se [acuesta].']]
      .map(([h, m, t]) => `<div class="tc">${clock(h, m)}${dclock(`${pad(h)}:${pad(m)}`)}<p>${t}</p></div>`).join('') }));
    [['<u>Generalmente</u>, me levanto a las seis de la mañana.', 'en general', ['En general, me levanto a las seis de la mañana.', 'En general me levanto a las seis de la mañana.']],
      ['Mis clases <u>terminan</u> a las cuatro y media de la tarde.', 'acaban', ['Mis clases acaban a las cuatro y media de la tarde.']],
      ['<u>Regreso</u> a casa a las seis y media de la tarde.', 'vuelvo', ['Vuelvo a casa a las seis y media de la tarde.']],
      ['Normalmente, me acuesto a <u>medianoche</u>.', 'a las doce de la noche', ['Normalmente, me acuesto a las doce de la noche.', 'Normalmente me acuesto a las doce de la noche.']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: i === 0 ? 'fre' : 'rut', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 6, minWords: 35, prompt: '오스카르처럼 나의 평범한 하루를 시간 순서대로 쓰세요.',
      ph: 'Generalmente, me levanto a las … Después me ducho …',
      must: [{ re: W0 + 'me (levanto|despierto)' + W1, label: 'me levanto / me despierto' }, { re: W0 + 'me (ducho|ba[nñ]o|lavo|peino|cepillo|visto)' + W1, label: '몸단장 재귀동사 1개 이상' },
        { re: W0 + 'me acuesto' + W1, label: 'me acuesto' }, { re: W0 + '(salgo|vuelvo|regreso|llego)' + W1, label: 'salgo / llego / vuelvo' },
        { re: W0 + 'a la una|a las (dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)' + W1, label: '시각 3번 이상 (a las …)', min: 3 },
        { re: W0 + '(despu[eé]s|luego)' + W1, label: 'después / luego' }],
      model: 'Generalmente, me levanto a las siete menos cuarto. Después me ducho, me visto y desayuno con mi familia. Salgo de casa a las siete y media y llego al colegio a las ocho. Las clases terminan a las tres y media. Luego vuelvo a casa, hago los deberes y veo la televisión. Normalmente me acuesto a las once.' }));
  };

  /* ================= Actividad 5 — 그림 묘사 ================= */
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Describe los siguientes dibujos siguiendo el modelo.')}
      ${modelo('1) Él se quita la camisa y ella se pone los zapatos.')}
      <h3 class="h3">① 그림에 알맞은 표현을 연결하세요 (3인칭)</h3><div class="mp5"></div>
      <h3 class="h3">② 두 그림을 한 문장으로 묘사하세요 — y / pero</h3><div class="items w5"></div>
      <h3 class="h3">③ 주어를 바꿔 쓰세요</h3><div class="items two c5"></div>`);
    const items = D.act5.flatMap((p, i) => [{ e: p.a.e, es: p.a.es, cap: `${i + 1}) 왼쪽` }, { e: p.b.e, es: p.b.es, cap: `${i + 1}) 오른쪽` }]);
    put(s, '.mp5', matchPics({ id: 'a5m', sec: 'a5', skill: 'ref', cols: 4, items }));
    D.act5.forEach((p, i) => put(s, '.w5', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: 'ref', prompt: `${i + 1}) <span class="pair5"><span>${p.a.e}</span><b>+</b><span>${p.b.e}</span></span>`, ph: 'Él se … y ella se …', answers: p.ans })));
    [['Ellos se bañan. → <b>nosotros</b>', ['Nos bañamos.', 'Nosotros nos bañamos.']], ['Ella se acuesta. → <b>tú</b>', ['Te acuestas.', 'Tú te acuestas.']]]
      .forEach(([p, a], i) => put(s, '.c5', writeItem({ id: 'a5-c' + i, sec: 'a5', skill: 'ref', prompt: p, answers: a })));
  };

  /* ================= Actividad 6 — 약국 ================= */
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Habla con tus compañeros.', { kr: '약국 안내판을 보고 질문에 문장으로 답하세요.' })}
      <div class="a6-wrap"><div class="farm"><b>La Farmacia</b><p>- Mañanas: de 9:00 a 14:00</p><p>- Tardes: de 16:00 a 20:00</p><p>- Domingos y festivos:<br>&nbsp;&nbsp;de 10:00 a 14:00</p></div>
        <div class="items b6"></div></div>
      <h3 class="h3">🟢 / 🔴 약국이 열려 있을까요?</h3><div class="items two c6"></div>
      <h3 class="h3">✍️ 내가 자주 가는 곳의 영업시간 안내문 쓰기</h3><div class="f6"></div>`);
    [['1) ¿A qué hora cierra la farmacia por la tarde?', withT(['Cierra {T}.', 'La farmacia cierra {T}.', '{T}.'], 8, 0, 'de la tarde')],
      ['2) ¿Qué horario tiene la farmacia durante los días festivos?', ['Abre a las diez y cierra a las dos.', 'Abre a las diez de la mañana y cierra a las dos de la tarde.', 'De diez a dos.', 'De las diez a las dos.', 'De 10:00 a 14:00.', 'Tiene horario de diez a dos.', 'Está abierta de diez a dos.', 'Está abierta de las diez a las dos.']],
      ['3) ¿Puedo ir a la farmacia a las tres de la tarde?', ['No, no puedes. La farmacia está cerrada a esa hora.', 'No, no puedes.', 'No, está cerrada.', 'No, no puedes, está cerrada.', 'No, la farmacia está cerrada a esa hora.', 'No, no puedes. Está cerrada.']]]
      .forEach(([q, a], i) => put(s, '.b6', writeItem({ id: 'a6-' + i, sec: 'a6', skill: i === 2 ? 'voc' : 'hor', prompt: `${q} ${say(q.slice(3))}`, answers: a })));
    [['lunes', 15, 0, false], ['martes', 18, 30, true], ['domingo', 11, 0, true], ['domingo', 17, 0, false]]
      .forEach(([d, h, m, open], i) => put(s, '.c6', choiceItem({ id: 'a6-c' + i, sec: 'a6', skill: 'voc', prompt: `<span class="clk-sm">${clock(h, m)}</span> ${dclock(`${pad(h)}:${pad(m)}`)} <b>${d}</b>`,
        options: ['Está abierta.', 'Está cerrada.'], answer: open ? 'Está abierta.' : 'Está cerrada.' })));
    put(s, '.f6', freeItem({ id: 'a6-f', sec: 'a6', rows: 3, prompt: '예: 학교 도서관, 동네 빵집, 체육관… 언제 열고 닫는지 2문장 이상 쓰세요.', ph: 'La biblioteca abre a las nueve y cierra a las seis. Los domingos está cerrada.',
      must: [{ re: W0 + '(abre|abren)' + W1, label: 'abre (열다)' }, { re: W0 + '(cierra|cierran)' + W1, label: 'cierra (닫다, e→ie)' }, { re: W0 + 'a la una|a las|de \\d+|de (nueve|diez|ocho|siete)', label: '시각' }],
      model: 'La biblioteca de mi colegio abre a las ocho de la mañana y cierra a las cinco de la tarde. Los sábados y domingos está cerrada.' }));
  };

  /* ================= Actividad 7 — 듣기 ================= */
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Escucha el texto y contesta.', { listen: true })}
      <h3 class="h3"><button class="btn ghost sm" id="play7">▶ 듣기</button> <button class="btn ghost sm" id="show7">대본 보기</button></h3>
      <div id="s7" class="script blur"><p>${D.script7}</p></div>
      <div class="items b7"></div>
      ${notice('📝 교재 질문 4)는 "los martes y jueves"인데, 듣기 대본에는 "Los martes y viernes"로 나와요. 정답은 교재 해답대로 "Tiene clases de piano en una academia."입니다.')}
      <h3 class="h3">✍️ 받아쓰기 — 다시 듣고 빈칸을 채우세요</h3><div class="c7"></div>`);
    $('#play7', s).onclick = e => speak(D.script7, e.currentTarget);
    hideBtn(s, '#show7', '#s7', '대본 가리기', '대본 보기');
    $('#show7', s).textContent = '대본 보기';
    [['1) ¿A qué hora va al colegio?', withT(['Va al colegio {T}.', 'Juan va al colegio {T}.', '{T}.', 'Va {T}.'], 8, 0, 'de la mañana')],
      ['2) ¿A qué hora empiezan las clases?', withT(['Las clases empiezan {T}.', 'Empiezan {T}.', '{T}.'], 8, 30, 'de la mañana')],
      ['3) ¿A qué hora terminan las clases?', withT(['Las clases terminan {T}.', 'Terminan {T}.', '{T}.'], 4, 0, 'de la tarde')],
      ['4) ¿Qué clase tiene los martes y jueves?', ['Tiene clases de piano en una academia.', 'Tiene clases de piano.', 'Tiene clase de piano en una academia.', 'Tiene clase de piano.', 'Clases de piano.', 'Piano.']],
      ['5) ¿Qué hace los fines de semana normalmente?', ['Queda con sus amigos para ir al cine o jugar al tenis.', 'Queda con sus amigos.', 'Va al cine o juega al tenis con sus amigos.', 'Normalmente queda con sus amigos para ir al cine o jugar al tenis.', 'Queda con sus amigos para ir al cine o para jugar al tenis.']]]
      .forEach(([q, a], i) => put(s, '.b7', writeItem({ id: 'a7-' + i, sec: 'a7', skill: i < 3 ? 'hor' : 'rut', prompt: `${q} ${say(q.slice(3))}`, answers: a })));
    put(s, '.c7', cloze({ id: 'a7c', sec: 'a7', skill: 'rut', cls: 'lines', text:
      '<p>Juan va al colegio a las ocho. Las clases [empiezan] a las ocho y [media]. Las clases [terminan] a las cuatro de la tarde. Los martes y viernes tiene clases de piano en una academia. Los fines de semana [queda] con sus amigos para ir al cine o [jugar] al tenis.</p>' }));
  };

  /* ================= Actividad 8 — 직업과 빈도 ================= */
  const PROF = [['👩‍⚕️', 'médico/a'], ['🧑‍✈️', 'piloto'], ['👨‍💼', 'empresario/a'], ['🧑‍🏫', 'profesor/a'], ['📰', 'periodista'], ['🧑‍💻', 'ingeniero/a']];
  const FOPT = ['todos los días', 'dos veces a la semana', 'una vez a la semana', 'una vez al mes', 'dos veces al año', 'a menudo', 'a veces', 'casi nunca', 'nunca'];
  const A8 = [
    { es: 'Ir al extranjero', q: '¿Con qué frecuencia vas al extranjero?', v: 'voy al extranjero', v3: 'va al extranjero' },
    { es: 'Comer con clientes', q: '¿Con qué frecuencia comes con clientes?', v: 'como con (los |mis )?clientes', v3: 'come con (los |sus )?clientes' },
    { es: 'Hablar con tu jefe', q: '¿Con qué frecuencia hablas con tu jefe?', v: 'hablo con mi jef[ea]', v3: 'habla con su jef[ea]' },
    { es: 'Hablar por teléfono', q: '¿Con qué frecuencia hablas por teléfono?', v: 'hablo por tel[eé]fono', v3: 'habla por tel[eé]fono' },
    { es: 'Dormir en otra ciudad', q: '¿Con qué frecuencia duermes en otra ciudad?', v: 'duermo en otra ciudad', v3: 'duerme en otra ciudad' }
  ];
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Imagina que tienes una profesión. ¿Con qué frecuencia haces estas cosas en tu trabajo? Habla con tus compañeros.')}
      <h3 class="h3">① 나의 직업 고르기</h3><div class="prof"></div>
      <h3 class="h3">② 표 채우기 — 나(tú)와 동료(tus compañeros)의 빈도를 고르세요 <button class="btn ghost sm" id="rnd8">🎲 가상 동료</button></h3>
      <table class="dt a8t"></table>
      ${modelo('A: ¿Con qué frecuencia vas al extranjero?<br>B: Una vez al mes.')}
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items two q8"></div>
      <h3 class="h3">✍️ 표에서 고른 대로 나의 대답 쓰기 (1인칭 + 빈도)</h3><div class="items f8"></div>
      <h3 class="h3">✍️ 동료에 대해 쓰기 (3인칭)</h3><div class="g8"></div>`);
    const st = sel('a8', { p: null, t: {}, c: {} });
    const paintP = () => {
      $('.prof', s).innerHTML = PROF.map(([e, n], i) => `<button class="pc ${st.p === i ? 'on' : ''}" data-i="${i}"><span>${e}</span>${n}</button>`).join('');
      $$('.prof .pc', s).forEach(b => b.onclick = () => { st.p = +b.dataset.i; save(); paintP(); });
    };
    paintP();
    const opt = (k, i) => `<select class="fsel" data-k="${k}" data-i="${i}"><option value="">— 고르기 —</option>${FOPT.map(f => `<option ${st[k][i] === f ? 'selected' : ''}>${f}</option>`).join('')}</select>`;
    const paintT = () => {
      $('.a8t', s).innerHTML = `<tr><th></th><th>tú</th><th>tus compañeros</th></tr>${A8.map((r, i) => `<tr><td>${r.es}</td><td>${opt('t', i)}</td><td>${opt('c', i)}</td></tr>`).join('')}`;
      $$('.fsel', s).forEach(x => x.onchange = () => { st[x.dataset.k][x.dataset.i] = x.value; save(); });
    };
    paintT();
    $('#rnd8', s).onclick = () => { A8.forEach((r, i) => { st.c[i] = shuffle(FOPT)[0]; }); save(); paintT(); };
    A8.forEach((r, i) => put(s, '.q8', writeItem({ id: 'a8-q' + i, sec: 'a8', skill: 'fre', prompt: `<span class="chip">${r.es.toLowerCase()}</span> (tú)`, ph: '¿Con qué frecuencia …?', answers: [r.q] })));
    A8.forEach((r, i) => put(s, '.f8', freeItem({ id: 'a8-f' + i, sec: 'a8', skill: 'fre', line: true, prompt: `${i + 1}) ${r.q} ${say(r.q)}`, ph: 'Una vez al mes voy al extranjero.', needMsg: '먼저 표의 tú 칸에서 빈도를 고르세요.',
      must: () => { const f = st.t[i]; if (!f) return null; return [{ re: W0 + r.v + W1, label: '1인칭 동사구' }, { re: acc(f).replace(/ /g, '\\s+'), label: `표에서 고른 빈도: ${f}` }]; } })));
    put(s, '.g8', freeItem({ id: 'a8-g', sec: 'a8', rows: 3, prompt: '동료의 빈도 3가지를 3인칭으로 쓰세요. (Mi compañero va al extranjero …)', ph: 'Mi compañero va al extranjero dos veces al año. Habla por teléfono todos los días.',
      must: [{ re: W0 + '(mi compa[nñ]er[oa]|mis compa[nñ]er[oa]s)' + W1, label: 'Mi compañero/a' }, { re: W0 + '(' + A8.map(r => r.v3).join('|') + ')' + W1, label: '3인칭 동사구 2개 이상', min: 2 }, { re: FREQ, label: '빈도 표현 2개 이상', min: 2 }],
      model: 'Mi compañera va al extranjero dos veces al año. Come con clientes una vez a la semana y habla por teléfono todos los días. Casi nunca duerme en otra ciudad.' }));
  };

  /* ================= Actividad 9 — ¿Qué quieres hacer? ================= */
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Mira los dibujos. ¿Qué sugerencias hacen las personas? Inventa un diálogo.')}
      ${modelo('A: ¿Qué quieres hacer?<br>B: Quiero ir a la biblioteca.')}
      <h3 class="h3">① 그림 속 생각 풍선에 알맞은 표현을 연결하세요</h3><div class="mp9"></div>
      <h3 class="h3">② B의 대답 쓰기 — Quiero + 동사원형</h3><div class="items two w9"></div>
      <h3 class="h3">③ querer (e → ie) 활용</h3><div class="c9"></div>
      <h3 class="h3">④ 나만의 대화 만들기</h3><div class="f9"></div>`);
    put(s, '.mp9', matchPics({ id: 'a9m', sec: 'a9', skill: 'rut', cols: 6, items: D.act9.map((x, i) => ({ e: x.e, es: x.es, cap: `${i + 1})` })) }));
    D.act9.forEach((x, i) => put(s, '.w9', writeItem({ id: 'a9-' + i, sec: 'a9', skill: 'rut', prompt: `${i + 1}) <span class="emo-sm">${x.e}</span> A: ¿Qué quieres hacer?`, ph: 'B: Quiero …', answers: x.ans })));
    put(s, '.c9', cloze({ id: 'a9c', sec: 'a9', skill: 'rut', cls: 'table2', text:
      [['yo', '[quiero]'], ['tú', '[quieres]'], ['él / ella / usted', 'quiere'], ['nosotros/as', '[queremos]'], ['vosotros/as', 'queréis'], ['ellos / ellas / ustedes', '[quieren]']].map(([a, b]) => `<p><span>${a}</span> ${b}</p>`).join('') }));
    put(s, '.f9', freeItem({ id: 'a9-f', sec: 'a9', rows: 5, prompt: '친구와 무엇을 할지 정하는 대화를 4줄 이상 쓰세요.', ph: 'A: ¿Qué quieres hacer esta tarde?\nB: Quiero …',
      must: [{ re: '¿\\s*qu[eé] quieres hacer', label: '¿Qué quieres hacer?' }, { re: W0 + 'quiero' + W1, label: 'Quiero + 동사원형' }, { re: '(¿\\s*por qu[eé] no|¿\\s*vamos|¿\\s*quieres)', label: '제안하기 (¿Por qué no …? / ¿Vamos …? / ¿Quieres …?)' }],
      model: 'A: ¿Qué quieres hacer esta tarde? B: Quiero jugar al tenis. ¿Y tú? A: Yo quiero ir de compras. ¿Por qué no vamos al centro comercial primero? B: ¡Vale!' }));
  };

  /* ================= Actividad 10 ================= */
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Practica con tus compañeros.', { kr: '질문의 동사를 1인칭으로 바꿔 대답해요: duermes → duermo, haces → hago, comes → como, vas → voy' })}<div class="items"></div>`);
    [['¿Cuántas horas duermes al día?', [{ re: W0 + 'duermo' + W1, label: 'duermo' }, { re: '(\\d+|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce) horas?', label: '~ horas' }], 'rut'],
      ['¿Qué es lo que más te gusta hacer en tu tiempo libre? ¿Con qué frecuencia lo haces?', [{ re: W0 + 'me (gusta|encanta)' + W1, label: 'Me gusta / Me encanta + 동사원형' }, { re: FREQ, label: '빈도 표현' }], 'fre'],
      ['¿Qué tareas domésticas no haces nunca? ¿Por qué?', [{ re: W0 + '(nunca \\p{L}+|no \\p{L}+( \\p{L}+){0,3} nunca)' + W1, label: 'Nunca … / No … nunca' }, { re: W0 + 'porque' + W1, label: 'porque + 이유' }], 'tar'],
      ['¿Con qué frecuencia haces ejercicio?', [{ re: W0 + '(hago|corro|nado|juego|voy)' + W1, label: '1인칭 동사 (hago ejercicio, corro …)' }, { re: FREQ, label: '빈도 표현' }], 'fre'],
      ['¿Con qué frecuencia comes o cenas en restaurantes?', [{ re: W0 + '(como|ceno)' + W1, label: 'como / ceno' }, { re: FREQ, label: '빈도 표현' }], 'fre'],
      ['¿Qué haces en vacaciones? ¿Te vas de viaje? ¿Adónde vas normalmente?', [{ re: W0 + '(me voy|voy|viajo|vamos)' + W1, label: 'me voy de viaje / voy a …' }, { re: FREQ, label: '빈도 표현 (normalmente …)' }], 'lib']]
      .forEach(([q, m, sk], i) => put(s, '.items', freeItem({ id: 'a10-' + i, sec: 'a10', skill: sk, line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m })));
  };

  /* ================= 레슨 설정 ================= */
  SC.lesson({
    num: '08',
    title: '¿Qué haces normalmente por la tarde?',
    ttsTest: 'Normalmente me levanto a las siete.',
    cover: {
      emoji: '⏰🚿☕<br><small>🧹📅</small>',
      bg: 'linear-gradient(135deg,#fde3c2 0%,#f6b26b 45%,#a32638 100%)',
      tema: ['La hora · Días de la semana · Horarios públicos', 'Un día normal · Acciones habituales · Tareas de la casa'],
      com: ['Preguntar y decir la hora', 'Preguntar e informar sobre horarios públicos', 'Hablar sobre hábitos cotidianos y actividades del fin de semana', 'Preguntar y decir con qué frecuencia se hace algo'],
      gram: ['Pronombres reflexivos: <i>me, te, se, nos, os, se</i>', 'Verbos reflexivos: <i>levantarse, acostarse, lavarse…</i>', 'Expresiones de frecuencia']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      'Rocío': { av: '👩🏻‍🦰', side: 'l' }, Roberto: { av: '🧑🏻', side: 'r' },
      Paula: { av: '👱🏼‍♀️', side: 'r' }, 'Óscar': { av: '🧑🏽', side: 'l' }
    },
    errLabels: { concordancia: 'Es la una / Son las … 일치', pronombre: '재귀대명사 me·te·se·nos·os', conjugacion: '동사 변화 (o→ue, e→ie, -go)' },
    errTips: {
      acento: 'miércoles, sábado, después, televisión, periódico, cafetería … 악센트도 철자예요. 시험에서는 감점됩니다.',
      concordancia: '1시만 단수: Es la una. / 나머지는 복수: Son las dos, Son las tres y media …',
      pronombre: 'me levanto · te levantas · se levanta · nos levantamos · os levantáis · se levantan',
      conjugacion: 'acostarse→me acuesto, volver→vuelvo, dormir→duermo, empezar→empiezan, salir→salgo, hacer→hago, fregar→friego',
      estructura: 'nunca가 동사 앞이면 no 없이(Nunca como…), 뒤면 no와 함께(No como nunca…). "¿A qué hora …?" → "A las …"'
    },
    classify(ti, ta) {
      const R = ['me', 'te', 'se', 'nos', 'os'];
      if (ti.filter(w => R.includes(w)).join() !== ta.filter(w => R.includes(w)).join()) return 'pronombre';
      if ((ti.includes('es') && ta.includes('son')) || (ti.includes('son') && ta.includes('es'))) return 'concordancia';
      const irr = ['acuesto', 'acuestas', 'acuesta', 'acuestan', 'vuelvo', 'duermo', 'duermes', 'empiezan', 'empieza', 'salgo', 'hago', 'pongo', 'friego', 'friegas', 'quiero', 'quieres', 'cierra', 'cierran', 'visto'];
      if (ta.some(w => irr.includes(w)) && !ta.filter(w => irr.includes(w)).every(w => ti.includes(w))) return 'conjugacion';
      return null;
    },
    errRules: [
      { re: W0 + 'yo (levanto|ducho|acuesto|despierto|afeito|peino|visto)' + W1, t: 'pronombre', msg: '재귀대명사 빠짐 → yo me levanto' },
      { re: W0 + '(me|te|se|nos|os) (levantar|duchar|acostar|despertar|ba[nñ]ar|lavar|peinar|afeitar|vestir|cepillar)' + W1, t: 'conjugacion', msg: '재귀동사도 주어에 맞게 활용: me levanto, se ducha …' },
      { re: W0 + '(acosto|acostas|acosta|acostan)' + W1, t: 'conjugacion', msg: 'acostarse (o→ue): me acuesto, te acuestas, se acuesta' },
      { re: W0 + '(volvo|volves|volve|volven)' + W1, t: 'conjugacion', msg: 'volver (o→ue): vuelvo, vuelves, vuelve' },
      { re: W0 + '(dormo|dormes|dorme|dormen)' + W1, t: 'conjugacion', msg: 'dormir (o→ue): duermo, duermes, duerme' },
      { re: W0 + '(empezo|empezas|empeza|empezan)' + W1, t: 'conjugacion', msg: 'empezar (e→ie): empiezo, empiezan' },
      { re: W0 + '(salo|sallo|haco|hacio|pono)' + W1, t: 'conjugacion', msg: 'yo 형 -go: salgo · hago · pongo' },
      { re: W0 + '(frego|fregas)' + W1, t: 'conjugacion', msg: 'fregar (e→ie): friego, friegas' },
      { re: W0 + 'nunca no' + W1, t: 'estructura', msg: '"Nunca no …"(✕) → "Nunca …" 또는 "No … nunca"' },
      { re: W0 + '(son la una|es las|a las una|a la (dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce))' + W1, t: 'concordancia', msg: '1시: Es la una / a la una · 나머지: Son las … / a las …' },
      { re: W0 + 'mi (cara|pelo|dientes|manos)' + W1, t: 'estructura', msg: '몸의 부위는 정관사: me lavo la cara, me cepillo los dientes' },
      { re: W0 + 'a la medianoche' + W1, t: 'estructura', msg: '"a medianoche" (관사 없이)' }
    ],
    accWords: ['plástica', 'geografía', 'periódico', 'electrónicos', 'mediodía', 'bañan', 'bañamos', 'bañarse', 'domésticas'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿A qué hora te levantas normalmente?', 'Normalmente me levanto a las siete.', '¿Qué haces normalmente los sábados por la mañana?',
      'Normalmente me levanto tarde y luego hago la compra.', '¿Con qué frecuencia escribes a tus amigos?', 'Les escribo dos veces al mes.'],
    utilSkill: 'rut',
    proverbio: { es: 'No dejes para mañana lo que puedas hacer hoy.', e: '⏰📚', answer: '오늘 할 일을 내일로 미루지 마라', options: ['오늘 할 일을 내일로 미루지 마라', '세 살 버릇 여든까지 간다', '시작이 반이다', '하늘이 무너져도 솟아날 구멍이 있다'], kr: '오늘 할 수 있는 일을 내일로 미루지 말라 — 미루는 습관을 경계하는 속담이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Los sábados y los fines de semana → 글로 쓰기',
        icons: ['⏰', '🏠', '🧑‍🤝‍🧑'],
        html: `<div class="note-card"><p>Siempre ____________ .</p><p>Normalmente ____________ .</p><p>____________ a menudo.</p><p>A veces ____________ .</p><p>No ______ nunca ____________ .</p></div>`,
        questions: ['¿Qué haces los sábados? Usa <b>siempre, normalmente, a menudo, a veces</b> y <b>no … nunca</b>.',
          'Imagina que vives con un amigo. ¿Qué <b>cinco cosas</b> hacéis juntos los fines de semana? (Siempre vamos al parque…)',
          '¿Qué <b>tres cosas</b> hacéis por separado? (Yo me levanto tarde, pero mi amigo…)'],
        minWords: 50,
        hint: '재귀동사 · 시각(a las …) · 빈도 표현 · nosotros 형을 활용하면 높은 점수!',
        ph: 'Los sábados siempre me levanto tarde, a las diez. Normalmente …',
        connectors: ['y', 'pero', 'después', 'luego', 'porque', 'también', 'por la mañana', 'por la tarde'],
        rubric: [
          { k: 'sab', label: '토요일 · 주말 (los sábados / los fines de semana)', max: 6, re: 'los s[aá]bados|el s[aá]bado|los fines de semana|el fin de semana', ax: 'Contenido' },
          { k: 'jun', label: '함께 / 따로 (juntos · por separado · mi amigo …)', max: 6, re: 'juntos|juntas|por separado|mi amig[oa]', ax: 'Contenido' },
          { k: 'hor', label: '시각 (a las … / a la una)', max: 8, re: 'a la una|a las (dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)', ax: 'Contenido' },
          { k: 'fre', label: '빈도 표현 4번 이상', max: 10, re: FREQ, min: 4, ax: 'Gramática' },
          { k: 'ref', label: '재귀동사 2번 이상 (me levanto, nos acostamos …)', max: 10, re: '(me|te|se|nos|os) (levant|duch|ba[nñ]|lav|cepill|pein|afeit|vist|vest|acuest|acost|despiert|despert|pon|quit)\\p{L}*', min: 2, ax: 'Gramática' },
          { k: 'nos', label: 'nosotros 형 3번 이상 (vamos, comemos, salimos …)', max: 10, re: '\\p{L}+(amos|emos|imos)', min: 3, ax: 'Gramática' },
          { k: 'rut', label: '1인칭 일과 동사 (voy, hago, salgo, vuelvo, desayuno …)', max: 10, re: 'voy|hago|salgo|vuelvo|desayuno|como|ceno|juego|duermo|veo|leo|estudio|limpio|friego|pongo|plancho|ordeno', min: 2, ax: 'Gramática' }
        ],
        model: 'Los sábados siempre me levanto tarde, a las diez. Normalmente desayuno con mi familia y luego hago la compra. Juego al fútbol a menudo. A veces voy al cine, pero no estudio nunca los sábados. Mi amigo y yo vivimos juntos. Los fines de semana siempre vamos al parque, comemos juntos, limpiamos la casa, vemos películas y cocinamos. Pero yo me acuesto a las doce y él se acuesta a las diez. Él se ducha por la mañana y yo me ducho por la noche. Yo hago deporte, pero él lee libros.'
      }
    },
    build: B
  });
})();
