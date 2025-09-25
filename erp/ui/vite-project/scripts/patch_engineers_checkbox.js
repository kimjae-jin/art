const fs = require('fs'), p=require('path');
const file = p.resolve('src/pages/Engineers.tsx');
if (!fs.existsSync(file)) { console.error('File not found:', file); process.exit(2); }
let s = fs.readFileSync(file,'utf8');
let changed = 0;

// A) marginLeft: auto  ->  "auto"
const beforeA = s;
s = s.replace(/marginLeft:\s*auto\b/g, 'marginLeft: "auto"');
if (s!==beforeA){ changed++; console.log('✔ marginLeft fixed'); }

// B) JSX 속성 indeterminate 제거 (타입에러 원인)
const beforeB = s;
s = s.replace(/\s+indeterminate=\{[^}]*\}/g, '');
if (s!==beforeB){ changed++; console.log('✔ JSX indeterminate prop removed'); }

// C) checked={allChecked} 뒤에 ref 추가 (첫 번째만)
//    이미 ref가 있으면 중복 추가하지 않음
if (!/checked=\{allChecked\}[^>]*ref=/.test(s)) {
  const beforeC = s;
  s = s.replace(
    /checked=\{allChecked\}/,
    'checked={allChecked} ref={(el)=>{ if(el){ const some=(typeof hasSomeChecked!=="undefined" ? hasSomeChecked : ((selected?.size||0)>0 && (items?.length||0)>0 && (selected?.size||0)<(items?.length||0))); el.indeterminate = some && !allChecked; }}}'
  );
  if (s!==beforeC){ changed++; console.log('✔ ref(indeterminate) attached'); }
}

// D) 상태 변수 보강: hasSomeChecked가 없으면 선언 추가
if (!/const\s+hasSomeChecked\b/.test(s)) {
  // selected, items, allChecked가 있을 것을 가정. 없으면 무해.
  s = s.replace(
    /(\n\s*const\s+allChecked\b[^\n]*\n)/,
    `$1  const hasSomeChecked = (selected?.size||0)>0 && (items?.length||0)>0 && (selected?.size||0)<(items?.length||0);\n`
  );
  changed++; console.log('✔ hasSomeChecked injected (fallback)');
}

fs.writeFileSync(file, s);
console.log(changed ? `DONE (changes: ${changed})` : 'No changes needed');

/* --- 검증: 문제 라인 스니펫 보여주기 --- */
const out = fs.readFileSync(file,'utf8');
const lines = out.split('\n');
function findLine(pat){
  for(let i=0;i<lines.length;i++){
    if (pat.test(lines[i])) return i+1;
  }
  return -1;
}
console.log('Check: line for marginLeft "auto" ->', findLine(/marginLeft:\s*"auto"/));
console.log('Check: header checkbox ref ->', findLine(/checked=\{allChecked\}.*ref=\{/));
