package com.moong.repository.groupConnection;

import java.util.List;

public interface GroupConnectionRepository {

    void save(long groupId, long memberId);

    void delete(long groupId, long memberId);

    List<Long> findAllMemberIdsByGroupId(long groupId);
}
