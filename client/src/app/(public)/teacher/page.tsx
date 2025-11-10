// src/app/(public)/student/page.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import { GreetingSection, FunctionSection, WorkFlowSection, TestimonialSection, QASection, FooterSection } from "@/components/guest/ui/guest";

export default function TeacherLandingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <GreetingSection />
      <FunctionSection 
        title="Khám phá các chức năng dành cho học sinh"
        firstBlock={{
          title: "Học tập thông minh",
          subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
          button: "Tìm hiểu thêm",
        }}
        secondBlock={{
          title: "Học tập thông minh",
          subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
          button: "Tìm hiểu thêm",
        }}
        thirdBlock={{
          title: "Học tập thông minh",
          subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
          button: "Tìm hiểu thêm",
        }}
        fourthBlock={{
          title: "Học tập thông minh",
          subtext: "Sử dụng AI để hỗ trợ việc học tập và nghiên cứu của bạn.",
          button: "Tìm hiểu thêm",
        }}
      />
      <WorkFlowSection />
      <TestimonialSection />
      <QASection />
      <FooterSection />
    </main>
  );
}
