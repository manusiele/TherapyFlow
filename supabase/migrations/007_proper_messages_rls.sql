-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow viewing messages" ON messages;
DROP POLICY IF EXISTS "Allow sending messages" ON messages;
DROP POLICY IF EXISTS "Allow updating messages" ON messages;
DROP POLICY IF EXISTS "Allow viewing conversations" ON conversations;
DROP POLICY IF EXISTS "Allow creating conversations" ON conversations;
DROP POLICY IF EXISTS "Allow updating conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Messages policies
-- Users can view messages where they are sender or receiver
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can send messages (as sender)
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Users can update messages they received (for marking as read)
CREATE POLICY "Users can update received messages" ON messages
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );

-- Conversations policies
-- Users can view conversations they are part of
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = therapist_id OR 
    auth.uid() = patient_id
  );

-- Users can create conversations they are part of
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = therapist_id OR 
    auth.uid() = patient_id
  );

-- Users can update conversations they are part of
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = therapist_id OR 
    auth.uid() = patient_id
  );
