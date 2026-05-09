export const calculatePrice = (count: number) => {
  const PRICE_PER_KEY = Number(process.env.NEXT_PUBLIC_PRICE_PER_KEY) || 10
  const DISCOUNT_5 = Number(process.env.NEXT_PUBLIC_DISCOUNT_5) || 0.05
  const DISCOUNT_10 = Number(process.env.NEXT_PUBLIC_DISCOUNT_5) || 0.1
  const subtotal = count * PRICE_PER_KEY

  let discount = 0
  let discountPercentage = 0
  if (count >= 20) {
    discountPercentage = DISCOUNT_10
  } else if (count >= 5) {
    discountPercentage = DISCOUNT_5
  }
  discount = subtotal * discountPercentage

  const tax = 0 // Placeholder

  return {
    subtotal,
    discount,
    discountPercentage,
    total: subtotal - discount + tax,
  }
}
