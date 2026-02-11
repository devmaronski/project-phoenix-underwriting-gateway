# Project Phoenix – Underwriting Gateway

A modernization gateway between a legacy lending system and a modern AI-driven application. It retrieves raw legacy loan data, validates and normalizes it, integrates an external risk-scoring dependency, and exposes a stable REST API.

---

## Architecture Summary

The system is structured around clear separation of concerns:

- **Repository layer** retrieves raw legacy data.
- **Transformation layer** validates and normalizes currency and date formats.
- **Service layer** orchestrates risk scoring.
- **Controllers** handle HTTP only.

Legacy data is treated as untrusted input and validated at runtime to prevent corrupted records from propagating.

---

## Technology & Libraries

### Backend
- **NestJS + TypeScript (strict mode)** – Structured architecture, dependency injection, and consistent cross-cutting concerns.
- **Zod** – Runtime validation of unreliable legacy payloads.
- **uuid** – Request correlation IDs for traceability.
- **Jest + Supertest** – Unit and integration testing aligned with NestJS ecosystem; coverage thresholds enforced.

### Frontend
- **React** – Component-driven UI.
- **TanStack Query** – Structured async state management and intelligent retry handling.
- **Tailwind CSS + shadcn/ui** – Lightweight, composable UI primitives.
- **Vitest + React Testing Library** – Fast, behavior-focused component testing for Vite projects.
- **MSW** – Realistic API mocking at the network boundary.

### DevOps
- **Multi-stage Docker** – Minimal, secure production image.
- **GitHub Actions** – Linting, tests, coverage enforcement (70%+), and security scanning.
- **Google Cloud Run** – Managed container deployment.

---

## Error Handling Strategy

| Scenario | Response |
|----------|----------|
| Corrupted legacy data | 422 |
| Loan not found | 404 |
| Risk service unavailable | 503 |
| Unexpected error | 500 |

Errors follow a consistent JSON contract and include a request correlation ID.

---

## Testing Strategy

Testing focuses on high-risk areas:

- Transformation logic (primary coverage target)
- Error handling branches
- External dependency failure scenarios
- End-to-end API contract validation

Backend enforces coverage thresholds via Jest configuration.  
Frontend tests focus on user-visible behavior rather than implementation details.

---

## Key Principles

- Defensive handling of unreliable legacy systems
- Isolation of external dependencies
- Strong type safety
- Explicit failure management
- Automated quality enforcement

---
## Deployment URL

Backend: https://project-phoenix-api-gyoiw3ae6q-as.a.run.app

Frontend: https://project-phoenix-web-824530365813.asia-southeast1.run.app/


## Test Loan IDs for Frontend

You can use the following test loan IDs in the frontend to verify integration and error handling:

- **LOAN-VALID-001**: Valid loan, should return a normalized loan object.
- **LOAN-CORRUPT-CENTS-001**: Corrupted cents (`loan_amount_cents` is not an integer), should return a 422 error.
- **LOAN-CORRUPT-DATE-001**: Corrupted date format, should return a 422 error.
- **LOAN-MISSING-REQUIRED-001**: Missing required fields, should return a 422 error.

---

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for setup instructions.
