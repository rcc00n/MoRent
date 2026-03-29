from django.db import models


class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)


class OrderedVisibleModel(models.Model):
    sort_order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display order",
        help_text="Lower numbers appear first on the public site.",
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name="Visible on site",
        help_text="Turn this off to hide the item without deleting it.",
    )

    class Meta:
        abstract = True
        ordering = ("sort_order", "id")


class SeoFieldsMixin(models.Model):
    seo_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="SEO title (English)",
        help_text="Optional page title for search engines. Leave blank to reuse the page title.",
    )
    seo_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="SEO title (Russian)",
        help_text="Optional page title for search engines. Leave blank to reuse the page title.",
    )
    seo_description_en = models.TextField(
        blank=True,
        verbose_name="SEO description (English)",
        help_text="Optional page description for search engines. Leave blank to reuse the page summary.",
    )
    seo_description_ru = models.TextField(
        blank=True,
        verbose_name="SEO description (Russian)",
        help_text="Optional page description for search engines. Leave blank to reuse the page summary.",
    )

    class Meta:
        abstract = True


class VisualContentMixin(models.Model):
    primary_image_file = models.ImageField(
        upload_to="site-content/",
        blank=True,
        verbose_name="Primary image upload",
        help_text="Upload the main image shown on the page.",
    )
    primary_image_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Primary image URL",
        help_text="Optional external image URL used when no upload is provided.",
    )
    primary_image_alt_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Primary image alt text (English)",
    )
    primary_image_alt_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Primary image alt text (Russian)",
    )
    primary_image_caption_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Primary image caption (English)",
    )
    primary_image_caption_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Primary image caption (Russian)",
    )
    secondary_image_file = models.ImageField(
        upload_to="site-content/",
        blank=True,
        verbose_name="Secondary image upload",
        help_text="Optional second image used on pages with a stacked visual.",
    )
    secondary_image_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Secondary image URL",
        help_text="Optional external image URL used when no upload is provided.",
    )
    secondary_image_alt_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Secondary image alt text (English)",
    )
    secondary_image_alt_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Secondary image alt text (Russian)",
    )
    secondary_image_caption_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Secondary image caption (English)",
    )
    secondary_image_caption_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Secondary image caption (Russian)",
    )

    class Meta:
        abstract = True


class SiteSettings(SingletonModel):
    brand_name = models.CharField(
        max_length=100,
        default="MoRent",
        verbose_name="Brand name",
        help_text="Shown in the navbar, footer, and public brand references.",
    )
    company_name = models.CharField(
        max_length=255,
        default="MoRent",
        verbose_name="Company / legal name",
        help_text="Use the full company name for legal and contact references.",
    )
    phone = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Phone",
        help_text="Primary business phone number used across the site.",
    )
    email = models.EmailField(
        blank=True,
        verbose_name="Email",
        help_text="Primary public contact email address.",
    )
    whatsapp_url = models.URLField(
        blank=True,
        verbose_name="WhatsApp link",
        help_text="Paste the direct WhatsApp URL, for example https://wa.me/79991234567.",
    )
    telegram_url = models.URLField(
        blank=True,
        verbose_name="Telegram link",
        help_text="Paste the direct Telegram link, for example https://t.me/morent.",
    )
    instagram_url = models.URLField(
        blank=True,
        verbose_name="Instagram link",
    )
    facebook_url = models.URLField(
        blank=True,
        verbose_name="Facebook link",
    )
    primary_cta_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Primary CTA label (English)",
        help_text="Used for the main booking action across the site.",
    )
    primary_cta_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Primary CTA label (Russian)",
    )
    availability_cta_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Availability CTA label (English)",
        help_text="Used for actions like checking availability or jumping to featured cars.",
    )
    availability_cta_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Availability CTA label (Russian)",
    )
    contact_cta_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Contact CTA label (English)",
    )
    contact_cta_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Contact CTA label (Russian)",
    )
    consultation_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Consultation label (English)",
    )
    consultation_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Consultation label (Russian)",
    )
    support_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Support label (English)",
    )
    support_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Support label (Russian)",
    )
    footer_request_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Footer request label (English)",
    )
    footer_request_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Footer request label (Russian)",
    )
    footer_service_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Footer service label (English)",
    )
    footer_service_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Footer service label (Russian)",
    )
    contact_availability_text_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Contact availability text (English)",
        help_text="Shown on the Contacts page to explain the main response path.",
    )
    contact_availability_text_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Contact availability text (Russian)",
    )
    pickup_location_text_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Pickup / service coverage text (English)",
        help_text="Shown anywhere the pickup area or service coverage is mentioned.",
    )
    pickup_location_text_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Pickup / service coverage text (Russian)",
    )
    working_hours_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Working hours (English)",
    )
    working_hours_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Working hours (Russian)",
    )
    footer_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Footer title (English)",
        help_text="Short footer support or positioning text shown near the brand.",
    )
    footer_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Footer title (Russian)",
    )
    footer_text_en = models.TextField(
        blank=True,
        verbose_name="Footer text (English)",
        help_text="Short footer context text about service area or operating model.",
    )
    footer_text_ru = models.TextField(
        blank=True,
        verbose_name="Footer text (Russian)",
    )
    seo_default_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Default SEO title (English)",
    )
    seo_default_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Default SEO title (Russian)",
    )
    seo_default_description_en = models.TextField(
        blank=True,
        verbose_name="Default SEO description (English)",
    )
    seo_default_description_ru = models.TextField(
        blank=True,
        verbose_name="Default SEO description (Russian)",
    )
    seo_organization_description_en = models.TextField(
        blank=True,
        verbose_name="Organization SEO description (English)",
    )
    seo_organization_description_ru = models.TextField(
        blank=True,
        verbose_name="Organization SEO description (Russian)",
    )

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"


