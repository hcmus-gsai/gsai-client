'use client';
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

export default function ResendLinkPage() {
    return (
        
        <FormLayout>
            <div className="relative">
                <div className="absolute top-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>
                <div className="absolute top-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientTopRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        priority
                    />
                </div>
            </div> 
            <FormTitle 
                title = "Hoàn thành Hồ sơ"
            />
            <ProfileCompletionForm/>
        </FormLayout>
    )
}