import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface RemoveButtonProps<TData> {
    disabled?: boolean
    onClick?: () => void
    className?: string
    items?: TData[]
}

export function RemoveButton<TData>({ disabled, onClick, className }: RemoveButtonProps<TData>) {
    return <Button
        className={cn("p-[0.75rem] hover:brightness-110", className)}
        variant="destructive"
        disabled={disabled}
        onClick={onClick}
    >
        <Trash />
    </Button>
}

