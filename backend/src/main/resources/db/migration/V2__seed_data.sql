-- ============================================================
-- FASHIONA SEED DATA  –  Flyway Migration V2
-- ============================================================

-- ========================
-- CATEGORIES
-- ========================
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
  (uuid_generate_v4(), 'Sarees',      'sarees',      'Silk, cotton & designer sarees',          '🥻', 1),
  (uuid_generate_v4(), 'Dresses',     'dresses',     'Western, ethnic & fusion dresses',        '👗', 2),
  (uuid_generate_v4(), 'Shoes',       'shoes',       'Heels, flats, sneakers & sandals',        '👠', 3),
  (uuid_generate_v4(), 'Watches',     'watches',     'Luxury, casual & smartwatches',           '⌚', 4),
  (uuid_generate_v4(), 'Caps & Hats', 'caps',        'Baseball caps, beanies & sun hats',       '🧢', 5),
  (uuid_generate_v4(), 'Slippers',    'slippers',    'Slides, flip-flops & cushioned slippers', '🩴', 6),
  (uuid_generate_v4(), 'Kurtas',      'kurtas',      'Men & women ethnic kurtas',               '👘', 7),
  (uuid_generate_v4(), 'Accessories', 'accessories', 'Jewellery, bags & sunglasses',            '💍', 8);

-- ========================
-- ADMIN USER
-- (password = "Admin@123" – BCrypt hash)
-- ========================
INSERT INTO users (id, first_name, last_name, email, password_hash, role, email_verified)
VALUES (
  uuid_generate_v4(),
  'Admin', 'Fashiona',
  'admin@fashiona.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Mthobe',
  'ADMIN',
  TRUE
);

-- ========================
-- DEMO CUSTOMER
-- (password = "Test@1234" – BCrypt hash)
-- ========================
INSERT INTO users (id, first_name, last_name, email, phone, password_hash, role, email_verified, loyalty_points)
VALUES (
  uuid_generate_v4(),
  'Rushi', 'Chennuri',
  'rushi@fashiona.com',
  '+919876543210',
  '$2a$12$K2vV3MiNk7oqO8LrRHpX5.QVhwBxFXhN5a6g1iAeO1PKqRNfmPRey',
  'CUSTOMER',
  TRUE,
  1250
);

-- ========================
-- COUPONS
-- ========================
INSERT INTO coupons (code, description, discount_type, discount_value, max_discount_amount, minimum_order_amount, usage_limit, valid_from, valid_until)
VALUES
  ('FASHION20',   'Flat 20% off on all orders',            'PERCENTAGE',   20, 500,  999,  1000, NOW(), NOW() + INTERVAL '90 days'),
  ('WELCOME100',  'Welcome offer – ₹100 off',              'FLAT_AMOUNT',  100, NULL, 500,  -1, NOW(), NOW() + INTERVAL '365 days'),
  ('FREESHIP',    'Free shipping on your order',           'FREE_SHIPPING', 99, NULL, 499,  -1, NOW(), NOW() + INTERVAL '30 days'),
  ('SAREE50',     '50% off on sarees (max ₹1000)',         'PERCENTAGE',   50, 1000, 1999, 500,  NOW(), NOW() + INTERVAL '60 days'),
  ('DIWALI30',    'Diwali special – 30% off',              'PERCENTAGE',   30, 800,  1499, 2000, NOW(), NOW() + INTERVAL '15 days'),
  ('FIRSTBUY',    'First purchase – 15% off',              'PERCENTAGE',   15, 300,  0,    1,    NOW(), NOW() + INTERVAL '180 days');

-- ========================
-- PRODUCTS – SAREES
-- ========================
WITH saree1 AS (
  INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge, featured)
  VALUES (
    'Kanjivaram Silk Saree',
    'kanjivaram-silk-saree',
    'Authentic Kanjivaram pure silk saree with gold zari work. A timeless piece of South Indian craftsmanship, perfect for weddings and festivals.',
    8999, 12999, 'sarees', 'Nalli Silks', 15, 4.8, 312, 'BESTSELLER', TRUE
  ) RETURNING id
)
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop', 0 FROM saree1
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1000&fit=crop', 1 FROM saree1;

