import { twMerge } from 'tailwind-merge';
import {Typography, Button} from 'antd';

import Link from 'next/link';
const {Title, Paragraph} = Typography;
import GoogleLogo from '../../../../public/shared/Google Logo.svg';
import {createAuthClient} from "better-auth/react";
import {adminClient, magicLinkClient} from "better-auth/client/plugins"
import Image from 'next/image';

const authClient = createAuthClient({
    plugins: [
        adminClient(), magicLinkClient()
    ]
});

interface GoogleSignInProps {
    children?:React.ReactNode;
    className?:string;
    callbackUrl?:string;
}

export function GoogleSignIn({
    children,
    className,
    callbackUrl = "/",
}:GoogleSignInProps) {
    const handleGoogleSignIn = async() => {
        try{
            await authClient.signIn.social({
                provider: "google",
                callbackURL: callbackUrl,
            })
        }
        catch(error){
            console.error("Google sign-in error:", error);
        }
    }

    return (
        <Button
            onClick = {handleGoogleSignIn}
            type = "primary"
            className = {twMerge('form__button', className)}
        >
            {/* <GoogleOutlined className = "!absolute !left-0 !pl-[1rem]"/> */}
            <div className = "absolute left-0 h-full w-[40px] flex items-center justify-center pl-[1rem]">
                <Image src = {GoogleLogo} alt = "Google Logo" width = {30} height = {30}/>
            </div>
            {children || 'Đăng nhập với Google'}
        </Button>
    )
}

const FormTitle = ({
    title,
    description = "",
}:{
    title:string;
    description?:string;
}) => {
    return (
        <Title className="text-center">
            <Paragraph className="!text-3xl !font-bold !m-0 !mb-2">{title}</Paragraph>
            {description && <Paragraph className = "!font-normal !m-0 !text-gray-400">{description}</Paragraph>}
        </Title>
    )
}

const FormNavigation = ({
    href,
    textHref,
    description
}:{
    href:string;
    textHref:string;
    description:string;
}) => {
    return (
        <Paragraph style={{ textAlign: 'center' }}>
            {description}{' '}
            <Link href={href}>
                <span className = "text-[var(--color-secondary)] font-md font-sm underline cursor-pointer">{textHref}</span>
            </Link>
        </Paragraph>
    )
}

const FormLayout = ({
    className,
    visibleBackground = true,
    children,
}:{
    className?:string;
    visibleBackground?:boolean;
    children:React.ReactNode;
})  => {

    return (
        <div
            className = {
                twMerge(
                    'relative m-auto overflow-clip w-full h-[100%] flex items-center justify-center',
                    className || 'bg-white',
                )
            }
        >
            <div className="content-start  p-[2rem] w-[31.25rem] flex flex-col space-y-6 rounded-[1.25rem] border border-gray-200 shadow-lg">{children}</div>
        </div>
        // h-[37.9375rem]
    )
}



export {FormTitle, FormNavigation, FormLayout};