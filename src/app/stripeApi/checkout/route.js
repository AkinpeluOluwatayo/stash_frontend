import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// This will now work once the "tris" is removed from .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { items, shippingCost } = await request.json();

        if (!items || items.length === 0) {
            console.error(">>> Checkout Error: Cart is empty");
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        console.log(`>>> Creating Stripe Session for ${items.length} items`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        // Use title (from your Dashboard) or name (fallback)
                        name: item.title || item.name || "Product",
                        // Use imageUrl (from your Dashboard) or image (fallback)
                        images: item.imageUrl ? [item.imageUrl] : (item.image ? [item.image] : []),
                    },
                    unit_amount: Math.round(Number(item.price) * 100),
                },
                quantity: item.quantity || 1,
            })),
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            // Defaults to 0 if shippingCost is missing
                            amount: Math.round(Number(shippingCost || 0) * 100),
                            currency: 'usd'
                        },
                        display_name: 'Selected Shipping',
                    },
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/checkout`,
        });

        console.log(">>> Stripe Session Created Successfully");
        return NextResponse.json({ url: session.url });

    } catch (err) {
        console.error(">>> STRIPE TERMINAL ERROR:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}