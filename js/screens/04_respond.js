/* ===== 04 응답 (달력·장소·메뉴·음주) + 접수 팝업 ===== */
/* 달력 범위: 방장이 정한 시작일(meeting.start)부터 3개월. 지난 날짜·범위 밖 날짜는 흐리게 + 선택 불가
 * 시작일이 없는 모임(⚡ 데모 등)은 data.js의 YEAR·MONTH 1일을 시작일로 사용 */
function calRange(){const st=(S.meeting&&S.meeting.start)||`${YEAR}-${String(MONTH).padStart(2,"0")}-01`,[y,m,dd]=st.split("-").map(Number);
  // 끝 날짜: 방장이 정한 마감일(meeting.end), 없으면 3개월 뒤 전날. 어느 쪽이든 3개월을 넘지 않게
  const max=ymd(new Date(y,m-1+3,dd-1)),me=S.meeting&&S.meeting.end,end=me&&me>=st&&me<max?me:max,today=ymd(),from=st>today?st:today,mi=k=>{const[a,b]=k.split("-").map(Number);return a*12+b-1;};
  return {from,to:end,fromM:Math.min(mi(from),mi(end)),toM:mi(end)};}
// 보고 있는 달(S.calM = 연*12+월): 모임·참여자가 바뀌면 첫 선택 날짜(없으면 선택 가능 첫 달)로 맞춤
function calInit(r){const who=S.meeting.code+"|"+S.draft.id;
  if(S.calFor!==who){const f=S.draft.slots.map(x=>x.split("|")[0]).filter(k=>k>=r.from&&k<=r.to).sort()[0]||r.from,[a,b]=f.split("-").map(Number);S.calM=a*12+b-1;S.calFor=who;}
  S.calM=Math.min(Math.max(S.calM,r.fromM),r.toM);}
function calMove(n){const r=calRange();S.calM=Math.min(Math.max(S.calM+n,r.fromM),r.toM);keep();}
function calendar(r){const d=S.draft,y=Math.floor(S.calM/12),mo=S.calM%12+1,first=new Date(y,mo-1,1).getDay(),days=new Date(y,mo,0).getDate();
  let h=WD.map((w,i)=>`<div class="wd${i===0?" sun":i===6?" sat":""}">${w}</div>`).join("");
  for(let i=0;i<first;i++)h+="<div></div>";
  for(let day=1;day<=days;day++){const k=ymd(new Date(y,mo-1,day)),dow=new Date(y,mo-1,day).getDay(),sel=SLOTS.map(s=>d.slots.includes(`${k}|${s}`)),off=k<r.from||k>r.to;
    h+=`<button class="day${sel.some(Boolean)?" has":""}${S.activeDay===k?" act":""}${dow===0?" sun":dow===6?" sat":""}" ${off?`disabled style="opacity:.25;cursor:default"`:`onclick="pickDay('${k}')"`} aria-label="${mo}월 ${day}일${off?" (선택 불가)":""}"><span>${day}</span><span class="dots">${sel.map(f=>`<i class="dot${f?" f":""}"></i>`).join("")}</span></button>`;}
  return h;}
function calNav(r){const y=Math.floor(S.calM/12),mo=S.calM%12+1,arrow=(n,ch,lab,dis)=>`<button type="button" aria-label="${lab}" ${dis?"disabled":`onclick="calMove(${n})"`} style="font-size:22px;line-height:1;width:36px;height:32px;color:${dis?"var(--disabled)":"var(--text)"};cursor:${dis?"default":"pointer"}">${ch}</button>`;
  return `<div class="cal-nav">${arrow(-1,"‹","이전 달",S.calM<=r.fromM)}${y}년 ${mo}월${arrow(1,"›","다음 달",S.calM>=r.toM)}</div>`;}
