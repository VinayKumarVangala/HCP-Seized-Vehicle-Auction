/**
 * SVAMS — Input Components
 * Input, Select, Textarea, Checkbox, RadioGroup, Field wrapper
 */

import type { ChangeEvent, FocusEvent, ReactNode } from "react"

export interface FieldProps {
  label?: string
  error?: string
  helper?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export const Field = ({
  label,
  error,
  helper,
  required,
  className,
  children,
}: FieldProps) => (
  <div className={`mb-4 ${className ?? ""}`}>
    {label && (
      <label className="block text-sm font-medium text-police-text mb-1">
        {label} {required && <span className="text-police-danger ml-1">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-police-danger">{error}</p>}
    {helper && !error && (
      <p className="mt-1 text-xs text-police-muted">{helper}</p>
    )}
  </div>
)

export interface InputProps {
  id?: string
  label?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  name?: string
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  className?: string
}

export const Input = ({
  id,
  label,
  value,
  defaultValue,
  placeholder,
  type = "text",
  name,
  error,
  helper,
  required,
  disabled,
  leftIcon,
  rightIcon,
  onChange,
  onBlur,
  className,
}: InputProps) => (
  <Field
    label={label}
    error={error}
    helper={helper}
    required={required}
    className={className}
  >
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-police-muted">
          {leftIcon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={`police-input pl-10 pr-3 ${rightIcon ? "pr-10" : ""} ${
          error ? "border-police-danger focus:ring-police-danger" : ""
        } ${className ?? ""}`}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-police-muted">
          {rightIcon}
        </div>
      )}
    </div>
  </Field>
)

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  id?: string
  label?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  name?: string
  options: SelectOption[]
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  className?: string
}

export const Select = ({
  id,
  label,
  value,
  defaultValue,
  placeholder,
  name,
  options,
  error,
  helper,
  required,
  disabled,
  onChange,
  className,
}: SelectProps) => (
  <Field
    label={label}
    error={error}
    helper={helper}
    required={required}
    className={className}
  >
    <select
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChange}
      className={`police-input ${
        error ? "border-police-danger focus:ring-police-danger" : ""
      } ${className ?? ""}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </Field>
)

export interface TextareaProps {
  id?: string
  label?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  name?: string
  rows?: number
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
}

export const Textarea = ({
  id,
  label,
  value,
  defaultValue,
  placeholder,
  name,
  rows = 4,
  error,
  helper,
  required,
  disabled,
  onChange,
  className,
}: TextareaProps) => (
  <Field
    label={label}
    error={error}
    helper={helper}
    required={required}
    className={className}
  >
    <textarea
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      onChange={onChange}
      className={`police-input min-h-[100px] resize-y ${
        error ? "border-police-danger focus:ring-police-danger" : ""
      } ${className ?? ""}`}
    />
  </Field>
)

export interface CheckboxProps {
  id?: string
  label?: string
  checked?: boolean
  defaultChecked?: boolean
  name?: string
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const Checkbox = ({
  id,
  label,
  checked,
  defaultChecked,
  name,
  error,
  helper,
  required,
  disabled,
  onChange,
  className,
}: CheckboxProps) => (
  <Field
    label={label}
    error={error}
    helper={helper}
    required={required}
    className={className}
  >
    <div className="flex items-start gap-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        className={`mt-0.5 rounded border-police-border text-police-green focus:ring-police-green ${
          error ? "border-police-danger" : ""
        }`}
      />
      {label && (
        <label className="text-sm text-police-text" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  </Field>
)

export interface RadioOption {
  value: string
  label: string
}

export interface RadioGroupProps {
  id?: string
  label?: string
  name: string
  value?: string
  defaultValue?: string
  options: RadioOption[]
  error?: string
  helper?: string
  required?: boolean
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export const RadioGroup = ({
  id,
  label,
  name,
  value,
  defaultValue,
  options,
  error,
  helper,
  required,
  disabled,
  onChange,
  className,
}: RadioGroupProps) => (
  <Field
    label={label}
    error={error}
    helper={helper}
    required={required}
    className={className}
  >
    <div className="space-y-2">
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2">
          <input
            id={`${id ?? name}-${opt.value}`}
            name={name}
            type="radio"
            value={opt.value}
            checked={value === opt.value}
            defaultChecked={defaultValue === opt.value}
            disabled={disabled}
            onChange={onChange}
            className={`rounded border-police-border text-police-green focus:ring-police-green ${
              error ? "border-police-danger" : ""
            }`}
          />
          <label
            className="text-sm text-police-text"
            htmlFor={`${id ?? name}-${opt.value}`}
          >
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  </Field>
)
