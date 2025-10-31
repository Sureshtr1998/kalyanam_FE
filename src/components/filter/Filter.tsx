import { useEffect, useState } from "react";
import PartnerPreferences from "../../screens/profile/details/PartnerPreferences";
import "./Filter.scss";
import { formDefaultVals } from "../../utils/constants";
import type { UserDetails } from "../../utils/interfaces";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

interface Props {
  userData: UserDetails;
  onHide: () => void;
  applyFilter?: (filterData: UserDetails) => void;
}
const Filter = (props: Props) => {
  const { userData, applyFilter, onHide } = props;
  const [filterData, setFilterData] = useState<UserDetails>(formDefaultVals);

  useEffect(() => {
    setFilterData(userData);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilterData({
      ...filterData,
      partner: {
        ...filterData["partner"],
        [name]: value,
      },
    });
  };

  const onClick = () => {
    applyFilter?.(filterData);
    onHide();
  };

  return (
    <div className="filter-preferences">
      {filterData.partner && (
        <PartnerPreferences
          isFilter
          partnerData={filterData.partner}
          handleChange={handleChange}
        />
      )}

      <Button onClick={onClick} className="apply-btn" rounded>
        Apply
      </Button>
      <p className="mt-4" style={{ fontSize: "0.9rem", color: "#555" }}>
        <strong>Note:</strong> Data comes from{" "}
        <Link
          to="/profile"
          style={{ textDecoration: "underline", color: "#007bff" }}>
          Partner Preferences
        </Link>
        . Update there to change them.
      </p>
    </div>
  );
};

export default Filter;
