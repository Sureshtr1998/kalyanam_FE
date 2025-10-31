import React, { type ReactNode } from "react";
import Topbar from "../topbar/Topbar";
import "./Wrapper.scss";
import type { UserDetails } from "../../utils/interfaces";
import Footer from "../footer/Footer";

interface WrapperProps {
  children: ReactNode;
  applyFilter?: (filterData: UserDetails) => void;
  userData?: UserDetails;
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  applyFilter,
  userData,
}) => {
  return (
    <div>
      <Topbar applyFilter={applyFilter} userData={userData} />
      <div className="wrapper-comp">
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Wrapper;
