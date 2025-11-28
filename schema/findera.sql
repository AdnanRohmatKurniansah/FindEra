CREATE TYPE item_status_enum AS ENUM ('lost', 'found', 'resolved', 'closed');
CREATE TYPE claim_status_enum AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE item_type_enum AS ENUM ('lost', 'found');

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        VARCHAR(255),
  image       TEXT,
  phone       VARCHAR(30) UNIQUE,
  bio         TEXT,
  points      INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user       UUID NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  category      VARCHAR(100),
  location_text TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  status        item_status_enum DEFAULT 'lost',  
  image_url     TEXT,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE claims (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user       UUID NOT NULL,          
  item_id       UUID NOT NULL,          
  item_type     VARCHAR(10) NOT NULL,   
  message       TEXT,
  status        claim_status_enum DEFAULT 'pending',
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user       UUID NOT NULL,
  title         VARCHAR(255),
  message       TEXT,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE reward_points (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user       UUID NOT NULL,
  points        INT NOT NULL,
  reason        VARCHAR(255),
  item_id       UUID,
  item_type     item_type_enum,
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE item_comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id       UUID NOT NULL,
  item_type     VARCHAR(10) NOT NULL,  -- lost / found
  id_user       UUID NOT NULL,
  message       TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

----------------------------------------------------
-- PRIVATE MESSAGES (DM)
----------------------------------------------------
CREATE TABLE private_messages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id     UUID NOT NULL,
  receiver_id   UUID NOT NULL,
  message       TEXT NOT NULL,
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE
);
