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
        name: 'Phạm Gia B',
        role: 'AI Engineer / Backend Developer',
        image: 'https://i.pravatar.cc/300?img=1', 
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Nguyễn Văn Đ',
        role: 'AI Engineer / Frontend Developer',
        image: 'https://i.pravatar.cc/300?img=5',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Đinh Vũ Gia H',
        role: 'AI Engineer / Frontend Developer / UI Designer',
        image: '#',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Nguyễn Văn H',
        role: 'AI Engineer / Backend Developer',
        image: 'https://i.pravatar.cc/300?img=4',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Trịnh Quốc H',
        role: 'AI Engineer / Frontend Developer',
        image: 'https://i.pravatar.cc/300?img=10',
        linkedin: '#',
        github: '#',
    },
    {
        name: 'Nguyễn Hoàng Khải M',
        role: 'Project Manager / AI Engineer / Backend Developer',
        image: 'https://i.pravatar.cc/300?img=12',
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
                <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-secondary/5">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
                    </div>

                    <div className="container relative z-10 flex flex-col items-center text-center z-1">
                       
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary mb-8 leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                            Đội ngũ 
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent ml-3">
                                phát triển 
                            </span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
                            Đội ngũ phát triển EPIS là các sinh viên trong nhóm GSAI thuộc trường Đại Học Khoa Học Tự Nhiên, ĐHQG-TPHCM.
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
                                    <div className="h-96 relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2">
                                        
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
                                        </div>

                                        {/* Social Links */}
                                        <div className="mt-8 pt-6 border-t border-gray-200/60 flex justify-center gap-4">
                                            <a href={member.github} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black  transition-all">
                                                <FontAwesomeIcon icon={faGithub} />
                                            </a>
                                            <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-secondary   transition-all">
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