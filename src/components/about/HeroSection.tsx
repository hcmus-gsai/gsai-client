import Image from 'next/image';
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";

export const HeroSection = () => {
    return (

        <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-secondary/5">
            {/* Background Gradient Mesh - Subtle & Modern */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[15px] animate-pulse"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[15px] animate-pulse"></div>
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center z-1">
                {/* Modern subtle tag */}
                <div className="mb-8 opacity-0 animate-[fadeSlideIn_0.8s_ease-out_forwards]">
                    <span className="px-4 py-1.5 rounded-full border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-500 text-xs font-medium tracking-widest uppercase shadow-sm">
                        AI-Powered Education
                    </span>
                </div>

                {/* Massive Hero Typography */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-bold text-primary mb-8 leading-[1.1] tracking-tight opacity-0 animate-[fadeSlideIn_0.8s_ease-out_0.2s_forwards]">
                    Trí Tuệ Nhân Tạo Trong <br className="hidden md:block" />
                    <span className="relative inline-block">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                            Giáo Dục Số
                        </span>
                    </span>
                </h1>
            </div>
        </section>
    );
};
