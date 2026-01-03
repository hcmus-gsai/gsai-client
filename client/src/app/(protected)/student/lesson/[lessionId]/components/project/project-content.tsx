'use client';

import React from 'react';
import { Spin } from 'antd';
import PdfViewer from './pdf-viewer';

interface LectureProjContentProps {
    isLoading: boolean;
    error: unknown;
    projectDoc?: {
        file_url: string;
    };

    
}

const LectureProjContent: React.FC<LectureProjContentProps> = ({
    isLoading,
    error,
    projectDoc,
}) => {
    
    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
                <p>Error: {(error as Error).message}</p>
            </div>
        );
    }

    if (projectDoc) {
        return (
            <object data={projectDoc?.file_url} type="application/pdf" width="100%" height="100%"
            style={{ height: 'calc(100vh - 17rem)' }}
            className="w-full h-full object-contain"
            >
            </object>
        );
    }

    return null;
};

export default LectureProjContent;

{/* <object data={projectDoc?.file_url} type="application/pdf" width="100%" height="100%"
style={{ height: 'calc(100vh - 17rem)' }}
className="w-full h-full object-contain"
>
</object> */}