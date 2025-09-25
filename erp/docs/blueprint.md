# ERP 프로젝트 블루프린트

chatGPT 버전 블루프린트

📘 ERP 프로젝트 블루프린트 (정식판)
문서 목적: 지금 이 상태에서 누구나 즉시 이어서 개발할 수 있도록 하는 단일 기준 문서(Single Source of Truth)

[RESUME CONTEXT]
repo_root: /Users/geenie./Desktop/Art/erp
branch: main
last_commit: <여기에 마지막 커밋 해시 또는 "working tree" 적기>
backend_running: false
backend_port: 8000
frontend_running: false
frontend_port: 5173
db_backup: /Users/geenie./Desktop/Art/erp/data/backup/erp_backup_2025-09-22.sql.gpg
uploads_folder: /Users/geenie./Desktop/Art/erp/data/uploads
erp_symkey_placeholder: CHANGE_THIS_TO_A_STRONG_KEY
problem_summary: "Engineers toolbar layout inconsistent; CSV export endpoint missing; Frontend Engineers.tsx has checkbox/indeterminate TypeScript errors; backend engineers list query referencing non-existent birth column."
priority: high
requested_tasks: [
  "Fix Engineers.tsx toolbar order and colors (left: search,status,bulk-delete,export,import; right: list,card,create[low-chroma-gray])",
  "Resolve header checkbox indeterminate TypeScript issues",
  "Ensure backend /engineers/export-csv returns CSV and endpoint is routed",
  "Reinstate missing UI buttons and restore list/card toggle",
  "Add docs/blueprint.md to repo (already present)"
]

0) 실행 환경 (운영체제/디바이스/런타임)
디바이스: Mac mini (Apple Silicon 추정, /opt/homebrew 경로 사용)
OS/쉘: macOS + zsh
Python: Homebrew python@3.13 (로그: …/Cellar/python@3.13/3.13.5…)
가상환경: backend/.venv (활성화 후 uvicorn 실행)
Node/Vite: 프론트엔드 ui/vite-project에서 npm run dev 사용
패키지 일부:
백엔드: fastapi, uvicorn[standard], SQLAlchemy, psycopg(PostgreSQL), requests (테스트용)
프런트: react, react-router-dom, typescript, vite
포트 규약
백엔드: 127.0.0.1:8000
프론트: http://localhost:5173 (프록시 없이 백엔드 직접 호출)

1) 폴더 구조 & 역할
루트: 
/Users/geenie./Desktop/Art/erp
erp/
├─ backend/                         # FastAPI 백엔드
│  ├─ .venv/                        # (가상환경)
│  ├─ app/
│  │  ├─ main.py                    # FastAPI 앱, 라우터 등록
│  │  ├─ db/
│  │  │  ├─ __init__.py             # SessionLocal, Base 등 연결부
│  │  ├─ routers/
│  │  │  ├─ engineers.py            # 기술인 목록/삭제/CSV import·export
│  │  │  ├─ projects.py             # 프로젝트 API(스켈레톤/단순 목록용)
│  │  │  ├─ stub.py                 # 헬스체크/임시
│  │  │  └─ (필요 시) engineers_import.py
│  │  ├─ models/                    # (필요 시) SQLAlchemy 모델
│  │  └─ schemas/                   # (필요 시) Pydantic 스키마
│  └─ (기타)                         # Alembic 등 추후 추가
│
└─ ui/vite-project/                 # React + Vite 프런트엔드
   ├─ src/
   │  ├─ App.tsx                    # 라우팅/메인 레이아웃
   │  ├─ components/
   │  │  ├─ MainHeader.tsx          # 최상단 네비 (ERP/기술인/프로젝트/…)
   │  │  ├─ Toolbar.tsx             # 카테고리별 공용 툴바
   │  │  └─ PageToolbar.tsx         # (보조 분리된 경우)
   │  ├─ pages/
   │  │  ├─ Engineers.tsx           # 기술인: 목록/카드, CSV 불러오기·내보내기
   │  │  ├─ Projects.tsx
   │  │  ├─ Licenses.tsx
   │  │  ├─ PQ.tsx
   │  │  ├─ Bids.tsx
   │  │  ├─ Documents.tsx
   │  │  ├─ Estimates.tsx
   │  │  ├─ Weekly.tsx
   │  │  └─ Analytics.tsx
   │  ├─ styles/
   │  │  └─ toolbar.css             # 툴바 색/톤(라이트/다크) + 배치
   │  └─ (기타 공용 유틸/타입 등)
   └─ package.json / tsconfig 등
