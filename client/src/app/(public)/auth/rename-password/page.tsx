'use client';
import {useState} from "react";
import {Typography} from "antd";
import {RenamePasswordForm} from '@/components/auth/forms/rename-password-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function ResendLinkPage() {
    return (
        <FormLayout
        >
            <FormTitle 
                title = "Đặt lại mật khẩu"
                description = "Đặt lại mật khẩu mới và lưu lại để không quên nhé!"
            />
            <RenamePasswordForm/>
        </FormLayout>
    )
}