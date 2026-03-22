'use client'

import React, { useState } from 'react';
import { Button, Select, Form, Input, Space, InputNumber, Radio, message } from 'antd';
import type { RadioChangeEvent, InputNumberProps } from 'antd';

import { Step1Data } from '@/type/createClass.type'
import CreateClassIntro from '../components/create-class-intro';
import { useCreateCourseStepMutation, useGetAllCategoryQuery, usePatchCourseStepMutation } from '@/store/api/[module]/createClassApi';
import { useSearchParams } from 'next/navigation';

const { TextArea } = Input;

interface InputProps {
    value?: number | null;
    onChange?: (value: number | null) => void;
    id?: string;
    content: string
}

const CustomInput: React.FC<InputProps> = ({ value, onChange, id, content }) => (
    <Space.Compact style={{ width: '100%' }}>
        <InputNumber 
            id={id}
            value={value} 
            onChange={onChange} 
            min={1} 
            step={1} 
            size="large" 
            style={{ width: '100%' }}
        />
        <Button 
            disabled 
            size="large"
            style={{ 
                color: 'rgba(0, 0, 0, 0.88)',
                backgroundColor: '#fafafa'  
            }}
            className="!cursor-not-allowed !pointer-events-none hover:!bg-inherit hover:!text-inherit hover:!border-inherit [&_.anticon]:!text-inherit"
        >
            {content}
        </Button>
    </Space.Compact>
);

interface Props {
  data: any; // Dữ liệu hiện có từ cha (nếu quay lại từ bước 2)
  onNext: (data: Partial<Step1Data>) => void; // Hàm nhận vào dữ liệu của step 1
}

const Step1: React.FC<Props> = ({ data, onNext }) =>{
    const searchParams = useSearchParams();
    const [form] = Form.useForm();
    const { data: categoryData } = useGetAllCategoryQuery();
    const [createCourseStep, { isLoading: isCreating }] = useCreateCourseStepMutation();
    const [patchCourseStep, { isLoading: isUpdating }] = usePatchCourseStepMutation();

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

    const handleFinish = async (values: any) => {
        console.log('Dữ liệu thu thập được:', values);
        let buffer = values.duration + " tháng";

        //Logic xử lý data từ step1
        const courseData = {
            // On form
            course_code: values.courseCode,
            course_name: values.courseName,
            course_description: values.description,
            duration: buffer,
            thumbnail_url: values.thumbnail_url || undefined,
            tuition_fee: values.price || 0,
            category: values.categories,

            // Implicit
            is_active: false,
        };

        try {
            const resumeCourseId = searchParams.get('courseId') || undefined;
            let courseId = (data.courseId as string | undefined) || resumeCourseId;

            if (courseId) {
                await patchCourseStep({
                    courseId,
                    body: courseData,
                }).unwrap();
                message.success('Cập nhật thông tin môn học thành công');
            } else {
                const created = await createCourseStep(courseData).unwrap();
                if (!created || !created.id) {
                    message.error(created?.message || 'Không thể tạo môn học, vui lòng thử lại');
                    return;
                }
                courseId = created.id;
                message.success('Tạo môn học thành công');
            }

            onNext({
                ...values,
                courseId,
            });
        } catch (error) {
            console.error('Create/Patch course error', error);
            message.error('Không thể lưu thông tin môn học, vui lòng thử lại');
        }
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
                        name="duration" 
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Thời lượng</span>}
                        rules={[{ required: true, message: 'Vui lòng nhập thời lượng môn học!' }]}
                    >
                        <CustomInput content="Tháng" />
                    </Form.Item>

                    <Form.Item 
                        name="categories"
                        className='mt-[10rem]' 
                        label={<span style={{ fontWeight: 'bold', fontSize: '16px' }}>Phân loại</span>}
                        rules={[{ required: true, message: 'Vui lòng chọn phân loại môn học!' }]}
                    >
                        <Select size='large' mode="multiple" allowClear options={categoryData?.data?.map((category) => ({ label: category, value: category }))}/>
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
                            <CustomInput content="VND" />
                            {/* <InputNumber<number> 
                                formatter={formatter} 
                                size="large" 
                                suffix="VND" 
                                style={{ width: '100%' }} 
                            /> */}
                        </Form.Item>
                    )}

                    <Form.Item className='flex justify-center'>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={isCreating || isUpdating}
                        >
                            Tiếp tục
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </main>
    );
};

export default Step1;