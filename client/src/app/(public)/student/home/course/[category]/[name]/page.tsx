'use client';
import '@ant-design/v5-patch-for-react-19';

import {useParams} from "next/navigation";
import {StudentGreetingSection} from "@/components/student/greeting";
import {FooterSection} from "@/components/guest/ui/guest";
import { Button, Card} from "antd";
import { ChevronDown, ChevronUp, Check } from "@deemlol/next-icons"
import {useState, useEffect} from 'react';
interface IChapterState {
    id: number;
    isExtended: boolean;
};

const CourseModules = () => {
    const chapters = [
        {
            id : 1,
            name : "Chương 1: Đại số tuyến tính",
            status: "Hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Hệ phương trình tuyến tính',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Vector',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Hệ phương trình tuyến tính',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Vector',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
        {
            id : 2,
            name : "Chương 2: Giải tích",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Vi tích phân',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Tích phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập toán ứng dụng 1',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Đạo hàm',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },

        {
            id : 3,
            name : "Chương 3: Xác suất thống kê",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Xác suất',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Thống kê',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập xác suất thống kê',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Bài tập thống kê',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
        {
            id : 4,
            name : "Chương 4: Phương trình vi phân",
            status: "Chưa hoàn thành",
            subItem: [
                {
                    id: 'st1',
                    name : 'Phương trình vi phân',
                    type : 'Bài đọc',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st2',
                    name : 'Phương trình vi phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st3',
                    name : 'Bài tập phương trình vi phân',
                    type : 'Quiz',
                    duration: '10:00',
                    status: 'Hoàn thành',
                },
                {
                    id: 'st4',
                    name : 'Bài tập phương trình vi phân',
                    type : 'video',
                    duration: '10:00',
                    status: 'Hoàn thành',
                }
            ]
        },
    ]

    const [chapterState, setChapterState] = useState<IChapterState[]>([
        ...chapters.map((c)=>{
            return {
                id: c.id,
                isExtended: false
            }
        })
    ]);

    const handleToggleChapter = (id : number) => {
        setChapterState(
            chapterState.map((cs) => {
                return cs.id === id ? {
                    ...cs,
                    isExtended: !cs.isExtended
                } : cs;
            })
        )
    }


    //ý tưởng: click vào mũi tên  -> Chỉ mở rộng chapter được ấn


    

    return (
        <section className="w-[60%] flex flex-col items-center justify-start">
            <div className="w-full">
                <p className="text-2xl font-semibold mb-4">Toán ứng dụng & thống kê</p>
                <div className="flex gap-3 mb-6">
                    <Button
                        className="!bg-blue-500 !text-white hover:!bg-white hover:!text-black"
                    >Bài giảng</Button>
                    <Button>Quiz</Button>
                    <Button>Điểm</Button>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <p className="text-[1rem] font-light text-[var(--color-primary)]">
                        Hoàn thành 75% · Dự kiến hoàn thành: 05/11/2025
                    </p>
                    <div className="bg-[var(--color-secondary)] w-full h-[10px] rounded-full">
                    </div>
                </div>
            </div>

            <div className="w-full mt-[2rem]">
                
                {chapters.map((c)=>(
                    <div key={c.id}>
                        <div className = "flex items-center flex-col justify-center gap-2">
                            <div className = "w-full flex flex-col items-center justify-center gap-2">
                                <div className = "w-full flex items-center justify-center gap-2">
                                    <div className = "flex items-center justify-start gap-2 mr-auto">
                                        <Button onClick = {() => handleToggleChapter(c.id)} className = "!bg-transparent !border-none !p-0 !m-0">
                                            {chapterState.find((cs) => cs.id === c.id)?.isExtended ? <ChevronUp width = {32} height = {32} className = "!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"/> : <ChevronDown width = {32} height = {32} className = "!text-[var(--color-primary)] !rounded-full !cursor-pointer hover:!text-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-all duration-300"/>}
                                        </Button>
                                        <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">{c.name}</p>
                                    </div>
                                    <div className = "flex items-center justify-start gap-2 ml-auto">
                                        <Check width = {32} height = {32} className = "!rounded-full !text-[var(--color-secondary)] !bg-[var(--color-neutral)] !p-2"/>
                                        <p className = "text-[1rem] font-bold text-[var(--color-secondary)]">{c.status}</p>
                                    </div>
                                </div>
                                <div className = "w-full flex items-center justify-start gap-2 border-b border-gray-300 pb-[1.25rem]">
                                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Đã hoàn thành</p>
                                </div>
                            </div>
                            <div className = "w-full flex flex-col items-start justify-start gap-[1.25rem]">
                                {chapterState.find((cs) => cs.id === c.id)?.isExtended && c.subItem.map((si)=>(
                                    <Card key={si.id}
                                        className="!w-full !flex !items-center !justify-start !rounded-[20px] !border !border-gray-200"
                                    >
                                        <div className = "w-full flex flex-col items-start justify-start">
                                            <p className ="text-[1rem] font-bold text-[var(--color-primary)]">{si.name}</p>
                                            <div className = "w-full flex items-center justify-start gap-2">
                                                <p className ="text-[1rem] font-light text-[var(--color-primary)]">
                                                    {si.type === 'video' 
                                                        ? 'Video' 
                                                        : si.type === 'quiz' 
                                                        ? 'Quiz' 
                                                        : 'Bài tập'
                                                    }
                                                </p>
                                                <p className ="text-[1rem] font-light text-[var(--color-primary)]">{si.duration}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
const CourseSchedule = () => {

    const events = [
        {
            id: 1,
            name:"Thi cuối kì",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 2,
            name:"Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 3,
            name:"Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 4,
            name:"Bài tập toán ứng dụng 2",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 1,
            name:"Thi cuối kì",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 2,
            name:"Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 3,
            name:"Bài tập lớn",
            deadline: "23:59 15/12/2025",
        },
        {
            id: 4,
            name:"Bài tập toán ứng dụng 2",
            deadline: "23:59 15/12/2025",
        }
    ]
    return(
        <section className = "w-[20%] flex flex-col items-start justify-start">
            <div className = "w-full h-full flex flex-col items-start justify-start gap-[2rem]">

                <Card className = "w-full !rounded-[20px] !border !border-gray-300" title = "Lịch học">
                    <p>Tôi cam kết sẽ học 3 ngày mỗi tuần để hoàn thành môn học này.</p>
                    <p>Điều chỉnh lịch học</p>
                </Card>

                <div 
                    className="w-full h-[350px] !rounded-[20px] !border !border-gray-300 
                                [&_.ant-card-body]:!p-0"
                >                    
                    <p className = "text-[1.5rem] font-bold text-[var(--color-primary)] p-2">Sự kiện sắp tới</p>
                    <div className="overflow-y-auto h-[calc(100%-40px)] flex flex-col gap-2">
                        {events.map((e)=>(
                            <Card key={e.id} className = "w-full h-[80px] rounded-[20px] !border !border-gray-300 !p-2">
                                <p>{e.name}</p>
                                <p>{e.deadline}</p>
                            </Card>
                        ))}


                    </div>
                    
                </div>
            </div>
        </section>
    );
}
export default function CourseDetailPage(){

    const params = useParams();
    const name = params.name as string;

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            
            <div className = "w-full h-full flex items-start justify-center mt-[10rem] gap-[2rem]">
                <CourseModules />
                <CourseSchedule />
            </div>
            <FooterSection hasRegisterBox = {false}/>
        </main>
    )
}