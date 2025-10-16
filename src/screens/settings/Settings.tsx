import { Button } from "primereact/button"
import Topbar from "../../components/topbar/Topbar"

const Settings = () => {

    return <div>
        <Topbar />
        <div className=" mt-32 ml-8">
            <div className="flex  flex-column align-items-center gap-3">
                <Button
                    label="Delete Account"
                    className="p-button-danger"
                />
                <Button
                    label="Hide Profile"
                    className="p-button-secondary"
                />
            </div>
            <p> Many More Yet to come like Transaction history, subscriptions, payments part</p>
        </div>
    </div>

}


export default Settings