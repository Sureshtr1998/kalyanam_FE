import { Button } from "primereact/button"

const AccountSettings = () => {

    return <div>

        <div className="flex flex-column align-items-center gap-3 w-full">
            <Button
                label="Delete Account"
                className="p-button-danger w-full"
            />
            <Button
                label="Hide Profile"
                className="p-button-secondary w-full"
            />
        </div>
        <p> Many More Yet to come like Transaction history, subscriptions, payments part</p>
    </div>

}


export default AccountSettings