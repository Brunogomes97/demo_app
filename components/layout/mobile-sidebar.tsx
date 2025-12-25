"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/components/constants/data";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // playlists: Playlist[];
  className?: string;
}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTitle className="sr-only">Mobile Sidebar</SheetTitle>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className={cn(className, "!px-0")}>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Seções
              </h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
