'use client';
import {useState} from "react";
import {Typography} from "antd";
import {ResendLinkForm} from '@/components/auth/forms/resend-link-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function ResendLinkPage() {
    return (
        <FormLayout
        >
            <FormTitle 
                title = "Kiểm tra hộp thư của bạn"
                description = "Chúng tôi đã gửi cho bạn một liên kết đăng nhập qua email tới name@email.com. Liên kết sẽ hết hạn trong thời gian ngắn."
            />
            <ResendLinkForm/>
            <FormNavigation
                href = "resend-link"
                textHref = "Đăng nhập"
                description = "Quay lại?"
            />
        </FormLayout>
    )
}