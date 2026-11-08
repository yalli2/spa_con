/* Lección 03 · Trabajos y profesiones — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, dialogHTML, dialogBlock, clozeFromDialog, MARK, speak } = SC;

  /* Lección 03 · Trabajos y profesiones — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vocabulario 직업·일터 어휘',
      gen: 'Género 명사·형용사의 성',
      int: 'Interrogativos 의문사',
      ver: 'Presente 현재형',
      des: 'Descripción 외모·성격',
      num: 'Números 숫자 31~100',
      dir: 'Dirección 주소·서수',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '직업 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '¿Qué haces?', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '직업 ↔ 일터', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '세 칸 문장 만들기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '듣고 대화 완성', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '직업과 하는 일', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'd2', label: 'Diálogo 2', kr: '후안과 크리스티나', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a5', label: 'Actividad 5', kr: '외모 묘사 ser·tener·llevar', group: 'Diálogo 2', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '반대말 · 나의 성격', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '이 사람들은 어때?', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '¿Cómo es tu …?', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '숫자 듣고 고르기', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '숫자 빙고', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '스페인어로 계산하기', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'a12', label: 'Actividad 12', kr: '명함 · 주소 · 서수', group: 'Diálogo 2', kind: 'act', n: 12 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    profesiones: [
      { es: 'artista', kr: '예술가', e: '🎨' },
      { es: 'cocinero', kr: '요리사', e: '👨‍🍳' },
      { es: 'cantante', kr: '가수', e: '🎤' },
      { es: 'médico', kr: '의사', e: '🩺' },
      { es: 'profesora', kr: '(여자) 선생님', e: '👩‍🏫' },
      { es: 'taxista', kr: '택시 기사', e: '🚕' },
      { es: 'escritor', kr: '작가', e: '✍️' },
      { es: 'ingeniero', kr: '엔지니어', e: '👷' },
      { es: 'científico', kr: '과학자', e: '🔬' },
      { es: 'músico', kr: '음악가', e: '🎻' },
      { es: 'camarero', kr: '웨이터 (종업원)', e: '🍽️' },
      { es: 'enfermera', kr: '(여자) 간호사', e: '💉' }
    ],

    dialogo1: [
      { who: 'Él', es: '¿Qué [haces]? ¿[Estudias] o trabajas?' },
      { who: 'Ella', es: 'Soy [estudiante] de la universidad.' },
      { who: 'Él', es: '¡Ah! ¿Qué estudias?' },
      { who: 'Ella', es: '[Estudio] arte. ¿Y tú? ¿A qué te [dedicas]?' },
      { who: 'Él', es: 'Soy [médico].' },
      { who: 'Ella', es: '¿[Dónde] trabajas?' },
      { who: 'Él', es: '[Trabajo] en el Hospital Santa Cruz.' },
      { who: 'Ella', es: '¿Sí? ¡Qué [coincidencia]! ¡Yo vivo [cerca] del Hospital Santa Cruz!' }
    ],

    dialogo2: [
      { who: 'Juan', es: '¡Hola, Cristina! ¿Qué [tal] tu clase de español?' },
      { who: 'Cristina', es: '¡[Excelente]! Es muy [divertida] y la profesora es muy simpática e inteligente.' },
      { who: 'Juan', es: '¿[Tienes] nuevos amigos en la clase de español?' },
      { who: 'Cristina', es: 'Sí, tengo dos.' },
      { who: 'Juan', es: '¿Cómo se llaman? ¿[Cómo] son tus amigos?' },
      { who: 'Cristina', es: 'Se llaman Ana y Pablo. Son muy simpáticos. [Sobre todo], Ana es muy inteligente y [activa]. Pablo es muy gracioso. Es [alto] y tiene los ojos grandes.' },
      { who: 'Juan', es: '¿Y estudian mucho?' },
      { who: 'Cristina', es: '¡Claro que [sí]! ¡Son muy [estudiosos]!' }
    ],

    /* Actividad 3 — TRANSCRIPCIONES */
    dialogo3: [
      { who: 'A', es: 'Eres española, ¿verdad?' },
      { who: 'B', es: 'No, soy mexicana, pero vivo en Barcelona.' },
      { who: 'A', es: 'Ah. ¿Qué haces? ¿Estudias o trabajas?' },
      { who: 'B', es: 'Trabajo en un hospital. Soy médica. ¿Y tú? ¿Qué haces?' },
      { who: 'A', es: 'Yo soy estudiante. Estudio matemáticas en la Universidad de Barcelona.' }
    ],

    /* Actividad 1 — SOLUCIONES */
    act1: [
      { n: 'María', p: 'profesora', l: 'universidad', art: 'una', e: '👩‍🏫' },
      { n: 'Alberto', p: 'científico', l: 'laboratorio', art: 'un', e: '👨‍🔬' },
      { n: 'Ana', p: 'secretaria', l: 'oficina', art: 'una', e: '👩‍💼' },
      { n: 'Juan', p: 'camarero', l: 'restaurante', art: 'un', e: '🤵' },
      { n: 'Carmen', p: 'enfermera', l: 'hospital', art: 'un', e: '💉' },
      { n: 'Julia', p: 'dependiente', l: 'tienda', art: 'una', e: '🛍️', alt: 'dependienta' },
      { n: 'Lucas', p: 'médico', l: 'hospital', art: 'un', e: '👨‍⚕️' },
      { n: 'Felipe', p: 'escritor', l: 'editorial', art: 'una', e: '✍️' }
    ],

    /* Actividad 4 — SOLUCIONES: 1)b 2)f 3)e 4)c 5)d 6)a */
    act4: [
      ['🚕 El taxista', 'conduce un taxi.'],
      ['📷 El fotógrafo', 'saca fotos.'],
      ['👨‍🏫 El profesor', 'da clases en la escuela.'],
      ['🤵 El camarero', 'atiende a los clientes en el restaurante.'],
      ['👨‍⚕️ El médico', 'cuida a los enfermos.'],
      ['💇 El peluquero', 'corta el pelo.']
    ],

    adjetivos: ['antipático', 'estricto', 'tonto', 'serio', 'trabajador', 'gracioso', 'tímido', 'simpático', 'sincero', 'mentiroso',
      'inteligente', 'interesante', 'aburrido', 'tranquilo', 'hablador', 'perezoso', 'generoso', 'activo'],

    utiles: [
      ['¿Qué haces?', '무슨 일 해? (직업이 뭐야?)'],
      ['Soy médico.', '나는 의사야.'],
      ['¿Dónde trabajas?', '어디에서 일해?'],
      ['Trabajo en un hospital.', '병원에서 일해.'],
      ['¿Cómo eres?', '너는 어떤 사람이야?'],
      ['Soy activo, sincero y simpático.', '나는 활발하고 솔직하고 친절해.'],
      ['¿Qué estudias?', '뭘 공부해?'],
      ['Estudio inglés.', '영어를 공부해.'],
      ['¿Dónde vives?', '어디 살아?'],
      ['Vivo en la calle Libertad número 30, séptimo B.', '리베르타드 거리 30번지, 7층 B호에 살아.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '¿____ haces? — Soy médico.', a: ['qué'], s: 'int' },
      { p: '¿____ trabajas? — En un hospital.', a: ['dónde'], s: 'int' },
      { p: '¿____ eres? — Soy alto y simpático.', a: ['cómo'], s: 'int' },
      { p: 'Yo ____ en Barcelona. <i>(vivir)</i>', a: ['vivo'], s: 'ver' },
      { p: '¿Tú ____ o trabajas? <i>(estudiar)</i>', a: ['estudias'], s: 'ver' },
      { p: 'Mi padre ____ en un banco. <i>(trabajar)</i>', a: ['trabaja'], s: 'ver' },
      { p: '¿Qué ____ tú? <i>(hacer)</i>', a: ['haces'], s: 'ver' },
      { p: 'Yo ____ los deberes por la tarde. <i>(hacer)</i>', a: ['hago'], s: 'ver' },
      { p: 'Nosotros ____ arte en la universidad. <i>(estudiar)</i>', a: ['estudiamos'], s: 'ver' },
      { p: 'Carmen es ____ y trabaja en un hospital. <i>(enfermero)</i>', a: ['enfermera'], s: 'gen' },
      { p: 'María es ____ y trabaja en una universidad. <i>(profesor)</i>', a: ['profesora'], s: 'gen' },
      { p: 'Mi madre es muy ____. <i>(simpático)</i>', a: ['simpática'], s: 'gen' },
      { p: 'Pablo ____ el pelo corto y los ojos azules. <i>(tener)</i>', a: ['tiene'], s: 'des' },
      { p: 'Juan es bajo y ____ gafas. <i>(llevar)</i>', a: ['lleva'], s: 'des' },
      { p: '45 = cuarenta ____ cinco', a: ['y'], s: 'num' },
      { p: '70 = ____', a: ['setenta'], s: 'num' },
      { p: '100 = ____', a: ['cien'], s: 'num' },
      { p: 'Vivo en el ____ piso. <i>(7°)</i>', a: ['séptimo'], s: 'dir' },
      { p: '¡Qué ____! Yo vivo cerca del hospital. <i>(우연이네!)</i>', a: ['coincidencia'], s: 'voc' },
      { p: 'El taxista ____ un taxi. <i>(운전하다)</i>', a: ['conduce'], s: 'voc' }
    ]
  };

  /* ---------- 도우미 ---------- */
  const UNI = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
    'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
    'veintisiete', 'veintiocho', 'veintinueve'];
  const DEC = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa' };
  const num = n => n < 30 ? UNI[n] : n === 100 ? 'cien' : DEC[Math.floor(n / 10)] + (n % 10 ? ' y ' + UNI[n % 10] : '');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  /* 형용사 → 남/여 모두 허용하는 정규식 */
  const gAdj = a => { const r = acc(a); return /\[oó\]$/.test(r) ? r.replace(/\[oó\]$/, '[oa]s?') : /r$/.test(r) ? r + '(a|es|as)?' : r + 's?'; };
  const ADJ = '(alt|baj|delgad|gord|guap|fe|rubi|moren|simp[aá]tic|antip[aá]tic|seri|t[ií]mid|activ|sincer|mentiros|gracios|aburrid|tranquil|perezos|generos|estudios|divertid|trabajador|hablador|inteligente|interesante|j[oó]ven|viej|estrict|amable|alegre|tont|car[ií][nñ]os|responsable|paciente|ordenad|creativ|valiente)\\p{L}*';
  const ADJ_F = '(alta|baja|delgada|gorda|guapa|rubia|morena|simp[aá]tica|seria|t[ií]mida|activa|sincera|graciosa|tranquila|generosa|trabajadora|habladora|divertida|inteligente|interesante|amable|alegre|j[oó]ven|estricta|cari[nñ]osa|responsable|paciente|ordenada|creativa|valiente|estudiosa)';

  /* 인물 그림 SVG — o: {tall, fat, hair, style:'short'|'curly'|'long'|'spiky'|'side', gray, glasses, beard, mus, dress, shirt, pants, skin} */
  function fig(o) {
    const skin = o.skin || '#f6d2b0', hc = o.hair || '#3b2a20';
    const top = o.tall ? 12 : 54, hx = 60, hy = top + 22, r = 17;
    const neck = hy + r, sh = neck + 4, bw = o.fat ? 30 : 18, waist = o.tall ? 132 : 150, foot = 222;
    let g = '';
    if (o.style === 'long') g += `<rect x="${hx - r - 4}" y="${hy - 8}" width="${2 * r + 8}" height="${r + 36}" rx="12" fill="${hc}"/>`;
    // 몸
    if (o.dress) {
      g += `<path d="M${hx - bw} ${sh} L${hx + bw} ${sh} L${hx + bw + 14} ${waist + 34} L${hx - bw - 14} ${waist + 34} Z" fill="${o.dress}" stroke="#333" stroke-width="1.2"/>`;
      g += `<line x1="${hx - 8}" y1="${waist + 34}" x2="${hx - 9}" y2="${foot - 4}" stroke="${skin}" stroke-width="6"/><line x1="${hx + 8}" y1="${waist + 34}" x2="${hx + 9}" y2="${foot - 4}" stroke="${skin}" stroke-width="6"/>`;
      g += `<line x1="${hx - bw}" y1="${sh + 4}" x2="${hx - bw - 8}" y2="${waist + 6}" stroke="${skin}" stroke-width="6" stroke-linecap="round"/><line x1="${hx + bw}" y1="${sh + 4}" x2="${hx + bw + 8}" y2="${waist + 6}" stroke="${skin}" stroke-width="6" stroke-linecap="round"/>`;
    } else {
      g += `<rect x="${hx - bw + 3}" y="${waist}" width="${bw - 4}" height="${foot - waist - 4}" fill="${o.pants || '#2f7fd0'}" stroke="#333" stroke-width="1.2"/><rect x="${hx + 1}" y="${waist}" width="${bw - 4}" height="${foot - waist - 4}" fill="${o.pants || '#2f7fd0'}" stroke="#333" stroke-width="1.2"/>`;
      g += `<rect x="${hx - bw}" y="${sh}" width="${2 * bw}" height="${waist - sh + 6}" rx="${o.fat ? 18 : 6}" fill="${o.shirt || '#fff'}" stroke="#333" stroke-width="1.2"/>`;
      g += `<rect x="${hx - bw - 9}" y="${sh + 2}" width="9" height="${waist - sh - 6}" rx="4" fill="${o.shirt || '#fff'}" stroke="#333" stroke-width="1.2"/><rect x="${hx + bw}" y="${sh + 2}" width="9" height="${waist - sh - 6}" rx="4" fill="${o.shirt || '#fff'}" stroke="#333" stroke-width="1.2"/>`;
      if (o.tie) g += `<path d="M${hx} ${sh + 2} l-4 6 l4 26 l4 -26 z" fill="${o.tie}"/>`;
    }
    g += `<ellipse cx="${hx - 9}" cy="${foot}" rx="9" ry="4" fill="#6b4c3b"/><ellipse cx="${hx + 9}" cy="${foot}" rx="9" ry="4" fill="#6b4c3b"/>`;
    // 머리
    g += `<circle cx="${hx}" cy="${hy}" r="${r}" fill="${skin}" stroke="#333" stroke-width="1.2"/>`;
    if (o.style === 'curly') { for (let a = -170; a <= -10; a += 22) { const rad = a * Math.PI / 180; g += `<circle cx="${hx + Math.cos(rad) * (r + 1)}" cy="${hy + Math.sin(rad) * (r + 1)}" r="7" fill="${hc}"/>`; } }
    else if (o.style === 'spiky') g += `<path d="M${hx - r - 1} ${hy - 2} L${hx - r + 2} ${hy - r - 6} L${hx - 8} ${hy - r + 1} L${hx - 3} ${hy - r - 9} L${hx + 3} ${hy - r} L${hx + 9} ${hy - r - 8} L${hx + r - 2} ${hy - r + 2} L${hx + r + 1} ${hy - 2} Q${hx} ${hy - r + 6} ${hx - r - 1} ${hy - 2}Z" fill="${hc}"/>`;
    else if (o.style === 'side') g += `<path d="M${hx - r - 2} ${hy + 6} Q${hx - r - 6} ${hy - r - 10} ${hx} ${hy - r - 6} Q${hx + r + 6} ${hy - r - 10} ${hx + r + 2} ${hy + 6} Q${hx + r - 2} ${hy - r + 4} ${hx} ${hy - r + 6} Q${hx - r + 2} ${hy - r + 4} ${hx - r - 2} ${hy + 6}Z" fill="${hc}"/>`;
    else g += `<path d="M${hx - r - 1} ${hy + 1} Q${hx - r} ${hy - r - 8} ${hx} ${hy - r - 4} Q${hx + r} ${hy - r - 8} ${hx + r + 1} ${hy + 1} Q${hx + 6} ${hy - r + 5} ${hx - r - 1} ${hy + 1}Z" fill="${hc}"/>`;
    // 얼굴
    g += `<circle cx="${hx - 6}" cy="${hy - 1}" r="1.8" fill="#222"/><circle cx="${hx + 6}" cy="${hy - 1}" r="1.8" fill="#222"/>`;
    if (o.eyes) g += `<circle cx="${hx - 6}" cy="${hy - 1}" r="2.6" fill="${o.eyes}"/><circle cx="${hx + 6}" cy="${hy - 1}" r="2.6" fill="${o.eyes}"/>`;
    if (o.beard) g += `<path d="M${hx - r + 2} ${hy + 3} Q${hx} ${hy + r + 14} ${hx + r - 2} ${hy + 3} Q${hx} ${hy + 14} ${hx - r + 2} ${hy + 3}Z" fill="${hc}"/>`;
    if (o.mus) g += `<path d="M${hx - 8} ${hy + 8} Q${hx - 4} ${hy + 4} ${hx} ${hy + 7} Q${hx + 4} ${hy + 4} ${hx + 8} ${hy + 8} Q${hx} ${hy + 10} ${hx - 8} ${hy + 8}Z" fill="${hc}"/>`;
    else g += `<path d="M${hx - 5} ${hy + 9} Q${hx} ${hy + 12} ${hx + 5} ${hy + 9}" fill="none" stroke="#a33" stroke-width="1.5"/>`;
    if (o.glasses) g += `<g fill="none" stroke="#222" stroke-width="1.6"><circle cx="${hx - 7}" cy="${hy - 1}" r="5.5"/><circle cx="${hx + 7}" cy="${hy - 1}" r="5.5"/><line x1="${hx - 1.5}" y1="${hy - 1}" x2="${hx + 1.5}" y2="${hy - 1}"/></g>`;
    return `<svg viewBox="0 0 120 230" role="img">${g}</svg>`;
  }
  const figCard = (o, name, cap2) => `<div class="fig">${fig(o)}<b>${name}</b>${cap2 ? `<small>${cap2}</small>` : ''}</div>`;

  /* Actividad 5 인물 (교재 그림) */
  const P5 = [
    { n: 'Ana', o: { tall: 1, hair: '#f2b21b', style: 'curly', dress: '#1f9e87', eyes: '#2a8bd0' },
      must: [{ re: W0 + 'alta' + W1, label: 'alta (여성형!)' }, { re: W0 + 'delgada' + W1, label: 'delgada' }, { re: W0 + 'tiene' + W1 + '[^.]*' + W0 + 'pelo' + W1, label: 'tiene el pelo …' }, { re: '(rubio|rizado|corto)', label: 'rubio / rizado / corto' }],
      model: 'Ana es alta, delgada y rubia. Tiene el pelo corto y rizado y los ojos azules.' },
    { n: 'Juan', o: { fat: 1, hair: '#1d1d1d', style: 'spiky', glasses: 1, pants: '#2f7fd0' },
      must: [{ re: W0 + 'bajo' + W1, label: 'bajo' }, { re: W0 + 'gordo' + W1, label: 'gordo' }, { re: 'pelo (negro|corto)', label: 'tiene el pelo negro / corto' }, { re: W0 + 'lleva gafas' + W1, label: 'lleva gafas' }],
      model: 'Juan es bajo y gordo. Tiene el pelo negro y corto. Lleva gafas.' },
    { n: 'Pablo', o: { tall: 1, hair: '#bdbdbd', style: 'side', beard: 1, shirt: '#3f8f4a', pants: '#3f8f4a', tie: '#1e7fd0' },
      must: [{ re: W0 + 'alto' + W1, label: 'alto' }, { re: W0 + 'viejo' + W1, label: 'viejo' }, { re: 'pelo (blanco|gris|canoso|corto)', label: 'tiene el pelo blanco / gris' }, { re: W0 + 'barba' + W1, label: 'tiene barba' }],
      model: 'Pablo es alto, delgado y viejo. Tiene el pelo blanco y corto. Tiene barba.' },
    { n: 'Lucas', o: { fat: 1, hair: '#c96a22', style: 'curly', glasses: 1, mus: 1 },
      must: [{ re: W0 + 'bajo' + W1, label: 'bajo' }, { re: W0 + 'gordo' + W1, label: 'gordo' }, { re: 'pelo rizado', label: 'tiene el pelo rizado' }, { re: W0 + 'bigote' + W1, label: 'tiene bigote' }, { re: W0 + 'lleva gafas' + W1, label: 'lleva gafas' }],
      model: 'Lucas es bajo y gordo. Tiene el pelo rizado y corto. Tiene bigote y lleva gafas.' },
    { n: 'Cristina', o: { hair: '#b8642a', style: 'long', dress: '#f5d531' },
      must: [{ re: W0 + 'j[oó]ven' + W1, label: 'joven' }, { re: W0 + 'delgada' + W1, label: 'delgada (여성형!)' }, { re: 'pelo (largo|liso)', label: 'tiene el pelo largo / liso' }],
      model: 'Cristina es joven y delgada. Tiene el pelo largo y liso.' }
  ];

  const B = {};

  B.vocab = () => {
    const txt = 'En los países hispanoamericanos, como en todos los países, hay diversas ocupaciones y profesiones. Hay artistas, músicos, escritores, ingenieros, médicos, profesores, científicos, etc. Los artistas crean obras bellas, los cocineros preparan comida deliciosa, los cantantes cantan melodías preciosas y los profesores enseñan a los alumnos. Todos los trabajos son importantes para el desarrollo de nuestra vida y de la sociedad.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${txt} ${say(txt)}</p>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요</h3><div class="fg"></div>
      <h3 class="h3">② 읽기 확인 — 글에 나온 동사를 쓰세요</h3><div class="rc"></div>
      <h3 class="h3">③ 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요</h3><div class="items two"></div>`);
    put(s, '.fg', flipGrid(D.profesiones));
    put(s, '.rc', cloze({ id: 'v-rc', sec: 'vocab', skill: 'voc', cls: 'lines', text: ['Los artistas [crean] obras bellas.', 'Los cocineros [preparan] comida deliciosa.', 'Los cantantes [cantan] melodías preciosas.', 'Los profesores [enseñan] a los alumnos.'].map(x => `<p>${x}</p>`).join('') }));
    D.profesiones.forEach((a, i) => put(s, '.items', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`, answers: [a.es, (/a$/.test(a.es) && a.es !== 'artista' ? 'la ' : 'el ') + a.es] })));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 명사의 성 (Género de los sustantivos) — 직업 이름</h3>
        <div class="blocks"><span class="bk s">-o → -a</span><span class="small">el médic<b>o</b> → la médic<b>a</b> · el camarer<b>o</b> → la camarer<b>a</b></span></div>
        <div class="blocks"><span class="bk v">자음 + a</span><span class="small">el profeso<b>r</b> → la profesor<b>a</b> · el escrito<b>r</b> → la escritor<b>a</b></span></div>
        <div class="blocks"><span class="bk o">-e / -ista = 같음</span><span class="small">el / la estudiant<b>e</b> · el / la cantant<b>e</b> · el / la tax<b>ista</b> · el / la art<b>ista</b></span></div>
        <div class="blocks"><span class="bk p">특별한 형태</span><span class="small">el actor → la actriz</span></div>
        ${tip('직업을 말할 때는 <b>관사 없이</b>: Soy médico. (○) / Soy <s>un</s> médico. (✕)<br>형용사도 성을 맞춰요: Juan es alt<b>o</b> → Ana es alt<b>a</b>. (-e 로 끝나면 같음: inteligente)')}
        <div class="g1"></div></div>
      <div class="gcard"><h3>2. 의문사 (Interrogativos) — qué · dónde · cómo</h3>
        <table class="dt"><tr><th>의문사</th><th>뜻</th><th>예문</th></tr>
          <tr><td><b>¿Qué …?</b></td><td>무엇</td><td>¿Qué haces? ${say('¿Qué haces?')} — Soy médico. / ¿Qué estudias? — Estudio arte.</td></tr>
          <tr><td><b>¿Dónde …?</b></td><td>어디</td><td>¿Dónde trabajas? ${say('¿Dónde trabajas?')} — Trabajo en un hospital. / ¿Dónde vives?</td></tr>
          <tr><td><b>¿Cómo …?</b></td><td>어떻게 · 어떤</td><td>¿Cómo eres? ${say('¿Cómo eres?')} — Soy activo. / ¿Cómo se llama?</td></tr></table>
        ${tip('의문사에는 항상 <b>악센트</b>와 앞뒤 <b>¿ ?</b> 부호! qué · dónde · cómo<br>¿A qué te dedicas? = ¿Qué haces? = ¿Cuál es tu profesión? (직업을 묻는 표현)')}
        <div class="g2a"></div><div class="items g2b"></div></div>
      <div class="gcard"><h3>3. 현재형 (Presente de indicativo) — estudiar · trabajar · vivir · hacer</h3>
        <div class="blocks"><span class="bk v">-ar</span><span class="small">-o, -as, -a, -amos, -áis, -an</span></div>
        <div class="blocks"><span class="bk s">-er</span><span class="small">-o, -es, -e, -emos, -éis, -en</span></div>
        <div class="blocks"><span class="bk o">-ir</span><span class="small">-o, -es, -e, -imos, -ís, -en</span></div>
        <p class="small">빈칸에 알맞은 형태를 쓰세요. <b>hacer</b> 는 yo 만 불규칙: <b>hago</b> (빨간 칸)</p>
        <div class="g3a"></div><div class="g3b"></div></div>
      <div class="gcard"><h3>4. 외모 묘사 — ser · tener · llevar</h3>
        <div class="blocks"><span class="bk p">ser</span><span class="bk s">alto, bajo, delgado, gordo, rubio, moreno, joven, viejo …</span><span class="small">Es alto y moreno.</span></div>
        <div class="blocks"><span class="bk o">tener</span><span class="bk s">el pelo rubio / largo / rizado, los ojos azules, bigote, barba</span><span class="small">Tiene el pelo largo.</span></div>
        <div class="blocks"><span class="bk v">llevar</span><span class="bk s">gafas</span><span class="small">Lleva gafas.</span></div>
        ${tip('성격도 <b>ser</b>: Soy simpático. / 반대로 말할 땐 <b>No soy … ni …</b>: No soy mentiroso ni aburrido.<br><b>y → e</b>: i- 로 시작하는 단어 앞에서 (simpática <b>e</b> inteligente)')}</div>`);
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'gen', title: '여성형을 쓰세요.', cls: 'table2', text:
      [['el médico', 'médica'], ['el camarero', 'camarera'], ['el profesor', 'profesora'], ['el escritor', 'escritora'], ['el estudiante', 'estudiante'],
        ['el cantante', 'cantante'], ['el taxista', 'taxista'], ['el enfermero', 'enfermera'], ['el actor', 'actriz']].map(([a, b]) => `<p><span>${a}</span> → la [${b}]</p>`).join('') }));
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'int', title: '알맞은 의문사를 쓰세요.', cls: 'lines', text:
      ['¿[Qué] haces? — Soy médico.', '¿[Dónde] vives? — Vivo en Seúl.', '¿[Cómo] es tu madre? — Es alta y simpática.', '¿[Qué] estudias? — Estudio arte.', '¿[Dónde] trabaja Ana? — Trabaja en una oficina.']
        .map(x => `<p>${x}</p>`).join('') }));
    [['— Trabajo en un banco.', ['¿Dónde trabajas?', '¿Dónde trabajas tú?']], ['— Soy alto y delgado.', ['¿Cómo eres?', '¿Cómo eres tú?']], ['— Estudio matemáticas.', ['¿Qué estudias?', '¿Qué estudias tú?']]]
      .forEach(([a, ans], i) => put(s, '.g2b', writeItem({ id: 'g2b-' + i, sec: 'gram', skill: 'int', prompt: `대답에 맞는 질문 쓰기: <i>${a}</i>`, ph: '¿…?', answers: ans })));
    const R = [['yo', 'estudio', 'trabajo', 'vivo', 'hago'], ['tú', 'estudias', 'trabajas', 'vives', 'haces'], ['él / ella / usted', 'estudia', 'trabaja', 'vive', 'hace'],
      ['nosotros/as', 'estudiamos', 'trabajamos', 'vivimos', 'hacemos'], ['vosotros/as', 'estudiáis', 'trabajáis', 'vivís', 'hacéis'], ['ellos / ellas / ustedes', 'estudian', 'trabajan', 'viven', 'hacen']];
    const BL = { '0-1': 1, '0-3': 1, '0-4': 1, '1-2': 1, '1-3': 1, '2-4': 1, '3-3': 1, '4-3': 1, '5-1': 1, '5-4': 1 };
    put(s, '.g3a', cloze({ id: 'g3a', sec: 'gram', skill: 'ver', text: `<table class="conj"><tr><th></th><th>estudiar</th><th>trabajar</th><th>vivir</th><th>hacer</th></tr>${R.map((r, i) => `<tr>${r.map((c, j) => j === 0 ? `<td>${c}</td>` : `<td class="${i === 0 && j === 4 ? 'irr' : ''}">${BL[i + '-' + j] ? '[' + c + ']' : c}</td>`).join('')}</tr>`).join('')}</table>` }));
    put(s, '.g3b', cloze({ id: 'g3b', sec: 'gram', skill: 'ver', cls: 'lines', title: '괄호 속 동사를 알맞게 바꾸세요.', text:
      ['Mi madre [trabaja] en un hospital. <i>(trabajar)</i>', 'Nosotros [vivimos] en Seúl. <i>(vivir)</i>', '¿Qué [haces] tú? <i>(hacer)</i>', 'Ana y Pablo [estudian] español. <i>(estudiar)</i>'].map(x => `<p>${x}</p>`).join('') }));
  };

  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Dos personas hablan de sus profesiones.')}
      <div class="dlg"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cuál es tu profesión? / ¿A qué te dedicas?</span><span class="hlc c1">¿Cuál es tu especialidad?</span><span class="hlc c2">¿De verdad? / ¿En serio?</span></div>
      <div class="items two d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    put(s, '.dlg', dialogBlock('d1', D.dialogo1, { cls: 'comic' }));
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'ver', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['직업이 뭐예요? <span class="small">(¿Cuál …?)</span>', ['¿Cuál es tu profesión?']], ['무슨 일 하세요? <span class="small">(dedicarse)</span>', ['¿A qué te dedicas?']],
      ['전공이 뭐야? <span class="small">(especialidad)</span>', ['¿Cuál es tu especialidad?']], ['정말? <span class="small">(두 가지 중 하나)</span>', ['¿De verdad?', '¿En serio?']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'int', prompt: p, ph: '¿…?', answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '처음 만난 사람과 직업·공부에 대해 이야기하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¿Qué haces? ¿Estudias o trabajas?\nB: Soy …',
      must: [{ re: '¿\\s*(qu[eé] haces|a qu[eé] te dedicas|cu[aá]l es tu profesi[oó]n)', label: '직업 묻기 (¿Qué haces? …)' }, { re: W0 + '(soy|estudio|trabajo)' + W1, label: 'Soy … / Estudio … / Trabajo …' },
        { re: '¿\\s*d[oó]nde (trabajas|estudias|vives)', label: '¿Dónde …?' }, { re: '(¿\\s*s[ií]\\s*\\?|de verdad|en serio|qu[eé] coincidencia)', label: '맞장구 (¿Sí? / ¿De verdad? / ¡Qué coincidencia!)' }],
      model: 'A: ¿Qué haces? ¿Estudias o trabajas? B: Trabajo. Soy profesora. ¿Y tú? A: Soy estudiante. Estudio música. B: ¿Dónde estudias? A: En la Universidad de Seúl. B: ¿De verdad? ¡Qué coincidencia! Yo trabajo allí.' }));
  };

  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Mira los dibujos y relaciona los nombres de profesiones con los lugares de trabajo siguiendo el modelo.')}
      <div class="sbw"></div>
      ${modelo('Juan es camarero y trabaja en un restaurante.<br>María es profesora y trabaja en una universidad.')}
      ${tip('일터 앞 관사: <b>un</b> laboratorio / hospital / restaurante · <b>una</b> universidad / oficina / tienda / editorial')}
      <h3 class="h3">✍️ 그림을 보고 modelo처럼 쓰세요</h3><div class="items two w1"></div>`);
    put(s, '.sbw', sortBoard({ id: 'a1-s', sec: 'a1', skill: 'voc', title: '① 직업 → 일터: 표현을 누르고 알맞은 칸을 누르세요', cols: [
      { k: 'lab', label: '🔬 laboratorio' }, { k: 'hos', label: '🏥 hospital' }, { k: 'ofi', label: '🏢 oficina' }, { k: 'res', label: '🍽️ restaurante' }, { k: 'tie', label: '🛍️ tienda' }, { k: 'uni', label: '🎓 universidad' }, { k: 'edi', label: '📚 editorial' }],
      chips: [['científico', 'lab'], ['enfermero', 'hos'], ['secretario', 'ofi'], ['cocinero', 'res'], ['dependiente', 'tie'], ['profesor', 'uni'], ['escritor', 'edi']] }));
    D.act1.forEach((x, i) => {
      const ps = x.alt ? [x.p, x.alt] : [x.p];
      const ans = ps.flatMap(p => [`${x.n} es ${p} y trabaja en ${x.art} ${x.l}.`, `${x.n} es ${p} y trabaja en ${x.art === 'un' ? 'el' : 'la'} ${x.l}.`]);
      put(s, '.w1', writeItem({ id: 'a1-' + i, sec: 'a1', skill: 'voc', prompt: `<span class="worker"><span class="emo-big">${x.e}</span><span>${i + 1}) ${x.n}, ${x.p}</span></span>`, ph: `${x.n} es …`, answers: ans }));
    });
  };

  const A2 = { v: ['Soy', 'Trabajo', 'Vivo', 'Estudio', 'Hablo'], p: ['en', 'de', 'con', 'ø'], o: ['Corea', 'un banco', 'una escuela secundaria', 'español', 'española'] };
  const A2OK = ['Soy de Corea', 'Soy española', 'Trabajo en un banco', 'Trabajo en una escuela secundaria', 'Trabajo en Corea', 'Vivo en Corea', 'Estudio en una escuela secundaria',
    'Estudio en Corea', 'Estudio español', 'Hablo español', 'Hablo en español'];
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Elabora tantas frases como puedas utilizando las palabras que hay en las tres columnas.', { kr: '세 칸에서 하나씩 골라 문장을 만들어요. (ø = 아무것도 넣지 않음) 맞는 문장 8개를 찾으면 100점!' })}
      ${modelo('Soy de Corea.<br>Soy española.')}
      <div class="mach">${['v', 'p', 'o'].map((k, ci) => `<div class="mcol" data-k="${k}"><b>${['1 · 동사', '2 · 전치사', '3 · 말'][ci]}</b>${A2[k].map(w => `<button class="wchip" data-w="${esc(w)}">${w}</button>`).join('')}</div>`).join('')}</div>
      <div class="mach-out"><span class="mo">…</span><button class="btn chk mk2">문장 만들기</button><span class="mkbox"></span></div>
      <div class="mach-meter"><i></i></div><p class="small">찾은 문장 <b class="cnt">0</b> / 8</p><div class="found"></div>
      <h3 class="h3">✍️ 우리말을 보고 스페인어로 쓰세요</h3><div class="items two w2"></div>`);
    reg('a2-m', 'a2', 'ver');
    const st = sel('a2', { found: [] });
    const pick = { v: null, p: null, o: null };
    const sent = () => [pick.v, pick.p === 'ø' ? null : pick.p, pick.o].filter(Boolean).join(' ');
    const paint = () => {
      $$('.mcol', s).forEach(c => $$('.wchip', c).forEach(b => b.classList.toggle('on', pick[c.dataset.k] === b.dataset.w)));
      $('.mo', s).textContent = pick.v || pick.p || pick.o ? sent() + '.' : '…';
      $('.found', s).innerHTML = st.found.map(f => `<span>✔ ${f}.</span>`).join('');
      $('.cnt', s).textContent = st.found.length;
      $('.mach-meter i', s).style.width = Math.min(100, st.found.length / 8 * 100) + '%';
    };
    $$('.mcol', s).forEach(c => $$('.wchip', c).forEach(b => b.onclick = () => { pick[c.dataset.k] = b.dataset.w; $('.mkbox', s).innerHTML = ''; paint(); }));
    $('.mk2', s).onclick = () => {
      if (!pick.v || !pick.p || !pick.o) { $('.mkbox', s).innerHTML = '<span class="warn">세 칸에서 모두 고르세요.</span>'; return; }
      const t = sent(), ok = A2OK.includes(t);
      if (ok && !st.found.includes(t)) st.found.push(t);
      record('a2-m', Math.min(1, st.found.length / 8), ok ? [] : ['estructura'], {});
      $('.mkbox', s).innerHTML = MARK(ok ? 1 : 0) + (ok ? ' ' + say(t) : ' <span class="small">어색한 문장이에요. 다시 골라 보세요.</span>');
      paint();
    };
    paint();
    [['나는 한국 출신이다.', ['Soy de Corea.']], ['나는 스페인 사람이다. <span class="small">(여자)</span>', ['Soy española.']], ['나는 은행에서 일한다.', ['Trabajo en un banco.']],
      ['나는 중학교에서 공부한다. <span class="small">(escuela secundaria)</span>', ['Estudio en una escuela secundaria.']], ['나는 스페인어를 말한다.', ['Hablo español.', 'Hablo en español.']]]
      .forEach(([p, a], i) => put(s, '.w2', writeItem({ id: 'a2-' + i, sec: 'a2', skill: 'ver', prompt: p, answers: a })));
  };

  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Escucha y completa el diálogo con las palabras del recuadro.', { listen: true })}
      <h3 class="h3"><button class="btn ghost sm" id="play3">▶ 대화 듣기</button> <span class="small">듣기 전에 단어 상자부터 확인하세요.</span></h3>
      <div class="ybox wordbank">단어 상자: ${['trabajas', 'Estudio', 'médica', 'vivo', 'haces', 'española', 'hospital', 'estudiante'].map(w => `<span>${w}</span>`).join('')}</div>
      <div class="c3"></div>
      <h3 class="h3">✍️ 내용 확인 — 3인칭으로 대답하세요</h3><div class="items w3"></div>`);
    $('#play3', s).onclick = e => playLines(D.dialogo3, e.currentTarget);
    put(s, '.c3', cloze({ id: 'a3c', sec: 'a3', skill: 'ver', cls: 'lines modelo-like', text:
      ['A: Eres [española], ¿verdad?', 'B: No, soy mexicana, pero [vivo] en Barcelona.', 'A: Ah. ¿Qué [haces]? ¿Estudias o [trabajas]?', 'B: Trabajo en un [hospital]. Soy [médica]. ¿Y tú? ¿Qué haces?',
        'A: Yo soy [estudiante]. [Estudio] matemáticas en la Universidad de Barcelona.'].map(x => `<p>${x}</p>`).join('') }));
    [['¿De dónde es B?', ['Es de México.', 'Es mexicana.', 'B es de México.', 'B es mexicana.']], ['¿Dónde trabaja B?', ['Trabaja en un hospital.', 'B trabaja en un hospital.']],
      ['¿Qué estudia A?', ['Estudia matemáticas.', 'A estudia matemáticas.', 'Estudia matemáticas en la Universidad de Barcelona.', 'A estudia matemáticas en la Universidad de Barcelona.']]]
      .forEach(([q, a], i) => put(s, '.w3', writeItem({ id: 'a3-' + i, sec: 'a3', skill: 'ver', prompt: `${q} ${say(q)}`, answers: a })));
  };

  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Relaciona las palabras con las actividades profesionales.')}
      <div class="pmx"></div>
      <h3 class="h3">✍️ 여자라면? — 여성형으로 바꿔 한 문장으로 쓰세요</h3><div class="items two w4"></div>`);
    put(s, '.pmx', pairMatch({ id: 'a4-p', sec: 'a4', skill: 'voc', pairs: D.act4 }));
    [['🚕 taxista (여)', 'La taxista conduce un taxi.'], ['📷 fotógrafo → (여)', 'La fotógrafa saca fotos.'], ['👩‍⚕️ médico → (여)', 'La médica cuida a los enfermos.'], ['💇‍♀️ peluquero → (여)', 'La peluquera corta el pelo.']]
      .forEach(([p, a], i) => put(s, '.w4', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'gen', prompt: p, ph: 'La …', answers: [a] })));
  };

  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Cristina habla de sus nuevos amigos de la clase de español.')}
      <div class="dlg"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) 표현 바꿔 쓰기</h3>
      <div class="chips"><span class="hlc c0">¿Cómo es tu clase de español?</span><span class="hlc c1">¡Genial! / ¡Muy bien!</span><span class="hlc c2">Son muy amables</span><span class="hlc c0">Especialmente</span><span class="hlc c1">¡Cómo no!</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 나의 친구 소개하기</h3><div class="d2f"></div>`);
    put(s, '.dlg', dialogBlock('d2', D.dialogo2));
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'des', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['La clase de español de Cristina es aburrida.', 'Falso'], ['Cristina tiene dos amigos nuevos.', 'Verdadero'], ['Pablo es bajo y tiene los ojos pequeños.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'des', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['<u>¿Qué tal</u> tu clase de español?', '¿Cómo es …?', '¿Cómo es tu clase de español?'], ['Son muy <u>simpáticos</u>.', 'amables', 'Son muy amables.'],
      ['<u>Sobre todo</u>, Ana es muy inteligente.', 'Especialmente', 'Especialmente, Ana es muy inteligente.'], ['<u>¡Claro que sí!</u>', '¡Cómo no!', '¡Cómo no!']]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'des', prompt: `${p} → <span class="chip">${k}</span>`, answers: [a] })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 4, prompt: '반 친구 한 명(또는 두 명)을 크리스티나처럼 소개하세요. 이름 · 성격 · 외모를 넣어요.',
      ph: 'Mi amiga se llama … Es muy …',
      must: [{ re: W0 + 'se llaman?' + W1, label: 'se llama(n)' }, { re: W0 + '(es|son) (muy |un poco |bastante )?' + ADJ, label: 'es / son + 형용사' },
        { re: W0 + 'tienen?' + W1, label: 'tiene + 외모 (el pelo …, los ojos …)' }, { re: '(sobre todo|especialmente)', label: 'sobre todo / especialmente' }],
      model: 'Mi amiga se llama Sora. Es muy simpática y habladora. Sobre todo, es muy inteligente. Es alta y tiene el pelo largo y los ojos grandes.' }));
  };

  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Describe a las siguientes personas utilizando las expresiones del recuadro.')}
      <table class="dt"><tr><th>ser</th><td>alto, bajo, guapo, feo, delgado, gordo, rubio, moreno, joven, viejo</td></tr>
        <tr><th>tener</th><td>pelo rubio, pelo negro, pelo largo, pelo corto, pelo liso, pelo rizado, ojos negros, ojos azules, bigote, barba</td></tr>
        <tr><th>llevar</th><td>gafas</td></tr></table>
      <div class="figs">${P5.map(p => figCard(p.o, p.n)).join('')}</div>
      <div class="sbw"></div>
      <h3 class="h3">✍️ 그림을 보고 한 사람씩 묘사하세요 <span class="small">(여자는 형용사도 여성형!)</span></h3>
      ${modelo('Juan es bajo y gordo. Tiene el pelo negro y corto. Lleva gafas.')}
      <div class="ds"></div>`);
    put(s, '.sbw', sortBoard({ id: 'a5-s', sec: 'a5', skill: 'des', title: '① 어느 동사와 함께 쓸까요? 표현을 칸에 넣으세요', cols: [{ k: 'ser', label: 'ser (Es …)' }, { k: 'ten', label: 'tener (Tiene …)' }, { k: 'lle', label: 'llevar (Lleva …)' }],
      chips: [['alto', 'ser'], ['gordo', 'ser'], ['joven', 'ser'], ['viejo', 'ser'], ['pelo rizado', 'ten'], ['ojos azules', 'ten'], ['bigote', 'ten'], ['gafas', 'lle']] }));
    P5.forEach((p, i) => {
      const row = el(`<div class="desc-row">${figCard(p.o, p.n)}<div class="dbox"></div></div>`);
      $('.dbox', row).appendChild(freeItem({ id: 'a5-' + i, sec: 'a5', skill: 'des', rows: 2, prompt: `¿Cómo es ${p.n}?`, ph: `${p.n} es …`, must: p.must, model: p.model }));
      put(s, '.ds', row);
    });
  };

  const OPP = [['antipático', 'simpático'], ['tonto', 'inteligente'], ['serio', 'gracioso'], ['trabajador', 'perezoso'], ['tímido', 'hablador'], ['sincero', 'mentiroso'], ['aburrido', 'interesante'], ['tranquilo', 'activo']];
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'a) Juego de contrarios')}
      <p class="kr-sub">En parejas, elige, por turnos, una palabra y dísela a tu compañero. Tu compañero tiene que decir la contraria. → 반대말끼리 연결하세요.</p>
      <div class="ybox wordbank">${D.adjetivos.map(a => `<span>${a}</span>`).join('')}</div>
      <div class="pmx"></div>
      <div class="c6"></div>
      <h2 class="act-title">b) Habla con tus compañeros sobre tu personalidad siguiendo el modelo.</h2>
      ${modelo('A: ¿Cómo eres?<br>B: Soy activo, sincero y simpático.<br>Pero soy un poco estricto. No soy mentiroso ni aburrido.')}
      <div class="item"><div class="item-p">modelo의 B가 <b>여자</b>라면? 첫 문장을 바꿔 쓰세요.</div><div class="w6"></div></div>
      <h3 class="h3">🧩 나의 성격 고르기</h3>
      <div class="mode"><button data-m="si" class="on">😊 Soy (3개)</button><button data-m="poco">🤏 un poco (1개)</button><button data-m="no">🙅 No soy (2개)</button></div>
      <div class="ybox pick6"></div>
      <div class="f6"></div>`);
    put(s, '.pmx', pairMatch({ id: 'a6-p', sec: 'a6', skill: 'des', pairs: OPP }));
    put(s, '.c6', cloze({ id: 'a6c', sec: 'a6', skill: 'gen', cls: 'lines', title: '반대말을 성·수에 맞게 쓰세요.', text:
      ['Ana no es antipática. Es muy [simpática].', 'Mis amigos no son perezosos. Son muy [trabajadores].', 'Pablo no es serio. Es muy [gracioso|divertido].'].map(x => `<p>${x}</p>`).join('') }));
    $('.w6', s).appendChild(writeItem({ id: 'a6-w', sec: 'a6', skill: 'gen', ph: 'Soy …', answers: ['Soy activa, sincera y simpática.'] }));
    const st = sel('a6', { si: [], poco: [], no: [] });
    const LIM = { si: 3, poco: 1, no: 2 };
    let mode = 'si';
    const pick = $('.pick6', s);
    const paint = () => {
      pick.innerHTML = D.adjetivos.map(a => { const m = ['si', 'poco', 'no'].find(k => st[k].includes(a)); return `<button class="wchip ${m === 'si' ? 'lk' : m ? 'dk' : ''}" data-a="${a}">${m === 'si' ? '😊 ' : m === 'poco' ? '🤏 ' : m === 'no' ? '🙅 ' : ''}${a}</button>`; }).join('');
      $$('.wchip', pick).forEach(b => b.onclick = () => {
        const a = b.dataset.a, arr = st[mode];
        if (arr.includes(a)) arr.splice(arr.indexOf(a), 1);
        else { ['si', 'poco', 'no'].forEach(k => { const j = st[k].indexOf(a); if (j > -1) st[k].splice(j, 1); }); if (arr.length >= LIM[mode]) arr.shift(); arr.push(a); }
        save(); paint();
      });
    };
    $$('.mode button', s).forEach(b => b.onclick = () => { mode = b.dataset.m; $$('.mode button', s).forEach(x => x.classList.toggle('on', x === b)); });
    paint();
    put(s, '.f6', freeItem({ id: 'a6-f', sec: 'a6', skill: 'des', rows: 3, prompt: '내가 고른 성격으로 modelo처럼 쓰세요. (Soy … Pero soy un poco … No soy … ni …)', needMsg: 'Soy 3개, un poco 1개, No soy 2개를 먼저 고르세요.',
      must: () => (st.si.length < 3 || st.poco.length < 1 || st.no.length < 2) ? null : [
        { re: W0 + 'soy' + W1, label: 'Soy …' }, ...st.si.map(a => ({ re: W0 + gAdj(a) + W1, label: a })),
        { re: W0 + 'un poco ' + gAdj(st.poco[0]) + W1, label: 'un poco ' + st.poco[0] },
        { re: W0 + 'no soy ' + gAdj(st.no[0]) + W1, label: 'No soy ' + st.no[0] }, { re: W0 + 'ni ' + gAdj(st.no[1]) + W1, label: 'ni ' + st.no[1] }],
      model: 'Soy activo, sincero y simpático. Pero soy un poco estricto. No soy mentiroso ni aburrido.' }));
  };

  const P7 = [
    { n: 'Alberto', job: 'científico', o: { tall: 1, hair: '#e8e8e8', style: 'curly', mus: 1, shirt: '#555', pants: '#444' }, k: '키가 크고 늙었다', a: ['Es alto y viejo.', 'Es viejo y alto.'],
      must: [{ re: W0 + 'viejo' + W1, label: 'viejo' }, { re: 'pelo (blanco|gris|rizado)', label: 'tiene el pelo blanco' }, { re: W0 + 'bigote' + W1, label: 'tiene bigote' }],
      model: 'Alberto es científico. Es alto y viejo. Tiene el pelo blanco y rizado y tiene bigote. Es muy inteligente.' },
    { n: 'Marcos', job: 'político', o: { tall: 1, hair: '#222', style: 'short', skin: '#9a6a46', shirt: '#2b3a55', pants: '#2b3a55', tie: '#c33' }, k: '키가 크고 말랐다', a: ['Es alto y delgado.', 'Es delgado y alto.'],
      must: [{ re: W0 + 'alto' + W1, label: 'alto' }, { re: W0 + 'delgado' + W1, label: 'delgado' }, { re: 'pelo (negro|corto)', label: 'tiene el pelo negro / corto' }],
      model: 'Marcos es alto, delgado y moreno. Tiene el pelo negro y corto. Es serio y trabajador.' },
    { n: 'Sora', job: 'actriz', o: { hair: '#1b1b1b', style: 'long', dress: '#f4f0e8' }, k: '젊고 예쁘다', a: ['Es joven y guapa.', 'Es guapa y joven.'],
      must: [{ re: W0 + 'guapa' + W1, label: 'guapa (여성형!)' }, { re: W0 + 'j[oó]ven' + W1, label: 'joven' }, { re: 'pelo (largo|negro|liso)', label: 'tiene el pelo largo / negro / liso' }],
      model: 'Sora es actriz. Es joven, delgada y guapa. Tiene el pelo largo, liso y negro y los ojos negros.' },
    { n: 'Rafael', job: 'actor cómico', o: { hair: '#4a3020', style: 'side', shirt: '#3a3a3a', pants: '#3a3a3a', tie: '#7a1f2b' }, k: '아주 웃기다', a: ['Es muy gracioso.'],
      must: [{ re: W0 + 'gracioso' + W1, label: 'gracioso' }, { re: W0 + '(bajo|alto|delgado|moreno)' + W1, label: '외모 형용사 (bajo, moreno …)' }, { re: 'pelo (corto|casta[nñ]o|negro)', label: 'tiene el pelo corto / castaño' }],
      model: 'Rafael es actor. Es bajo, delgado y moreno. Tiene el pelo corto y castaño. Es muy gracioso.' }
  ];
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Describe cómo son estas personas.')}
      ${notice('📷 교재의 유명인 사진 대신 <b>그림 인물</b>로 구성했어요. 그림과 직업 힌트를 보고 외모 · 성격을 묘사하세요.')}
      <div class="figs">${P7.map(p => figCard(p.o, p.n, p.job)).join('')}</div>
      <div class="ds"></div>`);
    P7.forEach((p, i) => {
      const row = el(`<div class="desc-row">${figCard(p.o, p.n, p.job)}<div class="dbox"></div></div>`);
      $('.dbox', row).appendChild(writeItem({ id: 'a7-w' + i, sec: 'a7', skill: 'des', prompt: `① ${p.k} <span class="small">(${p.n === 'Sora' ? '여자' : '남자'})</span>`, ph: 'Es …', answers: p.a }));
      $('.dbox', row).appendChild(freeItem({ id: 'a7-f' + i, sec: 'a7', skill: 'des', rows: 2, prompt: `② ¿Cómo es ${p.n}? — 2~3문장으로`, ph: `${p.n} es …`, must: p.must, model: p.model }));
      put(s, '.ds', row);
    });
  };

  B.a8 = () => {
    const Q = [['¿Cómo es tu hermano o tu hermana?', [{ re: W0 + 'es' + W1, label: 'Es …' }, { re: W0 + ADJ, label: '형용사' }]],
      ['¿Cómo es tu madre?', [{ re: W0 + 'es' + W1, label: 'Es …' }, { re: W0 + ADJ_F + W1, label: '여성형 형용사 (alta, simpática …)' }]],
      ['¿Cómo son tus compañeros de clase?', [{ re: W0 + 'son' + W1, label: 'Son …' }, { re: W0 + ADJ.replace('\\p{L}*', '') + '\\p{L}*s' + W1, label: '복수형 형용사 (simpáticos, inteligentes …)' }]],
      ['¿Cómo es tu padre?', [{ re: W0 + 'es' + W1, label: 'Es …' }, { re: W0 + ADJ, label: '형용사' }, { re: W0 + '(tiene|lleva)' + W1, label: 'tiene / lleva + 외모' }]],
      ['¿Cómo es tu profesor?', [{ re: W0 + 'es' + W1, label: 'Es …' }, { re: W0 + ADJ, label: '형용사' }]]];
    const s = sec('a8', `${actHead(8, 'Habla con tus compañeros.', { kr: '질문에 대한 나의 대답을 써요. 외모(ser · tener · llevar)와 성격을 함께!' })}
      <div class="ybox two-col"><div>${Q.slice(0, 3).map(q => `<p>${q[0]} ${say(q[0])}</p>`).join('')}</div><div>${Q.slice(3).map(q => `<p>${q[0]} ${say(q[0])}</p>`).join('')}</div></div>
      <div class="items a8"></div>
      <h3 class="h3">✍️ 질문 만들기</h3><div class="items two q8"></div>`);
    Q.forEach(([q, m], i) => put(s, '.a8', freeItem({ id: 'a8-' + i, sec: 'a8', skill: 'des', line: true, prompt: `${i + 1}) ${q}`, ph: i === 2 ? 'Son …' : 'Es …', must: m })));
    [['네 할아버지는 어떤 분이셔?', ['¿Cómo es tu abuelo?']], ['너의 가장 친한 친구는 어때? <span class="small">(mejor amigo/a)</span>', ['¿Cómo es tu mejor amigo?', '¿Cómo es tu mejor amiga?']]]
      .forEach(([p, a], i) => put(s, '.q8', writeItem({ id: 'a8-q' + i, sec: 'a8', skill: 'int', prompt: p, ph: '¿Cómo …?', answers: a })));
  };

  const A9 = [['16', '60', '60'], ['76', '67', '76'], ['19', '91', '19'], ['2', '12', '12'], ['18', '80', '80'], ['30', '13', '13']];
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Escucha y elige el número correcto.', { listen: true })}
      <h3 class="h3">📒 숫자 31~100</h3>
      <div class="numtab">${[31, 32, 40, 45, 50, 60, 70, 80, 90, 100].map(n => `<div><b>${n}</b><span>${num(n)}</span>${say(num(n))}</div>`).join('')}</div>
      ${tip('16~29는 한 단어 (dieciséis, veintidós), <b>31부터는 세 단어</b>: treinta <b>y</b> uno, cuarenta <b>y</b> cinco … / 100 = <b>cien</b>')}
      <h3 class="h3">🎧 🔊를 누르고 들은 숫자를 고르세요</h3><div class="items two ch9"></div>
      <h3 class="h3">✍️ 숫자를 스페인어로 쓰세요</h3><div class="items two w9"></div>`);
    A9.forEach(([a, b, ok], i) => put(s, '.ch9', choiceItem({ id: 'a9-' + i, sec: 'a9', skill: 'num', prompt: `${i + 1}) ${say(num(+ok))} 들은 숫자는?`, options: [a, b], answer: ok, explain: `${ok} = ${num(+ok)}` })));
    [45, 91, 67, 100].forEach((n, i) => put(s, '.w9', writeItem({ id: 'a9-w' + i, sec: 'a9', skill: 'num', prompt: `<b style="font-size:22px">${n}</b>`, ph: 'en letras', answers: [num(n)] })));
  };

  const CALLED = [1, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 17, 19, 20, 21, 22, 24, 26, 28, 29, 30, 32, 33, 35, 37, 38, 40, 41, 43, 45, 46, 48, 49, 50, 51, 52, 55, 57, 58, 59, 60,
    62, 63, 65, 66, 67, 69, 70, 71, 73, 74, 76, 77, 78, 79, 80, 82, 83, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 99, 100];
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Escribe 16 números del 0 al 100. Escucha la grabación y borra los números que oigas. Si borras todos los números, di “¡Bingo!”.', { listen: true })}
      ${notice('🎧 교재 TRANSCRIPCIONES 의 숫자들을 순서대로 불러 줘요. ① 빙고판에 숫자 16개를 쓰고 → ② <b>게임 시작</b> → ③ <b>▶ 다음 숫자</b>를 듣고 해당 칸을 누르세요.')}
      <div class="bingo-wrap"><div class="bingo"></div>
        <div class="bingo-side"><div class="item-row"><button class="btn ghost sm rnd">🎲 숫자 자동 채우기</button><button class="btn sm go">▶ 게임 시작</button><button class="btn ghost sm rs">↺ 처음부터</button></div>
          <div class="item-row"><button class="btn big nx" disabled>🔊 다음 숫자</button><button class="btn ghost sm rp" disabled>다시 듣기</button></div>
          <div class="bingo-big"></div>
          <details><summary>불러 준 숫자 보기</summary><div class="called"></div></details>
          <div class="item-row"><button class="btn chk bchk">빙고판 채점</button><span class="mkbox"></span></div></div></div>
      <h3 class="h3">✍️ 숫자를 스페인어로 쓰세요</h3><div class="items two w10"></div>`);
    reg('a10-b', 'a10', 'num');
    const st = sel('a10', { nums: Array(16).fill(''), marks: [], k: 0, play: false });
    const bd = $('.bingo', s);
    const valid = () => st.nums.every(n => /^\d{1,3}$/.test(String(n)) && +n <= 100) && new Set(st.nums.map(Number)).size === 16;
    const calledNow = () => CALLED.slice(0, st.k);
    const paint = () => {
      if (!st.play) {
        bd.innerHTML = st.nums.map((n, i) => `<input class="bc" data-i="${i}" inputmode="numeric" maxlength="3" value="${esc(n)}" aria-label="빙고 칸 ${i + 1}">`).join('');
        $$('input.bc', bd).forEach(inp => inp.oninput = () => { st.nums[+inp.dataset.i] = inp.value.replace(/\D/g, ''); save(); });
      } else {
        bd.innerHTML = st.nums.map((n, i) => `<button class="bc ${st.marks.includes(i) ? 'on' : ''}" data-i="${i}">${n}</button>`).join('');
        $$('button.bc', bd).forEach(b => b.onclick = () => { const i = +b.dataset.i; const j = st.marks.indexOf(i); if (j > -1) st.marks.splice(j, 1); else st.marks.push(i); save(); paint(); });
      }
      $('.nx', s).disabled = !st.play || st.k >= CALLED.length;
      $('.rp', s).disabled = !st.play || !st.k;
      $('.called', s).innerHTML = calledNow().map(n => `<span>${n}</span>`).join('') || '<span>—</span>';
      $('.go', s).disabled = st.play;
    };
    $('.rnd', s).onclick = () => { if (st.play) return; st.nums = shuffle(Array.from({ length: 101 }, (_, i) => i)).slice(0, 16).sort((a, b) => a - b).map(String); save(); paint(); };
    $('.go', s).onclick = () => { if (!valid()) { $('.bingo-big', s).innerHTML = '<span class="warn" style="font-size:15px;font-family:var(--sans)">0~100 사이의 서로 다른 숫자 16개를 쓰세요.</span>'; return; } st.play = true; st.k = 0; st.marks = []; save(); $('.bingo-big', s).textContent = '¡Empezamos!'; paint(); };
    $('.rs', s).onclick = () => { st.play = false; st.k = 0; st.marks = []; save(); $('.bingo-big', s).textContent = ''; $('.mkbox', s).innerHTML = ''; paint(); };
    $('.nx', s).onclick = e => { const n = CALLED[st.k++]; save(); speak(num(n), e.currentTarget); $('.bingo-big', s).textContent = '🔊 …'; paint(); };
    $('.rp', s).onclick = e => { const n = CALLED[st.k - 1]; if (n != null) speak(num(n), e.currentTarget); };
    $('.bchk', s).onclick = () => {
      if (!st.play) { $('.mkbox', s).innerHTML = '<span class="warn">먼저 게임을 시작하세요.</span>'; return; }
      const C = calledNow();
      let ok = 0, bad = 0, miss = 0;
      st.nums.forEach((n, i) => { const c = C.includes(+n), m = st.marks.includes(i); if (c && m) ok++; else if (m) bad++; else if (c) miss++; });
      const tot = ok + bad + miss, sc = tot ? ok / tot : 0;
      record('a10-b', sc, sc < 1 ? ['otro'] : [], {});
      $$('button.bc', bd).forEach(b => { const i = +b.dataset.i, c = C.includes(+st.nums[i]), m = st.marks.includes(i); b.classList.toggle('no', m && !c); b.classList.toggle('miss', c && !m); });
      const bingo = st.nums.every(n => C.includes(+n)) && st.marks.length === 16 && !bad;
      $('.mkbox', s).innerHTML = `${MARK(sc)} <b>${ok} / ${tot || 0}</b> ${bingo ? '<b style="color:var(--red)">¡Bingo! 🎉</b>' : ''} <span class="small">(빨간 칸 = 부르지 않은 숫자, 주황 테두리 = 놓친 숫자)</span>`;
      if (st.k) $('.bingo-big', s).textContent = String(CALLED[st.k - 1]);
    };
    paint();
    [33, 48, 55, 82].forEach((n, i) => put(s, '.w10', writeItem({ id: 'a10-w' + i, sec: 'a10', skill: 'num', prompt: `<b style="font-size:22px">${n}</b> ${say(num(n))}`, ph: 'en letras', answers: [num(n)] })));
  };

  const A11 = [[25, '+', 17], [90, '−', 36], [8, '×', 7], [100, '÷', 4], [33, '+', 38], [9, '×', 11]];
  const OPW = { '+': 'más', '−': 'menos', '×': 'por', '÷': 'entre' };
  const calc = (a, o, b) => o === '+' ? a + b : o === '−' ? a - b : o === '×' ? a * b : a / b;
  B.a11 = () => {
    const s = sec('a11', `${actHead(11, '¿Qué tal las matemáticas? Con tu compañero, resuelve las cuentas siguiendo el modelo.')}
      <div class="grid2">${modelo('A: ¿Cuánto es doce más quince?<br>B: Veintisiete.<br>&nbsp;&nbsp;&nbsp;¿Cuánto es nueve por cinco?<br>A: Cuarenta y cinco.')}
        <div><div class="opbox"><span>más</span><b>+</b><span>menos</span><b>−</b><span>por</span><b>×</b><span>entre</span><b>÷</b></div></div></div>
      <h3 class="h3">✍️ 답을 스페인어로 쓰세요 (🔊 질문 듣기)</h3><div class="items two w11"></div>
      <h3 class="h3">✍️ 질문을 스페인어로 쓰세요</h3><div class="items two q11"></div>`);
    A11.forEach(([a, o, b], i) => {
      const q = `¿Cuánto es ${num(a)} ${OPW[o]} ${num(b)}?`, r = num(calc(a, o, b));
      put(s, '.w11', writeItem({ id: 'a11-' + i, sec: 'a11', skill: 'num', prompt: `<span class="calc">${a} ${o} ${b} = ?</span> ${say(q)}`, ph: 'Cuarenta y …', answers: [cap(r) + '.', 'Son ' + r + '.', 'Es ' + r + '.'] }));
    });
    [[6, '×', 8], [70, '−', 25]].forEach(([a, o, b], i) => put(s, '.q11', writeItem({ id: 'a11-q' + i, sec: 'a11', skill: 'num', prompt: `<span class="calc">${a} ${o} ${b}</span>`, ph: '¿Cuánto es …?', answers: [`¿Cuánto es ${num(a)} ${OPW[o]} ${num(b)}?`, `¿Cuánto son ${num(a)} ${OPW[o]} ${num(b)}?`] })));
  };

  B.a12 = () => {
    const s = sec('a12', `${actHead(12, 'a) Lee la información de la tarjeta de presentación y completa las frases.')}
      <div class="bcards"><div class="bcard"><div class="logo"><span class="lg-ic">🏛️</span>Universidad<br>de Salamanca</div>
        <div><div class="nm">Soledad Varela Ortega</div><div class="job">profesora</div>
          <div class="ln">svarela@zmail.com</div><div class="ln">Avda. de la Merced, No.240, 5° -A, 37005-Salamanca. España</div><div class="ln"><b>oficina</b> +34 923 29 44 00</div><div class="ln"><b>móvil</b> +34 619 29 24 86</div></div></div></div>
      <div class="c12"></div>
      <h2 class="act-title">b) Lee esta tarjeta y escribe frases sobre Enrique.</h2>
      <div class="bcards"><div class="bcard"><div class="logo"><span class="sm-ic"><i style="background:#2a8bd0">✚</i><i style="background:#d6202f">★</i></span><br><b style="color:#d6202f">Salud</b><b style="color:#2a8bd0">Madrid</b><br><br>Hospital<br>Universitatio<br>La Paz</div>
        <div><div class="nm">Dr. Enrique Torres Martínez</div><div class="job">médico general</div>
          <div class="ln">quique@kmail.com</div><div class="ln">P° de la Castellana, 261. Madrid, España.</div><div class="ln"><b>Tel.</b> 91 727 70 00</div><div class="ln"><b>Móvil</b> 619 785 511</div></div></div></div>
      <div class="items two w12"></div>
      <h3 class="h3">📒 서수 (Ordinales) · 주소 약어</h3>
      <div class="abbr"><div class="o12"></div><div class="pm12"></div></div>
      ${tip('남성 명사 앞에서 <b>primero → primer</b>, <b>tercero → tercer</b>: Vivo en el <b>primer</b> piso. / el <b>tercer</b> piso')}
      <h2 class="act-title">c) Completa la ficha con tus datos personales y contesta las preguntas. <span class="small">(¡Compruébalo! a)</span></h2>
      <table class="ficha"><tr><th colspan="2">APELLIDOS</th><th colspan="2">NOMBRE</th></tr><tr><td colspan="2"><input data-f="ap"></td><td colspan="2"><input data-f="no"></td></tr>
        <tr><th>NACIONALIDAD</th><th>EDAD</th><th>TELÉFONO</th><th>E-MAIL</th></tr><tr><td><input data-f="na"></td><td><input data-f="ed"></td><td><input data-f="te"></td><td><input data-f="em"></td></tr>
        <tr><th>CALLE</th><th>NÚMERO</th><th>PISO</th><th>PUERTA/NÚMERO</th></tr><tr><td><input data-f="ca"></td><td><input data-f="nu"></td><td><input data-f="pi"></td><td><input data-f="pu"></td></tr>
        <tr><th>CIUDAD</th><th>PROVINCIA</th><th colspan="2">CÓDIGO POSTAL</th></tr><tr><td><input data-f="ci"></td><td><input data-f="pr"></td><td colspan="2"><input data-f="cp"></td></tr></table>
      <p class="small">카드 내용은 이 브라우저에 저장돼요(채점 없음). 아래 질문에는 문장으로 답하세요.</p>
      <div class="items f12"></div>`);
    put(s, '.c12', cloze({ id: 'a12c', sec: 'a12', skill: 'dir', cls: 'lines', text:
      ['Soledad es [profesora].', 'Trabaja en una [universidad].', 'Vive en la avenida de la [Merced], número [240].', 'Su número de móvil es el [619 29 24 86|619292486].', 'Su correo electrónico es [svarela@zmail.com].'].map(x => `<p>${x}</p>`).join('') }));
    const E = (...a) => a.flatMap(x => [x, 'Enrique ' + x.charAt(0).toLowerCase() + x.slice(1)]);
    [['💼 직업', E('Es médico.', 'Es médico general.')], ['🏥 일하는 곳', E('Trabaja en un hospital.', 'Trabaja en el Hospital Universitario La Paz.')],
      ['🏠 사는 곳 <span class="small">(paseo …, número …)</span>', E('Vive en el paseo de la Castellana, número 261.', 'Vive en el paseo de la Castellana 261.')],
      ['📱 휴대폰 번호', ['Su número de móvil es el 619 785 511.', 'Su número de móvil es 619 785 511.', 'Su número de móvil es el 619785511.', 'Su móvil es el 619 785 511.']],
      ['📧 이메일', ['Su correo electrónico es quique@kmail.com.', 'Su email es quique@kmail.com.', 'Su e-mail es quique@kmail.com.']]]
      .forEach(([p, a], i) => put(s, '.w12', writeItem({ id: 'a12-' + i, sec: 'a12', skill: 'dir', prompt: p, ph: i < 3 ? 'Enrique …' : 'Su …', answers: a })));
    put(s, '.o12', cloze({ id: 'a12o', sec: 'a12', skill: 'dir', cls: 'table2', text:
      [['1°', 'primero', 0], ['2°', 'segundo', 1], ['3°', 'tercero', 1], ['4°', 'cuarto', 1], ['5°', 'quinto', 1], ['6°', 'sexto', 0], ['7°', 'séptimo', 1], ['8°', 'octavo', 0], ['9°', 'noveno', 1], ['10°', 'décimo', 1]]
        .map(([a, b, k]) => `<p><span>${a}</span>${k ? '[' + b + ']' : '<b>' + b + '</b>'}</p>`).join('') }));
    put(s, '.pm12', pairMatch({ id: 'a12-p', sec: 'a12', skill: 'dir', pairs: [['C/', 'calle'], ['P°', 'paseo'], ['N°', 'número'], ['Avda.', 'avenida'], ['Pza.', 'plaza']] }));
    const fs = sel('a12f', {});
    $$('.ficha input', s).forEach(inp => { inp.value = fs[inp.dataset.f] || ''; inp.oninput = () => { fs[inp.dataset.f] = inp.value; save(); }; });
    const ORD = '(primer|primero|segundo|tercer|tercero|cuarto|quinto|sexto|s[eé]ptimo|octavo|noveno|d[eé]cimo)';
    [['1) ¿En qué calle vives?', 'Vivo en la calle …', [{ re: W0 + 'vivo en' + W1, label: 'Vivo en …' }, { re: '(calle|avenida|paseo|plaza)', label: 'calle / avenida / paseo / plaza' }]],
      ['2) ¿Qué número es tu piso?', 'Es el número …', [{ re: '(\\d+|' + W0 + '(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|veint\\p{L}*|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien)' + W1 + ')', label: '번호 (숫자)' }]],
      ['3) ¿En qué piso vives?', 'Vivo en el … piso.', [{ re: W0 + ORD + W1, label: '서수 (primer, segundo, tercer …)' }, { re: W0 + 'piso' + W1, label: 'piso' }]],
      ['4) ¿Cuál es el código postal de tu casa y de tu escuela?', 'El código postal de mi casa es …', [{ re: 'c[oó]digo postal', label: 'el código postal' }, { re: '\\d{3,}', label: '우편번호 숫자', min: 2 }]]]
      .forEach(([q, ph, m], i) => put(s, '.f12', freeItem({ id: 'a12-f' + i, sec: 'a12', skill: 'dir', line: true, prompt: `${q} ${say(q.replace(/^\d\) /, ''))}`, ph, must: m })));
  };

  SC.lesson({
    num: '03',
    title: 'Trabajos y profesiones',
    ttsTest: '¿Qué haces? Soy médico y trabajo en un hospital.',
    cover: {
      emoji: '👩‍⚕️👨‍🍳👩‍🏫<br><small>💼 🏥 📇</small>',
      bg: 'linear-gradient(135deg,#5b2a1c 0%,#8a3b22 45%,#e9a15b 100%)',
      tema: ['Profesiones · Lugares de trabajo · Direcciones', 'Adjetivos para hacer descripciones físicas y de personalidad', 'Números del 31 al 100 · Ordinales del 1° al 10°'],
      com: ['Hablar sobre la profesión', 'Describir el aspecto físico de una persona', 'Hablar del carácter de una persona', 'Preguntar y dar información sobre una dirección'],
      gram: ['Género de los sustantivos', 'Interrogativos: <i>cómo, dónde, qué</i>', 'Presente de indicativo: <i>estudiar, trabajar, vivir, hacer</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      'Él': { av: '👨🏻‍⚕️', side: 'l' }, Ella: { av: '👩🏼‍🎨', side: 'r' },
      Juan: { av: '🧑🏻', side: 'l' }, Cristina: { av: '👩🏽‍🦱', side: 'r' },
      A: { av: '🧑🏻‍🎓', side: 'l' }, B: { av: '👩🏽‍⚕️', side: 'r' }
    },
    errLabels: { interrogativo: '의문사 (qué · dónde · cómo)', concordancia: '성 · 수 일치 (médico/médica)', conjugacion: '동사 변화 (현재형)' },
    errTips: {
      acento: 'médico, científico, simpático, tímido, séptimo, dieciséis, veintidós … 악센트도 철자예요. 시험에서는 감점됩니다.',
      concordancia: '여자는 여성형! médico → médica, profesor → profesora, alto → alta. -e/-ista 는 그대로 (estudiante, taxista).',
      interrogativo: '¿Qué? 무엇 · ¿Dónde? 어디 · ¿Cómo? 어떻게/어떤 — 의문사에는 늘 악센트!',
      conjugacion: 'yo estudio/trabajo/vivo/hago · tú estudias/trabajas/vives/haces · él estudia/trabaja/vive/hace',
      estructura: '직업 앞에는 관사 없이 (Soy médico) · 일하는 곳은 en (Trabajo en un hospital) · 외모는 ser/tener/llevar 구분'
    },
    classify(ti, ta) {
      const Q = ['que', 'donde', 'como', 'cual', 'cuanto'];
      const st = w => w.normalize('NFD').replace(/[̀-ͯ]/g, '');
      const qi = ti.map(st).filter(w => Q.includes(w)).join(), qa = ta.map(st).filter(w => Q.includes(w)).join();
      if (qi !== qa) return 'interrogativo';
      if (ti.length === ta.length) {
        const d = ti.map((w, i) => [st(w), st(ta[i])]).filter(([a, b]) => a !== b);
        if (d.length === 1) { const [a, b] = d[0]; if (a + 'a' === b || b + 'a' === a || (a.slice(0, -1) === b.slice(0, -1) && /[oa]$/.test(a) && /[oa]$/.test(b))) return 'concordancia'; }
      }
      if (ti.length === ta.length + 1 && (ti.includes('un') || ti.includes('una')) && !ta.includes('un') && !ta.includes('una')) return 'estructura';
      return null;
    },
    errRules: [
      { re: W0 + '(soy|es|eres|somos|son) (un|una) (m[eé]dic[oa]|profesor[a]?|estudiante|camarer[oa]|enfermer[oa]|cocener[oa]|cociner[oa]|secretari[oa]|escritor[a]?|cient[ií]fic[oa]|ingenier[oa]|taxista|artista|cantante|dependient[ea]|peluquer[oa]|fot[oó]graf[oa])' + W1, t: 'estructura', msg: '직업 앞에는 관사 없이: Soy médico.' },
      { re: W0 + '(trabajo|trabajas|trabaja|vivo|vives|vive|estudio) a (un|una|el|la)' + W1, t: 'estructura', msg: '장소 앞에는 en: Trabajo en un hospital.' },
      { re: W0 + 'yo (haces|hace|haco)' + W1, t: 'conjugacion', msg: 'hacer 의 yo 형 → hago' },
      { re: W0 + '(soy|es|eres|somos|son) (el )?(pelo|ojos)' + W1, t: 'estructura', msg: '머리·눈은 tener: Tengo el pelo … / Tiene los ojos …' },
      { re: W0 + '(tengo|tiene|tienes) (alt|baj|delgad|gord|guap|j[oó]ven|viej)\\p{L}*' + W1, t: 'estructura', msg: '키·체형은 ser: Soy alto. / Es delgada.' },
      { re: W0 + 'veinte y (uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)' + W1, t: 'otro', msg: '21~29는 한 단어: veintiuno, veintidós …' },
      { re: W0 + '(treinti|cuarenti|cincuenti|sesenti|setenti|ochenti|noventi)\\p{L}+', t: 'otro', msg: '31부터는 세 단어: treinta y uno, cuarenta y dos …' },
      { re: W0 + 'ciento' + W1 + '(?=\\s*[.,!?]|\\s*$)', t: 'otro', msg: '100 하나만 말할 때는 cien' },
      { re: W0 + 'y(?= (inteligente|interesante|ingl[eé]s|ingeniero|ir|hija|hijo|historia)' + W1 + ')', t: 'estructura', msg: 'i-/hi- 앞의 y → e (simpática e inteligente)' },
      { re: W0 + 'trabajo de (un|una)' + W1, t: 'estructura', msg: '"Trabajo en …" (장소) / "Trabajo de + 직업" 은 관사 없이' }
    ],
    accWords: ['científico', 'científica', 'científicos', 'tímido', 'tímida', 'tímidos', 'tímidas', 'jóvenes', 'veintidós', 'veintitrés', 'veintiséis', 'dieciséis', 'séptimo', 'décimo',
      'informático', 'informática', 'periodística', 'ingeniería', 'matemáticas', 'teléfono'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿A qué te dedicas?', 'Trabajo en un hospital.', 'Soy activo, sincero y simpático.', 'Soy estudiante de la universidad.', 'Vivo en la calle Libertad número 30, séptimo B.'],
    utilSkill: 'ver',
    proverbio: { es: 'Más vale pájaro en mano que ciento volando.', e: '🐦', answer: '남의 돈 천 냥이 내 돈 한 푼만 못하다',
      options: ['티끌 모아 태산', '남의 돈 천 냥이 내 돈 한 푼만 못하다', '등잔 밑이 어둡다', '백지장도 맞들면 낫다'],
      kr: '손 안의 새 한 마리가 날아다니는 새 백 마리보다 낫다 — 불확실한 큰 것보다 확실한 작은 것이 낫다는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Haz una presentación sobre ti → 글로 쓰기',
        icons: ['🪪', '💼', '🏠'],
        questions: ['¿De dónde eres? ¿Qué lenguas hablas?', '¿Qué haces? ¿Qué estudias?', '¿Cómo eres de aspecto físico y de carácter?', '¿Dónde vives?'],
        minWords: 40,
        hint: '현재형 1인칭(soy, estudio, vivo, hablo) · tener/llevar · 성격 형용사를 활용하면 높은 점수!',
        ph: 'Me llamo … Soy de Corea y hablo …',
        connectors: ['y', 'pero', 'también', 'porque', 'sobre todo', 'especialmente', 'además'],
        rubric: [
          { k: 'ori', label: '출신 · 언어 (Soy de … / Hablo …)', max: 8, re: 'soy de|hablo', ax: 'Contenido' },
          { k: 'pro', label: '하는 일 · 공부 (Soy estudiante / Estudio …)', max: 8, re: 'soy estudiante|estudio|trabajo', ax: 'Contenido' },
          { k: 'fis', label: '외모 (alto, delgado, pelo, ojos, gafas …)', max: 8, re: 'alt[oa]|baj[oa]|delgad[oa]|gord[oa]|guap[oa]|rubi[oa]|moren[oa]|pelo|ojos|gafas', ax: 'Contenido' },
          { k: 'car', label: '성격 (simpático, activo, tímido …)', max: 8, re: 'simp[aá]tic[oa]|antip[aá]tic[oa]|activ[oa]|sincer[oa]|t[ií]mid[oa]|seri[oa]|gracios[oa]|trabajador[a]?|perezos[oa]|hablador[a]?|generos[oa]|tranquil[oa]|inteligente|estudios[oa]|divertid[oa]|estrict[oa]|aburrid[oa]|mentiros[oa]', ax: 'Contenido' },
          { k: 'viv', label: '사는 곳 (Vivo en …)', max: 8, re: 'vivo en', ax: 'Contenido' },
          { k: 'ver', label: '1인칭 현재형 4번 이상 (soy, estudio, vivo, hablo …)', max: 10, re: 'soy|estudio|trabajo|vivo|hablo|hago|tengo|llevo', min: 4, ax: 'Gramática' },
          { k: 'ten', label: 'tener / llevar (Tengo el pelo … / Llevo gafas)', max: 10, re: 'tengo|llevo', ax: 'Gramática' }
        ],
        model: 'Me llamo Minji y soy de Corea. Hablo coreano, inglés y un poco de español. Soy estudiante: estudio en una escuela secundaria de Seúl. Soy alta y delgada, tengo el pelo largo y negro y llevo gafas. Soy activa, sincera y muy habladora, pero soy un poco perezosa. Vivo en la calle Hangang, número 25, quinto A, con mi familia.'
      }
    },
    build: B
  });
})();
