-- Member 테이블
CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    name VARCHAR(20) NOT NULL,
    image_url VARCHAR(255)
);

-- Pet 테이블
CREATE TABLE IF NOT EXISTS pet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name CHAR(20) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    city VARCHAR(20) NOT NULL,
    district VARCHAR(20)
);

-- PetGroup 테이블
CREATE TABLE IF NOT EXISTS pet_group (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL
);

-- Bank 테이블
CREATE TABLE IF NOT EXISTS bank (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT NOT NULL,
    target_amount BIGINT NOT NULL,
    current_amount BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL,
    CONSTRAINT uk_bank_group UNIQUE (group_id)
);

-- Crew 테이블
CREATE TABLE IF NOT EXISTS crew (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    CONSTRAINT uk_crew_group_member_deleted_at UNIQUE (group_id, member_id, deleted_at)
);

-- Coin 테이블
CREATE TABLE IF NOT EXISTS coin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bank_id BIGINT NOT NULL,
    crew_id BIGINT NOT NULL,
    amount BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL
);

-- CoinPayment 테이블
CREATE TABLE IF NOT EXISTS coin_payment (
    id BINARY(16) PRIMARY KEY,
    amount BIGINT NOT NULL,
    crew_id BIGINT,
    payment_status VARCHAR(20) NOT NULL
);

-- MemberExpense 테이블
CREATE TABLE IF NOT EXISTS member_expense (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    spent_at DATE NOT NULL,
    expense_usage VARCHAR(255) NOT NULL,
    cost BIGINT NOT NULL,
    main_category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    memo TEXT,
    modified_at DATETIME,
    member_id BIGINT NOT NULL
);

-- GroupExpense 테이블
CREATE TABLE IF NOT EXISTS group_expense (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_expense_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL,
    CONSTRAINT uk_group_expense_member_expense UNIQUE (member_expense_id)
);

-- GroupMedicalAdvice 테이블
CREATE TABLE IF NOT EXISTS group_medical_advice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    advice VARCHAR(255) NOT NULL,
    expected_cost BIGINT NOT NULL,
    advice_year INT NOT NULL,
    group_id BIGINT NOT NULL
);

-- PetMedical 테이블
CREATE TABLE IF NOT EXISTS pet_medical (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    breed VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    disease VARCHAR(20) NOT NULL,
    ratio INT NOT NULL,
    created_at DATETIME NOT NULL,
    modified_at DATETIME NOT NULL
);

-- Treatment 테이블
CREATE TABLE IF NOT EXISTS treatment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disease VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    city VARCHAR(20) NOT NULL,
    district VARCHAR(20),
    min_price INT,
    average_price INT,
    max_price INT
);

-- WorriedDisease 테이블
CREATE TABLE IF NOT EXISTS worried_disease (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    disease VARCHAR(20) NOT NULL,
    pet_id BIGINT NOT NULL
);
