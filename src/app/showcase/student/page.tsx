import Link from "next/link";
import ShowcaseCourseCard from "../components/ShowcaseCourseCard";
import { getShowcaseCourses } from "../mock-data";

export default function ShowcaseStudentPage() {
    const courses = getShowcaseCourses();

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(800px_340px_at_15%_-10%,rgba(71,181,255,0.24),transparent),linear-gradient(180deg,#f8fcff_0%,#ffffff_100%)]">
            <section className="w-full flex items-center justify-center pt-8 sm:pt-10">
                <div className="w-[var(--global-width)] px-4 sm:px-0 flex items-center justify-start">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-black hover:text-[var(--color-secondary)] transition-colors"
                    >
                        <span aria-hidden>←</span>
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </section>

            <section className="w-full flex items-center justify-center py-10 sm:py-14">
                <div className="w-[var(--global-width)] px-4 sm:px-0">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)]">
                            Danh sách môn học (Showcase)
                        </h1>
                        <Link href="/showcase" className="text-[var(--color-secondary)] font-semibold hover:underline">
                            Đổi vai trò
                        </Link>
                    </div>

                    {courses.length === 0 ? (
                        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-[var(--color-bg-white-soft)] py-16 text-center text-gray-600 text-lg">
                            Hiện chưa có môn học showcase
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-[#d9ebff] bg-white/90 p-5 sm:p-6 shadow-[0_14px_38px_rgba(19,99,223,0.1)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                                {courses.map((course) => (
                                    <ShowcaseCourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
