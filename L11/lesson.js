/* Lección 11 · ¿Cómo quedamos? — 레슨 파일 (공통 엔진 SC 사용) */
(function () {
  'use strict';
  const { $, $$, el, esc, shuffle, say, reg, record, save, sel, sec, put, writeItem, freeItem, cloze, choiceItem, scramble, pairMatch, sortBoard,
    flipGrid, actHead, dlgHead, modelo, tip, notice, acc, W0, W1, playLines, dialogHTML, dclock, MARK } = SC;

  /* Lección 11 · ¿Cómo quedamos? — 학습 데이터 */
  const D = {
    skills: {
      voc: 'Vocabulario 어휘',
      inv: 'Invitar 초대·약속',
      qp: 'Querer·Poder 원하다·할 수 있다',
      pre: 'Pretérito 규칙 과거',
      irr: 'Irregulares 불규칙 과거',
      tie: 'Tiempo 때·시간 표현',
      lib: 'Escritura libre 자유작문'
    },

    sections: [
      { id: 'inicio', label: 'Portada', kr: '표지 · 학습목표', group: '' },
      { id: 'vocab', label: 'Antes de empezar', kr: '스페인의 생활 · 어휘', group: 'Introducción' },
      { id: 'gram', label: 'Gramática', kr: '문법 정리', group: 'Introducción' },
      { id: 'd1', label: 'Diálogo 1', kr: '마누엘과 베아트리스', group: 'Diálogo 1', kind: 'dialogo' },
      { id: 'a1', label: 'Actividad 1', kr: '초대 쪽지와 답장', group: 'Diálogo 1', kind: 'act', n: 1 },
      { id: 'a2', label: 'Actividad 2', kr: '대화 순서 맞추기', group: 'Diálogo 1', kind: 'act', n: 2 },
      { id: 'a3', label: 'Actividad 3', kr: '지난 주말에 뭐 했어?', group: 'Diálogo 1', kind: 'act', n: 3 },
      { id: 'a4', label: 'Actividad 4', kr: '¿Por qué no …? 초대하기', group: 'Diálogo 1', kind: 'act', n: 4 },
      { id: 'a5', label: 'Actividad 5', kr: '가족 여행 이야기', group: 'Diálogo 1', kind: 'act', n: 5 },
      { id: 'a6', label: 'Actividad 6', kr: '라우라의 지난 주말', group: 'Diálogo 1', kind: 'act', n: 6 },
      { id: 'd2', label: 'Diálogo 2', kr: '아나와 후안', group: 'Diálogo 2', kind: 'dialogo' },
      { id: 'a7', label: 'Actividad 7', kr: '마르셀라의 다이어리', group: 'Diálogo 2', kind: 'act', n: 7 },
      { id: 'a8', label: 'Actividad 8', kr: '마르타의 페루 여행', group: 'Diálogo 2', kind: 'act', n: 8 },
      { id: 'a9', label: 'Actividad 9', kr: '과거의 때 표현', group: 'Diálogo 2', kind: 'act', n: 9 },
      { id: 'a10', label: 'Actividad 10', kr: '올가의 어제 하루', group: 'Diálogo 2', kind: 'act', n: 10 },
      { id: 'a11', label: 'Actividad 11', kr: '응급실에 간 적 있어?', group: 'Diálogo 2', kind: 'act', n: 11 },
      { id: 'util', label: 'Expresiones útiles', kr: '유용한 표현 · 속담', group: 'Repaso' },
      { id: 'examen', label: '¡Compruébalo!', kr: '쓰기 모의시험', group: 'Repaso' },
      { id: 'resultados', label: 'Resultados', kr: '나의 성적표', group: 'Repaso' }
    ],

    vocab: [
      { es: 'ver el partido de fútbol', kr: '축구 경기를 보다', e: '⚽' },
      { es: 'la vida familiar', kr: '가족 생활', e: '👨‍👩‍👧‍👦' },
      { es: 'la vida en la calle', kr: '거리의 생활', e: '🚶‍♀️' },
      { es: 'la siesta', kr: '낮잠', e: '😴' },
      { es: 'el horario', kr: '영업시간 · 시간표', e: '🕘' },
      { es: 'ir de tapas', kr: '타파스 먹으러 가다', e: '🍢' },
      { es: 'el estreno', kr: '(영화) 개봉 · 첫 상영', e: '🎬' },
      { es: 'la entrada', kr: '입장권 · 입구', e: '🎟️' },
      { es: 'el concierto', kr: '콘서트', e: '🎤' },
      { es: 'la exposición', kr: '전시회', e: '🖼️' },
      { es: 'la boca del metro', kr: '지하철 출입구', e: '🚇' },
      { es: 'el compromiso', kr: '선약 · 약속', e: '📌' }
    ],

    dialogo1: [
      { who: 'M', es: '¡Hola, Beatriz! ¿[Qué tal]? Soy Manuel.' },
      { who: 'B', es: '¡Hola, Manuel! Muy bien. ¿Cómo estás? ¿Bien?' },
      { who: 'M', es: 'Bien, bien. Beatriz, mira, ¿[por qué no] vamos al cine esta tarde?' },
      { who: 'B', es: '¿Al cine? [Lo siento], no puedo. Es que ayer [dormí] muy poco. Estoy muy cansada. Necesito descansar.' },
      { who: 'M', es: 'Pues ¿qué tal mañana por la tarde?' },
      { who: 'B', es: 'Está bien. ¿[Cómo quedamos], entonces?' },
      { who: 'M', es: 'A las siete [en la boca] del metro. La película empieza a las siete y cuarto.' },
      { who: 'B', es: 'Muy bien. [Nos vemos] mañana.' }
    ],

    /* Actividad 2 — TRANSCRIPCIONES */
    dialogo_a2: [
      { who: 'A', es: 'Oye, ¿nos vemos mañana por la tarde?' },
      { who: 'B2', es: 'Vale. De acuerdo. ¿Y qué podemos hacer? ¿Hay algo interesante?' },
      { who: 'A', es: 'Pues mira, hay una exposición de Miró en el Reina Sofía.' },
      { who: 'B2', es: '¡Ah! Muy bien. Me encanta Miró. ¿Cómo quedamos?' },
      { who: 'A', es: 'No sé... Podemos quedar a las cinco en la puerta.' },
      { who: 'B2', es: 'Es que no me va bien tan pronto. ¿Qué te parece a las seis?' },
      { who: 'A', es: 'Vale. Entonces quedamos a las seis.' },
      { who: 'B2', es: 'Está bien. Nos vemos entonces.' }
    ],

    dialogo2: [
      { who: 'Ana', es: '¿Qué tal la excursión de ayer?' },
      { who: 'Juan', es: 'Muy bien. Fuimos a los Picos de Europa.' },
      { who: 'Ana', es: '¿Y te gustó?' },
      { who: 'Juan', es: 'Sí, mucho. Vimos muchos animales e [hice] muchas fotos.' },
      { who: 'Ana', es: 'Y ¿dónde comisteis?' },
      { who: 'Juan', es: 'En un restaurante asturiano muy famoso.' },
      { who: 'Ana', es: 'Y por la tarde, ¿qué hicisteis?' },
      { who: 'Juan', es: 'Fuimos a Oviedo y visitamos la ciudad. [Me gustó mucho] la Catedral.' }
    ],

    /* Actividad 8 — TRANSCRIPCIONES */
    dialogo_a8: [
      { who: 'Amigo', es: '¡Hola, Marta! ¿Cuándo has vuelto?' },
      { who: 'Marta', es: 'Esta mañana he vuelto de mi viaje a Machu Picchu.' },
      { who: 'Amigo', es: '¿Y qué tal?' },
      { who: 'Marta', es: 'Muy bien. El viernes estuve en Machu Picchu y me gustó mucho. También me gustaron los monumentos. ¡Qué bonitos!' },
      { who: 'Amigo', es: 'La gente, ¿cómo es?' },
      { who: 'Marta', es: 'Me gustó mucho la gente. Los peruanos son simpáticos y agradables.' },
      { who: 'Amigo', es: '¿Dónde te has alojado?' },
      { who: 'Marta', es: 'Estuve en un hotel fantástico. La verdad es que me ha encantado el hotel. También me ha gustado mucho la comida peruana que nos han puesto.' },
      { who: 'Amigo', es: '¿Cómo fuiste allí desde Cuzco?' },
      { who: 'Marta', es: 'En tren. Me ha gustado mucho el tren.' },
      { who: 'Amigo', es: 'Vamos... que tu viaje ha sido todo un éxito.' },
      { who: 'Marta', es: 'Indudablemente.' }
    ],

    utiles: [
      ['¿Quieres venir al cine esta noche?', '오늘 밤 영화관에 올래?'],
      ['Lo siento, pero no puedo. Es que tengo que estudiar / tengo un compromiso.', '미안하지만 못 가. 공부해야 하거든 / 선약이 있거든.'],
      ['¿Cómo quedamos?', '어떻게(언제·어디서) 만날까?'],
      ['Podemos quedar a las ocho en la puerta del cine.', '8시에 영화관 입구에서 만나면 돼.'],
      ['¿Qué te parece a las nueve?', '9시는 어때?'],
      ['Muy bien. / Vale. / De acuerdo.', '아주 좋아. / 좋아. / 그래.'],
      ['No me va bien (a esa hora).', '(그 시간은) 나한테 안 맞아.'],
      ['Nació en 1975.', '그(그녀)는 1975년에 태어났다.'],
      ['Volví a casa por la tarde.', '나는 오후에 집에 돌아왔다.'],
      ['Empecé a trabajar a las 7.', '나는 7시에 일을 시작했다.']
    ],

    /* 쓰기 모의시험 Parte A 문제은행 */
    examBank: [
      { p: 'Ayer yo ____ al cine con Ana. <i>(ir)</i>', a: ['fui'], s: 'irr' },
      { p: '¿Qué ____ tú el fin de semana pasado? <i>(hacer)</i>', a: ['hiciste'], s: 'irr' },
      { p: 'Marcela ____ la compra el jueves por la tarde. <i>(hacer)</i>', a: ['hizo'], s: 'irr' },
      { p: 'Ayer yo ____ tarde a clase. <i>(llegar)</i>', a: ['llegué'], s: 'irr' },
      { p: 'Mis padres ____ a Perú en agosto. <i>(ir)</i>', a: ['fueron'], s: 'irr' },
      { p: 'Yo ____ muchas fotos en la excursión. <i>(sacar)</i>', a: ['saqué'], s: 'irr' },
      { p: 'Por la tarde nosotros ____ la ciudad. <i>(visitar)</i>', a: ['visitamos'], s: 'pre' },
      { p: 'Y ¿dónde ____ vosotros? <i>(comer)</i>', a: ['comisteis'], s: 'pre' },
      { p: 'Olga ____ con su familia a las nueve. <i>(cenar)</i>', a: ['cenó'], s: 'pre' },
      { p: 'Anoche (yo) ____ muy poco. Estoy cansada. <i>(dormir)</i>', a: ['dormí'], s: 'pre' },
      { p: 'Yo ____ en 2012. <i>(nacer)</i>', a: ['nací'], s: 'pre' },
      { p: 'Ayer (yo) me ____ en casa todo el día. <i>(quedarse)</i>', a: ['quedé'], s: 'pre' },
      { p: '¿____ venir al cine esta noche? <i>(querer, tú)</i>', a: ['quieres'], s: 'qp' },
      { p: 'Lo siento, no ____. Tengo un compromiso. <i>(poder, yo)</i>', a: ['puedo'], s: 'qp' },
      { p: '____ quedar a las cinco en la puerta. <i>(poder, nosotros)</i>', a: ['podemos'], s: 'qp' },
      { p: '¿Por qué no ____ al cine esta tarde? <i>(ir, nosotros)</i>', a: ['vamos'], s: 'inv' },
      { p: '¿Qué te ____ a las nueve? <i>(parecer)</i>', a: ['parece'], s: 'inv' },
      { p: 'Es que no me ____ bien a esa hora. <i>(ir)</i>', a: ['va'], s: 'inv' },
      { p: 'Viajé a México ____ cinco años. <i>(~전에)</i>', a: ['hace'], s: 'tie' },
      { p: '____ salí con mis amigos. <i>(어젯밤)</i>', a: ['anoche'], s: 'tie' }
    ]
  };

  const B = {};
  const blurBtn = (s, btn, box, a, b) => { $(btn, s).onclick = e => { const t = $(box, s); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? a : b; }; };
  /* 주어·때 표현을 붙이거나 빼도 정답이 되도록 변형 만들기 */
  const vars = (cores, subj = [], pre = []) => {
    const out = [];
    cores.forEach(c => {
      out.push(c);
      subj.forEach(s => out.push(`${s} ${c}`));
      pre.forEach(p => { out.push(`${p} ${c}`); subj.forEach(s => out.push(`${p} ${s} ${c}`)); });
    });
    return out.map(x => x.trim() + '.');
  };
  const PAST1 = W0 + '(\\p{L}{2,}(é|í)|fui|hice|vi|estuve|tuve|di|me ca[ií]|pude|quise)' + W1;

  B.vocab = () => {
    const txt = 'En España se hace mucha vida en la calle. Los españoles son muy de salir con su familia o sus amigos a las terrazas, de tapas, a pasear, de tiendas, etc. España es un país con mucha vida: tiendas abiertas hasta tarde, gente en la calle a todas horas, bares y restaurantes con amplios horarios. Además, a muchos españoles les gustan el fútbol y la siesta.';
    const s = sec('vocab', `<div class="ribbon-head"><span class="ribbon">Antes de empezar</span><span class="act-bar y"></span></div>
      <p class="lead"><b>¿Cómo es la vida en España?</b><br>${txt} ${say('¿Cómo es la vida en España? ' + txt)}</p>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">② 카드를 눌러 뜻을 확인하세요</h3><div class="fgw"></div>
      <h3 class="h3">③ 쓰기 연습 — 그림과 뜻을 보고 스페인어로 쓰세요</h3><div class="items two wv"></div>
      <h3 class="h3">④ el horario — 영업시간 안내판 읽기</h3>
      <div class="hor-wrap"><div class="horario"><div class="hz-t">HORARIO</div><div class="hz-d">LUNES a VIERNES</div>
        <div class="hz-r"><span>8:00</span> a <span>13:00</span> <span>14:00</span> a <span>18:00</span></div>
        <div class="hz-s"><b>SÁBADOS</b><span></span> a <span></span></div><div class="hz-s"><b>DOMINGOS</b><span></span> a <span></span></div></div>
        <div class="items hz"></div></div>`);
    [['En España se hace poca vida en la calle.', 'Falso'], ['Los españoles son muy de salir con su familia o sus amigos.', 'Verdadero'],
      ['A muchos españoles les gustan el fútbol y la siesta.', 'Verdadero']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'v-vf' + i, sec: 'vocab', skill: 'voc', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    put(s, '.fgw', flipGrid(D.vocab));
    D.vocab.slice(0, 8).forEach((a, i) => put(s, '.wv', writeItem({ id: 'voc-' + i, sec: 'vocab', skill: 'voc', prompt: `<span class="emo-sm">${a.e}</span> ${a.kr}`, answers: [a.es] })));
    put(s, '.hz', writeItem({ id: 'v-h0', sec: 'vocab', skill: 'tie', prompt: '평일 영업시간을 스페인어로 쓰세요. <span class="small">De lunes a viernes, de … a … y de … a …</span>', ph: 'De lunes a viernes, de ocho a …',
      answers: ['De lunes a viernes, de ocho a una y de dos a seis.', 'De ocho a una y de dos a seis.', 'De lunes a viernes, de 8:00 a 13:00 y de 14:00 a 18:00.', 'De 8:00 a 13:00 y de 14:00 a 18:00.', 'De lunes a viernes, de ocho a trece y de catorce a dieciocho.'] }));
    put(s, '.hz', writeItem({ id: 'v-h1', sec: 'vocab', skill: 'tie', prompt: '점심시간 — ¿A qué hora cierra a mediodía?', ph: 'A la …', answers: ['A la una.', 'Cierra a la una.', 'A las trece.', 'A las 13:00.'] }));
  };

  B.gram = () => {
    const s = sec('gram', `<div class="ribbon-head"><span class="ribbon red">Gramática</span><span class="act-bar"></span></div>
      <div class="gcard"><h3>1. querer · poder + 동사원형</h3>
        <div class="blocks"><span class="bk p">¿Quieres</span><span class="bk v">venir</span><span class="bk s">al cine esta noche?</span><span class="small">~하고 싶니? (초대)</span></div>
        <div class="blocks"><span class="bk p">(No) puedo</span><span class="bk v">ir</span><span class="bk s">contigo.</span><span class="small">~할 수 있다 / 없다</span></div>
        <div class="legend-mini"><span class="bk p">querer · poder (변화)</span><span class="bk v">동사원형</span><span class="bk s">나머지</span></div>
        <div class="grid2 qpb"><div><b class="bt">querer (e → ie)</b><div class="g1a"></div></div><div><b class="bt">poder (o → ue)</b><div class="g1b"></div></div></div>
        ${tip('👢 <b>부츠 모양</b>: nosotros · vosotros 만 원래 모음 그대로 — quere<b>mos</b>, pode<b>mos</b>.<br><b>Podemos quedar</b> a las cinco. = 5시에 만나면 돼. (제안)')}
        <div class="items g1c"></div></div>
      <div class="gcard"><h3>2. 전화 걸기 (Una conversación telefónica)</h3>
        <table class="dt"><tr><th>받는 사람</th><td>¿Diga? / ¿Dígame? / ¿Sí? ${say('¿Diga? ¿Dígame? ¿Sí?')}</td></tr>
          <tr><th>거는 사람</th><td>¡Hola, Beatriz! ¿Qué tal? <b>Soy</b> Manuel. ${say('¡Hola, Beatriz! ¿Qué tal? Soy Manuel.')}</td></tr>
          <tr><th>끊을 때</th><td>Muy bien. Nos vemos mañana. / Hasta luego. ${say('Muy bien. Nos vemos mañana.')}</td></tr></table>
        ${tip('전화에서 "나 ○○야"는 <b>Soy</b> + 이름 (Me llamo ✕).')}
        <div class="items g2"></div></div>
      <div class="gcard"><h3>3. 초대하기 · 받아들이기 · 거절하기</h3>
        <table class="dt inv3"><tr><th>💌 Invitar</th><th>👍 Aceptar</th><th>🙅 Rechazar</th></tr>
          <tr><td>¿Por qué no vamos al cine?<br>¿Quieres venir a …?<br>¿Vamos a bailar?</td><td>Vale. / De acuerdo.<br>Muy bien. / ¡Genial!<br>Está bien.</td><td>Lo siento, (pero) no puedo.<br><b>Es que</b> tengo un compromiso.<br>No me va bien (a esa hora).</td></tr>
          <tr><th colspan="3">🤝 약속 정하기 — ¿Cómo quedamos? → Podemos quedar a las ocho en la puerta. → ¿Qué te parece a las nueve? → Vale, quedamos a las nueve.</th></tr></table>
        ${tip('<b>Es que …</b> = "그게 말이야, …라서" — 거절할 때 이유를 부드럽게 말해요.')}
        <div class="g3"></div></div>
      <div class="gcard"><h3>4. 단순 과거 (Pretérito indefinido) — 규칙 동사</h3>
        <p class="small">끝난 과거의 일: ayer, anoche, el fin de semana pasado, hace cinco años … 와 함께 써요.</p>
        <div class="g4a"></div>
        ${tip('악센트가 뜻을 바꿔요! <b>hablo</b> (나는 말한다) ↔ <b>habló</b> (그가 말했다). / -ar · -ir 동사의 nosotros 는 현재와 모양이 같아요 (hablamos, vivimos).')}
        <div class="g4b"></div></div>
      <div class="gcard"><h3>5. 불규칙 과거 — ir · hacer · llegar</h3>
        <div class="g5a"></div>
        ${tip('ir 와 ser 의 과거는 똑같아요 (fui, fuiste, fue …). <b>fui · fue · hice · hizo</b> 에는 악센트가 없어요!<br>철자 변화(yo): lle<b>gu</b>é · ju<b>gu</b>é · sa<b>qu</b>é · empe<b>c</b>é — 발음을 지키려고 철자가 바뀌어요.')}
        <div class="g5b"></div><div class="items g5c"></div></div>
      <div class="gcard"><h3>6. 과거의 때 표현 (Marcadores temporales)</h3>
        <div class="tline">${[['hace cinco años', '5년 전'], ['el año pasado', '작년'], ['el mes pasado', '지난달'], ['la semana pasada', '지난주'], ['el fin de semana pasado', '지난 주말'], ['anteayer', '그저께'], ['ayer', '어제'], ['anoche', '어젯밤'], ['HOY', '오늘']]
          .map(([e, k], i, a) => `<div class="tl-it ${i === a.length - 1 ? 'now' : ''}"><i></i><b>${e}</b><small>${k}</small></div>`).join('')}</div>
        <div class="items g6"></div></div>`);
    const boot = (id, rows) => cloze({ id, sec: 'gram', skill: 'qp', cls: 'boot', text: rows.map(([p, f, b]) => `<p class="${b ? 'in' : 'out'}"><span>${p}</span>[${f}]</p>`).join('') });
    const P6 = ['yo', 'tú', 'él / ella / usted', 'nosotros/as', 'vosotros/as', 'ellos / ellas / ustedes'];
    put(s, '.g1a', boot('g1a', ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'].map((f, i) => [P6[i], f, i < 3 || i === 5])));
    put(s, '.g1b', boot('g1b', ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'].map((f, i) => [P6[i], f, i < 3 || i === 5])));
    [['오늘 밤 영화관에 올래? <span class="small">(querer, venir)</span>', ['¿Quieres venir al cine esta noche?']],
      ['미안, 못 가. 공부해야 하거든. <span class="small">(poder · es que · tener que)</span>', ['Lo siento, no puedo. Es que tengo que estudiar.', 'Lo siento, pero no puedo. Es que tengo que estudiar.']],
      ['우리 5시에 만나면 돼. <span class="small">(poder, quedar)</span>', ['Podemos quedar a las cinco.']]]
      .forEach(([p, a], i) => put(s, '.g1c', writeItem({ id: 'g1c-' + i, sec: 'gram', skill: 'qp', prompt: p, answers: a })));
    [['여보세요? <span class="small">(전화를 받을 때)</span>', ['¿Diga?', '¿Dígame?', '¿Sí?', '¿Aló?']],
      ['안녕, 베아트리스! 잘 지내? 나 마누엘이야.', ['¡Hola, Beatriz! ¿Qué tal? Soy Manuel.', '¡Hola, Beatriz! ¿Cómo estás? Soy Manuel.']]]
      .forEach(([p, a], i) => put(s, '.g2', writeItem({ id: 'g2-' + i, sec: 'gram', skill: 'inv', prompt: p, answers: a })));
    put(s, '.g3', sortBoard({ id: 'g3', sec: 'gram', skill: 'inv', title: '표현을 누른 뒤 알맞은 칸을 누르세요.',
      cols: [{ k: 'i', label: '💌 Invitar 초대' }, { k: 'a', label: '👍 Aceptar 수락' }, { k: 'r', label: '🙅 Rechazar 거절' }],
      chips: [['¿Por qué no vamos al cine?', 'i'], ['¿Quieres venir a la fiesta?', 'i'], ['Vale, de acuerdo.', 'a'], ['¡Genial! Nos vemos el lunes.', 'a'],
        ['Lo siento, no puedo.', 'r'], ['Es que tengo un compromiso.', 'r']] }));
    const R = [['yo', 'hablé', 'comí', 'viví'], ['tú', 'hablaste', 'comiste', 'viviste'], ['él / ella / usted', 'habló', 'comió', 'vivió'],
      ['nosotros/as', 'hablamos', 'comimos', 'vivimos'], ['vosotros/as', 'hablasteis', 'comisteis', 'vivisteis'], ['ellos / ellas / ustedes', 'hablaron', 'comieron', 'vivieron']];
    put(s, '.g4a', cloze({ id: 'g4a', sec: 'gram', skill: 'pre', title: '빈칸을 채워 표를 완성하세요.', text:
      `<table class="dt pret"><tr><th></th><th>hablar (-ar)</th><th>comer (-er)</th><th>vivir (-ir)</th></tr>${R.map((r, i) => `<tr><td>${r[0]}</td>${r.slice(1).map(f => `<td>${[1, 2, 5].includes(i) ? `[${f}]` : `<b>${f}</b>`}</td>`).join('')}</tr>`).join('')}</table>` }));
    put(s, '.g4b', cloze({ id: 'g4b', sec: 'gram', skill: 'pre', cls: 'lines', title: '( ) 안의 동사를 과거형으로 쓰세요.', text:
      ['Ayer (yo) [dormí] muy poco. <i>(dormir)</i>', 'Juan [visitó] la Catedral. <i>(visitar)</i>', '¿Dónde [comisteis] vosotros? <i>(comer)</i>',
        'Mis abuelos [nacieron] en 1950. <i>(nacer)</i>', '¿A qué hora [volviste] a casa? <i>(volver, tú)</i>'].map(x => `<p>${x}</p>`).join('') }));
    const IR = ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'], HA = ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'];
    put(s, '.g5a', cloze({ id: 'g5a', sec: 'gram', skill: 'irr', title: 'ir · hacer 과거형 표를 완성하세요.', text:
      `<table class="dt pret"><tr><th></th><th>ir (가다)</th><th>hacer (하다)</th></tr>${P6.map((p, i) => `<tr><td>${p}</td><td>${[1, 2, 5].includes(i) ? `[${IR[i]}]` : `<b>${IR[i]}</b>`}</td><td>${[1, 2, 5].includes(i) ? `[${HA[i]}]` : `<b>${HA[i]}</b>`}</td></tr>`).join('')}</table>` }));
    put(s, '.g5b', cloze({ id: 'g5b', sec: 'gram', skill: 'irr', cls: 'lines', title: 'yo 형태를 쓰세요.', text:
      [['llegar', 'llegué'], ['jugar', 'jugué'], ['sacar', 'saqué'], ['empezar', 'empecé']].map(([a, b]) => `<p>${a} → (yo) [${b}]</p>`).join('') }));
    [['어제 나는 늦게 도착했다.', ['Ayer llegué tarde.', 'Llegué tarde ayer.']], ['너 지난 주말에 뭐 했어?', ['¿Qué hiciste el fin de semana pasado?']],
      ['마르셀라는 장을 봤다. <span class="small">(hacer la compra)</span>', ['Marcela hizo la compra.']]]
      .forEach(([p, a], i) => put(s, '.g5c', writeItem({ id: 'g5c-' + i, sec: 'gram', skill: 'irr', prompt: p, answers: a })));
    [['어젯밤 나는 영화관에 갔다.', ['Anoche fui al cine.', 'Fui al cine anoche.']], ['지난주에 나는 테니스를 쳤다.', ['La semana pasada jugué al tenis.', 'Jugué al tenis la semana pasada.']],
      ['5년 전에 나는 스페인을 여행했다.', ['Hace cinco años viajé a España.', 'Viajé a España hace cinco años.', 'Hace cinco años viajé por España.', 'Viajé por España hace cinco años.']]]
      .forEach(([p, a], i) => put(s, '.g6', writeItem({ id: 'g6-' + i, sec: 'gram', skill: 'tie', prompt: p, answers: a })));
  };

  B.d1 = () => {
    const s = sec('d1', `${dlgHead(1, 'Manuel llama por teléfono a Beatriz.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play1">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide1">본문 가리기</button></h3>
      <div id="d1txt" class="phone">${dialogHTML(D.dialogo1, 'comic')}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 본문을 가리고 핵심 표현을 쓰세요</h3><div class="d1c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">¿Cómo estás?</span><span class="hlc c1">Vamos al cine esta tarde</span><span class="hlc c2">La verdad es que</span><span class="hlc c0">en la entrada</span></div>
      <div class="items d1b"></div>
      <h3 class="h3">c) 나만의 전화 대화 쓰기</h3><div class="d1f"></div>`);
    $('#play1', s).onclick = e => playLines(D.dialogo1, e.currentTarget);
    blurBtn(s, '#hide1', '#d1txt', '본문 보기', '본문 가리기');
    put(s, '.d1c', cloze({ id: 'd1c', sec: 'd1', skill: 'inv', cls: 'lines', text: SC.clozeFromDialog(D.dialogo1) }));
    [['Beatriz va al cine esta tarde.', 'Falso'], ['Beatriz está muy cansada porque ayer durmió muy poco.', 'Verdadero'],
      ['Quedan mañana a las siete en la boca del metro.', 'Verdadero'], ['La película empieza a las siete.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd1-vf' + i, sec: 'd1', skill: 'inv', prompt: p, options: ['Verdadero', 'Falso'], answer: a, explain: i === 3 ? 'La película empieza a las siete y cuarto (7:15).' : '' })));
    [['¡Hola, Beatriz! <u>¿Qué tal?</u> Soy Manuel. → <span class="chip">¿Cómo estás?</span>', ['¡Hola, Beatriz! ¿Cómo estás? Soy Manuel.']],
      ['Beatriz, mira, <u>¿por qué no vamos al cine esta tarde?</u> → <span class="chip">Vamos al cine esta tarde</span>', ['Beatriz, mira, vamos al cine esta tarde.', 'Beatriz, mira, ¿vamos al cine esta tarde?', 'Vamos al cine esta tarde.']],
      ['Lo siento, no puedo. <u>Es que</u> ayer dormí muy poco. → <span class="chip">La verdad es que</span>', ['Lo siento, no puedo. La verdad es que ayer dormí muy poco.']],
      ['A las siete <u>en la boca</u> del metro. → <span class="chip">en la entrada</span>', ['A las siete en la entrada del metro.']]]
      .forEach(([p, a], i) => put(s, '.d1b', writeItem({ id: 'd1b-' + i, sec: 'd1', skill: 'inv', prompt: p, answers: a })));
    put(s, '.d1f', freeItem({ id: 'd1f', sec: 'd1', rows: 7, prompt: '친구에게 전화해서 초대하고, 한 번 거절당한 뒤 다른 날로 약속을 정하는 대화를 6~8줄로 쓰세요. (A: … / B: …)',
      ph: 'A: ¡Hola, …! ¿Qué tal? Soy …\nB: …',
      must: [{ re: W0 + 'soy' + W1, label: '전화 인사 — Soy …' }, { re: '(por qu[eé] no|quieres|vamos a|¿vamos)', label: '초대 (¿Por qué no …? / ¿Quieres …?)' },
        { re: '(lo siento|no puedo)', label: '거절 (Lo siento, no puedo)' }, { re: W0 + 'es que' + W1, label: 'Es que … (이유)' },
        { re: 'c[oó]mo quedamos', label: '¿Cómo quedamos?' }, { re: W0 + 'a las? (\\d+|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)' + W1, label: '시간 (a las …)' }],
      model: 'A: ¡Hola, Sara! ¿Qué tal? Soy Minho. B: ¡Hola, Minho! Muy bien. A: ¿Por qué no vamos al concierto esta noche? B: Lo siento, no puedo. Es que tengo que estudiar. A: Pues ¿qué tal el sábado? B: Vale. ¿Cómo quedamos? A: A las seis en la puerta del teatro. B: Muy bien. Nos vemos el sábado.' }));
  };

  const NOTES_L = ['¿Vamos a bailar el viernes por la noche?<br>Espero tu respuesta.<br>Un beso', '¿Quieres venir al estreno de una película de Pedro Almodóvar?<br>Es el lunes a las diez en el Fuencarral. Dímelo pronto.', 'Tengo entradas para el concierto de La Oreja de Van Gogh, el viernes. ¿Quieres venir?<br>Llámame.'];
  const NOTES_R = ['De acuerdo, vamos a bailar el viernes. Te llamo para quedar.<br>Juan', 'Vale. Me gustan las películas de Almodóvar. Nos vemos el lunes.', 'No puedo ir contigo al concierto. Tengo un compromiso.'];
  B.a1 = () => {
    const s = sec('a1', `${actHead(1, 'Lee estas invitaciones y estas respuestas. Luego emparéjalas y practica con tu compañero.')}
      <div class="postits"><div class="pcol">${NOTES_L.map((n, i) => `<div class="postit c${i}"><b>${i + 1})</b> ${n}</div>`).join('')}</div>
        <div class="pcol">${['a', 'b', 'c'].map((k, i) => `<div class="postit r${i}"><b>${k}.</b> ${[NOTES_R[2], NOTES_R[1], NOTES_R[0]][i]}</div>`).join('')}</div></div>
      <div class="pm1"></div>
      <h3 class="h3">✍️ 내가 답장 쓰기 — 지시대로 답하세요</h3><div class="items rp"></div>
      <h3 class="h3">✍️ 나의 초대 쪽지 쓰기</h3><div class="mine"></div>`);
    put(s, '.pm1', pairMatch({ id: 'a1-m', sec: 'a1', skill: 'inv', title: '초대 쪽지와 답장을 연결하세요.', pairs: NOTES_L.map((n, i) => [n.replace(/<br>/g, ' '), NOTES_R[i].replace(/<br>/g, ' ')]) }));
    const W = [['1) 춤추러 가자는 초대 → <b>수락</b>하고 "전화할게"', [{ re: '(vale|de acuerdo|muy bien|genial|est[aá] bien|s[ií])', label: '수락 (Vale / De acuerdo …)' }, { re: 'te llamo', label: 'Te llamo …' }], 'Vale, de acuerdo. Te llamo para quedar.'],
      ['2) 알모도바르 영화 시사회 초대 → <b>거절</b>하고 이유 말하기', [{ re: '(lo siento|no puedo)', label: '거절 (Lo siento, no puedo)' }, { re: W0 + '(es que|porque)' + W1, label: '이유 (Es que … / porque …)' }], 'Lo siento, pero no puedo. Es que el lunes tengo un examen.'],
      ['3) 콘서트 초대 → <b>수락</b>하고 약속 정하기 (¿Cómo quedamos?)', [{ re: '(vale|de acuerdo|muy bien|genial|me encanta)', label: '수락' }, { re: 'c[oó]mo quedamos', label: '¿Cómo quedamos?' }], '¡Genial! Me encanta La Oreja de Van Gogh. ¿Cómo quedamos?']];
    W.forEach(([p, m, mo], i) => put(s, '.rp', freeItem({ id: 'a1-w' + i, sec: 'a1', skill: 'inv', line: true, prompt: p, must: m, model: mo })));
    put(s, '.mine', freeItem({ id: 'a1-f', sec: 'a1', rows: 4, prompt: '친구를 초대하는 쪽지를 쓰세요. (무엇 · 언제 · 어디서 + 답을 달라는 말)',
      ph: '¿Quieres venir a …? Es el … a las … en …', must: [{ re: '(quieres|por qu[eé] no|¿vamos|vamos a)', label: '초대 표현' },
        { re: W0 + '(el )?(lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo|ma[nñ]ana|esta (tarde|noche))' + W1, label: '언제 (el viernes, esta noche …)' },
        { re: W0 + 'a las? ' , label: '시간 (a las …)' }, { re: '(ll[aá]mame|d[ií]melo|espero tu respuesta|esc[ií]beme)', label: '답 요청 (Llámame / Dímelo pronto …)' }],
      model: '¿Quieres venir a la exposición de Miró? Es el sábado a las cinco en el Reina Sofía. Llámame.' }));
  };

  const A2 = ['Vale. De acuerdo. ¿Y qué podemos hacer? ¿Hay algo interesante?', 'Pues mira, hay una exposición de Miró en el Reina Sofía.', 'Es que no me va bien tan pronto. ¿Qué te parece a las seis?',
    '¡Ah! Muy bien. Me encanta Miró. ¿Cómo quedamos?', 'Oye, ¿nos vemos mañana por la tarde?', 'Vale. Entonces quedamos a las seis.', 'Está bien. Nos vemos entonces.', 'No sé... Podemos quedar a las cinco en la puerta.'];
  const A2_ORD = [5, 1, 2, 4, 8, 3, 6, 7];
  B.a2 = () => {
    const s = sec('a2', `${actHead(2, 'Lee estas frases e intenta ordenar el diálogo. Después compruébalo escuchando el diálogo.', { listen: true, kr: '문장을 대화 순서대로 누르세요. 다 맞추면 듣기로 확인해요.' })}
      <div class="item ord"><div class="ord-bank"></div><div class="ord-line"></div>
        <div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">순서 확인</button><span class="mkbox"></span></div><div class="fb"></div></div>
      <h3 class="h3"><button class="btn ghost sm" id="play2">▶ 대화 듣기</button> <button class="btn ghost sm" id="hide2">대화 보기</button></h3>
      <div id="d2t" class="blur">${dialogHTML(D.dialogo_a2)}</div>
      <h3 class="h3">✍️ 들으며 빈칸 채우기</h3><div class="cz2"></div>
      <h3 class="h3">✍️ 약속 시간 바꾸기 표현</h3><div class="items w2"></div>`);
    reg('a2-ord', 'a2', 'inv');
    const box = $('.ord', s); let ord = [];
    const draw = () => {
      $('.ord-bank', box).innerHTML = A2.map((t, i) => `<button class="tok ln ${ord.includes(i + 1) ? 'used' : ''}" data-n="${i + 1}" ${ord.includes(i + 1) ? 'disabled' : ''}><b>${i + 1})</b> ${esc(t)}</button>`).join('');
      $('.ord-line', box).innerHTML = ord.length ? ord.map((n, k) => `<div class="ol ${k % 2 ? 'b' : 'a'}"><span>${k % 2 ? 'B' : 'A'}</span><b>${n})</b> ${esc(A2[n - 1])}</div>`).join('') : '<span class="small">↑ 첫 번째 문장부터 차례로 누르세요.</span>';
      $$('.ord-bank .tok', box).forEach(b => b.onclick = () => { ord.push(+b.dataset.n); draw(); });
    };
    draw();
    $('.rst', box).onclick = () => { ord = []; $('.mkbox', box).innerHTML = ''; $('.fb', box).innerHTML = ''; draw(); };
    $('.chk', box).onclick = () => {
      if (ord.length < 8) { $('.fb', box).innerHTML = '<span class="warn">8개 문장을 모두 배열하세요.</span>'; return; }
      const ok = ord.filter((n, i) => n === A2_ORD[i]).length, sc = ok === 8 ? 1 : ok >= 6 ? 0.5 : 0;
      record('a2-ord', sc, sc >= 1 ? [] : ['estructura'], {});
      $('.mkbox', box).innerHTML = MARK(sc) + ` <b>${ok} / 8</b>`;
      $('.fb', box).innerHTML = sc >= 1 ? '<span class="good">¡Perfecto! 👏 이제 ▶ 대화 듣기로 확인하세요.</span>' : `정답 순서 → <span class="ans">${A2_ORD.join(' - ')}</span>`;
    };
    $('#play2', s).onclick = e => playLines(D.dialogo_a2, e.currentTarget);
    blurBtn(s, '#hide2', '#d2t', '대화 보기', '대화 가리기');
    put(s, '.cz2', cloze({ id: 'a2c', sec: 'a2', skill: 'inv', cls: 'lines', text:
      ['A: Oye, ¿nos vemos mañana por la tarde?', 'B: Vale. De acuerdo. ¿Y qué [podemos] hacer? ¿Hay algo interesante?', 'A: Pues mira, hay una [exposición] de Miró en el Reina Sofía.',
        'B: ¡Ah! Muy bien. Me encanta Miró. ¿Cómo [quedamos]?', 'A: No sé... Podemos quedar a las cinco en la [puerta].', 'B: Es que no me [va] bien tan pronto. ¿Qué te [parece] a las seis?',
        'A: Vale. Entonces quedamos a las seis.'].map(x => `<p>${x}</p>`).join('') }));
    [['그렇게 일찍은 나한테 안 맞아. <span class="small">(Es que …)</span>', ['Es que no me va bien tan pronto.', 'No me va bien tan pronto.']],
      ['6시는 어때?', ['¿Qué te parece a las seis?']],
      ['좋아. 그럼 6시에 만나자.', ['Vale. Entonces quedamos a las seis.', 'Vale, entonces quedamos a las seis.', 'De acuerdo. Entonces quedamos a las seis.']],
      ['뭔가 재미있는 거 있어?', ['¿Hay algo interesante?']]]
      .forEach(([p, a], i) => put(s, '.w2', writeItem({ id: 'a2-w' + i, sec: 'a2', skill: 'inv', prompt: p, answers: a })));
  };

  const A3 = [['hacer deporte', '🏃', ['Hice deporte']], ['limpiar la casa', '🧹', ['Limpié la casa', 'Limpié toda la casa']], ['ir a una fiesta', '🎉', ['Fui a una fiesta']],
    ['jugar con la mascota', '🐕', ['Jugué con la mascota', 'Jugué con mi mascota', 'Jugué con mi perro']], ['ir al cine o al teatro', '🎭', ['Fui al cine', 'Fui al teatro', 'Fui al cine y al teatro']],
    ['salir con los amigos', '👫', ['Salí con los amigos', 'Salí con mis amigos']], ['ir al mercado', '🧺', ['Fui al mercado']], ['comer en un restaurante', '🍽️', ['Comí en un restaurante']],
    ['quedarse en casa viendo la televisión', '📺', ['Me quedé en casa viendo la televisión', 'Me quedé en casa viendo la tele']]];
  B.a3 = () => {
    const s = sec('a3', `${actHead(3, 'Pregunta a tu compañero si hizo alguna de estas cosas el fin de semana pasado.')}
      <div class="ybox wordbank">${A3.map(a => `<span>${a[0]}</span>`).join('')}</div>
      ${modelo('A: ¿Qué hiciste el fin de semana pasado?<br>B: Limpié toda la casa. Estoy muy cansado.')}
      <h3 class="h3">✍️ 질문 쓰기</h3><div class="items q3"></div>
      <h3 class="h3">✍️ (yo) 과거형으로 바꿔 쓰세요 — "지난 주말에 나는 …했다"</h3><div class="items two w3"></div>
      <h3 class="h3">✍️ 나의 지난 주말</h3><div class="f3"></div>`);
    put(s, '.q3', writeItem({ id: 'a3-q', sec: 'a3', skill: 'irr', prompt: '너 지난 주말에 뭐 했어?', ph: '¿Qué …?', answers: ['¿Qué hiciste el fin de semana pasado?'] }));
    A3.forEach(([inf, e, a], i) => put(s, '.w3', writeItem({ id: 'a3-' + i, sec: 'a3', skill: /^(ir|hacer)/.test(inf) || /jugar/.test(inf) ? 'irr' : 'pre', prompt: `<span class="emo-sm">${e}</span> <span class="chip">${inf}</span>`, ph: 'Yo …',
      answers: vars(a, ['Yo'], ['El fin de semana pasado']) })));
    put(s, '.f3', freeItem({ id: 'a3-f', sec: 'a3', rows: 4, prompt: '¿Qué hiciste el fin de semana pasado? — 3가지 이상 + 지금 기분 (Estoy muy …)', ph: 'El sábado por la mañana hice deporte. Después …',
      must: [{ re: PAST1, label: '1인칭 과거형 3번 이상 (-é / -í / fui / hice)', min: 3 }, { re: W0 + 'estoy' + W1, label: 'Estoy (muy) cansado/contento …' },
        { re: '(el s[aá]bado|el domingo|el fin de semana pasado|por la (ma[nñ]ana|tarde|noche))', label: '때 표현 (el sábado, por la tarde …)' }],
      model: 'El fin de semana pasado salí con mis amigos. El sábado por la tarde fuimos al cine. El domingo limpié toda la casa y comí en un restaurante con mi familia. Estoy muy cansado.' }));
  };

  const A4 = [['jugar al tenis', 'jugamos al tenis', '🎾'], ['dar una vuelta', 'damos una vuelta', '🚶'], ['ver una película de terror', 'vemos una película de terror', '👻'],
    ['ir a un concierto de jazz', 'vamos a un concierto de jazz', '🎷'], ['ir a ver un partido de fútbol', 'vamos a ver un partido de fútbol', '⚽'], ['tomar tapas', 'tomamos tapas', '🍢']];
  B.a4 = () => {
    const s = sec('a4', `${actHead(4, 'Lee la siguiente lista de actividades y practica con tu compañero siguiendo el modelo.')}
      ${modelo('A: ¿Por qué no vemos un partido de fútbol?<br>B: Vale, de acuerdo. ¿Cómo quedamos?<br>A: Nos vemos en frente del estadio a las siete.<br>B: Está bien.')}
      ${tip('<b>¿Por qué no + nosotros 현재형?</b> = "우리 ~하는 게 어때?" → jugar → <b>jugamos</b>, ver → <b>vemos</b>, ir → <b>vamos</b>, dar → <b>damos</b>')}
      <h3 class="h3">✍️ ¿Por qué no …? 로 초대해 보세요</h3><div class="items two w4"></div>
      <h3 class="h3">✍️ modelo처럼 대화 완성하기 — 하나를 골라 약속 정하기</h3><div class="f4"></div>`);
    A4.forEach(([inf, nos, e], i) => put(s, '.w4', writeItem({ id: 'a4-' + i, sec: 'a4', skill: 'inv', prompt: `<span class="emo-sm">${e}</span> <span class="chip">${inf}</span>`, ph: '¿Por qué no …?',
      answers: [`¿Por qué no ${nos}?`, `¿Vamos a ${inf}?`, `¿Quieres ${inf}?`, ...(/^vamos/.test(nos) ? [`¿${nos[0].toUpperCase() + nos.slice(1)}?`] : [])] })));
    put(s, '.f4', freeItem({ id: 'a4-f', sec: 'a4', rows: 5, ph: 'A: ¿Por qué no …?\nB: Vale, de acuerdo. ¿Cómo quedamos?\nA: Nos vemos …',
      must: [{ re: 'por qu[eé] no', label: '¿Por qué no …?' }, { re: '(vale|de acuerdo|est[aá] bien|muy bien)', label: '수락 (Vale, de acuerdo)' },
        { re: 'c[oó]mo quedamos', label: '¿Cómo quedamos?' }, { re: '(nos vemos|quedamos) ', label: 'Nos vemos / Quedamos …' },
        { re: '(en (la )?(puerta|entrada|boca|frente)|delante de)', label: '장소 (en la puerta de …, en frente de …)' }, { re: W0 + 'a las? ', label: '시간 (a las …)' }],
      model: 'A: ¿Por qué no tomamos tapas el viernes? B: Vale, de acuerdo. ¿Cómo quedamos? A: Nos vemos en la puerta del bar a las ocho. B: Está bien.' }));
  };

  B.a5 = () => {
    const s = sec('a5', `${actHead(5, 'Cuenta a tus compañeros el último viaje que hiciste con tu familia. Contesta a las siguientes preguntas.')}
      ${tip('질문의 tú 과거형 → 대답은 yo 과거형: fuiste → <b>fui</b>, utilizaste → <b>utilicé</b>, visitaste → <b>visité</b>, compraste → <b>compré</b><br>7)번은 vosotros로 물었으니 <b>Queremos</b> ir a … 로 대답해요.')}
      <div class="trip"></div>
      <details class="model"><summary>교재 정답 예시 보기 (Perú)</summary>1) Fui a Perú. 2) En agosto. 3) Utilicé el avión y el tren. 4) Visité Cuzco y Machu Picchu. 5) Lo que más me gustó fue probar la comida peruana. Lo que menos me gustó fue ir a las tiendas de artesanías. 6) Casi no, porque no tenía bastante dinero. 7) Queremos ir a Argentina para visitar la Patagonia.</details>`);
    const MES = '(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)';
    const Q = [['¿Adónde fuiste?', [{ re: W0 + 'fui a' + W1, label: 'Fui a …' }], 'Fui a Jeju con mi familia.'],
      ['¿Cuándo?', [{ re: `(${MES}|el (verano|invierno|año|mes) pasado|hace \\p{L}+ (a[nñ]os|meses|semanas)|en (las )?vacaciones|en \\d{4}|la semana pasada)`, label: '때 (en agosto, el verano pasado, hace dos años …)' }], 'El verano pasado, en agosto.'],
      ['¿Qué medios de transporte utilizaste?', [{ re: '(utilic[eé]|us[eé]|tom[eé]|fui en|fuimos en|viaj[eé] en|viajamos en)', label: 'Utilicé / Tomé / Fui en …' }, { re: '(avi[oó]n|tren|coche|autob[uú]s|barco|metro|taxi|bicicleta|ferry)', label: '교통수단' }], 'Utilicé el avión y el coche.'],
      ['¿Qué lugares visitaste?', [{ re: W0 + 'visit[eé]' + W1, label: 'Visité …' }], 'Visité la playa y el museo.'],
      ['¿Qué es lo que más te gustó? ¿Y lo que menos?', [{ re: 'lo que m[aá]s me gust[oó]', label: 'Lo que más me gustó fue …' }, { re: 'lo que menos me gust[oó]', label: 'Lo que menos me gustó fue …' }], 'Lo que más me gustó fue la comida. Lo que menos me gustó fue el tiempo.'],
      ['¿Compraste algo?', [{ re: W0 + '(compr[eé]|no compr[eé])' + W1, label: 'Compré … / No compré nada' }], 'Sí, compré unos regalos para mis amigos.'],
      ['¿Adónde queréis ir el próximo año?', [{ re: W0 + 'queremos' + W1, label: 'Queremos ir a …' }], 'Queremos ir a España para visitar Barcelona.']];
    Q.forEach(([q, m, mo], i) => put(s, '.trip', freeItem({ id: 'a5-' + i, sec: 'a5', skill: i === 6 ? 'qp' : 'pre', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m, model: mo })));
  };

  const A6 = [['🚶‍♀️🐕🌳', 'pasear', ['paseó con su mascota en el parque', 'paseó con su mascota por el parque', 'paseó a su mascota por el parque', 'paseó con su perro en el parque', 'paseó con su perro por el parque', 'paseó con su mascota']],
    ['🎬🍿🕶️', 'ir', ['fue al cine sola', 'fue al cine']],
    ['🛋️📺', 'ver', ['vio la televisión en casa', 'vio la tele en casa', 'vio la televisión', 'vio la tele']],
    ['🚲🌳', 'montar', ['montó en bicicleta en el parque', 'montó en bicicleta por el parque', 'montó en bicicleta']],
    ['👱‍♀️🍽️👩', 'comer', ['comió con su amiga en el restaurante', 'comió con su amiga en un restaurante', 'comió en un restaurante con su amiga', 'comió con su amiga']],
    ['👚🛍️', 'comprar', ['compró la camiseta en la tienda de ropa', 'compró una camiseta en la tienda de ropa', 'compró una camiseta', 'compró ropa en la tienda de ropa', 'compró ropa']],
    ['👱‍♀️☕👦', 'hablar', ['habló con su amigo en la cafetería', 'habló con su amigo', 'tomó un café con su amigo en la cafetería', 'tomó un café con su amigo']],
    ['🏛️🎟️👦', 'ir', ['fue al museo con su amigo', 'fue al museo']]];
  B.a6 = () => {
    const s = sec('a6', `${actHead(6, 'Habla con tus compañeros mirando los dibujos.', { kr: 'El fin de semana pasado de Laura — 라우라가 지난 주말에 한 일을 3인칭 과거형으로 쓰세요.' })}
      ${modelo('El fin de semana pasado Laura paseó con su mascota en el parque.')}
      ${tip('3인칭 과거: -ar → <b>-ó</b> (paseó, montó, compró, habló) / -er·-ir → <b>-ió</b> (comió) / ver → <b>vio</b> (악센트 없음) / ir → <b>fue</b>')}
      <div class="scenes"></div>
      <h3 class="h3">✍️ 라우라의 주말 이야기 이어 쓰기 — primero, después, luego, por último</h3><div class="f6"></div>`);
    A6.forEach(([e, v, a], i) => {
      const card = el(`<div class="scene"><div class="sc-pic"><span class="num">${i + 1})</span><span class="emo">${e}</span><small>${v}</small></div></div>`);
      card.appendChild(writeItem({ id: 'a6-' + i, sec: 'a6', skill: v === 'ir' || v === 'ver' ? 'irr' : 'pre', ph: 'Laura …', answers: vars(a, ['Laura', 'Ella'], ['El fin de semana pasado']) }));
      put(s, '.scenes', card);
    });
    put(s, '.f6', freeItem({ id: 'a6-f', sec: 'a6', rows: 4, ph: 'El sábado por la mañana Laura paseó con su mascota. Después …',
      must: [{ re: W0 + '(pase[oó]|fue|vio|mont[oó]|comi[oó]|compr[oó]|habl[oó]|tom[oó])' + W1, label: '3인칭 과거형 4번 이상', min: 4 },
        { re: W0 + '(primero|despu[eé]s|luego|m[aá]s tarde|por [uú]ltimo|al final)' + W1, label: '순서 연결어 2번 이상', min: 2 }],
      model: 'El sábado por la mañana Laura paseó con su mascota en el parque. Después montó en bicicleta. Por la tarde comió con su amiga en un restaurante y luego compró una camiseta. El domingo vio la televisión en casa y por último fue al museo con su amigo.' }));
  };

  B.d2 = () => {
    const s = sec('d2', `${dlgHead(2, 'Ana habla con Juan y le pregunta sobre su excursión de ayer a los Picos de Europa.')}
      <h3 class="h3"><span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros. <button class="btn ghost sm" id="play2">▶ 대화 전체 듣기</button> <button class="btn ghost sm" id="hide2">본문 가리기</button></h3>
      <div id="d2txt">${dialogHTML(D.dialogo2)}</div>
      <h3 class="h3">✍️ 빈칸 받아쓰기 — 과거형 동사를 쓰세요</h3><div class="d2c"></div>
      <h3 class="h3">① 내용 확인 — ¿Verdadero o falso?</h3><div class="items vf"></div>
      <h3 class="h3">b) Practica con tus compañeros utilizando las siguientes expresiones.</h3>
      <div class="chips"><span class="hlc c0">saqué</span><span class="hlc c1">Me encantó</span></div>
      ${tip('hacer fotos = sacar fotos (사진을 찍다). <b>e</b> hice → <b>y</b> saqué : i-/hi- 앞에서만 y 가 e 로 바뀌어요.')}
      <div class="items rep"></div>
      <h3 class="h3">c) 나의 소풍 · 여행 이야기 쓰기</h3><div class="d2f"></div>`);
    $('#play2', s).onclick = e => playLines(D.dialogo2, e.currentTarget);
    blurBtn(s, '#hide2', '#d2txt', '본문 보기', '본문 가리기');
    put(s, '.d2c', cloze({ id: 'd2c', sec: 'd2', skill: 'pre', cls: 'lines', text:
      ['<b class="who">Ana:</b> ¿Qué tal la excursión de ayer?', '<b class="who">Juan:</b> Muy bien. [Fuimos] a los Picos de Europa.', '<b class="who">Ana:</b> ¿Y te gustó?',
        '<b class="who">Juan:</b> Sí, mucho. [Vimos] muchos animales e [hice] muchas fotos.', '<b class="who">Ana:</b> Y ¿dónde [comisteis]?', '<b class="who">Juan:</b> En un restaurante asturiano muy famoso.',
        '<b class="who">Ana:</b> Y por la tarde, ¿qué [hicisteis]?', '<b class="who">Juan:</b> [Fuimos] a Oviedo y [visitamos] la ciudad. Me gustó mucho la Catedral.'].map(x => `<p>${x}</p>`).join('') }));
    [['Juan fue de excursión a los Picos de Europa ayer.', 'Verdadero'], ['Comieron en un restaurante italiano.', 'Falso'], ['A Juan no le gustó la Catedral.', 'Falso']]
      .forEach(([p, a], i) => put(s, '.vf', choiceItem({ id: 'd2-vf' + i, sec: 'd2', skill: 'pre', prompt: p, options: ['Verdadero', 'Falso'], answer: a })));
    [['Vimos muchos animales e <u>hice</u> muchas fotos. → <span class="chip">saqué</span>', ['Vimos muchos animales y saqué muchas fotos.'], 'irr'],
      ['<u>Me gustó mucho</u> la Catedral. → <span class="chip">Me encantó</span>', ['Me encantó la Catedral.'], 'pre'],
      ['<u>Fuimos</u> a Oviedo. → (yo) 혼자 갔다면?', ['Fui a Oviedo.'], 'irr'],
      ['Y por la tarde, ¿qué <u>hicisteis</u>? → (tú) 한 명에게 묻는다면?', ['Y por la tarde, ¿qué hiciste?', '¿Qué hiciste por la tarde?'], 'irr']]
      .forEach(([p, a, k], i) => put(s, '.rep', writeItem({ id: 'd2-r' + i, sec: 'd2', skill: k, prompt: p, answers: a })));
    put(s, '.d2f', freeItem({ id: 'd2f', sec: 'd2', rows: 5, prompt: '최근에 다녀온 소풍·여행을 4~5문장으로 쓰세요. (어디 · 무엇을 봤는지 · 어디서 먹었는지 · 오후에 뭘 했는지 · 무엇이 좋았는지)',
      ph: 'El sábado fui a … con mi familia. Vimos …',
      must: [{ re: W0 + '(fui|fuimos)' + W1, label: 'Fui / Fuimos a …' }, { re: W0 + '(vi|vimos)' + W1, label: 'Vi / Vimos …' }, { re: W0 + '(com[ií]|comimos)' + W1, label: 'Comí / Comimos …' },
        { re: W0 + '(hice|hicimos|saqu[eé]|sacamos|visit[eé]|visitamos)' + W1, label: 'hice / saqué / visité …' }, { re: W0 + 'me (gust[oó]|gustaron|encant[oó]|encantaron)' + W1, label: 'Me gustó / Me encantó' }],
      model: 'El sábado fui a Gyeongju con mi familia. Vimos muchos templos y saqué muchas fotos. Comimos en un restaurante muy famoso. Por la tarde visitamos un museo. Me encantó el templo de Bulguksa.' }));
  };

  /* Actividad 7 — 마르셀라의 다이어리 */
  const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const PARTS = ['mañana', 'tarde'];
  const GIVEN = { '0:0': 'Dentista', '3:0': 'Entrevistas', '4:0': 'Tenis', '1:1': 'Cine', '2:1': 'Exposición<br>Mueble', '5:1': 'Cena con<br>Juan', '6:1': 'Comer con<br>padres' };
  const MISS = [
    { k: '1:0', note: 'Gimnasio', ans: 'Fue al gimnasio.', kw: 'gimnasio' },
    { k: '2:0', note: 'Oficina', ans: 'Trabajó en la oficina.', kw: 'oficina|trabaj' },
    { k: '5:0', note: 'Mercado', ans: 'Fue al mercado.', kw: 'mercado' },
    { k: '6:0', note: 'Parque', ans: 'Paseó por el parque.', kw: 'parque|pase' },
    { k: '0:1', note: 'Clase de inglés', ans: 'Fue a clase de inglés.', kw: 'ingl[eé]s' },
    { k: '3:1', note: 'Compra', ans: '(El jueves por la tarde) Hizo la compra.', kw: 'compra', book: true },
    { k: '4:1', note: 'Fiesta de Lola', ans: 'Fue a la fiesta de cumpleaños de Lola.', kw: 'fiesta|cumplea' }
  ];
  const when = k => { const [d, p] = k.split(':').map(Number); return `el ${DAYS[d]} por la ${PARTS[p]}`; };
  B.a7 = () => {
    const s = sec('a7', `${actHead(7, 'Mira la agenda de Marcela de la semana pasada. Habla con tu compañero siguiendo el modelo y completad los datos que faltan.')}
      ${modelo('A: ¿Qué hizo Marcela el jueves por la tarde?<br>B: (El jueves por la tarde) Hizo la compra.<br>A: ¿Y cuándo comió con sus padres?<br>B: El domingo por la tarde.')}
      ${notice('🤝 교재에서 빈칸은 <b>짝꿍만 아는 정보</b>예요. 여기서는 📱 <b>가상 짝꿍</b>이 알려 줘요 — 빈칸(🔒)의 질문을 바르게 쓰면 짝꿍이 대답하고, 그 내용을 다이어리에 적으세요. (목요일 오후는 교재 modelo의 내용이고, 나머지 빈칸 정보는 연습용으로 만든 것이에요.)')}
      <div class="agenda-wrap"><div class="rings">${'<i></i>'.repeat(8)}</div><div class="agenda"></div></div>
      <div class="item-row"><button class="btn chk agchk">📒 다이어리 채점</button><span class="agscore"></span></div>
      <h3 class="h3">① 빈칸 정보 묻기 — ¿Qué hizo Marcela …?</h3><div class="items two askq"></div>
      <h3 class="h3">② 다이어리를 보고 대답하기 — 3인칭 과거형 문장으로</h3><div class="items two ans7"></div>
      <h3 class="h3">③ ¿Cuándo …? — 언제 했는지 대답하기</h3><div class="items two cu7"></div>`);
    const st = sel('a7', {});
    MISS.forEach((m, i) => reg('a7-c' + i, 'a7', 'voc'));
    const unlocked = i => { const it = SC.items()['a7-q' + i]; return !!(it && it.last > 0); };
    const drawAgenda = () => {
      const cell = (d, p) => {
        const k = d + ':' + p, g = GIVEN[k];
        if (g) return `<td class="given"><span>${g}</span></td>`;
        const i = MISS.findIndex(m => m.k === k);
        if (!unlocked(i)) return `<td class="lock" data-i="${i}" title="아래 ①에서 질문을 쓰세요">🔒<small>?</small></td>`;
        return `<td class="open" data-i="${i}"><input class="agi" data-i="${i}" value="${esc(st[i] || '')}" placeholder="메모" autocomplete="off" spellcheck="false"><span class="agm"></span></td>`;
      };
      $('.agenda', s).innerHTML = `<table class="ag"><tr><th></th>${DAYS.map(d => `<th>${d}</th>`).join('')}</tr>
        ${PARTS.map((p, pi) => `<tr><th class="pt">Por la<br>${p}</th>${DAYS.map((d, di) => cell(di, pi)).join('')}</tr>`).join('')}</table>`;
      $$('.agi', s).forEach(inp => inp.oninput = () => { st[inp.dataset.i] = inp.value; save(); });
      $$('td.lock', s).forEach(td => td.onclick = () => { const q = $(`.askq .askw:nth-child(${+td.dataset.i + 1}) .inp`, s); if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); } });
    };
    $('.agchk', s).onclick = () => {
      let ok = 0, n = 0;
      MISS.forEach((m, i) => {
        if (!unlocked(i)) return;
        n++;
        const v = SC.strip((st[i] || '').toLowerCase()), good = new RegExp(SC.strip(m.kw), 'i').test(v) && v.trim().length > 0;
        if (good) ok++;
        record('a7-c' + i, good ? 1 : 0, good ? [] : ['otro'], {});
        const td = $(`td.open[data-i="${i}"]`, s);
        if (td) { td.classList.remove('ok', 'no'); td.classList.add(good ? 'ok' : 'no'); $('.agm', td).innerHTML = MARK(good ? 1 : 0) + (good ? '' : `<small>${m.note}</small>`); }
      });
      $('.agscore', s).innerHTML = n ? `${MARK(ok / MISS.length)} <b>${ok} / ${MISS.length}</b>${n < MISS.length ? ` <span class="small">(🔒 ${MISS.length - n}칸 남음)</span>` : ''}` : '<span class="warn">먼저 ①에서 질문을 써서 빈칸을 여세요.</span>';
    };
    MISS.forEach((m, i) => {
      const w = el(`<div class="askw"></div>`);
      const reply = el(`<div class="reply"></div>`);
      const showReply = () => { if (unlocked(i)) reply.innerHTML = `<span class="rb">📱 짝꿍: ${esc(m.ans)} ${say(m.ans)}</span>`; };
      const D7 = when(m.k);
      w.appendChild(writeItem({ id: 'a7-q' + i, sec: 'a7', skill: 'irr', prompt: `🔒 <b>${D7}</b>${m.book ? ' <span class="small">(교재 modelo)</span>' : ''}`, ph: '¿Qué hizo Marcela …?',
        answers: [`¿Qué hizo Marcela ${D7}?`, `¿Qué hizo ${D7}?`, `¿Y qué hizo Marcela ${D7}?`, `¿Y qué hizo ${D7}?`],
        onCheck: r => { if (r.score > 0) { showReply(); drawAgenda(); } } }));
      w.appendChild(reply); showReply();
      put(s, '.askq', w);
    });
    drawAgenda();
    const SUBJ = ['Marcela', 'Ella'];
    [['0:0', 'Dentista', ['fue al dentista']], ['1:1', 'Cine', ['fue al cine']], ['2:1', 'Exposición Mueble', ['fue a una exposición de muebles', 'fue a la exposición de muebles', 'fue a una exposición', 'visitó una exposición de muebles']],
      ['3:0', 'Entrevistas', ['hizo entrevistas', 'hizo unas entrevistas', 'tuvo entrevistas', 'tuvo unas entrevistas']], ['4:0', 'Tenis', ['jugó al tenis', 'jugó a tenis']], ['5:1', 'Cena con Juan', ['cenó con Juan']]]
      .forEach(([k, n, a], i) => put(s, '.ans7', writeItem({ id: 'a7-a' + i, sec: 'a7', skill: /fue|hizo|tuvo/.test(a[0]) ? 'irr' : 'pre', prompt: `¿Qué hizo Marcela ${when(k)}? <span class="chip">${n}</span>`, ph: 'Fue … / Hizo …',
        answers: vars(a, SUBJ, [when(k)[0].toUpperCase() + when(k).slice(1)]) })));
    [['¿Cuándo comió con sus padres?', '6:1'], ['¿Cuándo jugó al tenis?', '4:0'], ['¿Cuándo cenó con Juan?', '5:1']]
      .forEach(([q, k], i) => put(s, '.cu7', writeItem({ id: 'a7-w' + i, sec: 'a7', skill: 'tie', prompt: `${q} ${say(q)}`, ph: 'El … por la …', answers: [when(k)[0].toUpperCase() + when(k).slice(1) + '.'] })));
  };

  B.a8 = () => {
    const s = sec('a8', `${actHead(8, 'Escucha y di lo que opina Marta acerca de su viaje.', { listen: true })}
      <div class="peru">${[['⛰️🏛️', 'Machu Picchu'], ['🚆', 'el tren'], ['🏨', 'el hotel'], ['🍤🥤', 'la comida peruana']].map(([e, c], i) => `<div class="pc8"><span class="num">${i + 1})</span><span class="emo">${e}</span><small>${c}</small></div>`).join('')}</div>
      <h3 class="h3"><button class="btn ghost sm" id="play8">▶ 대화 듣기</button> <button class="btn ghost sm" id="hide8">대본 보기</button></h3>
      <div id="d8t" class="blur">${dialogHTML(D.dialogo_a8)}</div>
      <h3 class="h3">① 듣고 고르기</h3><div class="items ch8"></div>
      <h3 class="h3">② 사진마다 마르타의 의견 쓰기 — A Marta le ha gustado / le gustó …</h3><div class="items two w8"></div>`);
    $('#play8', s).onclick = e => playLines(D.dialogo_a8, e.currentTarget);
    blurBtn(s, '#hide8', '#d8t', '대본 보기', '대본 가리기');
    [['¿Cuándo volvió Marta de su viaje?', ['Esta mañana', 'Ayer', 'El viernes'], 'Esta mañana'],
      ['¿Cómo son los peruanos, según Marta?', ['Simpáticos y agradables', 'Serios y tímidos', 'Altos y rubios'], 'Simpáticos y agradables'],
      ['¿Cómo fue Marta a Machu Picchu desde Cuzco?', ['En autobús', 'En avión', 'En tren'], 'En tren']]
      .forEach(([p, o, a], i) => put(s, '.ch8', choiceItem({ id: 'a8-c' + i, sec: 'a8', skill: 'pre', prompt: p, options: o, answer: a })));
    [['1) ⛰️ Machu Picchu', ['A Marta le ha gustado su viaje a Machu Picchu.', 'A Marta le ha gustado Machu Picchu.', 'A Marta le gustó mucho Machu Picchu.', 'A Marta le gustó Machu Picchu.', 'Le gustó mucho Machu Picchu.', 'A Marta le ha gustado mucho Machu Picchu.']],
      ['2) 🚆 el tren', ['A Marta le ha gustado mucho el tren.', 'A Marta le ha gustado el tren.', 'A Marta le gustó mucho el tren.', 'Le ha gustado mucho el tren.', 'Le gustó mucho el tren.']],
      ['3) 🏨 el hotel', ['Marta cree que estuvo en un hotel fantástico.', 'A Marta le ha encantado el hotel.', 'A Marta le encantó el hotel.', 'Marta estuvo en un hotel fantástico.', 'Le ha encantado el hotel.', 'Le encantó el hotel.']],
      ['4) 🍤 la comida peruana', ['A Marta le ha gustado mucho la comida peruana.', 'A Marta le ha gustado la comida peruana.', 'A Marta le gustó mucho la comida peruana.', 'Le ha gustado mucho la comida peruana.', 'Le gustó mucho la comida peruana.']]]
      .forEach(([p, a], i) => put(s, '.w8', writeItem({ id: 'a8-' + i, sec: 'a8', skill: 'pre', prompt: p, ph: 'A Marta le …', answers: a })));
  };

  const A9 = [['el lunes de la semana pasada', '지난주 월요일'], ['hace cinco años', '5년 전'], ['anoche', '어젯밤'], ['en tu último cumpleaños', '너의 지난 생일에'], ['el día de Nochevieja', '12월 31일 (섣달 그믐날)']];
  B.a9 = () => {
    const s = sec('a9', `${actHead(9, 'Usando las expresiones de tiempo pasado, pregunta a tu compañero.')}
      ${modelo('A: ¿Qué hiciste durante el fin de semana pasado?<br>B: Me quedé en casa todo el día. No salí de casa.')}
      <div class="pm9"></div>
      <h3 class="h3">✍️ 질문 쓰기와 나의 대답</h3><div class="q9"></div>`);
    put(s, '.pm9', pairMatch({ id: 'a9-m', sec: 'a9', skill: 'tie', title: '과거의 때 표현과 뜻을 연결하세요.', pairs: [...A9, ['anteayer', '그저께'], ['la semana pasada', '지난주']] }));
    A9.forEach(([t, k], i) => {
      const q = `¿Qué hiciste ${t}?`;
      const box = el(`<div class="pair11"><div class="ph">${i + 1}) <span class="chip">${t}</span> <span class="small">${k}</span></div></div>`);
      box.appendChild(writeItem({ id: 'a9-q' + i, sec: 'a9', skill: 'irr', prompt: '질문', ph: '¿Qué hiciste …?', answers: [q, `¿Qué hiciste tú ${t}?`] }));
      box.appendChild(freeItem({ id: 'a9-a' + i, sec: 'a9', line: true, prompt: '나의 대답', ph: t[0].toUpperCase() + t.slice(1) + ' …',
        must: [{ re: PAST1, label: '1인칭 과거형 (fui · hice · comí · me quedé …)' }] }));
      put(s, '.q9', box);
    });
  };

  const OLGA = [['07:00', '🛏️🥱', 'levantarse', ['se levantó'], ['a las siete de la mañana', 'a las siete']],
    ['09:00', '🚶‍♀️🐕🌳', 'pasear', ['paseó a su mascota por el parque', 'paseó con su mascota por el parque', 'paseó a su perro por el parque', 'paseó con su perro por el parque', 'paseó con su perro en el parque', 'paseó con su mascota en el parque', 'paseó a su perro', 'paseó con su perro'], ['a las nueve', 'a las nueve de la mañana']],
    ['14:00', '🍽️👦👱‍♀️', 'almorzar', ['almorzó en un restaurante con un amigo', 'almorzó con un amigo en un restaurante', 'almorzó con un amigo', 'comió con un amigo', 'comió en un restaurante con un amigo', 'comió con un amigo en un restaurante'], ['a las dos de la tarde', 'a las dos']],
    ['17:00', '📖✏️', 'estudiar', ['estudió inglés en su casa', 'estudió inglés en casa', 'estudió en casa', 'estudió en su casa', 'estudió inglés'], ['a las cinco de la tarde', 'a las cinco']],
    ['20:00', '☕👩👱‍♀️', 'tomar', ['tomó un café con una amiga en una cafetería', 'tomó un café con una amiga', 'tomó café con una amiga', 'tomó un café con su amiga'], ['a las ocho de la tarde', 'a las ocho de la noche', 'a las ocho']],
    ['21:00', '👨‍👩‍👧‍👦🍲', 'cenar', ['cenó con su familia en casa', 'cenó con su familia', 'cenó en casa con su familia'], ['a las nueve de la noche', 'a las nueve']]];
  /* Olga / Ella / (생략) / Ayer … + 시간을 앞·뒤 어디에 써도 정답 */
  const olgaAns = (acts, times) => {
    const out = [];
    acts.forEach(a => times.forEach(t => ['Olga', 'Ella', ''].forEach(sj => {
      out.push(`${sj} ${a} ${t}.`, `Ayer ${sj} ${a} ${t}.`, `${t} ${sj} ${a}.`);
    })));
    return [...new Set(out.map(x => x.replace(/\s+/g, ' ').trim()))];
  };
  B.a10 = () => {
    const s = sec('a10', `${actHead(10, 'Después de ver los dibujos habla con tus compañeros sobre las cosas que hizo Olga ayer.')}
      ${tip('누가 언제 무엇을: <b>Olga</b> + 3인칭 과거 + <b>a las …</b> &nbsp;예) Olga se levantó a las siete de la mañana.<br>levantarse → <b>se levantó</b> · almorzar → <b>almorzó</b> · tomar un café → <b>tomó</b> un café')}
      <div class="scenes olga"></div>
      <h3 class="h3">✍️ 올가의 하루를 한 단락으로 — primero, después, luego, por último</h3><div class="f10"></div>`);
    OLGA.forEach(([t, e, v, acts, times], i) => {
      const card = el(`<div class="scene"><div class="sc-pic"><span class="num">${i + 1})</span>${dclock(t)}<span class="emo">${e}</span><small>${v}</small></div></div>`);
      card.appendChild(writeItem({ id: 'a10-' + i, sec: 'a10', skill: 'pre', ph: 'Olga … a las …', answers: olgaAns(acts, times) }));
      put(s, '.olga', card);
    });
    put(s, '.f10', freeItem({ id: 'a10-f', sec: 'a10', rows: 5, ph: 'Ayer Olga se levantó a las siete. Después …',
      must: [{ re: W0 + '(se levant[oó]|pase[oó]|almorz[oó]|comi[oó]|estudi[oó]|tom[oó]|cen[oó])' + W1, label: '3인칭 과거형 5번 이상', min: 5 },
        { re: W0 + 'a las? (\\d+|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)' + W1, label: '시간 (a las …) 3번 이상', min: 3 },
        { re: W0 + '(primero|despu[eé]s|luego|m[aá]s tarde|por [uú]ltimo|al final)' + W1, label: '순서 연결어 2번 이상', min: 2 }],
      model: 'Ayer Olga se levantó a las siete de la mañana. Primero paseó a su mascota por el parque a las nueve. Después almorzó en un restaurante con un amigo a las dos. Luego estudió inglés en su casa a las cinco. A las ocho tomó un café con una amiga y por último cenó con su familia a las nueve de la noche.' }));
  };

  B.a11 = () => {
    const s = sec('a11', `${actHead(11, 'Habla con tus compañeros.', { kr: '응급실(urgencias)에 갔던 경험을 묻고 답해요. 경험이 없으면 가족·친구 이야기나 상상으로 써도 좋아요.' })}
      ${tip('도움 표현: me caí (넘어졌다) · me rompí el brazo (팔이 부러졌다) · me corté el dedo (손가락을 베였다) · tuve mucha fiebre (열이 많이 났다) · me dolía mucho … (많이 아팠다)<br><b>he ido</b> = 가 본 적 있다 (경험) / <b>fui</b> = (그때) 갔다')}
      <div class="items u11"></div>`);
    [['¿Cuántas veces has ido a urgencias?', [{ re: '(una vez|\\p{L}+ veces|\\d+ veces|nunca|he ido|ninguna vez)', label: 'una vez / dos veces / nunca …' }], 'He ido a urgencias dos veces.'],
      ['¿Cuándo fuiste allí por última vez?', [{ re: W0 + 'fui' + W1, label: 'Fui …' }, { re: '(hace \\p{L}+ (a[nñ]os|meses|semanas|d[ií]as)|el (a[nñ]o|mes|verano|invierno) pasado|la semana pasada|en \\d{4}|ayer|anteayer)', label: '과거의 때 표현' }], 'Fui allí por última vez hace dos años.'],
      ['¿Qué te pasó?', [{ re: '(me ca[ií]|me romp[ií]|me cort[eé]|me quem[eé]|tuve|me dol[ií]a|me torc[ií]|com[ií]|jugu[eé]|\\p{L}{2,}(é|í))', label: '1인칭 과거형 (me caí, me rompí, tuve …)' }], 'Jugué al fútbol y me caí. Me rompí el brazo.'],
      ['¿Fue grave?', [{ re: W0 + '(no )?fue( muy)? grave' + W1, label: '(No) fue grave' }], 'No, no fue grave.'],
      ['¿Te atendieron inmediatamente?', [{ re: '(me atendieron|no me atendieron|esper[eé]|esperamos)', label: 'Me atendieron … / Esperé …' }], 'No, esperé una hora. Después me atendieron.']]
      .forEach(([q, m, mo], i) => put(s, '.u11', freeItem({ id: 'a11-' + i, sec: 'a11', skill: i === 0 ? 'lib' : i === 3 ? 'irr' : 'pre', line: true, prompt: `${i + 1}) ${q} ${say(q)}`, must: m, model: mo })));
  };

  SC.lesson({
    num: '11',
    title: '¿Cómo quedamos?',
    ttsTest: '¿Por qué no vamos al cine esta tarde?',
    cover: {
      emoji: '📞🎬🗓️<br><small>¿Cómo quedamos?</small>',
      bg: 'linear-gradient(135deg,#7b3a26 0%,#a0522d 45%,#f2a65a 100%)',
      tema: ['Espectáculos', 'Citas', 'Invitaciones'],
      com: ['Iniciar una conversación telefónica', 'Hablar de espectáculos: horarios y lugares', 'Hacer una invitación y aceptarla o rechazarla', 'Concertar citas'],
      gram: ['<i>Querer</i> + infinitivo · <i>Poder</i> + infinitivo', 'Pretérito indefinido:', '&nbsp;- verbos regulares', '&nbsp;- verbos irregulares: <i>llegar, ir y hacer</i>']
    },
    skills: D.skills,
    sections: D.sections,
    people: {
      M: { name: 'Manuel', av: '🧑🏻‍🦰', side: 'l' }, B: { name: 'Beatriz', av: '👩🏼‍🦰', side: 'r' },
      Ana: { av: '👱🏼‍♀️', side: 'r' }, Juan: { av: '🧑🏽', side: 'l' },
      A: { av: '🙋🏻‍♂️', side: 'l' }, B2: { name: 'B', av: '🙋🏽‍♀️', side: 'r' }, Amigo: { av: '🧑🏻', side: 'l' }, Marta: { av: '👩🏽', side: 'r' }
    },
    errLabels: { irregular: '불규칙 과거 (ir · hacer · llegar)', conjugacion: '과거형 어미 변화' },
    errTips: {
      acento: 'comí, comió, salí, llegué, película, miércoles … 과거형의 악센트는 필수! hablo(나는 말한다) ≠ habló(그가 말했다). 단, fui · fue · vio · hizo 는 악센트 없음.',
      conjugacion: '-ar: -é, -aste, -ó, -amos, -asteis, -aron / -er·-ir: -í, -iste, -ió, -imos, -isteis, -ieron',
      irregular: 'ir: fui, fuiste, fue, fuimos, fuisteis, fueron / hacer: hice, hiciste, hizo, hicimos, hicisteis, hicieron / llegar: llegué',
      estructura: '¿Por qué no + nosotros형? (¿Por qué no vamos …?) / querer·poder + 동사원형 (Quiero ir, Puedo venir)'
    },
    classify(ti, ta) {
      const IRR = /^(fui|fuiste|fue|fuimos|fuisteis|fueron|hice|hiciste|hizo|hicimos|hicisteis|hicieron|llegué|jugué|saqué|empecé|vio|vimos)$/;
      const near = (w, m) => w !== m && (w.slice(0, 2) === m.slice(0, 2) || /^(ir|hac|lleg|jug|sac|empez|ve)/.test(w));
      if (ta.some(m => IRR.test(m) && !ti.includes(m) && ti.some(w => near(w, m)))) return 'irregular';
      const PRET = /(é|í|ó|aste|iste|asteis|isteis|aron|ieron)$/;
      const miss = ta.filter(w => PRET.test(w) && !ti.includes(w));
      if (miss.some(m => ti.some(w => w.slice(0, 3) === m.slice(0, 3) && w !== m))) return 'conjugacion';
      return null;
    },
    errRules: [
      { re: W0 + '(hac[ií]|haci[oó]|haciste|hacieron|hizó)' + W1, t: 'irregular', msg: 'hacer 과거: hice · hiciste · hizo · hicimos · hicisteis · hicieron' },
      { re: W0 + '(fuí|fué)' + W1, t: 'acento', msg: 'fui · fue 에는 악센트가 없어요' },
      { re: W0 + 'vió' + W1, t: 'acento', msg: 'vio 에는 악센트가 없어요' },
      { re: W0 + 'yo fue' + W1, t: 'irregular', msg: 'yo → fui (fue 는 3인칭)' },
      { re: W0 + '(él|ella|usted) fui' + W1, t: 'irregular', msg: 'él / ella → fue' },
      { re: W0 + '(lleg[eé]|jug[eé]|sac[eé]|empez[eé])' + W1, t: 'irregular', msg: '철자 변화: llegué · jugué · saqué · empecé' },
      { re: W0 + '(quero|queres|quere|quieremos|quier[eé]is|puedemos|pued[eé]is|podo)' + W1, t: 'conjugacion', msg: 'querer: quiero, quieres, quiere, queremos, queréis, quieren / poder: puedo, puedes, puede, podemos, podéis, pueden' },
      { re: W0 + '(quiero|quieres|quiere|queremos|quer[eé]is|quieren|puedo|puedes|puede|podemos|pod[eé]is|pueden) (voy|vas|va|vamos|vienes|viene|juego|juegas|como|comes)' + W1, t: 'estructura', msg: 'querer · poder 뒤에는 동사원형 (Quiero ir / ¿Puedes venir?)' },
      { re: W0 + 'y(?= h?[ií](?![eéa]))', t: 'estructura', msg: 'i-/hi- 앞의 y → e (animales e hice …)' }
    ],
    accWords: ['comí', 'comió', 'salí', 'salió', 'volví', 'volvió', 'nací', 'nació', 'dormí', 'durmió', 'viví', 'vivió', 'aprendí', 'conocí', 'escribí', 'recibí', 'almorzó', 'jugué', 'empecé', 'exposición', 'cumpleaños', 'teléfono', 'película'],
    utiles: D.utiles.map(([es, kr]) => ({ es, kr })),
    utilScramble: ['¿Quieres venir al cine esta noche?', 'Podemos quedar a las ocho en la puerta del cine.', '¿Qué te parece a las nueve?', 'Lo siento, pero no puedo.', 'Volví a casa por la tarde.', 'Empecé a trabajar a las 7.'],
    utilSkill: 'inv',
    proverbio: { es: 'No se ganó Zamora en una hora.', e: '🏰', answer: '로마는 하루아침에 이루어지지 않았다', options: ['로마는 하루아침에 이루어지지 않았다', '시간은 금이다', '쇠뿔도 단김에 빼라', '늦었다고 생각할 때가 가장 이르다'],
      kr: '사모라(스페인의 성곽 도시)는 한 시간 만에 정복되지 않았다 — 큰일은 시간과 인내가 필요하다는 뜻이에요.' },
    exam: {
      bank: D.examBank,
      partB: {
        title: '¡Compruébalo! → 사과하기 + 나의 이야기 쓰기',
        icons: ['⏰', '🙏', '👶', '🎂'],
        questions: ['a) Alumno A: Has quedado con tu amigo a las siete de la tarde y llegas a las siete y media. Discúlpate y dile por qué has llegado tarde.',
          'a) Alumno B: Acepta las disculpas de tu amigo y tranquilízalo. (친구의 대답도 1~2문장)',
          'b) Habla de algunos datos biográficos sobre ti: Nací en … / A los cinco años … / A los diez años … / A los quince años …'],
        minWords: 55,
        hint: 'Lo siento · Es que … · No pasa nada · Nací en … · A los … años + 과거형(fui, hice, llegué, empecé …)을 활용하면 높은 점수!',
        ph: 'A: ¡Lo siento mucho! Es que …\nB: No pasa nada …\n\nNací en …',
        connectors: ['es que', 'porque', 'pero', 'y', 'después', 'luego', 'entonces', 'también', 'cuando'],
        rubric: [
          { k: 'dis', label: '사과 (Lo siento / Perdón / Perdona)', max: 8, re: 'lo siento|perd[oó]n|perdona|disc[uú]lpa(me)?', ax: 'Contenido' },
          { k: 'exc', label: '늦은 이유 (Es que … / porque …)', max: 8, re: 'es que|porque', ax: 'Contenido' },
          { k: 'acp', label: 'B의 대답 (No pasa nada / Tranquilo …)', max: 6, re: 'no pasa nada|tranquil[oa]|no te preocupes|no importa|no hay problema', ax: 'Contenido' },
          { k: 'nac', label: 'Nací en …', max: 8, re: 'nac[ií]', ax: 'Contenido' },
          { k: 'eda', label: 'A los … años (2번 이상)', max: 8, re: 'a los (\\d+|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|diecis[eé]is) a[nñ]os', min: 2, ax: 'Contenido' },
          { k: 'reg', label: '규칙 과거형 (-é / -í / -ó) 3번 이상', max: 8, re: '\\p{L}{2,}(é|í|ó)', min: 3, ax: 'Gramática' },
          { k: 'irr', label: '불규칙 과거 (fui · fue · hice · hizo · llegué)', max: 8, re: 'fui|fue|fuimos|fueron|hice|hizo|hicimos|llegu[eé]|empec[eé]|jugu[eé]|saqu[eé]', ax: 'Gramática' },
          { k: 'tie', label: '시간 표현 (a las … / hace … / ayer)', max: 6, re: 'a las? (\\d+|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)|hace \\p{L}+ a[nñ]os|ayer|anoche', ax: 'Gramática' }
        ],
        model: 'A: ¡Lo siento mucho! Es que perdí el autobús y llegué tarde al metro. B: No pasa nada. Tranquilo, la película empieza a las ocho. — Nací en Seúl en 2010. A los cinco años empecé a ir a la escuela. A los diez años viajé a España con mi familia y comí paella por primera vez. A los quince años empecé a estudiar español en mi colegio internacional y me encantó.'
      }
    },
    build: B
  });
})();
