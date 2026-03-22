import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string || "whsec_dummy"
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const session = event.data.object as any;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const photographerId = session.metadata.photographerId;

        await supabase
            .from("photographers")
            .update({
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscription.id,
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                plan: "pro", // Upgrade user plan
            } as any)
            .eq("id", photographerId);
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await supabase
            .from("photographers")
            .update({
                stripe_price_id: subscription.items.data[0].price.id,
                stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            } as any)
            .eq("stripe_subscription_id", subscription.id);
    }

    return new NextResponse(null, { status: 200 });
}
