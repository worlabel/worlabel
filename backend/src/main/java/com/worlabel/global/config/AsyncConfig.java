package com.worlabel.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@EnableAsync
@Configuration
public class AsyncConfig {

    @Bean(name = "imageUploadExecutor")
    public ThreadPoolTaskExecutor imageUploadExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        // 최적 스레드 수 = CPU 코어 수 * (1 + (I/O 작업 시간 / CPU 작업 시간))
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);

        executor.setThreadNamePrefix("imageUploadExecutor-");
        executor.initialize();

        return executor;
    }
}
