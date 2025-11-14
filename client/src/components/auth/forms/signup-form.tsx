'use client';
import '@ant-design/v5-patch-for-react-19';
import {useRouter} from 'next/navigation';
import {Form, Input,  Button, Checkbox} from "antd";
import {GoogleSignIn} from '../ui/form';
/*Tạo tính năng đăng nhập với Google*/

import Link from 'next/link';
import {useState} from 'react';
import {useNotification} from '@/lib/hooks/use-notification';
import {authClient} from '@/lib/auth-client';
/*============================== */

const SignUpForm = () => {

    const formInstance = Form.useForm();
    const formData = formInstance[0];

    const router = useRouter();
    const finishHandler = async()  => {

        try {
            const data = formData.getFieldsValue();

            const defaultName = data.email.split('@')[0];
            const defaultGender = "";
            const defaultPhoneNumber = "";
            const defaultBirthday = new Date();
            const defaultProvince = "";
            const defaultRole = "STUDENT";
            const defaultIdentityCardImage = "";
            const defaultProfileCompleted = false;
            const defaultProfileImage = "";
            setIsLoading(true);
            
            const response = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: defaultName,
                profileCompleted: defaultProfileCompleted,
                gender: defaultGender,
                phoneNumber: defaultPhoneNumber,
                // birthday: defaultBirthday,
                province: defaultProvince,
                role: defaultRole,

                // identityCardImage: defaultIdentityCardImage,
                // profileImage: defaultProfileImage
            });

            if (response.error) {
                setIsLoading(false);
                throw new Error(response.error.message);
            }

            // Redirect to complete profile page
            router.push("/auth/complete-profile");
            return response;
        }
        catch(error) {
            setIsLoading(false);
            console.error("An unexpected error occurred during sign-up:", error);
        }
    }

    const [isLoading, setIsLoading] = useState(false);

    const email = Form.useWatch('email', formData);
    const password = Form.useWatch('password', formData);
    const confirmPassword = Form.useWatch('confirmPassword', formData);
    const remember = Form.useWatch('remember', formData);

    return (
        <Form
            form = {formData}
            name = "sign-up"
            layout = "vertical"
            size = "large"
            initialValues = {{remember: false}}
            onFinish = {finishHandler}
        >
            {/* <div className = "mb-2">
                <p className="font-medium font-bold">Họ tên<span className="text-red-500">*</span></p>
            </div>
            <Form.Item
                name = "name"
            >
                <Input placeholder = "Nguyen Van A" className = "form__input" />
            </Form.Item> */}

            <div className = "mb-2">
                <p className="font-medium font-bold">Email<span className="text-red-500">*</span></p>
            </div>

            <Form.Item
                name = "email"
                rules = {[
                    {
                        required: true,
                        message: 'Vui lòng nhập email'
                    }
                ]}
            >
                <Input 
                    placeholder = "name@gmail.com"
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
                    },
                    {
                        min: 8,
                        message: 'Mật khẩu phải có ít nhất 8 ký tự'
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message: 'Mật khẩu phải có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số và 1 ký tự đặc biệt'
                    }
                ]}
            >
                <Input.Password placeholder = "Tạo mật khẩu"
                    className = "form__input"
                />
            </Form.Item>

            <div className = "mb-2">
                <p className="font-medium font-bold">Nhập lại mật khẩu<span className="text-red-500">*</span></p>
                <p className="text-gray-500 font-normal font-sm">Gồm chữ thường, chữ hoa, số và dài hơn 8 kí tự</p>
            </div>

            <Form.Item
                name = "confirmPassword"
                rules = {[
                    {
                        required: true,
                        message: 'Vui lòng nhập lại mật khẩu'
                    },
                    {
                        validator: (_, value) => {
                            if (value !== formData.getFieldValue('password')) {
                                return Promise.reject(new Error('Mật khẩu không khớp'));
                            }
                            return Promise.resolve();
                        }
                    }
                ]}
            >
                <Input.Password placeholder = "Nhập lại mật khẩu"
                    className = "form__input"
                />
            </Form.Item>

            <Form.Item
                name = "remember"
                valuePropName = "checked"
                className = "!mt-[-15px]"
            >
                <div className = "flex items-start gap-2">
                    <Checkbox
                        name = "remember"
                        className = "form__checkbox !mt-1"
                    />
                    <span className = "text-gray-500 font-normal font-sm">
                        Tôi đã đọc và đồng ý với <Link href = "/privacy-policy">Điều khoản và điều kiện</Link> cùng <Link href = "/privacy-policy">Chính sách bảo mật</Link> của GSAI
                    </span>
                </div>
            </Form.Item>

            <Form.Item>
                <Button 
                    type = "primary" 
                    htmlType = "submit" 
                    disabled = {isLoading || !password || !email || !confirmPassword || !remember}
                    className = {`!form__button !w-[100%] ${
                        isLoading || !password || !email || !confirmPassword || !remember ?
                        "!bg-gray-400 !cursor-not-allowed" : "!bg-blue-500 !hover:bg-blue-600"
                    }`}
                >
                    Đăng ký
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

export {SignUpForm}