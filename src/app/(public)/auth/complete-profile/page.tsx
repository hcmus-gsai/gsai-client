'use client';
import "@ant-design/v5-patch-for-react-19";
import {useState} from "react";
import {Typography} from "antd";
import {ProfileCompletionForm} from '@/components/auth/forms/profile-completion-form';
import Link from "next/link";
import {twMerge} from "tailwind-merge";
const {Title, Paragraph} = Typography;
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';
import Image from "next/image";
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";

export default function CompleteProfilePage() {
    return (
        
        <FormLayout
            formWidth = "w-[64%]" //910px
            className = "py-10"
        >
            <FormTitle 
                title = "Hoàn thành Hồ sơ"
            />
            <ProfileCompletionForm/>
        </FormLayout>
    )
}