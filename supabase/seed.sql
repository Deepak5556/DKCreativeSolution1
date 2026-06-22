-- Supabase Seed Data

INSERT INTO public.projects (category, title, description, tech, live_url, github_url, accent, icon, thumbnail_url, order_idx) VALUES
('Web Development', 'Cognito Learning Platform', 'A full-stack e-learning platform with course tracking, quizzes, and a progress dashboard for students and instructors.', '{"Next.js","TypeScript","PostgreSQL","Tailwind CSS"}', '#', '#', 'gold', 'GraduationCap', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop', 0),
('Web Development', 'BloodHub', 'A blood donation network connecting donors with nearby requests in real time, with location-based matching.', '{"React","Node.js","MongoDB","Socket.io"}', '#', '#', 'silver', 'Droplets', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop', 1),
('Web Development', 'Portfolio Website', 'A motion-driven personal portfolio template with case-study pages, dark mode, and buttery-smooth scroll animation.', '{"Next.js","Framer Motion","Tailwind CSS"}', '#', '#', 'gold', 'UserSquare2', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop', 2),
('Web Development', 'Event Management System', 'An end-to-end platform for creating events, selling tickets, and managing attendee check-in with QR codes.', '{"Next.js","Prisma","Stripe","PostgreSQL"}', '#', '#', 'silver', 'CalendarRange', 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop', 3),
('Mobile Apps', 'SnapLearn', 'A flashcard-based micro-learning app that turns photos of notes into spaced-repetition study decks.', '{"React Native","Expo","Firebase"}', '#', '#', 'gold', 'Sparkles', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop', 4),
('Mobile Apps', 'Weather App', 'A minimal, animated weather app with hyper-local forecasts, severe-weather alerts, and home-screen widgets.', '{"React Native","TypeScript","OpenWeather API"}', '#', '#', 'silver', 'CloudSun', 'https://images.unsplash.com/photo-1530908268418-e1d834b67885?q=80&w=600&auto=format&fit=crop', 5),
('Both', 'PFX Gym Event Registration Website and App', 'This is for Booking Gym Event and Monitoring', '{"Flutter","Reactjs"}', '', '', 'gold', 'GraduationCap', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 6);

INSERT INTO public.videos (title, category, duration, type, video_url, thumbnail_url, order_idx) VALUES
('Brand Launch Reel', 'Reel Preview', '0:32', 'reel', 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-3831-large.mp4', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', 0),
('Product Showcase Reel', 'Reel Preview', '0:28', 'reel', 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-keyboard-4054-large.mp4', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', 1),
('Cinematic Color Grade', 'Before / After', '0:15', 'before-after', 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-woman-walking-slowly-in-a-forest-41913-large.mp4', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop', 2),
('Audio & Pacing Cleanup', 'Before / After', '0:20', 'before-after', 'https://assets.mixkit.co/videos/preview/mixkit-dj-adjusting-sound-on-audio-mixer-41611-large.mp4', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop', 3),
('Tech Tips Short', 'YouTube Shorts', '0:45', 'short', 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-cafe-41712-large.mp4', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop', 4),
('Behind the Scenes Short', 'YouTube Shorts', '0:38', 'short', 'https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-photos-at-a-studio-41604-large.mp4', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop', 5),
('Logo Reveal Animation', 'Motion Graphics', '0:10', 'motion-graphics', 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-glowing-neon-tunnel-41703-large.mp4', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', 6),
('Kinetic Typography Promo', 'Motion Graphics', '0:18', 'motion-graphics', 'https://assets.mixkit.co/videos/preview/mixkit-typing-text-on-a-computer-screen-41709-large.mp4', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop', 7),
('SK Smortomation Reels', 'Reel Preview', '0:30', 'reel', '/uploads/1782138805387-day2.mp4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO_cuczQUyhdqenySpcvdDDzRhfutCT6djIYfn7WJ32w&s=10', 8);

INSERT INTO public.posters (title, category, aspect, palette, image_url, order_idx) VALUES
('Festive Sale Carousel', 'Instagram Posters', 'square', 'gold', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop', 0),
('Minimal Quote Post', 'Instagram Posters', 'square', 'silver', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop', 1),
('Product Drop Teaser', 'Instagram Posters', 'story', 'mixed', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop', 2),
('Brand Anniversary Post', 'Instagram Posters', 'square', 'gold', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop', 3),
('Music Night Poster', 'Event Posters', 'portrait', 'mixed', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', 4),
('Tech Meetup Poster', 'Event Posters', 'portrait', 'gold', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', 5),
('Wedding Invite Poster', 'Event Posters', 'portrait', 'silver', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop', 6),
('Flash Sale Banner', 'Promotional Posters', 'square', 'gold', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop', 7),
('App Launch Promo', 'Promotional Posters', 'story', 'mixed', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', 8),
('Festival Offer Poster', 'Promotional Posters', 'square', 'gold', 'https://images.unsplash.com/photo-1512813583145-ac554ac61090?q=80&w=600&auto=format&fit=crop', 9),
('Corporate Profile Card', 'Business Posters', 'square', 'silver', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', 10),
('Service Rate Card', 'Business Posters', 'portrait', 'silver', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop', 11),
('Hiring Announcement', 'Business Posters', 'square', 'mixed', 'https://images.unsplash.com/photo-1521791136368-1a851900d141?q=80&w=600&auto=format&fit=crop', 12),
('Workshop Poster', 'Event Posters', 'portrait', 'gold', 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop', 13),
('Testimonial Highlight', 'Instagram Posters', 'square', 'mixed', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop', 14),
('Black Friday Poster', 'Promotional Posters', 'square', 'silver', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop', 15);

INSERT INTO public.services (title, description, features, action_type, external_link, icon, order_idx) VALUES
('Web Development', 'Fast, scalable websites built on modern frameworks — engineered for performance, accessibility, and growth.', '{"Next.js & React","API integrations","CMS-driven content"}', 'popup', NULL, 'CodeXml', 0),
('Video Editing', 'Cinematic edits, motion graphics, and short-form content that hold attention and drive engagement.', '{"Reels & Shorts","Color grading","Motion graphics"}', 'popup', NULL, 'Film', 1),
('Poster Design', 'Bold visual identity pieces for campaigns, events, and promotions — designed to stop the scroll.', '{"Social campaigns","Print-ready files","Brand-consistent"}', 'popup', NULL, 'Image', 2),
('UI/UX Design', 'Interfaces that feel effortless. Research-backed design systems built for clarity and conversion.', '{"Wireframes & prototypes","Design systems","Usability testing"}', 'popup', NULL, 'Palette', 3),
('SEO Optimization', 'Technical SEO, structured data, and performance tuning that get your site found and keep it fast.', '{"Core Web Vitals","Schema markup","On-page SEO"}', 'popup', NULL, 'Rocket', 4),
('Portfolio Websites', 'Personal and studio portfolios that present your best work with the polish of a flagship product.', '{"Case-study layouts","Custom animation","One-page or multi-page"}', 'popup', NULL, 'LayoutTemplate', 5);

INSERT INTO public.testimonials (name, role, company, quote, rating, initials, order_idx) VALUES
('Ananya Rao', 'Founder', 'Lumen Studio', 'DK rebuilt our website from the ground up and the difference was night and day. The animations feel expensive without ever feeling slow.', 5, 'AR', 0),
('Karthik Subramaniam', 'Marketing Lead', 'Northfield Foods', 'Our Instagram posters finally look like they belong to a brand twice our size. Turnaround was fast and revisions were painless.', 5, 'KS', 1),
('Priya Menon', 'Co-founder', 'Cognito Labs', 'The learning platform DK built handles thousands of students without breaking a sweat. Communication throughout was excellent.', 5, 'PM', 2),
('Rohan Das', 'Event Director', 'Eventura', 'From concept to final cut, the video edits captured exactly the energy we wanted. Our shorts now consistently outperform past content.', 5, 'RD', 3),
('Sneha Iyer', 'Product Manager', 'Sparkline App', 'Clean UI, thoughtful UX, and genuinely fast delivery. DK asked the right questions before writing a single line of code.', 5, 'SI', 4);

INSERT INTO public.features (title, description, icon, order_idx) VALUES
('Fast Delivery', 'Clear timelines and milestone check-ins so your project ships on schedule, every time.', 'Zap', 0),
('Premium Quality', 'Every pixel, transition, and line of code is reviewed against an enterprise-grade quality bar.', 'Gem', 1),
('Responsive Support', 'Direct access during and after delivery — questions and revisions get same-day responses.', 'Headset', 2),
('Modern Technologies', 'Built on Next.js, TypeScript, and current best practices — future-proof from day one.', 'Cpu', 3),
('Affordable Pricing', 'Transparent, project-based quotes with no hidden costs — premium work without agency overhead.', 'Wallet', 4),
('Creative Designs', 'Distinctive visual direction tailored to your brand, never a recycled template.', 'Brush', 5);

INSERT INTO public.process_steps (step, title, description, icon, order_idx) VALUES
('01', 'Requirement Discussion', 'We start with a focused call to understand your goals, audience, and the outcome you''re hiring for.', 'MessageCircle', 0),
('02', 'Planning & Design', 'Wireframes, mood boards, and a clear scope are mapped out before a single line of code is written.', 'PencilRuler', 1),
('03', 'Development & Editing', 'Your site, video, or design is built in focused sprints, with progress shared at every milestone.', 'CodeXml', 2),
('04', 'Testing & Revisions', 'Cross-device QA, performance checks, and revision rounds make sure everything holds up in the real world.', 'TestTubeDiagonal', 3),
('05', 'Final Delivery', 'You receive the finished, production-ready files along with deployment support and documentation.', 'PackageCheck', 4);

INSERT INTO public.stats (value, suffix, label, order_idx) VALUES
(50, '+', 'Projects Delivered', 0),
(20, '+', 'Happy Clients', 1),
(3, '+', 'Core Services', 2),
(100, '%', 'Client Satisfaction', 3);

