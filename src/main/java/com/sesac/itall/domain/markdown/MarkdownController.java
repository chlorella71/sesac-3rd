package com.sesac.itall.domain.markdown;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/markdown")
@RequiredArgsConstructor
public class MarkdownController {
    private final com.sesac.itall.common.MarkdownConverter markdownConverter;

    @PostMapping("/preview")
    public ResponseEntity<String> previewMarkdown(@RequestBody Map<String, String> payload) {
        String markdown = payload.get("markdown");

        // null 체크 추가
        if (markdown == null || markdown.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("마크다운 내용이 없습니다.");
        }

        String htmlContent = markdownConverter.convertToHtml(markdown);
        return ResponseEntity.ok(htmlContent);
    }
}
