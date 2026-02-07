'use client';

import { Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SignUpForm } from '@/components/auth/forms/signup-form';
import Link from 'next/link';

import { FormTitle, FormNavigation, FormLayout } from '@/components/auth/ui/form';

export default function SignUpPage() {
  return (
    <div className="relative">

      {/* Top Left Home Button */}
      <Link href="/student">
        <Button
          icon={<ArrowLeftOutlined />}
          className="absolute top-4 left-4"
        >
          Trang chủ
        </Button>
      </Link>

      <FormLayout className="py-10">
        <FormTitle
          title="Đăng ký tài khoản"
          description="Nhập thông tin hoặc sử dụng đường liên kết tài khoản mạng xã hội"
        />
        <SignUpForm />
        <FormNavigation
          href="/auth/signin"
          textHref="Đăng nhập"
          description="Đã có tài khoản?"
        />
      </FormLayout>

    </div>
  );
}
