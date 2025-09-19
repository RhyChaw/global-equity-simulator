from django.urls import path
from .views import countries, simulate, pdf_report

urlpatterns = [
    path('countries', countries),
    path('simulate', simulate),
    path('reports/pdf', pdf_report),
]


