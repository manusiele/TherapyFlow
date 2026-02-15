-- Messages table for chat functionality
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('therapist', 'patient')),
  receiver_id UUID NOT NULL,
  receiver_type VARCHAR(20) NOT NULL CHECK (receiver_type IN ('therapist', 'patient')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table to track chat threads
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, receiver_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_therapist ON conversations(therapist_id);
CREATE INDEX IF NOT EXISTS idx_conversations_patient ON conversations(patient_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    (sender_id = auth.uid() AND sender_type = (auth.jwt() -> 'user_metadata' ->> 'role')) OR
    (receiver_id = auth.uid() AND receiver_type = (auth.jwt() -> 'user_metadata' ->> 'role'))
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND 
    sender_type = (auth.jwt() -> 'user_metadata' ->> 'role')
  );

CREATE POLICY "Users can update their own messages" ON messages
  FOR UPDATE USING (
    sender_id = auth.uid() AND 
    sender_type = (auth.jwt() -> 'user_metadata' ->> 'role')
  );

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    therapist_id = auth.uid() OR patient_id = auth.uid()
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    therapist_id = auth.uid() OR patient_id = auth.uid()
  );

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE (therapist_id = NEW.sender_id AND patient_id = NEW.receiver_id)
     OR (therapist_id = NEW.receiver_id AND patient_id = NEW.sender_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp on new message
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();
