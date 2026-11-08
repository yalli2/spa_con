/* Lección 05 · ¿Cómo es tu casa? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, acc, W0, W1, playLines, dialogHTML, clozeFromDialog, MARK } = SC;

  /* ---------- 그림 도구: 가구 아이콘 (교재 Actividad 2 그림 재현) ---------- */
  const S2 = 'stroke-width="2" stroke-linejoin="round"';
  const ICON = {
    'frigorífico': `<rect x="18" y="4" width="28" height="56" rx="4" fill="#9fd8ef" stroke="#2b6c8a" ${S2}/><line x1="18" y1="24" x2="46" y2="24" stroke="#2b6c8a" stroke-width="2"/><rect x="22" y="10" width="3" height="9" rx="1" fill="#2b6c8a"/><rect x="22" y="29" width="3" height="12" rx="1" fill="#2b6c8a"/>`,
    'bañera': `<rect x="4" y="22" width="56" height="6" rx="3" fill="#c5ebf6" stroke="#2b6c8a" ${S2}/><path d="M7 28 H57 V34 Q57 47 44 47 H20 Q7 47 7 34 Z" fill="#8fd3ea" stroke="#2b6c8a" ${S2}/><circle cx="17" cy="51" r="3" fill="#2b6c8a"/><circle cx="47" cy="51" r="3" fill="#2b6c8a"/>`,
    'sofá': `<rect x="12" y="15" width="40" height="22" rx="7" fill="#f7b3cb" stroke="#b5476e" ${S2}/><line x1="32" y1="16" x2="32" y2="36" stroke="#b5476e" stroke-width="2"/><rect x="8" y="31" width="48" height="13" rx="4" fill="#f7b3cb" stroke="#b5476e" ${S2}/><rect x="3" y="27" width="11" height="19" rx="5" fill="#f39abd" stroke="#b5476e" ${S2}/><rect x="50" y="27" width="11" height="19" rx="5" fill="#f39abd" stroke="#b5476e" ${S2}/><circle cx="10" cy="49" r="2.5" fill="#a0522d"/><circle cx="54" cy="49" r="2.5" fill="#a0522d"/>`,
    'lavabo': `<path d="M44 14 V8 H34 V12" fill="none" stroke="#9aa" stroke-width="3"/><circle cx="40" cy="8" r="2" fill="#e33"/><path d="M6 16 H58 Q56 36 32 36 Q8 36 6 16 Z" fill="#4fc3e8" stroke="#1f7aa0" ${S2}/><rect x="27" y="35" width="10" height="25" rx="2" fill="#4fc3e8" stroke="#1f7aa0" ${S2}/>`,
    'cuadro': `<rect x="6" y="12" width="52" height="40" fill="#e9d29a" stroke="#6b4c3b" stroke-width="3"/><rect x="11" y="17" width="42" height="30" fill="#bfe9f7"/><path d="M11 47 L22 30 L30 40 L38 28 L53 47 Z" fill="#3aa86b"/><circle cx="44" cy="23" r="3" fill="#ffd23f"/>`,
    'televisión': `<rect x="4" y="10" width="56" height="38" rx="3" fill="#546" stroke="#323" ${S2}/><rect x="9" y="15" width="46" height="28" fill="#2a9fd6"/><text x="32" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">tve</text><rect x="26" y="49" width="12" height="6" fill="#546"/>`,
    'escritorio': `<path d="M4 22 L60 22 L60 28 L4 28 Z" fill="#f2b84b" stroke="#8a5a14" ${S2}/><rect x="6" y="28" width="18" height="28" fill="#f2c96b" stroke="#8a5a14" ${S2}/><line x1="6" y1="38" x2="24" y2="38" stroke="#8a5a14" stroke-width="2"/><line x1="6" y1="47" x2="24" y2="47" stroke="#8a5a14" stroke-width="2"/><rect x="42" y="28" width="16" height="28" fill="#f2c96b" stroke="#8a5a14" ${S2}/><line x1="42" y1="40" x2="58" y2="40" stroke="#8a5a14" stroke-width="2"/>`,
    'ordenador': `<path d="M14 10 H52 L50 38 H16 Z" fill="#555" stroke="#333" ${S2}/><path d="M18 14 H48 L47 34 H19 Z" fill="#cfe8f3"/><path d="M8 40 H58 L62 50 H4 Z" fill="#bbb" stroke="#555" ${S2}/><line x1="12" y1="44" x2="54" y2="44" stroke="#777" stroke-width="1.5" stroke-dasharray="2 2"/>`,
    'cocina de gas': `<rect x="4" y="16" width="56" height="20" rx="3" fill="#666" stroke="#333" ${S2}/><circle cx="20" cy="26" r="7" fill="#999" stroke="#ddd" stroke-width="2"/><circle cx="44" cy="26" r="7" fill="#999" stroke="#ddd" stroke-width="2"/><rect x="4" y="36" width="56" height="12" rx="3" fill="#f27a7a" stroke="#333" ${S2}/><circle cx="52" cy="42" r="3" fill="#fff" stroke="#333"/>`,
    'armario': `<rect x="8" y="8" width="48" height="6" fill="#f2b84b" stroke="#8a5a14" ${S2}/><rect x="10" y="14" width="44" height="40" fill="#f2c96b" stroke="#8a5a14" ${S2}/><line x1="32" y1="16" x2="32" y2="52" stroke="#8a5a14" stroke-width="2"/><path d="M29 30 q-2 3 0 6 M35 30 q2 3 0 6" stroke="#8a5a14" stroke-width="2" fill="none"/>`,
    'lámpara': `<rect x="20" y="54" width="22" height="5" rx="2" fill="#333"/><line x1="31" y1="54" x2="24" y2="32" stroke="#333" stroke-width="3"/><line x1="24" y1="32" x2="34" y2="16" stroke="#333" stroke-width="3"/><path d="M28 10 L46 6 L50 22 Z" fill="#444"/><circle cx="44" cy="20" r="5" fill="#ffe14d"/>`,
    'cama': `<rect x="4" y="18" width="8" height="38" rx="2" fill="#f2c96b" stroke="#8a5a14" ${S2}/><rect x="52" y="28" width="8" height="28" rx="2" fill="#f2c96b" stroke="#8a5a14" ${S2}/><rect x="10" y="34" width="44" height="14" fill="#7cc7ea" stroke="#2b6c8a" ${S2}/><rect x="13" y="27" width="14" height="8" rx="3" fill="#fff" stroke="#2b6c8a" stroke-width="1.5"/><path d="M26 34 Q40 26 54 34" fill="#9dd6f0" stroke="#2b6c8a" stroke-width="1.5"/>`,
    'silla': `<rect x="18" y="6" width="28" height="22" rx="3" fill="#f6cf6b" stroke="#8a5a14" ${S2}/><line x1="22" y1="12" x2="42" y2="12" stroke="#8a5a14" stroke-width="2"/><path d="M14 34 H50 L48 40 H16 Z" fill="#f6cf6b" stroke="#8a5a14" ${S2}/><line x1="18" y1="28" x2="18" y2="34" stroke="#8a5a14" stroke-width="3"/><line x1="46" y1="28" x2="46" y2="34" stroke="#8a5a14" stroke-width="3"/><line x1="18" y1="40" x2="16" y2="60" stroke="#8a5a14" stroke-width="3"/><line x1="46" y1="40" x2="48" y2="60" stroke="#8a5a14" stroke-width="3"/>`,
    'ducha': `<path d="M14 6 H50 V58 H14 Z" fill="#d6f1fb" stroke="#4fa3c7" ${S2}/><line x1="32" y1="6" x2="32" y2="58" stroke="#4fa3c7" stroke-width="1.5"/><path d="M44 10 V16 H38" fill="none" stroke="#777" stroke-width="2.5"/><path d="M34 16 h8 l-2 3 h-4 z" fill="#777"/><path d="M35 22 l-2 30 M38 22 l0 30 M41 22 l2 30" stroke="#3aa0d8" stroke-width="1.5" stroke-dasharray="3 3"/>`,
    'mesilla': `<rect x="12" y="16" width="40" height="6" fill="#f08a2a" stroke="#8a4a14" ${S2}/><rect x="14" y="22" width="36" height="22" fill="#f6a24a" stroke="#8a4a14" ${S2}/><line x1="32" y1="22" x2="32" y2="34" stroke="#8a4a14" stroke-width="2"/><line x1="14" y1="34" x2="50" y2="34" stroke="#8a4a14" stroke-width="2"/><rect x="21" y="27" width="6" height="2" fill="#8a4a14"/><rect x="37" y="27" width="6" height="2" fill="#8a4a14"/><line x1="16" y1="44" x2="16" y2="56" stroke="#8a4a14" stroke-width="3"/><line x1="48" y1="44" x2="48" y2="56" stroke="#8a4a14" stroke-width="3"/>`,
    'lavadora': `<rect x="10" y="6" width="44" height="52" rx="3" fill="#f4f4f4" stroke="#555" ${S2}/><line x1="10" y1="16" x2="54" y2="16" stroke="#555" stroke-width="2"/><rect x="14" y="9" width="10" height="4" fill="#fff" stroke="#555"/><circle cx="47" cy="11" r="2.5" fill="none" stroke="#555"/><circle cx="32" cy="36" r="13" fill="#cfe8f3" stroke="#555" stroke-width="3"/><path d="M26 34 q6 -6 12 2" stroke="#4fa3c7" stroke-width="2" fill="none"/>`,
    'estantería': `<rect x="12" y="4" width="40" height="56" fill="#f2c96b" stroke="#8a5a14" ${S2}/><line x1="12" y1="22" x2="52" y2="22" stroke="#8a5a14" stroke-width="2"/><line x1="12" y1="40" x2="52" y2="40" stroke="#8a5a14" stroke-width="2"/><rect x="16" y="9" width="4" height="13" fill="#d33"/><rect x="21" y="11" width="4" height="11" fill="#36c"/><rect x="26" y="8" width="4" height="14" fill="#3a6"/><rect x="16" y="28" width="4" height="12" fill="#c90"/><rect x="21" y="27" width="4" height="13" fill="#a3c"/><rect x="38" y="44" width="4" height="16" fill="#36c"/>`
  };
  const icon = (k, cls) => `<svg class="ico ${cls || ''}" viewBox="0 0 64 64" aria-label="${esc(k)}">${ICON[k]}</svg>`;

  /* ---------- 그림 도구: 방 장면 (교재 사진 대신) ---------- */
  const E = (x, y, s, e) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`;
  const SCN = {
    estudio: `<rect width="220" height="108" fill="#f1e1c2"/><rect y="108" width="220" height="42" fill="#b07a4a"/>
      <rect x="14" y="12" width="70" height="96" fill="#7a4a26"/>${[30, 56, 82].map(y => `<rect x="18" y="${y - 14}" width="62" height="20" fill="#5a3418"/>${E(36, y, 18, '📚')}${E(62, y, 18, '📚')}`).join('')}
      <rect x="128" y="18" width="36" height="26" fill="#d9b25a" stroke="#6b4c3b" stroke-width="3"/>${E(146, 38, 16, '🖼️')}
      <rect x="112" y="86" width="96" height="7" fill="#6b3d1e"/><rect x="116" y="93" width="5" height="34" fill="#6b3d1e"/><rect x="199" y="93" width="5" height="34" fill="#6b3d1e"/>${E(150, 84, 18, '📜')}${E(98, 140, 38, '🪑')}`,
    banno: `<rect width="220" height="108" fill="#f5efe4"/><rect y="108" width="220" height="42" fill="#e3dccd"/>
      <rect x="128" y="10" width="76" height="62" fill="#dff1fa" stroke="#d9cbb0" stroke-width="3"/><path d="M128 10 q10 30 0 62 M204 10 q-10 30 0 62" fill="#fff" stroke="#e6dcc8" stroke-width="10"/>
      <ellipse cx="34" cy="40" rx="14" ry="20" fill="#cfe5ee" stroke="#c9a86a" stroke-width="3"/>
      <path d="M18 74 H50 Q48 86 34 86 Q20 86 18 74 Z" fill="#fff" stroke="#bbb" stroke-width="2"/><rect x="30" y="86" width="8" height="40" fill="#fff" stroke="#bbb" stroke-width="2"/>
      ${E(86, 132, 32, '🚽')}<path d="M118 104 H210 V116 Q210 136 190 136 H138 Q118 136 118 116 Z" fill="#fff" stroke="#bbb" stroke-width="2"/>${E(164, 112, 14, '🫧')}`,
    cocina: `<rect width="220" height="108" fill="#f4efe6"/><rect y="108" width="220" height="42" fill="#d8d4cc"/>
      <rect x="8" y="10" width="62" height="30" fill="#8b5a2b"/><rect x="150" y="10" width="62" height="30" fill="#8b5a2b"/><path d="M86 8 H134 L128 36 H92 Z" fill="#e6e6e6" stroke="#999" stroke-width="2"/>
      <rect x="4" y="72" width="212" height="8" fill="#8b5a2b"/><rect x="4" y="80" width="212" height="46" fill="#fff" stroke="#ccc"/>${[40, 90, 140, 190].map(x => `<line x1="${x}" y1="80" x2="${x}" y2="126" stroke="#ccc"/>`).join('')}
      ${E(108, 70, 22, '🍳')}${E(40, 70, 18, '🫖')}${E(176, 70, 18, '🥗')}`,
    dormitorio: `<rect width="220" height="108" fill="#505050"/><rect x="150" width="70" height="108" fill="#ece7df"/><rect y="108" width="220" height="42" fill="#d9d2c5"/>
      <rect x="54" y="18" width="50" height="16" fill="#fff" stroke="#c33" stroke-width="2"/>${E(79, 31, 11, '🌆')}
      <rect x="30" y="44" width="98" height="40" rx="4" fill="#eee" stroke="#bbb"/><rect x="24" y="80" width="112" height="34" rx="4" fill="#fafafa" stroke="#ccc"/><rect x="24" y="92" width="112" height="9" fill="#e8892c"/>
      <rect x="172" y="56" width="34" height="56" fill="#fff" stroke="#bbb"/>${[66, 78, 90, 102].map(y => `<line x1="172" y1="${y}" x2="206" y2="${y}" stroke="#bbb"/>`).join('')}${E(189, 52, 14, '🏺')}
      <ellipse cx="150" cy="136" rx="46" ry="9" fill="#b5652b"/>${E(150, 132, 14, '🍵')}${E(14, 74, 18, '💡')}`,
    salon: `<rect width="220" height="108" fill="#ece6dc"/><rect y="108" width="220" height="42" fill="#c9b79c"/>
      <rect x="150" y="14" width="40" height="28" fill="#fff" stroke="#c9a86a" stroke-width="3"/>${E(170, 34, 14, '🌿')}
      <path d="M24 20 Q20 4 40 4" fill="none" stroke="#333" stroke-width="2"/><line x1="24" y1="20" x2="24" y2="120" stroke="#333" stroke-width="2.5"/>${E(40, 14, 16, '💡')}
      <ellipse cx="110" cy="132" rx="96" ry="14" fill="#e07a5f"/><ellipse cx="110" cy="132" rx="70" ry="9" fill="#81b29a"/>
      <rect x="70" y="70" width="140" height="22" rx="6" fill="#fff" stroke="#ccc"/><rect x="66" y="88" width="148" height="20" rx="5" fill="#f7f7f7" stroke="#ccc"/><rect x="170" y="86" width="44" height="34" rx="5" fill="#f7f7f7" stroke="#ccc"/>
      ${E(100, 86, 16, '🟩')}${E(130, 86, 16, '🟩')}<ellipse cx="60" cy="122" rx="30" ry="7" fill="#d4a76a" stroke="#8b5a2b"/>${E(60, 120, 14, '📖')}`,
    comedor: `<rect width="220" height="108" fill="#f6e6c6"/><rect y="108" width="220" height="42" fill="#efe6d4"/>
      <rect x="8" y="58" width="60" height="50" fill="#5a3418"/><line x1="38" y1="58" x2="38" y2="108" stroke="#3b2210"/>
      <path d="M70 92 H210 L200 104 H80 Z" fill="#5a3418"/><rect x="86" y="104" width="6" height="34" fill="#5a3418"/><rect x="188" y="104" width="6" height="34" fill="#5a3418"/>
      ${[100, 130, 160, 190].map(x => `<rect x="${x - 9}" y="62" width="18" height="34" rx="2" fill="#4a2a12"/>`).join('')}${E(118, 96, 16, '🍽️')}${E(160, 96, 16, '🍷')}${E(140, 146, 30, '🪑')}`
  };
  const scene = (k, cls) => `<svg class="scn ${cls || ''}" viewBox="0 0 220 150">${SCN[k]}</svg>`;

  /* ---------- 집의 종류 (Antes de empezar) 그림 ---------- */
  const bld = (rows, cols, hi, extra) => {
    let g = `<rect x="18" y="8" width="64" height="80" fill="#e8d6b8" stroke="#8b6b4a" stroke-width="2"/>`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const on = hi.some(([a, b]) => a === r && b === c);
      g += `<rect x="${24 + c * (52 / cols)}" y="${14 + r * (66 / rows)}" width="${52 / cols - 5}" height="${66 / rows - 5}" fill="${on ? '#f26a21' : '#9fd3ea'}" stroke="${on ? '#a32638' : '#6aa'}" stroke-width="${on ? 2 : 1}"/>`;
    }
    return `<svg viewBox="0 0 100 92" class="tipo">${g}${extra || ''}<line x1="4" y1="88" x2="96" y2="88" stroke="#7a6f66" stroke-width="2"/></svg>`;
  };
  const TIPO = {
    piso: bld(5, 3, [[2, 0], [2, 1]]),
    apartamento: bld(5, 3, [[3, 2]]),
    estudio: `<svg viewBox="0 0 100 92" class="tipo"><rect x="8" y="10" width="84" height="76" fill="#fff6e6" stroke="#8b6b4a" stroke-width="2"/><rect x="14" y="56" width="34" height="18" rx="3" fill="#7cc7ea" stroke="#2b6c8a"/><rect x="14" y="50" width="8" height="24" fill="#f2c96b"/><rect x="58" y="44" width="30" height="30" fill="#ddd" stroke="#999"/><circle cx="66" cy="50" r="3" fill="#666"/><circle cx="78" cy="50" r="3" fill="#666"/><rect x="40" y="16" width="22" height="18" fill="#9fd3ea" stroke="#6aa"/><text x="50" y="84" font-size="7" text-anchor="middle" fill="#7a6f66">방 + 부엌 한 공간</text></svg>`,
    'ático': bld(5, 3, [[0, 0], [0, 1], [0, 2]], '<path d="M14 8 L50 0 L86 8" fill="none" stroke="#a32638" stroke-width="2"/>'),
    'chalé': `<svg viewBox="0 0 100 92" class="tipo"><rect x="0" y="70" width="100" height="18" fill="#7cc576"/><path d="M22 40 L50 16 L78 40 Z" fill="#c0503a"/><rect x="28" y="40" width="44" height="34" fill="#f3e3c3" stroke="#8b6b4a" stroke-width="2"/><rect x="45" y="54" width="10" height="20" fill="#8b5a2b"/><rect x="32" y="46" width="9" height="9" fill="#9fd3ea"/><rect x="59" y="46" width="9" height="9" fill="#9fd3ea"/><text x="12" y="80" font-size="14">🌳</text><text x="84" y="80" font-size="12">🌷</text><line x1="4" y1="88" x2="96" y2="88" stroke="#7a6f66" stroke-width="2"/></svg>`,
    'dúplex': bld(4, 2, [[1, 0], [2, 0]], '<line x1="24" y1="46" x2="45" y2="46" stroke="#fff" stroke-width="2" stroke-dasharray="2 2"/><text x="86" y="50" font-size="9" fill="#a32638">2층</text>')
  };

  /* Lección 05 · ¿Cómo es tu casa? — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vivienda 집·방 어휘',
      mue: 'Muebles 가구',
      pre: 'Preguntas 의문사',
      set: 'Ser·Estar·Tener',
      hay: 'Hay·Está',
      lug: 'Lugar 위치 표현',
      muy: 'Muy·Mucho',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '집의 종류', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '하숙집 방 둘러보기', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '방 이름 연결하기', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '가구 이름 16개', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '¿Qué hay en …?', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '사진 속 방 묘사하기', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: 'Vendo casa 광고', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'd2', label: 'Diálogo 2', kr: '민수의 집', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a6', label: 'Actividad 6', kr: '집 광고 3개 읽기', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: 'Alquilo — 진위 판단', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '두 방의 다른 점 찾기', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '이사 — 가구 배치 평면도', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '내 방 평면도 · 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    tipos: [
      { k: 'piso', kr: '여러 층 건물 안의, 방이 여러 개인 집 (아파트 한 세대)', def: 'una casa con más de una habitación, en un edificio de más de una planta de altura' },
      { k: 'apartamento', kr: '방이 하나뿐인 piso (중남미: departamento)', def: 'un piso con solo una habitación' },
      { k: 'estudio', kr: '독립된 방이 없는 집 (원룸)', def: 'una casa que no tiene habitación independiente' },
      { k: 'ático', kr: '건물의 맨 꼭대기 층', def: 'el último piso de un edificio' },
      { k: 'chalé', kr: '도시 주변 주택가의 작은 정원이 있는 단독주택', def: 'una casa independiente con un pequeño jardín en zonas residenciales alrededor de las ciudades' },
      { k: 'dúplex', kr: '두 층으로 된 집 (복층)', def: 'una vivienda que tiene dos pisos' }
    ],

    dialogo1: [
      { who: 'S', es: 'Mira. Esta es tu habitación. Es pequeña, pero es agradable. [Tiene mucha luz]. [Hay] una cama, un armario y un escritorio.' },
      { who: 'C', es: '¡Es bonita! ¿[Dónde está] el cuarto de baño?' },
      { who: 'S', es: 'El baño está [a la izquierda] de tu habitación y la cocina está [al fondo].' },
      { who: 'C', es: 'Muy bien, señora.' },
      { who: 'C', es: 'Una pregunta. ¿Hay una lavadora en la cocina?' },
      { who: 'S', es: '[Claro que sí]. Hay una lavadora, [un frigorífico], una cocina de gas y un horno microondas.' },
      { who: 'C', es: '¡Qué bien! Muchas gracias, señora. Es usted [muy amable].' },
      { who: 'S', es: '[De nada].' }
    ],

    dialogo2: [
      { who: 'Ana', es: '¿[Cómo es] tu casa, Minsu?' },
      { who: 'Minsu', es: 'Es un piso pequeño, pero es nuevo, moderno y [muy] bonito. Es muy luminoso.' },
      { who: 'Ana', es: '¿[Cuántas] habitaciones tiene?' },
      { who: 'Minsu', es: 'Tres habitaciones. También tiene un salón, una cocina y [un cuarto de baño].' },
      { who: 'Ana', es: '¿[Tiene] balcón y garaje?' },
      { who: 'Minsu', es: 'Sí, tiene un balcón pequeño, pero no tiene garaje.' },
      { who: 'Ana', es: '¿[Está] cerca de la escuela?' },
      { who: 'Minsu', es: 'No, está un poco lejos, a [unos] treinta minutos [a pie].' }
    ],

    /* Actividad 9 — TRANSCRIPCIONES (A = Julio, B = Marta) */
    dialogo9: [
      { who: 'Julio', es: 'Marta, aquí están los muebles. ¿Dónde los ponemos?' },
      { who: 'Marta', es: 'A ver… la mesa con las tres sillas, en la cocina, al lado de la puerta (a la derecha). El sofá y los sillones, en el salón. El sofá, al fondo, pegado a la pared y los sillones a la izquierda del sofá, debajo de la ventana.' },
      { who: 'Julio', es: '¿Y la estantería?' },
      { who: 'Marta', es: 'En el salón también, en frente de la ventana.' },
      { who: 'Julio', es: 'Y la lavadora, ¿la ponemos en la cocina?' },
      { who: 'Marta', es: '¡Sí, claro!, al lado del fregadero.' },
      { who: 'Julio', es: 'Vale. ¿Y qué hacemos con las camas?' },
      { who: 'Marta', es: 'La cama de matrimonio, en el dormitorio grande, al fondo del pasillo a la derecha. La cama pequeña, en la habitación de al lado, en frente del salón. ¡Ah! y los cuadros…' },
      { who: 'Julio', es: 'Bueno, bueno… colocamos esto primero y luego seguimos.' }
    ],

    habitaciones: [
      { k: 'estudio', es: 'cuarto de estudio', art: 'el', kr: '서재 · 공부방' },
      { k: 'banno', es: 'cuarto de baño', art: 'el', kr: '욕실 · 화장실' },
      { k: 'cocina', es: 'cocina', art: 'la', kr: '부엌' },
      { k: 'dormitorio', es: 'dormitorio', art: 'el', kr: '침실' },
      { k: 'salon', es: 'salón', art: 'el', kr: '거실' },
      { k: 'comedor', es: 'comedor', art: 'el', kr: '식당 · 다이닝룸' }
    ],

    /* Actividad 2 — 교재 그림 순서 = SOLUCIONES */
    muebles: [['frigorífico', 'el', '냉장고'], ['bañera', 'la', '욕조'], ['sofá', 'el', '소파'], ['lavabo', 'el', '세면대'], ['cuadro', 'el', '그림 액자'], ['televisión', 'la', '텔레비전'],
      ['escritorio', 'el', '책상'], ['ordenador', 'el', '컴퓨터'], ['cocina de gas', 'la', '가스레인지'], ['armario', 'el', '옷장 · 장'], ['lámpara', 'la', '램프 · 스탠드'], ['cama', 'la', '침대'],
      ['silla', 'la', '의자'], ['ducha', 'la', '샤워기 · 샤워실'], ['mesilla', 'la', '침대 옆 협탁'], ['lavadora', 'la', '세탁기']],

    utiles: [
      ['¿Cómo es tu casa?', '너희 집은 어때?'],
      ['Antigua y bastante grande.', '오래됐고 꽤 커.'],
      ['¿Cuántas habitaciones tiene?', '방이 몇 개야?'],
      ['Cuatro.', '네 개.'],
      ['¿Está bien comunicada?', '교통이 편리해?'],
      ['Sí.', '응.'],
      ['¿Qué tipo de casa es?', '어떤 종류의 집이야?'],
      ['Es un piso.', '아파트(piso)야.'],
      ['¿Qué hay en las habitaciones?', '방에는 뭐가 있어?'],
      ['Hay una cama, un escritorio, un armario, una mesilla y una silla.', '침대, 책상, 옷장, 협탁, 의자가 있어.'],
      ['¿Dónde está el sofá?', '소파는 어디 있어?'],
      ['Está en frente de la ventana.', '창문 맞은편에 있어.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '¿____ es tu casa? — Es grande y moderna.', a: ['Cómo'], s: 'pre' },
      { p: '¿____ habitaciones tiene tu piso? — Tres.', a: ['Cuántas'], s: 'pre' },
      { p: '¿____ está el cuarto de baño? — Al fondo.', a: ['Dónde'], s: 'pre' },
      { p: '¿____ tipo de casa es? — Es un piso.', a: ['Qué'], s: 'pre' },
      { p: 'Mi casa ____ muy luminosa. <i>(ser)</i>', a: ['es'], s: 'set' },
      { p: 'El baño ____ a la izquierda de tu habitación. <i>(estar)</i>', a: ['está'], s: 'set' },
      { p: 'Mi piso ____ tres habitaciones y un balcón. <i>(tener)</i>', a: ['tiene'], s: 'set' },
      { p: 'En el salón ____ un sofá y dos sillones. <i>(있다)</i>', a: ['hay'], s: 'hay' },
      { p: 'Las camas ____ en el dormitorio. <i>(estar)</i>', a: ['están'], s: 'hay' },
      { p: 'La cocina es ____ bonita. <i>(아주)</i>', a: ['muy'], s: 'muy' },
      { p: 'Mi habitación tiene ____ luz. <i>(많은)</i>', a: ['mucha'], s: 'muy' },
      { p: 'En mi casa hay ____ ventanas. <i>(많은)</i>', a: ['muchas'], s: 'muy' },
      { p: 'Los sillones están a la izquierda ____ sofá. <i>(de + el)</i>', a: ['del'], s: 'lug' },
      { p: 'La cocina está al ____. <i>(안쪽 끝에)</i>', a: ['fondo'], s: 'lug' },
      { p: 'Está cerca ____ una parada de autobús.', a: ['de'], s: 'lug' },
      { p: 'Está un poco lejos, a treinta minutos ____ pie.', a: ['a'], s: 'lug' },
      { p: 'Mi casa es pequeña, pero es ____. <i>(nuevo)</i>', a: ['nueva'], s: 'set' },
      { p: 'Los dormitorios son ____. <i>(grande)</i>', a: ['grandes'], s: 'set' },
      { p: 'Un ____ es el último piso de un edificio.', a: ['ático'], s: 'voc' },
      { p: 'A: Muchas gracias, señora. — B: De ____.', a: ['nada'], s: 'voc' }
    ]
  };

  const MUE = Object.fromEntries(D.muebles.map(([w, a, k]) => [w, { a, k }]));
  const art = w => (MUE[w] ? MUE[w].a : 'el');
  const un = w => (art(w) === 'la' ? 'una ' : 'un ') + w;
  /* "Está X." → ["Está X.", "El gato está X."] */
  const withSub = (sub, arr) => arr.flatMap(a => [a, sub + ' ' + a.charAt(0).toLowerCase() + a.slice(1)]);
  const FURN = '(cama|camas|armario|escritorio|silla|sillas|mesilla|l[aá]mpara|sof[aá]|sill[oó]n|sillones|televisi[oó]n|tele|ordenador|estanter[ií]a|cuadro|cuadros|espejo|ventana|mesa|ducha|ba[nñ]era|lavabo|v[aá]ter|inodoro|frigor[ií]fico|nevera|lavadora|cocina de gas|horno|microondas|alfombra|c[oó]moda|fregadero|piano|planta|cortinas?)';
  const blurBtn = (s, btnSel, boxSel, on, off) => { $(btnSel, s).onclick = e => { const t = $(boxSel, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? on : off; }; };
  const B = {};

  /* =================== Antes de empezar =================== */
  B.vocab = () => {
    const lead = 'En España y América Latina hay muchos tipos de viviendas, dependiendo del número de habitaciones y la ubicación. Existen, por ejemplo, pisos, apartamentos, estudios, áticos, chalés, rascacielos, etc.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${lead} ${say(lead)}</p>
      <div class="card tipos-def"><b>Tipos de viviendas:</b><ul>${D.tipos.map(t => `<li><b>${t.k[0].toUpperCase() + t.k.slice(1)}:</b> ${t.def}${t.k === 'apartamento' ? ' (en muchos países latinoamericanos, los pisos se llaman departamentos o apartamentos)' : ''} ${say(t.k + ': ' + t.def)}</li>`).join('')}</ul></div>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요 <span class="small">(주황색 = 그 집)</span></h3><div class="fg"></div>
      <h3 class="h3">② 설명과 집의 종류를 연결하세요</h3><div class="pm1"></div>
      <h3 class="h3">③ 쓰기 연습 — 설명을 읽고 집의 종류를 스페인어로 쓰세요</h3><div class="items two w"></div>
      <h3 class="h3">④ 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>`);
    put(s, '.fg', flipGrid(D.tipos.map(t => ({ e: TIPO[t.k], es: t.k, kr: t.kr }))));
    put(s, '.pm1', pairMatch({ id: 'voc-pm', sec: 'vocab', skill: 'voc', pairs: D.tipos.map(t => [t.def, `<b>${t.k}</b>`]) }));
    D.tipos.forEach((t, i) => put(s, '.w', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="small">${t.kr}</span>`, ph: 'un … / una …',
      answers: [t.k, 'un ' + t.k, 'Es un ' + t.k + '.'] })));
    [['En muchos países latinoamericanos, los pisos se llaman departamentos.', 'Verdadero'], ['Un ático es el primer piso de un edificio.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'voc-vf' + i, sec: 'vocab', skill: 'voc', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
  };

  /* =================== Gramática =================== */
  B.gram = () => {
    const cat = (cx, cy, behind) => `<svg viewBox="0 0 120 90" class="mini">${behind ? E(cx, cy, 22, '🐈') : ''}<rect x="0" y="62" width="120" height="28" fill="#e9dcc0"/>
      <rect x="40" y="46" width="44" height="6" fill="#a0602a"/><rect x="43" y="52" width="4" height="26" fill="#a0602a"/><rect x="77" y="52" width="4" height="26" fill="#a0602a"/>${behind ? '' : E(cx, cy, 22, '🐈')}</svg>`;
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 의문사 ¿Cómo? — "어때?" (모양 · 특징)</h3>
        <table class="dt"><tr><th>질문</th><th>대답</th><th>뜻</th></tr>
          <tr><td><b>¿Cómo</b> es tu casa? ${say('¿Cómo es tu casa?')}</td><td>Es pequeña, pero es nueva.</td><td>집이 어때? (특징 → ser)</td></tr>
          <tr><td><b>¿Cuántas</b> habitaciones tiene? ${say('¿Cuántas habitaciones tiene?')}</td><td>Tiene tres habitaciones.</td><td>방이 몇 개? (개수 → tener)</td></tr>
          <tr><td><b>¿Dónde</b> está el baño? ${say('¿Dónde está el baño?')}</td><td>Está a la izquierda.</td><td>어디 있어? (위치 → estar)</td></tr>
          <tr><td><b>¿Qué</b> hay en la cocina? ${say('¿Qué hay en la cocina?')}</td><td>Hay una lavadora.</td><td>뭐가 있어? (존재 → hay)</td></tr>
          <tr><td><b>¿Qué</b> tipo de casa es?</td><td>Es un piso.</td><td>어떤 종류의 집?</td></tr></table>
        ${tip('의문사에는 항상 악센트! <b>cómo · dónde · qué · cuántos/cuántas</b> — 그리고 앞에 <b>¿</b> 를 꼭 쓰세요. habitaciones(여성 복수) → <b>¿Cuántas</b>, dormitorios(남성 복수) → <b>¿Cuántos</b>')}
        <div class="g1a"></div><div class="items g1b"></div></div>
      <div class="gcard"><h3>2. muy 와 mucho — "아주" vs "많은"</h3>
        <div class="blocks"><span class="bk v">muy</span><span class="bk s">+ 형용사 / 부사</span><span class="small">Es <b>muy</b> bonita. · Está <b>muy</b> lejos.</span></div>
        <div class="blocks"><span class="bk o">mucho · mucha · muchos · muchas</span><span class="bk s">+ 명사 (성·수 일치)</span><span class="small">Tiene <b>mucha</b> luz. · Hay <b>muchos</b> muebles.</span></div>
        <div class="blocks"><span class="bk p">동사 + mucho</span><span class="small">(형태 변화 없음) Me gusta <b>mucho</b>. · Trabajo <b>mucho</b>.</span></div>
        ${tip('<b>muy mucho</b> ✕ · <b>mucho grande</b> ✕ · <b>muy luz</b> ✕ — luz(f.) → <b>mucha</b> luz')}
        <div class="g2"></div></div>
      <div class="gcard"><h3>3. ser · estar · tener · hay — 집을 설명하는 네 동사</h3>
        <table class="dt verbs"><tr><th>동사</th><th>쓰임</th><th>예문</th></tr>
          <tr><td><b class="vb ser">ser</b></td><td>특징 · 종류 (어떤 집?)</td><td><b>Es</b> un piso. <b>Es</b> nueva y muy luminosa.</td></tr>
          <tr><td><b class="vb est">estar</b></td><td>위치 · 상태 (어디에?)</td><td><b>Está</b> en la calle Granada. <b>Está</b> bien comunicada.</td></tr>
          <tr><td><b class="vb ten">tener</b></td><td>집이 가진 것 (몇 개?)</td><td><b>Tiene</b> cuatro dormitorios y dos baños.</td></tr>
          <tr><td><b class="vb hay">hay</b></td><td>~이(가) 있다 (존재)</td><td>En la cocina <b>hay</b> una lavadora.</td></tr></table>
        <div class="g3"></div></div>
      <div class="gcard"><h3>4. Hay vs. Está — 있다? 어디 있다?</h3>
        <div class="blocks"><span class="bk o">Hay</span><span class="bk s">un / una / dos … + 명사</span><span class="small">처음 소개하는 것 · 불특정 (무엇이 있는지)</span></div>
        <div class="blocks"><span class="bk s">El / La + 명사</span><span class="bk v">está(n)</span><span class="bk p">+ 장소</span><span class="small">이미 아는 것 · 특정 (어디 있는지)</span></div>
        ${tip('<b>Hay la cama</b> ✕ → <b>Hay una cama</b> en el dormitorio. / <b>La cama está</b> en el dormitorio. · 복수: Las sillas <b>están</b> en la cocina.')}
        <div class="items g4"></div></div>
      <div class="gcard"><h3>5. 위치 표현 (¿Dónde está?)</h3>
        <div class="chips loc">${['a la izquierda de', 'a la derecha de', 'al lado de', 'en frente de', 'al fondo (de)', 'encima de', 'debajo de', 'detrás de', 'cerca de', 'lejos de', 'pegado a la pared'].map((x, i) => `<span class="hlc c${i % 3}">${x}</span>`).join('')}</div>
        ${tip('<b>de + el = del</b>, <b>a + el = al</b> : a la izquierda <b>del</b> sofá · <b>al</b> lado <b>del</b> fregadero / de + la = de la (그대로)')}
        <div class="g5"></div></div>
      <div class="gcard"><h3>6. 형용사의 성 · 수 일치</h3>
        <div class="blocks"><span class="bk s">un piso</span><span class="bk v">pequeño</span><span class="bk s">una casa</span><span class="bk v">pequeña</span><span class="bk s">dos baños</span><span class="bk v">grandes</span></div>
        ${tip('-o 형용사는 4가지 형태(nuevo, nueva, nuevos, nuevas), -e · 자음 형용사는 2가지(grande/grandes, exterior/exteriores).')}
        <div class="g6"></div></div>`);
    put(s, '.g1a', cloze({ id: 'g1a', sec: 'gram', skill: 'pre', title: '알맞은 의문사를 쓰세요. (cómo · dónde · qué · cuántas · cuántos)', cls: 'lines', text:
      ['¿[Cómo] es tu habitación? — Es pequeña, pero es agradable.', '¿[Dónde] está la cocina? — Está al fondo.', '¿[Cuántas] habitaciones tiene tu piso? — Tres.',
        '¿[Qué] hay en el salón? — Hay un sofá y una televisión.', '¿[Cuántos] baños tiene la casa? — Dos.'].map(x => `<p>${x}</p>`).join('') }));
    [['Es grande y moderna.', 'tu casa', ['¿Cómo es tu casa?']], ['Tiene tres habitaciones.', 'tu piso', ['¿Cuántas habitaciones tiene tu piso?', '¿Cuántas habitaciones tiene?']],
      ['Está cerca de la escuela.', 'tu casa', ['¿Dónde está tu casa?']]].forEach(([a, h, q], i) =>
      put(s, '.g1b', writeItem({ id: 'g1b-' + i, sec: 'gram', skill: 'pre', prompt: `대답: <b>${a}</b> → 질문을 쓰세요 <span class="small">(${h})</span>`, ph: '¿…?', answers: q })));
    put(s, '.g2', cloze({ id: 'g2', sec: 'gram', skill: 'muy', title: 'muy / mucho / mucha / muchos / muchas 중 알맞은 것을 쓰세요.', cls: 'lines', text:
      ['Mi habitación es [muy] bonita.', 'Tiene [mucha] luz.', 'En el salón hay [muchos] muebles.', 'La casa tiene [muchas] ventanas.', 'Mi casa está [muy] lejos de la escuela.', 'Me gusta [mucho] mi dormitorio.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g3', cloze({ id: 'g3', sec: 'gram', skill: 'set', title: 'es · está · tiene · hay 중 하나를 쓰세요.', cls: 'lines', text:
      ['Mi casa [es] un piso nuevo.', '[Está] en la calle Mayor, cerca del metro.', '[Tiene] tres dormitorios y un baño.', 'El salón [es] grande y luminoso.',
        'En el salón [hay] un sofá y una televisión.', 'La cocina [está] al fondo.'].map(x => `<p>${x}</p>`).join('') }));
    [['una cama · el dormitorio', ['Hay una cama en el dormitorio.', 'En el dormitorio hay una cama.']], ['la cama · a la izquierda', ['La cama está a la izquierda.']],
      ['dos sillas · la cocina', ['Hay dos sillas en la cocina.', 'En la cocina hay dos sillas.']], ['las sillas · al lado de la mesa', ['Las sillas están al lado de la mesa.']]]
      .forEach(([w, a], i) => put(s, '.g4', writeItem({ id: 'g4-' + i, sec: 'gram', skill: 'hay', prompt: `<span class="chip">${w}</span> <span class="small">→ hay 또는 está(n) 문장</span>`, answers: a })));
    put(s, '.g5', matchPics({ id: 'g5', sec: 'gram', skill: 'lug', cols: 5, title: '고양이는 어디 있나요? 표현을 누르고 그림을 누르세요.', items: [
      { e: cat(62, 44), es: 'encima de la mesa' }, { e: cat(62, 78), es: 'debajo de la mesa' }, { e: cat(20, 80), es: 'a la izquierda de la mesa' },
      { e: cat(104, 80), es: 'a la derecha de la mesa' }, { e: cat(62, 44, true), es: 'detrás de la mesa' }] }));
    put(s, '.g6', cloze({ id: 'g6', sec: 'gram', skill: 'set', title: '괄호 안 형용사를 알맞게 바꾸세요.', cls: 'lines', text:
      ['Mi casa es [pequeña]. <i>(pequeño)</i>', 'Es un piso [moderno]. <i>(moderno)</i>', 'Los dormitorios son [luminosos]. <i>(luminoso)</i>'].map(x => `<p>${x}</p>`).join('') }));
  };

  /* =================== Diálogo 1 =================== */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'La dueña de una casa muestra una habitación a un chico coreano.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">Es muy luminosa</span><span class="hlc c1">Cómo no</span><span class="hlc c2">una nevera</span><span class="hlc c0">No hay de qué</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blurBtn(s, '#hide1', '#d1txt', '본문 보기', '본문 가리기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'hay', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['La habitación es grande.', 'Falso'], ['El baño está a la izquierda de la habitación.', 'Verdadero'], ['En la cocina no hay lavadora.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'hay', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['Es pequeña, pero es agradable. <u>Tiene mucha luz.</u>', 'Es muy luminosa', ['Es pequeña, pero es agradable. Es muy luminosa.', 'Es muy luminosa.']],
      ['¿Hay una lavadora en la cocina? — <u>Claro que sí.</u>', 'Cómo no', ['Cómo no.', '¡Cómo no!']],
      ['Hay una lavadora, <u>un frigorífico</u> y una cocina de gas.', 'una nevera', ['Hay una lavadora, una nevera y una cocina de gas.']],
      ['Muchas gracias, señora. — <u>De nada.</u>', 'No hay de qué', ['No hay de qué.']]]
      .forEach(([p, k, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: i === 0 ? 'muy' : 'voc', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '집주인이 되어 손님에게 내 방을 보여 주는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: Mira. Esta es tu habitación. Es …\nB: ¡Es bonita! ¿Dónde está …?',
      must: [{ re: W0 + 'es (muy |bastante |un poco )?(peque[nñ]a|grande|agradable|bonita|luminosa|nueva|moderna|c[oó]moda)' + W1, label: 'Es + 형용사 (방의 특징)' },
        { re: W0 + 'hay' + W1, label: 'Hay + 가구' }, { re: '¿\\s*d[oó]nde est[aá]', label: '¿Dónde está …?' },
        { re: W0 + 'est[aá] (a la (izquierda|derecha)|al fondo|al lado|en frente|enfrente|cerca|lejos)', label: 'está + 위치 표현' },
        { re: '(gracias|de nada|no hay de qu[eé])', label: '감사 · 대답 (Gracias / De nada)' }],
      model: 'A: Mira. Esta es tu habitación. Es pequeña, pero es muy luminosa. Hay una cama, una mesilla y un armario. B: ¡Es bonita! ¿Dónde está la cocina? A: Está al fondo, a la derecha. B: Muchas gracias. A: No hay de qué.' }));
  };

  /* =================== Actividad 1 =================== */
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Relaciona las fotos con los nombres de habitaciones.', { kr: '교재 사진 대신 그림으로 재현했어요. 그림(왼쪽)을 누른 뒤 방 이름(오른쪽)을 누르세요.' })}
      <div class="pm"></div>
      <h3 class="h3">🏠 우리 집 단면도 — 각 방의 이름을 관사와 함께 쓰세요 <span class="small">(el salón, la cocina …)</span></h3>
      <div class="casa"><div class="roof"></div><div class="floors"></div><div class="ground"></div></div>`);
    const order = [['estudio', 'c'], ['banno', 'f'], ['cocina', 'e'], ['dormitorio', 'b'], ['salon', 'a'], ['comedor', 'd']];
    const H = Object.fromEntries(D.habitaciones.map(h => [h.k, h]));
    put(s, '.pm', pairMatch({ id: 'a1-pm', sec: 'a1', skill: 'voc', pairs: order.map(([k]) => [scene(k, 'sm'), `<b>${H[k].es}</b>`]) }));
    const CASA = [['dormitorio', '🛏️🪟'], ['banno', '🛁🚽'], ['estudio', '📚💻'], ['salon', '🛋️📺'], ['comedor', '🍽️🪑'], ['cocina', '🍳🧺']];
    const fl = $('.floors', s);
    CASA.forEach(([k, e], i) => {
      const h = H[k];
      const cell = el(`<div class="room r${i}"><span class="re">${e}</span></div>`);
      cell.appendChild(writeItem({ id: 'a1-c' + i, sec: 'a1', skill: 'voc', ph: '¿…?', answers: [`${h.art} ${h.es}`, h.es, (h.art === 'la' ? 'una ' : 'un ') + h.es, k === 'banno' ? 'el baño' : `Es ${h.art} ${h.es}.`] }));
      fl.appendChild(cell);
    });
  };

  /* =================== Actividad 2 =================== */
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Relaciona la palabra con el objeto.', { kr: '단어 상자의 낱말을 누른 뒤 알맞은 그림을 누르세요.' })}
      <div class="mp2"></div>
      <h3 class="h3">✍️ 관사와 함께 쓰기 — 그림을 보고 <b>un / una + 가구</b>를 쓰세요</h3><div class="items two w2"></div>`);
    put(s, '.mp2', matchPics({ id: 'a2-m', sec: 'a2', skill: 'mue', cols: 4, items: D.muebles.map(([w]) => ({ e: icon(w), es: w })) }));
    ['sofá', 'lámpara', 'ducha', 'ordenador'].forEach((w, i) =>
      put(s, '.w2', writeItem({ id: 'a2-w' + i, sec: 'a2', skill: 'mue', prompt: `<span class="ico-sm">${icon(w)}</span> <span class="small">${MUE[w].k}</span>`, ph: 'un … / una …', answers: [un(w), `Es ${un(w)}.`, `Hay ${un(w)}.`] })));
  };

  /* =================== Actividad 3 =================== */
  B.a3 = () => {
    const Q = [['¿Qué hay en el cuarto de baño?', '(ducha|ba[nñ]era|lavabo|espejo|v[aá]ter|inodoro|lavadora|toallas?|ventana)'], ['¿Qué hay en el salón?', '(sof[aá]|sill[oó]n|sillones|televisi[oó]n|tele|l[aá]mpara|cuadros?|mesa|estanter[ií]a|alfombra|piano|plantas?|ventanas?)'],
      ['¿Qué hay en tu dormitorio?', '(cama|armario|mesilla|escritorio|silla|l[aá]mpara|ordenador|estanter[ií]a|cuadros?|televisi[oó]n|espejo|ventanas?)'], ['¿Qué hay en la cocina?', '(frigor[ií]fico|nevera|cocina de gas|lavadora|horno|microondas|mesa|sillas?|fregadero|lavavajillas)'],
      ['¿Hay un cuarto de estudio? ¿Qué hay en el cuarto de estudio?', '(escritorio|ordenador|silla|l[aá]mpara|estanter[ií]a|libros?|cuadros?|mesa|sill[oó]n)']];
    const s = sec('a3', `${actHead(3, 'Usando las palabras del recuadro de la Actividad 2, cuenta a tus compañeros qué hay en cada lugar de tu casa.', { kr: '말하기 활동 → ① 가구를 방별로 분류하고 ② 우리 집 이야기를 써요.' })}
      <div class="sb3"></div>
      ${modelo('A: ¿Qué hay en el cuarto de baño?<br>B: Hay una ducha, un lavabo y una lavadora.')}
      ${tip('여러 개를 나열할 때: A, B <b>y</b> C. 처음 말하는 물건에는 <b>un / una</b>. 없으면 <b>No hay</b> cuarto de estudio.')}
      <h3 class="h3">✍️ 우리 집 이야기 — 질문에 Hay … 로 답하세요</h3><div class="items f3"></div>`);
    put(s, '.sb3', sortBoard({ id: 'a3-sb', sec: 'a3', skill: 'mue', title: '가구를 알맞은 방에 넣으세요.',
      cols: [{ k: 'b', label: '🛁 cuarto de baño' }, { k: 's', label: '🛋️ salón' }, { k: 'd', label: '🛏️ dormitorio' }, { k: 'c', label: '🍳 cocina' }, { k: 'e', label: '📚 cuarto de estudio' }],
      chips: [['ducha', 'b'], ['bañera', 'b'], ['lavabo', 'b'], ['sofá', 's'], ['televisión', 's'], ['cama', 'd'], ['mesilla', 'd'], ['frigorífico', 'c'], ['cocina de gas', 'c'], ['escritorio', 'e'], ['ordenador', 'e']] }));
    Q.forEach(([q, f], i) => put(s, '.f3', freeItem({ id: 'a3-' + i, sec: 'a3', skill: i === 4 ? 'hay' : 'mue', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, ph: i === 4 ? 'Sí, hay un cuarto de estudio. Hay … / No, no hay …' : 'Hay un …, una … y …',
      must: i === 4 ? [{ re: W0 + '(s[ií]|no),? (no )?hay' + W1, label: 'Sí, hay … / No, no hay …' }, { re: f, label: '공부방 물건 1개 이상 (없으면 아무 가구나)' }]
        : [{ re: W0 + 'hay' + W1, label: 'Hay …' }, { re: W0 + f + W1, label: '그 방에 어울리는 가구 2개 이상', min: 2 }, { re: W0 + '(un|una|dos|tres|unos|unas)' + W1, label: 'un / una (부정관사)' }] })));
  };

  /* =================== Actividad 4 =================== */
  B.a4 = () => {
    const P = [
      { k: 'salon', r: 'el salón', yes: ['un sofá', 'una lámpara', 'una alfombra', 'una mesa'], no: ['una cama', 'una bañera'] },
      { k: 'banno', r: 'el cuarto de baño', yes: ['un espejo', 'un lavabo', 'una bañera', 'una ventana'], no: ['un sofá', 'un frigorífico'] },
      { k: 'dormitorio', r: 'el dormitorio', yes: ['una cama', 'un cuadro', 'una cómoda', 'una alfombra'], no: ['una ducha', 'una cocina de gas'] }];
    const s = sec('a4', `${actHead(4, 'Elige una foto y descríbela a tus compañeros.', { kr: '교재 사진을 그림으로 재현했어요. 그림 속 물건을 고르고, 묘사하는 글을 써요.' })}
      ${modelo('A: ¿Qué hay en el cuarto de baño?<br>B: Hay un espejo, una ventana, un lavabo y una bañera.')}
      <div class="ph4"></div>`);
    const st = sel('a4');
    P.forEach((p, n) => {
      reg('a4-k' + n, 'a4', 'mue');
      const opts = shuffle([...p.yes, ...p.no]);
      const box = el(`<div class="card ph"><div class="ph-row"><div class="ph-img"><b>${n + 1})</b>${scene(p.k)}</div>
        <div class="ph-q"><div class="item-p">① 그림 속에 <b>있는</b> 것을 모두 고르세요.</div><div class="chips pk">${opts.map(o => `<button class="wchip" data-o="${esc(o)}">${o}</button>`).join('')}</div>
        <div class="item-row"><button class="btn chk k">확인</button><span class="mkbox"></span></div></div></div><div class="ws"></div></div>`);
      const cur = () => (st[n] = st[n] || []);
      const paint = () => $$('.pk .wchip', box).forEach(b => b.classList.toggle('lk', cur().includes(b.dataset.o)));
      $$('.pk .wchip', box).forEach(b => b.onclick = () => { const a = cur(), o = b.dataset.o; a.includes(o) ? a.splice(a.indexOf(o), 1) : a.push(o); save(); paint(); });
      $('.k', box).onclick = () => {
        const a = cur(); let ok = 0;
        opts.forEach(o => { const good = p.yes.includes(o) === a.includes(o); if (good) ok++; });
        const sc = Math.round(ok / opts.length * 100) / 100;
        record('a4-k' + n, sc, sc >= 1 ? [] : ['otro'], {});
        $$('.pk .wchip', box).forEach(b => { b.classList.remove('ok', 'no'); b.classList.add(p.yes.includes(b.dataset.o) ? 'ok' : 'no'); });
        $('.mkbox', box).innerHTML = MARK(sc) + ` <span class="small">${ok} / ${opts.length}</span>`;
      };
      paint();
      const ws = $('.ws', box);
      ws.appendChild(writeItem({ id: 'a4-q' + n, sec: 'a4', skill: 'pre', prompt: `② 이 방에 대해 묻는 질문을 쓰세요. <span class="small">(${p.r} 에 무엇이 있니?)</span>`, ph: '¿Qué hay …?', answers: [`¿Qué hay en ${p.r}?`] }));
      const nouns = p.yes.map(y => y.split(' ').slice(1).join(' '));
      ws.appendChild(freeItem({ id: 'a4-f' + n, sec: 'a4', skill: 'hay', line: true, prompt: '③ 대답: 그림 속 물건 3개 이상을 넣어 쓰세요.', ph: 'Hay un …, una … y …',
        must: [{ re: W0 + 'hay' + W1, label: 'Hay …' }, { re: W0 + '(' + nouns.map(acc).join('|') + ')' + W1, label: `그림 속 물건 3개 이상 (${nouns.join(', ')})`, min: 3 }, { re: W0 + 'y' + W1, label: '… y … (나열)' }] }));
      put(s, '.ph4', box);
    });
  };

  /* =================== Actividad 5 =================== */
  const AD5 = 'Vendo Casa. Calle Granada, nueva, dos plantas, cuatro dormitorios, dos baños, salón cómodo, cocina, patio y garaje. Calefacción y aire acondicionado. Muy iluminada. Bien comunicada. Cerca de una parada de autobús. Bien de precio. Tel: 952 88 24 32';
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Lee este anuncio y dale la información sobre esta casa a tu compañero. Utiliza los verbos <i>estar, ser</i> y <i>tener</i>.')}
      <div class="ad-wrap"><div class="ad-note"><span class="pin"></span><h4>Vendo Casa</h4>
        <p>Calle Granada, nueva, dos plantas, cuatro dormitorios, dos baños, salón cómodo, cocina, patio y garaje. Calefacción y aire acondicionado. Muy iluminada. Bien comunicada. Cerca de una parada de autobús. Bien de precio.</p><p>Tel: 952 88 24 32</p></div>
        <div class="ad-side">${say(AD5)} <span class="small">광고 듣기</span>${tip('<b>vendo</b> 팝니다 · <b>planta</b> 층 · <b>patio</b> 마당 · <b>calefacción</b> 난방 · <b>aire acondicionado</b> 에어컨 · <b>bien comunicada</b> 교통이 편리한 · <b>bien de precio</b> 가격이 적당한')}</div></div>
      ${modelo('Está en la calle Granada. Es nueva. Tiene dos baños y cuatro dormitorios…')}
      <div class="sb5"></div>
      <h3 class="h3">✍️ 친구의 질문에 답하세요 (광고를 보고)</h3><div class="items two w5"></div>
      <h3 class="h3">✍️ 광고 전체를 문장으로 소개하기</h3><div class="f5"></div>`);
    put(s, '.sb5', sortBoard({ id: 'a5-sb', sec: 'a5', skill: 'set', title: '광고의 각 정보에 어울리는 동사는? (Es … / Está … / Tiene …)',
      cols: [{ k: 'ser', label: '<b class="vb ser">Es</b> …' }, { k: 'estar', label: '<b class="vb est">Está</b> …' }, { k: 'tener', label: '<b class="vb ten">Tiene</b> …' }],
      chips: [['nueva', 'ser'], ['muy luminosa', 'ser'], ['en la calle Granada', 'estar'], ['bien comunicada', 'estar'], ['cerca de una parada de autobús', 'estar'],
        ['dos plantas', 'tener'], ['cuatro dormitorios', 'tener'], ['patio y garaje', 'tener'], ['calefacción y aire acondicionado', 'tener']] }));
    [['¿Dónde está la casa?', ['Está en la calle Granada.', 'La casa está en la calle Granada.']], ['¿Es nueva o antigua?', ['Es nueva.', 'La casa es nueva.']],
      ['¿Cuántos dormitorios y baños tiene?', ['Tiene cuatro dormitorios y dos baños.']],
      ['¿Cómo es el salón?', ['Es cómodo.', 'El salón es cómodo.']]]
      .forEach(([q, a], i) => put(s, '.w5', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: 'set', prompt: `${q} ${say(q)}`, answers: a })));
    put(s, '.f5', freeItem({ id: 'a5-f', sec: 'a5', rows: 4, prompt: '친구에게 이 집을 소개하는 글을 쓰세요. ser · estar · tener 를 모두 사용!', minWords: 25, ph: 'Está en la calle Granada. Es nueva. Tiene …',
      must: [{ re: W0 + 'est[aá]' + W1, label: 'está (위치 · 상태) 2번 이상', min: 2 }, { re: W0 + 'es' + W1, label: 'es (특징)' }, { re: W0 + 'tiene' + W1, label: 'tiene (가진 것) 2번 이상', min: 2 },
        { re: 'granada', label: 'calle Granada' }, { re: '(dormitorios|ba[nñ]os|plantas)', label: '방 · 욕실 · 층 수' }],
      model: 'Está en la calle Granada. Es nueva y muy luminosa. Tiene dos plantas, cuatro dormitorios y dos baños. También tiene un salón cómodo, una cocina, un patio y un garaje. Está bien comunicada y está cerca de una parada de autobús.' }));
  };

  /* =================== Diálogo 2 =================== */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Ana pregunta a su amigo Minsu sobre su casa de Corea.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">baño</span><span class="hlc c1">más o menos</span><span class="hlc c2">andando</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 이번엔 내가 민수! — 우리 집에 대한 질문에 답하세요</h3><div class="items my"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blurBtn(s, '#hide2', '#d2txt', '본문 보기', '본문 가리기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'pre', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['La casa de Minsu es un piso grande.', 'Falso'], ['El piso de Minsu tiene tres habitaciones.', 'Verdadero'], ['Tiene garaje, pero no tiene balcón.', 'Falso'], ['La escuela está a unos treinta minutos a pie.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'set', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['También tiene un salón, una cocina y <u>un cuarto de baño</u>.', 'baño', ['También tiene un salón, una cocina y un baño.']],
      ['Está un poco lejos, a <u>unos</u> treinta minutos a pie.', 'más o menos', ['Está un poco lejos, a treinta minutos más o menos a pie.', 'Está un poco lejos, a más o menos treinta minutos a pie.', 'Está un poco lejos, a treinta minutos a pie más o menos.']],
      ['Está un poco lejos, a unos treinta minutos <u>a pie</u>.', 'andando', ['Está un poco lejos, a unos treinta minutos andando.']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'lug', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    [['¿Cómo es tu casa?', [{ re: W0 + 'es un (piso|apartamento|estudio|[aá]tico|chal[eé]|d[uú]plex|casa)', label: 'Es un piso / una casa …' }, { re: W0 + '(peque[nñ]|grande|nuev|antigu|modern|bonit|luminos|c[oó]mod)\\p{L}*', label: '형용사 (pequeño, nuevo …)' }]],
      ['¿Cuántas habitaciones tiene?', [{ re: W0 + 'tiene' + W1, label: 'Tiene …' }, { re: W0 + '(una|dos|tres|cuatro|cinco|seis|\\d+) (habitaci[oó]n|habitaciones|dormitorios?)', label: '숫자 + habitaciones' }]],
      ['¿Tiene balcón y garaje?', [{ re: W0 + '(s[ií]|no)' + W1, label: 'Sí / No' }, { re: W0 + '(no )?tiene' + W1, label: '(no) tiene …' }]],
      ['¿Está cerca de la escuela?', [{ re: W0 + 'est[aá] (muy |un poco |bastante )?(cerca|lejos)' + W1, label: 'Está cerca / lejos' }, { re: '(minutos|andando|a pie|en (autob[uú]s|metro|coche))', label: '… minutos a pie / andando / en autobús' }]]]
      .forEach(([q, m], i) => put(s, '.my', freeItem({ id: 'd2-m' + i, sec: 'd2', skill: i === 3 ? 'lug' : 'set', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m })));
  };

  /* =================== Actividad 6 =================== */
  const ADS = [
    { t: 'Precioso piso', d: 'cocina, gran salón, comedor,<br>4 habitaciones,<br>un amplio pasillo, jardín,<br>terraza grande', img: TIPO.piso, sans: true,
      q: [['¿Qué tipo de casa es?', ['Es un piso precioso.', 'Es un piso.']], ['¿Cuántas habitaciones tiene?', ['Tiene cuatro habitaciones.']], ['¿Cómo es el salón?', ['El salón es grande.', 'Es grande.', 'Es un salón grande.']]],
      must: [{ re: W0 + 'es un piso', label: 'Es un piso …' }, { re: 'cuatro habitaciones', label: 'cuatro habitaciones' }, { re: 'sal[oó]n es grande|gran sal[oó]n', label: 'El salón es grande' }, { re: '(jard[ií]n|terraza)', label: 'jardín · terraza' }] },
    { t: 'Apartamento centro<br>de Madrid', d: '1 dormitorio, baño completo,<br>balcón<br>exterior', img: TIPO.apartamento,
      q: [['¿Qué tipo de casa es?', ['Es un apartamento.', 'Es un apartamento exterior.']], ['¿Dónde está?', ['Está en el centro de Madrid.']], ['¿Cuántos dormitorios tiene?', ['Tiene un dormitorio.', 'Tiene solo un dormitorio.']]],
      must: [{ re: W0 + 'es un apartamento', label: 'Es un apartamento …' }, { re: 'est[aá] en el centro de madrid', label: 'Está en el centro de Madrid' }, { re: '(un|1) dormitorio', label: 'un dormitorio' }, { re: 'balc[oó]n', label: 'balcón' }] },
    { t: 'Chalé en urbanización', d: 'nuevo, 4 dormitorios,<br>salón, comedor,<br>cocina grande,<br>2 baños,<br>pequeño jardín', img: TIPO['chalé'],
      q: [['¿Dónde está el chalé?', ['Está en una urbanización.']], ['¿Cuántos baños tiene?', ['Tiene dos baños.']], ['¿Cómo es la cocina?', ['La cocina es grande.', 'Es grande.']]],
      must: [{ re: W0 + 'es un chal[eé]', label: 'Es un chalé …' }, { re: 'nuevo', label: 'nuevo' }, { re: 'cuatro dormitorios', label: 'cuatro dormitorios' }, { re: 'dos ba[nñ]os', label: 'dos baños' }, { re: 'jard[ií]n', label: 'jardín (pequeño)' }] }];
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Lee estos anuncios y habla siguiendo el modelo.')}
      ${modelo('Es un piso precioso. Tiene cuatro habitaciones, una cocina, un salón y un comedor. El salón es grande. También hay un jardín y una terraza grande.')}
      ${tip('광고 약어 읽기: <b>4</b> habitaciones → <b>cuatro</b> habitaciones · <b>gran</b> salón → el salón es <b>grande</b> · <b>amplio</b> 넓은 · <b>baño completo</b> 욕조까지 갖춘 욕실 · <b>exterior</b> 바깥(거리)쪽으로 창이 난 · <b>urbanización</b> 주택 단지')}
      <div class="ads6"></div>
      <h3 class="h3">🔎 어느 광고일까요?</h3><div class="items two which"></div>
      <h3 class="h3">✍️ modelo처럼 광고 하나를 골라 소개하세요</h3>
      <div class="mode m6">${ADS.map((a, i) => `<button data-i="${i}">${i + 1}) ${a.t.replace('<br>', ' ')}</button>`).join('')}</div><div class="f6"></div>`);
    ADS.forEach((a, i) => {
      const box = el(`<div class="ad6"><div class="ad-card ${a.sans ? 'sans' : ''}"><span class="n">${i + 1})</span><h4>${a.t}</h4><p>${a.d}</p></div><div class="ad-img">${a.img}</div><div class="items aq"></div></div>`);
      a.q.forEach(([q, ans], j) => $('.aq', box).appendChild(writeItem({ id: `a6-${i}-${j}`, sec: 'a6', skill: j === 0 && i === 2 ? 'lug' : 'set', prompt: `${q} ${say(q)}`, answers: ans })));
      put(s, '.ads6', box);
    });
    [['Tiene un amplio pasillo.', '1) Precioso piso'], ['Está en el centro de Madrid.', '2) Apartamento'], ['Es nuevo y tiene un pequeño jardín.', '3) Chalé']]
      .forEach(([p, a], i) => put(s, '.which', choiceItem({ id: 'a6-w' + i, sec: 'a6', skill: 'voc', prompt: p, options: ['1) Precioso piso', '2) Apartamento', '3) Chalé'], answer: a })));
    const st = sel('a6', {});
    const tg = () => $$('.m6 button', s).forEach(b => b.classList.toggle('on', String(st.ad) === b.dataset.i));
    $$('.m6 button', s).forEach(b => b.onclick = () => { st.ad = +b.dataset.i; save(); tg(); });
    tg();
    put(s, '.f6', freeItem({ id: 'a6-f', sec: 'a6', rows: 4, needMsg: '위에서 광고를 하나 고르세요.', ph: 'Es un … Tiene … También hay …',
      must: () => st.ad == null ? null : [...ADS[st.ad].must, { re: W0 + 'tambi[eé]n' + W1, label: 'También …' }],
      model: 'Es un chalé nuevo en una urbanización. Tiene cuatro dormitorios, un salón, un comedor y dos baños. La cocina es grande. También hay un pequeño jardín.' }));
  };

  /* =================== Actividad 7 =================== */
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Quieres alquilar una habitación. Has comprado el periódico y aparece este anuncio. Marca verdadero o falso.')}
      <div class="ad-paper"><h4>Alquilo</h4><p>C/ Villar 16, zona Retiro. Ático de tres habitaciones, a compartir con dos chicos, 50m<sup>2</sup>, terraza, ascensor, teléfono, calefacción. 800 euros/mes más gastos comunes.</p><p>Tel.: 419 93 22</p></div>
      ${tip('<b>alquilo</b> 세놓습니다 · <b>C/</b> = calle · <b>a compartir con</b> ~와 같이 쓰는 · <b>m²</b> = metros cuadrados · <b>gastos comunes</b> 관리비 · <b>ascensor</b> 엘리베이터')}
      <div class="items two vf"></div>
      <h3 class="h3">🧮 계산해 보기</h3><div class="items calc"></div>
      <h3 class="h3">✍️ 틀린 문장 고쳐 쓰기 · 광고 정보 묻고 답하기</h3><div class="items two w7"></div>
      <h3 class="h3">✍️ 나도 광고 쓰기 — 내 방을 세놓는 광고 (Alquilo …)</h3><div class="f7"></div>`);
    [['1) Es un primer piso.', 'F', '맨 꼭대기 층(ático)이에요.'], ['2) Ahora solo vive una persona en el piso.', 'F', '"a compartir con dos chicos" — 지금 두 명이 살아요.'],
      ['3) Es un piso de 50 metros cuadrados.', 'V', '50m² = 50 metros cuadrados.'], ['4) Cada persona paga 250 euros al mes.', 'F', '800 ÷ 3 ≈ 267유로 + 관리비 → 250유로가 아니에요.']]
      .forEach(([p, a, x], i) => put(s, '.vf', choiceItem({ id: 'a7-vf' + i, sec: 'a7', skill: 'voc', prompt: p, options: ['V', 'F'], answer: a, explain: x })));
    put(s, '.calc', choiceItem({ id: 'a7-calc', sec: 'a7', skill: 'voc', prompt: '세 사람이 월세 800유로를 똑같이 나누면 한 사람당 얼마쯤? (관리비 제외)', options: ['unos 200 euros', 'unos 267 euros', 'unos 400 euros'], answer: 'unos 267 euros' }));
    [['1)을 맞게 고치세요: Es un primer piso. ✕', ['Es un ático.', 'No es un primer piso, es un ático.', 'No, es un ático.']],
      ['2)를 맞게 고치세요: Ahora solo vive una persona. ✕', ['Ahora viven dos chicos en el piso.', 'Ahora viven dos chicos.', 'Viven dos chicos.', 'Ahora viven dos personas en el piso.', 'Ahora viven dos personas.']],
      ['¿Dónde está el ático?', ['Está en la calle Villar 16, zona Retiro.', 'Está en la calle Villar 16.', 'Está en la calle Villar.', 'Está en la zona Retiro.', 'Está en la calle Villar, número 16.']],
      ['¿Cuánto cuesta al mes?', ['Cuesta 800 euros al mes más gastos comunes.', 'Cuesta 800 euros al mes.', 'Cuesta ochocientos euros al mes.', 'Cuesta ochocientos euros al mes más gastos comunes.', '800 euros al mes más gastos comunes.']]]
      .forEach(([p, a], i) => put(s, '.w7', writeItem({ id: 'a7-w' + i, sec: 'a7', skill: i < 2 ? 'set' : i === 2 ? 'lug' : 'set', prompt: p, answers: a })));
    put(s, '.f7', freeItem({ id: 'a7-f', sec: 'a7', rows: 4, prompt: '광고 형식으로 써도 되고, 문장으로 써도 돼요.', ph: 'Alquilo habitación en un piso nuevo, cerca de …',
      must: [{ re: W0 + 'alquilo' + W1, label: 'Alquilo …' }, { re: '(habitaci[oó]n|piso|apartamento|estudio|[aá]tico|casa)', label: '집 · 방 종류' },
        { re: '(calle|c/|zona|cerca|centro)', label: '위치 (calle / zona / cerca de)' }, { re: '(euros|wones|€)', label: '가격 (… euros/mes)' }, { re: FURN.replace('(', '(terraza|ascensor|calefacci[oó]n|balc[oó]n|garaje|jard[ií]n|'), label: '시설 · 가구 1개 이상' }],
      model: 'Alquilo habitación en un piso nuevo, calle Mayor 5, cerca del metro. Tiene cama, escritorio y armario. Terraza, ascensor y calefacción. 400 euros/mes. Tel.: 615 22 33 44' }));
  };

  /* =================== Actividad 8 — 두 방의 차이 =================== */
  const ROOM8 = {
    carlos: { cuadro: [42, 82], ventana: [278, 30], reloj: [180, 98, 'shelf'], florero: [186, 160], gato: [250, 222] },
    juan: { ventana: [44, 80], cuadro: [278, 30], reloj: [186, 158, 'mesa'], florero: [246, 110], gato: [62, 168] }
  };
  const room8 = who => {
    const R = ROOM8[who];
    const win = ([x, y]) => `<rect x="${x - 22}" y="${y - 22}" width="44" height="52" fill="#9fd8ef" stroke="#4a3a2a" stroke-width="2.5"/><path d="M${x - 12} ${y + 12} L${x + 6} ${y - 14} M${x - 4} ${y + 22} L${x + 14} ${y - 6}" stroke="#fff" stroke-width="3"/>`;
    const pic = ([x, y]) => `<rect x="${x - 20}" y="${y - 18}" width="40" height="36" fill="#fff" stroke="#4a3a2a" stroke-width="3"/>${E(x, y + 9, 22, '🪴')}`;
    return `<svg viewBox="0 0 340 250" class="room8" data-who="${who}">
      <rect width="340" height="250" rx="18" fill="#fdf1c2"/><path d="M0 0 H90 V190 L0 236 Z" fill="#f8e6a6"/><rect x="90" y="0" width="250" height="190" fill="#fdf3cc"/>
      <path d="M0 236 L90 190 H340 V250 H0 Z" fill="#b8e08a"/>
      <rect x="6" y="6" width="66" height="26" fill="#fff" stroke="#333" stroke-width="2"/><text x="39" y="25" text-anchor="middle" font-size="17" font-weight="700" font-family="sans-serif" fill="#333">${who === 'carlos' ? 'Carlos' : 'Juan'}</text>
      ${who === 'carlos' ? pic(R.cuadro) + win(R.ventana) : win(R.ventana) + pic(R.cuadro)}
      <rect x="150" y="34" width="66" height="160" fill="#f6cf6b" stroke="#8a5a14" stroke-width="2.5"/><rect x="156" y="40" width="54" height="32" fill="#8a6a3a"/>${E(184, 68, 22, '🍞')}
      <rect x="156" y="78" width="54" height="30" fill="#f6cf6b" stroke="#8a5a14"/>${E(166, 104, 14, '📚')}${E(200, 104, 14, '📚')}
      <rect x="156" y="114" width="54" height="22" fill="#f6cf6b" stroke="#8a5a14"/><rect x="176" y="124" width="14" height="3" fill="#8a5a14"/>
      <rect x="156" y="140" width="54" height="52" fill="#f6cf6b" stroke="#8a5a14"/><line x1="183" y1="140" x2="183" y2="192" stroke="#8a5a14"/>
      <rect x="216" y="122" width="62" height="70" fill="#f6cf6b" stroke="#8a5a14" stroke-width="2.5"/><line x1="216" y1="156" x2="278" y2="156" stroke="#8a5a14"/>
      <path d="M22 150 H74 V200 H22 Z" fill="#b5652b"/><rect x="18" y="176" width="72" height="34" rx="6" fill="#c8743a" stroke="#7a3a14" stroke-width="2"/><rect x="18" y="140" width="20" height="70" rx="6" fill="#b5652b" stroke="#7a3a14" stroke-width="2"/>${E(70, 186, 18, '🧣')}
      <path d="M140 170 H234 L226 182 H148 Z" fill="#f6cf6b" stroke="#8a5a14" stroke-width="2"/><line x1="152" y1="182" x2="152" y2="232" stroke="#8a5a14" stroke-width="3"/><line x1="222" y1="182" x2="222" y2="232" stroke="#8a5a14" stroke-width="3"/>
      ${E(R.reloj[0], R.reloj[1], 20, '🕰️')}${E(R.florero[0], R.florero[1], 22, '🌷')}${E(R.gato[0], R.gato[1], 24, '🐈')}
    </svg>`;
  };
  const DIF8 = [
    { k: 'cuadro', e: '🖼️', t: 'el cuadro', c: ['Está a la izquierda.', 'Está encima del sillón.', 'Está en la pared de la izquierda.'], j: ['Está a la derecha.', 'Está encima del armario.', 'Está en la pared de la derecha.', 'Está a la derecha de la estantería.'] },
    { k: 'ventana', e: '🪟', t: 'la ventana', c: ['Está a la derecha.', 'Está encima del armario.'], j: ['Está a la izquierda.', 'Está encima del sillón.', 'Está a la izquierda de la estantería.', 'Está en la pared de la izquierda.'] },
    { k: 'reloj', e: '🕰️', t: 'el reloj', c: ['Está en la estantería.'], j: ['Está en la mesa.', 'Está encima de la mesa.', 'Está sobre la mesa.'] },
    { k: 'florero', e: '🌷', t: 'el florero', c: ['Está en la mesa.', 'Está encima de la mesa.'], j: ['Está en el armario.', 'Está encima del armario.', 'Está sobre el armario.'] },
    { k: 'gato', e: '🐈', t: 'el gato', c: ['Está al lado de la mesa.', 'Está debajo de la mesa.', 'Está en el suelo.'], j: ['Está en el sillón.', 'Está encima del sillón.', 'Está sobre el sillón.', 'Está en el sofá.'] }];
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, '¿Qué diferencias hay entre las dos habitaciones? Habla con tus compañeros.', { kr: '① 후안의 방에서 카를로스의 방과 <b>다른 곳 5개</b>를 클릭해 찾고, ② 위치를 문장으로 써요.' })}
      <div class="r8"><div>${room8('carlos')}</div><div class="jw">${room8('juan')}</div></div>
      <div class="legend8">${[['el sillón', '🛋️'], ['la estantería', '📚'], ['el armario', '🗄️'], ['la mesa', '🪵'], ['el cuadro', '🖼️'], ['la ventana', '🪟'], ['el reloj', '🕰️'], ['el florero', '🌷'], ['el gato', '🐈']].map(([w, e]) => `<span>${e} ${w}</span>`).join('')}</div>
      <div class="item-row"><span class="found8"></span><button class="btn chk c8">채점 (찾은 개수)</button><button class="btn ghost sm show8">정답 보기</button></div>
      ${modelo('En la habitación de Carlos, el gato está al lado de la mesa, pero en la habitación de Juan, el gato está en el sillón.')}
      <h3 class="h3">✍️ 후안의 방 — ¿Dónde está …?</h3><div class="items two w8"></div>
      <h3 class="h3">✍️ 다른 점 3가지를 modelo처럼 쓰세요</h3><div class="f8"></div>`);
    const st = sel('a8', {});
    DIF8.forEach((d, i) => reg('a8-h' + i, 'a8', 'lug'));
    const jsvg = $('.jw svg', s);
    const paintFound = (reveal) => {
      $$('.hit8', jsvg).forEach(n => n.remove());
      DIF8.forEach((d, i) => {
        const [x, y] = ROOM8.juan[d.k];
        const on = st[i];
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', d.k === 'ventana' || d.k === 'cuadro' ? y : y - 6); c.setAttribute('r', d.k === 'ventana' ? 34 : 24);
        c.setAttribute('class', 'hit8' + (on ? ' on' : reveal ? ' rv' : ''));
        c.onclick = ev => { ev.stopPropagation(); st[i] = 1; save(); paintFound(); };
        jsvg.appendChild(c);
      });
      const n = DIF8.filter((d, i) => st[i]).length;
      $('.found8', s).innerHTML = `찾은 차이: <b>${n} / 5</b> ${DIF8.map((d, i) => st[i] ? d.e : '❔').join(' ')}`;
    };
    jsvg.addEventListener('click', () => { const f = $('.found8', s); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); });
    paintFound();
    $('.c8', s).onclick = () => { DIF8.forEach((d, i) => record('a8-h' + i, st[i] ? 1 : 0, st[i] ? [] : ['otro'], {})); const n = DIF8.filter((d, i) => st[i]).length; $('.found8', s).insertAdjacentHTML('beforeend', ' ' + MARK(n / 5)); };
    $('.show8', s).onclick = () => paintFound(true);
    DIF8.forEach((d, i) => put(s, '.w8', writeItem({ id: 'a8-w' + i, sec: 'a8', skill: 'lug', prompt: `${d.e} <b>Juan:</b> ¿Dónde está ${d.t}? <span class="small">(카를로스의 방: ${d.c[0].replace('Está ', '').replace('.', '')})</span>`,
      ph: 'Está …', answers: withSub(d.t[0].toUpperCase() + d.t.slice(1), d.j) })));
    put(s, '.f8', freeItem({ id: 'a8-f', sec: 'a8', rows: 5, ph: 'En la habitación de Carlos, el reloj está …, pero en la habitación de Juan, …',
      must: [{ re: 'en la (habitaci[oó]n )?de carlos', label: 'En la habitación de Carlos …' }, { re: 'en la (habitaci[oó]n )?de juan', label: 'en la (habitación) de Juan …' },
        { re: W0 + 'pero' + W1, label: 'pero (대조) 3번', min: 3 }, { re: W0 + 'est[aá]' + W1, label: 'está 6번 이상 (차이 3개 × 2)', min: 6 }],
      model: 'En la habitación de Carlos, el reloj está en la estantería, pero en la habitación de Juan, está en la mesa. En la habitación de Carlos, el florero está en la mesa, pero en la de Juan, está encima del armario. En la habitación de Carlos, la ventana está a la derecha, pero en la de Juan, está a la izquierda.' }));
  };

  /* =================== Actividad 9 — 이사: 평면도에 가구 배치 =================== */
  const ROOMS9 = [
    { k: 'cocina', l: 'la cocina', x: 0, y: 0, w: 38, h: 42 }, { k: 'salon', l: 'el salón', x: 38, y: 0, w: 62, h: 42 },
    { k: 'pasillo', l: 'el pasillo', x: 0, y: 42, w: 100, h: 16 },
    { k: 'banno', l: 'el baño', x: 0, y: 58, w: 28, h: 42 }, { k: 'peq', l: 'la habitación pequeña', x: 28, y: 58, w: 38, h: 42 }, { k: 'grande', l: 'el dormitorio grande', x: 66, y: 58, w: 34, h: 42 }];
  const FURN9 = [['la mesa con las tres sillas', '🍽️', 'cocina'], ['el sofá', '🛋️', 'salon'], ['los sillones', '💺', 'salon'], ['la estantería', '📚', 'salon'], ['la lavadora', '🫧', 'cocina'], ['la cama de matrimonio', '🛏️', 'grande'], ['la cama pequeña', '🛌', 'peq']];
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Marta y Julio alquilan un piso y hacen la mudanza. Escucha y contesta.', { listen: true, kr: 'TRANSCRIPCIONES 대본을 ▶ 들으며 가구를 평면도의 알맞은 방에 놓아 보세요.' })}
      <h3 class="h3"><button class="btn ghost sm" id="play9">▶ 대화 듣기</button> <button class="btn ghost sm" id="hide9">대본 보기</button></h3>
      <div id="d9txt" class="blur">${dialogHTML(D.dialogo9)}</div>
      <h3 class="h3">① 평면도 — 가구를 누르고, 놓을 방을 누르세요</h3>
      <div class="ybox bank9"></div>
      <div class="plan9"><div class="entr">🚪 entrada</div>${ROOMS9.map(r => `<div class="rm9 ${r.k}" data-r="${r.k}" style="left:${r.x}%;top:${r.y}%;width:${r.w}%;height:${r.h}%"><span class="rl">${r.l}</span><div class="in"></div></div>`).join('')}
        <span class="win9" title="ventana"></span><span class="frg9">🚰 fregadero</span><span class="door9"></span></div>
      <div class="item-row"><button class="btn chk p9">평면도 채점</button><span class="pscore9"></span></div>
      <h3 class="h3">② 세부 위치 확인</h3><div class="items ch9"></div>
      <h3 class="h3">③ Escucha y contesta — 문장으로 답하세요</h3><div class="items w9"></div>`);
    $('#play9', s).onclick = e => playLines(D.dialogo9, e.currentTarget);
    blurBtn(s, '#hide9', '#d9txt', '대본 보기', '대본 가리기');
    const st = sel('a9', {});
    let picked = null;
    FURN9.forEach((f, i) => reg('a9-p' + i, 'a9', 'voc'));
    const bank = $('.bank9', s);
    const paint = () => {
      bank.innerHTML = FURN9.map((f, i) => st[i] ? '' : `<button class="wchip ${picked === i ? 'sel' : ''}" data-i="${i}">${f[1]} ${f[0]}</button>`).join('') || '<span class="small">모두 배치했어요 ✔ (방 안의 가구를 누르면 다시 꺼낼 수 있어요)</span>';
      $$('.rm9', s).forEach(r => { $('.in', r).innerHTML = FURN9.map((f, i) => st[i] === r.dataset.r ? `<button class="fz" data-i="${i}" title="${esc(f[0])}">${f[1]}<small>${f[0].replace(/^(la|el|los|las) /, '')}</small></button>` : '').join(''); });
      $$('.wchip', bank).forEach(b => b.onclick = () => { picked = +b.dataset.i; paint(); });
      $$('.fz', s).forEach(b => b.onclick = ev => { ev.stopPropagation(); delete st[+b.dataset.i]; save(); paint(); });
    };
    $$('.rm9', s).forEach(r => r.onclick = () => { if (picked == null) return; st[picked] = r.dataset.r; picked = null; save(); paint(); });
    paint();
    $('.p9', s).onclick = () => {
      let ok = 0;
      FURN9.forEach((f, i) => { const g = st[i] === f[2]; if (g) ok++; record('a9-p' + i, g ? 1 : 0, g ? [] : ['otro'], {}); });
      $$('.fz', s).forEach(b => { const i = +b.dataset.i; b.classList.add(st[i] === FURN9[i][2] ? 'ok' : 'no'); });
      $('.pscore9', s).innerHTML = `${MARK(ok / FURN9.length)} <b>${ok} / ${FURN9.length}</b>`;
    };
    [['El sofá está…', ['al fondo, pegado a la pared', 'debajo de la ventana', 'al lado del fregadero'], 'al fondo, pegado a la pared'],
      ['La mesa con las tres sillas está en la cocina…', ['al lado de la puerta (a la derecha)', 'al fondo del pasillo', 'debajo de la ventana'], 'al lado de la puerta (a la derecha)']]
      .forEach(([p, o, a], i) => put(s, '.ch9', choiceItem({ id: 'a9-c' + i, sec: 'a9', skill: 'lug', prompt: p, options: o, answer: a })));
    [['1) ¿Dónde están el sofá y los sillones?', ['Están en el salón.', 'El sofá y los sillones están en el salón.', 'Están en el salón. El sofá está al fondo, pegado a la pared y los sillones están a la izquierda del sofá, debajo de la ventana.']],
      ['2) ¿Dónde está la lavadora?', ['Está en la cocina, al lado del fregadero.', 'La lavadora está en la cocina, al lado del fregadero.', 'Está al lado del fregadero.', 'Está en la cocina.']],
      ['3) ¿Dónde está la cama de matrimonio?', ['Está en el dormitorio grande, al fondo del pasillo a la derecha.', 'Está en el dormitorio grande.', 'La cama de matrimonio está en el dormitorio grande.', 'La cama de matrimonio está en el dormitorio grande, al fondo del pasillo a la derecha.']],
      ['4) ¿Dónde está la cama pequeña?', ['Está en la habitación de al lado, en frente del salón.', 'Está en la habitación de al lado.', 'La cama pequeña está en la habitación de al lado, en frente del salón.', 'Está en frente del salón.', 'Está en la habitación pequeña.']],
      ['5) ¿Dónde está la estantería?', ['Está en el salón, en frente de la ventana.', 'La estantería está en el salón, en frente de la ventana.', 'Está en el salón.', 'Está en frente de la ventana.', 'Está enfrente de la ventana.']]]
      .forEach(([q, a], i) => put(s, '.w9', writeItem({ id: 'a9-w' + i, sec: 'a9', skill: i === 0 ? 'hay' : 'lug', prompt: `${q} ${say(q.slice(3))}`, ph: 'Está(n) en …', answers: a })));
  };

  /* =================== ¡Compruébalo! — 내 방 평면도 그리기 (Parte B 준비) =================== */
  const PF = [['cama', 'la cama'], ['armario', 'el armario'], ['escritorio', 'el escritorio'], ['silla', 'la silla'], ['mesilla', 'la mesilla'], ['lámpara', 'la lámpara'],
    ['estantería', 'la estantería'], ['sofá', 'el sofá'], ['televisión', 'la televisión'], ['ordenador', 'el ordenador']];
  const PFN = Object.fromEntries(PF);
  const deOf = t => t.startsWith('el ') ? 'del ' + t.slice(3) : 'de ' + t;
  /* 위치(0~1)에서 맞는 위치 표현 목록 계산 (창문 = 위쪽 벽 가운데, 문 = 아래 왼쪽) */
  function descs(k, P) {
    const { x, y } = P[k], out = [];
    if (x < 0.36) out.push('a la izquierda'); if (x > 0.64) out.push('a la derecha');
    if (y < 0.3) { out.push('al fondo'); if (Math.abs(x - 0.5) < 0.22) out.push('debajo de la ventana', 'al lado de la ventana', 'cerca de la ventana'); }
    if (x >= 0.3 && x <= 0.7 && y >= 0.3 && y <= 0.7) out.push('en el centro', 'en medio');
    if (y > 0.62 && Math.abs(x - 0.5) < 0.28) out.push('en frente de la ventana', 'enfrente de la ventana');
    if (Math.hypot(x - 0.1, (y - 1) * 0.75) < 0.3) out.push('al lado de la puerta', 'cerca de la puerta');
    Object.keys(P).forEach(o => {
      if (o === k) return;
      const dx = x - P[o].x, dy = (y - P[o].y) * 0.75, d = Math.hypot(dx, dy), t = PFN[o];
      if (d < 0.26) out.push('al lado ' + deOf(t), 'cerca ' + deOf(t));
      if (Math.abs(dy) < 0.2 && dx < -0.08 && d < 0.5) out.push('a la izquierda ' + deOf(t));
      if (Math.abs(dy) < 0.2 && dx > 0.08 && d < 0.5) out.push('a la derecha ' + deOf(t));
      if (Math.abs(dx) < 0.15 && dy > 0.05 && d < 0.3) out.push('en frente ' + deOf(t), 'delante ' + deOf(t));
    });
    if (!out.length) out.push('cerca de la pared');
    return out;
  }
  const descRe = d => {
    const v = [d];
    if (/ del /.test(d)) v.push(d.replace(' del ', ' de mi '));
    if (/ de la /.test(d)) v.push(d.replace(' de la ', ' de mi '));
    return v.map(x => acc(x).replace(/ /g, '\\s+')).join('|');
  };
  function buildPlano() {
    const box = document.getElementById('plano5');
    if (!box) return;
    const st = sel('plano', {});
    box.innerHTML = `<div class="pl-head"><b>📐 a) Dibuja un plano</b> — 가구를 눌러 방에 넣고, <b>끌어서</b> 원하는 곳에 놓으세요. (다시 누르면 ✕로 빼기)</div>
      <div class="pl-pal">${PF.map(([k, t]) => `<button class="wchip" data-k="${k}">${icon(k)} ${t}</button>`).join('')}</div>
      <div class="pl-wrap"><div class="pl-room"><span class="pl-win">ventana</span><div class="pl-items"></div></div><span class="pl-door">puerta</span></div>
      <div class="item-row"><button class="btn ghost sm pl-hint">💡 위치 표현 힌트</button><button class="btn ghost sm pl-clr">모두 지우기</button></div><div class="pl-hints"></div>
      <div class="pl-free"></div>`;
    const room = $('.pl-room', box), items = $('.pl-items', box);
    let showHint = false;
    const draw = () => {
      items.innerHTML = Object.keys(st).map(k => `<div class="pl-it" data-k="${k}" style="left:${st[k].x * 100}%;top:${st[k].y * 100}%">${icon(k)}<small>${k}</small><button class="pl-x" title="빼기">✕</button></div>`).join('');
      $$('.pl-pal .wchip', box).forEach(b => b.classList.toggle('used', !!st[b.dataset.k]));
      $$('.pl-it', items).forEach(n => {
        $('.pl-x', n).onclick = ev => { ev.stopPropagation(); delete st[n.dataset.k]; save(); draw(); };
        n.onpointerdown = ev => {
          if (ev.target.closest('.pl-x')) return;
          ev.preventDefault(); n.setPointerCapture(ev.pointerId); n.classList.add('drag');
          const r = room.getBoundingClientRect();
          n.onpointermove = e2 => { const k = n.dataset.k; st[k] = { x: Math.min(0.94, Math.max(0.06, (e2.clientX - r.left) / r.width)), y: Math.min(0.92, Math.max(0.08, (e2.clientY - r.top) / r.height)) }; n.style.left = st[k].x * 100 + '%'; n.style.top = st[k].y * 100 + '%'; };
          n.onpointerup = () => { n.onpointermove = null; n.classList.remove('drag'); save(); hints(); };
        };
      });
      hints();
    };
    const hints = () => {
      $('.pl-hints', box).innerHTML = showHint && Object.keys(st).length ? `<ul class="pl-hl">${Object.keys(st).map(k => `<li><b>${PFN[k]}</b> está … ${descs(k, st).slice(0, 4).map(d => `<span class="chip">${d}</span>`).join(' ')}</li>`).join('')}</ul>` : '';
    };
    $$('.pl-pal .wchip', box).forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if (st[k]) delete st[k]; else { const n = Object.keys(st).length; st[k] = { x: 0.2 + (n % 4) * 0.2, y: 0.25 + Math.floor(n / 4) * 0.25 }; }
      save(); draw();
    });
    $('.pl-hint', box).onclick = () => { showHint = !showHint; hints(); };
    $('.pl-clr', box).onclick = () => { Object.keys(st).forEach(k => delete st[k]); save(); draw(); };
    draw();
    $('.pl-free', box).appendChild(freeItem({ id: 'ex-plano', sec: 'examen', skill: 'lug', rows: 6, needMsg: '먼저 평면도에 가구를 3개 이상 놓으세요.',
      prompt: '평면도를 보고 답하세요: 1) ¿Cómo es tu habitación? 2) ¿Qué muebles hay? 3) ¿Dónde está la cama? 4) ¿Dónde está …? <span class="small">— 놓은 가구마다 위치를 한 문장씩!</span>',
      ph: 'Mi habitación es pequeña, pero es muy luminosa. Hay una cama, … La cama está a la izquierda, …',
      must: () => {
        const ks = Object.keys(st); if (ks.length < 3) return null;
        return [{ re: W0 + '(es|est[aá]) (muy |bastante |un poco )?(peque[nñ]a|grande|luminosa|bonita|agradable|nueva|antigua|moderna|c[oó]moda|ordenada|tranquila)' + W1, label: '¿Cómo es? — Es pequeña / grande …' },
          { re: W0 + 'hay' + W1, label: 'Hay + 가구' },
          ...ks.map(k => ({ re: '(el|la|mi)\\s+' + acc(k) + '\\s+est[aá]\\s+[^.;!?\\n]*?(' + descs(k, st).map(descRe).join('|') + ')', label: `${PFN[k]} está … (${descs(k, st)[0]} …)` }))];
      },
      model: 'Mi habitación es pequeña, pero es muy luminosa. Hay una cama, un escritorio, una silla y un armario. La cama está a la izquierda, al lado de la puerta. El escritorio está debajo de la ventana. La silla está al lado del escritorio. El armario está a la derecha.' }));
  }

  SC.lesson({
    num: '05',
    title: '¿Cómo es tu casa?',
    ttsTest: '¿Cómo es tu casa? Es un piso pequeño, pero es muy bonito.',
    cover: {
      emoji: '🏠🛋️<small>🛏️🛁🪴</small>',
      bg: 'linear-gradient(160deg,#9fd8ef 0%,#f3e3c3 55%,#7b3a26 100%)',
      tema: ['La casa', 'Mi habitación', 'Los muebles'],
      com: ['Describir una casa', 'Describir una habitación'],
      gram: ['Interrogativo: <i>Cómo</i>', 'Adverbios: <i>mucho, muy</i>', 'Algunos usos de los verbos <i>ser, estar</i> y <i>tener</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      S: { g: 'f', name: 'La dueña', av: '👩🏽‍🦱', side: 'l' }, C: { g: 'm', name: 'Chico coreano', av: '🧑🏻‍🎓', side: 'r' },
      Ana: { g: 'f', av: '👩🏼‍🦰', side: 'l' }, Minsu: { g: 'm', av: '🧑🏻', side: 'r' }, Julio: { g: 'm', av: '🧔🏻', side: 'l' }, Marta: { g: 'f', av: '👩🏻', side: 'r' }
    },
    errLabels: { conjugacion: 'ser · estar · tener · hay', concordancia: '성 · 수 일치 (pequeño/pequeña)', estructura: '위치 표현 · muy/mucho' },
    errTips: {
      acento: 'cómo, dónde, cuántas, salón, sofá, lámpara, frigorífico … 악센트도 철자예요. 시험에서는 감점됩니다.',
      conjugacion: '특징 → ES (Es nueva) · 위치 → ESTÁ (Está en la calle Granada) · 가진 것 → TIENE (Tiene dos baños) · 존재 → HAY (Hay una cama)',
      concordancia: '형용사는 명사에 맞춰요: un piso pequeño / una casa pequeña / dos baños grandes',
      estructura: 'muy + 형용사, mucho/a/os/as + 명사 · de + el = del, a + el = al · Hay una cama (✕ Hay la cama)'
    },
    classify(ti, ta) {
      const V = ['es', 'son', 'está', 'están', 'esta', 'estan', 'tiene', 'tienen', 'hay', 'soy', 'estoy', 'tengo'];
      if (ti.some(w => V.includes(w)) && ti.filter(w => V.includes(w)).map(w => SC.strip(w)).join() !== ta.filter(w => V.includes(w)).map(w => SC.strip(w)).join()) return 'conjugacion';
      const M = ['muy', 'mucho', 'mucha', 'muchos', 'muchas'];
      if (ti.some(w => M.includes(w)) && ti.filter(w => M.includes(w)).join() !== ta.filter(w => M.includes(w)).join()) return 'estructura';
      const P = ['del', 'al', 'de', 'a', 'en'];
      if (ti.length === ta.length && ti.filter(w => P.includes(w)).join() !== ta.filter(w => P.includes(w)).join()) return 'estructura';
      return null;
    },
    errRules: [
      { re: W0 + 'hay (el|la|los|las)' + W1, t: 'estructura', msg: 'Hay + un/una/숫자: "Hay una cama" (✕ Hay la cama)' },
      { re: W0 + 'muy much[oa]s?' + W1, t: 'estructura', msg: '"muy mucho"(✕) → "mucho" 또는 "muy"' },
      { re: W0 + 'much[oa]s? (grande|peque[nñ][oa]s?|bonit[oa]s?|lejos|cerca|luminos[oa]s?|nuev[oa]s?|bien)' + W1, t: 'estructura', msg: '형용사 · 부사 앞에는 "muy"' },
      { re: W0 + 'muy (luz|ventanas?|muebles|habitaciones|libros|cosas)' + W1, t: 'estructura', msg: '명사 앞에는 mucho/mucha/muchos/muchas' },
      { re: W0 + 'es (en|cerca de|lejos de|a la (izquierda|derecha)|al fondo|al lado)' + W1, t: 'conjugacion', msg: '위치는 estar: "Está en …"' },
      { re: W0 + 'est[aá] (un|una) (piso|casa|apartamento|chal[eé]|estudio)' + W1, t: 'conjugacion', msg: '집의 종류는 ser: "Es un piso"' },
      { re: W0 + 'a el' + W1, t: 'estructura', msg: 'a + el = al' },
      { re: W0 + 'de el' + W1, t: 'estructura', msg: 'de + el = del' },
      { re: W0 + '(en frente|enfrente|al lado|a la izquierda|a la derecha|cerca|lejos|encima|debajo|detr[aá]s) (la|el|los|las|mi)' + W1, t: 'estructura', msg: '위치 표현 뒤에 de: "al lado de la …", "a la izquierda del …"' },
      { re: W0 + 'una (piso|sof[aá]|armario|escritorio|ba[nñ]o|sal[oó]n|dormitorio|cuadro|ordenador|espejo)' + W1, t: 'concordancia', msg: '남성 명사 → un (un piso, un sofá …)' },
      { re: W0 + 'un (casa|cama|silla|mesa|cocina|habitaci[oó]n|l[aá]mpara|ducha|ba[nñ]era|lavadora|mesilla|ventana|televisi[oó]n|estanter[ií]a)' + W1, t: 'concordancia', msg: '여성 명사 → una (una casa, una cama …)' },
      { re: W0 + 'la (sof[aá]|piso)' + W1, t: 'concordancia', msg: 'sofá · piso 는 남성 → el' },
      { re: '(?<=¿\\s?)cuantas?' + W1, t: 'acento', msg: '¿Cuántas … ? 악센트' }
    ],
    accWords: ['frigorífico', 'bañera', 'estantería', 'ático', 'chalé', 'dúplex', 'calefacción', 'balcón', 'cómodo', 'cómoda', 'sillón', 'señora', 'dueña', 'periódico', 'lámparas', 'ubicación', 'pequeños', 'pequeñas', 'sofás'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Cómo es tu casa?', '¿Cuántas habitaciones tiene?', '¿Está bien comunicada?', '¿Qué hay en las habitaciones?', 'Hay una cama, un escritorio y un armario.', 'Está en frente de la ventana.'],
    utilSkill: 'pre',
    proverbio: { es: 'Las paredes oyen.', e: '👂🧱', answer: '낮말은 새가 듣고 밤말은 쥐가 듣는다', options: ['낮말은 새가 듣고 밤말은 쥐가 듣는다', '벽에도 귀가 있으니 집을 튼튼히 지어라', '등잔 밑이 어둡다', '집 떠나면 고생이다'], kr: '벽도 듣는다 — 아무도 없는 것 같아도 누군가 들을 수 있으니 말조심하라는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Mi habitación y mi casa → 글로 쓰기',
        icons: ['📐', '🏠', '🏢', '✨'],
        html: '<div id="plano5" class="plano5"></div><p class="small">⬆️ 평면도 문항은 연습용으로 따로 채점돼요. 아래 작문에는 a)·b)·c) 질문에 모두 답하세요.</p>',
        questions: ['¿Cómo es tu habitación? ¿Qué muebles hay? ¿Dónde está la cama? ¿Dónde está …?',
          '¿Dónde prefieres vivir, en una casa o en un piso? ¿Por qué?',
          '¿Cómo es y dónde está la casa de tus sueños?'],
        minWords: 50,
        hint: 'ser · estar · tener · hay, muy / mucho, 위치 표현(a la izquierda de, al lado de, en frente de …)을 활용하면 높은 점수!',
        ph: 'Mi habitación es pequeña, pero es muy luminosa. Hay una cama, …',
        connectors: ['y', 'pero', 'porque', 'también', 'además', 'cuando', 'o'],
        rubric: [
          { k: 'hab', label: '내 방 묘사 (mi habitación)', max: 8, re: 'mi (habitaci[oó]n|dormitorio|cuarto)', ax: 'Contenido' },
          { k: 'mue', label: '가구 3개 이상', max: 8, re: FURN, min: 3, ax: 'Contenido' },
          { k: 'viv', label: '집 vs 아파트 선호 (prefiero vivir en …)', max: 8, re: 'prefiero (vivir )?en (una casa|un piso|un apartamento|un chal[eé]|un [aá]tico)', ax: 'Contenido' },
          { k: 'sue', label: '꿈의 집 (la casa de mis sueños)', max: 6, re: 'casa de mis sue[nñ]os|mi casa ideal|casa ideal', ax: 'Contenido' },
          { k: 'est', label: 'estar + 위치 (2번 이상)', max: 8, re: 'est[aá]n? (en|a la|al|cerca|lejos|debajo|encima|delante|detr[aá]s|enfrente|junto|pegad)', min: 2, ax: 'Gramática' },
          { k: 'ser', label: 'ser + 형용사 (특징)', max: 8, re: '(es|son) (muy |bastante |un poco )?(grande|peque[nñ]|nuev|antigu|modern|bonit|luminos|c[oó]mod|tranquil|precios|agradable|ampli)\\p{L}*', ax: 'Gramática' },
          { k: 'ten', label: 'tener / hay (2번 이상)', max: 8, re: '(tiene|tienen|tengo|hay)', min: 2, ax: 'Gramática' },
          { k: 'muy', label: 'muy / mucho', max: 6, re: '(muy|much[oa]s?)', ax: 'Gramática' }
        ],
        model: 'Mi habitación es pequeña, pero es muy luminosa. Hay una cama, un escritorio, una silla y un armario. La cama está a la izquierda y el escritorio está debajo de la ventana. Prefiero vivir en una casa porque tiene jardín y es muy tranquila. La casa de mis sueños está cerca del mar. Es grande y moderna y tiene cuatro dormitorios, dos baños y una terraza.'
      }
    },
    build: B
  });
  /* 엔진이 시험 섹션을 만든 뒤 평면도 붙이기 */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPlano); else setTimeout(buildPlano, 0);
})();