WITH saree1_id AS (SELECT id FROM products WHERE slug = 'kanjivaram-silk-saree')
INSERT INTO product_sizes (product_id, size) SELECT id, s FROM saree1_id, (VALUES ('5.5m'),('6m'),('6.5m')) AS t(s);

WITH saree1_id AS (SELECT id FROM products WHERE slug = 'kanjivaram-silk-saree')
INSERT INTO product_colors (product_id, color) SELECT id, c FROM saree1_id, (VALUES ('#B22222'),('#4B0082'),('#006400'),('#FFD700')) AS t(c);

WITH saree1_id AS (SELECT id FROM products WHERE slug = 'kanjivaram-silk-saree')
INSERT INTO product_tags (product_id, tag) SELECT id, tag FROM saree1_id, (VALUES ('silk'),('traditional'),('wedding'),('kanjivaram')) AS t(tag);

-- Banarasi Saree
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge, featured)
VALUES (
  'Banarasi Georgette Saree',
  'banarasi-georgette-saree',
  'Luxurious Banarasi georgette saree with intricate woven patterns and silver zari border. Ideal for festive occasions.',
  5499, 7999, 'sarees', 'Varanasi Silk House', 8, 4.6, 187, 'SALE', FALSE
);

WITH sid AS (SELECT id FROM products WHERE slug = 'banarasi-georgette-saree')
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=1000&fit=crop', 0 FROM sid;

WITH sid AS (SELECT id FROM products WHERE slug = 'banarasi-georgette-saree')
INSERT INTO product_sizes (product_id, size) SELECT id, s FROM sid, (VALUES ('5.5m'),('6m')) AS t(s);

WITH sid AS (SELECT id FROM products WHERE slug = 'banarasi-georgette-saree')
INSERT INTO product_colors (product_id, color) SELECT id, c FROM sid, (VALUES ('#FF6B6B'),('#4ECDC4'),('#45B7D1'),('#96CEB4')) AS t(c);

-- ========================
-- PRODUCTS – DRESSES
-- ========================
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge, featured)
VALUES
  ('Floral Maxi Dress',       'floral-maxi-dress',      'Elegant floral maxi dress with flowing silhouette. Perfect for summer occasions and beach outings.',          2499, 3999, 'dresses', 'Zara Style', 34, 4.7, 428, 'TRENDING', TRUE),
  ('Off-Shoulder Bodycon',    'off-shoulder-bodycon',   'Stunning off-shoulder bodycon dress in premium stretch fabric. Perfect for parties and evening events.',      1899, 2999, 'dresses', 'H&M', 18, 4.5, 263, 'HOT', FALSE),
  ('Boho Wrap Midi Dress',    'boho-wrap-midi-dress',   'Bohemian-inspired wrap midi dress with beautiful print. Versatile from day to night.',                      2199, 3299, 'dresses', 'FabIndia', 27, 4.4, 156, 'NEW', FALSE),
  ('Anarkali Kurta Set',      'anarkali-kurta-set',     'Stunning anarkali printed kurta with palazzo pants and dupatta. Exquisite ethnic wear for all occasions.',  2799, 4299, 'dresses', 'Biba', 28, 4.8, 389, 'TRENDING', TRUE);

WITH sid AS (SELECT id FROM products WHERE slug = 'floral-maxi-dress')
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop', 0 FROM sid;

WITH sid AS (SELECT id FROM products WHERE slug = 'floral-maxi-dress')
INSERT INTO product_sizes (product_id, size) SELECT id, s FROM sid, (VALUES ('XS'),('S'),('M'),('L'),('XL'),('XXL')) AS t(s);

WITH sid AS (SELECT id FROM products WHERE slug = 'floral-maxi-dress')
INSERT INTO product_colors (product_id, color) SELECT id, c FROM sid, (VALUES ('#FFB6C1'),('#98FB98'),('#87CEEB'),('#FFD700')) AS t(c);

