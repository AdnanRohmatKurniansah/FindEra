-- -- =========================
-- -- CLEANUP OLD SCHEMA
-- -- =========================

-- DROP TABLE IF EXISTS private_messages CASCADE;
-- DROP TABLE IF EXISTS item_comments CASCADE;
-- DROP TABLE IF EXISTS reward_points CASCADE;
-- DROP TABLE IF EXISTS claims CASCADE;
-- DROP TABLE IF EXISTS items CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- DROP TYPE IF EXISTS item_status_enum CASCADE;
-- DROP TYPE IF EXISTS claim_status_enum CASCADE;
-- DROP TYPE IF EXISTS item_type_enum CASCADE;


-- CREATE TYPE item_status_enum AS ENUM ('hilang', 'ditemukan', 'ditutup');
-- CREATE TYPE claim_status_enum AS ENUM ('tertunda', 'disetuju', 'ditolak');
-- CREATE TYPE item_type_enum AS ENUM ('hilang', 'ditemukan');

-- CREATE TABLE profiles (
--   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   id_user     UUID NOT NULL,
--   name        VARCHAR(255) NOT NULL,
--   image       TEXT NULL,
--   phone       VARCHAR(30) UNIQUE NULL,
--   created_at  TIMESTAMP DEFAULT NOW(),
--   updated_at  TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (id_user) REFERENCES auth.users(id) ON DELETE CASCADE
-- );

-- CREATE TABLE categories (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name          VARCHAR(255) NOT NULL,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   updated_at    TIMESTAMP DEFAULT NOW()
-- );

-- INSERT INTO categories (name) VALUES
-- ('Dompet'),
-- ('HP'),
-- ('Kunci'),
-- ('Tas'),
-- ('Elektronik'),
-- ('Dokumen'),
-- ('Perhiasan'),
-- ('Lainnya');

-- DROP TABLE IF EXISTS items CASCADE;
-- CREATE TABLE items (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   id_user       UUID NOT NULL,
--   title         VARCHAR(255) NOT NULL,
--   description   TEXT NOT NULL,
--   id_category   UUID NOT NULL,
--   location_text TEXT NOT NULL,
--   latitude      DOUBLE PRECISION NOT NULL,
--   longitude     DOUBLE PRECISION NOT NULL,
--   status        item_status_enum DEFAULT 'hilang',  
--   image_url     TEXT NOT NULL,
--   report_date   DATE NOT NULL,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   updated_at    TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE
-- );

-- CREATE TABLE claims (
--   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   owner_id   UUID NOT NULL,
--   finder_id  UUID NOT NULL,
--   item_id    UUID NOT NULL UNIQUE,
--   created_at TIMESTAMP NOT NULL DEFAULT NOW(),

--   FOREIGN KEY (owner_id)  REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (finder_id) REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (item_id)   REFERENCES items(id)    ON DELETE CASCADE
-- );


-- -- CREATE TABLE notifications (
-- --   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
-- --   id_user       UUID NOT NULL,
-- --   title         VARCHAR(255),
-- --   message       TEXT,
-- --   is_read       BOOLEAN DEFAULT FALSE,
-- --   created_at    TIMESTAMP DEFAULT NOW(),
-- --   FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE
-- -- );

-- CREATE TABLE reward_points (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   id_user       UUID NOT NULL,
--   points        INT NOT NULL,
--   reason        VARCHAR(255),
--   item_id       UUID,
--   item_type     item_type_enum,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
-- );


-- CREATE TABLE item_comments (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   item_id       UUID NOT NULL,
--   item_type     VARCHAR(10) NOT NULL,  -- hilang / ditemukan
--   id_user       UUID NOT NULL,
--   message       TEXT NOT NULL,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (id_user) REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
-- );

-- ----------------------------------------------------
-- -- PRIVATE MESSAGES (DM)
-- ----------------------------------------------------
-- CREATE TABLE private_messages (
--   id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   sender_id     UUID NOT NULL,
--   receiver_id   UUID NOT NULL,
--   message       TEXT NOT NULL,
--   is_read       BOOLEAN DEFAULT FALSE,
--   created_at    TIMESTAMP DEFAULT NOW(),
--   FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE,
--   FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE
-- );


-- CREATE TABLE chat_rooms (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   item_id UUID REFERENCES items(id) ON DELETE CASCADE,
--   created_at TIMESTAMP DEFAULT NOW()
-- );

-- ALTER TABLE private_messages
-- ALTER COLUMN created_at
-- TYPE timestamptz
-- USING created_at AT TIME ZONE 'UTC';

