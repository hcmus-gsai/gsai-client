'use client';

import {Form, Input, Button} from 'antd';

/*Tạo tính năng đăng nhập với Google*/

import {twMerge} from 'tailwind-merge';
import Image from 'next/image';
import {GoogleSignIn} from '../ui/form';



const SignInForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    
    const finishHandler = async() => {
        console.log(formData.getFieldsValue());
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

            <Form.Item>
                <Button
                    type = "primary"
                    htmlType = "submit"
                    className = "!form__button !w-[100%]"
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