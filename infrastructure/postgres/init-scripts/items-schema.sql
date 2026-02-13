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

INSERT INTO categories (name, slug, description, image_url, hex_color, icon, active)
VALUES
    ('Watches', 'watches', 'Luxury and collectible watches',
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





INSERT INTO items
(title, description, starting_price, current_bid,
 starts_at, ends_at, status, specs, shipping_info,
 seller_id, category_id, created_at, updated_at)
SELECT
    'Auction Item #' || gs,
    'High quality collectible item number ' || gs,
    (random() * 900 + 100)::numeric(10,2),
    (random() * 1200 + 150)::numeric(10,2),
    NOW() - INTERVAL '1 day',
    NOW() + (gs % 10 + 3) * INTERVAL '1 day',
    'ACTIVE',

    jsonb_build_object(
            'condition', 'Excellent',
            'origin', 'Collector Market',
            'batch', gs
    ),

    'Worldwide shipping available.',

    CASE (gs % 5)
        WHEN 0 THEN '11111111-1111-1111-1111-111111111111'::uuid
        WHEN 1 THEN '22222222-2222-2222-2222-222222222222'::uuid
        WHEN 2 THEN '33333333-3333-3333-3333-333333333333'::uuid
        WHEN 3 THEN '44444444-4444-4444-4444-444444444444'::uuid
        ELSE        '55555555-5555-5555-5555-555555555555'::uuid
        END,

    (gs % 12) + 1,
    NOW(),
    NOW()
FROM generate_series(1, 50) gs;


INSERT INTO item_images (item_id, image_url)
SELECT
    id,
    'https://picsum.photos/seed/item' || id || '/600/450'
FROM items
WHERE id > (SELECT COALESCE(MAX(item_id), 0) FROM item_images);



-- -- 1. Insert Categories with new visual fields
-- INSERT INTO categories (name, description, image_url, hex_color, icon, active)
-- VALUES ('Electronics',
--         'Gadgets, computers, and phones',
--         'https://example.com/images/electronics.jpg',
--         '#2563EB',
--         'fa-laptop',
--         true),
--        ('Furniture',
--         'Home and office furniture',
--         'https://example.com/images/furniture.jpg',
--         '#D97706',
--         'fa-couch',
--         true),
--        ('Art',
--         'Paintings, sculptures, and digital art',
--         'https://example.com/images/art.jpg',
--         '#9333EA',
--         'fa-palette',
--         true),
--        ('Fashion',
--         'Clothing, shoes, and accessories',
--         'https://example.com/images/fashion.jpg',
--         '#DB2777',
--         'fa-tshirt',
--         true),
--        ('Collectibles',
--         'Rare items and memorabilia',
--         'https://example.com/images/collectibles.jpg',
--         '#F59E0B',
--         'fa-gem',
--         true)
-- ON CONFLICT (name) DO NOTHING;
--
-- -- 2. Insert 1,000 Items (Updated for new Schema)
-- INSERT INTO items (title, description,
--                    starting_price, current_bid,
--                    starts_at, ends_at, status,
--                    seller_id, category_id,
--                    specs, shipping_info, -- NEW
--                    created_at, updated_at -- NEW (Required)
-- )
-- SELECT 'Item #' || seq,
--        'Description for item #' || seq,
--
--        -- Prices
--        (random() * 100 + 10)::DECIMAL(10, 2), -- Starting Price
--        0.00,
--
--        -- Dates
--        NOW(),
--        NOW() + (random() * INTERVAL '30 days'),
--
--        -- Status
--        CASE WHEN random() > 0.2 THEN 'ACTIVE' ELSE 'SOLD' END,
--
--        -- IDs
--        gen_random_uuid(),
--        (SELECT id FROM categories ORDER BY random() LIMIT 1),
--
--        -- NEW: Random JSON Specs
--        jsonb_build_object(
--                'Brand', 'Generic Brand ' || (floor(random() * 10)::int),
--                'Year', (2010 + floor(random() * 14)::int)::text,
--                'Condition', CASE WHEN random() > 0.5 THEN 'New' ELSE 'Used' END
--        ),
--
--        -- NEW: Shipping
--        'Ships from Netherlands - €15.00',
--
--        -- NEW: Timestamps (Required by NOT NULL constraint)
--        NOW(),
--        NOW()
-- FROM generate_series(1, 1000) AS seq;
--
-- -- 3. Insert Fake Images (CRITICAL)
-- -- This adds 3 fake placeholder images for every item you just created.
-- INSERT INTO item_images (item_id, image_url)
-- SELECT i.id,
--        'https://placehold.co/600x400?text=' || i.title || '_Image_' || img_num
-- FROM items i
--          CROSS JOIN generate_series(1, 3) AS img_num; -- 3 images per item