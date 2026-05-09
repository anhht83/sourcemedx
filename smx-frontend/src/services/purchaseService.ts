import { loadStripe } from '@stripe/stripe-js'
import { apiFetch } from '@/lib/fetch'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBKEY!)

// create checkout session
export async function checkout(count: number) {
  try {
    const res = await apiFetch<{ sessionId: string }>('/search-keys/checkout', {
      method: 'POST',
      body: {
        count,
      },
    })
    console.log('res:', res)
    const stripe = await stripePromise
    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: res.sessionId })
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    alert('Failed to create checkout session. Please try again later.')
  }
}
