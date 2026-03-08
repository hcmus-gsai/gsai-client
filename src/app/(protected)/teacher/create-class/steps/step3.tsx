'use client'

import React, { use, useState } from 'react';
import { Collapse, ConfigProvider, Form, Button, Input, Upload, UploadProps, InputNumber, Switch, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

import Image from 'next/image';
import VideoIcon from '@/../public/shared/VideoIcon.svg'
import DocumentIcon from '@/../public/shared/DocumentIcon.svg'
import QuizIcon from '@/../public/shared/QuizIcon.svg'
import ProjectIcon from '@/../public/shared/ProjectIcon.svg'
import UploadIcon from '@/../public/shared/UploadIcon.svg'
import CreateClassCopy from '@/../public/teacher/createClassCopy.svg'
import CreateClassTrash from '@/../public/teacher/createClassTrash.svg'
import CreateClassTrashRed from '@/../public/teacher/createClassTrashRed.svg'
import CreateClassEdit from '@/../public/teacher/createClassEdit.svg'
import { ChevronDown, ChevronUp, Divide, X } from "@deemlol/next-icons"

import { Lesson, Quiz, Project, Step3Data } from '@/type/createClass.type'

// Mock data cho các bài học bên trong
const mock_lessons = [
  { id: 1, title: 'Tích phân', type: 'Video', duration: '2 phút', icon: <Image src={VideoIcon} alt="Vid" width={24} height={24} /> },
  { id: 2, title: 'Vector', type: 'Bài đọc', duration: '2 phút', icon: <Image src={DocumentIcon} alt="Doc" width={24} height={24} /> },
  { id: 3, title: 'Bài tập toán ứng dụng 1', type: 'Quiz', duration: '30 phút', icon: <Image src={QuizIcon} alt="Quiz" width={24} height={24} /> },
];

interface Props {
    data: any; 
    onNext: (data: Partial<Step3Data>) => void;
    onBack: () => void
}

const Step3: React.FC<Props> = ({ data, onNext, onBack}) =>{

    const [form] = Form.useForm();

    const [chapter, setChapter] = useState<number>(0)
    const [chapterItems, setChapterItems] = useState<Record<number, number>>({
        1: 0,
        2: 0
    });

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [quizs, setQuizs] = useState<Quiz[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    console.log('Lessons', lessons);
    console.log('Quizs', quizs);
    console.log('Projects', projects);

    const [modalVidDoc, setModalVidDoc] = useState('');
    const [modalQuiz, setModalQuiz] = useState(false);
    const [modalProject, setModalProject] = useState(false);
    
    const [radioVal, setRadioVal] = useState(data.pricingType || 1);
    const onChangeRadio = (e: RadioChangeEvent) => {
        setRadioVal(e.target.value);
    };

    const [fileLessonName, setFileLessonName] = useState<string>('');
    const changeFileLessonSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];

        if (lastFile) {
            setFileLessonName(lastFile.name);
        } else {
            setFileLessonName('');
        }
    };

    const [fileProjectName, setFileProjectName] = useState<string>('');
    const changeFileProjectSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];

        if (lastFile) {
            setFileProjectName(lastFile.name);
        } else {
            setFileProjectName('');
        }
    };

    const [audioProjectName, setAudioProjectName] = useState<string>('');
    const changeAudioProjectSelect: UploadProps['onChange'] = (info) => {
        const lastFile = info.fileList.slice(-1)[0];

        if (lastFile) {
            setAudioProjectName(lastFile.name);
        } else {
            setAudioProjectName('');
        }
    };  

    const [editingItem, setEditingItem] = useState<{ item: any, contentType: 'lesson' | 'quiz' | 'project' } | null>(null);
    const handleDeleteItem = (contentType: string, createdAt: number) => {
        if (contentType === 'lesson') {
            setLessons(prev => prev.filter(l => l.createdAt !== createdAt));
        } else if (contentType === 'quiz') {
            setQuizs(prev => prev.filter(q => q.createdAt !== createdAt));
        } else if (contentType === 'project') {
            setProjects(prev => prev.filter(p => p.createdAt !== createdAt));
        }
    };

    const handleEditItem = (item: any) => {
        setEditingItem({ item, contentType: item.contentType });
        setChapter(item.chapter);

        // 1. Đổ dữ liệu vào Form
        if (item.contentType === 'lesson') {
            setModalVidDoc(item.type);
            setFileLessonName(item.file?.name || '');

            form.setFieldsValue({
                lessonName: item.lessonName,
                file: { fileList: item.file ? [item.file] : [] }
            });
        } else if (item.contentType === 'quiz') {
            setModalQuiz(true);
            form.setFieldsValue({
                quizName: item.quizName,
                deadline: item.deadline,
                questions: item.questions
            });
        } else if (item.contentType === 'project') {
            setModalProject(true);

            setFileProjectName(item.file?.name || '');
            setAudioProjectName(item.audio?.name || '');
            setRadioVal(item.permit);

            form.setFieldsValue({
                projectName: item.projectName,
                deadline: item.deadline,
                permit: item.permit,
                file: { fileList: item.file ? [item.file] : [] },
                audio: { fileList: item.audio ? [item.audio] : [] }
            });
        }
    };

    const genHeader = (title: string, index: number) => {
        const handleIconClick = (e: React.MouseEvent, type: string, key: number) => {
            e.stopPropagation();

            if(type === 'video' || type === 'document'){
                setChapter(key);
                setModalVidDoc(type);
            }
            if(type === 'quiz'){
                setChapter(key);
                setModalQuiz(true);
            }
            if(type === 'project'){
                setChapter(key);
                setModalProject(true);
            }
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
                            onClick={(e) => handleIconClick(e, 'video', index)}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={VideoIcon} alt="Vid" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'document', index)}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={DocumentIcon} alt="Doc" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'quiz', index)}
                            className="hover:scale-110 transition-transform active:opacity-70"
                        >
                            <Image src={QuizIcon} alt="Quiz" width={24} height={24} />
                        </button>

                        <button 
                            type="button" 
                            onClick={(e) => handleIconClick(e, 'project', index)}
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

    const renderChapterContent = (chapterIndex: number) => {
        const allContent = [
            ...lessons.map(item => ({ ...item, contentType: 'lesson' as const })),
            ...quizs.map(item => ({ ...item, contentType: 'quiz' as const })),
            ...projects.map(item => ({ ...item, contentType: 'project' as const }))
        ].filter(item => item.chapter === chapterIndex);

        const sortedContent = allContent.sort((a, b) => a.createdAt - b.createdAt);

        if (sortedContent.length === 0) {
            return (
                <div className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    Chưa có nội dung cho chương này
                </div>
            );
        }

        return (
            <div className="mb-4 flex flex-col gap-3 py-4">
                {sortedContent.map((item, idx) => {
                    // Xác định Icon và Tiêu đề dựa trên loại nội dung
                    let icon = QuizIcon;
                    let title = "";
                    let subTitle = "";

                    if (item.contentType === 'lesson') {
                        icon = item.type === 'video' ? VideoIcon : DocumentIcon;
                        title = item.lessonName;
                        subTitle = item.type === 'video' ? 'Video' : 'Tài liệu';
                    } else if (item.contentType === 'quiz') {
                        icon = QuizIcon;
                        title = item.quizName;
                        subTitle = `Quiz • Hạn nộp: ${item.deadline}`;
                    } else if (item.contentType === 'project') {
                        icon = ProjectIcon;
                        title = item.projectName;
                        subTitle = `Đồ án • Hạn nộp: ${item.deadline}`;
                    }

                    return (
                        <div key={item.createdAt} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <Image src={icon} alt="icon" width={24} height={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1D3557]">{title}</h4>
                                    <p className="text-sm text-gray-400">{subTitle}</p>
                                </div>
                            </div>
                            {/* <div className="flex gap-4">
                                <Image src={CreateClassEdit} alt="edit" width={20} height={20} className='cursor-pointer' />
                                <Image src={CreateClassTrashRed} alt="delete" width={20} height={20} className='cursor-pointer' />
                            </div> */}

                            <div className="flex gap-4">
                                <Image 
                                    src={CreateClassEdit} 
                                    alt="edit" 
                                    width={20} height={20} 
                                    className='cursor-pointer hover:opacity-70' 
                                    onClick={() => handleEditItem(item)} // Gọi hàm sửa
                                />
                                <Image 
                                    src={CreateClassTrashRed} 
                                    alt="delete" 
                                    width={20} height={20} 
                                    className='cursor-pointer hover:opacity-70' 
                                    onClick={() => handleDeleteItem(item.contentType, item.createdAt)} // Gọi hàm xóa
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const collapseItems = [
        {
            key: '1',
            label: genHeader("Đại số tuyến tính", 1),
            children: 
                // <div className="mb-4 flex flex-col gap-3 py-4">
                //     {mock_lessons.map((lesson) => (
                //         <div 
                //             key={lesson.id}
                //             className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
                //         >
                //             <div className="flex items-center gap-4">
                //                 <div className="text-2xl text-gray-600 bg-gray-50 p-2 rounded-lg">
                //                     {lesson.icon}
                //                 </div>
                //                 <div>
                //                     <h4 className="font-bold text-[#1D3557]">{lesson.title}</h4>
                //                     <p className="text-sm text-gray-400">{lesson.type} • {lesson.duration}</p>
                //                 </div>
                //             </div>
                //             <div className="flex gap-4 text-lg">
                //                 <Image src={CreateClassEdit} alt="edit lesson" width={20} height={20} className='cursor-pointer' />
                //                 <Image src={CreateClassTrashRed} alt="delete lesson" width={20} height={20} className='cursor-pointer' />
                //             </div>
                //         </div>
                //     ))}
                // </div>
                renderChapterContent(1),
        },
        {
            key: '2',
            label: genHeader("Xác suất thống kê", 2),
            children: renderChapterContent(2),
            // <div className="mb-4 flex flex-col gap-3 py-4">
            //         {mock_lessons.map((lesson) => (
            //             <div 
            //                 key={lesson.id}
            //                 className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow"
            //             >
            //                 <div className="flex items-center gap-4">
            //                     <div className="text-2xl text-gray-600 bg-gray-50 p-2 rounded-lg">
            //                         {lesson.icon}
            //                     </div>
            //                     <div>
            //                         <h4 className="font-bold text-[#1D3557]">{lesson.title}</h4>
            //                         <p className="text-sm text-gray-400">{lesson.type} • {lesson.duration}</p>
            //                     </div>
            //                 </div>
            //                 <div className="flex gap-4 text-lg">
            //                     {/* <EditOutlined className="text-gray-400 hover:text-blue-600 cursor-pointer" />
            //                     <DeleteOutlined className="text-red-400 hover:text-red-600 cursor-pointer" /> */}
            //                 </div>
            //             </div>
            //         ))}
            //     </div>,
        },
    ];

    const onFinishLesson = (values:any) => {
        const currentOrder = editingItem ? editingItem.item.order : (chapterItems[chapter] || 0) + 1;

        const updatedLesson: Lesson = {
            ...values,
            file: values.file?.fileList?.[0] || values.file,
            type: modalVidDoc,
            chapter: chapter,
            contentType: 'lesson',
            order: currentOrder, // Gán order ở đây
            createdAt: editingItem ? editingItem.item.createdAt : Date.now()
        };

        if (editingItem) {
            setLessons(prev => prev.map(l => l.createdAt === editingItem.item.createdAt ? updatedLesson : l));
        } else {
            setLessons(prev => [...prev, updatedLesson]);
            // Tăng count của chapter lên 1 khi thêm mới
            setChapterItems(prev => ({ ...prev, [chapter]: currentOrder }));
        }

        handleClose();
    };

    const onFinishQuiz = (values: any) => {
        const currentOrder = editingItem ? editingItem.item.order : (chapterItems[chapter] || 0) + 1;

        const updatedQuiz: Quiz = {
            ...values,
            chapter: chapter,
            contentType: 'quiz',
            order: currentOrder,
            createdAt: editingItem ? editingItem.item.createdAt : Date.now()
        };

        if (editingItem) {
            setQuizs(prev => prev.map(l => l.createdAt === editingItem.item.createdAt ? updatedQuiz : l));
        } else {
            setQuizs(prev => [...prev, updatedQuiz]);
            // Tăng count của chapter lên 1 khi thêm mới
            setChapterItems(prev => ({ ...prev, [chapter]: currentOrder }));
        }

        handleClose();
    };

    const onFinishProject = (values: any) => {
        const currentOrder = editingItem ? editingItem.item.order : (chapterItems[chapter] || 0) + 1;

        const updatedProject: Project = {
            ...values,
            file: values.file?.fileList?.[0] || values.file,
            audio: values.audio?.fileList?.[0] || values.audio,
            chapter: chapter,
            contentType: 'project',
            order: currentOrder,
            createdAt: editingItem ? editingItem.item.createdAt : Date.now()
        };

        if (editingItem) {
            setProjects(prev => prev.map(l => l.createdAt === editingItem.item.createdAt ? updatedProject : l));
        } else {
            setProjects(prev => [...prev, updatedProject]);
            // Tăng count của chapter lên 1 khi thêm mới
            setChapterItems(prev => ({ ...prev, [chapter]: currentOrder }));
        }
        
        handleClose();
    }

    const handleClose = () => {
        setModalVidDoc('');
        setModalQuiz(false);
        setModalProject(false);
        
        setFileLessonName('');
        setEditingItem(null);

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

                <div className='w-full  flex justify-center gap-8'>
                    <Button 
                        type="primary" 
                        size="large"
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-secondary)] !bg-[var(--color-bg-white)] !border-[var(--color-secondary)]  !rounded-full hover:!text-[var(--color-bg-white)] hover:!bg-[var(--color-secondary)] hover:!border-[var(--color-bg-white)]"
                    >
                        Quay lại
                    </Button>

                    <Button 
                        type="primary" 
                        size="large"
                        className="!w-[8.5rem] !h-[3.375rem] !text-[var(--color-bg-white)] !bg-[var(--color-secondary)] !rounded-full hover:!text-[var(--color-secondary)] hover:!bg-[var(--color-bg-white)] hover:!border-[var(--color-secondary)]"
                    >
                        Tiếp tục
                    </Button>
                </div>
                        
                {modalVidDoc != '' && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center'>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}/>

                        <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto px-6 py-3">
                            <div className='flex flex-row justify-end'>
                                <button 
                                    type='button' onClick={handleClose}
                                    className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                                >
                                    <X width={24} height={24}/>
                                </button>
                            </div>

                            <div className='w-full h-auto flex flex-col items-center'>
                                <h2 className="text-2xl font-bold mb-2">Tạo bài giảng</h2>
            
                                <Form
                                    form={form}
                                    layout='vertical'
                                    requiredMark={false}
                                    onFinish={onFinishLesson}
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
                                        valuePropName={"filelist"}
                                    >
                                        <Upload 
                                            className='w-full' 
                                            style={{ display: 'block' }}
                                            showUploadList={false} 
                                            beforeUpload={() => false}
                                            onChange={changeFileLessonSelect}
                                            accept={ modalVidDoc == 'document' ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ".mp4" }
                                        >
                                            <Input 
                                                className='w-full'
                                                placeholder= { modalVidDoc == 'document' ? "Tài liệu" : "Video" }
                                                readOnly 
                                                size="large"
                                                value={fileLessonName}
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
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}/>
                        <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto max-h-[70vh] px-6 py-3 overflow-hidden">
            
                            <div className='flex flex-row justify-end'>
                                <button
                                    type='button' onClick={handleClose}
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
                                    onFinish={onFinishQuiz}
                                    className="w-full"
                                    initialValues={{ questions: [{ question: '', score: 0, required: true, options: [''] }] }}
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
                                                                    name={[name, 'question']}
                                                                    className="flex-1 mb-0"
                                                                    layout="horizontal"
                                                                    label={<span className='font-bold text-base'>Câu {key + 1}</span>}
                                                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                                                                >
                                                                    <Input.TextArea 
                                                                        autoSize 
                                                                        className="text-lg font-medium border-none bg-gray-50 p-3 rounded-lg focus:bg-white"
                                                                    />
                                                                </Form.Item>
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
                                                                                            style={{marginBottom: 0}}
                                                                                            rules={[{ required: true, message: 'Vui lòng nhập tùy chọn!' }]}
                                                                                        >
                                                                                            <Input variant="borderless" placeholder={`Tùy chọn ${subField.name + 1}`} className="hover:bg-gray-50 mb-0" />
                                                                                        </Form.Item>
                                                                                        
                                                                                        {subFields.length > 1 && (
                                                                                            <button onClick={() => removeOpt(subField.name)} className="text-gray-300 hover:text-red-500">
                                                                                                <X width={15} height={15} />
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
                                                                <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-lg">
                                                                    
                                                                    <Form.Item 
                                                                        {...restField} 
                                                                        name={[name, 'score']} 
                                                                        layout='horizontal'
                                                                        label={<span className="text-gray-700 w-[5rem]">Điểm</span>}
                                                                        style={{marginBottom: 0, width: '9rem'}}
                                                                        rules={[{ required: true, message: '' }]}
                                                                    >
                                                                        <InputNumber min={0} max={10} controls={false} style={{width: '4rem'}}/>
                                                                    </Form.Item>
                                                                </div>

                                                                <div className="h-6 w-[2px] bg-gray-200" />

                                                                <Button type="text" danger icon={<Image src={CreateClassTrash} alt="Delete" width={20} height={20} />} onClick={() => remove(name)} />
                                                                <Button type="text" icon={<Image src={CreateClassCopy} alt="Copy" width={20} height={20} />} onClick={() => add(form.getFieldValue(['questions', name]))} />
                                                                
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
                                                        type='button'
                                                        onClick={() => add({ 
                                                            question: '', 
                                                            score: 0,        
                                                            required: false, 
                                                            options: ['']    
                                                        })}
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
                                                                <path d="M12 4a.5.5 0 0 1 .5.5v7h7a.5.5 0 0 1 0 1h-7v7a.5.5 0 0 1-1 0v-7h-7a.5.5 0 0 1 0-1h7v-7A.5.5 0 0 1 12 4z"/>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </div>

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

                {modalProject && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center mt-[10vh]'>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}/>

                        <div className="relative flex flex-col bg-white rounded-xl shadow-xl w-[60%] h-auto px-6 py-3">
                            <div className='flex flex-row justify-end'>
                                <button 
                                    type='button' onClick={handleClose}
                                    className="w-[2rem] h-[2rem] hover:scale-110 hover:drop-shadow-lg transition-transform active:opacity-70"
                                >
                                    <X width={24} height={24}/>
                                </button>
                            </div>

                            <div className='w-full h-auto flex flex-col items-center'>
                                <h2 className="text-2xl font-bold mb-2">Tạo đồ án</h2>
            
                                <Form
                                    form={form}
                                    layout='vertical'
                                    requiredMark={false}
                                    onFinish={onFinishProject}
                                    className='w-full'
                                >
                                    <Form.Item 
                                        name='projectName' 
                                        label={<span className='font-semibold'>Tên đồ án</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập tên đồ án!' }]}
                                    >
                                        <Input size='large' placeholder='Tên đồ án'/>
                                    </Form.Item>

                                    <Form.Item 
                                        name="deadline" 
                                        label={<span className="font-semibold">Hạn nộp</span>}
                                        rules={[{ required: true, message: 'Vui lòng chọn hạn nộp!' }]}
                                    >
                                        <Input size="large" type="date" className="rounded-lg" />
                                    </Form.Item>

                                    <Form.Item
                                        name='file'
                                        label={<span className='font-semibold'>Tài liệu</span>}
                                        rules={[{ required: true, message: 'Vui lòng nhập file bài giảng!' }]}
                                        valuePropName={"filelist"}
                                    >
                                        <Upload 
                                            className='w-full' 
                                            style={{ display: 'block' }}
                                            showUploadList={false} 
                                            beforeUpload={() => false}
                                            onChange={changeFileProjectSelect}
                                            // accept={ modalVidDoc == 'document' ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ".mp4" }
                                        >
                                            <Input 
                                                className='w-full'
                                                placeholder="Tài liệu"
                                                readOnly 
                                                size="large"
                                                value={fileProjectName}
                                                suffix={<Image src={UploadIcon} alt="Doc" width={24} height={24} />}
                                            />
                                        </Upload>
                                    </Form.Item> 
                                    
                                    <Form.Item 
                                        name='permit' 
                                        label={<span className='font-semibold'>Cho phép dùng giọng nói của bạn để tạo giọng nói tự động trong tính năng Vấn đáp AI</span>}
                                    >
                                        <Radio.Group
                                            style={{display:'flex', flexDirection: 'column', gap: 8}}
                                            onChange={onChangeRadio}
                                            value={radioVal}
                                            options={[
                                                { value: 1, label: 'Không cho phép' },
                                                { value: 2, label: "Cho phép" }
                                            ]}
                                        />
                                    </Form.Item>

                                    {radioVal === 2 && (
                                        <Form.Item 
                                            name="audio" 
                                            label={
                                                <div className='flex flex-col'>
                                                    <p>Xin vui lòng đọc theo đoạn văn sau:</p>
                                                    <p>“Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”</p>
                                                </div>
                                            }
                                            valuePropName={"filelist"}
                                            rules={[{ required: true, message: 'Vui lòng nhập file!' }]}
                                        >
                                            <Upload 
                                                className='w-full' 
                                                style={{ display: 'block' }}
                                                showUploadList={false} 
                                                beforeUpload={() => false}
                                                onChange={changeAudioProjectSelect}
                                                // accept={ modalVidDoc == 'document' ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ".mp4" }
                                            >
                                                <Input 
                                                    className='w-full'
                                                    placeholder="Ghi âm"
                                                    readOnly 
                                                    size="large"
                                                    value={audioProjectName}
                                                    suffix={<Image src={UploadIcon} alt="Doc" width={24} height={24} />}
                                                />
                                            </Upload>
                                        </Form.Item>
                                    )}

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

            </div>
        </main>
        
    );
}

export default Step3;