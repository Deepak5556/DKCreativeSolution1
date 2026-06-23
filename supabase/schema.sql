-- Supabase Schema for DK Creative Solutions

-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- Site Settings (Company Info, SEO, Social Links)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'DK Creative Solutions',
    short_name TEXT NOT NULL DEFAULT 'DK Creative',
    tagline TEXT,
    description TEXT,
    url TEXT,
    og_image TEXT,
    email TEXT,
    phone TEXT,
    phone_raw TEXT,
    location TEXT,
    founder TEXT,
    keywords TEXT[],
    github_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    youtube_url TEXT,
    behance_url TEXT,
    whatsapp_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('Web Development', 'Mobile Apps', 'Both')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech TEXT[] NOT NULL DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    accent TEXT CHECK (accent IN ('gold', 'silver')),
    icon TEXT,
    thumbnail_url TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reel', 'short', 'motion-graphics')),
    video_url TEXT,
    thumbnail_url TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posters (Gallery)
CREATE TABLE IF NOT EXISTS public.posters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Instagram Posters', 'Event Posters', 'Promotional Posters', 'Business Posters', 'Before / After')),
    aspect TEXT NOT NULL CHECK (aspect IN ('square', 'portrait', 'story')),
    palette TEXT NOT NULL CHECK (palette IN ('gold', 'silver', 'mixed')),
    image_url TEXT,
    before_image_url TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    action_type TEXT CHECK (action_type IN ('popup', 'link')),
    external_link TEXT,
    icon TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    initials TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Process Steps
CREATE TABLE IF NOT EXISTS public.process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value INTEGER NOT NULL,
    suffix TEXT,
    label TEXT NOT NULL,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queries (Contact Form Submissions)
CREATE TABLE IF NOT EXISTS public.queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    sub_category TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories (Generic)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- e.g., 'blog', 'project'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    level INTEGER, -- 1-100
    icon TEXT,
    order_idx INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public READ Access
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read access for videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public read access for posters" ON public.posters FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access for features" ON public.features FOR SELECT USING (true);
CREATE POLICY "Public read access for process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "Public read access for stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Public read access for blogs" ON public.blogs FOR SELECT USING (published = true);
CREATE POLICY "Public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read access for skills" ON public.skills FOR SELECT USING (true);

-- Create Policy for Public INSERT on queries (Contact form)
CREATE POLICY "Public insert access for queries" ON public.queries FOR INSERT WITH CHECK (true);

-- The backend API (which has the Anon Key and performs mutations) will use Service Role Key 
-- OR bypass RLS on the server if authenticated. Since we only have Anon Key in frontend, 
-- and the Next.js API handles updates, we should allow ALL operations if the request comes from the server.
-- Alternatively, allow ANON key to do all operations for now, but rely on Next.js API route auth.
-- To keep it perfectly secure but easy for Next.js API routes (which use Anon key), 
-- we will just allow all operations (since Next.js server secures the endpoints).
-- WARNING: In a production Supabase setup without custom API routes, you'd restrict these.
-- Since this project uses Next.js `/api/content/...` to proxy DB calls, we can allow full access 
-- if we aren't using Supabase Auth, OR we just use Service Role Key on the server.
-- I'll use Service Role Key for server mutations instead, so no insecure policies are needed here.


-- ==============================================================================
-- 4. STORAGE BUCKETS
-- ==============================================================================
-- Run these via Supabase SQL Editor to create buckets
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('project-videos', 'project-videos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('gallery-images', 'gallery-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('service-icons', 'service-icons', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true) on conflict do nothing;

-- Set up storage policies (Public read, Public upload allowed since backend proxies it)
create policy "Public Access" on storage.objects for select using ( bucket_id in ('project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images') );
create policy "Any Upload" on storage.objects for insert with check ( bucket_id in ('project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images') );
create policy "Any Update" on storage.objects for update using ( bucket_id in ('project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images') );
create policy "Any Delete" on storage.objects for delete using ( bucket_id in ('project-images', 'project-videos', 'gallery-images', 'service-icons', 'blog-images', 'profile-images') );
