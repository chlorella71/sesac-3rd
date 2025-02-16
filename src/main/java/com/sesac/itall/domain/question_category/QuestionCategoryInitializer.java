package com.sesac.itall.domain.question_category;

import com.sesac.itall.domain.question.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class QuestionCategoryInitializer implements CommandLineRunner {

    private final QuestionCategoryRepository questionCategoryRepository;


    @Override
    public void run(String... args) throws Exception {
        List<QuestionCategoryEnum> categoryEnumList = Arrays.asList(
                QuestionCategoryEnum.TECH, QuestionCategoryEnum.CAREER, QuestionCategoryEnum.STUDY
        );

        for (QuestionCategoryEnum category : categoryEnumList) {
            if (questionCategoryRepository.findByCategory(category).isEmpty()) {
                QuestionCategory newCategory = new QuestionCategory();
                newCategory.setCategory(category);
                questionCategoryRepository.save(newCategory);
            }
        }
    }
}