class HomePageContent(SingletonModel, SeoFieldsMixin):
    hero_title_en = models.CharField(max_length=255, blank=True, verbose_name="Hero heading (English)")
    hero_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Hero heading (Russian)")
    hero_description_en = models.TextField(
        blank=True,
        verbose_name="Hero subheading (English)",
    )
    hero_description_ru = models.TextField(
        blank=True,
        verbose_name="Hero subheading (Russian)",
    )
    signal_title_en = models.CharField(max_length=255, blank=True, verbose_name="Signal heading (English)")
    signal_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Signal heading (Russian)")
    featured_title_en = models.CharField(max_length=255, blank=True, verbose_name="Featured section heading (English)")
    featured_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Featured section heading (Russian)")
    featured_description_en = models.TextField(blank=True, verbose_name="Featured section text (English)")
    featured_description_ru = models.TextField(blank=True, verbose_name="Featured section text (Russian)")
    featured_more_options_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Featured section support text (English)",
    )
    featured_more_options_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Featured section support text (Russian)",
    )
    hero_background_image_file = models.ImageField(
        upload_to="site-content/home/",
        blank=True,
        verbose_name="Hero background upload",
    )
    hero_background_image_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Hero background image URL",
    )
    destination_title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Destination section heading (English)",
    )
    destination_title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Destination section heading (Russian)",
    )
    destination_description_en = models.TextField(
        blank=True,
        verbose_name="Destination section text (English)",
    )
    destination_description_ru = models.TextField(
        blank=True,
        verbose_name="Destination section text (Russian)",
    )
    destination_image_file = models.ImageField(
        upload_to="site-content/home/",
        blank=True,
        verbose_name="Destination image upload",
    )
    destination_image_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Destination image URL",
    )
    destination_image_alt_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Destination image alt text (English)",
    )
    destination_image_alt_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Destination image alt text (Russian)",
    )
    benefits_title_en = models.CharField(max_length=255, blank=True, verbose_name="Benefits heading (English)")
    benefits_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Benefits heading (Russian)")
    benefits_description_en = models.TextField(blank=True, verbose_name="Benefits text (English)")
    benefits_description_ru = models.TextField(blank=True, verbose_name="Benefits text (Russian)")
    faq_preview_title_en = models.CharField(max_length=255, blank=True, verbose_name="FAQ preview heading (English)")
    faq_preview_title_ru = models.CharField(max_length=255, blank=True, verbose_name="FAQ preview heading (Russian)")
    faq_preview_description_en = models.TextField(blank=True, verbose_name="FAQ preview text (English)")
    faq_preview_description_ru = models.TextField(blank=True, verbose_name="FAQ preview text (Russian)")
    faq_preview_more_details_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="FAQ preview support text (English)",
    )
    faq_preview_more_details_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="FAQ preview support text (Russian)",
    )
    closing_title_en = models.CharField(max_length=255, blank=True, verbose_name="Closing CTA heading (English)")
    closing_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Closing CTA heading (Russian)")
    closing_description_en = models.TextField(blank=True, verbose_name="Closing CTA text (English)")
    closing_description_ru = models.TextField(blank=True, verbose_name="Closing CTA text (Russian)")

    class Meta:
        verbose_name = "Home page"
        verbose_name_plural = "Home page"

    def __str__(self):
        return "Home page"


