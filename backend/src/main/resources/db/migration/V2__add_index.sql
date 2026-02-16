-- MemberExpense
CREATE INDEX member_expense_member_id_spent_at_desc_modified_at_desc ON member_expense(member_id, spent_at DESC, modified_at DESC);
CREATE INDEX member_expense_member_id ON member_expense(member_id);
CREATE INDEX member_expense_member_id_spent_at_cost ON member_expense(member_id, spent_at, cost);
CREATE INDEX member_expense_member_id_main_category_spent_at_cost ON member_expense(member_id, main_category, spent_at, cost);

-- GroupExpense
CREATE INDEX group_expense_group_id ON group_expense(group_id);

-- PetMedical
CREATE INDEX pet_medical_breed_age_gender ON pet_medical(breed, age, gender);
CREATE INDEX pet_medical_breed_gender_age ON pet_medical(breed, gender, age);

-- Crew
CREATE INDEX crew_member_id ON crew(member_id);
CREATE INDEX crew_group_id ON crew(group_id);

-- Treatment
CREATE INDEX treatment_disease_district_city ON treatment(disease, city, district);

-- GroupMedicalAdvice
CREATE INDEX group_medical_group_id ON group_medical_advice(group_id);

-- Bank
CREATE INDEX bank_group_id ON bank(group_id);

-- Coin
CREATE INDEX coin_bank_id_created_at ON coin(bank_id, created_at);

-- PetGroup
CREATE INDEX pet_group_pet_id ON pet_group(pet_id);
