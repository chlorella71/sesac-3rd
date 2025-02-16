package com.sesac.itall.domain.answer_like;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerLikeRepository extends JpaRepository<AnswerLike, AnswerLikeId> {
    boolean existsById(AnswerLikeId id);
}
