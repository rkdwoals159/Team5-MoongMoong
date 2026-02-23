package com.moong.repository.groupconnection;

import java.util.List;

public interface GroupConnectionRepository {

    void save(long groupId, long memberId);

    void delete(long groupId, long memberId);

    List<Long> findAllMemberIdsByGroupId(long groupId);
}
