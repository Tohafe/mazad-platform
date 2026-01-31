CREATE TABLE auctions (
    auction_id BIGINT PRIMARY KEY,

    status VARCHAR(20) NOT NULL,

    starting_price DECIMAL(19, 2) NOT NULL,

    current_highest_bid DECIMAL(19, 2),

    current_highest_bidder_id BIGINT,

    ends_at TIMESTAMPTZ NOT NULL,

    version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE bids (
    id BIGSERIAL PRIMARY KEY,

    auction_id BIGINT NOT NULL,

    bidder_id BIGINT NOT NULL,

    amount DECIMAL(19, 2) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- status VARCHAR(20) NOT NULL,

    -- This ensures we don't have orphan bids for non-existent auctions
    CONSTRAINT fk_bids_auction
        FOREIGN KEY (auction_id)
        REFERENCES auctions(auction_id)
        ON DELETE CASCADE
);

-- Indexing for performance: We will often search for bids by auction_id
CREATE INDEX idx_bids_auction_id ON bids(auction_id);