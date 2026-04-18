package com.fashion.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.UUID;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_category", columnList = "category"),
    @Index(name = "idx_product_slug", columnList = "slug", unique = true),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_active", columnList = "active")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String name;

    @NotBlank
    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull @DecimalMin("0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 100)
    private String subcategory;

    @Column(length = 100)
    private String brand;

    @Builder.Default
    private Integer stockQuantity = 0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer totalReviews = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Badge badge;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size", length = 20)
    @Builder.Default
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color", length = 30)
    @Builder.Default
    private List<String> colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag", length = 50)
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean featured = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Integer getDiscountPercent() {
        if (originalPrice == null || originalPrice.compareTo(BigDecimal.ZERO) == 0) return 0;
        return (int) Math.round((1 - price.doubleValue() / originalPrice.doubleValue()) * 100);
    }

    public enum Badge {
        NEW, SALE, TRENDING, BESTSELLER, HOT, LUXURY, SUMMER, WINTER, FEATURED
    }
}
