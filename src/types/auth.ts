import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Username should at least be 3 characters.")
  .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
  .transform((val) => val.toLowerCase());

export const emailSchema = z
  .email()
  .min(2, "Email should at least be 2 characters.")
  .transform((val) => val.toLowerCase());
export const passwordSchema = z
  .string()
  .min(4, "Password should at least be 4 characters.");
export const identifierSchema = z
  .string()
  .min(3, "Identifier should at least be 3 characters.");

export const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const usernameRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/;
