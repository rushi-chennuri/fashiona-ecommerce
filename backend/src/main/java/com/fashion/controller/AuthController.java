package com.fashion.controller;

import com.fashion.config.JwtUtil;
import com.fashion.model.User;
import com.fashion.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Register, login, refresh token")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    record RegisterRequest(String firstName, String lastName, String email, String password, String phone) {}
    record LoginRequest(String email, String password) {}
    record AuthResponse(String accessToken, String tokenType, UserInfo user) {}
    record UserInfo(String id, String firstName, String lastName, String email, String role) {}

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }

        User user = User.builder()
            .firstName(req.firstName())
            .lastName(req.lastName())
            .email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .phone(req.phone())
            .build();
        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        log.info("New user registered: {}", saved.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(
            new AuthResponse(token, "Bearer", toUserInfo(saved))
        );
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT access token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
            .filter(User::isActive)
            .map(user -> {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                log.info("User logged in: {}", user.getEmail());
                return ResponseEntity.ok(new AuthResponse(token, "Bearer", toUserInfo(user)));
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse(null, null, null)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT access token")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") String bearerToken) {
        try {
            String token = bearerToken.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(token);
            return userRepository.findByEmail(email)
                .map(user -> {
                    String newToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                    return ResponseEntity.ok(Map.of("accessToken", newToken, "tokenType", "Bearer"));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid or expired token"));
        }
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset link")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        // In production: generate token, save to user, send email
        return ResponseEntity.ok(Map.of("message", "If this email exists, a reset link has been sent"));
    }

    private UserInfo toUserInfo(User user) {
        return new UserInfo(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole().name());
    }
}
