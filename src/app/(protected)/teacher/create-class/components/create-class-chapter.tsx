'use client'

import Image from 'next/image';

import { Form, Input } from 'antd'
import  TrashIcon from '@/../public/teacher/createClassTrash.svg'
import  CopyIcon from '@/../public/teacher/createClassCopy.svg'

const { TextArea } = Input;
const CreateClassChapter = ({ index, name, restField, remove, add, form}: any) => {
    const handleCopy = () => {
        const allChapters = form.getFieldValue('chapters');
        
        const currentChapterData = allChapters[name];
        add({
            ...currentChapterData,
            chapterName: `${currentChapterData.chapterName || ''} (Bản sao)`
        }, index + 1); 
    };

    return (
        <div className='border-1 border-gray-500/50 rounded-2xl px-[3rem] py-[2rem] mb-[1rem]'>
            <p className='mb-[2rem] text-2xl font-bold'>Chương {index + 1}</p>

            <Form.Item
                {...restField}
                name={[name, 'chapterName']}
                label={<span className='font-bold text-base'>Tên chương</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên chương!' }]}
            >
                <Input size="large"/>
            </Form.Item>

            <Form.Item 
                {...restField}
                name={[name, 'description']}
                label={<span className='font-bold text-base'>Mô tả</span>} 
                rules={[{ required: true, message: 'Vui lòng nhập mô tả chương!' }]}
                labelCol={{xs: { span: 4 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 3 }, }}
            >
                <TextArea 
                    rows={3}
                    maxLength={350}
                    className='mb-[2rem]'
                    styles={{
                        count: {
                            width: '100%', //Char count located left align on flex box. (origin made it small and locate on right hand)
                        },
                    }}
                    count={{
                        show: ({ count, maxLength }) => `${count} / ${maxLength} ký tự`,
                    }}
                />
            </Form.Item>

            <hr style={{color:'gray', opacity:0.5}}/>
            
            <div className='mt-[2rem] flex justify-end gap-7'>
                <button 
                    type='button' 
                    onClick={() => remove(name)}
                    className="group focus:outline-none transition-transform active:scale-95"
                >
                    <Image src={TrashIcon} alt="Delete" width={24} height={24} />
                </button>
                
                <button 
                    type='button' 
                    onClick={handleCopy}
                    className="group focus:outline-none transition-transform active:scale-95"
                >
                    <Image src={CopyIcon} alt="Copy" width={24} height={24} />
                </button>
            </div>
            
        </div>
    )
};

export default CreateClassChapter;