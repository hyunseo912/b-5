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
    ${list.length?list.map(m=>`<button class="card" style="flex-direction:row;align-items:center;text-align:left;width:100%;cursor:pointer" onclick="openMeeting('${esc(m.code)}')">
      <span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.name)}</b>
      <span class="rn" style="font-size:13px">${esc(m.code)} · 참여 ${m.people.length}명${m.start?` · ${esc(slotLabel(m.start+"|").trim())}${m.end?` ~ ${esc(slotLabel(m.end+"|").trim())}`:" 시작"}`:""}</span></span>
      <span style="font-size:20px;color:var(--text2)" aria-hidden="true">›</span></button>`).join("")
    :`<p class="rn" style="padding:4px 2px">아직 이 기기에서 만든 모임이 없어요. 새 모임을 만들거나 ⚡ 1초 데모 데이터를 눌러 보세요</p>`}
  </div>
</div></div>`;};
function openMeeting(code){const m=findMeeting(code);
  if(!m){S.err={find:"모임 코드를 다시 확인해 주세요"};render();return;}
  S.meeting=m;S.findCode="";S.recIdx=0;S.notesOpen=false;S.peopleOpen=false;go("dash");}
