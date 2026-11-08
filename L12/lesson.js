/* Lección 12 · Cuando era niño, nadábamos en el río — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    matchPics, pairMatch, sortBoard, flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, dialogHTML, clozeFromDialog, MARK } = SC;

  /* ---------- 학습 데이터 ---------- */
  const D = {
    skills: {
      voc: 'Vocabulario 어휘',
      reg: 'Imperfecto 규칙 활용',
      irr: 'Irregulares ser·ir·ver',
      hab: 'Hábitos 과거의 습관·빈도',
      ant: 'Antes/Ahora 과거·현재 비교',
      pre: 'Preposiciones a · de',
      con: 'Contraste 단순과거 vs 불완료',
      lib: 'Escritura libre 자유작문'
    },
    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '어린 시절 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '불완료과거 문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '선생님의 어린 시절', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '¿Con qué frecuencia hacías…?', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '어린 시절 이야기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '¿Cómo era…? 추억 묘사', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '유명인 인터뷰 (usted)', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '어렸을 때 뭐 했어?', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '1450년 잉카의 집 — 틀린 그림', group: 'Diálogo 1', kind: 'act', n: 6 },
      { id: 'd2', label: 'Diálogo 2', kr: '할아버지와 손녀', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a7', label: 'Actividad 7', kr: 'Antes / Ahora 그림 비교', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '나의 Antes / Ahora 표', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '몇 년 전의 생활 인터뷰', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '마누엘의 열세 살', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '열 살 때의 나', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    lectura: 'En aquellos maravillosos años, me gustaba pasar el rato con mi familia. Los fines de semana, pasábamos el tiempo jugando a juegos de mesa. También me encantaba el día de mi cumpleaños. Siempre hacía una gran fiesta y lo celebraba con mis amigos. Además, después del colegio, jugábamos, saltábamos y nos divertíamos en la calle todos juntos.',

    vocab: [
      { e: '👨‍👩‍👧', es: 'pasar el rato con la familia', kr: '가족과 시간을 보내다' },
      { e: '🎲', es: 'jugar a juegos de mesa', kr: '보드게임을 하다' },
      { e: '🎂', es: 'el día de mi cumpleaños', kr: '내 생일날' },
      { e: '🎉', es: 'hacer una gran fiesta', kr: '큰 파티를 하다' },
      { e: '🥳', es: 'celebrar', kr: '축하하다 · 기념하다' },
      { e: '🦘', es: 'saltar', kr: '뛰다 · 점프하다' },
      { e: '😆', es: 'divertirse', kr: '즐겁게 놀다' },
      { e: '🏊', es: 'nadar en el río', kr: '강에서 수영하다' },
      { e: '🧸', es: 'la infancia / la niñez', kr: '어린 시절' },
      { e: '🪀', es: 'el juguete', kr: '장난감' },
      { e: '🥺', es: 'echar de menos / extrañar', kr: '그리워하다' },
      { e: '🥱', es: 'aburrirse', kr: '지루해하다' }
    ],

    dialogo1: [
      { who: 'E', es: 'Profesor, ¿Dónde vivía [cuando era niño]?' },
      { who: 'P', es: 'Cuando era niño, vivía con mi familia en un pueblo pequeño en el campo. Pero después nos fuimos a una ciudad porque mi padre cambió su trabajo.' },
      { who: 'E', es: '¿Y cómo era su vida allí?' },
      { who: 'P', es: 'Mi vida era muy tranquila. [Paseaba] por el campo. Jugaba todas las tardes con mis amigos y por las noches veía las estrellas.' },
      { who: 'E', es: '¿[Echa de menos] su vida en el campo?' },
      { who: 'P', es: '[Bastante], prefiero la tranquilidad del campo.' },
      { who: 'E', es: '¿No se aburría?' },
      { who: 'P', es: '¿Aburrirme? ¡Qué va!' }
    ],

    dialogo2: [
      { who: 'Chica', es: 'Abuelo, ¿[cuando eras pequeño] tenías televisión?' },
      { who: 'Abuelo', es: '[¡Qué va!] No había televisiones, ni [ordenadores], ni tantos coches.' },
      { who: 'Chica', es: '¿Y qué hacías todo el día?' },
      { who: 'Abuelo', es: 'Pues más o menos lo mismo que tú. Me levantaba por la mañana y mientras me duchaba, mi madre me preparaba el desayuno.' },
      { who: 'Chica', es: '¿Cómo ibas al colegio? ¿Andando o en autobús?' },
      { who: 'Abuelo', es: 'Yo iba andando al colegio, que estaba a unos diez minutos.' },
      { who: 'Chica', es: '¿Y después del colegio?' },
      { who: 'Abuelo', es: 'Depende. Algunos días teníamos clase por la tarde, entonces solíamos comer un bocadillo en el patio del colegio.' },
      { who: 'Chica', es: 'Y si no había televisión, ¿qué hacíais?' },
      { who: 'Abuelo', es: 'Pues escuchábamos la radio. A mí me gustaba escuchar música moderna, pero mi padre quería escuchar las noticias.' }
    ],

    /* Actividad 10 — TRANSCRIPCIONES */
    manuel: 'A los 13 años Manuel era un muchacho alto y moreno que llevaba el pelo largo. Vivía con su familia en un humilde piso. Su padre trabajaba en correos y su madre era ama de casa. Manuel iba a un colegio de su barrio, no le gustaba mucho estudiar y sacaba muy malas notas. Era bastante travieso y sus padres le castigaban con frecuencia. Pero por aquella época ya tenía mucho interés por la música: en sus ratos libres tocaba la guitarra e iba con su hermano a todos los conciertos.',

    utiles: [
      ['¿Dónde vivía cuando era niño?', '어렸을 때 어디에 사셨어요?'],
      ['De niño vivía en el campo.', '어렸을 때 시골에 살았어요.'],
      ['¿Cómo era su vida allí?', '그곳에서의 생활은 어땠어요?'],
      ['Mi vida era muy tranquila.', '제 생활은 아주 평온했어요.'],
      ['Por las noches veía las estrellas.', '밤마다 별을 보곤 했어요.'],
      ['Antes había pocos coches, ahora hay muchos.', '예전엔 차가 적었는데, 지금은 많아요.'],
      ['Llamé a Juan porque estaba muy nervioso.', '너무 긴장돼서 후안에게 전화했어요.'],
      ['Trabajaba en el hospital como voluntario de 8 a 12.', '8시부터 12시까지 병원에서 자원봉사를 했어요.']
    ],

    examBank: [
      { p: 'Cuando ____ niño, vivía en un pueblo. <i>(ser, yo)</i>', a: ['era'], s: 'irr' },
      { p: 'Mis amigos y yo ____ en el río. <i>(nadar)</i>', a: ['nadábamos'], s: 'reg' },
      { p: 'Antes ____ pocos coches, ahora hay muchos. <i>(haber)</i>', a: ['había'], s: 'ant' },
      { p: '¿Con qué frecuencia ____ en un diario? <i>(escribir, tú)</i>', a: ['escribías'], s: 'reg' },
      { p: 'De pequeño, yo ____ al colegio andando. <i>(ir)</i>', a: ['iba'], s: 'irr' },
      { p: 'Por las noches el profesor ____ las estrellas. <i>(ver)</i>', a: ['veía'], s: 'irr' },
      { p: 'Mis abuelos ____ en el campo. <i>(vivir)</i>', a: ['vivían'], s: 'reg' },
      { p: '¿Cuántos ____ en tu familia? <i>(ser, vosotros)</i>', a: ['erais'], s: 'irr' },
      { p: 'Antes Eduardo ____ bajito; ahora es alto. <i>(ser)</i>', a: ['era'], s: 'ant' },
      { p: 'Antes me levantaba tarde; ahora me ____ temprano. <i>(levantarse, 현재)</i>', a: ['levanto'], s: 'ant' },
      { p: 'Ana ____ a sus abuelos todos los domingos. <i>(visitar)</i>', a: ['visitaba'], s: 'hab' },
      { p: 'Nosotros ____ al parque a menudo. <i>(ir)</i>', a: ['íbamos'], s: 'hab' },
      { p: '____ niño vivía en el campo. <i>(어렸을 때)</i>', a: ['De'], s: 'pre' },
      { p: '____ los diez años era muy tímido. <i>(열 살 때)</i>', a: ['A'], s: 'pre' },
      { p: 'El colegio estaba ____ unos diez minutos de mi casa.', a: ['a'], s: 'pre' },
      { p: 'Trabajaba en el hospital ____ 8 a 12.', a: ['de'], s: 'pre' },
      { p: 'Ayer ____ a Juan porque estaba muy nervioso. <i>(llamar, yo)</i>', a: ['llamé'], s: 'con' },
      { p: 'Mi padre ____ su trabajo y nos fuimos a una ciudad. <i>(cambiar, 한 번 일어난 일)</i>', a: ['cambió'], s: 'con' },
      { p: 'Mientras me duchaba, mi madre me ____ el desayuno. <i>(preparar)</i>', a: ['preparaba'], s: 'reg' },
      { p: '¿Echas ____ menos tu vida en el campo?', a: ['de'], s: 'voc' }
    ]
  };

  /* ---------- 도우미 ---------- */
  const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
  const pre = (bases, prefixes) => bases.flatMap(b => prefixes.map(p => p ? p + lc(b) : b));
  const IMPF_CORE = '(\\p{L}+(aba|abas|aban|[aá]bamos|abais)|(ten|entend|pod|sab|quer|hac|escrib|viv|le|com|ve|sent|pon|aprend|comprend|cre|deb|sal|dorm|ped|dec|o|aburr|divert|sol|hab|conoc|part|abr|sub|corr|beb|vend|perd|mov|llov|ca|tra|re|sonre|pon)[ií]a(s|n|mos|is)?|era|eras|eran|[eé]ramos|erais|iba|ibas|iban|[ií]bamos|ibais)';
  const IMPF = W0 + IMPF_CORE + W1;
  const impf = (min, label) => ({ re: IMPF, label: label || `불완료과거 동사 ${min > 1 ? min + '개 이상' : ''}`.trim(), min: min || 1 });
  const blur = (btn, box, a, b) => { btn.onclick = e => { box.classList.toggle('blur'); e.target.textContent = box.classList.contains('blur') ? a : b; }; };
  const B = {};

  /* ---------- Antes de empezar ---------- */
  B.vocab = () => {
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead">${D.lectura} ${say(D.lectura)}</p>
      ${tip('<b>pasábamos · jugábamos · hacía · celebraba</b> — 과거에 <u>되풀이하던 일</u>, <u>그때의 모습</u>을 말하는 시제가 바로 <b>불완료과거(pretérito imperfecto)</b>예요. 우리말 "~하곤 했다, ~했었다"에 가까워요.')}
      <h3 class="h3">① 그림과 표현 연결 — 교재의 네 장면</h3><div class="mp12 m1"></div>
      <h3 class="h3">② 카드를 눌러 뜻을 확인하세요</h3><div class="fg"></div>
      <h3 class="h3">③ 쓰기 연습 — 뜻을 보고 스페인어로 쓰세요</h3><div class="items two w"></div>
      <h3 class="h3">④ 본문 동사 받아쓰기 — 괄호 속 동사를 불완료과거로</h3><div class="cz1"></div>`);
    put(s, '.m1', matchPics({ id: 'v-m', sec: 'vocab', skill: 'voc', cols: 4, items: [
      { e: '🛋️👨‍👩‍👧', es: 'pasar el rato con la familia' }, { e: '🎂🎈', es: 'celebrar el cumpleaños con los amigos' },
      { e: '🏞️🏊', es: 'nadar en el río' }, { e: '👧🏻🦘⬜', es: 'saltar y jugar en la calle' }] }));
    put(s, '.fg', flipGrid(D.vocab));
    [['🎲', '보드게임을 하다', ['jugar a juegos de mesa']], ['🎉', '큰 파티를 하다', ['hacer una gran fiesta']],
      ['🧸', '어린 시절 (명사)', ['la infancia', 'la niñez']], ['🥺', '그리워하다 (2가지 중 하나)', ['echar de menos', 'extrañar']]]
      .forEach(([e, k, a], i) => put(s, '.w', writeItem({ id: 'v-w' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${e}</span> ${k}`, answers: a })));
    put(s, '.cz1', cloze({ id: 'v-c', sec: 'vocab', skill: 'reg', cls: 'lines', text: [
      'En aquellos maravillosos años, me [gustaba] <i>(gustar)</i> pasar el rato con mi familia.',
      'Los fines de semana, [pasábamos] <i>(pasar)</i> el tiempo jugando a juegos de mesa.',
      'También me [encantaba] <i>(encantar)</i> el día de mi cumpleaños.',
      'Siempre [hacía] <i>(hacer)</i> una gran fiesta y lo [celebraba] <i>(celebrar)</i> con mis amigos.',
      'Además, después del colegio, [jugábamos] <i>(jugar)</i>, [saltábamos] <i>(saltar)</i> y nos [divertíamos] <i>(divertirse)</i> en la calle todos juntos.'].map(x => `<p>${x}</p>`).join('') }));
  };

  /* ---------- Gramática ---------- */
  B.gram = () => {
    const tline = `<svg class="tline" viewBox="0 0 640 150" role="img" aria-label="시간축">
      <line class="ax" x1="20" y1="80" x2="600" y2="80"/><polygon points="600,72 618,80 600,88" fill="#5b2a1c"/>
      <text x="20" y="108">pasado 과거</text><text x="560" y="108">ahora</text>
      <path class="wv" d="M80 60 q 15 -14 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0"/>
      <text class="lb1" x="80" y="38">imperfecto: estaba muy nervioso (배경 · 상태 · 습관)</text>
      <circle class="pt" cx="250" cy="80" r="9"/><text class="lb2" x="200" y="132">indefinido: llamé a Juan (한 번 끝난 사건)</text></svg>`;
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 불완료과거 규칙 활용 (verbos regulares)</h3>
        <div class="blocks"><span class="bk s">jug-</span><span class="bk v">-aba</span><span class="small">-ar 동사</span></div>
        <div class="blocks"><span class="bk s">viv- / com-</span><span class="bk v">-ía</span><span class="small">-er · -ir 동사 (같은 어미!)</span></div>
        ${tip('① yo 와 él/ella/usted 형태가 <b>똑같아요</b> (jugaba, vivía) → 헷갈리면 주어를 써요.<br>② 악센트: -ar 동사는 <b>nosotros만</b> jug<b>á</b>bamos / -er·-ir 동사는 <b>모든 인칭</b> v<b>í</b>a, viv<b>í</b>amos.<br>③ -ar 동사의 어미는 <b>b</b>: jugaba (jugava ✕).')}
        <div class="g1"></div></div>
      <div class="gcard"><h3>2. 불규칙 동사는 딱 3개! — ser · ir · ver</h3>
        ${tip('hay(있다)의 과거는 <b>había</b> — 뒤에 복수 명사가 와도 항상 단수! Había muchos coches. (habían ✕)')}
        <div class="g2"></div></div>
      <div class="gcard"><h3>3. 언제 쓸까? — 불완료과거의 세 가지 쓰임</h3>
        <div class="blocks"><span class="bk o">① 과거의 습관</span><span class="small">Jugaba todas las tardes con mis amigos. (siempre, todos los días, a menudo, de vez en cuando, nunca …)</span></div>
        <div class="blocks"><span class="bk p">② 과거의 묘사</span><span class="small">사람 · 장소 · 사물: Mi vida era muy tranquila. Mi escuela tenía un patio.</span></div>
        <div class="blocks"><span class="bk v">③ 과거의 소망 · 취향</span><span class="small">Me gustaba escuchar música. Mi padre quería escuchar las noticias.</span></div>
        ${tip('<b>soler</b> + 동사원형 = "~하곤 했다": Solíamos comer un bocadillo. = Comíamos un bocadillo (normalmente).')}
        <h3 class="h3">✍️ 현재 → 불완료과거로 바꿔 쓰세요</h3><div class="items g3"></div></div>
      <div class="gcard"><h3>4. Antes … , ahora … — 그때와 지금</h3>
        <div class="blocks"><span class="bk p">Antes</span><span class="bk v">+ 불완료과거</span><span class="small">,</span><span class="bk o">(pero) ahora</span><span class="bk s">+ 현재</span></div>
        <p class="small">Antes <b>había</b> pocos coches, ahora <b>hay</b> muchos. ${say('Antes había pocos coches, ahora hay muchos.')}</p>
        <div class="items g4"></div></div>
      <div class="gcard"><h3>5. 전치사 a · de</h3>
        <table class="cj"><tr><th>표현</th><th>뜻</th><th>예문</th></tr>
          <tr><td><b>de</b> niño / <b>de</b> pequeño / <b>de</b> joven</td><td>어렸을 때 / 젊었을 때 (= cuando era …)</td><td>De niño vivía en el campo.</td></tr>
          <tr><td><b>a</b> los diez años</td><td>열 살 때 (나이)</td><td>A los 13 años Manuel era alto.</td></tr>
          <tr><td>estar <b>a</b> + 거리 · 시간</td><td>~만큼 떨어져 있다</td><td>El colegio estaba a unos diez minutos.</td></tr>
          <tr><td><b>de</b> … <b>a</b> …</td><td>~부터 ~까지</td><td>Trabajaba de 8 a 12.</td></tr></table>
        <div class="g5"></div></div>
      <div class="gcard"><h3>6. 단순과거(indefinido) vs 불완료과거(imperfecto)</h3>
        ${tline}
        <table class="cj"><tr><th>pretérito indefinido</th><th>pretérito imperfecto</th></tr>
          <tr><td>한 번 일어나고 끝난 <b>사건</b><br><i>Mi padre cambió su trabajo.</i></td><td>그때의 <b>배경 · 상태 · 습관</b><br><i>Vivía en un pueblo pequeño.</i></td></tr>
          <tr><td>ayer, el año pasado, una vez, en 2010 …</td><td>antes, siempre, todos los días, de niño, mientras …</td></tr></table>
        <div class="items g6"></div></div>`);
    const row = (p, cells) => `<tr><td class="pr">${p}</td>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    put(s, '.g1', cloze({ id: 'g1', sec: 'gram', skill: 'reg', title: '표를 완성하세요. (jugar / vivir)', text: `<table class="cj"><tr><th></th><th>jugar (-ar)</th><th>vivir (-ir)</th></tr>
      ${row('yo', ['jug<b class="en">aba</b>', 'viv<b class="en">ía</b>'])}${row('tú', ['[jugabas]', '[vivías]'])}${row('él / ella / usted', ['[jugaba]', '[vivía]'])}
      ${row('nosotros/as', ['[jugábamos]', '[vivíamos]'])}${row('vosotros/as', ['jug<b class="en">abais</b>', 'viv<b class="en">íais</b>'])}${row('ellos / ellas / ustedes', ['[jugaban]', '[vivían]'])}</table>` }));
    put(s, '.g2', cloze({ id: 'g2', sec: 'gram', skill: 'irr', title: '빈칸을 채우세요. (ser / ir / ver)', text: `<table class="cj"><tr><th></th><th>ser</th><th>ir</th><th>ver</th></tr>
      ${row('yo', ['era', 'iba', 'veía'])}${row('tú', ['eras', 'ibas', 'veías'])}${row('él / ella / usted', ['era', 'iba', 'veía'])}
      ${row('nosotros/as', ['[éramos]', '[íbamos]', '[veíamos]'])}${row('vosotros/as', ['erais', 'ibais', 'veíais'])}${row('ellos / ellas / ustedes', ['[eran]', '[iban]', '[veían]'])}</table>` }));
    [['Juego al fútbol todos los días.', ['Jugaba al fútbol todos los días.'], 'hab'], ['Mi casa es pequeña y tiene jardín.', ['Mi casa era pequeña y tenía jardín.', 'Mi casa era pequeña y tenía un jardín.'], 'irr'],
      ['Me gusta ver dibujos animados.', ['Me gustaba ver dibujos animados.', 'A mí me gustaba ver dibujos animados.'], 'reg']]
      .forEach(([p, a, sk], i) => put(s, '.g3', writeItem({ id: 'g3-' + i, sec: 'gram', skill: sk, prompt: `${p} ${say(p)}`, answers: a })));
    [['🚗', '예전엔 차가 적었는데, 지금은 많아.', pre(['había pocos coches, ahora hay muchos.', 'había pocos coches, pero ahora hay muchos.', 'había pocos coches y ahora hay muchos.', 'había pocos coches, ahora hay muchos coches.', 'había pocos coches, pero ahora hay muchos coches.'], ['Antes '])],
      ['👓', '예전엔 안경을 안 썼는데, 지금은 써. (llevar gafas)', pre(['no llevaba gafas, pero ahora llevo gafas.', 'no llevaba gafas, ahora llevo gafas.', 'no llevaba gafas, pero ahora sí.', 'no llevaba gafas y ahora llevo gafas.', 'no llevaba gafas, pero ahora las llevo.'], ['Antes '])]]
      .forEach(([e, k, a], i) => put(s, '.g4', writeItem({ id: 'g4-' + i, sec: 'gram', skill: 'ant', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: 'Antes …, ahora …', answers: a })));
    put(s, '.g5', cloze({ id: 'g5', sec: 'gram', skill: 'pre', cls: 'lines', title: 'a 또는 de 를 쓰세요.', text:
      ['[De] niño vivía en el campo. <i>(어렸을 때)</i>', '[A] los diez años era muy tímido. <i>(열 살 때)</i>', 'El colegio estaba [a] unos diez minutos. <i>(거리)</i>', 'Trabajaba en el hospital [de] 8 [a] 12. <i>(~부터 ~까지)</i>'].map(x => `<p>${x}</p>`).join('') }));
    [['Llamé a Juan porque ____ muy nervioso.', ['estuvo', 'estaba'], 'estaba', '그때의 상태(배경) → imperfecto'],
      ['Cuando era niño, ____ en un pueblo pequeño.', ['viví', 'vivía'], 'vivía', '어린 시절의 배경 → imperfecto'],
      ['Mi padre ____ su trabajo y nos fuimos a una ciudad.', ['cambió', 'cambiaba'], 'cambió', '한 번 일어나고 끝난 사건 → indefinido'],
      ['Todos los veranos ____ a la playa con mis abuelos.', ['fui', 'iba'], 'iba', 'todos los veranos = 반복된 습관 → imperfecto'],
      ['Ayer ____ a mi abuela en el hospital.', ['visité', 'visitaba'], 'visité', 'ayer, 한 번 → indefinido']]
      .forEach(([p, o, a, x], i) => put(s, '.g6', choiceItem({ id: 'g6-' + i, sec: 'gram', skill: 'con', prompt: p, options: o, answer: a, explain: x })));
  };

  /* ---------- Diálogo 1 ---------- */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'El profesor habla con unos estudiantes en la clase.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">De niño</span><span class="hlc c1">Daba un paseo</span><span class="hlc c2">Extrañar</span><span class="hlc c0">Mucho</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blur($('#hide1', s), $('#d1txt', s), '본문 보기', '본문 가리기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'irr', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['El profesor vivía en una ciudad grande cuando era niño.', 'Falso'], ['Su familia se fue a una ciudad porque su padre cambió su trabajo.', 'Verdadero'], ['El profesor se aburría mucho en el campo.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'hab', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['¿Dónde vivía <u>cuando era niño</u>?', 'De niño', ['¿Dónde vivía de niño?', 'De niño, ¿dónde vivía?']],
      ['Mi vida era muy tranquila. <u>Paseaba</u> por el campo.', 'Daba un paseo', ['Mi vida era muy tranquila. Daba un paseo por el campo.', 'Mi vida era muy tranquila. Daba paseos por el campo.', 'Daba un paseo por el campo.', 'Daba paseos por el campo.']],
      ['¿<u>Echa de menos</u> su vida en el campo?', 'Extrañar', ['¿Extraña su vida en el campo?']],
      ['<u>Bastante</u>, prefiero la tranquilidad del campo.', 'Mucho', ['Mucho, prefiero la tranquilidad del campo.']]]
      .forEach(([p, k, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: i === 0 ? 'pre' : 'voc', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '선생님(usted) 또는 친구(tú)에게 어린 시절을 묻는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¿Dónde vivías cuando eras niño?\nB: De niño vivía en …',
      must: [{ re: W0 + '(cuando eras?|de) (ni[nñ][oa]|peque[nñ][oa])' + W1, label: 'cuando era(s) niño / de niño' }, { re: '¿\\s*c[oó]mo era', label: '¿Cómo era …?' }, impf(4),
        { re: '(echas? de menos|extra[nñ]as?)', label: 'echar de menos / extrañar' }],
      model: 'A: ¿Dónde vivías cuando eras niño? B: De niño vivía en Busan, cerca del mar. A: ¿Y cómo era tu vida allí? B: Era muy divertida. Nadaba en el mar todos los veranos. A: ¿Echas de menos tu vida en Busan? B: Mucho.' }));
  };

  /* ---------- Actividad 1 ---------- */
  const FREQ = [['siempre', 100], ['todos los días', 85], ['a menudo', 65], ['a veces', 45], ['de vez en cuando', 30], ['nunca', 4]];
  const A1 = [
    { e: '🤸', k: 'hacer gimnasia', yo: ['hacía gimnasia'] },
    { e: '📔', k: 'escribir en un diario', yo: ['escribía en mi diario', 'escribía en un diario'] },
    { e: '🧑‍🤝‍🧑', k: 'salir con los amigos', yo: ['salía con mis amigos', 'salía con los amigos'] },
    { e: '📖', k: 'leer cuentos', yo: ['leía cuentos'] },
    { e: '😴', k: 'levantarse tarde', yo: ['me levantaba tarde'] },
    { e: '🐶', k: 'jugar con mascotas', yo: ['jugaba con mis mascotas', 'jugaba con mi mascota', 'jugaba con mascotas'] },
    { e: '💭', k: 'pensar en el futuro', yo: ['pensaba en el futuro'] },
    { e: '🛌', k: 'acostarse temprano', yo: ['me acostaba temprano'] }
  ];
  const freqAns = (vs, f) => vs.flatMap(v => f === 'nunca'
    ? [`Nunca ${v}.`, `No ${v} nunca.`, `Yo nunca ${v}.`, `Yo no ${v} nunca.`]
    : [`${v} ${f}.`, `${f} ${v}.`, `Yo ${v} ${f}.`, `${f} yo ${v}.`]);
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, '¿Con qué frecuencia hacías esto? Practica con tus compañeros siguiendo el modelo.', { kr: '① 어렸을 때 얼마나 자주 했는지 골라 그래프를 만들고 ② 질문과 대답을 써요.' })}
      <div class="ybox wordbank">${A1.map(a => `<span>${a.k}</span>`).join('')}</div>
      ${modelo('A: ¿Con qué frecuencia escribías en un diario?<br>B: Escribía en mi diario todos los días.')}
      <h3 class="h3">📊 나의 어린 시절 빈도 그래프 — 하나씩 고르세요</h3><div class="fq"></div>
      ${tip('<b>nunca</b>가 동사 앞이면 no 없이: <b>Nunca</b> leía cuentos. / 뒤에 오면 no와 함께: <b>No</b> leía cuentos <b>nunca</b>.<br>재귀동사: levantarse → <b>me levantaba</b>, acostarse → <b>me acostaba</b>')}
      <h3 class="h3">✍️ 질문 쓰기 (tú)</h3><div class="items two q"></div>
      <h3 class="h3">✍️ 그래프대로 대답 쓰기 (yo)</h3><div class="items two r"></div>`);
    const st = sel('a1');
    const fq = $('.fq', s);
    const paint = () => {
      fq.innerHTML = A1.map((a, i) => { const f = FREQ.find(x => x[0] === st[i]); return `<div class="fq-row"><span class="fqn"><span>${a.e}</span>${a.k}</span><span class="fqb">${FREQ.map(([x]) => `<button data-i="${i}" data-f="${x}" class="${st[i] === x ? 'on' : ''}">${x}</button>`).join('')}</span><span class="fqbar"><i style="width:${f ? f[1] : 0}%"></i></span></div>`; }).join('');
      $$('.fqb button', fq).forEach(b => b.onclick = () => { st[b.dataset.i] = b.dataset.f; save(); paint(); });
    };
    paint();
    [['📔', '일기는 얼마나 자주 썼어?', ['¿Con qué frecuencia escribías en un diario?', '¿Con qué frecuencia escribías en tu diario?']],
      ['😴', '늦잠은 얼마나 자주 잤어? (levantarse tarde)', ['¿Con qué frecuencia te levantabas tarde?']],
      ['🧑‍🤝‍🧑', '친구들과 얼마나 자주 놀러 나갔어?', ['¿Con qué frecuencia salías con los amigos?', '¿Con qué frecuencia salías con tus amigos?']],
      ['🛌', '얼마나 자주 일찍 잤어? (acostarse temprano)', ['¿Con qué frecuencia te acostabas temprano?']]]
      .forEach(([e, k, a], i) => put(s, '.q', writeItem({ id: 'a1-q' + i, sec: 'a1', skill: 'reg', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: '¿Con qué frecuencia …?', answers: a })));
    A1.forEach((a, i) => put(s, '.r', writeItem({ id: 'a1-' + i, sec: 'a1', skill: 'hab', prompt: `<span class="emo-sm">${a.e}</span> ${a.k} <span class="small">(그래프에서 고른 빈도로)</span>`, ph: a.yo[0].charAt(0).toUpperCase() + a.yo[0].slice(1) + ' …',
      answers: () => st[i] ? freqAns(a.yo, st[i]) : null })));
  };

  /* ---------- Actividad 2 ---------- */
  const withCuando = arr => arr.flatMap(q => [q, ...['Cuando eras pequeño, ', 'Cuando eras pequeña, ', 'De pequeño, ', 'De pequeña, ', 'Cuando eras niño, ', 'Cuando eras niña, ', 'De niño, ', 'De niña, '].map(p => p + q)]);
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Habla con tus compañeros sobre las cosas de vuestra niñez.', { kr: '주제별로 친구에게 할 질문을 쓰고, 내 대답도 써 보세요.' })}
      <div class="ybox wordbank"><span>ir al colegio</span><span>asignaturas preferidas</span><span>pasar las vacaciones</span><span>profesión para el futuro</span><span>comida favorita</span><span>vivir en una ciudad / un pueblo</span><span>aficiones</span><span>jugar con los amigos</span></div>
      ${modelo('A: Cuando eras pequeño, ¿a qué te gustaba jugar con tus amigos?<br>B: Me gustaba jugar al fútbol en el parque.')}
      ${tip('"Cuando eras pequeño, …" / "De pequeño, …"는 앞에 붙여도, 빼도 좋아요. jugar <b>a</b> + 놀이 → ¿<b>A</b> qué jugabas?')}
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items two q"></div>
      <h3 class="h3">✍️ 나의 대답 — 위 주제 중 4개 이상</h3><div class="f"></div>`);
    [['🏫', 'ir al colegio', '학교에 어떻게 갔어?', ['¿Cómo ibas al colegio?']],
      ['📐', 'asignaturas preferidas', '좋아하는 과목이 뭐였어?', ['¿Cuáles eran tus asignaturas preferidas?', '¿Cuál era tu asignatura preferida?', '¿Cuáles eran tus asignaturas favoritas?', '¿Cuál era tu asignatura favorita?', '¿Qué asignaturas te gustaban?']],
      ['🏖️', 'pasar las vacaciones', '방학은 어디에서 보냈어?', ['¿Dónde pasabas las vacaciones?']],
      ['👩‍🚀', 'profesión para el futuro', '커서 뭐가 되고 싶었어?', ['¿Qué querías ser?', '¿Qué querías ser en el futuro?', '¿Qué profesión querías tener en el futuro?', '¿Qué profesión querías para el futuro?']],
      ['🍕', 'comida favorita', '제일 좋아하는 음식이 뭐였어?', ['¿Cuál era tu comida favorita?', '¿Cuál era tu comida preferida?', '¿Qué comida te gustaba?', '¿Qué comida te gustaba más?']],
      ['🏘️', 'vivir en una ciudad / un pueblo', '도시에 살았어, 시골 마을에 살았어?', ['¿Vivías en una ciudad o en un pueblo?', '¿Vivías en una ciudad o un pueblo?']],
      ['🎨', 'aficiones', '어떤 취미가 있었어?', ['¿Qué aficiones tenías?', '¿Cuáles eran tus aficiones?']],
      ['⚽', 'jugar con los amigos', '친구들과 무슨 놀이를 하는 게 좋았어?', ['¿A qué te gustaba jugar con tus amigos?', '¿A qué te gustaba jugar con los amigos?', '¿A qué jugabas con tus amigos?']]]
      .forEach(([e, t, k, a], i) => put(s, '.q', writeItem({ id: 'a2-' + i, sec: 'a2', skill: i === 1 || i === 4 || i === 6 ? 'irr' : 'reg', prompt: `<span class="emo-sm">${e}</span> <span class="chip">${t}</span> ${k}`, ph: '¿…?', answers: withCuando(a) })));
    put(s, '.f', freeItem({ id: 'a2-f', sec: 'a2', rows: 5, ph: 'Iba al colegio andando. Mi asignatura preferida era …',
      must: [impf(4, '불완료과거 동사 4개 이상'), { re: W0 + 'me gustaban?' + W1, label: 'me gustaba(n)' }, { re: W0 + 'quer[ií]a ser' + W1, label: 'quería ser … (장래희망)' }],
      model: 'Iba al colegio en autobús. Mi asignatura preferida era la música. Pasaba las vacaciones en casa de mis abuelos. Quería ser piloto. Me gustaba mucho la pizza.' }));
  };

  /* ---------- Actividad 3 ---------- */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Pregunta a tus compañeros sobre sus recuerdos. ¿Cómo era...?')}
      ${modelo('1) tu escuela primaria → Mi escuela primaria era pequeña, un poco vieja y no tenía ordenadores.')}
      <h3 class="h3">① 친구의 추억 정리 — 설명을 알맞은 칸에 넣으세요</h3><div class="sb3"></div>
      ${tip('묘사할 때는 <b>era</b>(~였다) · <b>tenía</b>(~이 있었다) · <b>llevaba</b>(입고/쓰고 있었다). 복수 주어면 <b>eran · tenían</b>: ¿Cómo <b>eran</b> tus vecinos?')}
      <h3 class="h3">② 질문 쓰기</h3><div class="items q"></div>
      <h3 class="h3">③ 나의 추억 쓰기</h3><div class="items f"></div>`);
    const R = [['esc', '1) tu escuela primaria 🏫'], ['art', '2) tu artista preferido 🎤'], ['jug', '3) tu juguete favorito 🧸'], ['ropa', '4) tu ropa 👕'], ['vec', '5) tus vecinos 🏠'], ['mas', '6) tu mascota 🐾']];
    put(s, '.sb3', sortBoard({ id: 'a3-s', sec: 'a3', skill: 'irr', rows: R.map(([k, label]) => ({ k, label })), cols: [{ k: 'd', label: '¿Cómo era?' }], chips: [
      ['tenía un patio muy grande', 'esc:d'], ['cantaba y bailaba muy bien', 'art:d'], ['era un osito de peluche marrón', 'jug:d'],
      ['siempre llevaba vaqueros y camisetas', 'ropa:d'], ['eran muy amables y tenían dos hijos', 'vec:d'], ['era un perro blanco y dormía conmigo', 'mas:d']] }));
    [['🎤', '네가 좋아하던 가수(아티스트)는 어땠어?', ['¿Cómo era tu artista preferido?', '¿Cómo era tu artista favorito?', '¿Cómo era tu artista preferida?', '¿Cómo era tu artista favorita?']],
      ['🏠', '너의 이웃들은 어땠어?', ['¿Cómo eran tus vecinos?']],
      ['🐾', '너의 반려동물은 어땠어?', ['¿Cómo era tu mascota?']]]
      .forEach(([e, k, a], i) => put(s, '.q', writeItem({ id: 'a3-q' + i, sec: 'a3', skill: 'irr', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: '¿Cómo …?', answers: a })));
    [['🏫 ¿Cómo era tu escuela primaria?', 'Mi escuela primaria era …'], ['🧸 ¿Cómo era tu juguete favorito?', 'Mi juguete favorito era …']]
      .forEach(([p, ph], i) => put(s, '.f', freeItem({ id: 'a3-f' + i, sec: 'a3', line: true, prompt: p, ph,
        must: [{ re: W0 + '(era|eran)' + W1, label: 'era / eran' }, { re: W0 + '(ten[ií]an?|llevaba|hab[ií]a)' + W1, label: 'tenía / había …' }] })));
  };

  /* ---------- Actividad 4 ---------- */
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Entrevista a una persona famosa. Haz un juego de rol con tu compañero siguiendo el modelo. Imagina que eres...', { kr: '유명인에게는 존댓말 usted! → 동사는 3인칭 형태 (vivía, era, le gustaba)' })}
      <div class="mode m4"><button data-r="0">🏛️ el Presidente / la Presidenta</button><button data-r="1">🏅 un deportista famoso / una deportista famosa</button><button data-r="2">🎬 un actor / una actriz de cine</button></div>
      <div class="m4t"></div>
      <h3 class="h3">① tú → usted 짝 맞추기</h3><div class="pm4"></div>
      <h3 class="h3">② 인터뷰 질문 쓰기 (usted)</h3><div class="items q"></div>
      <h3 class="h3">③ 유명인이 되어 대답 쓰기</h3><div class="f"></div>`);
    const st = sel('a4', { r: '0' });
    const ROLE = [['Sr. Presidente', 'Presidente'], ['Sra. deportista', 'deportista'], ['Sr. actor', 'actor']];
    const paint = () => {
      $$('.m4 button', s).forEach(b => b.classList.toggle('on', b.dataset.r === st.r));
      const r = ROLE[+st.r];
      $('.m4t', s).innerHTML = modelo(`A: ¡Buenos días, ${r[0]}! ¿Puedo hacerle algunas preguntas sobre su vida?<br>B: ¡Por supuesto!<br>A: Cuando era pequeño, ¿le gustaba ir al colegio?<br>B: ____________________.`);
    };
    $$('.m4 button', s).forEach(b => b.onclick = () => { st.r = b.dataset.r; save(); paint(); });
    paint();
    put(s, '.pm4', pairMatch({ id: 'a4-p', sec: 'a4', skill: 'reg', pairs: [['¿Dónde vivías?', '¿Dónde vivía?'], ['Cuando eras pequeño', 'Cuando era pequeño'], ['¿Te gustaba ir al colegio?', '¿Le gustaba ir al colegio?'],
      ['¿Qué querías ser?', '¿Qué quería ser?'], ['¿Cómo ibas al colegio?', '¿Cómo iba al colegio?'], ['¿Tenías muchos amigos?', '¿Tenía muchos amigos?']] }));
    const ninos = ['pequeño', 'pequeña', 'niño', 'niña'];
    [['🏫', '어렸을 때 학교 가는 걸 좋아하셨어요?', ['¿Le gustaba ir al colegio?', ...ninos.flatMap(n => [`Cuando era ${n}, ¿le gustaba ir al colegio?`, `¿Le gustaba ir al colegio cuando era ${n}?`, `De ${n}, ¿le gustaba ir al colegio?`])]],
      ['🏘️', '어렸을 때 어디에 사셨어요?', ['¿Dónde vivía?', ...ninos.flatMap(n => [`¿Dónde vivía cuando era ${n}?`, `¿Dónde vivía de ${n}?`, `Cuando era ${n}, ¿dónde vivía?`, `De ${n}, ¿dónde vivía?`])]],
      ['💭', '무엇이 되고 싶으셨어요?', ['¿Qué quería ser?', ...ninos.flatMap(n => [`¿Qué quería ser cuando era ${n}?`, `¿Qué quería ser de ${n}?`, `Cuando era ${n}, ¿qué quería ser?`, `De ${n}, ¿qué quería ser?`])]]]
      .forEach(([e, k, a], i) => put(s, '.q', writeItem({ id: 'a4-q' + i, sec: 'a4', skill: i === 1 ? 'reg' : 'irr', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: '¿…?', answers: a })));
    put(s, '.f', freeItem({ id: 'a4-f', sec: 'a4', rows: 4, prompt: '위에서 고른 유명인이 되어, 어린 시절에 대한 질문 3개에 답하세요.', ph: 'Sí, me gustaba mucho ir al colegio. Vivía en …',
      must: [{ re: W0 + '(no )?me gustaba' + W1, label: '(No) me gustaba …' }, { re: W0 + 'viv[ií]a' + W1, label: 'vivía (사는 곳)' }, { re: W0 + 'quer[ií]a ser' + W1, label: 'quería ser …' }, impf(4, '불완료과거 동사 4개 이상')],
      model: 'Sí, me gustaba mucho ir al colegio, sobre todo la clase de educación física. Vivía en un pueblo pequeño cerca de Daegu. Quería ser futbolista y jugaba al fútbol todos los días con mis amigos.' }));
  };

  /* ---------- Actividad 5 ---------- */
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Pregunta a tus compañeros sobre lo que hacían cuando eran más jóvenes.')}
      ${modelo('A: Alejandro, ¿qué hacías después de las clases?<br>B: Veía la televisión.')}
      <h3 class="h3">① 방과 후에 무엇을 했나요? — 표현을 그림에 연결</h3><div class="mp12 m5"></div>
      <h3 class="h3">② 질문 쓰기 (tú)</h3><div class="items two q"></div>
      <h3 class="h3">③ 친구의 대답을 3인칭으로 전하기</h3><div class="items r"></div>
      <h3 class="h3">④ 나의 대답</h3><div class="f"></div>`);
    put(s, '.m5', matchPics({ id: 'a5-m', sec: 'a5', skill: 'reg', cols: 3, items: [
      { e: '📺', es: 'Veía la televisión.' }, { e: '⚽', es: 'Jugaba al fútbol.' }, { e: '📚', es: 'Leía cómics.' },
      { e: '🚲', es: 'Montaba en bicicleta.' }, { e: '🎹', es: 'Tocaba el piano.' }, { e: '✏️📓', es: 'Hacía los deberes.' }] }));
    [['🗓️', '주말에는 뭐 했어?', ['¿Qué hacías los fines de semana?']], ['☀️', '여름에는 뭐 했어?', ['¿Qué hacías en verano?', '¿Qué hacías en el verano?', '¿Qué hacías en los veranos?']]]
      .forEach(([e, k, a], i) => put(s, '.q', writeItem({ id: 'a5-q' + i, sec: 'a5', skill: 'hab', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: '¿Qué …?', answers: a })));
    [['🧑🏽 Alejandro: “Veía la televisión.”', 'Alejandro …', ['Alejandro veía la televisión.', 'Alejandro veía la televisión después de las clases.', 'Después de las clases, Alejandro veía la televisión.', 'Alejandro veía la tele.']],
      ['👩🏻 Sofía: “Iba a la piscina con mi hermana.”', 'Sofía …', ['Sofía iba a la piscina con su hermana.']]]
      .forEach(([p, ph, a], i) => put(s, '.r', writeItem({ id: 'a5-r' + i, sec: 'a5', skill: 'irr', prompt: p, ph, answers: a })));
    put(s, '.f', freeItem({ id: 'a5-f', sec: 'a5', rows: 4, prompt: '¿Qué hacías después de las clases? ¿Y los fines de semana? ¿Y en verano?', ph: 'Después de las clases, …',
      must: [impf(3, '불완료과거 동사 3개 이상'), { re: 'despu[eé]s de (las )?clases?', label: 'después de las clases' }, { re: '(fines de semana|verano)', label: 'los fines de semana / en verano' }],
      model: 'Después de las clases, jugaba al fútbol con mis amigos. Los fines de semana veía la televisión con mi familia. En verano iba a la playa.' }));
  };

  /* ---------- Actividad 6 — 잉카의 집 ---------- */
  const WASH = '<svg viewBox="0 0 60 60"><rect x="6" y="4" width="48" height="52" rx="5" fill="#8fb0d6" stroke="#4d6d92" stroke-width="2"/><rect x="6" y="4" width="48" height="11" fill="#b9cfe8"/><circle cx="14" cy="10" r="2" fill="#4d6d92"/><circle cx="21" cy="10" r="2" fill="#4d6d92"/><circle cx="30" cy="35" r="14" fill="#e8f3fb" stroke="#4d6d92" stroke-width="3"/><circle cx="30" cy="35" r="8" fill="#a8d8f0"/></svg>';
  const INCA = [
    { h: '💡', es: 'la bombilla (la luz eléctrica)', x: 45, y: 18, err: 1 },
    { h: '🖥️', es: 'el ordenador', x: 24, y: 46, err: 1 },
    { h: WASH, es: 'la lavadora', x: 11, y: 66, err: 1 },
    { h: '🎸', es: 'la guitarra eléctrica', x: 52, y: 52, err: 1 },
    { h: '📺', es: 'la televisión', x: 87, y: 60, err: 1 },
    { h: '☎️', es: 'el teléfono', x: 88, y: 40, err: 1 },
    { h: '🏺', es: 'las vasijas de barro', x: 15, y: 30, err: 0 },
    { h: '🧶', es: 'la ropa de lana (poncho)', x: 33, y: 80, err: 0 },
    { h: '🪨', es: 'las paredes de piedra', x: 80, y: 76, err: 0 }
  ];
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Aquí hay una escena en el interior de una casa de los incas en el año 1450. Obsérvala con atención, descubre los errores y habla con tus compañeros.', { kr: '1450년에 있을 수 없는 물건을 눌러 ✕ 표시하세요. (다시 누르면 취소)' })}
      <div class="inca"><div class="door"></div><span class="ppl">🧑🏽‍🦱🧔🏽</span></div>
      <div class="item-row"><button class="btn chk i6">채점하기</button><span class="i6s"></span></div>
      ${modelo('En aquella época no había teléfonos y la gente no hablaba por teléfono.')}
      <h3 class="h3">✍️ 틀린 곳을 문장으로 — En aquella época no había …</h3><div class="items w"></div>
      <h3 class="h3">✍️ 나머지 틀린 곳 2개 이상을 modelo처럼</h3><div class="f"></div>`);
    const st = sel('a6');
    const box = $('.inca', s);
    INCA.forEach((it, i) => {
      reg('a6-h' + i, 'a6', 'voc');
      const b = el(`<button class="hs" style="left:${it.x}%;top:${it.y}%" title="${esc(it.es)}">${it.h}<span class="hl">${it.es}</span><span class="mkbox"></span></button>`);
      b.onclick = () => { st[i] = !st[i]; save(); b.classList.toggle('on', !!st[i]); };
      b.classList.toggle('on', !!st[i]);
      box.appendChild(b);
    });
    $('.i6', s).onclick = () => {
      let ok = 0;
      $$('.hs', box).forEach((b, i) => { const good = !!st[i] === !!INCA[i].err; if (good) ok++; record('a6-h' + i, good ? 1 : 0, good ? [] : ['otro'], {}); b.classList.remove('ok', 'no'); b.classList.add(good ? 'ok' : 'no'); $('.mkbox', b).innerHTML = MARK(good ? 1 : 0); });
      box.classList.add('graded');
      $('.i6s', s).innerHTML = `${MARK(ok / INCA.length)} <b>${ok} / ${INCA.length}</b> <span class="small">— 틀린 그림은 6개예요.</span>`;
    };
    const epoca = arr => pre(arr, ['En aquella época ', '']);
    [['📺', '그 시대에는 텔레비전이 없었다.', epoca(['no había televisión.', 'no había televisiones.', 'no había televisores.', 'no había tele.'])],
      ['💡', '그 시대에는 전기가 없었다.', epoca(['no había electricidad.', 'no había luz eléctrica.'])],
      ['🖥️', '그 시대에는 컴퓨터가 없었고, 사람들은 인터넷을 하지 않았다.', epoca(['no había ordenadores y la gente no navegaba por Internet.', 'no había computadoras y la gente no navegaba por Internet.', 'no había ordenadores y la gente no usaba Internet.', 'no había computadoras y la gente no usaba Internet.'])]]
      .forEach(([e, k, a], i) => put(s, '.w', writeItem({ id: 'a6-w' + i, sec: 'a6', skill: 'irr', prompt: `<span class="emo-sm">${e}</span> ${k}`, ph: 'En aquella época no había …', answers: a })));
    put(s, '.f', freeItem({ id: 'a6-f', sec: 'a6', rows: 3, ph: 'En aquella época no había lavadoras y la gente lavaba la ropa en el río.',
      must: [{ re: W0 + 'no hab[ií]a' + W1, label: 'no había … (2번 이상)', min: 2 }, { re: W0 + 'la gente( no)? ' + IMPF_CORE + W1, label: 'la gente (no) + 불완료과거' }],
      model: 'En aquella época no había lavadoras y la gente lavaba la ropa en el río. Tampoco había guitarras eléctricas; la gente tocaba la quena y el charango.' }));
  };

  /* ---------- Diálogo 2 ---------- */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Este abuelo le habla a su nieta sobre su vida cuando era pequeño.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">② 할아버지의 하루 — 순서대로 누르세요</h3><div class="sc"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">De pequeño</span><span class="hlc c1">Claro que no</span><span class="hlc c2">Computadoras</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 할아버지 · 할머니께 묻는 대화 쓰기</h3><div class="f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blur($('#hide2', s), $('#d2txt', s), '본문 보기', '본문 가리기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'irr', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['Cuando el abuelo era pequeño, no había televisiones.', 'Verdadero'], ['El abuelo iba al colegio en autobús.', 'Falso'],
      ['El colegio estaba a unos diez minutos.', 'Verdadero'], ['Al padre del abuelo le gustaba escuchar música moderna.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'hab', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.sc', scramble({ id: 'd2-sc', sec: 'd2', skill: 'hab', joiner: ' › ', prompt: '아침부터 저녁까지', tokens: ['Se levantaba por la mañana', 'Se duchaba y su madre le preparaba el desayuno', 'Iba andando al colegio', 'Comía un bocadillo en el patio', 'Escuchaba la radio'] }));
    [['Abuelo, ¿<u>cuando eras pequeño</u> tenías televisión?', 'De pequeño', ['Abuelo, ¿de pequeño tenías televisión?', '¿De pequeño tenías televisión?']],
      ['<u>¡Qué va!</u> No había televisiones.', 'Claro que no', ['¡Claro que no! No había televisiones.']],
      ['No había televisiones, ni <u>ordenadores</u>, ni tantos coches.', 'Computadoras', ['No había televisiones, ni computadoras, ni tantos coches.']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: i === 0 ? 'pre' : 'voc', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.f', freeItem({ id: 'd2-f', sec: 'd2', rows: 6, prompt: '할아버지·할머니(tú)께 어린 시절을 여쭤보는 대화를 4~6줄로 쓰세요.', ph: 'A: Abuela, cuando eras pequeña, ¿tenías …?\nB: ¡Qué va! No había …',
      must: [{ re: '(cuando eras|de) (peque[nñ][oa]|ni[nñ][oa])', label: 'cuando eras pequeño / de pequeño' }, { re: W0 + '(no )?hab[ií]a' + W1, label: '(no) había' }, { re: '(qu[eé] va|claro que no)', label: '¡Qué va! / ¡Claro que no!' }, impf(4)],
      model: 'A: Abuela, cuando eras pequeña, ¿tenías móvil? B: ¡Qué va! No había móviles. A: ¿Y qué hacías después del colegio? B: Jugaba con mis hermanos en la calle y ayudaba a mi madre en casa.' }));
  };

  /* ---------- Actividad 7 — Antes / Ahora ---------- */
  B.a7 = () => {
    const card = (cls, art, q) => `<div class="aa-c ${cls}"><span class="tag">${cls === 'an' ? 'Antes' : 'Ahora'}</span><div class="art">${art}</div><div class="q">${q}</div></div>`;
    const s = sec('a7', `${actHead(7, 'Habla con tus compañeros.', { kr: '그림을 비교해 Antes(불완료과거) / Ahora(현재)로 말하고 써요.' })}
      <div class="aa">
        <div class="aa-row"><span class="n">1)</span>${card('an', '<span class="thin">🧒🏻</span>', 'a) ¿Cómo era Eduardo antes?')}${card('ah', '<span class="fat">👨🏻‍🦲</span>👓', 'b) ¿Y cómo es ahora?')}</div>
        <div class="aa-row"><span class="n">2)</span>${card('an', '🛝🧒🏻⚽🧒🏽🌳', 'a) ¿Qué hacía este chico antes?')}${card('ah', '📚🧑🏻‍🎓📖🤫', 'b) ¿Y qué hace ahora?')}</div>
        <div class="aa-row"><span class="n">3)</span>${card('an', '🏢🏫🌳<br>🚗 <span class="noise">🕊️</span>', 'a) ¿Cómo era la ciudad antes?')}${card('ah', '🏢🏫🌳<br>🚗🚙🚕🚌🚗 <span class="noise">📢</span>', 'b) ¿Y cómo es ahora?')}</div>
      </div>
      <h3 class="h3">① 표현을 Antes / Ahora 칸에 분류하세요</h3><div class="sb7"></div>
      <h3 class="h3">② 질문에 문장으로 답하세요</h3><div class="items two w"></div>`);
    put(s, '.sb7', sortBoard({ id: 'a7-s', sec: 'a7', skill: 'ant', rows: [{ k: '1', label: '1) Eduardo' }, { k: '2', label: '2) el chico' }, { k: '3', label: '3) la ciudad' }],
      cols: [{ k: 'an', label: 'Antes 🕰️' }, { k: 'ah', label: 'Ahora ⏱️' }], chips: [
        ['era bajito y delgado', '1:an'], ['no llevaba gafas', '1:an'], ['es alto y un poco gordito', '1:ah'], ['lleva gafas', '1:ah'],
        ['jugaba con sus amigos en el parque', '2:an'], ['estudia en la biblioteca', '2:ah'],
        ['era muy tranquila', '3:an'], ['casi no había coches', '3:an'], ['es muy ruidosa', '3:ah'], ['hay muchos coches', '3:ah']] }));
    [['1) a) ¿Cómo era Eduardo antes?', pre(['Era bajito y delgado. No llevaba gafas.', 'Era bajito y delgado y no llevaba gafas.'], ['', 'Antes ', 'Eduardo ', 'Antes Eduardo ', 'Eduardo antes '])],
      ['1) b) ¿Y cómo es ahora?', pre(['Es alto y un poco gordito. Lleva gafas.', 'Es alto y un poco gordito y lleva gafas.'], ['', 'Ahora ', 'Eduardo ', 'Ahora Eduardo ', 'Eduardo ahora '])],
      ['2) a) ¿Qué hacía este chico antes?', pre(['Jugaba con sus amigos en el parque.', 'Jugaba en el parque con sus amigos.'], ['', 'Antes ', 'El chico ', 'Antes el chico ', 'El chico antes '])],
      ['2) b) ¿Y qué hace ahora?', pre(['Estudia en la biblioteca.'], ['', 'Ahora ', 'El chico ', 'Ahora el chico ', 'El chico ahora '])],
      ['3) a) ¿Cómo era la ciudad antes?', pre(['Era muy tranquila. Casi no había coches.', 'Era muy tranquila y casi no había coches.'], ['', 'Antes ', 'La ciudad ', 'Antes la ciudad ', 'La ciudad antes '])],
      ['3) b) ¿Y cómo es ahora?', pre(['Es muy ruidosa y hay muchos coches.', 'Es muy ruidosa. Hay muchos coches.'], ['', 'Ahora ', 'La ciudad ', 'Ahora la ciudad ', 'La ciudad ahora '])]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a7-w' + i, sec: 'a7', skill: i % 2 ? 'ant' : (i === 2 ? 'hab' : 'irr'), prompt: `${p} ${say(p.replace(/^\S+ \S+ /, ''))}`, ph: i % 2 ? 'Ahora …' : 'Antes …', answers: a })));
  };

  /* ---------- Actividad 8 ---------- */
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Pregunta a tus compañeros sobre sus recuerdos y la actualidad. ¿Cómo era antes? / ¿Cómo es ahora?')}
      <h3 class="h3">① 동사 분류 — 불완료과거(Antes)인가, 현재(Ahora)인가?</h3><div class="sb8"></div>
      <h3 class="h3">② 지금 → 예전 문장 만들기</h3><div class="items w"></div>
      <h3 class="h3">③ 나의 Antes / Ahora 표 — 한 줄에 "Antes …, pero ahora …"</h3>
      <table class="cj"><tr><th style="width:40px"></th><th>Antes · Ahora</th></tr>${[1, 2, 3, 4].map(i => `<tr><td class="pr">${i})</td><td class="r${i}"></td></tr>`).join('')}</table>`);
    put(s, '.sb8', sortBoard({ id: 'a8-s', sec: 'a8', skill: 'ant', cols: [{ k: 'an', label: 'Antes (imperfecto) 🕰️' }, { k: 'ah', label: 'Ahora (presente) ⏱️' }],
      chips: [['vivía', 'an'], ['vivo', 'ah'], ['era', 'an'], ['es', 'ah'], ['iba', 'an'], ['voy', 'ah'], ['tenía', 'an'], ['tengo', 'ah']] }));
    [['🏙️ Ahora vivo en Seúl. <span class="small">(antes: Busan)</span>', ['Antes vivía en Busan.']],
      ['💇 Ahora tengo el pelo corto. <span class="small">(antes: largo)</span>', ['Antes tenía el pelo largo.', 'Antes llevaba el pelo largo.']],
      ['🚌 Ahora voy al colegio en autobús. <span class="small">(antes: andando)</span>', ['Antes iba al colegio andando.', 'Antes iba andando al colegio.', 'Antes iba al colegio a pie.']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a8-w' + i, sec: 'a8', skill: 'irr', prompt: p, ph: 'Antes …', answers: a })));
    [['🏠 사는 곳', 'Antes vivía en …, pero ahora vivo en …'], ['🪞 외모', 'Antes era bajito, pero ahora soy …'], ['🏫 학교 · 공부', 'Antes iba a …, pero ahora …'], ['🎮 취미', 'Antes jugaba …, pero ahora …']]
      .forEach(([p, ph], i) => { const td = $('.r' + (i + 1), s); td.appendChild(freeItem({ id: 'a8-f' + i, sec: 'a8', skill: 'ant', line: true, prompt: p, ph,
        must: [{ re: W0 + 'antes' + W1, label: 'Antes' }, impf(1), { re: W0 + 'ahora' + W1, label: 'ahora + 현재' }] })); });
  };

  /* ---------- Actividad 9 ---------- */
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Habla con tu compañero y pregúntale cómo era su vida hace unos años. Luego pregunta a los demás.')}
      <h3 class="h3">① 질문 완성 — 괄호 속 동사를 tú(또는 vosotros) 불완료과거로</h3><div class="c9"></div>
      <h3 class="h3">② 나의 대답</h3><div class="items f"></div>
      <h3 class="h3">③ 다른 친구에게 전하기 — 민지의 대답을 3인칭으로</h3>
      <div class="prof"><span class="pa">👧🏻</span><ul><li>“De pequeña vivía en Busan.”</li><li>“Éramos cuatro en mi familia.”</li><li>“Me gustaba mucho BTS.”</li></ul></div>
      <div class="items r"></div>`);
    put(s, '.c9', cloze({ id: 'a9c', sec: 'a9', skill: 'irr', cls: 'lines', text: ['1) ¿Dónde [vivías] de pequeño? <i>(vivir)</i>', '2) ¿Qué [hacías] en verano cuando [eras] pequeño? <i>(hacer, ser)</i>',
      '3) ¿Cuántos [erais] en tu familia? <i>(ser, vosotros)</i>', '4) ¿Qué actor te [gustaba]? <i>(gustar)</i>', '5) ¿Qué grupo de música te [gustaba]? <i>(gustar)</i>'].map(x => `<p>${x}</p>`).join('') }));
    [['1) ¿Dónde vivías de pequeño?', 'De pequeño vivía en …', [{ re: W0 + 'viv[ií]a' + W1, label: 'vivía' }]],
      ['2) ¿Qué hacías en verano cuando eras pequeño?', 'En verano …', [impf(1)]],
      ['3) ¿Cuántos erais en tu familia?', 'Éramos …', [{ re: W0 + '[eé]ramos' + W1, label: 'éramos + 숫자' }]],
      ['4) ¿Qué actor te gustaba?', 'Me gustaba …', [{ re: W0 + 'me gustaba' + W1, label: 'me gustaba' }]],
      ['5) ¿Qué grupo de música te gustaba?', 'Me gustaba …', [{ re: W0 + 'me gustaban?' + W1, label: 'me gustaba(n)' }]]]
      .forEach(([q, ph, m], i) => put(s, '.f', freeItem({ id: 'a9-f' + i, sec: 'a9', line: true, prompt: `${q} ${say(q.slice(3))}`, ph, must: m })));
    [['민지는 어렸을 때 부산에 살았다.', ['Minji vivía en Busan.', ...['pequeña', 'niña'].flatMap(n => [`De ${n}, Minji vivía en Busan.`, `Minji vivía en Busan de ${n}.`, `Cuando era ${n}, Minji vivía en Busan.`, `Minji vivía en Busan cuando era ${n}.`])]],
      ['민지네 가족은 네 명이었다.', ['En su familia eran cuatro.', 'Eran cuatro en su familia.', 'En la familia de Minji eran cuatro.', 'Eran cuatro en la familia de Minji.', 'Eran cuatro.']],
      ['민지는 BTS를 무척 좋아했다.', ['A Minji le gustaba mucho BTS.', 'A Minji le gustaba BTS.', 'A Minji le encantaba BTS.']]]
      .forEach(([p, a], i) => put(s, '.r', writeItem({ id: 'a9-r' + i, sec: 'a9', skill: i === 2 ? 'reg' : 'irr', prompt: p, answers: a })));
  };

  /* ---------- Actividad 10 — Manuel ---------- */
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Escucha la vida de Manuel y contesta. Después, pregunta a tu compañero.', { listen: true })}
      <h3 class="h3"><button class="btn ghost sm" id="play10">▶ 듣기</button> <button class="btn ghost sm" id="hide10">본문 보기</button></h3>
      <div id="t10" class="lead blur">${D.manuel}</div>
      <h3 class="h3">① Contesta — 문장으로 답하세요</h3><div class="items two q"></div>
      <h3 class="h3">② ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">③ 받아쓰기 — 다시 듣고 동사를 쓰세요</h3><div class="c10"></div>
      <h3 class="h3">④ Después, pregunta a tu compañero — 나는 13살 때 어땠나요?</h3><div class="f"></div>`);
    $('#play10', s).onclick = e => SC.speak(D.manuel, e.currentTarget);
    blur($('#hide10', s), $('#t10', s), '본문 보기', '본문 가리기');
    [['1) ¿Dónde vivía a los trece años?', pre(['Vivía en un humilde piso.', 'Vivía en un piso humilde.', 'Vivía con su familia en un humilde piso.', 'En un humilde piso.', 'En un piso humilde.'], ['', 'Manuel ', 'A los trece años '])],
      ['2) ¿Con quién vivía él?', pre(['Vivía con su familia.', 'Con su familia.'], ['', 'Manuel ', 'Él '])],
      ['3) ¿Dónde trabajaba su padre?', pre(['Trabajaba en correos.', 'En correos.'], ['', 'Su padre '])],
      ['4) ¿Adónde iba con su hermano?', pre(['Iba a todos los conciertos.', 'A todos los conciertos.'], ['', 'Manuel ', 'Con su hermano '])]]
      .forEach(([p, a], i) => put(s, '.q', writeItem({ id: 'a10-q' + i, sec: 'a10', skill: i === 3 ? 'irr' : 'reg', prompt: `${p} ${say(p.slice(3))}`, answers: a })));
    [['A los 13 años Manuel era bajo y rubio.', 'Falso'], ['Su madre era ama de casa.', 'Verdadero'], ['A Manuel le gustaba mucho estudiar.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'a10-vf' + i, sec: 'a10', skill: 'hab', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.c10', cloze({ id: 'a10c', sec: 'a10', skill: 'reg', cls: 'lines', text: `<p>A los 13 años Manuel [era] un muchacho alto y moreno que [llevaba] el pelo largo. Vivía con su familia en un humilde piso. Su padre trabajaba en correos y su madre era ama de casa. Manuel iba a un colegio de su barrio, no le gustaba mucho estudiar y [sacaba] muy malas notas. Era bastante travieso y sus padres le [castigaban] con frecuencia. Pero por aquella época ya [tenía] mucho interés por la música: en sus ratos libres [tocaba] la guitarra e iba con su hermano a todos los conciertos.</p>` }));
    put(s, '.f', freeItem({ id: 'a10-f', sec: 'a10', rows: 4, ph: 'A los 13 años yo era …',
      must: [{ re: W0 + 'a los (13|trece) a[nñ]os' + W1, label: 'A los 13 años …' }, { re: W0 + 'viv[ií]a' + W1, label: 'vivía' }, impf(4, '불완료과거 동사 4개 이상')],
      model: 'A los 13 años yo era bajito y llevaba gafas. Vivía con mis padres en un piso en Seúl. Iba a un colegio cerca de mi casa y me gustaban las matemáticas. En mis ratos libres jugaba a los videojuegos.' }));
  };

  /* ---------- Actividad 11 ---------- */
  B.a11 = () => {
    const s = sec('a11', `${actHead(11, '¿Recuerdas cómo eras a los diez años? Pregunta a tu compañero sobre su vida a los diez años.', { kr: '표의 질문을 완성하고, "Tú" 칸에 나의 대답을 써요.' })}
      <div class="tb11"></div>
      ${modelo('A: ¿Cómo eras a los diez años?<br>B: Pues, era bastante alta para mi edad. Creo que era la más alta de la clase. Llevaba gafas. Era muy sociable y tenía muchos amigos. Llevaba el pelo muy corto y estaba un poco gordita.')}`);
    const ROWS = [['Físico', '¿Cómo [eras]?', [{ re: W0 + '(era|ten[ií]a|llevaba|estaba)' + W1, label: 'era / tenía / llevaba' }], 'Era bajito y llevaba gafas.'],
      ['Carácter', '¿[Eras] tímido?', [{ re: W0 + '(no )?era' + W1, label: '(No) era …' }], 'No, era muy sociable.'],
      ['Escuela', '¿Cuál [era] tu asignatura favorita?', [{ re: 'mi asignatura (favorita|preferida) era', label: 'Mi asignatura favorita era …' }], 'Mi asignatura favorita era …'],
      ['Vacaciones', '¿Qué [hacías] en las vacaciones?', [impf(1)], 'Iba a …'],
      ['Tiempo libre', '¿Qué [hacías] en tu tiempo libre?', [impf(1)], 'Jugaba …'],
      ['Otros', '¿… ?', [{ re: '¿[^?]+\\?', label: '나만의 질문 ¿…?' }, impf(1)], '¿Qué querías ser? — Quería ser …']];
    const cz = cloze({ id: 'a11q', sec: 'a11', skill: 'irr', title: 'Preguntas 칸을 완성하세요.', text: `<table class="t11"><tr><th>Temas</th><th>Preguntas</th><th>Tú</th></tr>${ROWS.map(([t, q], i) => `<tr><td class="tm">${t}</td><td class="qq">${q}</td><td class="tu" data-r="${i}"></td></tr>`).join('')}</table>` });
    put(s, '.tb11', cz);
    ROWS.forEach(([t, q, m, ph], i) => $(`td[data-r="${i}"]`, cz).appendChild(freeItem({ id: 'a11-f' + i, sec: 'a11', line: true, prompt: t, ph, must: m })));
  };

  SC.lesson({
    num: '12',
    title: 'Cuando era niño, nadábamos en el río',
    ttsTest: 'Cuando era niño, nadábamos en el río.',
    cover: {
      emoji: '🏞️🏊🧒<small>Antes · Ahora</small>',
      bg: 'linear-gradient(160deg,#1f6f5c 0%,#5fb8a0 45%,#a8e0cf 62%,#5b2a1c 100%)',
      tema: ['Actividades de tiempo libre', 'La infancia'],
      com: ['Describir lugares, personas y cosas del pasado', 'Hablar de acciones habituales en el pasado', 'Hablar de deseos y gustos en el pasado'],
      gram: ['Pretérito imperfecto: verbos regulares e irregulares', 'Preposiciones: <i>a, de</i>', 'Contraste entre pretérito indefinido y pretérito imperfecto']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      E: { name: 'Estudiante', av: '👧🏼', side: 'l' }, P: { name: 'Profesor', av: '👨🏻‍🏫', side: 'r' },
      Chica: { av: '👧🏻', side: 'r' }, Abuelo: { av: '👴🏻', side: 'l' }
    },
    errLabels: { conjugacion: '동사 변화 (불완료과거)', estructura: '문장 구조 · 전치사' },
    errTips: {
      acento: '-ar 동사는 nosotros만 -ábamos, -er·-ir 동사는 모두 -ía (vivía, teníamos). 시험에서는 악센트도 감점!',
      conjugacion: '-ar: -aba, -abas, -aba, -ábamos, -abais, -aban / -er·-ir: -ía, -ías, -ía, -íamos, -íais, -ían / ser: era · ir: iba · ver: veía',
      concordancia: '"~이 있었다"는 언제나 había (habían ✕): Había muchos coches.',
      estructura: '어렸을 때 = de niño / cuando era niño, 열 살 때 = a los diez años, ~부터 ~까지 = de … a …'
    },
    classify(ti, ta) {
      if (ti.includes('habían') && ta.includes('había')) return 'concordancia';
      const d = ti.filter(w => !ta.includes(w)), e = ta.filter(w => !ti.includes(w));
      if (d.length === 1 && e.length === 1 && /(aba|abas|aban|ábamos|ía|ías|ían|íamos|era|eras|eran|éramos|iba|ibas|iban|íbamos)$/.test(e[0])) return 'conjugacion';
      return null;
    },
    errRules: [
      { re: W0 + '\\p{L}+abamos' + W1, t: 'acento', msg: '-ar 동사 nosotros: -ábamos (jugábamos)' },
      { re: W0 + '(ten|entend|pod|quer|hac|escrib|viv|le|com|ve|sent|aprend|comprend|cre|deb|sal|dorm|dec|aburr|divert|sol|hab|conoc|corr|beb)(ia|ias|iamos|iais|ian)' + W1, t: 'acento', msg: '-er · -ir 불완료과거는 í: tenía, vivía, hacíamos …' },
      { re: W0 + '(iva|ivas|ivamos|ivan)' + W1, t: 'conjugacion', msg: 'ir → iba (b!)' },
      { re: W0 + '(jug|habl|estudi|pase|cant|bail|trabaj|nad|mir|escuch|tom|lleg|viaj|cocin|est|and|levant|duch|gust|encant|pas|pens|salt|celebr)(ava|avas|avamos|ávamos|avan)' + W1, t: 'conjugacion', msg: '-ar 불완료과거는 -aba (b): jugaba, estaba' },
      { re: W0 + 'hab[ií]an (muchos|muchas|pocos|pocas|unos|unas|tantos|tantas|coches|ordenadores|computadoras|televisiones|tel[eé]fonos|ni[nñ]os|personas|\\d+)' + W1, t: 'concordancia', msg: '"있었다"는 단수 había: Había muchos coches.' },
      { re: W0 + 'cuando (fui|fuiste|fue|fuimos) (ni[nñ][oa]s?|peque[nñ][oa]s?|joven|j[oó]venes)' + W1, t: 'conjugacion', msg: '어린 시절의 배경 → cuando era niño (imperfecto)' },
      { re: W0 + 'en los (diez|once|doce|trece|\\d+) a[nñ]os' + W1, t: 'estructura', msg: '나이는 a: a los diez años' }
    ],
    accWords: ['jugábamos', 'pasábamos', 'saltábamos', 'nadábamos', 'estábamos', 'escuchábamos', 'íbamos', 'éramos', 'divertíamos', 'teníamos', 'vivíamos', 'hacíamos', 'veíamos', 'solíamos',
      'tenía', 'tenías', 'tenían', 'vivía', 'vivías', 'vivían', 'había', 'quería', 'querías', 'podía', 'veía', 'veías', 'leía', 'comía', 'escribía', 'escribías', 'salía', 'aburría', 'divertía',
      'época', 'cumpleaños', 'tímido', 'tímida', 'jóvenes'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Dónde vivía cuando era niño?', 'De niño vivía en el campo.', '¿Cómo era su vida allí?', 'Por las noches veía las estrellas.', 'Antes había pocos coches, ahora hay muchos.', 'Llamé a Juan porque estaba muy nervioso.'],
    utilSkill: 'irr',
    proverbio: { es: 'El pasado muere, el presente vive, el recuerdo queda y la vida sigue.', e: '👴🏻💻👧🏻', answer: '산 사람은 살아야 한다',
      options: ['산 사람은 살아야 한다', '세 살 버릇 여든까지 간다', '낮말은 새가 듣고 밤말은 쥐가 듣는다', '우물 안 개구리'],
      kr: '과거는 지나가고 현재는 살아 있으며, 추억은 남고 삶은 계속된다 — 지난 일에 머물지 말고 오늘을 살아가자는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Piensa en tu experiencia como estudiante de español → 글로 쓰기',
        icons: ['📚', '🗣️', '📈'],
        html: modelo('Antes entendía muy poco cuando escuchaba algo en español. Ahora entiendo más, porque sé qué tengo que hacer cuando escucho.<br><br>Antes me ponía nervioso cuando tenía que hablar en clase, pero ahora no.'),
        questions: ['Antes, cuando empezabas a estudiar español, ¿cómo era tu español? ¿Qué cosas te resultaban difíciles?',
          'Ahora, ¿en qué cosas has cambiado y mejorado? ¿Por qué?',
          '¿Cómo te sentías en la clase de español antes? ¿Y ahora?'],
        minWords: 55,
        hint: 'Antes + 불완료과거, ahora + 현재 구조를 여러 번 쓰고, cuando · porque · pero 로 문장을 이어 보세요.',
        ph: 'Antes entendía muy poco cuando …',
        connectors: ['pero', 'porque', 'cuando', 'y', 'también', 'además', 'ahora', 'antes'],
        rubric: [
          { k: 'ant', label: 'Antes (예전의 나)', max: 8, re: 'antes', ax: 'Contenido', min: 2 },
          { k: 'aho', label: 'Ahora (지금의 나)', max: 8, re: 'ahora', ax: 'Contenido', min: 2 },
          { k: 'tem', label: '스페인어 공부 내용 (escuchar, hablar, vocabulario …)', max: 6, re: 'espa[nñ]ol|clase|vocabulario|gram[aá]tica|escuchar|hablar|escribir|leer|pronunciaci[oó]n|verbos?|palabras?', ax: 'Contenido' },
          { k: 'ar', label: '불완료과거 -ar (-aba)', max: 8, re: '\\p{L}+(aba|abas|aban|[aá]bamos)', ax: 'Gramática', min: 2 },
          { k: 'er', label: '불완료과거 -er · -ir (-ía)', max: 8, re: '(ten|entend|pod|sab|quer|hac|escrib|viv|le|com|ve|sent|pon|aprend|comprend|cre|deb|sal|dec|o|conoc)[ií]a(s|n|mos)?', ax: 'Gramática', min: 2 },
          { k: 'irr', label: 'ser · ir · ver (era, iba, veía)', max: 6, re: 'era|eras|[eé]ramos|eran|iba|ibas|[ií]bamos|iban|ve[ií]a', ax: 'Gramática' },
          { k: 'pre', label: 'ahora + 현재형', max: 8, re: 'ahora( ya)?( no)? (entiendo|hablo|escribo|leo|s[eé]|puedo|tengo|me siento|me pongo|estoy|soy|hago|practico|estudio|conozco|comprendo|uso|escucho|me gusta)', ax: 'Gramática' },
          { k: 'mej', label: '변화 · 비교 (mejor, más, menos …)', max: 8, re: 'mejor|m[aá]s|menos|mejorado|cambiado|ya no', ax: 'Gramática' }
        ],
        model: 'Antes entendía muy poco cuando escuchaba algo en español y me ponía nerviosa cuando tenía que hablar en clase. No sabía conjugar los verbos y siempre olvidaba las palabras nuevas. Ahora entiendo más porque practico todos los días. Antes escribía frases muy cortas, pero ahora escribo textos más largos. También hablo mejor y ya no tengo miedo. ¡Me gusta mucho la clase de español!'
      }
    },
    build: B
  });
})();
