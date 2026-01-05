'use client';
import "@ant-design/v5-patch-for-react-19";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from 'react';
import {Card, Progress, Input, Calendar, ConfigProvider, theme, Button} from "antd";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import { FooterSection } from "@/components/guest/ui/guest";
import StreakLogo from "@/../public/student/StreakLogo.svg";
import UpperPointer from "@/../public/student/UpperPointer.svg";
import LowerPointer from "@/../public/student/LowerPointer.svg";
import { UpOutlined, DownOutlined, CalendarOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";

import ClockIcon from "@/../public/student/ClockIcon.svg";
import ComputingIcon from "@/../public/student/ComputingIcon.svg";
import VideoIcon from "@/../public/student/VideoIcon.svg";
import MoreIcon from "@/../public/student/MoreIcon.svg";
//API call
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { useGetUserProfileQuery } from "@/store/api/[module]/userApi";
import { useGetAllEnrollmentsQuery } from "@/store/api/[module]/enrollmentApi";
import { EnrolledCourse } from "@/type/enrollment.type";
import { useLazyGetLearningProgressByEnrollmentQuery} from "@/store/api/[module]/lessonProgressApi";
import {useLazyGetCourseModulesQuery} from "@/store/api/[module]/courseApi";
import {LessonProgress} from "@/type/lessonProgress.type";

//Routing
import { useRouter } from "next/navigation";
const CustomCalendar = () => {
    const [chosenDate, setChosenDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const tasks = useAppSelector((state) => state.task.tasks);

    const getTasksForDate = (date: Date) => {
        return tasks.filter(task => new Date(task.dueDate).toDateString() === date.toDateString());
    }

    const calendar_info = {
        weekDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
    }

    const calendar_dates = useMemo(()=>{

        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const days = [];
        const first = new Date(currentYear, currentMonth, 1);
        const last = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(first);
        const dayOfWeek = first.getDay();
        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - offset);
        
        const temp = new Date(startDate);

        while (temp <= last || temp.getDay() !== 1){
            const dayTasks = getTasksForDate(temp);
            const completedCnt = dayTasks.filter(
                task => task.status === 'completed'
            ).length;
            
            const overdueCnt = dayTasks.filter(
                task => task.status === 'overdue'
            ).length;
            
            const pendingCnt = dayTasks.filter(
                task => task.status === 'pending'
            ).length;
            
            days.push({
                date: new Date(temp),
                checkCurrentDay : temp.toDateString() === new Date().toDateString(),
                checkCurrentMonth: temp.getMonth() == currentMonth,
                taskCount: dayTasks.length,
                completedCnt,
                overdueCnt,
                pendingCnt,
                tasks: dayTasks,
            });
            temp.setDate(temp.getDate() + 1);

        }


        return days;
    },[currentDate, tasks ])

    return (
        <div className="flex flex-col h-full bg-white text-gray-800 overflow-hidden w-full rounded-[20px]">            
            <div className="flex flex-col items-start justify-between p-4 border-b border-gray-200 gap-[1rem]">
                <div className="w-full flex items-center justify-between">
                    <Button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="
                            !p-2
                            rounded-[20px]
                            !shadow-none
                            !border-none
                            !text-gray-600
                            hover:!bg-gray-200
                            hover:!text-gray-800
                            transition-colors
                            duration-200
                        "
                    >
                        Trước
                    </Button>
                    
                    <div className="text-[1rem] font-bold text-gray-900 min-w-[160px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long' }) === 'January' 
                        ? 'Tháng 1' : currentDate.toLocaleString('default', { month: 'long' }) === 'February' 
                        ? 'Tháng 2' : currentDate.toLocaleString('default', { month: 'long' }) === 'March' 
                        ? 'Tháng 3' : currentDate.toLocaleString('default', { month: 'long' }) === 'April' 
                        ? 'Tháng 4' : currentDate.toLocaleString('default', { month: 'long' }) === 'May' 
                        ? 'Tháng 5' : currentDate.toLocaleString('default', { month: 'long' }) === 'June' 
                        ? 'Tháng 6' : currentDate.toLocaleString('default', { month: 'long' }) === 'July' 
                        ? 'Tháng 7' : currentDate.toLocaleString('default', { month: 'long' }) === 'August' 
                        ? 'Tháng 8' : currentDate.toLocaleString('default', { month: 'long' }) === 'September' 
                        ? 'Tháng 9' : currentDate.toLocaleString('default', { month: 'long' }) === 'October' 
                        ? 'Tháng 10' : currentDate.toLocaleString('default', { month: 'long' }) === 'November' 
                        ? 'Tháng 11' : 
                          'Tháng 12'},
                        {currentDate.getFullYear()}
                    </div>
                    
                    <Button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="
                            !p-2
                            rounded-[20px]
                            !shadow-none
                            !border-none
                            !text-gray-600
                            hover:!bg-gray-200
                            hover:!text-gray-800
                            transition-colors
                            duration-200
                        "
                    >
                       Sau
                    </Button>
                </div>

                <div className="flex items-center gap-[0.5rem]">
                    <Button
                        className="!px-4 !py-2 !bg-secondary !hover:bg-secondary/80 !text-white rounded-[20px] !shadow-sm !font-medium !transition-colors !text-sm !border-none" 
                        onClick={() => setCurrentDate(new Date())}
                    >
                        Hôm nay
                    </Button>
                    
                    
                    <DatePicker
                        open = {showDatePicker}
                        onOpenChange = {setShowDatePicker}
                        value = {dayjs(currentDate)}
                        onChange = {(date) => {
                            if (date) {
                                setCurrentDate(date.toDate());
                                setChosenDate(date.toDate());
                            }
                            setShowDatePicker(false);
                        }}
                        style={{ width: 0, height: 0, padding: 0, border: 'none', visibility: 'hidden', position: 'absolute' }}

                    />
                    <Button
                        className="!p-2 !bg-gray-100 hover:!bg-gray-200 !text-gray-600 rounded-[20px] !shadow-none !border-none"
                        onClick={() => setShowDatePicker(true)}
                        icon={<CalendarOutlined />}
                    />
                </div>
            </div>
            
            <div className = "flex flex-col flex-1 overflow-hidden w-full">
                <div className = "grid grid-cols-7 gap-2">
                    {calendar_info.weekDays.map(day => (
                        <div key={day} className="py-2 text-center text-xs font-tracking-wider text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr flex-1 gap-[1px]">
                    

                    {calendar_dates.map((day: any, index: number)=>{
                        const isSelected = chosenDate && day.date.toDateString() === chosenDate.toDateString();

                        return (
                            <div
                                key = {index}
                                onClick = {() => setChosenDate(day.date)}
                                className={`
                                    relative flex flex-col h-[40px] w-full cursor-pointer transition-all duration-200 rounded-[5px]
                                    ${!day.checkCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                            
                                    ${isSelected ? 'ring-2 ring-inset ring-secondary' : 'hover:bg-gray-100'}
                                `}
                            >
                                <div className={`
                                    flex items-center justify-center w-full h-full rounded-[5px]
                                    ${day.checkCurrentDay ? 'bg-secondary text-white shadow-md' : ''}
                                `}>
                                    {day.date.getDate()}
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>

    )
}

export default function LearningProgressPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, []);

    const events = [
        { id: 1, name: "Thi cuối kì", deadline: "23:59 15/12/2025" },
        { id: 2, name: "Bài tập lớn", deadline: "23:59 15/12/2025" },
        { id: 3, name: "Bài tập lớn", deadline: "23:59 15/12/2025" },
        { id: 4, name: "Toán ứng dụng 2", deadline: "23:59 15/12/2025" },
        { id: 5, name: "Thi cuối kì", deadline: "23:59 15/12/2025" },
    ]


    

    const router = useRouter();
    const {data: profile, isLoading, error} = useGetUserProfileQuery();
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetAllEnrollmentsQuery();

    const name = profile?.full_name || '';
    const enrollments: EnrolledCourse[] = enrollmentsData?.data ?? [];

    const [activeTab, setActiveTab] = useState("all");
    const courseListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (courseListRef.current) {
            courseListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeTab]);

    const TabButton = ({ id, label }: { id: string; label: string }) => (
        <Button
          onClick={() => setActiveTab(id)}
          className={`!px-4 !py-1.5 !rounded-full !text-sm !font-medium !transition-colors ${
            activeTab === id
              ? "!bg-blue-100 !text-blue-600" 
              : "!bg-gray-100 !text-gray-500 hover:!bg-gray-200"
          }`}
        >
          {label}
        </Button>
    );

    const [fetchProgress] = useLazyGetLearningProgressByEnrollmentQuery();
    const [fetchModules] = useLazyGetCourseModulesQuery();

    const [progressMap, setProgressMap] = useState<Record<string, LessonProgress[]>>({});
    const [totalLessonMap, setTotalLessonMap] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadProgressAndLesson = async () => {
            if (!enrollments.length) 
                return;
            const progressResults: Record<string, LessonProgress[]> = {};
            const totalLessonResults: Record<string, number> = {};

            for (const enrolled_course of enrollments) {
                try {
                    const progressResponse = await fetchProgress(enrolled_course.id).unwrap();
                    console.log('Progress response for enrollment', enrolled_course.id, progressResponse);
                    progressResults[enrolled_course.id] = progressResponse.lessonProgress;
                    const modulesResponse = await fetchModules(enrolled_course.course_id).unwrap();
                    totalLessonResults[enrolled_course.id] = modulesResponse.modules.length;
                }
                catch (error) {
                    console.error(`Error loading progress for course`, error);
                }
            }
            setProgressMap(progressResults);
            setTotalLessonMap(totalLessonResults);
        }
        loadProgressAndLesson();
    }, [enrollments, fetchProgress, fetchModules]);


    

    const typeTranslate: Record<string, {label: string}> = {
        'video': {label: 'Video'},
        'document': {label: 'Tài liệu'},
        'quiz': {label: 'Quiz'},
        'project': {label: 'Bài tập lớn'},
    }

    const getCompletionPercent = useMemo(() => {
        return (courseId: string) => {
            const progress = progressMap[courseId];

            const totalLesson = totalLessonMap[courseId];
            
            if (!progress || !totalLesson || totalLesson === 0) return 0;

            const completedCount = progress.filter(p => p.is_completed).length;
            const completionPercent = Math.round((completedCount / totalLesson) * 100);
            
            return completionPercent;
        }
    }, [progressMap, totalLessonMap]);

    const getChosenLesson = useMemo(() => {
        return (courseId: string) => {
            const progress = progressMap[courseId];
            if (!progress || progress.length === 0) return null;
            const currentProgress = progress.find(p => !p.is_completed && p.lesson?.order_index === Math.min(...progress.filter(p => !p.is_completed).map(p => p.lesson?.order_index || 0)));
            return currentProgress?.lesson || null;
        }
    }, [progressMap]);

    const formatTime = useMemo(() => {
        return (time: string) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            if (hours > 0) return `${hours} giờ`;
            if (minutes > 0) return `${minutes} phút`;
            return `${seconds} giây`;
        }
    }, []);  
    

    const filteredEnrollments = useMemo(()=> {
        return enrollments.filter((course) => {
            if (activeTab === "all") return true;
            if (activeTab === "ongoing") return course.completion_status === "in_progress";
            if (activeTab === "completed") return course.completion_status === "completed";
            return true;
        });
    }, [enrollments, activeTab]);

    return (
        <>

        <section className = "h-full w-full flex flex-col items-center justify-center mt-[10rem]">
            <div className = "w-[var(--global-width)] flex items-stretch justify-between gap-[1rem] mb-[1.5rem]">
                <div className ="flex-1 flex flex-col items-start justify-start">
                    <div className = "mb-[1rem]">
                        <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Xin chào {name}!</p>
                        <p className = "text-[1rem] text-[var(--color-primary)]">Bạn có một bài quiz sẽ hết hạn hôm nay. Hãy xem lại thời gian biểu và hoàn thành ngay nhé!</p>
                    </div>
                    <div className = "flex-1 flex flex-col w-full gap-[1rem]">
                        <div className = "w-full grid grid-cols-[64%_34%] grid-rows-[auto_auto] gap-[1rem]">
                            <div className = "flex flex-col items-center justify-center bg-[var(--color-bg-white)] rounded-[20px] border-[1px] border-solid border-[#DCDCDC] p-[1rem]">
                                <p className = "text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">Tình trạng học tập</p>
                                <div className = "flex item-center justify-center w-full">
                                    <div className = "flex items-end justify-end">
                                        {/* <p className = "text-[0.875rem] text-[var(--color-primary)]">Đã hoàn thành ({getCompletionPercent(enrollments[0].id)}%)</p> */}
                                        <Image src={LowerPointer} alt="Lower Pointer" width={36} height={36}
                                            className = "relative bottom-5 object-cover !w-[3rem] !h-auto"
                                        />
                                    </div>
                                    
                                    {/* <Progress percent = {getCompletionPercent(enrollments[0].id)} type = "circle" size = {100} strokeWidth={12} strokeLinecap ="square" /> */}

                                    <div className = "flex items-start justify-start">
                                        <Image src={UpperPointer} alt="Upper Pointer" width={36} height={36}
                                            className="relative top-2 object-cover !w-[3rem] !h-auto"
                                        />
                                        <p className = "text-[0.875rem] text-[var(--color-primary)]">Đang học</p>
                                    </div>
                                </div>                            
                            </div>

                            <div className = "flex flex-col items-center justify-start bg-[var(--color-bg-white)] rounded-[20px] border-[1px] border-solid border-[#DCDCDC] p-[1rem]">
                                <p className = "text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">Kỷ lục học liên tiếp</p>

                                <div className = "flex flex-col items-center justify-start">
                                    <Image src={StreakLogo} alt="Streak Logo" width={48} height={48}
                                        className="object-cover !w-[4rem] !h-auto"
                                    />
                                    <p className = "text-[1rem] text-[var(--color-primary)]">ngày</p>

                                </div>
                            </div>
                        </div>
                        <div className = "w-full flex-1 min-h-[200px] bg-[var(--color-bg-white)] rounded-[20px] border-[1px] border-solid border-[#DCDCDC] p-[1rem]">
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">Giờ học trung bình tuần qua</p>
                        </div>
                    </div>

                </div>
                <div className = "w-[26%] flex flex-col items-center justify-start">

                    <div className = "w-full flex flex-col items-center justify-start bg-[var(--color-bg-white)] rounded-[20px] border-[1px] border-solid border-[#DCDCDC] p-[1rem]">
                        <CustomCalendar/>

                        <div className = "bg-gray-200 w-full h-[1px] mt-1[rem] mb-[1rem]">
                        </div>

                        <div
                            className="w-full h-[350px] p-[1rem] max-h-[350px] overflow-y-auto custom-scrollbar"
                        >
                            <p className="text-[1rem] font-bold text-[var(--color-primary)] mb-[1rem]">
                                Sự kiện sắp tới
                            </p>
                            <div className="flex-1 overflow-y-auto flex flex-col gap-[0.5rem] pr-2 custom-scrollbar">
                                {events.map((e) => (
                                    <Card
                                        key={e.id}
                                        className="w-full min-h-[80px] rounded-[20px] !border !border-gray-300 shrink-0"
                                        styles={{ body: { padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' } }}
                                    >
                                        <div className="bg-[var(--color-neutral)] w-[48px] h-[48px] rounded-full flex-shrink-0 flex items-center justify-center">
                                            <Image src={ComputingIcon} alt="Icon" width={20} height={20} />
                                        </div>
                                        <div className="flex-1 min-w-0"> {/* min-w-0 giúp truncate hoạt động trong flex */}
                                            <p className="text-[0.875rem] md:text-[1rem] font-bold text-[var(--color-primary)] truncate">
                                                {e.name}
                                            </p>
                                            <div className="flex items-center justify-between gap-1 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Image src={ClockIcon} alt="Clock" width={16} height={16} />
                                                    <p className="text-[0.75rem] font-light text-[var(--color-primary)] whitespace-nowrap">
                                                    15/12
                                                    </p>
                                                </div>
                                                <p className="text-[0.75rem] font-light text-[var(--color-primary)]">
                                                    23:59
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
            
            <div className = "w-[var(--global-width)] flex flex-col items-start justify-start">
                <div className="flex gap-3 mb-6">
                    <TabButton id="ongoing" label="Đang học" />
                    <TabButton id="completed" label="Đã hoàn thành" />
                    <TabButton id="all" label="Tất cả" />
                </div>

                <div className = "w-full flex flex-col">
                    <div 
                        ref={courseListRef}
                        className="w-full flex flex-col items-center justify-start gap-[1.5rem] mb-[2rem] max-h-[500px] overflow-y-auto custom-scrollbar"
                    >
                        {enrollmentsLoading ? (
                            <div className="w-full flex items-center justify-center py-8">
                                <div className="animate-pulse text-[var(--color-primary)]">Đang tải...</div>
                            </div>
                        ) : filteredEnrollments.length === 0 ? (
                            <div className="w-full flex items-center justify-center py-8">
                                <p className="text-gray-500">Không có môn học nào</p>
                            </div>
                        ) : filteredEnrollments.map((course) => {
                                const completionPercent = getCompletionPercent(course.id);
                                const isCompleted = completionPercent === 100;
                                const chosenLesson = getChosenLesson(course.id);
                            
                                return (
                                    <div
                                        key={course.id}
                                        className="flex items-center justify-between w-full p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md hover:border-[#1363DF]/30 transition-all duration-200"
                                    >
                                        <div className="mr-4">
                                            {getCompletionPercent(course.id) === 100 ? (
                                                <div className="w-8 h-8 rounded-full bg-[#1363DF] flex items-center justify-center">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M13.3 4.3L6 11.6L2.7 8.3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-[#E5E7EB]"></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1 min-w-0 pr-8">
                                            <p className="text-lg font-semibold text-[var(--color-primary)] truncate">
                                                {course.course_code} - {course.course_name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Hoàn thành {getCompletionPercent(course.id)}% · Dự kiến hoàn thành: {formatTime(chosenLesson?.estimated_completion_time || '')}
                                            </p>                                    

                                            <Progress
                                                percent={completionPercent}
                                                showInfo={false}
                                                strokeColor={isCompleted ? "#22c55e" : "#1363DF"}
                                                trailColor="#E5E7EB"
                                                className="max-w-[400px]"
                                            />
                                        </div>

                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-right">
                                                <p className="text-base font-semibold text-[var(--color-primary)] max-w-[200px] truncate">
                                                    {chosenLesson?.lesson_name || '-'}
                                                </p>
                                                <div className="flex items-center justify-end gap-2 mt-1">
                                                    {/* <Image src={VideoIcon} alt="Type Icon" width={16} height={16} /> */}
                                                    <p className="text-xs text-gray-500">
                                                        {chosenLesson?.estimated_completion_time || '-'} &#9679; {typeTranslate[chosenLesson?.type || '']?.label || '-'}
                                                    </p>
                                                </div>
                                            </div>

                                            <Button
                                                type="primary"
                                                onClick={() => router.push(`/student/courses/${course.course_id}/content`)}
                                                className="!w-32 !h-11 !rounded-full !bg-[#1363DF] hover:!bg-[#0d4eb8] !border-none !font-medium !shadow-sm"
                                            >
                                                {isCompleted ? "Xem lại" : "Tiếp tục"}
                                            </Button>

                                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                                <Image src={MoreIcon} alt="More Icon" width={20} height={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                </div>
                
            </div>
        </section>
        <FooterSection hasRegisterBox = {false}/>


        </>
    )
}
