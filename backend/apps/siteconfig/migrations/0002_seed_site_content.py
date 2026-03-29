from django.conf import settings
from django.db import migrations


WIKI_BASE = "https://upload.wikimedia.org/wikipedia/commons"
MEDIA = {
    "compact_coastal": (
        f"{WIKI_BASE}/thumb/6/66/Cesme%27ye_d%C3%B6nerken_izmir_sahil_yolu_-_panoramio.jpg/"
        "1920px-Cesme%27ye_d%C3%B6nerken_izmir_sahil_yolu_-_panoramio.jpg"
    ),
    "coastal_highway": (
        f"{WIKI_BASE}/thumb/1/13/00_1833_North_West_Coastal_Highway_-_Western_Australia.jpg/"
        "1920px-00_1833_North_West_Coastal_Highway_-_Western_Australia.jpg"
    ),
    "sunset_arrival": (
        f"{WIKI_BASE}/thumb/f/f3/2017-08-20_Outside_the_Arrivals_hall_at_the_terminal%2C_Faro_airport_%282%29.JPG/"
        "1920px-2017-08-20_Outside_the_Arrivals_hall_at_the_terminal%2C_Faro_airport_%282%29.JPG"
    ),
    "mercedes_interior": (
        f"{WIKI_BASE}/thumb/f/f2/2023_Mercedes-Benz_E-Class_interior.jpg/"
        "1920px-2023_Mercedes-Benz_E-Class_interior.jpg"
    ),
    "sunset_coast": (
        f"{WIKI_BASE}/thumb/1/1e/Sunset_at_Pickering_Point_Lookout%2C_Great_Ocean_Road_%2853402059667%29.jpg/"
        "1920px-Sunset_at_Pickering_Point_Lookout%2C_Great_Ocean_Road_%2853402059667%29.jpg"
    ),
}


def join_lines(items):
    return "\n".join(items)


