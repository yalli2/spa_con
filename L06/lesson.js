/* Lección 06 · ¿Dónde está la parada de autobús? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, dialogHTML, clozeFromDialog, MARK } = SC;

  /* ---------- 그림 조각 ---------- */
  const ERASER = '<span class="eraser"></span>';
  const DICC = '<span class="dicc">📙<i>A-Z</i></span>';
  const DESK_SVG = '<svg class="objsvg" viewBox="0 0 80 64"><rect x="4" y="14" width="72" height="8" fill="#d9a066" stroke="#8a5a2b" stroke-width="2"/><rect x="48" y="22" width="24" height="36" fill="#e3b27a" stroke="#8a5a2b" stroke-width="2"/><line x1="48" y1="34" x2="72" y2="34" stroke="#8a5a2b" stroke-width="2"/><line x1="48" y1="46" x2="72" y2="46" stroke="#8a5a2b" stroke-width="2"/><circle cx="60" cy="28" r="1.6" fill="#8a5a2b"/><circle cx="60" cy="40" r="1.6" fill="#8a5a2b"/><rect x="8" y="22" width="5" height="36" fill="#8a5a2b"/></svg>';
  const TABLE_SVG = '<svg class="objsvg" viewBox="0 0 80 64"><ellipse cx="40" cy="18" rx="34" ry="9" fill="#d9a066" stroke="#8a5a2b" stroke-width="2"/><line x1="16" y1="24" x2="14" y2="58" stroke="#8a5a2b" stroke-width="4"/><line x1="64" y1="24" x2="66" y2="58" stroke="#8a5a2b" stroke-width="4"/><line x1="40" y1="27" x2="40" y2="60" stroke="#8a5a2b" stroke-width="4"/></svg>';

  /* ---------- 학습 데이터 ---------- */
  const D = {
    skills: {
      voc: 'Vocabulario 어휘',
      hay: 'Hay / Estar 존재·위치',
      pre: 'Preposiciones 위치 표현',
      art: 'Artículos 관사',
      dem: 'Demostrativos 지시사',
      int: 'Interrogativos 의문사',
      num: 'Precios 가격·숫자',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '마을의 장소 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '약국은 어디에?', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '강아지는 어디에? (위치 전치사)', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '동네 지도 묘사하기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '¿Qué es esto? 물건 이름', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '책상 위에 무엇이 있나요?', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'd2', label: 'Diálogo 2', kr: '문구점에서 볼펜 사기', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a5', label: 'Actividad 5', kr: '¿Para qué sirve? 물건의 용도', group: 'Diálogo 2', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '가게에서 무엇을 파나요?', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '¿Cuánto cuesta? 가격 묻고 답하기', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '듣고 표 완성하기', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    lugares: [
      { es: 'el ayuntamiento', kr: '시청', e: '🏛️' },
      { es: 'la iglesia', kr: '교회 · 성당', e: '⛪' },
      { es: 'la escuela', kr: '학교', e: '🏫' },
      { es: 'el banco', kr: '은행', e: '🏦' },
      { es: 'el mercado', kr: '시장', e: '🧺' },
      { es: 'el centro de salud', kr: '보건소', e: '🩺' },
      { es: 'la oficina de correos', kr: '우체국', e: '📮' },
      { es: 'la estación de ferrocarril', kr: '기차역', e: '🚉' },
      { es: 'el aeropuerto', kr: '공항', e: '✈️' },
      { es: 'el centro comercial', kr: '쇼핑센터', e: '🏬' },
      { es: 'la tarjeta de crédito', kr: '신용카드', e: '💳' },
      { es: 'en efectivo', kr: '현금으로', e: '💶' }
    ],

    dialogo1: [
      { who: 'S', es: '[Oiga, perdone]. ¿Hay una farmacia por aquí?' },
      { who: 'C', es: 'Sí, hay una [al final] de esta calle, [en frente del] hospital.' },
      { who: 'S', es: '¿Está [cerca]?' },
      { who: 'C', es: 'Sí, sí, muy cerca. No se puede [perder].' },
      { who: 'S', es: 'Gracias. Otra pregunta. ¿Sabe usted dónde está la parada de autobús?' },
      { who: 'C', es: 'Sí, la parada de autobús está [delante de] aquel mercado.' },
      { who: 'S', es: 'Una última pregunta. ¿[Dónde] está la estación de metro?' },
      { who: 'C', es: 'La estación de metro está [al lado de] la parada de autobús.' },
      { who: 'S', es: 'Muchas gracias. Es usted muy [amable].' },
      { who: 'C', es: 'De nada. Adiós.' }
    ],

    dialogo2: [
      { who: 'Dependiente', es: '¡Buenos días! [¿La puedo ayudar?] ¿Qué desea?' },
      { who: 'Clienta', es: '[¿Tienen bolígrafos?]' },
      { who: 'Dependiente', es: 'Sí. Mire, aquí. [Estos son los que tenemos.] ¿Qué le parecen?' },
      { who: 'Clienta', es: '¿Puedo ver ese azul?' },
      { who: 'Dependiente', es: '¿Este?' },
      { who: 'Clienta', es: 'Sí, sí. [¿Cuánto cuesta?]' },
      { who: 'Dependiente', es: 'Cuesta tres euros con veinticinco céntimos.' },
      { who: 'Clienta', es: 'Muy bien. [Me lo llevo.]' },
      { who: 'Dependiente', es: 'Pase a la caja, por favor. ¿Cómo va a pagar?' },
      { who: 'Clienta', es: 'En efectivo.' }
    ],

    /* Actividad 8 — TRANSCRIPCIONES */
    dialogo8a: [
      { who: 'Dependienta', es: 'Buenos días. ¿Qué desea?' },
      { who: 'Cliente', es: 'Pues, quería unas gafas de sol para una chica joven.' },
      { who: 'Dependienta', es: '¿Qué le parecen estas?' },
      { who: 'Cliente', es: '¿Puedo ver esas?' },
      { who: 'Dependienta', es: 'Sí, claro.' },
      { who: 'Cliente', es: '¿Cuánto cuestan?' },
      { who: 'Dependienta', es: 'Sesenta euros con cincuenta y siete céntimos.' },
      { who: 'Cliente', es: 'Pues, me las llevo.' },
      { who: 'Dependienta', es: 'Muy bien.' }
    ],
    dialogo8b: [
      { who: 'Dependiente', es: 'Buenas tardes. ¿Le ayudo en algo?' },
      { who: 'Clienta', es: 'Sí. Estoy mirando los bolsos. ¿Cuánto cuesta este bolso negro?' },
      { who: 'Dependiente', es: '¿Cuál? ¿Este? A ver... cuatrocientos cincuenta euros.' },
      { who: 'Clienta', es: 'Hmm, volveré más tarde. Gracias.' },
      { who: 'Dependiente', es: 'Adiós.' }
    ],

    /* Actividad 1 — 그림 1~10 (SOLUCIONES) */
    perro: [
      { k: 'delante', a: ['Está delante del banco.'] },
      { k: 'detras', a: ['Está detrás del banco.'] },
      { k: 'encima', a: ['Está encima del banco.', 'Está sobre el banco.'] },
      { k: 'debajo', a: ['Está debajo del banco.'] },
      { k: 'derecha', a: ['Está a la derecha del banco.'] },
      { k: 'izquierda', a: ['Está a la izquierda del banco.'] },
      { k: 'dentro', a: ['Está dentro de la casa.', 'Está dentro de la caseta.'] },
      { k: 'fuera', a: ['Está fuera de la casa.', 'Está fuera de la caseta.'] },
      { k: 'entre', a: ['Está entre el banco y la parada de autobús.'] },
      { k: 'enfrente', a: ['Está en frente de la parada de autobús.', 'Está enfrente de la parada de autobús.'] }
    ],

    /* Actividad 2 — 동네 지도 (좌표 %) */
    mapa: [
      { es: 'el cine', e: '🎬', x: 2, y: 2 },
      { es: 'el mercado', e: '🧺', x: 16, y: 2 },
      { es: 'la librería', e: '📚', x: 36, y: 2 },
      { es: 'la papelería', e: '✏️', x: 50, y: 2 },
      { es: 'la parada de autobús', e: '🚏', x: 2, y: 27 },
      { es: 'la estación de metro', e: '🚇', x: 16, y: 27 },
      { es: 'la escuela', e: '🏫', x: 36, y: 27, w: 24 },
      { es: 'el banco', e: '🏦', x: 3, y: 51 },
      { es: 'el hospital', e: '🏥', x: 3, y: 80 },
      { es: 'la farmacia', e: '💊', x: 17, y: 80 },
      { es: 'la panadería', e: '🥖', x: 68, y: 30 },
      { es: 'la cafetería', e: '☕', x: 82, y: 30 },
      { es: 'la florería', e: '💐', x: 75, y: 80 }
    ],

    /* Actividad 3 */
    objetos: [
      { e: '🎒', es: 'una mochila', a: 'Es una mochila.' },
      { e: '📄📄', es: 'unos papeles', a: 'Son unos papeles.' },
      { e: '✉️✉️', es: 'unas cartas', a: 'Son unas cartas.' },
      { e: '📓', es: 'un cuaderno', a: 'Es un cuaderno.' },
      { e: '👜', es: 'un bolso', a: 'Es un bolso.' },
      { e: '🖊️🖊️', es: 'unos bolígrafos', a: 'Son unos bolígrafos.' },
      { e: DESK_SVG, es: 'un escritorio', a: 'Es un escritorio.' },
      { e: TABLE_SVG, es: 'una mesa', a: 'Es una mesa.' }
    ],

    /* Actividad 4 — 책상 위 물건 (SOLUCIONES) */
    escritorios: [
      { on: ['📕', '🔑', '📄'], items: [['unas llaves', 'llaves'], ['un libro', 'libro'], ['unos papeles', 'papeles']], model: 'Hay unas llaves, un libro y unos papeles.' },
      { on: ['✏️✏️', '👛', ERASER], items: [['unos lápices', 'l[aá]pices'], ['una goma', 'goma'], ['un bolso', 'bolso']], model: 'Hay unos lápices, una goma y un bolso.' },
      { on: ['📓', '🖊️', '📚', DICC], items: [['un cuaderno', 'cuaderno'], ['dos libros', 'libros'], ['un bolígrafo', 'bol[ií]grafo'], ['un diccionario', 'diccionario']], model: 'Hay un cuaderno, dos libros, un bolígrafo y un diccionario.' },
      { on: ['📰', '🥛', '📓', '🎒'], items: [['un periódico', 'peri[oó]dico'], ['un cuaderno', 'cuaderno'], ['un vaso', 'vaso'], ['una mochila', 'mochila']], model: 'Hay un periódico, un cuaderno, un vaso y una mochila.' }
    ],

    /* Actividad 5 */
    sirve: [
      { s: 'Sirve para sentarse.', o: 'la silla', e: '🪑', a: 'La silla sirve para sentarse.' },
      { s: 'Sirven para abrir y cerrar la puerta.', o: 'las llaves', e: '🔑🔑', a: 'Las llaves sirven para abrir y cerrar la puerta.' },
      { s: 'Sirve para escribir.', o: 'el lápiz', e: '✏️', a: 'El lápiz sirve para escribir.' },
      { s: 'Sirve para buscar palabras.', o: 'el diccionario', e: DICC, a: 'El diccionario sirve para buscar palabras.' },
      { s: 'Sirve para buscar un lugar.', o: 'el mapa', e: '🗺️', a: 'El mapa sirve para buscar un lugar.' },
      { s: 'Sirve para beber agua.', o: 'el vaso', e: '🥛', a: 'El vaso sirve para beber agua.' },
      { s: 'Sirve para borrar.', o: 'la goma', e: ERASER, a: 'La goma sirve para borrar.' },
      { s: 'Sirve para poner los libros y cuadernos y estudiar.', o: 'el escritorio', e: DESK_SVG, a: 'El escritorio sirve para poner los libros y cuadernos y estudiar.', alt: ['El escritorio sirve para sentarse y estudiar.', 'El escritorio sirve para estudiar.'] }
    ],

    /* Actividad 7 — 가격 (SOLUCIONES) */
    precios: [
      { es: 'las gafas de sol', e: '🕶️', p: '142,30', dem: 'esas', pl: 1, w: 'ciento cuarenta y dos euros con treinta céntimos' },
      { es: 'el ordenador', e: '💻', p: '1988', dem: 'ese', w: 'mil novecientos ochenta y ocho euros' },
      { es: 'el reloj', e: '⌚', p: '130,25', dem: 'ese', w: 'ciento treinta euros con veinticinco céntimos' },
      { es: 'la mochila', e: '🎒', p: '65,50', dem: 'esa', w: 'sesenta y cinco euros con cincuenta céntimos' },
      { es: 'el celular / móvil', e: '📱', p: '576,45', dem: 'ese', w: 'quinientos setenta y seis euros con cuarenta y cinco céntimos', alt: ['el móvil', 'el celular'] },
      { es: 'los zapatos', e: '👠', p: '79,99', dem: 'esos', pl: 1, w: 'setenta y nueve euros con noventa y nueve céntimos' }
    ],

    utiles: [
      ['¿Dónde está la parada de autobús?', '버스 정류장은 어디에 있어요?'],
      ['Está delante del mercado, en frente de la farmacia.', '시장 앞, 약국 맞은편에 있어요.'],
      ['¿Hay un banco por aquí?', '이 근처에 은행이 있나요?'],
      ['Sí, hay uno cerca, al lado del cine.', '네, 가까이에 하나 있어요. 영화관 옆에요.'],
      ['¿Qué hay en tu escritorio?', '네 책상 위에는 뭐가 있어?'],
      ['Hay un libro, un cuaderno, una goma y unos lápices.', '책, 공책, 지우개, 연필 몇 자루가 있어.'],
      ['¿Cuánto cuesta este bolso?', '이 가방은 얼마예요?'],
      ['Cuesta doscientos euros.', '200유로입니다.'],
      ['¿Cómo va a pagar?', '어떻게 계산하시겠어요?'],
      ['Con tarjeta de crédito.', '신용카드로요.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '¿____ una farmacia por aquí? <i>(hay / está)</i>', a: ['Hay'], s: 'hay' },
      { p: '¿Dónde ____ la parada de autobús? <i>(hay / está)</i>', a: ['está'], s: 'hay' },
      { p: 'Mis llaves ____ en la mochila. <i>(estar)</i>', a: ['están'], s: 'hay' },
      { p: 'En mi escritorio ____ dos libros y una goma. <i>(hay / está)</i>', a: ['hay'], s: 'hay' },
      { p: 'El perro está debajo ____ banco. <i>(de + el)</i>', a: ['del'], s: 'pre' },
      { p: 'La farmacia está ____ del hospital. <i>(맞은편에)</i>', a: ['en frente', 'enfrente'], s: 'pre' },
      { p: 'El gato está ____ la silla y la mesa. <i>(사이에)</i>', a: ['entre'], s: 'pre' },
      { p: 'La estación de metro está ____ lado de la parada.', a: ['al'], s: 'pre' },
      { p: 'Hay ____ mochila en la silla. <i>(부정관사)</i>', a: ['una'], s: 'art' },
      { p: '¿Qué es esto? — Son ____ bolígrafos. <i>(부정관사)</i>', a: ['unos'], s: 'art' },
      { p: '¿Puedo ver ____ gafas de sol? <i>(그 · ese)</i>', a: ['esas'], s: 'dem' },
      { p: '____ bolígrafo azul es muy bonito. <i>(이 · este)</i>', a: ['Este'], s: 'dem' },
      { p: 'La parada está delante de ____ mercado. <i>(저 · aquel)</i>', a: ['aquel'], s: 'dem' },
      { p: '¿____ cuesta este bolso? <i>(얼마)</i>', a: ['Cuánto'], s: 'int' },
      { p: '¿____ es tu mochila, la verde o la azul? <i>(어느 것)</i>', a: ['Cuál'], s: 'int' },
      { p: '¿Cuánto ____ los zapatos? <i>(costar)</i>', a: ['cuestan'], s: 'num' },
      { p: 'El reloj cuesta 130 € = ____ treinta euros.', a: ['ciento'], s: 'num' },
      { p: '500 € = ____ euros', a: ['quinientos'], s: 'num' },
      { p: '¿Cómo va a pagar? — Con ____ de crédito.', a: ['tarjeta'], s: 'voc' },
      { p: 'La silla sirve ____ sentarse.', a: ['para'], s: 'voc' }
    ]
  };

  const B = {};
  const withSubj = (subj, arr) => arr.flatMap(a => [a, subj + ' ' + a.charAt(0).toLowerCase() + a.slice(1)]);
  const hideBtn = (s, btn, box, a, b) => { $(btn, s).onclick = e => { const t = $(box, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? b : a; }; };

  /* ---------- SVG 장면 (Actividad 1) ---------- */
  const BG = '<rect class="gr" x="0" y="0" width="200" height="130" rx="22"/><path class="gs" d="M22 0H178A22 22 0 0 1 200 22V34H0V22A22 22 0 0 1 22 0Z"/><rect class="walk" x="0" y="34" width="200" height="14"/>';
  const bench = cx => { const x0 = cx - 38; return `<g><rect class="wd2" x="${x0 + 7}" y="50" width="4" height="30"/><rect class="wd2" x="${x0 + 65}" y="50" width="4" height="30"/><rect class="wd" x="${x0 + 3}" y="52" width="70" height="8" rx="2"/><rect class="wd" x="${x0 + 3}" y="63" width="70" height="8" rx="2"/><rect class="wd" x="${x0}" y="76" width="76" height="7" rx="2"/><rect class="wd2" x="${x0 + 4}" y="83" width="4" height="18"/><rect class="wd2" x="${x0 + 68}" y="83" width="4" height="18"/></g>`; };
  const busStop = (x, base) => `<g><rect class="shel" x="${x + 6}" y="${base - 44}" width="34" height="42" rx="3"/><line class="pole" x1="${x}" y1="${base - 52}" x2="${x}" y2="${base}"/><circle class="sign" cx="${x}" cy="${base - 52}" r="9"/><text x="${x}" y="${base - 50}" font-size="6" font-weight="700" text-anchor="middle" fill="#d6202f">BUS</text></g>`;
  const house = '<g><rect class="wd" x="70" y="62" width="72" height="48"/><path class="roof" d="M60 66L106 30L152 66Z"/><path class="door" d="M94 110V90a12 12 0 0 1 24 0V110Z"/></g>';
  const dog = (x, y, sz) => `<text class="dog" x="${x}" y="${y}" style="font-size:${sz}px">🐕</text>`;
  const scene = k => {
    let g = BG;
    switch (k) {
      case 'delante': g += bench(100) + dog(100, 124, 30); break;
      case 'detras': g += dog(118, 58, 24) + bench(100); break;
      case 'encima': g += bench(100) + dog(100, 78, 24); break;
      case 'debajo': g += bench(100) + dog(100, 101, 17); break;
      case 'derecha': g += bench(90) + dog(162, 106, 26); break;
      case 'izquierda': g += bench(110) + dog(38, 106, 26); break;
      case 'dentro': g += house + dog(107, 108, 16); break;
      case 'fuera': g += house + dog(168, 116, 26); break;
      case 'entre': g += bench(48) + busStop(160, 104) + dog(122, 110, 24); break;
      case 'enfrente': g = BG + '<rect class="road" x="0" y="62" width="200" height="24"/><line class="rl" x1="0" y1="74" x2="200" y2="74"/>' + busStop(96, 60) + dog(100, 122, 26); break;
    }
    return `<svg class="scn" viewBox="0 0 200 130">${g}</svg>`;
  };
  /* 강아지 놓기 — 핫스팟 */
  const HS = { encima: [100, 70], debajo: [100, 94], delante: [100, 118], detras: [100, 44], izquierda: [34, 92], derecha: [166, 92] };
  const DOGAT = { encima: [100, 78, 24], debajo: [100, 101, 17], delante: [100, 124, 30], detras: [118, 58, 24], izquierda: [36, 106, 26], derecha: [164, 106, 26] };

  B.vocab = () => {
    const txt1 = 'En la mayoría de las ciudades hispanas suele haber una calle principal que es muy transitada y una plaza que se llama "Plaza Mayor". Alrededor de la plaza mayor podemos encontrar el ayuntamiento y una iglesia. En casi todos los pueblos hay escuelas, bancos, mercados, centros de salud y oficinas de correos, pero no todos tienen estación de ferrocarril ni aeropuerto.';
    const txt2 = 'Para ir de compras la gente suele ir a un centro comercial o a grandes almacenes. En las calles como en la calle Serrano de Madrid o la calle Florida de Buenos Aires hay muchas tiendas de lujo. Los turistas pasean por ellas y hacen sus compras. Normalmente, se puede pagar con tarjeta de crédito o en efectivo. Hoy en día, la gente suele hacer sus compras a través de Internet, en tiendas en línea.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${esc(txt1)} ${say(txt1)}</p>
      <p class="lead">${esc(txt2)} ${say(txt2)}</p>
      <p class="small">🏛️ 사진: 마드리드의 Plaza Mayor · 멕시코시티의 소칼로(Zócalo) 광장</p>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">② 카드를 눌러 뜻을 확인하세요</h3><div class="fg"></div>
      <h3 class="h3">③ 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요 (관사까지!)</h3><div class="items two w"></div>`);
    [['En la mayoría de las ciudades hispanas hay una plaza que se llama "Plaza Mayor".', 'Verdadero'],
      ['Todos los pueblos tienen estación de ferrocarril y aeropuerto.', 'Falso'],
      ['Normalmente, solo se puede pagar en efectivo.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'v-vf' + i, sec: 'vocab', skill: 'hay', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.fg', flipGrid(D.lugares));
    D.lugares.slice(0, 10).forEach((a, i) => put(s, '.w', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`,
      answers: a.es.startsWith('en ') ? [a.es] : [a.es, a.es.replace(/^(el|la) /, '')] })));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. hay vs. estar — "있다"가 두 가지!</h3>
        <div class="blocks"><span class="bk v">Hay</span><span class="bk o">un / una / unos / dos …</span><span class="bk s">명사</span><span class="small">(무엇이) 있다 — 존재</span></div>
        <div class="blocks"><span class="bk o">el / la / mi …</span><span class="bk s">명사</span><span class="bk v">está / están</span><span class="bk p">장소</span><span class="small">(그것이 어디에) 있다 — 위치</span></div>
        <div class="legend-mini"><span class="bk v">동사</span><span class="bk o">관사 · 소유사</span><span class="bk s">명사</span><span class="bk p">장소 표현</span></div>
        ${tip('<b>Hay</b> 는 단수·복수 모두 그대로 hay! — Hay <b>un</b> banco. / Hay <b>dos</b> bancos.<br><b>estar</b> 는 주어에 맞춰: El banco <b>está</b> … / Los bancos <b>están</b> …<br>❌ <s>Hay el banco.</s> → hay 뒤에는 정관사(el, la)를 쓰지 않아요.')}
        <div class="g1"></div><div class="items g1w"></div></div>
      <div class="gcard"><h3>2. 정관사 · 부정관사 (Artículos definidos e indefinidos)</h3>
        ${tip('처음 말하는 것 → <b>부정관사</b>: ¿Hay <b>una</b> farmacia por aquí? / 이미 아는 것 → <b>정관사</b>: ¿Dónde está <b>la</b> farmacia?<br>¿Qué es esto? — Es <b>un</b> bolso. / Son <b>unos</b> papeles.')}
        <div class="g2"></div></div>
      <div class="gcard"><h3>3. 지시형용사 · 지시대명사 (Demostrativos)</h3>
        <div class="scale">
          <div class="st s5"><span>👇</span><b>este · esta</b><small>이 (나에게 가까이) · aquí</small></div>
          <div class="st s3"><span>👉</span><b>ese · esa</b><small>그 (상대에게 가까이) · ahí</small></div>
          <div class="st s1"><span>🔭</span><b>aquel · aquella</b><small>저 (둘 다에게 멀리) · allí</small></div>
        </div>
        ${tip('명사 없이 대명사로도 써요: ¿Puedo ver ese azul? — ¿<b>Este</b>? / <b>Estos</b> son los que tenemos.<br>복수: este → <b>estos</b>, ese → <b>esos</b>, aquel → <b>aquellos</b> (남성 복수에 주의!)')}
        <div class="g3"></div><div class="items two g3w"></div></div>
      <div class="gcard"><h3>4. 위치 전치사 (Preposiciones y adverbios de lugar)</h3>
        <div class="prepg">${[['👆', 'encima de', '~ 위에'], ['👇', 'debajo de', '~ 아래에'], ['⬆️', 'delante de', '~ 앞에'], ['⬇️', 'detrás de', '~ 뒤에'], ['⬅️', 'a la izquierda de', '~ 왼쪽에'], ['➡️', 'a la derecha de', '~ 오른쪽에'],
          ['↔️', 'al lado de', '~ 옆에'], ['🔄', 'en frente de', '~ 맞은편에'], ['⏺️', 'entre A y B', 'A와 B 사이에'], ['📦', 'dentro de', '~ 안에'], ['🚪', 'fuera de', '~ 밖에'], ['📍', 'cerca de / lejos de', '~ 가까이 / 멀리']]
          .map(([e, es, kr]) => `<div><span>${e}</span><b>${es}</b>${kr} ${say(es)}</div>`).join('')}</div>
        ${tip('<b>de + el = del</b>: delante <b>del</b> banco (✕ de el) / <b>a + el = al</b>: <b>al</b> lado de …<br>de la, de los, de las 는 그대로: al lado <b>de la</b> farmacia.')}
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 의문사 (Interrogativos) — dónde · cuánto · cuál · qué</h3>
        <table class="dt"><tr><th>¿Dónde?</th><td>어디에</td><td>¿Dónde está la parada de autobús?</td></tr>
          <tr><th>¿Cuánto/a/os/as?</th><td>얼마나 / 몇 개</td><td>¿Cuánto cuesta? · ¿Cuántos libros hay?</td></tr>
          <tr><th>¿Cuál / Cuáles?</th><td>어느 것</td><td>¿Cuál es tu mochila?</td></tr>
          <tr><th>¿Qué?</th><td>무엇</td><td>¿Qué es esto? · ¿Qué hay en tu escritorio?</td></tr></table>
        ${tip('가격: 단수 → ¿Cuánto <b>cuesta</b> el reloj? / 복수 → ¿Cuánto <b>cuestan</b> los zapatos? (costar: o → ue)')}
        <div class="g5"></div></div>
      <div class="gcard"><h3>6. 100 이상의 숫자 — 가격 말하기</h3>
        ${tip('100 = <b>cien</b> (딱 100) / 101~199 = <b>ciento</b> + … (ciento treinta) · 1000 = <b>mil</b><br>3,25 € = tres euros <b>con</b> veinticinco céntimos')}
        <div class="g6"></div></div>`);
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'hay', title: 'hay / está / están 중 알맞은 것을 쓰세요.', cls: 'lines', text:
      ['¿[Hay] una farmacia por aquí?', '¿Dónde [está] la parada de autobús?', 'En mi escritorio [hay] dos libros.', 'Los libros [están] en la mochila.',
        'En el barrio [hay] un cine y un mercado.'].map(x => `<p>${x}</p>`).join('') }));
    [['🏦 이 근처에 은행이 있나요?', ['¿Hay un banco por aquí?', '¿Hay un banco cerca?', '¿Hay un banco cerca de aquí?']],
      ['🎒 내 배낭은 의자 위에 있어요. <span class="small">(mochila, silla)</span>', ['Mi mochila está encima de la silla.', 'Mi mochila está sobre la silla.', 'Mi mochila está en la silla.']]]
      .forEach(([p, a], i) => put(s, '.g1w', writeItem({ id: 'g1w-' + i, sec: 'gram', skill: 'hay', prompt: p, answers: a })));
    put(s, '.g2', cloze({ id: 'g2', sec: 'gram', skill: 'art', title: '표를 완성하세요. (정관사 → 부정관사)', cls: 'table2', text:
      [['남성 단수', 'el', 'un', 'libro'], ['여성 단수', 'la', 'una', 'mesa'], ['남성 복수', 'los', 'unos', 'papeles'], ['여성 복수', 'las', 'unas', 'cartas']]
        .map(([k, d, i, n]) => `<p><span>${k}</span> [${d}] ${n} → [${i}] ${n}</p>`).join('') }));
    put(s, '.g3', cloze({ id: 'g3', sec: 'gram', skill: 'dem', title: '표를 완성하세요.', cls: 'table2', text:
      `<p><span>aquí 👇</span> este libro · esta mesa · estos libros · estas mesas</p>
       <p><span>ahí 👉</span> [ese] libro · [esa] mesa · [esos] libros · [esas] mesas</p>
       <p><span>allí 🔭</span> [aquel] libro · [aquella] mesa · [aquellos] libros · [aquellas] mesas</p>` }));
    [['👇 이 볼펜 <span class="small">(bolígrafo)</span>', 'este bolígrafo'], ['👉 그 안경 <span class="small">(gafas)</span>', 'esas gafas'],
      ['🔭 저 시장 <span class="small">(mercado)</span>', 'aquel mercado']]
      .forEach(([p, a], i) => put(s, '.g3w', writeItem({ id: 'g3w-' + i, sec: 'gram', skill: 'dem', prompt: p, answers: [a] })));
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'pre', title: 'del / de la / al 중 알맞은 것을 쓰세요.', cls: 'lines', text:
      ['El perro está delante [del] banco.', 'La farmacia está en frente [del] hospital.', 'El metro está al lado [de la] parada.',
        'El cine está [al] lado del mercado.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g5', cloze({ id: 'g5', sec: 'gram', skill: 'int', title: '알맞은 의문사(또는 동사)를 쓰세요.', cls: 'lines', text:
      ['¿[Dónde] está la parada de autobús?', '¿[Cuánto] cuesta este bolso?', '¿Cuánto [cuestan] los zapatos?', '¿[Cuál] es tu mochila? — La verde.',
        '¿[Cuántos] libros hay en la mesa?'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g6', cloze({ id: 'g6', sec: 'gram', skill: 'num', title: '숫자를 스페인어로 쓰세요.', cls: 'table2', text:
      [['100', 'cien'], ['130', 'ciento'], ['200', 'doscientos'], ['500', 'quinientos'], ['1000', 'mil']]
        .map(([n, w]) => `<p><span>${n} €</span> [${w}]${n === '130' ? ' treinta' : ''} euros</p>`).join('') }));
  };

  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Una señorita pregunta el camino para ir a la farmacia.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">Por favor / Disculpe</span><span class="hlc c1">¿No está lejos?</span><span class="hlc c2">¿Puede decirme dónde está la estación de metro?</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기 — 길 묻기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    hideBtn(s, '#hide1', '#d1txt', '본문 가리기', '본문 보기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'pre', cls: 'lines', text: clozeFromDialog(D.dialogo1.map(l => ({ who: l.who, es: l.es.replace('[en frente del]', '[en frente del|enfrente del]') }))) }));
    [['La farmacia está muy lejos.', 'Falso'], ['La parada de autobús está detrás del mercado.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'pre', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['<u>Oiga, perdone.</u> ¿Hay una farmacia por aquí? → <span class="chip">Disculpe</span>', ['Disculpe, ¿hay una farmacia por aquí?', 'Por favor, ¿hay una farmacia por aquí?']],
      ['<u>¿Está cerca?</u> → <span class="chip">lejos</span>', ['¿No está lejos?']],
      ['<u>¿Dónde está la estación de metro?</u> → <span class="chip">¿Puede decirme …?</span>', ['¿Puede decirme dónde está la estación de metro?']],
      ['실례합니다, 은행이 어디 있는지 말씀해 주시겠어요? <span class="small">(Disculpe, ¿puede decirme …?)</span>', ['Disculpe, ¿puede decirme dónde está el banco?', 'Perdone, ¿puede decirme dónde está el banco?', 'Por favor, ¿puede decirme dónde está el banco?']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'int', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '우리 동네에서 길을 묻고 답하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: Disculpe, ¿hay un banco por aquí?\nB: Sí, hay uno …',
      must: [{ re: '(oiga|perdone|disculpe|por favor)', label: '말 걸기 (Oiga / Perdone / Disculpe)' }, { re: '¿\\s*hay' + W1, label: '¿Hay … por aquí?' },
        { re: '[dó]nde est[aá]', label: '¿Dónde está …?' }, { re: '(delante|detr[aá]s|al lado|en frente|enfrente|entre|cerca|lejos|a la derecha|a la izquierda|al final)', label: '위치 표현 (al lado de, delante de …)' },
        { re: '(gracias|de nada)', label: 'Gracias / De nada' }],
      model: 'A: Disculpe, ¿hay un banco por aquí? B: Sí, hay uno al final de esta calle, al lado del cine. A: ¿No está lejos? B: No, está muy cerca. A: Muchas gracias. B: De nada.' }));
  };

  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Observa los dibujos y di dónde está el perro. Puedes usar las siguientes preposiciones y adverbios.', { kr: '그림 속 강아지(el perro)의 위치를 <b>Está …</b> 로 쓰세요. 여기서 el banco 는 "벤치"예요 (은행과 같은 단어!).' })}
      <div class="ybox wordbank">${['delante de', 'detrás de', 'a la izquierda de', 'a la derecha de', 'entre', 'debajo de', 'encima de', 'al lado de', 'en frente de', 'fuera de', 'dentro de'].map(x => `<span>${x}</span>`).join('')}</div>
      ${modelo('A: ¿Dónde está el perro?<br>B: Está delante del banco.')}
      ${tip('<b>de + el banco = del banco</b> · de + la casa = de la casa · entre <b>A y B</b>')}
      <div class="dogs"></div>
      <h3 class="h3">🐕 거꾸로 해 보기 — 문장을 읽고 강아지를 놓을 자리(?)를 누르세요</h3>
      <div class="place"></div>`);
    D.perro.forEach((p, i) => {
      const box = el(`<div class="dogc"><b>${i + 1})</b>${scene(p.k)}</div>`);
      box.appendChild(writeItem({ id: 'a1-' + i, sec: 'a1', skill: 'pre', ph: 'Está …', answers: withSubj('El perro', p.a) }));
      put(s, '.dogs', box);
    });
    const st = sel('a1p');
    [['debajo', 'El perro está debajo del banco.'], ['izquierda', 'El perro está a la izquierda del banco.'], ['detras', 'El perro está detrás del banco.'], ['encima', 'El perro está encima del banco.']].slice(0, 3)
      .forEach(([k, txt], i) => {
        const id = 'a1-p' + i;
        reg(id, 'a1', 'pre');
        const box = el(`<div class="item"><div class="pq">${i + 1}. ${txt} ${say(txt)}</div><div class="sv"></div><div class="item-row"><button class="btn chk">확인</button><span class="mkbox"></span></div><div class="fb"></div></div>`);
        const draw = (res) => {
          const v = st[i];
          const d = v ? DOGAT[v] : null;
          const hs = Object.entries(HS).filter(([h]) => h !== v).map(([h, [x, y]]) => `<g class="hs ${res && h === k ? 'ok' : ''}" data-h="${h}"><circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y + 4}">?</text></g>`).join('');
          const dg = d ? `<g class="hs on ${res ? (v === k ? 'ok' : 'no') : ''}" data-h="${v}"><circle cx="${HS[v][0]}" cy="${HS[v][1]}" r="12"/></g>${dog(d[0], d[1], d[2])}` : '';
          const back = v === 'detras' ? dg + bench(100) : bench(100) + dg;
          $('.sv', box).innerHTML = `<svg class="scn" viewBox="0 0 200 130">${BG}${back}${hs}</svg>`;
          $$('.hs', box).forEach(g => g.onclick = () => { st[i] = g.dataset.h; save(); draw(); });
        };
        draw();
        $('.chk', box).onclick = () => {
          if (!st[i]) { $('.fb', box).innerHTML = '<span class="warn">먼저 자리를 누르세요.</span>'; return; }
          const ok = st[i] === k;
          record(id, ok ? 1 : 0, ok ? [] : ['estructura'], {});
          $('.mkbox', box).innerHTML = MARK(ok ? 1 : 0);
          box.classList.remove('is-ok', 'is-no'); box.classList.add(ok ? 'is-ok' : 'is-no');
          $('.fb', box).innerHTML = ok ? '<span class="good">¡Correcto! 👏</span>' : '초록 테두리 자리가 정답이에요.';
          draw(true);
        };
        put(s, '.place', box);
      });
  };

  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Mira el dibujo y describe qué hay en este barrio.', { kr: '① 단어 상자의 장소 이름을 누른 뒤 지도의 건물을 누르면 이름표가 붙어요. ② 지도를 보고 질문에 답하세요.' })}
      <div class="ybox bank"></div>
      <div class="map6"></div>
      <div class="item-row"><button class="btn chk m">지도 채점하기</button><span class="mscore"></span></div>
      <h3 class="h3">✍️ 지도를 보고 질문에 답하세요</h3><div class="items two q"></div>
      <h3 class="h3">✍️ ¿Hay … en este barrio? — Sí, hay … / No, no hay …</h3><div class="items two hy"></div>
      <h3 class="h3">✍️ 이 동네를 묘사하세요 — En este barrio hay …</h3><div class="f"></div>`);
    const st = sel('a2map');
    let picked = null;
    const bank = $('.bank', s), map = $('.map6', s);
    bank.innerHTML = shuffle(D.mapa.map(m => m.es)).map(w => `<button class="wchip" data-w="${esc(w)}">${w}</button>`).join('');
    map.innerHTML = `<div class="st h" style="top:20%"></div><div class="st h" style="top:72.5%"></div><div class="st v" style="left:31%"></div><div class="st v" style="left:63.5%"></div>
      <div class="plaza" style="left:1.5%;top:47%;width:28.5%;height:24%">Plaza Mayor</div><span class="fuente" style="left:21%;top:60%">⛲</span>
      <div class="field" style="left:36%;top:47%;width:24%;height:7%"></div>
      <div class="bld fixed" style="left:68%;top:2%;width:18%"><span class="be">🛒</span><span class="slot">supermercado</span></div>
      <div class="bld fixed" style="left:36%;top:80%;width:24%"><span class="be">🌳🌳🌳</span><span class="slot">parque</span></div>
      <span class="here" style="left:41%;top:60%">★ Estoy aquí.</span><span class="compass">🧭 위 = 뒤쪽 (detrás)</span>
      ${D.mapa.map((m, i) => { reg('a2-m' + i, 'a2', 'voc'); return `<div class="bld" data-i="${i}" style="left:${m.x}%;top:${m.y}%;${m.w ? 'width:' + m.w + '%;' : ''}"><span class="be">${m.e}</span><span class="slot"></span><span class="mkbox"></span></div>`; }).join('')}`;
    const paint = () => {
      $$('.bld[data-i]', map).forEach(b => { const v = st[b.dataset.i]; $('.slot', b).textContent = v || '?'; b.classList.toggle('filled', !!v); });
      $$('.wchip', bank).forEach(b => { b.classList.toggle('used', Object.values(st).includes(b.dataset.w)); b.classList.toggle('sel', b.dataset.w === picked); });
    };
    $$('.wchip', bank).forEach(b => b.onclick = () => { picked = b.dataset.w; paint(); });
    $$('.bld[data-i]', map).forEach(b => b.onclick = () => {
      if (!picked) { if (st[b.dataset.i]) { delete st[b.dataset.i]; save(); paint(); } return; }
      Object.keys(st).forEach(k => { if (st[k] === picked) delete st[k]; });
      st[b.dataset.i] = picked; picked = null; save(); paint();
    });
    $('.m', s).onclick = () => {
      let ok = 0;
      $$('.bld[data-i]', map).forEach(b => { const i = +b.dataset.i, good = st[i] === D.mapa[i].es; if (good) ok++; record('a2-m' + i, good ? 1 : 0, good ? [] : ['otro'], {}); b.classList.remove('ok', 'no'); b.classList.add(good ? 'ok' : 'no'); $('.mkbox', b).innerHTML = MARK(good ? 1 : 0) + (good ? '' : `<small>${D.mapa[i].es}</small>`); });
      $('.mscore', s).innerHTML = `${MARK(ok / D.mapa.length)} <b>${ok} / ${D.mapa.length}</b>`;
    };
    paint();
    [['1) ¿Dónde está el hospital?', withSubj('El hospital', ['Está al lado de la farmacia, en frente del banco.', 'Está en frente del banco, al lado de la farmacia.', 'Está al lado de la farmacia.', 'Está en frente del banco.', 'Está enfrente del banco.'])],
      ['2) ¿La papelería está cerca de la escuela?', ['Sí, está detrás de la escuela.', 'Sí, la papelería está detrás de la escuela.', 'Sí, está cerca.', 'Sí, está cerca de la escuela.']],
      ['3) ¿Dónde está el banco?', withSubj('El banco', ['Está en la plaza.', 'Está en la Plaza Mayor.'])],
      ['4) ¿Dónde está el mercado?', withSubj('El mercado', ['Está a la derecha del cine.', 'Está al lado del cine.'])],
      ['5) ¿La cafetería está cerca de la panadería?', ['Sí, está al lado.', 'Sí, está al lado de la panadería.', 'Sí, está a la derecha de la panadería.', 'Sí, está cerca.', 'Sí, está cerca de la panadería.']]]
      .forEach(([p, a], i) => put(s, '.q', writeItem({ id: 'a2-q' + i, sec: 'a2', skill: 'pre', prompt: `${p} ${say(p.slice(3))}`, answers: a })));
    [['¿Hay un cine en este barrio?', ['Sí, hay un cine.', 'Sí, hay uno.', 'Sí, hay un cine en este barrio.']],
      ['¿Hay un aeropuerto en este barrio?', ['No, no hay aeropuerto.', 'No, no hay un aeropuerto.', 'No, no hay.', 'No, no hay aeropuerto en este barrio.']],
      ['¿Hay una florería en este barrio?', ['Sí, hay una florería.', 'Sí, hay una.', 'Sí, hay una florería en este barrio.']]]
      .forEach(([p, a], i) => put(s, '.hy', writeItem({ id: 'a2-h' + i, sec: 'a2', skill: 'hay', prompt: `${p} ${say(p)}`, answers: a })));
    put(s, '.f', freeItem({ id: 'a2-f', sec: 'a2', rows: 4, prompt: '지도를 보고 "En este barrio hay …"로 시작해서 장소 4곳 이상과 위치 2개 이상을 쓰세요.', ph: 'En este barrio hay un cine, un mercado, … El cine está …',
      must: [{ re: W0 + 'hay' + W1, label: 'hay' }, { re: '(cine|mercado|librer[ií]a|papeler[ií]a|parada|estaci[oó]n|escuela|banco|hospital|farmacia|panader[ií]a|cafeter[ií]a|florer[ií]a|supermercado|parque)', label: '장소 4곳 이상', min: 4 },
        { re: W0 + 'est[aá]n?' + W1, label: '… está + 위치 (2번 이상)', min: 2 }, { re: '(delante|detr[aá]s|al lado|en frente|enfrente|entre|cerca|a la derecha|a la izquierda|en la plaza)', label: '위치 전치사' }],
      model: 'En este barrio hay un cine, un mercado, una escuela, un banco y un hospital. El mercado está a la derecha del cine. La papelería está detrás de la escuela. El hospital está al lado de la farmacia, en frente del banco.' }));
  };

  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Pregunta y contesta utilizando las palabras del recuadro.')}
      ${modelo('¿Qué es esto? - Es un bolso. / - Son unos papeles.')}
      ${tip('하나 → <b>Es</b> un/una … / 여러 개 → <b>Son</b> unos/unas … (¿Qué son estos? 라고 물어도 돼요)')}
      <div class="mp"></div>
      <h3 class="h3">✍️ ¿Qué es esto? — 그림을 보고 문장으로 대답하세요</h3><div class="items two w"></div>`);
    put(s, '.mp', matchPics({ id: 'a3-m', sec: 'a3', skill: 'art', cols: 4, title: '상자의 표현을 누른 뒤 그림 카드를 누르세요.', items: D.objetos.map(o => ({ e: o.e, es: o.es })) }));
    D.objetos.forEach((o, i) => put(s, '.w', writeItem({ id: 'a3-' + i, sec: 'a3', skill: 'art', prompt: `${i + 1}) <span class="emo-sm">${o.e.startsWith('<svg') ? o.e.replace('objsvg', 'objsvg" style="width:46px;height:36px') : o.e}</span> ¿Qué es esto?`, ph: 'Es … / Son …', answers: [o.a] })));
  };

  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'a) Di qué cosas hay sobre el escritorio.')}
      ${tip('여러 물건을 나열할 때: Hay A, B <b>y</b> C. — 마지막 물건 앞에만 y! 물건마다 관사(un, una, unos, unas)를 붙여요.')}
      <div class="desks"></div>
      <h2 class="act-title">b) Contesta las siguientes preguntas.</h2><div class="items b"></div>`);
    D.escritorios.forEach((d, i) => {
      const box = el(`<div class="deskc"><b>${i + 1})</b><div class="deskart"><div class="on">${d.on.join('')}</div><div class="top"></div><div class="leg l"></div><div class="leg r"></div></div></div>`);
      box.appendChild(freeItem({ id: 'a4-' + i, sec: 'a4', skill: 'hay', line: true, ph: 'Hay …',
        must: [{ re: '^\\s*hay' + W1, label: 'Hay 로 시작' }, ...d.items.map(([t, r]) => ({ re: W0 + acc(t.split(' ')[0]) + '\\s+' + r + W1, label: t })),
          { re: W0 + 'y\\s+(un|una|unos|unas|dos)' + W1, label: '마지막 물건 앞에 y' }], model: d.model }));
      put(s, '.desks', box);
    });
    [['1) ¿Qué hay en tu mochila?', 'En mi mochila hay …', 'En mi mochila hay un libro, dos cuadernos y un estuche.'],
      ['2) ¿Qué hay en tu escritorio?', 'En mi escritorio hay …', 'En mi escritorio hay un ordenador, una lámpara y unos bolígrafos.'],
      ['3) ¿Qué hay en el escritorio de tu profesor?', 'En el escritorio de mi profesor hay …', 'En el escritorio de mi profesor hay unos papeles, un diccionario y un vaso.']]
      .forEach(([p, ph, m], i) => put(s, '.b', freeItem({ id: 'a4-b' + i, sec: 'a4', line: true, prompt: `${p} ${say(p.slice(3))}`, ph,
        must: [{ re: W0 + 'hay' + W1, label: 'hay' }, { re: W0 + '(un|una|unos|unas|dos|tres|cuatro)\\s+\\p{L}+', label: '관사 + 물건 3개 이상', min: 3 }, { re: W0 + 'y' + W1, label: 'y 로 나열' }], model: m })));
  };

  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Una chica quiere comprar un bolígrafo en una papelería.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 쓰세요</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿La ayudo?</span><span class="hlc c1">Estoy mirando los bolígrafos. / Quiero comprar un bolígrafo.</span><span class="hlc c2">Tenemos todos estos.</span><span class="hlc c0">¿Cuánto vale?</span><span class="hlc c1">Lo compro.</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 나만의 대화 쓰기 — 가게에서 물건 사기</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    hideBtn(s, '#hide2', '#d2txt', '본문 가리기', '본문 보기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'dem', cls: 'lines', text: [
      ['Dependiente', '¡Buenos días! ¿La puedo [ayudar]? ¿Qué desea?'], ['Clienta', '¿[Tienen] bolígrafos?'], ['Dependiente', 'Sí. Mire, aquí. [Estos] son los que tenemos. ¿Qué le parecen?'],
      ['Clienta', '¿Puedo ver [ese] azul?'], ['Dependiente', '¿[Este]?'], ['Clienta', 'Sí, sí. ¿[Cuánto] cuesta?'], ['Dependiente', 'Cuesta tres euros con [veinticinco] céntimos.'],
      ['Clienta', 'Muy bien. Me lo [llevo].'], ['Dependiente', 'Pase a la [caja], por favor. ¿Cómo va a pagar?'], ['Clienta', 'En [efectivo].']]
      .map(([w, t]) => `<p><b class="who">${w}:</b> ${t}</p>`).join('') }));
    [['La clienta quiere comprar un bolígrafo rojo.', 'Falso'], ['La clienta paga con tarjeta de crédito.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'num', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['¡Buenos días! <u>¿La puedo ayudar?</u>', '¿La ayudo?', ['¡Buenos días! ¿La ayudo?', '¿La ayudo?']],
      ['<u>¿Tienen bolígrafos?</u>', 'Quiero comprar …', ['Quiero comprar un bolígrafo.']],
      ['<u>Estos son los que tenemos.</u>', 'Tenemos …', ['Tenemos todos estos.']],
      ['Sí, sí. <u>¿Cuánto cuesta?</u>', '¿Cuánto vale?', ['Sí, sí. ¿Cuánto vale?', '¿Cuánto vale?']],
      ['Muy bien. <u>Me lo llevo.</u>', 'Lo compro.', ['Muy bien. Lo compro.', 'Lo compro.']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'dem', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 6, prompt: '문구점이나 가게에서 물건을 사는 대화를 5~8줄로 쓰세요. (Dependiente: … / Cliente: …)',
      ph: 'Dependiente: ¡Buenos días! ¿Qué desea?\nCliente: ¿Tienen …?',
      must: [{ re: '(qu[eé] desea|(la|le|lo) (puedo )?ayud)', label: '¿Qué desea? / ¿La ayudo?' }, { re: '(tienen?|quiero comprar|estoy mirando)', label: '¿Tienen …? / Quiero comprar …' },
        { re: '(este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella)', label: '지시사 (este / ese …)' }, { re: 'cu[aá]nto (cuestan?|vale|valen)', label: '¿Cuánto cuesta / vale?' },
        { re: '(me (lo|la|los|las) llevo|(lo|la|los|las) compro)', label: 'Me lo llevo / Lo compro' }, { re: '(tarjeta|efectivo)', label: '계산 방법 (tarjeta / efectivo)' }],
      model: 'Dependiente: ¡Buenos días! ¿Qué desea? Cliente: ¿Tienen cuadernos? Dependiente: Sí, tenemos todos estos. Cliente: ¿Puedo ver ese verde? ¿Cuánto cuesta? Dependiente: Cuesta dos euros. Cliente: Lo compro. ¿Puedo pagar con tarjeta? Dependiente: Sí, pase a la caja, por favor.' }));
  };

  B.a5 = () => {
    const s = sec('a5', `${actHead(5, '¿Para qué sirven estas cosas? Relaciona y habla siguiendo el modelo.')}
      <div class="ybox wordbank">${['las llaves', 'el diccionario', 'el mapa', 'el lápiz', 'la lámpara', 'el vaso', 'la silla', 'la goma'].map(x => `<span>${x}</span>`).join('')}</div>
      ${modelo('La silla sirve para sentarse.')}
      ${tip('한 개 → <b>sirve</b> para + 동사원형 / 여러 개 → <b>sirven</b> para …: Las llaves <b>sirven</b> para abrir y cerrar la puerta.')}
      <div class="pm"></div>
      <h3 class="h3">✍️ modelo처럼 문장 전체를 쓰세요</h3><div class="items two w"></div>
      <h3 class="h3">⭐ 도전 — 상자에 남은 물건 (la lámpara)</h3><div class="f"></div>`);
    put(s, '.pm', pairMatch({ id: 'a5-p', sec: 'a5', skill: 'voc', title: '문장과 그림을 연결하세요.', pairs: D.sirve.map(x => [x.s, `<span style="font-size:34px">${x.e}</span>`]) }));
    D.sirve.forEach((x, i) => put(s, '.w', writeItem({ id: 'a5-' + i, sec: 'a5', skill: 'voc', prompt: `<span class="emo-sm">${x.e.startsWith('<svg') ? x.e.replace('objsvg', 'objsvg" style="width:46px;height:36px') : x.e}</span> <span class="chip">${x.o}</span> <span class="small">${x.s}</span>`, ph: `${x.o.charAt(0).toUpperCase() + x.o.slice(1)} …`, answers: [x.a, ...(x.alt || [])] })));
    put(s, '.f', freeItem({ id: 'a5-f', sec: 'a5', line: true, prompt: '💡 ¿Para qué sirve la lámpara?', ph: 'La lámpara sirve para …',
      must: [{ re: 'la l[aá]mpara sirve para', label: 'La lámpara sirve para' }, { re: 'para\\s+\\p{L}+(ar|er|ir|rse)' + W1, label: 'para + 동사원형' }], model: 'La lámpara sirve para leer por la noche.' }));
  };

  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Mira las fotos y di qué venden en estas tiendas.', { kr: '교재 사진을 진열대 그림으로 바꿨어요. <b>venden</b> = (그들이) 판다 → En la papelería venden cuadernos.' })}
      <div class="shops">
        <div class="shop"><b>1)</b><div class="shelf"><div class="row">📓📒✏️🖊️</div><div class="row">📏✂️📎🖍️</div><div class="row">📁🗂️📐🖌️</div></div></div>
        <div class="shop"><b>2)</b><div class="shelf"><div class="row">🥤🧃🥛🍶</div><div class="row">🍫🍪🍬🍭</div><div class="row">🥫🍟🍿🧺</div></div></div>
      </div>
      <div class="items two t"></div>
      <h3 class="h3">✍️ ¿Qué venden en estas tiendas?</h3><div class="items two f"></div>
      <h3 class="h3">🏪 우리 동네 가게 — 물건을 알맞은 가게로 옮기세요</h3><div class="sb"></div>
      <h3 class="h3">✍️ En la … venden …</h3><div class="items two w"></div>`);
    [['1) ¿Qué tienda es?', ['Es una papelería.', 'Es la papelería.', 'Una papelería.']],
      ['2) ¿Qué tienda es?', ['Es un supermercado.', 'Es una tienda de alimentación.', 'Es una tienda de comestibles.', 'Es una tienda de conveniencia.', 'Un supermercado.']]]
      .forEach(([p, a], i) => put(s, '.t', writeItem({ id: 'a6-t' + i, sec: 'a6', skill: 'voc', prompt: p, ph: 'Es una …', answers: a })));
    [['1) ¿Qué venden en la papelería?', 'En la papelería venden …', '(cuadernos?|l[aá]pi(z|ces)|bol[ií]grafos?|reglas?|tijeras|gomas?|carpetas?|clips|rotuladores?|ceras|pinceles)', 'En la papelería venden cuadernos, lápices, bolígrafos, reglas y tijeras.'],
      ['2) ¿Qué venden en el supermercado?', 'En el supermercado venden …', '(refrescos?|zumos?|leche|agua|chocolates?|galletas?|caramelos?|dulces|latas?|patatas fritas|palomitas|bebidas|comida)', 'En el supermercado venden refrescos, zumos, chocolates, galletas y patatas fritas.']]
      .forEach(([p, ph, re, m], i) => put(s, '.f', freeItem({ id: 'a6-f' + i, sec: 'a6', line: true, prompt: p, ph,
        must: [{ re: W0 + 'venden' + W1, label: 'venden' }, { re, label: '물건 3개 이상', min: 3 }], model: m })));
    put(s, '.sb', sortBoard({ id: 'a6-s', sec: 'a6', skill: 'voc', cols: [{ k: 'pap', label: '✏️ papelería' }, { k: 'sup', label: '🛒 supermercado' }, { k: 'lib', label: '📚 librería' }, { k: 'pan', label: '🥖 panadería' }, { k: 'flo', label: '💐 florería' }, { k: 'far', label: '💊 farmacia' }],
      chips: [['cuadernos', 'pap'], ['lápices', 'pap'], ['refrescos', 'sup'], ['galletas', 'sup'], ['libros', 'lib'], ['novelas', 'lib'], ['pan', 'pan'], ['pasteles', 'pan'], ['flores', 'flo'], ['medicinas', 'far']] }));
    [['🥖 panadería', ['En la panadería venden pan.', 'En la panadería venden pan y pasteles.', 'En la panadería venden pasteles y pan.']],
      ['💐 florería', ['En la florería venden flores.']],
      ['💊 farmacia', ['En la farmacia venden medicinas.']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a6-w' + i, sec: 'a6', skill: 'voc', prompt: p, ph: 'En la … venden …', answers: a })));
  };

  B.a7 = () => {
    const card = (x, n) => `<div class="tagc">${n ? `<span class="num">${n})</span>` : ''}<div class="te">${x.e}</div><div class="tn">${x.es}</div><span class="tp">${x.p} euros</span></div>`;
    const s = sec('a7', `${actHead(7, 'Con tu compañero, pregunta y contesta el precio de las cosas siguiendo el modelo.')}
      <div class="bici">${modelo('Cliente : ¿Puedo ver esa bicicleta?<br>Dependiente: ¿Esta?<br>Cliente : Sí. ¿Cuánto cuesta?<br>Dependiente: Cuesta doscientos noventa y nueve euros con noventa y nueve céntimos.<br>Cliente : Bueno, la compro. ¿Puedo pagar con tarjeta?<br>Dependiente: Sí, pase por la caja, por favor.')}
        ${card({ e: '🚲', es: 'la bicicleta', p: '299,99' })}</div>
      <div class="tags">${D.precios.map((x, i) => card(x, i + 1)).join('')}</div>
      <h3 class="h3">① 손님 — "¿Puedo ver …?" 지시사를 알맞게 (ese · esa · esos · esas)</h3><div class="c1"></div>
      <h3 class="h3">② 점원 — 가격을 글자로 쓰세요 (… cuesta / cuestan …)</h3><div class="items w"></div>
      <h3 class="h3">🎧 ③ 가격 듣고 숫자로 쓰기</h3><div class="items two l"></div>
      <h3 class="h3">④ 하나를 골라 modelo처럼 대화 전체를 쓰세요</h3><div class="f"></div>`);
    put(s, '.c1', cloze({ id: 'a7-c', sec: 'a7', skill: 'dem', cls: 'lines', text: D.precios.map((x, i) => {
      const n = (x.alt ? x.alt[0] : x.es).replace(/^(el|la|los|las) /, '');
      return `<p>${i + 1}) ¿Puedo ver [${x.dem}] ${n}?</p>`;
    }).join('') }));
    D.precios.forEach((x, i) => {
      const v = x.pl ? 'cuestan' : 'cuesta', V = v.charAt(0).toUpperCase() + v.slice(1);
      const subs = x.alt || [x.es];
      const ans = [...subs.map(n => `${n.charAt(0).toUpperCase() + n.slice(1)} ${v} ${x.w}.`), `${V} ${x.w}.`];
      put(s, '.w', writeItem({ id: 'a7-' + i, sec: 'a7', skill: 'num', prompt: `${i + 1}) ${x.e} ${x.es} — <b>${x.p} €</b>`, ph: `${V} … euros con … céntimos`, answers: ans }));
    });
    [['trescientos cuarenta y cinco euros', ['345']], ['ochocientos noventa euros', ['890']], ['mil quinientos euros', ['1500', '1.500', '1 500']]]
      .forEach(([t, a], i) => put(s, '.l', writeItem({ id: 'a7-l' + i, sec: 'a7', skill: 'num', prompt: `${i + 1}) ${say(t)} <span class="small">들은 가격을 숫자로 (€ 빼고)</span>`, ph: '예: 299,99', answers: a })));
    put(s, '.f', freeItem({ id: 'a7-f', sec: 'a7', rows: 6, prompt: '1)~6) 중 하나를 골라 Cliente / Dependiente 대화를 쓰세요.', ph: 'Cliente: ¿Puedo ver ese reloj?\nDependiente: ¿Este?',
      must: [{ re: 'puedo ver (ese|esa|esos|esas)', label: '¿Puedo ver ese / esa …?' }, { re: '¿\\s*(este|esta|estos|estas)\\s*\\?', label: '¿Este / Esta? (대명사)' },
        { re: 'cu[aá]nto cuestan?', label: '¿Cuánto cuesta(n)?' }, { re: W0 + 'cuestan?' + W1 + '[^.?!]*euros', label: 'Cuesta(n) … euros' },
        { re: '(me (lo|la|los|las) llevo|(lo|la|los|las) compro)', label: 'Lo / La compro' }],
      model: 'Cliente: ¿Puedo ver ese reloj? Dependiente: ¿Este? Cliente: Sí. ¿Cuánto cuesta? Dependiente: Cuesta ciento treinta euros con veinticinco céntimos. Cliente: Bueno, lo compro. ¿Puedo pagar con tarjeta? Dependiente: Sí, pase por la caja, por favor.' }));
  };

  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Escucha los diálogos y completa el cuadro.', { listen: true, kr: '교재 듣기 대본(TRANSCRIPCIONES)을 ▶ 로 들려줘요. 먼저 본문을 가리고 들어 보세요.' })}
      <h3 class="h3">1) <button class="btn ghost sm" id="p8a">▶ 대화 1 듣기</button> 2) <button class="btn ghost sm" id="p8b">▶ 대화 2 듣기</button> <button class="btn ghost sm" id="hide8">본문 보기</button></h3>
      <div id="d8txt" class="blur"><div class="grid2"><div>${dialogHTML(D.dialogo8a)}</div><div>${dialogHTML(D.dialogo8b)}</div></div></div>
      <h3 class="h3">📋 표를 완성하세요</h3><div class="t"></div>
      <h3 class="h3">① 내용 확인</h3><div class="items vf"></div>
      <h3 class="h3">② 문장으로 답하세요</h3><div class="items w"></div>`);
    $('#p8a', s).onclick = e => playLines(D.dialogo8a, e.currentTarget);
    $('#p8b', s).onclick = e => playLines(D.dialogo8b, e.currentTarget);
    hideBtn(s, '#hide8', '#d8txt', '본문 가리기', '본문 보기');
    put(s, '.t', cloze({ id: 'a8-t', sec: 'a8', skill: 'num', cls: 't8', text:
      `<div class="th"></div><div class="th">¿Qué quiere comprar?</div><div class="th">¿Cuánto cuesta/cuestan?</div><div class="th">¿Lo compra?</div>
       <div>1)</div><div>[unas gafas de sol|gafas de sol|unas gafas]</div><div>[60,57|60,57 euros|60,57 €] €</div><div>[sí|si]</div>
       <div>2)</div><div>[un bolso|un bolso negro|bolso negro|bolso]</div><div>[450|450 euros] €</div><div>[no]</div>` }));
    [['El cliente del diálogo 1 busca unas gafas de sol para una chica joven.', 'Verdadero'], ['El bolso negro cuesta cuarenta y cinco euros.', 'Falso'], ['La clienta del diálogo 2 compra el bolso.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'a8-vf' + i, sec: 'a8', skill: 'num', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['¿Cuánto cuestan las gafas de sol? <span class="small">(숫자를 글자로)</span>', ['Cuestan sesenta euros con cincuenta y siete céntimos.', 'Las gafas de sol cuestan sesenta euros con cincuenta y siete céntimos.']],
      ['¿Cuánto cuesta el bolso negro? <span class="small">(숫자를 글자로)</span>', ['Cuesta cuatrocientos cincuenta euros.', 'El bolso negro cuesta cuatrocientos cincuenta euros.']],
      ['¿Por qué no compra el bolso la clienta? <span class="small">(그녀는 나중에 다시 올 거예요 → Porque …)</span>', ['Porque es muy caro.', 'Porque cuesta mucho.', 'Porque es caro.', 'Porque va a volver más tarde.', 'Porque vuelve más tarde.']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a8-w' + i, sec: 'a8', skill: i === 2 ? 'int' : 'num', prompt: p, answers: a })));
  };

  SC.lesson({
    num: '06',
    title: '¿Dónde está la parada de autobús?',
    ttsTest: '¿Dónde está la parada de autobús?',
    cover: {
      emoji: '🚏🏦💶<br><small>🐕 ¿Dónde está?</small>',
      bg: 'linear-gradient(135deg,#6a4c93 0%,#c86b98 45%,#f6b26b 100%)',
      tema: ['Objetos', 'Instituciones y lugares públicos', 'De compras'],
      com: ['Expresar la existencia de algo', 'Describir objetos', 'Pedir cosas en una tienda', 'Preguntar el precio de una cosa', 'Describir la ubicación de las cosas', 'Describir la existencia y la ubicación de los lugares públicos'],
      gram: ['Interrogativos: <i>cuál, cuánto, dónde</i>', 'Verbos de existencia: <i>hay, estar</i>', 'Artículos definidos e indefinidos', 'Adjetivos y pronombres demostrativos', 'Preposiciones y adverbios de lugar']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      S: { name: 'Señorita', av: '👩🏼‍🦰', side: 'l' }, C: { name: 'Chico', av: '🧑🏻‍🦱', side: 'r' },
      Dependiente: { av: '👨🏻‍💼', side: 'l' }, Clienta: { av: '👩🏽', side: 'r' },
      Dependienta: { av: '👩🏻‍💼', side: 'l' }, Cliente: { av: '🧔🏻', side: 'r' }
    },
    errLabels: { hayestar: 'hay / estar 구분', preposicion: '위치 전치사 · del', demostrativo: '지시사 성·수' },
    errTips: {
      acento: 'está, están, detrás, autobús, estación, lápiz, bolígrafo, cuánto … 악센트도 철자예요.',
      hayestar: '무엇이 "있다"(존재) → hay + un/una… / 그것이 "어디에" 있다(위치) → el/la … está(n)',
      preposicion: 'de + el = del, a + el = al. delante de · detrás de · al lado de · en frente de · entre A y B',
      demostrativo: 'este/esta/estos/estas (이) · ese/esa/esos/esas (그) · aquel/aquella/aquellos/aquellas (저)',
      concordancia: '관사·지시사를 명사의 성·수에 맞춰요: un bolso / una mochila / unos papeles / unas cartas'
    },
    classify(ti, ta) {
      const has = (arr, re) => arr.some(w => re.test(w));
      if (has(ti, /^(hay|est[aá]n?)$/) && has(ta, /^(hay|est[aá]n?)$/) && ti.find(w => /^(hay|est[aá]n?)$/.test(w)) !== ta.find(w => /^(hay|est[aá]n?)$/.test(w))) return 'hayestar';
      const DEM = /^(este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas)$/;
      if (ti.filter(w => DEM.test(w)).join() !== ta.filter(w => DEM.test(w)).join()) return 'demostrativo';
      const PR = ['del', 'de', 'al', 'delante', 'detrás', 'detras', 'encima', 'debajo', 'lado', 'frente', 'enfrente', 'entre', 'dentro', 'fuera', 'derecha', 'izquierda', 'cerca', 'lejos'];
      if (ti.filter(w => PR.includes(w)).join() !== ta.filter(w => PR.includes(w)).join()) return 'preposicion';
      return null;
    },
    errRules: [
      { re: W0 + 'de el' + W1, t: 'preposicion', msg: '"de el"(✕) → "del"' },
      { re: W0 + 'a el' + W1, t: 'preposicion', msg: '"a el"(✕) → "al"' },
      { re: W0 + 'hay (el|la|los|las|mi|tu|su)' + W1, t: 'hayestar', msg: 'hay 뒤에는 정관사·소유사 ✕ → "Hay un/una …" 또는 "El/La … está …"' },
      { re: W0 + '(est[aá]|est[aá]n) (un|una|unos|unas)' + W1, t: 'hayestar', msg: '처음 말하는 것의 존재는 "hay + un/una"' },
      { re: W0 + '(delante|detr[aá]s|encima|debajo|dentro|fuera|cerca|lejos|al lado|en frente|enfrente) (el|la|los|las)' + W1, t: 'preposicion', msg: '위치 표현 뒤에 "de"가 필요해요: delante de la …, delante del …' },
      { re: W0 + 'esto (bol[ií]grafo|libro|cuaderno|bolso|reloj|ordenador|mapa|vaso|l[aá]piz|diccionario|escritorio)' + W1, t: 'demostrativo', msg: '명사 앞 남성형은 "este" (esto 는 명사 없이만)' },
      { re: W0 + '(estos|esos) (gafas|mochilas|llaves|cartas|sillas|mesas)' + W1, t: 'demostrativo', msg: '여성 복수 → estas / esas' },
      { re: W0 + 'cuesta (los|las)' + W1, t: 'concordancia', msg: '복수 주어 → cuestan' },
      { re: W0 + '(los|las) [\\p{L} ]{2,20}? cuesta' + W1, t: 'concordancia', msg: '복수 주어 → cuestan' },
      { re: W0 + 'cien (y|treinta|cuarenta|cincuenta|veinte|diez)' + W1, t: 'otro', msg: '101~199 는 "ciento …" (cien 은 딱 100)' },
      { re: W0 + '(cinco|quinien)cientos' + W1, t: 'otro', msg: '500 = quinientos' }
    ],
    accWords: ['detrás', 'bolígrafo', 'bolígrafos', 'lápices', 'céntimos', 'periódico', 'crédito', 'florería', 'teléfono', 'mayoría', 'periódicos'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Dónde está la parada de autobús?', 'Está delante del mercado, en frente de la farmacia.', '¿Hay un banco por aquí?', 'Sí, hay uno cerca, al lado del cine.', '¿Cuánto cuesta este bolso?', 'Hay un libro, un cuaderno, una goma y unos lápices.'],
    utilSkill: 'pre',
    proverbio: { es: 'No hay mejor hermano que un buen vecino al lado.', e: '🏘️', answer: '먼 사촌보다 가까운 이웃이 낫다', options: ['먼 사촌보다 가까운 이웃이 낫다', '등잔 밑이 어둡다', '소 잃고 외양간 고친다', '발 없는 말이 천 리 간다'], kr: '바로 옆의 좋은 이웃보다 나은 형제는 없다 — 우리말 "이웃사촌"과 같은 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'En la papelería — 역할극을 대화문으로 쓰기',
        icons: ['🏪', '✏️', '💶'],
        html: `<div class="ybox"><b>Alumno A</b>: Eres el dependiente de una papelería. Atiende a tu cliente. Piensa en las cosas que vendes y en sus precios.<br><b>Alumno B</b>: Estás en una papelería y quieres comprar tres cosas. Tienes 50 euros. Decide qué vas a comprar.</div>
          ${modelo('A: Buenas tardes. ¿Qué desea?<br>B: Buenas tardes. ¿Tiene...?')}`,
        questions: ['Escribe el diálogo entre el dependiente (A) y tú (B). ¿Qué tres cosas compras?',
          '¿Dónde están las cosas en la tienda? ¿Cuánto cuestan? (este / ese / aquel, delante de, al lado de …)',
          '¿Cuánto pagas en total (menos de 50 euros)? ¿Cómo vas a pagar: con tarjeta o en efectivo?'],
        minWords: 50,
        hint: 'hay · está · 지시사 · 가격(숫자) · ¿Cuánto cuesta(n)? 를 활용하면 높은 점수!',
        ph: 'A: Buenas tardes. ¿Qué desea?\nB: Buenas tardes. ¿Tiene cuadernos?',
        connectors: ['y', 'pero', 'también', 'porque', 'entonces', 'bueno', 'pues', 'muy bien'],
        rubric: [
          { k: 'sal', label: '인사 · ¿Qué desea?', max: 6, re: 'buenos d[ií]as|buenas tardes|hola|qu[eé] desea|(la|le|lo) (puedo )?ayud[ao]r?', ax: 'Contenido' },
          { k: 'ten', label: '¿Tiene(n) …? / Quiero comprar …', max: 8, re: 'tienen?|tenemos|quiero comprar|estoy mirando', ax: 'Contenido' },
          { k: 'cos', label: '문구 3가지 이상', max: 10, min: 3, re: 'bol[ií]grafos?|l[aá]pi(z|ces)|gomas?|cuadernos?|carpetas?|reglas?|tijeras|mochilas?|papel(es)?|libros?|diccionarios?|rotuladores?|sobres?|estuches?|calculadoras?|agendas?|mapas?', ax: 'Contenido' },
          { k: 'pre', label: '¿Cuánto cuesta(n) / vale?', max: 8, re: 'cu[aá]nto (cuestan?|vale|valen)', ax: 'Gramática' },
          { k: 'num', label: '가격 (… euros) 2번 이상', max: 10, min: 2, re: 'euros?', ax: 'Gramática' },
          { k: 'dem', label: '지시사 este · ese · aquel', max: 8, re: 'este|esta|estos|estas|ese|esa|esos|esas|aquel|aquella|aquellos|aquellas', ax: 'Gramática' },
          { k: 'pag', label: '구매 · 계산 (lo compro, tarjeta …)', max: 10, re: 'me (lo|la|los|las) llevo|(lo|la|los|las) compro|tarjeta|efectivo|caja', ax: 'Contenido' }
        ],
        model: 'A: Buenas tardes. ¿Qué desea? B: Buenas tardes. ¿Tiene cuadernos? A: Sí, están allí, al lado de los bolígrafos. B: ¿Cuánto cuesta ese cuaderno azul? A: ¿Este? Cuesta cuatro euros. B: Muy bien, lo compro. También quiero comprar una goma y aquella mochila. ¿Cuánto cuestan? A: La goma cuesta un euro y la mochila cuesta treinta euros. B: Bueno, me las llevo. ¿Puedo pagar con tarjeta? A: Sí, pase a la caja, por favor.'
      }
    },
    build: B
  });
})();
