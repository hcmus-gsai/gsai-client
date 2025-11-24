'use client';
import '@ant-design/v5-patch-for-react-19';

import React, {useState, useRef} from 'react';
import Image from 'next/image';
import { FooterSection } from "@/components/guest/ui/guest";
import {InputRef, Input, Button, Form, Radio, Select} from 'antd';
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { XCircle } from "@deemlol/next-icons";
import { EditOutlined } from "@ant-design/icons";
export interface IUploadState {
    fileObj: File | null;
    previewUrl:  string  | null;
    isValid: boolean;
    error: string | null;
}


const ProfileModal = ({isOpen, onClose, children}:{
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className ="fixed inset-0 bg-black/40 bg-opacity-40  flex items-center justify-center" onClick={onClose}>
            <div className = "relative bg-[var(--color-bg_white)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] rounded-[20px] p-4 w-[500px] flex flex-col items-center justify-top" onClick={(e) => e.stopPropagation()}>
                <Button 
                    className = "!w-[2rem] !h-[2rem] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md !absolute !top-2 !right-2"
                    onClick = {onClose}
                >
                    <XCircle className = "!text-white !w-full !h-full"/>
                </Button>
                {children}
            </div>
        </div>
    )
}


export default function PersonalProfilePage() {
    const [profileUpload, setProfileUpload] = useState<IUploadState>({
        fileObj: null,
        previewUrl: null,
        isValid: false,
        error: null
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    const profileInputRef = useRef<InputRef>(null);

    const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

        try {
            const file = event.target.files?.[0];
            if(!file) {
                return;
            }
            

            setProfileUpload({
                fileObj: file,
                previewUrl: URL.createObjectURL(file),
                isValid: true,
                error: null
            });
        }
        catch(error) {
            throw new Error("Failed to upload profile image");
        }
    }

    return (
        <section className = "w-full flex flex-col items-center justify-center mt-[5rem]">
            <div className = "w-full flex items-center justify-center">
                <p className = "text-[3.5rem] font-bold text-[var(--color-primary)]">Hồ sơ của tôi</p>
            </div>

            <div className = "flex items-center justify-center w-full h-[90%] gap-4">
                <div className = "w-[460px] h-[410px] flex flex-col items-center justify-center bg-[var(--color-bg_white)] rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]">
                    <div
                        className = "w-full h-full flex items-center justify-center"
                    >
                        <Image 
                            src = {profileUpload.previewUrl || EmptyLayout} alt = "Empty Layout" width = {0} height = {0} 
                            className = "absolute w-[12rem] h-[12rem] object-cover rounded-full"
                        />
                    </div>

                    <div className = "w-full h-[12rem] flex items-top justify-center gap-4">
                        <label 
                            htmlFor = "profileImage"
                            className = "w-[178px] h-[54px] cursor-pointer flex items-center justify-center rounded-full bg-[var(--color-secondary)] text-white"
                        >
                            <Input
                                type = "file"
                                id = "profileImage"
                                accept = "application/png, application/jpeg"
                                onChange = {handleProfileUpload}
                                className = "!hidden" 
                            />
                            <p className = "!text-[1rem] ">Tải ảnh lên</p>
                        </label>   
                
                        <Button
                            onClick={()=>{
                                setProfileUpload({
                                    fileObj: null,
                                    previewUrl: null,
                                    isValid: false,
                                    error: null
                                });
                            }}
                            className = "!w-[178px] !h-[54px] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md"
                        >
                            Xóa ảnh
                        </Button>
                    </div>
                </div>

                <div className = "w-[648px] h-[410px] flex flex-col items-center justify-center bg-[var(--color-bg_white)] rounded-[20px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] p-4">
                    <div className = "w-full h-[10%] flex items-center justify-center">
                        <p className = "text-[1.5rem] font-bold text-[var(--color-primary)] w-full text-left">Thông tin cá nhân</p>
                        <Button 
                            className = "!w-[2rem] !h-[2rem] !bg-[var(--color-secondary)] !rounded-full !text-white !p-2 !text-md"
                            onClick = {openModal}
                        >
                            <EditOutlined />
                        </Button>

                        <ProfileModal isOpen={isModalOpen} onClose={closeModal}>
                            <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Chỉnh sửa hồ sơ</p>
                            <Form
                                layout = "vertical"
                                className = "w-full"
                                initialValues = {{
                                    name: "Nguyễn Văn A",
                                    birthday: "12/12/1990",
                                    gender: "Nam",
                                    province: "thành phố Hồ Chí Minh",
                                    phoneNumber: "0909090909"
                                }}
                            >
                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Họ và tên<span className="text-red-500">*</span></p>
                                </div>
                                <Form.Item
                                    className = "w-full"
                                    name = "name"
                                >
                                    <Input placeholder = "Nhập họ và tên" />
                                </Form.Item>

                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Ngày sinh<span className="text-red-500">*</span></p>
                                </div>

                                <Form.Item
                                    className = "w-full"
                                    name = "birthday"
                                >
                                    <Input type = "date"/>
                                </Form.Item>

                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Giới tính<span className="text-red-500">*</span></p>
                                </div>

                                <Form.Item
                                    className = "w-full"
                                    name = "gender"
                                >
                                    <Radio.Group>
                                        <Radio value = "male">Nam</Radio>
                                        <Radio value = "female">Nữ</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Tỉnh<span className="text-red-500">*</span></p>
                                </div>

                                <Form.Item
                                    className = "w-full"
                                    name = "province"
                                >
                                    <Select placeholder = "Chọn tỉnh/thành phố" />
                                </Form.Item>

                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Số điện thoại<span className="text-red-500">*</span></p>
                                </div>

                                <Form.Item
                                    className = "w-full"
                                    name = "phoneNumber"
                                >
                                    <Input  placeholder = "Nhập số điện thoại" />
                                </Form.Item>

                                <div className = "mb-2">
                                    <p className="font-medium font-bold">Email<span className="text-red-500">*</span></p>
                                </div>

                                <Form.Item
                                    className = "w-full"
                                    name = "email"
                                >
                                    <Input placeholder = "example@gmail.com" disabled/>
                                </Form.Item>
                                <Form.Item
                                    className = "w-full flex items-center justify-center"
                                >
                                    <Button type = "primary" htmlType = "submit"
                                        className = "!bg-[var(--color-secondary)] !rounded-full !text-white !p-4"
                                    >
                                        Lưu thông tin
                                    </Button>
                                </Form.Item>
                            </Form>
                        </ProfileModal>
                       
                    </div>
                    <div className = "w-full h-full flex flex-col items-center justify-center">
                        <div className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Họ và tên</div>
                            <div className = "w-[75%] mr-auto text-right p-2">Nguyễn Văn A</div>
                        </div>
                        <div  className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Ngày sinh</div>
                            <div className = "w-[75%] mr-auto text-right p-2">12/12/1990</div>
                        </div>
                        <div className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Giới tính</div>
                            <div className = "w-[75%] mr-auto text-right p-2">Nam</div>  
                        </div>
                        <div className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Tỉnh</div>
                            <div className = "w-[75%] mr-auto text-right p-2">Hà Nội</div> 
                        </div>
                        <div className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Số điện thoại</div>
                            <div className = "w-[75%] mr-auto text-right p-2">0909090909</div>
                        </div>
                        <div className = "flex items-center justify-center gap-2 w-full">
                            <div className = "w-[25%] ml-auto p-2">Email</div>
                            <div className = "w-[75%] mr-auto text-right p-2">example@gmail.com</div>
                        </div>

                    </div>

                </div>
               
            </div>

            <FooterSection hasRegisterBox = {false}/>
        </section>
    )
}