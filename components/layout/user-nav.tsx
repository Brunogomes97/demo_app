"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProps } from "@/lib/types";
// import { useRouter } from "next/navigation";

interface UserNavProps {
  user: UserProps | null;
}

export function UserNav({ user }: UserNavProps) {
  // const router = useRouter();

  const handleLogout = async () => {
    await fetch("/session/", {
      method: "DELETE",
      credentials: "include",
    });

    window.location.reload();
    // router.replace("/login");
    // router.push("/login");
  };



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={user?.username ?? ""} />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
        >
          Sair

        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
