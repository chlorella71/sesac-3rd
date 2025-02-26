package com.sesac.itall.domain.blog;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String intro;
    private LocalDateTime regdate;
    private String nickname;

    // 포스트 개수
    private long postCount;

    public BlogResponseDTO(Blog blog) {
        this.id = blog.getId();
        this.title = blog.getTitle();
        this.intro = blog.getIntro();
        this.regdate = blog.getRegdate();
        this.nickname = blog.getMember().getNickname();
        this.postCount = blog.getPostList().size();
    }
}
