import type { Metadata } from "next";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

export const metadata: Metadata = {
  title: "GiaSuAI",
  description: "Nền tảng hỗ trợ học tập thông minh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div id="app">
          {children}
        </div>
      </body>
    </html>
  );
}
