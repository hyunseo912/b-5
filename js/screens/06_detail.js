/* ===== 06 상세 시트 ===== */
function rankBlock(gs,f,lab,n){if(!gs.length)return `<p class="rn" style="padding:12px 0">아직 응답이 없어요</p>`;
  return gs.map(g=>g.items.map(x=>`<div class="rk"><p class="rk-t">${g.label} ${esc(lab(x))} <em>${g.votes}표</em>${f==="slots"&&g.rank===1&&g.votes===n?'<span class="badge">만장일치</span>':""}</p><div class="voters">${voters(f,x).map(v=>`<span class="idchip">${esc(v)}</span>`).join("")}</div></div>`).join("")).join("");}
function detail(kind){const R=results(),id=x=>x;let h;
  if(kind==="slots")h=`<h3>날짜 상세</h3><p class="rn">순위별로 고른 사람을 보여줘요</p>${rankBlock(R.dates,"slots",slotLabel,R.n)}`;
  else if(kind==="places")h=`<h3>장소 상세</h3><p class="rn">순위별로 고른 사람을 보여줘요</p>${rankBlock(R.places,"places",id)}`;
  else h=`<h3>메뉴 상세</h3><p class="rn">순위별로 고른 사람을 보여줘요</p><p class="sheet-sec" style="color:var(--like)">🙂 좋아요</p>${rankBlock(R.likes,"likes",id)}<p class="sheet-sec" style="color:var(--rose)">🙁 싫어요</p>${rankBlock(R.dislikes,"dislikes",id)}`;
  document.getElementById("layer").innerHTML=`<div class="dim sheet" onclick="if(event.target===this)closeLayer()"><div class="sheet-box" role="dialog" aria-modal="true"><div class="grab"></div>${h}<button class="btn btn-primary" style="margin-top:16px" onclick="closeLayer()">닫기</button></div></div>`;}
