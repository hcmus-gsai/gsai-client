import { Metadata } from 'next';
import { DynamicNavbar } from '@/components/shared/PublicNavbar';
import { FooterSection } from '@/components/guest/ui/guest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGlobeAsia, faLightbulb, faRocket, faUsers, 
    faArrowRight, faMicrochip, faEarthAmericas
} from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
    title: 'Tầm Nhìn & Sứ Mệnh - EPIS',
    description: 'Tầm nhìn phát triển và mục tiêu tương lai của nền tảng giáo dục EPIS.',
};

const visionPoints = [
    {
        icon: faGlobeAsia,
        title: 'Mục Tiêu Lớn Trong Tương Lai',
        description: 'EPIS định hướng trở thành hệ sinh thái giáo dục số hàng đầu, không chỉ là một nền tảng học tập mà còn là một trung tâm tri thức kết nối hàng triệu người học và chuyên gia trên toàn cầu.',
        tag: 'Quy mô & Ảnh hưởng',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
    {
        icon: faLightbulb,
        title: 'Giá Trị Mang Lại',
        description: 'Chúng tôi xóa bỏ rào cản trong việc tiếp cận kiến thức chuyên sâu. EPIS giúp cá nhân hóa lộ trình phát triển, giúp người dùng giải quyết các vấn đề thực tế thông qua những khóa học chất lượng từ GSAI.',
        tag: 'Lợi ích bền vững',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
    {
        icon: faRocket,
        title: 'Định Hướng Phát Triển',
        description: 'Tiên phong ứng dụng AI và Machine Learning để tối ưu hóa trải nghiệm học tập theo nhu cầu từng cá nhân. Chúng tôi không ngừng mở rộng quy mô công nghệ và sẵn sàng vươn ra thị trường quốc tế.',
        tag: 'Công nghệ & Đổi mới',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
    {
        icon: faUsers,
        title: 'Tác Động Đến Cộng Đồng',
        description: 'Kiến tạo một môi trường giáo dục công bằng, minh bạch. EPIS cam kết nâng cao chất lượng nguồn nhân lực xã hội và đóng góp vào sự phát triển bền vững của nền giáo dục nước nhà.',
        tag: 'Xã hội & Con người',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
];

export default function VisionPage() {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white">
            <DynamicNavbar />
            <main>
                {/* Hero Section */}
                <section className="relative w-full py-28 flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="container relative z-10 flex flex-col items-center text-center px-6">
                        <span className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-500 text-xs font-medium tracking-widest uppercase shadow-sm mb-6">
                            Vision
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
                            Định hướng{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Tầm nhìn
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            Tại EPIS, chúng tôi không chỉ xây dựng một website, chúng tôi kiến tạo tương lai của giáo dục số dựa trên sức mạnh của trí tuệ nhân tạo.
                        </p>
                    </div>
                </section>

                <section className="py-24 relative">
                    {/* Đường line mờ nhạt chạy dọc ở giữa (chỉ hiện trên desktop) để tạo cảm giác "Timeline" */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100 -translate-x-1/2 z-0" />

                    <div className="container mx-auto px-6 max-w-6xl relative z-10">
                        <div className="space-y-24 md:space-y-32">
                            {visionPoints.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex flex-col md:items-center gap-10 md:gap-20 group ${
                                        idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Cột Icon được thiết kế lại như một Card nổi */}
                                    <div className="hidden md:flex flex-1 flex justify-center w-full">
                                        <div className={`relative w-full max-w-[280px] aspect-square rounded-[3rem] ${item.bgColor} flex items-center justify-center shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl`}>
                                            {/* Lớp phủ trắng mờ tạo hiệu ứng kính (glassmorphism) nhẹ */}
                                            <div className="absolute inset-2 bg-white/60 rounded-[2.5rem] backdrop-blur-sm" />
                                            
                                            <FontAwesomeIcon 
                                                icon={item.icon} 
                                                className={`relative z-10 text-7xl md:text-8xl ${item.textColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`} 
                                            />
                                            
                                            {/* Nút tròn nhỏ trang trí ở góc */}
                                            <div className={`absolute -bottom-4 ${idx % 2 === 0 ? '-right-4' : '-left-4'} w-14 h-14 bg-white rounded-full shadow-xl border border-gray-100 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2`}>
                                                <FontAwesomeIcon icon={faArrowRight} className={`${item.textColor} text-xl ${idx % 2 !== 0 ? 'rotate-180' : '-rotate-45'}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột Nội dung */}
                                    <div className={`flex-1 space-y-6 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12 text-left md:text-right'}`}>
                                        <div className={`inline-flex items-center justify-center ${idx % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase ${item.bgColor} ${item.textColor}`}>
                                                {item.tag}
                                            </span>
                                        </div>
                                        
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                            {item.title}
                                        </h2>
                                        
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                        
                                        {/* Vạch màu gradient trang trí */}
                                        <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${item.gradient} to-transparent opacity-80 ${idx % 2 !== 0 ? 'md:ml-auto bg-gradient-to-l' : ''}`} />
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