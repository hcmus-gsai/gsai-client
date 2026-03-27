'use client';
import "@ant-design/v5-patch-for-react-19";

import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {ForgotPasswordForm} from '@/components/auth/forms/forgot-password-form';
import Link from "next/link";
import {FormTitle, FormLayout} from '@/components/auth/ui/form';

export default function ForgotPasswordPage() {
    return (
        <div className="relative">
            <Link href="/auth/signin">
                <Button
                    icon={<ArrowLeftOutlined />}
                    className="absolute top-4 left-4 z-10"
                >
                    Đăng nhập
                </Button>
            </Link>

            <FormLayout
                className = "py-10"
            >
                <FormTitle
                    title = "Quên mật khẩu"
                    description = "Nhập địa chỉ email bạn sử dụng trên EPIS để nhận liên kết đặt lại mật khẩu"
                />
                <ForgotPasswordForm/>
            </FormLayout>
        </div>
    )
}