-- ========================
-- PRODUCTS – SHOES
-- ========================
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge, featured)
VALUES
  ('Block Heel Sandals',     'block-heel-sandals',    'Elegant block heel sandals with cushioned insole. Comfortable for all-day wear at events.',   3299, 4999, 'shoes', 'Metro', 20, 4.6, 321, 'SALE', TRUE),
  ('Stiletto Pumps',         'stiletto-pumps',        'Classic stiletto pumps in premium genuine leather. The ultimate power shoe for every occasion.',4599, 6999, 'shoes', 'Steve Madden', 12, 4.8, 198, 'LUXURY', TRUE),
  ('Embroidered Juttis',     'embroidered-juttis',    'Handcrafted embroidered juttis with traditional Rajasthani mirror work. Lightweight & stylish.',1599, 2499, 'shoes', 'Jaipur Craft', 45, 4.7, 445, 'BESTSELLER', FALSE),
  ('Classic White Sneakers', 'classic-white-sneakers','Premium white leather sneakers with cushioned sole. Pairs with absolutely everything.',        2799, 3999, 'shoes', 'Nike', 38, 4.5, 567, 'TRENDING', FALSE);

WITH sid AS (SELECT id FROM products WHERE slug = 'block-heel-sandals')
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', 0 FROM sid;

WITH sid AS (SELECT id FROM products WHERE slug = 'block-heel-sandals')
INSERT INTO product_sizes (product_id, size) SELECT id, s FROM sid, (VALUES ('35'),('36'),('37'),('38'),('39'),('40'),('41')) AS t(s);

WITH sid AS (SELECT id FROM products WHERE slug = 'block-heel-sandals')
INSERT INTO product_colors (product_id, color) SELECT id, c FROM sid, (VALUES ('#8B4513'),('#000000'),('#C0C0C0'),('#FFD700')) AS t(c);

-- ========================
-- PRODUCTS – WATCHES
-- ========================
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge, featured)
VALUES
  ('Rose Gold Elegance Watch',    'rose-gold-elegance-watch',  'Stunning rose gold watch with diamond-studded bezel. Swiss quartz movement. Water-resistant.',      12999, 18999, 'watches', 'Titan', 7,  4.9, 89,  'LUXURY', TRUE),
  ('Smart Fitness Watch',         'smart-fitness-watch',       'Advanced smartwatch with heart-rate, SpO2, GPS, 100+ sport modes and 7-day battery life.',           6999,  9999,  'watches', 'Noise', 25, 4.5, 234, 'TRENDING', FALSE),
  ('Vintage Leather Strap Watch', 'vintage-leather-strap',     'Classic vintage watch with genuine brown leather strap. Minimalist dial, Japanese movement.',        4999,  7499,  'watches', 'Fastrack', 14, 4.7, 156, 'SALE', FALSE);

WITH sid AS (SELECT id FROM products WHERE slug = 'rose-gold-elegance-watch')
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop', 0 FROM sid
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=1000&fit=crop', 1 FROM sid;

WITH sid AS (SELECT id FROM products WHERE slug = 'rose-gold-elegance-watch')
INSERT INTO product_sizes (product_id, size) SELECT id, s FROM sid, (VALUES ('One Size')) AS t(s);

WITH sid AS (SELECT id FROM products WHERE slug = 'rose-gold-elegance-watch')
INSERT INTO product_colors (product_id, color) SELECT id, c FROM sid, (VALUES ('#B76E79'),('#C0C0C0'),('#FFD700')) AS t(c);

