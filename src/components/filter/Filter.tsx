import { useEffect, useState } from "react"
import PartnerPreferences from "../../screens/profile/details/PartnerPreferences"
import "./Filter.scss"
import { formDefaultVals } from "../../utils/constants"
import type { UserDetails } from "../../utils/interfaces"
import { Button } from "primereact/button"

interface Props {
    userData: UserDetails
    onHide: () => void
    applyFilter?: (filterData: UserDetails) => void
}
const Filter = (props: Props) => {
    const { userData, applyFilter, onHide } = props
    const [filterData, setFilterData] = useState<UserDetails>(formDefaultVals)


    useEffect(() => {
        setFilterData(userData)
    }, [])


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        setFilterData({ ...filterData, [e.target.name]: e.target.value });
    };

    const onClick = () => {
        applyFilter?.(filterData)
        onHide()
    }

    return <div className="filter-preferences">
        <PartnerPreferences isFilter userData={filterData} handleChange={handleChange} />
        <Button onClick={onClick} className="apply-btn" rounded>Apply</Button>
    </div>
}

export default Filter