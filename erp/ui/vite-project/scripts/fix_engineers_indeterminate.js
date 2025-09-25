const fs = require('fs');
const path = require('path');
const file = path.resolve('src/pages/Engineers.tsx');
let s = fs.readFileSync(file, 'utf8');

// 1) marginLeft: auto  ->  "auto"
s = s.replace(/marginLeft:\s*auto/g, 'marginLeft: "auto"');

// 2) JSX 속성 형태의 indeterminate 제거 (어디에 있든 전부)
s = s.replace(/\s*indeterminate=\{[^}]*\}\s*/g, ' ');

// 3) 헤더 전체선택 체크박스에 ref로 indeterminate 설정 추가
//    checked={allChecked} 첫 번째만 대상으로 함
s = s.replace(
  'checked={allChecked}',
  'checked={allChecked} ref={(el)=>{ if(el){ const some=(typeof hasSomeChecked!=="undefined" ? hasSomeChecked : ((selected?.size||0)>0 && (items?.length||0)>0 && (selected?.size||0)<(items?.length||0))); el.indeterminate = some && !allChecked; }}}'
);

fs.writeFileSync(file, s);
console.log('[OK] Engineers.tsx patched');
