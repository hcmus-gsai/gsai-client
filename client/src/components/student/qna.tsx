'use client';

import {Card} from "antd";
import {useState} from 'react';

const QASection = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setSelectedId(selectedId === id ? null : id);
    }

    return (
        <section
            className="w-full h-[90vh] flex flex-col items-center justify-between bg-white"
        >
            <div className="h-full w-[calc(100%-12rem)] py-19 flex flex-col">
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

export {QASection};