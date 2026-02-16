import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faHeart, faUsers, faRocket } from '@fortawesome/free-solid-svg-icons';

const values = [
    {
        icon: faLightbulb,
        title: "Sáng Tạo",
        description: "Luôn tìm kiếm giải pháp mới để nâng cao hiệu quả giáo dục.",
        color: "text-yellow-500",
        bgHover: "hover:bg-yellow-50/50"
    },
    {
        icon: faHeart,
        title: "Tận Tâm",
        description: "Đặt lợi ích của người học lên hàng đầu trong mọi quyết định.",
        color: "text-red-500",
        bgHover: "hover:bg-red-50/50"
    },
    {
        icon: faUsers,
        title: "Kết Nối",
        description: "Xây dựng cộng đồng học tập gắn kết và hỗ trợ lẫn nhau.",
        color: "text-blue-500",
        bgHover: "hover:bg-blue-50/50"
    },
    {
        icon: faRocket,
        title: "Tiên Phong",
        description: "Dẫn đầu trong việc ứng dụng công nghệ AI vào giảng dạy.",
        color: "text-purple-500",
        bgHover: "hover:bg-purple-50/50"
    }
];

export const CoreValues = () => {
    return (
        <section className="py-24 bg-neutral/30 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                        Our Culture
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Giá Trị Cốt Lõi
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className={`
                                group p-8 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]
                                ${value.bgHover} cursor-default
                            `}
                        >
                            <div className={`
                                w-14 h-14 mb-6 rounded-2xl flex items-center justify-center 
                                bg-gray-50 group-hover:bg-white transition-colors duration-300 shadow-sm
                            `}>
                                <FontAwesomeIcon icon={value.icon} className={`text-2xl ${value.color}`} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
