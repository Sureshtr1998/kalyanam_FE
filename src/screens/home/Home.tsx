import { useEffect, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import api from "../../utils/api"
import type { UserDetails } from "../../utils/interfaces"
import ProfileCard from "../../components/profileCard/ProfileCard"
import { Paginator } from "primereact/paginator"
import "./Home.scss"
import { Image } from "primereact/image"
import parashuram from "../../assets/parashuram.png"
import { useToast } from "../../components/toastProvider/ToastProvider"
import { formDefaultVals } from "../../utils/constants"
import { useNavigate } from "react-router-dom"
import Spinner from "../../components/spinner/Spinner"

const Home = () => {
    const [matches, setMatches] = useState<UserDetails[]>([])
    const [userData, setUserData] = useState<UserDetails>(formDefaultVals)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const { showToast } = useToast();
    const navigate = useNavigate();


    const [page, setPage] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const rowsPerPage = 10

    useEffect(() => {
        fetchUserProfile()
    }, [])

    useEffect(() => {
        if (userData.basic.fullName) fetchProfiles(page, userData)
    }, [page, userData])

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true)
            const res = await api.get('/my-profile')
            if (!res.data.profile?.hasCompleteProfile) {
                navigate('/profile')
            }
            setUserData(res.data.profile)
            setIsLoading(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', 'Error', err.response?.data?.msg || 'Unable to load user data');
            setIsLoading(false)
        }
    }

    const fetchProfiles = async (pageNumber: number, filters: UserDetails) => {
        try {
            setIsLoading(true)
            const res = await api.post("/fetch-profiles", {
                page: pageNumber,
                limit: rowsPerPage,
                filters,
            });
            setMatches(res.data.profiles)
            setTotalRecords(res.data.totalProfiles)
            setIsLoading(false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setIsLoading(false)
            showToast('error', 'Error', err.response?.data?.msg || 'Unable to fetch profiles');
        }
    }

    const hideUser = (id: string) => {
        setMatches((prevMatches) =>
            prevMatches.filter((profile) => profile._id !== id)
        )
    }

    const onPageChange = (event: { page: number }) => {
        setPage(event.page + 1) // PrimeReact paginator pages are 0-indexed
    }

    const applyFilter = (filterData: UserDetails) => {
        fetchProfiles(1, filterData)
        setUserData(filterData)
    }

    return (
        <div className="home-cards">
            <Topbar applyFilter={applyFilter} userData={userData} />
            <Spinner isLoading={isLoading} />
            <div className="mt-20">
                <div className="profile-cards">
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <ProfileCard
                                hideProfile={hideUser}
                                match={match}
                                key={match._id}
                            />
                        ))
                    ) : (
                        <div className="no-matches">
                            <h3>No Profiles Yet!</h3>
                            <p>
                                We've very recently launched this application. Please be patient many more profiles are coming soon by this year end.
                                We're actively bringing in users, and we truly appreciate your support!
                            </p>
                            <div className="mt-8">
                                <Image className="parashuram" src={parashuram} />
                            </div>
                        </div>
                    )}
                </div>

                {totalRecords > rowsPerPage && (
                    <div className="mt-2 flex justify-center">
                        <Paginator
                            first={(page - 1) * rowsPerPage}
                            rows={rowsPerPage}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
