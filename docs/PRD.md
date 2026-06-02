# Invopaid — Product Requirements Document (PRD)

## 1. Overview

PayFlow is a lightweight hosted payments platform that enables small businesses to accept payments through simple payment links or embedded checkout components.

The product removes the need for merchants to build or manage custom payment infrastructure, starting with integration via Stripe and evolving toward a provider-agnostic payments orchestration layer.

---

## 2. Problem Statement

Small businesses face significant friction when trying to accept payments:

- Payment setup requires technical knowledge or multiple tools
- Existing solutions are either too complex (full e-commerce platforms) or too limited (basic invoices)
- No simple way to generate reusable payment links quickly
- Limited flexibility across payment providers

**Impact:**
- Delayed payments
- Lost revenue opportunities
- Operational inefficiency

---

## 3. Goals

### Primary Goal
Enable a merchant to:
> Sign up → create a payment link → accept their first payment in under 10 minutes

### Secondary Goals
- Provide a clean, mobile-friendly checkout experience
- Reduce setup friction for non-technical users
- Build a foundation for multi-provider payments

---

## 4. Non-Goals (MVP)

- Multi-provider routing or optimization
- Subscriptions or recurring billing
- Marketplace split payments
- Advanced analytics or reporting
- Full invoicing or accounting features

---

## 5. Target Users

### Primary Users
- Freelancers and consultants
- Tutors and coaches
- Fitness instructors
- Local service providers

### User Characteristics
- Limited technical expertise
- Needs fast and reliable way to collect payments
- Prefers simple tools over complex systems

---

## 6. User Stories

### Merchant
- As a merchant, I want to create a payment link so I can quickly collect payments
- As a merchant, I want to share a link with customers without building a website
- As a merchant, I want to see whether a payment was successful

### Customer (Buyer)
- As a customer, I want a simple checkout experience
- As a customer, I want to pay securely using my card
- As a customer, I want confirmation after payment

---

## 7. Core Features (MVP)

### 7.1 Merchant Onboarding
- Email/password signup
- Connect Stripe account

---

### 7.2 Payment Link Creation
Merchant defines:
- Business name
- Payment title
- Amount
- Currency
- Description

Output:
- Unique hosted payment URL (e.g., /pay/{id})

---

### 7.3 Hosted Checkout Page
Displays:
- Merchant name
- Payment details
- Amount
- Card input via Stripe
- Pay button
- Confirmation screen

---

### 7.4 Payment Processing
- Integration with Stripe Checkout or Payment Element
- Handle success/failure states
- Webhook-based event handling

---

### 7.5 Merchant Dashboard (Basic)
- List of payment links
- Transaction status
- Payment history

---

## 8. User Flows

### Merchant Flow
1. Sign up
2. Connect Stripe
3. Create payment link
4. Share link
5. Receive payment

---

### Buyer Flow
1. Open payment link
2. Enter payment details
3. Complete payment
4. View confirmation

---

## 9. Success Metrics

### MVP Metrics
- Time to first payment (<10 minutes)
- Payment success rate
- Number of payment links created per merchant

### Future Metrics
- Checkout conversion rate
- Repeat usage per merchant
- Revenue per merchant

---

## 10. Architecture Overview

### High-Level Components
- Frontend (merchant dashboard + checkout UI)
- Backend API
- Payment adapter layer
- Database (merchants, payments, transactions)

---

### Core Design Principle

Abstract payment providers behind a unified interface:

- CreatePaymentSession()
- GetPaymentStatus()
- RefundPayment()

This enables future support for multiple providers (Stripe, Paytm, etc.)

---

## 11. Risks & Tradeoffs

### Risks
- Dependency on Stripe in early stages
- Trust barrier for payment handling
- Competitive landscape

### Tradeoffs
- Simplicity over flexibility (MVP)
- Single provider before orchestration
- Narrow use case focus

---

## 12. Roadmap

### Phase 1 (MVP)
- Hosted payment links
- Stripe integration
- Basic dashboard

### Phase 2
- Embeddable checkout component
- Email receipts
- Refund support
- Basic analytics

### Phase 3
- Multi-provider support (Paytm, others)
- Expanded abstraction layer

### Phase 4
- Smart routing and optimization
- Advanced payment workflows

---

## 13. Open Questions

- Should payment links support variable pricing?
- What level of branding/customization is needed?
- What is the simplest onboarding flow for non-technical users?
- When to introduce multi-provider support?

---

## 14. Status

🚧 In active development

Current focus:
- Payment link creation
- Checkout experience
- Reliable payment flow