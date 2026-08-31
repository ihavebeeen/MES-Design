// Generates a bounded script for the Figma MCP. Node alone does not edit Figma.
export function inboxFields(request) {
  const direct = request.affected.filter(a => a.reason === 'direct-source-change').map(a => a.name);
  const shared = [...new Set(request.affected.flatMap(a => a.sharedChanges.map(c => c.path)))];
  return {
    title: 'MES 코드 변경 요청',
    state: `${request.status === 'no-changes' ? '현재 기준 대기 변경 없음' : '검토·승인 대기'} · 대상 코드 ${request.sourceCommit.slice(0, 7)}`,
    summary: `영향 검토 ${request.affected.length}항목 · 신규 연결 ${request.unlinkedAssets.length}항목 · 분류 검토 ${request.unmappedChanges.length}파일 · 규칙 검토 ${request.reviewOnlyChanges.length}파일`,
    details: `직접 변경: ${direct.slice(0, 12).join(', ') || '없음'}${direct.length > 12 ? ` 외 ${direct.length - 12}개` : ''}\n공통 변경: ${shared.map(p => p.split('/').pop()).join(', ') || '없음'}\n신규 연결: ${request.unlinkedAssets.map(a => a.name).join(', ') || '없음'}\n전체 변경 근거·노드 링크: request.json / request.md`,
    guard: '사용자 수정본 최우선 · 헤더 외곽28px/Hug · 현재 버튼 위계 유지.\n코드 변경은 검토·승인 후 반영 · 사용자 수정값 보호.',
    requestId: `요청 ID: ${request.requestId}`,
    link: 'GitHub 수정 요청 목록',
  };
}

export function makeInboxCode(config, request) {
  if (!config.inbox) return null;
  const fields = inboxFields(request);
  if (![config.inbox.pageId, config.inbox.frameId, ...Object.keys(fields).map(k => config.inbox.fieldNodeIds?.[k])].every(id => /^\d+:\d+$/.test(id ?? ''))) throw new Error('Figma 요청 안내판 ID가 누락됐습니다.');
  return `const cfg=${JSON.stringify({ fileKey: config.fileKey, ...config.inbox })};
const fields=${JSON.stringify(fields)};
if(figma.fileKey && figma.fileKey!==cfg.fileKey)throw new Error('대상 Figma 파일이 다릅니다.');
const page=await figma.getNodeByIdAsync(cfg.pageId);
if(!page || page.type!=='PAGE' || page.name!=='11 코드 변경 요청')throw new Error('요청 전용 페이지를 확인하세요.');
await figma.setCurrentPageAsync(page);
const frame=await figma.getNodeByIdAsync(cfg.frameId);
if(!frame || frame.type!=='FRAME' || frame.parent.id!==page.id || frame.name!=='MES Sync / 자동 요청 요약')throw new Error('자동 요청 안내판 범위가 변경됐습니다.');
const keys=Object.keys(fields);
const nodes=await Promise.all(keys.map(key=>figma.getNodeByIdAsync(cfg.fieldNodeIds[key])));
for(let i=0;i<nodes.length;i++){const n=nodes[i];if(!n || n.type!=='TEXT' || n.parent.id!==frame.id || n.name!=='sync/'+keys[i])throw new Error('요청 필드 위치/종류가 변경됐습니다: '+keys[i]);}
const fonts=[...new Map(nodes.flatMap(n=>n.getStyledTextSegments(['fontName'])).map(s=>[JSON.stringify(s.fontName),s.fontName])).values()];
await Promise.all(fonts.map(font=>figma.loadFontAsync(font)));
const mutatedNodeIds=[];
for(let i=0;i<nodes.length;i++){
 const n=nodes[i],key=keys[i];
 if(n.characters===fields[key] && n.textAutoResize==='HEIGHT' && n.layoutSizingVertical==='HUG')continue;
 n.textAutoResize='HEIGHT';n.layoutSizingVertical='HUG';n.characters=fields[key];
 if(key==='link')n.hyperlink={type:'URL',value:${JSON.stringify(config.repositoryUrl + '/issues')}};
 mutatedNodeIds.push(n.id);
}
const issues=[];
for(const n of nodes){if(n.width<=0 || n.height<=0 || n.x<0 || n.y<0 || n.x+n.width>frame.width+0.5 || n.y+n.height>frame.height+0.5)issues.push(n.id);}
if(issues.length)throw new Error('안내판 텍스트 경계 오류: '+issues.join(','));
if(mutatedNodeIds.length){mutatedNodeIds.push(frame.id);await frame.screenshot({scale:1});}
return {requestId:${JSON.stringify(request.requestId)},frameId:frame.id,mutatedNodeIds,issues,actualComponentsModified:false};
`;
}
