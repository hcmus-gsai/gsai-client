import ShowcaseGuestLayout from '../ShowcaseGuestLayout';

export default function ShowcaseStudentLayout({ children }: { children: React.ReactNode }) {
    return <ShowcaseGuestLayout role="student">{children}</ShowcaseGuestLayout>;
}
