import React, { type ReactNode } from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";

interface WrapperProps {
  children: ReactNode;
}

const PublicWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div>
      <PublicHeader />
      <div className="wrapper-comp">
        <main>{children}</main>
      </div>
      <PublicFooter />
    </div>
  );
};

export default PublicWrapper;
