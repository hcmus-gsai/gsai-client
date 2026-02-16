import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptop, faChalkboardTeacher, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

const contexts = [
    {
        icon: faLaptop,
        title: "Tự Học Tại Nhà",
        description: "Sinh viên có thể ôn tập và kiểm tra kiến thức bất cứ lúc nào.",
        gradient: "from-blue-500/10 to-transparent"
    },
    {
        icon: faChalkboardTeacher,
        title: "Hỗ Trợ Giảng Đường",
        description: "Giảng viên sử dụng làm công cụ bổ trợ để tăng tương tác.",
        gradient: "from-purple-500/10 to-transparent"
    },
    {
        icon: faMobileAlt,
        title: "Học Tập Di Động",
        description: "Truy cập bài giảng và bài tập ngay trên thiết bị di động.",
        gradient: "from-cyan-500/10 to-transparent"
    }
];

export const UsageContext = () => {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Học Tập Mọi Lúc, Mọi Nơi
                    </h2>
                    <p className="text-gray-600">
                        Epis được thiết kế để phù hợp với nhiều ngữ cảnh học tập khác nhau, mang lại sự linh hoạt tối đa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contexts.map((ctx, index) => (
                        <div
                            key={index}
                            className={`
                                relative p-8 rounded-3xl border border-gray-100 bg-white overflow-hidden group
                                transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                            `}
                        >
                            {/* Gradient Background Effect on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${ctx.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-neutral text-secondary flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                    <FontAwesomeIcon icon={ctx.icon} className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 block">
                                    {ctx.title} {ctx.title === "Học Tập Di Động" && <span className="text-xs text-gray-500">(đang phát triển)</span>}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {ctx.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
