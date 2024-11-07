"server only";

import { clerkClient } from "@clerk/nextjs/server";
import config from "@/tailwind.config";
import { prisma } from "@/lib/prisma";

export const isAuthorized = async (
  userId: string
): Promise<{ authorized: boolean; message: string }> => {
  if (!config?.payments?.enabled) {
    return {
      authorized: true,
      message: "Payments are disabled",
    };
  }

  const result = (await clerkClient()).users.getUser(userId);

  if (!result) {
    return {
      authorized: false,
      message: "User not found",
    };
  }

  try {
      const subscribed = await prisma.subscriptions.findMany({
      where: {userId: userId}
    })

    if (!subscribed)
      return {
        authorized: false,
        message: "Unexpected eroor, please try again later!",
      };

    if (subscribed && subscribed[0].status === "active") {
      return {
        authorized: true,
        message: "User is subscribed",
      };
    }

    return {
      authorized: false,
      message: "User is not subscribed",
    };
  } catch (error: any) {
    return {
      authorized: false,
      message: "Unexpected eroor, please try again later!",
    };
  }
};
