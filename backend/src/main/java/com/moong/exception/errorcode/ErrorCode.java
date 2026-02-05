package com.moong.exception.errorcode;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    //400
    INVALID_INVITE_CODE_URL(400, "잘못된 초대코드입니다"),
    ALREADY_EXISTS_PET(400, "이미 회원의 펫이 존재합니다"),
    ALREADY_EXISTS_BANK(400, "이미 저금통이 존재합니다."),
    ALREADY_PARTICIPATE_ANOTHER_PET_GROUP(400, "이미 다른 펫 그룹에 참여중입니다"),
    PET_GROUP_IS_FULL(400, "펫 그룹 정원이 모두 차있습니다"),
    ALREADY_ATTENDED_PET_GROUP(400, "이미 참여한 펫 그룹입니다."),
    FIELD_ERROR(400, "입력이 잘못되었습니다."),
    URL_PARAMETER_ERROR(400, "입력이 잘못되었습니다."),
    METHOD_ARGUMENT_TYPE_MISMATCH(400, "입력한 값의 타입이 잘못되었습니다."),
    ALREADY_DISCONNECTED(400, "이미 클라이언트에서 요청이 종료되었습니다."),
    INVALID_DATE_RANGE(400, "시작일은 종료일보다 늦을 수 없습니다."),
    NOT_SUCCEED_BANK_TARGET_AMOUNT(400, "목표 금액을 아직 달성하지 못했습니다"),
    BANK_TARGET_BELOW_ZERO(400, "저금통 목표 금액은 0원 이하일 수 없습니다."),
    BANK_TARGET_EXCEED_LIMIT(400, "저금통 목표 금액은 1000만원을 초과할 수 없습니다."),
    BANK_TARGET_LESS_THAN_CURRENT(400, "저금통 목표 금액은 현재 저금된 금액보다 적어질 수 없습니다."),
    ALREADY_SUCCEED_BANK_TARGET_AMOUNT(400, "이미 목표 금액을 달성하여 저금에 실패하였습니다."),
    BANK_SAVING_BELOW_ZERO(400, "저금 금액은 0원 이하일 수 없습니다."),

    //401
    UNAUTHORIZED_EXCEPTION(401, "잘못된 유저 접근입니다"),
    EXPIRED_TOKEN(401, "토큰 기한이 만료되었습니다"),


    //404
    CREW_NOT_FOUND(404, "해당하는 크루를 찾을 수 없습니다."),
    PET_GROUP_NOT_FOUND(404, "해당하는 펫 그룹을 찾을 수 없습니다."),
    MEDICAL_ADVICE_NOT_FOUND(404, "해당 그룹의 의사 권장사항을 찾을 수 없습니다."),
    NO_RESOURCE_FOUND(404, "요청한 리소스를 찾을 수 없습니다."),
    MEMBER_EXPENSE_NOT_FOUND(404, "해당하는 사용자 소비내역을 찾을 수 없습니다"),
    NO_SUCH_PET_FOUND(404, "PET을 찾을 수 없습니다."),
    NO_SUCH_BANK_FOUND(404, "저금통을 찾을 수 없습니다."),
    DISEASE_CODE_NOT_FOUND(404, "존재하지 않는 질병 코드입니다."),

    //405
    METHOD_NOT_SUPPORTED(405, "허용되지 않은 메서드입니다."),
    MEDIA_TYPE_NOT_SUPPORTED(415, "허용되지 않은 미디어 타입입니다."),

    //5XX
    INCONSISTENT_DISEASE_DATA(500, "서버 내부 데이터 정합성 오류입니다."),
    INVALID_PET_BIRTH_DATA(500, "펫 생년월일 데이터가 유효하지 않습니다."),
    INVITE_CODE_ENCRYPT_ERROR(500, "초대코드 암호화 과정에서 문제가 생겼습니다"),
    INVITE_CODE_DECRYPT_ERROR(500, "초대코드 해독 과정에서 문제가 생겼습니다"),
    INTERNAL_SERVER_ERROR(500, "서버 오류가 발생했습니다. 관리자에게 문의하세요.");

    private final int statusCode;
    private final String message;

    ErrorCode(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
