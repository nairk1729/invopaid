# Invopaid API Documentation

Base URL

http://localhost:4000

---

# Health Check

## GET /health

Checks backend service status.

### Response

```json
{
  "status": "ok",
  "service": "invopaid-backend"
}
```

---

# Create Payment Link

## POST /payment-links

Creates a new hosted payment link.

### Request Body

```json
{
  "businessName": "Kav Yoga Studio",
  "serviceTitle": "1:1 Yoga Session",
  "description": "60 minute personalized session",
  "amount": 50,
  "currency": "USD"
}
```

### Response

```json
{
  "paymentLink": {
    "id": "plink_123",
    "businessName": "Kav Yoga Studio",
    "serviceTitle": "1:1 Yoga Session",
    "description": "60 minute personalized session",
    "amount": 50,
    "currency": "USD",
    "status": "active",
    "createdAt": "2026-05-15T00:00:00.000Z"
  },
  "url": "https://invopaid.app/pay/plink_123"
}
```

---

# Retrieve Payment Link

## GET /payment-links/:id

Fetches a payment link by ID.

### Example

```text
GET /payment-links/plink_123
```

### Response

```json
{
  "id": "plink_123",
  "businessName": "Kav Yoga Studio",
  "serviceTitle": "1:1 Yoga Session",
  "description": "60 minute personalized session",
  "amount": 50,
  "currency": "USD",
  "status": "active",
  "createdAt": "2026-05-15T00:00:00.000Z"
}
```

---

# Create Checkout Session

## POST /checkout-session

Creates a checkout session for a payment link.

### Request Body

```json
{
  "paymentLinkId": "plink_123"
}
```

### Response

```json
{
  "transaction": {
    "id": "txn_123",
    "paymentLinkId": "plink_123",
    "amount": 50,
    "currency": "USD",
    "status": "pending",
    "checkoutUrl": "https://checkout.invopaid.app/session/123",
    "createdAt": "2026-05-15T00:00:00.000Z"
  }
}
```

---

# Retrieve Transaction

## GET /transactions/:id

Fetches transaction details and payment status.

### Example

```text
GET /transactions/txn_123
```

### Response

```json
{
  "id": "txn_123",
  "paymentLinkId": "plink_123",
  "amount": 50,
  "currency": "USD",
  "status": "pending",
  "checkoutUrl": "https://checkout.invopaid.app/session/123",
  "createdAt": "2026-05-15T00:00:00.000Z"
}
```

---

# Payment Webhook

## POST /webhooks/payment

Simulates a payment provider webhook updating transaction state.

### Request Body

```json
{
  "transactionId": "txn_123",
  "status": "succeeded"
}
```

### Response

```json
{
  "message": "Transaction updated successfully",
  "transaction": {
    "id": "txn_123",
    "status": "succeeded"
  }
}
```