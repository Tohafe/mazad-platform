#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "$ITEMS_DB_NAME";
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$ITEMS_DB_NAME" <<-EOSQL
    CREATE TABLE IF NOT EXISTS categories (
        id          BIGSERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL UNIQUE,
        slug        VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url   TEXT,
        hex_color   VARCHAR(255),
        icon        VARCHAR(255),
        active      BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS items (
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

    CREATE TABLE IF NOT EXISTS item_images (
        item_id   BIGINT NOT NULL REFERENCES items (id) ON DELETE CASCADE,
        image_url TEXT   NOT NULL,
        PRIMARY KEY (item_id, image_url)
    );

    INSERT INTO categories (name, slug, description, image_url, hex_color, icon, active)
    VALUES
        ('Watches', 'watches', 'Exquisite horological masterpieces ranging from vintage mechanical wonders to modern luxury complications and limited-edition timepieces.',
         '${MINIO_URL}/watch.jpg', '#7DA7D9', 'LuWatch', true),

        ('Interiors', 'interiors', 'Mid-century modern furniture, antique home decor, and bespoke architectural elements for sophisticated living spaces.',
         '${MINIO_URL}/interiors.jpg', '#A3B18A', 'LuArmchair', true),

        ('Trading Cards', 'trading-cards', 'Investment-grade sports cards, pristine holographics, and rare gaming collectibles with verified professional grading.',
         '${MINIO_URL}/trading-cards.jpg', '#A4D4AE', 'LuLayers', true),

        ('Art', 'art', 'Curated fine art collections featuring classical oil paintings, contemporary sculptures, and authenticated gallery-grade masterpieces.',
         '${MINIO_URL}/art.jpg', '#CBA5F7', 'LuPalette', true),

        ('Electronics', 'electronics', 'Iconic vintage tech, rare retro gaming consoles, and historical computing devices highly sought after by collectors.',
         '${MINIO_URL}/electronics.jpg', '#FFD580', 'LuSmartphone', true),

        ('Cars', 'cars', 'Automotive excellence spanning pristine classic cruisers, high-performance modern hypercars, and historically significant vehicles.',
         '${MINIO_URL}/cars.jpg', '#FFB3B3', 'LuCar', true),

        ('Jewelry', 'jewelry', 'Dazzling heirloom pieces, bespoke gem-set creations, and exquisite fine jewelry crafted from the world''s most precious metals and stones.',
         '${MINIO_URL}/jewelry.jpg', '#F5C3D1', 'LuGem', true),

        ('Rare Books', 'rare-books', 'Antiquarian literature, historical manuscripts, and highly sought-after first editions preserved for centuries.',
         '${MINIO_URL}/rare-books.jpg', '#D4A373', 'LuLibrary', true),

        ('Comics', 'comics', 'CGC-graded golden age classics, first appearances of iconic heroes, and signed modern variant covers for serious enthusiasts.',
         '${MINIO_URL}/comics.jpg', '#FFE5A5', 'LuBookOpen', true),

        ('Coins', 'coins', 'Numismatic treasures including ancient currency, rare mint errors, and historically significant precious metal coins from around the globe.',
         '${MINIO_URL}/coins.jpg', '#FEE2B3', 'LuCoins', true),

        ('Memorabilia', 'memorabilia', 'Autographed historical documents, iconic movie props, and authenticated items tied to legendary figures in pop culture and history.',
         '${MINIO_URL}/memorabilia.jpg', '#FFD166', 'LuTicket', true),

        ('Luxury Bags', 'luxury-bags', 'Exceptional artisan-crafted handbags, limited-edition designer luggage, and highly coveted leather goods in pristine condition.',
         '${MINIO_URL}/luxury-bags.jpg', '#D6B8F5', 'LuShoppingBag', true),

        ('Others', 'others', 'A curated selection of unique oddities, antique furnishings, and rare curiosities that defy standard categorization.',
         '${MINIO_URL}/others.jpg', '#E2E8F0', 'LuArchive', true)
    ON CONFLICT (slug) DO NOTHING;
EOSQL