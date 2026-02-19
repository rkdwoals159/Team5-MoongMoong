package com.moong.service;

import com.moong.config.MailProperties;
import com.moong.domain.report.MonthlyReport;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
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
    private static final String REPORT_TEMPLATE_FILE_NAME = "report-email";

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final MailProperties mailProperties;

    @Async("emailEventExecutor")
    public void sendMonthlyReport(MonthlyReport report) {
        try {
            String subject = buildSubject(report);
            Context ctx = buildMonthlyReportContext(report, mailProperties.serviceName());
            String htmlContent = templateEngine.process(REPORT_TEMPLATE_FILE_NAME, ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailProperties.from());
            helper.setTo(report.getMemberEmail());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("월간 리포트 발송 완료: {} ({}년 {}월)",
                    report.getMemberEmail(),
                    report.getReportYear(),
                    report.getReportMonth()
            );
        } catch (MessagingException e) {
            log.error("월간 리포트 발송 실패: {} - {}", report.getMemberEmail(), e.getMessage(), e);
            throw new RuntimeException("메일 발송에 실패했습니다.", e);
        }
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
