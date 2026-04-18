package com.fashion.repository;

import com.fashion.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);

    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
          AND (:category IS NULL OR p.category = :category)
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
          AND (:badge IS NULL OR p.badge = :badge)
          AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Product> searchProducts(
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("badge") Product.Badge badge,
        @Param("search") String search,
        Pageable pageable
    );

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.active = true ORDER BY p.category")
    List<String> findAllCategories();

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
          AND p.category = :category
          AND p.id <> :excludeId
        ORDER BY p.averageRating DESC
    """)
    List<Product> findRelatedProducts(@Param("category") String category,
                                       @Param("excludeId") UUID excludeId,
                                       Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.totalReviews DESC")
    List<Product> findBestSellers(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.createdAt DESC")
    List<Product> findNewArrivals(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.badge = 'SALE' ORDER BY p.price ASC")
    List<Product> findSaleProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.averageRating DESC")
    List<Product> findTopRated(Pageable pageable);

    boolean existsBySlug(String slug);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockQuantity <= :threshold AND p.active = true")
    long countLowStockProducts(@Param("threshold") int threshold);
}
