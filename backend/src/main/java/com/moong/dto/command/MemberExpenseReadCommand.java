package com.moong.dto.command;

import com.moong.domain.entity.Member;
import com.moong.domain.enums.MainCategoryType;
import com.moong.exception.custom.BusinessException;
import com.moong.exception.errorcode.ErrorCode;
import com.moong.util.query.MemberExpenseColumn;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;

@Getter
public class MemberExpenseReadCommand {

    private static final Sort DEFAULT_SORTING_RULE = Sort.by(Sort.Direction.ASC, MemberExpenseColumn.ID.getDbColumn());

    private final Member member;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final MainCategoryType mainCategory;
    private final Long lastRowId;
    private final Pageable pageable;

    public MemberExpenseReadCommand(
            Member member,
            LocalDate startDate,
            LocalDate endDate,
            Long lastRowId,
            MainCategoryType mainCategory,
            Pageable pageable
    ) {
        validatePeriod(startDate, endDate);
        validateSort(pageable.getSort());
        this.member = member;
        this.startDate = startDate;
        this.endDate = endDate;
        this.mainCategory = mainCategory;
        this.lastRowId = lastRowId;
        this.pageable = makePageableWithDefaultSort(pageable);
    }

    private Pageable makePageableWithDefaultSort(Pageable pageable) {
        Sort newSort = pageable.getSort()
                .stream()
                .map(order -> new Sort.Order(
                        order.getDirection(),
                        MemberExpenseColumn.fromProperty(order.getProperty()).getDbColumn()
                ))
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by))
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

    private void validateSort(Sort sort) {
        List<Order> orders = sort.get().toList();
        if (orders.isEmpty() || !orders.get(0).getProperty().equals(MemberExpenseColumn.SPENT_AT.getProperty())) {
            throw new BusinessException(ErrorCode.MEMBER_EXPENSE_SORT_NOT_START_WITH_SPENT_AT);
        }
    }

    public boolean hasMainCategory() {
        return mainCategory != null;
    }

    public boolean hasLastRowId() {
        return lastRowId != null;
    }

    public Sort getSort() {
        return pageable.getSort();
    }

    public int getPageSize() {
        return pageable.getPageSize();
    }
}
