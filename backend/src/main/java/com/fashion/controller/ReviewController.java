package com.fashion.controller;

import com.fashion.model.Review;
import com.fashion.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review endpoints")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewController {

    private final ReviewService reviewService;

    record AddReviewRequest(String productId, int rating, String title, String body) {}

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for a product")
    public ResponseEntity<Page<Review>> getProductReviews(
        @PathVariable String productId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, page, size));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a review for a product")
    public ResponseEntity<Review> addReview(@RequestBody AddReviewRequest req, Authentication auth) {
        String userEmail = (String) auth.getPrincipal();
        Review review = reviewService.addReview(userEmail, req.productId(), req.rating(), req.title(), req.body());
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete own review")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable String reviewId, Authentication auth) {
        String userEmail = (String) auth.getPrincipal();
        reviewService.deleteReview(reviewId, userEmail);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }
}
