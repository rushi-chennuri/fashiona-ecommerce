package com.fashion.repository;

import com.fashion.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query("SELECT r FROM Review r WHERE r.product.id = CAST(:productId AS java.util.UUID) AND r.approved = true")
    Page<Review> findByProductIdAndApprovedTrue(@Param("productId") String productId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Review r WHERE r.product.id = CAST(:productId AS java.util.UUID) AND r.user.id = :userId")
    boolean existsByProductIdAndUserId(@Param("productId") String productId, @Param("userId") String userId);

    @Query("SELECT r FROM Review r WHERE r.product.id = CAST(:productId AS java.util.UUID) AND r.user.id = :userId")
    Optional<Review> findByProductIdAndUserId(@Param("productId") String productId, @Param("userId") String userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = CAST(:productId AS java.util.UUID) AND r.approved = true")
    Double averageRatingByProductId(@Param("productId") String productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = CAST(:productId AS java.util.UUID) AND r.approved = true")
    long countApprovedByProductId(@Param("productId") String productId);

    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
}
