"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Home,
  Settings,
  Settings2,
  SquareTerminal,
  Tags,
} from "lucide-react"

import { NavProjects } from "@/components/Nav/nav-projects"
import { NavUser } from "@/components/Nav/nav-user"
import { TeamSwitcher } from "@/components/TeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "../Nav/nav-main"
import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client" // Import your auth client

// This is sample data.
const data = {
  user: {
    name: "John Doe",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "PropertyTracker",
      logo: GalleryVerticalEnd,
      plan: "System",
    },
  ],
  settings: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "dashboard",
      icon: Home,
    },
    {
      name: "Property",
      url: "dashboard/property",
      icon: Tags,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState(data.user) // Initialize with sample data
  console.log("SESSION USER", user)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const session: any = await authClient.getSession() // Fetch session data
        console.log("SESSION", session)
        if (session?.data?.user) {
          setUser({
            name: session.data.user.name,
            email: session.data.user.email,
            avatar: session.data.user.image || "/avatars/default.jpg", // Use default if no image
          })
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2 w-full flex justify-center">
          <a
            href="/dashboard/help"
            className="flex items-center w-full gap-2 px-4 py-2 rounded hover:bg-muted transition-colors text-sm"
          >
            <BookOpen size={18} />
            <span>Help</span>
          </a>
        </div>
        <NavUser user={user} /> {/* Use the fetched user data */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
