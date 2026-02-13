# Logic64 API Endpoints (Layer 04)

**Standard**: REST-ish (over MCP/Hono)

## 1. Endpoint Conventions
-   **Prefix**: `/api/v1/`
-   **Resources**: Plural nouns (e.g., `/projects`, `/users`).
-   **Methods**:
    -   `GET`: Retrieve data (Cached where possible).
    -   `POST`: Create new resource (Idempotent if possible).
    -   `PATCH`: Partial update.
    -   `DELETE`: Soft delete preferred.

## 2. Response Format (JSend)
```json
{
  "status": "success",
  "data": { ... }
}
```
OR
```json
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR"
}
```

## 3. Integration
-   **External Services**: Defined in `external_services.md`.
-   **Webhooks**: Verified via signature (HMAC).
