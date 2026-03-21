'use client'

import React from 'react';
import { Form, Button, Input, Space, InputNumber, Radio, Switch, message } from 'antd';
import type { FormInstance } from 'antd';
import Image from 'next/image';
import { X } from '@deemlol/next-icons';

import CreateClassCopy from '@/../public/teacher/createClassCopy.svg';
import CreateClassTrash from '@/../public/teacher/createClassTrash.svg';

type Props = {
    visible: boolean;
    form: FormInstance;
    onClose: () => void;
    onSubmit: (values: any) => void;
};

const CreateClassQuizModal: React.FC<Props> = ({ visible, form, onClose, onSubmit }) => {
    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto max-h-[75vh] px-6 py-3 overflow-hidden">
                <div className="flex flex-row justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                    >
                        <X width={24} height={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    <div className="flex items-center justify-center px-8 py-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800">Tạo quiz</h2>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark={false}
                        onFinish={onSubmit}
                        className="w-full"
                        initialValues={{
                            questions: [
                                { question: '', score: 0, required: true, options: [{ value: '' }, { value: '' }], correctOption: 0 },
                            ],
                            expiredDate: 7,
                            duration: 15,
                        }}
                    >
                        <Form.Item
                            name="quizName"
                            label={<span className="font-semibold">Tên quiz</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập tên quiz!' }]}
                        >
                            <Input size="large" placeholder="Nhập tên quiz" className="rounded-lg" />
                        </Form.Item>

                        <Form.Item
                            name="expiredDate"
                            label={<span className="font-semibold">Hạn nộp (tính từ ngày đăng kí học)</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập số ngày hạn nộp!' }]}
                        >
                            <Space.Compact style={{ width: '100%' }} >
                                <InputNumber min={1} size="large" style={{ width: '100%' }}/>
                                <Button 
                                    disabled 
                                    size="large"
                                    style={{ 
                                        color: 'rgba(0, 0, 0, 0.88)', 
                                        backgroundColor: '#fafafa'  
                                    }}
                                    className="!cursor-not-allowed !pointer-events-none hover:!bg-inherit hover:!text-inherit hover:!border-inherit [&_.anticon]:!text-inherit" //This to remove stopid icon when hovering disabled Button
                                >
                                    %
                                </Button>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item
                            name="duration"
                            label={<span className="font-semibold">Thời gian làm bài (phút)</span>}
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian làm quiz!' }]}
                        >
                            <Space.Compact style={{ width: '100%' }} >
                                <InputNumber min={1} size="large" style={{ width: '100%' }}/>
                                <Button 
                                    disabled 
                                    size="large"
                                    style={{ 
                                        color: 'rgba(0, 0, 0, 0.88)',
                                        backgroundColor: '#fafafa'  
                                    }}
                                    className="!cursor-not-allowed !pointer-events-none hover:!bg-inherit hover:!text-inherit hover:!border-inherit [&_.anticon]:!text-inherit" //This to remove stopid icon when hovering disabled Button
                                >
                                    minute
                                </Button>
                            </Space.Compact>
                        </Form.Item>

                        <div className="mt-8">
                            <p className="text-base font-semibold mb-4 text-gray-700">Câu hỏi và đáp án</p>

                            <Form.List name="questions">
                                {(fields, { add, remove }) => (
                                    <div className="flex flex-col gap-6">
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <div
                                                key={key}
                                                className="relative p-6 border border-gray-200 rounded-xl bg-white transition-all shadow-sm hover:shadow-md"
                                            >
                                                <div className="flex justify-between gap-4 mb-4">
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'question']}
                                                        className="flex-1 mb-0"
                                                        layout="horizontal"
                                                        label={<span className="font-bold text-base">Câu {index + 1}</span>}
                                                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                                                    >
                                                        <Input.TextArea autoSize className="text-lg font-medium border-none bg-gray-50 p-3 rounded-lg focus:bg-white" />
                                                    </Form.Item>
                                                </div>

                                                <Form.List name={[name, 'options']}>
                                                    {(subFields, { add: addOpt, remove: removeOpt }) => (
                                                        <div className="ml-2 flex flex-col gap-3">
                                                            {subFields.map(({ key: subKey, name: subName, ...restSubField }) => (
                                                                <div key={subKey} className="flex items-center gap-3 group">
                                                                    <Form.Item shouldUpdate noStyle>
                                                                        {() => {
                                                                            const selected = form.getFieldValue(['questions', name, 'correctOption']);
                                                                            return (
                                                                                <Radio
                                                                                    checked={selected === subName}
                                                                                    onChange={() => form.setFieldValue(['questions', name, 'correctOption'], subName)}
                                                                                />
                                                                            );
                                                                        }}
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        {...restSubField} 
                                                                        name={[subName, 'value']}
                                                                        className="flex-1 mb-0"
                                                                        style={{ marginBottom: 0 }}
                                                                        rules={[{ required: true, message: 'Vui lòng nhập tùy chọn!' }]}
                                                                    >
                                                                        <Input variant="borderless" placeholder={`Tùy chọn ${subName + 1}`} className="hover:bg-gray-50 mb-0" />
                                                                    </Form.Item>

                                                                    {subFields.length > 2 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const removedOptionIndex = Number(subName);
                                                                                // ... rest of your delete logic
                                                                                removeOpt(subName);
                                                                                // ...
                                                                            }}
                                                                            className="text-gray-300 hover:text-red-500"
                                                                        >
                                                                            <X width={15} height={15} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}

                                                            <button
                                                                type="button"
                                                                onClick={() => addOpt({ value: '' })}
                                                                className="text-blue-500 text-sm font-medium w-fit ml-8 hover:underline"
                                                            >
                                                                + Thêm tùy chọn
                                                            </button>
                                                        </div>
                                                    )}
                                                </Form.List>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'correctOption']}
                                                    rules={[{ required: true, message: 'Vui lòng chọn đáp án đúng!' }]}
                                                    hidden
                                                >
                                                    <InputNumber />
                                                </Form.Item>

                                                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center gap-5">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-lg">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'score']}
                                                            label={<span className="text-gray-700 w-[5rem]">Điểm</span>}
                                                            style={{ marginBottom: 0, width: '9rem' }}
                                                            rules={[{ required: true, message: '' }]}
                                                        >
                                                            <InputNumber min={0} max={10} controls={false} style={{ width: '4rem' }} />
                                                        </Form.Item>
                                                    </div>

                                                    <div className="h-6 w-[2px] bg-gray-200" />

                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<Image src={CreateClassTrash} alt="Delete" width={20} height={20} />}
                                                        onClick={() => remove(name)}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<Image src={CreateClassCopy} alt="Copy" width={20} height={20} />}
                                                        onClick={() => add(form.getFieldValue(['questions', name]))}
                                                    />

                                                    <div className="h-6 w-[2px] bg-gray-200" />

                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-700">Bắt buộc</span>
                                                        <Form.Item {...restField} name={[name, 'required']} valuePropName="checked" noStyle>
                                                            <Switch size="small" />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => add({ question: '', score: 0, required: false, options: [{ value: '' }, { value: '' }], correctOption: 0 })}
                                            className="relative w-[3rem] h-[3rem] group focus:outline-none transition-transform active:scale-95 mb-10"
                                        >
                                            <svg height="3rem" width="3rem" className="transition-colors group-hover:drop-shadow-lg">
                                                <circle
                                                    r="1.3rem"
                                                    cx="1.5rem"
                                                    cy="1.5rem"
                                                    fill="white"
                                                    stroke="#1363DF"
                                                    strokeWidth="1.5"
                                                    className="group-hover:stroke-blue-700"
                                                />
                                            </svg>

                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg width="24" height="24" fill="currentColor" className="text-[#1363DF] group-hover:text-blue-700">
                                                    <path d="M12 4a.5.5 0 0 1 .5.5v7h7a.5.5 0 0 1 0 1h-7v7a.5.5 0 0 1-1 0v-7h-7a.5.5 0 0 1 0-1h7v-7A.5.5 0 0 1 12 4z" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </Form.List>
                        </div>

                        <Form.Item className="flex justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="!w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                            >
                                Lưu thông tin
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default CreateClassQuizModal;
