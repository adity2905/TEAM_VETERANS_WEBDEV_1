-- ========================================================
-- NGO TRANSPARENCY PLATFORM (TEKTONIX 2026)
-- Supabase SQL Schema & Mock Seed Data
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. NGOs Table
CREATE TABLE IF NOT EXISTS ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT NOT NULL, -- 'Hunger Relief', 'Education', 'Healthcare', 'Environment', 'Animal Welfare'
    location TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    verified BOOLEAN DEFAULT TRUE,
    transparency_score INTEGER DEFAULT 95, -- 0 to 100 score
    founded_year INTEGER DEFAULT 2018,
    reg_number TEXT DEFAULT '80G-DEL-2021-9921',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Posts & Impact Activities Table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    activity_type TEXT NOT NULL, -- 'past_impact', 'upcoming_event', 'story'
    event_date DATE,
    location TEXT,
    people_reached INTEGER DEFAULT 0,
    metrics_label TEXT DEFAULT 'People Reached',
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Fundraisers Table
CREATE TABLE IF NOT EXISTS fundraisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    raised_amount NUMERIC DEFAULT 0,
    unit_cost_description TEXT, -- e.g. "₹250 supplies 1 meal kit"
    status TEXT DEFAULT 'active', -- 'active', 'completed'
    deadline DATE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Volunteer Needs Table
CREATE TABLE IF NOT EXISTS volunteer_needs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    event_date TIMESTAMPTZ,
    total_slots INTEGER DEFAULT 10,
    filled_slots INTEGER DEFAULT 0,
    status TEXT DEFAULT 'open', -- 'open', 'filled'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Donations Table (Mocked Transactions)
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fundraiser_id UUID REFERENCES fundraisers(id) ON DELETE CASCADE,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    receipt_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Volunteer Applications Table
CREATE TABLE IF NOT EXISTS volunteer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_need_id UUID REFERENCES volunteer_needs(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    skills TEXT,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- SEED DATA (Ready to Demo Immediately)
-- ========================================================

-- Insert Sample NGOs
INSERT INTO ngos (id, name, slug, tagline, description, category, location, logo_url, banner_url, verified, transparency_score, founded_year, reg_number)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Annapurna Food Mission', 'annapurna-food-mission', 'Zero Hunger in Urban Slums', 'Providing nutritious hot meals daily to underprivileged children and daily wage workers across Mumbai and Pune.', 'Hunger Relief', 'Mumbai, Maharashtra', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop', true, 98, 2019, '80G-MUM-2019-4820'),
('22222222-2222-2222-2222-222222222222', 'Vidya Vikas Foundation', 'vidya-vikas', 'Empowering Girls through Digital Education', 'Bridging the digital literacy divide by building computer labs and STEM learning centers in rural schools.', 'Education', 'Bengaluru, Karnataka', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=150&auto=format&fit=crop', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop', true, 96, 2017, '80G-BLR-2017-1049'),
('33333333-3333-3333-3333-333333333333', 'Prakriti Green Earth', 'prakriti-earth', 'Urban Afforestation & Clean Air', 'Restoring degraded biodiversity zones through Miyawaki urban forests and community lake rejuvenation projects.', 'Environment', 'New Delhi, Delhi', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop', 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop', true, 94, 2020, '80G-DEL-2020-5591')
ON CONFLICT (id) DO NOTHING;

-- Insert Impact Posts
INSERT INTO posts (ngo_id, title, content, media_url, activity_type, event_date, location, people_reached, metrics_label, likes_count)
VALUES
('11111111-1111-1111-1111-111111111111', 'Mega Monsoon Nutrition Drive in Dharavi', 'Our volunteer network distributed 2,400 hot meals containing khichdi, boiled eggs, and multi-vitamins to families displaced during recent waterlogging.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop', 'past_impact', '2026-09-25', 'Dharavi, Mumbai', 2400, 'Meals Distributed', 142),
('22222222-2222-2222-2222-222222222222', 'Inaugurated 3rd Rural STEM Coding Lab', 'Today 85 young girls wrote their first Python code in Channapatna! Thanks to our donors who sponsored 15 refurbished laptops with offline coding libraries.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop', 'past_impact', '2026-09-28', 'Channapatna, Karnataka', 85, 'Students Trained', 98),
('33333333-3333-3333-3333-333333333333', 'Community Miyawaki Plantation Drive', 'Planted 1,200 native saplings in Rohini Sector 16. Soil testing and drip irrigation lines were installed with active help of 40 local student volunteers.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop', 'past_impact', '2026-09-30', 'Rohini, Delhi', 1200, 'Trees Planted', 115);

-- Insert Fundraisers
INSERT INTO fundraisers (id, ngo_id, title, description, target_amount, raised_amount, unit_cost_description, status, deadline, image_url)
VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Sponsor 5,000 Midday Meals for Slum Children', 'Providing nutritious lunch boxes containing grains, lentils, and fruits to keep street children nourished and enrolled in school.', 125000, 84500, '₹25 buys 1 full nutrition meal', 'active', '2026-10-31', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop'),
('bbbb2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Smart Tablets for Rural Girls High School', 'Equipping 30 underprivileged girls with educational tablets preloaded with state board syllabus and interactive science modules.', 90000, 42000, '₹3,000 funds 1 complete tablet with educational license', 'active', '2026-11-15', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop');

-- Insert Volunteer Needs
INSERT INTO volunteer_needs (id, ngo_id, title, description, skills_required, location, event_date, total_slots, filled_slots, status)
VALUES
('cccc1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Weekend Food Packaging & Logistics Helpers', 'Assist in hygienic packaging of lunch packets and distribution across 4 transit points in Kurla & Chembur.', ARRAY['Physical Stamina', 'Teamwork', 'Punctuality'], 'Kurla Station, Mumbai', '2026-10-10 08:00:00+05:30', 25, 16, 'open'),
('dddd2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Weekend Computer Basics & English Mentors', 'Teach basic typing, scratch programming, and conversational English to class 6-8 students.', ARRAY['Basic Coding', 'English Communication', 'Teaching Patience'], 'Kengeri Community Center, Bengaluru', '2026-10-11 10:00:00+05:30', 12, 7, 'open');
