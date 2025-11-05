import type { Metadata } from "next";
import "./globals.css";

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
      <body suppressHydrationWarning={true}>
        <div id="app">
          {children}
        </div>
      </body>
    </html>
  );
}