V.respond=()=>{const d=S.draft,r=calRange();calInit(r);
  const ad=S.activeDay&&S.activeDay>=r.from&&S.activeDay<=r.to?S.activeDay:null,adL=ad?slotLabel(ad+"|").replace(/\s$/,""):"날짜를 눌러 주세요";
  const chip=(f,v,dark)=>{const on=d[f].includes(v),o=f==="likes"?"dislikes":f==="dislikes"?"likes":null,dis=!on&&(d[f].length>=3||(o&&d[o].includes(v)));
    return `<button class="chip${on?" on":""}${on&&dark?" dark":""}" ${dis?"disabled":""} aria-pressed="${on}" onclick="tog('${f}','${v}')">${v}</button>`;};
  // '상관없음' 버튼: 누르면 그 항목의 선택을 모두 풀고, 다른 후보를 누르면 꺼짐 (ANY 참고)
  const anyChip=(f,lab)=>{const on=!!d[ANY[f]];return `<button class="chip${on?" on":""}" style="grid-column:1/-1" aria-pressed="${on}" onclick="togAny('${f}')">${lab}</button>`;};
  // 항목 제목 옆 '필수/선택 · 최대 n개' 안내: 작은 글씨, 색은 각 항목 제목 색을 그대로 따름
  const sm=t=>`<small style="margin-left:6px;font-size:12px;font-weight:600;color:inherit">${t}</small>`;
  const dm=DRINK.find(x=>x.value===d.drink);
  return `<div class="screen">${head(S.meeting.name,"join")}
<div class="body" style="gap:14px">
  <h2 class="section-t">1. 날짜 선택<small style="margin-left:6px;font-size:13px;font-weight:600;color:var(--accent)">필수</small></h2>
  <div class="calcard">${calNav(r)}<div class="cal">${calendar(r)}</div><p class="hint" style="text-align:center">선택 가능 기간 ${slotLabel(r.from+"|").trim()} ~ ${slotLabel(r.to+"|").trim()}</p></div>
  <div class="slot-row"><b>${adL}</b><span class="rn">복수 선택 가능</span></div>
  <div class="grid2 c-time">${SLOTS.map(s=>{const on=ad&&d.slots.includes(`${ad}|${s}`);return `<button class="chip${on?" on":""}" ${ad?"":"disabled"} aria-pressed="${!!on}" onclick="togSlot('${s}')">${s}</button>`;}).join("")}</div>
  <div class="legend"><i class="dot"></i>→<i class="dot f"></i> 점심 · 저녁 (위부터)</div>
  <h2 class="section-t" id="sec2" style="margin-top:20px;scroll-margin-top:70px">2. 장소와 메뉴</h2>
  <div class="sec c-place"><p class="label l-place">📍 희망 장소${sm("필수 · 최대 3개")}</p><div class="grid3">${PLACES.map(p=>chip("places",p)).join("")}${anyChip("places","아무 데나 괜찮아요")}</div></div>
  <div class="sec c-like"><p class="label l-like">🙂 희망 메뉴${sm("필수 · 최대 3개")}</p><div class="grid3">${MENUS.map(m=>chip("likes",m)).join("")}${anyChip("likes","아무거나 괜찮아요")}</div></div>
  <div class="sec c-dis"><p class="label l-dis">🙁 기피 메뉴${sm("선택 · 최대 3개")}</p><div class="grid3">${MENUS.map(m=>chip("dislikes",m)).join("")}</div></div>
  <div class="sec c-drink"><p class="label l-drink">🥂 음주 여부${sm("필수")}</p>
  <div class="grid3">${DRINK.map(x=>`<button class="chip sym${d.drink===x.value?" on":""}" aria-label="음주 ${x.value}" aria-pressed="${d.drink===x.value}" onclick="S.draft.drink=S.draft.drink==='${x.value}'?null:'${x.value}';keep()">${x.label}</button>`).join("")}</div>
  ${dm?`<p class="drink-msg" aria-live="polite">${esc(dm.message)}</p>`:""}</div>
  <button class="btn btn-primary" style="margin-top:12px" onclick="confirmResp()">확정하기</button>
</div></div>`;};
function pickDay(k){S.activeDay=k;keep();}
function togSlot(s){const k=`${S.activeDay}|${s}`,a=S.draft.slots,i=a.indexOf(k);i>=0?a.splice(i,1):a.push(k);keep();}
const ANY={places:"anyPlace",likes:"anyMenu"}; // 장소·희망 메뉴의 '상관없음' 표시 필드
function tog(f,v){const a=S.draft[f],i=a.indexOf(v);if(i>=0)a.splice(i,1);else if(a.length<3){a.push(v);if(ANY[f])S.draft[ANY[f]]=false;}keep();}
function togAny(f){const d=S.draft,k=ANY[f];d[k]=!d[k];if(d[k])d[f]=[];keep();}
function confirmResp(){if(!S.draft.slots.length){toast("가능한 날짜와 시간대를 하나 이상 골라 주세요");return;}
  // 장소·희망 메뉴는 필수: 후보를 1개 이상 고르거나 '상관없음' 버튼을 눌러야 제출 / 음주도 필수
  const need=[["places","c-place","희망 장소를 골라 주세요. 상관없으면 '아무 데나 괜찮아요'를 눌러 주세요"],["likes","c-like","희망 메뉴를 골라 주세요. 상관없으면 '아무거나 괜찮아요'를 눌러 주세요"]]
    .find(([f])=>!S.draft[f].length&&!S.draft[ANY[f]]);
  if(need){toast(need[2]);document.querySelector("."+need[1]).scrollIntoView({behavior:"smooth",block:"center"});return;}
  if(!S.draft.drink){toast("음주 여부를 골라 주세요");document.querySelector(".c-drink").scrollIntoView({behavior:"smooth",block:"center"});return;}
  reviewResp();}
