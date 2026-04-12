'use client';

import ContentSection from "./components/contentSection";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { setModuleId } from "@/store/slice/lessonSlice";

export default function LessonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const dispatch = useAppDispatch();
    const moduleId = useAppSelector((state) => state.lesson.moduleId);
    const isFullWidthMode = useAppSelector((state) => state.lesson.isFullWidthMode);

    useEffect(() => {
        if (!moduleId) {

            //Check session storage
            const savedModuleId = sessionStorage.getItem('currentModuleId');
            if (savedModuleId) {
                dispatch(setModuleId(savedModuleId));
            }
        }
    }, [moduleId, dispatch]);


    return (
        <main className="w-full grow flex flex-col items-center justify-center min-h-screen overflow-x-clip">
            <section
                className={`flex flex-col items-center justify-center transition-all duration-300 ${isFullWidthMode ? "w-full h-full mt-[2rem] px-4": "w-[var(--global-width)] mt-[2rem] mb-[2rem]"}`}
            >
                {/* 
                  Wrapper div to maintain tree structure. 
                  In normal mode: w-full flex items-start justify-center gap-[1.5rem]
                  In full mode: w-full h-full block (or flex)
                */}
                <div
                    className={`w-full ${isFullWidthMode? "h-full": "flex items-start justify-center gap-[1.5rem]"}`}
                >
                    {!isFullWidthMode && <ContentSection />}

                    {/* Children must remain in the same position in the DOM tree to avoid remounting */}
                    <div key="content-wrapper" className={isFullWidthMode ? "w-full h-full" : "flex-1"}>
                        {children}
                    </div>
                </div>
            </section>
        </main>
    )
};