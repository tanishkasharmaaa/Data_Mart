PRODUCTS TABLE LOOKS LIKE THIS : - 

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  rating NUMERIC(2,1) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INDEXING LOOKS LIKE THIS 

CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);

DATA SEEDING FUNCTION : 

CREATE OR REPLACE FUNCTION seed_products(total INTEGER)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO products (title, description, category, price, stock, rating, image_url)
  SELECT
    product_names[ceil(random()*array_length(product_names,1))],
    'High quality product designed for performance and durability.',
    categories[ceil(random()*array_length(categories,1))],
    round((random()*70000 + 500)::numeric,2),
    floor(random()*300),
    round((random()*5)::numeric,1),
    images[ceil(random()*array_length(images,1))]
  FROM generate_series(1, total),
  (
    SELECT
      ARRAY[
        'Apple AirPods Pro',
        'Sony WH-1000XM5 Headphones',
        'Nike Air Zoom Pegasus Running Shoes',
        'Adidas Ultraboost Sneakers',
        'Samsung Galaxy Buds 2',
        'Logitech MX Master 3 Mouse',
        'Dell XPS 13 Laptop',
        'HP Pavilion 15 Laptop',
        'Canon EOS M50 Camera',
        'Apple Watch Series 9',
        'JBL Flip 6 Bluetooth Speaker',
        'RayBan Aviator Sunglasses',
        'Levis Slim Fit Jeans',
        'Puma Sports T-Shirt',
        'Philips Air Fryer',
        'KitchenAid Stand Mixer',
        'Asus ROG Gaming Monitor',
        'Lenovo ThinkPad Mechanical Keyboard',
        'Boat Rockerz 550 Headphones',
        'Mi Smart Band 8'
      ] AS product_names,

      ARRAY[
        'Electronics',
        'Fashion',
        'Footwear',
        'Accessories',
        'Home Appliances',
        'Fitness',
        'Computers'
      ] AS categories,

      ARRAY[
        'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
        'https://images.unsplash.com/photo-1593032465171-8c1c88c3f4e0',
        'https://images.unsplash.com/photo-1518444028785-8fbcd101ebb9',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1580894894513-541e068a3e2b',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97'
      ] AS images
  ) data;
END;
$$;

SELECT seed_products(10000);

CUSTOMERS TABLE LOOKS LIKE THIS : -


CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  city TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

SEED FUNCTION FOR CUSTOMERS :

CREATE OR REPLACE FUNCTION seed_customers(total INT)
RETURNS VOID AS $$
DECLARE
  first_names TEXT[] := ARRAY[
    'John','Emily','Michael','Sarah','David','Emma','Daniel','Olivia',
    'James','Sophia','Robert','Isabella','William','Mia','Joseph','Charlotte'
  ];

  last_names TEXT[] := ARRAY[
    'Smith','Johnson','Brown','Taylor','Anderson','Thomas',
    'Jackson','White','Harris','Martin','Thompson','Garcia'
  ];

  cities TEXT[] := ARRAY[
    'New York','London','Toronto','Berlin','Paris',
    'Sydney','Mumbai','Tokyo','Dubai','Singapore'
  ];

  countries TEXT[] := ARRAY[
    'USA','UK','Canada','Germany','France',
    'Australia','India','Japan','UAE','Singapore'
  ];
BEGIN
  INSERT INTO customers (name, email, city, country)
  SELECT
    first_names[floor(random()*array_length(first_names,1) + 1)] || ' ' ||
    last_names[floor(random()*array_length(last_names,1) + 1)],

    'user' || gs || '@example.com',

    cities[floor(random()*array_length(cities,1) + 1)],

    countries[floor(random()*array_length(countries,1) + 1)]

  FROM generate_series(1, total) AS gs;
END;
$$ LANGUAGE plpgsql;

SELECT seed_customers(5000);

INDEXES FOR CUSTOMERS TABLE 

CREATE INDEX idx_customers_name ON customers(name);

CREATE INDEX idx_customers_email ON customers(email);

CREATE INDEX idx_customers_city ON customers(city);

CREATE INDEX idx_customers_country ON customers(country);

CREATE INDEX idx_customers_created_at ON customers(created_at);


ORDERS TABLE LOOKS LIKE THIS :

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'completed',
  order_date TIMESTAMP DEFAULT NOW()
);

ORDERS INDEXES :

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

SEED FUNCTION FOR ORDERS

CREATE OR REPLACE FUNCTION seed_orders(total INT)
RETURNS VOID AS $$
BEGIN

INSERT INTO orders (
  customer_id,
  product_id,
  quantity,
  total_price,
  status,
  order_date
)

SELECT
  floor(random()*5000 + 1)::INT,   -- random customer
  floor(random()*10000 + 1)::INT,  -- random product
  floor(random()*5 + 1)::INT,      -- quantity 1-5
  floor(random()*2000 + 50)::NUMERIC, -- price
  (ARRAY['completed','pending','shipped','cancelled'])[floor(random()*4 + 1)],
  NOW() - (random()*365 || ' days')::INTERVAL

FROM generate_series(1, total);

END;
$$ LANGUAGE plpgsql;


SELECT seed_orders(50000);