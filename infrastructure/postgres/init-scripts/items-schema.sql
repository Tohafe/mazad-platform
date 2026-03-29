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
VALUES
    ('Watches', 'watches', 'Exquisite horological masterpieces ranging from vintage mechanical wonders to modern luxury complications and limited-edition timepieces.',
     'https://plus.unsplash.com/premium_photo-1682125779534-76c5debea767?q=80&w=1062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#7DA7D9', 'LuWatch', true),

    ('Interiors', 'interiors', 'Mid-century modern furniture, antique home decor, and bespoke architectural elements for sophisticated living spaces.',
     'https://images.unsplash.com/photo-1615875474908-f403116f5287?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#A3B18A', 'LuArmchair', true),

    ('Trading Cards', 'trading-cards', 'Investment-grade sports cards, pristine holographics, and rare gaming collectibles with verified professional grading.',
     'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#A4D4AE', 'LuLayers', true),

    ('Art', 'art', 'Curated fine art collections featuring classical oil paintings, contemporary sculptures, and authenticated gallery-grade masterpieces.',
     'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&auto=format&fit=crop&q=80',
     '#CBA5F7', 'LuPalette', true),

    ('Electronics', 'electronics', 'Iconic vintage tech, rare retro gaming consoles, and historical computing devices highly sought after by collectors.',
     'https://images.unsplash.com/photo-1610139485079-f90f3a1f2ab3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#FFD580', 'LuSmartphone', true),

    ('Cars', 'cars', 'Automotive excellence spanning pristine classic cruisers, high-performance modern hypercars, and historically significant vehicles.',
     'https://plus.unsplash.com/premium_photo-1736579860377-27de096b5576?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#FFB3B3', 'LuCar', true),

    ('Jewelry', 'jewelry', 'Dazzling heirloom pieces, bespoke gem-set creations, and exquisite fine jewelry crafted from the world''s most precious metals and stones.',
     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&auto=format&fit=crop&q=80',
     '#F5C3D1', 'LuGem', true),

    ('Rare Books', 'rare-books', 'Antiquarian literature, historical manuscripts, and highly sought-after first editions preserved for centuries.',
     'https://plus.unsplash.com/premium_photo-1682125776589-e899882259c3?q=80&w=742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#D4A373', 'LuLibrary', true),

    ('Comics', 'comics', 'CGC-graded golden age classics, first appearances of iconic heroes, and signed modern variant covers for serious enthusiasts.',
     'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&auto=format&fit=crop&q=80',
     '#FFE5A5', 'LuBookOpen', true),

    ('Coins', 'coins', 'Numismatic treasures including ancient currency, rare mint errors, and historically significant precious metal coins from around the globe.',
     'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#FEE2B3', 'LuCoins', true),

    ('Memorabilia', 'memorabilia', 'Autographed historical documents, iconic movie props, and authenticated items tied to legendary figures in pop culture and history.',
     'https://images.unsplash.com/photo-1640615275247-0562cdd3e88b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#FFD166', 'LuTicket', true),

    ('Luxury Bags', 'luxury-bags', 'Exceptional artisan-crafted handbags, limited-edition designer luggage, and highly coveted leather goods in pristine condition.',
     'https://images.unsplash.com/photo-1591348278900-019a8a2a8b1d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#D6B8F5', 'LuShoppingBag', true),

    ('Others', 'others', 'A curated selection of unique oddities, antique furnishings, and rare curiosities that defy standard categorization.',
     'https://plus.unsplash.com/premium_photo-1685086785333-976367da9210?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
     '#E2E8F0', 'LuArchive', true);