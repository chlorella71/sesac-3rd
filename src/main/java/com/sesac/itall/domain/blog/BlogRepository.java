package com.sesac.itall.domain.blog;

import com.sesac.itall.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {

    /**
     * 특정 멤버의 블로그가 이미 존재하는지 확인하는 메서드
     *
     * @param member 블로그 존재 여부를 확인할 멤버
     * @return 블로그 존재 여부 (true/false)
     */
    boolean existsByMember(Member member);

    /** 특정 멤버의 블로그를 조회하는 메서드
     *
     * @param member 블로그를 조회할 멤버
     * @return 해당 멤버의 블로그 (Optional)
     */
    Optional<Blog> findByMember(Member member);

}
