'use client';
import { Button, Form, Input, Select, Radio, InputRef, Upload } from 'antd';
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FormTitle } from '../ui/form';
import React, { useState, useRef, useEffect } from 'react';
import { X, XCircle } from "@deemlol/next-icons"
import { useRouter } from "next/navigation";
import { useGetUserProfileQuery, useUpdateUserProfileMutation, useUpdateUserAvatarMutation } from '@/store/api/[module]/userApi';



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
    const { data: userProfile } = useGetUserProfileQuery();
    const [updateAvatar] = useUpdateUserAvatarMutation();

    //Handle profile upload + display
    const profileInputRef = useRef<InputRef>(null);
    const [profileUpload, setProfileUpload] = useState<UploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    });


    const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const tempUrl = URL.createObjectURL(file);

        setProfileUpload({
            fileObj: file,          // giữ FILE
            previewUrl: tempUrl,    // chỉ để preview
            isValid: true,
            error: null
        });
    };


    useEffect(() => {
        if (userProfile) {
            formData.setFieldsValue({
                name: userProfile.full_name,
                phone: userProfile.phone_number,
                avatar_url: userProfile.avatar_url,
            });

            setProfileUpload({
                fileObj: null,
                previewUrl: userProfile.avatar_url || null,
                isValid: false,
                error: null
            });
        }
    }, [userProfile, formData]);

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
            };

            const { role } = await updateProfile(payload).unwrap();
            if (profileUpload.fileObj && profileUpload.previewUrl) {
                const formData = new FormData();
                formData.append('avatar', profileUpload.fileObj);
                await updateAvatar(formData).unwrap();
            }

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
                                fill
                                sizes="192px"
                                className="object-cover rounded-full"
                                priority
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
                    <p className="font-medium font-bold">Họ và tên</p>
                </div>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: false,
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
                    <p className="font-medium font-bold">Số điện thoại</p>
                </div>

                <Form.Item
                    name="phone"
                    rules={[
                        {
                            required: false,
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
                    <p className="font-medium font-bold">Giới tính</p>
                </div>

                <Form.Item
                    name="gender"
                    rules={[
                        {
                            required: false,
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
                    <p className="font-medium font-bold">Ngày sinh</p>
                </div>

                <Form.Item
                    name="dob"
                    rules={[
                        {
                            required: false,
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
                    <p className="font-medium font-bold">Tỉnh</p>
                </div>

                <Form.Item
                    name="location"
                    rules={[
                        {
                            required: false,
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