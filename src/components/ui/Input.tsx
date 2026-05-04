interface InputProps {
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputMode?: "text" | "numeric" | "email" | "tel" | "url";
  pattern?: string;
  disabled?: boolean;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  inputMode,
  pattern,
  disabled,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      inputMode={inputMode}
      pattern={pattern}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
}