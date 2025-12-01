import { CourseCategoryComponent } from '@/components/student/course-category-props';


const TagDisplaySession = () => {
    const learningCategory = [
        {
            id: 1,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 2,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 3,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 4,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 5,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 6,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 7,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
        {
            id: 8,
            name: 'Lập trình',
            image: '/images/learning-category-1.jpg'
        },
    ];

    var columns = 4;

    return (
        <div className = "w-full absolute top-[15vh] flex flex-col items-center justify-between z-10">
            <div className = "h-full w-full mb-[5vh] flex flex-col items-center justify-between ">
                <p className = "text-[2.5rem] font-bold text-[var(--color-primary)]">Top lĩnh vực học tập phổ biến</p>
            </div>
            <CourseCategoryComponent columns = {columns} categories = {learningCategory}/>
        </div>
    )
}

export {TagDisplaySession};