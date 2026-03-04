'use client'

import { Form, Button } from 'antd'

import CreateClassIntro from '../components/create-class-intro'
import CreateClassChapter from '../components/create-class-chapter'
import { Step2Data } from '@/type/createClass.type'

interface Props {
  data: any; 
  onNext: (data: Partial<Step2Data>) => void;
  onBack: () => void
}

const Step2: React.FC<Props> = ({ data, onNext, onBack}) =>{
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        console.log('Dữ liệu thu thập được:', values);
        onNext(values); // Gửi toàn bộ object values về file cha
    };

    return (
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={2} title="Thông tin chương"/>

                <Form 
                    form={form} 
                    onFinish={handleFinish} 
                    initialValues={{ chapters: [{}] }} // Mặc định có 1 chương trống
                    requiredMark={false}
                    labelCol={{
                        xs: { span: 4 }, 
                        sm: { span: 4 }, 
                        md: { span: 4 },
                        lg: { span: 3 },
                        style: { display: 'flex', alignItems: 'center' } 
                    }}
                    labelAlign = "left"
                >
                    <Form.List name="chapters">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <CreateClassChapter 
                                        key={key}
                                        index={index}
                                        restField={restField}
                                        name={name}
                                        remove={remove}
                                        add={add}
                                        form={form}
                                    />
                                ))}
                                
                                <button 
                                    type='button'
                                    onClick={() => add()}
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
                            </>
                        )}
                    </Form.List>

                    <div className='w-full flex justify-center gap-6'>
                        <Button type="default" onClick={onBack} size="large">Quay lại</Button>
                        <Button type="primary" htmlType="submit" size="large">Tiếp tục</Button>
                    </div>
                </Form>
                
            </div>
        </main>
    )
}

export default Step2;