// 최종 확인 시트: 날짜는 날짜순, 각 항목은 고른 순서대로. [수정하기]는 시트만 닫고 입력은 그대로
function reviewResp(){const d=S.draft,chips=(xs,bg,fg)=>xs.map(x=>`<span class="idchip" style="height:26px;padding:0 10px;font-size:12.5px;background:${bg};border-color:${bg};color:${fg};font-weight:600">${esc(x)}</span>`).join(""),
    row=(lab,col,body)=>`<div class="rk" style="padding:8px 0;gap:6px"><p class="rk-t" style="font-size:13.5px;color:${col}">${lab}</p><div class="voters" style="gap:5px">${body}</div></div>`,
    none=t=>`<span class="rn" style="font-size:13px">${t}</span>`,dm=DRINK.find(x=>x.value===d.drink);
  const slots=d.slots.slice().sort((x,y)=>{const[a,b]=x.split("|"),[c,e]=y.split("|");return a<c?-1:a>c?1:SLOTS.indexOf(b)-SLOTS.indexOf(e);}).map(k=>slotLabel(k).replace(/^(\d+)\/0?(\d+)/,(m,a,b)=>a+"/"+b));
  document.getElementById("layer").innerHTML=`<div class="dim" style="padding:16px" onclick="if(event.target===this)closeLayer()"><div class="sheet-box" role="dialog" aria-modal="true" style="border-radius:22px;max-height:calc(100dvh - 32px);padding:16px 16px 14px">
    <h3 style="font-size:18px;margin-bottom:2px">이대로 제출할까요?</h3><p class="rn" style="font-size:13px;margin-bottom:4px">${esc(d.id)} 님이 고른 내용이에요</p>
    ${row(`📅 날짜 · ${slots.length}개`,"#A33F00",chips(slots,"#FFE3D1","#A33F00"))}
    ${row("📍 희망 장소","#2F65BF",d.anyPlace?chips(["아무 데나 괜찮아요"],"#DDEBFB","#2F65BF"):chips(d.places,"#DDEBFB","#2F65BF"))}
    ${row("🙂 희망 메뉴","#23784F",d.anyMenu?chips(["아무거나 괜찮아요"],"#DDF2E6","#23784F"):chips(d.likes,"#DDF2E6","#23784F"))}
    ${row("🙁 기피 메뉴","#B83A52",d.dislikes.length?chips(d.dislikes,"#FDE3E8","#B83A52"):none("없음"))}
    ${row("🥂 음주 여부","#6A45B0",dm?chips([dm.label+"  "+dm.message],"#EEE4FB","#6A45B0"):none("선택 안 함"))}
    ${d.note?row("📝 확인해주세요","var(--text2)",`<span style="font-size:13px">${esc(d.note)}</span>`):""}
    <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-soft" style="flex:1;height:46px;font-size:16px" onclick="closeLayer()">수정하기</button><button class="btn btn-primary" style="flex:1.4;height:46px;font-size:16px" onclick="submitResp()">이대로 제출</button></div>
  </div></div>`;}
function submitResp(){const d=S.draft,ppl=S.meeting.people,i=ppl.findIndex(p=>p.id===d.id);i>=0?ppl[i]=d:ppl.push(d);S.meeting._fresh=false;saveMeeting();
  document.getElementById("layer").innerHTML=`<div class="dim" role="dialog" aria-modal="true"><div class="pop"><p>응답이 접수되었어요! 🍽️</p><button class="btn btn-primary" onclick="closeLayer();S.joinId='';S.joinNote='';go('dash')">확인</button></div></div>`;}
