import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { items, shippingCost } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const line_items = items.map(item => {
            const unitAmount = Math.round(Number(item.price) * 100);

            if (unitAmount <= 0) {
                throw new Error(`Invalid price for item: ${item.title}`);
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title || "Product",
                        images: item.imageUrl ? [item.imageUrl] : [],
                    },
                    unit_amount: unitAmount,
                },
                quantity: parseInt(item.quantity) || 1,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: Math.round(Number(shippingCost || 0) * 100),
                            currency: 'usd'
                        },
                        display_name: 'Standard Shipping',
                    },
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/checkout`,
        });

        return NextResponse.json({ url: session.url });

    } catch (err) {
        console.error(">>> STRIPE TERMINAL ERROR:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}