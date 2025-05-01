"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link"; // Import Link for BreadcrumbLink

// Helper function to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const Nav = () => {
    const {
        data: session,
        refetch,
    } = authClient.useSession()

    const pathname = usePathname(); // Get the current pathname

    useEffect(() => {
        if (!session) {
            refetch(); // Refetch the session if it's null
        }
    }, [session, refetch]);

    // Generate breadcrumbs based on the pathname
    const generateBreadcrumbs = () => {
        const pathSegments = pathname.split('/').filter(segment => segment); // Split and remove empty segments
        const breadcrumbs = [
            <BreadcrumbItem key="home">
                <BreadcrumbLink asChild>
                     <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
            </BreadcrumbItem>
        ];

        let currentPath = '/dashboard'; // Start building path from dashboard

        pathSegments.forEach((segment, index) => {
            // Skip the root 'dashboard' segment if it's the first one after splitting
            if (index === 0 && segment.toLowerCase() === 'dashboard') {
                return;
            }

            // Build the path, but handle the 'settings' case for the link href
            const segmentPath = `${currentPath}/${segment}`;
            const isLast = index === pathSegments.length - 1;
            const linkHref = segment.toLowerCase() === 'settings' ? '/dashboard' : segmentPath; // Use '/dashboard' if segment is 'settings'

            breadcrumbs.push(
                <BreadcrumbSeparator key={`sep-${index}`} />
            );
            breadcrumbs.push(
                <BreadcrumbItem key={segment}>
                    {isLast ? (
                        // If it's the last segment, always display as page title, even if it's 'settings'
                        <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                    ) : (
                        // Otherwise, create a link using the determined href
                        <BreadcrumbLink asChild>
                             <Link href={linkHref}>{capitalize(segment)}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
            );

            // Update currentPath for the next iteration *unless* it was 'settings'
            if (segment.toLowerCase() !== 'settings') {
                 currentPath = segmentPath;
            }
        });

        return breadcrumbs;
    };


    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {generateBreadcrumbs()} {/* Render dynamic breadcrumbs */}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
};