2) UI/UX 합의사항 (모든 카테고리에 동일 적용)
2.1 메인헤더(MainHeader)
메뉴: ERP(홈), 기술인, 프로젝트, 면허, PQ, 입찰, 문서, 견적, 주간회의, 분석
“ERP”는 홈 바로가기 역할 (홈 화면 문구: “준비 중”)
헤더 우측: 현재 날짜·시간 표시, (테마 토글은 운영 페이지에는 노출하지 않고, 시스템/전역 설정에 따름)
2.2 카테고리 툴바(Toolbar)
한 줄 배치/정렬 고정
좌측: 검색 상자, 상태(드롭다운; 재직/퇴사예정/퇴사), 선택삭제, CSV 내보내기, 불러오기
우측: 목록, 카드, 신규등록
색상/톤 기준
라이트/다크 모두 채도 낮음(저채도), 눈에 피로 없는 톤
신규등록 버튼은 기본 그레이 톤(저채도), 승인 없이 채도 상향 금지
CSV 내보내기
클릭 시 브라우저 다운로드 즉시 시작(파일 저장 대화상자)
CSV 불러오기
헤더: 한글/영문 둘 다 허용
(예: 사번/employee_no, 성명/name, 상태/status, 입사일/joined_at, 퇴사일/retired_at …)
테이블
좌측 첫 칼럼은 선택 체크박스
그 다음 칼럼은 상태(재직=중립, 퇴사=붉은 계열이되 저채도/눈에 피로 X, 퇴사예정=경고톤)
그 뒤로 기본정보(사번, 성명, 생년월일(주민번호에서 생년월일만), 입사일, 주소, 연락처, 부서, 퇴사예정일, 퇴사일, 비고)
헤더 더블클릭 시 정렬 토글
헤더 체크박스는 indeterminate(하프 체크) 동작
2.3 상세페이지
목록 더블클릭 → 상세
레이아웃: 기본정보(상단) + 세부정보 탭(하단)
모든 카테고리 동일 정책 유지

3) 백엔드 API 현황
GET /engineers: 목록(페이지/limit 파라미터), UI 호환용에 필요한 alias 필드는 SQL에서 안전하게 제공
POST /engineers/bulk-delete: { ids: number[] } 일괄 삭제
GET /engineers/export-csv: CSV 다운로드(응답 헤더 Content-Disposition: attachment; filename="engineers.csv" 적용)
POST /engineers/import-csv: { rows: Array<object> } JSON 업서트
필드 매핑: 영문/한글 모두 인식 (예: employee_no 또는 사번)
(프로젝트/면허 등은 동일 패턴으로 확장 예정)
DB: 현재 PostgreSQL 경로 기준(로컬), SQLAlchemy + psycopg 사용
주의: 실제 컬럼 존재와 UI 필드 셋이 맞도록 마이그레이션 필요(Alembic 권장)

4) 자주 발생했던 이슈와 고정 해법
TypeScript
marginLeft: auto 오류 → "auto" 문자열로
<input indeterminate={…} /> 타입 에러 → ref로 DOM 접근하여 el.indeterminate = true/false 세팅
ChangeEvent 경고 → import type { ChangeEvent } from "react"; (type-only import)
React is declared but its value is never read. → React 17+ JSX Transform 사용 시 import 제거해도 무방
다운로드 버튼 동작
a 태그 사용: <a href="/engineers/export-csv" download>CSV 내보내기</a>
또는 <button onClick={() => { window.location.href="/engineers/export-csv"; }}>…</button>
(전자는 브라우저가 즉시 다운로드 처리에 더 안정적)
포트 점유(Address already in use)
# 백엔드가 이미 떠 있다면 죽이고 재기동
lsof -i :8000 -nP | awk 'NR>1{print $2}' | xargs -r kill -9
requests 모듈 없음(테스트용)
cd "/Users/geenie./Desktop/Art/erp/backend"
source .venv/bin/activate
pip install requests

5) 개발·운영 절차 (터미널)
5.1 백엔드
cd "/Users/geenie./Desktop/Art/erp/backend"
source .venv/bin/activate

