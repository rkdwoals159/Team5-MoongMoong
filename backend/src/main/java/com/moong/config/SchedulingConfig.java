package com.moong.config;

import java.util.concurrent.ThreadPoolExecutor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Slf4j
@Configuration
@EnableScheduling
public class SchedulingConfig {

    private static final String SCHEDULER_PREFIX = "moong-scheduler-";

    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        int coreCount = Runtime.getRuntime().availableProcessors();
        scheduler.setPoolSize(coreCount);
        scheduler.setThreadNamePrefix(SCHEDULER_PREFIX);
        scheduler.setTaskDecorator(getTaskDecorator());
        scheduler.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        scheduler.initialize();
        return scheduler;
    }

    public TaskDecorator getTaskDecorator() {
        return runnable -> () -> {
            try {
                log.info("스케줄링 로직 시작 - {}", Thread.currentThread().getName());
                runnable.run();
                log.info("스케줄링 로직 완료 - {}", Thread.currentThread().getName());
            } catch (Exception exception) {
                log.error("스케줄링 중 예외", exception);
                throw exception;
            }
        };
    }
}
