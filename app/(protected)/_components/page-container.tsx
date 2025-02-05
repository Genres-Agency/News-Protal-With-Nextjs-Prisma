import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer = ({ children, className }: PageContainerProps) => {
  return <div className={cn("p-6 w-full", className)}>{children}</div>;
};

export default PageContainer;
