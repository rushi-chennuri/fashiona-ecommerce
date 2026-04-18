package com.fashion.service;

import com.fashion.model.Product;
import com.fashion.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable("products")
    public Page<Product> getProducts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();
        return productRepository.findByActiveTrue(PageRequest.of(page, size, sort));
    }

    @Cacheable(value = "products", key = "#category + #page")
    public Page<Product> getProductsByCategory(String category, int page, int size) {
        return productRepository.findByCategoryAndActiveTrue(
            category, PageRequest.of(page, size, Sort.by("averageRating").descending()));
    }

    public Page<Product> searchProducts(String search, String category, BigDecimal minPrice,
                                         BigDecimal maxPrice, String badge, int page, int size, String sortBy) {
        Sort sort = buildSort(sortBy);
        Product.Badge badgeEnum = null;
        if (badge != null && !badge.isBlank()) {
            try { badgeEnum = Product.Badge.valueOf(badge.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        return productRepository.searchProducts(category, minPrice, maxPrice, badgeEnum, search,
            PageRequest.of(page, size, sort));
    }

    public Product getBySlug(String slug) {
        return productRepository.findBySlug(slug)
            .orElseThrow(() -> new RuntimeException("Product not found: " + slug));
    }

    public Product getById(String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return productRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid product ID format: " + id);
        }
    }

    @Cacheable("featured-products")
    public List<Product> getFeaturedProducts(int limit) {
        return productRepository.findByFeaturedTrueAndActiveTrue(PageRequest.of(0, limit)).getContent();
    }

    @Cacheable("best-sellers")
    public List<Product> getBestSellers(int limit) {
        return productRepository.findBestSellers(PageRequest.of(0, limit));
    }

    @Cacheable("new-arrivals")
    public List<Product> getNewArrivals(int limit) {
        return productRepository.findNewArrivals(PageRequest.of(0, limit));
    }

    public List<Product> getRelatedProducts(String productId, int limit) {
        Product product = getById(productId);
        try {
            UUID uuid = UUID.fromString(productId);
            return productRepository.findRelatedProducts(product.getCategory(), uuid, PageRequest.of(0, limit));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid product ID format: " + productId);
        }
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    @Transactional
    @CacheEvict(value = {"products", "featured-products", "best-sellers", "new-arrivals"}, allEntries = true)
    public Product createProduct(Product product) {
        product.setSlug(generateSlug(product.getName()));
        return productRepository.save(product);
    }

    @Transactional
    @CacheEvict(value = {"products", "featured-products", "best-sellers", "new-arrivals"}, allEntries = true)
    public Product updateProduct(String id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setCategory(updated.getCategory());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setBadge(updated.getBadge());
        existing.setSizes(updated.getSizes());
        existing.setColors(updated.getColors());
        existing.setImages(updated.getImages());
        existing.setTags(updated.getTags());
        return productRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = {"products", "featured-products", "best-sellers", "new-arrivals"}, allEntries = true)
    public void deleteProduct(String id) {
        Product product = getById(id);
        product.setActive(false);     // Soft delete
        productRepository.save(product);
    }

    @Transactional
    public void updateRating(String productId, double newAvg, int totalReviews) {
        Product product = getById(productId);
        product.setAverageRating(newAvg);
        product.setTotalReviews(totalReviews);
        productRepository.save(product);
    }

    private String generateSlug(String name) {
        String base = Normalizer.normalize(name, Normalizer.Form.NFD)
            .replaceAll("[^\\p{ASCII}]", "")
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9\\s-]", "")
            .trim()
            .replaceAll("\\s+", "-");
        String slug = base;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = base + "-" + counter++;
        }
        return slug;
    }

    private Sort buildSort(String sortBy) {
        return switch (sortBy == null ? "rating" : sortBy) {
            case "price_asc"   -> Sort.by("price").ascending();
            case "price_desc"  -> Sort.by("price").descending();
            case "newest"      -> Sort.by("createdAt").descending();
            case "rating"      -> Sort.by("averageRating").descending();
            case "popularity"  -> Sort.by("totalReviews").descending();
            default            -> Sort.by("averageRating").descending();
        };
    }
}
