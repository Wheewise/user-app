"use client";

import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { EyeIcon, EyeOffIcon, LockIcon } from "@wheewise/ui";

// The rest of the site uses @wheewise/ui's Field/Input. These stay a
// separate, local set rather than reusing that primitive directly because
// they add an icon slot and a password show/hide toggle that Input
// doesn't have — but they're styled off the exact same light-theme tokens,
// not a different look.
export function AuthField({
  label,
  name,
  action,
  errors,
  children,
}: {
  label: string;
  name: string;
  action?: ReactNode;
  errors?: string[];
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {action}
      </div>
      {children}
      {errors?.length ? <p className="text-xs text-danger">{errors[0]}</p> : null}
    </div>
  );
}

export function AuthInput({
  icon: Icon,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: (props: { className?: string }) => ReactNode }) {
  return (
    <div className="relative">
      {Icon ? (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <input
        {...props}
        className={`block w-full rounded-md border border-border-default bg-background py-2.5 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          Icon ? "pl-9" : "pl-3.5"
        } pr-3.5 ${className}`}
      />
    </div>
  );
}

// Password field with its own show/hide toggle — pulled out of AuthInput
// since it needs local state, unlike the plain icon-prefixed inputs.
export function AuthPasswordInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">
        <LockIcon className="h-4 w-4" />
      </span>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`block w-full rounded-md border border-border-default bg-background py-2.5 pr-10 pl-9 text-sm text-foreground shadow-xs outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
      >
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

// Full-width rounded-pill primary action, matching the reference design —
// the rest of the site's Button (@wheewise/ui) is a squared-corner rounded-md
// shape, deliberately not reused here for the same reason AuthInput isn't.
export function AuthButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
