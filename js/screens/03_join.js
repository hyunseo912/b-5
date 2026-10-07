/* ===== 03 초대장 열기 ===== */
// ‹ 뒤로: 모임 생성 화면에서 들어왔으면 그 화면(코드·초대장이 보이는 상태)으로, 아니면 첫 화면으로
V.join=()=>`<div class="screen fixed">${head("초대장 열기",S.joinFrom==="create"?"create":"home")}
<div class="body" style="gap:22px;padding-top:20px">
  <div class="field"><label for="jcode">모임 코드</label><input id="jcode" class="inp" maxlength="6" placeholder="예: A1B2C3" value="${esc(S.joinCode||"")}" oninput="S.joinCode=this.value.toUpperCase();this.value=S.joinCode" autocapitalize="characters">${S.err.code?`<p class="err">${S.err.code}</p>`:""}</div>
  <div class="field"><label for="jid">참여자 ID <small>(이름 + 전화번호 뒷 4자리)</small></label><input id="jid" class="inp" placeholder="예: 김삼일3131" value="${esc(S.joinId||"")}" oninput="S.joinId=this.value.trim()">${S.err.id?`<p class="err">${S.err.id}</p>`:""}</div>
  <div class="field"><label for="jnote">확인해주세요 <small>(선택)</small></label><input id="jnote" class="inp" placeholder="예: 갑각류 알레르기, 매운 거 못 먹어요" value="${esc(S.joinNote||"")}" oninput="S.joinNote=this.value"><p class="hint">알레르기나 못 먹는 음식을 적어주시면 메뉴 추천에서 빼드려요</p></div>
  <button class="btn btn-primary" style="margin-top:6px" onclick="enter()">입장하기</button>
</div></div>`;
// 모임 코드는 자동으로 채우지 않음(예시만 보임). 입장에 성공하면 다음 사람을 위해 비움
function enter(){const code=(S.joinCode||"").trim(),id=(S.joinId||"").trim();S.err={};
  {const m=findMeeting(code);if(m)S.meeting=m;else S.err.code="모임 코드를 다시 확인해 주세요";} // 이 기기에 저장된 모임이면 어느 모임이든 입장
  if(!/^[가-힣A-Za-z]{1,10}\d{4}$/.test(id))S.err.id="이름 뒤에 전화번호 뒷 4자리를 붙여 주세요 (예: 김삼일3131)";
  if(Object.keys(S.err).length){render();return;}
  const prev=S.meeting.people.find(p=>p.id===id);
  S.draft=prev?JSON.parse(JSON.stringify(prev)):{id,isHost:false,note:"",slots:[],places:[],likes:[],dislikes:[],drink:null};
  if(S.joinNote&&S.joinNote.trim())S.draft.note=S.joinNote.trim();
  S.activeDay=S.draft.slots.length?S.draft.slots.slice().sort()[0].split("|")[0]:null;
  S.joinCode="";go("respond");if(prev)toast("이전 응답을 불러왔어요");}
