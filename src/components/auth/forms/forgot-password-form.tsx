'use client';
import "@ant-design/v5-patch-for-react-19";
import {Form, Input, Button, message} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
//TRy using zod

// import {z} from "zod";
// const ForgotPasswordSchema = z.object({
//     email: z.string().email({message: "Email không hợp lệ"}).min(1, {message: "Vui lòng nhập email"})
// });


const ForgotPasswordForm = () => {
    const router = useRouter();
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [loading, setLoading] = useState(false);

    const finishHandler = async () => {
        
    }

    const handleLoginWithLink = async () => {
        try {
            const email = formData.getFieldValue('email');
            
            if (!email) {
                message.error("Vui lòng nhập email");
                return;
            }

            // Logic cho đăng nhập bằng magic link (nếu cần)
            message.info("Tính năng đăng nhập bằng liên kết đang được phát triển");

        } catch (error: any) {
            message.error(error.message || "Có lỗi xảy ra");
        }
    }

    return (
        <Form
            form = {formData}
            name = "forgot-password"
            layout = "vertical"
            onFinish = {finishHandler}
        >
            <Form.Item
                name = "email"
                rules = {[
                    {
                        required: true,
                        message: 'Vui lòng nhập email'
                    },
                    {
                        type: 'email',
                        message: 'Email không hợp lệ'
                    }
                ]}
                className = "w-full"
            >
                <Input 
                    placeholder = "example@gmail.com"
                    className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                />
            </Form.Item>

            <Form.Item
                className = "w-full"
            >
                <Button
                    type = "primary"
                    htmlType = "submit"
                    className = "!form__button !w-[100%] !bg-blue-500 !hover:bg-blue-600"
                    loading = {loading}
                    disabled = {loading}
                >
                    Đặt lại mật khẩu
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
                name = "login-with-link"
                className = "w-full"
            >
                <Button
                    className = "!form__button !w-[100%] !bg-white !border !border-gray-300 !text-black"
                    onClick = {handleLoginWithLink}
                >
                    Đăng nhập bằng liên kết
                </Button>
            </Form.Item>
        </Form>
    )
}
export {ForgotPasswordForm};