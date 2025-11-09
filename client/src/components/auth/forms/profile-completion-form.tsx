'use client';

import {Button, Form, Input, Select, Radio} from 'antd';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FormTitle } from '../ui/form';

const ProfileCompletionForm = () => {
    const formInstance = Form.useForm();
    const formData = formInstance[0];
    const finishHandler = async() => {
        console.log(formData.getFieldsValue());
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
            className = "!rounded-md !shadow-md !w-[56rem] !h-[49rem] !flex !flex-col !items-center !justify-center !mx-auto !my-12 !overflow-clip"
        >
            <div className = "flex items-start justify-center w-full h-full pt-[2rem]">
                <div className = "flex flex-col items-center justify-start h-full w-full">
                    <Form.Item 
                        name = "profile-picture"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng tải lên ảnh đại diện'
                            }
                        ]}
                        className = "w-[25rem] flex items-center justify-center"
                    >
                        <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-[12rem] h-[12rem] object-cover rounded-full"
                        />
                    </Form.Item>

                    <Form.Item
                        name = "email"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập email'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2 w-full">
                            <p className="font-medium font-bold">Email<span className="text-red-500">*</span></p>
                        </div>
                        <Input 
                            placeholder = "example@email.com"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <Form.Item
                        name = "phone-number"
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
                        className = "w-[25rem]"

                    >
                        <div className = "mb-2 w-full">
                            <p className="font-medium font-bold">Số điện thoại<span className="text-red-500">*</span></p>
                        </div>
                        <Input type = "number" placeholder = "+84 123 456 789"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <Form.Item
                        name = "role"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn vai trò'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2 w-full">
                            <p className="font-medium font-bold">Vai trò<span className="text-red-500">*</span></p>
                        </div>
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
                    <Form.Item
                        name = "name"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ và tên'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2">
                            <p className="font-medium font-bold">Họ và tên<span className="text-red-500">*</span></p>
                        </div>
                        <Input
                            placeholder = "Nguyen Van A"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />
                    </Form.Item>

                    <Form.Item
                        name = "gender"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn giới tính'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2">
                           <p className="font-medium font-bold">Giới tính<span className="text-red-500">*</span></p>
                        </div>
                        <Radio.Group
                            buttonStyle = "solid"
                            className = "!w-full !flex !items-center !justify-center !gap-[1rem]"
                        >
                            <Radio.Button value="male" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nam</Radio.Button>
                            <Radio.Button value="female" className = "!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nữ</Radio.Button>
                        </Radio.Group>
                    </Form.Item>    

                    <Form.Item
                        name = "birthday"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng nhập ngày sinh'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2">
                           <p className="font-medium font-bold">Ngày sinh<span className="text-red-500">*</span></p>
                        </div>
                        <Input
                            type = "date" 
                            placeholder = "Ngày sinh" 
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]"
                        />

                    </Form.Item>

                    <Form.Item
                        name = "province"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng chọn tỉnh/thành phố'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2">
                           <p className="font-medium font-bold">Tỉnh<span className="text-red-500">*</span></p>
                        </div>
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

                    <Form.Item
                        name = "proof-of-identity"
                        rules = {[
                            {
                                required: true,
                                message: 'Vui lòng tải lên minh chứng'
                            }
                        ]}
                        className = "w-[25rem]"
                    >
                        <div className = "mb-2">
                            <p className="font-medium font-bold">Minh chứng<span className="text-red-500">*</span></p>
                        </div>
                        <Input
                            type = "file"
                            placeholder = "Minh chứng"
                            className = "form__input !h-[3.375rem] !w-full !text-[1rem]" 
                        />

                        <p>&#8226; Giấy xác nhận hoặc thẻ học sinh/giáo viên có ghi rõ họ tên.</p>
                        <p>&#8226; Tải tệp lên dưới dạng .pdf hoặc .png.</p>
                    </Form.Item>
                </div>
            </div>

            <Form.Item
                className = "flex items-center justify-center"
            >
                <Button
                    type = "primary"
                    className = "!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg_white)] !bg-[var(--color-secondary)] !rounded-full"
                >
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    )
}

export {ProfileCompletionForm};