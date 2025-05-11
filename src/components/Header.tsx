
import React from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <header 
      className={cn("bg-card shadow-sm border-b px-4 py-3 flex items-center justify-between", className)}
      {...props}
    >
      <div className="flex items-center space-x-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-primary">NeuroDevelop AI</h1>
          <p className="text-sm text-muted-foreground">
            Early Autism Detection System
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
          Demo Mode
        </div>
      </div>
    </header>
  );
};

export default Header;
