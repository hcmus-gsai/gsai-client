import Link from "next/link";
import { notFound } from "next/navigation";
import { findShowcaseCourseById } from "@/app/showcase/mock-data";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ShowcaseStudentCourseDetailPage({ params }: Props) {
    const { id } = await params;
    const course = findShowcaseCourseById(id);

    if (!course) {
        notFound();
    }

    const firstModule = course.modules[0];
    const firstLesson = firstModule?.lessons[0];

    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(900px_380px_at_10%_-10%,rgba(71,181,255,0.22),transparent),linear-gradient(180deg,#f8fcff_0%,#ffffff_100%)]">
            <section className="w-full flex items-center justify-center py-8 sm:py-10 border-b border-gray-100 bg-[var(--color-bg-white-soft)]">
                <div className="w-[var(--global-width)] px-4 sm:px-0">
                    <p className="text-sm text-gray-600 mb-2">Showcase / Học sinh / Chi tiết khóa học</p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
                        {course.courseName}
                    </h1>
                    <p className="text-gray-600 mb-3">{course.shortDescription}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center rounded-full bg-[var(--color-neutral)] px-3 py-1 font-semibold text-[var(--color-secondary)]">
                            Showcase
                        </span>
                        <span className="text-gray-600">Giảng viên: {course.teacherName}</span>
                        <span className="text-gray-600">Thời lượng: {course.duration}</span>
                        <span className="text-green-700 font-medium">Không cần đăng nhập • Không cần đăng ký</span>
                    </div>
                </div>
            </section>

            <section className="w-full flex items-center justify-center py-8 sm:py-10">
                <div className="w-[var(--global-width)] px-4 sm:px-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-[0_8px_20px_rgba(19,99,223,0.08)]">
                        <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Danh sách bài học</h2>
                        <div className="space-y-5">
                            {course.modules.map((module) => (
                                <div key={module.id}>
                                    <p className="text-sm font-semibold text-[var(--color-secondary)] mb-2">{module.title}</p>
                                    <div className="space-y-2">
                                        {module.lessons.map((lesson, idx) => (
                                            <div key={lesson.id} className="rounded-xl border border-gray-100 bg-[var(--color-bg-white-soft)] px-3 py-2">
                                                <p className="text-sm font-medium text-[var(--color-primary)]">
                                                    {idx + 1}. {lesson.title}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-0.5">{lesson.type.toUpperCase()} • {lesson.duration}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <article className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_8px_20px_rgba(19,99,223,0.08)]">
                        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-3">Nội dung khóa học</h2>
                        {firstLesson ? (
                            <>
                                <p className="text-gray-600 mb-4">
                                    Bạn có thể xem ngay nội dung học mà không cần bước đăng ký. Bên dưới là bài học đầu tiên trong lộ trình.
                                </p>
                                <div className="rounded-2xl border border-[var(--color-neutral)] bg-[var(--color-bg-white-soft)] p-5">
                                    <p className="text-sm font-semibold text-[var(--color-secondary)] mb-2">{firstModule?.title}</p>
                                    <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{firstLesson.title}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{firstLesson.type.toUpperCase()} • {firstLesson.duration}</p>
                                    <p className="text-gray-700 leading-relaxed">{firstLesson.summary}</p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600">Khóa học chưa có nội dung hiển thị.</p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/showcase/student"
                                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] transition-colors"
                            >
                                Quay lại danh sách môn học
                            </Link>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}
