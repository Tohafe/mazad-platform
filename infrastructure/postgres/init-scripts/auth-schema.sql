CREATE DATABASE "auth-db";

\c auth-db;

CREATE TABLE IF NOT EXISTS users
(
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) UNIQUE NOT NULL,
    password       TEXT                NOT NULL,
    username       VARCHAR(255) UNIQUE NOT NULL,
    is_2fa_enabled BOOLEAN          DEFAULT FALSE,
    is_verified    BOOLEAN          DEFAULT FALSE,
    created_at     TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS refresh_token
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token       VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMPTZ  NOT NULL,
    user_id     UUID         NOT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS api_keys
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key    VARCHAR(255) UNIQUE NOT NULL,
    user_id    UUID                NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_api_keys_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_apikey
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);