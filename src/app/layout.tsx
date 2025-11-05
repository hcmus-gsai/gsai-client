import type { Metadata } from "next";
import { Geist, Geist_Mono, Chango, Poppins, Nunito } from "next/font/google";
import ThemeProvider from "@/app/theme";
import '@/app/globals.css';

// import NextAuthWrapper from "./auth/next-auth-wrapper";
/*
Khi nào xài wrapper và khi nào xài provider

Wrapper nghĩa là bọc 1 component để thêm logic hoặc thay đổi cachs
nó được sử dụng, nhưng ta sẽ không đi cung cập dữ liệu hay state global

Wrapper chỉ bọc để:

+ Kiểm tra điều kiện
+ Thêm logic xử lí 
+ Thay đổi ui
+ Điều hướng , guard, middleware


*/


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "giasuai",
  description: "Nền tảng hỗ trợ học tập và tạo sinh video",
};


const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito"
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang = "vn">
      <body className = {`${nunito.variable} bg-white antialiased`}>
        <ThemeProvider>
          <div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
