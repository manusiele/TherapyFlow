-- ============================================
-- COMPLETE SUPABASE BACKEND SETUP
-- Run this after migrations 001, 002, and 003
-- ============================================

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_presence ENABLE ROW LEVEL SECURITY;

-- ============================================
-- THERAPISTS POLICIES
-- ============================================

CREATE POLICY "Therapists can view their own profile" ON therapists
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Therapists can update their own profile" ON therapists
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create therapist profile" ON therapists
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Therapists can view all therapists" ON therapists
  FOR SELECT USING (true);

-- ============================================
-- PATIENTS POLICIES
-- ============================================

CREATE POLICY "Patients can view their own profile" ON patients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Patients can update their own profile" ON patients
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Therapists can view their patients" ON patients
  FOR SELECT USING (therapist_id = auth.uid());

CREATE POLICY "Anyone can create patient profile" ON patients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Therapists can update their patients" ON patients
  FOR UPDATE USING (therapist_id = auth.uid());

-- ============================================
-- SESSIONS POLICIES
-- ============================================

CREATE POLICY "Therapists can view their sessions" ON sessions
  FOR SELECT USING (therapist_id = auth.uid());

CREATE POLICY "Patients can view their sessions" ON sessions
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Therapists can create sessions" ON sessions
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update their sessions" ON sessions
  FOR UPDATE USING (therapist_id = auth.uid());

CREATE POLICY "Therapists can delete their sessions" ON sessions
  FOR DELETE USING (therapist_id = auth.uid());

CREATE POLICY "Patients can view session details" ON sessions
  FOR SELECT USING (patient_id = auth.uid());

-- ============================================
-- ASSESSMENTS POLICIES
-- ============================================

CREATE POLICY "Therapists can view assessments for their patients" ON assessments
  FOR SELECT USING (
    therapist_id = auth.uid() OR 
    patient_id IN (SELECT id FROM patients WHERE therapist_id = auth.uid())
  );

CREATE POLICY "Patients can view their own assessments" ON assessments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Therapists can create assessments" ON assessments
  FOR INSERT WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "Therapists can update assessments" ON assessments
  FOR UPDATE USING (therapist_id = auth.uid());

-- ============================================
-- SESSION PRESENCE POLICIES
-- ============================================

CREATE POLICY "Users can view presence for their sessions" ON session_presence
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM sessions 
      WHERE therapist_id = auth.uid() OR patient_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own presence" ON session_presence
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own presence" ON session_presence
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own presence" ON session_presence
  FOR DELETE USING (user_id = auth.uid());

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  role TEXT;
BEGIN
  -- Check if user is a therapist
  SELECT 'therapist' INTO role
  FROM therapists
  WHERE id = user_id
  LIMIT 1;
  
  IF role IS NOT NULL THEN
    RETURN role;
  END IF;
  
  -- Check if user is a patient
  SELECT 'patient' INTO role
  FROM patients
  WHERE id = user_id
  LIMIT 1;
  
  RETURN role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get upcoming sessions
CREATE OR REPLACE FUNCTION get_upcoming_sessions(user_id UUID, days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
  id UUID,
  therapist_id UUID,
  patient_id UUID,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  status TEXT,
  session_type TEXT,
  therapist_name TEXT,
  patient_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.therapist_id,
    s.patient_id,
    s.scheduled_at,
    s.duration_minutes,
    s.status,
    s.session_type,
    t.name as therapist_name,
    p.name as patient_name
  FROM sessions s
  LEFT JOIN therapists t ON s.therapist_id = t.id
  LEFT JOIN patients p ON s.patient_id = p.id
  WHERE (s.therapist_id = user_id OR s.patient_id = user_id)
    AND s.scheduled_at >= NOW()
    AND s.scheduled_at <= NOW() + (days_ahead || ' days')::INTERVAL
    AND s.status != 'cancelled'
  ORDER BY s.scheduled_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get session statistics for therapist
CREATE OR REPLACE FUNCTION get_therapist_stats(therapist_uuid UUID, date_range INTEGER DEFAULT 30)
RETURNS TABLE (
  total_sessions BIGINT,
  completed_sessions BIGINT,
  cancelled_sessions BIGINT,
  pending_sessions BIGINT,
  active_patients BIGINT,
  total_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_sessions,
    COUNT(*) FILTER (WHERE status IN ('scheduled', 'pending')) as pending_sessions,
    COUNT(DISTINCT patient_id) as active_patients,
    ROUND(SUM(duration_minutes)::NUMERIC / 60, 2) as total_hours
  FROM sessions
  WHERE therapist_id = therapist_uuid
    AND scheduled_at >= NOW() - (date_range || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get patient progress
CREATE OR REPLACE FUNCTION get_patient_progress(patient_uuid UUID)
RETURNS TABLE (
  total_sessions BIGINT,
  completed_sessions BIGINT,
  missed_sessions BIGINT,
  latest_assessment_score INTEGER,
  assessment_trend TEXT
) AS $$
DECLARE
  prev_score INTEGER;
  curr_score INTEGER;
BEGIN
  -- Get latest two assessment scores
  SELECT score INTO curr_score
  FROM assessments
  WHERE patient_id = patient_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  SELECT score INTO prev_score
  FROM assessments
  WHERE patient_id = patient_uuid
  ORDER BY created_at DESC
  LIMIT 1 OFFSET 1;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as missed_sessions,
    curr_score as latest_assessment_score,
    CASE 
      WHEN prev_score IS NULL THEN 'insufficient_data'
      WHEN curr_score < prev_score THEN 'improving'
      WHEN curr_score > prev_score THEN 'declining'
      ELSE 'stable'
    END as assessment_trend
  FROM sessions
  WHERE patient_id = patient_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKETS (Optional)
-- ============================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for documents
CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE session_presence;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Run this to verify setup
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
