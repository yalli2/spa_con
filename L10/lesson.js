/* Lección 10 · ¿Qué te pasa? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, matchPics, sortBoard, flipGrid,
    actHead, dlgHead, modelo, tip, notice, h3, acc, W0, W1, playLines, speak, dialogHTML, clozeFromDialog, MARK, tl, grade } = SC;

  /* Lección 10 · ¿Qué te pasa? — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vocabulario 어휘',
      cue: 'Cuerpo 신체 부위',
      dol: 'Doler 아프다',
      sin: 'Síntomas 증상·처방',
      per: 'Perfecto 현재완료',
      par: 'Participio 과거분사',
      adv: 'Ya·Todavía 부사',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '병원 · 약국 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '마놀로와 에스텔라', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '신체 부위 단어 찾기', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '몸 그림에 이름 쓰기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '어디가 아파? doler', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '증상과 처방', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '누가 어디가 아플까?', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '¿Has … alguna vez?', group: 'Diálogo 1', kind: 'act', n: 6 },
      { id: 'd2', label: 'Diálogo 2', kr: '미겔과 엄마의 전화', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a7', label: 'Actividad 7', kr: '나의 경험 nunca · ya', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '그림 묘사 — 현재완료', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '지난 방학에 한 일', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '안토니오의 할 일', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '경험 묻고 답하기', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'a12', label: 'Actividad 12', kr: '새 학년 이야기', group: 'Diálogo 2', kind: 'act', n: 12 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    lugares: [
      { e: '💊', es: 'la farmacia', kr: '약국', a: ['la farmacia', 'farmacia'] },
      { e: '🚨', es: 'urgencias', kr: '응급실', a: ['urgencias', 'las urgencias'] },
      { e: '🚑', es: 'la ambulancia', kr: '구급차', a: ['la ambulancia', 'ambulancia'] },
      { e: '🩺', es: 'el centro de salud', kr: '보건소 (동네 진료소)', a: ['el centro de salud', 'centro de salud'] },
      { e: '🏥', es: 'el hospital general', kr: '종합 병원', a: ['el hospital general', 'hospital general'] },
      { e: '🪑', es: 'la sala de espera', kr: '대기실', a: ['la sala de espera', 'sala de espera'] }
    ],
    extraVoc: [
      { e: '👨‍⚕️', es: 'el médico de cabecera', kr: '주치의 (가정의)' },
      { e: '📅', es: 'pedir cita', kr: '진료 예약을 하다' },
      { e: '📝', es: 'recetar un medicamento', kr: '약을 처방하다' },
      { e: '☎️', es: 'el número 112', kr: '긴급 전화 112 (스페인)' }
    ],

    dialogo1: [
      { who: 'Manolo', es: '¡Hola, Estela! [¿Qué te pasa?] Tienes mala cara.' },
      { who: 'Estela', es: 'Sí, no me encuentro bien; estoy cansada y [me duele la cabeza].' },
      { who: 'Manolo', es: 'Pues ve a casa, tómate un vaso de leche y duerme. Oye, y tu madre, ¿cómo está?' },
      { who: 'Estela', es: 'Ella no está bien; le duele mucho la espalda y tiene mucha fiebre.' },
      { who: 'Manolo', es: '¿Sí?' },
      { who: 'Estela', es: 'Sí, como ayer fue el cumpleaños de mi padre, todo el día estuvo preparando mucha comida para toda la familia. Hasta tarde no pudo descansar.' },
      { who: 'Manolo', es: '¿De verdad? [¡Qué lástima!]' },
      { who: 'Estela', es: 'No te preocupes. Poco a poco está mejorando.' }
    ],
    dialogo1cz: [
      { who: 'Manolo', es: '¡Hola, Estela! ¿Qué te [pasa]? Tienes mala [cara].' },
      { who: 'Estela', es: 'Sí, no me [encuentro] bien; estoy [cansada] y me [duele] la cabeza.' },
      { who: 'Manolo', es: 'Pues ve a casa, [tómate] un vaso de leche y [duerme]. Oye, y tu madre, ¿cómo está?' },
      { who: 'Estela', es: 'Ella no está bien; le duele mucho la [espalda] y tiene mucha [fiebre].' },
      { who: 'Manolo', es: '¿De verdad? ¡Qué [lástima]!' },
      { who: 'Estela', es: 'No te [preocupes]. Poco a poco está [mejorando].' }
    ],

    dialogo2: [
      { who: 'Madre', es: '¿Sí? [¿Dígame?]' },
      { who: 'Miguel', es: 'Hola, mamá, soy Miguel.' },
      { who: 'Madre', es: '¡Miguel! Bueno, cuenta, ¿qué tal tu visita?' },
      { who: 'Miguel', es: 'Esta mañana nos hemos levantado muy [pronto]. El guía ha llegado a las nueve. Hemos visitado la Alhambra y nos ha contado su historia. Después hemos ido a la playa de Salobreña.' },
      { who: 'Madre', es: '¿Y os habéis bañado?' },
      { who: 'Miguel', es: 'Sí.' },
      { who: 'Madre', es: '¿Has [sacado] muchas fotos?' },
      { who: 'Miguel', es: 'Sí, muchas.' },
      { who: 'Madre', es: '¿Dónde habéis comido?' },
      { who: 'Miguel', es: 'En la playa, un bocadillo.' },
      { who: 'Madre', es: '¿Te ha gustado la Alhambra?' },
      { who: 'Miguel', es: 'Sí, mucho. Bueno, mañana llamo otra vez. Hasta mañana.' }
    ],
    dialogo2cz: [
      { who: 'Miguel', es: 'Esta mañana nos [hemos levantado] <i>(levantarse)</i> muy pronto. El guía [ha llegado] <i>(llegar)</i> a las nueve. [Hemos visitado] <i>(visitar)</i> la Alhambra y nos [ha contado] <i>(contar)</i> su historia. Después [hemos ido] <i>(ir)</i> a la playa de Salobreña.' },
      { who: 'Madre', es: '¿Y os [habéis bañado] <i>(bañarse)</i>?' },
      { who: 'Madre', es: '¿[Has sacado] <i>(sacar)</i> muchas fotos?' },
      { who: 'Madre', es: '¿Dónde [habéis comido] <i>(comer)</i>?' },
      { who: 'Madre', es: '¿Te [ha gustado] <i>(gustar)</i> la Alhambra?' }
    ],

    /* Actividad 1 — sopa de letras (교재 그대로) */
    sopa: ['BAHBOCAHO', 'PBOJLHCPJ', 'EAMTMANOO', 'CABEZAEIO', 'HIRLMZPLJ', 'OAONARIZO', 'IACOCPEAV'],
    sopaWords: [
      { w: 'PECHO', pos: [1, 0, 5, 0], es: 'el pecho', kr: '가슴', e: '🫁', ex: true },
      { w: 'HOMBRO', pos: [0, 2, 5, 2], es: 'el hombro', kr: '어깨', e: '🤷' },
      { w: 'BOCA', pos: [0, 3, 0, 6], es: 'la boca', kr: '입', e: '👄' },
      { w: 'MANO', pos: [2, 4, 2, 7], es: 'la mano', kr: '손', e: '✋' },
      { w: 'CABEZA', pos: [3, 0, 3, 5], es: 'la cabeza', kr: '머리', e: '🙆' },
      { w: 'OJO', pos: [3, 8, 5, 8], es: 'el ojo', kr: '눈', e: '👁️' },
      { w: 'NARIZ', pos: [5, 3, 5, 7], es: 'la nariz', kr: '코', e: '👃' }
    ],

    /* Actividad 2 — 몸 그림 (SOLUCIONES / TRANSCRIPCIONES) */
    body12: [
      { n: 1, p: 'cabeza', a: [400, 46], y: 38, s: 'r', ans: ['cabeza', 'la cabeza'] },
      { n: 2, p: 'ojo', a: [424, 102], y: 84, s: 'r', ans: ['ojo', 'el ojo', 'ojos', 'los ojos'] },
      { n: 3, p: 'nariz', a: [402, 124], y: 126, s: 'r', ans: ['nariz', 'la nariz'] },
      { n: 4, p: 'boca', a: [404, 148], y: 166, s: 'r', ans: ['boca', 'la boca'] },
      { n: 5, p: 'oreja', a: [328, 112], y: 112, s: 'l', ans: ['orejas', 'las orejas', 'oreja', 'la oreja'] },
      { n: 6, p: 'cuello', a: [390, 182], y: 186, s: 'l', ans: ['cuello', 'el cuello'] },
      { n: 7, p: 'hombro', a: [462, 210], y: 214, s: 'r', ans: ['hombro', 'el hombro', 'hombros', 'los hombros'] },
      { n: 8, p: 'brazo', a: [512, 312], y: 312, s: 'r', ans: ['brazo', 'el brazo', 'brazos', 'los brazos'] },
      { n: 9, p: 'mano', a: [548, 388], y: 392, s: 'r', ans: ['mano', 'la mano', 'manos', 'las manos'] },
      { n: 10, p: 'estomago', a: [400, 318], y: 318, s: 'l', ans: ['estómago', 'el estómago'] },
      { n: 11, p: 'pierna', a: [422, 505], y: 505, s: 'r', ans: ['pierna', 'la pierna', 'piernas', 'las piernas'] },
      { n: 12, p: 'pie', a: [440, 594], y: 594, s: 'r', ans: ['pie', 'el pie', 'pies', 'los pies'] }
    ],

    /* Actividad 5 — TRANSCRIPCIONES */
    script5: ['Enrique tiene dolor de estómago.', 'Pablo está nervioso porque le van a sacar una muela.', 'A Jaime le duele la mano.',
      'Sonia tiene mucha tos porque está resfriada.', 'Clara tiene mucha fiebre.', 'A Juan le duele la pierna.'],
    act5: [
      { e: '<span class="duo">😖🦷</span>', es: 'Pablo' }, { e: '<span class="duo">🛋️🤒</span>', es: 'Clara' }, { e: '<span class="duo">🤢🫄</span>', es: 'Enrique' },
      { e: '<span class="duo">🤕✋</span>', es: 'Jaime' }, { e: '<span class="duo">🤧😷</span>', es: 'Sonia' }, { e: '<span class="duo">🦵🩼</span>', es: 'Juan' }
    ],

    act6: [
      { e: '⛰️', inf: 'subir a la montaña', pp: 'subido', r: 'a la montaña' },
      { e: '🎬', inf: 'ver una película española', pp: 'visto', r: 'una película española', alt: ['¿Has visto alguna película española?'] },
      { e: '⛷️', inf: 'esquiar', pp: 'esquiado', r: '' },
      { e: '🍽️', inf: 'comer en un restaurante', pp: 'comido', r: 'en un restaurante' },
      { e: '🌟', inf: 'conocer a una persona famosa', pp: 'conocido', r: 'a una persona famosa', alt: ['¿Has conocido a alguna persona famosa?'] },
      { e: '🌎', inf: 'estar en un país latinoamericano', pp: 'estado', r: 'en un país latinoamericano', alt: ['¿Has estado en algún país latinoamericano?'] }
    ],

    act10: [
      ['preparar la presentación', 'preparado la presentación', 1],
      ['asistir a la reunión con los compañeros', 'asistido a la reunión con los compañeros', 1],
      ['visitar a unos clientes', 'visitado a unos clientes', 1],
      ['hacer un informe', 'hecho un informe', 0],
      ['enviar el informe por correo electrónico', 'enviado el informe por correo electrónico', 0],
      ['cenar con su jefe', 'cenado con su jefe', 0]
    ],

    act11: [
      { e: '🚶📱💥', x: 'perder el móvil', pp: 'perdido', r: 'el móvil' },
      { e: '✈️👩', x: 'viajar en avión', pp: 'viajado', r: 'en avión' },
      { e: '🏖️😎', x: 'tomar el sol en la playa', pp: 'tomado', r: 'el sol en la playa' },
      { e: '🏇', x: 'montar a caballo', pp: 'montado', r: 'a caballo' },
      { e: '🪑😭', x: 'llorar en público', pp: 'llorado', r: 'en público' },
      { e: '🦒🐘🚙', x: 'hacer un safari', pp: 'hecho', r: 'un safari' }
    ],

    utiles: [
      ['¿Qué te pasa?', '무슨 일 있어? / 어디 아파?'],
      ['Estoy muy nervioso.', '나 너무 긴장돼.'],
      ['Me duele muchísimo la cabeza.', '머리가 엄청 아파.'],
      ['Me duelen los brazos y las piernas.', '팔다리가 아파.'],
      ['¿Por qué no vas al médico?', '병원에 가 보는 게 어때?'],
      ['Es que no quiero ir.', '그게, 가기 싫어서.'],
      ['¿Quieres una aspirina?', '아스피린 줄까?'],
      ['Sí, gracias.', '응, 고마워.'],
      ['Es que no me gusta tomar medicinas.', '그게, 약 먹는 걸 안 좋아해서.'],
      ['¿A qué hora te has levantado hoy?', '오늘 몇 시에 일어났어?'],
      ['A las ocho.', '8시에.'],
      ['¿Ya has hecho las tareas?', '숙제 벌써 했어?'],
      ['Sí, ya las he hecho.', '응, 벌써 했어.'],
      ['No, todavía no las he hecho.', '아니, 아직 안 했어.'],
      ['¿Diga? / ¿Dígame? / ¿Sí?', '(전화) 여보세요?']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: 'Me ____ la cabeza. <i>(doler)</i>', a: ['duele'], s: 'dol' },
      { p: 'Me ____ los pies. <i>(doler)</i>', a: ['duelen'], s: 'dol' },
      { p: 'A mi madre ____ duele la espalda.', a: ['le'], s: 'dol' },
      { p: '¿A vosotros ____ duelen los ojos?', a: ['os'], s: 'dol' },
      { p: '¿Qué ____ duele? — Me duele el estómago. <i>(너)</i>', a: ['te'], s: 'dol' },
      { p: 'Esta mañana me ____ levantado muy pronto. <i>(haber)</i>', a: ['he'], s: 'per' },
      { p: '¿____ sacado muchas fotos? <i>(tú, haber)</i>', a: ['has'], s: 'per' },
      { p: 'Nosotros ____ visitado la Alhambra. <i>(haber)</i>', a: ['hemos'], s: 'per' },
      { p: '¿Dónde ____ comido vosotros? <i>(haber)</i>', a: ['habéis'], s: 'per' },
      { p: 'El guía ____ llegado a las nueve. <i>(haber)</i>', a: ['ha'], s: 'per' },
      { p: '¿Has ____ alguna película española? <i>(ver)</i>', a: ['visto'], s: 'par' },
      { p: 'Todavía no he ____ los deberes. <i>(hacer)</i>', a: ['hecho'], s: 'par' },
      { p: 'Mi hermano ha ____ un correo. <i>(escribir)</i>', a: ['escrito'], s: 'par' },
      { p: 'Mis padres han ____ de Perú. <i>(volver)</i>', a: ['vuelto'], s: 'par' },
      { p: 'Antonio ____ ha preparado la presentación. <i>(이미)</i>', a: ['ya'], s: 'adv' },
      { p: '____ no he hecho el informe. <i>(아직)</i>', a: ['todavía', 'aún'], s: 'adv' },
      { p: 'No he estado ____ en España. <i>(한 번도)</i>', a: ['nunca', 'jamás'], s: 'adv' },
      { p: '¿Has perdido el móvil ____ vez?', a: ['alguna'], s: 'adv' },
      { p: 'Estoy resfriado y ____ fiebre. <i>(tener)</i>', a: ['tengo'], s: 'sin' },
      { p: '¿Por qué no ____ tomas una aspirina? <i>(너 자신에게)</i>', a: ['te'], s: 'sin' },
      { p: '¡Qué ____! <i>(아쉬워라, 안됐다)</i>', a: ['lástima', 'pena'], s: 'sin' }
    ]
  };

  /* ---------- 공통 도우미 ---------- */
  const PP = W0 + '(he|has|ha|hemos|hab[eé]is|han)\\s+\\p{L}*(ado|ido|[ií]do|cho|sto|to|erto|elto)' + W1;   // 현재완료
  const tidy = s => s.replace(/\s+/g, ' ').replace(/ \?/g, '?').replace(/ \./g, '.');
  const qVar = (pp, r) => [`¿Has ${pp} alguna vez ${r}?`, `¿Alguna vez has ${pp} ${r}?`, `¿Has ${pp} ${r} alguna vez?`, `¿Has ${pp} ${r}?`].map(tidy);
  const blurBtn = (s, btnSel, boxSel, on, off) => { $(btnSel, s).onclick = e => { const t = $(boxSel, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? on : off; }; };

  /* 몸 그림 SVG — 부위마다 data-p, hot 목록은 빨갛게 강조 */
  function bodySVG(o = {}) {
    const hot = o.hot || [];
    const g = (p, inner) => `<g class="pt${hot.includes(p) ? ' hot' : ''}" data-p="${p}">${inner}</g>`;
    return `<svg class="bodysvg ${o.cls || ''}" viewBox="${o.vb || '0 0 800 640'}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="cuerpo">
      ${g('pierna', '<rect class="sk" x="366" y="425" width="28" height="160" rx="12"/><rect class="sk" x="406" y="425" width="28" height="160" rx="12"/>')}
      ${g('pie', '<ellipse class="sk" cx="372" cy="592" rx="25" ry="11"/><ellipse class="sk" cx="428" cy="592" rx="25" ry="11"/>')}
      <path class="shorts" d="M342 352 H458 L462 450 H404 L400 394 L396 450 H338 Z"/>
      ${g('brazo', '<path class="armo" d="M314 250 L266 366"/><path class="armo" d="M486 250 L534 366"/><path class="arm" d="M314 250 L266 366"/><path class="arm" d="M486 250 L534 366"/>')}
      ${g('mano', '<circle class="sk" cx="262" cy="382" r="17"/><circle class="sk" cx="538" cy="382" r="17"/>')}
      ${g('cuello', '<rect class="sk" x="386" y="150" width="28" height="52" rx="6"/>')}
      <path class="shirt" d="M352 192 H448 L503 236 L480 266 L460 250 V358 H340 V250 L320 266 L297 236 Z"/>
      <path class="ln" d="M384 192 Q400 210 416 192"/>
      ${g('pecho', '<rect class="hit" x="354" y="212" width="92" height="60" rx="18"/>')}
      ${g('estomago', '<rect class="hit" x="354" y="280" width="92" height="70" rx="18"/>')}
      ${g('hombro', '<circle class="hit" cx="343" cy="206" r="19"/><circle class="hit" cx="457" cy="206" r="19"/>')}
      ${g('oreja', '<circle class="sk" cx="337" cy="110" r="13"/><circle class="sk" cx="463" cy="110" r="13"/>')}
      ${g('cabeza', '<circle class="sk" cx="400" cy="105" r="62"/><path class="hair" d="M339 100 C330 52 368 36 400 38 C440 36 472 55 461 100 C450 74 424 62 398 70 C376 60 352 72 339 100 Z"/>')}
      ${g('oreja', '<circle class="hit" cx="332" cy="111" r="12"/><circle class="hit" cx="468" cy="111" r="12"/>')}
      ${g('ojo', '<circle class="hit" cx="378" cy="102" r="12"/><circle class="hit" cx="422" cy="102" r="12"/><circle class="eye" cx="378" cy="102" r="5"/><circle class="eye" cx="422" cy="102" r="5"/>')}
      ${g('nariz', '<circle class="hit" cx="400" cy="122" r="10"/><path class="ln" d="M400 110 L393 128 H405"/>')}
      ${g('boca', '<ellipse class="hit" cx="400" cy="146" rx="18" ry="9"/><path class="ln" d="M386 142 Q400 154 414 142"/>')}
    </svg>`;
  }
  const MINI_VB = '236 30 328 590';
  /* 문장 → 그림에서 강조할 부위 */
  const PARTS_RE = [['cabeza', 'cabeza'], ['ojo', 'ojo'], ['nariz', 'nariz'], ['boca', 'boca'], ['oreja|o[ií]do', 'oreja'], ['cuello', 'cuello'], ['hombro|espalda', 'hombro'],
    ['brazo', 'brazo'], ['mano', 'mano'], ['pecho', 'pecho'], ['est[oó]mago|barriga|tripa', 'estomago'], ['pierna|rodilla', 'pierna'], ['pie', 'pie']];
  const partsOf = t => PARTS_RE.filter(([re]) => new RegExp(W0 + '(' + re + ')s?' + W1, 'iu').test(t || '')).map(x => x[1]);

  const B = {};

  /* ---------- Antes de empezar ---------- */
  B.vocab = () => {
    const txt = 'En las grandes ciudades, los ambulatorios suelen estar abiertos todo el día (de 8:00 a 20:00 horas) y para ir a la consulta del médico se debe pedir cita. Normalmente, si la enfermedad no es muy grave, se va al médico de cabecera o de familia, que receta algún medicamento. En caso de emergencia, hay que llamar al número 112.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${txt} ${say(txt)}</p>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요</h3><div class="fg1"></div>
      <h3 class="h3">② 읽기 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">③ 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요 <span class="small">(관사 포함)</span></h3><div class="items two w"></div>`);
    put(s, '.fg1', flipGrid([...D.lugares, ...D.extraVoc]));
    [['Los ambulatorios están abiertos 24 horas.', 'Falso', '8:00~20:00 (de 8:00 a 20:00 horas)'],
      ['Para ir a la consulta del médico se debe pedir cita.', 'Verdadero', 'pedir cita = 예약하다'],
      ['Si la enfermedad no es grave, se va al médico de cabecera.', 'Verdadero', 'médico de cabecera = 주치의(가정의)'],
      ['En caso de emergencia, hay que llamar al número 911.', 'Falso', '스페인의 긴급 전화는 112']].forEach(([p, a, x], i) =>
      put(s, '.vf', choiceItem({ id: 'voc-vf' + i, sec: 'vocab', skill: 'voc', prompt: p, options: ['Verdadero', 'Falso'], answer: a, explain: x })));
    D.lugares.forEach((l, i) => put(s, '.w', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${l.e}</span> ${l.kr}`, answers: l.a })));
    put(s, '.w', writeItem({ id: 'voc-6', sec: 'vocab', skill: 'voc', prompt: '<span class="emo-sm">👨‍⚕️</span> 주치의 (가정의)', answers: ['el médico de cabecera', 'el médico de familia', 'médico de cabecera'] }));
    put(s, '.w', writeItem({ id: 'voc-7', sec: 'vocab', skill: 'voc', prompt: '<span class="emo-sm">📅</span> 진료 예약을 하다', answers: ['pedir cita', 'pedir una cita'] }));
  };

  /* ---------- Gramática ---------- */
  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. doler (o → ue) — 아픈 <u>부위</u>가 주어! (gustar 와 같은 구조)</h3>
        <div class="blocks"><span class="bk p">(A mí)</span><span class="bk o">me</span><span class="bk v">duele</span><span class="bk s">la cabeza</span></div>
        <div class="blocks"><span class="bk p">(A mí)</span><span class="bk o">me</span><span class="bk v">duelen</span><span class="bk s">los pies</span></div>
        <div class="legend-mini"><span class="bk p">강조 (생략 가능)</span><span class="bk o">me · te · le · nos · os · les</span><span class="bk v">doler 3인칭</span><span class="bk s">아픈 부위</span></div>
        ${tip('신체 부위에는 소유사(mi) 대신 <b>정관사</b>: Me duele <b>la</b> cabeza (○) / Me duele <s>mi</s> cabeza (✕)<br>같은 뜻: <b>Tengo dolor de</b> cabeza / estómago / muelas.')}
        <div class="g1"></div><div class="items two g1w"></div></div>
      <div class="gcard"><h3>2. 현재완료 (Pretérito perfecto) = haber + 과거분사</h3>
        <div class="blocks"><span class="bk p">Hoy</span><span class="bk v">he</span><span class="bk s">visitado</span><span class="bk o">la Alhambra.</span></div>
        <div class="legend-mini"><span class="bk p">시간 표현</span><span class="bk v">haber 현재형</span><span class="bk s">과거분사 (변하지 않음)</span></div>
        ${tip('<b>오늘 · 이번 주 · 올해</b>처럼 아직 끝나지 않은 시간 안에 한 일, 그리고 <b>경험</b>(alguna vez, nunca)을 말할 때 써요: hoy, esta mañana, esta semana, este año, alguna vez, nunca, ya, todavía')}
        <div class="g2"></div>
        ${tip('재귀동사는 대명사를 haber 앞에: <b>me he</b> levantado, <b>nos hemos</b> bañado.')}
        <div class="items two g2w"></div></div>
      <div class="gcard"><h3>3. 과거분사 (Participio pasado)</h3>
        <div class="blocks"><span class="bk v">-ar → -ado</span><span class="bk s">hablar → hablado</span></div>
        <div class="blocks"><span class="bk v">-er / -ir → -ido</span><span class="bk s">comer → comido · vivir → vivido</span></div>
        ${tip('불규칙: hacer → <b>hecho</b> · ver → <b>visto</b> · escribir → <b>escrito</b> · poner → <b>puesto</b> · volver → <b>vuelto</b> · decir → <b>dicho</b> · abrir → <b>abierto</b> · romper → <b>roto</b> · morir → <b>muerto</b> · descubrir → <b>descubierto</b>')}
        <div class="g3"></div></div>
      <div class="gcard"><h3>4. ya · todavía (aún) no · nunca · alguna vez</h3>
        <table class="dt"><tr><th>ya ✅</th><td>이미, 벌써</td><td>Ya he hecho las tareas.</td></tr><tr><th>todavía no / aún no ⏳</th><td>아직 ~ 안 했다</td><td>Todavía no he hecho las tareas.</td></tr>
          <tr><th>alguna vez ❓</th><td>(경험) ~해 본 적</td><td>¿Has estado alguna vez en México?</td></tr><tr><th>nunca / jamás 🚫</th><td>한 번도 ~ 않다</td><td>Nunca he estado en México.</td></tr></table>
        ${tip('<b>nunca/jamás</b>가 동사 앞이면 no 없이: Nunca he estado… / 뒤에 오면 no와 함께: No he estado jamás…')}
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 감탄문 ¡Qué …!</h3>
        <div class="blocks"><span class="bk v">¡Qué</span><span class="bk s">lástima / pena</span><span class="bk v">!</span><span class="small">명사</span></div>
        <div class="blocks"><span class="bk v">¡Qué</span><span class="bk s">bonito</span><span class="bk v">!</span><span class="small">형용사</span></div>
        ${tip('앞에 <b>¡</b>, 뒤에 <b>!</b> — 그리고 qué에는 악센트!')}
        <div class="items g5"></div></div>
      <div class="gcard"><h3>6. 증상 말하기 — estar + 상태 / tener + 명사</h3>
        <div class="cgrid">${[['🤒', 'Estoy enfermo/a', '아프다'], ['🤧', 'Estoy resfriado/a', '감기에 걸렸다'], ['😫', 'Estoy estresado/a', '스트레스 받았다'], ['😴', 'Estoy cansado/a', '피곤하다'], ['😰', 'Estoy nervioso/a', '긴장된다'],
          ['🌡️', 'Tengo fiebre', '열이 있다'], ['😷', 'Tengo tos', '기침을 한다'], ['🦠', 'Tengo gripe', '독감에 걸렸다']].map(([e, a, k]) => `<div class="ccard"><span class="emo">${e}</span><b>${a}</b><small>${k}</small></div>`).join('')}</div>
        ${tip('estar + 형용사는 성·수 일치: Estela está cansad<b>a</b>. / tener + 명사: Tengo fiebre.')}
        <div class="items two g6"></div></div>`);
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'dol', title: 'duele / duelen 또는 대명사를 쓰세요.', cls: 'lines', text:
      ['(A mí) me [duele] la cabeza.', '(A mí) me [duelen] los pies.', 'A Estela le [duele] la cabeza.', 'A mi madre [le] duele la espalda.', '¿A ti [te] duelen los ojos?', 'A nosotros [nos] duelen las piernas.'].map(x => `<p>${x}</p>`).join('') }));
    [['🦷', 'la muela', '나', ['Me duele la muela.', 'A mí me duele la muela.']], ['👂', 'los oídos', '나', ['Me duelen los oídos.', 'A mí me duelen los oídos.']],
      ['🦵', 'las piernas', 'María', ['A María le duelen las piernas.']], ['🤕', 'la cabeza', '너? (질문)', ['¿Te duele la cabeza?', '¿A ti te duele la cabeza?']]].forEach(([e, o, w, a], i) =>
      put(s, '.g1w', writeItem({ id: 'g1w-' + i, sec: 'gram', skill: 'dol', prompt: `<span class="emo-sm">${e}</span> <b>${o}</b> <span class="small">(${w})</span>`, answers: a })));
    put(s, '.g2', cloze({ id: 'g2', sec: 'gram', skill: 'per', title: 'haber 현재형 표를 완성하세요.', cls: 'table2', text:
      [['yo', 'he'], ['tú', 'has'], ['él / ella / usted', 'ha'], ['nosotros/as', 'hemos'], ['vosotros/as', 'habéis'], ['ellos / ellas / ustedes', 'han']].map(([a, b]) => `<p><span>${a}</span>[${b}] visitado</p>`).join('') }));
    [['yo', 'visitar la Alhambra', ['He visitado la Alhambra.', 'Yo he visitado la Alhambra.']], ['nosotros', 'levantarse pronto', ['Nos hemos levantado pronto.', 'Nosotros nos hemos levantado pronto.']],
      ['tú (질문)', 'sacar muchas fotos', ['¿Has sacado muchas fotos?', '¿Tú has sacado muchas fotos?']], ['vosotros (질문)', '¿Dónde? / comer', ['¿Dónde habéis comido?', '¿Dónde habéis comido vosotros?']]].forEach(([p, v, a], i) =>
      put(s, '.g2w', writeItem({ id: 'g2w-' + i, sec: 'gram', skill: 'per', prompt: `<span class="chip">${p}</span> ${v}`, answers: a })));
    put(s, '.g3', cloze({ id: 'g3', sec: 'gram', skill: 'par', title: '과거분사를 쓰세요.', cls: 'table2', text:
      [['hablar', 'hablado'], ['comer', 'comido'], ['vivir', 'vivido'], ['ir', 'ido'], ['hacer', 'hecho'], ['ver', 'visto'], ['escribir', 'escrito'], ['poner', 'puesto'], ['volver', 'vuelto'], ['decir', 'dicho']]
        .map(([a, b]) => `<p><span>${a}</span>→ [${b}]</p>`).join('') }));
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'adv', title: '알맞은 부사를 쓰세요.', cls: 'lines', text:
      ['A: ¿[Ya] has hecho las tareas?', 'B: Sí, [ya] las he hecho. ✅', 'C: No, [todavía|aún] no las he hecho. ⏳', 'A: ¿Has estado [alguna] vez en México?', 'B: No, [nunca|jamás] he estado allí. 🚫'].map(x => `<p>${x}</p>`).join('') }));
    [['😢 안됐다, 아쉬워라! <span class="small">(lástima)</span>', ['¡Qué lástima!', '¡Qué pena!']], ['😍 정말 예쁘다! <span class="small">(bonito)</span>', ['¡Qué bonito!', '¡Qué bonita!']],
      ['🥵 정말 덥다! <span class="small">(calor)</span>', ['¡Qué calor!']]].forEach(([p, a], i) => put(s, '.g5', writeItem({ id: 'g5-' + i, sec: 'gram', skill: 'sin', prompt: p, answers: a })));
    [['😴 (나·여) 피곤해.', ['Estoy cansada.']], ['🌡️ 열이 있어.', ['Tengo fiebre.']], ['🤧 (나·남) 감기에 걸렸어.', ['Estoy resfriado.']], ['😷 기침을 많이 해.', ['Tengo mucha tos.']]].forEach(([p, a], i) =>
      put(s, '.g6', writeItem({ id: 'g6-' + i, sec: 'gram', skill: 'sin', prompt: p, answers: a })));
  };

  /* ---------- Diálogo 1 ---------- */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Manolo habla con Estela en la clase.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Te pasa algo?</span><span class="hlc c1">Tengo dolor de cabeza</span><span class="hlc c2">¿Por qué no tomas…?</span><span class="hlc c0">¡Qué pena!</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blurBtn(s, '#hide1', '#d1txt', '본문 보기', '본문 가리기');
    [['Estela está cansada y le duele la cabeza.', 'Verdadero'], ['Manolo le recomienda tomar una aspirina.', 'Falso', '"tómate un vaso de leche" — 우유 한 잔'],
      ['A la madre de Estela le duele la espalda y tiene fiebre.', 'Verdadero'], ['La madre de Estela está cada día peor.', 'Falso', '"Poco a poco está mejorando." — 조금씩 나아지고 있어요']]
      .forEach(([p, a, x], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'sin', prompt: p, options: ['Verdadero', 'Falso'], answer: a, explain: x })));
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'sin', cls: 'lines', text: clozeFromDialog(D.dialogo1cz) }));
    [['"<u>¿Qué te pasa?</u>" → <span class="chip">¿Te pasa algo?</span> 로 바꿔 쓰세요.', ['¿Te pasa algo?']],
      ['"Me duele la cabeza." → <span class="chip">tener dolor de</span> 로 바꿔 쓰세요.', ['Tengo dolor de cabeza.']],
      ['"Tómate un vaso de leche." → <span class="chip">¿Por qué no tomas…?</span> 로 바꿔 쓰세요.', ['¿Por qué no tomas un vaso de leche?', '¿Por qué no te tomas un vaso de leche?']],
      ['"¡Qué lástima!" → <span class="chip">pena</span> 로 바꿔 쓰세요.', ['¡Qué pena!']]].forEach(([p, a], i) =>
      put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'sin', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '친구가 아파 보여요. 어디가 아픈지 묻고, 조언하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¡Hola! ¿Qué te pasa? Tienes mala cara.\nB: No me encuentro bien…',
      must: [{ re: '(qu[eé] te pasa|te pasa algo)', label: '¿Qué te pasa? / ¿Te pasa algo?' }, { re: W0 + '(me|te|le) duelen?' + W1 + '|tengo dolor de', label: 'Me duele(n) … / Tengo dolor de …' },
        { re: '(estoy|est[aá]s) (cansad|enferm|resfriad|estresad|nervios)[oa]s?|tengo (fiebre|tos|gripe)', label: 'Estoy … / Tengo fiebre·tos·gripe' }, { re: '(por qu[eé] no|tienes que|debes)', label: '조언 (¿Por qué no…? / Tienes que…)' },
        { re: '¡\\s*qu[eé] (l[aá]stima|pena)', label: '¡Qué lástima! / ¡Qué pena!' }],
      model: 'A: ¡Hola, Mina! ¿Qué te pasa? Tienes mala cara. B: No me encuentro bien; estoy cansada y me duele el estómago. A: ¡Qué pena! ¿Por qué no tomas un té caliente? B: Vale, gracias.' }));
  };

  /* ---------- Actividad 1 — sopa de letras ---------- */
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Busca en la sopa de letras siete partes del cuerpo.', { kr: '첫 글자를 누르고 마지막 글자를 누르면 단어가 선택돼요. (가로 · 세로) PECHO 는 예시예요.' })}
      <div class="ws-wrap"><div class="ws"><svg class="ws-svg"></svg><div class="ws-grid"></div></div>
        <div class="ws-side"><h3 class="h3">찾은 단어 <b class="ws-n"></b></h3><ol class="ws-list"></ol>
          <div class="item-row"><button class="btn ghost sm ws-hint">💡 힌트</button><button class="btn ghost sm ws-show">정답 보기</button><button class="btn ghost sm ws-reset">다시</button></div><p class="small ws-msg"></p></div></div>
      <h3 class="h3">✍️ 찾은 신체 부위를 <b>관사와 함께</b> 쓰세요</h3>
      ${tip('<b>la mano</b> 는 -o 로 끝나지만 여성 명사! / la nariz, la boca, la cabeza / el pecho, el hombro, el ojo')}
      <div class="items two w"></div>`);
    const st = sel('a1ws', { found: {}, hint: 0 });
    const words = D.sopaWords, G = D.sopa, R = G.length, C = G[0].length, CELL = window.innerWidth < 600 ? 34 : 46;
    const COL = ['#f26a21', '#2a8bd0', '#2e9d5b', '#a32638', '#8a5cc8', '#d4a900', '#e0559b'];
    words.forEach((w, i) => { if (!w.ex) reg('a1-w' + i, 'a1', 'cue'); });
    const grid = $('.ws-grid', s), svg = $('.ws-svg', s);
    grid.style.gridTemplateColumns = `repeat(${C}, ${CELL}px)`;
    svg.setAttribute('viewBox', `0 0 ${C * CELL} ${R * CELL}`); svg.style.width = C * CELL + 'px'; svg.style.height = R * CELL + 'px';
    grid.innerHTML = G.map((row, r) => [...row].map((ch, c) => `<button class="wsc" data-r="${r}" data-c="${c}" style="width:${CELL}px;height:${CELL}px">${ch}</button>`).join('')).join('');
    let start = null, shown = false;
    const cen = (r, c) => [c * CELL + CELL / 2, r * CELL + CELL / 2];
    const caps = () => {
      let h = '';
      words.forEach((w, i) => {
        const f = w.ex ? w.pos : st.found[w.w] || (shown ? w.pos : null); if (!f) return;
        const [x1, y1] = cen(f[0], f[1]), [x2, y2] = cen(f[2], f[3]);
        const miss = !w.ex && !st.found[w.w];
        h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${miss ? '#bbb' : COL[i % COL.length]}" class="${miss ? 'miss' : ''}"/>`;
      });
      if (start) { const [x, y] = cen(start[0], start[1]); h += `<circle cx="${x}" cy="${y}" r="19" class="st"/>`; }
      svg.innerHTML = h;
    };
    const list = () => {
      const n = words.filter(w => !w.ex && st.found[w.w]).length;
      $('.ws-n', s).textContent = `${n} / 6`;
      $('.ws-list', s).innerHTML = words.map((w, i) => {
        const ok = w.ex || st.found[w.w];
        const hintTxt = !ok && st.hint > 0 ? w.w[0] + ' ' + '_ '.repeat(w.w.length - 1) : '';
        return `<li class="${ok ? 'ok' : ''}">${ok ? `<span class="dotc" style="background:${COL[i % COL.length]}"></span><b>${w.w}</b> ${w.ex ? '<span class="small">(modelo)</span>' : ''} <span class="small">${w.e} ${w.kr}</span>` : `<span class="small">${hintTxt || '? ? ?'}</span>`}${!w.ex && st.found[w.w] ? ' ' + MARK(1) : ''}</li>`;
      }).join('');
      $$('.wsc', grid).forEach(b => b.classList.toggle('st', !!start && +b.dataset.r === start[0] && +b.dataset.c === start[1]));
      caps();
    };
    const pick = (r, c) => {
      if (!start) { start = [r, c]; $('.ws-msg', s).textContent = '마지막 글자를 누르세요.'; list(); return; }
      const [r1, c1] = start; start = null;
      const dr = Math.sign(r - r1), dc = Math.sign(c - c1), len = Math.max(Math.abs(r - r1), Math.abs(c - c1)) + 1;
      if (!(r === r1 || c === c1 || Math.abs(r - r1) === Math.abs(c - c1)) || len < 2) { $('.ws-msg', s).textContent = '가로 · 세로 · 대각선으로 이어진 글자만 선택할 수 있어요.'; list(); return; }
      let str = ''; for (let k = 0; k < len; k++) str += G[r1 + dr * k][c1 + dc * k];
      const rev = [...str].reverse().join('');
      const i = words.findIndex(w => w.w === str || w.w === rev);
      if (i < 0) { $('.ws-msg', s).innerHTML = `“${str}” — 신체 부위가 아니에요. 다시 찾아보세요.`; list(); return; }
      const w = words[i];
      if (w.ex) { $('.ws-msg', s).textContent = 'PECHO 는 예시예요. 다른 단어를 찾아보세요!'; list(); return; }
      if (!st.found[w.w]) { st.found[w.w] = [r1, c1, r, c]; save(); record('a1-w' + i, 1, [], {}); }
      $('.ws-msg', s).innerHTML = `¡Muy bien! <b>${w.w}</b> = ${w.e} ${w.kr} ${say(w.es)}`;
      list();
    };
    $$('.wsc', grid).forEach(b => b.onclick = () => pick(+b.dataset.r, +b.dataset.c));
    $('.ws-hint', s).onclick = () => { st.hint = 1; save(); list(); };
    $('.ws-show', s).onclick = () => { shown = true; words.forEach((w, i) => { if (!w.ex && !st.found[w.w]) record('a1-w' + i, 0, ['otro'], {}); }); $('.ws-msg', s).textContent = '회색 선이 못 찾은 단어예요.'; list(); };
    $('.ws-reset', s).onclick = () => { st.found = {}; st.hint = 0; shown = false; start = null; save(); $('.ws-msg', s).textContent = ''; list(); };
    list();
    words.forEach((w, i) => put(s, '.w', writeItem({ id: 'a1-a' + i, sec: 'a1', skill: 'cue', prompt: `<span class="emo-sm">${w.e}</span> ${w.kr}`, ph: 'el … / la …', answers: [w.es] })));
  };

  /* ---------- Actividad 2 — 몸 그림 ---------- */
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Escucha y escribe en el dibujo las partes del cuerpo que oigas.', { listen: true, kr: '▶ 를 눌러 듣고, 번호 칸에 신체 부위를 스페인어로 쓰세요. (관사는 써도 되고 안 써도 돼요)' })}
      <h3 class="h3"><button class="btn ghost sm" id="play2">▶ 1번부터 12번까지 듣기</button></h3>
      <div class="bodywrap"></div>
      <div class="item-row"><button class="btn chk b12">전체 채점</button><span class="b12s"></span></div>
      <h3 class="h3">🎯 ¿Dónde está…? — 단어를 보고 그림에서 그 부위를 누르세요</h3>
      <div class="tapgame"><div class="tap-q"></div><div class="tap-fig"></div></div>
      <h3 class="h3">✍️ 둘씩 있는 부위 — 복수형으로 쓰세요 (관사 포함)</h3>
      ${tip('모음으로 끝나면 +s (el ojo → los ojos), 자음으로 끝나면 +es (la nariz → las narices), el pie → los pies')}
      <div class="items two pl"></div>`);
    const wrap = $('.bodywrap', s);
    const B12 = D.body12;
    B12.forEach(b => reg('a2-' + b.n, 'a2', 'cue'));
    const lines = B12.map(b => { const x2 = b.s === 'r' ? 556 : 244; return `<polyline class="lead" points="${b.a[0]},${b.a[1]} ${x2},${b.y}"/><circle class="ldot" cx="${b.a[0]}" cy="${b.a[1]}" r="4"/>`; }).join('');
    wrap.innerHTML = bodySVG({ cls: 'big' }).replace('</svg>', lines + '</svg>') + B12.map(b =>
      `<div class="blab ${b.s}" style="top:${b.y / 640 * 100}%"><b>${b.n})</b><input class="bi" data-n="${b.n}" autocomplete="off" autocapitalize="off" spellcheck="false">${say(B12.find(x => x.n === b.n).ans[0])}<span class="bm"></span></div>`).join('');
    const paint = (inp, it, b) => { inp.classList.remove('ok', 'half', 'no'); inp.classList.add(it.last >= 1 ? 'ok' : it.last > 0 ? 'half' : 'no'); inp.parentElement.querySelector('.bm').innerHTML = MARK(it.last) + (it.last < 1 ? `<small>${tl(b.ans[0])}</small>` : ''); };
    $$('.bi', wrap).forEach(inp => { const b = B12.find(x => x.n === +inp.dataset.n), it = SC.items()['a2-' + b.n]; if (it && it.v != null) { inp.value = it.v; paint(inp, it, b); } inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('.b12', s).click(); }); });
    $('.b12', s).onclick = () => {
      let tot = 0;
      $$('.bi', wrap).forEach(inp => {
        const b = B12.find(x => x.n === +inp.dataset.n), r = grade(inp.value || ' ', b.ans), sc = r.empty ? 0 : r.score;
        record('a2-' + b.n, sc, r.empty ? ['otro'] : r.errs, { v: inp.value }); paint(inp, SC.items()['a2-' + b.n], b); tot += sc;
      });
      $('.b12s', s).innerHTML = `${MARK(tot / 12)} <b>${tot} / 12</b>`;
    };
    $('#play2', s).onclick = e => playLines(B12.map(b => ({ who: 'N', es: `${b.n}. ${b.ans[0]}.` })), e.currentTarget);

    /* 누르기 게임 */
    reg('a2-tap', 'a2', 'cue');
    const TAP = [['la cabeza', 'cabeza'], ['el ojo', 'ojo'], ['la nariz', 'nariz'], ['la boca', 'boca'], ['la oreja', 'oreja'], ['el cuello', 'cuello'], ['el hombro', 'hombro'], ['el brazo', 'brazo'],
      ['la mano', 'mano'], ['el pecho', 'pecho'], ['el estómago', 'estomago'], ['la pierna', 'pierna'], ['el pie', 'pie']];
    const tg = $('.tapgame', s);
    let order = [], k = 0, ok = 0, busy = false;
    const qDraw = () => {
      if (k >= order.length) {
        record('a2-tap', ok / order.length, ok === order.length ? [] : ['otro'], {});
        $('.tap-q', tg).innerHTML = `<div class="tap-end">${MARK(ok / order.length)} <b>${ok} / ${order.length}</b><br><button class="btn sm tap-go">🔁 다시 하기</button></div>`;
        $('.tap-go', tg).onclick = startTap; return;
      }
      const [w] = order[k];
      $('.tap-q', tg).innerHTML = `<span class="small">${k + 1} / ${order.length} · 맞힌 개수 ${ok}</span><div class="tap-w">${w} ${say(w)}</div><p class="small">그림에서 이 부위를 누르세요 👉</p>`;
    };
    function startTap() { order = shuffle(TAP).slice(0, 8); k = 0; ok = 0; $('.tap-fig', tg).innerHTML = bodySVG({ cls: 'tap' }); bindTap(); qDraw(); }
    function bindTap() {
      $('.tap-fig svg', tg).addEventListener('click', e => {
        const g = e.target.closest('[data-p]'); if (!g || busy || k >= order.length) return;
        const good = g.dataset.p === order[k][1]; if (good) ok++;
        busy = true;
        const right = $(`.tap-fig [data-p="${order[k][1]}"]`, tg);
        g.classList.add(good ? 'okp' : 'nop'); if (!good) right.classList.add('okp');
        setTimeout(() => { g.classList.remove('okp', 'nop'); right.classList.remove('okp'); busy = false; k++; qDraw(); }, good ? 600 : 1300);
      });
    }
    $('.tap-q', tg).innerHTML = `<p>13개 부위 중 8개가 무작위로 나와요.</p><button class="btn tap-go">▶ 시작</button>`;
    $('.tap-fig', tg).innerHTML = bodySVG({ cls: 'tap' });
    $('.tap-go', tg).onclick = startTap;

    [['👀', '두 눈', ['los ojos']], ['👂', '두 귀', ['las orejas', 'los oídos']], ['🦶', '두 발', ['los pies']], ['🙌', '두 손', ['las manos']]].forEach(([e, k2, a], i) =>
      put(s, '.pl', writeItem({ id: 'a2-pl' + i, sec: 'a2', skill: 'cue', prompt: `<span class="emo-sm">${e}</span> ${k2}`, ph: 'los … / las …', answers: a })));
  };

  /* ---------- Actividad 3 — doler ---------- */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, '¿Qué parte del cuerpo te duele si…', { kr: 'Me duele + 단수 / Me duelen + 복수 로 대답하세요. 맞히면 그림에 아픈 곳이 표시돼요.' })}
      <div class="a3-grid"><div class="items q3"></div><div class="a3-fig"></div></div>
      <h2 class="act-title">⭐ ¿Qué le duele? — Te duele(n)…</h2>
      <p class="kr-sub">¡Compruébalo! a) 활동: 친구가 아픈 곳을 가리키면 “Te duele(n) …” 라고 말해요. 그림의 <b style="color:#e0453a">빨간 곳</b>을 보고 써 보세요.</p>
      <div class="items three mini"></div>`);
    const Q = [['📚', 'estudias durante tres horas?', ['Me duele la cabeza.', 'Me duelen los ojos.', 'Tengo dolor de cabeza.']],
      ['🍫', 'te comes una enorme tarta de chocolate?', ['Me duele el estómago.', 'Me duele la barriga.', 'Tengo dolor de estómago.']],
      ['🎒', 'llevas una mochila con muchos libros y cuadernos?', ['Me duelen los hombros.', 'Me duele la espalda.', 'Me duele el hombro.']],
      ['🏃', 'vas al parque y corres durante dos horas?', ['Me duelen las piernas.', 'Me duelen los pies.']],
      ['💻', 'juegas con el ordenador toda la tarde?', ['Me duelen los ojos.', 'Me duele la cabeza.']]];
    const fig = $('.a3-fig', s);
    const drawFig = () => {
      const hot = []; Q.forEach((q, i) => { const it = SC.items()['a3-' + i]; if (it && it.last > 0) hot.push(...partsOf(it.v)); });
      fig.innerHTML = bodySVG({ hot, vb: MINI_VB, cls: 'side' }) + '<p class="small center">맞힌 문장의 아픈 곳 💢</p>';
    };
    Q.forEach(([e, q, a], i) => put(s, '.q3', writeItem({ id: 'a3-' + i, sec: 'a3', skill: 'dol', prompt: `<span class="emo-sm">${e}</span> ${i + 1}) ¿… si ${q} ${say('¿Qué parte del cuerpo te duele si ' + q)}`, ph: 'Me duele(n) …',
      answers: a.flatMap(x => [x, x.replace(/^Me/, 'A mí me')]), onCheck: drawFig })));
    drawFig();
    [['cabeza', 'Te duele la cabeza.'], ['ojo', 'Te duelen los ojos.'], ['estomago', 'Te duele el estómago.'], ['pie', 'Te duelen los pies.'], ['hombro', 'Te duelen los hombros.'], ['cuello', 'Te duele el cuello.']]
      .forEach(([p, a], i) => {
        const box = el(`<div class="minibox">${bodySVG({ hot: [p], vb: MINI_VB, cls: 'mini' })}</div>`);
        box.appendChild(writeItem({ id: 'a3-m' + i, sec: 'a3', skill: 'dol', ph: 'Te duele(n) …', answers: [a, 'A ti ' + a.charAt(0).toLowerCase() + a.slice(1), '¿' + a.slice(0, -1) + '?'] }));
        put(s, '.mini', box);
      });
  };

  /* ---------- Actividad 4 — síntomas y remedios ---------- */
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Practica con tus compañeros siguiendo el modelo, utilizando estas frases.')}
      <div class="grid2"><div class="ybox"><b>Síntomas :</b><p>• Estoy enfermo / resfriado / estresado.</p><p>• Tengo gripe / tos / fiebre.</p></div>
        <div class="ybox"><b>Remedios :</b><p>• Tienes que descansar / dormir ocho horas / hacer más ejercicio…</p><p>• Debes ir al médico / al dentista…</p><p>• ¿Por qué no te tomas una aspirina / una pastilla / un té caliente / un vaso de leche caliente con miel / sopa caliente?</p></div></div>
      ${modelo('A: ¿Qué te pasa? ¿Estás enfermo?<br>B: Sí, tengo fiebre.<br>A: ¿Por qué no te tomas una aspirina?<br>B: La voy a tomar. Gracias.')}
      <h3 class="h3">① 표현 분류 — 어느 문장 틀에 들어갈까요?</h3><div class="sb4"></div>
      <h3 class="h3">② 우리말을 보고 쓰세요</h3><div class="items two w4"></div>
      ${tip('<b>La</b> voy a tomar = <b>Voy a tomarla</b> (la = una aspirina). 목적대명사는 동사 앞, 또는 동사원형 뒤에 붙여요.')}
      <h3 class="h3">③ modelo 처럼 대화 쓰기</h3><div class="f4"></div>`);
    put(s, '.sb4', sortBoard({ id: 'a4s', sec: 'a4', skill: 'sin', cols: [{ k: 'e', label: 'Estoy …' }, { k: 't', label: 'Tengo …' }, { k: 'q', label: 'Tienes que … / Debes …' }, { k: 'p', label: '¿Por qué no te tomas …?' }],
      chips: [['enfermo', 'e'], ['resfriado', 'e'], ['estresado', 'e'], ['gripe', 't'], ['tos', 't'], ['fiebre', 't'], ['descansar', 'q'], ['dormir ocho horas', 'q'], ['ir al médico', 'q'],
        ['una aspirina', 'p'], ['un té caliente', 'p'], ['sopa caliente', 'p']] }));
    [['🌡️ B: 응, 열이 있어.', ['Sí, tengo fiebre.', 'Tengo fiebre.']], ['🤧 B: (남) 감기에 걸렸어.', ['Estoy resfriado.', 'Sí, estoy resfriado.']],
      ['😫 B: (여) 스트레스를 받았어.', ['Estoy estresada.', 'Sí, estoy estresada.']], ['💊 A: 아스피린 한 알 먹는 게 어때?', ['¿Por qué no te tomas una aspirina?', '¿Por qué no tomas una aspirina?']],
      ['😴 A: 너는 쉬어야 해. <span class="small">(tener que)</span>', ['Tienes que descansar.']], ['🦷 A: 너는 치과에 가야 해. <span class="small">(deber)</span>', ['Debes ir al dentista.']],
      ['🙏 B: 그거 먹을게. 고마워.', ['La voy a tomar. Gracias.', 'Voy a tomarla. Gracias.', 'La voy a tomar, gracias.']]].forEach(([p, a], i) =>
      put(s, '.w4', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'sin', prompt: p, answers: a })));
    put(s, '.f4', freeItem({ id: 'a4-f', sec: 'a4', rows: 5, ph: 'A: ¿Qué te pasa? ¿Estás enfermo?\nB: …',
      must: [{ re: 'qu[eé] te pasa', label: '¿Qué te pasa?' }, { re: '(estoy|est[aá]s) (enferm|resfriad|estresad|cansad)[oa]|tengo (gripe|tos|fiebre)', label: '증상 (Estoy … / Tengo …)' },
        { re: '(tienes que|debes|por qu[eé] no te tomas|por qu[eé] no tomas)', label: '처방 (Tienes que / Debes / ¿Por qué no te tomas…?)' }, { re: '(gracias|vale|de acuerdo|la voy a tomar|lo voy a)', label: '대답 (La voy a tomar. Gracias.)' }],
      model: 'A: ¿Qué te pasa? ¿Estás enferma? B: Sí, estoy resfriada y tengo tos. A: ¿Por qué no te tomas un té caliente con miel? B: Lo voy a tomar. Gracias.' }));
  };

  /* ---------- Actividad 5 — ¿Quién es? ---------- */
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Escucha y di el nombre de la persona correspondiente.', { listen: true, kr: '대본을 듣고 그림에 알맞은 이름을 붙이세요. 그다음 각 사람의 증상을 문장으로 써요.' })}
      <h3 class="h3"><button class="btn ghost sm" id="play5">▶ 듣기</button> <button class="btn ghost sm" id="hide5">대본 보기</button></h3>
      <div id="t5" class="script blur">${D.script5.map(x => `<p>${x} ${say(x)}</p>`).join('')}</div>
      <div class="m5"></div>
      <h3 class="h3">✍️ 그림 속 사람의 증상을 쓰세요</h3><div class="items two w5"></div>`);
    $('#play5', s).onclick = e => playLines(D.script5.map(es => ({ who: 'N', es })), e.currentTarget);
    blurBtn(s, '#hide5', '#t5', '대본 보기', '대본 가리기');
    put(s, '.m5', matchPics({ id: 'a5m', sec: 'a5', skill: 'dol', cols: 3, title: '이름을 누른 뒤 그림을 누르세요.', items: D.act5 }));
    [['Pablo 😖🦷', '긴장했다 — 어금니를 뺄 거라서. <span class="small">(nervioso / sacar una muela)</span>', ['Pablo está nervioso porque le van a sacar una muela.', 'Pablo está nervioso.']],
      ['Clara 🛋️🤒', '열이 많이 난다.', ['Clara tiene mucha fiebre.', 'Clara tiene fiebre.']],
      ['Enrique 🤢', '배가 아프다. <span class="small">(dolor de)</span>', ['Enrique tiene dolor de estómago.', 'A Enrique le duele el estómago.']],
      ['Jaime 🤕✋', '손이 아프다. <span class="small">(doler)</span>', ['A Jaime le duele la mano.', 'Jaime tiene dolor de mano.']],
      ['Sonia 🤧', '감기에 걸려서 기침을 많이 한다.', ['Sonia tiene mucha tos porque está resfriada.', 'Sonia está resfriada y tiene mucha tos.', 'Sonia tiene mucha tos.']],
      ['Juan 🦵🩼', '다리가 아프다. <span class="small">(doler)</span>', ['A Juan le duele la pierna.', 'Juan tiene dolor de pierna.']]].forEach(([n, p, a], i) =>
      put(s, '.w5', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: i === 1 || i === 4 ? 'sin' : 'dol', prompt: `<b>${n}</b> ${p}`, answers: a })));
  };

  /* ---------- Actividad 6 — ¿Has … alguna vez? ---------- */
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, '¿Has hecho alguna vez estas cosas? Practica con tus compañeros siguiendo el modelo.')}
      ${modelo('A: ¿Has visto alguna película española?<br>B: Sí, he visto la película “Mar Adentro”.')}
      ${tip('경험 질문: <b>¿Has + 과거분사 + alguna vez …?</b> / 대답: <b>Sí, he …</b> · <b>No, nunca he …</b>')}
      <div class="a6"></div>`);
    const st = sel('a6');
    D.act6.forEach((a, i) => {
      const box = el(`<div class="exp6"><div class="ph"><span class="emo-sm">${a.e}</span> <b>${i + 1}) ${a.inf}</b></div><div class="q"></div>
        <div class="tg"><button data-v="1">✔ 해 봤어요</button><button data-v="0">✘ 안 해 봤어요</button></div><div class="r"></div></div>`);
      const paint = () => $$('.tg button', box).forEach(b => b.classList.toggle('on', st[i] === b.dataset.v));
      $$('.tg button', box).forEach(b => b.onclick = () => { st[i] = b.dataset.v; save(); paint(); });
      paint();
      $('.q', box).appendChild(writeItem({ id: 'a6-q' + i, sec: 'a6', skill: 'per', prompt: 'A: 질문을 쓰세요.', ph: '¿Has … alguna vez …?', answers: [...qVar(a.pp, a.r), ...(a.alt || [])] }));
      $('.r', box).appendChild(freeItem({ id: 'a6-r' + i, sec: 'a6', skill: 'per', line: true, prompt: 'B: 나의 대답 (위에서 ✔/✘ 고르기)', ph: st[i] === '0' ? `No, nunca he ${a.pp} …` : `Sí, he ${a.pp} …`, needMsg: '먼저 ✔ / ✘ 를 고르세요.',
        must: () => st[i] == null ? null : st[i] === '1' ? [{ re: W0 + 's[ií]' + W1, label: 'Sí' }, { re: W0 + 'he\\s+' + a.pp + W1, label: `he ${a.pp}` }]
          : [{ re: W0 + 'no' + W1, label: 'No' }, { re: W0 + '(nunca|jam[aá]s|no|todav[ií]a no)\\s+he\\s+' + a.pp + W1, label: `nunca he ${a.pp} / no he ${a.pp}` }] }));
      put(s, '.a6', box);
    });
  };

  /* ---------- Diálogo 2 ---------- */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Miguel está de viaje por el sur de España y llama a su madre por teléfono para contarle cómo lo está pasando.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2d">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2d">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">✍️ 현재완료 받아쓰기 — 괄호 속 동사를 haber + 과거분사로</h3><div class="d2c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¡Diga!</span><span class="hlc c1">temprano</span><span class="hlc c2">tomado</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 나의 여행 전화 쓰기</h3><div class="f"></div>`);
    $('#play2d', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blurBtn(s, '#hide2d', '#d2txt', '본문 보기', '본문 가리기');
    [['Miguel está de viaje por el norte de España.', 'Falso', 'el sur de España — 남부 (그라나다 · 살로브레냐)'], ['El guía ha llegado a las nueve.', 'Verdadero'],
      ['Miguel y sus compañeros no se han bañado.', 'Falso', '¿Y os habéis bañado? — Sí.'], ['Han comido un bocadillo en la playa.', 'Verdadero']]
      .forEach(([p, a, x], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'per', prompt: p, options: ['Verdadero', 'Falso'], answer: a, explain: x })));
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'per', cls: 'lines', text: clozeFromDialog(D.dialogo2cz) }));
    [['¿Sí? <u>¿Dígame?</u> → <span class="chip">¡Diga!</span>', ['¿Sí? ¡Diga!', '¡Diga!']],
      ['Esta mañana nos hemos levantado muy <u>pronto</u>. → <span class="chip">temprano</span>', ['Esta mañana nos hemos levantado muy temprano.']],
      ['¿Has <u>sacado</u> muchas fotos? → <span class="chip">tomado</span>', ['¿Has tomado muchas fotos?']]]
      .forEach(([p, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'per', prompt: p, answers: a })));
    put(s, '.f', freeItem({ id: 'd2-f', sec: 'd2', rows: 6, prompt: '여행 중에 집에 전화를 걸었어요. 오늘 한 일을 현재완료로 이야기하는 통화를 쓰세요.',
      ph: 'Madre: ¿Sí? ¿Dígame?\nYo: Hola, mamá, soy …\nMadre: ¿Qué tal tu visita?\nYo: Esta mañana he …',
      must: [{ re: '(d[ií]game|diga)', label: '¿Dígame? / ¡Diga!' }, { re: '(hoy|esta ma[nñ]ana|esta tarde)', label: 'Hoy / Esta mañana' }, { re: PP, label: '현재완료 3번 이상', min: 3 }, { re: '(hasta ma[nñ]ana|adi[oó]s|un beso|hasta luego)', label: '작별 인사' }],
      model: 'Madre: ¿Sí? ¿Dígame? Yo: Hola, mamá, soy Jimin. Esta mañana me he levantado temprano. He visitado el Museo del Prado y he comido paella. Madre: ¿Te ha gustado Madrid? Yo: Sí, mucho. Hasta mañana.' }));
  };

  /* ---------- Actividad 7 — experiencias ---------- */
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, '¿Qué experiencias tienes en tu vida? Habla con tus compañeros. ¿En qué cosas habéis coincidido y en cuáles no?')}
      ${modelo('A: No he estado jamás en España.<br>B: Ya he estado allí.')}
      <div class="freq">${[['jamás / nunca', '한 번도 ~ 않다', 3], ['alguna vez', '한 번쯤, ~해 본 적', 30], ['varias veces', '여러 번', 60], ['muchas veces', '많이', 90]]
        .map(([e, k, p]) => `<div class="fr"><span class="fl">${e} ${say(e.split(' / ')[0])}</span><span class="fbar"><i style="width:${p}%"></i></span><span class="fk">${k}</span></div>`).join('')}</div>
      <h3 class="h3">✍️ 우리말을 보고 A · B 문장을 쓰세요</h3><div class="items two w7"></div>
      <h3 class="h3">🤝 짝과 비교하기</h3><div class="f7"></div>`);
    const A7 = [
      ['1) A', '나는 멕시코에 한 번도 가 본 적이 없어. <span class="small">(No he estado jamás …)</span>', ['No he estado jamás en México.', 'No he estado nunca en México.', 'Nunca he estado en México.', 'Jamás he estado en México.']],
      ['1) B', '나는 벌써 거기에 가 봤어. <span class="small">(Ya he estado …)</span>', ['Ya he estado allí.', 'Ya he estado en México.', 'Yo ya he estado allí.', 'Yo ya he estado en México.']],
      ['2) A', '나는 아직 숙제를 안 했어. <span class="small">(Todavía no he hecho … / los deberes)</span>', ['Todavía no he hecho los deberes.', 'Aún no he hecho los deberes.', 'Todavía no he hecho las tareas.', 'Aún no he hecho las tareas.', 'No he hecho los deberes todavía.']],
      ['2) B', '나는 벌써 숙제를 했어. <span class="small">(Yo ya he hecho …)</span>', ['Yo ya he hecho los deberes.', 'Ya he hecho los deberes.', 'Yo ya he hecho las tareas.', 'Ya he hecho las tareas.']],
      ['3) A', '나는 초밥을 한 번도 먹어 본 적이 없어. <span class="small">(Nunca he … / sushi)</span>', ['Nunca he comido sushi.', 'No he comido nunca sushi.', 'No he comido sushi nunca.']],
      ['3) B', '나는 초밥을 많이(muchas veces) 먹어 봤어.', ['Muchas veces he comido sushi.', 'He comido sushi muchas veces.', 'Yo he comido sushi muchas veces.']],
      ['4) A', '나는 말을 한 번도 타 본 적이 없어. <span class="small">(Nunca he … / montar a caballo)</span>', ['Nunca he montado a caballo.', 'No he montado nunca a caballo.', 'No he montado a caballo nunca.']],
      ['4) B', '나는 말을 타 본 적이 있어. <span class="small">(Alguna vez he …)</span>', ['Alguna vez he montado a caballo.', 'He montado a caballo alguna vez.', 'Yo he montado a caballo alguna vez.']],
      ['5) A', '나는 스페인 영화를 한 번도 본 적이 없어. <span class="small">(Jamás he …)</span>', ['Jamás he visto una película española.', 'Jamás he visto películas españolas.', 'No he visto jamás una película española.']],
      ['5) B', '나는 스페인 영화를 여러 번 봤어. <span class="small">(Varias veces he …)</span>', ['Varias veces he visto una película española.', 'Varias veces he visto películas españolas.', 'He visto películas españolas varias veces.', 'He visto una película española varias veces.']]];
    A7.forEach(([n, p, a], i) => put(s, '.w7', writeItem({ id: 'a7-' + i, sec: 'a7', skill: i % 2 ? 'per' : 'adv', prompt: `<b>${n}</b> ${p}`, answers: a })));
    put(s, '.f7', freeItem({ id: 'a7-f', sec: 'a7', rows: 4, prompt: '짝과 <b>공통점</b> 1개, <b>차이점</b> 1개를 쓰세요. <span class="small">Los dos hemos … / Yo he …, pero mi compañero no ha …</span>',
      ph: 'Los dos hemos estado en Japón. Yo he montado a caballo, pero mi compañero nunca ha …',
      must: [{ re: W0 + '(los dos|las dos|ambos|ambas)\\s+(nunca |no |ya |todav[ií]a no )?hemos' + W1, label: 'Los dos hemos … (공통점)' },
        { re: W0 + '(mi compa[nñ]er[oa]|[eé]l|ella)\\s+(no |nunca |jam[aá]s |todav[ií]a no |ya )?ha' + W1, label: 'mi compañero (no) ha … (차이점)' }, { re: PP, label: '현재완료', min: 2 }],
      model: 'Los dos hemos estado en Japón. Yo he montado a caballo muchas veces, pero mi compañero nunca ha montado a caballo.' }));
  };

  /* ---------- Actividad 8 — Describe los dibujos ---------- */
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Describe los siguientes dibujos.', { kr: '그림이 보여 주는 “방금 한 일”을 현재완료(ha + 과거분사)로 써요.' })}
      <div class="sc8">${[['1)', '🕗🧑‍💼🧒🎒🏫', '아빠 · 아들 · 학교'], ['2)', '👨🍲🔥', '남자 · 냄비 · 부엌'], ['3)', '👨‍🏫🧑‍🎓📖✏️', '선생님 · 학생 · 공책']].map(([n, e, k]) => `<div class="ccard"><b>${n}</b><span class="emo">${e}</span><small>${k}</small></div>`).join('')}</div>
      ${modelo('El padre ha llevado a su hijo al colegio.')}
      <div class="items i8"></div>
      <h3 class="h3">✍️ 현재 → 현재완료로 바꿔 쓰세요</h3>${tip('주어 + haber + 과거분사. 시간 표현(Hoy, Esta mañana…)은 문장 앞이나 뒤에.')}<div class="items two w8"></div>`);
    put(s, '.i8', writeItem({ id: 'a8-1', sec: 'a8', skill: 'per', prompt: '1) modelo 문장을 그대로 써 보세요.', answers: ['El padre ha llevado a su hijo al colegio.'] }));
    put(s, '.i8', freeItem({ id: 'a8-2', sec: 'a8', skill: 'per', line: true, prompt: '2) 👨🍲 그림 2를 묘사하세요.', ph: 'El padre ha …',
      must: [{ re: W0 + 'ha\\s+\\p{L}*(ado|ido|cho)' + W1, label: 'ha + 과거분사' }, { re: '(cocinad|preparad|hech|calentad)o', label: 'cocinado / preparado / hecho' }, { re: '(sopa|comida|cena|almuerzo|desayuno|caldo)', label: '음식 (sopa, comida, cena …)' }],
      model: 'El padre ha preparado una sopa para la cena.' }));
    put(s, '.i8', freeItem({ id: 'a8-3', sec: 'a8', skill: 'per', line: true, prompt: '3) 👨‍🏫🧑‍🎓 그림 3을 묘사하세요.', ph: 'El profesor ha …',
      must: [{ re: W0 + 'ha\\s+\\p{L}*(ado|ido|cho|sto|to)' + W1, label: 'ha + 과거분사' }, { re: '(ayudad|explicad|corregid|ense[nñ]ad|revisad|vist)o', label: 'ayudado / explicado / corregido …' }, { re: '(alumno|estudiante|chico|hijo|deberes|ejercicios|examen|lecci[oó]n)', label: '학생 · 숙제' }],
      model: 'El profesor ha ayudado al alumno con los ejercicios.' }));
    [['Llevo a mi hijo al colegio. <span class="chip">Hoy</span>', ['Hoy he llevado a mi hijo al colegio.', 'He llevado a mi hijo al colegio hoy.', 'Hoy yo he llevado a mi hijo al colegio.']],
      ['Mi madre hace la comida. <span class="chip">Esta mañana</span>', ['Esta mañana mi madre ha hecho la comida.', 'Mi madre ha hecho la comida esta mañana.']],
      ['Vemos una película. <span class="chip">Esta tarde</span>', ['Esta tarde hemos visto una película.', 'Hemos visto una película esta tarde.', 'Esta tarde nosotros hemos visto una película.']],
      ['Escribes un correo. <span class="chip">Hoy</span>', ['Hoy has escrito un correo.', 'Has escrito un correo hoy.', 'Hoy tú has escrito un correo.']]].forEach(([p, a], i) =>
      put(s, '.w8', writeItem({ id: 'a8-w' + i, sec: 'a8', skill: 'par', prompt: p, answers: a })));
  };

  /* ---------- Actividad 9 — vacaciones ---------- */
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'a) Cuéntale a tu compañero qué cosas interesantes has hecho.')}
      ${modelo('Hoy he conocido a un chico guapo y este fin de semana he visitado el Museo de Arte Latinoamericano de Buenos Aires (MALBA).')}
      <div class="f9a"></div>
      <h2 class="act-title">b) Luego, completa las preguntas y habla con tus compañeros sobre lo que habéis hecho en las últimas vacaciones.</h2>
      <h3 class="h3">✍️ 질문 완성하기</h3><div class="items two q9"></div>
      <h3 class="h3">✍️ 나의 대답</h3><div class="items r9"></div>`);
    put(s, '.f9a', freeItem({ id: 'a9-a', sec: 'a9', rows: 3, prompt: '최근에 한 재미있는 일 2가지 이상을 modelo 처럼 쓰세요.', ph: 'Hoy he … y este fin de semana he …',
      must: [{ re: PP, label: 'he + 과거분사 2번 이상', min: 2 }, { re: '(hoy|este fin de semana|esta semana|esta ma[nñ]ana|esta tarde|este a[nñ]o|este mes)', label: '시간 표현 (hoy, este fin de semana …)' }],
      model: 'Hoy he comido en un restaurante mexicano y este fin de semana he visto un partido de fútbol con mi padre.' }));
    [['¿Dónde …?', '방학에 어디에 있었니? <span class="small">(estar · en las vacaciones de verano)</span>', ['¿Dónde has estado en las vacaciones de verano?', '¿Dónde has estado en las vacaciones?', '¿Dónde has estado en las últimas vacaciones?']],
      ['¿Cómo …?', '거기에 어떻게 갔니? <span class="small">(ir · allí)</span>', ['¿Cómo has ido allí?', '¿Cómo has ido?']],
      ['¿Con quién …?', '누구와 갔니? <span class="small">(ir)</span>', ['¿Con quién has ido?', '¿Con quién has ido allí?']],
      ['¿Cuándo …?', '언제 갔니? <span class="small">(ir)</span>', ['¿Cuándo has ido?', '¿Cuándo has ido allí?']],
      ['¿Qué …?', '무엇을 했니? <span class="small">(hacer)</span>', ['¿Qué has hecho?', '¿Qué has hecho allí?']]].forEach(([q, p, a], i) =>
      put(s, '.q9', writeItem({ id: 'a9-q' + i, sec: 'a9', skill: 'per', prompt: `${i + 1}) <b>${q}</b> ${p}`, ph: q.replace('…', '… ?'), answers: a })));
    [['¿Dónde has estado en las vacaciones de verano?', [{ re: W0 + 'he estado' + W1, label: 'He estado en …' }], 'He estado en Jeju con mi familia.'],
      ['¿Cómo has ido allí?', [{ re: W0 + 'he ido' + W1, label: 'He ido …' }, { re: W0 + '(en|a)\\s+(avi[oó]n|tren|coche|autob[uú]s|barco|metro|bici|bicicleta|pie|taxi)' + W1, label: '교통수단 (en avión / en tren …)' }], 'He ido en avión.'],
      ['¿Con quién has ido?', [{ re: W0 + 'he ido' + W1, label: 'He ido …' }, { re: W0 + '(con|sol[oa])' + W1, label: 'con … (함께 간 사람)' }], 'He ido con mis padres y mi hermano.'],
      ['¿Cuándo has ido?', [{ re: '(en|el|la|a principios|a finales|este|esta)\\s+\\p{L}+', label: '시기 (en julio / la semana pasada …)' }, { re: W0 + 'he ido' + W1, label: 'He ido …' }], 'He ido en agosto.'],
      ['¿Qué has hecho?', [{ re: PP, label: '현재완료 2번 이상', min: 2 }], 'He nadado en la playa y he comido mucho pescado.']].forEach(([q, m, md], i) =>
      put(s, '.r9', freeItem({ id: 'a9-r' + i, sec: 'a9', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m, model: md })));
  };

  /* ---------- Actividad 10 — Antonio ---------- */
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Estas son las tareas que le han encargado a Antonio para su primera semana. Explica sobre lo que ha hecho ya y qué no ha hecho todavía.')}
      <div class="nb10"><div class="nb-page">${D.act10.map(t => `<p>${t[2] ? '<b class="ck">✔</b>' : '<b class="ck"></b>'} - ${t[0]}</p>`).join('')}</div>
        <div class="stickies"><div class="sticky y1">&lt;Ya&gt;</div><div class="sticky y2">&lt;Todavía no&gt;</div></div></div>
      <h3 class="h3">① 할 일을 포스트잇에 분류하세요</h3><div class="sb10"></div>
      <h3 class="h3">② 안토니오에 대해 문장을 쓰세요</h3>
      ${tip('<b>Antonio ya ha</b> preparado … / <b>Antonio todavía no ha</b> hecho … (hacer → hecho 불규칙!)')}
      <div class="items two w10"></div>
      <h3 class="h3">③ 나의 이번 주 — Ya … / Todavía no …</h3><div class="f10"></div>`);
    put(s, '.sb10', sortBoard({ id: 'a10s', sec: 'a10', skill: 'adv', cols: [{ k: 'y', label: '✅ Ya' }, { k: 'n', label: '⏳ Todavía no' }], chips: D.act10.map(t => [t[0], t[2] ? 'y' : 'n']) }));
    D.act10.forEach(([inf, p, done], i) => {
      const a = done ? [`Antonio ya ha ${p}.`, `Ya ha ${p}.`, `Antonio ha ${p} ya.`]
        : [`Antonio todavía no ha ${p}.`, `Todavía no ha ${p}.`, `Antonio no ha ${p} todavía.`, `Antonio aún no ha ${p}.`, `Aún no ha ${p}.`, `Antonio no ha ${p} aún.`];
      put(s, '.w10', writeItem({ id: 'a10-' + i, sec: 'a10', skill: i === 3 ? 'par' : 'per', prompt: `${done ? '✅' : '⏳'} ${inf}`, ph: done ? 'Antonio ya ha …' : 'Antonio todavía no ha …', answers: a }));
    });
    put(s, '.f10', freeItem({ id: 'a10-f', sec: 'a10', rows: 3, prompt: '이번 주에 이미 한 일 2개, 아직 안 한 일 2개를 쓰세요.', ph: 'Esta semana ya he …, pero todavía no he …',
      must: [{ re: W0 + 'ya\\s+he' + W1, label: 'ya he … 2번', min: 2 }, { re: W0 + '(todav[ií]a|a[uú]n) no he' + W1, label: 'todavía no he … 2번', min: 2 }],
      model: 'Esta semana ya he hecho los deberes de matemáticas y ya he limpiado mi habitación, pero todavía no he leído el libro y todavía no he escrito el informe.' }));
  };

  /* ---------- Actividad 11 — experiencias ---------- */
  B.a11 = () => {
    const s = sec('a11', `${actHead(11, 'Pregunta a tu compañero si ha tenido alguna de estas experiencias.')}
      ${modelo('A: ¿Has perdido el móvil alguna vez?<br>B: Sí, varias veces, pero siempre en mi casa. ¿Y tú?<br>A: No, yo nunca lo he perdido.')}
      ${notice('📷 교재에는 그림만 있어요. 그림에 맞는 표현을 붙여 두었어요.')}
      <h3 class="h3">✍️ 그림을 보고 질문을 쓰세요 — ¿Has … alguna vez?</h3><div class="items two q11"></div>
      <h3 class="h3">🔁 목적대명사 위치 — haber 앞!</h3>${tip('“nunca <b>lo</b> he perdido” — lo/la/los/las 는 haber 바로 앞에 와요.')}<div class="items two c11"></div>
      <h3 class="h3">✍️ 나의 대답</h3><div class="items r11"></div>`);
    D.act11.forEach((a, i) => put(s, '.q11', writeItem({ id: 'a11-' + i, sec: 'a11', skill: 'per', prompt: `${i + 1}) <span class="emo-sm">${a.e}</span> <span class="chip">${a.x}</span>`, ph: '¿Has … alguna vez?', answers: qVar(a.pp, a.r) })));
    put(s, '.c11', choiceItem({ id: 'a11-c0', sec: 'a11', skill: 'per', prompt: '¿Has perdido el móvil? — No, nunca ______.', options: ['lo he perdido', 'he lo perdido', 'he perdido lo'], answer: 'lo he perdido' }));
    put(s, '.c11', choiceItem({ id: 'a11-c1', sec: 'a11', skill: 'per', prompt: '¿Ya has hecho las tareas? — Sí, ya ______.', options: ['he hecho las', 'las he hecho', 'he las hecho'], answer: 'las he hecho' }));
    [[0, '¿Has perdido el móvil alguna vez?', 'perdido', 'Sí, varias veces, pero siempre en mi casa.'], [1, '¿Has viajado en avión alguna vez?', 'viajado', 'Sí, he viajado en avión muchas veces.'],
      [3, '¿Has montado a caballo alguna vez?', 'montado', 'No, nunca he montado a caballo.']].forEach(([k, q, pp, md], i) =>
      put(s, '.r11', freeItem({ id: 'a11-r' + i, sec: 'a11', line: true, prompt: `${q} ${say(q)}`,
        must: [{ re: W0 + '(s[ií]|no)' + W1, label: 'Sí / No' }, { re: W0 + '(nunca |no |jam[aá]s )?(lo |la )?he\\s+' + pp + W1 + '|' + W0 + '(varias|muchas) veces|una vez|alguna vez|nunca', label: `he ${pp} / nunca … / varias veces` }], model: md })));
  };

  /* ---------- Actividad 12 ---------- */
  B.a12 = () => {
    const s = sec('a12', `${actHead(12, 'Habla con tus compañeros.', { kr: '말하기 질문에 글로 대답해요. 질문의 동사를 1인칭으로 바꾸세요: estás → estoy, has tenido → he tenido, has hecho → he hecho' })}<div class="items"></div>`);
    const NUM = '(\\d+|un|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|quince|veinte|treinta|muchos|pocos)';
    [['¿En qué curso estás este año?', [{ re: W0 + 'estoy en' + W1, label: 'Estoy en …' }, { re: '(primero|segundo|tercero|cuarto|quinto|sexto|s[eé]ptimo|octavo|noveno|d[eé]cimo|und[eé]cimo|duod[eé]cimo|\\d+)', label: '학년 (primero, segundo … / 9.º)' }], 'Este año estoy en noveno curso.'],
      ['¿Hay algún compañero nuevo en tu clase?', [{ re: W0 + '(s[ií]|no)' + W1, label: 'Sí / No' }, { re: W0 + 'hay' + W1, label: 'hay …' }], 'Sí, hay dos compañeros nuevos. Se llaman Minho y Sara.'],
      ['¿Y algún profesor nuevo?', [{ re: W0 + '(s[ií]|no)' + W1, label: 'Sí / No' }, { re: W0 + '(hay|ning[uú]n|alg[uú]n|profesora?)' + W1, label: 'hay … / ningún …' }], 'Sí, hay una profesora nueva de matemáticas.'],
      ['¿Cuántos días de vacaciones has tenido?', [{ re: W0 + 'he tenido' + W1, label: 'He tenido …' }, { re: W0 + NUM + W1, label: '숫자' }], 'He tenido quince días de vacaciones.'],
      ['¿Qué has hecho este invierno?', [{ re: PP, label: '현재완료 2번 이상', min: 2 }, { re: 'este invierno', label: 'este invierno' }], 'Este invierno he esquiado en Pyeongchang y he leído muchos libros.']]
      .forEach(([q, m, md], i) => put(s, '.items', freeItem({ id: 'a12-' + i, sec: 'a12', skill: i >= 3 ? 'per' : 'lib', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m, model: md })));
  };

  SC.lesson({
    num: '10',
    title: '¿Qué te pasa?',
    ttsTest: '¡Hola! ¿Qué te pasa? Me duele la cabeza.',
    cover: {
      emoji: '🤒🩺💊<small>🧍 ¿Qué te pasa?</small>',
      bg: 'linear-gradient(135deg,#7fd3d8 0%,#d8f1f2 55%,#fdf8ec 100%)',
      tema: ['Estados físicos y anímicos · Partes del cuerpo', 'Enfermedades y remedios · Hechos recientes', 'Experiencias personales'],
      com: ['Preguntar a alguien cómo se siente', 'Decir cómo se siente uno mismo', 'Expresar dolor', 'Ofrecer cosas y aceptarlas o rechazarlas', 'Hacer sugerencias y aceptarlas o rechazarlas'],
      gram: ['Pretérito perfecto · Participio pasado', 'Adverbios: <i>ya, aún, todavía</i> · Verbo <i>doler</i>', 'Frase exclamativa: <i>¡Qué…!</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      Manolo: { av: '🧑🏻', side: 'l' }, Estela: { av: '👧🏻', side: 'r' },
      Madre: { av: '👩🏻', side: 'l' }, Miguel: { av: '🧑🏽', side: 'r' }, N: { name: 'Audio', av: '🎧', side: 'l' }
    },
    errLabels: { concordancia: '성·수 일치 (duele·duelen / 관사)', conjugacion: 'haber 변화 (he · has · ha …)', participio: '과거분사 (hecho · visto …)', adverbio: 'ya / todavía / nunca' },
    errTips: {
      acento: 'estómago, lástima, todavía, jamás, ¿qué? … 악센트도 철자예요. 시험에서는 감점됩니다.',
      concordancia: '아픈 부위가 주어! 단수 → duele (la cabeza) / 복수 → duelen (los pies). estar + 형용사는 성·수 일치.',
      conjugacion: 'haber: he, has, ha, hemos, habéis, han + 과거분사',
      participio: '-ar → -ado, -er/-ir → -ido. 불규칙: hecho, visto, escrito, puesto, vuelto, dicho, abierto, roto',
      adverbio: 'ya (이미) / todavía no · aún no (아직) / nunca · jamás (한 번도) / alguna vez (~해 본 적)',
      estructura: '"Me duelo"(✕) → "Me duele". 신체 부위에는 소유사 대신 정관사: Me duele la cabeza.'
    },
    classify(ti, ta) {
      const sw = (x, y) => ti.includes(x) && ta.includes(y);
      if (sw('duele', 'duelen') || sw('duelen', 'duele')) return 'concordancia';
      const H = ['he', 'has', 'ha', 'hemos', 'habéis', 'habeis', 'han'];
      const hi = ti.filter(w => H.includes(w)).join(), ha = ta.filter(w => H.includes(w)).join();
      if (!hi) return null;
      if (ha && hi !== ha) return 'conjugacion';
      const PA = /(ado|ido|ído|cho|sto|rto|lto|ito)$/;
      const pi = ti.find((w, i) => i && H.includes(ti[i - 1])), pa = ta.find((w, i) => i && H.includes(ta[i - 1]));
      if (pa && pi && pi !== pa && SC.strip(pi) !== SC.strip(pa) && PA.test(pa)) return 'participio';
      const A = ['ya', 'todavía', 'todavia', 'aún', 'aun', 'nunca', 'jamás', 'jamas', 'alguna'];
      if (ti.filter(w => A.includes(w)).map(SC.strip).join() !== ta.filter(w => A.includes(w)).map(SC.strip).join()) return 'adverbio';
      if (ti.includes('mi') && !ta.includes('mi')) return 'estructura';
      return null;
    },
    errRules: [
      { re: W0 + '(me|te|se) duelo' + W1, t: 'estructura', msg: '"Me duelo"(✕) → "Me duele / Me duelen"' },
      { re: W0 + 'yo duelo' + W1, t: 'estructura', msg: '"Yo duelo"(✕) → "Me duele"' },
      { re: W0 + '(me|te|le|nos|os|les) duele (los|las|mis|tus|sus)' + W1, t: 'concordancia', msg: '복수 부위 앞 → duelen' },
      { re: W0 + '(me|te|le|nos|os|les) duelen (el|la|mi|tu|su)' + W1, t: 'concordancia', msg: '단수 부위 앞 → duele' },
      { re: W0 + 'duelen? (mi|mis|tu|tus)' + W1, t: 'estructura', msg: '신체 부위에는 소유사 대신 정관사 (la cabeza)' },
      { re: W0 + '(hacido|hacio|vido|veido|escribido|ponido|volvido|decido|abrido|rompido|morido|descubrido)' + W1, t: 'participio', msg: '불규칙 과거분사: hecho · visto · escrito · puesto · vuelto · dicho · abierto · roto · muerto · descubierto' },
      { re: W0 + 'yo (ha|has)' + W1, t: 'conjugacion', msg: 'yo → he' },
      { re: W0 + 't[uú] (he|ha)' + W1, t: 'conjugacion', msg: 'tú → has' },
      { re: W0 + 'nosotros (han|ha|habemos)' + W1, t: 'conjugacion', msg: 'nosotros → hemos' },
      { re: W0 + 'he (llevar|visitar|comer|ir|hacer|ver|estar|tener|preparar|viajar|perder|montar)' + W1, t: 'participio', msg: 'haber 뒤에는 과거분사 (-ado / -ido)' },
      { re: W0 + 'estoy (fiebre|tos|gripe|dolor)' + W1, t: 'estructura', msg: 'fiebre · tos · gripe 는 명사 → tengo' },
      { re: W0 + 'tengo (cansad[oa]|enferm[oa]|nervios[oa]|estresad[oa]|resfriad[oa])' + W1, t: 'estructura', msg: '상태 형용사 → estoy cansado/a' },
      { re: W0 + 'nunca no' + W1, t: 'adverbio', msg: 'nunca 가 동사 앞이면 no 없이: Nunca he …' },
      { re: W0 + 'he (lo|la|los|las) ', t: 'estructura', msg: '목적대명사는 haber 앞: lo he perdido' },
      { re: '(?<=' + W0 + 'a )mi(?=\\s*(me|tambi[eé]n|tampoco|no|s[ií])' + W1 + ')', t: 'acento', msg: '전치사 뒤 "a mí"' }
    ],
    accWords: ['todavía', 'estómago', 'muchísimo', 'reunión', 'presentación', 'española', 'españolas', 'algún', 'ningún', 'oído', 'oídos', 'dígame', 'cuéntale'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['Me duelen los brazos y las piernas.', '¿Por qué no vas al médico?', 'Es que no me gusta tomar medicinas.', '¿A qué hora te has levantado hoy?', '¿Ya has hecho las tareas?', 'No, todavía no las he hecho.'],
    utilSkill: 'per',
    proverbio: { es: 'A mal tiempo, buena cara.', e: '☂️', answer: '웃으면 복이 온다', options: ['티끌 모아 태산', '웃으면 복이 온다', '소 잃고 외양간 고친다', '원숭이도 나무에서 떨어진다'], kr: '궂은 날씨(힘든 상황)에도 밝은 얼굴로 — 어려울 때일수록 웃으며 이겨 내자는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'En parejas: no te encuentras bien → 대화문으로 쓰기',
        icons: ['🤒', '💊', '🩺'],
        html: '<p class="small">상황: 너는 몸이 안 좋아요. 친구가 무슨 일인지 묻고, 무언가를 권하거나 제안해요. 받아들이거나 거절하세요. <b>modelo</b>: ¿Qué te pasa? ¿No te encuentras bien?</p>',
        questions: ['¿Qué te pasa? ¿Cómo te encuentras? ¿Qué te duele? — 증상을 설명하세요 (Estoy…, Tengo…, Me duele(n)…)',
          '¿Qué has hecho hoy? ¿Por qué te encuentras mal? — 오늘 한 일을 현재완료로 (Hoy he…, Esta mañana he…)',
          'Tu compañero te ofrece o sugiere cosas: ¿las aceptas o las rechazas? (¿Por qué no…? / ¿Quieres…? / Sí, gracias. / Es que…)'],
        minWords: 55,
        hint: 'doler · estar/tener · 현재완료 · ya/todavía · ¡Qué…! 를 활용하면 높은 점수!',
        ph: 'A: ¿Qué te pasa? ¿No te encuentras bien?\nB: No, me duele mucho …',
        connectors: ['pero', 'porque', 'es que', 'y', 'también', 'además', 'entonces', 'hoy'],
        rubric: [
          { k: 'pre', label: '안부 묻기 (¿Qué te pasa? …)', max: 6, re: 'qu[eé] te pasa|te pasa algo|no te encuentras bien|c[oó]mo te encuentras|est[aá]s enferm[oa]', ax: 'Contenido' },
          { k: 'sin', label: '증상 (Estoy … / Tengo …)', max: 8, re: '(estoy|est[aá]s|est[aá]) (enferm|resfriad|estresad|cansad|nervios)[oa]s?|(tengo|tienes|tiene) (gripe|tos|fiebre|dolor|mala cara)', ax: 'Contenido' },
          { k: 'sug', label: '제안·권유 (¿Por qué no…? / ¿Quieres…? / Tienes que…)', max: 8, re: 'por qu[eé] no|quieres|tienes que|debes', ax: 'Contenido' },
          { k: 'res', label: '수락·거절 (Sí, gracias / Es que …)', max: 6, re: 's[ií],? gracias|no,? gracias|es que|vale|de acuerdo|buena idea|la voy a tomar|lo voy a tomar', ax: 'Contenido' },
          { k: 'dol', label: 'doler (duele / duelen)', max: 8, re: '(me|te|le|nos|os|les) duelen?', ax: 'Gramática' },
          { k: 'per', label: '현재완료 2번 이상', max: 10, min: 2, re: '(he|has|ha|hemos|hab[eé]is|han)\\s+\\p{L}*(ado|ido|[ií]do|cho|sto|to|erto|elto)', ax: 'Gramática' },
          { k: 'adv', label: 'ya / todavía / nunca / alguna vez', max: 8, re: 'ya|todav[ií]a|a[uú]n|nunca|jam[aá]s|alguna vez', ax: 'Gramática' },
          { k: 'exc', label: '감탄문 ¡Qué …!', max: 6, re: '¡\\s*qu[eé]\\s+\\p{L}+', ax: 'Gramática' }
        ],
        model: 'A: ¿Qué te pasa? ¿No te encuentras bien? B: No, me duele mucho la cabeza y tengo fiebre. Hoy me he levantado muy temprano y he estudiado cinco horas. A: ¡Qué pena! ¿Por qué no te tomas una aspirina? B: Es que no me gusta tomar medicinas. A: ¿Ya has comido? ¿Quieres una sopa caliente? B: Todavía no he comido. Sí, gracias.'
      }
    },
    build: B
  });
})();
