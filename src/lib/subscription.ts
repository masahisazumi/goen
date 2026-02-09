import { prisma } from "./prisma";

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const isPremium =
    subscription?.status === "active" &&
    subscription.stripeCurrentPeriodEnd.getTime() > Date.now();

  return {
    isPremium,
    plan: isPremium ? ("premium" as const) : ("free" as const),
    subscription,
  };
}
