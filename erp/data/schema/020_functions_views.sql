-- 함수/뷰 소유자: erp_dba (권장)
SET ROLE postgres;

-- 세션 변수에서 키를 읽어 복호화하는 helper
CREATE OR REPLACE FUNCTION erp_get_symkey() RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE k TEXT;
BEGIN
  -- 세션에 설정된 키 사용(없으면 예외)
  BEGIN
    k := current_setting('erp.symkey');
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'Encryption key not set. Use: SET LOCAL erp.symkey = ''<key>''';
  END;
  RETURN k;
END$$;

-- 복호화 함수들
CREATE OR REPLACE FUNCTION decrypt_text(enc BYTEA) RETURNS TEXT
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT convert_from(pgp_sym_decrypt(enc, erp_get_symkey()), 'UTF8');
$$;

-- 보안뷰: engineers_v (민감컬럼을 복호화해서 노출)
CREATE OR REPLACE VIEW engineers_v AS
SELECT
  id,
  decrypt_text(name_enc)        AS name,
  decrypt_text(employee_no_enc) AS employee_no,
  status, joined_at, retired_at, created_at
FROM engineers;

-- 보안뷰: careers_engineering_v
CREATE OR REPLACE VIEW careers_engineering_v AS
SELECT
  c.id, c.engineer_id,
  decrypt_text(c.company_name_enc) AS company_name,
  decrypt_text(c.project_name_enc) AS project_name,
  decrypt_text(c.client_enc)       AS client,
  c.start_date, c.end_date, c.amount, c.created_at
FROM engineer_careers_engineering c;

-- 권한 최소화: 앱 계정은 원본테이블 직접 접근 금지, 뷰/함수만 허용
REVOKE ALL ON engineers, engineer_careers_engineering, engineer_evidences FROM PUBLIC;
REVOKE ALL ON FUNCTION erp_get_symkey() FROM PUBLIC;
REVOKE ALL ON FUNCTION decrypt_text(BYTEA) FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO erp_app;
GRANT SELECT ON engineers_v, careers_engineering_v TO erp_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON engineer_evidences TO erp_app; -- 증빙 메타 쓰기 허용(파일은 FS)
GRANT EXECUTE ON FUNCTION decrypt_text(BYTEA) TO erp_app;
