package com.moong.exception.errorcode;

import com.moong.domain.entity.CoinPayment;
import com.moong.domain.entity.MemberExpense;
import com.moong.domain.member.MemberName;
import lombok.Getter;

@Getter
public enum ErrorCode {

    //400
    USAGE_LENGTH_EXCEED(400, "사용 내역은 최대 " + MemberExpense.MAX_USAGE_LENGTH + "자를 넘을 수 없습니다", true),
    MEMO_LENGTH_EXCEED(400, "메모는 최대 " + MemberExpense.MAX_MEMO_LENGTH + "자를 넘을 수 없습니다", true),
    NOT_FOUND_SPENT_AT_ORDER(400, "spentAt 정렬 조건을 찾을 수 없습니다", true),
    NOT_FOUND_MEMBER_EXPENSE_COLUMN(400, "MemberExpense의 프로퍼티를 찾을 수 없습니다", true),
    INVALID_INVITE_CODE_URL(400, "잘못된 초대코드입니다", true),
    MEMBER_EXPENSE_SORT_NOT_START_WITH_SPENT_AT(400, "회원 소비 내역 정렬 요청이 spentAt으로 시작하지 않습니다", true),
    ALREADY_EXISTS_PET(400, "이미 회원의 펫이 존재합니다", true),
    ALREADY_EXISTS_BANK(400, "이미 저금통이 존재합니다.", true),
    ALREADY_PARTICIPATE_ANOTHER_PET_GROUP(400, "이미 다른 펫 그룹에 참여중입니다", false),
    PET_GROUP_IS_FULL(400, "펫 그룹 정원이 모두 차있습니다", false),
    ALREADY_ATTENDED_PET_GROUP(400, "이미 참여한 펫 그룹입니다.", false),
    FIELD_ERROR(400, "입력이 잘못되었습니다.", true),
    URL_PARAMETER_ERROR(400, "입력이 잘못되었습니다.", true),
    METHOD_ARGUMENT_TYPE_MISMATCH(400, "입력한 값의 타입이 잘못되었습니다.", true),
    HTTP_MESSAGE_NOT_READABLE(400, "요청한 파라미터의 역직렬화 과정에서 일치하는 타입이 없습니다.", true),
    ALREADY_DISCONNECTED(400, "이미 클라이언트에서 요청이 종료되었습니다.", true),
    INVALID_DATE_RANGE(400, "시작일은 종료일보다 늦을 수 없습니다.", false),
    NOT_SUCCEED_BANK_TARGET_AMOUNT(400, "목표 금액을 아직 달성하지 못했습니다", false),
    BANK_TARGET_BELOW_ZERO(400, "저금통 목표 금액은 0원 이하일 수 없습니다.", false),
    BANK_TARGET_EXCEED_LIMIT(400, "저금통 목표 금액은 1000만원을 초과할 수 없습니다.", false),
    BANK_TARGET_LESS_THAN_CURRENT(400, "저금통 목표 금액은 현재 저금된 금액보다 적어질 수 없습니다.", false),
    ALREADY_SUCCEED_BANK_TARGET_AMOUNT(400, "이미 목표 금액을 달성하여 저금에 실패하였습니다.", false),
    BANK_SAVING_BELOW_ZERO(400, "저금 금액은 0원 이하일 수 없습니다.", false),
    TOSS_PAYMENT_CLIENT_ERROR(400, "유효하지 않은 결제 요청입니다.", true),
    MISMATCH_PAYMENT_AMOUNT(400, "결제 요청 금액이 주문 금액과 일치하지 않습니다.", true),
    INVALID_PAYMENT_AMOUNT(400, "결제 요청 금액이 " + CoinPayment.MIN_PAYMENT_AMOUNT + "원 이상 - "
            + CoinPayment.MAX_PAYMENT_AMOUNT + "원 이하가 아닙니다.", false),
    INVALID_EXPENSE_COST_AMOUNT(400, "결제 요청 금액이 " + "0원 이상 - "
            + MemberExpense.MAX_PAYMENT_AMOUNT + "원 이하가 아닙니다.", false),
    INVALID_MEMBER_NAME(400, "회원 닉네임은 " + MemberName.MEMBER_NAME_MIN_LENGTH + "자 이상 "
            + MemberName.MEMBER_NAME_MAX_LENGTH + "자 이하여야 합니다", false),
    ALREADY_PROCESSED(400, "이미 처리 중이거나 완료된 결제 요청입니다.", true),

