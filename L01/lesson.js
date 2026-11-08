/* Lección 01 · ¡Hola! ¿Cómo te llamas? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble,
    matchPics, pairMatch, sortBoard, flipGrid, clock, dclock, playLines, dialogHTML, clozeFromDialog,
    actHead, dlgHead, modelo, tip, notice, acc, W0, W1, MARK } = SC;

  /* 알파벳 이름 */
  const LN = { A: 'a', B: 'be', C: 'ce', D: 'de', E: 'e', F: 'efe', G: 'ge', H: 'hache', I: 'i', J: 'jota', K: 'ka', L: 'ele', M: 'eme', N: 'ene', 'Ñ': 'eñe',
    O: 'o', P: 'pe', Q: 'cu', R: 'erre', S: 'ese', T: 'te', U: 'u', V: 'uve', W: 'uve doble', X: 'equis', Y: 'ye', Z: 'zeta' };
  const ABC = Object.keys(LN);
  const spell = w => w.toUpperCase().normalize('NFC').split('').filter(c => LN[c]).map(c => LN[c]).join(', ');
  const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  const seq = arr => arr.map(x => ({ who: 'x', es: x }));
  const blur = (s, txt, btn) => { const t = $(txt, s); t.classList.toggle('blur'); btn.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };

  /* Lección 01 — 학습 데이터 */
  const D = {
    skills: {
      sal: 'Saludos 인사·작별',
      pre: 'Presentarse 자기소개·소개',
      ser: 'Verbos ser·estar·escribir',
      int: 'Interrogativos 의문사',
      abc: 'Alfabeto 알파벳·철자',
      num: 'Números 숫자·연락처',
      voc: 'Vocabulario 어휘',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '이름 · 두 개의 성 · 인사', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '후안과 크리스티나', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '인사하고 자기소개하기', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '대화 완성 (informal · formal)', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '알파벳 듣고 표시하기', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '철자 듣고 단어 쓰기', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '사진 속 단어 읽기', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '내가 아는 스페인어 단어', group: 'Diálogo 1', kind: 'act', n: 6 },
      { id: 'a7', label: 'Actividad 7', kr: '유명 인물 알아맞히기', group: 'Diálogo 1', kind: 'act', n: 7 },
      { id: 'd2', label: 'Diálogo 2', kr: '후안 · 펠리페 · 크리스티나', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a8', label: 'Actividad 8', kr: 'Buenos días / tardes / noches', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '시간에 맞게 인사하기', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '친구 소개하기', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '숫자 0~10 듣기', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'a12', label: 'Actividad 12', kr: 'Un elefante se balanceaba', group: 'Diálogo 2', kind: 'act', n: 12 },
      { id: 'a13', label: 'Actividad 13', kr: '전화번호 · 이메일', group: 'Diálogo 2', kind: 'act', n: 13 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    antes: [
      'En el mundo hispánico hay costumbres muy interesantes, por ejemplo:',
      'Las personas tienen uno o más de un nombre y dos apellidos. El primer apellido es el mismo apellido del padre y se llama “apellido paterno” o “primer apellido” y el segundo apellido viene del primer apellido de la madre, por eso se llama “apellido materno” o “segundo apellido”. Entonces el nombre completo de una persona puede ser, por ejemplo, Juan José Cárdenas Flores o Ana María Gonzáles Torres.',
      'Otra costumbre interesante es la forma de saludarse. Casi siempre las personas que se conocen se saludan con uno o dos besos en la mejilla, sobre todo entre mujeres. Los hombres entre sí se dan la mano, pero pueden también saludar con uno o dos besos a las mujeres.'
    ],

    palabras: [
      { e: '🪪', es: 'el nombre', kr: '이름' },
      { e: '🏷️', es: 'el apellido', kr: '성' },
      { e: '👨', es: 'el padre', kr: '아버지' },
      { e: '👩', es: 'la madre', kr: '어머니' },
      { e: '👨‍🦱', es: 'el apellido paterno', kr: '아버지 쪽 성 (첫째 성)' },
      { e: '👩‍🦰', es: 'el apellido materno', kr: '어머니 쪽 성 (둘째 성)' },
      { e: '😘', es: 'el beso', kr: '입맞춤, 볼 키스' },
      { e: '😊', es: 'la mejilla', kr: '뺨, 볼' },
      { e: '🤝', es: 'darse la mano', kr: '악수하다' },
      { e: '👋', es: 'saludar', kr: '인사하다' }
    ],

    /* 이름 해부: n = nombre, p = apellido paterno, m = apellido materno */
    nombres: [
      ['Juan', 'José', 'Cárdenas', 'Flores', 'nnpm'],
      ['Gabriel', 'García', 'Márquez', 'npm'],
      ['Fidel', 'Alejandro', 'Castro', 'Ruiz', 'nnpm'],
      ['Rafael', 'Nadal', 'Parera', 'npm']
    ],

    dialogo1: [
      { who: 'J', es: '¡Hola! ¿Cómo te [llamas]?' },
      { who: 'C', es: '¡Hola! Me [llamo] Cristina López. ¿Y [tú]? ¿Cómo te llamas?' },
      { who: 'J', es: 'Yo [soy] Juan García.' },
      { who: 'C', es: '¿[Cuál] es tu apellido [materno]?' },
      { who: 'J', es: 'Es Moreno. ¿Y cuál es tu [segundo] apellido?' },
      { who: 'C', es: 'Es Rivero.' },
      { who: 'J', es: '¿Cómo se [escribe]?' },
      { who: 'C', es: 'Se escribe R-I-V-E-R-O.' }
    ],

    dialogo2: [
      { who: 'J', es: 'Hola, Felipe. ¿[Qué] tal?' },
      { who: 'F', es: 'Bien. ¿Y tú?' },
      { who: 'J', es: 'Muy [bien]. Gracias. Mira, [esta] es mi amiga Cristina.' },
      { who: 'F', es: '¡Hola, Cristina! Soy Felipe. ¿[Eres] estudiante de esta escuela?' },
      { who: 'C', es: 'No, soy estudiante de [intercambio]. Soy de Perú.' },
      { who: 'F', es: 'Mucho gusto.' },
      { who: 'C', es: '[Encantada].' },
      { who: 'F', es: 'Bueno, nos vemos en la clase. ¡Hasta [luego]!' },
      { who: 'C', es: 'Adiós.' }
    ],

    /* Actividad 3 — TRANSCRIPCIONES */
    act3: ['Y', 'C', 'H', 'G', 'Q', 'K', 'N', 'B', 'V', 'S', 'Z', 'J', 'I', 'E'],
    /* Actividad 4 — TRANSCRIPCIONES / SOLUCIONES */
    act4: [
      { e: '<span class="dclock" style="font-size:18px;background:#2e7d4f;color:#fff">KIM SUMI</span>', w: 'nombre', kr: '칠판의 KIM SUMI' },
      { e: '📕', w: 'libro', kr: '책' },
      { e: '👨‍🏫', w: 'profesor', kr: '선생님' },
      { e: '🇪🇸📗', w: 'español', kr: '스페인어 책' },
      { e: '🏫👩‍🏫', w: 'clase', kr: '수업 · 교실' },
      { e: '🧑‍🤝‍🧑', w: 'amigo', kr: '친구' }
    ],
    /* Actividad 11 — TRANSCRIPCIONES */
    act11: ['ocho', 'uno', 'nueve', 'cuatro', 'tres', 'cinco', 'cero', 'seis', 'siete', 'diez', 'dos'],

    utiles: [
      ['¿Cómo te llamas?', '이름이 뭐니?'], ['Me llamo Juan.', '내 이름은 후안이야.'],
      ['¡Hola! ¿Qué tal?', '안녕! 잘 지내?'], ['Muy bien, ¿y tú?', '아주 잘 지내, 너는?'],
      ['¡Buenos días!', '좋은 아침이에요! (오전 인사)'], ['¡Buenas tardes!', '안녕하세요! (오후 인사)'], ['¡Buenas noches!', '안녕하세요! / 잘 자요! (밤 인사)'],
      ['Adiós. Hasta mañana.', '잘 가. 내일 봐.'], ['Hasta luego.', '나중에 봐.'],
      ['¿Cuál es tu número de teléfono?', '전화번호가 뭐야?'], ['Mi número de teléfono es el 333-235-8956.', '내 전화번호는 333-235-8956이야.'],
      ['¿Cuál es tu e-mail?', '이메일 주소가 뭐야?'], ['Mi e-mail es cristina@worldmail.com.', '내 이메일은 cristina@worldmail.com이야.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: '¡Hola! ¿Cómo te ____? <i>(llamarse)</i>', a: ['llamas'], s: 'pre' },
      { p: 'Yo me ____ Cristina López. <i>(llamarse)</i>', a: ['llamo'], s: 'pre' },
      { p: '¿Cómo se ____ usted? <i>(llamarse)</i>', a: ['llama'], s: 'pre' },
      { p: 'Yo ____ Juan García. <i>(ser)</i>', a: ['soy'], s: 'ser' },
      { p: '¿____ estudiante de esta escuela? <i>(ser, tú)</i>', a: ['eres'], s: 'ser' },
      { p: 'Cristina ____ de Perú. <i>(ser)</i>', a: ['es'], s: 'ser' },
      { p: 'Hola, ¿cómo ____? <i>(estar, tú)</i>', a: ['estás'], s: 'ser' },
      { p: 'Buenos días, señor Kim. ¿Cómo ____ usted? <i>(estar)</i>', a: ['está'], s: 'ser' },
      { p: '¿Cómo se ____? — Se escribe R-I-V-E-R-O. <i>(escribir)</i>', a: ['escribe'], s: 'ser' },
      { p: '¿____ es tu apellido materno? <i>(어느 것)</i>', a: ['cuál'], s: 'int' },
      { p: '¡Hola! ¿____ tal?', a: ['qué'], s: 'int' },
      { p: '¿____ te llamas? <i>(어떻게)</i>', a: ['cómo'], s: 'int' },
      { p: '¡Buenos ____! <i>(오전 9시)</i>', a: ['días'], s: 'sal' },
      { p: '¡Buenas ____! <i>(오후 5시)</i>', a: ['tardes'], s: 'sal' },
      { p: 'Adiós. Hasta ____. <i>(내일 봐)</i>', a: ['mañana'], s: 'sal' },
      { p: 'Mira, ____ es mi amiga Cristina. <i>(이쪽은)</i>', a: ['esta', 'ésta'], s: 'pre' },
      { p: 'Me llamo Juan. ¿Y ____? <i>(usted, formal)</i>', a: ['usted'], s: 'pre' },
      { p: 'Mi número de teléfono es el 333-235-____. <i>(ocho, nueve, cinco, seis)</i>', a: ['8956'], s: 'num' },
      { p: 'cristina@worldmail.com → cristina ____ worldmail punto com', a: ['arroba'], s: 'num' },
      { p: 'H · J · Ñ → hache, ____, eñe', a: ['jota'], s: 'abc' }
    ]
  };

  const B = {};

  /* ---------- Antes de empezar ---------- */
  B.vocab = () => {
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead"><i>${D.antes[0]}</i> ${say(D.antes[0])}</p>
      <p class="lead">${D.antes[1]} ${say(D.antes[1])}</p>
      <p class="lead">${D.antes[2]} ${say(D.antes[2])}</p>
      <div class="greet"><div><span>👩‍❤️‍👩😘</span><b>un beso / dos besos en la mejilla</b><br><small>아는 사이 · 특히 여자끼리 볼 키스</small></div><div><span>🧑‍💼🤝🧑‍💼</span><b>darse la mano</b><br><small>남자끼리는 악수</small></div></div>
      <h3 class="h3">① 카드를 눌러 뜻을 확인하세요</h3><div class="fg"></div>
      <h3 class="h3">② 이름 해부하기 — 단어를 누를 때마다 <b>이름 → 아버지 성 → 어머니 성</b> 순서로 바뀌어요</h3>
      <div class="nmleg"><span class="n">nombre 이름</span><span class="p">apellido paterno 아버지 성</span><span class="m">apellido materno 어머니 성</span></div>
      <div class="nmw"></div><div class="item-row"><button class="btn chk nmc">채점하기</button><span class="nms"></span></div>
      <h3 class="h3">③ 이름 만들기 — 아버지와 어머니의 <b>첫째 성</b>을 물려받아요</h3><div class="items two fam"></div>
      <h3 class="h3">④ 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">⑤ 쓰기 연습 — 뜻을 보고 스페인어로 쓰세요</h3><div class="items two w"></div>`);
    put(s, '.fg', flipGrid(D.palabras));
    /* 이름 해부 */
    const st = sel('vnm');
    const CYC = ['', 'n', 'p', 'm'], LBL = { n: 'nombre', p: 'ap. paterno', m: 'ap. materno', '': '?' };
    const box = $('.nmw', s);
    D.nombres.forEach((nm, i) => {
      reg('v-nm' + i, 'vocab', 'voc');
      const words = nm.slice(0, -1);
      const row = el(`<div class="nmrow" data-i="${i}"><span class="nn">${i + 1})</span>${words.map((w, j) => `<button class="nw" data-j="${j}">${w}<small></small></button>`).join('')}${say(words.join(' '))}<span class="mkbox"></span></div>`);
      const paint = () => $$('.nw', row).forEach(b => { const v = (st[i] || {})[b.dataset.j] || ''; b.className = 'nw ' + v; $('small', b).textContent = LBL[v]; });
      $$('.nw', row).forEach(b => b.onclick = () => { st[i] = st[i] || {}; const v = st[i][b.dataset.j] || ''; st[i][b.dataset.j] = CYC[(CYC.indexOf(v) + 1) % 4]; save(); paint(); });
      paint();
      box.appendChild(row);
    });
    $('.nmc', s).onclick = () => {
      let ok = 0;
      D.nombres.forEach((nm, i) => {
        const key = nm[nm.length - 1], words = nm.slice(0, -1);
        const good = words.every((w, j) => ((st[i] || {})[j] || '') === key[j]);
        if (good) ok++;
        record('v-nm' + i, good ? 1 : 0, good ? [] : ['otro'], {});
        const row = $(`.nmrow[data-i="${i}"]`, box); row.classList.remove('ok', 'no'); row.classList.add(good ? 'ok' : 'no');
        $('.mkbox', row).innerHTML = MARK(good ? 1 : 0) + (good ? '' : ` <small class="ans">${words.map((w, j) => `${w}=${LBL[key[j]]}`).join(' · ')}</small>`);
      });
      $('.nms', s).innerHTML = `${MARK(ok / D.nombres.length)} <b>${ok} / ${D.nombres.length}</b>`;
    };
    /* 가족 이름 나무 */
    [[['Pedro', 'Cárdenas', 'Ruiz'], ['Lucía', 'Flores', 'Díaz'], '👦', 'Juan José', 'Juan José Cárdenas Flores'],
      [['Luis', 'Gonzáles', 'Pérez'], ['Carmen', 'Torres', 'Vega'], '👧', 'Ana María', 'Ana María Gonzáles Torres'],
      [['Jorge', 'García', 'López'], ['Rosa', 'Moreno', 'Gil'], '👦🏻', 'Juan', 'Juan García Moreno']].forEach(([pa, ma, e, n, ans], i) => {
      const w = writeItem({ id: 'v-fam' + i, sec: 'vocab', skill: 'voc', prompt: `<div class="ftree"><div class="fp fa"><span>👨</span>padre<br><b>${pa[0]} <u>${pa[1]}</u> ${pa[2]}</b></div><div class="fp fm"><span>👩</span>madre<br><b>${ma[0]} <i>${ma[1]}</i> ${ma[2]}</b></div><div class="fp fc"><span>${e}</span>hijo/a: <b>${n} ___ ___</b></div></div>`,
        ph: `${n} …`, answers: [ans] });
      w.classList.add('fam');
      put(s, '.fam', w);
    });
    [['Las personas tienen dos apellidos.', 'Verdadero'], ['Las mujeres se saludan con uno o dos besos en la mejilla.', 'Verdadero'], ['El primer apellido viene de la madre.', 'Falso'],
      ['Los hombres entre sí se saludan siempre con dos besos.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'v-vf' + i, sec: 'vocab', skill: 'voc', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['이름', ['nombre', 'el nombre']], ['어머니 쪽 성 (둘째 성)', ['apellido materno', 'el apellido materno', 'segundo apellido', 'el segundo apellido']],
      ['아버지 쪽 성 (첫째 성)', ['apellido paterno', 'el apellido paterno', 'primer apellido', 'el primer apellido']], ['악수하다', ['darse la mano', 'dar la mano']]]
      .forEach(([k, a], i) => put(s, '.w', writeItem({ id: 'v-w' + i, sec: 'vocab', skill: 'voc', prompt: k, answers: a })));
  };

  /* ---------- Gramática ---------- */
  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. 인칭대명사 — tú 와 usted</h3>
        <div class="blocks"><span class="bk o">tú</span><span class="small">친구 · 가족 · 또래 (informal) → 동사 2인칭: ¿Cómo <b>te llamas</b>? ¿Cómo <b>estás</b>?</span></div>
        <div class="blocks"><span class="bk p">usted</span><span class="small">선생님 · 어른 · 처음 만난 사람 (formal) → 동사 <b>3인칭</b>: ¿Cómo <b>se llama</b> usted? ¿Cómo <b>está</b>?</span></div>
        ${tip('<b>tú</b>(너)는 악센트 有, <b>tu</b>(너의)는 악센트 無: ¿Y <b>tú</b>? / ¿Cuál es <b>tu</b> apellido? — usted의 소유사는 <b>su</b>: ¿Cuál es <b>su</b> apellido?')}
        <div class="g1a"></div><div class="items g1b"></div></div>
      <div class="gcard"><h3>2. llamarse — ~라고 불리다 (이름이 ~이다)</h3>
        <div class="blocks"><span class="bk p">(Yo)</span><span class="bk o">me</span><span class="bk v">llamo</span><span class="bk s">Juan.</span></div>
        <div class="legend-mini"><span class="bk p">주어 (생략 가능)</span><span class="bk o">재귀대명사</span><span class="bk v">llamar 변화</span><span class="bk s">이름</span></div>
        ${tip('같은 뜻: <b>Me llamo Juan.</b> = <b>Mi nombre es Juan.</b> = <b>Soy Juan.</b>')}
        <div class="g2a"></div><div class="items g2b"></div></div>
      <div class="gcard"><h3>3. ser — ~이다 (이름 · 신분 · 출신)</h3>
        <div class="boot-wrap"><div class="g3a"></div><div class="boot-note">🙋 <b>Soy</b> Juan. (이름)<br><b>Soy</b> estudiante. (신분)<br><b>Soy de</b> Perú. (출신)<br><br>⚠️ 불규칙 동사 — 통째로 외워요!</div></div>
        <div class="g3b"></div></div>
      <div class="gcard"><h3>4. estar — 안부 묻고 답하기</h3>
        <table class="dt"><tr><th>yo</th><th>tú</th><th>él / ella / usted</th><th>nosotros/as</th><th>vosotros/as</th><th>ellos / ellas / ustedes</th></tr>
          <tr><td>estoy</td><td>estás</td><td>está</td><td>estamos</td><td>estáis</td><td>están</td></tr></table>
        <div class="scale">
          <div class="st s5"><span>😄</span><b>Muy bien</b><small>아주 좋아</small></div>
          <div class="st s4"><span>🙂</span><b>Bien</b><small>좋아</small></div>
          <div class="st s3"><span>😐</span><b>Así, así</b><small>그저 그래</small></div>
          <div class="st s2"><span>🙁</span><b>Mal</b><small>안 좋아</small></div>
          <div class="st s1"><span>😫</span><b>Fatal</b><small>최악이야</small></div>
        </div>
        ${tip('¿Cómo <b>estás</b>? (tú) / ¿Cómo <b>está</b> usted? — 대답: (Estoy) muy bien, gracias. ¿Y tú?')}
        <div class="items g4"></div></div>
      <div class="gcard"><h3>5. escribir — 쓰다 · ¿Cómo se escribe?</h3>
        <table class="dt"><tr><th>yo</th><th>tú</th><th>él / ella / usted</th><th>nosotros/as</th><th>vosotros/as</th><th>ellos / ellas / ustedes</th></tr>
          <tr><td>escribo</td><td>escribes</td><td>escribe</td><td>escribimos</td><td>escribís</td><td>escriben</td></tr></table>
        ${tip('<b>¿Cómo se escribe?</b> = 어떻게 쓰나요?(철자가 뭐예요?) → <b>Se escribe</b> R-I-V-E-R-O. 같은 뜻: <b>¿Cómo se deletrea?</b>')}
        <div class="g5"></div></div>
      <div class="gcard"><h3>6. 의문사 — qué · cómo · cuál</h3>
        <table class="dt"><tr><th>의문사</th><th>뜻</th><th>이 과의 표현</th></tr>
          <tr><td><b>¿Qué?</b></td><td>무엇</td><td>¿Qué tal? (잘 지내?)</td></tr>
          <tr><td><b>¿Cómo?</b></td><td>어떻게</td><td>¿Cómo te llamas? · ¿Cómo estás? · ¿Cómo se escribe?</td></tr>
          <tr><td><b>¿Cuál?</b></td><td>어느 것 (여러 개 중 하나)</td><td>¿Cuál es tu apellido? · ¿Cuál es tu número de teléfono? · ¿Cuál es tu e-mail?</td></tr></table>
        ${tip('의문사에는 <b>언제나 악센트</b>, 의문문은 앞에 <b>¿</b> 뒤에 <b>?</b> — 이름·전화번호·이메일을 물을 땐 "¿Qué es tu nombre?"(✕)가 아니라 <b>¿Cuál es tu nombre?</b>(○)')}
        <div class="g6"></div></div>`);
    put(s, '.g1a', cloze({ id: 'g1a', sec: 'gram', skill: 'pre', title: '인칭대명사 표를 완성하세요.', cls: 'table2', text:
      [['나', 'yo'], ['너 (informal)', 'tú'], ['당신 (formal)', 'usted'], ['그 / 그녀', 'él|ella'], ['우리', 'nosotros|nosotras'], ['당신들 · 너희들 (중남미)', 'ustedes']].map(([a, b]) => `<p><span>${a}</span> → [${b}]</p>`).join('') }));
    [['😃 같은 반 친구에게', 'tú'], ['👴 처음 만난 할아버지께', 'usted']]
      .forEach(([p, a], i) => put(s, '.g1b', choiceItem({ id: 'g1b-' + i, sec: 'gram', skill: 'pre', prompt: p, options: ['tú', 'usted'], answer: a })));
    put(s, '.g2a', cloze({ id: 'g2a', sec: 'gram', skill: 'pre', title: 'llamarse 변화표를 완성하세요.', cls: 'table2', text:
      [['yo', 'me llamo'], ['tú', 'te llamas'], ['él / ella / usted', 'se llama'], ['nosotros/as', 'nos llamamos'], ['vosotros/as', 'os llamáis'], ['ellos / ellas / ustedes', 'se llaman']].map(([a, b]) => `<p><span>${a}</span> [${b}]</p>`).join('') }));
    [['(친구에게) 이름이 뭐야?', ['¿Cómo te llamas?']], ['(선생님께) 성함이 어떻게 되세요?', ['¿Cómo se llama usted?', '¿Cómo se llama?', '¿Usted cómo se llama?']],
      ['그녀의 이름은 아나야. <span class="small">(llamarse)</span>', ['Ella se llama Ana.', 'Se llama Ana.']]]
      .forEach(([p, a], i) => put(s, '.g2b', writeItem({ id: 'g2b-' + i, sec: 'gram', skill: 'pre', prompt: p, answers: a })));
    put(s, '.g3a', cloze({ id: 'g3a', sec: 'gram', skill: 'ser', cls: 'boot', text:
      [['yo', 'soy', 1], ['tú', 'eres', 1], ['él / ella / usted', 'es', 1], ['nosotros/as', 'somos', 0], ['vosotros/as', 'sois', 0], ['ellos / ellas / ustedes', 'son', 1]]
        .map(([p, f, b]) => `<p class="${b ? 'in' : 'out'}"><span>${p}</span>[${f}]</p>`).join('') }));
    put(s, '.g3b', cloze({ id: 'g3b', sec: 'gram', skill: 'ser', cls: 'lines', title: 'ser 를 알맞게 바꾸세요.', text:
      ['Yo [soy] Juan García.', '¿[Eres] estudiante de esta escuela?', 'Nosotros [somos] amigos.'].map(x => `<p>${x}</p>`).join('') }));
    [['(선생님께) 어떻게 지내세요? <span class="small">(estar)</span>', ['¿Cómo está usted?', '¿Cómo está?']],
      ['😐 그저 그래.', ['Así, así.', 'Estoy así, así.', 'Así así.']]]
      .forEach(([p, a], i) => put(s, '.g4', writeItem({ id: 'g4-' + i, sec: 'gram', skill: 'ser', prompt: p, answers: a })));
    put(s, '.g5', cloze({ id: 'g5', sec: 'gram', skill: 'ser', cls: 'lines', title: 'escribir 를 알맞게 바꾸세요.', text:
      ['A: ¿Cómo se [escribe] tu apellido?', 'Yo [escribo] mi nombre en la pizarra.', 'Nosotros [escribimos] los números en español.'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.g6', cloze({ id: 'g6', sec: 'gram', skill: 'int', cls: 'lines', title: 'qué / cómo / cuál 중 알맞은 의문사를 쓰세요. (악센트 주의!)', text:
      ['¿[Cómo] te llamas?', '¿[Cuál] es tu apellido?', '¡Hola! ¿[Qué] tal?', '¿[Cuál] es tu número de teléfono?', '¿[Cómo] estás?'].map(x => `<p>${x}</p>`).join('') }));
  };

  /* ---------- Diálogo 1 ---------- */
  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Juan y Cristina se encuentran el primer día de clase.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">① 내용 확인</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cuál es tu nombre?</span><span class="hlc c1">Mi nombre es Cristina.</span><span class="hlc c2">Me llamo Juan. / Mi nombre es Juan.</span><span class="hlc c0">¿Cuál es tu segundo apellido?</span><span class="hlc c1">¿Cómo se deletrea?</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    $('#hide1', s).onclick = e => blur(s, '#d1txt', e.target);
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'pre', cls: 'lines', text: clozeFromDialog(D.dialogo1) }));
    [['Juan y Cristina se encuentran el primer día de clase.', 'Verdadero'], ['El apellido materno de Juan es Rivero.', 'Falso'], ['El segundo apellido de Cristina es Rivero.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'pre', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['¿Cómo te llamas? → <span class="chip">nombre</span> 로 바꿔 쓰세요.', ['¿Cuál es tu nombre?']],
      ['Me llamo Cristina. → <span class="chip">nombre</span> 로 바꿔 쓰세요.', ['Mi nombre es Cristina.']],
      ['¿Cuál es tu apellido materno? → <span class="chip">segundo</span> 로 바꿔 쓰세요.', ['¿Cuál es tu segundo apellido?']],
      ['¿Cómo se escribe? → <span class="chip">deletrear</span> 로 바꿔 쓰세요.', ['¿Cómo se deletrea?']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'pre', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 6, prompt: '새 친구와 처음 만나 이름과 성을 묻고 철자를 확인하는 대화를 4~6줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¡Hola! ¿Cómo te llamas?\nB: ¡Hola! Me llamo …',
      must: [{ re: '¿\\s*c[oó]mo te llamas|¿\\s*cu[aá]l es tu nombre', label: '¿Cómo te llamas? / ¿Cuál es tu nombre?' }, { re: W0 + '(me llamo|mi nombre es|soy)' + W1, label: 'Me llamo / Mi nombre es / Soy' },
        { re: '¿\\s*cu[aá]l es tu (primer |segundo )?apellido', label: '¿Cuál es tu (segundo) apellido?' }, { re: '¿\\s*c[oó]mo se (escribe|deletrea)', label: '¿Cómo se escribe?' },
        { re: W0 + 'se escribe' + W1, label: 'Se escribe …' }],
      model: 'A: ¡Hola! ¿Cómo te llamas? B: ¡Hola! Me llamo Sofía Ruiz. ¿Y tú? A: Mi nombre es Minsu. B: ¿Cuál es tu apellido? A: Es Kim. B: ¿Cómo se escribe? A: Se escribe K-I-M.' }));
  };

  /* ---------- Actividad 1 ---------- */
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Saluda y preséntate a tu compañero siguiendo el diálogo 1.', { kr: '친구에게는 tú(informal), 처음 만난 어른에게는 usted(formal)로 말해요.' })}
      <div class="grid2">${modelo('A: ¡Hola! Me llamo ________.<br>&nbsp;&nbsp;&nbsp;&nbsp;¿Y tú?<br>B: ¡Hola! Yo me llamo ________.<br>A: ¿Cómo se escribe tu nombre?<br>B: Se escribe ________.<br>A: ¿Está bien así?<br>B: Sí.', 'a) informal')}
      ${modelo('A: ¡Hola! ¿Cómo se llama usted?<br>B: Me llamo ________.<br>A: ¿Cómo? ¿Cuál es su apellido?<br>B: Es ________.<br>A: ¿Cómo se escribe?<br>B: Se escribe ________.<br>A: ¿Está bien así?<br>B: Sí.', 'b) formal')}</div>
      <h3 class="h3">✍️ 대화 속 질문 쓰기</h3><div class="items two q"></div>
      <h3 class="h3">🪪 내 이름 카드 — 이름과 성을 로마자로 쓰면 아래 정답이 내 이름으로 바뀌어요</h3>
      <div class="idcard"><span class="ph">🧑‍🎓</span><div><label>Nombre (이름)</label><input class="inp" id="myN" placeholder="Minsu" autocomplete="off"></div><div><label>Apellido (성)</label><input class="inp" id="myA" placeholder="Kim" autocomplete="off"></div></div>
      <div class="items two me"></div>
      <h3 class="h3">✍️ 대화 완성하기 — 내 정보로 a) informal · b) formal 대화를 모두 쓰세요</h3><div class="items two f"></div>`);
    const st = sel('a1', { n: '', a: '' });
    const nI = $('#myN', s), aI = $('#myA', s);
    nI.value = st.n; aI.value = st.a;
    nI.oninput = () => { st.n = nI.value.trim(); save(); };
    aI.oninput = () => { st.a = aI.value.trim(); save(); };
    [['(informal) 네 이름은 어떻게 써?', ['¿Cómo se escribe tu nombre?']], ['(formal) 성함이 어떻게 되세요?', ['¿Cómo se llama usted?', '¿Cómo se llama?']],
      ['(formal) 성(apellido)이 뭐예요?', ['¿Cuál es su apellido?']], ['이렇게 쓰는 거 맞아요?', ['¿Está bien así?']]]
      .forEach(([p, a], i) => put(s, '.q', writeItem({ id: 'a1-q' + i, sec: 'a1', skill: i === 3 ? 'ser' : 'pre', prompt: p, answers: a })));
    const need = k => st[k] ? st[k] : null;
    const sp = w => w.toUpperCase().split('').join('-');
    [['(informal) ¡Hola! Me llamo …', () => need('n') && [`¡Hola! Me llamo ${st.n}.`, `¡Hola! Yo me llamo ${st.n}.`, `Me llamo ${st.n}.`], 'pre'],
      ['(informal) ¿Cómo se escribe tu nombre? — 철자를 하이픈(-)으로', () => need('n') && [`Se escribe ${sp(st.n)}.`, sp(st.n)], 'abc'],
      ['(formal) ¿Cuál es su apellido?', () => need('a') && [`Es ${st.a}.`, `Mi apellido es ${st.a}.`], 'pre'],
      ['(formal) ¿Cómo se escribe? — 성의 철자', () => need('a') && [`Se escribe ${sp(st.a)}.`, sp(st.a)], 'abc']]
      .forEach(([p, f, sk], i) => put(s, '.me', writeItem({ id: 'a1-m' + i, sec: 'a1', skill: sk, prompt: p, ph: '내 이름 카드를 먼저 채우세요', answers: () => f() || null })));
    put(s, '.f', freeItem({ id: 'a1-fa', sec: 'a1', rows: 6, prompt: '<b>a) informal</b> — 친구와', ph: 'A: ¡Hola! Me llamo …\n¿Y tú?',
      must: [{ re: W0 + 'me llamo' + W1, label: 'Me llamo …' }, { re: '¿\\s*y t[uú]\\s*\\?', label: '¿Y tú?' }, { re: '¿\\s*c[oó]mo se escribe tu nombre', label: '¿Cómo se escribe tu nombre?' }, { re: 'se escribe (\\p{L}-)+\\p{L}', label: 'Se escribe A-B-C (철자)' }],
      model: 'A: ¡Hola! Me llamo Minsu. ¿Y tú? B: ¡Hola! Yo me llamo Laura. A: ¿Cómo se escribe tu nombre? B: Se escribe L-A-U-R-A. A: ¿Está bien así? B: Sí.' }));
    put(s, '.f', freeItem({ id: 'a1-fb', sec: 'a1', rows: 6, prompt: '<b>b) formal</b> — 선생님과', ph: 'A: ¡Hola! ¿Cómo se llama usted?\nB: Me llamo …',
      must: [{ re: '¿\\s*c[oó]mo se llama usted', label: '¿Cómo se llama usted?' }, { re: '¿\\s*cu[aá]l es su apellido', label: '¿Cuál es su apellido?' }, { re: W0 + 'es \\p{L}+', label: 'Es + 성' }, { re: 'se escribe (\\p{L}-)+\\p{L}', label: 'Se escribe R-O-D-R… (철자)' }],
      model: 'A: ¡Hola! ¿Cómo se llama usted? B: Me llamo Carlos Rodríguez. A: ¿Cómo? ¿Cuál es su apellido? B: Es Rodríguez. A: ¿Cómo se escribe? B: Se escribe R-O-D-R-I-G-U-E-Z. A: ¿Está bien así? B: Sí.' }));
  };

  /* ---------- Actividad 2 ---------- */
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Completa los diálogos con las palabras del recuadro.')}
      <div class="grid2"><div><div class="ybox wordbank">a) informal: <span>me</span><span>tú</span><span>Carmen</span><span>Hola</span><span>llamo</span><span>llamo</span><span>Juan</span><span>Y</span></div><div class="ca"></div></div>
      <div><div class="ybox wordbank">b) formal: <span>me</span><span>usted</span><span>Insu</span><span>Kim</span><span>Encantado</span><span>Encantada</span><span>llamo</span><span>Sumi</span><span>Park</span><span>Y</span></div><div class="cb"></div></div></div>
      ${tip('<b>Encantado</b> — 남자가 말할 때 / <b>Encantada</b> — 여자가 말할 때 (만나서 반가워요)')}
      <h3 class="h3">✍️ 누가 말할까요?</h3><div class="items two ch"></div>
      <h3 class="h3">✍️ tú → usted 로 바꿔 쓰세요</h3><div class="items two tu"></div>`);
    put(s, '.ca', cloze({ id: 'a2a', sec: 'a2', skill: 'pre', cls: 'lines modelo-like', text:
      ['<b class="who">Carmen:</b> ¿Cómo te llamas?', '<b class="who">Juan:</b> Me [llamo] [Juan]. ¿[Y] [tú]?', '<b class="who">Carmen:</b> Yo [me] [llamo] [Carmen].', '<b class="who">Juan:</b> ¡Hola!', '<b class="who">Carmen:</b> ¡[Hola]!'].map(x => `<p>${x}</p>`).join('') }));
    put(s, '.cb', cloze({ id: 'a2b', sec: 'a2', skill: 'pre', cls: 'lines modelo-like', text:
      ['<b class="who">Profesor Kim:</b> Me [llamo] [Insu] [Kim]. ¿[Y] [usted]?', '<b class="who">Profesora Park:</b> Yo [me] llamo [Sumi] [Park].', '<b class="who">Profesor Kim:</b> ¡[Encantado]!', '<b class="who">Profesora Park:</b> ¡[Encantada]!'].map(x => `<p>${x}</p>`).join('') }));
    [['👧🏽 Cristina: ______.', 'Encantada'], ['👦🏼 Felipe: ______.', 'Encantado']]
      .forEach(([p, a], i) => put(s, '.ch', choiceItem({ id: 'a2-c' + i, sec: 'a2', skill: 'sal', prompt: p, options: ['Encantado', 'Encantada'], answer: a })));
    [['¿Cuál es tu apellido?', ['¿Cuál es su apellido?']], ['¿Cómo te llamas?', ['¿Cómo se llama usted?', '¿Cómo se llama?']]]
      .forEach(([p, a], i) => put(s, '.tu', writeItem({ id: 'a2-t' + i, sec: 'a2', skill: 'pre', prompt: `${p} → <span class="chip">usted</span>`, answers: a })));
  };

  /* ---------- Actividad 3 ---------- */
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Escucha y marca las letras que oigas.', { listen: true, kr: '▶ 버튼을 누르면 교재 듣기 대본(TRANSCRIPCIONES)의 알파벳 14개가 나와요. 들은 글자를 눌러 표시하세요.' })}
      <h3 class="h3"><button class="btn ghost sm" id="p3">▶ 알파벳 듣기</button> <button class="btn ghost sm" id="p3s">🐢 천천히 하나씩</button> <span class="small" id="p3n"></span></h3>
      <div class="abcg"></div>
      <div class="item-row"><button class="btn ghost rst3">지우기</button><button class="btn chk m3">채점하기</button><span class="s3"></span></div>
      <details class="model"><summary>🔤 스페인어 알파벳 이름표 (el abecedario) 열기</summary><div class="abct">${ABC.map(c => `<div><b>${c}</b><small>${LN[c]}</small>${say(LN[c])}</div>`).join('')}</div></details>
      ${tip('<b>H</b>(hache)는 소리가 나지 않아요: hotel → [오텔]. <b>Ñ</b>(eñe)는 스페인어에만 있는 글자: España, mañana.')}
      <h3 class="h3">✍️ 알파벳 이름을 스페인어로 쓰세요</h3><div class="items two w"></div>`);
    const st = sel('a3', {});
    const grid = $('.abcg', s);
    grid.innerHTML = ABC.map(c => `<button data-c="${c}">${c}</button>`).join('');
    reg('a3-L', 'a3', 'abc');
    const paint = () => $$('button', grid).forEach(b => b.classList.toggle('on', !!st[b.dataset.c]));
    $$('button', grid).forEach(b => b.onclick = () => { st[b.dataset.c] = !st[b.dataset.c]; save(); paint(); });
    paint();
    $('#p3', s).onclick = e => playLines(seq(D.act3.map(c => LN[c])), e.currentTarget);
    let k = 0;
    $('#p3s', s).onclick = e => { SC.speak(LN[D.act3[k]], e.currentTarget); $('#p3n', s).textContent = `${k + 1} / ${D.act3.length}`; k = (k + 1) % D.act3.length; };
    $('.rst3', s).onclick = () => { Object.keys(st).forEach(x => delete st[x]); save(); $$('button', grid).forEach(b => b.classList.remove('ok', 'no', 'miss')); paint(); $('.s3', s).innerHTML = ''; };
    $('.m3', s).onclick = () => {
      let ok = 0, extra = 0;
      D.act3.forEach(c => { if (st[c]) ok++; });
      $$('button', grid).forEach(b => {
        const c = b.dataset.c, heard = D.act3.includes(c);
        b.classList.remove('ok', 'no', 'miss');
        if (st[c] && heard) b.classList.add('ok'); else if (st[c]) { b.classList.add('no'); extra++; } else if (heard) b.classList.add('miss');
      });
      const sc = Math.max(0, (ok - extra) / D.act3.length);
      record('a3-L', sc, sc < 1 ? ['otro'] : [], {});
      $('.s3', s).innerHTML = `${MARK(sc)} <b>${ok} / ${D.act3.length}</b>${extra ? ` <span class="warn">듣지 않은 글자 ${extra}개 표시 ✕</span>` : ''} <span class="small">정답: ${D.act3.join(', ')}</span>`;
    };
    [['H', ['hache']], ['J', ['jota']], ['Ñ', ['eñe']], ['Q', ['cu']], ['V', ['uve', 've']], ['Z', ['zeta']], ['G', ['ge']], ['Y', ['ye', 'i griega']]]
      .forEach(([c, a], i) => put(s, '.w', writeItem({ id: 'a3-w' + i, sec: 'a3', skill: 'abc', prompt: `<b style="font-family:var(--serif);font-size:24px;color:var(--red)">${c}</b>`, ph: '글자 이름', answers: a })));
  };

  /* ---------- Actividad 4 ---------- */
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Escucha y escribe las letras que oigas. Después, pronuncia la palabra.', { listen: true, kr: '▶ 철자 듣기를 누르고 들리는 글자를 이어 단어를 쓰세요.' })}
      <div class="items two w"></div>
      <h3 class="h3">✍️ 거꾸로! — 단어의 철자를 알파벳 이름으로 쓰세요 <span class="small">(예: sol → ese-o-ele)</span></h3><div class="items two r"></div>`);
    D.act4.forEach((x, i) => put(s, '.w', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'abc', prompt: `${i + 1}) <span class="emo-sm">${x.e}</span> <button class="btn ghost sm" data-say="${esc(spell(x.w))}">▶ 철자 듣기</button>`,
      ph: '단어', answers: [x.w, x.w.split('').join('-')] })));
    [['hola', 'hache-o-ele-a'], ['Juan', 'jota-u-a-ene'], ['Perú', 'pe-e-erre-u']]
      .forEach(([w, a], i) => put(s, '.r', writeItem({ id: 'a4-r' + i, sec: 'a4', skill: 'abc', prompt: `<b>${w}</b> ${say(w)}`, ph: '…-…-…', answers: [a] })));
  };

  /* ---------- Actividad 5 ---------- */
  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Observa las fotos y lee las palabras.', { kr: '영어와 비슷한 단어가 많아요! 단어를 눌러 알맞은 사진에 붙이고, 🔊로 발음을 들어 보세요.' })}
      <div class="m5"></div>
      ${tip('스페인어는 <b>쓰인 대로 읽어요</b>. 단, <b>h</b>는 묵음(hotel [오텔]), <b>ch</b>는 [ㅊ](chocolate [초콜라테]), <b>r</b>는 혀를 굴려요.')}
      <h3 class="h3">✍️ 발음 고르기</h3><div class="items two ch"></div>
      <h3 class="h3">✍️ 뜻을 보고 스페인어로 쓰세요</h3><div class="items two w"></div>`);
    put(s, '.m5', matchPics({ id: 'a5m', sec: 'a5', skill: 'voc', cols: 3, items: [
      { e: '🍽️', es: 'restaurante', cap: say('restaurante') }, { e: '🚪➡️', es: 'entrada', cap: say('entrada') }, { e: '🎬', es: 'cinema', cap: say('cinema') },
      { e: '🍫', es: 'chocolate', cap: say('chocolate') }, { e: '🏨', es: 'hotel', cap: say('hotel') }, { e: '✈️', es: 'aeropuerto', cap: say('aeropuerto') }] }));
    [['hotel', ['호텔', '오텔'], '오텔'], ['chocolate', ['초콜릿', '초콜라테'], '초콜라테']]
      .forEach(([w, o, a], i) => put(s, '.ch', choiceItem({ id: 'a5-c' + i, sec: 'a5', skill: 'abc', prompt: `<b>${w}</b> ${say(w)}`, options: o, answer: a })));
    [['🍽️ 식당', ['restaurante', 'el restaurante']], ['✈️ 공항', ['aeropuerto', 'el aeropuerto']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a5-w' + i, sec: 'a5', skill: 'voc', prompt: p, answers: a })));
  };

  /* ---------- Actividad 6 ---------- */
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Escribe en la pizarra las palabras en español que conoces e intenta pronunciarlas. Puedes escribir nombres de personas famosas, ciudades, países o comidas.')}
      <h3 class="h3">① 칠판의 단어를 종류별로 나누세요</h3><div class="sb6"></div>
      <h3 class="h3">② 내 칠판 — 내가 아는 스페인어 단어를 6개 이상 쉼표(,)로 구분해 쓰세요</h3>
      <div class="pizarra" id="piz"></div><div class="f"></div>`);
    put(s, '.sb6', sortBoard({ id: 'a6s', sec: 'a6', skill: 'voc', cols: [{ k: 'P', label: '🌟 personas famosas' }, { k: 'C', label: '🏙️ ciudades' }, { k: 'S', label: '🗺️ países' }, { k: 'F', label: '🌮 comidas' }],
      chips: [['Shakira', 'P'], ['Rafael Nadal', 'P'], ['Barcelona', 'C'], ['Madrid', 'C'], ['México', 'S'], ['España', 'S'], ['taco', 'F'], ['paella', 'F'], ['churros', 'F']] }));
    const f = freeItem({ id: 'a6-f', sec: 'a6', rows: 3, ph: 'México, taco, Barcelona, …',
      must: [{ re: '\\p{L}{2,}', label: '단어 6개 이상', min: 6 }],
      model: 'México, taco, Barcelona, paella, Messi, Madrid, tortilla, Perú, Shakira, chocolate' });
    put(s, '.f', f);
    const ta = $('textarea', f), pz = $('#piz', s);
    const draw = () => { const ws = ta.value.split(/[,\n]+/).map(x => x.trim()).filter(Boolean); pz.innerHTML = ws.length ? ws.map(w => `<span>${esc(w)}</span>`).join('') : '<em>México &nbsp; taco &nbsp; Barcelona … 여기에 내 단어가 나타나요</em>'; };
    ta.addEventListener('input', draw); draw();
  };

  /* ---------- Actividad 7 ---------- */
  const FAM = [['⚽', '아르헨티나 축구 선수', 'Lionel Messi'], ['🎨', '스페인 화가', 'Pablo Picasso'], ['🎬', '스페인 배우', 'Penélope Cruz'], ['📜', '칠레 시인', 'Pablo Neruda'], ['🎤', '쿠바 정치가', 'Fidel Castro'], ['🎒', '만화 탐험가 소녀', 'Dora Márquez']];
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, '¿Conoces a estas personas? ¿Quiénes son?<br>Con tus compañeros, identifica estos personajes famosos.')}
      <div class="ybox wordbank">${FAM.map(x => `<span>${x[2]}</span>`).join('')}</div>
      <div class="pm7"></div>
      ${modelo('A: ¿Quién es el número 1?<br>B: Es Lionel Messi. / Se llama Lionel Messi.')}
      <h3 class="h3">✍️ ¿Quién es? — 문장으로 쓰세요</h3><div class="items two w"></div>`);
    put(s, '.pm7', pairMatch({ id: 'a7p', sec: 'a7', skill: 'voc', pairs: FAM.map(([e, k, n], i) => [`<span class="emo">${e}</span> ${i + 1}번 · ${k}`, n]) }));
    [1, 3, 5].forEach(i => { const [e, k, n] = FAM[i]; put(s, '.w', writeItem({ id: 'a7-' + i, sec: 'a7', skill: 'pre', prompt: `¿Quién es el número ${i + 1}? <span class="emo-sm">${e}</span> <span class="small">${k}</span>`, ph: 'Es …',
      answers: [`Es ${n}.`, `Se llama ${n}.`, `${/Penélope|Dora/.test(n) ? 'Ella' : 'Él'} es ${n}.`, `${n}.`] })); });
  };

  /* ---------- Diálogo 2 ---------- */
  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Juan le presenta su amiga Cristina a Felipe.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cómo estás?</span><span class="hlc c1">Así, así.</span><span class="hlc c2">Te presento a mi amiga Cristina.</span><span class="hlc c0">¡Chao!</span></div>
      <div class="items rep"></div>
      <h3 class="h3">c) 나만의 대화 쓰기 — 친구에게 다른 친구를 소개하는 대화</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    $('#hide2', s).onclick = e => blur(s, '#d2txt', e.target);
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'sal', cls: 'lines', text: clozeFromDialog(D.dialogo2) }));
    [['Cristina es estudiante de esta escuela.', 'Falso'], ['Cristina es de Perú.', 'Verdadero'], ['Juan le presenta su amiga Cristina a Felipe.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'pre', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['Hola, Felipe. <u>¿Qué tal?</u>', '¿Cómo estás?', ['Hola, Felipe. ¿Cómo estás?']], ['<u>Muy bien</u>. Gracias.', 'Así, así.', ['Así, así. Gracias.', 'Así así. Gracias.']],
      ['Mira, <u>esta es mi amiga Cristina</u>.', 'Te presento a …', ['Te presento a mi amiga Cristina.', 'Mira, te presento a mi amiga Cristina.']], ['Bueno, nos vemos en la clase. <u>¡Hasta luego!</u>', '¡Chao!', ['Bueno, nos vemos en la clase. ¡Chao!']]]
      .forEach(([p, k, a], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: 'sal', prompt: `${p} → <span class="chip">${k}</span>`, answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 6, ph: 'A: Hola, … ¿Qué tal?\nB: Bien. ¿Y tú?',
      must: [{ re: '¿\\s*(qu[eé] tal|c[oó]mo est[aá]s)', label: '¿Qué tal? / ¿Cómo estás?' }, { re: W0 + '(muy bien|bien|as[ií],? as[ií])' + W1, label: '안부 대답 (bien / así, así)' },
        { re: W0 + '(est[ea] es mi amig[oa]|te presento a)' + W1, label: 'Este/Esta es mi amigo/a … / Te presento a …' }, { re: W0 + '(mucho gusto|encantad[oa])' + W1, label: 'Mucho gusto / Encantado(a)' },
        { re: W0 + '(hasta luego|adi[oó]s|chao|hasta ma[nñ]ana)' + W1, label: '작별 인사' }],
      model: 'A: Hola, Sofía. ¿Qué tal? B: Así, así. ¿Y tú? A: Muy bien, gracias. Mira, este es mi amigo Minsu. C: ¡Hola! Mucho gusto. B: Encantada. A: Bueno, ¡hasta luego! B: ¡Chao!' }));
  };

  /* ---------- Actividad 8 ---------- */
  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Escribe “Buenos días”, “Buenas tardes” o “Buenas noches”.')}
      <div class="daybar"><div class="n1">🌙 noches</div><div class="d">🌅 Buenos días</div><div class="t">☀️ Buenas tardes</div><div class="n2">🌙 noches</div></div>
      <div class="dayax">${[[0, '0h'], [6, '6h'], [12, '12h'], [14, '14h 점심'], [21, '21h'], [24, '24h']].map(([h, t]) => `<span style="left:${h / 24 * 100}%">${t}</span>`).join('')}</div>
      ${tip('스페인어권에서는 <b>점심 식사(14시 무렵) 전</b>까지 Buenos días, 점심 후 <b>해가 질 때까지</b> Buenas tardes, 그 뒤엔 Buenas noches. (20:30은 여름엔 아직 tardes일 수도 있어요!)')}
      <div class="clkg c1"></div>
      <h3 class="h3">⭐ 도전 — 아날로그 시계</h3><div class="clkg c2"></div>`);
    const G = ['Buenos días.', 'Buenas tardes.', 'Buenas noches.'];
    const ans = k => k.split('/').flatMap(i => [G[+i], '¡' + G[+i].slice(0, -1) + '!']);
    [['20:30', '2/1'], ['08:15', '0'], ['14:05', '1'], ['22:45', '2']].forEach(([t, k], i) =>
      put(s, '.c1', writeItem({ id: 'a8-' + i, sec: 'a8', skill: 'sal', prompt: `${i + 1})<br>${dclock(t)}`, ph: 'Buenos …', answers: ans(k) })));
    [[9, 0, '0', '오전'], [17, 30, '1', '오후']].forEach(([h, m, k, kr], i) =>
      put(s, '.c2', writeItem({ id: 'a8-x' + i, sec: 'a8', skill: 'sal', prompt: `${clock(h, m)}<span class="small">${kr} ${h}:${String(m).padStart(2, '0')}</span>`, ph: 'Buen…', answers: ans(k) })));
  };

  /* ---------- Actividad 9 ---------- */
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Saluda a tu compañero usando “Buenos días”, “Buenas tardes” o “Buenas noches”.')}
      <h3 class="h3">modelo <button class="btn ghost sm" id="p9">▶ 듣기</button></h3><div class="c9"></div>
      <h3 class="h3">✍️ 상황에 맞게 쓰세요</h3><div class="items two w"></div>
      <h3 class="h3">✍️ 나의 인사 대화 — 시간을 골라 쓰세요</h3>
      <div class="mode"><button data-t="d">🌅 아침 8시</button><button data-t="t">☀️ 오후 4시</button><button data-t="n">🌙 밤 9시</button></div><div class="f"></div>`);
    const M = ['A: ¡Hola! ¡Buenos días!', 'B: ¡Buenos días! ¿Cómo estás?', 'A: Bien. Gracias. ¿Y tú?', 'B: Excelente. Bueno, ¡hasta mañana!', 'A: ¡Adiós! ¡Hasta luego!'];
    $('#p9', s).onclick = e => playLines(M.map(x => ({ who: x[0], es: x.slice(3) })), e.currentTarget);
    put(s, '.c9', cloze({ id: 'a9c', sec: 'a9', skill: 'sal', cls: 'lines modelo-like', text:
      ['A: ¡Hola! ¡Buenos [días]!', 'B: ¡Buenos días! ¿Cómo [estás]?', 'A: [Bien]. Gracias. ¿Y [tú]?', 'B: Excelente. Bueno, ¡hasta [mañana]!', 'A: ¡[Adiós]! ¡Hasta [luego]!'].map(x => `<p>${x}</p>`).join('') }));
    [['🌅 오전 8시, 선생님께 아침 인사', ['¡Buenos días!', 'Buenos días, profesor.', 'Buenos días, profesora.']], ['☀️ 오후 4시, 친구에게 "안녕! 잘 지내?"', ['¡Hola! ¿Qué tal?', '¡Hola! ¿Cómo estás?', '¡Buenas tardes! ¿Qué tal?', '¡Buenas tardes! ¿Cómo estás?']],
      ['헤어질 때 "나중에 봐!"', ['¡Hasta luego!', 'Adiós, hasta luego.']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a9-' + i, sec: 'a9', skill: 'sal', prompt: p, answers: a })));
    const st = sel('a9', {});
    const paint = () => $$('.mode button', s).forEach(b => b.classList.toggle('on', st.t === b.dataset.t));
    $$('.mode button', s).forEach(b => b.onclick = () => { st.t = b.dataset.t; save(); paint(); });
    paint();
    const GR = { d: ['buenos d[ií]as', 'Buenos días'], t: ['buenas tardes', 'Buenas tardes'], n: ['buenas noches', 'Buenas noches'] };
    put(s, '.f', freeItem({ id: 'a9-f', sec: 'a9', rows: 5, ph: 'A: ¡Hola! ¡Buenos días!\nB: …', needMsg: '먼저 위에서 시간을 고르세요.',
      must: () => st.t ? [{ re: GR[st.t][0], label: GR[st.t][1] }, { re: '¿\\s*(c[oó]mo est[aá]s|qu[eé] tal)', label: '¿Cómo estás? / ¿Qué tal?' },
        { re: W0 + '(muy bien|bien|excelente|as[ií],? as[ií]|mal)' + W1, label: '안부 대답' }, { re: W0 + '(hasta luego|hasta ma[nñ]ana|adi[oó]s|chao)' + W1, label: '작별 인사' }] : null,
      model: 'A: ¡Hola! ¡Buenas tardes! B: ¡Buenas tardes! ¿Qué tal? A: Muy bien, gracias. ¿Y tú? B: Así, así. Bueno, ¡hasta mañana! A: ¡Adiós!' }));
  };

  /* ---------- Actividad 10 ---------- */
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Practica con tus compañeros siguiendo el diálogo 2.', { kr: 'A가 B에게 C를 소개하고, B와 C가 인사해요.' })}
      <div class="grid2">${modelo('A: Mira. Este es mi amigo ________.<br>B: ¡Hola! Mucho gusto.<br>C: Encantado.', 'a) informal')}${modelo('A: Mire. Le presento a la señorita ________.<br>B: Mucho gusto.<br>C: Encantada.', 'b) formal')}</div>
      ${tip('<b>Mira</b>(tú) / <b>Mire</b>(usted) — 이것 봐 · 저기요<br><b>Este es</b> mi amigo (남) / <b>Esta es</b> mi amiga (여) — 이쪽은 내 친구야<br><b>Te presento a</b> … (tú) / <b>Le presento a</b> … (usted) — ~를 소개할게(요). a + el señor = <b>al</b> señor')}
      <h3 class="h3">✍️ 고르세요</h3><div class="items two ch"></div>
      <h3 class="h3">✍️ 소개하는 문장 쓰기</h3><div class="items two w"></div>
      <h3 class="h3">✍️ 대화 완성 — a) informal · b) formal</h3><div class="items two f"></div>`);
    [['Mira, ____ es mi amiga Sofía.', ['este', 'esta'], 'esta'], ['Mira, ____ es mi amigo Pablo.', ['este', 'esta'], 'este'], ['(선생님께) ____. Le presento a la señorita Park.', ['Mira', 'Mire'], 'Mire']]
      .forEach(([p, o, a], i) => put(s, '.ch', choiceItem({ id: 'a10-c' + i, sec: 'a10', skill: 'pre', prompt: p, options: o, answer: a })));
    [['(친구에게) 봐, 이쪽은 내 친구 페드로야.', ['Mira, este es mi amigo Pedro.', 'Este es mi amigo Pedro.']],
      ['(선생님께) 저기요, 박 양을 소개해 드릴게요.', ['Mire, le presento a la señorita Park.', 'Le presento a la señorita Park.']],
      ['(선생님께) 김 선생님(señor Kim)을 소개해 드릴게요.', ['Le presento al señor Kim.', 'Mire, le presento al señor Kim.']]]
      .forEach(([p, a], i) => put(s, '.w', writeItem({ id: 'a10-' + i, sec: 'a10', skill: 'pre', prompt: p, answers: a })));
    put(s, '.f', freeItem({ id: 'a10-fa', sec: 'a10', rows: 3, prompt: '<b>a) informal</b>', ph: 'A: Mira. Este es mi amigo …\nB: …\nC: …',
      must: [{ re: W0 + 'mira' + W1, label: 'Mira' }, { re: W0 + 'est[ea] es mi amig[oa]' + W1, label: 'Este/Esta es mi amigo/a …' }, { re: W0 + 'mucho gusto' + W1, label: 'Mucho gusto' }, { re: W0 + 'encantad[oa]' + W1, label: 'Encantado / Encantada' }],
      model: 'A: Mira. Este es mi amigo Jaime. B: ¡Hola! Mucho gusto. C: Encantado.' }));
    put(s, '.f', freeItem({ id: 'a10-fb', sec: 'a10', rows: 3, prompt: '<b>b) formal</b>', ph: 'A: Mire. Le presento a la señorita …\nB: …\nC: …',
      must: [{ re: W0 + 'mire' + W1, label: 'Mire' }, { re: W0 + 'le presento a' + W1, label: 'Le presento a …' }, { re: W0 + '(a la se[nñ]orita|al se[nñ]or|a la se[nñ]ora)' + W1, label: 'la señorita / el señor …' }, { re: W0 + '(mucho gusto|encantad[oa])' + W1, label: 'Mucho gusto / Encantado(a)' }],
      model: 'A: Mire. Le presento a la señorita Lee. B: Mucho gusto. C: Encantada.' }));
  };

  /* ---------- Actividad 11 ---------- */
  B.a11 = () => {
    const s = sec('a11', `${actHead(11, 'Presta atención y marca el número que escuches.', { listen: true, kr: '교재 듣기 대본 순서대로 11개의 숫자가 나와요. 🔊를 누르고 들은 숫자를 쓰세요 (아라비아 숫자 또는 단어).' })}
      <p class="small">카드를 누르면 스페인어 이름이 보여요.</p>
      <div class="calg">${NUM.map((w, i) => `<div class="cal ${i === 6 ? 'off' : ''}" data-say="${w}"><b>${i}</b><small>${w}</small></div>`).join('')}</div>
      <h3 class="h3">🎧 들은 순서대로 쓰세요 <button class="btn ghost sm" id="p11">▶ 전체 듣기</button></h3><div class="items two l"></div>
      <h3 class="h3">✍️ 계산해서 스페인어로 쓰세요</h3><div class="items two m"></div>`);
    $$('.cal', s).forEach(c => c.addEventListener('click', () => c.classList.add('on')));
    $('#p11', s).onclick = e => playLines(seq(D.act11), e.currentTarget);
    D.act11.forEach((w, i) => put(s, '.l', writeItem({ id: 'a11-' + i, sec: 'a11', skill: 'num', prompt: `${i + 1}번째 ${say(w)}`, ph: '0~10', answers: [String(NUM.indexOf(w)), w] })));
    [['dos + tres =', 'cinco'], ['diez − cuatro =', 'seis']]
      .forEach(([p, a], i) => put(s, '.m', writeItem({ id: 'a11-m' + i, sec: 'a11', skill: 'num', prompt: p, answers: [a] })));
  };

  /* ---------- Actividad 12 ---------- */
  const VERSO = n => `${n === 1 ? 'Un elefante se balanceaba' : NUM[n].charAt(0).toUpperCase() + NUM[n].slice(1) + ' elefantes se balanceaban'} sobre la tela de una araña. Como ${n === 1 ? 'veía' : 'veían'} que resistía, ${n === 1 ? 'fue' : 'fueron'} a llamar a otro elefante.`;
  B.a12 = () => {
    const s = sec('a12', `${actHead(12, 'Busca en Internet la canción infantil “Un elefante se balanceaba”. ¿Cuál es el número de elefantes al final de la canción?', { kr: '인터넷 검색 대신 노래 가사를 읽고 들으며 풀어요. 코끼리가 한 마리씩 늘어나는 동요예요.' })}
      <div class="web">🐘🕸️ ${VERSO(1)} ${say(VERSO(1))}<br>🐘🐘🕸️ ${VERSO(2)} ${say(VERSO(2))}<br>…</div>
      <h3 class="h3">✍️ 가사 빈칸 채우기</h3><div class="c12"></div>
      <h3 class="h3">✍️ 코끼리는 몇 마리? — 스페인어로 쓰세요</h3><div class="items two w"></div>
      <h3 class="h3">❓ 노래 마지막의 코끼리 수는?</h3><div class="items q"></div>`);
    put(s, '.c12', cloze({ id: 'a12c', sec: 'a12', skill: 'voc', cls: 'lines', text:
      ['[Un] elefante se balanceaba', 'sobre la tela de una [araña].', 'Como veía que resistía,', 'fue a [llamar] a [otro] elefante.'].map(x => `<p>${x}</p>`).join('') }));
    [3, 6, 10].forEach((n, i) => put(s, '.w', writeItem({ id: 'a12-' + i, sec: 'a12', skill: 'num', prompt: `<span class="elef">${'🐘'.repeat(n)}</span>`, ph: '… elefantes',
      answers: [`${NUM[n]} elefantes`, NUM[n], `${NUM[n]} elefantes se balanceaban`] })));
    put(s, '.q', choiceItem({ id: 'a12-q', sec: 'a12', skill: 'num', prompt: '¿Cuál es el número de elefantes al final de la canción?', options: ['Siete', 'Ocho', 'Nueve', 'Diez'], answer: 'Nueve', explain: '교재 정답(SOLUCIONES): <b>Nueve.</b>' }));
  };

  /* ---------- Actividad 13 ---------- */
  B.a13 = () => {
    const s = sec('a13', `${actHead(13, 'Pregunta a tu compañero su número de teléfono y su dirección de e-mail.')}
      <div class="kp-wrap"><div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '@', 0, '.'].map(k => `<button data-say="${typeof k === 'number' ? NUM[k] : k === '@' ? 'arroba' : 'punto'}">${k}<small>${typeof k === 'number' ? NUM[k] : k === '@' ? 'arroba' : 'punto'}</small></button>`).join('')}</div>
        <div class="mailbox"><p>📧 <b>e-mail</b> = correo electrónico</p><p><b>@</b> arroba</p><p><b>.</b> punto</p><p class="small">Mi e-mail es cristina@worldmail.com. ${say('Mi e-mail es cristina arroba worldmail punto com.')}<br>→ cristina <u>arroba</u> worldmail <u>punto</u> com</p>
        <p class="small">전화번호는 숫자를 하나씩 또는 둘씩 읽어요: Mi número de teléfono es <u>el</u> 333-235-8956.</p></div></div>
      <div class="grid2">${modelo('A: ¿Cuál es tu número de teléfono?<br>B: Es el ____________.<br>A: ¿Cuál es tu e-mail?<br>B: Es ____________.', 'a) informal')}${modelo('A: ¿Cuál es su número de teléfono?<br>B: Es el ____________.<br>A: ¿Cuál es su e-mail?<br>B: Es ____________.', 'b) formal')}</div>
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items two q"></div>
      <h3 class="h3">🎧 전화번호 받아쓰기 — 숫자로 쓰세요</h3><div class="items two t"></div>
      <h3 class="h3">✍️ 이메일 주소를 소리 나는 대로 쓰세요</h3><div class="items two e"></div>
      <h3 class="h3">✍️ 내 연락처 대답하기 (가상의 번호도 OK)</h3><div class="items two f"></div>`);
    [['(친구에게) 전화번호가 뭐야?', ['¿Cuál es tu número de teléfono?', '¿Cuál es tu teléfono?']],
      ['(선생님께) 이메일이 어떻게 되세요?', ['¿Cuál es su e-mail?', '¿Cuál es su email?', '¿Cuál es su correo electrónico?']]]
      .forEach(([p, a], i) => put(s, '.q', writeItem({ id: 'a13-q' + i, sec: 'a13', skill: i < 1 ? 'num' : 'int', prompt: p, answers: a })));
    [['333-235-8956', '3332358956'], ['010-4728-3961', '01047283961'], ['645-170-238', '645170238']].forEach(([t, t2], i) => {
      const words = t.replace(/-/g, '').split('').map(d => NUM[+d]).join(', ');
      put(s, '.t', writeItem({ id: 'a13-t' + i, sec: 'a13', skill: 'num', prompt: `📞 ${i + 1}) <button class="btn ghost sm" data-say="${words}">▶ 번호 듣기</button>`, ph: '000-000-0000', answers: [t, t2] }));
    });
    [['juan@mail.com', 'juan arroba mail punto com'], ['ana.ruiz@correo.es', 'ana punto ruiz arroba correo punto es']]
      .forEach(([m, a], i) => put(s, '.e', writeItem({ id: 'a13-e' + i, sec: 'a13', skill: 'num', prompt: `<b style="font-family:'Courier New',monospace">${m}</b>`, answers: [a] })));
    put(s, '.f', freeItem({ id: 'a13-f1', sec: 'a13', line: true, prompt: 'A: ¿Cuál es tu número de teléfono?', ph: 'Es el … / Mi número de teléfono es el …',
      must: [{ re: W0 + '(es el|mi n[uú]mero de tel[eé]fono es el?)' + W1, label: 'Es el … / Mi número de teléfono es el …' }, { re: '\\d', label: '전화번호 숫자', min: 7 }] }));
    put(s, '.f', freeItem({ id: 'a13-f2', sec: 'a13', line: true, prompt: 'A: ¿Cuál es tu e-mail?', ph: 'Es … / Mi e-mail es …',
      must: [{ re: W0 + '(es|mi e-?mail es|mi correo electr[oó]nico es)' + W1, label: 'Es … / Mi e-mail es …' }, { re: '\\S+@\\S+\\.\\S+|arroba', label: '이메일 주소 (@ 또는 arroba)' }] }));
  };

  SC.lesson({
    num: '01',
    title: '¡Hola! ¿Cómo te llamas?',
    ttsTest: '¡Hola! ¿Cómo te llamas? Me llamo Cristina.',
    cover: {
      emoji: '👋😊<br><small>¡Hola!</small>',
      bg: 'linear-gradient(160deg,#fbd38d 0%,#f6a96b 45%,#7b3a26 100%)',
      tema: ['Nombre de las letras del alfabeto', 'Números del 0 al 10'],
      com: ['Saludar', 'Despedirse', 'Preguntar información personal'],
      gram: ['Presente de indicativo: <i>ser, llamarse, escribir, estar</i>', 'Pronombres personales: <i>yo, tú, usted</i>', 'Interrogativos: <i>qué, cómo, cuál</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      J: { name: 'Juan', av: '🧑🏼', side: 'l' }, C: { name: 'Cristina', av: '👩🏻‍🦰', side: 'r' }, F: { name: 'Felipe', av: '👨🏽‍🦱', side: 'l' },
      A: { av: '🧑', side: 'l' }, B: { av: '🧒', side: 'r' }
    },
    errLabels: { conjugacion: '동사 변화 (llamarse · ser · estar)', concordancia: '성·수 일치 (buenos/buenas · este/esta)', pronombre: 'tú / usted · tu / su · me / te / se' },
    errTips: {
      acento: 'tú, cómo, qué, cuál, días, adiós, teléfono, número … 악센트도 철자예요. 시험에서는 감점됩니다.',
      conjugacion: 'llamarse: me llamo · te llamas · se llama / ser: soy · eres · es / estar: estoy · estás · está',
      concordancia: 'Buenos días (남성) · Buenas tardes · Buenas noches (여성) / este es mi amigo · esta es mi amiga',
      pronombre: '친구 → tú · tu · te llamas / 어른 → usted · su · se llama',
      estructura: '"Yo llamo Juan"(✕) → "Me llamo Juan"(○). 이름·번호를 물을 땐 ¿Cuál es …?'
    },
    classify(ti, ta) {
      const V = /^(llam|soy$|eres$|es$|somos$|sois$|son$|est|escrib)/;
      const vi = ti.filter(w => V.test(w)).join(), va = ta.filter(w => V.test(w)).join();
      if (va && vi && vi !== va) return 'conjugacion';
      const G = ['buenos', 'buenas', 'este', 'esta', 'encantado', 'encantada', 'amigo', 'amiga'];
      if (ti.filter(w => G.includes(w)).join() !== ta.filter(w => G.includes(w)).join() && ti.length === ta.length) return 'concordancia';
      const P = ['tu', 'tú', 'su', 'usted', 'te', 'se', 'me', 'le'];
      const pi = ti.filter(w => P.includes(w)); if (pi.length && pi.join() !== ta.filter(w => P.includes(w)).join()) return 'pronombre';
      if (ti[0] !== ta[0] && ['qué', 'que', 'cómo', 'como', 'cuál', 'cual'].includes(ti[0]) && ['qué', 'cómo', 'cuál'].includes(ta[0])) return 'estructura';
      return null;
    },
    errRules: [
      { re: W0 + 'yo llamo' + W1, t: 'estructura', msg: '"Yo llamo"(✕) → "(Yo) me llamo"' },
      { re: W0 + 'mi llamo' + W1, t: 'pronombre', msg: '"mi llamo"(✕) → "me llamo"' },
      { re: W0 + 'me llama' + W1, t: 'conjugacion', msg: '1인칭 → "me llamo"' },
      { re: W0 + 'yo es' + W1, t: 'conjugacion', msg: '"yo es"(✕) → "yo soy"' },
      { re: W0 + 't[uú] es' + W1, t: 'conjugacion', msg: '"tú es"(✕) → "tú eres"' },
      { re: W0 + 'yo est[aá]' + W1, t: 'conjugacion', msg: '"yo está"(✕) → "yo estoy"' },
      { re: W0 + 'buenos (tardes|noches)' + W1, t: 'concordancia', msg: 'tardes · noches 는 여성 → buenas' },
      { re: W0 + 'buenas d[ií]as' + W1, t: 'concordancia', msg: 'días 는 남성 → buenos días' },
      { re: '¿\\s*qu[eé] es tu (nombre|apellido|n[uú]mero|e-?mail|correo)', t: 'estructura', msg: '이름·번호·이메일은 ¿Cuál es …?' },
      { re: '(?<=c[oó]mo )estas' + W1, t: 'acento', msg: '¿Cómo estás?' },
      { re: '(?<=c[oó]mo )esta(?= usted)', t: 'acento', msg: '¿Cómo está usted?' },
      { re: W0 + 'tú (nombre|apellido|n[uú]mero|e-?mail|correo|amig[oa])' + W1, t: 'acento', msg: '"너의"는 악센트 없이 tu' }
    ],
    accWords: ['así', 'perú', 'señorita', 'señor', 'señora', 'garcía', 'lópez', 'méxico', 'márquez', 'dirección'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Cuál es tu número de teléfono?', 'Mi número de teléfono es el 333-235-8956.', 'Mi e-mail es cristina@worldmail.com.', '¡Hola! ¿Qué tal?', 'Muy bien, ¿y tú?', 'Adiós. Hasta mañana.'],
    utilSkill: 'sal',
    proverbio: { es: 'Dime con quién andas y te diré quién eres.', e: '😇🧑😈', answer: '친구를 보면 그 사람을 알 수 있다', options: ['백지장도 맞들면 낫다', '친구를 보면 그 사람을 알 수 있다', '세 살 버릇 여든까지 간다', '말 한마디로 천 냥 빚을 갚는다'], kr: '네가 누구와 다니는지 말해 주면 네가 어떤 사람인지 말해 주겠다 — 사귀는 친구를 보면 그 사람을 알 수 있다는 뜻(근묵자흑 · 유유상종).' },
    exam: {
      bank: D.examBank,
      partB: {
        title: 'Lista de estudiantes → 나를 소개하는 글 쓰기',
        icons: ['👋', '🪪', '📞', '📧'],
        html: `<p class="small">반 학생 명단(Lista de estudiantes)을 만들어요. 친구들이 표를 채울 수 있도록 <b>인사 → 이름 · 두 개의 성(철자) → 전화번호 → 이메일 → 작별 인사</b> 순서로 나를 소개하는 글을 쓰세요.</p>
          <table class="lista"><tr><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Correo electrónico</th></tr>
          <tr><td>Cristina</td><td>López Rivero</td><td>333-235-8956</td><td>cristina@worldmail.com</td></tr><tr><td>Juan</td><td>García Moreno</td><td>…</td><td>…</td></tr><tr><td>(yo)</td><td></td><td></td><td></td></tr></table>`,
        questions: ['¿Cómo te llamas? ¿Cuáles son tus apellidos? ¿Cómo se escriben?', '¿Cuál es tu número de teléfono?', '¿Cuál es tu correo electrónico (e-mail)?'],
        minWords: 35,
        hint: '인사(¡Hola! / Buenos días) · Me llamo · Se escribe · Mi número de teléfono es el … · Mi e-mail es … · 작별 인사를 넣으면 높은 점수!',
        ph: '¡Hola! Buenos días. Me llamo …',
        connectors: ['y', 'pero', 'también', 'bueno', 'entonces', 'o'],
        rubric: [
          { k: 'sal', label: '인사 (¡Hola! · Buenos días …)', max: 6, re: 'hola|buenos d[ií]as|buenas tardes|buenas noches|qu[eé] tal', ax: 'Contenido' },
          { k: 'nom', label: '이름 (Me llamo · Mi nombre es · Soy)', max: 8, re: 'me llamo|mi nombre es|soy', ax: 'Contenido' },
          { k: 'ape', label: '성 (apellido(s))', max: 8, re: 'apellidos?', ax: 'Contenido' },
          { k: 'esc', label: '철자 (Se escribe A-B-C)', max: 8, re: 'se escribe|se deletrea', ax: 'Gramática' },
          { k: 'tel', label: '전화번호 (número de teléfono)', max: 8, re: 'tel[eé]fono', ax: 'Contenido' },
          { k: 'mail', label: '이메일 (e-mail · correo electrónico · arroba)', max: 8, re: 'e-?mail|correo electr[oó]nico|arroba|\\S+@\\S+', ax: 'Contenido' },
          { k: 'num', label: '숫자 단어 3개 이상 (cero … diez)', max: 8, min: 3, re: 'cero|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez', ax: 'Gramática' },
          { k: 'des', label: '작별 인사 (Adiós · Hasta luego …)', max: 6, re: 'adi[oó]s|hasta luego|hasta ma[nñ]ana|chao|nos vemos', ax: 'Contenido' }
        ],
        model: '¡Hola! Buenos días. Me llamo Minsu. Mi apellido es Kim. Se escribe K-I-M. Mi nombre completo es Minsu Kim Lee. Soy estudiante de esta escuela. Mi número de teléfono es el 010-4728-3961: cero, uno, cero, cuatro, siete, dos, ocho. Mi e-mail es minsu@correo.com, minsu arroba correo punto com. Bueno, ¡hasta luego!'
      }
    },
    build: B
  });
})();
