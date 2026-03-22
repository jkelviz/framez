import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string || "sk_test_dummy", {
    apiVersion: "2024-04-10",
    appInfo: {
        name: "FrameZ",
        version: "0.1.0",
    },
});