-- ========================
-- PRODUCTS – CAPS
-- ========================
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge)
VALUES
  ('Embroidered Baseball Cap', 'embroidered-baseball-cap', 'Trendy embroidered baseball cap with adjustable strap. 100% cotton, unisex design.', 799,  1299, 'caps', 'H&M', 52, 4.4, 312, 'SALE'),
  ('Wide Brim Sun Hat',        'wide-brim-sun-hat',        'Elegant wide brim sun hat – UV50+ protection. Perfect for beach and garden parties.', 1299, 1999, 'caps', 'Mango', 30, 4.6, 187, 'NEW'),
  ('Woolen Beanie',            'woolen-beanie',            'Soft merino wool beanie for cold days. Ribbed design, keeps you warm in style.',       599,  999,  'caps', 'Adidas', 67, 4.5, 421, 'TRENDING');

-- ========================
-- PRODUCTS – SLIPPERS
-- ========================
INSERT INTO products (name, slug, description, price, original_price, category, brand, stock_quantity, average_rating, total_reviews, badge)
VALUES
  ('Diamond Slide Slippers',  'diamond-slide-slippers',  'Glam diamond-studded slide slippers. Perfect transition from pool to party.',     999, 1599, 'slippers', 'Bata', 44, 4.3, 234, 'NEW'),
  ('Memory Foam Flip Flops',  'memory-foam-flip-flops',  'Super comfortable memory foam flip flops with anti-slip sole. All-day comfort.',   699, 1199, 'slippers', 'Relaxo', 89, 4.7, 567, 'BESTSELLER');

-- ========================
-- SAMPLE REVIEWS
-- ========================
WITH usr AS (SELECT id FROM users WHERE email = 'rushi@fashiona.com'),
     prd AS (SELECT id FROM products WHERE slug = 'kanjivaram-silk-saree')
INSERT INTO reviews (product_id, user_id, rating, title, body, verified, approved)
SELECT prd.id, usr.id, 5,
  'Absolutely stunning saree!',
  'The quality is exceptional and it arrived perfectly packaged. The silk is pure and the zari work is intricate. Will definitely shop again from Fashiona!',
  TRUE, TRUE
FROM usr, prd;

WITH usr AS (SELECT id FROM users WHERE email = 'rushi@fashiona.com'),
     prd AS (SELECT id FROM products WHERE slug = 'rose-gold-elegance-watch')
INSERT INTO reviews (product_id, user_id, rating, title, body, verified, approved)
SELECT prd.id, usr.id, 5,
  'Exceeded all expectations!',
  'The watch is even more beautiful in person. The packaging was luxurious and it arrived safely. Looks stunning and keeps perfect time.',
  TRUE, TRUE
FROM usr, prd;

-- ========================
-- SAMPLE ORDER
-- ========================
DO $$
DECLARE
  v_user_id    UUID;
  v_product_id UUID;
  v_addr_id    UUID;
  v_order_id   UUID;
BEGIN
  SELECT id INTO v_user_id    FROM users    WHERE email = 'rushi@fashiona.com';
  SELECT id INTO v_product_id FROM products WHERE slug  = 'kanjivaram-silk-saree';

  INSERT INTO addresses (user_id, type, first_name, last_name, phone, address_line1, city, state, pincode, is_default)
  VALUES (v_user_id, 'HOME', 'Rushi', 'Chennuri', '+919876543210',
          '123, MG Road, Koramangala', 'Bangalore', 'Karnataka', '560034', TRUE)
  RETURNING id INTO v_addr_id;

  INSERT INTO orders (order_number, user_id, shipping_address_id, status, payment_method, payment_status,
                      subtotal, shipping_cost, tax_amount, total_amount, estimated_delivery_date)
  VALUES ('FAS1704067200000', v_user_id, v_addr_id, 'DELIVERED', 'UPI', 'PAID',
          8999, 0, 1620, 10619, NOW() - INTERVAL '10 days')
  RETURNING id INTO v_order_id;

  INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price, size, color, reviewed)
  VALUES (v_order_id, v_product_id, 'Kanjivaram Silk Saree',
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&fit=crop',
          1, 8999, 8999, '6m', '#B22222', TRUE);

  -- Award loyalty points
  UPDATE users SET loyalty_points = loyalty_points + 899 WHERE id = v_user_id;
END $$;
