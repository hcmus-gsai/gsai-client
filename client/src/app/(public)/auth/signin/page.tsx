'use client';
import "@ant-design/v5-patch-for-react-19";

import {useState} from "react";
import {Typography} from "antd";
import {SignInForm} from '@/components/auth/forms/signin-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function SignInPage() {
    return (
        <FormLayout
            className = "!h-[100vh]"
        >
            <FormTitle 
                title = "Đăng nhập"
                description = "Chào mừng trở lại với GSAI"
            />
            <SignInForm/>
            <FormNavigation
                href = "/auth/signup"
                textHref = "Đăng kí"
                description = "Chưa có tài khoản?"
            />
        </FormLayout>
    )
}