import {Button} from "antd";
import Image from "next/image";

const CourseCategoryComponent = (
    {
        columns,
        categories,
    }:{
        columns: number,
        categories :{
            id: number;
            name: string;
            image: string;
        }[];
    }
) => {
    return (
        <div className = {`grid gap-x-5 w-[calc(100%-12rem)] h-full gap-y-[2rem]`}
             style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}  
        >
            {        categories.map((item) => (
                <div key = {item.id} className = "flex items-center justify-center">
                    <Button className = "!w-full !h-[3.5rem] !p-0 !rounded-full !flex !items-center !justify-center !shadow-none hover:!shadow-[5px_5px_10px_var(--color-neutral)] transition duration-300">
                        <Image src = {item.image} alt = {item.name} width = {0} height = {0} className = "object-cover"/>
                        <p className = "text-[1rem] font-semibold text-[var(--color-primary)]">{item.name}</p>
                    </Button>
                </div>
            ))}
        </div>
    )
}

const CourseHighLightComponent = () => {
    
    return (
        <div className = "mt-[18vh] grid grid-cols-4 items-center justify-center w-[calc(100%-12rem)] h-[10.625rem] bg-white shadow-[5px_5px_20px_var(--color-neutral)] rounded-[20px]  border-2 border-gray-200 flex items-center justify-center gap-2 px-[1.5rem]">
           
            <div className = "flex flex-col items-center w-full h-[54%] border-r-2 border-gray-200">
                <div className = "w-[70%] h-full">
                    <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Khóa học miễn phí</p>
                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Mở rộng kỹ năng của bạn hoàn toàn miễn phí</p>
                </div>
            </div>

            <div className = "flex flex-col items-center w-full h-[54%] border-r-2 border-gray-200">
                <div className = "h-full">
                    <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">5 đánh giá</p>
                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">5 đánh giá</p>
                </div>
                
            </div>
            
            <div className = "flex flex-col items-center w-full h-[54%] border-r-2 border-gray-200">
                <div className = "w-[70%] h-full">
                    <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Trình độ trung cấp</p>
                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Trình độ đề xuất</p>
                </div>
            </div>
            
            <div className = "flex flex-col items-center w-full h-[54%]">
                <div className = "w-[70%] h-full">
                    <p className = "text-[1.5rem] font-bold text-[var(--color-primary)]">Lịch trình linh hoạt</p>
                    <p className = "text-[1rem] font-light text-[var(--color-primary)]">Hoản thành 5 giờ học mỗi tuần</p>
                </div>
            </div>
        </div>
    )
}
export {CourseCategoryComponent, CourseHighLightComponent};
