/* ===== 04 응답 (달력·장소·메뉴·음주) + 접수 팝업 ===== */
function calendar(){const d=S.draft,first=new Date(YEAR,MONTH-1,1).getDay(),days=new Date(YEAR,MONTH,0).getDate();
  let h=WD.map((w,i)=>`<div class="wd${i===0?" sun":i===6?" sat":""}">${w}</div>`).join("");
  for(let i=0;i<first;i++)h+="<div></div>";
  for(let day=1;day<=days;day++){const k=dayKey(MONTH,day),dow=new Date(YEAR,MONTH-1,day).getDay(),sel=SLOTS.map(s=>d.slots.includes(`${k}|${s}`));
    h+=`<button class="day${sel.some(Boolean)?" has":""}${S.activeDay===k?" act":""}${dow===0?" sun":dow===6?" sat":""}" onclick="pickDay('${k}')" aria-label="${MONTH}월 ${day}일"><span>${day}</span><span class="dots">${sel.map(f=>`<i class="dot${f?" f":""}"></i>`).join("")}</span></button>`;}
  return h;}
V.respond=()=>{const d=S.draft,ad=S.activeDay,adL=ad?slotLabel(ad+"|").replace(/\s$/,""):"날짜를 눌러 주세요";
  const chip=(f,v,dark)=>{const on=d[f].includes(v),o=f==="likes"?"dislikes":f==="dislikes"?"likes":null,dis=!on&&(d[f].length>=3||(o&&d[o].includes(v)));
    return `<button class="chip${on?" on":""}${on&&dark?" dark":""}" ${dis?"disabled":""} aria-pressed="${on}" onclick="tog('${f}','${v}')">${v}</button>`;};
  const dm=DRINK.find(x=>x.value===d.drink);
  return `<div class="screen">${head(S.meeting.name,"join")}
<div class="body" style="gap:14px">
  <h2 class="section-t">1. 날짜 선택</h2>
  <div class="calcard"><div class="cal-nav"><span aria-hidden="true">‹</span>${YEAR}년 ${MONTH}월<span aria-hidden="true">›</span></div><div class="cal">${calendar()}</div></div>
  <div class="slot-row"><b>${adL}</b><span class="rn">복수 선택 가능</span></div>
  <div class="grid2 c-time">${SLOTS.map(s=>{const on=ad&&d.slots.includes(`${ad}|${s}`);return `<button class="chip${on?" on":""}" ${ad?"":"disabled"} aria-pressed="${!!on}" onclick="togSlot('${s}')">${s}</button>`;}).join("")}</div>
  <div class="legend"><i class="dot"></i>→<i class="dot f"></i> 점심 · 저녁 (위부터)</div>
  <button class="btn btn-primary" onclick="document.getElementById('sec2').scrollIntoView({behavior:'smooth'})">다음</button>
  <h2 class="section-t" id="sec2" style="margin-top:20px;scroll-margin-top:70px">2. 장소와 메뉴</h2>
  <div class="sec c-place"><p class="label l-place">📍 희망 장소 (최대 3개)</p><div class="grid3">${PLACES.map(p=>chip("places",p)).join("")}</div></div>
  <div class="sec c-like"><p class="label l-like">🙂 희망 메뉴 (최대 3개)</p><div class="grid3">${MENUS.map(m=>chip("likes",m)).join("")}</div></div>
  <div class="sec c-dis"><p class="label l-dis">🙁 기피 메뉴 (최대 3개)</p><div class="grid3">${MENUS.map(m=>chip("dislikes",m)).join("")}</div></div>
  <div class="sec c-drink"><p class="label l-drink">🥂 음주 여부</p>
  <div class="grid3">${DRINK.map(x=>`<button class="chip sym${d.drink===x.value?" on":""}" aria-label="음주 ${x.value}" aria-pressed="${d.drink===x.value}" onclick="S.draft.drink=S.draft.drink==='${x.value}'?null:'${x.value}';keep()">${x.label}</button>`).join("")}</div>
  ${dm?`<p class="drink-msg" aria-live="polite">${esc(dm.message)}</p>`:""}</div>
  <button class="btn btn-primary" style="margin-top:12px" onclick="confirmResp()">확정하기</button>
</div></div>`;};
function pickDay(k){S.activeDay=k;keep();}
function togSlot(s){const k=`${S.activeDay}|${s}`,a=S.draft.slots,i=a.indexOf(k);i>=0?a.splice(i,1):a.push(k);keep();}
function tog(f,v){const a=S.draft[f],i=a.indexOf(v);if(i>=0)a.splice(i,1);else if(a.length<3)a.push(v);keep();}
function confirmResp(){if(!S.draft.slots.length){toast("가능한 날짜와 시간대를 하나 이상 골라 주세요");return;}
  const d=S.draft,ppl=S.meeting.people,i=ppl.findIndex(p=>p.id===d.id);i>=0?ppl[i]=d:ppl.push(d);S.meeting._fresh=false;
  document.getElementById("layer").innerHTML=`<div class="dim" role="dialog" aria-modal="true"><div class="pop"><p>응답이 접수되었어요! 🍽️</p><button class="btn btn-primary" onclick="closeLayer();S.joinId='';S.joinNote='';go('dash')">확인</button></div></div>`;}
