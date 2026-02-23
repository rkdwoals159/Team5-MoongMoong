package com.moong.service.report;

import com.moong.config.report.MailProperties;
import com.moong.domain.report.MonthlyReport;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
@EnableConfigurationProperties(MailProperties.class)
public class MailService {

    private static final String MONTHLY_REPORT_SUBJECT_FORMAT = "[월간 소비 리포트] %d년 %d월";
    private static final String WELCOME_SUBJECT_FORMAT = "🐾 moong 가족이 되신 걸 환영해요!";
    private static final String REPORT_TEMPLATE_FILE_NAME = "report-email";
    private static final String WELCOME_TEMPLATE_FILE_NAME = "welcome-email";

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final MailProperties mailProperties;

    @Async("emailEventExecutor")
    public void sendMonthlyReport(MonthlyReport report) {
        try {
            String subject = buildSubject(report);
            Context ctx = buildMonthlyReportContext(report, mailProperties.serviceName());
            String htmlContent = templateEngine.process(REPORT_TEMPLATE_FILE_NAME, ctx);

            MimeMessage message = createMailToMember(report.getMemberEmail(), subject, htmlContent);

            mailSender.send(message);
            log.info("월간 리포트 발송 완료: {} ({}년 {}월)",
                    report.getMemberEmail(),
                    report.getReportYear(),
                    report.getReportMonth()
            );
        } catch (MessagingException e) {
            log.error("월간 리포트 발송 실패: {} - {}", report.getMemberEmail(), e.getMessage(), e);
            throw new BusinessException(ErrorCode.MONTHLY_REPORT_SEND_ERROR);
        }
    }

    public void sendWelcomeEmail(String email) {
        try {
            String htmlContent = templateEngine.process(WELCOME_TEMPLATE_FILE_NAME, new Context());
            MimeMessage message = createMailToMember(email, WELCOME_SUBJECT_FORMAT, htmlContent);
            mailSender.send(message);
            log.info("회원 가입 이메일 발송 완료: {} ({})", email, LocalDateTime.now());
        } catch (MessagingException e) {
            log.error("회원 가입 이메일 발송 실패: {} - {}", email, e.getMessage(), e);
            throw new BusinessException(ErrorCode.WELCOME_MAIL_SEND_ERROR);
        }
    }

    private MimeMessage createMailToMember(String memberEmail, String subject, String htmlContent)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(mailProperties.from());
        helper.setTo(memberEmail);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        return message;
    }

    private String buildSubject(MonthlyReport report) {
        return String.format(
                MONTHLY_REPORT_SUBJECT_FORMAT,
                report.getReportYear(),
                report.getReportMonth()
        );
    }

    private Context buildMonthlyReportContext(MonthlyReport report, String serviceName) {
        Context context = new Context();
        context.setVariable("memberName", report.getMemberName());
        context.setVariable("memberEmail", report.getMemberEmail());
        context.setVariable("reportYear", report.getReportYear());
        context.setVariable("reportMonth", report.getReportMonth());
        context.setVariable("personal", report.getPersonal());
        context.setVariable("group", report.getGroup());
        context.setVariable("serviceName", serviceName);
        return context;
    }

    @Async("emailEventExecutor")
    public void sendMonthlyReports(java.util.List<MonthlyReport> reports) {
        reports.forEach(report -> {
            try {
                sendMonthlyReport(report);
            } catch (Exception e) {
                log.error("리포트 발송 실패 (계속 진행): {}", report.getMemberEmail(), e);
            }
        });
    }
}
