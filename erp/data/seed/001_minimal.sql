-- 사용 전: \set symkey '여기에_강력한_대칭키'

-- 엔지니어 1명
INSERT INTO engineers (name_enc, employee_no_enc, name_hash, employee_no_hash, status, joined_at, retired_at)
VALUES (
  pgp_sym_encrypt('홍길동', :'symkey'),
  pgp_sym_encrypt('E001', :'symkey'),
  digest(lower('홍길동'), 'sha256'),
  digest(lower('E001'), 'sha256'),
  '재직', DATE '2023-03-01', NULL
);

-- 방금 삽입된 id 확인용 CTE
WITH e AS (
  SELECT id FROM engineers ORDER BY id DESC LIMIT 1
)
INSERT INTO engineer_careers_engineering
  (engineer_id, company_name_enc, project_name_enc, client_enc, project_hash, start_date, end_date, amount)
SELECT
  e.id,
  pgp_sym_encrypt('해오름엔지니어링', :'symkey'),
  pgp_sym_encrypt('제주항만개발', :'symkey'),
  pgp_sym_encrypt('제주특별자치도', :'symkey'),
  digest(lower('제주항만개발'), 'sha256'),
  DATE '2022-01-01', DATE '2022-12-31', 150000000.00
FROM e;

-- 증빙 메타(파일은 암호화된 바이너리로 FS에 저장)
INSERT INTO engineer_evidences (engineer_id, section, file_path)
SELECT id, 'techcareer', '/Users/geenie./Desktop/Art/erp/data/uploads/홍길동_경력증명서.pdf.enc'
FROM engineers ORDER BY id DESC LIMIT 1;
