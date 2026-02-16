'use client';
import "@ant-design/v5-patch-for-react-19";

import { Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { SignInForm } from '@/components/auth/forms/signin-form';
import Link from "next/link";

import { FormTitle, FormNavigation, FormLayout } from '@/components/auth/ui/form';

export default function SignInPage() {
    return (
        <div className="relative">

            {/* Home Button Top Left */}
            <Link href="/student">
                <Button
                    icon={<ArrowLeftOutlined />}
                    className="absolute top-4 left-4 z-10"
                >
                    Trang chủ
                </Button>
            </Link>

            <FormLayout className="!h-[100vh]">
                <FormTitle 
                    title="Đăng nhập"
                    description="Chào mừng trở lại với EPIS"
                />
                <SignInForm/>
                <FormNavigation
                    href="/auth/signup"
                    textHref="Đăng ký"
                    description="Chưa có tài khoản?"
                />
            </FormLayout>

        </div>
    );
}
