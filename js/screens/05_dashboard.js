/* ===== 05 대시보드 ===== */
// 좋아요·싫어요 제목이 좁은 폰(360px 이하)에서 "요"만 다음 줄로 내려가지 않게: 한 줄 고정 + 화면 폭에 맞춰 글자 크기 조절
const MB={box:"padding:12px 10px",t:"white-space:nowrap;font-size:clamp(11.5px,3.4vw,14px);letter-spacing:-.02em"};
V.dash=()=>{const R=results(),M=S.meeting,recs=recommendations(R),ids=M.people.map(p=>p.id);
  const it=g=>g.items.map(x=>`<span class="nw">${esc(x)}</span>`).join(" · ");
  const list=(gs,lab,badge)=>gs.length?`<p class="r1">${gs[0].label} ${lab(gs[0])} (${gs[0].votes}표)${badge&&gs[0].votes===R.n?'<span class="badge">만장일치</span>':""}</p>${gs.slice(1).map(g=>`<p class="rn">${g.label} ${lab(g)} (${g.votes}표)</p>`).join("")}`:`<p class="rn">아직 응답이 없어요</p>`;
  const ml=gs=>gs.length?gs.map(g=>g.items.length>1?`<span class="mrow"><span class="mtie">${g.label}</span><span class="nw">${g.items.map(esc).join(" · ")} (${g.votes})</span></span>`:`<span class="mrow nw">${g.label} ${esc(g.items[0])} (${g.votes})</span>`).join(""):`<span class="rn">없음</span>`;
  const top=Math.max(...Object.values(R.drink)), rec=recs.length?recs[S.recIdx%recs.length]:null;
  // 확인해주세요는 개인정보라 이름 없이 내용만 (같은 내용은 묶어서 인원 표시)
  const noteList=Object.entries(R.notes.reduce((o,x)=>{const k=x.note.trim();o[k]=(o[k]||0)+1;return o;},{}));
  const sl=summaryLines(R),recLine=recommendLine(R);
  // '상관없음' 인원 한 줄 (전원이 상관없으면 '모두 …'로 표시)
  const anyLine=(ids,lab)=>!ids.length?"":ids.length===R.n?`<p class="r1">모두 ${lab} (${ids.length}명)</p>`:`<p class="rn">${lab} · ${ids.length}명</p>`;
  return `<div class="screen">${head(M.name+" 대시보드","home")}
<div class="body">
  ${/* 참여 인원: 누르면 참여자 ID 전체를 펼치고 다시 누르면 접기 */""}
  <div class="idrow">${R.n?`<button type="button" class="cnt" onclick="S.peopleOpen=!S.peopleOpen;keep()" aria-expanded="${!!S.peopleOpen}" style="font-weight:600;color:var(--accent);padding:4px 0;cursor:pointer">참여 ${R.n}명 ${S.peopleOpen?"▴":"▾"}</button>`:`<span class="cnt">참여 0명</span>`}</div>
  ${S.peopleOpen&&R.n?`<div class="voters">${ids.map(i=>`<span class="idchip" style="background:var(--card);border-color:var(--line)">${esc(i)}</span>`).join("")}</div>`:""}
  ${/* 종합 추천: 날짜 카드 위에 한눈에 보이게 */""}
  ${recLine?`<div class="card" style="background:#FFE3D1;gap:4px"><p style="font-size:13px;font-weight:700;color:#A33F00">✨ 한 줄 요약</p><p style="font-size:17px;font-weight:700;color:#4A2716;line-height:1.45">${esc(recLine.replace(/^추천: /,""))}</p></div>`:""}
  <div class="card"><div class="card-h">${tile("cal","var(--t-peach)")}<span class="ttl">날짜</span><button class="more" onclick="detail('slots')">상세 ›</button></div>${list(R.dates,g=>g.items.map(slotLabel).join(" · "),true)}</div>
  <div class="card"><div class="card-h">${tile("pin","var(--t-sky)")}<span class="ttl">장소</span><button class="more" onclick="detail('places')">상세 ›</button></div>${R.places.length||!R.anyPlace.length?list(R.places,it):""}${anyLine(R.anyPlace,"아무 데나 괜찮아요")}</div>
  <div class="card"><div class="card-h">${tile("fork","var(--t-mint)")}<span class="ttl">메뉴</span><button class="more" onclick="detail('menus')">상세 ›</button></div>
    <div class="grid2"><div class="mbox like" style="${MB.box}"><b style="${MB.t}">🙂 이 메뉴는 좋아요</b>${R.likes.length||!R.anyMenu.length?ml(R.likes):""}${R.anyMenu.length?`<span class="mrow nw" style="font-size:13px;opacity:.8">아무거나 · ${R.anyMenu.length}명</span>`:""}</div><div class="mbox dis" style="${MB.box}"><b style="${MB.t}">🙁 이 메뉴는 싫어요</b>${ml(R.dislikes)}</div></div>
    ${/* 문구는 텍스트로만 보여주고, 메뉴 이름 옆 ↻ 버튼으로 다음 추천 메뉴 보기 */""}
    ${rec?`<p class="rec">오늘은 이 메뉴 어때요? <u>${esc(rec)}</u> <button type="button" onclick="S.recIdx++;keep()" aria-label="다른 메뉴 추천 보기" title="다른 메뉴 보기" style="font-size:15px;color:var(--accent);padding:2px 6px;vertical-align:middle;cursor:pointer">↻</button></p>`:""}
  </div>
  <div class="card"><div class="card-h">${tile("cup","var(--t-lilac)")}<span class="ttl">오늘 술 한 잔?</span><button class="more" onclick="detail('drink')">상세 ›</button></div>
    ${top>0?`<div class="grid3">${DRINK.map(x=>`<div class="dtile${R.drink[x.value]===top?" top":""}">${x.value} <span>(${R.drink[x.value]}표)</span></div>`).join("")}</div>`:`<p class="rn">아직 응답이 없어요</p>`}
  </div>
  ${R.notes.length?`<div class="card notecard"><div class="card-h">${tile("bang","var(--t-butter)")}<span class="ttl">확인해주세요 ${R.notes.length}건</span>${noteList.length>2?`<button class="more" onclick="S.notesOpen=!S.notesOpen;keep()" aria-expanded="${S.notesOpen}">${S.notesOpen?"접기":"전체 보기"}</button>`:""}</div>
    <ul>${(S.notesOpen?noteList:noteList.slice(0,2)).map(([t,c])=>`<li>${esc(t)}${c>1?` <span class="rn" style="font-size:13px">· ${c}명</span>`:""}</li>`).join("")}</ul></div>`:""}
  <div class="card"><div class="card-h">${tile("sum","#E6EBF7")}<span class="ttl">결과 요약</span><span class="rn" style="font-weight:700;color:var(--accent)">${R.n}명 참여</span></div>
    <div class="sum">${sl.filter(([t])=>t!=="r").map(([t,s])=>`<p class="${t==="t"?"st":t==="l"?"sl":t==="i"?"si":"link"}">${esc(s)}</p>`).join("")}</div>
    <button class="btn btn-primary" style="margin-top:4px" onclick="copy(summaryText(results()));toast('요약을 복사했어요.\\n단톡방에 붙여넣으세요')">단톡방에 결과 공유하기</button>
    <button class="btn btn-soft" onclick="copyInvite()">초대장 공유하기</button>
  </div>
</div></div>`;};
