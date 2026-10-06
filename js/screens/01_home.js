/* ===== 01 진입 ===== */
V.home=()=>`<div class="entry"><div class="hero"><img src="img/hero.jpg" alt="동글동글한 친구들이 파란 하늘 아래에서 반갑게 내려다보는 그림"></div>
  <div class="entry-main">
    <h2>링크 하나로<span>1분 만에 모임 완성</span></h2>
    <button class="btn btn-primary" onclick="go('create')">+ 새로운 모임 만들기</button>
    <button class="btn btn-soft" onclick="openDash()">기존 모임 확인하기</button>
    <button class="btn btn-ghost" onclick="loadDemo()">⚡ 1초 데모 데이터 채우기</button>
    <div class="brand"><b aria-label="당장만나"><i>당</i><i>장</i><i>만</i><i>나</i></b><p>날짜 · 장소 · 메뉴, 지금 바로 정해요</p></div>
  </div></div>`;
function loadDemo(){const m=DATA.meeting;S.meeting=newMeeting(m.name,m.code);S.meeting.link=m.inviteLink;S.meeting.people=JSON.parse(JSON.stringify(DATA.participants));S.recIdx=0;S.notesOpen=false;go("dash");}
function openDash(){if(!S.meeting){toast("아직 만든 모임이 없어요. 새 모임을 만들거나 데모 데이터를 채워 보세요");return;}go("dash");}
