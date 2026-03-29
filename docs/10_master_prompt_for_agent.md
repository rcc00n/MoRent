# Master prompt for coding agent

You are building a premium car rental website for a Russian brand called **More Rent**.

## Project context
- Brand: More Rent
- Region: Russia
- Domain: `morent82.duckdns.org`
- Server IP: `89.111.171.91`
- Stack: **Django + React + Vite + PostgreSQL**
- Main brand color: **blue**
- Style direction: premium, modern, high-trust, visually strong, with tasteful 3D effects and smooth transitions
- Need: custom cursor on desktop
- Need: excellent SEO, strong UX, mobile-friendly and desktop-friendly experience

## Business goal
The website must help users quickly choose a car and submit a rental request. The site should build trust in the first few seconds and feel like a world-class brand, not a generic template.

## Main user flow
1. User lands on the site
2. Understands what the company does, in which region, and why it is trustworthy
3. Goes to car selection/catalog
4. Opens a car page
5. Starts booking
6. Submits a short form without registration
7. Sees success message
8. Manager gets the lead and the lead is sent to GreenCRM where a Deal is created

## Important product decisions from client brief
- No personal account in MVP
- User must be able to submit request without registration
- After request submission the site does not continue order tracking for the client; the manager handles it manually
- Communication after form submission is manual
- Main forms: booking request and callback request
- Online payment can be added later via bank payment system
- Main tone: official, but the visual layer should still feel premium and impressive
- Only Russian language for MVP
- Mobile experience is critical on homepage, car selection, and booking form

## Required MVP pages
- Home page
- Cars catalog / selector
- Car details page
- Pricing page
- About page
- Contacts page
- Booking page
- FAQ page
- Privacy policy
- Payment and refund terms
- Thank you page

## Phase 2 pages
- region guide
- routes
- attractions
- offers
- reviews page
- SEO landing pages for locations and low-frequency queries
- additional equipment page

## Visual direction
Build a polished premium website with:
- strong hero section
- clean typography
- lots of space
- strong blue brand palette
- subtle glow/light effects
- tasteful 3D / depth cues
- smooth page transitions
- premium hover states
- custom cursor on desktop only

Do not make it look noisy, childish, or over-animated.

## UX rules
- make the first screen immediately clear
- repeated strong CTA buttons
- short and simple booking flow
- mobile-first thinking for core conversion screens
- every page should lead to the next action

## Booking form fields
Required fields:
- first name
- last name
- selected car
- pickup date and time
- return date and time
- pickup region/location
- return region/location
- consent to personal data processing
- consent to offer/terms

Recommended extra fields:
- phone
- email optional
- comment optional

## Backend requirements
Use Django + DRF and PostgreSQL.

Create domain-focused apps, at minimum:
- pages
- cars
- leads
- reviews
- faq
- seo
- integrations

Implement:
- cars list endpoint
- car details endpoint
- featured cars endpoint
- booking lead endpoint
- callback request endpoint
- FAQ endpoint
- pages content endpoints if needed

## Data models
At minimum create:
- Car
- CarImage
- CarFeature
- Lead
- CallbackRequest
- FAQItem
- Review
- SeoPage

## CRM integration
New leads must be sent to GreenCRM and a Deal must be created there.

Requirements:
- save lead locally first
- then send to CRM
- if CRM call fails, keep lead locally and mark sync failure
- implement logging and retry-safe service structure

## SEO requirements
Implement:
- clean semantic URLs
- meta title / description per page
- sitemap.xml
- robots.txt
- schema markup where relevant
- strong semantic HTML
- internal linking
- optimized performance

## Frontend requirements
Use React + Vite.

Build:
- reusable design system
- responsive layouts
- polished cards, forms, buttons, sections
- motion via Framer Motion and lightweight animation techniques
- custom cursor with graceful fallback
- fast loading experience

## Performance rules
- do not overload mobile with heavy animations
- lazy load non-critical media
- optimize images
- split code by route if useful
- keep core pages fast

## Deliverables expected from you
1. project structure
2. backend models
3. API routes
4. frontend page architecture
5. reusable components
6. responsive layouts
7. CRM integration layer
8. SEO implementation
9. deployment setup
10. production-ready code quality

## Output format
Work in clear stages:
1. architecture plan
2. folder structure
3. backend implementation
4. frontend implementation
5. integration implementation
6. SEO implementation
7. deployment setup
8. QA checklist

When making decisions, prefer:
- clarity over complexity
- premium look over generic design
- conversion over decorative clutter
- scalable code over hacks

