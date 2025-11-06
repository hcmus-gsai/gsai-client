'use client';
import {useState} from 'react';
import {Typography} from 'antd';
import {SignUpForm} from '@/components/auth/forms/signup-form';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
const {Title, Paragraph} = Typography;

const FormTitle = ({title}:{title:string}) => {
    return (
        <Title>
            {title}
        </Title>
    )
}

const FormNavigation = ({
    href,
    textHref,
    description,
}:{
    href:string;
    textHref:string;
    description:string;
}) =>{
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
}) => {
    return (
        <div
            className={twMerge(
                'relative m-auto flex min-h-[600px] w-full max-w-3xl justify-between overflow-clip rounded-3xl p-12 shadow-xl',
                className || 'bg-white',
            )}
        >
            {/* {visibleBackground && (
                <Image
                    className="flex-[1] -translate-x-4 -translate-y-16 scale-125 object-contain"
                    src={formBackground}
                    alt="circle1"
                />
            )} */}
            <div className="flex-[1.4] content-center">{children}</div>
        </div>
    );

}
export default function SignUpPage() {
    return (
        <FormLayout>
            <FormTitle title = "Đăng ký tài khoản"/>
            <SignUpForm/>
            <FormNavigation
                href = "signin"
                textHref = "Đăng nhập"
                description = "Đã có tài khoản?"
            />
        </FormLayout>
    )
}