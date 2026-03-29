# More Rent — fast execution plan

## Phase 0 — prep
### Goal
Подготовить фундамент без хаоса.

### Tasks
- зафиксировать scope MVP
- подготовить repo structure
- описать env variables
- описать design direction
- утвердить page list

## Phase 1 — design foundation
### Goal
Собрать основу визуала и UX.

### Tasks
- design tokens
- typography
- buttons/inputs/cards
- layout grid
- motion rules
- custom cursor behavior
- mobile patterns

### Result
UI kit + page wireframes / section map

## Phase 2 — backend foundation
### Goal
Поднять базовый Django backend.

### Tasks
- project setup
- PostgreSQL connection
- apps structure
- models for cars, leads, faq, reviews, seo
- Django admin
- DRF setup
- API skeleton

### Result
Рабочий backend с CRUD и admin

## Phase 3 — frontend foundation
### Goal
Поднять React/Vite frontend и собрать каркас.

### Tasks
- router
- global layout
- API client
- design system components
- home page shell
- catalog shell
- car page shell

### Result
Frontend skeleton with reusable UI

## Phase 4 — lead capture
### Goal
Сделать главный бизнес-функционал: заявку.

### Tasks
- booking page
- form validation
- success page
- backend endpoint
- save in DB
- GreenCRM integration

### Result
Заявки реально проходят end-to-end

## Phase 5 — premium finish
### Goal
Добавить уровень бренда.

### Tasks
- hero motion
- page transitions
- card hover animations
- custom cursor
- trust blocks polish
- responsive refinements

### Result
Сайт выглядит сильно, а не просто «собран»

## Phase 6 — SEO and launch
### Goal
Подготовить сайт к индексации и запуску.

### Tasks
- metadata
- sitemap
- robots
- structured data
- legal pages
- performance pass
- deployment
- final QA

### Result
Launch-ready MVP

## Suggested build order by screens
1. Главная
2. Каталог
3. Карточка авто
4. Booking
5. Thank you page
6. Тарифы
7. О компании
8. Контакты
9. FAQ
10. Legal

## Hard priorities
- форма заявки
- каталог и карточка авто
- мобильный UX
- доверие на первом экране
- интеграция с GreenCRM

## What not to overbuild at start
- личный кабинет
- сложные анимации на каждой секции
- огромная CMS-логика
- too many filters
- продвинутые личные сценарии

