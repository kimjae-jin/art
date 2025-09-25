# ERP 프로젝트 블루프린트 (요약)

## 0. 개요
프로젝트: ERP (원래 TM_ERP였으나 운영 명칭: erp)
주요 플랫폼: macOS (개발중인 장비: Mac mini), target: Windows 11 / macOS / Linux
백엔드: Python (FastAPI, SQLAlchemy, psycopg), DB: PostgreSQL
프론트엔드: React (Vite, TypeScript)

## 1. 현재 로컬 폴더 구조(핵심)
- backend/                - FastAPI app
  - app/
    - main.py
    - routers/
      - engineers.py
      - projects.py
      - engineer_careers.py
      - engineers_import.py (import-csv)
    - db/ (DB 연결 코드, 세션)
    - models/
    - schemas/
- ui/vite-project/        - React (src/pages/Engineers.tsx 등)
  - src/pages/
    - Engineers.tsx
    - Projects.tsx
    - Licenses.tsx
    - ...
  - src/components/
    - MainHeader.tsx
    - Toolbar.tsx
    - PageToolbar.tsx
  - src/lib/api.ts
  - src/utils/api.ts
  - src/theme.ts
- data/
  - schema/               - SQL schema files
  - seed/                 - seed SQL
  - backup/               - DB backups (encrypted)
  - uploads/              - encrypted evidence files
- docs/
  - blueprint.md          - (이 파일)

## 2. 실행 / 점검 명령 (macOS / zsh)
# 백엔드
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 프론트엔드
cd ui/vite-project
npm install
npm run dev

# DB 백업 예시
pg_dump -U postgres -d erp > data/backup/erp_backup_$(date +%F).sql

## 3. 복구·재현 관련 파일
- 엔지니어 목록 덤프: data/backup/erp_backup_YYYY-MM-DD.sql(.gpg 가능)
- 증빙 파일: data/uploads/*.gpg (GPG로 암호화)
- 중요한 env 변수: DATABASE_URL, ERP_SYMKEY (대칭키; 절대 깃에 커밋 금지)

## 4. UI/UX 규칙(통일)
- 모든 카테고리 상단 툴바 동일:
  - 좌측: [찾기] [상태] [선택삭제] [CSV 내보내기] [CSV 불러오기]
  - 우측: [목록보기] [카드보기] [신규등록(저채도)]
- 리스트: 좌측 체크박스, 상태(재직/퇴사예정/퇴직) 컬럼 항상 표기
- 더블클릭: 상세페이지(기본정보 + 탭형 세부영역)
- CSV import: 한글/영문 헤더 허용(사번/employee_no, 성명/name 등 매핑)

## 5. 보안·운영 원칙
1. DB 접속 정보는 .env로 관리
2. 증빙 파일은 FS에 암호화 저장(.gpg) 및 파일 경로를 DB에 메타로만 저장
3. 앱 계정(erp_app)은 뷰/함수만 접근, 민감 데이터 복호화는 최소 권한으로만 허용
4. 백업은 GPG로 암호화하여 저장, 평문파일은 shred 또는 안전 삭제

## 6. 깃허브 운영 (권장)
- 레포지토 이름: `erp` (TM_ERP 대신)
- 브랜치 전략: main + feature/* + hotfix/*
- 커밋 규칙: 작고 의미있게 (feat/ fix/ chore/ docs)
- 매 작업: 커밋 → 푸시 → CI 검증

## 7. 새 대화에서 저에게 전달할 '재현요청 템플릿'
붙여넣을 내용(필수):
- 깃 리포지토리 루트(또는 현재 로컬 경로)
- 마지막 커밋 hash (또는 'working tree' 상태 요약)
- DB 상태: (예: backup path, last dump date)
- 실행 중인 포트(프론트엔드/백엔드)
- 심각한 문제 요약(한두 문장) + 우선순위
- 필요한 작업: 예) "엔지니어 리스트 툴바 정렬(좌측/우측) 적용 + CSV import 동작 확인"

## 8. 윈도우(이동 장치)에서 세팅(요약)
- 설치: Git, Python3.11+, Node.js 18+, PostgreSQL
- PowerShell 예제:
  - python -m venv .venv
  - .\.venv\Scripts\Activate.ps1
  - pip install -r backend/requirements.txt
  - cd ui/vite-project && npm install && npm run dev

## 9. 비고
- 모든 스크립트/명령어는 docs/에 보관하여 재현 가능하게 유지하세요.
- 민감정보는 절대 깃에 올리지 마세요.

