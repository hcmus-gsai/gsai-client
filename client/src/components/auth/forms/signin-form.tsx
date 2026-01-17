"use client";

import '@ant-design/v5-patch-for-react-19';
import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useSignInMutation } from '@/store/api/[module]/authApi';
import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';
import { GoogleSignIn } from '../ui/form';

const SignInForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [isLoading, setIsLoading] = useState(false);

    const [signIn] = useSignInMutation()
    const dispatch = useAppDispatch();

    const router = useRouter();

    const handleEmailPasswordSignIn = async () => {
        try {
            const data = formData.getFieldsValue();
            setIsLoading(true);

            const { role, accessToken, refreshToken } = await signIn({ email: data.email, password: data.password }).unwrap();


            // Redirect based on role
            if (role === 'student') {
                router.push('/student/home');
            } else if (role === 'teacher') {
                router.push('/teacher/home');
            } else {
                router.push('/');
            }

            dispatch(addNotification({
                type: 'success',
                message: 'Đăng nhập thành công',
                description: 'Chào mừng trở lại với EPIS',
                createdAt: Date.now(),
                isShown: false
            }));
        }
        catch (error) {
            console.error('Sign in failed:', error);
            dispatch(addNotification({
                type: 'error',
                message: 'Đăng nhập thất bại',
                description: 'Sai email hoặc mật khẩu',
                createdAt: Date.now(),
                isShown: false
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const email = Form.useWatch('email', formData);
    const password = Form.useWatch('password', formData);


    const handleGoogleSignIn = () => {
        // Redirect to backend Google OAuth endpoint
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        window.location.href = `${apiBaseUrl}/auth/google`;
    }


    return (
        <Form
            form={formData}
            name="sign-in"
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
            onFinish={handleEmailPasswordSignIn}
        >
            <div className="mb-2">
                <p className="font-medium font-bold">Email <span className="text-red-500">*</span></p>
            </div>

            <Form.Item
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập email'
                    },
                    {
                        type: "email",
                        message: 'Email không hợp lệ'
                    }
                ]}
            >
                <Input
                    placeholder="example@gmail.com"
                    className="form__input"
                />
            </Form.Item>

            <div className="mb-2">
                <p className="font-medium font-bold">Mật khẩu <span className="text-red-500">*</span></p>
            </div>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu'
                    }
                ]}
            >

                <Input.Password
                    placeholder="Nhập mật khẩu"
                    className="form__input"
                />

            </Form.Item>
            <p className="flex items-center justify-end relative top-[-1rem]">
                <span className="text-[var(--color-secondary)] font-md font-sm underline cursor-pointer"
                    onClick={() => router.push("/auth/rename-password")}
                >Quên mật khẩu?</span>
            </p>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isLoading || !password || !email}
                    className={`!form__button !w-[100%] ${isLoading || !password || !email ?
                        "!bg-gray-400 !cursor-not-allowed" : "!bg-blue-500 !hover:bg-blue-600"
                        }`}
                >
                    Đăng nhập
                </Button>
            </Form.Item>

            <Form.Item>
                <div className="flex items-center justify-center gap-3 w-full">
                    <span className="flex-1 h-[1px] bg-gray-300"></span>
                    <p className="text-gray-500 text-center whitespace-nowrap">Hoặc</p>
                    <span className="flex-1 h-[1px] bg-gray-300"></span>
                </div>
            </Form.Item>

            <Form.Item
                name="google-sign-in"
            >
                <GoogleSignIn
                    className="!w-[100%] !bg-white !border !border-gray-300 !text-black !py-[1rem]"
                />
            </Form.Item>
        </Form>
    )
}

export { SignInForm };