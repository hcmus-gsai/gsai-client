// src/app/page.tsx
import { redirect } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";

export default function Home() {
  redirect("/student"); // ✅ Mặc định dẫn đến landing cho học sinh
}
