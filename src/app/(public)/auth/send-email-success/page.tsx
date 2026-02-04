'use client';
import {Typography} from "antd";
import {FormTitle, FormNavigation, FormLayout} from '@/components/auth/ui/form';

export default function ResendLinkPage() {
    return (
        <FormLayout
        >
            <FormTitle 
                title = "Email đã được gửi"
                description = "Vui lòng kiểm tra hộp thư đến của bạn để tìm liên kết khôi phục mật khẩu. Đừng quên kiểm tra mục spam của bạn."
            />
            <FormNavigation
                href = "resend-link"
                textHref = "Đăng nhập"
                description = "Quay lại?"
            />
        </FormLayout>
    )
}