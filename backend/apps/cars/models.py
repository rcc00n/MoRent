from django.db import models


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
        help_text="Turn this off to hide the item from the public fleet without deleting it.",
    )

    class Meta:
        abstract = True
        ordering = ("sort_order", "id")


class Car(models.Model):
    brand = models.CharField(max_length=100, verbose_name="Brand")
    model = models.CharField(max_length=100, verbose_name="Model")
    title_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Marketing title (English)",
        help_text="Optional public title. Leave blank to show Brand + Model.",
    )
    title_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Marketing title (Russian)",
        help_text="Optional public title. Leave blank to show Brand + Model.",
    )
    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Price per day",
    )
    image = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Legacy image URL",
        help_text="Existing public image URL kept for backwards-compatible fallbacks.",
    )
    image_file = models.ImageField(
        upload_to="cars/",
        blank=True,
        verbose_name="Primary image upload",
        help_text="Upload the main car image shown on the site.",
    )
    short_description_en = models.TextField(
        blank=True,
        verbose_name="Short description (English)",
        help_text="Shown on cards and summary areas.",
    )
    short_description_ru = models.TextField(
        blank=True,
        verbose_name="Short description (Russian)",
        help_text="Shown on cards and summary areas.",
    )
    long_description_en = models.TextField(
        blank=True,
        verbose_name="Long description (English)",
        help_text="Optional extended description used on the car detail page.",
    )
    long_description_ru = models.TextField(
        blank=True,
        verbose_name="Long description (Russian)",
        help_text="Optional extended description used on the car detail page.",
    )
    description = models.TextField(
        blank=True,
        verbose_name="Legacy description",
        help_text="Legacy fallback description kept so existing content remains visible.",
    )
    available = models.BooleanField(default=True, verbose_name="Available for booking")
    is_featured = models.BooleanField(
        default=True,
        verbose_name="Featured on home page",
        help_text="Featured cars are prioritized on the homepage.",
    )
    is_visible = models.BooleanField(
        default=True,
        verbose_name="Visible on public site",
        help_text="Turn this off to keep the car in admin while hiding it from visitors.",
    )
    display_order = models.PositiveIntegerField(
        default=0,
        db_index=True,
        verbose_name="Display order",
        help_text="Lower numbers appear first in the fleet and featured sections.",
    )

    class Meta:
        ordering = ["display_order", "brand", "model", "id"]

    def __str__(self) -> str:
        return f"{self.brand} {self.model}"


class CarGalleryImage(OrderedVisibleModel):
    car = models.ForeignKey(
        Car,
        related_name="gallery_images",
        on_delete=models.CASCADE,
    )
    image_file = models.ImageField(
        upload_to="cars/gallery/",
        blank=True,
        verbose_name="Gallery image upload",
    )
    image_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name="Gallery image URL",
        help_text="Optional external image URL used when no upload is provided.",
    )
    alt_en = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Alt text (English)",
    )
    alt_ru = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Alt text (Russian)",
    )

    class Meta(OrderedVisibleModel.Meta):
        verbose_name = "Car gallery image"
        verbose_name_plural = "Car gallery images"

    def __str__(self) -> str:
        return f"{self.car} image {self.pk or 'new'}"