    //401
    UNAUTHORIZED_EXCEPTION(401, "잘못된 유저 접근입니다", true),
    INVALID_CONNECTION_TOKEN(401, "Connection 토큰이 유효하지 않습니다", true),
    EXPIRED_TOKEN(401, "토큰 기한이 만료되었습니다", true),

    //404
    MONTHLY_GROUP_EXPENSE_NOT_FOUND(404, "월별 그룹 소비내역을 찾을 수 없습니다.", true),
    MONTHLY_MEMBER_EXPENSE_NOT_FOUND(404, "월별 회원 소비내역을 찾을 수 없습니다.", true),
    MEMBER_NOT_FOUND(404, "해당하는 회원을 찾을 수 없습니다.", true),
    CREW_NOT_FOUND(404, "해당하는 크루를 찾을 수 없습니다.", true),
    PET_GROUP_NOT_FOUND(404, "해당하는 펫 그룹을 찾을 수 없습니다.", true),
    MEDICAL_ADVICE_NOT_FOUND(404, "해당 그룹의 의사 권장사항을 찾을 수 없습니다.", false),
    PET_MEDICAL_NOT_FOUND(404, "펫 의료정보를 찾을 수 없습니다.", false),
    NO_RESOURCE_FOUND(404, "요청한 리소스를 찾을 수 없습니다.", true),
    MEMBER_EXPENSE_NOT_FOUND(404, "해당하는 사용자 소비내역을 찾을 수 없습니다", true),
    NO_SUCH_PET_FOUND(404, "PET을 찾을 수 없습니다.", true),
    NO_SUCH_BANK_FOUND(404, "저금통을 찾을 수 없습니다.", false),
    DISEASE_CODE_NOT_FOUND(404, "존재하지 않는 질병 코드입니다.", true),
    NO_SUCH_COIN_PAYMENT_FOUND(404, "코인 결제 내역을 찾을 수 없습니다", true),
    NOTIFICATION_INBOX_NOT_FOUND(404, "알림 수신 정보를 찾을 수 없습니다.", false),
    CREW_NOTIFICATION_NOT_FOUND(404, "해당 크루의 알림 정보를 찾을 수 없습니다.", false),

    //405
    METHOD_NOT_SUPPORTED(405, "허용되지 않은 메서드입니다.", true),
    MEDIA_TYPE_NOT_SUPPORTED(415, "허용되지 않은 미디어 타입입니다.", true),

    //5XX
    MEMBER_EXPENSE_ROW_MAPPING_ERROR(500, "회원 소비내역 데이터 행 매핑 과정에서 문제가 생겼습니다", false),
    REGRESSION_DATA_SHORTAGE_ERROR(500, "회귀모델에 들어간 데이터가 최소 정족수보다 적습니다", false),
    TREATMENT_AVG_COST_SERIALIZED_ERROR(500, "TreatmentAvgCost 직렬화에 실패했습니다", false),
    YEAR_MONTH_DESERIALIZE_ERROR(500, "YearMonth 역직렬화에 실패했습니다", false),
    INCONSISTENT_DISEASE_DATA(500, "서버 내부 데이터 정합성 오류입니다.", false),
    INVALID_PET_BIRTH_DATA(500, "펫 생년월일 데이터가 유효하지 않습니다.", false),
    INVITE_CODE_ENCRYPT_ERROR(500, "초대코드 암호화 과정에서 문제가 생겼습니다", false),
    TOSS_PAYMENT_SERVER_ERROR(500, "결제 대행사 서버 오류입니다.", false),
    INVITE_CODE_DECRYPT_ERROR(500, "초대코드 해독 과정에서 문제가 생겼습니다", false),
    INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다. 관리자에게 문의하세요.", false);

    private final int statusCode;
    private final String message;
    private final boolean shouldAnalyze;

    ErrorCode(int statusCode, String message, boolean shouldAnalyze) {
        this.statusCode = statusCode;
        this.message = message;
        this.shouldAnalyze = shouldAnalyze;
    }

    public boolean shouldAnalyze() {
        return shouldAnalyze;
    }
}
