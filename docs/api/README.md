# API Documentation

This document provides an overview of the Rental ZKP API endpoints.

## Base URL

- Development: `http://localhost:8080/api`
- Production: `https://api.rental-zkp.com/api`

## Authentication

All API endpoints except `/auth/*` require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "tenant" | "landlord"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Proofs

#### Generate Income Proof
```http
POST /proofs/income
Content-Type: application/json
Authorization: Bearer <token>

{
  "income": 5000,
  "threshold": 3000,
  "salt": "random-salt"
}
```

#### Verify Income Proof
```http
POST /proofs/income/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "proof": "...",
  "publicSignals": [...]
}
```

#### Generate Rental History Proof
```http
POST /proofs/rental-history
Content-Type: application/json
Authorization: Bearer <token>

{
  "history": [...],
  "salt": "random-salt"
}
```

### Properties

#### List Properties
```http
GET /properties
Authorization: Bearer <token>
```

#### Create Property
```http
POST /properties
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Luxury Apartment",
  "description": "Beautiful apartment in downtown",
  "price": 2000,
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "requirements": {
    "minIncome": 6000,
    "minCreditScore": 700
  }
}
```

### Applications

#### Submit Application
```http
POST /applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "propertyId": "property-id",
  "incomeProof": "...",
  "rentalHistoryProof": "...",
  "creditScoreProof": "..."
}
```

#### Get Application Status
```http
GET /applications/:id
Authorization: Bearer <token>
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

Common error codes:
- `INVALID_TOKEN`: Authentication token is invalid or expired
- `INVALID_PROOF`: Zero-knowledge proof verification failed
- `INSUFFICIENT_INCOME`: Income proof doesn't meet requirements
- `INVALID_CREDENTIALS`: Login credentials are incorrect
- `EMAIL_IN_USE`: Email is already registered
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed

## Rate Limiting

API endpoints are rate limited:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612345678
```

## Pagination

List endpoints support pagination:

```http
GET /properties?page=1&limit=10
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## WebSocket Events

The API also provides real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8080/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle event
};
```

Available events:
- `application.status`: Application status updates
- `property.status`: Property status changes
- `proof.verified`: Proof verification results

## SDK

A JavaScript SDK is available for easier API integration:

```javascript
import { RentalZKP } from '@rental-zkp/sdk';

const client = new RentalZKP({
  baseUrl: 'http://localhost:8080/api',
  token: 'your-jwt-token'
});

// Generate income proof
const proof = await client.proofs.generateIncomeProof({
  income: 5000,
  threshold: 3000
});
```

## More Information

- [Authentication API](auth.md)
- [Proof API](proofs.md)
- [Property API](properties.md)
- [Application API](applications.md) 