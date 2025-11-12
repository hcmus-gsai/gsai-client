import {Resend} from "resend";
interface EmailOptions {
    to: string;
    subject: string;
    text?:string;
    html?:string;
}

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendEmail({ to, subject, text, html }: EmailOptions) {
    if(!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not set");
    }

    if (!process.env.FROM_EMAIL) {
        throw new Error('FROM_EMAIL environment variable is required');
      }
    

    try {

    }
    catch(error) {
        console.error(error);
        
    }
}