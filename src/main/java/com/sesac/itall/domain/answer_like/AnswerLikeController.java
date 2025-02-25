package com.sesac.itall.domain.answer_like;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/answer-like")
@RequiredArgsConstructor
public class AnswerLikeController {

    private final AnswerLikeService answerLikeService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(@RequestBody AnswerLikeRequestDTO answerLikeRequestDTO, Principal principal) {

        // 로그인한 사용자의 이메일을 가져와서 사용
        String email = principal.getName();
        answerLikeRequestDTO.setEmail(email);

        // 추천 처리
        AnswerLikeResponseDTO answerLikeResponseDTO = answerLikeService.likeAnswer(answerLikeRequestDTO);

        // json 형태의 응답 구성
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("liked", answerLikeResponseDTO.isLiked());
        response.put("likeCount", answerLikeResponseDTO.getLikeCount());

        return ResponseEntity.ok(response);
    }
}
