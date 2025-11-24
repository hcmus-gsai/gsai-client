'use client';
import {Button, Form, Input, Select, Radio, InputRef, Upload} from 'antd';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FormTitle } from '../ui/form';
import React, {useState, useRef, useEffect} from 'react';
import { X ,XCircle} from "@deemlol/next-icons"

//use cloudinary to upload image
import {CldUploadWidget} from "next-cloudinary";


export interface UploadState {
    fileObj: File | null;
    previewUrl: string | null;
    isValid: boolean;
    error: string | null;
};






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

    const createProfileHandler = async() => {
   
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

    //Handle profile profile, idetityCard upload + display
    const profileInputRef = useRef<InputRef>(null);
    const identityCardInputRef = useRef<InputRef>(null);
    const [profileUpload, setProfileUpload] = useState<UploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    });

    const [identityCardUpload, setIdentityCardUpload] = useState<UploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    })
    
    const handleProfileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const file = event.target.files?.[0];
        if(!file) {
            return;
        }
        //Resource Reference: https://stackoverflow.com/questions/74973640/cloudinary-image-upload


        const timestamp = Math.round(new Date().getTime() / 1000);
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const paramsToSign = {
            timestamp: timestamp,
            upload_preset: uploadPreset,
        }

        const signatureResponse = await fetch("/api/image-upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ paramsToSign }),
        });

        if (!signatureResponse.ok) {
            throw new Error("Failed to get signature");
        }

        const {signature} = await signatureResponse.json();

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        const currentFormData = new FormData();
        currentFormData.append("file", file);
        currentFormData.append("api_key", apiKey!);
        currentFormData.append("signature", signature);
        currentFormData.append("timestamp", timestamp.toString());
        currentFormData.append("upload_preset", uploadPreset!);
        
        const uploadResponse = await fetch(url, {
            method: "POST", 
            body: currentFormData
        });

        if (!uploadResponse.ok) {
            throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json();
        const secure_url = uploadData.secure_url;

        formData.setFieldsValue({
            profileImage: secure_url
        });

        setProfileUpload({
            fileObj: file,
            previewUrl: URL.createObjectURL(file),
            isValid: true,
            error: null
        });
    }

    const handleIdentityCardUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const paramsToSign = {
            timestamp: timestamp,
            upload_preset: uploadPreset,
        }
        const signatureResponse = await fetch("/api/image-upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({paramsToSign}),
        });

        if(!signatureResponse.ok) {
            throw new Error("Failed to get signature");
        }

        const signature = await signatureResponse.json();

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

        const currentFormData = new FormData();
        currentFormData.append("file", file);
        currentFormData.append("api_key", apiKey!);
        currentFormData.append("signature", signature);
        currentFormData.append("timestamp", timestamp.toString());

        const uploadResponse = await fetch(url, {
            method: "POST",
            body: currentFormData
        });

        if(!uploadResponse.ok) {
            throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json();
        const secure_url = uploadData.secure_url;

        formData.setFieldsValue({
            identityCardImage: secure_url
        })

        setIdentityCardUpload({
            fileObj: file,
            previewUrl: URL.createObjectURL(file),
            isValid: true,
            error: null
        });
    }
    //===================================

    return (
        <Form
            form = {formData}
            name = "profile-completion"
            layout = "vertical"
            onFinish = {() => {}}

            initialValues = {{
                email: "example@gmail.com",
                phoneNumber: "+84 123 456 789",
                province: "Hồ Chí Minh",
            }}
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
                        {!profileUpload.previewUrl ? (
                            <div
                                onClick = {() => profileInputRef.current?.focus()}
                                className = "w-[12rem] h-[12rem] flex items-center justify-center"
                            >
                                <Input
                                    type = "file"
                                    ref = {profileInputRef}
                                    accept = "image/*"
                                    onChange = {handleProfileUpload}
                                    className = "absolute w-full h-full cursor-pointer !rounded-full opacity-0 bg-red-200 z-10"
                                />
                                <Image 
                                    src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0} 
                                    className = "absolute w-full h-full object-cover rounded-full cursor-pointer"
                                />
                            </div>
                        ):(
                            <div className = "w-[12rem] h-[12rem] flex items-center justify-center">
                                <Image 
                                    src = {profileUpload.previewUrl}
                                    alt = "Profile Image"
                                    width = {0}
                                    height = {0}
                                    className = "w-full h-full object-cover rounded-full cursor-pointer"
                                />
                                <Button
                                    onClick={()=>{
                                        setProfileUpload({
                                            fileObj: null,
                                            previewUrl: null,
                                            isValid: false,
                                            error: null
                                        });
                                    }}
                                    className = "!absolute !top-[0.5rem] !right-[0.5rem] !bg-[var(--color-secondary)] !rounded-full !w-[2rem] !h-[2rem] !p-0 !z-10"
                                >
                                    <XCircle className = "!text-white !w-full !h-full"/>
                                </Button>

                            </div>
                        )}    
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
                            readOnly = {true}
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
                            value = "Tỉnh" //Fix issue link: https://stackoverflow.com/questions/61244343/defaultvalue-of-input-not-working-correctly-on-ant-design

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
                        
                        {identityCardUpload.previewUrl? (
                            <div className = "w-full h-[5rem]text-[1rem] cursor-pointer rounded-md flex items-center justify-start p-[0.75rem] cursor-pointer border border-gray-200">
                                
                                <Image
                                    src = {identityCardUpload.previewUrl}
                                    alt = "Identity Card Image"
                                    width = {0}
                                    height = {0}
                                    className = "w-full h-full object-cover"
                                />
                                <Button
                                    onClick = {() => {
                                        setIdentityCardUpload({
                                            fileObj: null,
                                            previewUrl: null,
                                            isValid: false,
                                            error: null
                                        });
                                    }}
                                    className = "!absolute !top-[0.5rem] !right-[0.5rem] !bg-[var(--color-secondary)] !rounded-full !w-[2rem] !h-[2rem] !p-0 !z-10"
                                >
                                    <XCircle className = "!text-white !w-full !h-full"/>
                                </Button>
                            </div>
                        ):(
                            <div className = "w-full h-[3.375rem] text-[1rem] cursor-pointer rounded-md flex items-center justify-start p-[0.75rem] cursor-pointer border border-gray-200 hover:border-[#4096ff]  transition-all duration-300">
                                <label 
                                    htmlFor = "identityCardImage"
                                    className = "w-full h-full cursor-pointer"
                                >
                                    <Input
                                        type = "file"
                                        id = "identityCardImage"
                                        accept = "application/png, application/jpeg"
                                        onChange = {handleIdentityCardUpload}
                                        className = "!hidden" 
                                    />
                                    <p className = "!text-[1rem] ">Tải lên minh chứng</p>
                                </label>                       
                            </div>
                        )}
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