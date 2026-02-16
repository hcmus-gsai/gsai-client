'use client';
import "@ant-design/v5-patch-for-react-19";

import {useState} from "react";
import {Typography} from "antd";
import {ForgotPasswordForm} from '@/components/auth/forms/forgot-password-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';
import Image from "next/image";
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";

export default function ForgotPasswordPage() {
    return (

        <FormLayout
            className = "py-10"
        >
            <FormTitle
                title = "Quên mật khẩu"
                description = "Nhập địa chỉ email bạn sử dụng trên EPIS để nhận liên kết đặt lại mật khẩu"
            />
            <ForgotPasswordForm/>
        </FormLayout>
    )
}