# (포트가 물려 있으면 해제)
lsof -i :8000 -nP | awk 'NR>1{print $2}' | xargs -r kill -9

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
5.2 프런트엔드
cd "/Users/geenie./Desktop/Art/erp/ui/vite-project"
npm run dev
# 브라우저: http://localhost:5173
5.3 CSV 내보내기/불러오기(직접 호출 확인)
# 내보내기 (파일로 받기)
curl -s "http://127.0.0.1:8000/engineers/export-csv" -o /tmp/engineers.csv
wc -l /tmp/engineers.csv
head -5 /tmp/engineers.csv

# 불러오기 (간단 업서트 테스트)
python - <<'PY'
import requests, json
rows = [
  {"사번":"hor-001","성명":"홍길동","상태":"재직","입사일":"2023-03-01","퇴사일":None},
  {"employee_no":"hor-002","name":"김철수","status":"재직","joined_at":"2024-05-10","retired_at":None},
]
r = requests.post("http://127.0.0.1:8000/engineers/import-csv",
                  headers={"Content-Type":"application/json"},
                  data=json.dumps({"rows":rows}))
print(r.status_code, r.text)
PY
6) Git 운영 (TM_ERP → ERP 정식 전환)
목표: 기존 TM_ERP 흔적 제거, 저장소 명칭 erp로 통일
6.1 로컬 저장소 정리
루트는 이미 …/Art/erp 사용 중 — OK
상위에 남은 TM_ERP/ 폴더·하위 깃 흔적은 삭제(이미 삭제 흔적 로그 있음)
6.2 새 원격 저장소로 전환(권장)
cd "/Users/geenie./Desktop/Art/erp"

# 기존 remote 이름/URL 확인
git remote -v

# 원격을 새 저장소 'erp'로 바꾸기 (GitHub에서 먼저 빈 저장소 만들었다고 가정)
git remote set-url origin git@github.com:<OWNER>/erp.git

# 전체 상태 확인 후 문서/설정 동기화 커밋
git add -A
git commit -m "docs: add blueprint and align naming to ERP"
git push -u origin main


커밋 규칙
[feat] 기능, [fix] 버그, [style] 스타일/톤, [refactor] 구조, [docs] 문서
각 PR에 스크린샷/콘솔 로그 첨부(라이트·다크 1장씩)
작업 단위가 끝날 때마다 커밋 (툴바 색/정렬처럼 UI도 예외 없이)

7) 바로 다음 행동(핵심 체크리스트)
툴바 확정 UI를 Engineers에 재적용 → Projects~Analytics에 그대로 복제
좌측: 검색/상태/선택삭제/CSV 내보내기/불러오기
우측: 목록/카드/신규등록(저채도 그레이)
라이트/다크 모두 표준 톤 유지(눈부심 방지)
CSV 헤더 포맷
내보내기: 한글 필드명 + (요구 시) hor- 프리픽스(사번 값 생성 시)
불러오기: 한글/영문 헤더 모두 수용 매핑 고정
테이블 헤더 정렬 & 하프체크
더블클릭 정렬 토글
전체 선택 체크박스 ref로 indeterminate 세팅
상세 페이지 공통 프레임
기본정보 + 탭(세부정보), 더블클릭 진입, 모든 카테고리에 복제
커밋 & 태그
변경마다 커밋
UI 확정 시 v0.1-ui-freeze 태그로 고정점 생성

8) 장애/문의 로그(요약)
Cannot find name 'auto' → 스타일 값은 "auto" 문자열로
indeterminate 타입 에러 → JSX 속성 제거하고 ref로 DOM에서 세팅
ChangeEvent 경고 → type-only import
내보내기 버튼 미동작 → a 링크 방식/download 속성으로 브라우저 다운로드 보장
404/000 → 백엔드 미기동 또는 경로 불일치. 반드시 백엔드 먼저 기동/확인
Address in use → lsof -i :8000 … kill -9
9) 새 디바이스(Windows 11, 맥북 등)에서 ERP 환경 세팅 및 활용 방법
9.1 전제
원격 저장소: GitHub (예: git@github.com:<OWNER>/erp.git)
로컬 새 장치: Windows 11 (랩탑/데스크탑) 또는 macOS (맥북)
Python, Node.js, Git 설치 필요

9.2 공통 준비
Git 설치
Windows: git-scm.com → 설치 후 Git Bash 또는 PowerShell 사용
macOS: brew install git
Node.js / npm 설치
nodejs.org → 권장 LTS 버전 설치
설치 확인:
node -v
npm -v

