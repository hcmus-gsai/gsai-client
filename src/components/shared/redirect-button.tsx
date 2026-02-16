'use client';

import {Button} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { setTitle } from "@/store/slice/courseDisplaySlice";


export const RedirectButton = ({
    title,
    text,
    buttonBg,
    buttonText,
    buttonBorder,
    iconBg,
    iconText,
}:{
    title?: string;
    text?: string;
    buttonBg?: string;
    buttonText?: string;
    buttonBorder?: string;
    textColor?: string;
    iconBg?: string;
    iconText?:string;
}) => {

    //When the button is click, the page will be redirected to the specified category
    const dispatch = useAppDispatch();
    const router = useRouter();
    const handleRedirect = () => {
        dispatch(setTitle(title || ''));
        router.push(`/student/category/${title?.toLowerCase().replace(/ /g, '-')}`);
    }

    
    return (
        <Button
            type="primary"
            className = {`group !w-[10.5rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-transparent hover:!bg-[var(--color-secondary)] hover:!border-white `} 
            style={{ border: `1px solid ${buttonBorder}` }}
            onClick = {handleRedirect}
        >
            <div className = "mr-auto flex items-center justify-center relative w-[calc(100%-3rem)] left-[0.5rem]">
                <span className = {`font-bold text-[1rem] !text-[${buttonText}] group-hover:!text-white`}>{text}</span>
            </div>

            <div className = {`ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem]  rounded-full relative right-[-0.75rem]  group-hover:bg-[var(--color-white)] bg-[${iconBg}]`} >
                <span className="flex items-center justify-center rounded-full p-2 w-full h-full">
                    <ArrowRightOutlined className={`!-rotate-45 !text-[${iconText}] group-hover:!text-[var(--color-secondary)]`} />
                </span>
            </div>
        </Button>
        /**
        
        <Button
                type="primary"
                className = {`
                    group !w-[10.5rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-white !border
                    hover:!bg-[var(--color-secondary)]
                    hover:!border-white
                    `} 
                style={{ border: `1px solid var(--color-secondary)` }}
                onClick = {() => setShowAll(!showAll)}
            >
                <div className = "mr-auto flex items-center justify-center relative w-[calc(100%-3rem)] left-[0.5rem]">
                    <span className = {`text-[1rem] text-[var(--color-secondary)] group-hover:text-white font-bold`}>{showAll ? "Thu gọn": "Xem tất cả"}</span>
                </div>

                <div className = {`ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem]  rounded-full relative right-[-0.75rem] bg-[var(--color-secondary)] group-hover:bg-[var(--color-white)]`}>
                    <span 
                    className="flex items-center justify-center rounded-full p-2 w-full h-full">
                        <ArrowRightOutlined className={`
                            !-rotate-45 
                            !text-[var(--color-bg-white)]
                            group-hover:!text-[var(--color-secondary)]
                        `} />
                    </span>
                </div>
            </Button>
        */
    )
}