class HomeProcessItem(OrderedVisibleModel):
    home_page = models.ForeignKey(
        HomePageContent,
        related_name="process_items",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")
    href = models.CharField(
        max_length=120,
        verbose_name="Link target",
        help_text="Use an anchor such as #featured-cars or #booking-path.",
    )
    tone = models.CharField(
        max_length=40,
        default="fleet",
        verbose_name="Visual tone key",
        help_text="Matches the existing frontend visual style classes.",
    )

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Home process item"
        verbose_name_plural = "Home process items"

    def __str__(self):
        return self.title_en


class HomeClosingStep(OrderedVisibleModel):
    home_page = models.ForeignKey(
        HomePageContent,
        related_name="closing_steps",
        on_delete=models.CASCADE,
    )
    text_en = models.CharField(max_length=255, verbose_name="Step text (English)")
    text_ru = models.CharField(max_length=255, verbose_name="Step text (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Home closing step"
        verbose_name_plural = "Home closing steps"

    def __str__(self):
        return self.text_en


class AboutPageContent(SingletonModel, VisualContentMixin, SeoFieldsMixin):
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_en = models.TextField(blank=True, verbose_name="Body text (English)")
    description_ru = models.TextField(blank=True, verbose_name="Body text (Russian)")
    section_title_en = models.CharField(max_length=255, blank=True, verbose_name="Supporting section heading (English)")
    section_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Supporting section heading (Russian)")
    section_description_en = models.TextField(blank=True, verbose_name="Supporting section text (English)")
    section_description_ru = models.TextField(blank=True, verbose_name="Supporting section text (Russian)")
    cta_title_en = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (English)")
    cta_title_ru = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (Russian)")
    cta_description_en = models.TextField(blank=True, verbose_name="CTA text (English)")
    cta_description_ru = models.TextField(blank=True, verbose_name="CTA text (Russian)")

    class Meta:
        verbose_name = "About page"
        verbose_name_plural = "About page"

    def __str__(self):
        return "About page"


class AboutStat(OrderedVisibleModel):
    about_page = models.ForeignKey(
        AboutPageContent,
        related_name="stats",
        on_delete=models.CASCADE,
    )
    value_en = models.CharField(max_length=120, verbose_name="Value (English)")
    value_ru = models.CharField(max_length=120, verbose_name="Value (Russian)")
    label_en = models.CharField(max_length=255, verbose_name="Label (English)")
    label_ru = models.CharField(max_length=255, verbose_name="Label (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "About stat"
        verbose_name_plural = "About stats"

    def __str__(self):
        return self.label_en


class AboutPrinciple(OrderedVisibleModel):
    about_page = models.ForeignKey(
        AboutPageContent,
        related_name="principles",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "About principle"
        verbose_name_plural = "About principles"

    def __str__(self):
        return self.title_en


class ContactsPageContent(SingletonModel, VisualContentMixin, SeoFieldsMixin):
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_en = models.TextField(blank=True, verbose_name="Body text (English)")
    description_ru = models.TextField(blank=True, verbose_name="Body text (Russian)")
    summary_primary_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Primary summary label (English)",
        help_text="Label for the contact availability item. The value comes from Site settings.",
    )
    summary_primary_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Primary summary label (Russian)",
    )
    summary_hours_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Working hours summary label (English)",
        help_text="Label for the working-hours item. The value comes from Site settings.",
    )
    summary_hours_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Working hours summary label (Russian)",
    )
    summary_coverage_label_en = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Coverage summary label (English)",
        help_text="Label for the pickup / coverage item. The value comes from Site settings.",
    )
    summary_coverage_label_ru = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Coverage summary label (Russian)",
    )
    entry_section_title_en = models.CharField(max_length=255, blank=True, verbose_name="Entry section heading (English)")
    entry_section_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Entry section heading (Russian)")
    entry_section_description_en = models.TextField(blank=True, verbose_name="Entry section text (English)")
    entry_section_description_ru = models.TextField(blank=True, verbose_name="Entry section text (Russian)")
    channels_title_en = models.CharField(max_length=255, blank=True, verbose_name="Channels section heading (English)")
    channels_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Channels section heading (Russian)")
    channels_description_en = models.TextField(blank=True, verbose_name="Channels section text (English)")
    channels_description_ru = models.TextField(blank=True, verbose_name="Channels section text (Russian)")
    form_section_title_en = models.CharField(max_length=255, blank=True, verbose_name="Form section heading (English)")
    form_section_title_ru = models.CharField(max_length=255, blank=True, verbose_name="Form section heading (Russian)")
    form_section_description_en = models.TextField(blank=True, verbose_name="Form section text (English)")
    form_section_description_ru = models.TextField(blank=True, verbose_name="Form section text (Russian)")

    class Meta:
        verbose_name = "Contacts page"
        verbose_name_plural = "Contacts page"

    def __str__(self):
        return "Contacts page"


