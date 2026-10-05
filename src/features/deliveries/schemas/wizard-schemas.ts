import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                                Address schema                              */
/* -------------------------------------------------------------------------- */

const phoneRegex = /^[+\d\s()-]+$/;

export const addressSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone must be at least 10 characters")
    .max(15, "Phone must be at most 15 characters")
    .regex(phoneRegex, "Phone can only contain digits and + - ( )"),
  addressLine: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be at most 200 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(80, "City must be at most 80 characters"),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(15, "Postal code must be at most 15 characters"),
});

export type AddressValues = z.infer<typeof addressSchema>;

/* -------------------------------------------------------------------------- */
/*                               Parcel schema                                */
/* -------------------------------------------------------------------------- */

export const parcelSchema = z.object({
  parcelType: z
    .string()
    .trim()
    .min(2, "Parcel type must be at least 2 characters")
    .max(50, "Parcel type must be at most 50 characters"),
  weight: z
    .number({ message: "Weight is required" })
    .positive("Weight must be greater than 0")
    .max(1000, "Weight looks too large"),
  deliveryCharge: z
    .number({ message: "Delivery charge is required" })
    .min(0, "Delivery charge cannot be negative")
    .max(100000, "Delivery charge looks too large"),
  codAmount: z
    .number()
    .min(0, "COD amount cannot be negative")
    .max(1000000, "COD amount looks too large")
    .optional(),
});

export type ParcelValues = z.infer<typeof parcelSchema>;

/* -------------------------------------------------------------------------- */
/*                               Payment schema                               */
/* -------------------------------------------------------------------------- */

export const paymentSchema = z.object({
  paymentMethod: z.enum(["STRIPE", "COD"]),
});

export type PaymentValues = z.infer<typeof paymentSchema>;
