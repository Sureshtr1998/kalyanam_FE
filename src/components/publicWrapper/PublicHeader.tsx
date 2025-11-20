import { useLocation, useNavigate } from "react-router-dom";
import { ACCENT_COLOR, BORDER_COLOR, TEXT_COLOR } from "../../styles/variables";
import { Button } from "primereact/button";
import { usePWA } from "../misc/usePWA";

const PublicHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { showInstallButton, handleInstallClick, updateAvailable, reloadApp } =
    usePWA();

  return (
    <div className={`bg-white shadow-sm border-b ${BORDER_COLOR} w-full z-10`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0  flex items-center">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="cursor-pointer hidden md:block">
              <i
                className="pi pi-heart text-amber-600"
                style={{ fontSize: "1.5rem" }}
              />
              <span className="ml-3 text-2xl font-bold text-amber-900">
                Seetha Rama Kalyana
              </span>
            </div>
          </div>
          <div className="ml-10 flex items-baseline space-x-4">
            {showInstallButton && (
              <Button
                icon="pi pi-download"
                label="Install App"
                onClick={handleInstallClick}
                className="p-2 normal-btn"
              />
            )}
            {updateAvailable && (
              <div
                className={`fixed bottom-4 right-4 ${ACCENT_COLOR} text-white px-4 py-2 rounded shadow-lg flex items-center space-x-2 z-50`}>
                <span>New version available!</span>
                <button
                  onClick={reloadApp}
                  className="underline font-semibold hover:text-gray-200">
                  Update
                </button>
              </div>
            )}
            {location.pathname === "/about-us" ? (
              <a
                onClick={() => {
                  navigate("/");
                }}
                className={`${TEXT_COLOR} cursor-pointer hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium`}>
                Home
              </a>
            ) : (
              <a
                onClick={() => {
                  navigate("/about-us");
                }}
                className={`${TEXT_COLOR} cursor-pointer hover:text-amber-600 px-3 py-2 rounded-md text-sm font-medium`}>
                About Us
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PublicHeader;
