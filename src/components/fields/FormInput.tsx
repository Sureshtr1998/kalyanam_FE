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
  suffix?: string;
  showTime?: boolean;
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
    suffix,
    showTime = false,
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDisabledPill = (value: any) => {
    if (!value) {
      return <span className="pill">-</span>;
    }

    return (
      <span className="pill">
        {type === "date"
          ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", "-")
          : typeof value === "string"
          ? value
          : String(value)}
      </span>
    );
  };

  if (disabled) {
    return (
      <div className="relative mb-4 field-row">
        {label && <p className="field-label mr-4 mt-1">{label}</p>}
        <div className="pill-container">{renderDisabledPill(value)}</div>
      </div>
    );
  }
  return (
    <div className="relative mb-4">
      {label && (
        <p className={`input-label ${required ? "required" : ""}`}>{label}</p>
      )}

      {isTextArea ? (
        <div className="relative mb-4 w-full">
          <span className="field-icon absolute left-3 top-1/8 pointer-events-none">
            <i className={icon}></i>
          </span>
          <InputTextarea
            placeholder={placeholder}
            value={value as string}
            onChange={onChange}
            rows={3}
            name={name}
            className="input-text"
          />
        </div>
      ) : type === "date" ? (
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
          placeholder={placeholder ?? "dd/mm/yyyy"}
          dateFormat="dd/mm/yy"
          maxDate={maxDOB}
          showTime={showTime}
          hourFormat="12"
        />
      ) : (
        <>
          <IconField iconPosition="left">
            <InputIcon className={`${icon} field-icon`} />
            <InputText
              type={type}
              placeholder={placeholder}
              value={value as string}
              name={name}
              onChange={(e) => {
                let val = e.target.value;
                if (type === "email") val = val.toLowerCase();
                if (!maxLength || val.length <= maxLength) {
                  onChange?.({
                    target: { name, value: val },
                  });
                }
              }}
              maxLength={maxLength}
              className="input-text"
            />
          </IconField>
          {suffix && <span className="input-suffix">{suffix}</span>}
        </>
      )}
    </div>
  );
};

export default React.memo(FormInput);
