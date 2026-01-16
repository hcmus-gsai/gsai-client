'use client';
import { Button, Form, Input, Select, Radio, InputRef, Upload } from 'antd';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FormTitle } from '../ui/form';
import React, { useState, useRef, useEffect } from 'react';
import { X, XCircle } from "@deemlol/next-icons"
import { useRouter } from "next/navigation";
import { useUpdateUserProfileMutation } from '@/store/api/[module]/userApi';

//use cloudinary to upload image
import { CldUploadWidget } from "next-cloudinary";


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
    const phoneNumber = Form.useWatch('phoneNumber', formData);
    const name = Form.useWatch('name', formData);
    const gender = Form.useWatch('gender', formData);
    const birthday = Form.useWatch('birthday', formData);
    const province = Form.useWatch('province', formData);
    const router = useRouter();
    const [updateProfile] = useUpdateUserProfileMutation();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            formData.setFieldsValue({ email });
            return;
        }
        else {
            const raw = sessionStorage.getItem('signUpTempData');
            if (!raw) return;
            const { email, password, remember } = JSON.parse(raw);
            formData.setFieldsValue({ email, password, remember });
        }

    }, []);

    const handleCreateProfile = async () => {
        try {
            const data = formData.getFieldsValue();
            setIsLoading(true);

            const payload = {
                full_name: data.name,
                phone_number: data.phone,
                gender: data.gender,
                dob: data.dob,
                location: data.location,
                avatar_url: data.avatar_url,
            };

            const { role } = await updateProfile(payload).unwrap();

            // Redirect based on role
            if (role === 'student') {
                router.push('/student/home');
            } else if (role === 'teacher') {
                router.push('/teacher/home');
            } else {
                router.push('/');
            }

        } catch (error) {
            console.error("Create profile failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    //Handle profile upload + display
    const profileInputRef = useRef<InputRef>(null);
    const [profileUpload, setProfileUpload] = useState<UploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    });

    const handleProfileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) {
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

        const { signature } = await signatureResponse.json();

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

    return (
        <Form
            form={formData}
            name="profile-completion"
            layout="vertical"
            onFinish={() => { handleCreateProfile(); }}

            initialValues={{
                phoneNumber: "+84 123 456 789",
                province: "Hồ Chí Minh",
            }}
        >
            <div className="flex flex-col items-center justify-start w-full h-full pt-[2rem] max-w-[600px] mx-auto">
                <Form.Item
                    name="profileImage"
                    rules={[
                        {
                            required: false,
                            message: 'Vui lòng tải lên ảnh đại diện'
                        }
                    ]}
                    className="w-full flex items-center justify-center"
                >
                    {!profileUpload.previewUrl ? (
                        <div
                            onClick={() => profileInputRef.current?.focus()}
                            className="w-[12rem] h-[12rem] flex items-center justify-center"
                        >
                            <Input
                                type="file"
                                ref={profileInputRef}
                                accept="image/*"
                                onChange={handleProfileUpload}
                                className="absolute w-full h-full cursor-pointer !rounded-full opacity-0 bg-red-200 z-10"
                            />
                            <Image
                                src={EmptyLayout} alt="Empty Layout" width={0} height={0}
                                className="absolute w-full h-full object-cover rounded-full cursor-pointer"
                            />
                        </div>
                    ) : (
                        <div className="w-[12rem] h-[12rem] flex items-center justify-center">
                            <Image
                                src={profileUpload.previewUrl}
                                alt="Profile Image"
                                width={0}
                                height={0}
                                className="w-full h-full object-cover rounded-full cursor-pointer"
                            />
                            <Button
                                onClick={() => {
                                    setProfileUpload({
                                        fileObj: null,
                                        previewUrl: null,
                                        isValid: false,
                                        error: null
                                    });
                                }}
                                className="!absolute !top-[0.5rem] !right-[0.5rem] !bg-[var(--color-secondary)] !rounded-full !w-[2rem] !h-[2rem] !p-0 !z-10"
                            >
                                <XCircle className="!text-white !w-full !h-full" />
                            </Button>

                        </div>
                    )}
                </Form.Item>

                <Form.Item name="password" hidden>
                    <Input type="hidden" />
                </Form.Item>

                <div className="mb-2 w-full">
                    <p className="font-medium font-bold">Họ và tên<span className="text-red-500">*</span></p>
                </div>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập họ và tên'
                        }
                    ]}
                    className="w-full"
                >
                    <Input
                        placeholder="Nguyen Van A"
                        className="form__input !h-[3.375rem] !w-full !text-[1rem]"
                    />
                </Form.Item>

                <div className="mb-2 w-full">
                    <p className="font-medium font-bold">Số điện thoại<span className="text-red-500">*</span></p>
                </div>

                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại'
                        },
                        {
                            pattern: /^(0[3|5|7|8|9])+([0-9]{8})\b/,
                            message: 'Số điện thoại không hợp lệ'
                        }
                    ]}
                    className="w-full"
                >
                    <Input type="string" placeholder="+84 123 456 789"
                        className="form__input !h-[3.375rem] !w-full !text-[1rem]"
                    />
                </Form.Item>

                <div className="mb-2 w-full">
                    <p className="font-medium font-bold">Giới tính<span className="text-red-500">*</span></p>
                </div>

                <Form.Item
                    name="gender"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn giới tính'
                        }
                    ]}
                    className="w-full"
                >
                    <Radio.Group
                        buttonStyle="solid"
                        className="!w-full !flex !items-center !justify-center !gap-[1rem]"
                    >
                        <Radio.Button value="male" className="!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nam</Radio.Button>
                        <Radio.Button value="female" className="!h-[3.375rem] !w-full !text-[1rem] !rounded-md !flex !items-center !justify-center">Nữ</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <div className="mb-2 w-full">
                    <p className="font-medium font-bold">Ngày sinh<span className="text-red-500">*</span></p>
                </div>

                <Form.Item
                    name="dob"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập ngày sinh'
                        }
                    ]}
                    className="w-full"
                >
                    <Input
                        type="date"
                        placeholder="Ngày sinh"
                        className="form__input !h-[3.375rem] !w-full !text-[1rem]"
                    />
                </Form.Item>

                <div className="mb-2 w-full">
                    <p className="font-medium font-bold">Tỉnh<span className="text-red-500">*</span></p>
                </div>

                <Form.Item
                    name="location"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn tỉnh/thành phố'
                        }
                    ]}
                    className="w-full"
                >
                    <Select
                        options={provinces.map((province) => {
                            return {
                                value: province,
                                label: province
                            }
                        })}
                        value="Tỉnh"
                        className="form__input !h-[3.375rem] !w-full !text-[1rem]"
                    />
                </Form.Item>
            </div>

            <Form.Item
                className="flex items-center justify-center"
            >
                <Button
                    htmlType="submit"
                    className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)]"
                >
                    Lưu thông tin
                </Button>
            </Form.Item>
        </Form>
    )
}

export { ProfileCompletionForm };