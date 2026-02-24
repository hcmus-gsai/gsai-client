import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faChalkboardUser, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const StudentFeatures = [
    "Hỏi đáp 24/7 với AI Tutor",
    "Vấn đáp đồ án môn học",
    "Trò chuyện với AI Tutor bằng giọng nói",
];

const TeacherFeatures = [
    "Tạo video bài giảng nhanh chóng bằng AI",
    "Tạo đề thi, bài tập cho môn học",
    "Theo dõi và quản lý lớp học"
];

const FeatureCard = ({ title, items, icon, colorClass, align }: { title: string, items: string[], icon: any, colorClass: string, align: 'left' | 'right' }) => (
    <div className={`
        flex-1 p-8 md:p-10 rounded-3xl border border-gray-100 bg-white shadow-lg relative overflow-hidden
        ${align === 'left' ? 'md:mr-4' : 'md:ml-4'}
    `}>
        <div className={`absolute top-0 w-full h-1.5 ${colorClass} left-0`}></div>

        <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass.replace('bg-', 'bg-opacity-10 text-')}`}>
                <FontAwesomeIcon icon={icon} className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>

        <ul className="space-y-4">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faCheckCircle} className={`mt-1 text-sm ${colorClass.replace('bg-', 'text-')} w-5 h-5`} />
                    <span className="text-gray-600 font-medium">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const FeaturesSection = () => {
    return (
        <section className="py-24 bg-neutral/20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-secondary text-s font-bold tracking-[0.2em] uppercase mb-2 block">
                        TÍNH NĂNG
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        Tính Năng Nổi Bật
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center max-w-5xl mx-auto">
                    <FeatureCard
                        title="Dành Cho Sinh Viên"
                        items={StudentFeatures}
                        icon={faUserGraduate}
                        colorClass="bg-secondary"
                        align="left"
                    />
                    <FeatureCard
                        title="Dành Cho Giảng Viên"
                        items={TeacherFeatures}
                        icon={faChalkboardUser}
                        colorClass="bg-accent"
                        align="right"
                    />
                </div>
            </div>
        </section>
    );
};
