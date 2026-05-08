import { user } from "@/lib/db/schema/auth";
import { InferSelectModel } from "drizzle-orm";

export * from "./auth";

export type User = InferSelectModel<typeof user>;