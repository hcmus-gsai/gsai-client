import Link from "next/link";

export default function ShowcaseTeacherPage() {
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(900px_380px_at_85%_-10%,rgba(19,99,223,0.22),transparent),linear-gradient(180deg,#f8fcff_0%,#ffffff_100%)]">
            <section className="w-full flex items-center justify-center py-14 sm:py-20">
                <div className="w-[var(--global-width)] px-4 sm:px-0">
                    <div className="rounded-3xl border border-[#d9ebff] bg-white p-8 sm:p-10 shadow-[0_14px_38px_rgba(19,99,223,0.1)]">
                        <p className="text-sm font-semibold text-[var(--color-secondary)] mb-2">Showcase</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-3">
                            Demo AI Studio cho giáo viên
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Trải nghiệm nhanh luồng generate video bài giảng bằng AI và quản lý video ngay trong showcase.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/showcase/teacher/ai-studio"
                                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] transition-colors"
                            >
                                Mở AI Studio
                            </Link>
                            <Link
                                href="/showcase"
                                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-[var(--color-secondary)] border border-[var(--color-secondary)] hover:bg-[var(--color-neutral)] transition-colors"
                            >
                                Quay lại chọn vai trò
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
