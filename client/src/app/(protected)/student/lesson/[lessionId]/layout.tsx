import ContentSection from "./components/contentSection";
import { FooterSection } from "@/components/guest/ui/guest";

import { useGetCourseModulesQuery, useLazyGetModuleLessonsQuery, useGetCoursesByLessonIdQuery } from "@/store/api/[module]/courseApi";

interface IChapterState {
    id: string;
    isExtended: boolean;
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
})  {
    return (
        <main className="w-full grow flex flex-col items-center justify-center min-h-screen overflow-x-clip">
            <section className="w-[var(--global-width)] flex flex-col items-center justify-center mt-[10rem] mb-[2rem]">
                <div className="w-full flex items-start justify-center gap-[1.5rem]">
                    <ContentSection />
                    {children}
                </div>
            </section>

            <FooterSection hasRegisterBox={false} />
        </main>
    )
};