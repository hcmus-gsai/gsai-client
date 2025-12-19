import { CourseCategoryComponent } from '@/components/student/course-category-props';
import {useGetAllCategoriesQuery} from "@/store/api/[module]/courseApi";

const TagDisplaySession = () => {
    const {data: categories} = useGetAllCategoriesQuery();

    
    var columns = 4;

    return (
        <div className = "relative w-full top-[15vh] mb-[200px] flex flex-col items-center justify-between z-10">
            <div className = "h-full w-full mb-[5vh] flex flex-col items-center justify-between ">
                <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <CourseCategoryComponent columns = {columns} categories = {categories || { message: 'No categories found', data: [] }}/>
        </div>
    )
}

export {TagDisplaySession};