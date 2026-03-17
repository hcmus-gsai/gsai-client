import { Metadata } from 'next';
import { DynamicNavbar } from '@/components/shared/PublicNavbar';
import { FooterSection } from '@/components/guest/ui/guest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faShareNodes ,faUser } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';

export const metadata: Metadata = {
    title: 'Ban Điều Hành - EPIS',
    description: 'Đội ngũ nòng cốt đằng sau sự phát triển của nền tảng EPIS.',
};

const teamMembers = [
    {
        name: 'Nguyễn Văn A',
        role: 'Project Manager / Lead Researcher',
        image: 'https://i.pravatar.cc/300?img=1', 
        bio: 'Chuyên gia về AI trong giáo dục với hơn 5 năm nghiên cứu tại GSAI.',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Trần Thị B',
        role: 'Product Designer',
        image: 'https://i.pravatar.cc/300?img=5',
        bio: 'Người kiến tạo trải nghiệm người dùng và giao diện sáng tạo cho Epis.',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Lê Văn C',
        role: 'Fullstack Developer',
        image: '#',
        bio: 'Chịu trách nhiệm xây dựng hệ thống lõi và kiến trúc microservices.',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Phạm Minh D',
        role: 'AI Engineer',
        image: 'https://i.pravatar.cc/300?img=4',
        bio: 'Phát triển các thuật toán cá nhân hóa lộ trình học tập cho sinh viên.',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Hoàng Anh E',
        role: 'Content Strategy',
        image: 'https://i.pravatar.cc/300?img=10',
        bio: 'Đảm bảo chất lượng học thuật và kết nối các giảng viên chuyên môn.',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Vũ Đức F',
        role: 'DevOps & Security',
        image: 'https://i.pravatar.cc/300?img=12',
        bio: 'Vận hành hệ thống và bảo mật dữ liệu người dùng trên nền tảng.',
        linkedin: '#',
        github: '#',
    },
];

export default function LeadershipPage() {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white">
            <DynamicNavbar />
            <main>
                {/* Hero Section - Giữ nguyên style bạn yêu cầu */}
                <section className="relative w-full py-28 flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="container relative z-10 flex flex-col items-center text-center px-6">
                        <span className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-500 text-xs font-medium tracking-widest uppercase shadow-sm mb-6">
                            Đội Ngũ
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight tracking-tight">
                            Ban Điều{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                                Hành Epis
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            Những con người tâm huyết từ nhóm nghiên cứu GSAI, cùng chung mục tiêu nâng tầm giáo dục số.
                        </p>
                    </div>
                </section>

                {/* Team Grid Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">
                        {/* Gird 6 người: 
                            - Mobile: 1 cột 
                            - Tablet: 2 cột (sm:grid-cols-2)
                            - Desktop: 3 cột (lg:grid-cols-3)
                        */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {teamMembers.map((member, idx) => (
                                <div key={idx} className="group relative">
                                    {/* Card Container */}
                                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2">
                                        
                                        {/* Avatar với vòng trang trí */}
                                        <div className="relative w-32 h-32 mx-auto mb-6">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary to-accent animate-spin-slow opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-100">
                                                <FontAwesomeIcon 
                                                    icon={faUser} 
                                                    className="w-18 h-18 text-4xl text-gray-200 group-hover:text-secondary transition-colors duration-500" 
                                                />
                                            </div>
                                        </div>

                                        {/* Thông tin */}
                                        <div className="text-center space-y-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-secondary transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm font-semibold text-secondary/80 uppercase tracking-wider">
                                                {member.role}
                                            </p>
                                            <p className="text-gray-500 text-sm leading-relaxed px-2">
                                                {member.bio}
                                            </p>
                                        </div>

                                        {/* Social Links */}
                                        <div className="mt-8 pt-6 border-t border-gray-200/60 flex justify-center gap-4">
                                            <a href={member.linkedin} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
                                                <FontAwesomeIcon icon={faLinkedin} />
                                            </a>
                                            <a href={member.github} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-black hover:shadow-md transition-all">
                                                <FontAwesomeIcon icon={faGithub} />
                                            </a>
                                            <a href="#" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-secondary hover:shadow-md transition-all">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </a>
                                        </div>
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