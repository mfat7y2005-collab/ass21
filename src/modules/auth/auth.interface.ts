

import { z } from "zod";


export interface TLoginDTO {
    email: string;
    password: string;
    FCM?: string;
}


export interface TLoginResponse {
    token: string;
}



export interface TSignupDTO {
    email: string;
    password: string;
    FCM?: string;
}


export interface TSignupResponse {
    message: string;
    token?: string;
}


/* =========================
   ZOD SCHEMAS (اختياري لكن أفضل)
========================= */

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    FCM: z.string().optional(),
});

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    FCM: z.string().optional(),
});

/* لو حابب تستخرج types من Zod (أفضل حل) */
export type LoginDTO = z.infer<typeof loginSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;