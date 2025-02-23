package com.sesac.itall.domain.answer_like;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AnswerLikeRepository extends JpaRepository<AnswerLike, AnswerLikeId> {
    Optional<AnswerLike> findByAnswerIdAndMemberId(Long answerId, Long memberId);
    List<AnswerLike> findByAnswerId(Long answerId);
    boolean existsByAnswerIdAndMemberId(Long answerId, Long memberId);

    @Query("SELECT COUNT(a) FROM AnswerLike a WHERE a.answer.id = :answerId")
    long countByAnswerId(@Param("answerId") Long answerId);
}
