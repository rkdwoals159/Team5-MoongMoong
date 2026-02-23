package com.moong.repository.groupconnection;

import com.moong.domain.notification.key.RedisSseKey;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class GroupConnectionRedisRepository implements GroupConnectionRepository {

    private final StringRedisTemplate stringRedisTemplate;

    public void save(long groupId, long memberId) {
        String key = new RedisSseKey(groupId).value();
        stringRedisTemplate.opsForSet().add(key, String.valueOf(memberId));
    }

    public void delete(long groupId, long memberId) {
        String key = new RedisSseKey(groupId).value();
        stringRedisTemplate.opsForSet().remove(key, String.valueOf(memberId));
    }

    public List<Long> findAllMemberIdsByGroupId(long groupId) {
        String key = new RedisSseKey(groupId).value();
        Set<String> memberIdsStr = stringRedisTemplate.opsForSet().members(key);
        if (memberIdsStr == null|| memberIdsStr.isEmpty()) {
            return List.of();
        }
        return memberIdsStr.stream()
                .map(Long::parseLong).toList();
    }
}
