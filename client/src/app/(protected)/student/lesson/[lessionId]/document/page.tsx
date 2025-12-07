'use client';
import '@ant-design/v5-patch-for-react-19';

import React, { useState, useRef, useEffect } from 'react';
import { Switch } from "antd";   

// Section imports
import ChatbotSection from '../components/chatbotSection';

export default function LectureDocPage() {

    return (
        <>
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                <div className="w-full relative">
                    <iframe 
                        src="/student/sample_doc.pdf" 
                        className="w-full rounded-lg border border-gray-200"
                        // GIẢI THÍCH CÔNG THỨC:
                        // 100vh: Toàn bộ chiều cao màn hình
                        // - 10rem (margin top của layout)
                        // - 2rem (margin bottom của layout)
                        // - 5rem (Dự trù cho chiều cao của Footer + gap)
                        style={{ height: 'calc(100vh - 17rem)' }} 
                        title="PDF Viewer"
                    />
                </div>
            </div>

            <ChatbotSection />
        </>
    )
}