class ContactsHighlight(OrderedVisibleModel):
    contacts_page = models.ForeignKey(
        ContactsPageContent,
        related_name="highlights",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    detail_en = models.TextField(verbose_name="Text (English)")
    detail_ru = models.TextField(verbose_name="Text (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Contacts highlight"
        verbose_name_plural = "Contacts highlights"

    def __str__(self):
        return self.title_en


class ContactEntryCard(OrderedVisibleModel):
    class Intent(models.TextChoices):
        BOOKING = "booking", "Booking"
        CONTACT = "contact_request", "Consultation request"
        SUPPORT = "support_request", "Support request"

    contacts_page = models.ForeignKey(
        ContactsPageContent,
        related_name="entry_cards",
        on_delete=models.CASCADE,
    )
    intent = models.CharField(
        max_length=40,
        choices=Intent.choices,
        default=Intent.BOOKING,
        verbose_name="Request intent",
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")
    action_label_en = models.CharField(max_length=120, verbose_name="Button label (English)")
    action_label_ru = models.CharField(max_length=120, verbose_name="Button label (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Contacts entry card"
        verbose_name_plural = "Contacts entry cards"

    def __str__(self):
        return self.title_en


class FaqPageContent(SingletonModel, VisualContentMixin, SeoFieldsMixin):
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_en = models.TextField(blank=True, verbose_name="Body text (English)")
    description_ru = models.TextField(blank=True, verbose_name="Body text (Russian)")
    cta_title_en = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (English)")
    cta_title_ru = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (Russian)")
    cta_description_en = models.TextField(blank=True, verbose_name="CTA text (English)")
    cta_description_ru = models.TextField(blank=True, verbose_name="CTA text (Russian)")

    class Meta:
        verbose_name = "FAQ page"
        verbose_name_plural = "FAQ page"

    def __str__(self):
        return "FAQ page"


class FAQItem(OrderedVisibleModel):
    faq_page = models.ForeignKey(
        FaqPageContent,
        related_name="items",
        on_delete=models.CASCADE,
    )
    anchor = models.SlugField(
        max_length=120,
        verbose_name="Anchor ID",
        help_text="Used for FAQ anchors and open-state links on the public site.",
    )
    question_en = models.CharField(max_length=255, verbose_name="Question (English)")
    question_ru = models.CharField(max_length=255, verbose_name="Question (Russian)")
    answer_en = models.TextField(verbose_name="Answer (English)")
    answer_ru = models.TextField(verbose_name="Answer (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "FAQ item"
        verbose_name_plural = "FAQ items"

    def __str__(self):
        return self.question_en


class HowItWorksPageContent(SingletonModel, VisualContentMixin, SeoFieldsMixin):
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_en = models.TextField(blank=True, verbose_name="Body text (English)")
    description_ru = models.TextField(blank=True, verbose_name="Body text (Russian)")
    cta_title_en = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (English)")
    cta_title_ru = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (Russian)")
    cta_description_en = models.TextField(blank=True, verbose_name="CTA text (English)")
    cta_description_ru = models.TextField(blank=True, verbose_name="CTA text (Russian)")
    cta_faq_label_en = models.CharField(max_length=120, blank=True, verbose_name="FAQ CTA label (English)")
    cta_faq_label_ru = models.CharField(max_length=120, blank=True, verbose_name="FAQ CTA label (Russian)")

    class Meta:
        verbose_name = "How it works page"
        verbose_name_plural = "How it works page"

    def __str__(self):
        return "How it works page"


class HowItWorksStep(OrderedVisibleModel):
    how_it_works_page = models.ForeignKey(
        HowItWorksPageContent,
        related_name="steps",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "How it works step"
        verbose_name_plural = "How it works steps"

    def __str__(self):
        return self.title_en


class HowItWorksHighlight(OrderedVisibleModel):
    how_it_works_page = models.ForeignKey(
        HowItWorksPageContent,
        related_name="highlights",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "How it works highlight"
        verbose_name_plural = "How it works highlights"

    def __str__(self):
        return self.title_en


class LegalPageContent(VisualContentMixin, SeoFieldsMixin):
    class PageKey(models.TextChoices):
        TERMS = "terms", "Terms"
        PRIVACY = "privacy", "Privacy"

    page_key = models.CharField(
        max_length=20,
        choices=PageKey.choices,
        unique=True,
        verbose_name="Page key",
    )
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_en = models.TextField(blank=True, verbose_name="Body text (English)")
    description_ru = models.TextField(blank=True, verbose_name="Body text (Russian)")
    cta_title_en = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (English)")
    cta_title_ru = models.CharField(max_length=255, blank=True, verbose_name="CTA heading (Russian)")
    cta_description_en = models.TextField(blank=True, verbose_name="CTA text (English)")
    cta_description_ru = models.TextField(blank=True, verbose_name="CTA text (Russian)")

    class Meta:
        ordering = ("page_key",)
        verbose_name = "Legal page"
        verbose_name_plural = "Legal pages"

    def __str__(self):
        return self.get_page_key_display()


class LegalSection(OrderedVisibleModel):
    legal_page = models.ForeignKey(
        LegalPageContent,
        related_name="sections",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Section title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Section title (Russian)")
    items_en = models.TextField(
        verbose_name="Bullet items (English)",
        help_text="Write one bullet per line.",
    )
    items_ru = models.TextField(
        verbose_name="Bullet items (Russian)",
        help_text="Write one bullet per line.",
    )

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Legal section"
        verbose_name_plural = "Legal sections"

    def __str__(self):
        return f"{self.legal_page.get_page_key_display()}: {self.title_en}"


class ThankYouPageContent(SingletonModel, VisualContentMixin, SeoFieldsMixin):
    eyebrow_en = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (English)")
    eyebrow_ru = models.CharField(max_length=120, blank=True, verbose_name="Eyebrow (Russian)")
    title_en = models.CharField(max_length=255, blank=True, verbose_name="Heading (English)")
    title_ru = models.CharField(max_length=255, blank=True, verbose_name="Heading (Russian)")
    description_with_car_en = models.TextField(
        blank=True,
        verbose_name="Confirmation text with car name (English)",
        help_text="Use {{carName}} where the car name should appear.",
    )
    description_with_car_ru = models.TextField(
        blank=True,
        verbose_name="Confirmation text with car name (Russian)",
        help_text="Use {{carName}} where the car name should appear.",
    )
    description_without_car_en = models.TextField(
        blank=True,
        verbose_name="Confirmation text without car name (English)",
    )
    description_without_car_ru = models.TextField(
        blank=True,
        verbose_name="Confirmation text without car name (Russian)",
    )
    description_end_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Confirmation ending text (English)",
    )
    description_end_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Confirmation ending text (Russian)",
    )
    dates_start_label_en = models.CharField(max_length=120, blank=True, verbose_name="Start date label (English)")
    dates_start_label_ru = models.CharField(max_length=120, blank=True, verbose_name="Start date label (Russian)")
    dates_end_label_en = models.CharField(max_length=120, blank=True, verbose_name="End date label (English)")
    dates_end_label_ru = models.CharField(max_length=120, blank=True, verbose_name="End date label (Russian)")
    primary_action_label_en = models.CharField(max_length=120, blank=True, verbose_name="Primary button label (English)")
    primary_action_label_ru = models.CharField(max_length=120, blank=True, verbose_name="Primary button label (Russian)")
    secondary_action_label_en = models.CharField(max_length=120, blank=True, verbose_name="Secondary button label (English)")
    secondary_action_label_ru = models.CharField(max_length=120, blank=True, verbose_name="Secondary button label (Russian)")

    class Meta:
        verbose_name = "Thank-you page"
        verbose_name_plural = "Thank-you page"

    def __str__(self):
        return "Thank-you page"


class ThankYouStep(OrderedVisibleModel):
    thank_you_page = models.ForeignKey(
        ThankYouPageContent,
        related_name="steps",
        on_delete=models.CASCADE,
    )
    title_en = models.CharField(max_length=255, verbose_name="Title (English)")
    title_ru = models.CharField(max_length=255, verbose_name="Title (Russian)")
    description_en = models.TextField(verbose_name="Description (English)")
    description_ru = models.TextField(verbose_name="Description (Russian)")

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Thank-you step"
        verbose_name_plural = "Thank-you steps"

    def __str__(self):
        return self.title_en
