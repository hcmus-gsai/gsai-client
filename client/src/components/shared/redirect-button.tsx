'use client';

import {Button} from "antd";
import {ArrowRightOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";



export const RedirectButton = ({
    onClick,
    text,
    buttonBg,
    buttonText,
    buttonBorder,
    iconBg,
    iconText,
}:{
    onClick?: () => void;
    text: string;
    buttonBg?: string;
    buttonText?: string;
    buttonBorder?: string;
    textColor?: string;
    iconBg?: string;
    iconText?:string;
}) => {

    
    return (
        <Button
            type="primary"
            className = {`!w-[10.5rem] !h-[3rem] !rounded-full !flex !items-center !justify-center !bg-transparent`} 
            style={{ border: `1px solid ${buttonBorder}` }}
            onClick = {onClick}
        >
            <div className = "mr-auto flex items-center justify-center relative w-[calc(100%-3rem)] left-[0.5rem]">
                <span className = {`text-[1rem] !text-[${buttonText}]`}>{text}</span>
            </div>

            <div className = {`ml-auto flex items-center justify-center w-[2.5rem] h-[2.5rem]  rounded-full relative right-[-0.75rem]`} style={{backgroundColor: `${iconBg}`}}>
                <span className="flex items-center justify-center rounded-full p-2 w-full h-full">
                    <ArrowRightOutlined className={`!-rotate-45 !text-[${iconText}]`} />
                </span>
            </div>
        </Button>
    )
}

