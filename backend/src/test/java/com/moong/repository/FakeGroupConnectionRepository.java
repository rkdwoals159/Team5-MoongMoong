package com.moong.repository;

import com.moong.repository.groupconnection.GroupConnectionRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("test")
@Primary
@Component
public class FakeGroupConnectionRepository implements GroupConnectionRepository {

    private final Map<Long, Set<Long>> store = new HashMap<>();

    @Override
    public void save(long groupId, long memberId) {
        store.computeIfAbsent(groupId, k -> new HashSet<>())
                .add(memberId);
    }

    @Override
    public void delete(long groupId, long memberId) {
        Set<Long> members = store.get(groupId);
        if (members == null) {
            return;
        }
        members.remove(memberId);
    }

    @Override
    public List<Long> findAllMemberIdsByGroupId(long groupId) {
        Set<Long> members = store.get(groupId);
        if (members == null || members.isEmpty()) {
            return List.of();
        }
        return new ArrayList<>(members);
    }
}
