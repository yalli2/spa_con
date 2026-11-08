/* Lección 09 · Me gusta mucho viajar — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    actHead, dlgHead, modelo, tip, hl, acc, W0, W1, playLines, dialogHTML, clozeFromDialog, MARK } = SC;
  /* Lección 09 · Me gusta mucho viajar — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vocabulario 어휘',
      gus: 'Gustar · Encantar',
      pro: 'Pronombres 간접목적대명사',
      pre: 'Preferir',
      acu: 'También / Tampoco',
      com: 'Comparación 비교',
      fre: 'Frecuencia 빈도',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '여가활동 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '후안과 크리스티나', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '¿Te gusta / Te gustan?', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: 'preferir 문장 사슬', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '그림 연결 · 맞장구', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '¿Por qué? Porque…', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '마르코스와 아드리아나', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'd2', label: 'Diálogo 2', kr: '마리아와 페드로', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a6', label: 'Actividad 6', kr: '좋아하는 것 3 · 싫어하는 것 3', group: 'Diálogo 2', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '날씨와 취미', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: 'me gusta más … que …', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '취미 대화 완성', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '스포츠 질문에 답하기', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '¿Qué prefieres?', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    aficiones: [
      { es: 'ir a la playa', kr: '해변에 가다', e: '🏖️' },
      { es: 'subir a la montaña', kr: '산에 오르다', e: '⛰️' },
      { es: 'jugar al tenis', kr: '테니스를 치다', e: '🎾' },
      { es: 'ir al cine', kr: '영화관에 가다', e: '🎬' },
      { es: 'leer libros', kr: '책을 읽다', e: '📚' },
      { es: 'escuchar música', kr: '음악을 듣다', e: '🎧' },
      { es: 'ver exposiciones', kr: '전시회를 보다', e: '🖼️' },
      { es: 'cocinar', kr: '요리하다', e: '🍳' },
      { es: 'navegar por Internet', kr: '인터넷 서핑하다', e: '💻' },
      { es: 'pintar', kr: '그림을 그리다', e: '🎨' },
      { es: 'tocar la guitarra', kr: '기타를 치다', e: '🎸' },
      { es: 'pasear con mascotas', kr: '반려동물과 산책하다', e: '🐕' }
    ],

    dialogo1: [
      { who: 'J', es: 'Cristina, ¿te gusta leer?' },
      { who: 'C', es: 'Sí, me gusta [mucho] leer. ¿Y a ti, Juan?' },
      { who: 'J', es: 'Pues a mí [también] me gusta leer, [sobre todo], novelas de amor. Pero [prefiero] ver películas.' },
      { who: 'C', es: 'A mí también me gusta ir al cine.' },
      { who: 'J', es: '¿Qué [tipo] de películas te gusta?' },
      { who: 'C', es: 'A mí me [gustan] las películas de terror. ¿Y a ti?' },
      { who: 'J', es: 'A mí también. Cristina, ¿te gusta viajar?' },
      { who: 'C', es: 'Sí, me gusta mucho viajar, [especialmente] a países de culturas diferentes. Me gusta conocer otras costumbres y comer cosas diferentes.' }
    ],

    dialogo2: [
      { who: 'María', es: '¿Cuál es tu deporte favorito?' },
      { who: 'Pedro', es: 'El baloncesto. Juego [cada martes] después de clase. Y también me gusta mucho el esquí. Todos los inviernos, en Navidades, voy a Sierra Nevada con mis padres a esquiar.' },
      { who: 'María', es: 'Pues a mí me gusta la natación. Voy a la piscina dos veces [a la semana]. ¿Te gusta nadar?' },
      { who: 'Pedro', es: 'No, nunca voy a la piscina.' },
      { who: 'María', es: '¿Y te gusta pasear? Voy al parque a menudo con mi mascota.' },
      { who: 'Pedro', es: 'Yo también paseo por el parque de vez en cuando.' },
      { who: 'María', es: 'Voy este fin de semana con mis amigos, [¿te vienes?]' },
      { who: 'Pedro', es: 'Sí, [¡genial!]' }
    ],

    /* Actividad 5 — 교재 음원 대신 읽기 자료 */
    dialogo5: [
      { who: 'Adriana', es: 'Marcos, ¿qué te gusta hacer los fines de semana?' },
      { who: 'Marcos', es: 'Me gusta mucho jugar al fútbol con mis amigos. ¿Te gusta el fútbol?' },
      { who: 'Adriana', es: 'No, a mí no me gusta el fútbol. Prefiero el tenis. Juego los sábados.' },
      { who: 'Marcos', es: '¿Y te gusta bailar?' },
      { who: 'Adriana', es: '¡Sí! Me encanta la salsa. ¿Y a ti?' },
      { who: 'Marcos', es: 'A mí no me gusta bailar. Tampoco me gustan las discotecas. Prefiero cocinar en casa. ¡Me encantan los platos mexicanos!' },
      { who: 'Adriana', es: 'Pues a mí no me gusta hacer la compra, pero me encantan las películas de terror. ¿Vamos al cine?' },
      { who: 'Marcos', es: '¡Vale!' }
    ],

    act3: [
      { e: '🚲', es: 'montar en bicicleta' },
      { e: '🧹', es: 'limpiar la habitación' },
      { e: '🎮', es: 'jugar a los videojuegos' },
      { e: '🛒', es: 'hacer la compra' },
      { e: '🍲', es: 'cocinar' },
      { e: '☕', es: 'tomar café' },
      { e: '⛷️', es: 'esquiar' },
      { e: '🖼️', es: 'ver exposiciones' },
      { e: '🧺', es: 'lavar la ropa' }
    ],

    act6: ['hablar español', 'tocar el piano', 'hacer los deberes', 'pintar', 'enseñar a los niños',
      'navegar por Internet', 'ir a la playa', 'subir a la montaña', 'ordenar mi habitación',
      'ir a conciertos', 'viajar a América Latina', 'resolver problemas de matemáticas'],

    clima: [
      { k: 'hace fresco', e: '🍃', kr: '선선하다' },
      { k: 'hace mucho calor', e: '🥵', kr: '아주 덥다' },
      { k: 'hace mucho frío', e: '🥶', kr: '아주 춥다' },
      { k: 'nieva', e: '❄️', kr: '눈이 온다' },
      { k: 'llueve', e: '🌧️', kr: '비가 온다' },
      { k: 'hace mucho sol', e: '☀️', kr: '햇볕이 아주 강하다' }
    ],

    act8: [
      { a: { es: 'el coche pequeño', e: '🚗', kr: '작은 차' }, b: { es: 'el coche grande', e: '🚙', kr: '큰 차' } },
      { a: { es: 'el violín', e: '🎻', kr: '바이올린' }, b: { es: 'la guitarra', e: '🎸', kr: '기타' } },
      { a: { es: 'el campo', e: '🏡', kr: '시골' }, b: { es: 'la ciudad', e: '🏙️', kr: '도시' } }
    ],

    act11: [
      { tema: 'hacer deporte', a: { es: 'la natación', e: '🏊' }, b: { es: 'el esquí', e: '⛷️' } },
      { tema: 'ir de vacaciones', a: { es: 'la playa', e: '🏝️' }, b: { es: 'la montaña', e: '🏔️' } },
      { tema: 'comer', a: { es: 'la carne', e: '🥩' }, b: { es: 'el pescado', e: '🐟' } },
      { tema: 'escuchar música', a: { es: 'la música clásica', e: '🎻' }, b: { es: 'el rock', e: '🤘' } }
    ],

    utiles: [
      '¿Qué te gusta hacer?',
      'Me gusta leer, pero no me gusta el cine.',
      'Me gustan las discotecas y las motos.',
      'Me gusta mucho pintar.',
      'Me encanta bailar y cantar.',
      'Me gusta jugar en la nieve.',
      'A mí también. / A mí no.',
      'No me gusta el fútbol ni el tenis.',
      'A mí tampoco. / A mí sí.',
      '¿A quién le gusta tocar la guitarra?',
      'A Olga le gusta tocar la guitarra.'
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '(A mí) me ____ las películas cómicas. <i>(gustar)</i>', a: ['gustan'], s: 'gus' },
      { p: 'A mi hermano ____ gusta jugar al béisbol.', a: ['le'], s: 'pro' },
      { p: '¿A vosotros ____ gusta la música pop?', a: ['os'], s: 'pro' },
      { p: 'A nosotros ____ encantan los conciertos.', a: ['nos'], s: 'pro' },
      { p: 'Mis amigos ____ el cine al teatro. <i>(preferir)</i>', a: ['prefieren'], s: 'pre' },
      { p: 'Yo ____ ver películas en casa. <i>(preferir)</i>', a: ['prefiero'], s: 'pre' },
      { p: '¿Tú qué ____, la playa o la montaña? <i>(preferir)</i>', a: ['prefieres'], s: 'pre' },
      { p: 'A: No me gusta el fútbol. — B (나도 싫어): A mí ____.', a: ['tampoco'], s: 'acu' },
      { p: 'A: Me gusta esquiar. — B (나도 좋아): A mí ____.', a: ['también'], s: 'acu' },
      { p: 'A: No me gusta cocinar. — B (나는 좋아): A mí ____.', a: ['sí'], s: 'acu' },
      { p: 'Me gusta ____ el tenis que el fútbol. <i>(더)</i>', a: ['más'], s: 'com' },
      { p: 'Me gusta más la ciudad ____ el campo.', a: ['que'], s: 'com' },
      { p: 'Me ____ bailar y cantar. <i>(encantar)</i>', a: ['encanta'], s: 'gus' },
      { p: 'Juego al baloncesto dos veces ____ semana.', a: ['a la', 'por'], s: 'fre' },
      { p: 'No me gusta el fútbol ____ el tenis. <i>(~도 …도 아니다)</i>', a: ['ni'], s: 'gus' },
      { p: 'Me gusta navegar por Internet ____ ir a la playa. <i>(그리고)</i>', a: ['e'], s: 'gus' },
      { p: '¿____ tipo de películas te gusta?', a: ['qué'], s: 'gus' },
      { p: 'Pedro ____ va a la piscina. <i>(전혀 ~않다)</i>', a: ['nunca'], s: 'fre' }
    ]
  };

  const withAmi = arr => arr.flatMap(a => [a, 'A mí ' + a.charAt(0).toLowerCase() + a.slice(1)]);
  const FREQ = '(siempre|todos los d[ií]as|todas las semanas|cada (d[ií]a|lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|semana|fin de semana)|a menudo|de vez en cuando|nunca|a veces|(una|dos|tres|cuatro|cinco|\\d+) vez|(una|dos|tres|cuatro|cinco|\\d+) veces|los (lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bados|domingos|fines de semana))';
  const B = {};

  B.vocab = () => {
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">Los españoles y latinoamericanos tienen muchas y diferentes aficiones. Cuando tienen tiempo libre, les gusta disfrutar de ellas. Entre sus aficiones están: nadar, subir a la montaña, jugar al tenis, ir al cine, etc. ${say('Los españoles y latinoamericanos tienen muchas y diferentes aficiones. Cuando tienen tiempo libre, les gusta disfrutar de ellas.')}</p>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요</h3><div class="flipgrid"></div>
      <h3 class="h3">② 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요</h3><div class="items two"></div>`);
    const fg = $('.flipgrid', s);
    D.aficiones.forEach(a => {
      const c = el(`<div class="flip"><div class="flip-in"><div class="ff"><span class="emo">${a.e}</span><span>${a.es}</span></div><div class="fbk"><span>${a.kr}</span>${say(a.es)}</div></div></div>`);
      c.onclick = e => { if (!e.target.closest('.say')) c.classList.toggle('on'); };
      fg.appendChild(c);
    });
    D.aficiones.forEach((a, i) => put(s, '.items', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`, answers: [a.es] })));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. gustar — 좋아하는 <u>대상</u>이 주어!</h3>
        <div class="blocks"><span class="bk p">(A mí)</span><span class="bk o">me</span><span class="bk v">gusta</span><span class="bk s">leer / la música</span></div>
        <div class="blocks"><span class="bk p">(A mí)</span><span class="bk o">me</span><span class="bk v">gustan</span><span class="bk s">las películas de terror</span></div>
        <div class="legend-mini"><span class="bk p">강조 (생략 가능)</span><span class="bk o">간접목적대명사</span><span class="bk v">gustar 3인칭</span><span class="bk s">주어 = 좋아하는 것</span></div>
        ${tip('동사원형 · 단수 명사 → <b>gusta</b> / 복수 명사 → <b>gustan</b>. 동사원형이 두 개여도 단수: <b>Me gusta bailar y cantar.</b>')}
        <div class="g1"></div></div>
      <div class="gcard"><h3>2. 간접목적대명사 (Pronombres de objeto indirecto)</h3>
        ${tip('사람 이름이 오면 <b>a</b> + 이름 + le: <b>A Olga le gusta</b> tocar la guitarra. "a mí"의 mí 에는 악센트!')}
        <div class="g2a"></div><div class="g2b"></div></div>
      <div class="gcard"><h3>3. 좋아하는 정도 (Grados de gusto)</h3>
        <div class="scale">
          <div class="st s5"><span>😍</span><b>Me encanta(n)</b><small>정말 좋아해</small></div>
          <div class="st s4"><span>😊</span><b>Me gusta(n) mucho</b><small>아주 좋아해</small></div>
          <div class="st s3"><span>🙂</span><b>Me gusta(n)</b><small>좋아해</small></div>
          <div class="st s2"><span>😐</span><b>No me gusta(n) mucho</b><small>별로야</small></div>
          <div class="st s1"><span>😖</span><b>No me gusta(n) nada</b><small>전혀 싫어</small></div>
        </div>
        ${tip('<b>Me encanta mucho</b> ✕ — encantar 자체가 "아주 좋아하다"라서 mucho를 붙이지 않아요.')}
        <div class="items g3"></div></div>
      <div class="gcard"><h3>4. preferir (e → ie) — 더 좋아하다</h3>
        <div class="boot-wrap"><div class="g4a"></div><div class="boot-note">👢 <b>부츠 모양</b>: nosotros · vosotros 만 e 그대로!<br><br><b>Prefiero A a B</b> : B보다 A가 좋다<br>Prefiero el cine <b>al</b> teatro. (a + el = al)</div></div>
        <div class="g4b"></div></div>
      <div class="gcard"><h3>5. 맞장구 — también / tampoco / sí / no</h3>
        <table class="acu"><tr><th>상대방 문장</th><th class="agr">나도 같아요 🤝</th><th class="dis">나는 달라요 🙅</th></tr>
          <tr><td>긍정 · <i>Me gusta esquiar.</i></td><td class="agr">A mí <b>también</b>. ${say('A mí también.')}</td><td class="dis">A mí <b>no</b>. ${say('A mí no.')}</td></tr>
          <tr><td>부정 · <i>No me gusta el fútbol.</i></td><td class="agr">A mí <b>tampoco</b>. ${say('A mí tampoco.')}</td><td class="dis">A mí <b>sí</b>. ${say('A mí sí.')}</td></tr></table>
        <div class="items g5"></div></div>
      <div class="gcard"><h3>6. 비교 (Comparaciones)</h3>
        <div class="blocks"><span class="bk o">Me gusta</span><span class="bk v">más</span><span class="bk s">A</span><span class="bk v">que</span><span class="bk s">B</span><span class="small">B보다 A가 더 좋다</span></div>
        <div class="blocks"><span class="bk o">Me gusta</span><span class="bk p">menos</span><span class="bk s">A</span><span class="bk p">que</span><span class="bk s">B</span><span class="small">B보다 A가 덜 좋다</span></div>
        ${tip('A가 복수 명사면 <b>gustan</b>: Me gustan más los gatos que los perros.')}
        <div class="items g6"></div></div>`);
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'gus', title: '빈칸에 gusta / gustan / encanta / encantan 을 쓰세요.', cls: 'lines', text:
      ['(A mí) me [gusta] leer.', '(A mí) me [gustan] las películas de terror.', '¿Te [gusta] bailar y cantar?', '¿Te [gustan] el béisbol y el tenis?',
        'Me [gusta] la música.', 'No me [gustan] las motos.', 'Me [encanta] el chocolate. <i>(encantar)</i>', 'Me [encantan] los perros. <i>(encantar)</i>'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'pro', title: '표를 완성하세요.', cls: 'table2', text:
      [['a mí', 'me'], ['a ti', 'te'], ['a él / ella / usted', 'le'], ['a nosotros/as', 'nos'], ['a vosotros/as', 'os'], ['a ellos / ellas / ustedes', 'les']].map(([a, b]) => `<p><span>${a}</span> → [${b}] gusta</p>`).join('') }));
    put(s, '.g2b', cloze({ id: 'g2b', sec: 'gram', skill: 'pro', title: '알맞은 대명사를 쓰세요.', cls: 'lines', text:
      ['A ellos [les] gusta bailar.', 'A nosotros [nos] encanta la paella.', '¿A ti [te] gustan los perros?', 'A Olga [le] gusta tocar la guitarra.', 'A vosotros [os] gusta el cine.', 'A mis padres [les] gusta pasear.'].map(x => `<p>${x}</p>`).join('') }));
    [['😍', 'la música', 'encantar', ['Me encanta la música.']], ['😍', 'los videojuegos', 'encantar', ['Me encantan los videojuegos.']],
      ['😊', 'viajar', 'gustar mucho', ['Me gusta mucho viajar.']], ['😐', 'el fútbol', 'no … mucho', ['No me gusta mucho el fútbol.']],
      ['😖', 'las motos', 'no … nada', ['No me gustan nada las motos.']]].forEach(([e, o, v, a], i) =>
      put(s, '.g3', writeItem({ id: 'g3-' + i, sec: 'gram', skill: 'gus', prompt: `<span class="emo-sm">${e}</span> <b>${o}</b> <span class="small">(${v})</span>`, answers: withAmi(a) })));
    put(s, '.g4a', cloze({ id: 'g4a', sec: 'gram', skill: 'pre', cls: 'boot', text:
      [['yo', 'prefiero', 1], ['tú', 'prefieres', 1], ['él / ella / usted', 'prefiere', 1], ['nosotros/as', 'preferimos', 0], ['vosotros/as', 'preferís', 0], ['ellos / ellas / ustedes', 'prefieren', 1]]
        .map(([p, f, b]) => `<p class="${b ? 'in' : 'out'}"><span>${p}</span>[${f}]</p>`).join('') }));
    put(s, '.g4b', cloze({ id: 'g4b', sec: 'gram', skill: 'pre', cls: 'lines', title: 'preferir 를 알맞게 바꾸세요.', text:
      ['Mis padres [prefieren] la montaña.', 'Nosotros [preferimos] ver películas.', '¿Qué [prefieres] tú, el té o el café?', 'Yo [prefiero] el cine [al] teatro.'].map(x => `<p>${x}</p>`).join('') }));
    [['A: Me gusta esquiar.', '나도 좋아', 'A mí también.'], ['A: No me gusta el fútbol.', '나도 싫어', 'A mí tampoco.'],
      ['A: Me gustan los gatos.', '나는 싫어', 'A mí no.'], ['A: No me gusta cocinar.', '나는 좋아', 'A mí sí.']].forEach(([q, k, a], i) =>
      put(s, '.g5', writeItem({ id: 'g5-' + i, sec: 'gram', skill: 'acu', prompt: `${q} → <span class="small">B (${k})</span>`, answers: [a], prefix: true })));
    [['🎾 el tenis', '>', '⚽ el fútbol', ['Me gusta más el tenis que el fútbol.', 'Me gusta menos el fútbol que el tenis.']],
      ['📚 leer', '>', '📺 ver la tele', ['Me gusta más leer que ver la tele.', 'Me gusta menos ver la tele que leer.']],
      ['🏖️ la playa', '<', '⛰️ la montaña', ['Me gusta menos la playa que la montaña.', 'Me gusta más la montaña que la playa.']],
      ['🐈 los gatos', '>', '🐕 los perros', ['Me gustan más los gatos que los perros.', 'Me gustan menos los perros que los gatos.']]].forEach(([a, op, b, ans], i) =>
      put(s, '.g6', writeItem({ id: 'g6-' + i, sec: 'gram', skill: 'com', prompt: `${a} <b class="op">${op}</b> ${b}`, answers: withAmi(ans) })));
  };

  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Juan habla con Cristina sobre sus gustos.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">b) Practica utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">me encanta</span><span class="hlc c1">especialmente</span><span class="hlc c2">hacer un viaje</span><span class="hlc c0">sobre todo</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    $('#hide1', s).onclick = e => { const t = $('#d1txt', s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'gus', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['"Me gusta mucho leer." → <b>encantar</b>로 바꿔 쓰세요.', ['Me encanta leer.']],
      ['음악을 좋아해, 특히 록을. <span class="small">(sobre todo)</span>', ['Me gusta la música, sobre todo el rock.']],
      ['이번 여름에 멕시코로 여행 가고 싶어. <span class="small">Este verano quiero … (hacer un viaje)</span>', ['Este verano quiero hacer un viaje a México.']],
      ['여행하는 걸 좋아해, 특히 스페인으로. <span class="small">(especialmente)</span>', ['Me gusta viajar, especialmente a España.']]].forEach(([p, a], i) =>
      put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'gus', prompt: p, answers: withAmi(a) })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '친구와 취미에 대해 이야기하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¿Te gusta …?\nB: Sí, me gusta mucho …',
      must: [{ re: '¿\\s*te gustan?', label: '¿Te gusta(n) …? 질문' }, { re: W0 + 'me (gustan?|encantan?)' + W1, label: 'Me gusta(n) / Me encanta(n)' },
        { re: 'a m[ií] (tambi[eé]n|tampoco|no|s[ií])' + W1, label: '맞장구 (A mí también / tampoco / no / sí)' }, { re: W0 + 'prefiero' + W1, label: 'prefiero' },
        { re: '(sobre todo|especialmente)', label: 'sobre todo / especialmente' }],
      model: 'A: ¿Te gusta escuchar música? B: Sí, me encanta, sobre todo el pop. ¿Y a ti? A: A mí también, pero prefiero tocar la guitarra.' }));
  };

  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Pregunta a tu compañero si le gustan las cosas de la lista.')}
      <div class="ybox two-col"><div><b>¿Te gusta ...?</b><p>ir al cine</p><p>la música</p><p>bailar y cantar</p><p>hacer deporte</p></div><div><b>¿Te gustan ...?</b><p>las películas de terror</p><p>las películas cómicas</p><p>el tango y la salsa</p><p>el béisbol y el tenis</p></div></div>
      ${modelo('A: ¿Te gusta ir al cine?<br>B: Sí, me gusta mucho.<br>A: ¿Qué tipo de películas te gusta?<br>B: Me encantan las películas de terror.')}
      <h3 class="h3">✍️ 질문을 완성해서 쓰세요 (¿ ? 부호까지!)</h3><div class="items two"></div>
      <h3 class="h3">✍️ "¿Qué tipo de películas te gusta?"에 답하세요</h3><div class="f"></div>`);
    ['ir al cine', 'las películas de terror', 'la música', 'las películas cómicas', 'bailar y cantar', 'el tango y la salsa', 'hacer deporte', 'el béisbol y el tenis'].forEach((x, i) => {
      const pl = /^(las|los)|y la salsa|y el tenis/.test(x);
      put(s, '.items', writeItem({ id: 'a1-' + i, sec: 'a1', skill: 'gus', prompt: `<span class="chip">${x}</span>`, ph: '¿Te …?', answers: [`¿Te ${pl ? 'gustan' : 'gusta'} ${x}?`] }));
    });
    put(s, '.f', freeItem({ id: 'a1-f', sec: 'a1', line: true, ph: 'Me encantan las películas …', must: [{ re: W0 + 'me (encantan|gustan)( mucho)? las pel[ií]culas', label: 'Me encantan / Me gustan las películas …' }], model: 'Me encantan las películas cómicas.' }));
  };

  const CHAIN = ['leer', 'ver los partidos de fútbol', 'jugar al tenis', 'escuchar música', 'ir a la playa', 'cocinar'];
  const CHAIN_E = ['📚', '⚽', '🎾', '🎧', '🏖️', '🍳'];
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Utiliza el verbo <i>preferir</i> y haz una cadena.', { kr: '앞 문장의 "prefiero ~"를 받아 다음 문장을 이어 쓰는 사슬 만들기' })}
      ${modelo('<div class="wave">Me gusta leer, pero prefiero ver los partidos de fútbol.<br>Me gusta ver los partidos de fútbol, pero prefiero jugar al tenis.<br>Me gusta jugar al tenis, pero …</div>')}
      <div class="chain"></div><div class="items"></div>
      <h3 class="h3">⭐ 도전 — 3인칭으로 쓰기</h3><div class="items ch"></div>`);
    const drawChain = () => {
      $('.chain', s).innerHTML = CHAIN.map((c, i) => {
        const done = i === 0 || i === 1 || (SC.items()['a2-' + (i - 1)] && SC.items()['a2-' + (i - 1)].last > 0);
        return `${i ? '<span class="link ' + (done ? 'on' : '') + '">⛓</span>' : ''}<span class="node ${done ? 'on' : ''}"><span>${CHAIN_E[i]}</span>${c}</span>`;
      }).join('');
    };
    for (let i = 2; i < CHAIN.length; i++) {
      const k = i - 1;
      put(s, '.items', writeItem({ id: 'a2-' + k, sec: 'a2', skill: 'pre', prompt: `<b>${k + 1}.</b> 앞 고리: <span class="chip">${CHAIN[i - 1]}</span> → 다음 고리: ${CHAIN_E[i]} <span class="chip">${CHAIN[i]}</span>`,
        ph: `Me gusta ${CHAIN[i - 1]}, pero …`, answers: [`Me gusta ${CHAIN[i - 1]}, pero prefiero ${CHAIN[i]}.`], onCheck: drawChain }));
    }
    put(s, '.ch', writeItem({ id: 'a2-c', sec: 'a2', skill: 'pre', prompt: '후안은 독서를 좋아하지만 영화 보는 것을 더 좋아한다.', ph: 'A Juan …', answers: ['A Juan le gusta leer, pero prefiere ver películas.'] }));
    drawChain();
  };

  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'a) Relaciona los dibujos con una de las expresiones del recuadro.', { kr: '표현을 누른 뒤 그림 카드를 누르면 연결돼요.' })}
      <div class="ybox bank"></div><div class="pics"></div><div class="item-row"><button class="btn chk m">채점하기</button><span class="mscore"></span></div>
      <h2 class="act-title">b) ¿Te gusta hacer las cosas de la lista de arriba? ¿Y a tu compañero?</h2>
      ${modelo('A: A mí me gusta esquiar, ¿y a ti?<br>B: A mí también. / A mí no. Me gusta jugar al fútbol.<br>A: A mí no me gusta ver exposiciones, ¿y a ti?<br>B: A mí tampoco. / A mí sí. A mí me gusta mucho.')}
      ${tip('먼저 <b>나의 취향</b>(❤️/🙅)을 고르고, 그에 맞는 맞장구를 쓰세요.')}
      <div class="items react"></div>`);
    const st = sel('a3');
    let picked = null;
    const words = shuffle(D.act3.map(x => x.es));
    const bank = $('.bank', s), pics = $('.pics', s);
    bank.innerHTML = words.map(w => `<button class="wchip" data-w="${esc(w)}">${w}</button>`).join('');
    pics.innerHTML = D.act3.map((p, i) => { reg('a3-m' + i, 'a3', 'voc'); return `<div class="pic" data-i="${i}"><span class="num">${i + 1})</span><span class="emo">${p.e}</span><span class="slot"></span><span class="mkbox"></span></div>`; }).join('');
    const paint = () => {
      $$('.pic', pics).forEach(p => { const v = st[p.dataset.i]; $('.slot', p).textContent = v || '?'; p.classList.toggle('filled', !!v); });
      $$('.wchip', bank).forEach(b => { b.classList.toggle('used', Object.values(st).includes(b.dataset.w)); b.classList.toggle('sel', b.dataset.w === picked); });
    };
    $$('.wchip', bank).forEach(b => b.onclick = () => { picked = b.dataset.w; paint(); });
    $$('.pic', pics).forEach(p => p.onclick = () => {
      if (!picked) { if (st[p.dataset.i]) { delete st[p.dataset.i]; save(); paint(); } return; }
      Object.keys(st).forEach(k => { if (st[k] === picked) delete st[k]; });
      st[p.dataset.i] = picked; picked = null; save(); paint();
    });
    $('.m', s).onclick = () => {
      let ok = 0;
      $$('.pic', pics).forEach(p => { const i = +p.dataset.i, good = st[i] === D.act3[i].es; if (good) ok++; record('a3-m' + i, good ? 1 : 0, good ? [] : ['otro'], {}); p.classList.remove('ok', 'no'); p.classList.add(good ? 'ok' : 'no'); $('.mkbox', p).innerHTML = MARK(good ? 1 : 0) + (good ? '' : `<small>${D.act3[i].es}</small>`); });
      $('.mscore', s).innerHTML = `<b>${ok} / 9</b>`;
    };
    paint();
    const R = [['A mí me gusta esquiar, ¿y a ti?', true], ['A mí no me gusta ver exposiciones, ¿y a ti?', false], ['A mí me encanta cocinar, ¿y a ti?', true], ['A mí no me gusta lavar la ropa, ¿y a ti?', false]];
    const rs = sel('a3r');
    R.forEach(([q, pos], i) => {
      const box = el(`<div class="react-row"><div class="q">A: ${q} ${say(q)}</div><div class="tg"><button data-v="1">❤️ 나는 좋아</button><button data-v="0">🙅 나는 싫어</button></div></div>`);
      const tg = () => $$('.tg button', box).forEach(b => b.classList.toggle('on', rs[i] === b.dataset.v));
      $$('.tg button', box).forEach(b => b.onclick = () => { rs[i] = b.dataset.v; save(); tg(); });
      tg();
      box.appendChild(writeItem({ id: 'a3-r' + i, sec: 'a3', skill: 'acu', ph: 'B: A mí …', prefix: true,
        answers: () => rs[i] == null ? null : [pos ? (rs[i] === '1' ? 'A mí también.' : 'A mí no.') : (rs[i] === '1' ? 'A mí sí.' : 'A mí tampoco.')] }));
      put(s, '.react', box);
    });
  };

  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Habla con tus compañeros siguiendo el modelo.')}
      ${modelo('A: ¿Qué país te gusta?<br>B: España.<br>A: ¿Por qué?<br>B: Porque estudio español y tengo muchos amigos allí.')}
      ${tip('<b>¿Por qué?</b> (왜?) — 띄어 쓰고 악센트 / <b>Porque</b> (왜냐하면) — 붙여 쓰고 악센트 없음.<br>복수 명사를 물을 때: ¿Qué actividades culturales te <b>gustan</b>?')}
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items two"></div>
      <h3 class="h3">✍️ 대답 쓰기 — 위 주제 중 3개를 골라 이유(porque)와 함께</h3><div class="f"></div>`);
    [['película', '영화'], ['comida', '음식'], ['deporte', '스포츠'], ['actividades culturales', '문화 활동'], ['lugar de vacaciones', '휴가지'], ['canción', '노래']].forEach(([w, k], i) => {
      const pl = w === 'actividades culturales';
      put(s, '.items', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'gus', prompt: `${i + 1}) <span class="chip">${w}</span> <span class="small">어떤 ${k}을(를) 좋아해?</span>`, ph: '¿Qué …?',
        answers: pl ? ['¿Qué actividades culturales te gustan?'] : [`¿Qué ${w} te gusta?`] }));
    });
    put(s, '.f', freeItem({ id: 'a4-f', sec: 'a4', rows: 5, ph: 'Me gusta el fútbol porque …',
      must: [{ re: W0 + 'porque' + W1, label: 'porque 3번 이상', min: 3 }, { re: W0 + 'me (gustan?|encantan?)' + W1, label: 'Me gusta(n) / Me encanta(n) 3번 이상', min: 3 }],
      model: 'Me gusta la paella porque es muy rica. Me encanta el fútbol porque es emocionante. Me gusta Cancún porque tiene playas bonitas.' }));
  };

  const A5 = [['jugar al fútbol', 'M+'], ['cocinar', 'M+'], ['los platos mexicanos', 'M+'], ['bailar', 'M-'], ['las discotecas', 'M-'],
    ['el tenis', 'A+'], ['la salsa', 'A+'], ['las películas de terror', 'A+'], ['el fútbol', 'A-'], ['hacer la compra', 'A-']];
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Escucha esta conversación entre Marcos y Adriana. A continuación, habla de sus gustos.', { listen: true })}
      <div class="notice">🎧 교재 음원 대신 <b>읽기 · 듣기 자료</b>로 구성했어요 (교재 원음원과 내용이 다를 수 있음). ▶ 버튼으로 들어 보세요.</div>
      <h3 class="h3"><button class="btn ghost sm" id="play5">▶ 대화 듣기</button> <button class="btn ghost sm" id="hide5">대화 가리기</button></h3>
      <div id="d5txt">${dialogHTML(D.dialogo5)}</div>
      <h3 class="h3">① 표 완성 — 표현을 누르고 알맞은 칸을 누르세요</h3>
      <div class="ybox bank5"></div>
      <table class="lg"><tr><th></th><th>le gusta 😊</th><th>no le gusta 🙁</th></tr>
        <tr><th>A Marcos</th><td data-c="M+"></td><td data-c="M-"></td></tr><tr><th>A Adriana</th><td data-c="A+"></td><td data-c="A-"></td></tr></table>
      <div class="item-row"><button class="btn chk t">표 채점</button><span class="tscore"></span></div>
      <h3 class="h3">② 3인칭으로 쓰기 — A Marcos le gusta …</h3><div class="items two w5"></div>`);
    $('#play5', s).onclick = e => playLines(D.dialogo5, e.currentTarget);
    $('#hide5', s).onclick = e => { const t = $('#d5txt', s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '대화 보기' : '대화 가리기'; };
    const st = sel('a5');
    let picked = null;
    A5.forEach((x, i) => reg('a5-t' + i, 'a5', 'pro'));
    const bank = $('.bank5', s);
    const order = shuffle(A5.map((x, i) => i));
    const paint = () => {
      bank.innerHTML = order.filter(i => !st[i]).map(i => `<button class="wchip ${picked === i ? 'sel' : ''}" data-i="${i}">${A5[i][0]}</button>`).join('') || '<span class="small">모두 배치했어요 ✔</span>';
      $$('td[data-c]', s).forEach(td => { td.innerHTML = Object.keys(st).filter(i => st[i] === td.dataset.c).map(i => `<button class="wchip in" data-i="${i}">${A5[i][0]}</button>`).join(''); });
      $$('.wchip', s).forEach(b => b.onclick = ev => { ev.stopPropagation(); const i = +b.dataset.i; if (b.classList.contains('in')) { if (picked != null) { st[picked] = b.closest('td').dataset.c; picked = null; } else delete st[i]; save(); } else picked = i; paint(); });
    };
    $$('td[data-c]', s).forEach(td => td.onclick = () => { if (picked == null) return; st[picked] = td.dataset.c; picked = null; save(); paint(); });
    paint();
    $('.t', s).onclick = () => {
      let ok = 0;
      A5.forEach(([w, c], i) => { const g = st[i] === c; if (g) ok++; record('a5-t' + i, g ? 1 : 0, g ? [] : ['otro'], {}); });
      $$('td[data-c] .wchip', s).forEach(b => { const i = +b.dataset.i; b.classList.add(A5[i][1] === st[i] ? 'ok' : 'no'); });
      $('.tscore', s).innerHTML = `${MARK(ok / A5.length)} <b>${ok} / ${A5.length}</b>`;
    };
    [['마르코스는 춤추는 것을 좋아하지 않는다.', ['A Marcos no le gusta bailar.']], ['아드리아나는 공포 영화를 정말 좋아한다.', ['A Adriana le encantan las películas de terror.', 'A Adriana le gustan mucho las películas de terror.']],
      ['마르코스는 멕시코 요리를 정말 좋아한다.', ['A Marcos le encantan los platos mexicanos.', 'A Marcos le gustan mucho los platos mexicanos.']], ['아드리아나는 축구를 좋아하지 않는다.', ['A Adriana no le gusta el fútbol.']],
      ['아드리아나는 축구보다 테니스를 더 좋아한다. (preferir)', ['Adriana prefiere el tenis al fútbol.', 'Adriana prefiere el tenis.']]].forEach(([p, a], i) =>
      put(s, '.w5', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: i === 4 ? 'pre' : 'pro', prompt: p, answers: a })));
  };

  const FREQ_ORDER = ['siempre', 'todos los días', 'a menudo', 'de vez en cuando', 'nunca'];
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Dos amigos, María y Pedro, hablan sobre sus deportes favoritos a la salida del colegio.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) 표현 바꿔 쓰기</h3>
      <div class="chips"><span class="hlc c0">los martes</span><span class="hlc c1">por semana</span><span class="hlc c2">¿por qué no vienes?</span><span class="hlc c0">magnífico</span></div>
      <div class="items rep"></div>
      <h3 class="h3">② 빈도 표현 (Frecuencia)</h3>
      <div class="freq">${[['siempre', '항상', 100], ['todos los días / cada día', '매일', 85], ['a menudo', '자주', 65], ['dos veces a la semana / por semana', '일주일에 두 번', 45], ['de vez en cuando', '가끔', 25], ['nunca', '전혀 ~않다', 3]]
        .map(([e, k, p]) => `<div class="fr"><span class="fl">${e} ${say(e.split(' / ')[0])}</span><span class="fbar"><i style="width:${p}%"></i></span><span class="fk">${k}</span></div>`).join('')}</div>
      ${tip('<b>nunca</b>가 동사 앞이면 no 없이: Nunca voy a la piscina. / 동사 뒤면 no와 함께: No voy nunca a la piscina.')}
      <div class="item sortq"><div class="item-p">자주 하는 순서대로 누르세요 (많이 → 적게)</div><div class="sort-line"></div><div class="sort-bank"></div><div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">확인</button><span class="mkbox"></span></div></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    $('#hide2', s).onclick = e => { const t = $('#d2txt', s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };
    [['El deporte favorito de Pedro es el baloncesto.', 'Verdadero'], ['Pedro va a la piscina dos veces a la semana.', 'Falso'], ['María va al parque a menudo con su mascota.', 'Verdadero'], ['Pedro va a Sierra Nevada en verano.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'fre', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['Juego al baloncesto <u>cada martes</u>.', 'los martes', 'Juego al baloncesto los martes.'], ['Voy a la piscina dos veces <u>a la semana</u>.', 'por semana', 'Voy a la piscina dos veces por semana.'],
      ['Voy al parque con mis amigos, <u>¿te vienes?</u>', '¿por qué no vienes?', 'Voy al parque con mis amigos, ¿por qué no vienes?'], ['Sí, <u>¡genial!</u>', 'magnífico', 'Sí, ¡magnífico!']]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'fre', prompt: `${p} → <span class="chip">${k}</span>`, answers: [a] })));
    reg('d2-sort', 'd2', 'fre');
    const sq = $('.sortq', s); let ord = [];
    const draw = () => {
      ord = [];
      $('.sort-line', sq).innerHTML = '';
      $('.sort-bank', sq).innerHTML = shuffle(FREQ_ORDER).map(f => `<button class="tok">${f}</button>`).join('');
      $$('.sort-bank .tok', sq).forEach(b => b.onclick = () => { if (b.disabled) return; b.disabled = true; ord.push(b.textContent); $('.sort-line', sq).insertAdjacentHTML('beforeend', `<span class="tok in">${ord.length}. ${b.textContent}</span>`); });
    };
    draw();
    $('.rst', sq).onclick = draw;
    $('.chk', sq).onclick = () => { if (ord.length < 5) return; const ok = ord.join() === FREQ_ORDER.join(); record('d2-sort', ok ? 1 : 0, ok ? [] : ['otro'], {}); $('.mkbox', sq).innerHTML = MARK(ok ? 1 : 0) + (ok ? '' : ` <span class="ans">${FREQ_ORDER.join(' › ')}</span>`); };
  };

  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'De estas actividades, elige tres que te gustan y tres que no te gustan y anótalas en tu cuaderno. Luego habla con tu compañero. ¿Qué cosas os gustan a los dos?')}
      <div class="mode"><button data-m="like" class="on">❤️ 좋아하는 것 고르기 (3)</button><button data-m="dis">🙅 싫어하는 것 고르기 (3)</button></div>
      <div class="ybox pick6"></div>
      ${modelo('A mí me gusta mucho tocar el piano, navegar por Internet <b>e</b> ir a la playa, pero no me gusta hacer los deberes <b>ni</b> subir a la montaña.')}
      ${tip('<b>y → e</b> : i-/hi- 로 시작하는 단어 앞에서는 y 대신 e (navegar por Internet <b>e</b> ir…).<br><b>ni</b> : 부정문에서 "~도 …도 아니다" (no me gusta A <b>ni</b> B).')}
      <div class="f1"></div>
      <h3 class="h3">🤝 짝꿍과 비교하기 — 벤 다이어그램</h3>
      <p class="small">짝꿍이 좋아하는 것 3개를 고르거나, 🎲 가상 짝꿍을 만들어 보세요.</p>
      <div class="ybox pickp"></div><button class="btn ghost sm" id="rnd">🎲 가상 짝꿍</button>
      <div class="venn"><div class="c1"></div><div class="c2"></div><div class="vt"><div class="vl"><b>Yo</b><div class="v-a"></div></div><div class="vm"><b>A los dos</b><div class="v-b"></div></div><div class="vr"><b>Mi compañero</b><div class="v-c"></div></div></div></div>
      <div class="f2"></div>`);
    const st = sel('a6', { like: [], dis: [], partner: [] });
    let mode = 'like';
    const pick = $('.pick6', s), pp = $('.pickp', s);
    const paint = () => {
      pick.innerHTML = D.act6.map(a => `<button class="wchip ${st.like.includes(a) ? 'lk' : ''} ${st.dis.includes(a) ? 'dk' : ''}" data-a="${esc(a)}">${st.like.includes(a) ? '❤️ ' : st.dis.includes(a) ? '🙅 ' : ''}${a}</button>`).join('');
      pp.innerHTML = D.act6.map(a => `<button class="wchip ${st.partner.includes(a) ? 'pk' : ''}" data-a="${esc(a)}">${a}</button>`).join('');
      $$('.wchip', pick).forEach(b => b.onclick = () => {
        const a = b.dataset.a, arr = st[mode], other = st[mode === 'like' ? 'dis' : 'like'];
        if (arr.includes(a)) arr.splice(arr.indexOf(a), 1); else { if (arr.length >= 3) arr.shift(); if (other.includes(a)) other.splice(other.indexOf(a), 1); arr.push(a); }
        save(); paint();
      });
      $$('.wchip', pp).forEach(b => b.onclick = () => { const a = b.dataset.a; if (st.partner.includes(a)) st.partner.splice(st.partner.indexOf(a), 1); else { if (st.partner.length >= 3) st.partner.shift(); st.partner.push(a); } save(); paint(); });
      const both = st.like.filter(a => st.partner.includes(a));
      $('.v-a', s).innerHTML = st.like.filter(a => !both.includes(a)).map(a => `<span>${a}</span>`).join('') || '<i>—</i>';
      $('.v-b', s).innerHTML = both.map(a => `<span>${a}</span>`).join('') || '<i>—</i>';
      $('.v-c', s).innerHTML = st.partner.filter(a => !both.includes(a)).map(a => `<span>${a}</span>`).join('') || '<i>—</i>';
    };
    $$('.mode button', s).forEach(b => b.onclick = () => { mode = b.dataset.m; $$('.mode button', s).forEach(x => x.classList.toggle('on', x === b)); });
    $('#rnd', s).onclick = () => { st.partner = shuffle(D.act6).slice(0, 3); save(); paint(); };
    paint();
    const itemRe = a => ({ re: acc(a).replace(/ /g, '\\s+'), label: `“${a}”` });
    put(s, '.f1', freeItem({ id: 'a6-f1', sec: 'a6', rows: 4, prompt: '내가 고른 활동으로 modelo처럼 한 문장(또는 두 문장)을 쓰세요.', needMsg: '좋아하는 것 3개, 싫어하는 것 3개를 먼저 고르세요.',
      must: () => (st.like.length < 3 || st.dis.length < 3) ? null : [{ re: W0 + 'me gusta' + W1, label: 'me gusta' }, ...st.like.map(itemRe), { re: W0 + 'no me gusta' + W1, label: 'no me gusta' }, ...st.dis.map(itemRe), { re: W0 + 'ni' + W1, label: 'ni (부정 나열)' }],
      model: 'A mí me gusta mucho tocar el piano, pintar e ir a la playa, pero no me gusta hacer los deberes ni ordenar mi habitación ni subir a la montaña.' }));
    put(s, '.f2', freeItem({ id: 'a6-f2', sec: 'a6', skill: 'pro', line: true, prompt: '벤 다이어그램을 보고 쓰세요. 공통점이 있으면 <b>A los dos nos gusta …</b>, 없으면 <b>A mí me gusta …, pero a mi compañero le gusta …</b>', needMsg: '내 취향(좋아하는 것)과 짝꿍 취향을 먼저 고르세요.',
      must: () => {
        if (st.like.length < 1 || st.partner.length < 1) return null;
        const both = st.like.filter(a => st.partner.includes(a));
        return both.length ? [{ re: 'a los dos nos gusta', label: 'A los dos nos gusta' }, ...both.map(itemRe)]
          : [{ re: 'a m[ií] me gusta', label: 'A mí me gusta' }, { re: 'a mi compa[nñ]er[oa] le gusta', label: 'a mi compañero le gusta' }];
      } }));
  };

  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Practica con tu compañero siguiendo el modelo.')}
      ${modelo('A: ¿Qué te gusta hacer cuando hace viento?<br>B: Cuando hace viento, me gusta volar una cometa en la playa. ¿Y a ti?<br>A: Me gusta escuchar música.')}
      <div class="wx">${D.clima.map(c => `<div class="wxc"><span>${c.e}</span><b>${c.k}</b><small>${c.kr}</small></div>`).join('')}</div>
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items q7"></div>
      <h3 class="h3">✍️ 날씨별로 나의 대답 쓰기 — Cuando …, me gusta …</h3><div class="items a7"></div>`);
    put(s, '.q7', writeItem({ id: 'a7-q', sec: 'a7', skill: 'gus', prompt: '🌧️ 비가 올 때 뭐 하는 걸 좋아해?', ph: '¿Qué te gusta …?', answers: ['¿Qué te gusta hacer cuando llueve?'] }));
    D.clima.forEach((c, i) => put(s, '.a7', freeItem({ id: 'a7-' + i, sec: 'a7', line: true, prompt: `<span class="emo-sm">${c.e}</span> ¿Qué te gusta hacer cuando ${c.k}?`, ph: `Cuando ${c.k}, me gusta …`,
      must: [{ re: 'cuando ' + acc(c.k), label: `Cuando ${c.k}` }, { re: W0 + 'me (gusta|encanta)' + W1, label: 'me gusta / me encanta + 동사원형' }] })));
  };

  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Escucha la encuesta que le están haciendo a una chica mexicana. ¿Qué le gusta? Selecciona a o b.', { listen: true, kr: '교재 음원 대신 — 나라면 a와 b 중 무엇이 더 좋은지 골라 비교 문장을 써요.' })}
      <div class="pairs"></div>
      <h2 class="act-title">Ahora te toca a ti, ¿qué te gusta más?</h2>
      ${modelo('A mí me gusta más ________ que ________.')}<div class="items w8"></div>`);
    const st = sel('a8');
    const pr = $('.pairs', s);
    const paint = () => {
      pr.innerHTML = D.act8.map((p, i) => `<div class="pair"><b>${i + 1})</b>${['a', 'b'].map(k => `<button class="pc ${st[i] === k ? 'on' : ''}" data-i="${i}" data-k="${k}"><small>${k}.</small><span>${p[k].e}</span>${p[k].es}</button>`).join('')}</div>`).join('');
      $$('.pc', pr).forEach(b => b.onclick = () => { st[b.dataset.i] = b.dataset.k; save(); paint(); });
    };
    paint();
    D.act8.forEach((p, i) => put(s, '.w8', writeItem({ id: 'a8-' + i, sec: 'a8', skill: 'com', prompt: `${i + 1}) ${p.a.e} ${p.a.es} vs ${p.b.e} ${p.b.es}`, ph: 'A mí me gusta más …',
      answers: () => { const k = st[i]; if (!k) return null; const x = p[k].es, y = p[k === 'a' ? 'b' : 'a'].es; return withAmi([`Me gusta más ${x} que ${y}.`]); } })));
  };

  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Habla de tus gustos con tu compañero siguiendo el modelo.')}
      <div class="ybox wordbank">단어 상자: <span>aficiones</span><span>a ti</span><span>nadar</span><span>algún</span><span>sábados</span><span>más</span><span>teatro</span></div>
      <div class="c9"></div>
      <h3 class="h3">✍️ 나의 대답</h3><div class="items f9"></div>`);
    put(s, '.c9', cloze({ id: 'a9c', sec: 'a9', skill: 'gus', cls: 'lines modelo-like', text:
      ['A: ¿Qué [aficiones] tienes?', 'B: Me gusta ir al [teatro]. Y [a ti], ¿qué te gusta hacer?', 'A: Me gusta [nadar] en la piscina. ¿Tú haces [algún] deporte?',
        'B: Sí, yo juego al tenis todos los [sábados] por la tarde con mi hermana.', 'A: Yo también juego al tenis, pero me gusta [más] la natación.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.f9', freeItem({ id: 'a9-1', sec: 'a9', line: true, prompt: '¿Qué aficiones tienes?', ph: 'Me gusta …', must: [{ re: W0 + 'me (gusta|encanta)n?' + W1, label: 'Me gusta / Me encanta' }], minWords: 4 }));
    put(s, '.f9', freeItem({ id: 'a9-2', sec: 'a9', line: true, prompt: '¿Tú haces algún deporte? ¿Cuándo?', ph: 'Sí, juego al … los …', must: [{ re: W0 + '(juego|hago|practico|no hago|no practico|no juego|nado|corro|esqu[ií]o)' + W1, label: '1인칭 동사 (juego / hago / practico …)' }, { re: FREQ, label: '빈도 표현 (los sábados, a menudo …)' }] }));
  };

  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Habla con tus compañeros.', { kr: '질문의 동사를 1인칭으로 바꿔 대답해요: practicas → practico, ves → veo, vas → voy' })}<div class="items"></div>`);
    [['¿Qué deporte te gusta más? ¿Por qué?', [{ re: W0 + 'me gustan? m[aá]s' + W1, label: 'Me gusta más …' }, { re: W0 + 'porque' + W1, label: 'porque' }]],
      ['¿Te gusta el fútbol? ¿El tenis? ¿El baloncesto?', [{ re: W0 + '(no )?me (gustan?|encantan?)' + W1, label: '(No) me gusta …' }, { re: '(f[uú]tbol|tenis|baloncesto)', label: '종목 이름' }]],
      ['¿Practicas algún deporte?', [{ re: W0 + '(practico|no practico|juego|no juego|hago|no hago)' + W1, label: 'practico / juego / hago' }]],
      ['¿Con qué frecuencia lo practicas?', [{ re: FREQ, label: '빈도 표현' }]],
      ['¿Ves partidos de fútbol en la televisión?', [{ re: W0 + '(veo|no veo|nunca veo)' + W1, label: 'veo / no veo' }]],
      ['¿Vas a ver partidos de béisbol?', [{ re: W0 + '(voy|no voy|nunca voy)' + W1, label: 'voy / no voy' }]]]
      .forEach(([q, m], i) => put(s, '.items', freeItem({ id: 'a10-' + i, sec: 'a10', skill: i === 3 ? 'fre' : 'lib', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m })));
  };

  B.a11 = () => {
    const s = sec('a11', `${actHead(11, '¿Qué prefieres? Explícale a tu compañero por qué.')}
      ${modelo('Prefiero la playa <b>porque</b> me gusta nadar y tomar el sol.')}<div class="p11"></div>
      <h3 class="h3">📊 나의 선택 그래프</h3><div class="poll"></div>`);
    const st = sel('a11');
    const drawPoll = () => {
      $('.poll', s).innerHTML = D.act11.map((p, i) => { const k = st[i]; return `<div class="pl"><span>${p.tema}</span><div class="plb"><i class="${k === 'a' ? 'on' : ''}">${p.a.e} ${p.a.es}</i><i class="${k === 'b' ? 'on' : ''}">${p.b.e} ${p.b.es}</i></div></div>`; }).join('');
    };
    D.act11.forEach((p, i) => {
      const box = el(`<div class="pair11"><div class="ph">${i + 1}) ${p.tema}: ${p.a.es} / ${p.b.es}</div><div class="pr2">${['a', 'b'].map(k => `<button class="pc" data-k="${k}"><span>${p[k].e}</span>${p[k].es}</button>`).join('')}</div></div>`);
      const tg = () => $$('.pc', box).forEach(b => b.classList.toggle('on', st[i] === b.dataset.k));
      $$('.pc', box).forEach(b => b.onclick = () => { st[i] = b.dataset.k; save(); tg(); drawPoll(); });
      tg();
      box.appendChild(freeItem({ id: 'a11-' + i, sec: 'a11', skill: 'pre', line: true, ph: 'Prefiero … porque …',
        must: () => st[i] ? [{ re: W0 + 'prefiero' + W1, label: 'Prefiero' }, { re: acc(p[st[i]].es.replace(/^(el|la) /, '')), label: `내가 고른 것: ${p[st[i]].es}` }, { re: W0 + 'porque' + W1, label: 'porque + 이유' }] : null }));
      put(s, '.p11', box);
    });
    drawPoll();
  };


  const UT_KR = ['뭐 하는 걸 좋아해?', '책 읽는 건 좋아하지만 영화관은 안 좋아해.', '나는 디스코텍과 오토바이를 좋아해.', '그림 그리는 걸 아주 좋아해.', '춤추고 노래하는 걸 정말 좋아해.',
    '눈 속에서 노는 걸 좋아해.', '나도. / 나는 아니야.', '축구도 테니스도 안 좋아해.', '나도 안 좋아해. / 나는 좋아해.', '기타 치는 걸 누가 좋아해?', '올가는 기타 치는 걸 좋아해.'];

  SC.lesson({
    num: '09',
    title: 'Me gusta mucho viajar',
    ttsTest: '¡Hola! Me gusta mucho viajar.',
    cover: {
      heroHTML: '<div class="sun"></div><div class="sea"></div><div class="sand"></div><div class="reader">📖<span>👒</span></div>',
      tema: ['Deportes y actividades de tiempo libre', 'Gustos personales'],
      com: ['Expresar gustos personales', 'Expresar coincidencia y diferencia de gustos', 'Expresar diversos grados de gustos personales'],
      gram: ['Verbos: <i>gustar, encantar, preferir</i>', 'Pronombres de objeto indirecto', 'Adverbios: <i>también, tampoco, sí, no</i>', 'Comparaciones']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      J: { g: 'm', name: 'Juan', av: '🧑🏻‍🦱', side: 'l' }, C: { g: 'f', name: 'Cristina', av: '👩🏼‍🦰', side: 'r' },
      'María': { g: 'f', av: '👱🏼‍♀️', side: 'r' }, Pedro: { g: 'm', av: '🧑🏽', side: 'l' }, Marcos: { g: 'm', av: '👦🏻', side: 'l' }, Adriana: { g: 'f', av: '👧🏽', side: 'r' }
    },
    errLabels: { concordancia: 'gusta / gustan 일치', pronombre: '대명사 me·te·le·nos·os·les', conjugacion: '동사 변화 (preferir)' },
    errTips: {
      acento: 'también, música, película, fútbol, a mí … 악센트도 철자예요. 시험에서는 감점됩니다.',
      concordancia: '좋아하는 대상이 주어! 단수·동사원형 → gusta, 복수 명사 → gustan',
      pronombre: 'a mí→me, a ti→te, a él/ella→le, a nosotros→nos, a vosotros→os, a ellos→les',
      conjugacion: 'preferir: prefiero, prefieres, prefiere, preferimos, preferís, prefieren',
      estructura: '"Yo gusto"(✕) 대신 "Me gusta"(○). encantar 에는 mucho를 붙이지 않아요.'
    },
    classify(ti, ta) {
      const sw = (x, y) => (ti.includes(x) && ta.includes(y));
      if (sw('gusta', 'gustan') || sw('gustan', 'gusta') || sw('encanta', 'encantan') || sw('encantan', 'encanta')) return 'concordancia';
      const P = ['me', 'te', 'le', 'nos', 'os', 'les'];
      if (ti.filter(w => P.includes(w)).join() !== ta.filter(w => P.includes(w)).join()) return 'pronombre';
      const vi = ti.find(w => /^pref/.test(w)), va = ta.find(w => /^pref/.test(w));
      if (va && vi !== va) return 'conjugacion';
      if (ti.includes('gusto')) return 'estructura';
      return null;
    },
    errRules: [
      { re: W0 + 'yo gusto' + W1, t: 'estructura', msg: '"Yo gusto"(✕) → "Me gusta"' },
      { re: W0 + 'mi gustan?' + W1, t: 'pronombre', msg: '"mi gusta"(✕) → "me gusta"' },
      { re: W0 + '(me|te|le|nos|os|les) gusta (las|los|mis|tus)' + W1, t: 'concordancia', msg: '복수 명사 앞 → gustan' },
      { re: W0 + '(me|te|le|nos|os|les) encanta (las|los|mis|tus)' + W1, t: 'concordancia', msg: '복수 명사 앞 → encantan' },
      { re: W0 + '(me|te|le|nos|os|les) (gustan|encantan) (leer|ver|ir|jugar|bailar|cantar|cocinar|nadar|pintar|viajar|escuchar|tocar|esquiar|pasear|hacer|comer|navegar|subir|estudiar)' + W1, t: 'concordancia', msg: '동사원형 앞 → gusta / encanta' },
      { re: W0 + 'encantan? mucho' + W1, t: 'estructura', msg: 'encantar + mucho(✕) → "Me encanta" 또는 "Me gusta mucho"' },
      { re: W0 + '(prefero|prefiro|preferio|prefiere?mos|prefieris|prefierís|preferen|preferes|prefere)' + W1, t: 'conjugacion', msg: 'preferir 변화: prefiero · prefieres · prefiere · preferimos · preferís · prefieren' },
      { re: W0 + 'y(?= h?[ií](?![eéa]))', t: 'estructura', msg: 'i-/hi- 앞의 y → e (navegar por Internet e ir…)' },
      { re: W0 + 'mas' + W1, t: 'acento', msg: '비교의 "más"' },
      { re: '(?<=' + W0 + 'a )mi(?=\\s*((me|tambi[eé]n|tampoco|no|s[ií])' + W1 + '|[,.?!]))', t: 'acento', msg: '전치사 뒤 "a mí"' },
      { re: '(?<=' + W0 + 'a m[ií] )si' + W1, t: 'acento', msg: '"A mí sí" (긍정의 sí)' }
    ],
    accWords: ['natación', 'clásicas', 'canciones', 'montaña', 'américa', 'violín', 'acción', 'cómicas', 'románticas', 'béisbol', 'exposición', 'género', 'batería', 'esquí', 'frío'],
    utiles: D.utiles.map((es, i) => ({ es, kr: UT_KR[i] })),
    utilScramble: ['Me gusta leer, pero no me gusta el cine.', 'Me gustan las discotecas y las motos.', '¿Qué te gusta hacer?', 'No me gusta el fútbol ni el tenis.', '¿A quién le gusta tocar la guitarra?', 'A Olga le gusta tocar la guitarra.'],
    utilSkill: 'gus',
    proverbio: { es: 'Quien busca, halla.', e: '🕵️', answer: '구하라, 그러면 찾을 것이다', options: ['티끌 모아 태산', '구하라, 그러면 찾을 것이다', '원숭이도 나무에서 떨어진다', '가는 말이 고와야 오는 말이 곱다'], kr: '찾는 사람이 찾아낸다 — 노력하면 얻는다는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Charla con tus compañeros → 글로 쓰기',
        icons: ['🎻', '🎸', '🎬'],
        questions: ['¿Qué tipo de música prefieres? ¿Cuáles son tus artistas favoritos? ¿Prefieres escuchar la música clásica o la música pop?',
          '¿Qué tipo de instrumento sabes tocar? (guitarra, piano, violín, flauta, violonchelo, trompeta)',
          '¿Qué tipo de películas te gusta? (románticas, cómicas, musicales, de acción, de misterio, de terror)'],
        minWords: 60,
        hint: 'gustar · encantar · preferir · 비교 · también/tampoco 를 활용하면 높은 점수!',
        ph: 'Me encanta la música pop, sobre todo …',
        connectors: ['pero', 'porque', 'sobre todo', 'especialmente', 'y', 'e', 'también', 'además', 'cuando'],
        rubric: [
          { k: 'mus', label: '음악 취향 (tipo de música)', max: 8, re: 'm[uú]sica|pop|rock|jazz|reguet[oó]n|k-?pop|salsa|tango|flamenco|hip ?hop|cantante|artista|grupo', ax: 'Contenido' },
          { k: 'ins', label: '악기 (instrumento)', max: 8, re: 'guitarra|piano|viol[ií]n|flauta|violonc?h?elo|trompeta|bater[ií]a|ukelele|instrumento', ax: 'Contenido' },
          { k: 'pel', label: '영화 장르 (películas)', max: 8, re: 'pel[ií]culas?|cine', ax: 'Contenido' },
          { k: 'gus', label: 'gustar (gusta / gustan)', max: 8, re: '(me|te|le|nos|os|les) gustan?', ax: 'Gramática' },
          { k: 'enc', label: 'encantar', max: 6, re: '(me|te|le|nos|os|les) encantan?', ax: 'Gramática' },
          { k: 'pre', label: 'preferir', max: 8, re: '(prefiero|prefieres|prefiere|preferimos|prefer[ií]s|prefieren)', ax: 'Gramática' },
          { k: 'com', label: '비교 más / menos … que', max: 8, re: '(m[aá]s|menos)' + W1 + '[^.?!]*' + W0 + 'que', ax: 'Gramática' },
          { k: 'acu', label: 'también / tampoco / ni', max: 6, re: '(tambi[eé]n|tampoco|ni)', ax: 'Gramática' }
        ],
        model: 'Me encanta la música pop, sobre todo las canciones de BTS. También me gusta la música clásica, pero prefiero el pop porque es más alegre. Sé tocar el piano y un poco la guitarra. Me gustan mucho las películas cómicas y las de acción, pero no me gustan las películas de terror. A mi hermana tampoco.'
      }
    },
    build: B
  });
})();
