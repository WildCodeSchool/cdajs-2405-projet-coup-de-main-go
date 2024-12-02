import { MiddlewareFn } from "type-graphql";

interface AuthContext {
  user: { id: string } | null;
}

export const checkUserId: MiddlewareFn<AuthContext> = (
  { context, args },
  next
) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  if (args.userId && args.userId !== context.user.id.toString()) {
    throw new Error("Unauthorized access");
  }

  return next();
};
