# More Rent — frontend implementation guide

## 1. Frontend goals
Frontend должен выглядеть дорого, работать быстро и вести пользователя к заявке без путаницы.

## 2. Core pages to build first
1. Home
2. Cars listing
3. Car details
4. Booking
5. Pricing
6. About
7. Contacts
8. FAQ
9. Legal pages
10. Thanks page

## 3. UI system
Собрать собственный small design system:
- buttons
- inputs
- selects
- chips
- cards
- section containers
- headings
- badges
- modal / drawer
- accordion
- gallery

## 4. Home page sections
- Hero
- advantages
- featured cars
- how it works
- pricing preview
- trust section
- reviews
- FAQ preview
- CTA footer block

## 5. Catalog page
- top intro block
- filter bar
- result count
- responsive car grid
- pagination/load more
- sticky CTA on mobile optional

## 6. Car page
- media gallery
- summary panel
- price block
- specifications
- rental conditions
- order CTA
- similar cars

## 7. Booking UX
Форма должна быть короткой и спокойной.

### Rules
- no huge wall of fields
- inline validation
- masked phone input
- car can be prefilled from selected car page
- success state must be clear
- error state must be human-readable

## 8. Motion implementation
Priority list:
1. page transition fade/slide
2. hero reveal animation
3. hover animation for cards
4. smooth filter opening
5. CTA microinteractions
6. custom cursor

All motion must degrade gracefully.

## 9. Performance requirements for frontend
- Lighthouse-friendly implementation
- lazy load below-the-fold media
- avoid huge JS bundles
- tree-shake icon libraries
- heavy motion only when in viewport

## 10. Accessibility baseline
- keyboard navigation
- visible focus states
- enough contrast
- aria labels where needed
- forms readable by screen readers
- custom cursor disabled where inappropriate

