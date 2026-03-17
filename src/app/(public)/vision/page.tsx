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
        description: 'EPIS hướng tới trở thành một nền tảng học ngôn ngữ dành cho sinh viên Việt Nam, giúp việc tiếp cận kiến thức trở nên linh hoạt và hiệu quả hơn. Thông qua việc ứng dụng AI và kết hợp nhiều phương thức học khác nhau, EPIS hỗ trợ người học tiếp cận nội dung theo cách phù hợp với nhu cầu và tốc độ của riêng mình. Nền tảng được xây dựng với mục tiêu đơn giản hóa quá trình học tập, đồng thời tạo ra một môi trường học tập hiện đại, dễ sử dụng và có tính ứng dụng cao.',
        tag: 'Quy mô & Ảnh hưởng',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
    {
        icon: faLightbulb,
        title: 'Giá Trị Mang Lại',
        description: 'EPIS giúp việc tiếp cận kiến thức chuyên sâu trở nên dễ dàng và rõ ràng hơn đối với sinh viên. Nền tảng hỗ trợ cá nhân hóa lộ trình học tập dựa trên nhu cầu và khả năng của từng người, đồng thời tập trung vào tính ứng dụng trong thực tế. Thông qua các tác nhân thông minh được phát triển từ GSAI, người học có thể từng bước cải thiện kỹ năng và giải quyết các vấn đề cụ thể trong quá trình học tập.',
        tag: 'Lợi ích bền vững',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        gradient: 'from-blue-500',
    },
    {
        icon: faRocket,
        title: 'Định Hướng Phát Triển',
        description: 'EPIS tập trung ứng dụng AI và Học máy để cải thiện trải nghiệm học tập và cá nhân hóa nội dung cho từng người dùng. Đồng thời, nền tảng hướng tới việc mở rộng khả năng tiếp cận các công cụ AI đến với nhiều sinh viên hơn, giúp việc học trở nên dễ tiếp cận và hiệu quả hơn. Trong thời gian tới, EPIS sẽ tiếp tục hoàn thiện công nghệ và mở rộng phạm vi phục vụ.',
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
                <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
                    </div>

                    <div className="container relative z-10 flex flex-col items-center text-center z-1">
                       
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary mb-8 leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                            Định hướng 
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent ml-3">
                                Tầm nhìn 
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                            EPIS hướng tới mở rộng khả năng tiếp cận tri thức ở mọi nơi.
                        </p>
                        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">

                        EPIS xây dựng nền tảng học tập có thể thích nghi và phục vụ người dùng ở nhiều bối cảnh khác nhau.
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
                                    <div className="hidden md:flex flex-1 flex justify-center w-full">
                                        <div className={`relative w-full max-w-[280px] aspect-square rounded-[3rem] ${item.bgColor} flex items-center justify-center shadow-lg transition-all duration-500`}>
                                            <div className="absolute inset-2 bg-white/60 rounded-[2.5rem] backdrop-blur-sm" />
                                            
                                            <FontAwesomeIcon 
                                                icon={item.icon} 
                                                className={`w-40 h-40 relative z-10 text-7xl md:text-8xl ${item.textColor} transition duration-500`} 
                                            />
                                            
                                        </div>
                                    </div>

                                    {/* Cột Nội dung */}
                                    <div className={`flex-1 space-y-6 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12 text-left md:text-right'}`}>
                                        
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-primary leading-tight">
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