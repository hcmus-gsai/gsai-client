'use client';
import {useRouter} from 'next/navigation';
import {Form, Input,  Button, Checkbox} from "antd";
import {GoogleSignIn} from '../ui/form';
/*Tạo tính năng đăng nhập với Google*/

import Link from 'next/link';

/*============================== */

const SignUpForm = () => {

    const formInstance = Form.useForm();
    const formData = formInstance[0];

    const finishHandler = async()  => {
        console.log(formData.getFieldsValue());
    }

    return (
        <Form
            form = {formData}
            name = "sign-up"
            layout = "vertical"
            size = "large"
            initialValues = {{remember: false}}
            onFinish = {finishHandler}
        >
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
                name = "cofirmPassword"
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
                <Button type = "primary" htmlType = "submit" className = "!form__button !w-[100%]">
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