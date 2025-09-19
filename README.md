Global Equity Simulator
=======================

A full-stack SaaS app to simulate global employee equity grants with country-specific tax and regulation rules, interactive cap table visualization, and automated compliance reporting.

Monorepo Layout
---------------

- `frontend/` — React + TypeScript UI (Vite) with interactive cap table and scenario builder
- `backend-django/` — Django + DRF API, rule engine, PDF report generation
- `backend-spring/` — Java + Spring Boot microservice for high-volume cap table calculations
- `helm-charts/` — Helm chart to deploy all services to Kubernetes (Minikube or cloud)
- `docker-compose.yml` — Local development orchestrator

Architecture Overview
---------------------

- React UI calls Django API for equity scenarios, country rules, and PDF exports
- Django delegates heavy numeric calculations to the Spring Boot service
- All services are containerized and can be deployed together via Helm

Getting Started (Local)
-----------------------

Prereqs: Node 20+, Python 3.11+, Java 21, Docker, Docker Compose.

1. Frontend
   - `cd frontend`
   - `npm install`
   - `npm run dev`

2. Django API
   - `cd backend-django`
   - `python -m venv .venv && source .venv/bin/activate`
   - `pip install -r requirements.txt`
   - `python manage.py migrate`
   - `python manage.py runserver 0.0.0.0:8000`

3. Spring Service
   - `cd backend-spring`
   - `./mvnw spring-boot:run`

Docker (All Services)
---------------------

- From repo root: `docker compose up --build`

Kubernetes with Helm
--------------------

1. `minikube start`
2. `helm upgrade --install equity-sim helm-charts/ --namespace equity --create-namespace`

Roadmap
-------

- Scenario builder, country rule engine, PDF exports
- JWT auth and role-based views (CFO vs Employee)
- Optional GraphQL gateway for unified API
- Horizontal scaling demo for Spring service


