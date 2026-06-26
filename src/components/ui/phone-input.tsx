import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";

type PhoneInputFieldProps = {
  id?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  className?: string;
  defaultCountry?: Country;
};

export function PhoneInputField({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  "aria-invalid": ariaInvalid,
  className,
  defaultCountry = "BR",
}: PhoneInputFieldProps) {
  return (
    <PhoneInput
      id={id}
      international
      defaultCountry={defaultCountry}
      countryCallingCodeEditable={false}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      className={cn("phone-input-field", className)}
      numberInputProps={{
        className: "phone-input-field__number",
      }}
    />
  );
}
