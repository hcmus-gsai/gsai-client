'use client';
import {useState} from "react";
import {Typography} from "antd";
import {RenamePasswordForm} from '@/components/auth/forms/reset-password-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function ResendLinkPage() {
    return (
        <FormLayout
            className = "py-10"
        >
            <FormTitle 
                title = "Đặt lại mật khẩu"
                description = "Đặt lại mật khẩu mới và lưu lại để không quên nhé!"
            />
            <RenamePasswordForm/>
        </FormLayout>
    )
}

/**

Inject endpoint
import {EndpointBuilder} from "@reduxjs/toolkit/dist/query/endpointDefinitions";

export const makeCrudEndpoint = <T, E extends string>(
Entity: E,
path: string,
build: EndpointBuilder <any, any, any, any, any>

) => {
    return  {
    [Entity]: build.query<T, void>({
    }
}
*/