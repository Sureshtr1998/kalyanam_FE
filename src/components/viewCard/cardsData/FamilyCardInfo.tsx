import type { FamilyDetailsIn } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"
import { familyStatus, parentStatus } from "../../../utils/constants"


const FamilyDetails = (props: { family: FamilyDetailsIn }) => {
    const { family } = props

    return <div className="content-details">
        {family.elderBro && <div className="row-container">
            <div className='container'>
                <div className="label"> Elder Brothers </div>
                <div className="value"> {family.elderBro ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Elder Brothers Married </div>
                <div className="value"> {family.elderBroMar ?? '-'}</div>
            </div>

        </div>
        }

        {family.youngerBro && <div className="row-container">
            <div className='container'>
                <div className="label"> Younger Brothers </div>
                <div className="value"> {family.youngerBro ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Younger Brothers Married</div>
                <div className="value">  {family.youngerBroMar ?? '-'}</div>
            </div>

        </div>
        }

        {family.elderSis && <div className="row-container">
            <div className='container'>
                <div className="label"> Elder Sisters </div>
                <div className="value"> {family.elderSis}</div>
            </div>
            <div className='container'>
                <div className="label"> Elder Sisters Married </div>
                <div className="value"> {family.elderSisMar ?? '-'}</div>
            </div>

        </div>
        }

        {family.youngerSis &&
            <div className="row-container">
                <div className='container'>
                    <div className="label"> Younger Sisters</div>
                    <div className="value"> {family.youngerSis}</div>
                </div>
                <div className='container'>
                    <div className="label"> Younger Sisters Married </div>
                    <div className="value"> {family.youngerSisMar ?? '-'}</div>
                </div>

            </div>
        }


        <div className="row-container">
            <div className='container'>
                <div className="label"> Father's Name </div>
                <div className="value"> {family.fatherName}</div>
            </div>
            <div className='container'>
                <div className="label"> Father's Living Status </div>
                <div className="value">{fetchLabel(parentStatus, family.fatherStatus)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Mother's Name </div>
                <div className="value"> {family.motherName ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Mother's Living Status </div>
                <div className="value"> {fetchLabel(parentStatus, family.motherStatus)}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Father's Occupation</div>
                <div className="value"> {family.fatherOccup ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Mother's Occupation </div>
                <div className="value"> {family.motherOccup ?? '-'}</div>
            </div>

        </div>
        <div className="row-container">
            <div className='container'>
                <div className="label"> Family Status </div>
                <div className="value"> {fetchLabel(familyStatus, family.familyStatus)}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {family.note ?? '-'}</div>
            </div>

        </div>
    </div>
}


export default FamilyDetails