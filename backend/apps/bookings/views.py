from rest_framework import generics

from .models import Booking
from .serializers import BookingSerializer


class BookingCreateAPIView(generics.CreateAPIView):
    queryset = Booking.objects.select_related("car")
    serializer_class = BookingSerializer
