/* ===== 02 모임 생성 ===== */
// 한 화면에 다 보이도록 이 화면만 입력칸·버튼·박스를 조금 작게 (공용 style.css는 그대로)
const CR={lab:"font-size:15px",inp:"height:46px;font-size:16px;border-radius:14px",btn:"height:48px;font-size:16px",
  box:"height:52px;padding:6px 8px 6px 14px;border-radius:14px",k:"font-size:12px;line-height:1.3",v:"font-size:15px;line-height:1.35",sm:"height:30px;padding:0 13px;font-size:13px"};
V.create=()=>{const m=S.meeting&&S.meeting._fresh?S.meeting:null,today=ymd();return `<div class="screen">${head("새로운 모임 만들기","home")}
<div class="body" style="gap:12px;padding-top:4px">
  <div class="field" style="gap:6px"><label for="mname" style="${CR.lab}">모임 이름</label><input id="mname" class="inp" style="${CR.inp}" placeholder="예: 팀 회식" value="${esc(S.draftName||"")}" oninput="S.draftName=this.value"></div>
  ${S.err.name?`<p class="err">${S.err.name}</p>`:""}
  <div class="field" style="gap:6px"><label for="mstart" style="${CR.lab}">날짜 투표 시작일</label><input id="mstart" type="date" class="inp" style="${CR.inp}" min="${today}" value="${esc(S.draftStart||today)}" onchange="S.draftStart=this.value"><p class="hint">이날부터 3개월 안에서 참여자가 날짜를 고를 수 있어요</p></div>
  ${S.err.start?`<p class="err">${S.err.start}</p>`:""}
  <button class="btn btn-primary" style="${CR.btn}" onclick="makeLink()">초대장 링크 생성</button>
  ${m?`<div style="display:flex;flex-direction:column;gap:8px;margin-top:2px">
    <div class="box" style="${CR.box}"><div><p class="k" style="${CR.k}">모임 코드 (6자리)</p><p class="v" style="${CR.v}">${m.code}</p></div><button class="btn-sm" style="${CR.sm}" onclick="copy('${m.code}',this)">복사</button></div>
    <div class="box" style="${CR.box}"><div><p class="k" style="${CR.k}">초대 링크</p><p class="v" style="${CR.v}">${esc(m.link)}</p></div><button class="btn-sm" style="${CR.sm}" onclick="copy('${esc(m.link)}',this)">복사</button></div>
    <p class="note" style="font-size:14px">복사해서 모임 참여자에게 전달하세요</p>
  </div>
  <div style="margin-top:24px;display:flex;flex-direction:column;gap:6px">
    <button class="btn btn-soft" style="${CR.btn}" onclick="go('join')">초대 링크로 입장하기</button>
    <p class="note2" style="font-size:13px">방장님도 초대 링크로 입장해서 투표해 주세요</p>
  </div>`:""}
</div></div>`;};
function makeLink(){const n=(S.draftName||"").trim(),st=S.draftStart||ymd();S.err={};
  if(!n){S.err={name:"모임 이름을 입력해 주세요"};render();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(st)||st<ymd()){S.err={start:"오늘 이후 날짜를 골라 주세요"};render();return;}
  S.meeting=newMeeting(n);S.meeting.start=st;S.meeting._fresh=true;S.joinCode=S.meeting.code;render();}
