import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useRef, useEffect, useState } from 'react';
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    title: string;
}
export default function AsyncButton({
    loading,
    title,
    ...props
}: ButtonProps) {
    const titleRef = useRef<HTMLElement>(null);
    const [buttonWidth, setButtonWidth] = useState(0);


    useEffect(() => {
        if (titleRef.current) {
            setButtonWidth(titleRef.current.offsetWidth);
        }
    }, [title]);


    return (
        <Button
            {...props}
            disabled={loading}
            onClick={loading ? undefined : props.onClick}
            onSubmit={loading ? undefined : props.onSubmit}
            style={{ minWidth: 61 }}
            className="relative"
        >
            {loading ? (
                <>
                    <ReloadIcon className=" absolute h-4 w-4 animate-spin" />
                    <span style={{ minWidth: buttonWidth }} className="invisible" ref={titleRef}>{title}</span>
                </>
            )
                : title}
        </Button>
    )
}