Python 설치
Windows: python.org 에서 3.11+ 버전 설치 (설치 시 “Add Python to PATH” 체크)
macOS: brew install python@3.13
확인:
python --version

PostgreSQL 설치
Windows: postgresql.org/download/windows
macOS: brew install postgresql
설치 후 실행/접속 계정(postgres) 확인

9.3 프로젝트 내려받기 (GitHub 클론)
# 원하는 위치로 이동 (예: Windows: C:\Projects)
cd ~/Desktop/Projects   # (Windows는 PowerShell에서 cd 사용)

# GitHub 저장소 클론
git clone git@github.com:<OWNER>/erp.git
cd erp

9.4 백엔드 (FastAPI)
cd backend

# 가상환경 생성
python -m venv .venv

# 가상환경 활성화
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# 필수 패키지 설치
pip install -r requirements.txt

# DB 준비 (PostgreSQL에 erp DB 생성)
createdb -U postgres erp

# 서버 실행
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Windows에서 createdb가 안 되면 psql 접속 후 수동으로 DB 생성:

CREATE DATABASE erp;

9.5 프론트엔드 (React + Vite)
cd ../ui/vite-project

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173

9.6 GitHub 동기화 (팀·멀티 디바이스 작업 방식)
새 디바이스에서 수정 → 커밋 → 푸시
git add .
git commit -m "feat: modify Engineers UI toolbar"
git push origin main

9.7 Windows/macOS 차이 주의점
경로 구분: Windows(\), macOS(/) → 코드/스크립트는 가능하면 pathlib 등 OS 독립적 방법 사용
환경 변수:
Windows: set PORT=8000
macOS/zsh: export PORT=8000
쉘 스크립트: Windows는 .bat 또는 PowerShell, macOS는 .sh/zsh 사용
9.8 새 장치 세팅 완료 체크리스트
http://127.0.0.1:8000/health → 백엔드 OK (FastAPI 동작 확인)
http://localhost:5173 → 프론트 OK (Vite 서버)
CSV 내보내기/불러오기 정상 동작
GitHub push/pull 정상
👉 요약:
GitHub 저장소가 중심(Single Source of Truth) 이므로,
어떤 장치(Mac mini, Windows 랩탑, 맥북 등)에서도 Git clone → Python 가상환경 → Node install → DB 준비 → 서버 기동 순서만 지키면 똑같이 이어서 개발 가능.


10) ERP 운영 5대 원칙 및 카테고리 공통 동작 규칙
10.1 5가지 중요 원칙
보안성(Security)
모든 API 호출 시 CORS 제한 및 인증/인가(Token 기반) 적용 예정
DB 접근은 반드시 ORM(SQLAlchemy) 또는 parameterized query만 사용 (.execute(sql, params) 형식) → SQL Injection 차단
.env 또는 OS 환경 변수로 DB 접속 정보 관리 (코드에 직접 기재 금지)
GitHub에 push 시 secrets/ 폴더, .env 파일은 무조건 .gitignore 처리
통일성(Consistency)
모든 카테고리(기술인, 프로젝트, 면허, PQ, 입찰, 문서, 견적, 주간회의, 분석)의 UI/UX 동일
상단 Toolbar 구조:
좌측: 찾기, 상태(필터), 선택삭제, CSV 내보내기, CSV 불러오기
우측: 목록보기, 카드보기, 신규등록(저채도 버튼)
상세페이지 진입: 리스트에서 더블클릭 시 기본정보 + 탭 구조(세부정보)
신규등록: 기본정보 필드만 입력 → 저장 후 상세 탭 확장 가능
재현성(Reproducibility)
모든 명령어는 Mac mini(zsh) / Windows(PowerShell) 모두 복붙 실행 가능해야 함
DB 스키마, 초기 더미데이터, requirements/package.json 고정 버전 관리 → 신규 장치에서도 동일 실행 보장
확장성(Extensibility)
카테고리별 필드 구조는 통일된 CRUD 패턴 유지
CSV Import/Export는 필드 확장 시 자동 반영되도록 구현 (SELECT * or dict-based insert)
UI 컴포넌트(목록/카드/상세) 재사용 → 코드 중복 최소화
가시성(Transparency)
GitHub commit은 작은 단위로, 메시지에 카테고리와 변경 목적 명확히 기재
ex)
git add src/pages/Engineers.tsx src/components/Toolbar.tsx
git commit -m "feat(engineers): enable CSV import/export + toolbar consistency"
git push origin main

