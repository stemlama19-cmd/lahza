import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const files={'lib/discovery-guard.ts':'discovery-guard','lib/conversation-card.ts':'conversation-card','lib/knowledge.ts':'knowledge','lib/agent.ts':'agent','lib/provider.ts':'provider','lib/discovery-contract.ts':'discovery-contract','lib/discovery.ts':'discovery','app/api/discovery/route.ts':'discovery-route','tests/discovery.test.ts':'discovery.test'};
mkdirSync('.test-build/discovery',{recursive:true});
for(const [file,name] of Object.entries(files)){
 let source=readFileSync(file,'utf8');source=source.replace(/import (\w+) from ['"](?:@\/lib\/|\.\/)(approved-content|approved-topics)\.json['"];?/g,(_,name,file)=>'const '+name+' = '+readFileSync('lib/'+file+'.json','utf8')+';');
 for(const [p,n] of Object.entries(files)){source=source.replaceAll("'@/"+p.replace(/\.ts$/,'')+"'","'./"+n+".mjs'").replaceAll("'../"+p.replace(/\.ts$/,'')+"'","'./"+n+".mjs'");}
 source=source.replace(/from '\.\/(discovery-guard|knowledge|agent|provider|discovery-contract|discovery|conversation-card)'/g,"from './$1.mjs'");
 writeFileSync('.test-build/discovery/'+name+'.mjs',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
}
const r=spawnSync(process.execPath,['--test','.test-build/discovery/discovery.test.mjs'],{encoding:'utf8'});console.log(r.stdout);console.error(r.stderr);
writeFileSync('docs/DISCOVERY-TEST-RESULTS.txt','Version '+JSON.parse(readFileSync('package.json','utf8')).version+'. Runtime timestamp: '+new Date().toISOString()+'\nProvider responses MOCKED. These are contract/guard tests, NOT live-model performance or a run of the 20-case development set.\n'+r.stdout+r.stderr);process.exit(r.status??1);
