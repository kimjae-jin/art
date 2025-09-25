const fs = require('fs'), p = require('path');
const file = p.resolve('src/pages/Engineers.tsx');
if (!fs.existsSync(file)) { console.error('[ERR] not found:', file); process.exit(2); }
const bak = file + '.bak.' + Date.now();
fs.copyFileSync(file, bak);

let s = fs.readFileSync(file, 'utf8');
let changed = 0;

// A) marginLeft: auto  →  marginLeft: "auto"
{
  const before = s;
  // 여유 패턴: 주석/줄바꿈/탭 포함, "auto"가 따옴표로 감싸지지 않은 경우만 치환
  s = s.replace(/marginLeft\s*:\s*(?!["'])\bauto\b/g, 'marginLeft: "auto"');
  if (s !== before) { changed++; console.log('✔ marginLeft -> "auto"'); }
}

// B) <input ... indeterminate={...} ...> 제거 (JSX에는 없는 prop)
{
  const before = s;
  s = s.replace(/\s+indeterminate=\{[^}]*\}/g, '');
  if (s !== before) { changed++; console.log('✔ removed JSX indeterminate prop'); }
}

// C) 헤더 체크박스에 ref로 indeterminate 설정 (checked={allChecked} 다음에만, 중복 방지)
{
  if (!/checked=\{allChecked\}[^>]*ref=/.test(s)) {
    const before = s;
    s = s.replace(
      /checked=\{allChecked\}/,
      'checked={allChecked} ref={(el)=>{ if(el){ const some=(typeof hasSomeChecked!=="undefined" ? hasSomeChecked : ((selected?.size||0)>0 && (items?.length||0)>0 && (selected?.size||0)<(items?.length||0))); el.indeterminate = some && !allChecked; } }}'
    );
    if (s !== before) { changed++; console.log('✔ attached ref for indeterminate'); }
  }
}

// D) hasSomeChecked가 선언되어 있지 않다면 보강
if (!/const\s+hasSomeChecked\b/.test(s)) {
  // allChecked 선언 다음 줄에 삽입 (없으면 안전-무시)
  s = s.replace(
    /(\n\s*const\s+allChecked[^\n]*\n)/,
    `$1  const hasSomeChecked = (selected?.size||0)>0 && (items?.length||0)>0 && (selected?.size||0)<(items?.length||0);\n`
  );
  changed++; console.log('✔ injected hasSomeChecked (fallback)');
}

fs.writeFileSync(file, s);
console.log(changed ? `DONE (changes: ${changed})` : 'No changes needed');

// 간단 확인
const lines = s.split('\n');
const find = (re)=> { for(let i=0;i<lines.length;i++){ if(re.test(lines[i])) return i+1; } return -1; };
console.log('Check line (marginLeft "auto")  :', find(/marginLeft:\s*"auto"/));
console.log('Check line (checkbox ref added):', find(/checked=\{allChecked\}.*ref=\{/));
