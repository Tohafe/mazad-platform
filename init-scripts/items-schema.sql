CREATE DATABASE "items-db";

\c items-db;
-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
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

    starting_price DECIMAL(19, 2)                    NOT NULL,
    current_bid    DECIMAL(19, 2)                    NOT NULL DEFAULT 0,

    starts_at      TIMESTAMP                         NOT NULL,
    ends_at        TIMESTAMP                         NOT NULL,
    status         VARCHAR(255)                      NOT NULL,

    specs          jsonb,
    shipping_info  TEXT,

    seller_id      UUID                              NOT NULL,
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

-- 1. Insert Categories with new visual fields
INSERT INTO categories (name, description, image_url, hex_color, icon, active)
VALUES ('Electronics',
        'Gadgets, computers, and phones',
        'https://example.com/images/electronics.jpg',
        '#2563EB',
        'fa-laptop',
        true),
       ('Furniture',
        'Home and office furniture',
        'https://example.com/images/furniture.jpg',
        '#D97706',
        'fa-couch',
        true),
       ('Art',
        'Paintings, sculptures, and digital art',
        'https://example.com/images/art.jpg',
        '#9333EA',
        'fa-palette',
        true),
       ('Fashion',
        'Clothing, shoes, and accessories',
        'https://example.com/images/fashion.jpg',
        '#DB2777',
        'fa-tshirt',
        true),
       ('Collectibles',
        'Rare items and memorabilia',
        'https://example.com/images/collectibles.jpg',
        '#F59E0B',
        'fa-gem',
        true)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert 1,000 Items (Updated for new Schema)
INSERT INTO items (title, description,
                   starting_price, current_bid,
                   starts_at, ends_at, status,
                   seller_id, category_id,
                   specs, shipping_info, -- NEW
                   created_at, updated_at -- NEW (Required)
)
SELECT 'Item #' || seq,
       'Description for item #' || seq,

       -- Prices
       (random() * 100 + 10)::DECIMAL(10, 2), -- Starting Price
       0.00,

       -- Dates
       NOW(),
       NOW() + (random() * INTERVAL '30 days'),

       -- Status
       CASE WHEN random() > 0.2 THEN 'ACTIVE' ELSE 'SOLD' END,

       -- IDs
       gen_random_uuid(),
       (SELECT id FROM categories ORDER BY random() LIMIT 1),

       -- NEW: Random JSON Specs
       jsonb_build_object(
               'Brand', 'Generic Brand ' || (floor(random() * 10)::int),
               'Year', (2010 + floor(random() * 14)::int)::text,
               'Condition', CASE WHEN random() > 0.5 THEN 'New' ELSE 'Used' END
       ),

       -- NEW: Shipping
       'Ships from Netherlands - €15.00',

       -- NEW: Timestamps (Required by NOT NULL constraint)
       NOW(),
       NOW()
FROM generate_series(1, 1000) AS seq;

-- 3. Insert Fake Images (CRITICAL)
-- This adds 3 fake placeholder images for every item you just created.
INSERT INTO item_images (item_id, image_url)
SELECT i.id,
       'https://placehold.co/600x400?text=' || i.title || '_Image_' || img_num
FROM items i
         CROSS JOIN generate_series(1, 3) AS img_num; -- 3 images per item