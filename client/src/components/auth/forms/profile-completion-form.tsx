'use client';
import {Form, Input, Button, Radio} from 'antd';
import Image from "next/image";



const ProfileCompletionForm = () => {

    const formInstance = Form.useForm();
    const formData = formInstance[0];

    const finishHandler = async() => {


    }

    return (

        <Form
            form = {formData}
            name = "profile-completion"
            layout = "vertical"
            size = "large"
            onFinish = {finishHandler}
        >
            {/* Left section */}
            <div className = "flex flex-col gap-2">
                {/* Avatar */}
                <Form.Item>
                    <Image src = "/images/avatar.png" alt = "Avatar" width = {100} height = {100} />

                </Form.Item>

                <p className="font-medium font-bold">Email<span className="text-red-500">*</span></p>
                <Form.Item
                    name = "email"
                >
                    <Input
                        placeholder = "name@gmail.com"
                        className = "form__input"
                    />
                </Form.Item>

                <Form.Item
                    name = "phone_number"
                >
                    <Input
                        placeholder = "Số điện thoại"
                        className = "form__input"
                    />
                </Form.Item>

                <Form.Item>
                    <Radio.Group className = "flex gap-6">
                        <Radio value = "teacher">Giáo viên</Radio>
                        <Radio value = "student">Học sinh</Radio>
                    </Radio.Group>
                </Form.Item>
            </div>
            {/* Right section */}
            <div>

            </div>
            <Form.Item>

            </Form.Item>
        </Form>
    )
}