package com.moong.config;

import java.util.Arrays;
import java.util.concurrent.Executor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Slf4j
@Profile("!test")
@EnableAsync
@Configuration
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "groupEventChannelExecutor")
    public Executor groupEventExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("group-event-");
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(300);
        executor.setRejectedExecutionHandler((r, ex) -> {
            log.warn("groupEventChannelExecutor rejected task. poolSize={}, active={}, queued={}",
                    ex.getPoolSize(), ex.getActiveCount(), ex.getQueue().size());
        });
        executor.initialize();
        return executor;
    }

    @Bean(name = "paymentEventExecutor")
    public Executor paymentEventExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("payment-event-");
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(100);
        executor.setRejectedExecutionHandler((r, ex) -> {
            log.warn("paymentEventExecutor rejected task. poolSize={}, active={}, queued={}",
                    ex.getPoolSize(), ex.getActiveCount(), ex.getQueue().size());
        });
        executor.initialize();
        return executor;
    }

    @Bean(name = "emailEventExecutor")
    public Executor emalEventExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("email-event-");
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setRejectedExecutionHandler((r, ex) -> {
            log.warn("emailEventExecutor rejected task. poolSize={}, active={}, queued={}",
                    ex.getPoolSize(), ex.getActiveCount(), ex.getQueue().size());
        });
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) ->
                log.error(
                        "Async error in {} with params={}",
                        method.getName(),
                        Arrays.toString(params),
                        ex
                );
    }
}

