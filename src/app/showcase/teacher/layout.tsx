import ShowcaseGuestLayout from '../ShowcaseGuestLayout';

export default function ShowcaseTeacherLayout({ children }: { children: React.ReactNode }) {
    return <ShowcaseGuestLayout role="teacher">{children}</ShowcaseGuestLayout>;
}
