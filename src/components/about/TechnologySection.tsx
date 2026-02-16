import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faComments, faDatabase, faChartLine } from '@fortawesome/free-solid-svg-icons';

const technologies = [
    {
        icon: faBrain,
        title: "Deep Learning",
        description: "Mô hình học sâu phân tích hành vi và cá nhân hóa nội dung."
    },
    {
        icon: faComments,
        title: "NLP & LLMs",
        description: "Xử lý ngôn ngữ tự nhiên giúp AI hiểu và phản hồi như người thật."
    },
    {
        icon: faDatabase,
        title: "Knowledge Graph",
        description: "Hệ tri thức kết nối các khái niệm học tập một cách logic."
    },
    {
        icon: faChartLine,
        title: "Predictive Analytics",
        description: "Dự đoán kết quả học tập để đưa ra gợi ý cải thiện kịp thời."
    }
];

export const TechnologySection = () => {
    return (
        <section className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Glow effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <span className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                            Core Technology
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Sức Mạnh Của <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                Trí Tuệ Nhân Tạo
                            </span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-sm leading-relaxed text-sm md:text-base">
                        Chúng tôi sử dụng những công nghệ tiên tiến nhất để biến việc học trở nên thông minh và hiệu quả hơn bao giờ hết.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {technologies.map((tech, index) => (
                        <div
                            key={index}
                            className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-secondary/50 transition-all duration-300 hover:bg-white/10"
                        >
                            <div className="mb-6 inline-flex p-3 rounded-lg bg-gradient-to-br from-secondary/20 to-transparent border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                <FontAwesomeIcon icon={tech.icon} className="text-2xl text-blue-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-white">
                                {tech.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                                {tech.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
