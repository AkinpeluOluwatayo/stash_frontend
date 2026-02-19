import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { addressTo, parcel } = await request.json();
        const API_KEY = process.env.SHIPPO_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({ success: false, error: "API Key missing" }, { status: 500 });
        }

        // Create a timeout so the request doesn't stay "pending" forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        console.log("Connecting to Shippo for Zip:", addressTo?.zip);

        const response = await fetch('https://api.goshippo.com/shipments/', {
            method: 'POST',
            headers: {
                'Authorization': `ShippoToken ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
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
                    name: addressTo.name || "Customer",
                    street1: addressTo.street || "1060 W Addison St",
                    city: addressTo.city || "Chicago",
                    state: addressTo.state || "IL",
                    zip: addressTo.zip,
                    country: "US",
                },
                parcels: [{
                    length: 10,
                    width: 10,
                    height: 10,
                    distance_unit: "in",
                    weight: 2,
                    mass_unit: "lb",
                }],
                async: false,
            })
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                error: data.detail || "Invalid Address or API error"
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            rates: data.rates || []
        });

    } catch (error) {
        console.error("Fetch Error:", error.message);

        // Specific message for Nigeria/Network issues
        const errorMsg = error.name === 'AbortError'
            ? "Connection timed out. Check your internet."
            : `Network Error: ${error.message}`;

        return NextResponse.json({
            success: false,
            error: errorMsg
        }, { status: 500 });
    }
}