package com.sesac.itall.domain.question_category;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class QuestionCategoryService {
    private final QuestionCategoryRepository questionCategoryRepository;

    public List<QuestionCategory> getAllCategories() {
        return questionCategoryRepository.findAll();
    }
}
