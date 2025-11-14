import {Resend} from 'resend';
import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from '@/lib/db/auth-schema';
import {createAuthMiddleware, APIError} from "better-auth/api";
import bcrypt from 'bcryptjs';

// const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: authSchema,
    }),
   
    emailAndPassword:{
        enabled: true,
        requireEmailVerification: false, // Set to true if you want email verification
       
    },
    socialProviders:{
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },

    user : {
        additionalFields: {
            profileCompleted: {
                type: "boolean",
                required: true,
                defaultValue: null
            },

            gender: {
                type: "string",
                required: true,
                defaultValue: null
            },

            phoneNumber: {
                type: "string",
                required: true,
                defaultValue: null
            },

            province: {
                type: "string",
                required: true,
                defaultValue: null
            },

            // birthday: {
            //     type: "string", // Store as ISO string or timestamp
            //     required: true,
            // },

            role: {
                type: "string",
                required: true,
                defaultValue: null
            },

            // identityCardImage: {
            //     type: "string",
            //     required: false,
            // },

            // profileImage: {
            //     type: "string",
            //     required: false,
            // },

            
        }
    },
    
})
export type Session = typeof auth.$Infer.Session;

export type User = typeof auth.$Infer.Session.user;
