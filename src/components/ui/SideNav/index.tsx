import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Home,
  MonitorSmartphone,
  Settings,
} from "lucide-react";
import ActiveLink from "@/components/ActiveLink";
import Image from "next/image";

export default function SideBar() {

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1728984385/Rogers%20Stock/property-logo_mlwoue.png" alt="Property Tracker" width="40" height="40" />
            <span className="sr-only">Property Tracker</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <ActiveLink
                href="/dashboard"
                className={"/dashboard"}
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </ActiveLink>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ActiveLink
                href="/dashboard/devices"
                className={"/dashboard/devices"}
              >
                <MonitorSmartphone className="h-5 w-5" />
                <span className="sr-only">Devices</span>
              </ActiveLink>
            </TooltipTrigger>
            <TooltipContent side="right">Devices</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <ActiveLink
                href="/dashboard/settings"
                className={"/dashboard/settings"}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </ActiveLink>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}