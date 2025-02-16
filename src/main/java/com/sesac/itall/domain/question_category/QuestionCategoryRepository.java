package com.sesac.itall.domain.question_category;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory, Long> {
    Optional<QuestionCategory> findByCategory(QuestionCategoryEnum category);
}
