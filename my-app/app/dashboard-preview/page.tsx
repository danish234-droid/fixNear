"use client";

import React, { useState } from "react";
import {
  DashboardShell,
  DashboardRole,
  roleConfig,
} from "@/components/layout";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";

export default function DashboardPreviewPage() {
  const [selectedRole, setSelectedRole] = useState<DashboardRole>("customer");
  const [activeNav, setActiveNav] = useState("/dashboard/customer");

  const currentConfig = roleConfig[selectedRole];

  const roleHrefs: Record<DashboardRole, string> = {
    customer:     "/dashboard/customer",
    professional: "/dashboard/professional",
    admin:        "/dashboard/admin",
  };

  return (
    <DashboardShell
      role={selectedRole}
      activeHref={activeNav}
      onNavItemClick={(item) => setActiveNav(item.href)}
      actions={
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <Button
            variant={selectedRole === "customer" ? "primary" : "outline"}
            size="sm"
            className="flex-1 sm:flex-initial"
            onClick={() => {
              setSelectedRole("customer");
              setActiveNav(roleHrefs.customer);
            }}
          >
            Customer View
          </Button>
          <Button
            variant={selectedRole === "professional" ? "primary" : "outline"}
            size="sm"
            className="flex-1 sm:flex-initial"
            onClick={() => {
              setSelectedRole("professional");
              setActiveNav(roleHrefs.professional);
            }}
          >
            Professional View
          </Button>
          <Button
            variant={selectedRole === "admin" ? "primary" : "outline"}
            size="sm"
            className="flex-1 sm:flex-initial"
            onClick={() => {
              setSelectedRole("admin");
              setActiveNav(roleHrefs.admin);
            }}
          >
            Admin View
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant={currentConfig.badgeVariant} size="sm">
                {currentConfig.badgeLabel} Foundation
              </Badge>
              <span className="text-xs text-fixnear-muted font-mono">
                Active Nav: {activeNav}
              </span>
            </div>
            <CardTitle>{currentConfig.title} Layout Shell</CardTitle>
            <CardDescription>{currentConfig.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs sm:text-sm text-fixnear-muted">
            <p>
              This page previews the shared DashboardShell with each role&apos;s
              navigation config. Use the role-switcher above to explore each
              portal variant. Real role-based access control will be implemented
              in a future backend module.
            </p>
            <div className="p-3.5 bg-fixnear-bg rounded-lg border border-fixnear-border">
              <span className="font-semibold text-fixnear-navy block mb-1">
                Configured Navigation Items for {currentConfig.badgeLabel}:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-fixnear-text">
                {currentConfig.navItems.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong> (route: <code>{item.href}</code>)
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Testing Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Desktop Layout Features</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fixnear-muted space-y-2">
              <p>• Fixed 256px (w-64) sidebar on viewports &ge; 1024px.</p>
              <p>• Fixed top header bar with role badge, breadcrumb, and avatar.</p>
              <p>• Scrollable sidebar navigation with active indicator styling.</p>
              <p>• Seamless exit link back to public marketplace.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mobile &amp; Tablet Features</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fixnear-muted space-y-2">
              <p>• Clean slide-out overlay drawer accessible via top bar hamburger toggle.</p>
              <p>• Accessible backdrop dismiss on click or <code>Escape</code> key press.</p>
              <p>• Background body scroll locked during drawer visibility.</p>
              <p>• Zero horizontal overflow at 375px mobile viewport widths.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
