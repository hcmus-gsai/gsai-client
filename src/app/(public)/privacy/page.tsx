import { Metadata } from 'next';
import { DynamicNavbar } from '@/components/shared/PublicNavbar';
import { FooterSection } from '@/components/guest/ui/guest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldHalved, faDatabase, faCookieBite,
    faUserLock, faEye, faPenToSquare,
    faLock, faCircleInfo, faEnvelope, faCircleDot,
    faServer, faShareNodes
} from '@fortawesome/free-solid-svg-icons';
 
export const metadata: Metadata = {
    title: 'Chính Sách Bảo Mật - Epis',
    description: 'Chính sách bảo mật và quyền riêng tư của nền tảng Epis.',
};
 
const principles = [
    { icon: faLock, title: 'Mã hóa đầu cuối', desc: 'Dữ liệu được mã hóa trong quá trình truyền và lưu trữ.' },
    { icon: faEye, title: 'Minh bạch tối đa', desc: 'Bạn luôn biết chúng tôi thu thập và dùng gì.' },
    { icon: faUserLock, title: 'Kiểm soát bởi bạn', desc: 'Bạn có quyền xem, sửa và xóa dữ liệu bất kỳ lúc nào.' },
];
 
const sections = [
    {
        icon: faDatabase,
        title: '1. Dữ Liệu Chúng Tôi Thu Thập',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        items: [
            {
                label: 'Thông tin tài khoản',
                desc: 'Họ tên, địa chỉ email, mật khẩu, ảnh đại diện và vai trò (sinh viên / giảng viên) khi bạn đăng ký.',
            },
            {
                label: 'Dữ liệu học tập',
                desc: 'Tiến độ hoàn thành khóa học, kết quả bài kiểm tra, lịch sử xem bài giảng và tương tác với AI Tutor.',
            },
            {
                label: 'Nội dung người dùng tạo',
                desc: 'Câu hỏi gửi cho AI Tutor, bài tập nộp lên, bình luận trong khóa học và tài liệu giảng viên tải lên.',
            },
            {
                label: 'Dữ liệu kỹ thuật',
                desc: 'Địa chỉ IP, loại trình duyệt, hệ điều hành và thời gian truy cập để đảm bảo an toàn và tối ưu hóa hiệu năng.',
            },
        ],
    },
    {
        icon: faServer,
        title: '2. Mục Đích Sử Dụng Dữ Liệu',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        items: [
            {
                label: 'Vận hành dịch vụ',
                desc: 'Cung cấp và duy trì nền tảng học tập, xác thực danh tính và quản lý tài khoản.',
            },
            {
                label: 'Cá nhân hóa trải nghiệm',
                desc: 'Phân tích hành vi học tập để AI Tutor đưa ra gợi ý phù hợp với trình độ và nhu cầu của bạn.',
            },
            {
                label: 'Nghiên cứu học thuật',
                desc: 'Dữ liệu ẩn danh được sử dụng cho mục đích nghiên cứu cải thiện chất lượng AI giáo dục. Không có thông tin định danh cá nhân nào được sử dụng.',
            },
            {
                label: 'Bảo mật hệ thống',
                desc: 'Phát hiện và ngăn chặn truy cập trái phép, gian lận và các hành vi vi phạm điều khoản.',
            },
        ],
    },
    // {
    //     icon: faShareNodes,
    //     title: '3. Chia Sẻ Dữ Liệu Với Bên Thứ Ba',
    //     color: 'text-green-500',
    //     bg: 'bg-green-50',
    //     border: 'border-green-100',
    //     items: [
    //         {
    //             label: 'Không bán dữ liệu',
    //             desc: 'Chúng tôi cam kết tuyệt đối không bán, cho thuê hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại.',
    //         },
    //         {
    //             label: 'Nhà cung cấp dịch vụ',
    //             desc: 'Chúng tôi sử dụng các dịch vụ hạ tầng đám mây uy tín. Các đối tác này chỉ được phép xử lý dữ liệu theo chỉ định của chúng tôi.',
    //         },
    //         {
    //             label: 'Yêu cầu pháp lý',
    //             desc: 'Chúng tôi chỉ cung cấp dữ liệu cho cơ quan nhà nước khi có yêu cầu hợp pháp theo quy định pháp luật Việt Nam.',
    //         },
    //     ],
    // },
    // {
    //     icon: faCookieBite,
    //     title: '4. Cookie & Công Nghệ Theo Dõi',
    //     color: 'text-orange-500',
    //     bg: 'bg-orange-50',
    //     border: 'border-orange-100',
    //     items: [
    //         {
    //             label: 'Cookie thiết yếu',
    //             desc: 'Duy trì phiên đăng nhập và các tùy chọn cơ bản của bạn. Không thể tắt vì ảnh hưởng đến hoạt động của nền tảng.',
    //         },
    //         {
    //             label: 'Cookie phân tích',
    //             desc: 'Thu thập thông tin ẩn danh về cách người dùng tương tác với nền tảng để cải thiện trải nghiệm. Bạn có thể từ chối trong phần cài đặt.',
    //         },
    //         {
    //             label: 'Lưu trữ cục bộ',
    //             desc: 'Một số dữ liệu được lưu trên thiết bị của bạn (localStorage) để cải thiện tốc độ và trải nghiệm offline.',
    //         },
    //     ],
    // },
    {
        icon: faPenToSquare,
        title: '5. Quyền Truy Cập',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        items: [
            {
                label: 'Quyền truy cập',
                desc: 'Bạn có quyền yêu cầu xem toàn bộ dữ liệu cá nhân chúng tôi đang lưu trữ về bạn.',
            },
            {
                label: 'Quyền chỉnh sửa',
                desc: 'Bạn có thể cập nhật thông tin cá nhân bất kỳ lúc nào trong phần Cài đặt tài khoản.',
            },
            {
                label: 'Quyền xóa',
                desc: 'Bạn có thể yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan. Dữ liệu sẽ được xóa trong vòng 30 ngày.',
            },
            {
                label: 'Quyền phản đối',
                desc: 'Bạn có quyền từ chối việc xử lý dữ liệu cho mục đích nghiên cứu hoặc phân tích không cần thiết cho dịch vụ cốt lõi.',
            },
        ],
    },
    {
        icon: faCircleInfo,
        title: '6. Bảo Mật & Lưu Trữ',
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        items: [
            {
                label: 'Thời gian lưu trữ',
                desc: 'Dữ liệu tài khoản được lưu trong suốt thời gian bạn sử dụng dịch vụ. Sau khi xóa tài khoản, dữ liệu được xóa hoàn toàn trong vòng 30 ngày.',
            },
            {
                label: 'Biện pháp bảo mật',
                desc: 'Chúng tôi áp dụng mã hóa TLS cho truyền dẫn dữ liệu, mã hóa mật khẩu bằng bcrypt và kiểm tra bảo mật định kỳ.',
            },
            {
                label: 'Thông báo vi phạm',
                desc: 'Trong trường hợp xảy ra sự cố bảo mật ảnh hưởng đến dữ liệu của bạn, chúng tôi sẽ thông báo trong vòng 72 giờ.',
            },
        ],
    },
];
 
export default function PrivacyPage() {
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
                            Privacy
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
                            Chính Sách{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Bảo Mật
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            Quyền riêng tư của bạn là ưu tiên hàng đầu. Chúng tôi minh bạch về mọi dữ liệu được thu thập và sử dụng.
                        </p>
                    </div>
                </section>
 
                {/* 3 Principles */}
                <section className="py-20 bg-gray-50/50">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className={`p-8 rounded-3xl border ${section.border} ${section.bg} transition-all hover:shadow-lg`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white`}>
                                            <FontAwesomeIcon icon={section.icon} className={section.color} />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-4">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                                                <span className="text-gray-600 text-sm leading-relaxed">{item.desc}</span>
                                            </li>
                                        ))}
                                    </ul>
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