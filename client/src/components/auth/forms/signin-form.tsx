'use client';

import {Form, Input, Button} from 'antd';

/*Tạo tính năng đăng nhập với Google*/

import {twMerge} from 'tailwind-merge';
import Image from 'next/image';
import {GoogleSignIn} from '../ui/form';
import {useState} from 'react';
import {useNotification} from '@/lib/hooks/use-notification';
import Link from "next/link";
import { router } from 'better-auth/api';
import {useRouter} from "next/navigation";
const SignInForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [isLoading, setIsLoading] = useState(false);

    // const {notify} = useNotification();

    const router = useRouter();

    const finishHandler = async() => {

        const data = formData.getFieldsValue();
        setIsLoading(true);
       
        // const response = await signIn('credentials', {
        //     email: data.email,
        //     password : data.password,
        //     redirect: false,
        // });

        // if (!response?.error && response !== undefined) {
        //     notify({
        //         message: "Đăng nhập thành công",
        //         description: "Chào mừng bạn đến với EPIS"
        //     });
        // }else{
        //     notify({
        //         message: "Đăng nhập thất bại",
        //         description: "Vui lòng kiểm tra lại email và mật khẩu",
        //         notiType: 'error'
        //     })
        //     setIsLoading(false);
        // }

    }

    const email = Form.useWatch('email', formData);
    const password = Form.useWatch('password', formData);
    const handleGoogleSignIn = async() => {

    }

    
    return (
        <Form
            form = {formData}
            name = "sign-in"
            layout = "vertical"
            size = "large"
            initialValues = {{remember: true}}
            onFinish = {finishHandler}
        >
            <div className = "mb-2">
                <p className="font-medium font-bold">Email <span className="text-red-500">*</span></p>
            </div>
            
            <Form.Item
                name = "email"
                rules = {[
                    {
                        required: true,
                        message: 'Vui lòng nhập email'
                    },
                    {
                        type : "email",
                        message: 'Email không hợp lệ'
                    }
                ]}
            >
                
                <Input 
                    placeholder = "example@gmail.com"
                    className = "form__input"
                />
            </Form.Item>

            <div className = "mb-2">
                <p className="font-medium font-bold">Mật khẩu <span className="text-red-500">*</span></p>
            </div>

            <Form.Item 
                name = "password" 
                rules = {[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu'
                    }
                ]}
            >
                
                <Input.Password 
                    placeholder = "Nhập mật khẩu"
                    className = "form__input"
                />
                {/* <div className = "flex items-center justify-end">
                    <p className = "text-[var(--color-secondary)] font-md font-sm underline cursor-pointer"
                        onClick = {() => router.push("/auth/rename-password")}>
                            Quên mật khẩu?
                    </p>
                </div> */}
            </Form.Item>
            <p className = "flex items-center justify-end relative top-[-1rem]">
                    <span className = "text-[var(--color-secondary)] font-md font-sm underline cursor-pointer"
                        onClick = {() => router.push("/auth/rename-password")}
                    >Quên mật khẩu?</span>
            </p>

            <Form.Item>
                <Button
                    type = "primary"
                    htmlType = "submit"
                    disabled = {isLoading || !password || !email}
                    className = {`!form__button !w-[100%] ${
                        isLoading || !password || !email ?
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
                name = "google-sign-in"
            >
                <GoogleSignIn
                    className = "!w-[100%] !bg-white !border !border-gray-300 !text-black !py-[1rem]"
                />
            </Form.Item>
        </Form>
    )
}

export {SignInForm};