
import { qualificationOptions } from "../../../utils/constants"
import type { UserDetails } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"

const PartnerPreferences = (props: { user: UserDetails }) => {
    const { user } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Age From </div>
                <div className="value"> {user.ageFrom ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Age To </div>
                <div className="value"> {user.ageTo ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Height From </div>
                <div className="value"> {user.heightFrom ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Height To </div>
                <div className="value"> {user.heightTo ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Sub Caste</div>
                <div className="value"> {user.pSubCaste ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Employed In </div>
                <div className="value"> {user.pEmployedIn ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Qualifications </div>
                <div className="value"> {user.pQualification ? user.pQualification[0]?.split(',').map(q => fetchLabel(qualificationOptions, q)).join(', ') : '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Country </div>
                <div className="value"> {user.pCountry ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Martial Status </div>
                <div className="value"> {user.pMartialStatus ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {user.pNote ?? '-'}</div>
            </div>

        </div>


    </div>
}

export default PartnerPreferences