import { validateRequest } from "@/lib/auth/validateRequest";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";

export default async function EsaLayout({ children }: { children: React.ReactNode }) {
    const { user } = await validateRequest();
    if (!user) {
        return redirect("/login");
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
