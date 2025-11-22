'use client';
import "@ant-design/v5-patch-for-react-19";
import {Form, Input, Button, message} from 'antd';
import {twMerge} from 'tailwind-merge';
import Image from 'next/image';
import {GoogleSignIn} from '../ui/form';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const RenamePasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [loading, setLoading] = useState(false);

    const finishHandler = async() => {
        try {
            setLoading(true);
            const data = formData.getFieldsValue();
            console.log(data);
            
            // Lấy token từ URL
            const token = searchParams.get('token');
            console.log(token);
            
            if(!token) {
                message.error("Token không hợp lệ hoặc đã hết hạn");
                return;
            }

            // Sử dụng better-auth's reset password API
            const response = await authClient.resetPassword({
                newPassword: data.password,
                token: token,
            });

            if(response.error) {
                message.error(response.error.message || "Đặt lại mật khẩu thất bại");
                return;
            }

            message.success("Đặt lại mật khẩu thành công!");
            
            // Redirect về trang đăng nhập sau 1.5s
            setTimeout(() => {
                router.push('/auth/signin');
            }, 1500);

        } catch (error: any) {
            message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form
            form = {formData}
            name = "check-mail"
            layout = "vertical"
            size = "large"
            onFinish = {finishHandler}
        >
            <div className = "mb-2">
                <p className="font-medium font-bold">Mật khẩu mới<span className="text-red-500">*</span></p>
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
                <Input.Password placeholder = "Nhập mật khẩu mới"
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

            <Form.Item>
                <Button 
                    type = "primary" 
                    htmlType = "submit" 
                    className = "!form__button !w-[100%]"
                >
                    Đặt lại mật khẩu
                </Button>
            </Form.Item>
        </Form>
    )
}

export {RenamePasswordForm}