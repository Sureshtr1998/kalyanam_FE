import { useEffect, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import api from "../../utils/api"
import type { UserDetails } from "../../utils/interfaces"
import ProfileCard from "../../components/profileCard/ProfileCard"
import "./Home.scss"

const Home = () => {

    const [matches, setMatches] = useState<UserDetails[]>([])
    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        const res = await api.get('/fetch-profiles')
        setMatches(res.data.profiles)
    }

    return <div>

        <Topbar />
        <div className="mt-20">
            <div className="profile-cards">
                {matches.map((match) => (
                    <ProfileCard match={match} key={match._id} />
                ))}
            </div>
        </div>
    </div>
}

export default Home