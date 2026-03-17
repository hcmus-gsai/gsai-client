import { Metadata } from 'next';
import { DynamicNavbar } from '@/components/shared/PublicNavbar';
import { FooterSection } from '@/components/guest/ui/guest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faScaleBalanced, faUserShield, faBookOpen,
    faTriangleExclamation, faHandshake, faGavel,
    faEnvelope, faCircleDot
} from '@fortawesome/free-solid-svg-icons';
 
export const metadata: Metadata = {
    title: 'Điều Khoản & Điều Lệ - Epis',
    description: 'Điều khoản sử dụng và quy định của nền tảng Epis.',
};
 
const sections = [
    {
        icon: faBookOpen,
        title: '1. Giới Thiệu & Phạm Vi Áp Dụng',
        color: 'text-secondary',
        border: 'border-secondary',
        content: [
            'Bằng cách truy cập và sử dụng nền tảng giáo dục EPIS, bạn đồng ý bị ràng buộc bởi các Điều khoản và Điều lệ. Vui lòng đọc kỹ trước khi sử dụng.',
            'Dịch vụ được cung cấp bởi nhóm nghiên cứu GSAI thuộc Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM. Epis hiện đang trong giai đoạn thử nghiệm học thuật.',
            'Các Điều khoản này áp dụng cho tất cả người dùng bao gồm sinh viên, giảng viên và khách thăm nền tảng. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ.',
        ],
    },
    {
        icon: faHandshake,
        title: '2. Quy Tắc Sử Dụng',
        color: 'text-secondary',
        border: 'border-secondary',
        content: [
            'Nghiêm cấm sử dụng nền tảng cho bất kỳ mục đích bất hợp pháp, gian lận học thuật, hoặc gây hại đến người dùng khác.',
            'Không được đăng tải, chia sẻ hoặc phát tán nội dung vi phạm bản quyền, xúc phạm, khiêu dâm, kỳ thị hoặc bạo lực dưới bất kỳ hình thức nào.',
            'Giảng viên cam kết rằng nội dung khóa học được tải lên là bản quyền của mình hoặc đã được phép sử dụng hợp pháp. Vi phạm bản quyền nội dung sẽ dẫn đến xóa khóa học và khóa tài khoản.',
        ],
    },
    {
        icon: faScaleBalanced,
        title: '3. Sở Hữu Trí Tuệ',
        color: 'text-secondary',
        border: 'border-secondary',
        content: [
            'Toàn bộ giao diện, mã nguồn, thiết kế, logo và thương hiệu Epis thuộc quyền sở hữu của nhóm nghiên cứu GSAI thuộc Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM. Nghiêm cấm sao chép, phân phối hay sử dụng thương mại mà không có sự đồng ý bằng văn bản.',
            'Dữ liệu và phản hồi từ tác nhân AI được tạo ra trong quá trình sử dụng EPIS. Người dùng có thể sử dụng cho mục đích học tập cá nhân nhưng không được tái phân phối thương mại.',
        ],
    },
];
 
export default function TermsPage() {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white">
            <DynamicNavbar />
            <main>
                {/* Hero */}
                <section className="relative w-full py-28 flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="container relative z-10 flex flex-col items-center text-center px-6">
                        <span className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-500 text-xs font-medium tracking-widest uppercase shadow-sm mb-6">
                            Legal
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
                            Điều Khoản &{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Điều Lệ
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            Vui lòng đọc kỹ các điều khoản này trước khi sử dụng nền tảng Epis.
                        </p>
                    </div>
                </section>
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="space-y-16">
                            {sections.map((section, idx) => (
                                <div key={idx} id={`section-${idx}`} className="group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                            <FontAwesomeIcon icon={section.icon} className={`text-xl ${section.color}`} />
                                        </div>
                                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                            {section.title}
                                        </h2>
                                    </div>
                                    
                                    <div className={`p-8 rounded-[2rem] border-l-4 shadow-sm bg-white ${section.border} hover:shadow-md transition-shadow duration-300`}>
                                        <ul className="space-y-5">
                                            {section.content.map((text, i) => (
                                                <li key={i} className="flex gap-4 items-start group/item">
                                                    <div className="mt-1.5">
                                                        <FontAwesomeIcon icon={faCircleDot} className="text-[10px] text-gray-300 group-hover/item:text-secondary transition-colors" />
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed text-base">
                                                        {text}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                
 
               
            </main>
            <FooterSection />
        </div>
    );
}
 