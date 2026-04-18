import Link from "next/link";
import ShowcaseRoleSelection from "./components/ShowcaseRoleSelection";

// Trang này KHÔNG tạo tài khoản showcase guest, chỉ chọn vai trò
export default function ShowcasePage() {
    return (
        <main className="w-full grow flex min-h-screen flex-col overflow-x-clip bg-[radial-gradient(900px_420px_at_10%_-10%,rgba(71,181,255,0.28),transparent),radial-gradient(900px_480px_at_90%_10%,rgba(19,99,223,0.18),transparent),linear-gradient(180deg,#f6fbff_0%,#f9fcff_50%,#ffffff_100%)]">
            <section className="w-full flex items-center justify-center pt-8 sm:pt-10">
                <div className="w-[var(--global-width)] px-4 sm:px-0 flex items-center justify-start">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-black hover:text-[var(--color-secondary)] transition-colors"
                    >
                        <span aria-hidden>←</span>
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </section>
            <ShowcaseRoleSelection />
        </main>
    );
}
