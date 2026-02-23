package com.moong.event.member;

import com.moong.service.report.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class WelcomeEmailEventListener {

    private final MailService mailService;

    @Async("welcomeEmailExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendWelcomeEmail(WelcomeMailEvent event) {
        mailService.sendWelcomeEmail(event.email());
    }
}
