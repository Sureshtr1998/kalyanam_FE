
import { qualificationOptions } from "../../../utils/constants"
import type { BasicDetailsIn } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"

const BasicDetails = (props: { basic: BasicDetailsIn }) => {
    const { basic } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Age </div>
                <div className="value"> {basic.age ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Martial Status </div>
                <div className="value"> {basic.martialStatus ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Mother Tongue </div>
                <div className="value"> {basic.motherTongue ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Date Of Birth </div>
                <div className="value">  {basic.dob ? new Date(basic.dob).toLocaleDateString() : "-"}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Qualifications </div>
                <div className="value"> {fetchLabel(qualificationOptions, basic.qualification)}</div>
            </div>
            <div className='container'>
                <div className="label"> Profile ID </div>
                <div className="value"> {basic.uniqueId ?? '-'}</div>
            </div>

        </div>

        {basic.mobile && <div className="row-container">
            <div className='container'>
                <div className="label"> Mobile Number </div>
                <div className="value"> {basic.mobile ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label">Alternate Contact </div>
                <div className="value">  {basic.alternateMob ?? '-'}</div>
            </div>
        </div>
        }

        <div className="row-container">
            <div className='container'>
                <div className="label"> Profile Created By </div>
                <div className="value"> {basic.profileCreatedBy ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Gothra </div>
                <div className="value"> {basic.gothra ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Sub Caste </div>
                <div className="value"> {basic.subCaste ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {basic.note ?? '-'}</div>
            </div>

        </div>
    </div>
}

export default BasicDetails