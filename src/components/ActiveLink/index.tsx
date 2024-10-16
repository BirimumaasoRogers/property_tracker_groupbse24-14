"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ReactNode } from "react";

export default function ActiveLink({ children, href }: { children: ReactNode, href: string }) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    return pathname === path
      ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
      : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8";
  };
  return (
    <Link href={`${href}`} className={getLinkClass(`${href}`)}>
      {children}
    </Link>
  );
}
