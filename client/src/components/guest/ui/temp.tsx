'user-client'

import { useState } from "react";

import { Card, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import circleBG from "../../../../public/guest/circle_bg.svg";
import walletIcon from "../../../../public/guest/wallet.svg";
import globalIcon from "../../../../public/guest/global.svg";
import monitorIcon from "../../../../public/guest/monitor.svg";
import userTickIcon from "../../../../public/guest/user_tick.svg";
import arrow1Icon from "../../../../public/guest/Arrow1.svg";
import arrow2Icon from "../../../../public/guest/Arrow2.svg";

import createAccIcon from "../../../../public/guest/createAccIcon.svg";
import pickClassIcon from "../../../../public/guest/pickClassIcon.svg";
import AITutorIcon from "../../../../public/guest/AITutorIcon.svg";

import workFlowPic from "../../../../public/guest/workflowPic.svg";

import testimonialPic from "../../../../public/guest/testimonialPic.svg";

import Image from 'next/image';

type FunctionBlock = {
    title: string;
    subtext: string;
    button: string;
};

type FunctionProps = {
    title: string;
    subtext?: string;
    firstBlock: FunctionBlock;
    secondBlock: FunctionBlock;
    thirdBlock: FunctionBlock;
    fourthBlock: FunctionBlock;
};

const FunctionSection = (
    {
        title,
        subtext,
        firstBlock,
        secondBlock,
        thirdBlock, 
        fourthBlock
    } : FunctionProps) => {
    
    return (
        <section
            className="w-full min-h-[120vh]"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="relative w-full h-full flex flex-col justify-center items-center py-19 px-38 gap-4">
                <p className="text-[3.8vw] font-semibold">Vì sao chọn GSAI?</p>
                <p className="text-[1vw]">Bứt phá hiệu suất học tập với gia sư ảo và mở ra nhiều cơ hội mới.</p>
                <br />

                <div className="relative w-full h-[48%] flex flex-col justify-center items-center">
                    <Image
                        src={circleBG}
                        alt="Circle"
                        width={0} height={0}
                        className="w-[48%] h-full z-0"
                    />

                    <div className="absolute z-10 top-[21%] right-[67%]">
                        <Card 
                            style={{ width: "17vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center max-h-[22vh] overflow-auto">
                                <Image
                                    src={walletIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Tiết kiệm chi phí</p>
                                <p className="text-[0.8vw]">Tiết kiệm chi phí hiệu quả như gia sư riêng nhưng giá thấp hơn nhiều.</p> 

                                <Button className="mt-4" type="primary" style={{borderRadius: "20px", fontSize: "0.8vw"}}>Tham gia ngay</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute z-10 top-[60%] right-[67%]">
                        <Card 
                            style={{ width: "23vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex max-h-[10vh] overflow-auto">
                                <span className="w-[18%] justify-center items-center">
                                    <Image
                                        src={globalIcon}
                                        alt="Wallet Icon"
                                        className="w-full h-full"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.2vw] font-semibold">Học mọi lúc, mọi nơi</p>
                                    <p className="text-justify text-[0.8vw]">Không bị giới hạn thời gian hay địa điểm.</p> 
                                </span>
                            </div>
                        </Card>
                    </div>
                    
                    <div className="absolute z-10 top-[11%] left-[67%]">
                        <Card 
                            style={{ width: "25vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex max-h-[10vh] overflow-auto">
                                <span className="w-[15%] justify-center items-center">
                                    <Image
                                        src={monitorIcon}
                                        alt="Wallet Icon"
                                        className="w-full h-full"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.2vw] font-semibold">Không áp lực, không ngại hỏi</p>
                                    <p className="text-justify text-[0.8vw]">Học thoải mái, tự nhiên hơn.</p> 
                                </span>
                            </div>
                        </Card>
                    </div>

                    <div className="absolute z-10 top-[30%] left-[67%]">
                        <Card 
                            style={{ width: "17vw", borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}
                        >
                            <div className="flex flex-col justify-center items-center max-h-[20vh] overflow-auto">
                                <Image
                                    src={userTickIcon}
                                    alt="Wallet Icon"
                                    className="w-[25%] h-[25%]"
                                />

                                <p className="text-[1.2vw] font-semibold">Cá nhân hóa lộ trình</p>
                                <p className="text-center text-[0.8vw]">Ai hiểu trình độ của bạn và điều chỉnh nội dung phù hợp.</p> 

                                <Button className="mt-2" type="primary" style={{borderRadius: "20px", fontSize: "0.8vw"}}>Bắt đầu ngay</Button>
                            </div>
                        </Card>
                    </div>

                    <p className="absolute z-20 top-[91%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[1.5vw] text-white">
                        Video resume
                    </p>

                    <div className="absolute z-10 top-[-3%] left-[67%]">
                        <Image
                            src={arrow1Icon}
                            alt="Wallet Icon"
                            className=" w-[5.7vw] h-[5.7vw]"
                        />
                    </div>
                    
                    <div className="absolute z-10 top-[89%] right-[66%]">
                        <Image
                            src={arrow2Icon}
                            alt="Wallet Icon"
                            className=" w-[5vw] h-[5vw]"
                        />
                    </div>
                    
                    <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[94%]">
                        <video
                            src="/guest/expVid.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const WorkFlowSection = () => {
    
    return (
        <section
            className="w-full min-h-[50vh] bg-white"
        >
            <div className="w-full h-full py-19 px-38 grid grid-cols-12">
                <div className="col-span-7 flex flex-col">
                    <p className="text-[3.8vw] font-semibold mb-7">Cách hoạt động</p>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <div className="flex items-center justify-center mr-6">
                            <p className="text-[4.7vw] leading-none py-0">01</p>
                        </div>

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={createAccIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Tạo tài khoản</p>
                                    <p className="text-[0.9vw]">Hoàn thiện thông tin và khẳng định kỹ năng của bạn.</p>
                                </span>
                            </div>
                        </Card>
                    </div>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={pickClassIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Đăng tải môn học</p>
                                    <p className="text-[0.9vw]">Xây dựng môn học dẫn đầu xu thế.</p>
                                </span>
                            </div>
                        </Card>

                        <div className="flex items-center justify-center ml-6">
                            <p className="text-[5vw]">02</p>
                        </div>
                    </div>

                    <div className="w-full h-full flex items-stretch mb-5">
                        <div className="flex items-center justify-center mr-6">
                            <p className="text-[4.7vw] leading-none py-0">03</p>
                        </div>

                        <Card className="w-full justify-center items-center" style={{ borderRadius: "20px", boxShadow:" 5px 10px 25px rgba(19, 99, 223, 0.25)" }}>
                            <div className="flex">
                                <span>
                                    <Image
                                        src={AITutorIcon}
                                        alt="create account icon"
                                        width={0} height={0}
                                        className="w-[4vw] h-[4vw]"
                                    />
                                </span>
                                
                                <span className="flex flex-col ml-3">
                                    <p className="text-[1.3vw] font-semibold">Phân tích thông tin môn học</p>
                                    <p className="text-[0.9vw]">Nắm bắt thông tin môn học qua bảng điều khiển trực quan.</p>
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="col-span-4 col-start-9">
                    <Image
                        src={workFlowPic}
                        alt="workflow pic"
                        width={0} height={0}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
            
        </section>
    );
};

const TestimonialSection = () => {
    
    return (
        <section
            className="w-full h-[90vh]"
            style={{ backgroundColor: "#FAFAFA" }}
        >
            <div className="w-full h-full py-19 px-38 flex flex-col">
                <p className="text-[3.8vw] font-semibold mb-8">Giáo viên nói gì về GSAI</p>

                <div className="flex h-full">
                    <div className="grow">
                        <Card 
                            className="w-full h-full" 
                            style={{ borderRadius: "20px", backgroundColor: "#06283D", color:"white", padding: "2vw" }}
                            bodyStyle={{ height: "100%"}}>
                            <div className="h-full flex flex-col justify-between items-center">
                                <div className="flex text-[2vw] orde-first">
                                    <p>Tên giáo viên</p>
                                    <p>.</p>
                                    <p>Môn học</p>
                                </div>

                                <p className="text-center text-[2vw]">“Epis giúp việc học của tôi tiện lợi hơn nhờ khả năng hỏi và trò chuyện trực tiếp với AI.”</p>

                                <div className="flex order-last">
                                    <Button 
                                        className="mr-3" 
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "calc(infinity * 1px)" }} type="primary">
                                        <ArrowLeftOutlined />
                                    </Button>

                                    <Button 
                                        className="mr-3" 
                                        style={{ width: "3.5vw", height: "3.5vw", borderRadius: "calc(infinity * 1px)" }} type="primary">
                                        <ArrowRightOutlined />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="ml-5 w-[70%] h-full">
                        <Image
                            src={testimonialPic}
                            alt="workflow pic"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const QASection = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setSelectedId(selectedId === id ? null : id);
    }

    return (
        <section
            className="w-full h-[90vh] bg-white"
        >
            <div className="w-full h-full py-19 px-38 flex flex-col">
                <p className="text-[3.8vw] font-semibold mb-8">Câu hỏi thường gặp</p>

                <div className="grid grid-cols-2 gap-4">
                    <Card
                        onClick={() => handleCardClick(1) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 1 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 1 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 1 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">01</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Cách để đăng ký tài khoản giáo viên</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(4) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 4 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 4 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 4 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">04</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Có xóa môn học đã tạo được không?</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Môn học đã tạo không thể xóa được mà chỉ có thể chuyển sang tình trạng không thể đăng kí học nữa.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(2) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 2 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 2 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 2 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">02</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Giấy tờ nào được chấp nhận để chứng minh danh tính</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(5) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 5 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 5 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 5 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">05</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Đăng tải môn học có tốn phí hay không?</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card
                        onClick={() => handleCardClick(3) }
                        className={"flex items-center cursor-pointer border rounded-2xl transition-all duration-300"}
                        style={{ backgroundColor: selectedId === 3 ? "#E0F2FF" : "#FFFFFF", borderColor: selectedId === 3 ? "#3B82F6" : "#E5E7EB", borderWidth: "2px" }}
                    >
                        <div className="w-full h-full flex">
                            <div className="w-[3.5vw] h-[3.5vw] min-w-[3.5vw] flex justify-center items-center rounded-full"
                                 style={{ backgroundColor: selectedId === 3 ? "white" : "#E0E0E0" }}>
                                <p className="font-bold">03</p>
                            </div>

                            <div className="flex flex-col ml-4">
                                <h3 className="text-lg font-semibold">Bao lâu thì danh tính được xác nhận</h3>
                                <br />
                                <p className="text-gray-500 text-sm">
                                Hoàn thiện thông tin tin và khẳng định kỹ năng của bạn.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export {FunctionSection, WorkFlowSection, TestimonialSection, QASection};