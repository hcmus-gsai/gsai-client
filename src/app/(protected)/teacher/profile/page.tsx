'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FooterSection } from "@/components/guest/ui/guest";
import { InputRef, Input, Button, Form, Radio, Select, Modal } from 'antd';
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { XCircle } from "@deemlol/next-icons";
import { EditOutlined } from "@ant-design/icons";

import { useDeleteUserAvatarMutation, useGetUserProfileQuery, useUpdateUserAvatarMutation, useUpdateUserProfileMutation } from '@/store/api/[module]/userApi';
import { useAppDispatch } from '@/store/hook';
import { addNotification } from '@/store/slice/notifySlice';


export interface IUploadState {
    fileObj: File | null;
    previewUrl: string | null;
    isValid: boolean;
    error: string | null;
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


const ProfileModal = ({ isOpen, onClose, children }: {
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative bg-[var(--color-bg-white)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] rounded-[20px] p-4 w-[500px] flex flex-col items-center justify-top" onClick={(e) => e.stopPropagation()}>
                <Button
                    className="!w-[2rem] !h-[2rem] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md !absolute !top-2 !right-2"
                    onClick={onClose}
                >
                    <XCircle className="!text-white !w-full !h-full" />
                </Button>
                {children}
            </div>
        </div>
    )
}



export default function PersonalProfilePage() {
    const [isClient, setIsClient] = useState(false);


    useEffect(() => {
        setIsClient(true)
    }, [])

    const [profileUpload, setProfileUpload] = useState<IUploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const dispatch = useAppDispatch();

    const [updateUserAvatar] = useUpdateUserAvatarMutation();
    const [deleteUserAvatar] = useDeleteUserAvatarMutation();
    const previousAvatarRef = useRef<string | null>(null);


    const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const tempUrl = URL.createObjectURL(file);

        previousAvatarRef.current = profileUpload.previewUrl;

        setProfileUpload({
            fileObj: file,
            previewUrl: tempUrl,
            isValid: true,
            error: null
        });

        Modal.confirm({
            title: 'Xác nhận đổi ảnh đại diện',
            content: 'Bạn có chắc chắn muốn đổi ảnh đại diện không?',
            okText: 'Có',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    const formData = new FormData();
                    formData.append('avatar', file);

                    await updateUserAvatar(formData).unwrap();

                    dispatch(addNotification({
                        type: 'success',
                        message: 'Thành công',
                        description: 'Đổi ảnh đại diện thành công',
                        createdAt: Date.now(),
                        isShown: false
                    }));
                } catch (err) {
                    setProfileUpload(prev => ({
                        ...prev,
                        previewUrl: previousAvatarRef.current
                    }));

                    dispatch(addNotification({
                        type: 'error',
                        message: 'Lỗi',
                        description: 'Đổi ảnh đại diện thất bại',
                        createdAt: Date.now(),
                        isShown: false
                    }));
                }
            },
            onCancel() {
                setProfileUpload(prev => ({
                    ...prev,
                    previewUrl: previousAvatarRef.current
                }));
            }
        });
    };


    const handleDeleteAvatar = () => {
        if (!profileUpload.previewUrl && !profile?.avatar_url) {
            dispatch(addNotification({
                type: 'warning',
                message: 'Thông báo',
                description: 'Hiện không có ảnh đại diện',
                createdAt: Date.now(),
                isShown: false
            }));
            return;
        }

        Modal.confirm({
            title: 'Xác nhận xóa ảnh đại diện',
            content: 'Bạn có chắc chắn muốn xóa ảnh đại diện không?',
            okText: 'Có',
            cancelText: 'Hủy',
            async onOk() {
                try {
                    await deleteUserAvatar().unwrap();

                    setProfileUpload({
                        fileObj: null,
                        previewUrl: null,
                        isValid: false,
                        error: null
                    });

                    dispatch(addNotification({
                        type: 'success',
                        message: 'Thành công',
                        description: 'Đã xóa ảnh đại diện',
                        createdAt: Date.now(),
                        isShown: false
                    }));
                } catch (err) {
                    dispatch(addNotification({
                        type: 'error',
                        message: 'Lỗi',
                        description: 'Xóa ảnh đại diện thất bại',
                        createdAt: Date.now(),
                        isShown: false
                    }));
                }
            }
        });
    };

    const { data: profile, isLoading, error } = useGetUserProfileQuery();
    const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const name = profile?.full_name || '';
    const dob = profile?.dob || '';
    const gender = profile?.gender || '';
    const location = profile?.location || '';
    const phone_number = profile?.phone_number || '';
    const email = profile?.email || '';

    const handleUpdateUserProfile = async (values: any) => {
        try {
            const payload = {
                full_name: values.name,
                dob: values.birthday,
                gender: values.gender,
                location: values.province,
                phone_number: values.phoneNumber,
                avatar_url: values.avatar_url,
            };
            const response = await updateUserProfile(payload).unwrap();

            dispatch(addNotification({
                type: 'success',
                message: 'Thành công',
                description: 'Cập nhật thông tin thành công',
                createdAt: Date.now(),
                isShown: false
            }));

            closeModal();
        }
        catch (error) {
            dispatch(addNotification({
                type: 'error',
                message: 'Lỗi',
                description: 'Cập nhật thông tin thất bại',
                createdAt: Date.now(),
                isShown: false
            }));
        }
    }


    return (
        <>
            <section className="w-full flex flex-col items-center justify-center mt-[5rem] mb-[10rem]">
                <div className="flex items-center justify-start w-[var(--global-width)]">
                    <p className="text-[3.5rem] font-bold text-[var(--color-primary)]">Hồ sơ của tôi</p>
                </div>

                <div className="flex items-center justify-between h-[90%] gap-4 w-[var(--global-width)]">
                    <div className="w-[40%] h-[410px] flex flex-col items-center justify-center bg-[var(--color-bg_white)] rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]">
                        <div
                            className="w-full h-full flex items-center justify-center"
                        >
                            <Image
                                src={profileUpload.previewUrl || profile?.avatar_url || EmptyLayout}
                                alt="User Avatar"
                                width={192}
                                height={192}
                                className="absolute w-[12rem] h-[12rem] object-cover rounded-full cursor-pointer"
                            />
                        </div>

                        <div className="w-full h-[12rem] flex items-top justify-center gap-4">
                            <label
                                htmlFor="profileImage"
                                className="w-[178px] h-[54px] cursor-pointer flex items-center justify-center rounded-full bg-[var(--color-secondary)] text-white hover:!bg-white hover:text-[var(--color-secondary)] border hover:border-[var(--color-secondary)]"
                            >
                                <Input
                                    type="file"
                                    id="profileImage"
                                    accept="application/png, application/jpeg"
                                    onChange={handleProfileUpload}
                                    className="!hidden"
                                />
                                <p>Tải ảnh lên</p>
                            </label>

                            <Button
                                onClick={() => { handleDeleteAvatar(); }}
                                className="!w-[178px] !h-[54px] !bg-white !text-[var(--color-secondary)] border !border-[var(--color-secondary)] hover:!bg-[var(--color-secondary)] hover:!text-white !rounded-full !p-2 !text-[1rem]"
                            >
                                Xóa ảnh
                            </Button>
                        </div>
                    </div>

                    <div className="!w-[60%] !h-[410px] !flex !flex-col !items-center !justify-center !bg-[var(--color-bg_white)] !rounded-[20px] !shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] !p-[30px] [&_.ant-card-body]:!flex [&_.ant-card-body]:!flex-col [&_.ant-card-body]:!gap-4">
                        <div className="w-full h-[10%] flex items-center justify-center">
                            <p className="text-[1.5rem] font-bold text-[var(--color-primary)] w-full text-left">Thông tin cá nhân</p>
                            <Button
                                className="!w-[2rem] !h-[2rem] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md"
                                onClick={openModal}
                            >
                                <EditOutlined />
                            </Button>

                            <ProfileModal isOpen={isModalOpen} onClose={closeModal}>
                                <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">Chỉnh sửa hồ sơ</p>
                                <Form
                                    layout="vertical"
                                    className="w-full"
                                    initialValues={{
                                        name: name,
                                        birthday: dob,
                                        gender: gender,
                                        province: location,
                                        phoneNumber: phone_number
                                    }}
                                    onFinish={handleUpdateUserProfile}
                                >
                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Họ và tên<span className="text-red-500">*</span></p>
                                    </div>
                                    <Form.Item
                                        className="w-full"
                                        name="name"
                                    >
                                        <Input placeholder="Nhập họ và tên" />
                                    </Form.Item>

                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Ngày sinh<span className="text-red-500">*</span></p>
                                    </div>

                                    <Form.Item
                                        className="w-full"
                                        name="birthday"
                                    >
                                        <Input type="date" />
                                    </Form.Item>

                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Giới tính<span className="text-red-500">*</span></p>
                                    </div>

                                    <Form.Item
                                        className="w-full"
                                        name="gender"
                                    >
                                        <Radio.Group>
                                            <Radio value="male">Nam</Radio>
                                            <Radio value="female">Nữ</Radio>
                                        </Radio.Group>
                                    </Form.Item>

                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Tỉnh<span className="text-red-500">*</span></p>
                                    </div>

                                    <Form.Item
                                        className="w-full"
                                        name="province"
                                    >
                                        <Select
                                            options={provinces.map((province) => {
                                                return {
                                                    value: province,
                                                    label: province
                                                }
                                            })}
                                            value="Tỉnh"
                                            className="form__input !h-[2.rem] !w-full !text-[1rem]"
                                        />
                                    </Form.Item>

                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Số điện thoại<span className="text-red-500">*</span></p>
                                    </div>

                                    <Form.Item
                                        className="w-full"
                                        name="phoneNumber"
                                    >
                                        <Input placeholder="Nhập số điện thoại" />
                                    </Form.Item>

                                    <div className="mb-2">
                                        <p className="font-medium font-bold">Email<span className="text-red-500">*</span></p>
                                    </div>

                                    <Form.Item
                                        className="w-full"
                                        name="email"
                                    >
                                        <Input placeholder={email} disabled />
                                    </Form.Item>
                                    <Form.Item
                                        className="w-full flex items-center justify-center"
                                    >
                                        <Button type="primary" htmlType="submit"
                                            className="!bg-[var(--color-secondary)] !rounded-full !text-white !p-4"
                                        >
                                            Lưu thông tin
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </ProfileModal>

                        </div>
                        <div className="w-full h-[2px] flex flex-col items-center justify-center bg-gray-200 my-[1rem]">
                        </div>

                        <div className="w-full h-full flex flex-col items-center justify-start">
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Họ và tên</div>
                                <div className="w-[75%] mr-auto text-right p-2">{name}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Ngày sinh</div>
                                <div className="w-[75%] mr-auto text-right p-2">{dob}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Giới tính</div>
                                <div className="w-[75%] mr-auto text-right p-2">{!gender ? '' : gender === 'male' ? 'Nam' : 'Nữ'}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Tỉnh</div>
                                <div className="w-[75%] mr-auto text-right p-2">{location}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Số điện thoại</div>
                                <div className="w-[75%] mr-auto text-right p-2">{phone_number}</div>
                            </div>
                            <div className="flex items-center justify-center gap-2 w-full">
                                <div className="w-[25%] ml-auto p-2 text-[1rem] font-bold text-[var(--color-primary)]">Email</div>
                                <div className="w-[75%] mr-auto text-right p-2">{email}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <FooterSection hasRegisterBox={false} />
        </>
    )
}