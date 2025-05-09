"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { NavUser } from "@/components/Nav/nav-user";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";

export default function LandingNav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUser({
            name: session.data.user.name,
            email: session.data.user.email,
            avatar: session.data.user.image || "/avatars/default.jpg",
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((word: string) => word[0]).join('')
    : 'CN';

  return (
    <header className="sticky top-0 px-2 sm:px-12 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">PropertyTracker</span>
        </div>
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            How It Works
          </Link>
          <Link href="/#faq" className="text-sm font-medium hover:underline underline-offset-4">
            FAQ
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact Us
          </Link>
        </nav>

        <div className="flex gap-4">
          {/* Conditional rendering here */}
          <div className="flex items-center gap-4">
            {user ? (
              <div
                className="flex flex-row gap-2 justify-center items-center cursor-pointer border border-primary rounded-full p-1 sm:py-2 sm:px-2"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile drawer trigger */}
          <div className="md:hidden flex items-center">
            <Drawer>
              <DrawerTrigger asChild>
                <div className="p-2 border rounded-lg">
                  <Menu className="h-5 w-5" />
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Menu</DrawerTitle>
                  <DrawerDescription>Navigate through the site</DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 px-4 py-2">
                  <Link href="/#features" className="text-base font-medium" passHref>
                    Features
                  </Link>
                  <Link href="/#how-it-works" className="text-base font-medium" passHref>
                    How It Works
                  </Link>
                  <Link href="/#faq" className="text-base font-medium" passHref>
                    FAQ
                  </Link>
                  <Link href="/contact" className="text-base font-medium" passHref>
                    Contact Us
                  </Link>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}