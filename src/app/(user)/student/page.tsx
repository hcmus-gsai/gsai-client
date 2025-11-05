'use client'
import Link from "next/link";
import Image from "next/image";
import {Flex, Typography, Empty, Row, Col, Button, Menu, Card} from 'antd';
import { StarFilled, FacebookFilled, InstagramFilled } from '@ant-design/icons';
// import Ellipse3 from '@/../public/shared/Ellipse 3.svg';
// import Ellipse4 from '@/../public/shared/Ellipse 4.svg';
// import Ellipse5 from '@/../public/shared/Ellipse 5.svg';
// import Ellipse6 from '@/../public/shared/Ellipse 6.svg';


export default function Home() {
    const FirstSection = () => {

    }
    const SecondSection = () => {

    }
    const ThirdSection = () => {

    }
    const FourthSection = () => {

    }

    const cardContent = [
        {
            title: 'Gia sư AI',
            description: 'Trợ lý học tập thông minh hỗ trợ trả lời câu hỏi và giúp bạn hiểu sâu hơn qua hội thoại tự nhiên.'
        },
        {
            title: 'Bài giảng',
            description : 'Không chỉ xem mà còn tương tác trực tiếp với nội dung và nhận ngay giải thích trong lúc học.'
        }
        ,{
            title: 'Quiz',
            description: 'Củng cố kiến thức với các bài kiểm tra ngắn sau mỗi chương. '
        }
        ,{
            title: 'Lịch học',
            description: 'Tự do lên kế hoạch học theo thời gian biểu của riêng bạn.'
        }
    ]

    const displayCourses = [
        {
            title: 'Phổ biến nhất',
            items : [
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                }
            ]
        },
        {
            title: 'Nổi bật trong tuần',
            items : [
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                }
            ]
        },
        {
            title: 'Mới nhất',
            items : [
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                },
                {
                    teacherName: 'Tên giáo viên',
                    courseName : 'Tên môn học',
                    rate: 0.0
                }
            ]
        }
    ]

    const relatedInfo = [
        {
            title: 'Về GSAI',
            description : 'Chính sách dùng AI <br/> Điều kiện & điều khoản <br/> Chính sách bảo mật <br/> Chính sách thanh toán'
        },
        {
            title: 'Hướng dẫn sử dụng',
            description: 'Cách tương tác với gia sư AI <br/> Cách điều chỉnh lịch học <br/> Hướng dẫn thanh toán'
        },
        {
            title: 'Kết nối với chúng tôi',
            description: 'Facebook <br/> Instagram <br/> Twitter'

        }
    ]
    return (
        <>
        {/* First Section */}
        <div className = "flex flex-col w-full h-[calc(100vh-40px)]">
            {/* Header of First sectiom*/}
            {/* <Image src = {Ellipse3} alt = "Ellipse 3" className = "absolute top-0 left-0 z-50" /> */}
            {/* <Image src = {Ellipse4} alt = "Ellipse 4" className = "absolute top-0 right-0 z-50" /> */}
            {/* <Image src = {Ellipse5} alt = "Ellipse 5" className = "absolute bottom-0 left-0" /> */}
           {/* <Image src = {Ellipse6} alt = "Ellipse 6" className = "absolute bottom-0 right-0 z-50" /> */}
            <div className="flex w-full items-center justify-between h-[40px] px-24">
                <div className = "flex flex-1 items-center justify-start gap-2">
                    <div className = "text-2xl font-bold">
                        <p>GSAI</p>
                    </div>
                    <Menu 
                        mode = "horizontal"
                        defaultSelectedKeys={["home"]}
                        items = {[
                            { key: "home", label: "Trang chủ" },
                            { key: "courses", label: "Môn học" },
                        ]}
                        className = "border-none flex-1 ml-10"
                        style = {{
                            backgroundColor: 'transparent'
                        }}
                    />
                </div>
                <div className = "flex flex-1 items-center justify-end gap-2">
                    <div className = "flex items-center justify-center gap-2">
                        <button>Đăng nhập</button>
                    </div>
                    <div className = "flex items-center justify-center gap-2">
                        <button>Đăng ký</button>
                    </div>
                </div>
            </div>

            <div className = "mx-auto w-full h-full flex flex-col items-center justify-center">
                <div className = "flex items-center justify-center gap-4">
                    <div className = "text-[4rem] font-bold leading-tight">
                        <p className = "text-center">Chào Mừng <br/> Đến Với</p>
                    </div>
                    <div className = "text-[4rem] font-bold text-[#366ED8]">
                        <p>GSAI</p>
                    </div>
                </div>
                <div className = "flex flex-col justify-center items-center">
                    <div className = "text-[1rem] font-light text-gray-600 text-center">
                        <p>Bạn đang gặp khó khăn trong quá trình học tập của mình?</p>
                        <p>Bạn cần một gia sư đồng hành cùng mình?</p>
                        <p>Đừng lo lắng.</p>
                    </div>
                    <div className = "flex items-center justify-center mt-4">
                        <Button 
                            type = "default"
                            className = "!bg-black !text-white hover:!bg-white hover:!text-black !px-8 !py-6 !rounded-[50px] !text-[20px]">
                                Khám phá ngay
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* Second Section */}

        <div className = "flex flex-col w-full h-full">
            <div className = "flex flex-col justify-center items-center gap-16 mt-[4em] mb-[4rem]">
                <div className = "flex justify-between items-center gap-4 w-full">
                    <div className = "ml-[12rem]">
                        <p className= "text-center text-[2.25rem] font-bold">Người Đồng Hành <br/>Học Tập Thế Hệ Mới</p>
                    </div>
                    <div className = "mr-[12rem]">
                        <p className = "text-center text-[1.75rem] font-bold text-gray-600">Học tập thông minh hơn <br/> Không phải vất vả hơn</p>
                    </div>
                </div>
                <div>
                    <Row gutter={[16,16]} className = "flex justify-center items-center">
                    
                        {cardContent.map((item, index) => {
                            return (
                                <Col span = {6} key = {index}>
                                    <Card className = "h-[243px] w-[270px] shadow-md">
                                        <div>
                                            <p className = "text-[1.5rem] font-bold">{item.title}</p>
                                        </div>
                                        <div>
                                            <p className = "text-[1rem] font-normal text-gray-600">{item.description}</p>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            </div>
        </div>

        {/* Third Section */}

        <div className = "flex flex-col w-full h-full mt-[4em] mb-[4rem]">
            <div className = "flex justify-center items-center mb-[2rem]">
                <p className = "text-[3.5rem] font-bold text-center">Môn Học Thịnh Hành</p>
            </div>
            <div className = "flex justify-center items-center">
                <Row gutter = {[16,16]}>
                    {displayCourses.map((item, index) => {
                        return (
                            <Col span = {8} key = {index}
                            >
                                <Card className = "h-[390px] w-[365px] shadow-md">
                                    <div>
                                        <p className = "text-[1rem] font-bold">{item.title}</p>
                                    </div>
                                    <div className = "flex flex-col justify-center items-center gap-[2rem]">
                                        {item.items.map((item, index) => {
                                            return (
                                                <div key = {index} className = "flex items-stretch justify-start gap-2 w-full">
                                                    <div className = "flex items-center justify-center gap-2 pt-1 w-1/4">
                                                        <div className = "w-full h-full bg-gray-100 rounded-md">
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className = "text-[1rem] font-bold">{item.teacherName}</p>
                                                        <p className = "text-[1rem] font-bold">{item.courseName}</p>
                                                        <p className = "text-[1rem]"><span><StarFilled/></span> {item.rate.toFixed(1)}</p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        </div>

        {/* Fourth Section */}
        <div className = "flex flex-col w-full h-full bg-white">
            <div className = "grid grid-cols-3 gap-4 justify-center items-start w-full pt-10">
                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold ">Về GSAI</p>
                        </div>
                        <div>
                            <p>Chính sách dùng AI</p>
                            <p>Điều kiện & điều khoản</p>
                            <p>Chính sách bảo mật</p>
                            <p>Chính sách thanh toán</p>
                        </div>
                    </div>
                    
                </div>

                <div className = "flex flex-col justify-center items-center ">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold">Hướng dẫn sử dụng</p>
                        </div>
                        <div>
                            <p>Cách tương tác với gia sư AI</p>
                            <p>Cách điều chỉnh lịch học</p>
                            <p>Hướng dẫn thanh toán</p>
                        </div>
                    </div>
                </div>

                <div className = "flex flex-col justify-center items-center">
                    <div>
                        <div>
                            <p className = "text-[0.75rem] font-bold">Kết nối với chúng tôi</p>
                        </div>
                        <div className = "flex items-center justify-start gap-2 w-full">
                            <FacebookFilled style={{ fontSize: '20px' }}/>
                            <InstagramFilled  style={{ fontSize: '20px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}