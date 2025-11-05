// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/student"); // ✅ Mặc định dẫn đến landing cho học sinh
}
