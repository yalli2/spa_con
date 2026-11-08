/* Lección 07 · Mi barrio — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, speak, dialogHTML, clozeFromDialog, MARK } = SC;

  /* ---------- 공통 도우미 ---------- */
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const combos = (...parts) => parts.reduce((a, p) => a.flatMap(x => p.map(y => x + y)), ['']);
  const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');      // 10 000 형식
  /* 숫자 → 스페인어 */
  function n2w(n) {
    const U = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
      'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const T = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    const lt = x => x < 30 ? U[x] : x < 100 ? T[Math.floor(x / 10)] + (x % 10 ? ' y ' + U[x % 10] : '') : x === 100 ? 'cien' : C[Math.floor(x / 100)] + (x % 100 ? ' ' + lt(x % 100) : '');
    const apo = s => s.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
    if (!n) return 'cero';
    const m = Math.floor(n / 1e6), k = Math.floor(n % 1e6 / 1000), r = n % 1000, out = [];
    if (m) out.push(m === 1 ? 'un millón' : apo(lt(m)) + ' millones');
    if (k) out.push(k === 1 ? 'mil' : apo(lt(k)) + ' mil');
    if (r) out.push(lt(r));
    return out.join(' ');
  }
  SC.n2w = n2w;
  const ORD = { 1: 'primera', 2: 'segunda', 3: 'tercera' };
  /* 길 안내 정답 생성: first = 'recto' | 'derecha' | 'izquierda', n = 몇 번째 길, side = 방향 */
  function dirAns(first, n, side) {
    const o = ORD[n], J = [' y ', ', ', ' y luego ', ', luego ', ' y después '];
    const U = combos(first === 'recto' ? ['Siga todo recto', 'Siga recto'] : [`Gire a la ${first}`], J,
      [`gire en la ${o} calle a la ${side}`, `tome la ${o} calle a la ${side}`, `gire en la ${o} a la ${side}`, `tome la ${o} a la ${side}`, `coja la ${o} calle a la ${side}`], ['.']);
    const T = combos(first === 'recto' ? ['Sigue todo recto', 'Sigue recto'] : [`Gira a la ${first}`], J,
      [`gira en la ${o} calle a la ${side}`, `toma la ${o} calle a la ${side}`, `gira en la ${o} a la ${side}`, `toma la ${o} a la ${side}`, `coge la ${o} calle a la ${side}`], ['.']);
    return [...U, ...T];
  }
  /* 장소로 가는 길 묻기 정답 (usted) */
  const askWay = dest => {
    const Q = [`¿cómo puedo llegar ${dest}?`, `¿cómo llego ${dest}?`, `¿cómo voy ${dest}?`, `¿cómo puedo ir ${dest}?`, `¿puede decirme cómo llegar ${dest}?`, `¿sabe cómo llegar ${dest}?`, `¿sabe usted cómo llegar ${dest}?`];
    return [...Q.map(q => '¿' + q.charAt(1).toUpperCase() + q.slice(2)), ...combos(['Oiga, perdone, ', 'Perdone, ', 'Disculpe, ', 'Por favor, '], Q)];
  };

  /* ---------- 학습 데이터 ---------- */
  const D = {
    skills: {
      lug: 'Lugares 장소·교통 어휘',
      hay: 'Hay/Estar 있다·위치',
      imp: 'Imperativo 명령형',
      dir: 'Direcciones 길 안내·위치',
      geo: 'Geografía 방위·지리',
      num: 'Números 큰 수',
      lib: 'Escritura libre 자유작문'
    },
    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '도시의 장소와 교통', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '주유소 가는 길', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: 'hay / está', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '길 안내 그림 연결', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: 'tú / usted 명령형', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '지도 위 길 찾기', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '산티아고 지하철 노선도', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'd2', label: 'Diálogo 2', kr: '아나와 파블로', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a6', label: 'Actividad 6', kr: '세계의 도시', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '유럽 지도 · 방위', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '큰 수 듣기', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '큰 수 어림하기', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '중남미 수도와 인구', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    lugares: [
      { es: 'el banco', kr: '은행', e: '🏦' },
      { es: 'la farmacia', kr: '약국', e: '💊' },
      { es: 'la gasolinera', kr: '주유소', e: '⛽' },
      { es: 'la comisaría', kr: '경찰서', e: '👮' },
      { es: 'el hospital', kr: '병원', e: '🏥' },
      { es: 'el museo', kr: '박물관 · 미술관', e: '🏛️' },
      { es: 'el cine', kr: '영화관', e: '🎬' },
      { es: 'el hotel', kr: '호텔', e: '🏨' },
      { es: 'la parada de autobús', kr: '버스 정류장', e: '🚏' },
      { es: 'la estación de metro', kr: '지하철역', e: '🚇' },
      { es: 'el aeropuerto', kr: '공항', e: '✈️' },
      { es: 'la plaza', kr: '광장', e: '⛲' },
      { es: 'el parque', kr: '공원', e: '🌳' },
      { es: 'el tranvía', kr: '트램 · 노면전차', e: '🚋' },
      { es: 'el taxi', kr: '택시', e: '🚕' },
      { es: 'la estación de tren', kr: '기차역', e: '🚉' }
    ],

    dialogo1: [
      { who: 'A', es: '[Oiga], [perdone], ¿[hay] una gasolinera [cerca de] aquí?' },
      { who: 'B', es: 'Mmm... Sí, hay una aquí [al lado], en la calle San Pedro.' },
      { who: 'A', es: 'Ah, perfecto. ¿Y [cómo] voy hasta allí?' },
      { who: 'B', es: 'Pues, [gire] en la primera calle a la derecha, siga [todo recto] y luego verá una plaza.' },
      { who: 'A', es: '¿Cómo se llama la plaza?' },
      { who: 'B', es: 'Es la plaza de La Paz. [Crúcela], siga un poco más y luego gire en la segunda calle a la [izquierda]. Allí hay una gasolinera abierta las veinticuatro horas.' },
      { who: 'B', es: 'Es muy fácil de llegar. No podrá perderse.' },
      { who: 'A', es: 'De acuerdo. Muchas gracias.' },
      { who: 'B', es: 'De nada. Adiós.' }
    ],

    dialogo2: [
      { who: 'Ana', es: 'Eres [sudamericano], ¿[verdad]?' },
      { who: 'Pablo', es: 'Sí, [soy de] Perú.' },
      { who: 'Ana', es: '¿Dónde [está] Perú?' },
      { who: 'Pablo', es: 'Está al [norte] de Chile.' },
      { who: 'Ana', es: '¿De qué parte de Perú eres?' },
      { who: 'Pablo', es: 'Soy de Lima, la [capital].' },
      { who: 'Ana', es: '¿Cómo es tu ciudad?' },
      { who: 'Pablo', es: 'Es una ciudad grande con más de ocho [millones] de habitantes. Es antigua y también es muy moderna.' },
      { who: 'Ana', es: '¿[Hay] muchos monumentos?' },
      { who: 'Pablo', es: 'Claro que sí. Hay monumentos y museos. También hay muchos restaurantes donde sirven comida deliciosa.' }
    ],

    /* Actividad 5 — TRANSCRIPCIONES */
    metro5: 'Toma el metro, la línea cinco, en la estación Quinta Normal y baja en Santa Ana. Allí cambia a la línea dos en dirección a La Cisterna y baja en la primera parada, en Los Héroes. Allí cambia otra vez a la línea uno en dirección a San Pablo y finalmente baja en la tercera parada.',
    /* Actividad 8 — TRANSCRIPCIONES (orden del libro) */
    nums8: [10000, 45000, 76000, 100000, 500000, 789000, 1000000, 4000000, 9000000, 10000000, 15200000, 45000000],

    capitales: [
      { k: 'mx', pais: 'México', cap: 'Ciudad de México', hab: 20843000 },
      { k: 'cu', pais: 'Cuba', cap: 'La Habana', hab: 2135498 },
      { k: 've', pais: 'Venezuela', cap: 'Caracas', hab: 1838939 },
      { k: 'co', pais: 'Colombia', cap: 'Bogotá', hab: 7613303 },
      { k: 'pe', pais: 'Perú', cap: 'Lima', hab: 8472935 },
      { k: 'bo', pais: 'Bolivia', cap: 'La Paz', hab: 877363 },
      { k: 'cl', pais: 'Chile', cap: 'Santiago', hab: 5084038 },
      { k: 'ar', pais: 'Argentina', cap: 'Buenos Aires', hab: 14122000 }
    ],

    utiles: [
      ['Oiga, perdone. / Oye, perdona.', '실례합니다. (usted / tú)'],
      ['¿Hay una parada de autobús por aquí?', '이 근처에 버스 정류장이 있나요?'],
      ['Sí, hay una al final de esta calle.', '네, 이 길 끝에 하나 있어요.'],
      ['¿Sabe usted dónde está el metro?', '지하철역이 어디 있는지 아세요?'],
      ['Sí, siga todo recto y gire en la primera calle a la derecha.', '네, 쭉 직진하다가 첫 번째 길에서 오른쪽으로 도세요.'],
      ['¿Cómo puedo ir a la estación del metro?', '지하철역에 어떻게 가나요?'],
      ['Cruce la plaza y tome la primera calle a la izquierda.', '광장을 건너서 첫 번째 길로 왼쪽으로 가세요.'],
      ['¿Dónde hay una comisaría?', '경찰서가 어디에 있나요?'],
      ['Lo siento, no soy de aquí.', '죄송해요, 저는 이 동네 사람이 아니에요.'],
      ['¿Cuántos habitantes tiene Seúl?', '서울은 인구가 몇 명인가요?'],
      ['Unos diez millones de habitantes.', '약 천만 명이에요.'],
      ['¿Dónde está Perú?', '페루는 어디에 있나요?'],
      ['Está en el oeste de Sudamérica, al sur de Ecuador.', '남미 서쪽, 에콰도르 남쪽에 있어요.']
    ],

    examBank: [
      { p: '¿Dónde ____ el banco más cercano? <i>(hay / está)</i>', a: ['está'], s: 'hay' },
      { p: 'Oiga, ¿____ una farmacia en esta calle? <i>(hay / está)</i>', a: ['hay'], s: 'hay' },
      { p: '¿Sabes si ____ un banco por aquí cerca? <i>(hay / está)</i>', a: ['hay'], s: 'hay' },
      { p: 'El Museo de Cera ____ en la siguiente calle. <i>(hay / está)</i>', a: ['está'], s: 'hay' },
      { p: '(usted) ____ en la primera calle a la derecha. <i>(girar)</i>', a: ['Gire'], s: 'imp' },
      { p: '(tú) ____ todo recto. <i>(seguir)</i>', a: ['Sigue'], s: 'imp' },
      { p: '(usted) ____ todo recto. <i>(seguir)</i>', a: ['Siga'], s: 'imp' },
      { p: '(usted) ____ la plaza. <i>(cruzar)</i>', a: ['Cruce'], s: 'imp' },
      { p: '(tú) ____ la segunda calle a la izquierda. <i>(tomar)</i>', a: ['Toma'], s: 'imp' },
      { p: '____, perdone. ¿Hay una gasolinera cerca de aquí? <i>(oír · usted)</i>', a: ['Oiga'], s: 'imp' },
      { p: 'El aeropuerto está ____ del centro. <i>(멀리)</i>', a: ['lejos'], s: 'dir' },
      { p: 'La farmacia está ____ de aquí, a dos minutos. <i>(가까이)</i>', a: ['cerca'], s: 'dir' },
      { p: '¿Hay un banco ____ aquí? <i>(이 근처에)</i>', a: ['por'], s: 'dir' },
      { p: 'Perú está al ____ de Chile. <i>(북쪽)</i>', a: ['norte'], s: 'geo' },
      { p: 'Portugal está al ____ de España. <i>(서쪽)</i>', a: ['oeste'], s: 'geo' },
      { p: '45 000 = cuarenta y cinco ____', a: ['mil'], s: 'num' },
      { p: '1 000 000 = un ____', a: ['millón'], s: 'num' },
      { p: 'Lima tiene más de ocho ____ de habitantes.', a: ['millones'], s: 'num' },
      { p: '200 000 personas = ____ mil personas', a: ['doscientas'], s: 'num' },
      { p: '¿____ habitantes tiene Seúl?', a: ['Cuántos'], s: 'num' }
    ]
  };

  const B = {};

  /* ================= Antes de empezar ================= */
  B.vocab = () => {
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">El metro es el medio de transporte más rápido, aunque tiene la desventaja de no llegar a todos los lugares. ${say('El metro es el medio de transporte más rápido, aunque tiene la desventaja de no llegar a todos los lugares.')}
      Los taxis y los autobuses son recomendables para el uso de los turistas porque así pueden disfrutar del viaje apreciando el paisaje de las ciudades. ${say('Los taxis y los autobuses son recomendables para el uso de los turistas porque así pueden disfrutar del viaje apreciando el paisaje de las ciudades.')}
      Algunas ciudades como Barcelona o Bilbao en España tienen tranvías que recorren el centro de la ciudad y otras zonas. ${say('Algunas ciudades como Barcelona o Bilbao en España tienen tranvías que recorren el centro de la ciudad y otras zonas.')}
      La mejor manera de conocer una ciudad es caminar por ella. En todos los barrios hay alamedas y parques donde la gente puede pasear. ${say('La mejor manera de conocer una ciudad es caminar por ella. En todos los barrios hay alamedas y parques donde la gente puede pasear.')}</p>
      <p class="lead">Para desplazarse por una ciudad o ir de un lugar a otro, hay varias formas y una de ellas es el transporte público. ${say('Para desplazarse por una ciudad o ir de un lugar a otro, hay varias formas y una de ellas es el transporte público.')}</p>
      <div class="tr-strip"><span>🚇<b>el metro</b><small>가장 빠름</small></span><span>🚕<b>el taxi</b><small>관광객 추천</small></span><span>🚌<b>el autobús</b><small>풍경 감상</small></span><span>🚋<b>el tranvía</b><small>Barcelona · Bilbao</small></span><span>🚶<b>caminar</b><small>최고의 방법!</small></span></div>
      <h3 class="h3">① 읽고 확인하기 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">② 카드를 눌러 뜻을 확인하세요 — 동네의 장소와 교통</h3><div class="fg"></div>
      <h3 class="h3">③ 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요 (관사 el / la 까지!)</h3><div class="items two w"></div>`);
    [['El metro es el medio de transporte más rápido.', 'Verdadero'], ['El metro llega a todos los lugares.', 'Falso'],
      ['Barcelona y Bilbao tienen tranvías.', 'Verdadero'], ['La mejor manera de conocer una ciudad es tomar un taxi.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'voc-vf' + i, sec: 'vocab', skill: 'lug', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.fg', flipGrid(D.lugares));
    D.lugares.filter((x, i) => [0, 1, 2, 3, 4, 8, 9, 10].includes(i)).forEach((a, i) => put(s, '.w', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'lug', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`, ph: 'el / la …', answers: [a.es] })));
  };

  /* ================= Gramática ================= */
  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. hay vs. está — "있다"가 두 개!</h3>
        <div class="blocks"><span class="bk v">¿Hay</span><span class="bk s">una farmacia</span><span class="bk p">cerca de aquí?</span><span class="small">← 있는지 없는지 (처음 말하는 것)</span></div>
        <div class="blocks"><span class="bk s">¿Dónde</span><span class="bk v">está</span><span class="bk o">la farmacia?</span><span class="small">← 정해진 그것이 어디에</span></div>
        <div class="legend-mini"><span class="bk v">hay + un / una / unos / 숫자 / 무관사</span><span class="bk o">el / la / 이름(el Cine Avenida, Perú) + está(n)</span></div>
        ${tip('<b>hay</b> 는 형태가 하나뿐 (단수·복수 모두 hay): Hay <b>muchos</b> monumentos.<br>✕ <s>Hay el banco</s> → ○ <b>El banco está</b> en la plaza. / ✕ <s>¿Dónde está una farmacia?</s> → ○ <b>¿Dónde hay una farmacia?</b>')}
        <div class="g1"></div></div>
      <div class="gcard"><h3>2. 긍정 명령형 (Imperativo afirmativo) — tú / usted</h3>
        <table class="dt imp"><tr><th>동사</th><th>tú (친구)</th><th>usted (어른·모르는 사람)</th></tr>
          <tr><td>-ar · girar</td><td>gir<b>a</b></td><td>gir<b>e</b></td></tr>
          <tr><td>-er · coger</td><td>cog<b>e</b></td><td>coj<b>a</b></td></tr>
          <tr><td>-ir · seguir (e→i)</td><td>sig<b>ue</b></td><td>sig<b>a</b></td></tr>
          <tr><td>oír</td><td><b>oye</b></td><td><b>oiga</b></td></tr></table>
        ${tip('규칙: tú 명령 = 현재형 3인칭 단수(él gira → <b>gira</b>) / usted 명령 = 모음을 바꿔요 (-ar → <b>-e</b>, -er·-ir → <b>-a</b>).<br>철자 주의: cruzar → <b>cruce</b> (z→c). 대명사는 뒤에 붙이고 악센트: <b>Crúcela</b> (= cruce + la plaza).')}
        <div class="g2"></div></div>
      <div class="gcard"><h3>3. 위치 표현 — en · cerca (de) · lejos (de) · al lado (de)</h3>
        <div class="dist"><span class="me">🧍 aquí</span><span class="d1">🏪 <b>al lado</b></span><span class="d2">🏦 <b>cerca</b></span><span class="d3">✈️ <b>lejos</b></span></div>
        ${tip('뒤에 기준이 오면 <b>de</b>: cerca <b>de</b> aquí, lejos <b>del</b> centro (de + el = del). 거리는 <b>a</b>: a unos quinientos metros, a cinco minutos.<br>길/장소 안에는 <b>en</b>: en la calle San Pedro, en la plaza.')}
        <div class="g3"></div></div>
      <div class="gcard"><h3>4. 전치사 por · a · de</h3>
        <div class="blocks"><span class="bk o">por</span><span class="small">~근처에, ~을 따라/통해: ¿Hay un banco <b>por aquí</b>? · pasear <b>por</b> el parque</span></div>
        <div class="blocks"><span class="bk v">a</span><span class="small">방향·목적지: ir <b>a</b> la plaza · <b>a</b> la derecha · <b>al</b> lado (a + el = al)</span></div>
        <div class="blocks"><span class="bk s">de</span><span class="small">출신·소속·기점: Soy <b>de</b> Lima · la plaza <b>de</b> La Paz · <b>de</b> un lugar <b>a</b> otro</span></div>
        <div class="g4"></div></div>
      <div class="gcard"><h3>5. 큰 수 (Números a partir del 10 000)</h3>
        <table class="dt nums">${[[10000, '만'], [20000, '2만'], [100000, '10만'], [200000, '20만'], [500000, '50만'], [1000000, '백만'], [2000000, '2백만'], [10000000, '천만']]
          .map(([n, k]) => `<tr><td class="dg">${sp(n)}</td><td><b>${n2w(n)}</b> ${say(n2w(n))}</td><td class="small">${k}</td></tr>`).join('')}</table>
        ${tip('<b>mil</b> 은 복수형이 없어요: dos <b>mil</b> (✕ dos miles). <b>millón</b> 은 복수 <b>millones</b> (악센트 없음).<br>명사 앞 백만 단위에는 <b>de</b>: un millón <b>de</b> habitantes · ocho millones <b>de</b> habitantes.<br>200~900은 여성 명사와 일치: <b>doscientas</b> mil personas.')}
        <div class="items g5"></div></div>`);
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'hay', cls: 'lines', title: 'hay / está / están 중 알맞은 말을 쓰세요.', text:
      ['¿[Hay] un hospital cerca de aquí?', 'El hospital [está] al final de esta calle.', 'En mi barrio [hay] dos parques.', '¿Dónde [están] los servicios?', 'En Lima [hay] muchos restaurantes.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g2', cloze({ id: 'g2', sec: 'gram', skill: 'imp', cls: 'lines', title: '표를 완성하세요 — tú / usted 명령형', text:
      [['girar', 'gira', 'gire'], ['tomar', 'toma', 'tome'], ['cruzar', 'cruza', 'cruce'], ['seguir', 'sigue', 'siga'], ['mirar', 'mira', 'mire']]
        .map(([v, t, u]) => `<p><b class="vinf">${v}</b> → tú [${t}] · usted [${u}]</p>`).join('') }));
    put(s, '.g3', cloze({ id: 'g3', sec: 'gram', skill: 'dir', cls: 'lines', title: '알맞은 말을 쓰세요.', text:
      ['La gasolinera está [en] la calle San Pedro.', 'El banco está un poco [lejos], a unos quinientos metros. <i>(멀리)</i>',
        'Sí, hay una al [final] de esta calle. <i>(끝)</i>', 'El aeropuerto está lejos [del] centro.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g4', cloze({ id: 'g4', sec: 'gram', skill: 'dir', cls: 'lines', title: 'por / a / al / de 중 알맞은 말을 쓰세요.', text:
      ['¿Hay una parada de autobús [por] aquí?', 'Gire [a] la izquierda.', 'Me gusta pasear [por] el parque.', 'Vamos [al] museo.'].map(x => `<p>${x}</p>`).join('') }));
    [['200 000 <i>(personas)</i>', ['doscientas mil personas', 'doscientas mil']], ['3 000 000 <i>(habitantes)</i>', ['tres millones de habitantes']],
      ['1 000 000 <i>(habitantes)</i>', ['un millón de habitantes']], ['2 500 000', ['dos millones quinientos mil']]].forEach(([p, a], i) =>
      put(s, '.g5', writeItem({ id: 'g5-' + i, sec: 'gram', skill: 'num', prompt: `<b class="dg">${p}</b> 를 글자로 쓰세요`, answers: a })));
  };

  /* ================= Diálogo 1 ================= */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Una señora en coche pregunta a una chica dónde hay una gasolinera.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <div class="route1">${route1SVG()}<p class="small">🗺️ 대화 속 길: 첫 번째 길에서 오른쪽 → 직진 → 라 파스 광장을 건너 → 두 번째 길에서 왼쪽 → ⛽</p></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">Por favor / Disculpe</span><span class="hlc c1">¿Sabe usted si hay una gasolinera cerca de aquí?</span><span class="hlc c2">¿Puede decirme cómo llegar?</span><span class="hlc c0">Tome la segunda calle</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    $('#hide1', s).onclick = e => { const t = $('#d1txt', s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'imp', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['<u>Oiga, perdone</u>, ¿hay una gasolinera cerca de aquí? → <span class="chip">Disculpe</span>', ['Disculpe, ¿hay una gasolinera cerca de aquí?', 'Por favor, ¿hay una gasolinera cerca de aquí?']],
      ['Oiga, perdone, <u>¿hay una gasolinera cerca de aquí?</u> → <span class="chip">¿Sabe usted si …?</span>', ['¿Sabe usted si hay una gasolinera cerca de aquí?', 'Oiga, perdone, ¿sabe usted si hay una gasolinera cerca de aquí?']],
      ['Ah, perfecto. <u>¿Y cómo voy hasta allí?</u> → <span class="chip">¿Puede decirme …?</span>', ['¿Puede decirme cómo llegar?', '¿Y puede decirme cómo llegar?', 'Ah, perfecto. ¿Puede decirme cómo llegar?']],
      ['Luego <u>gire en la segunda calle</u> a la izquierda. → <span class="chip">Tome</span>', ['Luego tome la segunda calle a la izquierda.', 'Tome la segunda calle a la izquierda.']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: i === 3 ? 'imp' : 'hay', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '길에서 모르는 어른(usted)에게 약국·은행·지하철역 가는 길을 묻고 답하는 대화를 5~7줄로 쓰세요.',
      ph: 'A: Disculpe, ¿hay una farmacia cerca de aquí?\nB: Sí, …',
      must: [{ re: W0 + '(oiga|perdone|disculpe|por favor)' + W1, label: '말 걸기 (Oiga / Perdone / Disculpe / Por favor)' }, { re: '¿\\s*(sabe (usted )?si )?hay' + W1, label: '¿Hay …? / ¿Sabe usted si hay …?' },
        { re: W0 + '(gire|siga|tome|cruce|coja|mire)' + W1, label: 'usted 명령형 2개 이상 (gire, siga, tome, cruce…)', min: 2 }, { re: 'a la (derecha|izquierda)', label: 'a la derecha / a la izquierda' }, { re: W0 + 'gracias' + W1, label: 'gracias' }],
      model: 'A: Disculpe, ¿hay una farmacia cerca de aquí? B: Sí, hay una en la calle Mayor. A: ¿Y cómo voy hasta allí? B: Siga todo recto, cruce la plaza y tome la primera calle a la derecha. A: Muchas gracias. B: De nada.' }));
  };

  /* 대화 1 경로 그림 */
  function route1SVG() {
    return `<svg class="r1" viewBox="0 0 520 170" role="img" aria-label="대화 1 경로">
      <rect x="0" y="0" width="520" height="170" rx="12" fill="#f4f1e6"/>
      <rect x="40" y="0" width="24" height="170" fill="#8a8a8a"/><rect x="0" y="120" width="520" height="22" fill="#8a8a8a"/>
      <rect x="0" y="40" width="520" height="22" fill="#8a8a8a"/><rect x="380" y="0" width="22" height="170" fill="#8a8a8a"/><rect x="460" y="0" width="22" height="170" fill="#8a8a8a"/>
      <circle cx="240" cy="131" r="34" fill="#b9dd7a" stroke="#fff" stroke-width="4"/><text x="240" y="128" text-anchor="middle" font-size="11" font-weight="700">Plaza de</text><text x="240" y="141" text-anchor="middle" font-size="11" font-weight="700">La Paz</text>
      <polyline points="52,168 52,131 380,131 391,131 391,51 470,51 471,40" fill="none" stroke="#d6202f" stroke-width="4" stroke-dasharray="8 5" stroke-linejoin="round"/>
      <text x="16" y="165" font-size="22">🚗</text><text x="486" y="30" font-size="24">⛽</text>
      <text x="70" y="158" font-size="11" fill="#5b2a1c">① primera calle a la derecha</text><text x="282" y="160" font-size="11" fill="#5b2a1c">② crúcela</text>
      <text x="300" y="34" font-size="11" fill="#5b2a1c">③ segunda calle a la izquierda</text></svg>`;
  }

  /* ================= Actividad 1 ================= */
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Completa con “hay” o “está”.', { kr: '처음 말하는 장소(un/una) → hay, 정해진 장소(el/la/이름) → está' })}
      <div class="c1"></div>
      <h3 class="h3">✍️ 더 써 보기 — 우리말을 보고 hay / está 로 쓰세요</h3><div class="items two w1"></div>`);
    put(s, '.c1', cloze({ id: 'a1c', sec: 'a1', skill: 'hay', cls: 'lines modelo-like', text: [
      '1) ¿Dónde [está] el banco más cercano? — [Está] un poco lejos, a unos quinientos metros.',
      '2) Oiga, perdone. ¿[Hay] una farmacia en esta calle? — Sí, [hay] una al final de esta calle, a la izquierda.',
      '3) Perdone, ¿sabe dónde [está] el Cine Avenida? — Sí, mire, [está] detrás de ese edificio.',
      '4) Oiga, perdone, ¿dónde [hay] una comisaría, por favor? — Lo siento, pero no soy de aquí. No conozco este barrio.',
      '5) Oye, perdona, el Museo de Cera [está] cerca de aquí, ¿verdad? — Sí, [está] en la siguiente calle.',
      '6) ¿Sabes si [hay] un banco por aquí cerca? — Sí, en esta misma calle, a unos cinco minutos.'].map(x => `<p>${x}</p>`).join('') }));
    [['이 근처에 병원이 있나요?', ['¿Hay un hospital cerca de aquí?', '¿Hay un hospital por aquí?', '¿Hay un hospital por aquí cerca?']],
      ['지하철역은 어디에 있나요?', ['¿Dónde está la estación de metro?', '¿Dónde está el metro?', '¿Dónde está la estación del metro?']]]
      .forEach(([p, a], i) => put(s, '.w1', writeItem({ id: 'a1-w' + i, sec: 'a1', skill: 'hay', prompt: p, answers: a })));
  };

  /* ================= Actividad 2 ================= */
  function mini(kind) {
    const roads = kind === 'c' ? [12] : [12, 50];
    const P = { a: [[50, 98], [50, 55], [16, 55]], b: [[50, 98], [50, 17], [86, 17]], c: [[50, 98], [50, 22]], d: [[50, 98], [50, 55], [84, 55]], e: [[50, 98], [50, 38]] }[kind];
    const [x1, y1] = P[P.length - 2], [x2, y2] = P[P.length - 1];
    const a = Math.atan2(y2 - y1, x2 - x1), h = (t, r) => `${x2 + Math.cos(a + t) * r},${y2 + Math.sin(a + t) * r}`;
    return `<svg class="mini" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/>
      <rect x="4" y="${roads.length > 1 ? 64 : 26}" width="38" height="${roads.length > 1 ? 32 : 70}" rx="2" fill="#8cc63f"/><rect x="58" y="${roads.length > 1 ? 64 : 26}" width="38" height="${roads.length > 1 ? 32 : 70}" rx="2" fill="#8cc63f"/>
      ${roads.length > 1 ? '<rect x="4" y="26" width="38" height="20" fill="#ddd"/><rect x="58" y="26" width="24" height="20" fill="#ddd"/><rect x="84" y="26" width="12" height="20" fill="#8cc63f"/>' : ''}
      <rect x="44" y="0" width="12" height="100" fill="#555"/>${roads.map(y => `<rect x="0" y="${y}" width="100" height="10" fill="#555"/>`).join('')}
      <polyline points="${P.map(p => p.join(',')).join(' ')}" fill="none" stroke="#e8281e" stroke-width="4" stroke-linejoin="round"/>
      <polygon points="${x2 + Math.cos(a) * 4},${y2 + Math.sin(a) * 4} ${h(2.5, 8)} ${h(-2.5, 8)}" fill="#e8281e"/><rect x="46" y="88" width="8" height="10" rx="2" fill="#c33"/></svg>`;
  }
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Relaciona.', { kr: '왼쪽 지시문을 누르고 오른쪽 그림을 누르세요. 빨간 화살표가 자동차가 가는 길이에요.' })}
      <div class="pmx"></div>
      <h3 class="h3">✍️ 친구에게 말하듯 tú 명령형으로 바꿔 쓰세요</h3><div class="items two w2"></div>`);
    const PAIRS = [['Siga todo recto.', 'c', 'Sigue todo recto.'], ['Cruce la calle.', 'e', 'Cruza la calle.'], ['Tome la segunda calle a la derecha.', 'b', 'Toma la segunda calle a la derecha.'],
      ['Gire a la izquierda.', 'a', 'Gira a la izquierda.'], ['Gire a la derecha.', 'd', 'Gira a la derecha.']];
    put(s, '.pmx', pairMatch({ id: 'a2m', sec: 'a2', skill: 'dir', pairs: PAIRS.map(([t, k]) => [`<b>${t}</b>`, mini(k)]) }));
    PAIRS.forEach(([t, k, tu], i) => put(s, '.w2', writeItem({ id: 'a2-w' + i, sec: 'a2', skill: 'imp', prompt: `<span class="mini-in">${mini(k)}</span> ${t} → <b>tú</b>`, ph: 'tú …',
      answers: tu === 'Sigue todo recto.' ? [tu, 'Sigue recto.'] : tu === 'Toma la segunda calle a la derecha.' ? [tu, 'Gira en la segunda calle a la derecha.', 'Coge la segunda calle a la derecha.'] : [tu] })));
  };

  /* ================= Actividad 3 ================= */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Completa las dos columnas con las instrucciones que faltan.', { kr: '친구에게(tú) ↔ 어른에게(usted) 바꿔 쓰기' })}
      <div class="c3"></div>
      ${tip('<b>oír</b> → Oye / Oiga · <b>perdonar</b> → Perdona / Perdone · <b>disculpar</b> → Disculpa / Disculpe · <b>mirar</b> → Mira / Mire')}
      <h3 class="h3">✍️ 대화 1의 지시문을 tú 명령형으로 바꿔 쓰세요</h3><div class="items two w3"></div>`);
    const row = (n, t, u) => `<tr><td class="n">${n})</td><td>${t}</td><td>${u}</td></tr>`;
    put(s, '.c3', cloze({ id: 'a3c', sec: 'a3', skill: 'imp', text: `<table class="dt tu"><tr><th></th><th>Tú</th><th>Usted</th></tr>
      ${row(1, 'Oye.', '[Oiga]')}${row(2, '[Perdona]', 'Perdone.')}${row(3, '[Disculpa]', 'Disculpe.')}${row(4, 'Mira.', '[Mire]')}
      ${row(5, 'Sigue recto.', '[Siga recto|Siga todo recto]')}${row(6, '[Toma la primera a la derecha|Coge la primera a la derecha|Toma la primera calle a la derecha]', 'Tome la primera a la derecha.')}
      ${row(7, 'Gira a la izquierda.', '[Gire a la izquierda]')}${row(8, 'Cruza la plaza.', '[Cruce la plaza]')}</table>` }));
    [['Crúcela. <span class="small">(cruzar + la)</span>', ['Crúzala.']], ['Tome la segunda calle.', ['Toma la segunda calle.', 'Coge la segunda calle.']]]
      .forEach(([p, a], i) => put(s, '.w3', writeItem({ id: 'a3-w' + i, sec: 'a3', skill: 'imp', prompt: `usted: <i>${p}</i> → <b>tú</b>`, answers: a })));
  };

  /* ================= Actividad 4 — 격자 지도 ================= */
  const GP = 54, GX = v => 7 + v * GP, GY = h => 7 + h * GP;
  function gridSVG(id, opt) {
    let g = `<rect x="0" y="0" width="770" height="338" rx="10" fill="#cfcfcf"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) g += `<rect class="gb" data-k="${r},${c}" x="${14 + c * GP}" y="${14 + r * GP}" width="40" height="40" rx="8"/>`;
    (opt.routes || []).forEach(rt => { g += `<polyline class="groute" points="${rt.pts.map(([v, h]) => GX(v) + ',' + GY(h)).join(' ')}" stroke="${rt.color}"/>`; });
    g += `<line x1="${GX(7)}" y1="338" x2="${GX(7)}" y2="${GY(3) + 10}" stroke="#e8281e" stroke-width="4"/><polygon points="${GX(7)},${GY(3) - 2} ${GX(7) - 7},${GY(3) + 12} ${GX(7) + 7},${GY(3) + 12}" fill="#e8281e"/>
      <circle cx="${GX(7)}" cy="${GY(3)}" r="16" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/><text x="${GX(7)}" y="${GY(3) - 20}" text-anchor="middle" class="here">Estás aquí</text>`;
    (opt.items || []).forEach(it => { if (it.r == null) return; g += `<text x="${14 + it.c * GP + 20}" y="${14 + it.r * GP + 29}" text-anchor="middle" font-size="24" class="gi">${it.e}</text>${it.n ? `<circle cx="${14 + it.c * GP + 37}" cy="${14 + it.r * GP + 3}" r="9" fill="${it.col || '#5b2a1c'}"/><text x="${14 + it.c * GP + 37}" y="${14 + it.r * GP + 7}" text-anchor="middle" font-size="11" fill="#fff" font-weight="700">${it.n}</text>` : ''}`; });
    return `<svg class="gmap" id="${id}" viewBox="0 0 770 338" role="img" aria-label="동네 지도">${g}</svg>`;
  }
  const A4 = [
    { k: 'hotel', e: '🏨', es: 'el hotel', ins: 'Siga todo recto y gire en la segunda calle a la derecha. El hotel está en la esquina, a la izquierda.', ans: '0,7', pts: [[7, 3], [7, 1], [7.7, 1]] },
    { k: 'cine', e: '🎬', es: 'el cine', ins: 'Siga todo recto y gire en la primera calle a la izquierda. El cine está en la esquina, a la derecha.', ans: '1,6', pts: [[7, 3], [7, 2], [6.3, 2]] },
    { k: 'museo', e: '🏛️', es: 'el museo', ins: 'Gire a la derecha y tome la segunda calle a la izquierda. El museo está en la esquina, a la izquierda.', ans: '2,8', pts: [[7, 3], [9, 3], [9, 2.3]] },
    { k: 'hospital', e: '🏥', es: 'el hospital', ins: 'Gire a la izquierda, siga todo recto y gire en la tercera calle a la izquierda. El hospital está en la esquina, a la izquierda.', ans: '3,4', pts: [[7, 3], [4, 3], [4, 3.7]] }
  ];
  const A4B = [
    { e: '💊', es: 'la farmacia', dest: 'a la farmacia', kr: '약국', r: 1, c: 6, col: '#2a8bd0', pts: [[7, 3], [7, 1], [6.3, 1]], ans: ['recto', 2, 'izquierda'] },
    { e: '🏦', es: 'el banco', dest: 'al banco', kr: '은행', r: 2, c: 8, col: '#2e9d5b', pts: [[7, 3], [8, 3], [8, 2.3]], ans: ['derecha', 1, 'izquierda'] },
    { e: '👮', es: 'la comisaría', dest: 'a la comisaría', kr: '경찰서', r: 0, c: 7, col: '#8a5cc8', pts: [[7, 3], [7, 0], [7.7, 0]], ans: ['recto', 3, 'derecha'] },
    { e: '🚏', es: 'la parada de autobús', dest: 'a la parada de autobús', kr: '버스 정류장', r: 2, c: 5, col: '#f26a21', pts: [[7, 3], [5, 3], [5, 2.3]], ans: ['izquierda', 2, 'derecha'] }
  ];
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Coloca en tu mapa: el cine, el hotel, el museo y el hospital. Pregunta a tu compañero cómo llegar.', { kr: '지도에서 나는 빨간 화살표 끝(Estás aquí)에 서서 위(북쪽)를 보고 있어요.' })}
      <h3 class="h3">① 짝꿍의 설명을 듣고 건물을 지도에 놓으세요</h3>
      ${tip('건물을 고르고 → 🔊 설명을 듣고(읽고) → 도착한 <b>모퉁이(esquina) 블록</b>을 누르세요. <b>la primera calle</b> = 처음 만나는 길, <b>a la izquierda</b> = 내가 가는 방향의 왼쪽.')}
      <div class="mode a4tabs"></div><div class="a4ins notice"></div>
      <div class="gwrap a4map"></div>
      <div class="item-row"><button class="btn ghost a4rst">다시</button><button class="btn chk a4chk">채점하기</button><span class="a4score"></span></div>
      <h3 class="h3">② 이번엔 내가 길을 물어보고 안내하기 — 지도의 색 경로를 보고 쓰세요</h3>
      <div class="gwrap">${gridSVG('a4b', { items: A4B.map((b, i) => ({ r: b.r, c: b.c, e: b.e, n: i + 1, col: b.col })), routes: A4B.map(b => ({ pts: b.pts, color: b.col })) })}</div>
      ${modelo('A: Oiga, perdone, ¿cómo puedo llegar a la farmacia?<br>B: Siga todo recto y gire en la segunda calle a la izquierda.')}
      <div class="items a4w"></div>`);
    const st = sel('a4', {});
    let act = 0;
    A4.forEach((b, i) => reg('a4-p' + i, 'a4', 'dir'));
    const draw = (graded) => {
      $('.a4tabs', s).innerHTML = A4.map((b, i) => `<button data-i="${i}" class="${i === act ? 'on' : ''}">${b.e} ${b.es} ${st[b.k] ? '📍' : ''}<span class="tmk"></span></button>`).join('');
      $$('.a4tabs button', s).forEach(bt => bt.onclick = () => { act = +bt.dataset.i; draw(); });
      $('.a4ins', s).innerHTML = `<b>${A4[act].e} ${cap(A4[act].es)}:</b> “${A4[act].ins}” ${say(A4[act].ins)}`;
      const items = A4.map(b => { const k = st[b.k]; if (!k) return {}; const [r, c] = k.split(',').map(Number); return { r, c, e: b.e }; });
      $('.a4map', s).innerHTML = gridSVG('a4a', { items, routes: graded ? A4.map(b => ({ pts: b.pts, color: '#2e9d5b' })) : [] });
      $$('.a4map .gb', s).forEach(r => {
        r.classList.add('click');
        r.onclick = () => { const k = r.dataset.k; A4.forEach(b => { if (st[b.k] === k) delete st[b.k]; }); st[A4[act].k] = k; save(); const nx = A4.findIndex(b => !st[b.k]); if (nx >= 0) act = nx; draw(); };
      });
      if (graded) A4.forEach((b, i) => { const ok = st[b.k] === b.ans; $$('.a4tabs .tmk', s)[i].innerHTML = MARK(ok ? 1 : 0); const [r, c] = b.ans.split(',').map(Number); if (!ok) $('#a4a', s).insertAdjacentHTML('beforeend', `<rect x="${14 + c * GP}" y="${14 + r * GP}" width="40" height="40" rx="8" fill="none" stroke="#2e9d5b" stroke-width="3" stroke-dasharray="4 3"/><text x="${14 + c * GP + 20}" y="${14 + r * GP + 28}" text-anchor="middle" font-size="18" opacity=".55">${b.e}</text>`); });
    };
    draw();
    $('.a4rst', s).onclick = () => { A4.forEach(b => delete st[b.k]); save(); act = 0; $('.a4score', s).innerHTML = ''; draw(); };
    $('.a4chk', s).onclick = () => {
      let ok = 0;
      A4.forEach((b, i) => { const g = st[b.k] === b.ans; if (g) ok++; record('a4-p' + i, g ? 1 : 0, g ? [] : ['estructura'], {}); });
      draw(true);
      $('.a4score', s).innerHTML = `${MARK(ok / 4)} <b>${ok} / 4</b> <span class="small">초록 점선 = 정답 경로</span>`;
    };
    A4B.forEach((b, i) => {
      put(s, '.a4w', writeItem({ id: 'a4-q' + i, sec: 'a4', skill: 'dir', prompt: `<b class="nbadge" style="background:${b.col}">${i + 1}</b> ${b.e} ${b.kr}에 어떻게 가는지 정중하게(usted) 물어보세요.`, ph: '¿Cómo puedo llegar …?', answers: askWay(b.dest) }));
      put(s, '.a4w', writeItem({ id: 'a4-d' + i, sec: 'a4', skill: 'imp', prompt: `↳ 지도의 <b style="color:${b.col}">${i + 1}번 경로</b>를 usted 명령형으로 안내하세요.`, ph: 'Siga todo recto y …', answers: dirAns(...b.ans) }));
    });
  };

  /* ================= Actividad 5 — 산티아고 지하철 ================= */
  const LC = { 1: '#d6202f', 2: '#f28c00', 5: '#16a34a', '4A': '#1d5fc9' };
  const MLINES = {
    5: [[-20, 640], [-20, 480], [60, 380], [60, 172], [82, 150], [760, 150], [800, 185], [800, 480]],
    1: [[150, 150], [165, 190], [190, 215], [800, 215]],
    2: [[655, 40], [630, 55], [578, 78], [560, 98], [560, 700]],
    '4A': [[560, 700], [860, 700]]
  };
  /* [이름, x, y, 라벨위치] — L 왼쪽, R 오른쪽, U 위로 비스듬히, D 아래로 비스듬히, B 아래, X 환승역 */
  const MST = [
    ['Plaza de Maipú', -20, 630, 'L'], ['Santiago Bueras', -20, 560, 'L'], ['Del Sol', -20, 495, 'L'], ['Monte Tabor', 20, 430, 'L'], ['Las Parcelas', 60, 368, 'L'],
    ['Laguna Sur', 60, 318, 'L'], ['Barrancas', 60, 268, 'L'], ['Pudahuel', 60, 218, 'L'], ['San Pablo', 150, 150, 'X'],
    ['Lo Prado', 218, 150, 'U'], ['Blanqueado', 286, 150, 'U'], ['Gruta de Lourdes', 354, 150, 'U'], ['Quinta Normal', 422, 150, 'U'], ['Cumming', 490, 150, 'U'],
    ['Santa Ana', 560, 150, 'X'], ['Plaza de Armas', 630, 150, 'U'], ['Bellas Artes', 700, 150, 'U'], ['Baquedano', 800, 215, 'X'],
    ['Parque Bustamante', 800, 265, 'R'], ['Santa Isabel', 800, 305, 'R'], ['Irarrázaval', 800, 345, 'R'], ['Ñuble', 800, 385, 'R'], ['Rodrigo de Araya', 800, 425, 'R'], ['Carlos Valdovinos', 800, 465, 'R'],
    ['Neptuno', 165, 190, 'D'], ['Pajaritos', 205, 215, 'D'], ['Las Rejas', 248, 215, 'D'], ['Ecuador', 291, 215, 'D'], ['San Alberto Hurtado', 334, 215, 'D'], ['U. de Santiago', 377, 215, 'D'],
    ['Estación Central', 420, 215, 'D'], ['U.L.A.', 463, 215, 'D'], ['República', 506, 215, 'D'], ['Los Héroes', 560, 215, 'X'],
    ['La Moneda', 608, 215, 'E'], ['U. de Chile', 656, 215, 'E'], ['Santa Lucía', 704, 215, 'E'], ['U. Católica', 752, 215, 'U'],
    ['Patronato', 630, 55, 'R'], ['Puente Cal y Canto', 560, 98, 'P'], ['Toesca', 560, 295, 'L'], ["Parque O'Higgins", 560, 330, 'L'], ['Rondizzoni', 560, 365, 'L'], ['Franklin', 560, 410, 'L'],
    ['El Llano', 560, 445, 'L'], ['San Miguel', 560, 480, 'L'], ['Lo Vial', 560, 515, 'L'], ['Departamental', 560, 550, 'L'], ['Ciudad del Niño', 560, 585, 'L'], ['Lo Ovalle', 560, 620, 'L'], ['El Parrón', 560, 655, 'L'],
    ['La Cisterna', 560, 700, 'X'], ['San Ramón', 680, 700, 'B'], ['Santa Rosa', 790, 700, 'B']
  ];
  const XLAB = { 'San Pablo': [140, 136, 'end'], 'Santa Ana': [572, 180, 'start'], 'Los Héroes': [550, 204, 'end'], 'Baquedano': [812, 210, 'start'], 'La Cisterna': [548, 724, 'end'] };
  function metroSVG() {
    let g = `<rect x="-150" y="20" width="1070" height="750" fill="#fdfcf7"/>`;
    g += `<text x="636" y="194" font-size="10" fill="#2e9d5b" font-weight="700">CERRO SANTA LUCÍA</text>`;
    Object.keys(MLINES).forEach(k => { g += `<polyline points="${MLINES[k].map(p => p.join(',')).join(' ')}" fill="none" stroke="${LC[k]}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`; });
    MST.forEach(([n, x, y, lp]) => {
      const X = lp === 'X';
      let lab = '';
      if (X) { const [lx, ly, an] = XLAB[n]; lab = `<text class="stl x" x="${lx}" y="${ly}" text-anchor="${an}">${esc(n.toUpperCase())}</text>`; }
      else if (lp === 'L') lab = `<text class="stl" x="${x - 12}" y="${y + 4}" text-anchor="end">${esc(n)}</text>`;
      else if (lp === 'R') lab = `<text class="stl" x="${x + 12}" y="${y + 4}">${esc(n)}</text>`;
      else if (lp === 'B') lab = `<text class="stl" x="${x}" y="${y + 24}" text-anchor="middle">${esc(n)}</text>`;
      else if (lp === 'U') lab = `<text class="stl" transform="translate(${x + 5},${y - 10}) rotate(-40)">${esc(n)}</text>`;
      else if (lp === 'P') lab = `<text class="stl" x="${x - 10}" y="${y - 22}" text-anchor="end">${esc(n)}</text>`;
      else if (lp === 'E') lab = `<text class="stl" transform="translate(${x + 3},${y + 14}) rotate(40)">${esc(n)}</text>`;
      else lab = `<text class="stl" transform="translate(${x - 3},${y + 14}) rotate(-40)" text-anchor="end">${esc(n)}</text>`;
      g += `<g class="st${X ? ' xc' : ''}" data-n="${esc(n)}"><circle class="hit" cx="${x}" cy="${y}" r="13"/><circle class="dot" cx="${x}" cy="${y}" r="${X ? 8 : 5}"/>${lab}</g>`;
    });
    const badge = (x, y, t, c) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${t.length > 1 ? 11 : 15}" font-weight="900" fill="#fff">${t}</text>`;
    g += badge(150, 100, '1', LC[1]) + badge(-20, 668, '5', LC[5]) + badge(545, 752, '2', LC[2]) + badge(578, 752, '4A', LC['4A']);
    return `<svg class="metro" viewBox="-150 20 1070 750" role="img" aria-label="산티아고 지하철 노선도">${g}</svg>`;
  }
  const A5P = [
    { t: D.metro5, a: 'Estación Central', kr: '교재 듣기 (TRANSCRIPCIONES)' },
    { t: 'Toma la línea dos en Franklin en dirección a Patronato y baja en Los Héroes. Allí cambia a la línea uno en dirección a Baquedano y baja en la segunda parada.', a: 'U. de Chile' },
    { t: 'Toma la línea uno en San Pablo en dirección a Baquedano y baja en Los Héroes. Allí cambia a la línea dos en dirección a La Cisterna y baja en la cuarta parada.', a: 'Franklin' },
    { t: 'Toma la línea cuatro A en Santa Rosa en dirección a La Cisterna. En La Cisterna cambia a la línea dos en dirección a Patronato y baja en la sexta parada.', a: 'San Miguel' }
  ];
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'a) Mira el mapa del metro de Santiago de Chile. Escucha las indicaciones y adivina a qué estación llegarás.', { listen: true, kr: '문제를 고르고 ▶ 듣기 → 노선을 따라가서 도착역을 누르세요.' })}
      <div class="mode a5tabs"></div><div class="a5q notice"></div>
      <div class="metro-wrap">${metroSVG()}</div>
      <div class="item-row"><button class="btn chk a5chk">채점하기</button><span class="a5score"></span></div>
      ${tip('<b>Toma</b> la línea … (타다) · <b>baja</b> en … (내리다) · <b>cambia</b> a la línea … (갈아타다) · en dirección a … (~방면) · la primera / segunda / tercera <b>parada</b> (첫째·둘째·셋째 정거장)')}
      <h3 class="h3">✍️ 듣기 대본 받아쓰기</h3><div class="c5"></div>
      <h2 class="act-title">b) ¿Qué otras rutas recomendarías para ir al mismo lugar? Explícale a tu compañero.</h2>
      <div class="f5"></div>`);
    const st = sel('a5', {});
    let act = 0;
    A5P.forEach((p, i) => reg('a5-p' + i, 'a5', 'dir'));
    const paint = graded => {
      $('.a5tabs', s).innerHTML = A5P.map((p, i) => `<button data-i="${i}" class="${i === act ? 'on' : ''}">🎧 ${i === 0 ? 'Libro' : 'Ruta ' + (i + 1)} ${st[i] ? '· ' + esc(st[i]) : ''}<span class="tmk"></span></button>`).join('');
      $$('.a5tabs button', s).forEach(b => b.onclick = () => { act = +b.dataset.i; paint(); });
      const p = A5P[act];
      $('.a5q', s).innerHTML = `<button class="btn sm a5play">▶ 듣기</button> <button class="btn ghost sm a5show">대본 보기</button> ${p.kr ? `<span class="small">${p.kr}</span>` : ''}<p class="a5t" hidden>${esc(p.t)}</p><p>내가 고른 도착역: <b class="pick">${st[act] ? esc(st[act]) : '— 지도에서 역을 누르세요'}</b></p>`;
      $('.a5play', s).onclick = e => speak(p.t, e.currentTarget);
      $('.a5show', s).onclick = e => { const t = $('.a5t', s); t.hidden = !t.hidden; e.target.textContent = t.hidden ? '대본 보기' : '대본 가리기'; };
      $$('.metro .st', s).forEach(g => { const n = g.dataset.n; g.classList.toggle('pk', st[act] === n); g.classList.remove('ok', 'no'); if (graded && st[act] === n) g.classList.add(n === p.a ? 'ok' : 'no'); if (graded && st[act] !== p.a && n === p.a) g.classList.add('ok'); });
      if (graded) A5P.forEach((q, i) => { $$('.a5tabs .tmk', s)[i].innerHTML = st[i] ? MARK(st[i] === q.a ? 1 : 0) : ''; });
    };
    let graded = false;
    $$('.metro .st', s).forEach(g => g.onclick = () => { st[act] = g.dataset.n; save(); graded = false; paint(); });
    paint();
    $('.a5chk', s).onclick = () => {
      let ok = 0;
      A5P.forEach((q, i) => { const g = st[i] === q.a; if (g) ok++; record('a5-p' + i, g ? 1 : 0, g ? [] : ['otro'], {}); });
      graded = true; paint(true);
      $('.a5score', s).innerHTML = `${MARK(ok / A5P.length)} <b>${ok} / ${A5P.length}</b> <span class="small">초록 = 정답역 (${esc(A5P[act].a)})</span>`;
    };
    put(s, '.c5', cloze({ id: 'a5c', sec: 'a5', skill: 'dir', cls: 'lines modelo-like', text: lines5() }));
    put(s, '.f5', freeItem({ id: 'a5f', sec: 'a5', rows: 4, prompt: 'Quinta Normal 에서 <b>Estación Central</b> 까지 가는 <b>다른 길</b>을 안내하세요. (힌트: 5호선 → San Pablo → 1호선)',
      ph: 'Toma la línea cinco en Quinta Normal en dirección a …',
      must: [{ re: W0 + '(toma|tome|coge|coja)' + W1, label: 'toma / tome (타다)' }, { re: W0 + '(cambia|cambie)' + W1, label: 'cambia (갈아타다)' }, { re: W0 + '(baja|baje)' + W1, label: 'baja (내리다)' },
        { re: 'en direcci[oó]n a', label: 'en dirección a' }, { re: 'san pablo', label: 'San Pablo (환승역)' }, { re: 'estaci[oó]n central', label: 'Estación Central' }],
      model: 'Toma la línea cinco en Quinta Normal en dirección a Plaza de Maipú y baja en San Pablo. Allí cambia a la línea uno en dirección a Los Héroes y baja en Estación Central, la séptima parada.' }));
    function lines5() {
      return ['Toma el metro, la [línea] cinco, en la estación [Quinta Normal] y [baja] en Santa Ana.', 'Allí [cambia] a la línea dos en [dirección] a La Cisterna y baja en la [primera] parada, en Los Héroes.',
        'Allí cambia otra vez a la línea [uno] en dirección a [San Pablo] y finalmente baja en la [tercera] parada.'].map(x => `<p>${x}</p>`).join('');
    }
  };

  /* ================= Diálogo 2 ================= */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Ana habla con Pablo, un chico de Perú, sobre su ciudad.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <div class="lima"><span>🚌</span><span>✈️</span><span>🏛️</span><span>🚉</span><span>🗺️</span><b>Lima · 8 472 935 habitantes</b></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items two vf"></div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">Eres de Sudamérica, ¿no?</span><span class="hlc c1">Soy peruano</span><span class="hlc c2">¿Qué tal es tu ciudad?</span><span class="hlc c0">Puedes probar comida deliciosa</span></div>
      <div class="items rep"></div>
      ${tip('나라 → 국적 형용사: Perú → peruano/a · Chile → chileno/a · México → mexicano/a · Argentina → argentino/a · Colombia → colombiano/a · Corea → coreano/a')}
      <div class="items two nac"></div>
      <h3 class="h3">c) 나의 도시 소개하기</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    $('#hide2', s).onclick = e => { const t = $('#d2txt', s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };
    [['Pablo es de Chile.', 'Falso'], ['Perú está al norte de Chile.', 'Verdadero'], ['Lima tiene menos de un millón de habitantes.', 'Falso'], ['En Lima hay muchos restaurantes.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'geo', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'geo', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['Eres sudamericano, ¿verdad?', 'Eres de Sudamérica, ¿no?', ['Eres de Sudamérica, ¿no?']], ['Sí, soy de Perú.', 'Soy peruano', ['Sí, soy peruano.']],
      ['¿Cómo es tu ciudad?', '¿Qué tal es tu ciudad?', ['¿Qué tal es tu ciudad?']],
      ['También hay muchos restaurantes donde sirven comida deliciosa.', 'Puedes probar comida deliciosa', ['También hay muchos restaurantes donde puedes probar comida deliciosa.', 'Hay muchos restaurantes donde puedes probar comida deliciosa.']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'geo', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    [['Soy de México. (남자)', ['Soy mexicano.']], ['Soy de Corea. (나)', ['Soy coreano.', 'Soy coreana.']]]
      .forEach(([p, a], i) => put(s, '.nac', writeItem({ id: 'd2-n' + i, sec: 'd2', skill: 'geo', prompt: `${p} → 국적 형용사로`, ph: 'Soy …', answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 5, minWords: 30, prompt: '파블로처럼 나의 도시를 소개하세요: 어디 출신? 도시는 어디에 있나? 인구는? 어떤 도시? 무엇이 있나?',
      ph: 'Soy de Seúl, la capital de Corea. Está en …',
      must: [{ re: W0 + 'soy de' + W1, label: 'Soy de …' }, { re: W0 + 'est[aá] (al|en el) (norte|sur|este|oeste|centro|noreste|noroeste|sureste|sudeste|suroeste|sudoeste)', label: 'Está al norte de / en el sur de …' },
        { re: 'mill[oó]n(es)?|mil' + W1, label: '인구 (millones / mil)' }, { re: W0 + 'es (una ciudad|antigua|moderna|grande|peque[nñ]a|muy)', label: 'Es una ciudad … / Es antigua · moderna' }, { re: W0 + 'hay' + W1, label: 'Hay …' }],
      model: 'Soy de Seúl, la capital de Corea. Seúl está en el noroeste de Corea, al norte de Daejeon. Es una ciudad muy grande con casi diez millones de habitantes. Es antigua y también es muy moderna. Hay muchos palacios, museos y parques. También hay restaurantes donde puedes probar comida deliciosa.' }));
  };

  /* ================= Actividad 6 ================= */
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, '¿Conoces estas ciudades? ¿Qué sabes de ellas?')}
      <h3 class="h3">① 사진 카드 — 어느 도시일까요?</h3><div class="mp6"></div>
      <h3 class="h3">② 이 명소는 어느 도시에 있나요? — 표에 분류하세요</h3><div class="sb6"></div>
      <div class="qlist">${['¿Es una ciudad grande o pequeña?', '¿Es una ciudad turística?', '¿Es una ciudad moderna o antigua?', '¿Tiene un monumento famoso? ¿Cómo se llama el monumento?', '¿Tiene un museo muy famoso? ¿Cómo se llama?', '¿Tiene un parque muy grande? ¿Cómo se llama?', '¿Tiene un río muy famoso? ¿Cuál es el nombre del río?', '¿Está en la costa? ¿Tiene una playa muy bonita?']
        .map((q, i) => `<p>${i + 1}) ${q} ${say(q)}</p>`).join('')}</div>
      <h3 class="h3">③ 위 질문에 답하세요 (Sí, …)</h3><div class="items w6"></div>
      <h3 class="h3">④ 내가 사는 도시는? — 질문 1)~8)에 답하며 소개하기</h3><div class="f6"></div>`);
    put(s, '.mp6', matchPics({ id: 'a6m', sec: 'a6', skill: 'geo', cols: 3, items: [
      { e: '<span class="city ny">🗽🏙️</span>', es: 'Nueva York', cap: 'Estados Unidos' }, { e: '<span class="city bcn">🦎⛪🏖️</span>', es: 'Barcelona', cap: 'España' }, { e: '<span class="city ldn">🕰️🌉💂</span>', es: 'Londres', cap: 'Inglaterra' }] }));
    put(s, '.sb6', sortBoard({ id: 'a6s', sec: 'a6', skill: 'geo', cols: [{ k: 'ny', label: '🗽 Nueva York' }, { k: 'bcn', label: '🦎 Barcelona' }, { k: 'ldn', label: '🕰️ Londres' }],
      chips: [['la Estatua de la Libertad', 'ny'], ['Central Park', 'ny'], ['el río Hudson', 'ny'], ['la Sagrada Familia', 'bcn'], ['el Park Güell', 'bcn'], ['la playa de la Barceloneta', 'bcn'],
        ['el Big Ben', 'ldn'], ['el río Támesis', 'ldn'], ['el Museo Británico', 'ldn']] }));
    const yes = cores => combos(['Sí, ', 'Sí. '], cores).map(x => x.replace(/^Sí\. (.)/, (m, c) => 'Sí. ' + c.toUpperCase()));
    [['🦎 Barcelona: ¿Tiene un monumento famoso? ¿Cómo se llama el monumento?', yes(['tiene un monumento famoso. Se llama la Sagrada Familia.', 'se llama la Sagrada Familia.', 'la Sagrada Familia.', 'es la Sagrada Familia.', 'tiene un monumento famoso, la Sagrada Familia.'])],
      ['🕰️ Londres: ¿Tiene un río muy famoso? ¿Cuál es el nombre del río?', yes(['tiene un río muy famoso. Es el Támesis.', 'tiene un río muy famoso. Se llama Támesis.', 'el Támesis.', 'el río Támesis.', 'es el Támesis.', 'es el río Támesis.', 'se llama Támesis.', 'se llama el Támesis.', 'el nombre del río es Támesis.'])],
      ['🗽 Nueva York: ¿Tiene un parque muy grande? ¿Cómo se llama?', yes(['tiene un parque muy grande. Se llama Central Park.', 'se llama Central Park.', 'Central Park.', 'es Central Park.', 'tiene un parque muy grande, Central Park.'])],
      ['🦎 Barcelona: ¿Está en la costa? ¿Tiene una playa muy bonita?', yes(['está en la costa y tiene una playa muy bonita.', 'está en la costa. Tiene una playa muy bonita.', 'está en la costa y tiene una playa muy bonita, la Barceloneta.', 'está en la costa y tiene playas muy bonitas.'])]]
      .forEach(([p, a], i) => put(s, '.w6', writeItem({ id: 'a6-w' + i, sec: 'a6', skill: 'geo', prompt: p, answers: a })));
    put(s, '.f6', freeItem({ id: 'a6f', sec: 'a6', rows: 5, minWords: 35, prompt: '내가 사는 도시(서울 등)를 1)~8) 질문에 답하는 글로 소개하세요.',
      ph: 'Seúl es una ciudad muy grande y turística. …',
      must: [{ re: 'es una ciudad', label: 'Es una ciudad …' }, { re: '(grande|peque[nñ]a)', label: 'grande / pequeña' }, { re: '(moderna|antigua)', label: 'moderna / antigua' },
        { re: W0 + 'tiene' + W1, label: 'tiene … (2번 이상)', min: 2 }, { re: W0 + 'se llama' + W1, label: 'se llama …' }, { re: 'r[ií]o|playa|costa', label: '강 / 바다 (río · playa · costa)' }],
      model: 'Seúl es una ciudad muy grande y turística. Es antigua y también muy moderna. Tiene un monumento famoso, se llama Gwanghwamun. Tiene un museo muy famoso, el Museo Nacional de Corea. Tiene un parque muy grande, se llama Parque Olímpico. Tiene un río muy famoso, el río Han. No está en la costa.' }));
  };

  /* ================= Actividad 7 — 유럽 지도 ================= */
  const EU = {
    is: { n: 'Islandia', f: '#c8d98a', p: [[-24, 65.5], [-22, 66.4], [-18, 66.2], [-14.5, 66.3], [-13.5, 65], [-15, 64.3], [-18.7, 63.4], [-22.7, 63.8]], l: [-18.5, 64.9] },
    no: { n: 'Noruega', f: '#c8d98a', p: [[5, 62], [5.3, 59], [7, 58], [8.5, 58.2], [10.6, 59.1], [11.5, 59], [12.3, 60.5], [12.2, 61.8], [12, 63.5], [14.3, 65.1], [16, 67.5], [18.5, 68.5], [20.5, 69.1], [22.4, 68.7], [25, 69.6], [28.5, 69.1], [31, 70.2], [28, 71.1], [25, 71.1], [20, 70.2], [16, 69], [13, 68], [12.6, 66], [10.3, 64], [8, 63.3]], l: [8.6, 61.2] },
    se: { n: 'Suecia', f: '#9fa8e6', p: [[11.5, 59], [11.2, 58.3], [12.5, 56.2], [14.2, 55.4], [16, 56.3], [16.6, 57.5], [16.8, 59], [18.5, 59.5], [17.3, 60.6], [17.3, 62.4], [20.7, 63.8], [22.3, 65.8], [24, 65.8], [23.6, 67.5], [20.5, 69.1], [18.5, 68.5], [16, 67.5], [14.3, 65.1], [12, 63.5], [12.2, 61.8], [12.3, 60.5]], l: [15.3, 62.5] },
    fi: { n: 'Finlandia', f: '#e0a8e8', p: [[20.6, 69.05], [23.6, 67.5], [24, 65.8], [25.4, 65], [21.4, 62.8], [21.5, 60.8], [22.9, 59.8], [25.5, 60.3], [27.8, 60.5], [30, 61.5], [31.5, 62.9], [29.6, 64.5], [30, 67.7], [28.8, 68.9], [28.5, 69.1], [27, 70], [25, 69.6], [22.4, 68.7]], l: [26.3, 63.4] },
    gb: { n: 'Inglaterra', f: '#e8a8e0', p: [[-5.7, 50], [1.4, 51.2], [1.7, 52.7], [0, 53.5], [-1.6, 55.6], [-2, 57], [-1.8, 57.6], [-3.3, 58.6], [-5, 58.6], [-6.2, 57.5], [-5.6, 56], [-4.8, 54.8], [-3.2, 54.2], [-3, 53.4], [-4.6, 52.8], [-5.2, 51.7], [-3, 51.5]], l: [-2, 53.2] },
    de: { n: 'Alemania', f: '#7fb8ec', p: [[7, 53.6], [8.9, 53.9], [8.6, 54.9], [10, 54.6], [11, 54], [13.5, 54.4], [14.2, 53.9], [14.6, 52.6], [15, 51.1], [12.1, 50.3], [13.8, 48.8], [13, 47.5], [10, 47.5], [7.6, 47.6], [8.2, 49], [6.4, 49.5], [6, 50.8], [6, 51.8]], l: [10.3, 51.2] },
    fr: { n: 'Francia', f: '#c6e6a0', p: [[-1.8, 43.4], [3.2, 42.4], [4.7, 43.4], [7.5, 43.8], [7, 45.9], [6, 46.4], [7.6, 47.6], [8.2, 49], [6.4, 49.5], [4.5, 50], [2.5, 51.1], [1.6, 50.9], [0.2, 49.7], [-1.3, 49.6], [-1.9, 48.7], [-4.7, 48.4], [-4.4, 47.8], [-2, 47.3], [-1.2, 46.2]], l: [2.4, 46.8] },
    es: { n: 'España', f: '#f6b3a8', p: [[-9.2, 43.2], [-7.7, 43.8], [-1.8, 43.4], [3.2, 42.4], [3.2, 41.9], [0.8, 40.9], [0, 39.5], [-0.6, 38.5], [-2, 36.8], [-5, 36.2], [-6.4, 36.8], [-7.4, 37.2], [-7, 38.2], [-7.3, 39.5], [-6.9, 41.9], [-8.2, 42.1]], l: [-3.6, 40.2] },
    pt: { n: 'Portugal', f: '#f2c14e', p: [[-8.2, 42.1], [-6.9, 41.9], [-7.3, 39.5], [-7, 38.2], [-7.4, 37.2], [-8.9, 37], [-8.8, 38.6], [-9.5, 38.8], [-8.7, 40.7], [-8.8, 42]], l: [-8.1, 39.8] },
    it: { n: 'Italia', f: '#f5c242', p: [[7, 45.9], [7.5, 43.8], [8.8, 44.4], [10.5, 43.8], [12.3, 41.7], [15.6, 40], [15.7, 38], [16.6, 38.4], [17.1, 39.4], [16.5, 39.9], [18.5, 40.1], [16, 41.4], [13.9, 42.9], [12.3, 44.4], [13.7, 45.6], [12.5, 47], [10.5, 46.5]], x: [[[12.4, 38], [15.6, 38.3], [15.1, 36.7]], [[8.2, 41], [9.8, 41], [9.6, 39.1], [8.4, 39]]], l: [12.6, 42.6] },
    gr: { n: 'Grecia', f: '#9cc7ef', p: [[20, 39.6], [21, 40.8], [23, 41.3], [26.3, 41.7], [26, 40.8], [23.8, 40.4], [22.6, 40.2], [23, 39], [24, 38.2], [22.8, 37.6], [23, 36.5], [21.7, 36.8], [21.1, 37.8], [21.8, 38.4], [20.8, 38.8]], x: [[[23.6, 35.5], [26.3, 35.2], [24.5, 35]]], l: [22, 39.3] }
  };
  const EU_GRAY = [
    [[-10, 51.6], [-6, 52], [-6, 54], [-7.5, 55.2], [-10, 54.2]],
    [[8.1, 55.5], [8.6, 57.1], [10.6, 57.7], [10.5, 56.5], [12.6, 55.6], [10, 54.8]],
    [[2.5, 51.1], [3.6, 51.4], [4.8, 53.2], [7, 53.6], [6, 51.8], [6, 50.8], [6.4, 49.5], [4.5, 50]],
    [[6, 46.4], [7, 45.9], [10.5, 46.5], [12.5, 47], [16.9, 48.1], [17, 48.6], [15, 49], [13.8, 48.8], [13, 47.5], [10, 47.5], [7.6, 47.6]],
    [[14.2, 53.9], [18, 54.8], [21.3, 55.2], [21, 56.8], [23.5, 57.2], [24.3, 57.9], [23.5, 58.9], [28, 59.5], [32, 60], [32, 46.5], [30.7, 46.5], [29.6, 45.3], [28.6, 44], [27.9, 42.5], [26.3, 41.7], [23, 41.3], [21, 40.8], [20, 39.6], [19.4, 40.3], [19.5, 42], [18.5, 42.5], [16, 43.5], [13.7, 45.6], [12.5, 47], [16.9, 48.1], [17, 48.6], [15, 49], [13.8, 48.8], [12.1, 50.3], [15, 51.1], [14.6, 52.6]],
    [[26, 40.8], [29, 41.2], [32, 41.5], [32, 36.5], [28, 36.7], [26.3, 38.5]],
    [[28.5, 69.1], [31, 70.2], [32, 70], [32, 60], [30, 61.5], [31.5, 62.9], [29.6, 64.5], [30, 67.7], [28.8, 68.9]]
  ];
  const euP = ([lo, la]) => [((lo + 26) * 5.8).toFixed(1), ((72.5 - la) * 10).toFixed(1)];
  const poly = (pts, cls, extra) => `<polygon class="${cls}" ${extra || ''} points="${pts.map(p => euP(p).join(',')).join(' ')}"/>`;
  function euSVG() {
    let g = `<rect width="340" height="390" fill="#e3f3fa"/>` + EU_GRAY.map(p => poly(p, 'gray')).join('');
    Object.keys(EU).forEach(k => { const c = EU[k]; g += `<g class="cty" data-c="${k}">${poly(c.p, 'land', `fill="${c.f}"`)}${(c.x || []).map(p => poly(p, 'land', `fill="${c.f}"`)).join('')}<text class="cl" x="${euP(c.l)[0]}" y="${euP(c.l)[1]}" text-anchor="middle">${c.n}</text></g>`; });
    return `<svg class="eumap" viewBox="0 0 340 390" role="img" aria-label="유럽 지도">${g}</svg>`;
  }
  const A7Q = [
    { c: 'se', t: 'Está en el norte de Europa, entre Noruega y Finlandia.', kr: 'entre A y B = A와 B 사이' },
    { c: 'pt', t: 'Está en el oeste de Europa, al oeste de España.' },
    { c: 'de', t: 'Está en el centro de Europa, al este de Francia.' },
    { c: 'it', t: 'Está en el sur de Europa, al sudeste de Francia.' },
    { c: 'is', t: 'Es una isla. Está en el noroeste de Europa.', kr: 'isla = 섬' },
    { c: 'gr', t: 'Está en el sudeste de Europa.' }
  ];
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Busca los países en el mapa y pregunta a tu compañero dónde están.')}
      <h3 class="h3">① 나침반 — 방위를 스페인어로 쓰세요</h3><div class="cmp"></div>
      ${modelo('A: ¿Dónde está España?<br>B: España está en el sur de Europa, al este de Portugal.')}
      ${tip('<b>en el</b> sur de Europa = 유럽 <u>안에서</u> 남쪽 / <b>al</b> este de Portugal = 포르투갈의 동쪽 <u>바깥</u>에 (a + el = al)')}
      <h3 class="h3">② 설명을 읽고 지도에서 그 나라를 누르세요</h3>
      <div class="mode a7tabs"></div><div class="a7q notice"></div>
      <div class="eu-wrap">${euSVG()}<div class="eu-side"><button class="btn ghost sm a7names">나라 이름 보기</button><p class="small">이름을 가리고 풀어 보세요! 채점하면 맞힌 나라는 이름이 나타나요.</p></div></div>
      <div class="item-row"><button class="btn chk a7chk">채점하기</button><span class="a7score"></span></div>
      <h3 class="h3">③ 지도를 보고 빈칸을 채우세요</h3><div class="c7"></div>
      <h3 class="h3">④ 한국은 어디에 있나요?</h3><div class="f7"></div>`);
    const kr = { norte: '북', sur: '남', este: '동', oeste: '서', noreste: '북동', noroeste: '북서', sudeste: '남동', sudoeste: '남서' };
    const cell = a => `<span class="cw"><small>${kr[a.split('|')[0]]}</small>[${a}]</span>`;
    put(s, '.cmp', cloze({ id: 'a7k', sec: 'a7', skill: 'geo', cls: 'compass', text: `<div class="cgrid3">${cell('noroeste')}${cell('norte')}${cell('noreste|nordeste')}${cell('oeste')}<span class="rose">${rose()}</span>${cell('este')}${cell('sudoeste|suroeste')}${cell('sur')}${cell('sudeste|sureste')}</div>` }));
    const st = sel('a7', {});
    let act = 0, showN = false, graded = {};
    A7Q.forEach((q, i) => reg('a7-p' + i, 'a7', 'geo'));
    const paint = () => {
      $('.a7tabs', s).innerHTML = A7Q.map((q, i) => `<button data-i="${i}" class="${i === act ? 'on' : ''}">${i + 1}) ${st[i] ? '📍' : '?'}<span class="tmk">${graded[i] != null ? MARK(graded[i]) : ''}</span></button>`).join('');
      $$('.a7tabs button', s).forEach(b => b.onclick = () => { act = +b.dataset.i; paint(); });
      const q = A7Q[act];
      $('.a7q', s).innerHTML = `<b>${act + 1})</b> “${q.t}” ${say(q.t)} ${q.kr ? `<span class="small">(${q.kr})</span>` : ''}<br>내가 고른 나라: <b>${st[act] ? EU[st[act]].n : '—'}</b>`;
      $$('.eumap .cty', s).forEach(g => { const c = g.dataset.c; g.classList.toggle('pk', st[act] === c); g.classList.toggle('named', showN || A7Q.some((x, i) => graded[i] === 1 && x.c === c)); });
    };
    $$('.eumap .cty', s).forEach(g => g.onclick = () => { st[act] = g.dataset.c; save(); if (act < A7Q.length - 1 && !st[act + 1]) act++; paint(); });
    $('.a7names', s).onclick = e => { showN = !showN; e.target.textContent = showN ? '나라 이름 가리기' : '나라 이름 보기'; paint(); };
    $('.a7chk', s).onclick = () => {
      let ok = 0;
      A7Q.forEach((q, i) => { const g = st[i] === q.c; if (g) ok++; graded[i] = g ? 1 : 0; record('a7-p' + i, g ? 1 : 0, g ? [] : ['otro'], {}); });
      paint();
      $('.a7score', s).innerHTML = `${MARK(ok / A7Q.length)} <b>${ok} / ${A7Q.length}</b> <span class="small">${A7Q.map((q, i) => graded[i] ? '' : `${i + 1}) ${EU[q.c].n}`).filter(Boolean).join(' · ')}</span>`;
    };
    paint();
    put(s, '.c7', cloze({ id: 'a7c', sec: 'a7', skill: 'geo', cls: 'lines', text: ['Portugal está al [oeste] de España.', 'Finlandia está al [este] de Suecia.', 'Francia está al [norte] de España.', 'Grecia está en el [sudeste|sureste] de Europa.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.f7', freeItem({ id: 'a7f', sec: 'a7', rows: 3, prompt: 'A: ¿Dónde está Corea? — B의 대답을 modelo처럼 쓰세요. (Asia = 아시아, China = 중국, Japón = 일본)',
      ph: 'Corea está en el este de Asia, …',
      must: [{ re: 'est[aá] en el (este|norte|sur|oeste|noreste|nordeste|sudeste|sureste) de asia', label: 'está en el este de Asia' }, { re: W0 + 'al (este|oeste|norte|sur|noreste|noroeste|sudeste|sureste|sudoeste|suroeste) de' + W1, label: 'al … de (China / Japón)' }],
      model: 'Corea está en el este de Asia, al este de China y al oeste de Japón.' }));
    function rose() {
      const pts = [0, 45, 90, 135, 180, 225, 270, 315].map(d => { const L = d % 90 ? 34 : 56, a = (d - 90) * Math.PI / 180, b1 = (d - 90 - 18) * Math.PI / 180, b2 = (d - 90 + 18) * Math.PI / 180; return `<polygon points="60,60 ${60 + Math.cos(b1) * 12},${60 + Math.sin(b1) * 12} ${60 + Math.cos(a) * L},${60 + Math.sin(a) * L} ${60 + Math.cos(b2) * 12},${60 + Math.sin(b2) * 12}" fill="${d % 90 ? '#7a6f66' : '#2b2420'}"/>`; }).join('');
      return `<svg viewBox="0 0 120 120" width="120" height="120"><circle cx="60" cy="60" r="44" fill="none" stroke="#2b2420" stroke-width="2"/><circle cx="60" cy="60" r="38" fill="none" stroke="#2b2420" stroke-dasharray="2 4"/>${pts}<circle cx="60" cy="60" r="4" fill="#fff" stroke="#2b2420"/><text x="60" y="10" text-anchor="middle" font-size="11" font-weight="700" fill="#d6202f">N</text></svg>`;
    }
  };

  /* ================= Actividad 8 — 큰 수 듣기 ================= */
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Escucha e identifica los números.', { listen: true, kr: '🔊 번호 버튼을 누르면 숫자를 읽어 줘요(순서는 섞여 있어요). 들은 숫자 카드를 누르세요.' })}
      <div class="auds"></div>
      <div class="ncards"></div>
      <div class="item-row"><button class="btn ghost a8rst">다시</button><button class="btn chk a8chk">채점하기</button><span class="a8score"></span></div>
      ${tip('세 자리씩 끊어 읽기: 15 200 000 = <b>quince millones</b> | <b>doscientos mil</b> · 789 000 = <b>setecientos ochenta y nueve mil</b>')}
      <h3 class="h3">✍️ 숫자를 글자로 쓰세요</h3><div class="items two w8"></div>`);
    const N = D.nums8;
    const st = sel('a8', {});
    if (!st.ord || st.ord.length !== N.length) { st.ord = shuffle(N.map((_, i) => i)); st.as = {}; }
    let act = 0;
    N.forEach((_, k) => reg('a8-l' + k, 'a8', 'num'));
    const paint = graded => {
      $('.auds', s).innerHTML = st.ord.map((n, k) => `<button class="aud ${k === act ? 'on' : ''} ${graded ? (st.as[k] === n ? 'ok' : 'no') : ''}" data-k="${k}">🔊 ${k + 1}${st.as[k] != null ? `<small>${sp(N[st.as[k]])}</small>` : ''}</button>`).join('');
      $('.ncards', s).innerHTML = N.map((n, i) => { const k = Object.keys(st.as).find(x => st.as[x] === i); return `<button class="ncard ${n >= 1e7 ? 'w' : ''}" data-i="${i}">${sp(n)}${k != null ? `<span class="nb2">${+k + 1}</span>` : ''}</button>`; }).join('');
      $$('.aud', s).forEach(b => b.onclick = () => { act = +b.dataset.k; speak(n2w(N[st.ord[act]]), b); paint(); });
      $$('.ncard', s).forEach(b => b.onclick = () => { const i = +b.dataset.i; Object.keys(st.as).forEach(k => { if (st.as[k] === i) delete st.as[k]; }); st.as[act] = i; save(); const nx = st.ord.findIndex((_, k) => st.as[k] == null); if (nx >= 0) act = nx; paint(); });
    };
    paint();
    $('.a8rst', s).onclick = () => { st.ord = shuffle(N.map((_, i) => i)); st.as = {}; act = 0; save(); $('.a8score', s).innerHTML = ''; paint(); };
    $('.a8chk', s).onclick = () => {
      let ok = 0;
      st.ord.forEach((n, k) => { const g = st.as[k] === n; if (g) ok++; record('a8-l' + k, g ? 1 : 0, g ? [] : ['otro'], {}); });
      paint(true);
      $('.a8score', s).innerHTML = `${MARK(ok / N.length)} <b>${ok} / ${N.length}</b> ${ok < N.length ? `<span class="small">틀린 번호: ${st.ord.map((n, k) => st.as[k] === n ? '' : `${k + 1}→${sp(N[n])}`).filter(Boolean).join(', ')}</span>` : ''}`;
    };
    [789000, 15200000, 45000000].forEach((n, i) => put(s, '.w8', writeItem({ id: 'a8-w' + i, sec: 'a8', skill: 'num', prompt: `<b class="dg">${sp(n)}</b>`, ph: '글자로…', answers: [n2w(n)] })));
  };

  /* ================= Actividad 9 ================= */
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Relaciona.', { kr: '숫자와 어림 표현(약 · 거의 · ~보다 많은/적은)을 연결하세요.' })}
      <div class="chips"><span class="hlc c0">más de ~ (~보다 많이)</span><span class="hlc c1">menos de ~ (~보다 적게)</span><span class="hlc c2">casi ~ (거의)</span><span class="hlc c0">unos / unas ~ (약)</span><span class="hlc c1">más o menos ~ (대략)</span><span class="hlc c2">~ aproximadamente (대략)</span></div>
      <div class="pm9"></div>
      <h3 class="h3">✍️ 숫자를 글자로 쓰세요</h3><div class="items two w9"></div>`);
    const P = [[513000, 'más de quinientos mil'], [980000, 'un millón aproximadamente'], [1890000, 'menos de dos millones'], [49000000, 'casi cincuenta millones'], [315000, 'unos trescientos mil'], [5029000, 'más o menos cinco millones']];
    put(s, '.pm9', pairMatch({ id: 'a9m', sec: 'a9', skill: 'num', pairs: P.map(([n, t]) => [`<b class="dg">${sp(n)}</b>`, t]) }));
    P.filter((x, i) => i % 2 === 0 ? false : true).forEach(([n], i) => put(s, '.w9', writeItem({ id: 'a9-w' + i, sec: 'a9', skill: 'num', prompt: `<b class="dg">${sp(n)}</b>`, ph: '글자로…', answers: [n2w(n)] })));
  };

  /* ================= Actividad 10 — 중남미 지도 ================= */
  const LA = {
    mx: { f: '#f2b45a', l: [-104, 25], p: [[-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103.2, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-97.7, 22], [-97.2, 20.5], [-96, 19], [-94.5, 18.2], [-92, 18.6], [-90.5, 19.8], [-90.4, 21.1], [-87, 21.5], [-87.5, 18.5], [-88.3, 18.4], [-89.2, 17.8], [-91.4, 17.3], [-90.5, 16], [-92.2, 14.5], [-94, 16.1], [-96.5, 15.7], [-100, 17], [-103.5, 18.3], [-105.7, 20.4], [-105.2, 22], [-106.5, 23.3], [-108.5, 25.5], [-110.5, 27.8], [-112.5, 30.5], [-114.7, 31.6], [-114.2, 30], [-112.8, 28.5], [-111.3, 26], [-110.3, 24.2], [-109.9, 22.9], [-111.5, 24.5], [-112.2, 25.8], [-114.2, 27.8], [-115.7, 29.8]] },
    cu: { f: '#a9a6e8', l: [-79, 24.4], p: [[-84.9, 21.9], [-82.5, 23.1], [-80, 23.1], [-77.5, 21.8], [-75.6, 21.1], [-74.1, 20.2], [-77.7, 19.9], [-78.5, 21.5], [-81.5, 22.2]] },
    co: { f: '#e4ec6a', l: [-73.6, 4], p: [[-77.4, 8.7], [-76, 10], [-75.5, 10.6], [-74, 11.3], [-72.2, 12], [-71.6, 11.3], [-72.4, 11], [-73, 9.5], [-72.3, 8], [-72, 7], [-70.1, 7], [-67.5, 6.2], [-67.8, 4.5], [-67.3, 2], [-70, 1.5], [-69.5, -1.2], [-70, -4.2], [-73, -2.5], [-75.3, -0.1], [-77.5, 0.8], [-78.8, 1.8], [-77.3, 4], [-77.4, 6.7], [-77.9, 7.2]] },
    ve: { f: '#d9b77a', l: [-65.6, 7.2], p: [[-72.4, 11], [-73, 9.5], [-72.3, 8], [-72, 7], [-70.1, 7], [-67.5, 6.2], [-67.8, 4.5], [-67.3, 2], [-66, 1], [-64, 2.3], [-63, 3.9], [-61, 4.5], [-60.6, 5.2], [-61.4, 5.9], [-61, 6.7], [-60, 8.5], [-62, 10.6], [-66, 10.6], [-68.2, 10.5], [-70, 12.1], [-70.2, 11.4], [-71.6, 11.3]] },
    pe: { f: '#a6e3f5', l: [-75.4, -9.5], p: [[-75.3, -0.1], [-73, -2.5], [-70, -4.2], [-72.9, -5], [-73.9, -7.5], [-72.9, -9.1], [-70.5, -9.5], [-70.6, -11], [-69.5, -11], [-68.7, -12.5], [-69.4, -15.3], [-69.1, -16.2], [-69.6, -17.3], [-70.4, -18.3], [-71.4, -17.7], [-75, -15.4], [-76.4, -13.4], [-77.6, -11.5], [-79.4, -7.9], [-81.2, -6], [-81.3, -4.3], [-80.3, -3.4], [-78.6, -4.6], [-78, -3]] },
    bo: { f: '#a9c27a', l: [-64.4, -17.2], p: [[-69.5, -11], [-68.7, -12.5], [-69.4, -15.3], [-69.1, -16.2], [-69.6, -17.3], [-68.5, -18.9], [-68.2, -21.3], [-67.2, -22.8], [-65.7, -22.1], [-62.6, -22.2], [-61.8, -19.6], [-59.2, -19.3], [-58.2, -17.5], [-58.3, -16.3], [-60.2, -15.5], [-60.5, -13.8], [-62.4, -13.3], [-64, -12.5], [-65.3, -10.9], [-66.6, -9.9], [-68.6, -11.2]] },
    cl: { f: '#f0ae4f', l: [-76.5, -30], la: 'end', p: [[-70.4, -18.3], [-69.6, -17.5], [-68.5, -18.9], [-68.2, -21.3], [-67.2, -22.8], [-68.3, -24.5], [-68.4, -27], [-69.6, -30], [-70.3, -33], [-70.1, -36], [-71.2, -39], [-71.7, -42], [-72, -46], [-73.5, -49], [-72.4, -51.5], [-69.4, -52.3], [-68.6, -52.6], [-68.6, -54.9], [-67.2, -55.3], [-70, -55.2], [-74.5, -52.5], [-75.5, -48], [-74.5, -44], [-73.6, -41], [-73.6, -37.5], [-72.6, -35], [-71.5, -32], [-71.4, -28], [-70.5, -25], [-70.2, -21.5]] },
    ar: { f: '#f4c4e4', l: [-65.3, -36], p: [[-65.7, -22.1], [-67.2, -22.8], [-68.3, -24.5], [-68.4, -27], [-69.6, -30], [-70.3, -33], [-70.1, -36], [-71.2, -39], [-71.7, -42], [-72, -46], [-73.5, -49], [-72.4, -51.5], [-69.4, -52.3], [-68.4, -50.2], [-69, -48.5], [-67.5, -46.5], [-65.5, -45], [-65, -42.3], [-63.5, -42.6], [-62.2, -40.7], [-62.3, -38.8], [-58, -38.2], [-56.7, -36.4], [-57.4, -35.3], [-58.4, -34.2], [-58.4, -33], [-57.6, -30.2], [-55.7, -28], [-53.8, -27.1], [-54.6, -25.6], [-57.7, -25.3], [-58.2, -24], [-62.6, -22.2]], x: [[[-68.6, -52.6], [-65.1, -54.7], [-68.6, -54.9]]] }
  };
  const LA_GRAY = [
    [[-92.2, 14.5], [-90.5, 16], [-91.4, 17.3], [-89.2, 17.8], [-88.3, 18.4], [-88.2, 16], [-86, 16], [-83.2, 15], [-83.5, 11], [-82, 9], [-79.5, 9.5], [-77.4, 8.7], [-77.9, 7.2], [-80, 7.5], [-81.8, 8.2], [-85.7, 10], [-87.5, 13], [-89.8, 13.5]],
    [[-74.5, 18.4], [-72.8, 19.9], [-70, 19.7], [-68.4, 18.6], [-71.4, 17.6]],
    [[-80.3, -3.4], [-80.9, -1], [-80, 0.9], [-78.8, 1.4], [-77.5, 0.8], [-75.3, -0.1], [-78, -3], [-78.6, -4.6]],
    [[-60, 8.5], [-61, 6.7], [-61.4, 5.9], [-60.6, 5.2], [-61, 4.5], [-63, 3.9], [-64, 2.3], [-66, 1], [-67.3, 2], [-70, 1.5], [-69.5, -1.2], [-70, -4.2], [-72.9, -5], [-73.9, -7.5], [-72.9, -9.1], [-70.5, -9.5], [-70.6, -11], [-69.5, -11], [-68.6, -11.2], [-66.6, -9.9], [-65.3, -10.9], [-64, -12.5], [-62.4, -13.3], [-60.5, -13.8], [-60.2, -15.5], [-58.3, -16.3], [-58.2, -17.5], [-59.2, -19.3], [-61.8, -19.6], [-62.6, -22.2], [-58.2, -24], [-57.7, -25.3], [-54.6, -25.6], [-53.8, -27.1], [-55.7, -28], [-57.6, -30.2], [-58.4, -33], [-58.4, -34.2], [-56.2, -34.9], [-54.5, -34.8], [-53.4, -33.8], [-50.7, -31], [-48.6, -28.5], [-48.5, -26], [-44.7, -23.4], [-40.8, -22], [-39, -17.7], [-37.3, -12], [-35, -8.9], [-35.2, -5.5], [-40, -2.8], [-44, -2.5], [-48, -1], [-50, 1.8], [-51.6, 4.2], [-54, 5.8], [-57, 6], [-58.5, 7]],
    [[-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103.2, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.2, 25.9], [-97.3, 28], [-95, 29.3], [-93, 29.7], [-90, 29.2], [-89, 30.3], [-85, 29.7], [-83, 29], [-81, 25.2], [-80, 27], [-81, 31], [-80, 33], [-117.5, 33]]
  ];
  const CAPXY = { mx: [-99.1, 19.4], cu: [-82.4, 23.1], ve: [-66.9, 10.5], co: [-74.1, 4.7], pe: [-77, -12], bo: [-68.1, -16.5], cl: [-70.7, -33.4], ar: [-58.4, -34.6] };
  const laP = ([lo, la]) => [((lo + 118) * 6.2).toFixed(1), ((33.5 - la) * 6.2).toFixed(1)];
  const lpoly = (pts, cls, extra) => `<polygon class="${cls}" ${extra || ''} points="${pts.map(p => laP(p).join(',')).join(' ')}"/>`;
  function laSVG() {
    let g = `<rect width="540" height="565" fill="#e3f3fa"/>` + LA_GRAY.map(p => lpoly(p, 'gray')).join('');
    D.capitales.forEach(c => {
      const L = LA[c.k], [lx, ly] = laP(L.l), [cx, cy] = laP(CAPXY[c.k]);
      g += `<g class="cty" data-c="${c.k}">${lpoly(L.p, 'land', `fill="${L.f}"`)}${(L.x || []).map(p => lpoly(p, 'land', `fill="${L.f}"`)).join('')}
        <text class="cl" x="${lx}" y="${ly}" text-anchor="${L.la || 'middle'}">${c.pais}</text><polygon class="cap" points="${cx},${+cy - 6} ${+cx + 2},${+cy - 1.5} ${+cx + 6},${+cy - 1.5} ${+cx + 3},${+cy + 1.5} ${+cx + 4},${+cy + 6} ${cx},${+cy + 3} ${+cx - 4},${+cy + 6} ${+cx - 3},${+cy + 1.5} ${+cx - 6},${+cy - 1.5} ${+cx - 2},${+cy - 1.5}"/></g>`;
    });
    return `<svg class="lamap" viewBox="0 0 540 565" role="img" aria-label="중남미 지도">${g}</svg>`;
  }
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'a) Mira el mapa y habla con tu compañero siguiendo el modelo.', { kr: '지도의 나라를 누르면 수도와 인구가 나와요. ★ = 수도' })}
      ${modelo('¿Cuál es la capital de Colombia?<br>-Es Bogotá.<br>¿Cuántos habitantes tiene Bogotá?<br>-Tiene casi ocho millones.')}
      <div class="la-wrap">${laSVG()}<div class="la-card card"><p class="small">👆 지도에서 나라를 눌러 보세요.</p></div></div>
      <h3 class="h3">① ¿Cuál es la capital de …? — 수도를 쓰세요</h3><div class="items two w10"></div>
      <h3 class="h3">② ¿Cuántos habitantes tiene …? — 알맞은 어림 표현을 고르세요</h3><div class="items ch10"></div>
      <h3 class="h3">③ 인구를 글자로 쓰세요</h3><div class="items nw10"></div>
      <h3 class="h3">④ modelo처럼 대화 쓰기 — 한국과 서울</h3><div class="f10"></div>`);
    const card = $('.la-card', s);
    $$('.lamap .cty', s).forEach(g => g.onclick = () => {
      const c = D.capitales.find(x => x.k === g.dataset.c);
      $$('.lamap .cty', s).forEach(x => x.classList.toggle('pk', x === g));
      card.innerHTML = `<h3>${c.pais}</h3><p>★ Capital: <b>${c.cap}</b> ${say('La capital de ' + c.pais + ' es ' + c.cap + '.')}</p><p>👥 <b class="dg">${sp(c.hab)}</b> habitantes</p><p class="small">${n2w(c.hab)} ${say(n2w(c.hab) + ' habitantes')}</p>`;
    });
    D.capitales.filter(c => ['cu', 'pe', 'bo', 'ar'].includes(c.k)).forEach((c, i) => put(s, '.w10', writeItem({ id: 'a10-c' + i, sec: 'a10', skill: 'geo', prompt: `¿Cuál es la capital de ${c.pais}? ${say('¿Cuál es la capital de ' + c.pais + '?')}`, ph: 'Es …',
      answers: [`Es ${c.cap}.`, `La capital de ${c.pais} es ${c.cap}.`, `${c.cap}.`, `Es la ciudad de ${c.cap}.`] })));
    [['Lima', 'Tiene más de ocho millones.', ['Tiene casi un millón.', 'Tiene unos catorce millones.']],
      ['Ciudad de México', 'Tiene más de veinte millones.', ['Tiene casi dos millones.', 'Tiene unos ocho millones.']],
      ['La Paz', 'Tiene casi novecientos mil.', ['Tiene más de ocho millones.', 'Tiene unos dos millones.']],
      ['Buenos Aires', 'Tiene más de catorce millones.', ['Tiene menos de un millón.', 'Tiene casi cinco millones.']]]
      .forEach(([c, a, d], i) => put(s, '.ch10', choiceItem({ id: 'a10-h' + i, sec: 'a10', skill: 'num', prompt: `¿Cuántos habitantes tiene <b>${c}</b>?`, options: shuffle([a, ...d]), answer: a,
        explain: `${c}: ${sp(D.capitales.find(x => x.cap === c).hab)} habitantes` })));
    [['Santiago', 5084038]].forEach(([c, n], i) => put(s, '.nw10', writeItem({ id: 'a10-n' + i, sec: 'a10', skill: 'num', prompt: `${c}: <b class="dg">${sp(n)}</b>`, ph: '글자로…', answers: [n2w(n)] })));
    put(s, '.f10', freeItem({ id: 'a10f', sec: 'a10', rows: 4, prompt: '¿Cuál es la capital de Corea? ¿Cuántos habitantes tiene? — modelo처럼 질문과 대답을 모두 쓰세요. (서울 인구: 약 940만)',
      ph: '¿Cuál es la capital de Corea?\n-Es Seúl.',
      must: [{ re: '¿\\s*cu[aá]l es la capital de', label: '¿Cuál es la capital de …?' }, { re: '¿\\s*cu[aá]ntos habitantes tiene', label: '¿Cuántos habitantes tiene …?' },
        { re: W0 + 'tiene (casi|m[aá]s de|menos de|unos|m[aá]s o menos)' + W1, label: 'Tiene casi / más de / unos …' }, { re: W0 + 'millones' + W1, label: 'millones' }],
      model: '¿Cuál es la capital de Corea? -Es Seúl. ¿Cuántos habitantes tiene Seúl? -Tiene casi diez millones.' }));
  };

  /* ================= 표지 · 시험 ================= */
  SC.lesson({
    num: '07',
    title: 'Mi barrio',
    ttsTest: 'Oiga, perdone, ¿hay una gasolinera cerca de aquí?',
    cover: {
      emoji: '🏙️🚇<br><small>🗺️ 📍 🧭</small>',
      bg: 'linear-gradient(135deg,#7b3a26 0%,#c4572c 55%,#f2a93b 100%)',
      tema: ['Instituciones y lugares públicos locales', 'Ubicación geográfica', 'La ciudad', 'Números a partir del 10 000'],
      com: ['Preguntar por la existencia y ubicación de lugares públicos', 'Dar instrucciones para localizar un lugar', 'Hablar de la situación geográfica', 'Describir una población'],
      gram: ['Imperativo afirmativo', 'Preposiciones y adverbios de lugar: <i>en, cerca (de), lejos (de)</i>', 'Preposición: <i>por, a, de</i>', 'Usos de los verbos <i>estar</i> y <i>haber</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      A: { g: 'f', name: 'Conductora', av: '👩🏼‍🦰', side: 'l' }, B: { g: 'f', name: 'Chica', av: '👩🏽', side: 'r' },
      Ana: { g: 'f', av: '👩🏼', side: 'l' }, Pablo: { g: 'm', av: '🧑🏽', side: 'r' }
    },
    errLabels: { estructura: 'hay / está · 전치사', conjugacion: '명령형 (tú / usted)', concordancia: '관사 · 성·수 일치' },
    errTips: {
      acento: 'millón, comisaría, Perú, México, tranvía, allí, aquí … 악센트도 철자예요. 시험에서는 감점됩니다.',
      estructura: '처음 말하는 장소(un/una) → hay, 정해진 장소(el/la/이름) → está. a + el = al, de + el = del.',
      conjugacion: 'tú: gira · toma · cruza · sigue · mira / usted: gire · tome · cruce · siga · mire (oír → oye / oiga)',
      concordancia: '관사 el/la/un/una 를 확인하세요. 숫자: mil 은 복수형 없음 (dos mil) · un millón / dos millones · 명사 앞엔 de: un millón de habitantes'
    },
    classify(ti, ta) {
      const est = w => /^est[aá]n?$/.test(w);
      if ((ti.includes('hay') && ta.some(est)) || (ta.includes('hay') && ti.some(est))) return 'estructura';
      const IMP = /^(gir|tom|cruc|cruz|sig|mir|oig|oye|perdon|disculp|baj|cambi|cog|coj)/;
      const iv = ti.filter(w => IMP.test(w)), av = ta.filter(w => IMP.test(w));
      if (av.length && iv.length === av.length && iv.join() !== av.join()) return 'conjugacion';
      const M = w => /^(mil|miles|mill[oó]n|millones)$/.test(w);
      if (ta.some(M) && ti.filter(M).join() !== ta.filter(M).join()) return 'concordancia';
      return null;
    },
    errRules: [
      { re: W0 + 'hay (el|la|los|las)' + W1, t: 'estructura', msg: 'hay + el/la ✕ → 정해진 장소는 "está": El banco está …' },
      { re: '¿\\s*d[oó]nde est[aá] (un|una|unos|unas)' + W1, t: 'estructura', msg: '¿Dónde está + un/una ✕ → ¿Dónde hay una …?' },
      { re: W0 + 'a el' + W1, t: 'estructura', msg: 'a + el = al' },
      { re: W0 + 'de el' + W1, t: 'estructura', msg: 'de + el = del' },
      { re: W0 + 'cruze' + W1, t: 'otro', msg: 'cruzar → cruce (z → c)' },
      { re: W0 + '(sige|sigua|segue|segua|seguie|sega)' + W1, t: 'conjugacion', msg: 'seguir → sigue (tú) / siga (usted)' },
      { re: W0 + 'millónes' + W1, t: 'acento', msg: 'millones (복수형은 악센트 없음)' },
      { re: W0 + '(dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|cien) miles' + W1, t: 'concordancia', msg: 'mil 은 복수형이 없어요: dos mil' },
      { re: W0 + '(dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez) mill[oó]n' + W1, t: 'concordancia', msg: '2 이상은 millones' },
      { re: W0 + 'uno mill[oó]n' + W1, t: 'concordancia', msg: 'un millón (uno ✕)' }
    ],
    accWords: ['millón', 'comisaría', 'sudamérica', 'sudamericano', 'sudamericana', 'perú', 'méxico', 'bogotá', 'tranvía', 'tranvías', 'kilómetros', 'crúcela', 'crúzala', 'dirección',
      'támesis', 'japón', 'dieciséis', 'veintidós', 'veintitrés', 'veintiséis', 'católica', 'república', 'héroes', 'turística', 'turístico', 'olímpico', 'güell'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Hay una parada de autobús por aquí?', 'Sí, hay una al final de esta calle.', '¿Sabe usted dónde está el metro?', 'Cruce la plaza y tome la primera calle a la izquierda.', 'Lo siento, no soy de aquí.', 'Está en el oeste de Sudamérica, al sur de Ecuador.'],
    utilSkill: 'dir',
    proverbio: { es: 'El mundo es un pañuelo.', e: '🌍', answer: '세상 참 좁다', options: ['티끌 모아 태산', '세상 참 좁다', '등잔 밑이 어둡다', '우물 안 개구리'], kr: '"세상은 손수건 한 장" — 뜻밖의 곳에서 아는 사람을 만났을 때 쓰는 말이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Explica cómo ir → 글로 쓰기',
        icons: ['🏛️', '✈️', '🚌', '🚏', '🚉'],
        html: '<p class="small">Explica a tus compañeros cómo se puede ir a los siguientes lugares desde donde estáis. Debes incluir los medios de transporte que se necesita tomar.<br>1) El museo nacional más grande del país · 2) El aeropuerto internacional más grande del país · 3) La terminal de autobuses de tu ciudad · 4) La parada de autobús más cercana a tu escuela · 5) La estación de tren</p>',
        questions: ['El museo nacional o el aeropuerto internacional más grande del país: ¿cómo se puede ir desde tu escuela? ¿Qué medios de transporte necesitas tomar (metro, autobús, tren, taxi)?',
          'La terminal de autobuses o la estación de tren de tu ciudad: ¿dónde está? ¿Está cerca o lejos de tu escuela?',
          'La parada de autobús más cercana a tu escuela: explica el camino con instrucciones (siga, gire, cruce, tome …).'],
        minWords: 50,
        hint: 'hay / está · 명령형(gire, siga, tome, cruce…) · cerca / lejos · a la derecha / izquierda 를 활용하면 높은 점수!',
        ph: 'Para ir al museo nacional, primero toma el metro …',
        connectors: ['y', 'luego', 'después', 'primero', 'allí', 'pero', 'porque', 'también', 'finalmente'],
        rubric: [
          { k: 'lug', label: '장소 (museo, aeropuerto, terminal, parada, estación)', max: 8, re: 'museo|aeropuerto|terminal|parada|estaci[oó]n', min: 3, ax: 'Contenido' },
          { k: 'tra', label: '교통수단 (metro, autobús, tren, taxi, a pie)', max: 8, re: 'metro|autob[uú]s|tren|taxi|a pie|tranv[ií]a|l[ií]nea', min: 2, ax: 'Contenido' },
          { k: 'imp', label: '명령형 3개 이상 (gire, siga, tome, cruce, baje, cambie …)', max: 10, re: 'gire|gira|siga|sigue|tome|toma|cruce|cruza|baje|baja|cambie|cambia|coja|coge|camine|camina', min: 3, ax: 'Gramática' },
          { k: 'ord', label: '길 안내 (primera calle, a la derecha, todo recto …)', max: 8, re: '(primera|segunda|tercera)( calle| parada)?|a la (derecha|izquierda)|todo recto', min: 2, ax: 'Gramática' },
          { k: 'hay', label: 'hay / está', max: 8, re: 'hay|est[aá]n?', min: 2, ax: 'Gramática' },
          { k: 'lej', label: 'cerca (de) / lejos (de)', max: 8, re: 'cerca|lejos', ax: 'Gramática' },
          { k: 'pre', label: '전치사 (en metro, a la …, al, del, desde, hasta)', max: 10, re: 'desde|hasta|en (metro|autob[uú]s|tren|taxi)|al|del|a la', min: 3, ax: 'Gramática' }
        ],
        model: 'Para ir al museo nacional, primero toma el autobús delante de la escuela y baja en la estación de Ichon. El museo está muy cerca, a cinco minutos a pie. El aeropuerto internacional está lejos de mi escuela. Toma el metro, la línea cuatro, y cambia al tren del aeropuerto en la estación de Seúl. La terminal de autobuses está en Gangnam. La parada de autobús más cercana está al lado de la escuela: gira a la derecha, sigue todo recto y cruza la calle. Está al final de la calle.'
      }
    },
    build: B
  });
})();
