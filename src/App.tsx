import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import Invitations from "./screens/invitations/Invitations";
import Profile from "./screens/profile/Profile";
import Accounts from "./screens/accounts/Accounts";
import { ToastProvider } from "./components/toastProvider/ToastProvider";
import Lander from "./screens/lander/Lander";
import Wrapper from "./components/wrapper/Wrapper";
import { useState } from "react";
import { formDefaultVals } from "./utils/constants";
import type { UserDetails } from "./utils/interfaces";
import { HelmetProvider } from "react-helmet-async";
import HiddenProfiles from "./screens/hiddenProfiles/HiddenProfiles";

const AppContent = () => {
  const [filterData, setFilterData] = useState<UserDetails>(formDefaultVals);

  return (
    <>
      <ToastProvider>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <HelmetProvider>
                  <Lander />
                </HelmetProvider>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Wrapper applyFilter={setFilterData}>
                    <Home filterData={filterData} />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invitations"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Invitations />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/hidden"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <HiddenProfiles />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Accounts />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Profile />
                  </Wrapper>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ToastProvider>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
