/* ===== 01 진입 ===== */
// 역할별 구성: [방장] 모임 만들기 / [투표하기] 초대 코드로 입장(방장도 여기서 투표) / 간격 후 결과 보기·데모를 작게 나란히
// 작은 폰에서도 데모 버튼까지 스크롤 없이 보이도록 그림 높이를 화면 높이에 맞춰 줄임(최대 440px)
const HM={lab:"font-size:13px;font-weight:700;color:var(--accent);padding-left:6px",grp:"display:flex;flex-direction:column;gap:6px;flex-shrink:0",
  sub:"height:44px;font-size:14px;flex:1;min-width:0;padding:0 8px"};
V.home=()=>`<div class="entry"><div class="hero" style="height:clamp(170px,calc(100dvh - 470px),440px)"><img src="img/hero.jpg" alt="동글동글한 친구들이 파란 하늘 아래에서 반갑게 내려다보는 그림"></div>
  <div class="entry-main">
    <h2 style="margin:4px 0 2px">링크 하나로<span>1분 만에 모임 완성</span></h2>
    <div style="${HM.grp}"><p style="${HM.lab}">방장</p>
      <button class="btn btn-primary" onclick="go('create')">+ 새로운 모임 만들기</button></div>
    <div style="${HM.grp}"><p style="${HM.lab}">투표하기</p>
      <button class="btn btn-soft" onclick="go('join')">초대 코드로 입장하기</button>
      <p class="note2" style="font-size:12px">방장님도 여기서 투표해요</p></div>
    <div style="display:flex;gap:8px;margin-top:8px;flex-shrink:0">
      <button class="btn btn-ghost" style="${HM.sub}" onclick="openDash()">모임 결과 보기</button>
      <button class="btn btn-ghost" style="${HM.sub}" onclick="loadDemo()">⚡ 1초 데모 데이터</button></div>
    <div class="brand"><b aria-label="당장만나"><i>당</i><i>장</i><i>만</i><i>나</i></b><p>날짜 · 장소 · 메뉴, 지금 바로 정해요</p></div>
  </div></div>`;
function loadDemo(){const m=DATA.meeting;S.meeting=newMeeting(m.name,m.code);S.meeting.link=m.inviteLink;S.meeting.people=JSON.parse(JSON.stringify(DATA.participants));S.recIdx=0;S.notesOpen=false;go("dash");}
function openDash(){if(!S.meeting){toast("아직 만든 모임이 없어요.\n새 모임을 만들거나 데모 데이터를 채워 보세요");return;}go("dash");}
