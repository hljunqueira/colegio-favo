-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE DATABASE
-- ==========================================================

-- 1. Enable RLS on Critical Tables
ALTER TABLE "Nota" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Frequencia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FichaAnamnese" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Atestado" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReservaLivro" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Financeiro" ENABLE ROW LEVEL SECURITY;

-- 2. Drop Existing Policies if any
DROP POLICY IF EXISTS "Select own student notes" ON "Nota";
DROP POLICY IF EXISTS "Select own children notes" ON "Nota";
DROP POLICY IF EXISTS "Select own student attendance" ON "Frequencia";
DROP POLICY IF EXISTS "Select own children attendance" ON "Frequencia";
DROP POLICY IF EXISTS "Select own student anamnese" ON "FichaAnamnese";
DROP POLICY IF EXISTS "Select own children anamnese" ON "FichaAnamnese";
DROP POLICY IF EXISTS "Select own student certificates" ON "Atestado";
DROP POLICY IF EXISTS "Select own children certificates" ON "Atestado";
DROP POLICY IF EXISTS "Select own student book reservations" ON "ReservaLivro";
DROP POLICY IF EXISTS "Select own children book reservations" ON "ReservaLivro";

-- 3. Create Select Policies for Students (role: STUDENT / matricula)
CREATE POLICY "Select own student notes" ON "Nota"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT id FROM "Aluno" WHERE "userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own student attendance" ON "Frequencia"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT id FROM "Aluno" WHERE "userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own student anamnese" ON "FichaAnamnese"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT id FROM "Aluno" WHERE "userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own student certificates" ON "Atestado"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT id FROM "Aluno" WHERE "userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own student book reservations" ON "ReservaLivro"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT id FROM "Aluno" WHERE "userId"::text = auth.uid()::text
    )
  );

-- 4. Create Select Policies for Parents (role: PARENT / responsavel)
CREATE POLICY "Select own children notes" ON "Nota"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT a.id FROM "Aluno" a
      JOIN "Responsavel" r ON a."responsavelId" = r.id
      WHERE r."userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own children attendance" ON "Frequencia"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT a.id FROM "Aluno" a
      JOIN "Responsavel" r ON a."responsavelId" = r.id
      WHERE r."userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own children anamnese" ON "FichaAnamnese"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT a.id FROM "Aluno" a
      JOIN "Responsavel" r ON a."responsavelId" = r.id
      WHERE r."userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own children certificates" ON "Atestado"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT a.id FROM "Aluno" a
      JOIN "Responsavel" r ON a."responsavelId" = r.id
      WHERE r."userId"::text = auth.uid()::text
    )
  );

CREATE POLICY "Select own children book reservations" ON "ReservaLivro"
  FOR SELECT
  USING (
    alunoId IN (
      SELECT a.id FROM "Aluno" a
      JOIN "Responsavel" r ON a."responsavelId" = r.id
      WHERE r."userId"::text = auth.uid()::text
    )
  );
