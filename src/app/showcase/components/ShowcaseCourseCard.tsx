import Link from "next/link";
import Image from "next/image";
import { ShowcaseCourse } from "../mock-data";

type Props = {
    course: ShowcaseCourse;
};

export default function ShowcaseCourseCard({ course }: Props) {
    return (
        <Link
            href={`/showcase/student/course/${course.id}/content`}
            className="group h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(19,99,223,0.08)] hover:border-[#9dcbff] hover:shadow-[0_18px_36px_rgba(19,99,223,0.16)] hover:-translate-y-1 transition-all duration-300 block"
        >
            <div className="w-full h-36 rounded-xl bg-[linear-gradient(135deg,#e9f5ff_0%,#f7fbff_100%)] border border-[#d8eaff] flex items-center justify-center mb-4 overflow-hidden">
                <Image
                    src="/guest/workflowPic.svg"
                    alt={course.courseName}
                    width={220}
                    height={140}
                    className="w-auto h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center rounded-full bg-[var(--color-neutral)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]">
                    Showcase
                </span>
                <span className="text-xs text-gray-500">Mã: {course.code}</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 line-clamp-2">
                {course.courseName}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.shortDescription || "Khóa học showcase dành cho Job Fair 2026."}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{course.duration}</span>
                <span>{course.teacherName}</span>
            </div>
        </Link>
    );
}
