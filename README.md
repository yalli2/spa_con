# Conversación I · 스페인어 회화 I — 쓰기시험 대비 인터랙티브 사이트

스페인어 회화 I 교재 **12과 전체**를 국제학교 수업에서 쓰기 위한 인터랙티브 학습 사이트입니다.
모든 과가 Lección 09 「Me gusta mucho viajar」와 같은 포맷으로 구성되어 있습니다.

- 사이트: https://yalli2.github.io/spa_con/
- 과별 주소: https://yalli2.github.io/spa_con/L01/ … /L12/

## 각 과 구성
Portada(학습목표) → Antes de empezar(어휘) → Gramática(문법 정리) → Diálogo 1 · Actividades → Diálogo 2 · Actividades
→ Expresiones útiles · Proverbio → ¡Compruébalo!(쓰기 모의시험 100점) → Resultados(성적표)

- 채점: ○ 정답 / △ 악센트·¿¡ 부호만 틀림 / ✕ 오답 + 정답 예시, 자유작문은 체크리스트 + 초록 형광펜 + 빨간 펜 첨삭
- 교재 도표 재현: 짝 맞추기(선 연결), 그림 카드 연결, 표 분류, 낱말 카드, 시계, 지도·가족 나무 등
- 성적표: 섹션별 막대, 영역별 레이더, 자주 하는 실수, 모의시험 기록
- 🔊 원어민 발음 듣기(브라우저 음성), 특수문자(á é í ó ú ñ ¿ ¡) 입력 버튼
- 기록은 학생 브라우저(localStorage)에만 저장됩니다. 학생 이름은 모든 과에서 공유돼요.

## 파일 구조
```
index.html            12과 목차(허브) — 과별 진도 표시
common/engine.js      공통 엔진 (채점 · 컴포넌트 · 성적표 · 모의시험 · 특수문자)
common/style.css      공통 디자인
L01 … L12/index.html  과별 페이지
L01 … L12/lesson.js   과별 학습 데이터와 활동 구성
```
