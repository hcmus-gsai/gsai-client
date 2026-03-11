'use client'

import React, { useState } from 'react';
import { Button, Select, Form, Input, InputNumber, Radio } from 'antd';
import type { RadioChangeEvent, InputNumberProps } from 'antd';

import { Step1Data } from '@/type/createClass.type'
import CreateClassIntro from '../components/create-class-intro';
import { XCircle } from '@deemlol/next-icons';

const { TextArea } = Input;

interface Props {
  data: any; // Dữ liệu hiện có từ cha (nếu quay lại từ bước 2)
  onNext: (data: Partial<Step1Data>) => void; // Hàm nhận vào dữ liệu của step 1
}

const Step1: React.FC<Props> = ({ data, onNext }) =>{
    const [form] = Form.useForm();

    const options = [
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Node.js', value: 'nodejs' },
    ];
    const [radioVal, setRadioVal] = useState(data.pricingType || 1);
    const onChangeRadio = (e: RadioChangeEvent) => {
        setRadioVal(e.target.value);
    };

    const formatter: InputNumberProps<number>['formatter'] = (value) => {
        const [start, end] = `${value}`.split('.') || [];
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${end ? `${v}.${end}` : `${v}`}`;
    };

    const handleFinish = (values: any) => {
        console.log('Dữ liệu thu thập được:', values);

        //Logic xử lý data từ step1

        onNext(values); // Gửi toàn bộ object values về file cha
    };

    return(
        <main className="w-full min-h-screen flex justify-center">
            <div className="relative w-[var(--global-width)] top-[15vh] mb-[200px] z-10">
                <CreateClassIntro step={1} title="Thông tin chung"/>

                <Form
                    form={form} 
                    onFinish={handleFinish} 
                    initialValues={data} // Chỗ này load data get từ server
                    requiredMark={false}
                    labelCol={{
                            xs: { span: 4 }, // Mặc định cho màn siêu nhỏ
                            sm: { span: 4 }, // Màn nhỏ
                            md: { span: 4 }, // Medium và trở xuống 
                            lg: { span: 2 }, // Từ màn hình Large (992px+) trở lên thì dùng 2
                            style: { display: 'flex', alignItems: 'center' } 
                    }}
                    labelAlign = "left"
                >
                    <Form.Item 
                        name="courseCode" 
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Mã môn</span>} className='text-bold'
                        rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
                    >
                        <Input size="large"/>
                    </Form.Item>

                    <Form.Item 
                        name="courseName" 
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Tên môn</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập tên môn!' }]}
                    >
                        <Input size="large"/>
                    </Form.Item>

                    <Form.Item 
                        name="description"
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px'}}>Mô tả</span>} 
                        labelCol={{xs: { span: 4 }, sm: { span: 4 }, md: { span: 4 }, lg: { span: 2 }, }}
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả môn học!' }]}
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
                    
                    <Form.Item 
                        name="categories"
                        className='mt-[10rem]' 
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Phân loại</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn phân loại môn học!' }]}
                    >
                        <Select size='large' mode="multiple" allowClear options={options}/>
                    </Form.Item>
                    
                    <Form.Item 
                        name="pricingType"
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Phí</span>}
                    >
                        <Radio.Group
                            style={{display:'flex', flexDirection: 'column', gap: 8}}
                            onChange={onChangeRadio}
                            value={radioVal}
                            options={[
                                { value: 1, label: 'Miễn phí' },
                                { value: 2, label: "Có phí" }
                            ]}
                        />
                    </Form.Item>

                    {radioVal === 2 && (
                        <Form.Item 
                            name="price" 
                            wrapperCol={{ xs: { offset: 4 }, sm: { offset: 4 }, md: { offset: 4 }, lg: { offset: 2 }}}
                            rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
                        >
                            <InputNumber<number> 
                                formatter={formatter} 
                                size="large" 
                                suffix="VND" 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                    )}

                    <Form.Item className='flex justify-center'>
                        <Button type="primary" htmlType="submit" size="large">Tiếp tục</Button>
                    </Form.Item>
                </Form>
            </div>
        </main>
    );
};

export default Step1;