-- ALTER TABLE reward_points
-- ALTER COLUMN created_at
-- TYPE timestamptz
-- USING created_at AT TIME ZONE 'UTC';

-- ALTER TABLE private_messages
-- ALTER COLUMN created_at
-- SET DEFAULT now();

-- CREATE POLICY "User can update own received messages"
-- ON public.private_messages
-- FOR UPDATE
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = private_messages.receiver_id
--       AND profiles.id_user = auth.uid()
--   )
-- )
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = private_messages.receiver_id
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- ALTER TABLE private_messages
-- ADD COLUMN room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
-- ADD COLUMN image_url TEXT NULL,
-- ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Update policies for chat_rooms to allow creation
-- Drop existing policies first
-- DROP POLICY IF EXISTS "User can access own rooms" ON chat_rooms;

-- -- Anyone can read chat rooms (needed for viewing items)
-- CREATE POLICY "Anyone can read chat rooms"
-- ON chat_rooms FOR SELECT
-- USING (true);

-- -- Anyone can create a chat room for an item
-- -- This allows the system to create rooms when someone views an item detail
-- CREATE POLICY "Anyone can create chat room"
-- ON chat_rooms FOR INSERT
-- WITH CHECK (true);

-- -- Optional: Add policy to prevent duplicate rooms (one room per item)
-- -- You can also handle this with a UNIQUE constraint
-- ALTER TABLE chat_rooms ADD CONSTRAINT unique_item_room UNIQUE (item_id);

-- -- Update existing private_messages policies to be more permissive for reading
-- DROP POLICY IF EXISTS "User can read room messages" ON private_messages;

-- CREATE POLICY "User can read room messages"
-- ON private_messages FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = sender_id AND profiles.id_user = auth.uid()
--   )
--   OR
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = receiver_id AND profiles.id_user = auth.uid()
--   )
-- );

-- -- Keep the send message policy as is
-- DROP POLICY IF EXISTS "User can send message" ON private_messages;

-- CREATE POLICY "User can send message"
-- ON private_messages FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = sender_id AND profiles.id_user = auth.uid()
--   )
-- );


-- CREATE POLICY "Read own rooms"
-- ON chat_rooms FOR SELECT
-- USING (true);


-- DROP POLICY IF EXISTS "Delete own message" ON private_messages;

-- CREATE POLICY "Delete own message"
-- ON private_messages
-- FOR DELETE
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = sender_id
--       AND profiles.id_user = auth.uid()
--   )
-- );


-- DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
-- DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reward_points ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE item_comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Read own profile"
-- ON profiles
-- FOR SELECT
-- USING (auth.uid() = id_user);

-- CREATE POLICY "Insert own profile"
-- ON profiles
-- FOR INSERT
-- WITH CHECK (auth.uid() = id_user);

-- CREATE POLICY "Update own profile"
-- ON profiles
-- FOR UPDATE
-- USING (auth.uid() = id_user);

-- CREATE POLICY "Anyone can read items"
-- ON items
-- FOR SELECT
-- USING (true);

-- CREATE POLICY "User can insert item"
-- ON items
-- FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = items.id_user
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "User can update own item"
-- ON items
-- FOR UPDATE
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = items.id_user
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "User can read own claims"
-- ON claims
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = claims.id_user
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "User can create claim"
-- ON claims
-- FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = claims.id_user
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "Anyone can read comments"
-- ON item_comments
-- FOR SELECT
-- USING (true);

-- CREATE POLICY "User can comment"
-- ON item_comments
-- FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = item_comments.id_user
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "Read own messages"
-- ON private_messages
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = sender_id
--       AND profiles.id_user = auth.uid()
--   )
--   OR
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = receiver_id
--       AND profiles.id_user = auth.uid()
--   )
-- );

-- CREATE POLICY "Send message"
-- ON private_messages
-- FOR INSERT
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.id = sender_id
--       AND profiles.id_user = auth.uid()
--   )
-- );



-- -- ============================================
-- -- SCRIPT UNTUK ENABLE REALTIME DI SUPABASE
-- -- ============================================

-- -- 1. Check apakah table sudah ada di publication
-- SELECT * FROM pg_publication_tables WHERE tablename = 'private_messages';
-- -- Jika kosong, lanjut ke step 2

-- -- 2. Drop publication jika sudah ada (optional, hati-hati!)
-- -- ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS private_messages;

-- -- 3. Add table ke publication
-- -- ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;

