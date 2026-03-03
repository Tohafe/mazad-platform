CREATE DATABASE "chat-service-db";

\c chat-service-db;

CREATE TABLE IF NOT EXISTS  messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(255) NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    content TEXT NOT NULL,
    timestamp  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP  NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_room_id  ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);