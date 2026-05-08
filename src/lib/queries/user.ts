import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/auth-client";
import type { User } from "@/lib/db/schema";

export const userQueries = createQueryKeys("user", {
  session: () => ({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await getSession();
      return (data.data?.user as User) || null;
    },
  }),
});

export function useSession() {
  return useQuery({
    ...userQueries.session(),
  });
}
