import { useEffect, useState } from "react";
import api from "../../utils/api";
import type { UserDetails } from "../../utils/interfaces";
import ProfileCard from "../../components/profileCard/ProfileCard";
import { Paginator } from "primereact/paginator";
import "./Home.scss";
import { Image } from "primereact/image";
import parashuram from "../../assets/parashuram.png";
import { useToast } from "../../components/toastProvider/ToastProvider";
import Spinner from "../../components/spinner/Spinner";

interface Props {
  filterData: UserDetails;
}
const Home = (props: Props) => {
  const { filterData } = props;
  const [matches, setMatches] = useState<UserDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    if (filterData._id) fetchProfiles(page, filterData);
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

  const hideUser = (id: string) => {
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
                We've very recently launched this application. Please be patient
                many more profiles are coming soon by December end. We're
                actively bringing in users, and we truly appreciate your
                support!
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
  );
};

export default Home;
