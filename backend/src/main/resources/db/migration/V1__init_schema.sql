-- ============================================================
-- FASHIONA E-COMMERCE DATABASE SCHEMA
-- PostgreSQL 15+  |  Flyway Migration V1
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for full-text search

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    phone            VARCHAR(15),
    password_hash    TEXT        NOT NULL,
    date_of_birth    DATE,
    gender           VARCHAR(20)  CHECK (gender IN ('MALE','FEMALE','OTHER','PREFER_NOT_TO_SAY')),
    avatar_url       TEXT,
    role             VARCHAR(10)  NOT NULL DEFAULT 'CUSTOMER'
                                  CHECK (role IN ('CUSTOMER','ADMIN','SELLER')),
    email_verified                BOOLEAN NOT NULL DEFAULT FALSE,
    active                        BOOLEAN NOT NULL DEFAULT TRUE,
    email_verification_token      TEXT,
    password_reset_token          TEXT,
    password_reset_expiry         TIMESTAMPTZ,
    loyalty_points                INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email   ON users(email);
CREATE INDEX idx_users_phone   ON users(phone);
CREATE INDEX idx_users_role    ON users(role);
CREATE INDEX idx_users_active  ON users(active);

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE addresses (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type           VARCHAR(20),
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    phone          VARCHAR(15),
    address_line1  TEXT        NOT NULL,
    address_line2  TEXT,
    city           VARCHAR(100) NOT NULL,
    state          VARCHAR(100) NOT NULL,
    pincode        VARCHAR(10)  NOT NULL,
    country        VARCHAR(60)  NOT NULL DEFAULT 'India',
    is_default     BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    icon        VARCHAR(10),
    parent_id   UUID REFERENCES categories(id),
    sort_order  INT NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
    id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    name             VARCHAR(200)   NOT NULL,
    slug             VARCHAR(250)   NOT NULL UNIQUE,
    description      TEXT,
    price            NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
    original_price   NUMERIC(10,2)  CHECK (original_price >= 0),
    category         VARCHAR(50)    NOT NULL,
    subcategory      VARCHAR(100),
    brand            VARCHAR(100),
    stock_quantity   INT            NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    average_rating   NUMERIC(3,2)   NOT NULL DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    total_reviews    INT            NOT NULL DEFAULT 0,
    badge            VARCHAR(20)    CHECK (badge IN ('NEW','SALE','TRENDING','BESTSELLER','HOT','LUXURY','SUMMER','WINTER','FEATURED')),
    active           BOOLEAN        NOT NULL DEFAULT TRUE,
    featured         BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category   ON products(category);
CREATE INDEX idx_products_price      ON products(price);
CREATE INDEX idx_products_rating     ON products(average_rating DESC);
CREATE INDEX idx_products_active     ON products(active);
CREATE INDEX idx_products_featured   ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_badge      ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX idx_products_slug       ON products(slug);
-- Full-text search index
CREATE INDEX idx_products_search     ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description,'')));

