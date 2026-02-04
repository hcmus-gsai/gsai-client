'use client';

import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';


pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PdfViewer = ({ url }: { url: string }) => {
    const [numPages, setNumPages] = useState<number>(0);

    return (
        <div className="w-full flex flex-col gap-6">
            <Document
                file={url}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p>Đang tải PDF...</p>}
            >
                {Array.from({ length: numPages }, (_, i) => (
                    <Page
                        key={i}
                        pageNumber={i + 1}
                        width={900}
                    />
                ))}
            </Document>
        </div>
    );
};

export default PdfViewer;