def seed_site_content(apps, schema_editor):
    SiteSettings = apps.get_model("siteconfig", "SiteSettings")
    HomePageContent = apps.get_model("siteconfig", "HomePageContent")
    HomeProcessItem = apps.get_model("siteconfig", "HomeProcessItem")
    HomeClosingStep = apps.get_model("siteconfig", "HomeClosingStep")
    AboutPageContent = apps.get_model("siteconfig", "AboutPageContent")
    AboutStat = apps.get_model("siteconfig", "AboutStat")
    AboutPrinciple = apps.get_model("siteconfig", "AboutPrinciple")
    ContactsPageContent = apps.get_model("siteconfig", "ContactsPageContent")
    ContactsHighlight = apps.get_model("siteconfig", "ContactsHighlight")
    ContactEntryCard = apps.get_model("siteconfig", "ContactEntryCard")
    FaqPageContent = apps.get_model("siteconfig", "FaqPageContent")
    FAQItem = apps.get_model("siteconfig", "FAQItem")
    HowItWorksPageContent = apps.get_model("siteconfig", "HowItWorksPageContent")
    HowItWorksStep = apps.get_model("siteconfig", "HowItWorksStep")
    HowItWorksHighlight = apps.get_model("siteconfig", "HowItWorksHighlight")
    LegalPageContent = apps.get_model("siteconfig", "LegalPageContent")
    LegalSection = apps.get_model("siteconfig", "LegalSection")
    ThankYouPageContent = apps.get_model("siteconfig", "ThankYouPageContent")
    ThankYouStep = apps.get_model("siteconfig", "ThankYouStep")

    site_settings, _ = SiteSettings.objects.update_or_create(
        pk=1,
        defaults={
            "brand_name": "MoRent",
            "company_name": "MoRent",
            "phone": getattr(settings, "BUSINESS_CONTACT_PHONE", ""),
            "email": getattr(settings, "BUSINESS_CONTACT_EMAIL", ""),
            "whatsapp_url": getattr(settings, "BUSINESS_CONTACT_WHATSAPP_URL", ""),
            "telegram_url": getattr(settings, "BUSINESS_CONTACT_TELEGRAM_URL", ""),
            "primary_cta_label_en": "Book now",
            "primary_cta_label_ru": "Забронировать",
            "availability_cta_label_en": "Check availability",
            "availability_cta_label_ru": "Проверить наличие",
            "contact_cta_label_en": "Contact details",
            "contact_cta_label_ru": "Контакты",
            "consultation_label_en": "Request consultation",
            "consultation_label_ru": "Запросить консультацию",
            "support_label_en": "Send support question",
            "support_label_ru": "Отправить вопрос",
            "footer_request_label_en": "Request a car",
            "footer_request_label_ru": "Оставить заявку",
            "footer_service_label_en": "Service details",
            "footer_service_label_ru": "Условия сервиса",
            "contact_availability_text_en": "Online booking request",
            "contact_availability_text_ru": "Онлайн-заявка на бронирование",
            "pickup_location_text_en": (
                "Resort, hotel, airport, and private pickup by arrangement"
            ),
            "pickup_location_text_ru": (
                "Курорт, отель, аэропорт и частная выдача по согласованию"
            ),
            "working_hours_en": "Daily, 08:00 to 22:00",
            "working_hours_ru": "Ежедневно, с 08:00 до 22:00",
            "footer_title_en": "Premium coastal car rental with visible daily rates.",
            "footer_title_ru": "Премиальная аренда авто у моря с понятными дневными тарифами.",
            "footer_text_en": (
                "Coastal service area with resort, hotel, and airport pickup by arrangement."
            ),
            "footer_text_ru": (
                "Прибрежная зона сервиса с выдачей у отеля, аэропорта и в частной точке по согласованию."
            ),
            "seo_default_title_en": "MoRent | Premium Car Rental",
            "seo_default_title_ru": "MoRent | Премиальная аренда авто",
            "seo_default_description_en": (
                "Explore premium car rental with a curated fleet, visible daily rates, and a direct booking request flow."
            ),
            "seo_default_description_ru": (
                "Откройте премиальную аренду авто с отобранным автопарком, понятными дневными тарифами и прямой заявкой на бронирование."
            ),
            "seo_organization_description_en": (
                "Premium coastal car rental with visible daily rates and direct booking requests."
            ),
            "seo_organization_description_ru": (
                "Премиальная аренда авто у моря с понятными дневными тарифами и прямыми заявками на бронирование."
            ),
        },
    )

    home_page, _ = HomePageContent.objects.update_or_create(
        pk=1,
        defaults={
            "hero_title_en": "Premium coastal car rental with visible rates and a fast booking path.",
            "hero_title_ru": "Премиальная аренда авто у моря с понятными тарифами и быстрым бронированием.",
            "hero_description_en": "Choose the car, check the day rate, and send the request before pickup.",
            "hero_description_ru": "Выберите автомобиль, посмотрите ставку за день и отправьте заявку до выдачи.",
            "signal_title_en": "A grand tourer in motion.",
            "signal_title_ru": "Гран-турер в движении.",
            "featured_title_en": "Check availability for the cars booked first.",
            "featured_title_ru": "Проверьте наличие автомобилей, которые бронируют первыми.",
            "featured_description_en": "Open any car and move straight into dates.",
            "featured_description_ru": "Откройте любой автомобиль и сразу перейдите к выбору дат.",
            "featured_more_options_en": "Need more options? Open the full fleet.",
            "featured_more_options_ru": "Нужны ещё варианты? Откройте весь автопарк.",
            "destination_title_en": "Seafront light. Calm pickup. Premium cars ready for the coast.",
            "destination_title_ru": "Мягкий свет у моря. Спокойная выдача. Премиальные авто для побережья.",
            "destination_description_en": (
                "Resort calm, direct booking, and a clean handoff from arrival to the road."
            ),
            "destination_description_ru": (
                "Курортное спокойствие, прямое бронирование и чистая выдача от приезда до дороги."
            ),
            "destination_image_url": MEDIA["compact_coastal"],
            "destination_image_alt_en": "Seafront coastal road with calm sunset light",
            "destination_image_alt_ru": "Прибрежная дорога у моря в мягком закатном свете",
            "benefits_title_en": "See the car. Trust the rate. Send the request.",
            "benefits_title_ru": "Посмотрите авто. Доверьтесь ставке. Отправьте заявку.",
            "benefits_description_en": "Exact fleet, readable day rates, direct confirmation.",
            "benefits_description_ru": "Реальный автопарк, понятные дневные тарифы, прямое подтверждение.",
            "faq_preview_title_en": "Answers before the request starts.",
            "faq_preview_title_ru": "Ответы ещё до отправки заявки.",
            "faq_preview_description_en": (
                "Clear terms, visible rates, and a short review flow keep the booking path readable."
            ),
            "faq_preview_description_ru": (
                "Понятные условия, видимые тарифы и короткий сценарий проверки делают путь к бронированию читаемым."
            ),
            "faq_preview_more_details_en": "Need the full detail set before you choose the car?",
            "faq_preview_more_details_ru": "Нужны все детали до выбора автомобиля?",
            "closing_title_en": "Choose the dates. We confirm the rest.",
            "closing_title_ru": "Выберите даты. Остальное подтвердим мы.",
            "closing_description_en": "Pick the car, choose the dates, send the request.",
            "closing_description_ru": "Выберите авто, задайте даты, отправьте заявку.",
            "seo_title_en": "MoRent | Premium Coastal Car Rental With Visible Daily Rates",
            "seo_title_ru": "MoRent | Премиальная аренда авто у моря с понятными дневными тарифами",
            "seo_description_en": (
                "Discover premium coastal car rental with visible daily rates, a curated fleet, and a fast request flow for resort, hotel, and airport pickup."
            ),
            "seo_description_ru": (
                "Откройте премиальную аренду авто у моря: видимые дневные тарифы, отобранный автопарк и быстрый путь к заявке для отеля, курорта и аэропорта."
            ),
        },
    )
    home_process_items = [
        {
            "sort_order": 10,
            "title_en": "See the car.",
            "title_ru": "Посмотрите авто.",
            "description_en": "Open the fleet and inspect the exact car first.",
            "description_ru": "Откройте автопарк и сначала изучите конкретную машину.",
            "href": "#featured-cars",
            "tone": "fleet",
        },
        {
            "sort_order": 20,
            "title_en": "Trust the rate.",
            "title_ru": "Поймите ставку.",
            "description_en": "Read the day rate before the request starts.",
            "description_ru": "Посмотрите цену за день до отправки заявки.",
            "href": "#rate-clarity",
            "tone": "pricing",
        },
        {
            "sort_order": 30,
            "title_en": "Send the request.",
            "title_ru": "Отправьте заявку.",
            "description_en": "Choose the dates and send confirmation in minutes.",
            "description_ru": "Выберите даты и получите подтверждение в течение минут.",
            "href": "#booking-path",
            "tone": "signal",
        },
    ]
    for item in home_process_items:
        HomeProcessItem.objects.update_or_create(
            home_page=home_page,
            sort_order=item["sort_order"],
            defaults={**item, "is_visible": True},
        )
    for index, step in enumerate(
        [
            ("Choose the car", "Выберите автомобиль"),
            ("Check the dates", "Проверьте даты"),
            ("Send the request", "Отправьте заявку"),
        ],
        start=1,
    ):
        HomeClosingStep.objects.update_or_create(
            home_page=home_page,
            sort_order=index * 10,
            defaults={
                "text_en": step[0],
                "text_ru": step[1],
                "is_visible": True,
            },
        )

    about_page, _ = AboutPageContent.objects.update_or_create(
        pk=1,
        defaults={
            "eyebrow_en": "About MoRent",
            "eyebrow_ru": "О MoRent",
            "title_en": "Premium coastal car rental designed to feel calm, clear, and direct.",
            "title_ru": (
                "Премиальная аренда авто у моря, построенная так, чтобы всё ощущалось спокойно, ясно и без лишнего шума."
            ),
            "description_en": (
                "MoRent is built around a short decision path: visible daily rates, a curated fleet, and direct request handling for resort arrivals, hotel delivery, and private pickup coordination."
            ),
            "description_ru": (
                "MoRent строится вокруг короткого пути к решению: видимые дневные тарифы, отобранный автопарк и прямое сопровождение заявки для курортных приездов, выдачи у отеля и частной передачи автомобиля."
            ),
            "section_title_en": "Why the service feels different",
            "section_title_ru": "Почему сервис ощущается иначе",
            "section_description_en": (
                "The business is structured around fewer cars, clearer pricing, and a manual handoff process that protects the premium experience."
            ),
            "section_description_ru": (
                "Бизнес выстроен вокруг меньшего количества автомобилей, более ясной цены и ручной передачи, которая сохраняет премиальное впечатление."
            ),
            "cta_title_en": "Ready to choose the car?",
            "cta_title_ru": "Готовы выбрать автомобиль?",
            "cta_description_en": (
                "The fleet stays concise on purpose. Open the catalog and send the request when the timing feels right."
            ),
            "cta_description_ru": (
                "Автопарк намеренно остаётся компактным. Откройте каталог и отправьте заявку, когда даты уже подходят."
            ),
            "primary_image_url": MEDIA["sunset_coast"],
            "primary_image_alt_en": "Sunset coastal road matching the MoRent premium travel mood",
            "primary_image_alt_ru": "Закатная прибрежная дорога в фирменном премиальном настроении MoRent",
            "primary_image_caption_en": "Calm travel mood, premium fleet, direct handoff",
            "primary_image_caption_ru": "Спокойное travel-настроение, премиальный парк, прямая выдача",
            "seo_title_en": "About MoRent | Premium Coastal Car Rental",
            "seo_title_ru": "О MoRent | Премиальная аренда авто у моря",
            "seo_description_en": (
                "Learn how MoRent approaches premium coastal car rental with a curated fleet, visible rates, and direct request handling."
            ),
            "seo_description_ru": (
                "Узнайте, как MoRent строит премиальную аренду авто у моря: отобранный парк, видимые тарифы и прямое сопровождение заявки."
            ),
        },
    )
    about_stats = [
        ("15 min", "15 мин", "Typical response during service hours", "Типичный ответ в часы сервиса"),
        ("Daily", "Ежедневно", "Visible rates across the active fleet", "Видимые тарифы по всему активному парку"),
        ("Premium", "Премиум", "Curated cars prepared for resort and coastal travel", "Отобранные автомобили для побережья и курортных поездок"),
    ]
    for index, item in enumerate(about_stats, start=1):
        AboutStat.objects.update_or_create(
            about_page=about_page,
            sort_order=index * 10,
            defaults={
                "value_en": item[0],
                "value_ru": item[1],
                "label_en": item[2],
                "label_ru": item[3],
                "is_visible": True,
            },
        )
    about_principles = [
        (
            "Curated fleet",
            "Отобранный автопарк",
            "The fleet stays deliberately selective so every listed car matches the premium standard shown on the site.",
            "Автопарк намеренно остаётся компактным, чтобы каждый автомобиль соответствовал уровню, который вы видите на сайте.",
        ),
        (
            "Visible daily rates",
            "Видимые дневные тарифы",
            "Pricing is shown before the request starts so the decision feels clear, not negotiated in the dark.",
            "Цена показана ещё до старта заявки, поэтому решение ощущается ясным, а не скрыто согласованным в переписке.",
        ),
        (
            "Direct coordination",
            "Прямая координация",
            "Requests are handled by a person, which keeps pickup timing, resort logistics, and return details straightforward.",
            "Заявки обрабатывает человек, поэтому время выдачи, логистика курорта и возврат согласуются проще.",
        ),
    ]
    for index, item in enumerate(about_principles, start=1):
        AboutPrinciple.objects.update_or_create(
            about_page=about_page,
            sort_order=index * 10,
            defaults={
                "title_en": item[0],
                "title_ru": item[1],
                "description_en": item[2],
                "description_ru": item[3],
                "is_visible": True,
            },
        )

    contacts_page, _ = ContactsPageContent.objects.update_or_create(
        pk=1,
        defaults={
            "eyebrow_en": "Contacts",
            "eyebrow_ru": "Контакты",
            "title_en": "Contact the team and plan the request with the right pickup context.",
            "title_ru": "Свяжитесь с командой и подготовьте заявку с правильным контекстом по выдаче.",
            "description_en": (
                "The site is the main booking channel. Once the request is in, the team follows up directly to confirm availability, pickup timing, and the handoff point."
            ),
            "description_ru": (
                "Сайт остаётся основным каналом бронирования. После отправки заявки команда связывается напрямую, чтобы подтвердить наличие, время выдачи и точку передачи."
            ),
            "summary_primary_label_en": "Primary channel",
            "summary_primary_label_ru": "Основной канал",
            "summary_hours_label_en": "Service hours",
            "summary_hours_label_ru": "Часы сервиса",
            "summary_coverage_label_en": "Coverage",
            "summary_coverage_label_ru": "Покрытие",
            "entry_section_title_en": "Choose the right entry point",
            "entry_section_title_ru": "Выберите правильную точку входа",
            "entry_section_description_en": (
                "Use the booking flow when dates are ready, or send a cleaner consultation or support request when you need guidance first."
            ),
            "entry_section_description_ru": (
                "Используйте сценарий бронирования, когда даты уже понятны, или отправьте отдельный запрос на консультацию либо поддержку, если сначала нужна помощь."
            ),
            "channels_title_en": "Direct business channels",
            "channels_title_ru": "Прямые бизнес-каналы",
            "channels_description_en": (
                "When configured, direct phone, email, and messenger links stay available alongside the booking path."
            ),
            "channels_description_ru": (
                "Когда контакты будут настроены, здесь останутся прямые ссылки на телефон, email и мессенджеры вместе с основным сценарием бронирования."
            ),
            "form_section_title_en": "Contact the team cleanly",
            "form_section_title_ru": "Связаться с командой без лишнего шума",
            "form_section_description_en": (
                "This form is for consultation and support questions. Booking requests with dates still move fastest through the fleet."
            ),
            "form_section_description_ru": (
                "Эта форма нужна для консультаций и вопросов в поддержку. Заявки с датами по-прежнему быстрее всего идут через автопарк."
            ),
            "primary_image_url": MEDIA["sunset_arrival"],
            "primary_image_alt_en": "Premium arrival forecourt for airport and hotel pickup coordination",
            "primary_image_alt_ru": "Премиальная зона прибытия для координации выдачи в аэропорту и у отеля",
            "primary_image_caption_en": "Airport and hotel pickup agreed after review",
            "primary_image_caption_ru": "Выдача в аэропорту и у отеля согласуется после проверки",
            "seo_title_en": "Contacts | Coastal Pickup and Booking Support | MoRent",
            "seo_title_ru": "Контакты | Поддержка по выдаче и бронированию | MoRent",
            "seo_description_en": (
                "Find MoRent service details, booking support information, service hours, and pickup coordination guidance for your request."
            ),
            "seo_description_ru": (
                "Найдите условия сервиса MoRent, поддержку по бронированию, часы работы и сценарии координации выдачи для вашей заявки."
            ),
        },
    )
    for index, item in enumerate(
        [
            (
                "Fastest route",
                "Самый быстрый путь",
                "The quickest way to reach the team is through a booking request from the catalog or a specific car page.",
                "Быстрее всего связаться с командой через заявку из каталога или со страницы конкретного автомобиля.",
            ),
            (
                "Service hours",
                "Часы сервиса",
                "Request review and pickup coordination are handled daily from 08:00 to 22:00 local time.",
                "Проверка заявок и координация выдачи ведутся ежедневно с 08:00 до 22:00 по местному времени.",
            ),
            (
                "Pickup planning",
                "Планирование выдачи",
                "Airport arrivals, hotel delivery, and private handoff points are arranged after availability is confirmed.",
                "Прилёт, доставка к отелю и частная точка передачи согласовываются после подтверждения наличия.",
            ),
        ],
        start=1,
    ):
        ContactsHighlight.objects.update_or_create(
            contacts_page=contacts_page,
            sort_order=index * 10,
            defaults={
                "title_en": item[0],
                "title_ru": item[1],
                "detail_en": item[2],
                "detail_ru": item[3],
                "is_visible": True,
            },
        )
    for index, item in enumerate(
        [
            (
                "booking",
                "Booking request",
                "Заявка на бронирование",
                "Choose the car, set the dates, and move straight into the booking path.",
                "Выберите автомобиль, задайте даты и сразу перейдите в сценарий бронирования.",
                "Open the fleet",
                "Открыть автопарк",
            ),
            (
                "contact_request",
                "Consultation request",
                "Запрос на консультацию",
                "Use this when you need help choosing the right car, pickup format, or service fit.",
                "Подходит, если нужно помочь с выбором автомобиля, форматом выдачи или понять, какой сценарий подходит поездке.",
                "Request consultation",
                "Запросить консультацию",
            ),
            (
                "support_request",
                "Support question",
                "Вопрос в поддержку",
                "Use this for document questions, request follow-up, or service details before confirmation.",
                "Подходит для вопросов по документам, существующей заявке или деталям сервиса до подтверждения.",
                "Send support question",
                "Отправить вопрос",
            ),
        ],
        start=1,
    ):
        ContactEntryCard.objects.update_or_create(
            contacts_page=contacts_page,
            sort_order=index * 10,
            defaults={
                "intent": item[0],
                "title_en": item[1],
                "title_ru": item[2],
                "description_en": item[3],
                "description_ru": item[4],
                "action_label_en": item[5],
                "action_label_ru": item[6],
                "is_visible": True,
            },
        )

    faq_page, _ = FaqPageContent.objects.update_or_create(
        pk=1,
        defaults={
            "eyebrow_en": "FAQ",
            "eyebrow_ru": "FAQ",
            "title_en": "Questions people ask before they send the request.",
            "title_ru": "Вопросы, которые задают до отправки заявки.",
            "description_en": (
                "This page keeps the booking path readable: how requests work, what gets confirmed first, and what to expect after submission."
            ),
            "description_ru": (
                "Эта страница делает путь к бронированию понятным: как работает заявка, что подтверждается первым и чего ожидать после отправки."
            ),
            "cta_title_en": "Ready to move from answers to availability?",
            "cta_title_ru": "Готовы перейти от ответов к наличию?",
            "cta_description_en": "Open the fleet and send the request when the car and dates look right.",
            "cta_description_ru": "Откройте автопарк и отправьте заявку, когда автомобиль и даты уже подходят.",
            "primary_image_url": MEDIA["mercedes_interior"],
            "secondary_image_url": MEDIA["compact_coastal"],
            "primary_image_alt_en": "Premium interior image supporting comfort and service clarity",
            "primary_image_alt_ru": "Премиальный интерьер, поддерживающий ощущение комфорта и ясного сервиса",
            "primary_image_caption_en": "Clear answers before the booking starts",
            "primary_image_caption_ru": "Понятные ответы ещё до начала бронирования",
            "secondary_image_alt_en": "Coastal arrival route reinforcing the premium travel context",
            "secondary_image_alt_ru": "Прибрежный маршрут прибытия, поддерживающий travel-контекст сервиса",
            "secondary_image_caption_en": "Questions answered before arrival and pickup",
            "secondary_image_caption_ru": "Ответы до приезда, выдачи и старта аренды",
            "seo_title_en": "FAQ | Premium Car Rental Questions Answered | MoRent",
            "seo_title_ru": "FAQ | Ответы на вопросы по премиальной аренде авто | MoRent",
            "seo_description_en": (
                "Read concise answers about booking, visible daily rates, confirmation timing, pickup arrangement, and required documents."
            ),
            "seo_description_ru": (
                "Прочитайте краткие ответы о бронировании, дневных тарифах, скорости подтверждения, выдаче и необходимых документах."
            ),
        },
    )
    faq_items = [
        (
            "how-do-i-book",
            "How do I book a car?",
            "Как забронировать автомобиль?",
            "Open the fleet, choose the car, select your dates, and send the request. We confirm availability directly after review.",
            "Откройте автопарк, выберите автомобиль, задайте даты и отправьте заявку. После проверки мы подтверждаем наличие напрямую.",
        ),
        (
            "are-rates-visible",
            "Are rates visible before I request?",
            "Цена видна до отправки заявки?",
            "Yes. Every listed car shows the visible daily rate before you submit anything.",
            "Да. У каждого автомобиля на сайте показана дневная ставка ещё до отправки формы.",
        ),
        (
            "how-fast-is-confirmation",
            "How fast is confirmation?",
            "Как быстро приходит подтверждение?",
            "Most requests are reviewed within about 15 minutes during service hours, with final timing depending on the car and pickup window.",
            "Большинство заявок просматривается примерно за 15 минут в часы сервиса, но точный срок зависит от автомобиля и окна выдачи.",
        ),
        (
            "what-documents-are-needed",
            "What documents are needed?",
            "Какие документы нужны?",
            "A valid driver licence and an identification document are reviewed before handoff. Final requirements are confirmed with the manager.",
            "Перед передачей автомобиля проверяются действующее водительское удостоверение и документ, удостоверяющий личность. Финальные требования подтверждает менеджер.",
        ),
        (
            "can-i-request-before-arrival",
            "Can I request a car before arrival?",
            "Можно отправить заявку до приезда?",
            "Yes. Early requests are encouraged for resort arrivals, hotel delivery, and airport pickup coordination.",
            "Да. Ранние заявки рекомендуются для курортных приездов, доставки в отель и координации выдачи в аэропорту.",
        ),
        (
            "where-is-pickup-arranged",
            "Where is pickup arranged?",
            "Где проходит выдача?",
            "Pickup is coordinated after confirmation and can be arranged around hotel arrivals, airport meet points, or another agreed handoff location.",
            "Точка выдачи согласовывается после подтверждения и может быть привязана к прилёту в отель, встрече в аэропорту или другой согласованной локации.",
        ),
        (
            "what-happens-after-submit",
            "What happens after I submit the request?",
            "Что происходит после отправки заявки?",
            "Your request is saved, reviewed by the team, and confirmed manually with the final pickup details and next steps.",
            "Заявка сохраняется, команда её просматривает и вручную подтверждает следующие шаги вместе с деталями выдачи.",
        ),
    ]
    for index, item in enumerate(faq_items, start=1):
        FAQItem.objects.update_or_create(
            faq_page=faq_page,
            anchor=item[0],
            defaults={
                "sort_order": index * 10,
                "question_en": item[1],
                "question_ru": item[2],
                "answer_en": item[3],
                "answer_ru": item[4],
                "is_visible": True,
            },
        )

    how_it_works_page, _ = HowItWorksPageContent.objects.update_or_create(
        pk=1,
        defaults={
            "eyebrow_en": "How It Works",
            "eyebrow_ru": "Как это работает",
            "title_en": "A short booking path built for premium trips, not admin.",
            "title_ru": "Короткий путь к бронированию для премиальной поездки, а не для бюрократии.",
            "description_en": (
                "MoRent keeps the process intentionally simple so the client sees the fleet, understands the rate, and reaches a confirmed handoff without extra steps."
            ),
            "description_ru": (
                "MoRent сохраняет процесс намеренно простым: клиент видит автопарк, понимает ставку и приходит к подтверждённой выдаче без лишних шагов."
            ),
            "cta_title_en": "Ready to start the request?",
            "cta_title_ru": "Готовы отправить заявку?",
            "cta_description_en": "Open the fleet and move straight into the car that fits the trip.",
            "cta_description_ru": "Откройте автопарк и сразу переходите к автомобилю, который подходит поездке.",
            "cta_faq_label_en": "Booking questions",
            "cta_faq_label_ru": "Вопросы по бронированию",
            "primary_image_url": MEDIA["coastal_highway"],
            "primary_image_alt_en": "Scenic coastal road representing the route from request to drive",
            "primary_image_alt_ru": "Живописная прибрежная дорога, отражающая путь от заявки к поездке",
            "primary_image_caption_en": "Short request path, premium drive, direct confirmation",
            "primary_image_caption_ru": "Короткий путь к заявке, премиальная поездка, прямое подтверждение",
            "seo_title_en": "How Booking Works | Fast Premium Car Request Flow | MoRent",
            "seo_title_ru": "Как работает бронирование | Быстрый путь к заявке на премиальный автомобиль | MoRent",
            "seo_description_en": (
                "See how MoRent booking requests work, from choosing the car and dates to direct confirmation and coordinated pickup."
            ),
            "seo_description_ru": (
                "Узнайте, как работает заявка в MoRent: от выбора автомобиля и дат до прямого подтверждения и согласованной выдачи."
            ),
        },
    )
    for index, item in enumerate(
        [
            (
                "Choose the car",
                "Выберите автомобиль",
                "Review the premium fleet, visible daily rates, and the exact car you want to request.",
                "Посмотрите премиальный автопарк, дневные тарифы и конкретный автомобиль, который хотите запросить.",
            ),
            (
                "Send the request",
                "Отправьте заявку",
                "Select your dates and share the contact details needed for a direct follow-up.",
                "Выберите даты и оставьте контакты, которые нужны для прямой обратной связи.",
            ),
            (
                "Receive confirmation",
                "Получите подтверждение",
                "The team checks availability, confirms the handoff plan, and closes the booking details with you directly.",
                "Команда проверяет наличие, подтверждает сценарий выдачи и закрывает детали бронирования напрямую с вами.",
            ),
        ],
        start=1,
    ):
        HowItWorksStep.objects.update_or_create(
            how_it_works_page=how_it_works_page,
            sort_order=index * 10,
            defaults={
                "title_en": item[0],
                "title_ru": item[1],
                "description_en": item[2],
                "description_ru": item[3],
                "is_visible": True,
            },
        )
    for index, item in enumerate(
        [
            (
                "Visible rates first",
                "Сначала видна ставка",
                "The daily rate is shown before the request starts, which keeps the decision clear and commercially honest.",
                "Цена за день показана до старта заявки, поэтому решение ощущается прозрачным и коммерчески честным.",
            ),
            (
                "No payment at request stage",
                "Без оплаты на этапе заявки",
                "The online request is an availability check and booking signal. Final payment handling happens only after manual confirmation.",
                "Онлайн-заявка проверяет наличие и сигнализирует о бронировании. Финальная оплата обсуждается только после ручного подтверждения.",
            ),
            (
                "Pickup arranged after review",
                "Выдача после проверки",
                "Airport arrival, hotel delivery, and private pickup details are agreed once the requested car and dates are confirmed.",
                "Прилёт, доставка в отель и частная точка передачи согласуются после подтверждения автомобиля и дат.",
            ),
        ],
        start=1,
    ):
        HowItWorksHighlight.objects.update_or_create(
            how_it_works_page=how_it_works_page,
            sort_order=index * 10,
            defaults={
                "title_en": item[0],
                "title_ru": item[1],
                "description_en": item[2],
                "description_ru": item[3],
                "is_visible": True,
            },
        )

    legal_pages = [
        (
            "terms",
            {
                "eyebrow_en": "Terms",
                "eyebrow_ru": "Условия",
                "title_en": "Rental terms and legal information for MoRent requests.",
                "title_ru": "Условия аренды и правовая информация по заявкам MoRent.",
                "description_en": (
                    "This summary explains how booking requests, pricing review, vehicle use, and booking changes are handled before a confirmed rental begins."
                ),
                "description_ru": (
                    "Это краткое описание объясняет, как обрабатываются заявки, проверка цены, использование автомобиля и изменения бронирования до начала подтверждённой аренды."
                ),
                "cta_title_en": "Need the practical side of the process?",
                "cta_title_ru": "Нужна практическая сторона процесса?",
                "cta_description_en": (
                    "The FAQ and booking flow explain what happens before handoff, while privacy handling is described separately."
                ),
                "cta_description_ru": (
                    "FAQ и сценарий бронирования объясняют, что происходит до выдачи, а работа с данными описана отдельно в политике конфиденциальности."
                ),
                "primary_image_url": MEDIA["sunset_coast"],
                "secondary_image_url": MEDIA["coastal_highway"],
                "primary_image_alt_en": "Premium coastal landscape used to frame legal and booking context",
                "primary_image_alt_ru": "Премиальный прибрежный пейзаж, задающий контекст условий и бронирования",
                "primary_image_caption_en": "Clear operating terms before confirmation",
                "primary_image_caption_ru": "Понятные рабочие условия ещё до подтверждения",
                "secondary_image_alt_en": "Coastal road matching the MoRent driving context",
                "secondary_image_alt_ru": "Прибрежная дорога, поддерживающая driving-контекст сервиса MoRent",
                "secondary_image_caption_en": "Rates, vehicle use, and timing explained clearly",
                "secondary_image_caption_ru": "Ставки, использование автомобиля и тайминг объяснены заранее",
                "seo_title_en": "Terms and Legal Information | MoRent",
                "seo_title_ru": "Условия и правовая информация | MoRent",
                "seo_description_en": (
                    "Review MoRent rental terms, booking confirmation notes, pricing guidance, vehicle use rules, and cancellation principles."
                ),
                "seo_description_ru": (
                    "Посмотрите условия аренды MoRent, детали подтверждения бронирования, принципы формирования цены, использования автомобиля и отмены."
                ),
            },
            [
                (
                    "Booking and confirmation",
                    "Бронирование и подтверждение",
                    [
                        "Submitting a request does not charge the client or guarantee the car until the team confirms availability.",
                        "MoRent may request document review or additional trip details before final confirmation.",
                        "Handoff timing and return timing are fixed during the manual confirmation step.",
                    ],
                    [
                        "Отправка заявки не означает оплату и не гарантирует автомобиль до подтверждения наличия командой.",
                        "MoRent может запросить проверку документов или дополнительные детали поездки до финального подтверждения.",
                        "Время выдачи и возврата фиксируется на этапе ручного подтверждения.",
                    ],
                ),
                (
                    "Rates and payment",
                    "Тарифы и оплата",
                    [
                        "Displayed daily rates are indicative of the standard rental price for the listed car.",
                        "Final pricing may reflect the confirmed rental period, delivery conditions, and any agreed add-ons.",
                        "Payment timing and accepted methods are confirmed directly before handoff.",
                    ],
                    [
                        "Показанные дневные тарифы отражают стандартную стоимость аренды указанного автомобиля.",
                        "Финальная цена может зависеть от подтверждённого срока аренды, условий доставки и согласованных дополнений.",
                        "Сроки оплаты и доступные способы подтверждаются напрямую перед выдачей.",
                    ],
                ),
                (
                    "Use of the vehicle",
                    "Использование автомобиля",
                    [
                        "The vehicle may only be used by the approved driver and within the agreed rental period.",
                        "The client is responsible for returning the car in the agreed condition and following local driving regulations.",
                        "Any incident, delay, or material issue must be reported as soon as possible during the rental period.",
                    ],
                    [
                        "Автомобиль может использоваться только согласованным водителем и в пределах утверждённого срока аренды.",
                        "Клиент обязан вернуть автомобиль в согласованном состоянии и соблюдать местные правила дорожного движения.",
                        "О любом инциденте, задержке или существенной проблеме необходимо сообщить как можно раньше в период аренды.",
                    ],
                ),
                (
                    "Changes and cancellations",
                    "Изменения и отмены",
                    [
                        "Pickup changes should be requested as early as possible so the team can re-check the schedule.",
                        "If the requested car becomes unavailable, MoRent may offer an alternative vehicle or timing.",
                        "Cancellation handling is confirmed case by case according to the agreed booking terms.",
                    ],
                    [
                        "Изменения по выдаче стоит запрашивать как можно раньше, чтобы команда могла заново проверить график.",
                        "Если выбранный автомобиль становится недоступен, MoRent может предложить альтернативу по машине или времени.",
                        "Порядок отмены подтверждается индивидуально в рамках согласованных условий бронирования.",
                    ],
                ),
            ],
        ),
        (
            "privacy",
            {
                "eyebrow_en": "Privacy",
                "eyebrow_ru": "Конфиденциальность",
                "title_en": "Privacy policy for booking requests and service follow-up.",
                "title_ru": "Политика конфиденциальности для заявок на бронирование и операционного сопровождения.",
                "description_en": (
                    "MoRent keeps personal data collection focused on what is needed to review availability, confirm the request, and manage future operational workflows."
                ),
                "description_ru": (
                    "MoRent собирает только те персональные данные, которые нужны для проверки наличия, подтверждения заявки и управления операционными процессами."
                ),
                "cta_title_en": "Continue with the booking path",
                "cta_title_ru": "Продолжить путь к бронированию",
                "cta_description_en": (
                    "When you are ready, open the fleet and send the request with the dates you want reviewed."
                ),
                "cta_description_ru": (
                    "Когда будете готовы, откройте автопарк и отправьте заявку с датами, которые хотите согласовать."
                ),
                "primary_image_url": MEDIA["mercedes_interior"],
                "secondary_image_url": MEDIA["sunset_arrival"],
                "primary_image_alt_en": "Premium car interior supporting privacy and request-handling context",
                "primary_image_alt_ru": "Премиальный салон, поддерживающий контекст конфиденциальности и обработки заявок",
                "primary_image_caption_en": "Only the details needed to review the request",
                "primary_image_caption_ru": "Мы берём только те данные, которые нужны для проверки заявки",
                "secondary_image_alt_en": "Arrival setting linked to service follow-up and request handling",
                "secondary_image_alt_ru": "Зона прибытия, связанная с операционным сопровождением клиента",
                "secondary_image_caption_en": "Operational follow-up stays tied to the booking journey",
                "secondary_image_caption_ru": "Операционное сопровождение остаётся привязанным к пути бронирования",
                "seo_title_en": "Privacy Policy | Booking Request Data Handling | MoRent",
                "seo_title_ru": "Политика конфиденциальности | Обработка данных заявки | MoRent",
                "seo_description_en": (
                    "Understand how MoRent handles booking request data, service follow-up, and operational information used for enquiries."
                ),
                "seo_description_ru": (
                    "Поймите, как MoRent обрабатывает данные заявки на бронирование, операционное сопровождение и связанную служебную информацию."
                ),
            },
            [
                (
                    "What we collect",
                    "Что мы собираем",
                    [
                        "Name, phone number, requested car, and requested rental dates submitted through the booking form.",
                        "Technical request context needed to understand which page or vehicle generated the enquiry.",
                    ],
                    [
                        "Имя, номер телефона, выбранный автомобиль и даты аренды, отправленные через форму бронирования.",
                        "Технический контекст заявки, необходимый для понимания страницы или автомобиля, с которого пришёл запрос.",
                    ],
                ),
                (
                    "Why we collect it",
                    "Зачем мы это собираем",
                    [
                        "To review availability, contact the client, and coordinate pickup or return details.",
                        "To improve response workflows, page attribution, and future CRM integration.",
                    ],
                    [
                        "Чтобы проверить наличие, связаться с клиентом и согласовать детали выдачи и возврата.",
                        "Чтобы улучшать сценарии ответа, атрибуцию страниц и будущую интеграцию с CRM.",
                    ],
                ),
                (
                    "How it is handled",
                    "Как данные обрабатываются",
                    [
                        "Booking requests are stored on the service backend and reviewed by the operating team.",
                        "Data is only used for request handling, operational follow-up, and related business processing.",
                        "Reasonable security measures are applied to protect stored booking data.",
                    ],
                    [
                        "Заявки на бронирование сохраняются на сервере сервиса и просматриваются операционной командой.",
                        "Данные используются только для обработки заявки, операционного сопровождения и связанных бизнес-процессов.",
                        "Для защиты сохранённых данных применяются разумные меры безопасности.",
                    ],
                ),
                (
                    "Retention and requests",
                    "Срок хранения и запросы",
                    [
                        "Data is retained for operational, legal, and service follow-up purposes only as long as necessary.",
                        "Clients may request clarification or deletion review by contacting the business through the site workflow.",
                    ],
                    [
                        "Данные хранятся только столько, сколько необходимо для операционных, юридических и сервисных задач.",
                        "Клиент может запросить разъяснение или проверку удаления через рабочий процесс сайта.",
                    ],
                ),
            ],
        ),
    ]
    for page_key, page_defaults, sections in legal_pages:
        legal_page, _ = LegalPageContent.objects.update_or_create(
            page_key=page_key,
            defaults=page_defaults,
        )
        for index, section in enumerate(sections, start=1):
            LegalSection.objects.update_or_create(
                legal_page=legal_page,
                sort_order=index * 10,
                defaults={
                    "title_en": section[0],
                    "title_ru": section[1],
                    "items_en": join_lines(section[2]),
                    "items_ru": join_lines(section[3]),
                    "is_visible": True,
                },
            )

    thank_you_page, _ = ThankYouPageContent.objects.update_or_create(
        pk=1,
        defaults={
            "eyebrow_en": "Request received",
            "eyebrow_ru": "Заявка получена",
            "title_en": "Your request is in. We will review the availability next.",
            "title_ru": "Ваша заявка принята. Теперь мы проверим наличие.",
            "description_with_car_en": "{{carName}} has been added to the request queue.",
            "description_with_car_ru": "{{carName}} добавлен в очередь на обработку.",
            "description_without_car_en": "The booking request has been saved and sent to the team for review.",
            "description_without_car_ru": "Заявка на бронирование сохранена и отправлена команде на проверку.",
            "description_end_en": "No payment is taken at this stage.",
            "description_end_ru": "На этом этапе оплата не взимается.",
            "dates_start_label_en": "Requested start",
            "dates_start_label_ru": "Запрошенное начало",
            "dates_end_label_en": "Requested end",
            "dates_end_label_ru": "Запрошенное окончание",
            "primary_action_label_en": "Back to the fleet",
            "primary_action_label_ru": "Назад к автопарку",
            "secondary_action_label_en": "Return home",
            "secondary_action_label_ru": "На главную",
            "primary_image_url": MEDIA["sunset_arrival"],
            "secondary_image_url": MEDIA["sunset_coast"],
            "primary_image_alt_en": "Arrival forecourt visual reinforcing the booking confirmation mood",
            "primary_image_alt_ru": "Зона прибытия, поддерживающая настроение подтверждения бронирования",
            "primary_image_caption_en": "The team reviews timing, car, and pickup context next",
            "primary_image_caption_ru": "Дальше команда проверит автомобиль, тайминг и контекст выдачи",
            "secondary_image_alt_en": "Calm coastal road representing the next step after confirmation",
            "secondary_image_alt_ru": "Спокойная прибрежная дорога, отражающая следующий этап после подтверждения",
            "secondary_image_caption_en": "Once confirmed, the trip moves from request to handoff",
            "secondary_image_caption_ru": "После подтверждения путь переходит от заявки к передаче автомобиля",
            "seo_title_en": "Request Received | MoRent",
            "seo_title_ru": "Заявка получена | MoRent",
            "seo_description_en": "Your booking request has been received and is being reviewed by the MoRent team.",
            "seo_description_ru": "Ваша заявка на бронирование получена и уже проверяется командой MoRent.",
        },
    )
    for index, item in enumerate(
        [
            (
                "1. Review",
                "1. Проверка",
                "The team checks the car, timing, and pickup context.",
                "Команда проверяет автомобиль, тайминг и контекст выдачи.",
            ),
            (
                "2. Confirmation",
                "2. Подтверждение",
                "You receive the next-step message with the final handoff plan.",
                "Вы получаете следующее сообщение с финальным планом передачи автомобиля.",
            ),
        ],
        start=1,
    ):
        ThankYouStep.objects.update_or_create(
            thank_you_page=thank_you_page,
            sort_order=index * 10,
            defaults={
                "title_en": item[0],
                "title_ru": item[1],
                "description_en": item[2],
                "description_ru": item[3],
                "is_visible": True,
            },
        )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("siteconfig", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_site_content, noop),
    ]
