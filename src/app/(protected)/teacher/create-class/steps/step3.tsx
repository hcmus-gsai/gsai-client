'use client'

import React, { use, useState } from 'react';
import { Collapse, ConfigProvider, Form, Button, Input, Upload, UploadProps, InputNumber, Switch } from 'antd';
import { 
  PlayCircleOutlined, 
  BookOutlined, 
  QuestionCircleOutlined, 
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined, CopyOutlined, EyeOutlined, CloseOutlined
} from '@ant-design/icons';

import Image from 'next/image';
import VideoIcon from '@/../public/shared/VideoIcon.svg'
import DocumentIcon from '@/../public/shared/DocumentIcon.svg'
import QuizIcon from '@/../public/shared/QuizIcon.svg'
import ProjectIcon from '@/../public/shared/ProjectIcon.svg'
import UploadIcon from '@/../public/shared/UploadIcon.svg'
import { ChevronDown, ChevronUp, X } from "@deemlol/next-icons"

import { Step3Data } from '@/type/createClass.type'

// Mock data cho các bài học bên trong
const lessons = [
  { id: 1, title: 'Tích phân', type: 'Video', duration: '2 phút', icon: <PlayCircleOutlined /> },
  { id: 2, title: 'Vector', type: 'Bài đọc', duration: '2 phút', icon: <BookOutlined /> },
  { id: 3, title: 'Bài tập toán ứng dụng 1', type: 'Quiz', duration: '30 phút', icon: <QuestionCircleOutlined /> },
];

interface Props {
    data: any; 
    onNext: (data: Partial<Step3Data>) => void;
    onBack: () => void
}

