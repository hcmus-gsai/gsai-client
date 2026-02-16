import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagCheckered, faCodeBranch, faRocket, faStar } from '@fortawesome/free-solid-svg-icons';

const roadmap = [
    {
        year: "Q1 2025",
        title: "Khởi tạo & Nghiên cứu",
        description: "Xây dựng lõi AI và nghiên cứu hành vi người dùng.",
        icon: faCodeBranch,
        status: "completed"
    },
    {
        year: "Q3 2025",
        title: "Bản Beta Thử Nghiệm",
        description: "Ra mắt phiên bản thử nghiệm tại một số trường đại học.",
        icon: faRocket,
        status: "current"
    },
    {
        year: "2026",
        title: "Mở Rộng Hệ Sinh Thái",
        description: "Tích hợp thêm các công cụ hỗ trợ giảng dạy nâng cao.",
        icon: faStar,
        status: "planning"
    },
    {
        year: "2027+",
        title: "Đa Ngôn Ngữ & Quốc Tế",
        description: "Mở rộng nền tảng ra thị trường quốc tế.",
        icon: faFlagCheckered,
        status: "planning"
    }
];

export const RoadmapSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                        Roadmap
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Hành Trình Phát Triển
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 hidden md:block"></div>

                    <div className="space-y-12">
                        {roadmap.map((item, index) => (
                            <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Content Side */}
                                <div className={`flex-1 w-full text-center ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                                    <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-1 block">
                                        {item.year}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </div>

                                {/* Center Icon */}
                                <div className="relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center shrink-0">
                                    <div className={`w-full h-full rounded-full flex items-center justify-center ${item.status === 'completed' ? 'bg-secondary text-white' : item.status === 'current' ? 'bg-accent text-white animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                                        <FontAwesomeIcon icon={item.icon} className="text-sm" />
                                    </div>
                                </div>

                                {/* Empty Spacer Side */}
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
