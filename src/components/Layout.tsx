import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};
