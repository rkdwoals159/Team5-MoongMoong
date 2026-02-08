# 프로젝트 가이드

## 공통
- 모든 응답은 한국어로 작성할 것
- 간결하게 핵심만 짚어줄 것
- 개선 제안 시 코드 예시 포함
- 코드 내 변수명, 함수명은 영어 유지

## 프론트엔드 리뷰 기준

### 필수 체크
- [ ] TypeScript 타입 에러 없음 (`any` 사용 지양)
- [ ] ESLint 규칙 준수 (`yarn lint` 통과)
- [ ] Prettier 포맷팅 적용 (`yarn format:check` 통과)
- [ ] 콘솔 에러/경고 없음

### Next.js Best Practice
- [ ] 서버 컴포넌트 우선 사용 (클라이언트 컴포넌트는 필요시에만 `"use client"`)
- [ ] 이미지는 `next/image` 사용 (width, height, alt 필수)
- [ ] API 호출은 Server Actions 또는 Route Handler 사용
- [ ] 환경변수는 `NEXT_PUBLIC_` 접두사 사용 (클라이언트 노출 시)

### 성능 최적화
- [ ] 불필요한 리렌더링 방지 (`useMemo`, `useCallback` 적절히 사용)

### 코드 품질
- [ ] 컴포넌트는 단일 책임 원칙 준수 (너무 큰 컴포넌트 분리)
- [ ] Props 타입 명시적으로 정의
- [ ] 커스텀 훅으로 로직 재사용 (`use___` 네이밍)
- [ ] 사용하지 않는 import/변수/주석 제거

### 접근성 & UX
- [ ] 시맨틱 HTML 태그 사용 (`<button>`, `<nav>`, `<main>` 등)
- [ ] 인터랙티브 요소에 적절한 ARIA 속성

## 백엔드 리뷰 기준

### 코드 스타일 컨벤션
- 메서드 파라미터, 로컬 변수, 클래스에 `final` 키워드를 사용하지 않는다.
- public 메서드 와 관련 있는 private 메서드는 열거한다.
    - 여러 public 메서드에서 사용하는 private 메서드는 맨 아래에 위치시킨다.
    - private 메서드 a, b, c 메서드 사용 시 public 메서드 밑에 a, b, c 순서대로 열거
- CRUD 순서에 맞추어 메서드를 정렬한다.
- DTO는 `record` 클래스를 사용한다.
- 클래스 가장 상단 1줄 개행한다.

    ```jsx
    public class Station {
    
    		private final Long id;
    		private final String name;
    
    		private void getName() {
    			// method contents
    		}
    }
    ```

- 예외나 Fixture는 static import 하지 않는다.
    - 비즈니스 코드에서의 static import 는 지양한다
    - 테스트 코드에서의 static import는 허용한다. ex) AssertJ, Junit, Mockito, RestDocs
- 상수 아래에 개행을 한다.
- Entity의 기본 Getter의 경우 Lombok`@Getter`어노테이션을 사용한다.
- Entity의 기본 생성자의 경우 Lombok`@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 사용한다.
- Entity가 아닌 객체의 경우, `@RequiresArgsConstructor` 허용
- [**Lombok 주의점**](https://kwonnam.pe.kr/wiki/java/lombok/pitfall)
    - **@AllArgsConstructor, @RequiredArgsConstructor 사용금지**
    - **무분별한 @EqualsAndHashCode 사용 자제**
    - **@Data 사용금지**
    - **@Value 사용금지**
    - **@Builder 를 생성자나 static 객체 생성 메소드에**
    - **@Log 대신 @Slf4j**
- 생성자의 매개변수가 한 줄이 넘어가는 경우, 각 매개변수에 개행을 적용한다.

```java
public KillingPart (
    private static final int MAX_NAME_LENGTH = 5;

    private final Long id,
    private final String name,
    ...
) {
    // ...
}
```

- 생성자가 여러개일 경우 생성자 체이닝 방식을 사용한다.
    - 초기화 이전 작업(변환, 검증)은 기본 생성자에서 수행한다.
    - 생성자 체이닝을 지향하되, 부득이하게 다른 생성로직을 사용할 경우 팀원들에게 의도를 남긴다.

- Entity 클래스 : equals & hasCode를 재정의하지 않는다
- 요청 DTO의 경우에는 `xxxRequest`, 응답 DTO의 경우에는 `xxxResponse`로 네이밍한다.
    - 구체적인 메서드 명을 포함한다. 저장의 경우 `xxxSaveRequest`
- **체이닝 메서드 -** 한 줄에 하나의 점 (stream, builder)
    - 단, 한 줄에 여러 점이 올 수 있다.
        - 필드에 접근하는 경우
        - 디미터 법칙을 준수하는 경우

    ```java
    members.stream()
            .filter()
    				.map()
    				.toList();
    
    ResponseEntity.ok(memberCouponService.getMemberCoupons(member.getId())
    				.status(200);
    ```

- 옵션을 제외한 **어노테이션 길이 순**으로 선언한다.
    - 예시

        ```java
        @NoArgsConstructor
        @Entity(name = "Entity")
        
        -> 이경우 옵션을 제외한 애너테이션명의 길이는 NoArgs > Entity이므로 다음과 같이 배치된다.
        
        @Entity(name = "Entity")
        @NoArgsConstructor
        ```

- 임베디드 필드명과 클래스명을 동일하게 하지 않는다.
    - ex. Nickname 클래스 내 nickname 필드를 만들지 않는다.
- 주석 최대한 달지 않는다. 필요한 경우 commit message로 남긴다.

### 테스트 코드 컨벤션

- 테스트 코드 메서드 네이밍 : DisplayName > Test 애너테이션 순으로 열거한다.
- `given-when-then`주석은 달지 않고, 개행한다.
- 더미 데이터를 추가하지 않고, 각 테스트 케이스마다 작성한다.
- 각 layer의 테스트 환경을 `BaseXXXTest`로 설정하고 상속받아 테스트 클래스를 작성한다.

### 코드 리뷰

- 24시가 넘으면, 코드 리뷰를 남기기 전에 언제까지 리뷰가 가능한지 슬랙 멘션으로 미리 알려준다.
- PR merge 기준 : 전원 approve
- 코드 리뷰의 기한
    - PR제출일 (월-목) : 24시간 이내
    - PR제출일 (금-일) : 48시간 이내
- PR을 확인했으면 PR 코멘트에 👍 이모티콘 남긴다.
- 확인했음은 👍 이모티콘으로 통일한다.
- 코멘트는 [P1, P2, P3] 3단계로 답글을 남긴다.
