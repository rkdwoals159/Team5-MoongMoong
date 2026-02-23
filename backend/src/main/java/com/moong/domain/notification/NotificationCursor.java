package com.moong.domain.notification;

import com.moong.domain.crew.Crew;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(
        name = "notification_cursor",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_notification_cursor_crew",
                columnNames = {"crew_id"}
        )
)
public class NotificationCursor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="crew_id", foreignKey=@ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Crew crew;

    private Long lastSeenNotificationId;

    public boolean shouldUpdateCursor(long newestId) {
        return lastSeenNotificationId == null || newestId > lastSeenNotificationId;
    }

    public NotificationCursor(Crew crew) {
        this(null, crew, null);
    }
}
