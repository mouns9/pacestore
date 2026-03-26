import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey);
  const { amount } = await req.json() as { amount: number };

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
