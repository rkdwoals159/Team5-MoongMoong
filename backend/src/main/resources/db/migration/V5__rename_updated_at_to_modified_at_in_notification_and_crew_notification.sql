-- notification 테이블
ALTER TABLE notification
    CHANGE COLUMN updated_at modified_at DATETIME NOT NULL;

-- crew_notification 테이블
ALTER TABLE crew_notification
    CHANGE COLUMN updated_at modified_at DATETIME NOT NULL;
