import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { ReduxProvider } from "./provider";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Epis",
  description: "Epis là nền tảng học tập thông minh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={manrope.variable} suppressHydrationWarning={true}>
      <body>
        
        <ReduxProvider>
          <div id="app">
            {children}
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
