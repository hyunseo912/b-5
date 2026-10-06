/* ===== 집계 ===== */
const dateOf=k=>{const [y,m,d]=k.split("|")[0].split("-").map(Number);return new Date(y,m-1,d);};
function slotLabel(k){const dt=dateOf(k);return `${dt.getMonth()+1}/${String(dt.getDate()).padStart(2,"0")}(${WD[dt.getDay()]}) ${k.split("|")[1]}`;}
const dayKey=(m,d)=>`${YEAR}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
function rank(counts,order){
  const arr=Object.entries(counts).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]||order(a[0],b[0]));
  const gs=[]; arr.forEach(([k,v])=>{const r=1+arr.filter(([,w])=>w>v).length; if(r>3)return;
    let g=gs.find(g=>g.rank===r); if(!g){g={rank:r,votes:v,items:[]};gs.push(g);} g.items.push(k);});
  gs.forEach(g=>g.label=(g.items.length>1?"공동 ":"")+g.rank+"위"); return gs;
}
const byList=L=>(a,b)=>L.indexOf(a)-L.indexOf(b);
function tally(f){const c={};S.meeting.people.forEach(p=>p[f].forEach(x=>c[x]=(c[x]||0)+1));return c;}
const voters=(f,it)=>S.meeting.people.filter(p=>p[f].includes(it)).map(p=>p.id);
function results(){
  const ppl=S.meeting.people, drink={}; DRINK.forEach(d=>drink[d.value]=ppl.filter(p=>p.drink===d.value).length);
  return {n:ppl.length, dates:rank(tally("slots"),(a,b)=>a<b?-1:1), places:rank(tally("places"),byList(PLACES)),
    likes:rank(tally("likes"),byList(MENUS)), dislikes:rank(tally("dislikes"),byList(MENUS)), drink,
    notes:ppl.filter(p=>p.note).map(p=>({id:p.id,note:p.note})),
    anyPlace:ppl.filter(p=>p.anyPlace).map(p=>p.id), anyMenu:ppl.filter(p=>p.anyMenu).map(p=>p.id)}; // '상관없음'을 고른 사람 (표로 세지 않음)
}
function recommendations(R){ const t=R.notes.map(x=>x.note).join(" "),ok=c=>(MENU_DB[c]||[]).filter(([nm,tags])=>!tags.some(x=>t.includes(x))&&!t.includes(nm)).map(([nm])=>nm);
  if(R.likes.length) return R.likes[0].items.flatMap(ok);
  // 좋아요 표가 없고 '아무거나 괜찮아요'만 있을 때: 싫어요 받은 카테고리를 빼고, 카테고리마다 하나씩 번갈아 추천
  if(!R.anyMenu.length) return [];
  const bad=new Set(R.dislikes.flatMap(g=>g.items)),lists=MENUS.filter(c=>!bad.has(c)).map(ok),out=[];
  for(let i=0;lists.some(l=>l[i]);i++) lists.forEach(l=>{if(l[i])out.push(l[i]);});
  return out; }
function summaryLines(R){
  const L=[["t",`[${S.meeting.name}] 모임 결과 요약 (${R.n}명 참여)`]];
  L.push(["l","날짜"]); R.dates.forEach(g=>L.push(["i",`${g.label} ${g.items.map(slotLabel).join(" · ")} (${g.votes}표)`+(g.rank===1&&g.votes===R.n?" [만장일치]":"")]));
  if(R.places.length||R.anyPlace.length){L.push(["l","장소"]); R.places.forEach(g=>L.push(["i",`${g.label} ${g.items.join(" · ")} (${g.votes}표)`])); if(R.anyPlace.length)L.push(["i",`아무 데나 괜찮아요 ${R.anyPlace.length}명`]);}
  const lk=R.likes.filter(g=>g.rank<=2).flatMap(g=>g.items).join(", "), dk=R.dislikes.length?R.dislikes[0].items.join(", "):"";
  if(lk||dk||R.anyMenu.length){L.push(["l","메뉴"]); if(lk)L.push(["i",`좋아요 ${lk}`]); if(R.anyMenu.length)L.push(["i",`아무거나 괜찮아요 ${R.anyMenu.length}명`]); if(dk)L.push(["i",`싫어요 ${dk}`]);}
  const d=Object.entries(R.drink).filter(([,v])=>v>0).map(([k,v])=>`${k} ${v}`).join(" · ");
  L.push(["l","술자리"],["i",d||"응답 없음"],["u",`상세 결과 보기: ${S.meeting.link}`]); return L;
}
const summaryText=R=>{const L=summaryLines(R);return L.map(([t,s],i)=>t==="i"?"  "+s:(t==="l"&&L[i-1][0]==="t"?"\n"+s:t==="u"?"\n"+s:s)).join("\n");};
