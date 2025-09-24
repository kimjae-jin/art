BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='engineer_careers_engineering' AND column_name='law'
  ) THEN
    ALTER TABLE engineer_careers_engineering
      ADD COLUMN law TEXT NOT NULL DEFAULT '건진법',
      ADD CONSTRAINT chk_career_law CHECK (law IN ('건진법','엔산법'));
    CREATE INDEX IF NOT EXISTS idx_engineer_careers_engineering_law
      ON engineer_careers_engineering(law);
  END IF;
END$$;

COMMIT;
