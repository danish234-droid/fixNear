"use client";

import React, { useState, useId, useCallback } from "react";
import { DemoProfessional } from "@/data/professionals";
import { Button, Badge } from "@/components/ui";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  RotateCcw,
} from "@/components/icons/LucideIcons";

export interface BookingRequestFormProps {
  professional: DemoProfessional;
}

interface FormState {
  service: string;
  preferredDate: string;
  preferredTime: string;
  customerName: string;
  customerPhone: string;
  problemDescription: string;
}

interface FormErrors {
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  customerName?: string;
  customerPhone?: string;
}

interface SubmittedData extends FormState {
  submittedAt: string;
}

const TIME_PREFERENCES = [
  { value: "morning", label: "Morning (8:00 AM – 12:00 PM)" },
  { value: "afternoon", label: "Afternoon (12:00 PM – 4:00 PM)" },
  { value: "evening", label: "Evening (4:00 PM – 8:00 PM)" },
];

/**
 * Validates a phone number reasonably without assuming a single rigid format.
 * Permits international formats, parentheses, spaces, dots, and hyphens,
 * provided it contains between 7 and 15 digits.
 */
function isValidPhoneNumber(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  // Must only contain valid phone characters (+, digits, spaces, hyphens, periods, parentheses)
  if (!/^[+]?[\d\s().-]{7,22}$/.test(trimmed)) {
    return false;
  }
  const digitsOnly = trimmed.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function BookingRequestForm({ professional }: BookingRequestFormProps) {
  const formId = useId();

  const [formData, setFormData] = useState<FormState>({
    service: "",
    preferredDate: "",
    preferredTime: "",
    customerName: "",
    customerPhone: "",
    problemDescription: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);
  const [minDate, setMinDate] = useState<string>("");

  // Populate minimum allowed date on user interaction to comply with Next.js prerender rules
  const handleDateFocus = useCallback(() => {
    if (!minDate) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      setMinDate(`${year}-${month}-${day}`);
    }
  }, [minDate]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear field-specific error as user types
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Service selection
    if (!formData.service.trim()) {
      newErrors.service = "Please choose a service from the available list.";
    } else if (!professional.servicesOffered.includes(formData.service)) {
      newErrors.service = "Selected service is not offered by this technician.";
    }

    // 2. Preferred Date
    if (!formData.preferredDate.trim()) {
      newErrors.preferredDate = "Please select your preferred service date.";
    } else {
      // Prevent past dates
      if (minDate && formData.preferredDate < minDate) {
        newErrors.preferredDate =
          "The preferred date cannot be in the past. Please choose today or a future date.";
      }
    }

    // 3. Preferred Time
    if (!formData.preferredTime.trim()) {
      newErrors.preferredTime = "Please select a preferred time slot.";
    }

    // 4. Customer Name
    if (!formData.customerName.trim()) {
      newErrors.customerName = "Please enter your full name.";
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName =
        "Customer name must be at least 2 characters long.";
    }

    // 5. Customer Phone
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone =
        "Please enter your phone number so the provider can reach you.";
    } else if (!isValidPhoneNumber(formData.customerPhone)) {
      newErrors.customerPhone =
        "Please enter a valid phone number (e.g. 555-0123 or +1 555 012 3456).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Capture submitted state for user feedback
    // NOTE: This is a frontend prototype. We deliberately do NOT:
    // - Send data to an API
    // - Store personal info in localStorage, sessionStorage, or cookies
    // - Log personal info or phone numbers to console
    setSubmittedData({
      ...formData,
      submittedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // Reset the input fields while keeping the success confirmation active
    setFormData({
      service: "",
      preferredDate: "",
      preferredTime: "",
      customerName: "",
      customerPhone: "",
      problemDescription: "",
    });
    setErrors({});
  };

  const handleStartNewRequest = () => {
    setSubmittedData(null);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl border border-fixnear-border shadow-xs overflow-hidden">
      {/* Form Card Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-fixnear-navy to-[#1f4a6e] text-white">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-fixnear-amber">
            Frontend Prototype
          </span>
          <Badge variant="amber" size="sm" className="text-[10px]">
            Preview
          </Badge>
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight">
          Request a Booking
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-white/80 leading-relaxed">
          Request service with{" "}
          <strong className="text-white font-semibold">
            {professional.name}
          </strong>
          . No payment is collected upfront.
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {/* SUCCESS CONFIRMATION STATE */}
        {submittedData ? (
          <div
            className="space-y-5"
            role="status"
            aria-live="polite"
            id={`${formId}-success`}
          >
            {/* Success message banner */}
            <div className="p-4 rounded-xl bg-[#EAF5EE] border border-[#C6E7D0] text-fixnear-success">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-fixnear-success" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-fixnear-success leading-snug">
                    Booking Request Prepared
                  </h3>
                  <p className="text-xs sm:text-sm text-fixnear-success/90 leading-relaxed">
                    Your booking request is ready for submission. Booking
                    storage will be available when the backend is connected.
                  </p>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="p-4 rounded-xl bg-fixnear-bg border border-fixnear-border text-xs sm:text-sm space-y-2.5">
              <h4 className="font-bold text-fixnear-navy text-xs uppercase tracking-wider">
                Summary of Prepared Request
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-fixnear-muted block">Provider:</span>
                  <span className="font-semibold text-fixnear-navy">
                    {professional.name}
                  </span>
                </div>
                <div>
                  <span className="text-fixnear-muted block">Category:</span>
                  <span className="font-semibold text-fixnear-navy">
                    {professional.categoryName}
                  </span>
                </div>
                <div>
                  <span className="text-fixnear-muted block">Service Requested:</span>
                  <span className="font-semibold text-fixnear-navy">
                    {submittedData.service}
                  </span>
                </div>
                <div>
                  <span className="text-fixnear-muted block">Preferred Date:</span>
                  <span className="font-semibold text-fixnear-navy">
                    {submittedData.preferredDate}
                  </span>
                </div>
                <div>
                  <span className="text-fixnear-muted block">Preferred Time:</span>
                  <span className="font-semibold text-fixnear-navy capitalize">
                    {TIME_PREFERENCES.find(
                      (t) => t.value === submittedData.preferredTime
                    )?.label || submittedData.preferredTime}
                  </span>
                </div>
                <div>
                  <span className="text-fixnear-muted block">Customer Name:</span>
                  <span className="font-semibold text-fixnear-navy">
                    {submittedData.customerName}
                  </span>
                </div>
              </div>
              {submittedData.problemDescription && (
                <div className="pt-2 border-t border-fixnear-border/60 text-xs">
                  <span className="text-fixnear-muted block mb-0.5">
                    Job Details:
                  </span>
                  <p className="text-fixnear-text italic">
                    &ldquo;{submittedData.problemDescription}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Storage notice note */}
            <div
              className="p-3 bg-fixnear-amber-light border border-[#FAD998] rounded-lg text-xs text-[#945600] flex items-start gap-2"
              role="note"
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Notice:</strong> In this frontend prototype, your
                contact information is not transmitted over the network or saved
                in your browser&apos;s storage.
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleStartNewRequest}
              className="w-full"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Prepare Another Booking Request
            </Button>
          </div>
        ) : (
          /* ACTIVE BOOKING FORM */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
            aria-label={`Booking form for ${professional.name}`}
          >
            {/* Technician Indicator */}
            <div className="p-3 rounded-lg bg-fixnear-bg border border-fixnear-border/80 flex items-center justify-between text-xs">
              <span className="text-fixnear-muted">Booking with:</span>
              <span className="font-bold text-fixnear-navy">
                {professional.name} ({professional.categoryName})
              </span>
            </div>

            {/* 1. Service Selection */}
            <div>
              <label
                htmlFor={`${formId}-service`}
                className="block text-xs font-semibold text-fixnear-navy mb-1.5"
              >
                Service Needed <span className="text-fixnear-error">*</span>
              </label>
              <select
                id={`${formId}-service`}
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={
                  errors.service ? `${formId}-service-error` : undefined
                }
                className={`w-full h-10 px-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors cursor-pointer focus:outline-none focus:ring-2 ${
                  errors.service
                    ? "border-fixnear-error focus:ring-fixnear-error/30"
                    : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                }`}
              >
                <option value="">Select a service offered...</option>
                {professional.servicesOffered.map((serviceItem) => (
                  <option key={serviceItem} value={serviceItem}>
                    {serviceItem}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p
                  id={`${formId}-service-error`}
                  role="alert"
                  className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.service}</span>
                </p>
              )}
            </div>

            {/* 2. Preferred Date & Preferred Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Preferred Date */}
              <div>
                <label
                  htmlFor={`${formId}-date`}
                  className="block text-xs font-semibold text-fixnear-navy mb-1.5"
                >
                  Preferred Date <span className="text-fixnear-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id={`${formId}-date`}
                    name="preferredDate"
                    type="date"
                    min={minDate || undefined}
                    value={formData.preferredDate}
                    onFocus={handleDateFocus}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.preferredDate)}
                    aria-describedby={
                      errors.preferredDate
                        ? `${formId}-date-error`
                        : undefined
                    }
                    className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                      errors.preferredDate
                        ? "border-fixnear-error focus:ring-fixnear-error/30"
                        : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                    }`}
                  />
                </div>
                {errors.preferredDate && (
                  <p
                    id={`${formId}-date-error`}
                    role="alert"
                    className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.preferredDate}</span>
                  </p>
                )}
              </div>

              {/* Preferred Time Slot */}
              <div>
                <label
                  htmlFor={`${formId}-time`}
                  className="block text-xs font-semibold text-fixnear-navy mb-1.5"
                >
                  Preferred Time <span className="text-fixnear-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <Clock className="w-4 h-4" />
                  </div>
                  <select
                    id={`${formId}-time`}
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.preferredTime)}
                    aria-describedby={
                      errors.preferredTime
                        ? `${formId}-time-error`
                        : undefined
                    }
                    className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors cursor-pointer focus:outline-none focus:ring-2 ${
                      errors.preferredTime
                        ? "border-fixnear-error focus:ring-fixnear-error/30"
                        : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                    }`}
                  >
                    <option value="">Choose a time window...</option>
                    {TIME_PREFERENCES.map((pref) => (
                      <option key={pref.value} value={pref.value}>
                        {pref.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferredTime && (
                  <p
                    id={`${formId}-time-error`}
                    role="alert"
                    className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.preferredTime}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. Customer Name & Customer Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Customer Name */}
              <div>
                <label
                  htmlFor={`${formId}-name`}
                  className="block text-xs font-semibold text-fixnear-navy mb-1.5"
                >
                  Your Name <span className="text-fixnear-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id={`${formId}-name`}
                    name="customerName"
                    type="text"
                    placeholder="e.g. Jordan Smith"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.customerName)}
                    aria-describedby={
                      errors.customerName
                        ? `${formId}-name-error`
                        : undefined
                    }
                    className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                      errors.customerName
                        ? "border-fixnear-error focus:ring-fixnear-error/30"
                        : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                    }`}
                  />
                </div>
                {errors.customerName && (
                  <p
                    id={`${formId}-name-error`}
                    role="alert"
                    className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.customerName}</span>
                  </p>
                )}
              </div>

              {/* Customer Phone */}
              <div>
                <label
                  htmlFor={`${formId}-phone`}
                  className="block text-xs font-semibold text-fixnear-navy mb-1.5"
                >
                  Phone Number <span className="text-fixnear-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id={`${formId}-phone`}
                    name="customerPhone"
                    type="tel"
                    placeholder="e.g. (555) 012-3456"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(errors.customerPhone)}
                    aria-describedby={
                      errors.customerPhone
                        ? `${formId}-phone-error`
                        : undefined
                    }
                    className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                      errors.customerPhone
                        ? "border-fixnear-error focus:ring-fixnear-error/30"
                        : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p
                    id={`${formId}-phone-error`}
                    role="alert"
                    className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.customerPhone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 4. Optional Problem Description */}
            <div>
              <label
                htmlFor={`${formId}-desc`}
                className="block text-xs font-semibold text-fixnear-navy mb-1.5"
              >
                Problem Details{" "}
                <span className="text-fixnear-muted font-normal">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <textarea
                  id={`${formId}-desc`}
                  name="problemDescription"
                  rows={3}
                  value={formData.problemDescription}
                  onChange={handleInputChange}
                  placeholder="Describe what needs repair, symptoms, or any access instructions..."
                  className="w-full p-3 text-sm text-fixnear-text bg-white rounded-lg border border-fixnear-border transition-colors focus:outline-none focus:ring-2 focus:ring-fixnear-ring focus:border-fixnear-ring placeholder:text-fixnear-muted/60"
                />
              </div>
            </div>

            {/* Notice about backend connection */}
            <div className="p-3 bg-fixnear-bg rounded-lg border border-fixnear-border/60 text-[11px] text-fixnear-muted flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-fixnear-blue shrink-0 mt-0.5" />
              <span>
                FixNear connects you directly with independent technicians.
                Booking requests are scheduled without upfront card charges.
              </span>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold shadow-xs"
            >
              Request Booking
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
