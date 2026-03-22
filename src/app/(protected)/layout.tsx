import { Sidebar } from "@/components/dashboard/sidebar"

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#0A0A0A] overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col w-full overflow-x-hidden md:ml-[64px] lg:ml-[240px] pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-0">
                {children}
            </main>
        </div>
    );
}
