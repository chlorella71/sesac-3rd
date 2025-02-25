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

    // 사용자가 특정 답변(answerId)에 추천했는지 여부 확인
    boolean existsByAnswerIdAndMemberId(Long answerId, Long memberId);

    // 특정 답변(answerId)에 대한 추천 개수 가져오기
    @Query("SELECT COUNT(al) FROM AnswerLike al WHERE al.answer.id = :answerId AND al.liked = true")
    Long countByAnswerId(@Param("answerId") Long answerId);

    // 특정 답변(answerId)에 대한 추천한 사용자 닉네임 목록 가져오기
    @Query("SELECT al.member.nickname FROM AnswerLike al WHERE al.answer.id = :answerId")
    List<String> findNicknameListByAnswerId(Long answerId);

    // liked가 true인지 확인하는 새로운 메서드 추가
    @Query("SELECT al.liked FROM AnswerLike al WHERE al.answer.id = :answerId AND al.member.id = :memberId")
    Optional<Boolean> findLikeStatusByAnswerIdAndMemberId(@Param("answerId") Long answerId, @Param("memberId") Long memberId);

}
