'use client';
import "@ant-design/v5-patch-for-react-19";
import {Form, Input, Button, message} from "antd";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUser } from "@/lib/db/queries";
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
        try {
            setLoading(true);
            const email = formData.getFieldValue('email');

            if(!email) {
                message.error("Vui lòng nhập email");
                return;
            }

            // Kiểm tra email có tồn tại trong database không
            const users = await getUser(email);
            console.log(email);

            if (!users || users.length === 0) {
                message.error("Email không tồn tại trong hệ thống");
                return;
            }

            const { data, error } = await authClient.requestPasswordReset({
                email: email,
                redirectTo: `/auth/reset-password`,
            });

            if (error) {
                console.error("Password reset error:", error);
                message.error(error.message || "Có lỗi xảy ra khi gửi email");
                return;
            }

            message.success("Đã gửi link đặt lại mật khẩu đến email của bạn!");
            // setTimeout(() => {
            //     router.push("/auth/check-email");
            // }, 1500);

        } catch (error: any) {
            console.error("Caught error:", error);
            message.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setLoading(false);
        }
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