package com.moong.domain.entity;

import com.moong.domain.enums.MainCategoryType;
import com.moong.domain.enums.SubCategoryType;
import jakarta.persistence.Column;
import jakarta.persistence.ConstraintMode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Table(name = "member_expense")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberExpense {

    public static final String SPENT_AT_COLUMN_NAME = "spentAt";
    public static final String MODIFIED_AT_COLUMN_NAME = "modifiedAt";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "spent_at", nullable = false)
    private LocalDate spentAt;

    @NotNull
    @Column(name = "expense_usage")
    private String usage;

    private long cost;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MainCategoryType mainCategory;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SubCategoryType subCategory;

    private String memo;

    @LastModifiedDate
    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member member;

    public String getSubCategoryName() {
        if (this.subCategory != null) {
            return this.subCategory.name();
        }
        return null;
    }
}
