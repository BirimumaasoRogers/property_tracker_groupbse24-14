import "../globals.css";
import { AppSidebar } from "@/components/SideBar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Nav } from "@/components/Nav";
import RqProvider from "@/providers/RqProvider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <NuqsAdapter>
            <RqProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <Nav />
                            {children}
                    </SidebarInset>
                </SidebarProvider>
            </RqProvider>
        </NuqsAdapter>
    );
}
