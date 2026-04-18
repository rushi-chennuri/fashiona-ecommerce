package com.fashion.controller;

import com.fashion.model.Address;
import com.fashion.model.Product;
import com.fashion.model.User;
import com.fashion.repository.AddressRepository;
import com.fashion.repository.ProductRepository;
import com.fashion.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile, addresses and wishlist")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    // ── Profile ──────────────────────────────────────────────────────────────

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<User> getMe(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<User> updateMe(@RequestBody Map<String, String> body, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (body.containsKey("firstName"))  user.setFirstName(body.get("firstName"));
        if (body.containsKey("lastName"))   user.setLastName(body.get("lastName"));
        if (body.containsKey("phone"))      user.setPhone(body.get("phone"));
        if (body.containsKey("avatarUrl"))  user.setAvatarUrl(body.get("avatarUrl"));
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ── Addresses ─────────────────────────────────────────────────────────────

    @GetMapping("/me/addresses")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all saved addresses")
    public ResponseEntity<List<Address>> getAddresses(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getAddresses());
    }

    @PostMapping("/me/addresses")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a new address")
    public ResponseEntity<Address> addAddress(@RequestBody Address address, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        address.setUser(user);
        if (Boolean.TRUE.equals(address.isDefault())) {
            // Clear other defaults
            user.getAddresses().forEach(a -> a.setDefault(false));
            addressRepository.saveAll(user.getAddresses());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(addressRepository.save(address));
    }

    @DeleteMapping("/me/addresses/{addressId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete an address")
    public ResponseEntity<Map<String, String>> deleteAddress(@PathVariable String addressId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        Address address = addressRepository.findById(addressId)
            .orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        addressRepository.delete(address);
        return ResponseEntity.ok(Map.of("message", "Address deleted"));
    }

    // ── Wishlist ──────────────────────────────────────────────────────────────

    @GetMapping("/me/wishlist")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get wishlist")
    public ResponseEntity<Set<Product>> getWishlist(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getWishlist());
    }

    @PostMapping("/me/wishlist/{productId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<Map<String, String>> addToWishlist(@PathVariable String productId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(java.util.UUID.fromString(productId))
            .orElseThrow(() -> new RuntimeException("Product not found"));
        user.getWishlist().add(product);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
    }

    @DeleteMapping("/me/wishlist/{productId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@PathVariable String productId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.getWishlist().removeIf(p -> p.getId().equals(productId));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
