import Link from "next/link";
import Image from "next/image";

const roleOptions = [
    {
        title: "Học sinh",
        description: "Khám phá danh sách môn học showcase và xem bài học ngay lập tức.",
        href: "/showcase/student",
        image: "/guest/Cate_3.svg",
    },
    {
        title: "Giáo viên",
        description: "Xem bản trình diễn dành cho giáo viên (đang cập nhật).",
        href: "/showcase/teacher",
        image: "/guest/Cate_6.svg",
    },
];

export default function ShowcaseRoleSelection() {
    return (
        <section className="w-full flex items-center justify-center py-10 sm:py-14">
            <div className="w-[var(--global-width)] px-4 sm:px-0">
                <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] drop-shadow-[0_8px_20px_rgba(19,99,223,0.2)] mb-8 sm:mb-10">
                    JOB FAIR SHOWCASE
                </h1>

                <div className="rounded-3xl border border-[#cfe5ff] bg-white/85 backdrop-blur-sm px-6 py-8 sm:px-10 sm:py-10 shadow-[0_16px_44px_rgba(19,99,223,0.12)]">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] text-center mb-8 sm:mb-10">
                        Chọn vai trò để trải nghiệm
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        {roleOptions.map((role) => (
                            <Link
                                key={role.title}
                                href={role.href}
                                className="group rounded-2xl border border-[#d7e8fb] bg-gradient-to-br from-white to-[#f3f9ff] p-5 sm:p-6 shadow-[0_10px_28px_rgba(19,99,223,0.1)] hover:border-[#9dcbff] hover:shadow-[0_18px_40px_rgba(19,99,223,0.18)] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-full h-36 sm:h-40 rounded-xl bg-[linear-gradient(135deg,#e8f5ff_0%,#f7fbff_100%)] border border-[#d7e8fb] flex items-center justify-center mb-4 overflow-hidden">
                                    <Image
                                        src={role.image}
                                        alt={role.title}
                                        width={220}
                                        height={140}
                                        className="w-auto h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-2xl font-bold text-[var(--color-primary)] mb-2">{role.title}</p>
                                <p className="text-gray-600">{role.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
