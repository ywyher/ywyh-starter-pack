import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth-client";
import type { Session, User } from "@/lib/db/schema";

export const userQueries = createQueryKeys("user", {
  session: () => ({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await getSession();
      if (error) throw new Error(error.message);
      return {
        session: data?.session as Session,
        user: data?.user as User,
      };
    },
  }),
});

export function useSession() {
  return useQuery({
    ...userQueries.session(),
  });
}
