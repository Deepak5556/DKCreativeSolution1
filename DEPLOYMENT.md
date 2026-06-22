# Deployment Guide — Vercel

Vercel is built by the Next.js team and is the recommended host for this
project — zero config, automatic HTTPS, and native support for
`next/image`, `next/font`, and `next/og` (used for the favicon and
OpenGraph image).

## Option A — Deploy via the Vercel Dashboard (no CLI required)

1. Push this project to a GitHub, GitLab, or Bitbucket repository.
   ```bash
   git init
   git add .
   git commit -m "Initial commit — DK Creative Solutions"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the
   repository.
3. Vercel auto-detects Next.js — leave the build settings as default:
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Add environment variables (**Settings → Environment Variables**):
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | from your EmailJS dashboard |
   | `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | from your EmailJS dashboard |
   | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | from your EmailJS dashboard |
5. Click **Deploy**. Your site will be live at `your-project.vercel.app`
   within a couple of minutes.

## Option B — Deploy via the Vercel CLI

```bash
npm install -g vercel
vercel login
vercel            # first deploy — follow the prompts
vercel --prod      # promote to production
```

The CLI will prompt you to link/create a project and will pick up
`.env.local` automatically for **local** dev only — remember to add the
same three EmailJS variables in the Vercel dashboard (or via
`vercel env add`) for the deployed environment.

## Connecting a Custom Domain

1. In the Vercel project, go to **Settings → Domains** and add your
   domain (e.g. `dkcreativesolutions.com`).
2. Point your domain's DNS to Vercel as instructed (either an `A` record
   to Vercel's IP, or a `CNAME` for a subdomain).
3. Once verified, update `siteConfig.url` in `lib/constants.ts` to your
   real domain — this value drives canonical URLs, the sitemap,
   OpenGraph tags, and JSON-LD, so it should always match production.

## Post-Deployment Checklist

- [ ] Update `siteConfig` in `lib/constants.ts` with your real domain,
      email, phone, and social links.
- [ ] Add real EmailJS environment variables in Vercel.
- [ ] Replace `public/logo.svg` / `components/shared/Logo.tsx` with your
      final logo, if different from the generated monogram.
- [ ] Swap `ArtworkTile` placeholders for real project screenshots, poster
      designs, and video thumbnails (see README → "Replacing Placeholder
      Visuals").
- [ ] Visit `/sitemap.xml` and `/robots.txt` on the deployed URL to confirm
      they resolve correctly.
- [ ] Run a Lighthouse audit (Chrome DevTools → Lighthouse) against the
      production URL to confirm performance/SEO/accessibility scores.
- [ ] Submit the sitemap to Google Search Console.

## Other Hosting Options

This is a standard Next.js App Router project, so it can also be deployed
to Netlify, AWS Amplify, Railway, or any Node.js host that supports Next.js
(or via `next build && next start` behind your own reverse proxy/Docker
container). Vercel is recommended for the smoothest zero-config experience
with this stack's image/font/OG-image features.
