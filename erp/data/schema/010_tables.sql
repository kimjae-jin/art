-- 엔지니어 테이블(민감정보 암호화)
-- 기존 engineers가 있다면 백업 후 교체를 권장. 여기서는 존재시 스킵 없이 upsert 가능하도록 예시만 제시.
-- 실환경에선 마이그레이션 스크립트로 변환 권장.

-- 안전을 위해 트랜잭션
BEGIN;

-- 기존 테이블이 있다면 유지. 없으면 생성.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='engineers') THEN
    CREATE TABLE engineers (
      id           SERIAL PRIMARY KEY,
      -- 암호화 컬럼
      name_enc         BYTEA NOT NULL,
      employee_no_enc  BYTEA,
      -- 검색/조인용 최소 정보 (비식별화)
      name_hash        BYTEA,       -- digest(lower(name),'sha256') 등
      employee_no_hash BYTEA,
      -- 비민감/업무상 필요 컬럼(가급적 평문)
      status       TEXT,            -- 재직/퇴직/퇴사예정 등
      joined_at    DATE,
      retired_at   DATE,
      created_at   TIMESTAMP DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_engineers_name_hash ON engineers (name_hash);
    CREATE INDEX IF NOT EXISTS idx_engineers_empno_hash ON engineers (employee_no_hash);
  END IF;
END$$;

-- 기술경력(엔지니어링산업진흥법) - 민감 컬럼 암호화
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='engineer_careers_engineering') THEN
    CREATE TABLE engineer_careers_engineering (
      id            SERIAL PRIMARY KEY,
      engineer_id   INT NOT NULL REFERENCES engineers(id) ON DELETE CASCADE,
      company_name_enc BYTEA NOT NULL,
      project_name_enc BYTEA NOT NULL,
      client_enc       BYTEA,
      -- 검색용 해시(선택)
      project_hash  BYTEA,
      -- 비민감/계산용
      start_date    DATE NOT NULL,
      end_date      DATE,
      amount        NUMERIC(18,2),
      created_at    TIMESTAMP DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_careers_engineer_id ON engineer_careers_engineering(engineer_id);
    CREATE INDEX IF NOT EXISTS idx_careers_project_hash ON engineer_careers_engineering(project_hash);
  END IF;
END$$;

-- 증빙 파일 메타 (파일 자체는 암호화된 바이너리를 파일시스템에 저장)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='engineer_evidences') THEN
    CREATE TABLE engineer_evidences (
      id           SERIAL PRIMARY KEY,
      engineer_id  INT NOT NULL REFERENCES engineers(id) ON DELETE CASCADE,
      section      TEXT NOT NULL,   -- 'techcareer' 등
      file_path    TEXT NOT NULL,    -- 암호화된 파일 경로 (ex. /data/uploads/xxx.enc)
      uploaded_at  TIMESTAMP DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_evidences_engineer_id ON engineer_evidences(engineer_id);
  END IF;
END$$;

COMMIT;
