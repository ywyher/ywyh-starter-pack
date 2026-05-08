import type { InferSelectModel } from "drizzle-orm";
import type { user } from "@/lib/db/schema/auth";

export * from "./auth";

export type User = InferSelectModel<typeof user>;
