package com.campuscore.controller;

import com.campuscore.dto.*;
import com.campuscore.entity.User;
import com.campuscore.repository.UserRepository;
import com.campuscore.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for login, signup, refresh token, and password management")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "Login and get tokens")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if (!user.getEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(AuthResponseDTO.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .userId(user.getId())
                .fullName(user.getFullName())
                .firstLogin(user.getFirstLogin())
                .build());
    }

    @PostMapping("/signup")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin only - Create a new user directly")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .enabled(true)
                .firstLogin(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User created successfully");
    }

    @PostMapping("/register")
    @Operation(summary = "Public - Register a new user")
    public ResponseEntity<String> register(@Valid @RequestBody SignupRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .enabled(true)
                .firstLogin(true)
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<AuthResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        String userEmail = jwtService.extractUsername(request.getRefreshToken());
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElseThrow();
            if (jwtService.validateToken(request.getRefreshToken(), user)) {
                String accessToken = jwtService.generateToken(user);
                return ResponseEntity.ok(AuthResponseDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(request.getRefreshToken())
                        .role(user.getRole())
                        .userId(user.getId())
                        .fullName(user.getFullName())
                        .firstLogin(user.getFirstLogin())
                        .build());
            }
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<?> logout() {
        // Since JWT is stateless, logout is handled client-side by deleting tokens
        // For actual invalidation, a token blacklist could be implemented
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for the authenticated user")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setFirstLogin(false);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
