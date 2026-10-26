"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  Avatar,
  Dialog,
  Spinner,
  Skeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui";

export default function DesignSystemPage() {
  // Demo states for interactive controls
  const [demoInput, setDemoInput] = useState("Electrician Service");
  const [errorInput, setErrorInput] = useState("");
  const [textareaVal, setTextareaVal] = useState(
    "Circuit breaker trips repeatedly whenever AC unit powers on in main living room."
  );
  const [selectedService, setSelectedService] = useState("electrician");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [notificationPref, setNotificationPref] = useState("sms");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const colorPalette = [
    {
      name: "Primary Navy",
      hex: "#173B57",
      token: "--fixnear-navy",
      tailwind: "bg-fixnear-navy",
      textColor: "text-white",
      usage: "Strong headings, navigation bars, and primary dark brand accents.",
      contrast: "12.3:1 (AAA on White)",
    },
    {
      name: "Primary Blue",
      hex: "#2878B5",
      token: "--fixnear-blue",
      tailwind: "bg-fixnear-blue",
      textColor: "text-white",
      usage: "Primary actions, links, active controls, and interactive states.",
      contrast: "4.7:1 (AA on White)",
    },
    {
      name: "Amber Accent",
      hex: "#F4B544",
      token: "--fixnear-amber",
      tailwind: "bg-fixnear-amber",
      textColor: "text-fixnear-text",
      usage: "Ratings, featured tags, subtle highlights, and selected emphasis.",
      contrast: "2.3:1 (Accent on light/dark)",
    },
    {
      name: "Page Background",
      hex: "#F7F9FC",
      token: "--fixnear-bg",
      tailwind: "bg-fixnear-bg",
      textColor: "text-fixnear-text",
      border: true,
      usage: "Default subtle off-white background canvas across all pages.",
      contrast: "14.1:1 (with Main Text)",
    },
    {
      name: "Surface / Card",
      hex: "#FFFFFF",
      token: "--fixnear-surface",
      tailwind: "bg-fixnear-surface",
      textColor: "text-fixnear-text",
      border: true,
      usage: "Elevated surfaces, card containers, dialogs, and modal backgrounds.",
      contrast: "14.5:1 (with Main Text)",
    },
    {
      name: "Main Text",
      hex: "#172B3A",
      token: "--fixnear-text",
      tailwind: "bg-fixnear-text",
      textColor: "text-white",
      usage: "Primary body copy, headings, and high-emphasis textual content.",
      contrast: "14.5:1 (AAA on Surface)",
    },
    {
      name: "Secondary Text",
      hex: "#526273",
      token: "--fixnear-muted",
      tailwind: "bg-fixnear-muted",
      textColor: "text-white",
      usage: "Helper text, subtitles, meta labels, timestamps, and placeholders.",
      contrast: "6.1:1 (AAA large, AA normal)",
    },
    {
      name: "Borders",
      hex: "#DCE4EC",
      token: "--fixnear-border",
      tailwind: "bg-fixnear-border",
      textColor: "text-fixnear-text",
      border: true,
      usage: "Card outlines, section dividers, table borders, and input boundaries.",
      contrast: "Structural separator",
    },
    {
      name: "Success",
      hex: "#16803C",
      token: "--fixnear-success",
      tailwind: "bg-fixnear-success",
      textColor: "text-white",
      usage: "Booking confirmed, verified technician status, completed payments.",
      contrast: "4.8:1 (AA on White)",
    },
    {
      name: "Warning",
      hex: "#B76E00",
      token: "--fixnear-warning",
      tailwind: "bg-fixnear-warning",
      textColor: "text-white",
      usage: "Pending approval, schedule conflict alerts, cautionary notices.",
      contrast: "4.6:1 (AA on White)",
    },
    {
      name: "Error",
      hex: "#C62828",
      token: "--fixnear-error",
      tailwind: "bg-fixnear-error",
      textColor: "text-white",
      usage: "Cancelled bookings, form validation errors, urgent system alerts.",
      contrast: "5.5:1 (AA on White)",
    },
    {
      name: "Focus Ring",
      hex: "#2878B5",
      token: "--fixnear-ring",
      tailwind: "bg-fixnear-ring",
      textColor: "text-white",
      usage: "Accessible 2px focus indicators for keyboard navigation compliance.",
      contrast: "Visible keyboard focus",
    },
  ];

  return (
    <div className="min-h-screen bg-fixnear-bg text-fixnear-text pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-fixnear-border">
        <div className="fixnear-container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-fixnear-navy text-white flex items-center justify-center font-bold text-lg shadow-xs">
              F
            </div>
            <div>
              <span className="font-bold text-lg text-fixnear-navy tracking-tight">
                FixNear
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-fixnear-blue/10 text-fixnear-blue font-medium">
                UI Component System
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-fixnear-muted hover:text-fixnear-navy transition-colors"
            >
              Home
            </Link>
            <Badge variant="amber" size="sm">
              Module 2, Part 2
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-fixnear-border bg-white py-10 sm:py-12">
        <div className="fixnear-container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#EEF6FC] text-fixnear-blue text-xs font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-fixnear-blue" />
              Shared Design System & Components
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-fixnear-navy leading-tight">
              FixNear Reusable UI Library
            </h1>
            <p className="mt-3 text-sm sm:text-base text-fixnear-muted leading-relaxed">
              Standardized, accessible primitives built for the local services marketplace.
              Designed for Customers searching for repairs, Technicians managing their service
              schedules, and Administrators monitoring platform operations.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-fixnear-muted">
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Buttons & Links
              </span>
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Form Suite (Input, Textarea, Select, Checkbox, Radio)
              </span>
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Status Indicators & Badges
              </span>
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Avatars & Fallbacks
              </span>
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Accessible Dialog / Modal
              </span>
              <span className="px-2.5 py-1 bg-fixnear-bg rounded-md border border-fixnear-border">
                Loading, Empty & Error States
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="fixnear-container mt-10 space-y-12">
        {/* Section 1: Buttons & Link Actions */}
        <section id="buttons" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
                1. Buttons & Action Styles
              </h2>
              <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
                Semantic button variants supporting primary, secondary, outline, ghost, destructive,
                and link presentations.
              </p>
            </div>
            <span className="text-xs text-fixnear-muted hidden sm:inline">
              WCAG Focus Ring (#2878B5)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Button Styles & Variants</CardTitle>
                <CardDescription>
                  Supports left and right icons with automatic alignment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Blue</Button>
                  <Button variant="navy">Navy Brand</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="amber">Amber Accent</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="link">Link-Style Button</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sizes, Icons & Functional States</CardTitle>
                <CardDescription>
                  Standard heights (32px, 40px, 48px) with loading and disabled behaviors.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (32px)</Button>
                  <Button size="md">Medium (40px)</Button>
                  <Button size="lg">Large (48px)</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-fixnear-border/60">
                  <Button variant="primary" isLoading>
                    Processing
                  </Button>
                  <Button
                    variant="navy"
                    leftIcon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  >
                    Add Service
                  </Button>
                  <Button variant="outline" disabled>
                    Disabled Action
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Form Controls Suite */}
        <section id="form-controls" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
              2. Form Controls Suite
            </h2>
            <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
              Comprehensive form elements with associated labels, helper captions, and accessible error states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1: Text Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Text Inputs</CardTitle>
                <CardDescription>40px standard height with icon support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Search Services"
                  placeholder="e.g. Electrician, Plumbing"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  helperText="Search by profession or service keyword."
                  leadingIcon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  }
                />

                <Input
                  label="Zip Code"
                  placeholder="94103"
                  required
                  helperText="Service radius detection requires a 5-digit zip code."
                />

                <Input
                  label="Validation Error State"
                  placeholder="Enter contact number"
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  error={
                    errorInput.length === 0
                      ? "Phone number is required for booking confirmations."
                      : undefined
                  }
                  required
                />
              </CardContent>
            </Card>

            {/* Column 2: Select & Textarea */}
            <Card>
              <CardHeader>
                <CardTitle>Select & Textarea</CardTitle>
                <CardDescription>Structured choice and multiline input</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Service Category"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  helperText="Select the relevant trade discipline."
                  options={[
                    { label: "Electrical Repairs & Wiring", value: "electrician" },
                    { label: "Plumbing & Pipe Maintenance", value: "plumbing" },
                    { label: "HVAC & AC Technician", value: "ac" },
                    { label: "Computer & Hardware Repair", value: "computer" },
                  ]}
                  required
                />

                <Textarea
                  label="Problem Description"
                  value={textareaVal}
                  onChange={(e) => setTextareaVal(e.target.value)}
                  helperText="Provide specific details about the issue for the technician."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Column 3: Checkbox & Radio Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Selection Controls</CardTitle>
                <CardDescription>Custom styled checkboxes and radio groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-fixnear-navy uppercase tracking-wider block">
                    Checkboxes
                  </span>
                  <Checkbox
                    label="Emergency Dispatch Required"
                    helperText="Immediate technician arrival within 90 minutes."
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <Checkbox
                    label="Accept Standard Terms & Conditions"
                    disabled
                    checked
                    helperText="Disabled selected confirmation."
                  />
                </div>

                <div className="pt-3 border-t border-fixnear-border/60">
                  <RadioGroup
                    label="Notification Preference"
                    helperText="Choose how dispatch alerts are delivered."
                    required
                  >
                    <Radio
                      name="notify"
                      value="sms"
                      checked={notificationPref === "sms"}
                      onChange={() => setNotificationPref("sms")}
                      label="SMS Text Message"
                      helperText="Fastest notification on technician arrival."
                    />
                    <Radio
                      name="notify"
                      value="email"
                      checked={notificationPref === "email"}
                      onChange={() => setNotificationPref("email")}
                      label="Email Dispatch Alert"
                      helperText="Summary delivered with attached PDF invoice."
                    />
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Badges & Semantic Status Indicators */}
        <section id="badges" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
              3. Badges & Booking Status Indicators
            </h2>
            <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
              The 6 required marketplace booking statuses paired with contextual icons and high-contrast styling.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">1. Pending</span>
                  <StatusBadge status="pending" />
                  <span className="text-[11px] text-fixnear-muted">Awaiting Tech</span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">2. Confirmed</span>
                  <StatusBadge status="confirmed" />
                  <span className="text-[11px] text-fixnear-muted">Scheduled</span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">3. In Progress</span>
                  <StatusBadge status="in-progress" />
                  <span className="text-[11px] text-fixnear-muted">Job Active</span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">4. Completed</span>
                  <StatusBadge status="completed" />
                  <span className="text-[11px] text-fixnear-muted">Payment Done</span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">5. Cancelled</span>
                  <StatusBadge status="cancelled" />
                  <span className="text-[11px] text-fixnear-muted">User Cancelled</span>
                </div>

                <div className="flex flex-col items-start gap-1.5">
                  <span className="text-xs text-fixnear-muted">6. Rejected</span>
                  <StatusBadge status="rejected" />
                  <span className="text-[11px] text-fixnear-muted">Declined</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Avatars & Fallbacks */}
        <section id="avatars" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
              4. Avatars & Fallback Initials
            </h2>
            <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
              Profile representations with fallback initial derivation across 5 standardized sizes.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Size Scale & Fallback Generation</CardTitle>
              <CardDescription>
                Automatically extracts initials from technician names without external API dependencies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <Avatar name="David Clark" size="xs" />
                  <span className="text-xs text-fixnear-muted">XS (24px)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Sarah Jenkins" size="sm" />
                  <span className="text-xs text-fixnear-muted">SM (32px)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Marcus Rodriguez" size="md" />
                  <span className="text-xs text-fixnear-muted">MD (40px)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Elena Rostova" size="lg" />
                  <span className="text-xs text-fixnear-muted">LG (48px)</span>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar name="Apex Plumbing LLC" size="xl" />
                  <span className="text-xs text-fixnear-muted">XL (64px)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Dialog / Modal Component */}
        <section id="dialog" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
                5. Accessible Dialog / Modal
              </h2>
              <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
                Keyboard-accessible modal with Escape key listener, scroll locking, and mobile-friendly layout.
              </p>
            </div>
            <span className="text-xs text-fixnear-muted hidden sm:inline">
              role=&quot;dialog&quot; &middot; aria-modal
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Modal Demonstration</CardTitle>
              <CardDescription>
                Test modal launch, keyboard escape close, backdrop dismiss, and form focus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                Open Demo Dialog
              </Button>
            </CardContent>
          </Card>

          {/* Dialog Instance */}
          <Dialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Confirm Service Reschedule"
            description="Adjust appointment timing without cancellation penalty."
            footer={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Save New Window
                </Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-fixnear-muted leading-relaxed">
                Your assigned electrician is scheduled for tomorrow at 10:00 AM.
                Select an alternative 2-hour window below:
              </p>

              <Select
                label="Requested Arrival Window"
                defaultValue="afternoon"
                options={[
                  { label: "Tomorrow, 2:00 PM – 4:00 PM", value: "afternoon" },
                  { label: "Friday, 9:00 AM – 11:00 AM", value: "friday_morning" },
                  { label: "Friday, 1:00 PM – 3:00 PM", value: "friday_afternoon" },
                ]}
              />

              <Input
                label="Reschedule Note for Dispatcher (Optional)"
                placeholder="e.g. Please ring rear doorbell upon arrival"
              />
            </div>
          </Dialog>
        </section>

        {/* Section 6: Loading, Empty & Error States */}
        <section id="states" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
              6. Loading, Empty & Error States
            </h2>
            <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
              Standardized asynchronous presentation patterns for data fetching, empty lists, and error recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loading / Skeletons */}
            <Card>
              <CardHeader>
                <CardTitle>Loading Indicators</CardTitle>
                <CardDescription>Spinners and skeleton placeholders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="md" color="primary" />
                  <Spinner size="lg" color="navy" />
                </div>

                <div className="space-y-2 pt-2 border-t border-fixnear-border/60">
                  <span className="text-xs font-semibold text-fixnear-muted uppercase tracking-wider block">
                    Skeleton Placeholder
                  </span>
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
                    <div className="space-y-1.5 w-full">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Empty State */}
            <Card>
              <CardHeader>
                <CardTitle>Empty State</CardTitle>
                <CardDescription>Zero-state feedback for searches or listings</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  title="No Bookings Found"
                  description="You do not have any active appointments scheduled for this week."
                  action={
                    <Button variant="outline" size="sm">
                      Browse Nearby Pros
                    </Button>
                  }
                />
              </CardContent>
            </Card>

            {/* Error State */}
            <Card>
              <CardHeader>
                <CardTitle>Error State</CardTitle>
                <CardDescription>Accessible alert with retry action</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorState
                  title="Unable to Load Schedule"
                  message="A network interruption prevented loading technician availability."
                  retryLabel={
                    retryCount > 0 ? `Retried (${retryCount})` : "Retry Connection"
                  }
                  onRetry={() => setRetryCount((prev) => prev + 1)}
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7: Card Compositions */}
        <section id="cards" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
              7. Card Composition Examples
            </h2>
            <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
              Demonstrating how the UI primitives combine into cohesive Customer, Technician, and Admin views.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Booking Card */}
            <Card interactive className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-fixnear-blue uppercase tracking-wider">
                      Customer Booking
                    </span>
                    <StatusBadge status="confirmed" size="sm" />
                  </div>
                  <CardTitle>Electrical Panel Inspection</CardTitle>
                  <CardDescription>Scheduled for Thursday, Oct 29 · 10:00 AM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name="Marcus Rodriguez" size="md" />
                    <div>
                      <div className="text-sm font-semibold text-fixnear-navy">
                        Marcus Rodriguez
                      </div>
                      <div className="text-xs text-fixnear-muted flex items-center gap-1">
                        <span>Certified Master Electrician</span>
                        <span>·</span>
                        <span className="text-[#945600] font-medium">★ 4.9</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-fixnear-bg rounded-lg border border-fixnear-border text-xs text-fixnear-text flex justify-between">
                    <span className="text-fixnear-muted">Estimated Total</span>
                    <span className="font-semibold text-fixnear-navy">$120.00</span>
                  </div>
                </CardContent>
              </div>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Reschedule Appointment
                </Button>
              </CardFooter>
            </Card>

            {/* Technician Dispatch Card */}
            <Card interactive className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-fixnear-blue uppercase tracking-wider">
                      Technician Dispatch
                    </span>
                    <StatusBadge status="in-progress" size="sm" />
                  </div>
                  <CardTitle>AC Diagnostic Ticket</CardTitle>
                  <CardDescription>Customer: Sarah Jenkins · Priority Call</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-fixnear-muted">
                      <svg
                        className="w-4 h-4 text-fixnear-muted shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-fixnear-text font-medium">
                        742 Evergreen Terrace, North District
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-fixnear-muted">
                      <svg
                        className="w-4 h-4 text-fixnear-muted shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Estimated arrival in 18 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </div>
              <CardFooter>
                <Button variant="primary" size="sm" className="w-full">
                  Update Dispatch Status
                </Button>
              </CardFooter>
            </Card>

            {/* Admin Verification Card */}
            <Card interactive className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-fixnear-blue uppercase tracking-wider">
                      Admin Verification
                    </span>
                    <StatusBadge status="pending" size="sm" />
                  </div>
                  <CardTitle>Plumbing License Review</CardTitle>
                  <CardDescription>Applicant: Apex Plumbing LLC</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs space-y-1.5 text-fixnear-muted">
                    <p>
                      Submitted documents: State Contractor License (PDF), General Liability Certificate.
                    </p>
                    <div className="p-2 bg-[#FEF7ED] rounded border border-[#FDE3B8] text-[#B76E00] text-[11px] font-medium flex items-center gap-1.5">
                      <span>Expiring within 30 days: re-check requested</span>
                    </div>
                  </div>
                </CardContent>
              </div>
              <CardFooter>
                <div className="flex items-center gap-2 w-full">
                  <Button variant="navy" size="sm" className="flex-1">
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Inquire
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Section 8: Palette Token Reference */}
        <section id="colors" className="space-y-4">
          <div className="border-b border-fixnear-border pb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-fixnear-navy">
                8. FixNear Design Tokens
              </h2>
              <p className="text-xs sm:text-sm text-fixnear-muted mt-0.5">
                Centralized color tokens and contrast ratios preserved from Module 2 Part 1.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {colorPalette.map((c) => (
              <div
                key={c.hex}
                className="bg-white rounded-xl border border-fixnear-border overflow-hidden shadow-xs hover:shadow-sm transition-shadow"
              >
                <div
                  className={`h-20 sm:h-24 p-3 flex flex-col justify-between ${c.tailwind} ${
                    c.border ? "border-b border-fixnear-border" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                        c.textColor === "text-white"
                          ? "bg-black/20 text-white"
                          : "bg-white/80 text-fixnear-text"
                      }`}
                    >
                      {c.hex}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        c.textColor === "text-white"
                          ? "bg-white/20 text-white"
                          : "bg-black/10 text-fixnear-text"
                      }`}
                    >
                      {c.contrast}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-semibold tracking-wide ${c.textColor}`}
                  >
                    {c.name}
                  </div>
                </div>
                <div className="p-3.5 space-y-1 text-xs">
                  <div className="font-mono text-[11px] text-fixnear-muted font-medium">
                    {c.token}
                  </div>
                  <p className="text-fixnear-muted text-[11px] leading-relaxed pt-1">
                    {c.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
