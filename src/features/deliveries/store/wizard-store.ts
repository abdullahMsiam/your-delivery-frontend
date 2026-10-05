"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AddressInput, PaymentMethod } from "@/src/types";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface WizardState {
  /* step 1: pickup address */
  pickupAddress: AddressInput;

  /* step 2: delivery address */
  deliveryAddress: AddressInput;

  /* step 3: parcel details */
  parcelType: string;
  weight: number | "";
  deliveryCharge: number | "";
  codAmount: number | "";

  /* step 4: payment */
  paymentMethod: PaymentMethod;

  /* actions */
  setPickupAddress: (v: AddressInput) => void;
  setDeliveryAddress: (v: AddressInput) => void;
  setParcel: (v: {
    parcelType: string;
    weight: number | "";
    deliveryCharge: number | "";
    codAmount: number | "";
  }) => void;
  setPaymentMethod: (v: PaymentMethod) => void;
  reset: () => void;
}

const EMPTY_ADDRESS: AddressInput = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
};

const initial = {
  pickupAddress: EMPTY_ADDRESS,
  deliveryAddress: EMPTY_ADDRESS,
  parcelType: "",
  weight: "" as const,
  deliveryCharge: "" as const,
  codAmount: "" as const,
  paymentMethod: "STRIPE" as PaymentMethod,
};

/* -------------------------------------------------------------------------- */
/*                                   Store                                    */
/* -------------------------------------------------------------------------- */

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      ...initial,

      setPickupAddress: (v) => set({ pickupAddress: v }),
      setDeliveryAddress: (v) => set({ deliveryAddress: v }),
      setParcel: (v) =>
        set({
          parcelType: v.parcelType,
          weight: v.weight,
          deliveryCharge: v.deliveryCharge,
          codAmount: v.codAmount,
        }),
      setPaymentMethod: (v) => set({ paymentMethod: v }),
      reset: () => set(initial),
    }),
    {
      name: "yd-delivery-wizard",
      storage: createJSONStorage(() => sessionStorage), // per-tab; safer than localStorage
    },
  ),
);
