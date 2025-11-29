'use client';
import '@ant-design/v5-patch-for-react-19';

import { useState } from "react";
import Image from "next/image";
import { GreetingSection, FooterSection } from "@/components/guest/ui/guest";
import Link from "next/link";
import GradientTopLeft from "@/../public/guest/gradient_top_left.svg";
import GradientTopRight from "@/../public/guest/gradient_top_right.svg";
import GradientBottomLeft from "@/../public/guest/gradient_bottom_left.svg";
import GradientBottomRight from "@/../public/guest/gradient_bottom_right.svg";
import EmptyLayout from "@/../public/EmptyLayout.svg";
import Epis from "@/../public/shared/EPIS.svg";
import SearchIcon from "@/../public/shared/SearchIcon.svg";
import UserIcon from "@/../public/shared/User.svg";
import NotificationIcon from "@/../public/shared/Notification.svg";
import CurveSpace from "@/../public/student/CurveSpace.svg";
import AbstractTop from "@/../public/student/AbstractTop.svg";
import AbstractMiddle from "@/../public/student/AsbtractMiddle.svg";

import {CourseGrid} from "@/components/shared/course-grid";
import { Button, Card, Menu, Input, Grid, Row, Col} from "antd";
import { StarFilled } from "@ant-design/icons";
import {RedirectButton} from "@/components/shared/redirect-button";
import { CourseDisplaySection } from "@/components/student/course-display";
import { LearningPathSection } from "@/components/student/learning-path";
import { StudentGreetingSection } from "@/components/student/greeting";


export default function StudentHomePage() {
    return(
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
            <StudentGreetingSection
                title = "Công việc hôm nay"
                description = "Hãy kiểm tra thời gian biểu của bạn để hoàn thành công việc đúng hạn nhé!"
                buttonText = "Thời gian biểu"
                isCourse = {false}
            />
            <CourseDisplaySection title = "Môn học đã xem gần đây" hasExtended = {true}/>
            <CourseDisplaySection title = "Môn học phổ biến hiện nay"/>
            <CourseDisplaySection title = "Môn học dành riêng cho bạn"/>
            <LearningPathSection />
            <CourseDisplaySection title = "Trải nghiệm các khóa học miễn phí"/>
            <FooterSection hasRegisterBox = {false}/> 
        </main>
    )
}
 