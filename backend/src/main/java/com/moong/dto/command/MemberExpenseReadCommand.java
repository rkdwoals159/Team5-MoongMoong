package com.moong.dto.command;

import com.moong.domain.entity.Member;
import com.moong.domain.entity.MemberExpense;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import java.time.LocalDate;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
public class MemberExpenseReadCommand {

    private static final Sort DEFAULT_SORTING_RULE = Sort.by(Sort.Direction.DESC, MemberExpense.MODIFIED_AT_COLUMN_NAME);

    private final Member member;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final String mainCategory;
    private final Pageable pageable;

    public MemberExpenseReadCommand(
            Member member,
            LocalDate startDate,
            LocalDate endDate,
            String mainCategory,
            Pageable pageable
    ) {
        validatePeriod(startDate, endDate);
        this.member = member;
        this.startDate = startDate;
        this.endDate = endDate;
        this.mainCategory = mainCategory;
        this.pageable = makePageAbleAddDefaultOption(pageable);
    }

    private Pageable makePageAbleAddDefaultOption(Pageable pageable) {
        Sort newSort = pageable.getSort()
                .and(DEFAULT_SORTING_RULE);
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                newSort
        );
    }

    private void validatePeriod(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException(ErrorCode.INVALID_DATE_RANGE);
        }
    }

    public boolean hasMainCategory() {
        return mainCategory != null;
    }
}
