"use client";

import React, { useState, useId, useCallback } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Badge } from "@/components/ui";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "@/components/icons/LucideIcons";

export type UserRole = "customer" | "professional";

interface SignUpFormState {
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

interface SignUpFormErrors {
  role?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreedToTerms?: string;
}

/**
 * Validates a phone number reasonably without assuming a single rigid format.
 * Accommodates local and international numbers containing between 7 and 15 digits.
 */
function isValidPhoneNumber(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) return false;
  if (!/^[+]?[\d\s().-]{7,22}$/.test(trimmed)) {
    return false;
  }
  const digitsOnly = trimmed.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Validates standard email address format
 */
function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export default function SignUpPage() {
  const formId = useId();

  const [formData, setFormData] = useState<SignUpFormState>({
    role: "customer",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittedRole, setSubmittedRole] = useState<UserRole | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const nextValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({ ...prev, [name]: nextValue }));

      // Clear field error as user modifies it
      if (errors[name as keyof SignUpFormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setFormData((prev) => ({ ...prev, role: newRole }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: SignUpFormErrors = {};

    // 1. Role selection
    if (!formData.role || (formData.role !== "customer" && formData.role !== "professional")) {
      newErrors.role = "Please select an account role.";
    }

    // 2. Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters long.";
    }

    // 3. Email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // 4. Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 7 digits).";
    }

    // 5. Password
    if (!formData.password) {
      newErrors.password = "Please enter a password.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    // 6. Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match. Please re-enter.";
    }

    // 7. Terms agreement
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the Terms of Service and Privacy Policy to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Store submitted role to show tailored confirmation message
    // NOTE: This is a frontend prototype. We do NOT:
    // - Send data to an API
    // - Store credentials or personal info in localStorage, sessionStorage, or cookies
    // - Log passwords or phone numbers to the console
    setSubmittedRole(formData.role);

    // Reset sensitive password fields
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
    setErrors({});
  };

  const handleReset = () => {
    setSubmittedRole(null);
    setFormData({
      role: "customer",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    });
    setErrors({});
  };

  return (
    <AuthShell
      title="Create your FixNear account"
      subtitle="Join customers and local trade professionals on FixNear"
    >
      {/* ─────────────────────────────────────────────
          SUCCESS FEEDBACK STATE (HONEST PROTOTYPE MESSAGE)
          ───────────────────────────────────────────── */}
      {submittedRole ? (
        <div
          className="space-y-6"
          role="status"
          aria-live="polite"
          id={`${formId}-success`}
        >
          {/* Success banner */}
          <div className="p-5 rounded-xl bg-[#EAF5EE] border border-[#C6E7D0] text-fixnear-success">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 shrink-0 mt-0.5 text-fixnear-success" />
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-fixnear-success leading-snug">
                  Registration Form Validated
                </h2>
                <p className="text-xs sm:text-sm text-fixnear-success/90 leading-relaxed">
                  Your form is valid. Account registration will be available when
                  authentication is connected.
                </p>
              </div>
            </div>
          </div>

          {/* Role Summary Notice */}
          <div className="p-4 rounded-xl bg-fixnear-bg border border-fixnear-border text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-fixnear-muted">Selected Account Type:</span>
              <Badge variant="info" size="sm" className="capitalize font-semibold">
                {submittedRole === "customer" ? "Customer Account" : "Trade Professional"}
              </Badge>
            </div>
            <p className="text-xs text-fixnear-muted leading-relaxed">
              {submittedRole === "customer"
                ? "When connected, Customer accounts will allow you to request service bookings, view job histories, and message technicians."
                : "When connected, Professional accounts will allow you to manage service offerings, respond to booking requests, and define coverage areas."}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
              className="w-full"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Form
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="text-xs font-semibold text-fixnear-blue hover:text-fixnear-navy underline"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────
            ACTIVE REGISTRATION FORM
            ───────────────────────────────────────────── */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
          aria-label="FixNear account registration form"
        >
          {/* 1. ROLE SELECTION CARDS */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold text-fixnear-navy uppercase tracking-wider mb-2">
              Select Your Role <span className="text-fixnear-error">*</span>
            </legend>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="radiogroup"
              aria-label="Account role"
            >
              {/* Customer Option */}
              <label
                htmlFor={`${formId}-role-customer`}
                className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  formData.role === "customer"
                    ? "border-fixnear-blue bg-[#EEF6FC] ring-2 ring-fixnear-blue/20"
                    : "border-fixnear-border bg-white hover:border-[#CBD8E5] hover:bg-fixnear-bg"
                }`}
              >
                <input
                  id={`${formId}-role-customer`}
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === "customer"}
                  onChange={() => handleRoleChange("customer")}
                  className="mt-1 text-fixnear-blue focus:ring-fixnear-ring shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-fixnear-navy">
                    <User className="w-4 h-4 text-fixnear-blue" />
                    <span>Customer</span>
                  </div>
                  <p className="text-[11px] text-fixnear-muted mt-0.5 leading-snug">
                    Find and request local services for home & office
                  </p>
                </div>
              </label>

              {/* Professional Option */}
              <label
                htmlFor={`${formId}-role-pro`}
                className={`relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  formData.role === "professional"
                    ? "border-fixnear-blue bg-[#EEF6FC] ring-2 ring-fixnear-blue/20"
                    : "border-fixnear-border bg-white hover:border-[#CBD8E5] hover:bg-fixnear-bg"
                }`}
              >
                <input
                  id={`${formId}-role-pro`}
                  type="radio"
                  name="role"
                  value="professional"
                  checked={formData.role === "professional"}
                  onChange={() => handleRoleChange("professional")}
                  className="mt-1 text-fixnear-blue focus:ring-fixnear-ring shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-fixnear-navy">
                    <Briefcase className="w-4 h-4 text-fixnear-blue" />
                    <span>Professional</span>
                  </div>
                  <p className="text-[11px] text-fixnear-muted mt-0.5 leading-snug">
                    Offer services, receive requests & grow clientele
                  </p>
                </div>
              </label>
            </div>

            {errors.role && (
              <p
                role="alert"
                className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.role}</span>
              </p>
            )}
          </fieldset>

          {/* 2. FULL NAME */}
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="block text-xs font-semibold text-fixnear-navy mb-1.5"
            >
              Full Name <span className="text-fixnear-error">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id={`${formId}-name`}
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Jordan Smith"
                value={formData.fullName}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? `${formId}-name-error` : undefined}
                className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-fixnear-error focus:ring-fixnear-error/30"
                    : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                }`}
              />
            </div>
            {errors.fullName && (
              <p
                id={`${formId}-name-error`}
                role="alert"
                className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* 3. EMAIL & PHONE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor={`${formId}-email`}
                className="block text-xs font-semibold text-fixnear-navy mb-1.5"
              >
                Email Address <span className="text-fixnear-error">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                  className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-fixnear-error focus:ring-fixnear-error/30"
                      : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                  }`}
                />
              </div>
              {errors.email && (
                <p
                  id={`${formId}-email-error`}
                  role="alert"
                  className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
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
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="e.g. (555) 012-3456"
                  value={formData.phone}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
                  className={`w-full h-10 pl-9 pr-3 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-fixnear-error focus:ring-fixnear-error/30"
                      : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                  }`}
                />
              </div>
              {errors.phone && (
                <p
                  id={`${formId}-phone-error`}
                  role="alert"
                  className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* 4. PASSWORD & CONFIRM PASSWORD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                htmlFor={`${formId}-password`}
                className="block text-xs font-semibold text-fixnear-navy mb-1.5"
              >
                Password <span className="text-fixnear-error">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? `${formId}-password-error` : undefined}
                  className={`w-full h-10 pl-9 pr-9 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-fixnear-error focus:ring-fixnear-error/30"
                      : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 text-fixnear-muted hover:text-fixnear-navy p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id={`${formId}-password-error`}
                  role="alert"
                  className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor={`${formId}-confirm-password`}
                className="block text-xs font-semibold text-fixnear-navy mb-1.5"
              >
                Confirm Password <span className="text-fixnear-error">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id={`${formId}-confirm-password`}
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword ? `${formId}-confirm-password-error` : undefined
                  }
                  className={`w-full h-10 pl-9 pr-9 text-sm text-fixnear-text bg-white rounded-lg border transition-colors focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-fixnear-error focus:ring-fixnear-error/30"
                      : "border-fixnear-border focus:ring-fixnear-ring focus:border-fixnear-ring"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"
                  }
                  className="absolute right-2.5 text-fixnear-muted hover:text-fixnear-navy p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id={`${formId}-confirm-password-error`}
                  role="alert"
                  className="mt-1 text-xs text-fixnear-error font-medium flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          </div>

          {/* 5. TERMS AND CONDITIONS CHECKBOX */}
          <div>
            <label
              htmlFor={`${formId}-terms`}
              className="flex items-start gap-2.5 text-xs text-fixnear-text cursor-pointer select-none"
            >
              <input
                id={`${formId}-terms`}
                name="agreedToTerms"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                aria-invalid={Boolean(errors.agreedToTerms)}
                aria-describedby={
                  errors.agreedToTerms ? `${formId}-terms-error` : undefined
                }
                className="mt-0.5 rounded border-fixnear-border text-fixnear-blue focus:ring-fixnear-ring shrink-0"
              />
              <span className="leading-relaxed">
                I agree to the{" "}
                <span className="text-fixnear-blue font-medium underline">
                  Terms of Service
                </span>{" "}
                and acknowledge the{" "}
                <span className="text-fixnear-blue font-medium underline">
                  Privacy Policy
                </span>
                .
              </span>
            </label>
            {errors.agreedToTerms && (
              <p
                id={`${formId}-terms-error`}
                role="alert"
                className="mt-1.5 text-xs text-fixnear-error font-medium flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.agreedToTerms}</span>
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-semibold shadow-xs"
          >
            Create Account
          </Button>

          {/* LINK TO LOGIN */}
          <div className="pt-2 text-center text-xs text-fixnear-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-fixnear-blue font-semibold hover:text-fixnear-navy underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded p-0.5"
            >
              Log in
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
