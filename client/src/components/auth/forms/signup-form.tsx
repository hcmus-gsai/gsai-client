'use client';

import {useRouter} from 'next/navigation';
import {Form, Input,  Button} from "antd";


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
            initialValues = {{remember: true}}
            onFinish = {finishHandler}
        >
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

            <Form.Item>
                <Button type = "primary" htmlType = "submit" className = "form__button">
                    Tham gia
                </Button>
            </Form.Item>

            
        </Form>
    )
}

export {SignUpForm}