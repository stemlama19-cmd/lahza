"""Read the reviewer workbook without modifying its approval cells."""
import sys,json,zipfile,xml.etree.ElementTree as E
from pathlib import Path
z=zipfile.ZipFile(sys.argv[1]);n={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
ss=[''.join(x.itertext()) for x in E.fromstring(z.read('xl/sharedStrings.xml'))] if 'xl/sharedStrings.xml' in z.namelist() else []
rows=[]
for row in E.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:row',n):
 v={}
 for c in row.findall('s:c',n):
  x=c.find('s:v',n);i=c.find('s:is',n);v[''.join(filter(str.isalpha,c.get('r')))]=ss[int(x.text)] if c.get('t')=='s' else ''.join(i.itertext()) if i is not None else x.text if x is not None else ''
 if v.get('A','').startswith('adhan-'):
  rows.append(dict(id=v['A'],topic={'لماذا يوجد الأذان؟':'why','كيف بدأ؟':'origin','ماذا يحدث بعد النداء؟':'after'}.get(v['B'],'phrase_meanings'),ar=v['C'],en=v['D'],sourceId=v['E'],sourceName=v['F'],url=v['G'],reviewStatus=v['H'],reviewerNote=v.get('I','')))
p=Path(__file__).resolve().parent.parent/'docs/content/adhan-review.json';p.write_text(json.dumps({'sourceWorkbook':Path(sys.argv[1]).name,'claims':rows},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'imported':len(rows),'approved':sum(x['reviewStatus'] in ['معتمد','معتمد بتعديل'] for x in rows)}))
