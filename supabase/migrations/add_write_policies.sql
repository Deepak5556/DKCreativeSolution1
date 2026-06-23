-- ==============================================================================
-- FIX: Add write policies for anon key on all tables
-- (Next.js API routes handle authentication — Supabase only needs to trust them)
-- Run this in Supabase Dashboard → SQL Editor
-- ==============================================================================

-- PROJECTS
CREATE POLICY "Allow anon insert on projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on projects" ON public.projects FOR DELETE USING (true);

-- VIDEOS
CREATE POLICY "Allow anon insert on videos" ON public.videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on videos" ON public.videos FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on videos" ON public.videos FOR DELETE USING (true);

-- POSTERS
CREATE POLICY "Allow anon insert on posters" ON public.posters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on posters" ON public.posters FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on posters" ON public.posters FOR DELETE USING (true);

-- SERVICES
CREATE POLICY "Allow anon insert on services" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on services" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on services" ON public.services FOR DELETE USING (true);

-- TESTIMONIALS
CREATE POLICY "Allow anon insert on testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on testimonials" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on testimonials" ON public.testimonials FOR DELETE USING (true);

-- FEATURES
CREATE POLICY "Allow anon insert on features" ON public.features FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on features" ON public.features FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on features" ON public.features FOR DELETE USING (true);

-- PROCESS STEPS
CREATE POLICY "Allow anon insert on process_steps" ON public.process_steps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on process_steps" ON public.process_steps FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on process_steps" ON public.process_steps FOR DELETE USING (true);

-- STATS
CREATE POLICY "Allow anon insert on stats" ON public.stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on stats" ON public.stats FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on stats" ON public.stats FOR DELETE USING (true);

-- QUERIES (already has public insert, add update/delete for admin)
CREATE POLICY "Allow anon update on queries" ON public.queries FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on queries" ON public.queries FOR DELETE USING (true);

-- SITE SETTINGS
CREATE POLICY "Allow anon insert on site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on site_settings" ON public.site_settings FOR DELETE USING (true);

-- BLOGS
CREATE POLICY "Allow anon insert on blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on blogs" ON public.blogs FOR DELETE USING (true);

-- SKILLS
CREATE POLICY "Allow anon insert on skills" ON public.skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on skills" ON public.skills FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on skills" ON public.skills FOR DELETE USING (true);

-- CATEGORIES
CREATE POLICY "Allow anon insert on categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on categories" ON public.categories FOR DELETE USING (true);