-- Product images (ordered list)
CREATE TABLE product_images (
    id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID    NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url   TEXT    NOT NULL,
    sort_order  INT     NOT NULL DEFAULT 0
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Product sizes
CREATE TABLE product_sizes (
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size        VARCHAR(20) NOT NULL,
    PRIMARY KEY (product_id, size)
);

-- Product colors
CREATE TABLE product_colors (
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    color       VARCHAR(30) NOT NULL,
    PRIMARY KEY (product_id, color)
);

-- Product tags
CREATE TABLE product_tags (
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag         VARCHAR(50) NOT NULL,
    PRIMARY KEY (product_id, tag)
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(200),
    body        TEXT,
    verified    BOOLEAN     NOT NULL DEFAULT FALSE,
    approved    BOOLEAN     NOT NULL DEFAULT TRUE,
    helpful_votes INT       NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (product_id, user_id)   -- one review per product per user
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user    ON reviews(user_id);
CREATE INDEX idx_reviews_rating  ON reviews(rating);

CREATE TABLE review_images (
    id          UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id   UUID  NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url   TEXT  NOT NULL
);

-- ============================================================
-- COUPONS
-- ============================================================
CREATE TABLE coupons (
    id                    UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                  VARCHAR(30)   NOT NULL UNIQUE,
    description           VARCHAR(200),
    discount_type         VARCHAR(20)   NOT NULL CHECK (discount_type IN ('PERCENTAGE','FLAT_AMOUNT','FREE_SHIPPING')),
    discount_value        NUMERIC(10,2) NOT NULL,
    max_discount_amount   NUMERIC(10,2),
    minimum_order_amount  NUMERIC(10,2),
    usage_limit           INT           NOT NULL DEFAULT -1,
    usage_count           INT           NOT NULL DEFAULT 0,
    user_usage_limit      INT           NOT NULL DEFAULT 1,
    valid_from            TIMESTAMPTZ   NOT NULL,
    valid_until           TIMESTAMPTZ   NOT NULL,
    active                BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(active, valid_until);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
    id                      UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number            VARCHAR(20)   NOT NULL UNIQUE,
    user_id                 UUID          NOT NULL REFERENCES users(id),
    shipping_address_id     UUID          REFERENCES addresses(id),
    status                  VARCHAR(25)   NOT NULL DEFAULT 'PENDING'
                                          CHECK (status IN ('PENDING','CONFIRMED','PROCESSING','PACKED',
                                                            'SHIPPED','OUT_FOR_DELIVERY','DELIVERED',
                                                            'CANCELLED','RETURNED','REFUNDED')),
    payment_method          VARCHAR(20)   CHECK (payment_method IN ('CREDIT_CARD','DEBIT_CARD','UPI',
                                                                     'NET_BANKING','WALLET',
                                                                     'CASH_ON_DELIVERY','EMI')),
    payment_status          VARCHAR(25)   NOT NULL DEFAULT 'PENDING'
                                          CHECK (payment_status IN ('PENDING','PAID','FAILED',
                                                                     'REFUNDED','PARTIALLY_REFUNDED')),
    payment_transaction_id  VARCHAR(100),
    subtotal                NUMERIC(10,2) NOT NULL,
    shipping_cost           NUMERIC(10,2) NOT NULL DEFAULT 0,
    tax_amount              NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount         NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount            NUMERIC(10,2) NOT NULL,
    coupon_code             VARCHAR(30),
    tracking_number         VARCHAR(100),
    courier_provider        VARCHAR(100),
    estimated_delivery_date TIMESTAMPTZ,
    delivered_at            TIMESTAMPTZ,
    cancelled_at            TIMESTAMPTZ,
    cancellation_reason     TEXT,
    notes                   TEXT,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user     ON orders(user_id);
CREATE INDEX idx_orders_status   ON orders(status);
CREATE INDEX idx_orders_number   ON orders(order_number);
CREATE INDEX idx_orders_created  ON orders(created_at DESC);
CREATE INDEX idx_orders_payment  ON orders(payment_status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
    id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id       UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id     UUID          NOT NULL REFERENCES products(id),
    product_name   VARCHAR(200)  NOT NULL,
    product_image  TEXT,
    quantity       INT           NOT NULL CHECK (quantity > 0),
    unit_price     NUMERIC(10,2) NOT NULL,
    total_price    NUMERIC(10,2) NOT NULL,
    size           VARCHAR(20),
    color          VARCHAR(30),
    reviewed       BOOLEAN       NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================================
-- CART (persistent server-side cart)
-- ============================================================
CREATE TABLE cart_items (
    id          UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  UUID          NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity    INT           NOT NULL DEFAULT 1 CHECK (quantity > 0),
    size        VARCHAR(20),
    color       VARCHAR(30),
    added_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id, size, color)
);

CREATE INDEX idx_cart_user ON cart_items(user_id);

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE user_wishlist (
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    body        TEXT,
    read        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);

-- ============================================================
-- UPDATED_AT auto-trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at    BEFORE UPDATE ON users    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at   BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
