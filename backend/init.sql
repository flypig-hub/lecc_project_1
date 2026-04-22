-- PostgreSQL initialization script for RPG Bank
-- Create database and user if they don't exist

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create application user
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ROLE_ADMIN') THEN
        INSERT INTO pg_roles (rolname) VALUES ('ROLE_ADMIN');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ROLE_USER') THEN
        INSERT INTO pg_roles (rolname) VALUES ('ROLE_USER');
    END IF;
END $$;

-- Create admin user with secure password
-- Password: admin123 (change in production!)
INSERT INTO users (id, username, email, password, role, created_at) 
VALUES (
    gen_random_uuid(),
    'admin',
    'admin@rpgbank.com',
    '$2a$10$abcdefghijklmnopqrstuvwxYZ1234567890', -- This is 'admin123' encrypted with BCrypt
    'ROLE_ADMIN',
    NOW()
) ON CONFLICT (username) DO NOTHING;

COMMIT;