const Step3: React.FC<Props> = ({ data, onNext, onBack}) =>{
    const [form] = Form.useForm();

    const [modalVidDoc, setModalVidDoc] = useState('');
    const [modalQuiz, setModalQuiz] = useState(false);
    const [modalProject, setModalProject] = useState(false);
    // const handelAddLesson

    const genHeader = (title: string, index: number) => {
        const handleIconClick = (e: React.MouseEvent, type: string) => {
            e.stopPropagation();

            if(type === 'video' || type === 'document')
                setModalVidDoc(type);
            if(type === 'quiz')
                setModalQuiz(true);
            

            console.log(`Đang thêm: ${type} cho chương ${index}`);
            // Thực hiện logic thêm bài học của bạn ở đây
        };

        return (
            <>
                <div className="flex items-center justify-between w-full pr-4 mb-[2rem]">
                    <span className="text-2xl font-bold text-[#1D3557]">
                        Chương {index}: {title}
                    </span>
                    <div className="flex gap-4 text-gray-500">
                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'video')}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={VideoIcon} alt="Vid" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'document')}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={DocumentIcon} alt="Doc" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'quiz')}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={QuizIcon} alt="Quiz" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'project')}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={ProjectIcon} alt="Proj" width={24} height={24} />
                        </button>
                    </div>
                </div>
                <hr style={{color:'gray', opacity:0.5}}/>
            </>
        );
    };

    const collapseItems = [
        {
            key: '1',
            label: genHeader("Đại số tuyến tính", 1),
            children: 
                <div className="mb-4 flex flex-col gap-3 py-4">
                    {lessons.map((lesson) => (
                        <div 
                            key={lesson.id}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-2xl text-gray-600 bg-gray-50 p-2 rounded-lg">
                                    {lesson.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1D3557]">{lesson.title}</h4>
                                    <p className="text-sm text-gray-400">{lesson.type} • {lesson.duration}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-lg">
                                <EditOutlined className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                                <DeleteOutlined className="text-red-400 hover:text-red-600 cursor-pointer" />
                            </div>
                        </div>
                    ))}
                </div>
            ,
        },
        {
            key: '2',
            label: genHeader("Xác suất thống kê", 2),
            children: <p>This is the content of the second panel.</p>,
        },
    ];

    const [fileName, setFileName] = useState<string>('');
    const handleChangeFileSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];

        if (lastFile) {
            setFileName(lastFile.name);
        } else {
            setFileName('');
        }
    };  
    
    const onFinish = (values: any) => {
        console.log('Quiz Data:', values);
        // message.success('Đã lưu thông tin quiz!');
    };

    const handleClose = () => {
        // 1. Close the modal
        setModalVidDoc('');
        setModalQuiz(false);
        setModalProject(false);
        
        // 2. Clear the local state for the input display
        setFileName('');
        
        // 3. Reset the Ant Design form (clears validation and 'file' field)
        form.resetFields();
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <ConfigProvider
                    theme={{
                        components: {
                            Collapse: {
                            headerBg: 'transparent',
                            contentPadding: '0px 16px',
                            headerPadding: '12px 0px',
                            },
                        },
                    }}
                >
                    <Collapse
                        items={collapseItems}
                        ghost
                        expandIconPosition="start"
                        expandIcon={({ isActive }) => (
                            <div className="flex items-center justify-center transition-all duration-300">
                                {isActive ? (
                                    <ChevronUp 
                                        width={24} 
                                        height={24} 
                                        className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" 
                                    /> 
                                ) : (
                                    <ChevronDown 
                                        width={24} 
                                        height={24} 
                                        className="md:w-[32px] md:h-[32px] !text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300" 
                                    />
                                )}
                            </div>
                        )}
                        className="bg-transparent"
                    />
                </ConfigProvider>
                        
                { modalVidDoc != '' && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>

                        <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto px-6 py-3">
                            <div className='flex flex-row justify-end'>
                                <button 
                                    type='button' onClick={handleClose}
                                    className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                                >
                                    <X 
                                        width={24} 
                                        height={24}
                                    />
                                </button>
                            </div>

                            <div className='w-full h-auto flex flex-col items-center'>
                                <h2 className="text-2xl font-bold mb-2">Tạo bài giảng</h2>
            
                                <Form
                                    form={form}
                                    layout='vertical'
                                    requiredMark={false}
                                    className='w-full'
                                >
                                    <Form.Item 
                                        name='lessonName' 
                                        label={<span className='text-base'>Tên bài giảng</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên bài giảng!' }]}
                                    >
                                        <Input size='large' placeholder='Tên bài giảng'/>
                                    </Form.Item>

                                    <Form.Item
                                        name='file'
                                        label={<span className='text-base'>{ modalVidDoc == 'document' ? "Tài liệu" : "Video" }</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập file bài giảng!' }]}
                                    >
                                        <Upload 
                                            className='w-full' 
                                            style={{ display: 'block' }} 
                                            showUploadList={false} 
                                            beforeUpload={() => false}
                                            onChange={handleChangeFileSelect}
                                            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        >
                                            <Input 
                                                className='w-full'
                                                placeholder= { modalVidDoc == 'document' ? "Tài liệu" : "Video" }
                                                readOnly 
                                                size="large"
                                                value={fileName}
                                                suffix={<Image src={UploadIcon} alt="Doc" width={24} height={24} />}
                                            />
                                        </Upload>
                                    </Form.Item>   

                                    <Form.Item className='flex justify-center'>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            size="large"
                                            className="!form_button !w-[12.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                                        >
                                            Lưu thông tin
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            
                        </div>
                    </div>
                )}

                {modalQuiz && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
                        <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[70vh] overflow-hidden">
            
                            <div className='flex flex-row justify-end'>
                                <button
                                    type='button' onClick={handleClose}
                                    className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                                >
                                    <X width={24} height={24} />
                                </button>
                            </div>

                            <div className="flex items-center justify-center px-8 py-4 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">Tạo quiz</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                                <Form
                                    form={form}
                                    layout="vertical"
                                    requiredMark={false}
                                    onFinish={onFinish}
                                    className="w-full"
                                    // initialValues={{ questions: [{ questionText: '', points: 1, isRequired: true, options: [''] }] }}
                                >
                                    <Form.Item 
                                        name="quizName" 
                                        label={<span className="font-semibold">Tên quiz</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên quiz!' }]}
                                    >
                                        <Input size="large" placeholder="Nhập tên quiz" className="rounded-lg" />
                                    </Form.Item>

                                    <Form.Item 
                                        name="deadline" 
                                        label={<span className="font-semibold">Hạn nộp</span>}
                                        rules={[{ required: true, message: 'Vui lòng chọn hạn nộp!' }]}
                                    >
                                        <Input size="large" type="date" className="rounded-lg" />
                                    </Form.Item>

                                    <div className="mt-8">
                                        <p className="text-base font-semibold mb-4 text-gray-700">Câu hỏi & câu trả lời</p>
                        
                                        <Form.List name="questions">
                                            {(fields, { add, remove }) => (
                                                <div className="flex flex-col gap-6">
                                                    {fields.map(({ key, name, ...restField }, index) => (
                                                        <div 
                                                            key={key} 
                                                            className="relative p-6 border border-gray-200 rounded-xl bg-white transition-all shadow-sm hover:shadow-md"
                                                            style={{ borderLeft: index === fields.length - 1 ? '6px solid #1D61D5' : '1px solid #e5e7eb' }}
                                                        >
                                                            <div className="flex justify-between gap-4 mb-4">
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'questionText']}
                                                                    className="flex-1 mb-0"
                                                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                                                                >
                                                                    <Input.TextArea 
                                                                        placeholder={`Câu ${index + 1}: Nội dung câu hỏi...`} 
                                                                        autoSize 
                                                                        className="text-lg font-medium border-none bg-gray-50 p-3 rounded-lg focus:bg-white"
                                                                    />
                                                                </Form.Item>
                                                            
                                                                <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-lg">
                                                                    <Form.Item {...restField} name={[name, 'points']} noStyle>
                                                                        <InputNumber min={0} variant="borderless" className="w-10 font-bold" />
                                                                    </Form.Item>
                                                                    <span className="text-gray-500 text-sm">điểm</span>
                                                                </div>
                                                            </div>

                                                            <Form.List name={[name, 'options']}>
                                                                {(subFields, { add: addOpt, remove: removeOpt }) => (
                                                                    <div className="ml-2 flex flex-col gap-3">
                                                                        {subFields.map((subField) => {
                                                                            const { key: subKey, ...subRest } = subField;
                                                                                return (
                                                                                    <div key={subKey} className="flex items-center gap-3 group">
                                                                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                                                                            <Form.Item
                                                                                                {...subRest}
                                                                                                name={subField.name}
                                                                                                className="flex-1 mb-0"
                                                                                                rules={[{ required: true, message: 'Vui lòng nhập tùy chọn!' }]}
                                                                                            >
                                                                                                <Input variant="borderless" placeholder={`Tùy chọn ${subField.name + 1}`} className="hover:bg-gray-50" />
                                                                                            </Form.Item>
                                                                                            
                                                                                            {subFields.length > 1 && (
                                                                                                <button onClick={() => removeOpt(subField.name)} className="text-gray-300 hover:text-red-500">
                                                                                                    <CloseOutlined style={{ fontSize: '12px' }} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                );
                                                                        })}
                                                                        <button 
                                                                            type="button" 
                                                                            onClick={() => addOpt()}
                                                                            className="text-blue-500 text-sm font-medium w-fit ml-8 hover:underline"
                                                                        >
                                                                            + Thêm tùy chọn
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </Form.List>

                                                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center gap-5">
                                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                                                <Button type="text" icon={<CopyOutlined />} onClick={() => add(form.getFieldValue(['questions', name]))} />
                                                                <div className="h-4 w-[1px] bg-gray-200" />
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-500">Bắt buộc</span>
                                                                    <Form.Item {...restField} name={[name, 'isRequired']} valuePropName="checked" noStyle initialValue={true}>
                                                                    <Switch size="small" />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={() => add()}
                                                        className="flex items-center justify-center w-12 h-12 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-all self-start"
                                                    >
                                                        <PlusCircleOutlined style={{ fontSize: '28px' }} />
                                                    </button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </div>

                                    <div className="flex justify-center mt-12 pb-4">
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            className="h-[50px] px-12 rounded-full bg-blue-600 font-bold text-lg"
                                        >
                                            Lưu thông tin
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
        
    );
}

export default Step3;