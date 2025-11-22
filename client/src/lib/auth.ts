import {betterAuth} from "better-auth";
import {nextCookies} from "better-auth/next-js";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from '@/lib/db/auth-schema';
import {createAuthMiddleware, APIError} from "better-auth/api";
import bcrypt from 'bcryptjs';

import {sendEmail} from '@/lib/email';

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);



export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: authSchema,
    }),
   
    emailAndPassword:{
        enabled: true,
        // requireEmailVerification: false, // Set to true if you want email verification

        sendResetPassword : async({user, url, token}, request) => {
            try {
                console.log(`Sending password reset email to: ${user.email}`);
                console.log(`Reset URL: ${url}`);
                
                await sendEmail({
                    sendTo: user.email,
                    email: process.env.FROM_EMAIL as string,
                    subject: "Đặt lại mật khẩu - GSAI",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>Yêu cầu đặt lại mật khẩu</h2>
                            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                            <p>Nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
                            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
                                Đặt lại mật khẩu
                            </a>
                            <p>Hoặc sao chép link sau vào trình duyệt:</p>
                            <p style="color: #666; word-break: break-all;">${url}</p>
                            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                            </p>
                        </div>
                    `,
                });
                
                console.log(`Password reset email sent successfully to: ${user.email}`);
            } catch (error) {
                console.error("Error sending password reset email:", error);
                throw error;
            }
        },
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

            birthday: {
                type: "string", // Store as ISO string (YYYY-MM-DD)
                required: true,
            },

            role: {
                type: "string",
                required: true,
                defaultValue: null
            },

            identityCardImage: {
                type: "string",
                required: false,
            },

            profileImage: {
                type: "string",
                required: false,
            },            
        }
    },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
