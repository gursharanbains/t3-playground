import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(5, "Email should have a minimum of 5 characters")
    .email("You must enter a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(7, "Password should have a minimum 7 characters"),
});

export type LoginData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, "Full name is required"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(1, "Email is required")
    .email("Email is invalid"),
  photo: z.string().optional(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
