/* ===== 02 모임 생성 ===== */
// 한 화면에 다 보이도록 이 화면만 입력칸·버튼·박스를 조금 작게 (공용 style.css는 그대로)
const CR={lab:"font-size:15px",inp:"height:46px;font-size:16px;border-radius:14px",btn:"height:48px;font-size:16px",
  box:"height:52px;padding:6px 8px 6px 14px;border-radius:14px",k:"font-size:12px;line-height:1.3",v:"font-size:15px;line-height:1.35",sm:"height:30px;padding:0 13px;font-size:13px"};
// 날짜 투표 기간: 시작일 + n일 / 시작일 기준 최대 마감일(3개월 뒤 전날). 마감일을 직접 안 고르면 시작일 + 2주
const dayAdd=(k,n)=>{const[y,m,d]=k.split("-").map(Number);return ymd(new Date(y,m-1,d+n));};
const endMax=k=>{const[y,m,d]=k.split("-").map(Number);return ymd(new Date(y,m-1+3,d-1));};
const draftEnd=st=>S.draftEnd||dayAdd(st,13);
V.create=()=>{const m=S.meeting&&S.meeting._fresh?S.meeting:null,today=ymd(),st=S.draftStart||today,en=draftEnd(st);return `<div class="screen">${head("새로운 모임 만들기","home")}
<div class="body" style="gap:12px;padding-top:4px">
  <div class="field" style="gap:6px"><label for="mname" style="${CR.lab}">모임 이름</label><input id="mname" class="inp" style="${CR.inp}" placeholder="예: 팀 회식" value="${esc(S.draftName||"")}" oninput="S.draftName=this.value"></div>
  ${S.err.name?`<p class="err">${S.err.name}</p>`:""}
  <div class="field" style="gap:6px"><label for="mstart" style="${CR.lab}">날짜 투표 기간</label>
    <div style="display:flex;align-items:center;gap:6px"><input id="mstart" type="date" aria-label="시작일" class="inp" style="${CR.inp};flex:1;min-width:0;padding:0 10px;font-size:15px" min="${today}" value="${esc(st)}" onchange="S.draftStart=this.value;render()">
    <span style="color:var(--text2)">~</span>
    <input id="mend" type="date" aria-label="마감일" class="inp" style="${CR.inp};flex:1;min-width:0;padding:0 10px;font-size:15px" min="${esc(st)}" max="${esc(endMax(st))}" value="${esc(en)}" onchange="S.draftEnd=this.value"></div>
    <p class="hint">참여자는 이 기간 안에서만 날짜를 골라요 (최대 3개월)</p></div>
  ${S.err.start?`<p class="err">${S.err.start}</p>`:""}
  <button class="btn btn-primary" style="${CR.btn}" onclick="makeLink()">초대장 링크 생성</button>
  ${m?`<div style="display:flex;flex-direction:column;gap:8px;margin-top:2px">
    ${/* 모임 코드·초대 링크를 한 칸에 보여주고, 버튼 하나로 둘 다 복사 */""}
    <div class="box" style="height:auto;display:block;padding:10px 14px;border-radius:14px">
      <p class="k" style="${CR.k}">모임 코드</p><p class="v" style="font-size:18px;letter-spacing:.06em;margin-bottom:4px">${m.code}</p>
      <p class="k" style="${CR.k}">초대 링크</p><p class="v" style="${CR.v}">${esc(m.link)}</p></div>
    <button class="btn btn-primary" style="${CR.btn}" onclick="copyInvite(this)">초대장 복사하기</button>
    <p class="note" style="font-size:14px">복사해서 모임 참여자에게 전달하세요</p>
  </div>
  <div style="margin-top:14px;display:flex;flex-direction:column;gap:6px">
    <button class="btn btn-soft" style="${CR.btn}" onclick="S.joinCode=S.meeting.code;go('join')">초대 링크로 입장하기</button>
    <p class="note2" style="font-size:13px">방장님도 초대 링크로 입장해서 투표해 주세요</p>
  </div>`:""}
</div></div>`;};
function makeLink(){const n=(S.draftName||"").trim(),st=S.draftStart||ymd();S.err={};
  if(!n){S.err={name:"모임 이름을 입력해 주세요"};render();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(st)||st<ymd()){S.err={start:"시작일은 오늘 이후 날짜로 골라 주세요"};render();return;}
  const en=draftEnd(st);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(en)||en<st){S.err={start:"마감일은 시작일 이후로 골라 주세요"};render();return;}
  if(en>endMax(st)){S.err={start:"마감일은 시작일부터 3개월 안으로 골라 주세요"};render();return;}
  S.meeting=newMeeting(n);S.meeting.start=st;S.meeting.end=en;S.draftEnd="";S.meeting._fresh=true;render();}
