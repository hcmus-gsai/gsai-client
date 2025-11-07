// src/app/(public)/student/page.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import { GreetingSection, CourseDisplaySection, FooterSection } from "@/components/guest/ui/guest";

export default function StudentLandingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="w-full grow flex min-h-screen flex-col overflow-x-clip">
      <GreetingSection />
      <CourseDisplaySection />
      <FooterSection />
    </main>
  );
}
