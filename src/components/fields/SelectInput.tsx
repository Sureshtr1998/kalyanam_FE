import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import type { SelectType } from "../../utils/interfaces";
import { arrayLabel, normalizeToArray } from "../../utils/utils";

interface Props {
  value: string | string[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
  options: SelectType[];
  placeholder?: string;
  name: string;
  icon: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  isMultiselect?: boolean;
  filter?: boolean;
}

const SelectInput = (props: Props) => {
  const {
    value,
    onChange,
    options,
    placeholder,
    name,
    icon,
    disabled,
    label,
    required,
    isMultiselect,
    filter,
  } = props;

  return (
    <div>
      {label && (
        <p className={`input-label ${required && !disabled ? "required" : ""}`}>
          {label}
        </p>
      )}

      <div className="relative mb-4 w-full max-w-sm">
        {!(isMultiselect && disabled) && (
          <span className="field-icon absolute left-3 top-1/5 pointer-events-none">
            <i className={icon}></i>
          </span>
        )}

        {isMultiselect ? (
          disabled ? (
            <div className="text-sm">{arrayLabel(value, options)}</div>
          ) : (
            <MultiSelect
              id={name}
              name={name}
              disabled={disabled}
              value={normalizeToArray(value)}
              options={options}
              onChange={onChange}
              maxSelectedLabels={1}
              placeholder={placeholder ?? "Any"}
              className="dropdown-field"
              filter={filter}
            />
          )
        ) : (
          <Dropdown
            id={name}
            name={name}
            disabled={disabled}
            value={value as string}
            options={options}
            onChange={onChange}
            placeholder={placeholder}
            className="dropdown-field"
            filter={filter}
          />
        )}
      </div>
    </div>
  );
};

export default SelectInput;
