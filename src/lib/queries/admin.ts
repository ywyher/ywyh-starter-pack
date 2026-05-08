import { createQueryKeys } from "@lukemorales/query-key-factory";
import { getUsers } from "@/app/admin/actions";
import type { User } from "@/lib/db/schema";

export const adminQueries = createQueryKeys("admin", {
  users: () => ({
    queryKey: ["users"],
    queryFn: async () => {
      return (await getUsers()) as Partial<User>[];
    },
  }),
});
