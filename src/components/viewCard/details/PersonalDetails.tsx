import { dietOptions, employedInOptions, heightOptions, nakshatraOptions, qualificationOptions, rashiOptions, residingOptions } from "../../../utils/constants"
import type { UserDetails } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"

const PersonalDetails = (props: { user: UserDetails }) => {
    const { user } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Height </div>
                <div className="value"> {fetchLabel(heightOptions, user.height)}</div>
            </div>
            <div className='container'>
                <div className="label"> Weight </div>
                <div className="value"> {user.weight ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Country </div>
                <div className="value"> {user.country ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Residing Status </div>
                <div className="value">  {fetchLabel(residingOptions, user.residingStatus)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Qualification </div>
                <div className="value"> {fetchLabel(qualificationOptions, user.qualification)}</div>
            </div>
            <div className='container'>
                <div className="label"> Address </div>
                <div className="value"> {user.address ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Employed In</div>
                <div className="value"> {fetchLabel(employedInOptions, user.employedIn)}</div>
            </div>
            <div className='container'>
                <div className="label"> Salary </div>
                <div className="value"> {user.salary ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Rashi </div>
                <div className="value"> {fetchLabel(rashiOptions, user.rashi)}</div>
            </div>
            <div className='container'>
                <div className="label"> Nakshatra </div>
                <div className="value"> {fetchLabel(nakshatraOptions, user.nakshatra)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Diet </div>
                <div className="value"> {fetchLabel(dietOptions, user.diet)}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {user.mNote ?? '-'}</div>
            </div>

        </div>
    </div>
}


export default PersonalDetails