"use client";

import React, { useState, useId, useCallback } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Dialog } from "@/components/ui";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Info,
} from "@/components/icons/LucideIcons";

interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export default function LoginPage() {
  const formId = useId();

  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const nextValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({ ...prev, [name]: nextValue }));

      if (errors[name as keyof LoginFormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};

    // 1. Email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // 2. Password
    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Note: This is a frontend prototype. We do NOT:
    // - Authenticate against an API
    // - Store credentials or sessions in cookies/localStorage
    // - Log passwords to the console
    setSubmittedEmail(formData.email.trim());

    // Reset password field
    setFormData((prev) => ({
      ...prev,
      password: "",
    }));
    setErrors({});
  };

  const handleReset = () => {
    setSubmittedEmail(null);
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your FixNear service requests and appointments"
    >
      {/* ─────────────────────────────────────────────
          SUCCESS FEEDBACK STATE (HONEST PROTOTYPE MESSAGE)
          ───────────────────────────────────────────── */}
      {submittedEmail ? (
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
                  Login Credentials Validated
                </h2>
                <p className="text-xs sm:text-sm text-fixnear-success/90 leading-relaxed">
                  Your form is valid. Login will be available when authentication
                  is connected.
                </p>
              </div>
            </div>
          </div>

          {/* Prototype details notice */}
          <div className="p-4 rounded-xl bg-fixnear-bg border border-fixnear-border text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fixnear-muted">Attempted Account:</span>
              <span className="font-semibold text-fixnear-navy">{submittedEmail}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-fixnear-muted">Session Status:</span>
              <span className="text-fixnear-muted italic">Frontend prototype (no active session)</span>
            </div>
            <p className="text-[11px] text-fixnear-muted pt-2 border-t border-fixnear-border/60 leading-relaxed">
              When the backend authentication service is connected, this form will issue secure JWT tokens and establish authorized customer and technician sessions.
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleReset}
              className="w-full"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Try Another Account
            </Button>
            <div className="text-center">
              <Link
                href="/professionals"
                className="text-xs font-semibold text-fixnear-blue hover:text-fixnear-navy underline"
              >
                Browse Service Professionals
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────
            ACTIVE LOGIN FORM
            ───────────────────────────────────────────── */
        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
          aria-label="FixNear login form"
        >
          {/* 1. EMAIL ADDRESS */}
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

          {/* 2. PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={`${formId}-password`}
                className="text-xs font-semibold text-fixnear-navy"
              >
                Password <span className="text-fixnear-error">*</span>
              </label>

              {/* Forgot password trigger */}
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-xs text-fixnear-blue hover:text-fixnear-navy underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3 text-fixnear-muted pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id={`${formId}-password`}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
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

          {/* 3. REMEMBER ME CHECKBOX */}
          <div>
            <label
              htmlFor={`${formId}-remember`}
              className="flex items-center gap-2 text-xs text-fixnear-muted cursor-pointer select-none"
            >
              <input
                id={`${formId}-remember`}
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="rounded border-fixnear-border text-fixnear-blue focus:ring-fixnear-ring"
              />
              <span>Remember me on this device (prototype only)</span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-semibold shadow-xs"
          >
            Log In
          </Button>

          {/* LINK TO SIGNUP */}
          <div className="pt-2 text-center text-xs text-fixnear-muted">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-fixnear-blue font-semibold hover:text-fixnear-navy underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fixnear-ring rounded p-0.5"
            >
              Sign up
            </Link>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────
          ACCESSIBLE FORGOT PASSWORD DIALOG
          ───────────────────────────────────────────── */}
      <Dialog
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        title="Password Recovery"
        description="Password reset service information"
        size="sm"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForgotPasswordModal(false)}
          >
            Understood
          </Button>
        }
      >
        <div className="space-y-3 text-left">
          <div className="p-3 bg-fixnear-bg rounded-lg border border-fixnear-border flex items-start gap-2.5 text-xs text-fixnear-text">
            <Info className="w-4 h-4 text-fixnear-blue shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Automated password recovery emails will be integrated when the backend authentication and email delivery services are connected in the next phase.
            </p>
          </div>
          <p className="text-xs text-fixnear-muted leading-relaxed">
            During this frontend preview, please use the test credentials or create a new prototype profile on the registration screen.
          </p>
        </div>
      </Dialog>
    </AuthShell>
  );
}
