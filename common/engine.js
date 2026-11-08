/* 스페인어 회화 I — 공통 학습 엔진 (Lección 09 포맷을 모든 과에서 공유)
   각 과 폴더의 lesson.js 가 SC.lesson({...}) 을 호출해 사이트를 만듭니다. */
(function () {
  'use strict';
  const SC = window.SC = {};
  let D = null;                                    // 현재 과 설정
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  Object.assign(SC, { $, $$, el, esc, shuffle });

  /* ---------- 저장 ---------- */
  let KEY = 'spa_con_tmp';
  const NAME_KEY = 'spa_con_name', SUM_KEY = 'spa_con_sum';
  let S = { items: {}, errors: {}, sel: {}, exams: [], examA: null, essay: '' };
  const getName = () => { try { return localStorage.getItem(NAME_KEY) || ''; } catch (e) { return ''; } };
  const setName = v => { try { localStorage.setItem(NAME_KEY, v); } catch (e) { } };
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } updateProgress(); saveSummary(); }
  function saveSummary() {
    const all = Object.keys(REG); if (!all.length) return;
    try {
      const sum = JSON.parse(localStorage.getItem(SUM_KEY) || '{}');
      const done = all.filter(k => S.items[k]).length;
      const sc = all.reduce((a, k) => a + (S.items[k] ? S.items[k].last : 0), 0);
      sum['L' + D.num] = { d: done, n: all.length, p: Math.round(sc / all.length * 100), e: S.exams.length ? S.exams[S.exams.length - 1].t : null };
      localStorage.setItem(SUM_KEY, JSON.stringify(sum));
    } catch (e) { }
  }
  const REG = {};
  const reg = (id, sec, skill) => { REG[id] = { sec, skill }; };
  function record(id, score, errs, extra) {
    const it = S.items[id] || { a: 0 };
    it.a++; it.last = score; Object.assign(it, extra || {});
    S.items[id] = it;
    (errs || []).forEach(e => { S.errors[e] = (S.errors[e] || 0) + 1; });
    save();
  }
  /* 과마다 선택 상태(벤다이어그램·표 등)를 저장할 객체 */
  const sel = (k, def) => (S.sel[k] || (S.sel[k] = def !== undefined ? def : {}));
  Object.assign(SC, { reg, record, save, sel, state: () => S, items: () => S.items });

  /* ---------- 발음 (Web Speech) + 소리 점검 ---------- */
  const TTS_OK = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let VOICES = [], VOICE = null, KEEP = [], watchdog = null;
  const ttsSet = () => (S.tts = S.tts || { voice: '', rate: 0.9 });
  function pickVoice() {
    if (!TTS_OK) return;
    try {
      VOICES = speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang));
      const want = ttsSet().voice;
      VOICE = VOICES.find(v => v.name === want) || VOICES.find(v => /^es[-_]ES/i.test(v.lang) && v.localService) || VOICES.find(v => /^es[-_]ES/i.test(v.lang)) || VOICES[0] || null;
      if (typeof drawCheck === 'function') drawCheck();
    } catch (e) { }
  }
  if (TTS_OK) { pickVoice(); speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', pickVoice) : (speechSynthesis.onvoiceschanged = pickVoice); setTimeout(pickVoice, 500); setTimeout(pickVoice, 2000); }
  function utter(t, pitch) {
    const u = new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g, '').replace(/[\[\]]/g, '').replace(/\|[^\]\s]*/g, ''));
    u.lang = VOICE ? VOICE.lang : 'es-ES'; if (VOICE) u.voice = VOICE;
    u.rate = ttsSet().rate || 0.9; u.pitch = pitch || 1; u.volume = 1;
    KEEP.push(u); if (KEEP.length > 40) KEEP.shift();
    return u;
  }
  let playingBtn = null;
  const mark = (btn, on) => { if (playingBtn && playingBtn !== btn) playingBtn.classList.remove('playing'); playingBtn = on ? btn : null; if (btn) btn.classList.toggle('playing', on); };
  function run(list, btn) {
    if (!TTS_OK) { toast('이 브라우저는 음성 읽기 기능을 지원하지 않아요. 크롬·엣지·사파리 최신 버전에서 열어 주세요.'); return; }
    if (!VOICES.length) pickVoice();
    try { speechSynthesis.cancel(); speechSynthesis.resume(); } catch (e) { }
    clearTimeout(watchdog);
    let started = false;
    list[0].addEventListener('start', () => { started = true; clearTimeout(watchdog); hideToast(); });
    list[list.length - 1].addEventListener('end', () => mark(btn, false));
    list.forEach(u => u.addEventListener('error', e => { if (e.error !== 'interrupted' && e.error !== 'canceled') { mark(btn, false); toast(`재생 오류(${e.error}). 🔊 소리 점검을 열어 확인해 보세요.`, true); } }));
    mark(btn, true);
    setTimeout(() => { list.forEach(u => speechSynthesis.speak(u)); }, 60);
    watchdog = setTimeout(() => {
      if (started) return;
      mark(btn, false);
      try { speechSynthesis.cancel(); } catch (e) { }
      toast(VOICES.length ? '음성이 시작되지 않았어요. 한 번 더 눌러 보고, 계속 안 되면 소리 점검을 열어 주세요.' : '이 기기에 스페인어 음성이 없어 재생되지 않아요. 소리 점검에서 설치 방법을 확인하세요.', true);
    }, 3000);
  }
  function speak(t, btn) { run([utter(t)], btn); }
  function playLines(lines, btn) {
    const who = [...new Set(lines.map(l => l.who))];
    run(lines.map(l => utter(l.es, who.indexOf(l.who) % 2 ? 1.2 : 0.9)), btn);
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.stopPropagation(); speak(b.dataset.say, b); } });
  Object.assign(SC, { speak, playLines });

  function toast(msg, withCheck) {
    let t = $('#toast');
    if (!t) { t = el('<div id="toast" class="toast" role="status"><span class="tm"></span><button class="btn sm tchk">🔊 소리 점검</button><button class="tx" aria-label="닫기">✕</button></div>'); document.body.appendChild(t); $('.tx', t).onclick = hideToast; $('.tchk', t).onclick = () => { hideToast(); openCheck(); }; }
    $('.tm', t).textContent = msg; $('.tchk', t).hidden = !withCheck; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(hideToast, 9000);
  }
  function hideToast() { const t = $('#toast'); if (t) t.classList.remove('on'); }
  SC.toast = toast;

  let drawCheck = null;
  function openCheck() {
    let m = $('#sndchk');
    const test = D.ttsTest || '¡Hola! ¿Cómo estás?';
    if (!m) {
      m = el(`<div id="sndchk" class="modal" role="dialog" aria-label="소리 점검"><div class="mbox">
        <button class="mx" aria-label="닫기">✕</button>
        <h2>🔊 소리 점검</h2>
        <div class="chk-status"></div>
        <div class="chk-row"><label>스페인어 음성</label><select class="vsel"></select></div>
        <div class="chk-row"><label>말하기 속도 <b class="rv"></b></label><input class="rate" type="range" min="0.6" max="1.2" step="0.05"></div>
        <div class="chk-row"><button class="btn big ttest">▶ 테스트 재생: “${esc(test)}”</button></div>
        <div class="chk-res"></div>
        <details open><summary>그래도 안 들릴 때 확인할 것</summary><ul class="chk-tips">
          <li>🔈 기기 <b>볼륨</b>과 음소거, <b>이어폰·블루투스</b> 연결(소리가 다른 기기로 나가는지) 확인</li>
          <li>🧭 크롬·엣지: 탭을 마우스 오른쪽 클릭 → <b>사이트 음소거 해제</b> / 주소창 왼쪽 자물쇠 → 사이트 설정 → 소리 <b>허용</b></li>
          <li>📱 아이폰·아이패드: 옆면 <b>무음 스위치</b>를 끄고(주황색이 안 보이게) 볼륨 올리기</li>
          <li>🪟 Windows에 스페인어 음성이 없으면: 설정 → 시간 및 언어 → 음성 → <b>음성 추가</b> → Español(España) 설치 후 브라우저 다시 열기</li>
          <li>🤖 안드로이드: 설정 → 접근성(또는 일반) → <b>텍스트 음성 변환</b> → Google 음성 엔진 → 스페인어 음성 데이터 설치</li>
          <li>🏠 홈페이지(크리에이터링크) 안에서 열었다면 <a href="${location.href.split('#')[0]}" target="_blank" rel="noopener">사이트를 새 창으로 열기</a></li>
        </ul></details></div></div>`);
      document.body.appendChild(m);
      $('.mx', m).onclick = () => m.classList.remove('on');
      m.addEventListener('click', e => { if (e.target === m) m.classList.remove('on'); });
      $('.vsel', m).onchange = e => { ttsSet().voice = e.target.value; save(); pickVoice(); };
      $('.rate', m).oninput = e => { ttsSet().rate = +e.target.value; $('.rv', m).textContent = '×' + (+e.target.value).toFixed(2); save(); };
      $('.ttest', m).onclick = () => {
        const res = $('.chk-res', m); res.className = 'chk-res wait'; res.textContent = '재생 요청 중…';
        if (!TTS_OK) { res.className = 'chk-res bad'; res.textContent = '✕ 이 브라우저는 음성 읽기를 지원하지 않습니다.'; return; }
        const u = utter(test);
        let ok = false;
        u.addEventListener('start', () => { ok = true; res.className = 'chk-res good'; res.innerHTML = `✔ 재생이 시작됐어요 (${esc(VOICE ? VOICE.name : '기본 음성')}).<br>소리가 들리면 정상입니다. <b>재생은 됐는데 안 들리면</b> 아래 볼륨·음소거·출력 기기를 확인하세요.`; });
        u.addEventListener('error', e => { if (e.error === 'interrupted') return; ok = true; res.className = 'chk-res bad'; res.textContent = '✕ 재생 오류: ' + e.error; });
        run([u], $('.ttest', m));
        setTimeout(() => { if (!ok) { res.className = 'chk-res bad'; res.innerHTML = '✕ 재생이 시작되지 않았어요. ' + (VOICES.length ? '브라우저를 완전히 닫았다 다시 열어 보세요.' : '이 기기에 <b>스페인어 음성이 설치되어 있지 않아요</b>. 아래 설치 방법을 따라 주세요.'); } }, 3200);
      };
    }
    drawCheck = () => {
      const st = $('.chk-status', m);
      const nAll = TTS_OK ? speechSynthesis.getVoices().length : 0;
      st.innerHTML = `<div class="${TTS_OK ? 'y' : 'n'}">${TTS_OK ? '✔' : '✕'} 음성 읽기 기능 ${TTS_OK ? '지원' : '미지원'}</div>
        <div class="${VOICES.length ? 'y' : 'n'}">${VOICES.length ? '✔' : '✕'} 스페인어 음성 ${VOICES.length}개 (전체 ${nAll}개)</div>`;
      const sl = $('.vsel', m);
      sl.innerHTML = VOICES.length ? VOICES.map(v => `<option value="${esc(v.name)}" ${VOICE && v.name === VOICE.name ? 'selected' : ''}>${esc(v.name)} (${v.lang})${v.localService ? '' : ' · 온라인'}</option>`).join('') : '<option>스페인어 음성 없음 — 기본 음성 사용</option>';
      sl.disabled = !VOICES.length;
      const r = ttsSet().rate || 0.9; $('.rate', m).value = r; $('.rv', m).textContent = '×' + r.toFixed(2);
    };
    pickVoice(); drawCheck();
    $('.chk-res', m).className = 'chk-res'; $('.chk-res', m).textContent = '';
    m.classList.add('on');
  }
  const say = t => `<button class="say" data-say="${esc(String(t).replace(/<[^>]+>/g, ''))}" title="듣기" aria-label="듣기">🔊</button>`;
  SC.say = say;

  /* ---------- 채점 엔진 ---------- */
  const PUNCT = /[¿?¡!.,;:"“”'«»()\/…–—-]/g;
  const norm = s => s.toLowerCase().replace(/ /g, ' ').replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const acc = s => strip(s.toLowerCase()).replace(/[aeioun]/g, c => ({ a: '[aá]', e: '[eé]', i: '[ií]', o: '[oó]', u: '[uúü]', n: '[nñ]' }[c]));
  const L = '\\p{L}', W0 = `(?<!${L})`, W1 = `(?!${L})`;
  Object.assign(SC, { norm, strip, acc, W0, W1 });
  const ERR_LABEL = {
    acento: '악센트(tilde) 누락', puntuacion: '¿ ¡ 부호 누락', concordancia: '성 · 수 일치',
    pronombre: '대명사', conjugacion: '동사 변화', estructura: '문장 구조', otro: '철자 · 어휘'
  };
  const ERR_TIP = {
    acento: '악센트도 철자예요. 시험에서는 감점됩니다. 의문사(qué, cómo, dónde…)와 tú, él, está 등을 꼭 확인하세요.',
    puntuacion: '스페인어 의문문·감탄문은 앞에도 ¿ ¡ 를 씁니다.',
    concordancia: '명사의 성(남/여)·수(단/복)에 관사와 형용사를 맞춰요: el chico alto / la chica alta / los chicos altos.',
    pronombre: '주어·목적어 대명사(yo, tú, él … / me, te, se …)를 확인하세요.',
    conjugacion: '주어에 맞게 동사를 변화시켜요: yo hablo, tú hablas, él habla …',
    estructura: '어순과 전치사(a, de, en, con …)를 확인하세요.',
    otro: '철자와 관사(el/la/los/las)를 꼼꼼히 확인하세요.'
  };
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let p = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
    return p[n];
  }
  const ART = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'del', 'al'];
  const PRON = ['yo', 'tú', 'tu', 'él', 'ella', 'usted', 'nosotros', 'nosotras', 'vosotros', 'vosotras', 'ellos', 'ellas', 'ustedes', 'me', 'te', 'se', 'nos', 'os', 'le', 'les', 'lo'];
  function classify(ni, na) {
    const ti = ni.split(' '), ta = na.split(' ');
    if (D.classify) { const r = D.classify(ti, ta, ni, na); if (r) return r; }
    if (ti.filter(w => ART.includes(w)).join() !== ta.filter(w => ART.includes(w)).join()) return 'concordancia';
    if (ti.filter(w => PRON.includes(w)).join() !== ta.filter(w => PRON.includes(w)).join()) return 'pronombre';
    if (ti.length === ta.length) {
      const diff = ti.map((w, i) => [strip(w), strip(ta[i])]).filter(([a, b]) => a !== b);
      if (diff.length === 1) {
        const [a, b] = diff[0];
        const stem = x => x.replace(/(os|as|es|o|a|e|s)$/, '');
        if (/(o|a|os|as)$/.test(a) && /(o|a|os|as)$/.test(b) && stem(a) === stem(b)) return 'concordancia';
        if (a.slice(0, 3) === b.slice(0, 3) && a.length > 2) return 'conjugacion';
      }
    } else return 'estructura';
    return 'otro';
  }
  function grade(input, answers, prefix) {
    const ni = norm(input);
    if (!ni) return { empty: true, score: 0 };
    const eq = (a, b) => prefix ? (a === b || a.startsWith(b + ' ')) : a === b;
    for (const a of answers) {
      if (eq(ni, norm(a))) {
        const errs = []; let score = 1;
        if (/^\s*¿/.test(a) && !/¿/.test(input)) { errs.push('puntuacion'); score = 0.5; }
        if (/^\s*¡/.test(a) && !/¡/.test(input)) { errs.push('puntuacion'); score = 0.5; }
        return { score, errs, best: a };
      }
    }
    for (const a of answers) if (eq(strip(ni), strip(norm(a)))) return { score: 0.5, errs: ['acento'], best: a };
    const sn = strip(ni);
    const best = answers.slice().sort((x, y) => lev(sn, strip(norm(x))) - lev(sn, strip(norm(y))))[0];
    return { score: 0, errs: [classify(ni, norm(best))], best };
  }
  const tl = a => esc(a).replace(/[áéíóúñüÁÉÍÓÚÑ¿¡]/g, m => `<b class="tl">${m}</b>`);
  const MARK = s => s >= 0.999 ? '<span class="mk ok">○</span>' : s > 0 ? '<span class="mk half">△</span>' : '<span class="mk no">✕</span>';
  function fbHTML(r) {
    if (r.score >= 1) return `<span class="good">¡Correcto! 👏</span>`;
    const tag = r.errs.map(e => `<span class="etag e-${e}">${ERR_LABEL[e] || e}</span>`).join(' ');
    if (r.score > 0) return `${tag} 거의 맞았어요 → <span class="ans">${tl(r.best)}</span>`;
    return `${tag} 정답 예시 → <span class="ans">${tl(r.best)}</span>`;
  }
  Object.assign(SC, { grade, MARK, tl, fbHTML });

  /* 자유작문 오류 탐지 (빨간 펜) — 공통 규칙 + 과별 규칙(D.errRules) */
  const BASE_RULES = [
    { re: '(?<=¿\\s?)(que|cual|cuales|quien|quienes|donde|adonde|cuando|como|cuanto|cuanta|cuantos|cuantas)' + W1, t: 'acento', msg: '의문사에는 악센트: qué · cuál · quién · dónde · cuándo · cómo · cuánto' },
    { re: '(?<=¿\\s?(de|a|en|con|para|por|desde|hasta) )(que|cual|cuales|quien|quienes|donde|cuando|como|cuanto|cuantos|cuantas)' + W1, t: 'acento', msg: '전치사 + 의문사도 악센트: ¿de dónde? ¿con quién? ¿a qué hora?' },
    { re: '(?<=¿\\s?por )que' + W1, t: 'acento', msg: '¿por qué?' },
    { re: '(?<=¿y )tu' + W1, t: 'acento', msg: '"¿Y tú?" (주어 tú)' },
    { re: W0 + 'tí' + W1, t: 'acento', msg: '"ti"에는 악센트가 없어요' }
  ];
  /* 악센트 없이 쓰면 언제나 틀리는 단어만 (esta/está, el/él 처럼 둘 다 있는 단어는 넣지 않음) */
  const BASE_ACC = ['también', 'música', 'película', 'películas', 'fútbol', 'número', 'números', 'teléfono', 'teléfonos', 'electrónico', 'español', 'inglés', 'japonés', 'francés', 'alemán',
    'portugués', 'irlandés', 'holandés', 'compañero', 'compañera', 'compañeros', 'compañeras', 'mañana', 'mañanas', 'niño', 'niña', 'niños', 'niñas', 'año', 'años', 'pequeño', 'pequeña',
    'después', 'allí', 'aquí', 'ahí', 'adiós', 'días', 'día', 'están', 'sábado', 'sábados', 'miércoles', 'línea', 'difícil', 'fácil', 'árbol', 'lápiz', 'café',
    'habitación', 'habitaciones', 'salón', 'baño', 'baños', 'jardín', 'televisión', 'móvil', 'avión', 'autobús', 'estación', 'información', 'canción',
    'educación', 'profesión', 'simpático', 'simpática', 'antipático', 'antipática', 'médico', 'médica', 'fotógrafo', 'fotógrafa', 'mecánico', 'mecánica', 'policía',
    'matemáticas', 'química', 'física', 'música', 'rápido', 'rápida', 'último', 'última', 'próximo', 'próxima', 'césped', 'húmedo', 'sofá', 'lámpara', 'bolígrafo',     'papelería', 'panadería', 'librería', 'carnicería', 'frutería', 'peluquería', 'cafetería', 'jamás', 'además', 'según', 'también', 'balón', 'película', 'clásica', 'clásico'];
  let ACC_RE = [];
  function findErrors(text) {
    const low = text.toLowerCase(), out = [];
    [...BASE_RULES, ...(D.errRules || [])].forEach(r => { for (const m of low.matchAll(new RegExp(r.re, 'giu'))) out.push({ s: m.index, e: m.index + m[0].length, t: r.t, msg: r.msg }); });
    ACC_RE.forEach(({ w, re }) => { for (const m of low.matchAll(re)) if (m[0] !== w) out.push({ s: m.index, e: m.index + m[0].length, t: 'acento', msg: `→ ${w}` }); });
    out.sort((a, b) => a.s - b.s);
    return out.filter((x, i) => !out.slice(0, i).some(y => x.s < y.e && y.s < x.e));
  }
  function annotate(text, checks, errs) {
    const marks = errs.map((x, i) => ({ s: x.s, e: x.e, cls: 'bad', n: i + 1 }));
    checks.forEach(c => (c.spans || []).forEach(([s, e]) => { if (!marks.some(m => s < m.e && m.s < e)) marks.push({ s, e, cls: 'goodm' }); }));
    marks.sort((a, b) => a.s - b.s);
    let html = '', pos = 0;
    marks.forEach(m => { if (m.s < pos) return; html += esc(text.slice(pos, m.s)) + `<mark class="${m.cls}">${esc(text.slice(m.s, m.e))}${m.n ? `<sup>${m.n}</sup>` : ''}</mark>`; pos = m.e; });
    html += esc(text.slice(pos));
    const notes = errs.map((x, i) => `<li><b>${i + 1}</b> <span class="etag e-${x.t}">${ERR_LABEL[x.t] || x.t}</span> ${esc(x.msg)}</li>`).join('');
    return `<div class="redpen">${html.replace(/\n/g, '<br>')}</div>${notes ? `<ol class="pen-notes">${notes}</ol>` : ''}`;
  }
  function analyze(text, must, minWords) {
    const low = text.toLowerCase();
    const checks = must.map(m => {
      const ms = [...low.matchAll(new RegExp(m.re, 'giu'))];
      return { label: m.label, ok: ms.length >= (m.min || 1), spans: ms.map(x => [x.index, x.index + x[0].length]) };
    });
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    if (minWords) checks.push({ label: `${minWords}단어 이상 (지금 ${words}단어)`, ok: words >= minWords, spans: [] });
    const errs = findErrors(text);
    let score = checks.length ? checks.filter(c => c.ok).length / checks.length : 1;
    score = Math.max(0, Math.round((score - 0.1 * errs.length) * 100) / 100);
    return { checks, errs, score, words, html: annotate(text, checks, errs) };
  }
  SC.analyze = analyze;
  /* 문자열(악센트 무시) → 정규식 조각. 자유작문 체크리스트용 */
  SC.rx = s => acc(s).replace(/ /g, '\\s+');
  SC.word = s => W0 + '(' + s + ')' + W1;

  /* ---------- 공통 UI 조각 ---------- */
  const actHead = (n, title, o = {}) => `<div class="act-head"><span class="act-pill">${o.listen ? '<span class="hp">🎧</span>' : ''}ACTIVIDAD<b>${n}</b></span><span class="act-bar"></span></div><h2 class="act-title">${title}</h2>${o.kr ? `<p class="kr-sub">${o.kr}</p>` : ''}`;
  const dlgHead = (n, title) => `<div class="dlg-head"><span class="dlg-pill">Diálogo ${n}</span><span class="dlg-hatch"></span></div>${title ? `<p class="scene">${title}</p>` : ''}`;
  const ribbon = (txt, color) => `<div class="ribbon-head"><span class="ribbon ${color || ''}">${txt}</span><span class="act-bar ${color === '' || !color ? 'y' : ''}"></span></div>`;
  const modelo = (html, tab) => `<div class="modelo"><span class="modelo-tab">${tab || 'modelo'}</span><div class="modelo-in">${html}</div></div>`;
  const tip = html => `<div class="tip"><span class="tip-ic">💡</span><div>${html}</div></div>`;
  const notice = html => `<div class="notice">${html}</div>`;
  const hl = (s, i) => `<span class="hlc c${i % 3}">${s}</span>`;
  const h3 = html => `<h3 class="h3">${html}</h3>`;
  const lines = arr => arr.map(x => `<p>${x}</p>`).join('');
  Object.assign(SC, { actHead, dlgHead, ribbon, modelo, tip, notice, hl, h3, lines });

  /* writeItem: 한 문장 쓰기 */
  function writeItem(c) {
    reg(c.id, c.sec, c.skill);
    const w = el(`<div class="item ${c.cls || ''}">${c.prompt ? `<div class="item-p">${c.prompt}</div>` : ''}
      <div class="item-row"><input class="inp" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(c.ph || '스페인어로 쓰세요')}">
      <button class="btn chk">확인</button><span class="mkbox"></span></div><div class="fb"></div></div>`);
    const inp = $('.inp', w), fb = $('.fb', w), mk = $('.mkbox', w);
    function show(score, html) { w.classList.remove('is-ok', 'is-half', 'is-no'); w.classList.add(score >= 1 ? 'is-ok' : score > 0 ? 'is-half' : 'is-no'); mk.innerHTML = MARK(score); fb.innerHTML = html; }
    const prev = S.items[c.id]; if (prev && prev.v != null) { inp.value = prev.v; show(prev.last, prev.fb || ''); }
    function check() {
      const ans = typeof c.answers === 'function' ? c.answers() : c.answers;
      if (!ans) { fb.innerHTML = '<span class="warn">먼저 위에서 선택하세요.</span>'; return; }
      const r = grade(inp.value, ans, c.prefix);
      if (r.empty) { fb.innerHTML = '<span class="warn">답을 입력하세요.</span>'; return; }
      const html = fbHTML(r);
      record(c.id, r.score, r.errs, { v: inp.value, fb: html });
      show(r.score, html);
      if (c.onCheck) c.onCheck(r);
    }
    $('.chk', w).onclick = check;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    return w;
  }

  /* freeItem: 자유작문 + 첨삭 */
  function freeItem(c) {
    reg(c.id, c.sec, c.skill || 'lib');
    const w = el(`<div class="item free">${c.prompt ? `<div class="item-p">${c.prompt}</div>` : ''}
      ${c.line ? `<input class="inp wide" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(c.ph || '스페인어로 쓰세요')}">` : `<textarea class="ta" rows="${c.rows || 4}" spellcheck="false" placeholder="${esc(c.ph || '스페인어로 쓰세요')}"></textarea>`}
      <div class="item-row"><span class="wc"></span><button class="btn chk">첨삭 받기 ✍️</button><span class="mkbox"></span></div>
      <div class="fb"></div></div>`);
    const inp = $('.inp, .ta', w), fb = $('.fb', w), mk = $('.mkbox', w), wc = $('.wc', w);
    const upd = () => { const n = inp.value.trim() ? inp.value.trim().split(/\s+/).length : 0; wc.textContent = c.line ? '' : `${n} palabras`; };
    inp.addEventListener('input', upd);
    function show(score, html) { w.classList.remove('is-ok', 'is-half', 'is-no'); w.classList.add(score >= 1 ? 'is-ok' : score > 0 ? 'is-half' : 'is-no'); mk.innerHTML = MARK(score); fb.innerHTML = html; }
    const prev = S.items[c.id]; if (prev && prev.v != null) { inp.value = prev.v; show(prev.last, prev.fb || ''); }
    upd();
    function check() {
      const must = typeof c.must === 'function' ? c.must() : c.must;
      if (!must) { fb.innerHTML = `<span class="warn">${c.needMsg || '먼저 위에서 선택하세요.'}</span>`; return; }
      if (!inp.value.trim()) { fb.innerHTML = '<span class="warn">문장을 써 보세요.</span>'; return; }
      const a = analyze(inp.value, must, c.minWords);
      const list = a.checks.map(x => `<li class="${x.ok ? 'y' : 'n'}">${x.ok ? '✔' : '✘'} ${x.label}</li>`).join('');
      const html = `<ul class="checklist">${list}</ul>${a.html}${c.model ? `<details class="model"><summary>모범 답안 보기</summary>${say(c.model)} ${esc(c.model)}</details>` : ''}`;
      record(c.id, a.score, [...new Set(a.errs.map(x => x.t))], { v: inp.value, fb: html });
      show(a.score, html);
    }
    $('.chk', w).onclick = check;
    if (c.line) inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    return w;
  }

  /* cloze: 문장 속 빈칸 [정답|다른정답] */
  function cloze(c) {
    let k = 0;
    const blanks = [];
    const html = c.text.replace(/\[([^\]]+)\]/g, (m, a) => {
      const id = `${c.id}-${k++}`, ans = a.split('|');
      blanks.push({ id, ans }); reg(id, c.sec, c.skill);
      const wd = Math.max(3, ans[0].length) * 0.62 + 1.4;
      return `<span class="blank"><input class="cz" data-id="${id}" style="width:${wd}em" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="czm"></span></span>`;
    });
    const w = el(`<div class="cloze ${c.cls || ''}">${c.title ? `<div class="item-p">${c.title}</div>` : ''}<div class="cz-body">${html}</div>
      <div class="item-row"><button class="btn chk">전체 채점</button><span class="cz-score"></span></div></div>`);
    const paint = (inp, id) => {
      const it = S.items[id]; if (!it) return;
      const sp = inp.nextElementSibling;
      inp.classList.remove('ok', 'half', 'no'); inp.classList.add(it.last >= 1 ? 'ok' : it.last > 0 ? 'half' : 'no');
      sp.innerHTML = it.last >= 1 ? '' : `<span class="czfix">${tl(it.best)}</span>`;
    };
    $$('.cz', w).forEach(inp => { const it = S.items[inp.dataset.id]; if (it && it.v != null) { inp.value = it.v; paint(inp, inp.dataset.id); } });
    $('.chk', w).onclick = () => {
      let tot = 0;
      $$('.cz', w).forEach(inp => {
        const b = blanks.find(x => x.id === inp.dataset.id);
        const r = grade(inp.value || ' ', b.ans);
        const sc = r.empty ? 0 : r.score;
        record(b.id, sc, r.empty ? ['otro'] : r.errs, { v: inp.value, best: b.ans[0] });
        paint(inp, b.id); tot += sc;
      });
      $('.cz-score', w).innerHTML = `${MARK(tot / blanks.length)} <b>${Math.round(tot * 10) / 10} / ${blanks.length}</b>`;
    };
    $$('.cz', w).forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('.chk', w).click(); }));
    return w;
  }

  /* choiceItem: 선택형 (Verdadero/Falso 등) */
  function choiceItem(c) {
    reg(c.id, c.sec, c.skill);
    const w = el(`<div class="item choice"><div class="item-p">${c.prompt}</div><div class="opts">${c.options.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><span class="mkbox"></span>${c.explain ? '<div class="fb"></div>' : ''}</div>`);
    const paint = v => {
      $$('.opt', w).forEach(b => { b.classList.remove('ok', 'no'); if (b.dataset.o === c.answer && v) b.classList.add('ok'); if (b.dataset.o === v && v !== c.answer) b.classList.add('no'); });
      $('.mkbox', w).innerHTML = MARK(v === c.answer ? 1 : 0);
      if (c.explain && v) $('.fb', w).innerHTML = `<span class="small">💬 ${c.explain}</span>`;
    };
    const prev = S.items[c.id]; if (prev && prev.v) paint(prev.v);
    $$('.opt', w).forEach(b => b.onclick = () => { const ok = b.dataset.o === c.answer; record(c.id, ok ? 1 : 0, ok ? [] : [c.err || 'otro'], { v: b.dataset.o }); paint(b.dataset.o); });
    return w;
  }

  /* scramble: 단어 배열 (target 문장을 공백으로 나눔, 또는 tokens 배열 + joiner) */
  function scramble(c) {
    reg(c.id, c.sec, c.skill);
    const toks = c.tokens || c.target.split(' ');
    const J = c.joiner != null ? c.joiner : ' ';
    const target = toks.join(J);
    const w = el(`<div class="item scr">${c.prompt ? `<div class="item-p">${c.prompt}</div>` : ''}<div class="scr-line"></div><div class="scr-bank"></div><div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">확인</button>${c.tokens ? '' : say(target)}<span class="mkbox"></span></div><div class="fb"></div></div>`);
    const line = $('.scr-line', w), bank = $('.scr-bank', w);
    let order = [];
    function draw() {
      const order2 = shuffle(toks.map((t, i) => i));
      bank.innerHTML = order2.map(i => `<button class="tok" data-i="${i}">${esc(toks[i])}</button>`).join('');
      line.innerHTML = ''; order = [];
      $$('.tok', bank).forEach(b => b.onclick = () => { if (b.disabled) return; b.disabled = true; order.push(+b.dataset.i); const t = el(`<button class="tok in">${esc(toks[+b.dataset.i])}</button>`); t.onclick = () => { order.splice(order.indexOf(+b.dataset.i), 1); t.remove(); b.disabled = false; }; line.appendChild(t); });
    }
    draw();
    $('.rst', w).onclick = draw;
    $('.chk', w).onclick = () => {
      if (order.length < toks.length) { $('.fb', w).innerHTML = '<span class="warn">모두 배열하세요.</span>'; return; }
      const s = order.map(i => toks[i]).join(J);
      const ok = s === target;
      record(c.id, ok ? 1 : 0, ok ? [] : ['estructura'], {});
      w.classList.remove('is-ok', 'is-no'); w.classList.add(ok ? 'is-ok' : 'is-no');
      $('.mkbox', w).innerHTML = MARK(ok ? 1 : 0);
      $('.fb', w).innerHTML = ok ? '<span class="good">¡Perfecto!</span>' : `정답 → <span class="ans">${tl(target)}</span>`;
    };
    const prev = S.items[c.id]; if (prev) { w.classList.add(prev.last >= 1 ? 'is-ok' : 'is-no'); $('.mkbox', w).innerHTML = MARK(prev.last); }
    return w;
  }

  /* matchPics: 단어 상자의 표현을 눌러 그림(이모지/HTML) 카드에 붙이기
     c.items = [{ e: '🚲' 또는 html, es: '정답 표현', cap: '작은 설명(선택)' }] */
  function matchPics(c) {
    const st = sel(c.id, {});
    let picked = null;
    const words = shuffle(c.items.map(x => x.es));
    const w = el(`<div class="mp">${c.title ? `<div class="item-p">${c.title}</div>` : ''}<div class="ybox bank"></div><div class="pics" ${c.cols ? `style="grid-template-columns:repeat(${c.cols},1fr)"` : ''}></div><div class="item-row"><button class="btn chk m">채점하기</button><span class="mscore"></span></div></div>`);
    const bank = $('.bank', w), pics = $('.pics', w);
    bank.innerHTML = words.map(x => `<button class="wchip" data-w="${esc(x)}">${esc(x)}</button>`).join('');
    pics.innerHTML = c.items.map((p, i) => { reg(c.id + '-' + i, c.sec, c.skill); return `<div class="pic" data-i="${i}"><span class="num">${i + 1})</span><span class="emo">${p.e}</span>${p.cap ? `<span class="cap">${p.cap}</span>` : ''}<span class="slot"></span><span class="mkbox"></span></div>`; }).join('');
    const paint = () => {
      $$('.pic', pics).forEach(p => { const v = st[p.dataset.i]; $('.slot', p).textContent = v || '?'; p.classList.toggle('filled', !!v); });
      $$('.wchip', bank).forEach(b => { b.classList.toggle('used', Object.values(st).includes(b.dataset.w)); b.classList.toggle('sel', b.dataset.w === picked); });
    };
    $$('.wchip', bank).forEach(b => b.onclick = () => { picked = b.dataset.w; paint(); });
    $$('.pic', pics).forEach(p => p.onclick = e => {
      if (e.target.closest('.say')) return;
      if (!picked) { if (st[p.dataset.i]) { delete st[p.dataset.i]; save(); paint(); } return; }
      Object.keys(st).forEach(k => { if (st[k] === picked) delete st[k]; });
      st[p.dataset.i] = picked; picked = null; save(); paint();
    });
    $('.m', w).onclick = () => {
      let ok = 0;
      $$('.pic', pics).forEach(p => { const i = +p.dataset.i, good = st[i] === c.items[i].es; if (good) ok++; record(c.id + '-' + i, good ? 1 : 0, good ? [] : ['otro'], {}); p.classList.remove('ok', 'no'); p.classList.add(good ? 'ok' : 'no'); $('.mkbox', p).innerHTML = MARK(good ? 1 : 0) + (good ? '' : `<small>${esc(c.items[i].es)}</small>`); });
      $('.mscore', w).innerHTML = `${MARK(ok / c.items.length)} <b>${ok} / ${c.items.length}</b>`;
    };
    paint();
    return w;
  }

  /* pairMatch: 왼쪽(1,2,3…) ↔ 오른쪽(a,b,c…) 짝 맞추기, 선으로 연결
     c.pairs = [[왼쪽, 오른쪽], …]  (오른쪽은 섞여서 나옴) */
  function pairMatch(c) {
    const st = sel(c.id, {});
    const n = c.pairs.length;
    let rOrder = S.sel[c.id + '_o'];
    if (!rOrder || rOrder.length !== n) { rOrder = S.sel[c.id + '_o'] = shuffle(c.pairs.map((_, i) => i)); Object.keys(st).forEach(k => delete st[k]); }
    c.pairs.forEach((_, i) => reg(c.id + '-' + i, c.sec, c.skill));
    const LET = 'abcdefghijklmnopqrstuvwxyz';
    const w = el(`<div class="pmw">${c.title ? `<div class="item-p">${c.title}</div>` : ''}<p class="small">왼쪽 항목을 누른 뒤 짝이 되는 오른쪽 항목을 누르세요. 다시 누르면 연결이 풀려요.</p>
      <div class="pm"><svg class="pm-lines"></svg><div class="pm-col L">${c.pairs.map((p, i) => `<button class="pm-it" data-l="${i}"><span class="lt">${i + 1})</span><span>${p[0]}</span><span class="pk"></span></button>`).join('')}</div>
      <div class="pm-col R">${rOrder.map((ri, j) => `<button class="pm-it" data-r="${ri}"><span class="lt">${LET[j]}.</span><span>${c.pairs[ri][1]}</span><span class="pk"></span></button>`).join('')}</div></div>
      <div class="item-row"><button class="btn ghost rst">다시</button><button class="btn chk">채점하기</button><span class="pscore"></span></div></div>`);
    let picked = null;
    const COLORS = ['#f26a21', '#2a8bd0', '#2e9d5b', '#a32638', '#8a5cc8', '#d4a900', '#e0559b', '#17a2a2', '#6b4c3b', '#5c7c2e'];
    const drawLines = () => {
      const svg = $('.pm-lines', w), box = $('.pm', w).getBoundingClientRect();
      if (!box.width) return;
      svg.innerHTML = Object.keys(st).map(l => {
        const a = $(`[data-l="${l}"]`, w), b = $(`[data-r="${st[l]}"]`, w); if (!a || !b) return '';
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return `<line x1="${ra.right - box.left}" y1="${ra.top + ra.height / 2 - box.top}" x2="${rb.left - box.left}" y2="${rb.top + rb.height / 2 - box.top}" stroke="${COLORS[l % COLORS.length]}"/>`;
      }).join('');
    };
    const paint = () => {
      $$('[data-l]', w).forEach(b => { const l = b.dataset.l, on = st[l] != null; $('.pk', b).textContent = on ? (+l + 1) : ''; $('.pk', b).className = 'pk' + (on ? ' pkc' + (l % 10) : ''); b.classList.toggle('sel', picked === l); });
      $$('[data-r]', w).forEach(b => { const l = Object.keys(st).find(k => String(st[k]) === b.dataset.r); $('.pk', b).textContent = l != null ? (+l + 1) : ''; $('.pk', b).className = 'pk' + (l != null ? ' pkc' + (l % 10) : ''); });
      requestAnimationFrame(drawLines);
    };
    $$('[data-l]', w).forEach(b => b.onclick = () => { const l = b.dataset.l; if (st[l] != null && picked !== l) { delete st[l]; save(); picked = null; } else picked = picked === l ? null : l; paint(); });
    $$('[data-r]', w).forEach(b => b.onclick = () => {
      const r = b.dataset.r;
      if (picked == null) { const l = Object.keys(st).find(k => String(st[k]) === r); if (l != null) { delete st[l]; save(); paint(); } return; }
      Object.keys(st).forEach(k => { if (String(st[k]) === r) delete st[k]; });
      st[picked] = +r; picked = null; save(); paint();
    });
    $('.rst', w).onclick = () => { Object.keys(st).forEach(k => delete st[k]); save(); $$('.pm-it', w).forEach(b => { b.classList.remove('ok', 'no'); const f = $('.fx', b); if (f) f.remove(); }); $('.pscore', w).innerHTML = ''; paint(); };
    $('.chk', w).onclick = () => {
      let ok = 0;
      c.pairs.forEach((p, i) => {
        const good = st[i] === i; if (good) ok++;
        record(c.id + '-' + i, good ? 1 : 0, good ? [] : [c.err || 'otro'], {});
        const b = $(`[data-l="${i}"]`, w); b.classList.remove('ok', 'no'); b.classList.add(good ? 'ok' : 'no');
        const f = $('.fx', b); if (f) f.remove();
        if (!good) b.insertAdjacentHTML('beforeend', `<span class="fx">→ ${LET[rOrder.indexOf(i)]}</span>`);
      });
      $('.pscore', w).innerHTML = `${MARK(ok / n)} <b>${ok} / ${n}</b>`;
    };
    window.addEventListener('resize', () => requestAnimationFrame(drawLines));
    w._redraw = paint;
    setTimeout(paint, 50);
    PM_LIST.push(paint);
    return w;
  }
  const PM_LIST = [];

  /* sortBoard: 표현 칩을 표의 알맞은 칸에 분류하기
     c.cols = [{k:'M+', label:'…'}], c.rows(선택) = [{k:'M', label:'A Marcos'}], c.chips = [['표현', '칸 키']]
     rows 를 쓰면 칸 키는 'row:col' (예: 'M:+') */
  function sortBoard(c) {
    const st = sel(c.id, {});
    let ord = S.sel[c.id + '_o'];
    if (!ord || ord.length !== c.chips.length) { ord = S.sel[c.id + '_o'] = shuffle(c.chips.map((_, i) => i)); Object.keys(st).forEach(k => delete st[k]); }
    c.chips.forEach((_, i) => reg(c.id + '-' + i, c.sec, c.skill));
    const cell = k => `<td class="col" data-c="${k}"></td>`;
    const table = c.rows
      ? `<table class="lg"><tr><th></th>${c.cols.map(x => `<th>${x.label}</th>`).join('')}</tr>${c.rows.map(r => `<tr><th>${r.label}</th>${c.cols.map(x => cell(r.k + ':' + x.k)).join('')}</tr>`).join('')}</table>`
      : `<table class="lg"><tr>${c.cols.map(x => `<th>${x.label}</th>`).join('')}</tr><tr>${c.cols.map(x => cell(x.k)).join('')}</tr></table>`;
    const w = el(`<div class="sb">${c.title ? `<div class="item-p">${c.title}</div>` : ''}<div class="ybox bank sb-bank"></div>${table}<div class="item-row"><button class="btn chk">표 채점</button><span class="tscore"></span></div></div>`);
    let picked = null;
    const bank = $('.sb-bank', w);
    const paint = () => {
      bank.innerHTML = ord.filter(i => !st[i]).map(i => `<button class="wchip ${picked === i ? 'sel' : ''}" data-i="${i}">${c.chips[i][0]}</button>`).join('') || '<span class="small">모두 배치했어요 ✔</span>';
      $$('td[data-c]', w).forEach(td => { td.innerHTML = Object.keys(st).filter(i => st[i] === td.dataset.c).map(i => `<button class="wchip in" data-i="${i}">${c.chips[i][0]}</button>`).join(''); });
      $$('.wchip', w).forEach(b => b.onclick = ev => { ev.stopPropagation(); const i = +b.dataset.i; if (b.classList.contains('in')) { if (picked != null) { st[picked] = b.closest('td').dataset.c; picked = null; } else delete st[i]; save(); } else picked = i; paint(); });
    };
    $$('td[data-c]', w).forEach(td => td.onclick = () => { if (picked == null) return; st[picked] = td.dataset.c; picked = null; save(); paint(); });
    paint();
    $('.chk', w).onclick = () => {
      let ok = 0;
      c.chips.forEach(([t, k], i) => { const g = st[i] === k; if (g) ok++; record(c.id + '-' + i, g ? 1 : 0, g ? [] : [c.err || 'otro'], {}); });
      $$('td[data-c] .wchip', w).forEach(b => { const i = +b.dataset.i; b.classList.add(c.chips[i][1] === st[i] ? 'ok' : 'no'); });
      $('.tscore', w).innerHTML = `${MARK(ok / c.chips.length)} <b>${ok} / ${c.chips.length}</b>`;
    };
    return w;
  }

  /* flipGrid: 뒤집는 낱말 카드 [{e, es, kr}] */
  function flipGrid(list) {
    const fg = el('<div class="flipgrid"></div>');
    list.forEach(a => {
      const c = el(`<div class="flip"><div class="flip-in"><div class="ff"><span class="emo">${a.e || ''}</span><span>${a.es}</span></div><div class="fbk"><span>${a.kr}</span>${say(a.es)}</div></div></div>`);
      c.onclick = e => { if (!e.target.closest('.say')) c.classList.toggle('on'); };
      fg.appendChild(c);
    });
    return fg;
  }

  /* 아날로그 시계 SVG */
  function clock(h, m) {
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    const hand = (a, len, cls) => { const r = a * Math.PI / 180; return `<line class="${cls}" x1="50" y1="50" x2="${50 + Math.sin(r) * len}" y2="${50 - Math.cos(r) * len}"/>`; };
    let tk = ''; for (let i = 0; i < 12; i++) { const r = i * 30 * Math.PI / 180; tk += `<line class="tk" x1="${50 + Math.sin(r) * 38}" y1="${50 - Math.cos(r) * 38}" x2="${50 + Math.sin(r) * 44}" y2="${50 - Math.cos(r) * 44}"/>`; }
    return `<svg class="clk" viewBox="0 0 100 100"><circle class="face" cx="50" cy="50" r="46"/>${tk}${hand(ha, 24, 'hh')}${hand(ma, 34, 'mh')}<circle class="ct" cx="50" cy="50" r="3.5"/></svg>`;
  }
  const dclock = t => `<span class="dclock">${t}</span>`;

  /* 대화 말풍선 — D.people = { 이름: {av:'🧑', side:'l'|'r'} } */
  function dialogHTML(lines, cls) {
    let ci = 0;
    const P = D.people || {};
    const sides = {}; let flip = 0;
    return `<div class="chat ${cls || ''}">${lines.map(l => {
      const p = P[l.who] || {};
      const name = p.name || l.who;
      if (!sides[l.who]) sides[l.who] = p.side || (flip++ % 2 ? 'r' : 'l');
      const txt = esc(l.es).replace(/\[([^\]]+)\]/g, (m, a) => hl(a, ci++));
      return `<div class="msg ${sides[l.who]}"><span class="av">${p.av || '🙂'}<small>${esc(name)}</small></span><div class="bub">${txt} ${say(l.es)}</div></div>`;
    }).join('')}</div>`;
  }
  const clozeFromDialog = ls => ls.map(l => `<p><b class="who">${esc((D.people && D.people[l.who] && D.people[l.who].name) || l.who)}:</b> ${l.es}</p>`).join('');
  /* 대화 섹션 머리 + 듣기 / 가리기 버튼 */
  function dialogBlock(id, ls, o = {}) {
    const w = el(`<div class="dblock"><h3 class="h3">${o.title === undefined ? '<span class="hp">🎧</span> a) Escucha el diálogo y practica con tus compañeros.' : o.title} <button class="btn ghost sm pl">▶ 대화 전체 듣기</button> <button class="btn ghost sm hd">본문 가리기</button></h3>
      <div class="dtxt">${dialogHTML(ls, o.cls)}</div>${o.img || ''}</div>`);
    $('.pl', w).onclick = e => playLines(ls, e.currentTarget);
    $('.hd', w).onclick = e => { const t = $('.dtxt', w); t.classList.toggle('blur'); e.target.textContent = t.classList.contains('blur') ? '본문 보기' : '본문 가리기'; };
    return w;
  }
  Object.assign(SC, { writeItem, freeItem, cloze, choiceItem, scramble, matchPics, pairMatch, sortBoard, flipGrid, clock, dclock, dialogHTML, clozeFromDialog, dialogBlock });

  /* ---------- 섹션 도우미 ---------- */
  const sec = (id, html) => { const s = $('#sec-' + id); s.innerHTML = html; return s; };
  const put = (s, selr, ...nodes) => { const box = $(selr, s); nodes.forEach(n => box.appendChild(n)); return box; };
  Object.assign(SC, { sec, put, go: id => { location.hash = '#/' + id; } });

  /* ---------- 표지 ---------- */
  function buildCover() {
    const cv = D.cover || {};
    const hero = cv.heroHTML || `<div class="hero-emo">${cv.emoji || '📘'}</div>`;
    const row = (k, v) => v && v.length ? `<tr><th>${k}</th><td>${v.join('<br>')}</td></tr>` : '';
    const s = sec('inicio', `
      <div class="cover">
        <div class="cover-hero ${cv.heroHTML ? '' : 'gen'}" style="${cv.bg ? 'background:' + cv.bg : ''}">${hero}
          <div class="badge"><small>Lección</small>${D.num}</div></div>
        <div class="cover-body">
          <h1>${D.title}</h1>
          <table class="obj">${row('Tema y vocabulario', cv.tema)}${row('Comunicación', cv.com)}${row('Gramática', cv.gram)}</table>
        </div>
      </div>
      <div class="grid2">
        <div class="card"><h3>👩‍🎓 학생 정보</h3><label class="lbl">이름 · Nombre</label><input id="stuName" class="inp wide" placeholder="이름을 쓰세요"><p class="small">이름은 성적표와 모의시험 결과지에 표시됩니다(모든 과 공통). 기록은 이 기기의 브라우저에만 저장돼요.</p></div>
        <div class="card center"><h3>📈 나의 진도</h3><div id="ring"></div><button class="btn big" id="goNext">이어서 학습하기 →</button></div>
      </div>
      <div class="card"><h3>✍️ 채점 표식 읽는 법</h3>
        <div class="legend">
          <div><span class="mk ok">○</span> 정답</div><div><span class="mk half">△</span> 부분 정답 (악센트 · ¿¡ 부호)</div><div><span class="mk no">✕</span> 오답 — 정답 예시가 나와요</div>
          <div><mark class="goodm">초록 형광펜</mark> 잘 쓴 핵심 구조</div><div><mark class="bad">빨간 펜<sup>1</sup></mark> 고칠 부분 (번호별 설명)</div>
          <div><span class="tl-demo">t<b class="tl">ú</b></span> 정답 속 악센트 · 부호 강조</div><div>${say(D.ttsTest || D.title)} 원어민 발음 듣기 — 소리가 안 나면 상단 <b>🔊 소리 점검</b></div>
        </div>
        <p class="small">모든 문항은 <b>직접 써서</b> 답하는 쓰기시험 형식입니다. Enter 키로도 채점할 수 있어요.</p>
      </div>`);
    const nm = $('#stuName', s); nm.value = getName(); nm.oninput = () => { setName(nm.value); };
    $('#goNext', s).onclick = () => { const nx = D.sections.find(x => x.id !== 'inicio' && x.id !== 'resultados' && secPct(x.id) < 0.999 && secCount(x.id) > 0); SC.go(nx ? nx.id : 'resultados'); };
  }

  /* ---------- Expresiones útiles + Proverbio (기본) ---------- */
  function buildUtil() {
    const P = D.proverbio;
    const s = sec('util', `<div class="note"><span class="clip">📎</span><span class="note-t">Expresiones útiles</span>
        <ul class="ul">${D.utiles.map(u => `<li>${say(u.es)} <b>${esc(u.es)}</b><small>${esc(u.kr || '')}</small></li>`).join('')}</ul></div>
      <h3 class="h3">✍️ 단어를 순서대로 배열하세요</h3><div class="items scr-wrap"></div>
      ${P ? `<div class="prov"><span class="prov-t">💬 Proverbio</span><p>¿Hay algún proverbio semejante en tu lengua?</p><p class="pv">${esc(P.es)} ${say(P.es)}</p><span class="det">${P.e || '🕵️'}</span></div><div class="items pq"></div>` : ''}`);
    const targets = D.utilScramble || D.utiles.map(u => u.es).filter(t => !/\//.test(t) && t.split(' ').length >= 3 && t.split(' ').length <= 9).slice(0, 6);
    targets.forEach((t, i) => put(s, '.scr-wrap', scramble({ id: 'ut-s' + i, sec: 'util', skill: D.utilSkill || Object.keys(D.skills)[0], target: t })));
    if (P && P.options) put(s, '.pq', choiceItem({ id: 'ut-p', sec: 'util', skill: 'voc', prompt: `"${esc(P.es)}"와 뜻이 가장 비슷한 우리말은?`, answer: P.answer, options: P.options, explain: P.kr }));
  }

  /* ---------- 쓰기 모의시험 ---------- */
  const GRADE = p => p >= 90 ? ['Sobresaliente', '최우수', 'g5'] : p >= 75 ? ['Notable', '우수', 'g4'] : p >= 60 ? ['Bien', '양호', 'g3'] : p >= 50 ? ['Suficiente', '보통', 'g2'] : ['¡Ánimo!', '노력 요함', 'g1'];
  function rubricOf() {
    const X = D.exam.partB;
    const minW = X.minWords || 50;
    return [{ k: 'ext', label: `분량 (${minW}단어 이상)`, max: 10, ax: 'Extensión' }, ...X.rubric,
      { k: 'con', label: `연결어 3종 이상 (${(X.connectors || ['y', 'pero', 'porque', 'también']).slice(0, 5).join(', ')} …)`, max: 10, ax: 'Cohesión' },
      { k: 'pre2', label: '정확성 (오류 1개당 −3)', max: 20, ax: 'Precisión' }];
  }
  function rubric(text) {
    const X = D.exam.partB, RUB = rubricOf(), minW = X.minWords || 50;
    const low = text.toLowerCase();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const errs = findErrors(text);
    const checks = [];
    const out = RUB.map(r => {
      let pts = 0, spans = [];
      if (r.k === 'ext') pts = words >= minW ? 10 : words >= minW * 0.66 ? 6 : words >= minW * 0.33 ? 3 : 0;
      else if (r.k === 'con') {
        const C = X.connectors || ['y', 'e', 'pero', 'porque', 'también', 'además', 'cuando', 'entonces', 'o'];
        const found = C.filter(c => new RegExp(W0 + acc(c) + W1, 'iu').test(low));
        pts = found.length >= 3 ? 10 : found.length * 3;
        C.filter(c => c.length > 2).forEach(c => [...low.matchAll(new RegExp(W0 + acc(c) + W1, 'giu'))].forEach(m => spans.push([m.index, m.index + m[0].length])));
      } else if (r.k === 'pre2') pts = words ? Math.max(0, 20 - 3 * errs.length) : 0;
      else { const ms = [...low.matchAll(new RegExp(W0 + '(' + r.re + ')' + W1, 'giu'))]; pts = ms.length >= (r.min || 1) ? r.max : ms.length ? Math.round(r.max / 2) : 0; spans = ms.map(m => [m.index, m.index + m[0].length]); }
      checks.push({ spans });
      return { ...r, pts };
    });
    const max = out.reduce((a, r) => a + r.max, 0);
    const total = out.reduce((a, r) => a + r.pts, 0) / max * 100;
    const axes = {}; out.forEach(r => { axes[r.ax] = axes[r.ax] || [0, 0]; axes[r.ax][0] += r.pts; axes[r.ax][1] += r.max; });
    return { out, total, words, errs, axes, html: annotate(text, checks, errs) };
  }
  function radar(labels, vals, size = 300) {
    const n = labels.length, c = size / 2, r = size / 2 - 58;
    const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v]; };
    let g = '';
    [0.25, 0.5, 0.75, 1].forEach(k => { g += `<polygon class="rg" points="${labels.map((_, i) => pt(i, k).join(',')).join(' ')}"/>`; });
    labels.forEach((l, i) => { const [x, y] = pt(i, 1); g += `<line class="rg" x1="${c}" y1="${c}" x2="${x}" y2="${y}"/>`; const [tx, ty] = pt(i, 1.2); g += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle">${esc(l)}</text>`; });
    g += `<polygon class="rv" points="${vals.map((v, i) => pt(i, Math.max(0.02, v)).join(',')).join(' ')}"/>`;
    vals.forEach((v, i) => { const [x, y] = pt(i, Math.max(0.02, v)); g += `<circle class="rd" cx="${x}" cy="${y}" r="4"/>`; });
    return `<svg class="radar" viewBox="0 0 ${size} ${size}" role="img">${g}</svg>`;
  }
  SC.radar = radar;

  function buildExam() {
    const X = D.exam, PB = X.partB, minW = PB.minWords || 50;
    const NQ = Math.min(10, X.bank.length);
    const s = sec('examen', `<div class="ribbon-head"><span class="ribbon orange">🎯 ¡Compruébalo!</span><span class="act-bar"></span></div>
      <div class="exam-top card"><div><h2 class="act-title">쓰기 모의시험 · Examen de escritura</h2>
        <p>Parte A 문법 쓰기 <b>${NQ}문항 (40점)</b> + Parte B 작문 <b>(60점)</b> = 100점. 제출 후 채점표와 첨삭이 나옵니다.</p></div>
        <div class="timer"><span id="tm">${String(X.minutes || 20).padStart(2, '0')}:00</span><button class="btn ghost sm" id="tmb">⏱ 타이머 시작</button></div></div>
      ${X.introHTML || ''}
      <div class="card"><h3>Parte A · 빈칸에 알맞은 말을 쓰세요 <button class="btn ghost sm" id="newA">🔀 새 문제</button></h3><ol class="exa"></ol></div>
      <div class="card"><h3>Parte B · ${PB.title || '글로 쓰기'}</h3>
        ${PB.icons ? `<div class="bubbles">${PB.icons.map(i => `<span>${i}</span>`).join('')}</div>` : ''}
        ${PB.html || ''}
        <ol class="qs" type="a">${PB.questions.map(q => `<li>${q}</li>`).join('')}</ol>
        <p class="small">위 질문에 모두 답하는 글을 <b>${minW}단어 이상</b> 쓰세요. ${PB.hint || ''}</p>
        <textarea id="essay" class="ta" rows="9" spellcheck="false" placeholder="${esc(PB.ph || '')}"></textarea>
        <div class="item-row"><span class="wc" id="ewc">0 palabras</span><button class="btn big" id="submit">📝 제출하고 채점받기</button></div></div>
      <div id="report"></div>`);
    if (!S.examA || S.examA.some(k => k >= X.bank.length)) S.examA = shuffle(X.bank.map((_, i) => i)).slice(0, NQ);
    const drawA = () => { $('.exa', s).innerHTML = S.examA.map(k => `<li><span class="ep">${X.bank[k].p}</span><input class="inp ea" data-k="${k}" autocomplete="off" spellcheck="false"><span class="mkbox"></span></li>`).join(''); };
    drawA();
    $('#newA', s).onclick = () => { S.examA = shuffle(X.bank.map((_, i) => i)).slice(0, NQ); save(); drawA(); };
    const es = $('#essay', s); es.value = S.essay || '';
    const wc = () => { $('#ewc', s).textContent = (es.value.trim() ? es.value.trim().split(/\s+/).length : 0) + ' palabras'; };
    es.oninput = () => { S.essay = es.value; save(); wc(); }; wc();
    let tmr = null, left = (X.minutes || 20) * 60;
    $('#tmb', s).onclick = e => {
      if (tmr) { clearInterval(tmr); tmr = null; e.target.textContent = '⏱ 다시 시작'; return; }
      e.target.textContent = '⏸ 일시정지';
      tmr = setInterval(() => { left--; $('#tm', s).textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`; if (left <= 0) { clearInterval(tmr); tmr = null; $('#tm', s).textContent = '¡Tiempo!'; $('#tm', s).classList.add('over'); } }, 1000);
    };
    $('#submit', s).onclick = () => {
      let aPts = 0;
      $$('.ea', s).forEach(inp => {
        const q = X.bank[+inp.dataset.k];
        const r = grade(inp.value || ' ', q.a);
        const sc = r.empty ? 0 : r.score;
        aPts += sc;
        inp.nextElementSibling.innerHTML = MARK(sc) + (sc < 1 ? ` <span class="ans">${tl(q.a[0])}</span>` : '');
        inp.classList.remove('ok', 'half', 'no'); inp.classList.add(sc >= 1 ? 'ok' : sc > 0 ? 'half' : 'no');
        (r.errs || []).forEach(e => { S.errors[e] = (S.errors[e] || 0) + 1; });
      });
      const A = Math.round(aPts / NQ * 40 * 10) / 10;
      const rb = rubric(es.value);
      const Bp = Math.round(rb.total * 0.6 * 10) / 10;
      const tot = Math.round(A + Bp);
      const [g, gk, gc] = GRADE(tot);
      rb.errs.forEach(x => { S.errors[x.t] = (S.errors[x.t] || 0) + 1; });
      S.exams.push({ d: new Date().toISOString().slice(0, 16).replace('T', ' '), A, B: Bp, t: tot });
      if (S.exams.length > 8) S.exams.shift();
      save();
      const axN = Object.keys(rb.axes);
      $('#report', s).innerHTML = `<div class="report card">
        <div class="rp-head"><div><h2>📋 Resultado del examen</h2><p>${esc(getName() || '이름 없음')} · Lección ${D.num} · ${new Date().toLocaleString('ko-KR')}</p></div>
          <div class="stamp ${gc}"><b>${tot}</b><small>/100</small><span>${g}</span><em>${gk}</em></div></div>
        <div class="grid2">
          <div><h3>점수 구성</h3>
            <div class="sbar"><span>Parte A 문법</span><div class="bar"><i style="width:${A / 40 * 100}%"></i></div><b>${A} / 40</b></div>
            <div class="sbar"><span>Parte B 작문</span><div class="bar"><i style="width:${Bp / 60 * 100}%"></i></div><b>${Bp} / 60</b></div>
            <h3>작문 채점표 (Rúbrica)</h3>
            <table class="rub">${rb.out.map(r => `<tr class="${r.pts >= r.max ? 'y' : r.pts > 0 ? 'h' : 'n'}"><td>${r.pts >= r.max ? '✔' : r.pts > 0 ? '△' : '✘'}</td><td>${r.label}</td><td>${r.pts} / ${r.max}</td></tr>`).join('')}</table></div>
          <div class="center"><h3>작문 영역 레이더</h3>${radar(axN, axN.map(k => rb.axes[k][0] / rb.axes[k][1]))}
            <p class="small">${rb.words} palabras · 오류 ${rb.errs.length}개</p></div></div>
        <h3>✍️ 빨간 펜 첨삭</h3>${es.value.trim() ? rb.html : '<p class="warn">작문을 쓰지 않았어요.</p>'}
        ${PB.model ? `<details class="model"><summary>모범 답안 보기</summary>${say(PB.model)} ${esc(PB.model)}</details>` : ''}
        <div class="item-row"><button class="btn" onclick="window.print()">🖨 결과지 인쇄 / PDF</button><a class="btn ghost" href="#/resultados">📊 전체 성적표 보기</a></div></div>`;
      $('#report', s).scrollIntoView({ behavior: 'smooth' });
    };
  }

  /* ---------- 성적표 ---------- */
  const secItems = id => Object.keys(REG).filter(k => REG[k].sec === id);
  const secCount = id => secItems(id).length;
  const secPct = id => { const it = secItems(id); if (!it.length) return 0; return it.reduce((a, k) => a + (S.items[k] ? S.items[k].last : 0), 0) / it.length; };
  const secDone = id => { const it = secItems(id); return it.length ? it.filter(k => S.items[k]).length / it.length : 0; };
  function renderResults() {
    const skills = Object.keys(D.skills);
    const sv = skills.map(k => { const it = Object.keys(REG).filter(x => REG[x].skill === k); return it.length ? it.reduce((a, x) => a + (S.items[x] ? S.items[x].last : 0), 0) / it.length : 0; });
    const all = Object.keys(REG), tot = all.reduce((a, k) => a + (S.items[k] ? S.items[k].last : 0), 0) / all.length;
    const done = all.filter(k => S.items[k]).length;
    const pct = Math.round(tot * 100);
    const [g, gk, gc] = GRADE(pct);
    const errMax = Math.max(1, ...Object.values(S.errors));
    const errs = Object.keys(S.errors).filter(k => ERR_LABEL[k] && S.errors[k]).sort((a, b) => S.errors[b] - S.errors[a]);
    sec('resultados', `<div class="ribbon-head"><span class="ribbon red">📊 Resultados</span><span class="act-bar"></span></div>
      <div class="report card"><div class="rp-head"><div><h2>Lección ${D.num} 성적표</h2><p>${esc(getName() || '이름 없음')} · ${esc(D.title)} · 푼 문항 ${done} / ${all.length}</p></div>
        <div class="stamp ${gc}"><b>${pct}</b><small>%</small><span>${g}</span><em>${gk}</em></div></div>
      <div class="grid2"><div><h3>섹션별 점수</h3>${D.sections.filter(x => secCount(x.id)).map(x => { const p = Math.round(secPct(x.id) * 100), d = Math.round(secDone(x.id) * 100); return `<a class="sbar" href="#/${x.id}"><span>${x.label}</span><div class="bar"><i style="width:${p}%"></i><u style="width:${d}%"></u></div><b>${p}%</b></a>`; }).join('')}
        <p class="small">진한 막대 = 점수, 옅은 막대 = 푼 비율</p></div>
        <div class="center"><h3>영역별 실력 레이더</h3>${radar(skills.map(k => D.skills[k].split(' ')[0]), sv, 320)}
        <div class="sk">${skills.map((k, i) => `<span>${D.skills[k]} <b>${Math.round(sv[i] * 100)}%</b></span>`).join('')}</div></div></div>
      <h3>🔍 자주 하는 실수 (오답 유형)</h3>${errs.length ? errs.map(k => `<div class="ebar"><span class="etag e-${k}">${ERR_LABEL[k]}</span><div class="bar r"><i style="width:${S.errors[k] / errMax * 100}%"></i></div><b>${S.errors[k]}회</b><p>${ERR_TIP[k] || ''}</p></div>`).join('') : '<p class="small">아직 기록된 실수가 없어요.</p>'}
      <h3>📝 모의시험 기록</h3>${S.exams.length ? `<div class="hist">${S.exams.map(e => `<div class="hc"><div class="hb" style="height:${e.t}%"><b>${e.t}</b></div><small>${e.d.slice(5)}</small></div>`).join('')}</div>` : '<p class="small">¡Compruébalo! 에서 모의시험을 치러 보세요.</p>'}
      <div class="item-row"><button class="btn" onclick="window.print()">🖨 성적표 인쇄 / PDF</button><a class="btn ghost" href="../">🏠 전체 과 목록</a><button class="btn ghost" id="reset">이 과 기록 초기화</button></div></div>`);
    $('#reset').onclick = () => { if (confirm(`Lección ${D.num}의 모든 학습 기록을 지울까요?`)) { try { localStorage.removeItem(KEY); } catch (e) { } location.hash = '#/inicio'; location.reload(); } };
  }

  /* ---------- 네비게이션 · 진도 ---------- */
  function ring(p) {
    const r = 52, c = 2 * Math.PI * r;
    return `<svg viewBox="0 0 130 130" class="ring"><circle cx="65" cy="65" r="${r}" class="rb"/><circle cx="65" cy="65" r="${r}" class="rf" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/><text x="65" y="70" text-anchor="middle">${Math.round(p * 100)}%</text></svg>`;
  }
  function updateProgress() {
    const all = Object.keys(REG); if (!all.length) return;
    const done = all.filter(k => S.items[k]).length / all.length;
    const bar = $('#topbar i'); if (bar) bar.style.width = (done * 100) + '%';
    const lb = $('#toplbl'); if (lb) lb.textContent = `진도 ${Math.round(done * 100)}%`;
    const rg = $('#ring'); if (rg) rg.innerHTML = ring(done);
    $$('#nav a[data-id]').forEach(a => { const id = a.dataset.id, n = secCount(id); const d = $('.dot', a); if (!d) return; const p = n ? secDone(id) : 0; d.className = 'dot ' + (n === 0 ? '' : p >= 1 ? 'full' : p > 0 ? 'part' : ''); });
  }
  function buildNav() {
    const nav = $('#nav'); let grp = null, html = '';
    D.sections.forEach(x => {
      if (x.group !== grp) { grp = x.group; if (grp) html += `<div class="ng">${grp}</div>`; }
      const badge = x.kind === 'act' ? `<span class="nb">${x.n}</span>` : x.kind === 'dialogo' ? '<span class="nb d">D</span>' : '';
      html += `<a href="#/${x.id}" data-id="${x.id}">${badge}<span class="nl"><b>${x.label}</b><small>${x.kr}</small></span><span class="dot"></span></a>`;
    });
    nav.innerHTML = html;
  }
  function route() {
    const id = (location.hash.match(/^#\/(\w+)/) || [])[1] || 'inicio';
    const x = D.sections.find(z => z.id === id) || D.sections[0];
    $$('main > section').forEach(s => s.hidden = s.id !== 'sec-' + x.id);
    $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.id === x.id));
    if (x.id === 'resultados') renderResults();
    const i = D.sections.indexOf(x), pv = D.sections[i - 1], nx = D.sections[i + 1];
    $('#pager').innerHTML = `${pv ? `<a class="btn ghost" href="#/${pv.id}">← ${pv.label}</a>` : '<span></span>'}${nx ? `<a class="btn" href="#/${nx.id}">${nx.label} →</a>` : `<a class="btn" href="../">🏠 전체 과 목록</a>`}`;
    document.body.classList.remove('navopen');
    window.scrollTo(0, 0);
    updateProgress();
    PM_LIST.forEach(f => f());
  }

  /* ---------- 특수문자 입력 버튼 ---------- */
  function buildKeys() {
    const LOW = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
    const bar = el(`<div id="keys" class="keys" aria-label="특수문자 입력" hidden>
      <span class="keys-l">특수문자</span>
      <div class="keys-row">${LOW.map(c => `<button type="button" class="key" data-c="${c}">${c}</button>`).join('')}
      <button type="button" class="key shift" title="대문자 전환 (Á É Í Ó Ú Ñ)">⇧</button></div>
      <span class="keys-h">악센트 문자를 눌러 넣으세요</span></div>`);
    document.body.appendChild(bar);
    let target = null, upper = false, hideT = null;
    const isField = n => n && n.matches && n.matches('main input[type="text"], main input:not([type]), main textarea');
    const paintKeys = () => { $$('.key[data-c]', bar).forEach(b => { const c = b.dataset.c; b.textContent = upper ? c.toUpperCase() : c; }); $('.shift', bar).classList.toggle('on', upper); };
    const place = () => { const vv = window.visualViewport; bar.style.bottom = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) + 'px' : '0px'; };
    const show = f => {
      clearTimeout(hideT); target = f; bar.hidden = false; document.body.classList.add('keys-on'); place();
      requestAnimationFrame(() => { const r = f.getBoundingClientRect(), top = bar.getBoundingClientRect().top; if (r.bottom > top - 8) window.scrollBy({ top: r.bottom - top + 24, behavior: 'smooth' }); });
    };
    document.addEventListener('focusin', e => { if (isField(e.target)) show(e.target); });
    document.addEventListener('focusout', e => { if (isField(e.target)) hideT = setTimeout(() => { if (!isField(document.activeElement)) { bar.hidden = true; document.body.classList.remove('keys-on'); } }, 150); });
    let caret = { s: null, e: null };
    const remember = ev => { const t = ev.target; if (isField(t) && t === target) { caret = { s: t.selectionStart, e: t.selectionEnd }; } };
    ['keyup', 'mouseup', 'input', 'select', 'touchend'].forEach(k => document.addEventListener(k, remember, true));
    document.addEventListener('focusin', e => { if (isField(e.target)) caret = { s: e.target.selectionStart, e: e.target.selectionEnd }; });
    function insert(ch) {
      const t = target; if (!t || !document.body.contains(t)) return;
      const v = t.value;
      let s = t.selectionStart, en = t.selectionEnd;
      if (document.activeElement !== t || s == null) { s = caret.s ?? v.length; en = caret.e ?? s; }
      t.value = v.slice(0, s) + ch + v.slice(en);
      const p = s + ch.length;
      try { t.focus({ preventScroll: true }); } catch (_) { t.focus(); }
      try { t.setSelectionRange(p, p); } catch (_) { }
      caret = { s: p, e: p };
      t.dispatchEvent(new Event('input', { bubbles: true }));
    }
    function press(e, b) {
      if (b.classList.contains('shift')) { upper = !upper; paintKeys(); return; }
      insert((upper || e.shiftKey) ? b.dataset.c.toUpperCase() : b.dataset.c);
      if (upper) { upper = false; paintKeys(); }
      b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 120);
    }
    let lastTouch = 0;
    bar.addEventListener('touchstart', e => { const b = e.target.closest('.key'); e.preventDefault(); lastTouch = Date.now(); if (b) press(e, b); }, { passive: false });
    bar.addEventListener('mousedown', e => { e.preventDefault(); if (Date.now() - lastTouch < 800 || e.button !== 0) return; const b = e.target.closest('.key'); if (b) press(e, b); });
    bar.addEventListener('click', e => { if (e.detail !== 0) return; const b = e.target.closest('.key'); if (b) press(e, b); });
    if (window.visualViewport) { visualViewport.addEventListener('resize', place); visualViewport.addEventListener('scroll', place); }
  }

  /* ---------- 시작 ---------- */
  function shell() {
    document.title = `Lección ${D.num} · ${D.title.replace(/<[^>]+>/g, '')} — 스페인어 회화 I 쓰기시험 대비`;
    document.body.insertAdjacentHTML('afterbegin', `<header class="top">
  <button id="menu" class="menu" aria-label="메뉴">☰</button>
  <a class="brand" href="#/inicio"><span class="lb">Lección<b>${D.num}</b></span><span class="bt">${D.title}<small>스페인어 회화 I · 쓰기시험 대비</small></span></a>
  <button id="sndBtn" class="sndbtn" title="소리 점검">🔊<span> 소리 점검</span></button>
  <div class="prog"><span id="toplbl">진도 0%</span><div id="topbar"><i></i></div></div>
  <a class="home" href="../" title="전체 과 목록">🏠<span> 전체 과</span></a>
</header>
<div class="wrap"><nav id="nav" aria-label="목차"></nav><main><div id="pager" class="pager"></div></main></div>
<footer class="foot">다인원격평생교육직업학원 · 후안샘 스페인어 · Lección ${D.num} 「${D.title}」 학습용 — 기록은 이 브라우저에만 저장됩니다.</footer>`);
  }
  function init() {
    shell();
    buildNav();
    buildKeys();
    const main = $('main');
    D.sections.forEach(x => { const s = document.createElement('section'); s.id = 'sec-' + x.id; s.hidden = true; main.insertBefore(s, $('#pager')); });
    const B = Object.assign({ inicio: buildCover, util: buildUtil, examen: buildExam, resultados: () => { } }, D.build || {});
    D.sections.forEach(x => {
      if (!B[x.id]) return;
      try { B[x.id](); } catch (err) { console.error('섹션 오류', x.id, err); const s = $('#sec-' + x.id); s.insertAdjacentHTML('beforeend', `<p class="warn">이 섹션을 불러오는 중 오류가 났어요: ${esc(err.message)}</p>`); }
    });
    window.addEventListener('hashchange', route);
    $('#menu').onclick = () => document.body.classList.toggle('navopen');
    $('#sndBtn').onclick = openCheck;
    route();
    saveSummary();
  }

  SC.lesson = function (cfg) {
    D = cfg;
    D.num = String(D.num).padStart(2, '0');
    KEY = 'spa_con_L' + D.num + '_v1';
    load();
    Object.assign(ERR_LABEL, D.errLabels || {});
    Object.assign(ERR_TIP, D.errTips || {});
    ACC_RE = [...new Set([...BASE_ACC, ...(D.accWords || [])])].map(w => ({ w, re: new RegExp(W0 + acc(w) + W1, 'giu') }));
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  };
})();
