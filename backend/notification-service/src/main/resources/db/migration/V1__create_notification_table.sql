CREATE SEQUENCE notification_id_seq INCREMENT BY 100 START WITH 1;
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY DEFAULT nextval('notification_id_seq'),
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_url VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_user ON notifications(user_id, created_at DESC)
