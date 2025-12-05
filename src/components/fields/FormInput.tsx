import React from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { dateFormat } from "../../utils/utils";

type Type = "text" | "number" | "date" | "password" | "email" | "tel";
interface Props {
  type?: Type;
  name: string;
  placeholder?: string;
  value: string | Date | undefined | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: any) => void;
  icon: string;
  isTextArea?: boolean;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  maxLength?: number;
  maxDOB?: Date;
}

const FormInput = (props: Props) => {
  const {
    type = "string",
    placeholder,
    value,
    onChange,
    name,
    icon,
    isTextArea = false,
    disabled = false,
    label,
    required,
    maxLength,
    maxDOB,
  } = props;

  return (
    <div className="relative mb-4">
      {label && (
        <p className={`input-label ${required && !disabled ? "required" : ""}`}>
          {label}
        </p>
      )}

      {/* {Icon && <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500 ${isTextArea ? 'top-4 -translate-y-0' : ''}`} />} */}
      {isTextArea ? (
        <div className="relative mb-4 w-full max-w-sm">
          <span className="field-icon absolute left-3 top-1/8  pointer-events-none">
            <i className={icon}> </i>
          </span>
          <InputTextarea
            placeholder={placeholder}
            value={value as string}
            onChange={onChange}
            rows={3}
            disabled={disabled}
            name={name}
            className="input-text"
          />
        </div>
      ) : type === "date" ? (
        <>
          <Calendar
            name={name}
            showIcon
            value={value ? new Date(value) : null}
            onChange={(e) => {
              onChange?.({
                target: {
                  name,
                  value: dateFormat(e.target.value as Date),
                },
              });
            }}
            disabled={disabled}
            placeholder={placeholder ?? "dd/mm/yyyy"}
            dateFormat="dd/mm/yy"
            maxDate={maxDOB}
          />
        </>
      ) : (
        <IconField iconPosition="left">
          <InputIcon className={`${icon} field-icon`}> </InputIcon>
          <InputText
            onWheel={(e) => e.currentTarget.blur()} // temporarily remove focus to prevent scroll change
            type={type}
            placeholder={placeholder}
            value={value as string}
            name={name}
            disabled={disabled}
            onChange={(e) => {
              if (!maxLength || e.target.value.length <= maxLength) {
                onChange?.(e); // only call if within limit or no limit
              }
            }}
            maxLength={maxLength}
            className="input-text"
          />
        </IconField>
      )}
    </div>
  );
};

export default React.memo(FormInput);
