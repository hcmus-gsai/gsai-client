'use client';

import {Button, Form, Input, Select, Radio} from 'antd';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FormTitle } from '../ui/form';
import {useState} from 'react';
import {authClient} from "@/lib/auth-client";

const ProfileCompletionForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const [isLoading, setIsLoading] = useState(false);
    const email = Form.useWatch('email', formData);
    const phoneNumber = Form.useWatch('phoneNumber', formData);
    const name = Form.useWatch('name', formData);
    const gender = Form.useWatch('gender', formData);
    const birthday = Form.useWatch('birthday', formData);
    const province = Form.useWatch('province', formData);
    const role = Form.useWatch('role', formData);
    const identityCard = Form.useWatch('identityCard', formData);

    const finishHandler = async() => {
        const data = formData.getFieldsValue();

        console.log(data);

        const response = await authClient.updateUser({
            name: data.name,
            profileCompleted: true,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            // birthday: data.birthday,
            province: data.province,
            role: data.role,
            // identityCardImage: data.identityCardImage,
            // profileImage: data.profileImage
        })

        if (response.error) {
            console.error(response.error.message);
        }
        else{
            console.log("Create user successfully");
            console.log(response);
        }
    }
    const provinces = [
        "Hà Nội",
        "Thành phố Hồ Chí Minh",
        "Hải Phòng",
        "Đà Nẵng",
        "Huế",
        "Cần Thơ",
        "Tuyên Quang",
        "Cao Bằng",
        "Lai Châu",
        "Lào Cai",
        "Thái Nguyên",
        "Điện Biên",
        "Lạng Sơn",
        "Sơn La",
        "Phú Thọ",
        "Bắc Ninh",
        "Quảng Ninh",
        "Hưng Yên",
        "Ninh Bình",
        "Thanh Hóa",
        "Nghệ An",
        "Hà Tĩnh",
        "Quảng Trị",
        "Quảng Ngãi",
        "Gia Lai",
        "Đắk Lắk",
        "Khánh Hòa",
        "Lâm Đồng",
        "Đồng Nai",
        "Tây Ninh",
        "Đồng Tháp",
        "An Giang",
        "Vĩnh Long",
        "Cà Mau"
    ];


    
      
    return (
        <Form
            form = {formData}
            name = "profile-completion"
            layout = "vertical"
            onFinish = {finishHandler}
        >
            <div className = "flex items-start justify-center w-full h-full pt-[2rem] gap-[1rem]">
                <div className = "flex flex-col items-center justify-start h-full w-full">
                    <Form.Item 
                        name = "profileImage"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng tải lên ảnh đại diện'
                            }
                        ]}
                        className = "w-full flex items-center justify-center"
                    >
                        
                        <div className = "w-[12rem] h-[12rem] flex items-center justify-center">
                            <Input type = "file" accept = "image/*"
                                className="absolute w-full h-full cursor-pointer !rounded-full opacity-0 bg-red-200 z-10"
                            />
                            <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                                className="absolute w-full h-full object-cover rounded-full cursor-pointer"
                            />
                        </div>
                        
                    </Form.Item>

                    <div className = "mb-2 w-full">
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
                        className = "w-full"
                    >
                        
                        <Input 
                            placeholder = "example@email.com"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />

                    </Form.Item>

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Số điện thoại<span className="text-red-500">*</span></p>
                    </div>

                    <Form.Item
                        name = "phoneNumber"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại'
                            },
                            {
                                pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                                message: 'Số điện thoại không hợp lệ'
                            }
                        ]}
                        className = "w-full"
                    >
                        <Input type = "number" placeholder = "+84 123 456 789"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Vai trò<span className="text-red-500">*</span></p>
                    </div>

                    <Form.Item
                        name = "role"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn vai trò'
                            }
                        ]}
                        className = "w-full"
                    >
                        <Radio.Group
                            buttonStyle = "solid"
                            className = "!w-full !flex !items-center !justify-center !gap-[1rem]"
                        >
                            <Radio.Button value="student" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Học sinh</Radio.Button>
                            <Radio.Button value="teacher" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Giáo viên</Radio.Button>
                        </Radio.Group>
                    </Form.Item>                    
                </div>

                <div className = "flex flex-col items-center justify-start h-full w-full">

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Họ và tên<span className="text-red-500">*</span></p>
                    </div>
                    <Form.Item
                        name = "name"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ và tên'
                            }
                        ]}
                        className = "w-full"
                    >
                        
                        <Input
                            placeholder = "Nguyen Van A"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Giới tính<span className="text-red-500">*</span></p>
                    </div>

                    <Form.Item
                        name = "gender"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn giới tính'
                            }
                        ]}
                        className = "w-full"
                    >
                        
                        <Radio.Group
                            buttonStyle = "solid"
                            className = "!w-full !flex !items-center !justify-center !gap-[1rem]"
                        >
                            <Radio.Button value="male" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nam</Radio.Button>
                            <Radio.Button value="female" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nữ</Radio.Button>
                        </Radio.Group>
                    </Form.Item>  

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Ngày sinh<span className="text-red-500">*</span></p>
                    </div>  

                    <Form.Item
                        name = "birthday"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập ngày sinh'
                            }
                        ]}
                        className = "w-full"
                    >
                        
                        <Input
                            type = "date" 
                            placeholder = "Ngày sinh" 
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />

                    </Form.Item>

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Tỉnh<span className="text-red-500">*</span></p>
                    </div>

                    <Form.Item
                        name = "province"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn tỉnh/thành phố'
                            }
                        ]}
                        className = "w-full"
                    >
                        
                        <Select
                            options = {provinces.map((province) =>{
                                return {
                                    value: province,
                                    label: province
                                }
                            })}
                            defaultValue = "Tỉnh"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <div className = "mb-2 w-full">
                        <p className="font-medium font-bold">Minh chứng<span className="text-red-500">*</span></p>
                    </div>

                    <Form.Item
                        name = "identityCardImage"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng tải lên minh chứng'
                            }
                        ]}
                        className = "w-full"
                    >
                        
                        <Input
                            type = "file"
                            accept = "image/*"
                            title = "Minh chứng"
                            placeholder = "Tải lên minh chứng"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]" 
                        />                       
                    </Form.Item>

                    <div className = "w-full mt-2">
                        <p className = "text-sm text-gray-500 w-full relative top-[-1rem]">&#8226; Giấy xác nhận hoặc thẻ học sinh/giáo viên có ghi rõ họ tên.</p>
                        <p className = "text-sm text-gray-500 w-full relative top-[-1rem]">&#8226; Tải tệp lên dưới dạng .pdf hoặc .png.</p>
                    </div>
                </div>
            </div>

            <Form.Item
                className = "flex items-center justify-center"
            >
                <Button
                    type = "primary"
                    htmlType = "submit"
                    className = "!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg_white)] !bg-[var(--color-secondary)] !rounded-full"
                >
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    )
}

export {ProfileCompletionForm};