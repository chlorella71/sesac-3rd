package com.sesac.itall.domain.answer_like;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/answer-like")
@RequiredArgsConstructor
public class AnswerLikeController {

    private final AnswerLikeService answerLikeService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/toggle")
    public ResponseEntity<AnswerLikeResponseDTO> toggleLike(@RequestBody AnswerLikeRequestDTO answerLikeRequestDTO) {
        AnswerLikeResponseDTO answerLikeResponseDTO = answerLikeService.likeAnswer(answerLikeRequestDTO);

        return ResponseEntity.ok(answerLikeResponseDTO);
    }
}
