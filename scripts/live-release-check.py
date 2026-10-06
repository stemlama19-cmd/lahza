import json,sys,termios,subprocess,time,datetime,concurrent.futures, pathlib
try:
 a=termios.tcgetattr(0);a[3]&=~termios.ECHO;termios.tcsetattr(0,termios.TCSANOW,a)
except:pass
print('Ready for authorized live test configuration',flush=True)
config=json.loads(sys.stdin.readline()); root=pathlib.Path(__file__).resolve().parent.parent
previous=json.load(open(root.parent/'input/tests/لحظة/lahza-final-repair-log-v0.4.11.json'))
batch=json.load(open(root/'data/moments-batch1.json'))
original=[r['case'] for r in previous['finalLiveRun']['results']]
new=batch['testCases']
newAnswers={101:{'Q8':'سجدوا بعد الانحناء وكان أمامهم رجل يؤدون الحركات معه.'},102:{'Q8':'They were exercising with yoga mats and quiet music.','Q7':'They were exercising with yoga mats and quiet music.'},103:{'Q8':'He also washed his face and then entered the prayer room.'},104:{'Q8':'غسل اليدين والوجه فقط ثم جلس إلى المائدة.'},105:{'Q3':'عبارات سريعة بصوت رجل واحد، ثم قام الجميع واصطفوا.','Q5':'كان هذا بعد نداء أول أطول بنحو عشر دقائق.','Q7':'قام الناس واصطفوا وبدأت الصلاة مباشرة.'},106:{'Q3':'Ordinary speech, not melodic.','Q5':'No earlier call.','Q7':'Nobody moved afterwards.','Q2':'About twenty seconds.'},107:{'Q6':'Friday around noon.','Q7':'Everyone sat and listened, then prayed in rows.'},108:{'Q6':'مساء الثلاثاء.','Q7':'مجموعة صغيرة جالسة، والمتحدث جالس أمام كتاب.'}}
for r in new:r['answers']=newAnswers.get(r['id'],{})
rows=original+new
if config.get('ids'):rows=[r for r in rows if r['id'] in config['ids']]
def call(path,body):
 cfg='url = '+json.dumps(config['url']+path)+'\nsilent\nshow-error\nmax-time = 55\nheader = '+json.dumps('OAI-Sites-Authorization: Bearer '+config['auth'])+'\nheader = "Content-Type: application/json"\ndata = '+json.dumps(json.dumps(body,ensure_ascii=False),ensure_ascii=False)+'\n'
 t=time.time();r=subprocess.run(['curl','--config','-','--write-out','\nHTTP %{http_code}\n'],input=cfg,text=True,capture_output=True)
 raw,_,status=r.stdout.rpartition('\nHTTP ')
 try:d=json.loads(raw)
 except:d={'error':'non_json_response','body':raw[:500]}
 return {'status':int(status.strip() or 0),'seconds':round(time.time()-t,3),'response':d,'transportError':r.stderr or None}
def run(row):
 turns=[];token='';action='start';text=row['description'];lang=row.get('language','ar');finished=False
 for turn in range(5):
  rr=call('/api/moments',{'action':action,'text':text,'language':lang,'token':token});d=rr['response'];token=d.get('token','');out={**rr,'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'action':action,'input':text,'response':{k:v for k,v in d.items() if k!='token'}};turns.append(out)
  if rr['status']!=200:break
  if d.get('kind')=='explanation':finished=True;break
  decision=d.get('decision',{})
  if decision.get('decision')=='ask':text=row.get('answers',{}).get(decision.get('question_id'),'لا أعرف' if lang=='ar' else "I don’t know");action='reply';continue
  if decision.get('decision')=='confirm':
   mid=d.get('recognizedMomentId') or ('adhan' if decision.get('hypothesis')=='adhan' else None)
   expected={1:'adhan',3:'iqamah',8:'congregational-prayer',11:'adhan',13:'adhan',101:'congregational-prayer',103:'wudu',105:'iqamah',107:'khutbah'}.get(row['id'])
   if row['id']==10:action='reject';text='لا، ليس هذا ما أقصده' if lang=='ar' else 'No, that is not what I meant';continue
   if expected and mid==expected and config.get('accept',True):action='accept';text='';continue
   if not expected or mid!=expected:out['unexpectedConfirmation']=True
   finished=True;break
  finished=True;break
 result={'id':row['id'],'case':row,'turns':turns,'terminal':finished,'technicalErrors':[{'turn':i+1,'status':t['status'],'error':t['response'].get('error')} for i,t in enumerate(turns) if t['status']!=200]}
 print(json.dumps({'case':row['id'],'turns':len(turns),'status':turns[-1]['status'],'decision':turns[-1]['response'].get('decision',{}).get('decision'),'kind':turns[-1]['response'].get('kind'),'error':turns[-1]['response'].get('error')},ensure_ascii=False),flush=True)
 return result
report={'appVersionExpected':config.get('expectedVersion'),'startedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'endpoint':config['url'],'phase':config['phase'],'runs':[],'retriesAreSeparate':True}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
 for result in ex.map(run,rows):
  report['runs'].append(result);(root/'docs/release-0.6.1'/config['output']).write_text(json.dumps(report,ensure_ascii=False,indent=2))
report['completedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat();report['summary']={'cases':len(report['runs']),'technicalFailures':sum(bool(x['technicalErrors']) for x in report['runs']),'unexpectedConfirmations':sum(bool(t.get('unexpectedConfirmation')) for x in report['runs'] for t in x['turns'])}
(root/'docs/release-0.6.1'/config['output']).write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report['summary']),flush=True)
