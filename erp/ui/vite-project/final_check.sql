-- 엔지니어 확인 (없으면 추가)
INSERT INTO engineers (id, name, employee_no, status, joined_at, retired_at)
VALUES (1, '홍길동', 'E001', '재직', '2023-03-01', NULL)
ON CONFLICT (id) DO NOTHING;

-- 엔지니어링 경력 입력
INSERT INTO engineer_careers_engineering
    (engineer_id, company_name, project_name, start_date, end_date, client, amount)
VALUES
    (1, '해오름엔지니어링', '제주항만개발', '2022-01-01', '2022-12-31', '제주특별자치도', 150000000);

-- 증빙자료 입력
INSERT INTO engineer_evidences
    (engineer_id, section, file_path)
VALUES
    (1, 'techcareer', '/uploads/evidence/홍길동_경력증명서.pdf');

-- 최종 확인용 조회
SELECT * FROM engineers;
SELECT * FROM engineer_careers_engineering;
SELECT * FROM engineer_evidences;
