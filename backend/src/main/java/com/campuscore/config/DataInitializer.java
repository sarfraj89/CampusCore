package com.campuscore.config;

import com.campuscore.entity.User;
import com.campuscore.enums.Role;
import com.campuscore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@campuscore.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@campuscore.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("System Administrator")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .firstLogin(false)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created with password: Admin@123");
        } else {
            // Update the password just in case the hash in migration was wrong
            User admin = userRepository.findByEmail("admin@campuscore.com").get();
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            userRepository.save(admin);
            System.out.println("Admin user password updated to: Admin@123");
        }
    }
}
