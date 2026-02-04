import { Button } from "antd";
import Image from "next/image";
import starSVG from "@/../public/student/Star.svg"
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { setTitle } from "@/store/slice/courseDisplaySlice";

const CourseCategoryComponent = (
    {
        categories,
    }: {
        columns?: number,
        categories: { message: string; data: string[] };
    }
) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const categoriesData = categories?.data || [];

    return (
        <div className={`grid gap-x-5 w-[var(--global-width)] h-full gap-y-[1rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-y-[2rem]`}>
            {categoriesData.length > 0 && categoriesData.map((item) => (
                <div key={item} className="flex items-center justify-center">
                    <Button
                        className="!w-full !h-[3.5rem] !p-0 !rounded-full !flex !items-center !justify-center !shadow-none hover:!shadow-[5px_5px_10px_var(--color-neutral)] transition duration-300"
                        onClick={() => {
                            dispatch(setTitle(item));
                            router.push(`/student/category/${item.toLowerCase().replace(/ /g, '-')}`);
                        }}
                    >
                        <p className="text-[1rem] font-semibold text-[var(--color-primary)]">{item}</p>
                    </Button>
                </div>
            ))}
        </div>
    )
}

const CourseHighLightComponent = () => {
    //Các trường dữ liệu sẽ load từ database
    const { id } = useParams();
    // const {data: courseInfo, isLoading, error} = useGetCourseByIdQuery(id as string);
    // const courseData = courseInfo?.data;
    // const tuition_fee = courseData?.tuition_fee;
    // const duration = courseData?.duration;
    // console.log('This is course data: ', courseData);
    // console.log('This is course data tuition_fee: ', tuition_fee);
    // console.log('This is course data duration: ', duration);
    const tuition_fee = 0.0
    const duration = 0.0
    //===================================
    return (
        <div className="mt-[10.4rem] grid grid-cols-4 w-[var(--global-width)] min-h-[11rem] bg-white shadow-[5px_5px_20px_var(--color-neutral)] rounded-[20px]  border-2 border-gray-200 py-3">
            <div className="flex flex-col items-center w-full border-r-2 border-gray-200">
                <div className="mt-7 w-[80%] h-full">
                    {
                        tuition_fee === 0.0 ? (
                            <>
                                <p className="text-[1.5rem] mb-3 font-bold text-[var(--color-primary)]">Khóa học miễn phí</p>
                                <p className="text-[1rem] font-light text-[var(--color-primary)]">Mở rộng kỹ năng của bạn hoàn toàn miễn phí</p>
                            </>
                        ) : (
                            <>
                                <p className="text-[1.5rem] font-bold text-[var(--color-primary)]">Khóa học có phí</p>
                                <p className="text-[1rem] font-light text-[var(--color-primary)]">Phí: {tuition_fee} VNĐ</p>
                            </>
                        )
                    }
                </div>
            </div>

            <div className="flex flex-col items-center w-full border-r-2 border-gray-200">
                <div className="mt-7 h-full">
                    <span className="flex mb-3">
                        <p className="text-[1.4rem] mr-4 font-bold text-[var(--color-primary)]">5.0</p>

                        <Image
                            src={starSVG} alt="Star Icon" width={24} height={24}
                            className="w-[1.4rem] h-auto"
                        />
                    </span>
                    <p className="text-[1rem] font-light text-[var(--color-primary)]">5 đánh giá</p>
                </div>
            </div>

            <div className="flex flex-col items-center w-full border-r-2 border-gray-200">
                <div className="mt-7 w-[80%] h-full">
                    <p className="text-[1.5rem] mb-3 font-bold text-[var(--color-primary)]">Trình độ trung cấp</p>
                    <p className="text-[1rem] font-light text-[var(--color-primary)]">Trình độ đề xuất</p>
                </div>
            </div>

            <div className="flex flex-col items-center w-full">
                <div className="mt-7 w-[70%] h-full">
                    <p className="text-[1.4rem] mb-3 font-bold text-[var(--color-primary)]">Thời lượng khóa học</p>
                    <p className="text-[1rem] font-light text-[var(--color-primary)]">Hoàn thành {duration} học</p>
                </div>
            </div>
        </div>
    )
}
export { CourseCategoryComponent, CourseHighLightComponent };
