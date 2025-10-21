import { useEffect, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import api from "../../utils/api"
import type { UserDetails } from "../../utils/interfaces"
import ProfileCard from "../../components/profileCard/ProfileCard"
import "./Home.scss"
import { Image } from "primereact/image"
import parashuram from "../../assets/parashuram.png"

const Home = () => {

    const [matches, setMatches] = useState<UserDetails[]>([])
    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const res = await api.get('/fetch-profiles')
        setMatches(res.data.profiles)
    }

    const hideUser = (id: string) => {
        setMatches((prevMatches) => prevMatches.filter((profile) => profile._id !== id));
    }

    return <div>

        <Topbar />
        <div className="mt-20">
            <div className="profile-cards">
                {matches.length > 0 ?
                    matches.map((match) => (
                        <ProfileCard hideProfile={hideUser} match={match} key={match._id} />
                    )) : <div className="no-matches">
                        <h3>No Profiles Yet!</h3>
                        <p>
                            We've very recently launched this application. Please be patient many more profiles are coming soon by this year end.
                            We're actively bringing in users, and we truly appreciate your support!
                        </p>
                        <div className="mt-8">
                            <Image className="parashuram" src={parashuram} />
                        </div>
                    </div>}
            </div>
        </div>
    </div>
}

export default Home