import { CourseCategoryComponent } from '@/components/student/course-category-props';


const TagDisplaySession = () => {
    const learningCategory = [
        {
            id: 1,
            name: 'Lập trình Web',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Khoa học Dữ liệu',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Trí tuệ Nhân tạo',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình Mobile',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Phân tích Hệ thống',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Thiết kế UI/UX',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'An ninh Mạng',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Điện toán Đám mây',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 9,
            name: 'Hệ thống phân tán',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 10,
            name: 'Công nghệ Blockchain',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 11,
            name: 'Hệ thống HPC',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 12,
            name: 'Hệ thống IoT',
            image: '/images/learning-category-1.jpg'
        },

    ];
    
    var columns = 4;

    return (
        <div className = "relative w-full top-[15vh] mb-[200px] flex flex-col items-center justify-between z-10">
            <div className = "h-full w-full mb-[5vh] flex flex-col items-center justify-between ">
                <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <CourseCategoryComponent columns = {columns} categories = {learningCategory}/>
        </div>
    )
}

export {TagDisplaySession};