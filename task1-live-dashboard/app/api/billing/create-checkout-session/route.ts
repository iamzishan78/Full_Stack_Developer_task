import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, paymentIntentId } = body;

    // Validate amount is provided and is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Stripe minimum is $0.50 (50 cents)
    const finalAmount = Math.max(Math.round(amount), 50);

    // Get the origin for success/cancel URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Metered Billing Session',
              description: 'Time-based billing session charge',
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/en/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/en/billing`,
      metadata: {
        type: 'metered_billing',
        payment_intent_id: paymentIntentId || '',
        requested_amount: amount.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
