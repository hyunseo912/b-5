/* ===== 공통: 상태(S)·화면 등록(V)·유틸 — 여러 화면이 함께 쓰는 파일이라 고치기 전에 톡방 공유 ===== */
const S={screen:"home",meeting:null,draft:null,activeDay:null,err:{},notesOpen:false,recIdx:0};
const genCode=()=>Array.from({length:6},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");
const newMeeting=(name,code=genCode())=>({name,code,link:`https://…/${code.toLowerCase()}`,people:[]});
const V={}; // 화면 등록: V.home, V.create, V.join, V.respond, V.dash

/* ===== 유틸 ===== */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);}
async function copy(text,btn){try{await navigator.clipboard.writeText(text);}catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");}catch(_){}ta.remove();}
  if(btn){const o=btn.textContent;btn.textContent="복사됨";setTimeout(()=>btn.textContent=o,1500);}}
function go(s){S.screen=s;S.err={};render();window.scrollTo(0,0);}
const head=(t,back)=>`<div class="head">${back?`<button class="back" aria-label="뒤로" onclick="go('${back}')">‹</button>`:""}<h1>${esc(t)}</h1></div>`;
const ICON={
  cal:`<svg viewBox="0 0 24 24" fill="none" stroke="#E0662A" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>`,
  pin:`<svg viewBox="0 0 24 24" fill="none" stroke="#3E7BD6" stroke-width="2" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>`,
  fork:`<svg viewBox="0 0 24 24" fill="none" stroke="#2F8A60" stroke-width="2" stroke-linecap="round"><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M16.5 3c-2 1.5-2.5 4-2.5 7h3v11"/></svg>`,
  cup:`<svg viewBox="0 0 24 24" fill="none" stroke="#8B5CD6" stroke-width="2" stroke-linecap="round"><path d="M6 4h12l-1.5 15a2 2 0 0 1-2 1.8h-5a2 2 0 0 1-2-1.8z"/><path d="M6.5 9h11"/></svg>`,
  bang:`<svg viewBox="0 0 24 24" fill="none" stroke="#B88A00" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.6" r=".5" fill="#B88A00"/></svg>`,
  sum:`<svg viewBox="0 0 24 24" fill="none" stroke="#4F67A8" stroke-width="2" stroke-linecap="round"><rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 8.5h6M9 12h6M9 15.5h4"/></svg>`
};
const tile=(ic,bg)=>`<span class="tile" style="background:${bg}">${ICON[ic]}</span>`;
// 날짜 → "YYYY-MM-DD" (슬롯 키·날짜 비교용), 인자 없으면 오늘
const ymd=(dt=new Date())=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;

/* ===== 저장 (localStorage) — 키 접두사 dm:, 못 쓰는 환경에서도 멈추지 않게 try/catch ===== */
const LS={
  get(k,def=null){try{const v=localStorage.getItem("dm:"+k);return v===null?def:JSON.parse(v);}catch(e){return def;}},
  set(k,v){try{localStorage.setItem("dm:"+k,JSON.stringify(v));}catch(e){}}
};
// 지금 모임을 모임 목록(dm:meetings)에 저장하고, 마지막으로 본 모임(dm:last)·화면(dm:screen)도 기억
function saveMeeting(){if(!S.meeting)return;const list=LS.get("meetings",[]),ms=Array.isArray(list)?list.filter(m=>m&&m.code!==S.meeting.code):[];
  ms.push(S.meeting);LS.set("meetings",ms);LS.set("last",S.meeting.code);LS.set("screen",S.screen);}

/* ===== 화면 그리기 ===== */
function render(){document.getElementById("app").innerHTML=V[S.screen]();saveMeeting();}
function keep(){const y=window.scrollY;render();window.scrollTo(0,y);}
function closeLayer(){document.getElementById("layer").innerHTML="";}
