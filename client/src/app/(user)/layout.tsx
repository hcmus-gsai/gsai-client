
export default async function UserLayout({children}: {children: React.ReactNode}) {

    return (
        <div className = "flex min-h-screen flex-col overflow-x-clip bg-white">
            <main className = "w-full grow px-4 pb-4 pt-[40px]">
                {children}
            </main>
        </div>
    )
}