package com.worlabel.domain.member.repository;

import com.worlabel.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByEmail(String email);

    @Query("SELECT m FROM Member m " +
            "WHERE m.id <> :memberId " +
            "AND (:keyword IS NOT NULL AND m.email LIKE CONCAT('%', :keyword, '%'))")
    List<Member> findAllByKeyword(@Param("memberId") Integer memberId,@Param("keyword") String keyword);
}
