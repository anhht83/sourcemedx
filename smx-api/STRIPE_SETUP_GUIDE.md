 # Stripe Integration Setup Guide

A comprehensive guide for setting up Stripe payment integration across **smx-api (backend)** and **smx-frontend** applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Stripe Dashboard Setup](#stripe-dashboard-setup)
- [Backend Configuration (smx-api)](#backend-configuration-smx-api)
- [Frontend Configuration (smx-frontend)](#frontend-configuration-smx-frontend)
- [Webhook Configuration](#webhook-configuration)
- [Testing Setup](#testing-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide covers the complete Stripe integration setup for the SourceMedX platform, which includes:

- **Payment Processing** for search key purchases
- **Webhook Handling** for real-time payment status updates
- **Session Management** with success/cancel redirects
- **Security Best Practices** for API key management

### Architecture Overview
```
Frontend (smx-frontend) → Backend (smx-api) → Stripe API
                     ↙
Stripe Webhooks → Backend webhook endpoint
```

## ✅ Prerequisites

Before starting, ensure you have:

- **Stripe Account** (Test and Live modes)
- **Development Environment** set up for both applications
- **HTTPS URLs** for webhook endpoints (required by Stripe)
- **Access** to your domain's DNS settings (for production)

## 🏪 Stripe Dashboard Setup

### 1. Create Stripe Account
1. Visit [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in to your account
3. Complete business verification (for live mode)

### 2. Get API Keys
1. Navigate to **Developers** → **API keys**
2. Note down the following keys:

**Test Mode Keys:**
```
Publishable key: pk_test_...
Secret key: sk_test_...
```

**Live Mode Keys:**
```
Publishable key: pk_live_...
Secret key: sk_live_...
```

### 3. Configure Webhook Endpoint
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
   - **Production**: `https://staging-api.sourcemedx.com/api/webhooks/stripe`
4. Select events to listen for:
   - `all of checkout actions`
   - `all of payment_intent actions`
5. Click **Add endpoint**

6. Click **Signing secret** Copy the **Webhook signing secret** (starts with `whsec_`)

## ⚙️ Backend Configuration (smx-api)

### 1. Environment Variables Setup

Create or update your environment files:

**`.env.development`**
```env
# Stripe Configuration - Test Mode
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_SUCCESS_URL=http://localhost:3000/billing/stripe/successUrl
STRIPE_CANCEL_URL=http://localhost:3000/billing/stripe/cancelUrl

# Search Key Pricing Configuration
SEARCH_KEY_BASE_PRICE=10
SEARCH_KEY_EXPIRATION_DAYS=30
SEARCH_KEY_SMALL_BUNDLE=5
SEARCH_KEY_SMALL_DISCOUNT=5
SEARCH_KEY_LARGE_BUNDLE=20
SEARCH_KEY_LARGE_DISCOUNT=10
```

**`.env.production`**
```env
# Stripe Configuration - Live Mode
STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret_here
STRIPE_SUCCESS_URL=https://staging.sourcemedx.com/billing/stripe/successUrl
STRIPE_CANCEL_URL=https://staging.sourcemedx.com/billing/stripe/cancelUrl

# Search Key Pricing Configuration
SEARCH_KEY_BASE_PRICE=10
SEARCH_KEY_EXPIRATION_DAYS=30
SEARCH_KEY_SMALL_BUNDLE=5
SEARCH_KEY_SMALL_DISCOUNT=5
SEARCH_KEY_LARGE_BUNDLE=20
SEARCH_KEY_LARGE_DISCOUNT=10
```

### 2. Dependencies Installation

Ensure Stripe is installed:
```bash
cd smx-api
npm install stripe@^18.2.1
npm install @types/stripe --save-dev
```

### 3. Configuration Verification

Check that your `src/configs/config.ts` includes:
```typescript
stripe: {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000',
  cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000',
},
```

### 4. Raw Body Middleware Setup

For webhook signature verification, ensure raw body middleware is configured in your Express app:

```typescript
// In your express configuration
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }))
```

### 5. Webhook Route Setup

Ensure the webhook route is properly configured:
```typescript
// In your routes configuration
router.post('/webhooks/stripe', webhooksController.handleStripeWebhook.bind(webhooksController))
```

## 🎨 Frontend Configuration (smx-frontend)

### 1. Environment Variables Setup

**`.env.local` (for development)**
```env
# Stripe Configuration - Test Mode
NEXT_PUBLIC_STRIPE_PUBKEY=pk_test_your_test_publishable_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**`.env.production` (for production)**
```env
# Stripe Configuration - Live Mode
NEXT_PUBLIC_STRIPE_PUBKEY=pk_live_your_live_publishable_key_here

# API Configuration
NEXT_PUBLIC_API_URL=https://staging-api.sourcemedx.com/api
```

### 2. Dependencies Installation

Ensure Stripe.js is installed:
```bash
cd smx-frontend
npm install @stripe/stripe-js@^7.3.1
```

### 3. Stripe Service Implementation

Verify your `src/services/purchaseService.ts` is correctly configured:
```typescript
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBKEY!)

// Checkout function should handle errors gracefully
export async function checkout(count: number) {
  try {
    const res = await apiFetch<{ sessionId: string }>('/search-keys/checkout', {
      method: 'POST',
      body: { count },
    })
    
    const stripe = await stripePromise
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: res.sessionId })
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    // Handle error appropriately in your UI
  }
}
```

### 4. Webhook Monitoring

Monitor webhook delivery in Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Check the **Events** tab for delivery status
4. Use **Logs** tab for debugging failed deliveries

## 🧪 Testing Setup

### 1. Test Card Numbers

Use Stripe's test card numbers for testing:

| Card Number | Description |
|-------------|-------------|
| `4242424242424242` | Visa - Successful payment |
| `4000000000000002` | Visa - Card declined |
| `4000000000009995` | Visa - Insufficient funds |
| `4000000000000069` | Visa - Expired card |

### 2. Test Payment Flow

1. **Frontend**: Initiate checkout with test card
2. **Backend**: Verify session creation logs
3. **Webhook**: Check webhook delivery in Stripe Dashboard
4. **Database**: Confirm search keys are created

### 3. Local Testing Script

Create a test script to verify integration:

```bash
#!/bin/bash
# test-stripe-integration.sh

echo "Testing Stripe Integration..."

# Test 1: Create checkout session
echo "Creating checkout session..."
curl -X POST http://localhost:3001/api/search-keys/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-test-token" \
  -d '{"count": 5}'

# Test 2: Check webhook endpoint
echo "Testing webhook endpoint..."
curl -X POST http://localhost:3001/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'

echo "Integration test completed."
```

## 🚀 Production Deployment

### 1. Environment Configuration

**Production Checklist:**
- [ ] Live Stripe API keys configured
- [ ] Production webhook endpoint URL set
- [ ] HTTPS enabled for all endpoints
- [ ] Success/cancel URLs point to production domain
- [ ] Environment variables secured

### 2. Security Considerations

- **API Key Protection**: Never expose secret keys in frontend code
- **HTTPS Only**: All Stripe communication must use HTTPS
- **Webhook Signatures**: Always verify webhook signatures
- **Environment Separation**: Use different keys for staging/production

### 3. SSL Certificate Setup

Ensure your production domain has valid SSL certificates:
```bash
# If using Let's Encrypt with Certbot
sudo certbot --nginx -d api.yourdomain.com
```

### 4. Production Environment Variables

**Docker/Kubernetes deployment:**
```yaml
# docker-compose.yml or Kubernetes ConfigMap
environment:
  - STRIPE_SECRET_KEY=${STRIPE_LIVE_SECRET_KEY}
  - STRIPE_WEBHOOK_SECRET=${STRIPE_LIVE_WEBHOOK_SECRET}
  - STRIPE_SUCCESS_URL=https://staging.sourcemedx.com/billing/stripe/successUrl
  - STRIPE_CANCEL_URL=https://staging.sourcemedx.com/billing/stripe/cancelUrl
```

### 5. Monitoring Setup

Set up monitoring for production:
- **Webhook Delivery Monitoring**: Track failed webhook deliveries
- **Payment Success Rate**: Monitor successful payments
- **Error Tracking**: Log and alert on payment failures

## 🔧 Troubleshooting

### Common Issues

#### 1. Webhook Signature Verification Failed
**Problem**: `Invalid signature` errors in webhook handler

**Solutions:**
- Verify webhook secret is correct
- Ensure raw body is being used for signature verification
- Check that the endpoint URL matches exactly

#### 2. CORS Issues in Frontend
**Problem**: CORS errors when communicating with backend

**Solutions:**
```typescript
// In your backend CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
```

#### 3. Publishable Key Not Loading
**Problem**: Stripe object is null in frontend

**Solutions:**
- Verify `NEXT_PUBLIC_STRIPE_PUBKEY` is set correctly
- Ensure the key starts with `pk_test_` or `pk_live_`
- Check browser console for loading errors

#### 4. Checkout Session Creation Failed
**Problem**: Error creating Stripe checkout session

**Solutions:**
- Verify secret key has necessary permissions
- Check that all required parameters are provided
- Ensure success/cancel URLs are valid

### Debugging Commands

```bash
# Check environment variables
echo $STRIPE_SECRET_KEY
echo $NEXT_PUBLIC_STRIPE_PUBKEY

# Test webhook locally
stripe listen --forward-to localhost:3001/webhooks/stripe

# Verify Stripe CLI installation
stripe --version
```

### Log Analysis

Enable debug logging for Stripe:
```typescript
// In your service constructor
this.stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
  maxNetworkRetries: 3,
})
```

## 📚 Additional Resources

### Documentation Links
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Testing Guide](https://stripe.com/docs/testing)

### Development Tools
- [Stripe CLI](https://stripe.com/docs/stripe-cli) - Command line tool
- [Stripe Dashboard](https://dashboard.stripe.com) - Web interface
- [Webhook Testing Tool](https://webhook.site) - For webhook debugging

### Best Practices
- Always use test mode during development
- Implement proper error handling for all payment flows
- Log all payment-related activities for auditing
- Regular security audits of API key usage
- Monitor webhook delivery success rates

---

**Created with ❤️ by the SourceMedX Team**

> **Note**: This guide covers the current implementation. For questions or updates, please refer to the project documentation or contact the development team.