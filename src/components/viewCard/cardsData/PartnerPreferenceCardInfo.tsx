
import { countryOptions, employedInOptions, maritalOptions, qualificationOptions, subCasteOptions } from "../../../utils/constants"
import type { PartnerDetailsIn } from "../../../utils/interfaces"
import { arrayLabel } from "../../../utils/utils"

const PartnerPreferences = (props: { partner: PartnerDetailsIn }) => {
    const { partner } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Age From </div>
                <div className="value"> {partner.ageFrom ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Age To </div>
                <div className="value"> {partner.ageTo ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Height From </div>
                <div className="value"> {partner.heightFrom ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Height To </div>
                <div className="value"> {partner.heightTo ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Sub Caste</div>
                <div className="value"> {arrayLabel(partner.subCaste, subCasteOptions)}</div>
            </div>
            <div className='container'>
                <div className="label"> Employed In </div>
                <div className="value"> {arrayLabel(partner.employedIn, employedInOptions)}</div>
            </div>

        </div>

        <div className="row-container">

            <div className='container'>
                <div className="label"> Qualification </div>
                <div className="value"> {arrayLabel(partner.qualification, qualificationOptions)}</div>
            </div>
            <div className='container'>
                <div className="label"> Country </div>
                <div className="value"> {arrayLabel(partner.country, countryOptions)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Martial Status </div>
                <div className="value"> {arrayLabel(partner.martialStatus, maritalOptions)}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {partner.note ?? '-'}</div>
            </div>

        </div>


    </div>
}

export default PartnerPreferences