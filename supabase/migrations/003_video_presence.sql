-- Add video room URL to sessions
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS video_room_url TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS video_room_name TEXT;

-- Create presence tracking table
CREATE TABLE IF NOT EXISTS session_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('therapist', 'patient')),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_session_presence_session_id ON session_presence(session_id);
CREATE INDEX idx_session_presence_online ON session_presence(session_id, is_online);

-- Function to update last_seen timestamp
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_seen
CREATE TRIGGER trigger_update_last_seen
  BEFORE UPDATE ON session_presence
  FOR EACH ROW
  EXECUTE FUNCTION update_last_seen();
