import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
mkdirSync('.test-build',{recursive:true});
for(const path of ['lib/knowledge.ts','lib/agent.ts','lib/provider.ts','tests/acceptance.test.ts','tests/provider.test.ts','app/api/journey/route.ts','tests/api.test.ts']) {const name=path.split('/').pop().replace('.ts','.mjs');let source=readFileSync(path,'utf8').replaceAll("'./knowledge'","'./knowledge.mjs'").replaceAll("'../lib/agent'","'./agent.mjs'").replaceAll("'../lib/knowledge'","'./knowledge.mjs'").replaceAll("'../lib/provider'","'./provider.mjs'").replaceAll("'@/lib/agent'","'./agent.mjs'").replaceAll("'@/lib/provider'","'./provider.mjs'").replaceAll("'@/lib/knowledge'","'./knowledge.mjs'").replaceAll("'../app/api/journey/route'","'./route.mjs'");source=source.replace(/import (\w+) from ['"](?:@\/lib\/|\.\/)(approved-content|approved-topics)\.json['"];?/g,(_,name,file)=>'const '+name+' = '+readFileSync('lib/'+file+'.json','utf8')+';');const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});writeFileSync('.test-build/'+name,out.outputText);}
const r=spawnSync(process.execPath,['--test','.test-build/acceptance.test.mjs','.test-build/provider.test.mjs','.test-build/api.test.mjs'],{encoding:'utf8'});
console.log(r.stdout);console.error(r.stderr);
writeFileSync('docs/TEST-RESULTS.txt','Execution: '+new Date().toISOString()+'\n'+r.stdout+r.stderr+'\nExit status: '+r.status+'\nAutomated rules/citation checks only. Not scholarly approval, target-user research or general-assistant comparison.\n');
process.exit(r.status??1);
