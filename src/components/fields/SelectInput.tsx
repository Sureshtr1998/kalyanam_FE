import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import type { SelectType } from "../../utils/interfaces";
import { arrayLabel, normalizeToArray } from "../../utils/utils";

interface Props {
  value: string | string[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (e: any) => void;
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

  if (disabled) {
    return (
      <div className="relative field-row mb-4 w-full ">
        {label && <p className={`field-label  mr-4 mt-1 `}>{label}</p>}
        <div className="pill-container">
          {arrayLabel(value, options).length ? (
            arrayLabel(value, options).map((label, idx) => (
              <span key={idx} className="pill">
                {label}
              </span>
            ))
          ) : (
            <span className="pill">-</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <p className={`input-label ${required ? "required" : ""}`}>{label}</p>
      )}
      <div className="relative mb-4 w-full max-w-sm">
        <span className="field-icon absolute left-3 top-1/5 pointer-events-none">
          <i className={icon}></i>
        </span>
        {isMultiselect ? (
          <MultiSelect
            id={name}
            name={name}
            value={normalizeToArray(value)}
            options={options}
            onChange={onChange}
            maxSelectedLabels={1}
            placeholder={placeholder ?? "Any"}
            className="dropdown-field"
            filter={filter}
          />
        ) : (
          <Dropdown
            id={name}
            name={name}
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
