import { z } from "zod";

// Basic name validation (Slice 1)
export const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long")
});

// Full affidavit schema (future slices)
export const affidavitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  fatherName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  age: z
    .number()
    .min(1)
    .max(120)
    .optional(),

  address: z
    .string()
    .trim()
    .max(500)
    .optional(),

  purpose: z
    .string()
    .trim()
    .max(500)
    .optional()
});
