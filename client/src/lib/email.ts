// import {Resend} from "resend";

// interface EmailOptions {
//     to: string;
//     subject: string;
//     text?:string;
//     html?:string;
// }

// const resend = new Resend(process.env.RESEND_API_KEY as string);
// console.log("Resend API key:", process.env.RESEND_API_KEY);

// export async function sendEmail({to, subject, text, html}: EmailOptions) {
//     if(!process.env.RESEND_API_KEY) {
//         throw new Error("RESEND_API_KEY is not set");
//     }

//     if (!process.env.FROM_EMAIL) {
//         throw new Error('FROM_EMAIL environment variable is required');
//     }

//     try {
//         const emailOptions: any = {
//             from: "Acme <onboarding@resend.dev>",
//             to,
//             subject,
//         };

//         if (html) {
//             emailOptions.html = html;
//         }

//         if (text) {
//             emailOptions.text = text;
//         }

//         const result = await resend.emails.send(emailOptions);
//         console.log("Result:", result);
//         if ('error' in result && result.error) {
//             console.error('Resend API error:', result.error);
//             const error = result.error as any;
//             throw new Error(
//                 `Resend API error: ${error.name || 'Unknown'} - ${error.error || error.message || 'Unknown error'}`,
//             );
//         }

//         return result;


//     }
//     catch(error) {
//         console.error('Failed to send email via Resend:', error);
//         if (error instanceof Error) {
//         throw error;
//         }
//         throw new Error('Failed to send email');
//     }
// }

//===============


'use server';
import {NextResponse} from "next/server";
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECEIVER = process.env.SITE_MAIL_RECEIVER;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 465,
    secure:true,
    auth: {
        user: SMTP_SERVER_USERNAME,
        pass: SMTP_SERVER_PASSWORD,
    }
})

interface EmailOptions {
    email: string;
    sendTo: string;
    subject: string;
    text?:string;
    html?: string;
}
export async function sendEmail({
    email,
    sendTo,
    subject,
    text,
    html
}: EmailOptions) {
    try {
        const isVerified = await transporter.verify();
        console.log('SMTP server is verified', isVerified);
    }
    catch(error) {
        throw new Error('Failed to send email')
    }

    const info = await transporter.sendMail({
        from: email,
        to: sendTo || SITE_MAIL_RECEIVER,
        subject: subject,
        text: text,
        html: html ? html : '',
    });

    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', SITE_MAIL_RECEIVER);
    return info;
}