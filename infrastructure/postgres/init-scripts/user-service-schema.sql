CREATE DATABASE "users-db";

\c users-db;

CREATE TABLE IF NOT EXISTS user_profile (  
    user_id UUID PRIMARY KEY NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    bio TEXT,
    
    avatar_image_id UUID,
    avatar_url TEXT,
    avatar_thumbnail_url TEXT,

    phone_number VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,

    is_complete BOOLEAN DEFAULT FALSE

);