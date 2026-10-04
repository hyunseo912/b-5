/* ===== 05 대시보드 ===== */
V.dash=()=>{const R=results(),M=S.meeting,recs=recommendations(R),ids=M.people.map(p=>p.id);
  const it=g=>g.items.map(x=>`<span class="nw">${esc(x)}</span>`).join(" · ");
  const list=(gs,lab,badge)=>gs.length?`<p class="r1">${gs[0].label} ${lab(gs[0])} (${gs[0].votes}표)${badge&&gs[0].votes===R.n?'<span class="badge">만장일치</span>':""}</p>${gs.slice(1).map(g=>`<p class="rn">${g.label} ${lab(g)} (${g.votes}표)</p>`).join("")}`:`<p class="rn">아직 응답이 없어요</p>`;
  const ml=gs=>gs.length?gs.map(g=>g.items.length>1?`<span class="mrow"><span class="mtie">${g.label}</span><span class="nw">${g.items.map(esc).join(" · ")} (${g.votes})</span></span>`:`<span class="mrow nw">${g.label} ${esc(g.items[0])} (${g.votes})</span>`).join(""):`<span class="rn">없음</span>`;
  const top=Math.max(...Object.values(R.drink)), rec=recs.length?recs[S.recIdx%recs.length]:null;
  const sl=summaryLines(R);
  return `<div class="screen">${head(M.name+" 대시보드","home")}
<div class="body">
  <div class="idrow">${ids.slice(0,2).map(i=>`<span class="idchip">${esc(i)}</span>`).join("")}${ids.length>2?`<span class="idchip">+${ids.length-2}</span>`:""}<span class="cnt">참여 ${R.n}명</span></div>
  <div class="card"><div class="card-h">${tile("cal","var(--t-peach)")}<span class="ttl">날짜</span><button class="more" onclick="detail('slots')">상세 ›</button></div>${list(R.dates,g=>g.items.map(slotLabel).join(" · "),true)}</div>
  <div class="card"><div class="card-h">${tile("pin","var(--t-sky)")}<span class="ttl">장소</span><button class="more" onclick="detail('places')">상세 ›</button></div>${list(R.places,it)}</div>
  <div class="card"><div class="card-h">${tile("fork","var(--t-mint)")}<span class="ttl">메뉴</span><button class="more" onclick="detail('menus')">상세 ›</button></div>
    <div class="grid2"><div class="mbox like"><b>🙂 이 메뉴는 좋아요</b>${ml(R.likes)}</div><div class="mbox dis"><b>🙁 이 메뉴는 싫어요</b>${ml(R.dislikes)}</div></div>
    ${rec?`<button class="rec" onclick="S.recIdx++;keep()">오늘은 이 메뉴 어때요? <u>${esc(rec)}</u></button>`:""}
  </div>
  <div class="card"><div class="card-h">${tile("cup","var(--t-lilac)")}<span class="ttl">오늘 술 한 잔?</span></div>
    ${top>0?`<div class="grid3">${DRINK.map(x=>`<div class="dtile${R.drink[x.value]===top?" top":""}">${x.value} <span>(${R.drink[x.value]}표)</span></div>`).join("")}</div>`:`<p class="rn">아직 응답이 없어요</p>`}
  </div>
  ${R.notes.length?`<div class="card notecard"><div class="card-h">${tile("bang","var(--t-butter)")}<span class="ttl">확인해주세요 ${R.notes.length}건</span><button class="more" onclick="S.notesOpen=!S.notesOpen;keep()" aria-expanded="${S.notesOpen}">${S.notesOpen?"접기":"전체 보기"}</button></div>
    <ul>${(S.notesOpen?R.notes:R.notes.slice(0,2)).map(x=>`<li><b>${esc(x.id)}</b> · ${esc(x.note)}</li>`).join("")}</ul></div>`:""}
  <div class="card"><div class="card-h">${tile("sum","#E6EBF7")}<span class="ttl">결과 요약</span><span class="rn" style="font-weight:700;color:var(--accent)">${R.n}명 참여</span></div>
    <div class="sum">${sl.map(([t,s])=>`<p class="${t==="t"?"st":t==="l"?"sl":t==="i"?"si":"link"}">${esc(s)}</p>`).join("")}</div>
    <button class="btn btn-primary" style="margin-top:4px" onclick="copy(summaryText(results()));toast('요약을 복사했어요. 단톡방에 붙여넣으세요')">단톡방에 공유하기</button>
  </div>
</div></div>`;};
