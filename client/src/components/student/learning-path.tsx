'use client';
import { RedirectButton } from "@/components/shared/redirect-button";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";


const LearningPathSection = () => {

    return (
        <section className = "w-full h-[100vh] flex flex-col items-center justify-center">
            <div className = "flex items-center justify-between w-[calc(100%-24rem)] gap-[1.25rem]">
                <div
                    className = "w-[34.5625rem] h-[22.875rem] rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem] border border-[var(--color-secondary)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
                >
                    <div className = "flex flex-col items-center justify-start h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full w-full">
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Học cùng với</p>
                            <p className = "text-[1.5rem] font-bold text-[var(--color-secondary)] w-full">CHUYÊN GIA</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <RedirectButton href = "/student/courses" text = "Tìm môn học" buttonBg = "var(--color-bg_white)" buttonText = "var(--color-secondary)" buttonBorder = "var(--color-secondary)" iconBg = "var(--color-secondary)" iconText = "var(--color-bg_white)"/>

                        </div>
                    </div>
                    <div className = "flex flex-col items-center justify-start w-full h-full">
                        <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        />
                    </div>
                </div>

                <div
                    className = "w-[34.5625rem] h-[22.875rem] rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem] border border-[var(--color-secondary)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
                >
                    <div className = "flex flex-col items-center justify-start h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full w-full">
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Khám phá kĩ năng</p>
                            <p className = "text-[1.5rem] font-bold text-[var(--color-secondary)] w-full">DÀNH CHO NHÓM</p>
                            <p className = "text-[1rem] font-bold text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <RedirectButton href = "/student/courses" text = "Tìm môn học" buttonBg = "var(--color-bg_white)" buttonText = "var(--color-secondary)" buttonBorder = "var(--color-secondary)" iconBg = "var(--color-secondary)" iconText = "var(--color-bg_white)"/>
                        </div>
                    </div>
                    <div className = "flex flex-col items-center justify-start w-full h-full">
                        <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export {LearningPathSection};