CREATE DATABASE "items-db";

\c items-db;
-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    hex_color   VARCHAR(255),
    icon        VARCHAR(255),
    active      BOOLEAN DEFAULT TRUE
);

-- 2. Create Items Table
CREATE TABLE IF NOT EXISTS items
(
    id             BIGSERIAL PRIMARY KEY,
    title          VARCHAR(255)                      NOT NULL,
    description    TEXT,
    thumbnail      TEXT                              NOT NULL,
    document       TEXT,

    starting_price BIGINT                            NOT NULL,
    current_bid    BIGINT                            NOT NULL DEFAULT 0,

    starts_at      TIMESTAMP                         NOT NULL,
    ends_at        TIMESTAMP                         NOT NULL,
    status         VARCHAR(255)                      NOT NULL,

    specs          jsonb,
    shipping_info  TEXT,

    seller_id      UUID                              NOT NULL,
    winner_id      UUID,
    category_id    BIGINT REFERENCES categories (id) NOT NULL,

    created_at     TIMESTAMP                         NOT NULL,
    updated_at     TIMESTAMP                         NOT NULL

);

CREATE TABLE IF NOT EXISTS item_images
(
    item_id   BIGINT NOT NULL REFERENCES items (id) ON DELETE CASCADE,
    image_url TEXT   NOT NULL,
    PRIMARY KEY (item_id, image_url)
);

-- Generating random data

INSERT INTO categories (name, slug, description, image_url, hex_color, icon, active)
VALUES ('Watches', 'watches', 'Luxury and collectible watches',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
        '#7DA7D9', 'LuWatch', true),

       ('Sneakers', 'sneakers', 'Limited edition and collectible sneakers',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80',
        '#F28B82', 'LuFootprints', true),

       ('Trading Cards', 'trading-cards', 'Sports and gaming trading cards',
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
        '#A4D4AE', 'LuLayers', true),

       ('Art', 'art', 'Paintings and digital artworks',
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop&q=80',
        '#CBA5F7', 'LuPalette', true),

       ('Electronics', 'electronics', 'Rare and collectible electronics',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        '#FFD580', 'LuSmartphone', true),

       ('Cars', 'cars', 'Classic, luxury, and collectible cars',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
        '#FFB3B3', 'LuCar', true),

       ('Jewelry', 'jewelry', 'Fine jewelry and luxury accessories',
        'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&auto=format&fit=crop&q=80',
        '#F5C3D1', 'LuGem', true),

       ('Fashion', 'fashion', 'Designer fashion and apparel',
        'https://plus.unsplash.com/premium_photo-1675186049563-000f7ac02c44?w=600&auto=format&fit=crop&q=80',
        '#B8E0D2', 'LuShirt', true),

       ('Comics', 'comics', 'Vintage and modern comic books',
        'https://images.unsplash.com/photo-1571624630223-cc7d6e6ab730?w=600&auto=format&fit=crop&q=80',
        '#FFE5A5', 'LuBookOpen', true),

       ('Coins', 'coins', 'Rare and collectible coins',
        'https://images.unsplash.com/photo-1570857301950-637c03f72a6d?w=600&auto=format&fit=crop&q=80',
        '#FEE2B3', 'LuCoins', true),

       ('Photography', 'photography', 'Cameras and photographic art',
        'https://images.unsplash.com/photo-1519183071298-a2962fca9b33?w=600&auto=format&fit=crop&q=80',
        '#AEDFF7', 'LuCamera', true),

       ('Luxury Bags', 'luxury-bags', 'Designer handbags and wallets',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        '#D6B8F5', 'LuShoppingBag', true);