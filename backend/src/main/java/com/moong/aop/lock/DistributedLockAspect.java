package com.moong.aop.lock;

import com.moong.annotation.lock.DistributedLock;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.lang.reflect.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.context.annotation.Profile;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Component;

@Profile("!test")
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE) //트랜잭션 보다 먼저 수행되도록 우선순위 조정
@Aspect
@Component
@RequiredArgsConstructor
public class DistributedLockAspect {

    private final RedissonClient redissonClient;

    @Around("@annotation(com.moong.annotation.lock.DistributedLock)")
    public Object lock(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        DistributedLock distributedLock = method.getAnnotation(DistributedLock.class);

        String lockKey = createLockKey(
                distributedLock.key(),
                signature.getParameterNames(),
                joinPoint.getArgs()
        );

        RLock lock = redissonClient.getLock(lockKey);
        String threadName = Thread.currentThread().getName();

        try {
            log.info("[Lock Attempt] Thread: {}, Key: {}", threadName, lockKey);

            boolean acquired = lock.tryLock(
                    distributedLock.waitTime(),
                    distributedLock.leaseTime(),
                    distributedLock.timeUnit()
            );

            if (!acquired) {
                log.warn("[Lock Fail] Thread: {}, Key: {}", threadName, lockKey);
                throw new BusinessException(ErrorCode.DISTRIBUTED_LOCK_ACQUIRED_FAILED);
            }
            log.info("[Lock Success] Thread: {}, Key: {}", threadName, lockKey);
            return joinPoint.proceed();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new BusinessException(ErrorCode.DISTRIBUTED_LOCK_INTERRUPT);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                log.info("[Lock Released] Thread: {}, Key: {}", threadName, lockKey);
                lock.unlock();
            } else {
                log.info("[Lock Not Held] Thread: {}, Key: {}", threadName, lockKey);
            }
        }
    }

    private String createLockKey(String key, String[] parameterNames, Object[] args) {
        ExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext();

        for (int i = 0; i < parameterNames.length; i++) {
            context.setVariable(parameterNames[i], args[i]);
        }

        return parser.parseExpression(key).getValue(context, String.class);
    }
}

