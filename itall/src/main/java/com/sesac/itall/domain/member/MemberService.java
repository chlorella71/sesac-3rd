package com.sesac.itall.domain.member;

public interface MemberService {

    Member create(String email, String nickname, String password, String intro);
    Member getMemberByEmail(String email);


}
