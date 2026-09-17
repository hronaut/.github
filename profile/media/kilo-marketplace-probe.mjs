// Run only in the disposable network-disabled container; never mount an owner profile.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {once} from 'node:events';
import {execFileSync,spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {homedir} from 'node:os';
const require=createRequire('/workspace/package.json');
const {_electron:electron,expect}=require('@playwright/test');
assert.equal(process.getuid(),1000);
const kiloVersion=execFileSync('/opt/kilo/kilo',['--version'],{encoding:'utf8'}).trim();
assert.equal(kiloVersion,'7.7.3');
assert.equal(execFileSync('dpkg-query',['-W','-f=${Status} ${Version}','hronaut'],{encoding:'utf8'}),'install ok installed 2.4.25');
const root=await mkdtemp('/tmp/hronaut-kilo-fixture-');
const project=`${root}/project`,globalDir=`${homedir()}/.config/kilo`,profile=`${root}/app`;
for(const dir of [project,`${project}/.kilo`,globalDir,profile])await mkdir(dir,{recursive:true});
execFileSync('git',['init','-q',project]);
// Explicit bash rule keeps Kilo's documented legacy-permission migration out of
// this marketplace-preservation check; the earlier migration observation is retained.
const baseConfig={formatter:false,lsp:false,permission:{'*':'ask',bash:'deny'},mcp:{keep_me:{type:'remote',url:'http://127.0.0.1:1/unused',enabled:false}}};
await writeFile(`${project}/.kilo/kilo.json`,JSON.stringify(baseConfig));
await writeFile(`${globalDir}/kilo.json`,JSON.stringify(baseConfig));
await writeFile(`${profile}/settings.json`,JSON.stringify({mcpAuthentication:true,mcpToolSet:'complete',languagePreference:'en-US'}));
const fixture=createServer((_request,response)=>{response.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});response.end('<!doctype html><title>Kilo local fixture</title><h1>Kilo local fixture</h1><p>Synthetic disposable page; no account.</p><button id="check">Check result</button><p role="status" id="result">Not checked yet</p><script>if(localStorage.getItem("checked")==="yes")document.querySelector("#result").textContent="Verified via Kilo client";document.querySelector("#check").onclick=()=>{localStorage.setItem("checked","yes");document.querySelector("#result").textContent="Verified via Kilo client"}</script>')});
fixture.listen(0,'127.0.0.1');await once(fixture,'listening');
const fixtureUrl=`http://127.0.0.1:${fixture.address().port}/`;
const checks=[];let app,kilo,token,serverPassword,passed=false,stage='start',failure;
const pass=name=>{checks.push(name);console.log(JSON.stringify({check:name,passed:true}))};
const text=result=>result.content?.filter(x=>x.type==='text').map(x=>x.text).join('\n')??'';
let kiloLog='';
async function api(method,path,body){
  const response=await fetch(`http://127.0.0.1:47919${path}`,{method,headers:{'content-type':'application/json','x-kilo-directory':project,authorization:`Basic ${Buffer.from(`evaluator:${serverPassword}`).toString('base64')}`},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,`Kilo route ${path} HTTP status`);
  return response.json();
}
async function tool(name,args,expectedError=false){const result=await api('POST','/experimental/mcp/call-tool',{server:'hronaut',name,arguments:args});assert.equal(result.isError===true,expectedError,`tool ${name} status`);return result}
async function config(file){return JSON.parse(await readFile(file,'utf8'))}
function preserved(cfg){assert.deepEqual(cfg.permission,baseConfig.permission);assert.equal(cfg.formatter,false);assert.equal(cfg.lsp,false);assert.deepEqual(cfg.mcp.keep_me,baseConfig.mcp.keep_me)}
function normalized(cfg){const h=cfg.mcp.hronaut;assert.equal(h.type,'remote');assert.equal(h.oauth,false);assert.equal(h.url,'http://127.0.0.1:47812/mcp');assert.equal(h.headers.Authorization,'Bearer {env:HRONAUT_MCP_TOKEN}');assert.ok(!JSON.stringify(cfg).includes(token),'No literal test token in configuration')}
async function connected(){await expect.poll(async()=>{try{return (await api('GET','/mcp')).hronaut?.status}catch{return ''}},{timeout:30000}).toBe('connected')}
try{
  pass('released_kilo_7_7_3_and_installed_hronaut_2_4_25');
  stage='launch_authenticated_app';
  app=await electron.launch({executablePath:'/opt/Hronaut/hronaut',args:['--no-sandbox'],env:{...process.env,HRONAUT_USER_DATA_DIR:profile,HRONAUT_DOWNLOAD_DIR:profile,HRONAUT_DISABLE_AUTO_UPDATE:'1'},timeout:45000});
  const shell=await app.firstWindow();await shell.waitForLoadState('domcontentloaded');
  await app.evaluate(({BrowserWindow})=>{const win=BrowserWindow.getAllWindows()[0];win.setBounds({x:0,y:0,width:1600,height:900});win.show()});
  const version=await app.evaluate(({app})=>({version:app.getVersion(),packaged:app.isPackaged}));assert.deepEqual(version,{version:'2.4.25',packaged:true});
  await expect.poll(async()=>{try{return (await readFile(`${profile}/mcp-token`,'utf8')).trim().length>20}catch{return false}}).toBe(true);
  token=(await readFile(`${profile}/mcp-token`,'utf8')).trim();
  await expect.poll(async()=>{try{return (await fetch('http://127.0.0.1:47812/healthz',{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(2000)})).status}catch{return 0}}).toBe(200);
  assert.equal((await fetch('http://127.0.0.1:47812/healthz')).status,401);pass('fresh_authenticated_packaged_app_ready_and_no_token_health_denied');
  stage='launch_kilo';serverPassword=randomBytes(24).toString('hex');
  kilo=spawn('/opt/kilo/kilo',['serve','--hostname','127.0.0.1','--port','47919'],{cwd:project,env:{...process.env,KILO_DISABLE_AUTOUPDATE:'1',KILO_DISABLE_MODELS_FETCH:'1',KILO_EXPERIMENTAL_MCP_APPS:'1',KILO_SERVER_USERNAME:'evaluator',KILO_SERVER_PASSWORD:serverPassword,HRONAUT_MCP_TOKEN:token},stdio:['ignore','pipe','pipe']});
  kilo.stdout.on('data',x=>kiloLog+=x.toString());kilo.stderr.on('data',x=>kiloLog+=x.toString());
  await expect.poll(async()=>{try{return (await api('GET','/global/health')).healthy}catch{return false}},{timeout:30000}).toBe(true);
  assert.equal((await fetch('http://127.0.0.1:47919/global/health')).status,401);pass('released_kilo_server_ready_with_local_basic_auth');
  await api('GET','/mcp');preserved(await config(`${globalDir}/kilo.json`));preserved(await config(`${project}/.kilo/kilo.json`));pass('explicit_permission_baselines_preserved_before_marketplace_action');
  const item={type:'mcp',id:'hronaut',content:JSON.stringify({type:'streamable-http',url:'http://127.0.0.1:47812/mcp',oauth:false,headers:{Authorization:'Bearer {env:HRONAUT_MCP_TOKEN}'}})};
  stage='project_marketplace_install';
  assert.equal((await api('POST','/kilocode/marketplace/install',{item,target:'project'})).success,true);
  const projectConfig=await config(`${project}/.kilo/kilo.json`);preserved(projectConfig);normalized(projectConfig);pass('actual_marketplace_project_install_normalizes_transport_and_preserves_settings');
  assert.ok(!(await api('GET','/mcp')).hronaut);pass('project_header_environment_reference_is_skipped_not_connected');
  assert.equal((await api('POST','/kilocode/marketplace/install',{item,target:'project'})).success,false);pass('duplicate_project_install_rejected_without_overwrite');
  assert.equal((await api('POST','/kilocode/marketplace/remove',{item:{id:'hronaut',type:'mcp'},scope:'project'})).success,true);
  const removed=await config(`${project}/.kilo/kilo.json`);preserved(removed);assert.ok(!removed.mcp.hronaut);pass('marketplace_project_removal_preserves_unrelated_settings');
  stage='global_marketplace_install';
  assert.equal((await api('POST','/kilocode/marketplace/install',{item,target:'global'})).success,true);
  const globalConfig=await config(`${globalDir}/kilo.json`);preserved(globalConfig);normalized(globalConfig);assert.ok(!(await config(`${project}/.kilo/kilo.json`)).mcp.hronaut);pass('actual_global_install_preserves_settings_and_keeps_scope_separate');
  await connected();pass('global_kilo_connects_to_protected_hronaut_using_environment_reference');
  stage='actual_kilo_tool_workflow';
  const created=JSON.parse(text(await tool('browser_workspaces',{action:'create',name:'Kilo marketplace check',storage:'scratch'})));assert.ok(created.id && created.resumeKey);pass('kilo_client_creates_disposable_workspace');
  const opened=JSON.parse(text(await tool('browser_new_tab',{workspaceId:created.id,url:fixtureUrl})));const tabId=opened.activeTabId;assert.ok(tabId);pass('kilo_client_opens_synthetic_local_page');
  let page;await expect.poll(()=>{page=app.context().pages().find(x=>x.url()===fixtureUrl);return Boolean(page)}).toBe(true);
  await page.getByRole('heading',{name:'Kilo local fixture'}).waitFor();
  assert.ok(text(await tool('browser_snapshot',{workspaceId:created.id,tabId})).includes('Not checked yet'));pass('kilo_reads_initial_browser_result');
  await tool('browser_click',{workspaceId:created.id,tabId,selector:'#check'});
  await expect(page.locator('#result')).toHaveText('Verified via Kilo client');assert.equal(await page.evaluate(()=>localStorage.getItem('checked')),'yes');
  assert.ok(text(await tool('browser_snapshot',{workspaceId:created.id,tabId})).includes('Verified via Kilo client'));pass('kilo_action_native_dom_storage_and_fresh_snapshot_agree');
  stage='kilo_disconnect_resume';await api('POST','/mcp/hronaut/disconnect');await expect(page.locator('#result')).toHaveText('Verified via Kilo client');
  await api('POST','/mcp/hronaut/connect');await connected();
  assert.deepEqual(JSON.parse(text(await tool('browser_workspaces',{action:'list'}))),[]);pass('reconnected_kilo_client_does_not_inherit_workspaces');
  assert.ok(text(await tool('browser_status',{workspaceId:created.id},true)).includes('not authorized for this MCP client'));pass('id_alone_denied_after_kilo_reconnect');
  const resumed=JSON.parse(text(await tool('browser_workspaces',{action:'resume',workspaceId:created.id,resumeKey:created.resumeKey})));assert.ok(resumed.id===created.id);
  const status=JSON.parse(text(await tool('browser_status',{workspaceId:created.id})));assert.ok(status.tabs.some(t=>t.id===tabId));
  assert.ok(text(await tool('browser_snapshot',{workspaceId:created.id,tabId})).includes('Verified via Kilo client'));pass('explicit_capability_resume_retains_original_tab_and_result');
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-n','-f','x11grab','-video_size','1600x900','-i',process.env.DISPLAY,'-frames:v','1','-threads','1','/capture/kilo-result.png'],{stdio:'pipe'});
  stage='global_marketplace_remove';
  assert.equal((await api('POST','/kilocode/marketplace/remove',{item:{id:'hronaut',type:'mcp'},scope:'global'})).success,true);
  const globalRemoved=await config(`${globalDir}/kilo.json`);preserved(globalRemoved);assert.ok(!globalRemoved.mcp.hronaut);pass('global_removal_preserves_unrelated_settings');
  assert.ok(!kiloLog.includes(token) && !kiloLog.includes(serverPassword),'Disposable credentials absent from captured Kilo output');pass('no_literal_test_credentials_in_captured_kilo_output');
  passed=true;stage='complete';
}catch(error){failure=error instanceof Error?error.message:'Unknown failure';console.error(`Probe stopped at ${stage}: ${failure}`);process.exitCode=1;
}finally{
  if(kilo && kilo.exitCode===null){kilo.kill('SIGTERM');await Promise.race([once(kilo,'exit'),new Promise(resolve=>setTimeout(resolve,3000))]);if(kilo.exitCode===null){kilo.kill('SIGKILL');await once(kilo,'exit')}}
  if(app)await app.close().catch(()=>{});fixture.close();fixture.closeAllConnections();
  token=undefined;serverPassword=undefined;kiloLog='';
  await writeFile('/capture/result.json',JSON.stringify({schemaVersion:1,executedAt:new Date().toISOString(),passed,stage,failure,versions:{kilo:kiloVersion,hronaut:'2.4.25',node:process.version},checks,environment:'non-root Ubuntu Docker/Xvfb; network none; no published ports; fresh disposable app/project/global config',limitations:['Kilo released server marketplace installation API, not VS Code marketplace UI or public catalogue acceptance','Tools invoked through Kilo experimental MCP Apps endpoint; not a model-driven agent or permission-prompt test','Hronaut container-only --no-sandbox; no native OS, other platform or security audit claim','Existing package installed in base image; no full newcomer app download/install walkthrough','Fresh generated disposable token; no owner credential/profile or external website','Client disconnect/resume only; no application restart in this check','Marketplace metadata generator not yet exercised']},null,2)+'\n');
}
