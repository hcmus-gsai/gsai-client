import Link from "next/link";
import Image from "next/image";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
        {/* <nav className="bg-primary h-10 text-white p-4">
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div>
                    <Link href="/student" className="mr-15 text-white">
                        Học sinh
                    </Link>
                    <Link href="/teacher" className="text-white">
                        Giáo viên
                    </Link>
                </div>
            </div>
        </nav>
        <div className="relative">  </div>
            <div className="absolute top-0 left-0 -z-10 pointer-events-none">
                <Image
                    src="/landing/gradient_top_left.png"
                    alt="Decorative gradient"
                    width={800}
                    height={800}
                    className="opacity-100"
                    priority
                />
            </div>
            <div className="absolute top-0 right-0 -z-10 pointer-events-none">
                <Image
                    src="/landing/gradient_top_right.png"
                    alt="Decorative gradient"
                    width={800}
                    height={800}
                    className="opacity-100"
                    priority
                />
        </div> */}


        <main className="flex-1">{children}</main>

        {/* Footer (tùy chọn) */}
        {/* <footer className="bg-grey text-center py-4 text-sm text-primary border-t">
            © 2025 GSAI. All rights reserved.
        </footer> */}
    </div>
  );
}
