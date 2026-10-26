import React from "react";
import { PublicNavbar, NavItem } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

export interface PublicLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
}

export function PublicLayout({ children, navItems }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-fixnear-bg text-fixnear-text">
      <PublicNavbar navItems={navItems} />
      <main className="flex-1 w-full">{children}</main>
      <PublicFooter />
    </div>
  );
}
