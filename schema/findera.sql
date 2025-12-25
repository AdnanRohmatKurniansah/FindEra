-- =========================
-- CLEANUP OLD SCHEMA
-- =========================

DROP TABLE IF EXISTS private_messages CASCADE;
DROP TABLE IF EXISTS item_comments CASCADE;
DROP TABLE IF EXISTS reward_points CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS item_status_enum CASCADE;
DROP TYPE IF EXISTS claim_status_enum CASCADE;
DROP TYPE IF EXISTS item_type_enum CASCADE;


CREATE TYPE item_status_enum AS ENUM ('hilang', 'ditemukan', 'closed');
CREATE TYPE claim_status_enum AS ENUM ('tertunda', 'disetuju', 'ditolak');
CREATE TYPE item_type_enum AS ENUM ('hilang', 'ditemukan');

CREATE TABLE profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user     UUID NOT NULL,
  name        VARCHAR(255) NOT NULL,
  image       TEXT NULL,
  phone       VARCHAR(30) UNIQUE NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user       UUID NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL,
  category      VARCHAR(100),
  location_text TEXT,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  status        item_status_enum DEFAULT 'hilang',  
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
  status        claim_status_enum DEFAULT 'tertunda',
  created_at    TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- CREATE TABLE notifications (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   id_user       UUID NOT NULL,
--   title         VARCHAR(255),
--   message       TEXT,
--   is_read       BOOLEAN DEFAULT FALSE,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE
-- );

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
  item_type     VARCHAR(10) NOT NULL,  -- hilang / ditemukan
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


-- GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
-- GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;