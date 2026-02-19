-- MonthlyMemberExpense 테이블
CREATE TABLE IF NOT EXISTS monthly_member_expense (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_year BIGINT NOT NULL,
    expense_month BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    member_id BIGINT NOT NULL
);

-- MonthlyGroupExpense 테이블
CREATE TABLE IF NOT EXISTS monthly_group_expense (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_year BIGINT NOT NULL,
    expense_month BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    group_id BIGINT NOT NULL
);
