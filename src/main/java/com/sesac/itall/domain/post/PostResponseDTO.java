package com.sesac.itall.domain.post;

import lombok.Getter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Getter
public class PostResponseDTO {

    private Long id;
    private String title;
    private String content;
    private String formattedRegdate;
    private String formattedModifydate;
    private boolean draft;
    private String blogTitle;
    private String nickname;
    private String email;
    private Long folderId;
    private String folderName;
    private Long blogId;
    private Long categoryId;
    private String categoryName;

    public PostResponseDTO(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.formattedRegdate = formattedDate(post.getRegdate());
        this.formattedModifydate = (post.getModifydate() != null) ? formattedDate(post.getModifydate()) : "";
        this.draft = post.isDraft();
        this.blogTitle = post.getBlog().getTitle();
        this.nickname = post.getBlog().getMember().getNickname();
        this.email = post.getBlog().getMember().getEmail();
        this.folderId = post.getFolder().getId();
        this.folderName = post.getFolder().getName();
        this.blogId = post.getBlog().getId();
        this.categoryId = post.getFolder().getFolderCategory().getId();
        this.categoryName = post.getFolder().getFolderCategory().getName();
    }

    // 날짜 형식화 메서드
    public static String formattedDate(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return "날짜 없음";
        }

        // 한국 시간대 적용
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Duration duration = Duration.between(localDateTime, now);
        long minutes = duration.toMinutes();
        long hours = duration.toHours();

        if (minutes < 5) {
            return "방금 전";
        } else if (minutes < 60) {
            return minutes + "분 전";     // 1시간 이내
        } else if (hours < 24) {
            return hours + "시간 전";  // 24시간 이내라면 "n시간 전"
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return localDateTime.format(formatter);  // 24시간 이후라면 "yyyy-MM-dd"
        }
    }
}
