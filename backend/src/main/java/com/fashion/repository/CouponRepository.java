package com.fashion.repository;

import com.fashion.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, String> {

    Optional<Coupon> findByCodeAndActiveTrue(String code);

    boolean existsByCode(String code);
}
