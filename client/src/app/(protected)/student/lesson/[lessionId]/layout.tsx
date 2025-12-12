'use client';

import ContentSection from "./components/contentSection";
import { FooterSection } from "@/components/guest/ui/guest";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setModuleId } from "@/store/slice/lessonSlice";

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
})  {
    const [isClient, setIsClient] = useState(false);
    useEffect(()=> {
        setIsClient(true);
    }, []);

    const dispatch = useAppDispatch();
    const moduleId = useAppSelector(
        (state) => state.lesson.moduleId
    )
    useEffect(()=> {
        if (!moduleId) {

            //Check session storage
            const savedModuleId = sessionStorage.getItem('currentModuleId');
            if(savedModuleId) {
                dispatch(setModuleId(savedModuleId));
            }
        }
    }, [moduleId, dispatch]);


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