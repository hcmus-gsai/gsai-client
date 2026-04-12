export type ShowcaseLesson = {
    id: string;
    title: string;
    type: "video" | "document" | "quiz";
    duration: string;
    summary: string;
};

export type ShowcaseModule = {
    id: string;
    title: string;
    lessons: ShowcaseLesson[];
};

export type ShowcaseCourse = {
    id: string;
    code: "JF" | string;
    courseName: string;
    shortDescription?: string;
    duration: string;
    teacherName: string;
    modules: ShowcaseModule[];
};

const showcaseCourses: ShowcaseCourse[] = [
    {
        id: "jf-python-foundation",
        code: "JF",
        courseName: "Python Cơ Bản Cho Người Mới",
        shortDescription: "Nắm vững biến, vòng lặp, hàm và cách giải quyết bài toán thực tế.",
        duration: "6 tuần",
        teacherName: "ThS. Lê Minh Anh",
        modules: [
            {
                id: "m1",
                title: "Nền tảng ngôn ngữ",
                lessons: [
                    {
                        id: "l1",
                        title: "Biến và kiểu dữ liệu",
                        type: "video",
                        duration: "12 phút",
                        summary: "Giới thiệu cách lưu trữ dữ liệu và các kiểu dữ liệu phổ biến trong Python.",
                    },
                    {
                        id: "l2",
                        title: "Điều kiện và vòng lặp",
                        type: "document",
                        duration: "15 phút",
                        summary: "Hiểu cách điều khiển luồng chương trình với if/else và for/while.",
                    },
                ],
            },
            {
                id: "m2",
                title: "Thực hành ứng dụng",
                lessons: [
                    {
                        id: "l3",
                        title: "Bài tập mini: Quản lý danh sách công việc",
                        type: "quiz",
                        duration: "20 phút",
                        summary: "Áp dụng kiến thức đã học để xây dựng chương trình quản lý công việc đơn giản.",
                    },
                ],
            },
        ],
    },
    {
        id: "jf-ai-learning-strategy",
        code: "JF",
        courseName: "Chiến Lược Học Với AI",
        shortDescription: "Ứng dụng AI để tóm tắt kiến thức, luyện tập và tự đánh giá hiệu quả.",
        duration: "4 tuần",
        teacherName: "ThS. Trần Nhật Quang",
        modules: [
            {
                id: "m1",
                title: "Xây dựng kế hoạch học tập",
                lessons: [
                    {
                        id: "l1",
                        title: "Đặt mục tiêu học tập theo tuần",
                        type: "video",
                        duration: "10 phút",
                        summary: "Tạo mục tiêu cụ thể, đo lường được và bám sát tiến độ cá nhân.",
                    },
                    {
                        id: "l2",
                        title: "Sử dụng AI để tóm tắt tài liệu",
                        type: "document",
                        duration: "14 phút",
                        summary: "Hướng dẫn quy trình tóm tắt, kiểm chứng và ghi chú hiệu quả với AI.",
                    },
                ],
            },
        ],
    },
];

export const getShowcaseCourses = () => showcaseCourses.filter((course) => course.code === "JF");

export const findShowcaseCourseById = (id: string) =>
    getShowcaseCourses().find((course) => course.id === id);
