package com.sesac.itall.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests((authorizationManagerRequestMatcherRegistry ->
                {authorizationManagerRequestMatcherRegistry.requestMatchers(new AntPathRequestMatcher("/**"))
                        .permitAll();}))
                .csrf((httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer
                        .ignoringRequestMatchers(new AntPathRequestMatcher("/h2-console/**"))))
                .headers((httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer
                        .addHeaderWriter(new XFrameOptionsHeaderWriter(
                                XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN
                        ))))
                .formLogin((httpSecurityFormLoginConfigurer -> {httpSecurityFormLoginConfigurer
                        .loginPage("/member/login") // 로그인 페이지 url 설정
                        .loginProcessingUrl("/member/login")    // 로그인 폼 액션 url
                        .usernameParameter("email") // Spring Security가 "email"을 "username" 대신 사용하도록 설정
                        .passwordParameter("password")  // password는 "password" 그대로
                        .defaultSuccessUrl("/");})) // 로그인 성공 시 이동할 페이지
                .logout((httpSecurityLogoutConfigurer -> {httpSecurityLogoutConfigurer
                        .logoutRequestMatcher(new AntPathRequestMatcher("/member/logout"))
                        .logoutSuccessUrl("/")
                        .invalidateHttpSession(true);}))
        ;
        return httpSecurity.build();

    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationconfiguration) throws Exception {
        return authenticationconfiguration.getAuthenticationManager();
    }
}
