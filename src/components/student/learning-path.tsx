'use client';
import { RedirectButton } from "@/components/shared/redirect-button";
import Image from "next/image";
import EmptyLayout from "@/../public/EmptyLayout.svg";

import { useRouter } from "next/navigation";
const LearningPathSection = () => {

    const router = useRouter();

    return (
        <section className = "w-full h-[50vh] flex flex-col items-center">
            <div className = "flex h-full w-[var(--global-width)] gap-[1.25rem]">
                <div
                    className = "w-[full] h-[82%] rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem]" style= {{backgroundColor: "rgba(19, 99, 223, 0.14)"}}
                >
                    <div className = "flex flex-col h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full grow">
                            <p className = "text-[1rem] text-[var(--color-primary)] w-full">Học cùng với</p>
                            <p className = "my-4 text-[1.5rem] font-semibold text-[var(--color-secondary)] w-full">CHUYÊN GIA</p>
                            <p className = "text-[1rem] text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <RedirectButton title = "Tìm môn học" text = "Tìm môn học" buttonText = "var(--color-secondary)" buttonBorder = "blue" iconBg = "var(--color-secondary)" iconText = "var(--color-bg_white)"/>
                        </div>
                    </div>
                    <div className = "flex flex-col order-last w-[70%] h-full">
                        {/* <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        /> */}
                        <Image src={EmptyLayout} alt="Empty Layout" width={24} height={24}
                            className="object-cover !w-full !h-full !h-auto rounded-[20px]"
                        />
                    </div>
                </div>

                <div
                    className = "w-[full] h-[82%] rounded-[20px] flex items-center justify-center px-[1.875rem] py-[2.5rem]" style= {{backgroundColor: "rgba(19, 99, 223, 0.14)"}}
                >
                    <div className = "flex flex-col h-full w-full">
                        <div className = "flex flex-col items-center justify-start h-full w-full">
                            <p className = "text-[1rem] text-[var(--color-primary)] w-full">Khám phá kĩ năng</p>
                            <p className = "my-4 text-[1.5rem] font-semibold text-[var(--color-secondary)] w-full">DÀNH CHO NHÓM</p>
                            <p className = "text-[1rem] text-[var(--color-primary)] w-full">Nếu bạn đã xác định rõ môn mình muốn học</p>
                        </div>
                        <div>
                            <RedirectButton title = "Tìm môn học" text = "Tìm môn học" buttonBg = "var(--color-bg_white)" buttonText = "var(--color-secondary)" buttonBorder = "blue" iconBg = "var(--color-secondary)" iconText = "var(--color-bg_white)"/>
                        </div>
                    </div>
                    <div className = "flex flex-col order-last w-[70%] h-full">
                        {/* <Image src = {EmptyLayout} alt = "Empty Layout" width = {0} height = {0}
                            className = "w-full h-full object-cover rounded-[20px]"
                        /> */}
                        <Image src={EmptyLayout} alt="Empty Layout" width={24} height={24}
                            className="object-cover !w-full !h-full !h-auto rounded-[20px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export {LearningPathSection};