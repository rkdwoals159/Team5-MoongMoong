export const getLabelNoData = (petName: string) => ({
  totalExpense: `${petName}의 총 지출을 지난달과 비교해 보여드려요`,
  medicalExpense: `${petName}의 의료비 지출을 지난달과 비교해 보여드려요`,
});

export const getLabelWithData = (petName: string) => ({
  totalExpense: `지난달에 비해 ${petName}의 총 지출을`,
  medicalExpense: `지난달에 비해 ${petName}의 의료비 지출이`,
});
