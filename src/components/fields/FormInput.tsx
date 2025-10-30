import React from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";

interface Props {
    type: string;
    name: string
    placeholder: string;
    value: string | Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (e: any) => void;
    icon: string;
    isTextArea?: boolean;
}

const FormInput = (props: Props) => {
    const { type, placeholder, value, onChange, name, icon, isTextArea = false } = props
    return <div className="relative mb-4">
        {/* {Icon && <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500 ${isTextArea ? 'top-4 -translate-y-0' : ''}`} />} */}
        {isTextArea ? (
            <div className="relative mb-4 w-full max-w-sm">
                <span className="field-icon absolute left-3 top-1/8  pointer-events-none">
                    <i className="pi pi-search"> </i>
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
        ) : type === 'date' ? (<>

            <Calendar name={name} showIcon value={value as Date} onChange={onChange} placeholder="dd/mm/yyyy" dateFormat="dd/mm/yy" />
        </>) :
            (
                <IconField iconPosition="left">
                    <InputIcon className={`${icon} field-icon`}> </InputIcon>
                    <InputText type={type}
                        placeholder={placeholder}
                        value={value as string}
                        name={name}
                        onChange={onChange}
                        className="input-text"
                    />
                </IconField>
            )}
    </div >
}

export default React.memo(FormInput);