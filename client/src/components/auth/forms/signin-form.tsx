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

import {authClient} from '@/lib/auth-client';

import { auth } from '@/lib/auth';
const SignInForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [isLoading, setIsLoading] = useState(false);

    // const {notify} = useNotification();

    const router = useRouter();

    const finishHandler = async() => {

        const data = formData.getFieldsValue();
        //Load name from database correspond to email
        async function getUserName(email:string) {
            const {data: session, error} = await authClient.getSession();
            if (session) {
                const user = session.user;
                return user.name;
            }
            if (error) {
                throw new Error(error.message);
            }
            return null;
        }
        const userName = await getUserName(data.email);
        console.log("User name:", userName);
        setIsLoading(true);
        /*
        The if case here prevent a user 
        -> user signup only fill in the password + email and then
            -> Go to signin page and signin => this is not correct behavior
        -> Correct flow: user fill in (email+ password) -> redirect to profile completion page to fill in the rest of the value
        -> After that user can signin with email + password
        */
        if (!userName || userName === "" || userName === undefined) {
            throw new Error("User name not found");
        }

        const response = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })
        
        if (response.error) {
            throw new Error(response.error.message);
        }

        setIsLoading(false);
        return response;
    }

    const email = Form.useWatch('email', formData);
    const password = Form.useWatch('password', formData);


    const handleGoogleSignIn = async() => {
        try {
            const response = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            })
            if (response.error) {
                throw new Error(response.error.message);
            }
            console.log("Google sign-in response:", response);
            return response;
        }
        catch(error) {
            console.error("An unexpected error occurred during Google sign-in:", error);
        }
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
                
                <Button
                    type = "primary"
                    className = "!w-[100%] !bg-white !border !border-gray-300 !text-black !py-[1rem]"
                    onClick = {handleGoogleSignIn}
                >
                    Đăng nhập với google
                </Button>
            </Form.Item>
        </Form>
    )
}

export {SignInForm};