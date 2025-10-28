import { dietOptions, employedInOptions, heightOptions, nakshatraOptions, rashiOptions, residingOptions } from "../../../utils/constants"
import type { PersonalDetailsIn } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"

const PersonalDetails = (props: { personal: PersonalDetailsIn }) => {
    const { personal } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Height </div>
                <div className="value"> {fetchLabel(heightOptions, personal.height)}</div>
            </div>
            <div className='container'>
                <div className="label"> Weight </div>
                <div className="value"> {personal.weight ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Country </div>
                <div className="value"> {personal.country ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Residing Status </div>
                <div className="value">  {fetchLabel(residingOptions, personal.residingStatus)}</div>
            </div>

        </div>

        <div className="row-container">

            <div className='container'>
                <div className="label"> Address </div>
                <div className="value"> {personal.address ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Work City </div>
                <div className="value"> {personal.workCity ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Employed In</div>
                <div className="value"> {fetchLabel(employedInOptions, personal.employedIn)}</div>
            </div>
            <div className='container'>
                <div className="label"> Salary </div>
                <div className="value"> {personal.salary ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Rashi </div>
                <div className="value"> {fetchLabel(rashiOptions, personal.rashi)}</div>
            </div>
            <div className='container'>
                <div className="label"> Nakshatra </div>
                <div className="value"> {fetchLabel(nakshatraOptions, personal.nakshatra)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Diet </div>
                <div className="value"> {fetchLabel(dietOptions, personal.diet)}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {personal.note ?? '-'}</div>
            </div>

        </div>
    </div>
}


export default PersonalDetails