// src/app/(public)/student/page.tsx

"use client";
import { useState } from "react";
import Image from "next/image";

export default function StudentLandingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="">
      {/* Hero section */}
      <section className="text-center pt-24 pb-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Chào Mừng Học Sinh Đến Với <span className="text-blue-600">GSAI</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn đang gặp khó khăn trong quá trình học tập của mình? <br />
          Bạn cần một gia sư đồng hành cùng mình? Đừng lo lắng.
        </p>

        {/* Search bar */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-lg bg-white shadow-md rounded-full p-2">
            <input
              type="text"
              placeholder="Tìm kiếm môn học ở đây..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-l-full focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full transition">
              Tìm kiếm
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
