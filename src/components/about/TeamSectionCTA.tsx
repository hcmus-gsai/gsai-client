import Link from 'next/link';

export const TeamSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 text-center">
                <span className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                    Nghiên cứu & Phát triển
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
                    Đội Ngũ Nghiên Cứu
                </h2>
                <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Dự án được thực hiện bởi nhóm nghiên cứu GSAI thuộc trường
                        <span className="font-semibold text-primary"> Đại học Khoa học Tự nhiên, ĐHQG-HCM</span>.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Với sự hướng dẫn của giáo viên trường Đại học Khoa học Tự nhiên, ĐHQG-HCM.
                    </p>
                </div>
            </div>
        </section>
    );
};

export const CTASection = () => {
    return (
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-secondary/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-primary mb-8 tracking-tight">
                    Sẵn Sàng Cho <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                        Kỷ Nguyên Mới?
                    </span>
                </h2>
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Tham gia cùng hàng ngàn sinh viên và giảng viên đang thay đổi cách họ dạy và học mỗi ngày.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/auth/register"
                        className="px-10 py-4 bg-primary hover:bg-gray-900 text-white text-lg font-bold rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        Đăng Ký Ngay
                    </Link>
                    <Link
                        href="/contact"
                        className="px-10 py-4 bg-white text-primary border border-gray-200 text-lg font-bold rounded-full hover:bg-gray-50 transition-all duration-300"
                    >
                        Liên Hệ
                    </Link>
                </div>
            </div>
        </section>
    );
};