-- -- 4. Set REPLICA IDENTITY ke FULL
-- -- Ini WAJIB untuk mendapatkan OLD values di UPDATE/DELETE events
-- ALTER TABLE private_messages REPLICA IDENTITY FULL;

-- -- 5. Verify bahwa sudah ter-add
-- SELECT * FROM pg_publication_tables WHERE tablename = 'private_messages';
-- -- Harus return 1 row dengan pubname = 'supabase_realtime'

-- -- 6. Check RLS policies
-- SELECT 
--     schemaname,
--     tablename,
--     policyname,
--     permissive,
--     roles,
--     cmd,
--     qual,
--     with_check
-- FROM pg_policies 
-- WHERE tablename = 'private_messages';

-- -- 7. Pastikan RLS enabled
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename = 'private_messages';
-- -- rowsecurity harus 't' (true)

-- -- 8. Jika RLS belum enabled, enable dengan:
-- -- ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- -- 9. Pastikan ada policy untuk SELECT (agar realtime bisa kirim data)
-- -- Drop existing policies jika ada
-- DROP POLICY IF EXISTS "Enable realtime for authenticated users" ON private_messages;
-- DROP POLICY IF EXISTS "Users can view their messages" ON private_messages;
-- DROP POLICY IF EXISTS "Users can send messages" ON private_messages;
-- DROP POLICY IF EXISTS "Users can update their messages" ON private_messages;
-- DROP POLICY IF EXISTS "Users can delete their messages" ON private_messages;

-- -- Buat policies yang benar
-- -- Policy 1: SELECT - user bisa lihat pesan yang mereka kirim atau terima
-- CREATE POLICY "Users can view their messages"
-- ON private_messages
-- FOR SELECT
-- TO authenticated
-- USING (
--   auth.uid() = sender_id OR auth.uid() = receiver_id
-- );

-- -- Policy 2: INSERT - user bisa kirim pesan
-- CREATE POLICY "Users can send messages"
-- ON private_messages
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (auth.uid() = sender_id);

-- -- Policy 3: UPDATE - user bisa update pesan yang mereka terima (untuk mark as read)
-- CREATE POLICY "Users can update received messages"
-- ON private_messages
-- FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = receiver_id)
-- WITH CHECK (auth.uid() = receiver_id);

-- -- Policy 4: DELETE - user bisa delete pesan yang mereka kirim
-- CREATE POLICY "Users can delete sent messages"
-- ON private_messages
-- FOR DELETE
-- TO authenticated
-- USING (auth.uid() = sender_id);

-- -- 10. Grant permissions
-- GRANT SELECT ON private_messages TO authenticated;
-- GRANT INSERT ON private_messages TO authenticated;
-- GRANT UPDATE ON private_messages TO authenticated;
-- GRANT DELETE ON private_messages TO authenticated;

-- -- 11. Create index untuk performa (optional tapi recommended)
-- CREATE INDEX IF NOT EXISTS idx_private_messages_room_id ON private_messages(room_id);
-- CREATE INDEX IF NOT EXISTS idx_private_messages_sender_id ON private_messages(sender_id);
-- CREATE INDEX IF NOT EXISTS idx_private_messages_receiver_id ON private_messages(receiver_id);
-- CREATE INDEX IF NOT EXISTS idx_private_messages_is_read ON private_messages(is_read) WHERE is_read = false;

-- -- 12. Verify semua sudah benar
-- SELECT 
--     'publication' as check_type,
--     count(*) as count 
-- FROM pg_publication_tables 
-- WHERE tablename = 'private_messages'
-- UNION ALL
-- SELECT 
--     'policies' as check_type,
--     count(*) as count 
-- FROM pg_policies 
-- WHERE tablename = 'private_messages'
-- UNION ALL
-- SELECT 
--     'rls_enabled' as check_type,
--     CASE WHEN rowsecurity THEN 1 ELSE 0 END as count
-- FROM pg_tables 
-- WHERE tablename = 'private_messages';

-- -- Expected result:
-- -- publication | 1
-- -- policies    | 4
-- -- rls_enabled | 1

-- -- 13. Test realtime dengan query ini di tab SQL lain
-- -- Jalankan di satu tab:
-- -- SELECT * FROM private_messages WHERE room_id = 'your_room_id' ORDER BY created_at DESC;
-- -- 
-- -- Lalu di tab lain insert pesan baru:
-- -- INSERT INTO private_messages (room_id, sender_id, receiver_id, message)
-- -- VALUES ('your_room_id', 'user_id_1', 'user_id_2', 'test message');
-- -- 
-- -- Jika realtime bekerja, tab pertama akan auto-refresh



