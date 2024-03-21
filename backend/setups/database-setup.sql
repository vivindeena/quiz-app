-- Add the 'uuid-ossp' extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    emailVerified BOOLEAN DEFAULT FALSE,
    phoneVerified BOOLEAN DEFAULT FALSE
);
-- Create an index on the 'email' column
CREATE INDEX idx_users_email ON users (email);

-- Create the 'userVerification' table
CREATE TABLE IF NOT EXISTS usersVerification (
    user_id UUID,
    unique_id VARCHAR(75),
    verifiyType VARCHAR(5) CHECK (verifiyType IN ('email', 'phone')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (unique_id, verifiyType)
);
-- Create an index on the 'email' column
CREATE INDEX idx_users_email ON users (email);

-- Create roles with specified permissions
CREATE ROLE quiz_app_readonly LOGIN PASSWORD 'readonly_password';

-- Grant permissions to the roles
GRANT SELECT ON users TO quiz_app_readonly;
GRANT SELECT ON usersVerification TO quiz_app_readonly;

-- Create users and assign roles
CREATE USER quiz_app_readonly_user WITH PASSWORD 'readonly_user_password';
GRANT quiz_app_readonly TO quiz_app_readonly_user;


-- Create roles with specified permissions
CREATE ROLE quiz_app_delete_verification LOGIN PASSWORD 'delete_verification_password';

-- Grant permissions to the roles
GRANT DELETE ON usersVerification TO quiz_app_delete_verification;

-- Create users and assign roles
CREATE USER quiz_app_delete_verification_user WITH PASSWORD 'delete_verification_user_password';
GRANT quiz_app_delete_verification TO quiz_app_delete_verification_user;