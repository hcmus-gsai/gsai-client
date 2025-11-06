'use client';

import {Form, Input, Button} from 'antd';

/*Tạo tính năng đăng nhập với Google*/

import {twMerge} from 'tailwind-merge';
import Image from 'next/image';
import {GoogleSignIn} from '../ui/form';


const ResendLinkForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];

    const finishHandler = async() => {
        console.log(formData.getFieldsValue());
    }

    return (
        <Form
            form = {formData}
            name = "check-mail"
            layout = "vertical"
            size = "large"
            onFinish = {finishHandler}
        >
            <Form.Item
                name = "resend-link"
            >
                <Button
                    type = "primary"
                    htmlType = "submit"
                    className = "!form__button !w-[100%] !bg-white !border !border-blue-500 !text-blue-500 !py-[1rem]"
                >
                    Gửi liên kết lại
                </Button>

                <div className = "flex items-center justify-center gap-2 w-full">
                    <p className = "text-gray-500 font-normal font-sm">Không thể tìm thấy liên kết? Hãy kiểm tra mục spam của bạn.</p>
                </div>

            </Form.Item>
        </Form>
    )
}

export {ResendLinkForm}