10.2 CSV/Excel 불러오기 & 내보내기 (공통 API 예시)
# 내보내기 (CSV)
curl -s -o engineers.csv "http://127.0.0.1:8000/engineers/export-csv"

# 불러오기 (CSV → API POST)
curl -X POST "http://127.0.0.1:8000/engineers/import-csv" \
  -H "Content-Type: application/json" \
  -d '{"rows":[{"employee_no":"E001","name":"홍길동","status":"재직"}]}'
→ 모든 카테고리 /export-csv, /import-csv API 동일하게 구현 (Projects, Licenses, PQ, …)

10.3 신규등록 규칙
Toolbar → 신규등록 버튼 클릭
기본정보만 입력 가능 (예: 기술인 → 사번, 성명, 상태, 입사일, 퇴사일)
저장 시 DB 반영 후 상세페이지 자동 이동
상세페이지 → 탭 구조 (세부정보: 자격증, 경력, 첨부문서 등)

10.4 목록/카드/상세 통일 동작
목록보기 (Table)
좌측: 선택상자 + 상태 아이콘
더블클릭: 상세페이지 진입
카드보기 (Grid)
요약 정보(성명, 상태, 주요일자) 표시
클릭: 상세페이지 진입
상세페이지 (탭 구조)
상단: 기본정보 (읽기/수정 가능)
하단: 탭으로 세부 정보 (경력, 자격증, 문서 등)

10.5 신규 디바이스 세팅 후 테스트 (PowerShell/zsh 공통)
# 백엔드 실행 확인
cd erp/backend
.venv\Scripts\Activate.ps1   # (Windows)
source .venv/bin/activate    # (macOS/Linux)
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 프론트엔드 실행 확인
cd ../ui/vite-project
npm install
npm run dev

# API CSV 내보내기 확인
curl -s -o test.csv "http://127.0.0.1:8000/engineers/export-csv"
head -5 test.csv

👉 이 블루프린트에 따라 모든 카테고리 동일 UI/UX,
CSV 입출력 지원, 보안성+통일성 유지, 신규등록은 기본정보 입력만,
더블클릭 상세 진입을 일관되게 보장합니다.
11) 변경 로그
--------------
※ 이 섹션은 실행한 주요 변경 사항을 기록하여 추후 다른 디바이스나 새 대화에서  
   맥락을 빠르게 복원할 수 있도록 정리하는 공간입니다.  
   (커밋 메시지와 함께 관리하면 추적이 더욱 용이합니다.)
### 2025-09-24
- **기술인(Engineers) 카테고리**
  - Toolbar UI 확정
    - 좌측: 찾기박스, 상태별보기, 선택삭제, CSV 내보내기, 불러오기
    - 우측: 목록/카드 전환, 신규등록(저채도 버튼)
  - 다크/라이트 모드 색상 채도 조정 (너무 튀지 않도록 톤 다운)
  - 신규등록 버튼 색상: Gray 계열로 낮춰 적용
  - 헤더 체크박스 `indeterminate` 동작 정상화
- **백엔드**
  - `/engineers/export-csv` 라우트 추가
    - CSV 내보내기 버튼과 연동, 브라우저에서 즉시 다운로드
  - `/engineers/import-csv` 라우트 추가
    - CSV/Excel 불러오기 가능 (헤더: 한글/영문 모두 지원 → 예: 사번/employee_no, 성명/name …)
  - SQLAlchemy 세션 기반으로 안전 업서트(ON CONFLICT) 구현
- **공통 규칙**
  - 모든 카테고리(기술인, 프로젝트, 면허, PQ, 입찰, 문서, 견적, 주간회의, 분석)에서  
    동일한 Toolbar 패턴 적용 예정
  - 목록 보기 + 카드 보기 전환 기능 유지
  - 더블클릭 시 상세페이지 진입 → 기본정보 + 세부정보(탭) 구조
### 기록 방법
- 새로운 기능 추가 → `11) 변경 로그`에 날짜별 bullet 형식으로 기록
- UI/UX 확정, DB 스키마 변경, API 추가/수정 사항은 반드시 여기에 기록
- 가능하다면 깃허브 커밋 해시도 함께 기재 (`commit: abc1234`)

