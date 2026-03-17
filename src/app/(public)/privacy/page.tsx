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
                desc: 'Bạn có thể yêu cầu xóa tài khoản bằng cách gửi yêu cầu qua email của nhóm phát triển.',
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
                label: 'Thông báo vi phạm',
                desc: 'Chúng tôi sẽ thông báo cho bạn trong trường hợp xảy ra sự cố bảo mật ảnh hưởng đến dữ liệu của bạn.',
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
                {/* <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
                    </div>

                    <div className="container relative z-10 flex flex-col items-center text-center z-1">


                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary mb-8 leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                            Chính sách <br className="hidden md:block" />
                            <span className="relative inline-block">
                                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                    Bảo mật
                                </span>
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            Quyền riêng tư của bạn là ưu tiên hàng đầu. Chúng tôi minh bạch về mọi dữ liệu được thu thập và sử dụng.
                        </p>
                    </div>
                </section> */}

                <section className="bg-secondary/5 relative w-full flex items-start justify-center overflow-hidden mt-15">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
                    </div>
                    <div className="flex flex-col items-start justify-center gap-8 w-full max-w-[var(--global-width)] text-left py-12">

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                            Chính sách
                                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent ml-3">
                                    Bảo mật
                                </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                            Quyền riêng tư của bạn là ưu tiên hàng đầu. Chúng tôi minh bạch về mọi dữ liệu được thu thập và sử dụng.
                        </p>
                    </div>
                </section>

                <section className="relative w-full flex items-start justify-center overflow-hidden">
                    <div className="flex flex-col items-start justify-center gap-8 max-w-[var(--global-width)] text-left py-12 w-full">

                        <p className="text-2xl font-bold text-gray-900">1. Dữ Liệu Chúng Tôi Thu Thập</p>
                        <p className="text-base text-gray-900">Thông tin tài khoản :  Họ tên, địa chỉ email, mật khẩu, ảnh đại diện và vai trò (sinh viên / giảng viên) khi bạn đăng ký.</p>
                        <p className="text-base text-gray-900">Dữ Liệu Học Tập: Tiến độ hoàn thành khóa học, kết quả bài kiểm tra, lịch sử xem bài giảng và tương tác với AI Tutor.</p>
                        <p className="text-base text-gray-900">Nội Dung Người Dùng Tạo: Câu hỏi gửi cho AI Tutor, bài tập nộp lên, bình luận trong khóa học và tài liệu giảng viên tải lên.</p>
                        <p className="text-base text-gray-900">Dữ Liệu Kỹ Thuật: Địa chỉ IP, loại trình duyệt, hệ điều hành và thời gian truy cập để đảm bảo an toàn và tối ưu hóa hiệu năng.</p>

                        <p className="text-2xl font-bold text-gray-900">2. Mục Đích Sử Dụng Dữ Liệu</p>
                        <p className="text-base  text-gray-900">Cung cấp và duy trì nền tảng học tập, xác thực danh tính và quản lý tài khoản.</p>
                        <p className="text-base  text-gray-900">Phân tích hành vi học tập để AI Tutor đưa ra gợi ý phù hợp với trình độ và nhu cầu của bạn.</p>
                        <p className="text-base  text-gray-900">Dữ liệu ẩn danh được sử dụng cho mục đích nghiên cứu cải thiện chất lượng AI giáo dục. Không có thông tin định danh cá nhân nào được sử dụng.</p>
                        <p className="text-base  text-gray-900">Phát hiện và ngăn chặn truy cập trái phép, gian lận và các hành vi vi phạm điều khoản.</p>

                    

                        <p className="text-2xl font-bold text-gray-900">3. Quyền Truy Cập</p>
                        <p className="text-gray-500  text-gray-900">Bạn có quyền yêu cầu xem toàn bộ dữ liệu cá nhân chúng tôi đang lưu trữ về bạn.</p>
                        <p className="text-base  text-gray-900">Bạn có thể cập nhật thông tin cá nhân bất kỳ lúc nào trong phần Cài đặt tài khoản.</p>
                        <p className="text-base  text-gray-900">Bạn có thể yêu cầu xóa tài khoản bằng cách gửi yêu cầu qua email của nhóm phát triển.</p>
                        

                        <p className="text-2xl font-bold text-gray-900">4. Bảo Mật & Lưu Trữ</p>
                        <p className="text-base  text-gray-900">Dữ liệu tài khoản được lưu trong suốt thời gian bạn sử dụng dịch vụ</p>
                        <p className="text-base  text-gray-900">Chúng tôi sẽ thông báo cho bạn trong trường hợp xảy ra sự cố bảo mật ảnh hưởng đến dữ liệu của bạn.</p>

                    </div>
                </section>

                
            </main>
            <FooterSection />
        </div>
    );
}