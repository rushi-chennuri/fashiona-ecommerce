package com.fashion.service;

import com.fashion.model.Product;
import com.fashion.model.Review;
import com.fashion.model.User;
import com.fashion.repository.ProductRepository;
import com.fashion.repository.ReviewRepository;
import com.fashion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public Page<Review> getProductReviews(String productId, int page, int size) {
        return reviewRepository.findByProductIdAndApprovedTrue(
            productId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @Transactional
    public Review addReview(String userEmail, String productId, Integer rating, String title, String body) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(java.util.UUID.fromString(productId))
            .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, user.getId())) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = Review.builder()
            .user(user)
            .product(product)
            .rating(rating)
            .title(title)
            .body(body)
            .verified(false)
            .approved(true)
            .build();

        Review saved = reviewRepository.save(review);

        // Recalculate product rating
        Double avg = reviewRepository.averageRatingByProductId(productId);
        long count = reviewRepository.countApprovedByProductId(productId);
        productService.updateRating(productId, avg != null ? avg : 0.0, (int) count);

        log.info("Review added for product {} by user {}", productId, userEmail);
        return saved;
    }

    @Transactional
    public void deleteReview(String reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        reviewRepository.delete(review);

        // Recalculate product rating
        String productId = review.getProduct().getId().toString();
        Double avg = reviewRepository.averageRatingByProductId(productId);
        long count = reviewRepository.countApprovedByProductId(productId);
        productService.updateRating(productId, avg != null ? avg : 0.0, (int) count);
    }
}
