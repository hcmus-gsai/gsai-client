import { Metadata } from 'next';
import { HeroSection } from '@/components/about/HeroSection';
import { InfoSection } from '@/components/about/InfoSection';
import { CoreValues } from '@/components/about/CoreValues';
import { TechnologySection } from '@/components/about/TechnologySection';
import { FeaturesSection } from '@/components/about/FeaturesSection';
import { UsageContext } from '@/components/about/UsageContext';
import { ResponsibilitySection } from '@/components/about/ResponsibilitySection';
import { RoadmapSection } from '@/components/about/RoadmapSection';
import { TeamSection, CTASection } from '@/components/about/TeamSectionCTA';
import { PublicNavbar } from '@/components/shared/PublicNavbar';
import { FooterSection } from '@/components/guest/ui/guest';
import Image from 'next/image';
import GradientBottomLeft from "@/../public/guest/gradient_bottom_left.svg";
import GradientBottomRight from "@/../public/guest/gradient_bottom_right.svg";

export const metadata: Metadata = {
    title: 'Về Epis - Nền Tảng Giáo Dục Trực Tuyến AI',
    description: 'Epis là nền tảng học trực tuyến tích hợp trí tuệ nhân tạo, nâng cao trải nghiệm học tập số thông qua công nghệ AI hiện đại.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white/0">
            <PublicNavbar />
            <main>
                <HeroSection />

                <InfoSection
                    id="intro"
                    title="Epis là gì?"
                    subtitle="Giới Thiệu"
                    align="center"
                    content="
                    Epis là đồ án tốt nghiệp của một nhóm sinh viên tại trường Đại học Khoa học Tự nhiên, Thành phố Hồ Chí Minh. 
                    Với mong muốn mang lại những trải nghiệm học tập trực tuyến mới mẻ cho học sinh và sinh viên, Epis ứng dụng 
                    công nghệ trí tuệ nhân tạo để tái hiện các hình thức tương tác quen thuộc trong môi trường học tập trực tiếp, 
                    như trao đổi hai chiều, luyện tập vấn đáp, và hỗ trợ giải đáp thắc mắc theo ngữ cảnh bài học. Ngoài ra, 
                    dự án cũng nghiên cứu ứng dụng các công nghệ xử lý và tái tạo giọng nói, hướng tới việc hỗ trợ tương tác 
                    học tập thông qua hội thoại bằng lời nói một cách tự nhiên hơn.
                    "
                    className="bg-white"
                />

                <FeaturesSection />

                <UsageContext />

                <ResponsibilitySection />

                <TeamSection />

            </main>

            <FooterSection />

            <div className="relative">
                <div className="absolute bottom-0 left-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomLeft}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>

                <div className="absolute bottom-0 right-0 -z-10 pointer-events-none">
                    <Image
                        src={GradientBottomRight}
                        alt="Decorative gradient"
                        width={800}
                        height={800}
                        className="opacity-100"
                        style={{ width: "auto", height: "auto" }}
                    />
                </div>
            </div>
        </div>
    );
}
