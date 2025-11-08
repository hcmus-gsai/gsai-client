// src/app/(public)/student/page.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import { GreetingSection, CourseDisplaySection, FooterSection } from "@/components/guest/ui/guest";
import Link from "next/link";
export default function StudentLandingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
      <nav className="bg-primary h-10 text-white p-4">
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div>
                    <Link href="/student" className="mr-15 text-white">
                        Học sinh
                    </Link>
                    <Link href="/teacher" className="text-white">
                        Giáo viên
                    </Link>
                </div>
            </div>
        </nav>
        <div className="relative">
            <div className="absolute top-0 left-0 -z-10 pointer-events-none">
                <Image
                    src="/landing/gradient_top_left.png"
                    alt="Decorative gradient"
                    width={800}
                    height={800}
                    className="opacity-100"
                    priority
                />
            </div>
            <div className="absolute top-0 right-0 -z-10 pointer-events-none">
                <Image
                    src="/landing/gradient_top_right.png"
                    alt="Decorative gradient"
                    width={800}
                    height={800}
                    className="opacity-100"
                    priority
                />
            </div>
        </div> 
      <GreetingSection />
      <CourseDisplaySection />
      <FooterSection />
    </main>
  );
}
