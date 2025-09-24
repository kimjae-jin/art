CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 운영용 최소권한 계정(앱이 접속할 계정) 생성 예시
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='erp_app') THEN
    CREATE ROLE erp_app LOGIN PASSWORD 'change_me_strong!';
  END IF;
END$$;

-- DBA 역할(암호화 함수 소유자) - 필요시
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='erp_dba') THEN
    CREATE ROLE erp_dba LOGIN PASSWORD 'change_me_strong_dba!';
    GRANT erp_dba TO postgres;
  END IF;
END$$;
