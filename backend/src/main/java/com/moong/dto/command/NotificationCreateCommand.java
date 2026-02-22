package com.moong.dto.command;

import com.moong.domain.entity.Crew;
import com.moong.event.EventType;
import com.moong.event.group.GroupEventPayload;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NotificationCreateCommand {

    private final long groupId;
    private final Crew actor;
    private final GroupEventPayload payload;
    private final EventType eventType;
}
