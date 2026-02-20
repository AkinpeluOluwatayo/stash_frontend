import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        console.log(">>> Shipping Route Hit (MOCK MODE ENABLED)");

        const body = await request.json();
        const { addressTo } = body;

        // Log API Key status just to be sure your env is still working
        const API_KEY = process.env.SHIPPO_API_KEY;
        console.log(">>> API Key Present:", !!API_KEY);

        // --- MOCK LOGIC START ---
        // We simulate a 1-second delay so you can test your loading states
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // This is exactly what the Shippo API structure looks like
        const mockData = {
            rates: [
                {
                    object_id: "mock_rate_1",
                    provider: "USPS",
                    servicelevel: { name: "First Class Package" },
                    amount: "5.50",
                    currency: "USD",
                    estimated_days: 3,
                    provider_image_75: "https://shippo-static.s3.amazonaws.com/providers/75/usps.png"
                },
                {
                    object_id: "mock_rate_2",
                    provider: "UPS",
                    servicelevel: { name: "Ground" },
                    amount: "12.45",
                    currency: "USD",
                    estimated_days: 5,
                    provider_image_75: "https://shippo-static.s3.amazonaws.com/providers/75/ups.png"
                },
                {
                    object_id: "mock_rate_3",
                    provider: "FedEx",
                    servicelevel: { name: "Overnight" },
                    amount: "35.00",
                    currency: "USD",
                    estimated_days: 1,
                    provider_image_75: "https://shippo-static.s3.amazonaws.com/providers/75/fedex.png"
                }
            ]
        };

        console.log(">>> Returning Mock Rates to Frontend");
        return NextResponse.json({ success: true, rates: mockData.rates });
        // --- MOCK LOGIC END ---

        /* KEEPING THE REAL CODE COMMENTED OUT BELOW FOR LATER

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('https://api.goshippo.com/shipments/', {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Authorization': `ShippoToken ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address_from: {
                    name: "Stash Store",
                    street1: "123 Seller St",
                    city: "Los Angeles",
                    state: "CA",
                    zip: "90001",
                    country: "US",
                },
                address_to: {
                    name: addressTo?.name || "Customer",
                    street1: addressTo?.street || "1060 W Addison St",
                    city: addressTo?.city || "Chicago",
                    state: addressTo?.state || "IL",
                    zip: addressTo?.zip || "60613",
                    country: "US",
                },
                parcels: [{
                    length: 10, width: 10, height: 10, distance_unit: "in",
                    weight: 2, mass_unit: "lb",
                }],
                async: false,
            })
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ success: false, error: data.detail || "Shippo Error" }, { status: response.status });
        }

        return NextResponse.json({ success: true, rates: data.rates || [] });
        */

    } catch (error) {
        console.error(">>> ROUTE ERROR:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}