import { useEffect, useState } from "react";
import api from "../../utils/api";
import type { UserDetails } from "../../utils/interfaces";
import ProfileCard from "../../components/profileCard/ProfileCard";
import { Paginator } from "primereact/paginator";
import "./Home.scss";
import { Image } from "primereact/image";
import ganesh from "../../assets/ganesh.webp";
import { useToast } from "../../components/toastProvider/ToastProvider";
import Spinner from "../../components/spinner/Spinner";
import { remainingInterest } from "../../utils/utils";
import { isAdmin, isBroker } from "../../utils/constants";

interface Props {
  filterData: UserDetails;
}
const Home = (props: Props) => {
  const { filterData } = props;
  const [matches, setMatches] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingInterests, setPendingInterests] = useState<number>(0);

  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 12;

  useEffect(() => {
    setPendingInterests(remainingInterest(filterData));
    if (filterData._id) fetchProfiles(page, filterData);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, page]);

  const fetchProfiles = async (pageNumber: number, filters: UserDetails) => {
    try {
      setIsLoading(true);
      const res = await api.post("/fetch-profiles", {
        page: pageNumber,
        limit: rowsPerPage,
        filters,
      });
      setMatches(res.data.profiles);
      // setMatches([
      //   ...res.data.profiles,
      //   ...res.data.profiles,
      //   ...res.data.profiles,
      // ]);
      setTotalRecords(res.data.totalProfiles);
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsLoading(false);
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to fetch profiles"
      );
    }
  };

  const hideUser = (id: string, isInterest?: boolean) => {
    if (isInterest) {
      setPendingInterests((prev) => prev - 1);
    }
    setMatches((prevMatches) =>
      prevMatches.filter((profile) => profile._id !== id)
    );
  };

  const onPageChange = (event: { page: number }) => {
    setPage(event.page + 1); // PrimeReact paginator pages are 0-indexed
  };

  return (
    <div className="home-cards">
      <Spinner isLoading={isLoading} />
      <div>
        {isAdmin && (
          <p className="text-center text-2xl text-orange-400">
            {" "}
            {totalRecords}
          </p>
        )}

        <div className="profile-cards">
          {matches.length > 0 ? (
            matches.map((match) => (
              <ProfileCard
                hideProfile={hideUser}
                match={match}
                key={match._id}
                remainingInterest={pendingInterests}
                currentUser={filterData}
              />
            ))
          ) : (
            <div className="no-matches">
              <h3>No Profiles Yet!</h3>
              {isBroker ? (
                <p>
                  This section displays only the profiles that have been
                  referred by you. At the moment, there are no referred profiles
                  available. Once you start referring users to the platform,
                  their profiles will appear here, allowing you to manage them
                  easily and track your earnings.
                </p>
              ) : (
                <p>
                  We've very recently launched this application, and many more
                  profiles are coming soon by <b>February end</b>. We're
                  actively onboarding users and truly appreciate your support.{" "}
                  <b>
                    Your 1-year membership will officially start from March 2026
                  </b>
                  , and until then you can continue using the platform normally
                  without any limitations.
                </p>
              )}
              <div className="mt-8">
                <Image className="ganesh" src={ganesh} />
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
  );
};

export default Home;
