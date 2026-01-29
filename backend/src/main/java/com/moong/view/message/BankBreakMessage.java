package com.moong.view.message;

import java.util.concurrent.ThreadLocalRandom;
import lombok.Getter;

@Getter
public enum BankBreakMessage {

    POP_01("축하해요! 저금통이 열렸어요 🎉 그동안의 노력이 보상받는 순간이에요."),
    POP_02("드디어 해냈어요! 모아둔 돈을 꺼낼 수 있어요 👏"),
    POP_03("와우! 저금통 개봉 완료 🎊 현출이 가능합니다."),
    POP_04("차곡차곡 모은 결과예요. 정말 잘했어요!"),
    POP_05("기다린 만큼 더 값진 순간이에요. 축하합니다 🎉"),
    POP_06("저금통이 열렸어요! 스스로에게 박수 한 번 👏"),
    POP_07("참 잘 모아왔어요. 이제 마음껏 사용해도 좋아요 😊"),
    POP_08("오늘은 보상받는 날! 저금통이 열렸습니다 🎁"),
    POP_09("꾸준함의 승리예요. 저금통 개봉을 축하해요 🎊"),
    POP_10("이 순간을 위해 모았죠! 정말 멋져요 ✨"),
    POP_11("드디어 결실을 맺었어요. 저금통 오픈 🎉"),
    POP_12("성실한 저축의 결과입니다. 축하드려요 👏"),
    POP_13("저금통이 깨지며 노력도 함께 빛나요 ✨"),
    POP_14("스스로와의 약속을 지켜냈어요. 정말 대단해요!"),
    POP_15("와! 여기까지 오느라 수고했어요 🎊"),
    POP_16("저금통 개봉 성공! 뿌듯함을 즐겨보세요 😊"),
    POP_17("작은 습관이 큰 결과를 만들었어요. 축하해요 🎉"),
    POP_18("오늘만큼은 마음껏 자랑해도 돼요 👏"),
    POP_19("모아온 시간만큼 값진 순간이에요 ✨"),
    POP_20("축하합니다! 다음 목표도 분명 잘 해낼 거예요 🚀");

    private final String message;

    BankBreakMessage(String message) {
        this.message = message;
    }

    public static BankBreakMessage getRandom() {
        int random = ThreadLocalRandom.current().nextInt(0, values().length);
        return values()[random];
    }
}

