import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { adminQueries } from "@/lib/queries/admin";
import { profileQueries } from "@/lib/queries/profile";
import { userQueries } from "@/lib/queries/user";

export const queries = mergeQueryKeys(
  userQueries,
  profileQueries,
  adminQueries,
);
