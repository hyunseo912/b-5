/* ===== 02 모임 생성 ===== */
V.create=()=>{const m=S.meeting&&S.meeting._fresh?S.meeting:null;return `<div class="screen fixed">${head("새로운 모임 만들기","home")}
<div class="body" style="gap:20px;padding-top:16px">
  <div class="field"><label for="mname">모임 이름</label><input id="mname" class="inp" placeholder="예: 팀 회식" value="${esc(S.draftName||"")}" oninput="S.draftName=this.value"></div>
  ${S.err.name?`<p class="err">${S.err.name}</p>`:""}
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
function makeLink(){const n=(S.draftName||"").trim();if(!n){S.err={name:"모임 이름을 입력해 주세요"};render();return;}S.meeting=newMeeting(n);S.meeting._fresh=true;S.joinCode=S.meeting.code;render();}
