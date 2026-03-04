export default function createClassLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <div className="">
            <main className="flex-1">{children}</main>
        </div>
    )
}