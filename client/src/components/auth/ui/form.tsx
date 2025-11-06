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
                <strong>{textHref}</strong>
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
                    'relative m-auto flex flex-col items-center justify-start max-w-2xl min-h-[600px] w-[500px] h-[607px] overflow-clip rounded-3xl shadow-xl',
                    className || 'bg-white',
                )
            }
        >
            <div className="content-start w-full h-full p-[2rem]">{children}</div>
        </div>
    )
}


export {FormTitle, FormNavigation, FormLayout};