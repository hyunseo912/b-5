/* ===== 07 모임 결과 보기 (모임 고르기) ===== */
// 첫 화면 [모임 결과 보기] → 모임 코드로 찾기 + 이 기기에 저장된 모임 목록(최근 순). 정적 웹이라 이 기기의 모임만 찾을 수 있음
V.find=()=>{const list=myMeetings();return `<div class="screen">${head("모임 결과 보기","home")}
<div class="body" style="gap:16px;padding-top:4px">
  <div class="field" style="gap:6px"><label for="fcode" style="font-size:15px">모임 코드로 찾기</label>
    <div style="display:flex;gap:8px"><input id="fcode" class="inp" style="height:46px;font-size:16px;border-radius:14px;flex:1;min-width:0;letter-spacing:.05em" maxlength="6" placeholder="예: K7M2Q9" autocapitalize="characters" value="${esc(S.findCode||"")}" oninput="S.findCode=this.value.toUpperCase();this.value=S.findCode" onkeydown="if(event.key==='Enter')openMeeting(S.findCode)">
    <button class="btn btn-primary" style="width:auto;height:46px;font-size:15px;padding:0 20px;flex-shrink:0" onclick="openMeeting(S.findCode)">열기</button></div>
    ${S.err.find?`<p class="err">${S.err.find}</p>`:""}</div>
  <div style="display:flex;flex-direction:column;gap:8px">
    <p style="font-size:15px;font-weight:600;color:var(--text2);padding-left:2px">이 기기의 모임</p>
    ${list.length?list.map(m=>`<div style="display:flex;gap:8px;align-items:stretch"><button class="card" style="flex-direction:row;align-items:center;text-align:left;flex:1;min-width:0;cursor:pointer" onclick="openMeeting('${esc(m.code)}')">
      <span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.name)}</b>
      <span class="rn" style="font-size:13px">${esc(m.code)} · 참여 ${m.people.length}명${m.start?` · ${esc(slotLabel(m.start+"|").trim())}${m.end?` ~ ${esc(slotLabel(m.end+"|").trim())}`:" 시작"}`:""}</span></span>
      <span style="font-size:20px;color:var(--text2)" aria-hidden="true">›</span></button>
      <button class="btn btn-ghost" style="width:auto;height:auto;padding:0 14px;flex-shrink:0" aria-label="${esc(m.name)} 모임 삭제" onclick="askDelMeeting('${esc(m.code)}')">삭제</button></div>`).join("")
    :`<p class="rn" style="padding:4px 2px">아직 이 기기에서 만든 모임이 없어요. 새 모임을 만들거나 ⚡ 1초 데모 데이터를 눌러 보세요</p>`}
  </div>
</div></div>`;};
function openMeeting(code){const m=findMeeting(code);
  if(!m){S.err={find:"모임 코드를 다시 확인해 주세요"};render();return;}
  S.meeting=m;S.findCode="";S.recIdx=0;S.notesOpen=false;S.peopleOpen=false;go("dash");}
// 이 기기의 모임 목록에서 삭제: 확인 팝업 → 저장 목록(dm:meetings)에서 빼고, 지금 보던 모임이면 함께 비움
function askDelMeeting(code){const m=findMeeting(code);if(!m)return;
  document.getElementById("layer").innerHTML=`<div class="dim" role="dialog" aria-modal="true" onclick="if(event.target===this)closeLayer()"><div class="pop"><p>'${esc(m.name)}' 모임을 삭제할까요?</p><p class="rn" style="font-size:14px;font-weight:400;margin-top:-12px">이 기기에서만 지워지고, 되돌릴 수 없어요</p>
    <div style="display:flex;gap:8px"><button class="btn btn-soft" style="flex:1" onclick="closeLayer()">취소</button><button class="btn btn-primary" style="flex:1" onclick="delMeeting('${esc(m.code)}')">삭제</button></div></div></div>`;}
function delMeeting(code){const list=LS.get("meetings",[]);LS.set("meetings",(Array.isArray(list)?list:[]).filter(m=>m&&m.code!==code));
  if(S.meeting&&S.meeting.code===code)S.meeting=null; // render()가 지금 모임을 다시 저장하지 않게
  if(LS.get("last")===code)LS.set("last",null);
  closeLayer();keep();toast("모임을 삭제했어요");}
