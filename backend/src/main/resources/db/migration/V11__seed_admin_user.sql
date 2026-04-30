-- Create an ADMIN user with email admin@campuscore.com and bcrypt-hashed password Admin@123
INSERT INTO users (id, email, password, full_name, role, enabled, first_login)
VALUES (
    gen_random_uuid(),
    'admin@campuscore.com',
    '$2a$10$wT0ESt9X8N/E9XmZtW0iDOZ/vB9c8/w/Vq9Z0Y0x6U8z3u3rXW76q', 
    'System Administrator',
    'ADMIN',
    true,
    false
);
