from rest_framework import generics

from .models import Car
from .serializers import CarSerializer, normalize_language


class CarSerializerContextMixin:
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["language"] = normalize_language(self.request.GET.get("lang"))
        return context


class CarListAPIView(CarSerializerContextMixin, generics.ListAPIView):
    serializer_class = CarSerializer

    def get_queryset(self):
        queryset = Car.objects.prefetch_related("gallery_images").filter(is_visible=True)
        featured = self.request.GET.get("featured")

        if featured in {"1", "true", "True"}:
            queryset = queryset.filter(is_featured=True)

        return queryset


class CarDetailAPIView(CarSerializerContextMixin, generics.RetrieveAPIView):
    serializer_class = CarSerializer

    def get_queryset(self):
        return Car.objects.prefetch_related("gallery_images").filter(is_visible=True)
