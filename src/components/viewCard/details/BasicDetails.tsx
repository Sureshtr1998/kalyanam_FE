
import type { UserDetails } from "../../../utils/interfaces"

const BasicDetails = (props: { user: UserDetails }) => {
    const { user } = props

    return <div className="content-details">
        <div className="row-container">
            <div className='container'>
                <div className="label"> Age </div>
                <div className="value"> {user.age ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Martial Status </div>
                <div className="value"> {user.martialStatus ?? '-'}</div>
            </div>

        </div>

        <div className="row-container">
            <div className='container'>
                <div className="label"> Mother Tongue </div>
                <div className="value"> {user.motherTongue ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Date Of Birth </div>
                <div className="value">  {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}</div>
            </div>

        </div>

        {user.mobile && <div className="row-container">
            <div className='container'>
                <div className="label"> Mobile Number </div>
                <div className="value"> {user.mobile ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label">Alternate Mobile Number </div>
                <div className="value">  {user.alternateMob ?? '-'}</div>
            </div>
        </div>
        }

        <div className="row-container">
            <div className='container'>
                <div className="label"> Profile Created By </div>
                <div className="value"> {user.profileCreatedBy ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Gotra </div>
                <div className="value"> {user.gotra ?? '-'}</div>
            </div>

        </div>


        <div className="row-container">
            <div className='container'>
                <div className="label"> Sub Caste </div>
                <div className="value"> {user.subCaste ?? '-'}</div>
            </div>
            <div className='container'>
                <div className="label"> Additional Notes </div>
                <div className="value"> {user.bNote ?? '-'}</div>
            </div>

        </div>
    </div>
}

export default BasicDetails