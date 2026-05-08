import type { InferSelectModel } from "drizzle-orm";
import type { session, user } from "@/lib/db/schema/auth";

export * from "./auth";

export type User = InferSelectModel<typeof user>;
export type Session = InferSelectModel<typeof session>;
