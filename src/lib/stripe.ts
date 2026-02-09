import Stripe from "stripe";

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

function createStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });
}

export function getStripe() {
  if (!globalForStripe.stripe) {
    globalForStripe.stripe = createStripeClient();
  }
  return globalForStripe.stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripe();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
