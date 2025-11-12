import {Resend} from 'resend';
import {Pool} from "pg";
import {github} from "better-auth/social-providers";
import {nextCookies} from "better-auth/next-js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database : new Pool({
        connectionString: process.env.DATABASE_URL
    }),
    emailAndPassword:{
        enabled: true,
    },

    socialProviders:{
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }
    },
    plugins:[nextCookies()]
})