from django.urls import path
from .views import countries, simulate, pdf_report, ai_explain

urlpatterns = [
    path('countries', countries),
    path('simulate', simulate),
    path('reports/pdf', pdf_report),
    path('ai/explain', ai_explain),
]


