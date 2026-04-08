CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default admin for initial local testing.
-- The password_hash is for 'admin123'
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@example.com', '$2b$10$EP03SpxM1O8a8V.6/Bv6d.Y/y87VHTOQ0.bJOrY0j8xM7hAOTLwZ.', 'admin')
ON CONFLICT (email) DO NOTHING;
