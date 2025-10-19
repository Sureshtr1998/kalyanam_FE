import type { UserDetails } from "../../../utils/interfaces"
import { fetchLabel } from "../../../utils/utils"
import { familyStatus, parentStatus } from "../../../utils/constants"


const FamilyDetails = (props: { user: UserDetails }) => {
    const { user } = props

    return <div className="content-details">
        {user.elderBro && <div className="row-container">
            <div className='container'>
                <div className="label"> Elder Brothers </div>
                <div className="value"> {user.elderBro ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Elder Brothers Married </div>
                <div className="value"> {user.elderBroMar ?? '-'}</div>
            </div>

        </div>
        }

        {user.youngerBro && <div className="row-container">
            <div className='container'>
                <div className="label"> Younger Brothers </div>
                <div className="value"> {user.youngerBro ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Younger Brothers Married</div>
                <div className="value">  {user.youngerBroMar ?? '-'}</div>
            </div>

        </div>
        }

        {user.elderSis && <div className="row-container">
            <div className='container'>
                <div className="label"> Elder Sisters </div>
                <div className="value"> {user.elderSis}</div>
            </div>
            <div className='container'>
                <div className="label"> Elder Sisters Married </div>
                <div className="value"> {user.elderSisMar ?? '-'}</div>
            </div>

        </div>
        }

        {user.youngerSis &&
            <div className="row-container">
                <div className='container'>
                    <div className="label"> Younger Sisters</div>
                    <div className="value"> {user.youngerSis}</div>
                </div>
                <div className='container'>
                    <div className="label"> Younger Sisters Married </div>
                    <div className="value"> {user.youngerSisMar ?? '-'}</div>
                </div>

            </div>
        }


        <div className="row-container">
            <div className='container'>
                <div className="label"> Father's Name </div>
                <div className="value"> {user.fatherName}</div>
            </div>
            <div className='container'>
                <div className="label"> Father's Living Status </div>
                <div className="value">{fetchLabel(parentStatus, user.fatherStatus)}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Mother's Name </div>
                <div className="value"> {user.motherName ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Mother's Living Status </div>
                <div className="value"> {fetchLabel(parentStatus, user.motherStatus)}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Father's Occupation</div>
                <div className="value"> {user.fatherOccup ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Mother's Occupation </div>
                <div className="value"> {user.motherOccup ?? '-'}</div>
            </div>

        </div>
        <div className="row-container">
            <div className='container'>
                <div className="label"> Family Status </div>
                <div className="value"> {fetchLabel(familyStatus, user.familyStatus)}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {user.fNote ?? '-'}</div>
            </div>

        </div>
    </div>
}


export default FamilyDetails