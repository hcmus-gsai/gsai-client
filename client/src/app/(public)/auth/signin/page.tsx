'use client';
import {useState} from "react";
import {Typography} from "antd";
import {SignInForm} from '@/components/auth/forms/signin-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function SignInPage() {
    return (
        <FormLayout>
            <FormTitle 
                title = "Đăng nhập"
                description = "Chào mừng trở lại với GSAI"
            />
            <SignInForm/>
            <FormNavigation
                href = "signin"
                textHref = "Đăng kí"
                description = "Chưa có tài khoản?"
            />
        </FormLayout>
    )
}