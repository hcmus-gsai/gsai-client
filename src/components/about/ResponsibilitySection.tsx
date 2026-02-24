import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faUserLock, faScaleBalanced, faEye } from '@fortawesome/free-solid-svg-icons';

const principles = [
    { icon: faUserLock, text: "Bảo mật dữ liệu người dùng tuyệt đối" },
    { icon: faScaleBalanced, text: "Công bằng và minh bạch trong thuật toán" },
    { icon: faEye, text: "Quyền kiểm soát thuộc về người học" }
];

export const ResponsibilitySection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Soft Green Tint for Trust/Ethics */}
            <div className="absolute inset-0 bg-neutral/20"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 border border-neutral shadow-[0_10px_40px_-10px_rgba(20,83,45,0.05)] text-center">

                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral text-secondary mb-8 border-4 border-neutral">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-3xl text-secondary" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Trách Nhiệm AI & Đạo Đức
                    </h2>

                    <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
                        Chúng tôi cam kết phát triển AI có trách nhiệm. Công nghệ được sinh ra để phục vụ con người, không phải thay thế con người.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {principles.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-neutral/20 border border-neutral">
                                <FontAwesomeIcon icon={item.icon} className="mt-1 text-secondary" />
                                <span className="text-gray-700 font-medium text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
