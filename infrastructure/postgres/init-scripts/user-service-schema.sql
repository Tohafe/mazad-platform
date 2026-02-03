CREATE DATABASE "users-db";

\c users-db;

CREATE TABLE IF NOT EXISTS user_profile (
    user_id UUID PRIMARY KEY NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    bio TEXT,

    avatar_image_id TEXT,
    avatar_url TEXT,
    avatar_thumbnail_url TEXT,

    phone_number VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,

    is_complete BOOLEAN DEFAULT FALSE

);


CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_friendship_requester
        FOREIGN KEY (requester_id)
            REFERENCES user_profile(user_id)
            ON DELETE CASCADE,

    CONSTRAINT fk_friendship_receiver
        FOREIGN KEY (receiver_id)
            REFERENCES user_profile(user_id)
            ON DELETE CASCADE,

    CONSTRAINT uq_friendship_pair
        UNIQUE (requester_id, receiver_id)
);