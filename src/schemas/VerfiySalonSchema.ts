import { z } from "zod";

export const SalonVerificationSchema=z.object({
    salonVerification:z.boolean(),
})