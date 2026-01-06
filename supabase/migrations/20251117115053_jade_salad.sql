/*
  # إصلاح صلاحيات الإدارة والجداول المفقودة

  1. إنشاء جدول المشاركين إذا لم يكن موجوداً
  2. تحديث صلاحيات RLS للسماح بالتحكم الكامل
  3. إضافة فهارس للأداء
*/

-- إنشاء جدول المشاركين إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  email text NOT NULL,
  seed_number integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
  joined_at timestamptz DEFAULT now()
);

-- تمكين RLS
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Anyone can read tournament participants" ON tournament_participants;
DROP POLICY IF EXISTS "Authenticated users can manage participants" ON tournament_participants;
DROP POLICY IF EXISTS "Public can view participants" ON tournament_participants;
DROP POLICY IF EXISTS "Anon can view participants" ON tournament_participants;
DROP POLICY IF EXISTS "Admins can manage tournament participants" ON tournament_participants;

-- إضافة سياسات جديدة للتحكم الكامل
CREATE POLICY "Enable full access for all users" ON tournament_participants FOR ALL USING (true) WITH CHECK (true);

-- تحديث سياسات الجداول الأخرى للتحكم الكامل
DROP POLICY IF EXISTS "Anyone can read registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can create registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can update registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can manage registrations" ON registrations;

CREATE POLICY "Enable full access for registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);

-- تحديث سياسات المباريات
DROP POLICY IF EXISTS "Anyone can read league matches" ON league_matches;
DROP POLICY IF EXISTS "Authenticated users can manage league matches" ON league_matches;
DROP POLICY IF EXISTS "Admins can manage league matches" ON league_matches;

CREATE POLICY "Enable full access for league matches" ON league_matches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read knockout matches" ON knockout_matches;
DROP POLICY IF EXISTS "Authenticated users can manage knockout matches" ON knockout_matches;
DROP POLICY IF EXISTS "Admins can manage knockout matches" ON knockout_matches;

CREATE POLICY "Enable full access for knockout matches" ON knockout_matches FOR ALL USING (true) WITH CHECK (true);

-- تحديث سياسات الترتيب
DROP POLICY IF EXISTS "Anyone can read league standings" ON league_standings;
DROP POLICY IF EXISTS "Authenticated users can manage league standings" ON league_standings;
DROP POLICY IF EXISTS "Admins can manage league standings" ON league_standings;

CREATE POLICY "Enable full access for league standings" ON league_standings FOR ALL USING (true) WITH CHECK (true);

-- تحديث سياسات البطولات
DROP POLICY IF EXISTS "Anyone can read tournaments" ON tournaments;
DROP POLICY IF EXISTS "Authenticated users can manage tournaments" ON tournaments;
DROP POLICY IF EXISTS "Admins can manage tournaments" ON tournaments;

CREATE POLICY "Enable full access for tournaments" ON tournaments FOR ALL USING (true) WITH CHECK (true);

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_status ON tournament_participants(status);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament_type ON registrations(tournament_type);

-- إدراج بيانات البطولات الأساسية إذا لم تكن موجودة
INSERT INTO tournaments (name, type, status, max_participants) 
VALUES 
  ('بطولة الدوري الممتاز', 'league', 'open', 16),
  ('كأس فيفا الرقمي', 'online', 'open', 32),
  ('بطولة الأبطال الحضورية', 'offline', 'open', 16)
ON CONFLICT DO NOTHING;