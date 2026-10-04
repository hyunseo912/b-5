/* ===== 시작 — 맨 마지막에 로드 ===== */
// 새로고침해도 마지막에 본 모임과 응답을 불러와요 (대시보드에 있었으면 대시보드로)
(function(){const last=LS.get("last"),list=LS.get("meetings",[]),m=Array.isArray(list)?list.find(x=>x&&x.code===last):null;
  if(m&&Array.isArray(m.people)){S.meeting=m;if(LS.get("screen")==="dash")S.screen="dash";}})();
// 접수 팝업처럼 화면을 다시 그리기 전에 창을 닫거나 새로고침해도 저장
window.addEventListener("pagehide",saveMeeting);
render();
