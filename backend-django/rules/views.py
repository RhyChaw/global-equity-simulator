from io import BytesIO
import math
import requests
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from rest_framework.decorators import api_view
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas


COUNTRIES = [
    {"code": "US", "name": "United States"},
    {"code": "CA", "name": "Canada"},
    {"code": "FR", "name": "France"},
    {"code": "DE", "name": "Germany"},
    {"code": "IN", "name": "India"},
]


def _country_rule(code: str):
    # Simple illustrative rule engine. Real rules would be data-driven and time-bound.
    rules = {
        "US": {"tax_rate": 0.30, "vesting_years": 4, "notes": "ISO/NSO varies by eligibility."},
        "CA": {"tax_rate": 0.26, "vesting_years": 4, "notes": "Employee stock option deduction may apply."},
        "FR": {"tax_rate": 0.40, "vesting_years": 4, "notes": "BSPCE regime for startups."},
        "DE": {"tax_rate": 0.42, "vesting_years": 4, "notes": "Dry income risk; reforms ongoing."},
        "IN": {"tax_rate": 0.35, "vesting_years": 4, "notes": "Perquisite tax on exercise; startup reliefs exist."},
    }
    return rules.get(code, rules["US"])


@api_view(["GET"])
def countries(request):
    return JsonResponse({"countries": COUNTRIES})


@api_view(["POST"])
def simulate(request):
    data = request.data or {}
    country = data.get("country", "US")
    valuation = float(data.get("valuation", 200_000_000))
    grant_percent = float(data.get("grant_percent", 1.0)) / 100.0
    employee_name = data.get("employee_name", "Employee")

    rule = _country_rule(country)

    # Delegate heavy math to Spring service (demo endpoint). Fallback to local calc on error.
    calc = None
    try:
        resp = requests.post(
            f"{settings.SPRING_BASE_URL}/api/calc",
            json={"valuation": valuation, "grant_percent": grant_percent},
            timeout=2.5,
        )
        if resp.ok:
            calc = resp.json()
    except Exception:
        calc = None

    if calc is None:
        # Local fallback
        strike = valuation * 0.0001
        fmv = valuation / 100_000_000
        shares_outstanding = 100_000_000
        grant_shares = shares_outstanding * grant_percent
        spread = max(fmv - strike, 0) * grant_shares
        calc = {
            "grant_shares": grant_shares,
            "spread_value": spread,
        }

    tax_due = calc["spread_value"] * _country_rule(country)["tax_rate"]
    take_home = max(calc["spread_value"] - tax_due, 0)

    result = {
        "employee": employee_name,
        "country": country,
        "rule": rule,
        "valuation": valuation,
        "grant_percent": grant_percent,
        "calc": calc,
        "tax_due": tax_due,
        "take_home": take_home,
    }
    return JsonResponse(result)


@api_view(["GET"])
def pdf_report(request):
    employee = request.GET.get("employee", "Employee")
    country = request.GET.get("country", "US")
    rule = _country_rule(country)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=LETTER)
    width, height = LETTER

    p.setFont("Helvetica-Bold", 16)
    p.drawString(72, height - 72, "Equity Grant Statement")
    p.setFont("Helvetica", 11)
    p.drawString(72, height - 110, f"Employee: {employee}")
    p.drawString(72, height - 130, f"Country: {country}")
    p.drawString(72, height - 150, f"Tax Rate: {int(rule['tax_rate']*100)}%")
    p.drawString(72, height - 170, f"Vesting: {rule['vesting_years']} years")
    p.drawString(72, height - 190, f"Notes: {rule['notes']}")

    p.showPage()
    p.save()

    buffer.seek(0)
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'inline; filename="equity_report.pdf"'
    return response


