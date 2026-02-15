package com.moong.exception.analyzer.messagesender;

import com.moong.exception.dto.AnalyzeErrorResponse;
import com.moong.exception.dto.AnalyzeErrorResult;
import org.springframework.stereotype.Component;

@Component
public class SlackMessageResolver {

    public SlackMessage resolve(AnalyzeErrorResponse response) {
        AnalyzeErrorResult result = response.json();
        StringBuilder message = new StringBuilder();
        message.append("🚨 *4XX 에러 분석 알림*\n\n");
        message.append("🎯 *발생 상황*\n").append(truncate(result.action(), 500)).append("\n\n");
        message.append("🔍 *원인*\n").append(truncate(result.reason(), 500)).append("\n\n");
        message.append("💡 *해결 방법*\n").append(truncate(result.guide(), 500)).append("\n\n");
        return new SlackMessage(message.toString());
    }

    private String truncate(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + "...";
    }
}
