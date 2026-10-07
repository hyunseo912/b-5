/* ===== 01 진입 ===== */
// 역할별 구성: [방장] 모임 만들기 / [투표하기] 초대 코드로 입장(방장도 여기서 투표) / 간격 후 결과 보기를 작게
// 그림: 앱 가로폭·그림 비율(826×555) 크기가 기본. 화면이 짧으면 스크롤 없이 한 화면에 들어오도록 줄어들고(최소 150px), 잘리지 않게 비율 유지
// 그림을 크게 두려고 아래 글자·버튼은 기본보다 조금씩 작게 (HM)
const HM={lab:"font-size:12px;font-weight:700;color:var(--accent);padding-left:6px",grp:"display:flex;flex-direction:column;gap:4px;flex-shrink:0",
  btn:"height:48px;font-size:16px",sub:"height:40px;font-size:13px;flex:1;min-width:0;padding:0 8px"};
V.home=()=>`<div class="entry"><div class="hero" style="height:calc(min(100vw,480px)*555/826);flex:0 1 auto;min-height:150px"><img style="object-fit:contain" src="img/hero.jpg" alt="동글동글한 친구들이 파란 하늘 아래에서 반갑게 내려다보는 그림"></div>
  <div class="entry-main" style="flex:1 0 auto;gap:8px">
    <h2 style="margin:2px 0 0;font-size:22px;line-height:1.3">링크 하나로<span>1분 만에 모임 완성</span></h2>
    <div style="${HM.grp}"><p style="${HM.lab}">방장</p>
      <button class="btn btn-primary" style="${HM.btn}" onclick="go('create')">+ 새로운 모임 만들기</button></div>
    <div style="${HM.grp}"><p style="${HM.lab}">투표하기</p>
      <button class="btn btn-soft" style="${HM.btn}" onclick="S.joinCode='';S.joinFrom='home';go('join')">초대 코드로 입장하기</button>
      <p class="note2" style="font-size:11.5px">방장님도 여기서 투표해요</p></div>
    <div style="display:flex;gap:8px;margin-top:4px;flex-shrink:0">
      <button class="btn btn-ghost" style="${HM.sub}" onclick="openDash()">모임 결과 보기</button></div>
    <div class="brand" style="padding:2px 0 10px"><b aria-label="당장만나" style="font-size:38px"><i>당</i><i>장</i><i>만</i><i>나</i></b><p style="font-size:12px">날짜 · 장소 · 메뉴, 지금 바로 정해요</p></div>
  </div></div>`;
// 데모 모임(data.js 샘플 10명)을 이 기기의 모임 목록에 넣어 둠. 이미 있으면 응답은 그대로 두고 이름만 최신으로
function addDemo(){const d=DATA.meeting,list=LS.get("meetings",[]),ms=Array.isArray(list)?list:[],old=ms.find(m=>m&&m.code===d.code);
  if(old)old.name=d.name;
  else{const m=newMeeting(d.name,d.code);m.link=d.inviteLink;m.people=JSON.parse(JSON.stringify(DATA.participants));ms.push(m);}
  LS.set("meetings",ms);if(S.meeting&&S.meeting.code===d.code)S.meeting.name=d.name;}
function openDash(){addDemo();S.findCode="";go("find");} // 모임 결과 보기 → 모임 고르기 화면(07), 데모 모임이 목록에 자동으로 보임
