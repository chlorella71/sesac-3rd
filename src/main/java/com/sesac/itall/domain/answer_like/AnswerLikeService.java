package com.sesac.itall.domain.answer_like;

import com.sesac.itall.domain.answer.Answer;
import com.sesac.itall.domain.answer.AnswerRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerLikeService {

    private final AnswerLikeRepository answerLikeRepository;
    private final AnswerRepository answerRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public AnswerLikeResponseDTO likeAnswer(AnswerLikeRequestDTO answerLikeRequestDTO) {

        // 답변과 회원 정보 조회
        Answer answer = answerRepository.findById(answerLikeRequestDTO.getAnswerId())
                .orElseThrow(() -> new DataNotFoundException("답변을 찾을 수 없습니다."));
        Member member = memberRepository.findByEmail(answerLikeRequestDTO.getEmail())
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        Optional<AnswerLike> optionalAnswerLike = answerLikeRepository.findByAnswerIdAndMemberId(answer.getId(), member.getId());

        // optional로 기존 추천 여부 확인하는 방법(orElseGet보다 debugging이 쉬움?)
        if (optionalAnswerLike.isEmpty()) {
            // 데이터가 아예 없는 경우 예외 처리 또는 새로운 객체 생성 후 저장
            AnswerLike newAnswerLike = new AnswerLike(member, answer);
            answerLikeRepository.save(newAnswerLike);
            return new AnswerLikeResponseDTO(answer.getId(), true, 1L, List.of(member.getNickname()));
        }

        AnswerLike answerLike = optionalAnswerLike.get();

//        // 기존 추천 여부 확인
//        AnswerLike answerLike = answerLikeRepository.findByAnswerIdAndMemberId(answer.getId(), member.getId())
//                .orElseGet(() -> {
//                    AnswerLike newAnswerLike = new AnswerLike(member, answer);
//                    answerLikeRepository.save(newAnswerLike);   // 반드시 저장(db가 null이 되지 않기 위해?)
//                    return newAnswerLike;
//                });   // 없으면 객체 생성

        // 추천 상태 변경 (추천 추가 / 취소)
        answerLike.updateAnswerLike();
        answerLikeRepository.save(answerLike);  // db에 변경된 상태 저장

        // 총 추천 개수 가져오기
        long likeCount = answerLikeRepository.countByAnswerId(answer.getId());

        // 추천한 사용자 목록 가져오기 (닉네임 리스트)
        List<String> nicknameList = answerLikeRepository.findByAnswerId(answer.getId())
                .stream()
                .map(like -> like.getMember().getNickname())
                .toList();  // java 16 부터 사용 가능 (또는 `.collect(Collectors.toList())` 사용)

        // dto로 응답 반환
        return new AnswerLikeResponseDTO(answer.getId(), answerLike.isLiked(), likeCount, nicknameList);
    }


    // 특정 답변(answerId)의 추천 정보 가져오기 (추천이 없을 경우 기본값 반환)
    @Transactional(readOnly = true)
    public AnswerLikeResponseDTO getAnswerLikeInfo(Long answerId) {

        // 추천 개수 조회
        Long likeCount = answerLikeRepository.countByAnswerId(answerId);    // 추천 개수 조회

        // 추천한 사용자 닉네임 목록 조회 (추천한 사용자가 없을 경우 빈 리스트 반환)
        List<String> nicknameList = answerLikeRepository.findNicknameListByAnswerId(answerId);

        // 로그인 여부와 관계없이 liked는 false (기본값) -> 로그인하지 않으면 추천 안한 상태로 하기 위함?
        return new AnswerLikeResponseDTO(answerId, false, likeCount != null ? likeCount : 0, nicknameList != null ? nicknameList : List.of()); // 기본 liked 값은 false
    }

    // 특정 답변(answerId)의 추천 정보 가져오기 (로그인 사용자)
    @Transactional(readOnly = true)
    public AnswerLikeResponseDTO getLikeStatus(String email, Long answerId) {

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        // 추천 개수 조회
        Long likeCount = answerLikeRepository.countByAnswerId(answerId);

        // 추천한 사용자 닉네임 목록 조회
        List<String> nicknameList = answerLikeRepository.findNicknameListByAnswerId(answerId);

        // 현재 사용자가 해당 답변을 추천했는지 확인 (추천이 없으면 'false' 반환)
        boolean liked = answerLikeRepository.findLikeStatusByAnswerIdAndMemberId(answerId, member.getId())
                .orElse(false);

        return new AnswerLikeResponseDTO(answerId, liked, likeCount !=null ? likeCount : 0, nicknameList != null ? nicknameList : List.of());
    }
}
