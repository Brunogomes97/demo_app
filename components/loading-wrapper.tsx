import { cn } from "@/lib/utils";
import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";	
import FadeLoader from "react-spinners/FadeLoader";
import BarLoader from "react-spinners/BarLoader";
interface LoadingWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
  variant?: "default" | "scale-loader" | "clip-loader" | "fade-loader" | "bar-loader";
}

export default function LoadingWrapper({
  isLoading,
  children,
  className,
  variant = "default",
}: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className={cn("flex justify-center", className)}>
        {variant === "scale-loader" ? (
          <ScaleLoader color="var(--foreground)" />
        ) : variant === "clip-loader" ? (
          <ClipLoader color="var(--foreground)" />
        ) : variant === "fade-loader" ? (
          <FadeLoader color="var(--foreground)" />
        ) : variant === "bar-loader" ? (
          <BarLoader color="var(--foreground)" />
        ) : (
          <ScaleLoader color="var(--foreground)" />
        )}
      </div>
    );
  }
  return <>{children}</>;
}
