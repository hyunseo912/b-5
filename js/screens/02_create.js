/* ===== 02 모임 생성 ===== */
V.create=()=>{const m=S.meeting&&S.meeting._fresh?S.meeting:null,today=ymd();return `<div class="screen">${head("새로운 모임 만들기","home")}
<div class="body" style="gap:20px;padding-top:16px">
  <div class="field"><label for="mname">모임 이름</label><input id="mname" class="inp" placeholder="예: 팀 회식" value="${esc(S.draftName||"")}" oninput="S.draftName=this.value"></div>
  ${S.err.name?`<p class="err">${S.err.name}</p>`:""}
  <div class="field"><label for="mstart">날짜 투표 시작일</label><input id="mstart" type="date" class="inp" min="${today}" value="${esc(S.draftStart||today)}" onchange="S.draftStart=this.value"><p class="hint">이날부터 3개월 안에서 참여자가 날짜를 고를 수 있어요</p></div>
  ${S.err.start?`<p class="err">${S.err.start}</p>`:""}
  <button class="btn btn-primary" onclick="makeLink()">초대장 링크 생성</button>
  ${m?`<div style="display:flex;flex-direction:column;gap:12px;margin-top:6px">
    <div class="box"><div><p class="k">모임 코드 (6자리)</p><p class="v">${m.code}</p></div><button class="btn-sm" onclick="copy('${m.code}',this)">복사</button></div>
    <div class="box"><div><p class="k">초대 링크</p><p class="v">${esc(m.link)}</p></div><button class="btn-sm" onclick="copy('${esc(m.link)}',this)">복사</button></div>
    <p class="note" style="margin-top:4px">복사해서 모임 참여자에게 전달하세요</p>
  </div>
  <div style="margin-top:40px;display:flex;flex-direction:column;gap:10px">
    <button class="btn btn-soft" onclick="go('join')">초대 링크로 입장하기</button>
    <p class="note2">방장님도 초대 링크로 입장해서 투표해 주세요</p>
  </div>`:""}
</div></div>`;};
function makeLink(){const n=(S.draftName||"").trim(),st=S.draftStart||ymd();S.err={};
  if(!n){S.err={name:"모임 이름을 입력해 주세요"};render();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(st)||st<ymd()){S.err={start:"오늘 이후 날짜를 골라 주세요"};render();return;}
  S.meeting=newMeeting(n);S.meeting.start=st;S.meeting._fresh=true;S.joinCode=S.meeting.code;render();}
