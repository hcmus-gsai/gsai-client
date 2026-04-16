'use client';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ShowcaseCourseItem } from "@/store/api/[module]/showcaseApi";

type Props = {
    course: ShowcaseCourseItem;
};

export default function ShowcaseCourseCard({ course }: Props) {
    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const SHOWCASE_GUEST_EMAIL_KEY = 'showcaseGuestEmail';
    const SHOWCASE_GUEST_MANAGED_KEY = 'showcaseGuestManaged';
    const SHOWCASE_MODE_COOKIE = 'showcaseMode';

    const lessonPath = course.first_lesson
        ? `/showcase/student/lesson/${course.first_lesson.id}/${course.first_lesson.type}`
        : '/showcase/student';

    const enableShowcaseMode = () => {
        document.cookie = `${SHOWCASE_MODE_COOKIE}=1; path=/; max-age=86400; samesite=lax`;
    };

    const ensureGuestSession = async () => {
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'GET',
            credentials: 'include',
        });

        if (profileResponse.ok) {
            const managed = sessionStorage.getItem(SHOWCASE_GUEST_MANAGED_KEY);
            if (managed === '1') {
                enableShowcaseMode();
            }
            return;
        }

        const guestEmail = `showcase.guest.${crypto.randomUUID()}@email.com`;
        const guestPassword = 'Password123!';

        const signUpResponse = await fetch(`${API_BASE_URL}/auth/sign-up`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: guestEmail,
                password: guestPassword,
                role: 'student',
            }),
        });

        if (!signUpResponse.ok) {
            throw new Error('Cannot create showcase guest account');
        }

        sessionStorage.setItem(SHOWCASE_GUEST_EMAIL_KEY, guestEmail);
        sessionStorage.setItem(SHOWCASE_GUEST_MANAGED_KEY, '1');
        enableShowcaseMode();
    };

    const ensureEnrollment = async () => {
        const enrollResponse = await fetch(`${API_BASE_URL}/enrollments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                course_id: course.id,
            }),
        });

        if (!enrollResponse.ok) {
            throw new Error('Cannot enroll showcase guest into selected course');
        }
    };

    const handleCourseClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        try {
            await ensureGuestSession();
            await ensureEnrollment();
            router.push(lessonPath);
        } catch {
            router.push('/auth/signin');
        }
    };

    return (
        <a
            href={lessonPath}
            onClick={handleCourseClick}
            className="group h-full rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_24px_rgba(19,99,223,0.08)] hover:border-[#9dcbff] hover:shadow-[0_18px_36px_rgba(19,99,223,0.16)] hover:-translate-y-1 transition-all duration-300 block"
        >
            <div className="w-full h-36 rounded-xl bg-[linear-gradient(135deg,#e9f5ff_0%,#f7fbff_100%)] border border-[#d8eaff] flex items-center justify-center mb-4 overflow-hidden">
                <Image
                    src="/guest/workflowPic.svg"
                    alt={course.course_name}
                    width={220}
                    height={140}
                    className="w-auto h-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center rounded-full bg-[var(--color-neutral)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary)]">
                    Showcase
                </span>
                <span className="text-xs text-gray-500">Mã: {course.course_code}</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2 line-clamp-2">
                {course.course_name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.course_description || "Khóa học showcase dành cho Job Fair 2026."}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{course.duration}</span>
                <span>{course.teacher_name}</span>
            </div>
        </a>
    );
}
