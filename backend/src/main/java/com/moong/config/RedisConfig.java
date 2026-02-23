package com.moong.config;

import com.moong.event.notification.GroupEventMessageListener;
import com.moong.domain.notification.channel.RedisChannel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Profile("!test & !flyway")
@Configuration
public class RedisConfig {

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory redisConnectionFactory,
            GroupEventMessageListener groupEventMessageListener
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory);
        container.addMessageListener(groupEventMessageListener, new ChannelTopic(RedisChannel.SSE_GROUP_EVENT));
        return container;
    }
}
