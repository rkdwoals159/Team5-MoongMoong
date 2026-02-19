-- Notification 테이블
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- NotificationCursor 테이블
CREATE TABLE IF NOT EXISTS notification_cursor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crew_id BIGINT NOT NULL,
    last_seen_notification_id BIGINT NULL,

    CONSTRAINT uk_notification_cursor_crew UNIQUE (crew_id)
);

-- CrewNotification 테이블
CREATE TABLE IF NOT EXISTS crew_notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crew_id BIGINT NOT NULL,
    notification_id BIGINT NOT NULL,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT uk_crew_notification_crew_notification UNIQUE (crew_id, notification_id)
);
