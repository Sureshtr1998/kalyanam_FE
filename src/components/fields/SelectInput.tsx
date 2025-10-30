import { Dropdown } from "primereact/dropdown";
import type { SelectType } from "../../utils/interfaces";

interface Props {
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (e: any) => void;
    options: SelectType[];
    placeholder: string;
    name: string;
    icon: string
}

const SelectInput = (props: Props) => {
    const { value, onChange, options, placeholder, name, icon } = props;

    return (
        <div className="relative mb-4 w-full max-w-sm">
            <span className="field-icon absolute left-3 top-1/5  pointer-events-none">
                <i className={icon}> </i>
            </span>

            <Dropdown
                id={name}
                name={name}
                value={value}
                options={options}
                onChange={onChange}
                placeholder={placeholder}
                className="dropdown-field"
            />
        </div>
    );
};

export default SelectInput;
