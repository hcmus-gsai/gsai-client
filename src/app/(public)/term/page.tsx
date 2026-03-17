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
                <section className="bg-secondary/5 relative w-full flex items-start justify-center overflow-hidden mt-15">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-8 w-full max-w-[var(--global-width)] text-left py-12">

                    {/* <div className="bg-secondary container relative z-10 flex flex-col items-center text-left z-1 py-5"> */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                            Điều khoản và
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent ml-3">
                                Điều lệ
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                            Vui lòng đọc kĩ các điều khoản trước khi sử dụng nền tảng EPIS
                        </p>
                    {/* </div> */}
                    </div>
                </section>

                <section className="relative w-full flex items-start justify-center overflow-hidden">
                    <div className="flex flex-col items-start justify-center gap-8 max-w-[var(--global-width)] text-left py-12 w-full">
                        <p className="text-2xl font-bold text-gray-900">1. Giới Thiệu & Phạm Vi Áp Dụng</p>
                        <p className="text-base text-gray-900">
                        Khi bạn truy cập và sử dụng nền tảng giáo dục EPIS, điều đó đồng nghĩa với việc bạn đã đọc và chấp nhận các Điều khoản sử dụng này. Bạn nên xem qua để hiểu rõ hơn trước khi sử dụng.
                        </p>
                        <p className="text-base text-gray-900">
                        Dịch vụ được phát triển bởi nhóm nghiên cứu GSAI thuộc Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM. EPIS hiện đang trong giai đoạn thử nghiệm phục vụ mục đích học thuật.
                        </p>
                        <p className="text-base text-gray-900">
                        Các Điều khoản này áp dụng cho tất cả người dùng, bao gồm sinh viên, giảng viên và khách truy cập. Nếu có nội dung nào chưa phù hợp, bạn có thể cân nhắc trước khi tiếp tục sử dụng dịch vụ.
                        </p>

                        <p className="text-2xl font-bold text-gray-900">2. Quy Tắc Sử Dụng</p>
                        <p className="text-base text-gray-900">
                        Nền tảng được xây dựng nhằm phục vụ học tập và chia sẻ kiến thức, vì vậy người dùng được khuyến khích sử dụng một cách phù hợp, tôn trọng và không gây ảnh hưởng tiêu cực đến người khác.
                        </p>
                        <p className="text-base text-gray-900">
                        Hạn chế đăng tải hoặc chia sẻ các nội dung vi phạm bản quyền, mang tính xúc phạm, không phù hợp hoặc có thể gây ảnh hưởng tiêu cực đến cộng đồng.
                        </p>
                        <p className="text-base text-gray-900">
                        Đối với giảng viên, nội dung khóa học nên là do bạn sở hữu hoặc đã được cho phép sử dụng hợp lệ. Trong trường hợp có vấn đề liên quan đến bản quyền, nội dung có thể được xem xét gỡ xuống để đảm bảo quyền lợi các bên.
                        </p>

                        <p className="text-2xl font-bold text-gray-900">3. Sở Hữu Trí Tuệ</p>
                        <p className="text-base text-gray-900">
                        Giao diện, mã nguồn, thiết kế, logo và thương hiệu EPIS thuộc quyền quản lý của nhóm nghiên cứu GSAI, Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM. Nếu bạn muốn sử dụng lại cho mục đích khác, vui lòng liên hệ để được hỗ trợ và hướng dẫn thêm.
                        </p>
                        <p className="text-base text-gray-900">
                        Bạn có thể cập nhật thông tin cá nhân bất kỳ lúc nào trong phần Cài đặt tài khoản.
                        </p>
                        <p className="text-base text-gray-900">
                        Dữ liệu và phản hồi từ hệ thống AI trong quá trình sử dụng EPIS có thể được dùng cho mục đích học tập cá nhân. Nếu sử dụng cho các mục đích khác, bạn nên cân nhắc và kiểm tra lại các điều kiện liên quan.
                        </p>
                    </div>
                </section>

            </main>
            <FooterSection />
        </div>
    );
}
 