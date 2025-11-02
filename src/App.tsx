import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import Invitations from "./screens/invitations/Invitations";
import Profile from "./screens/profile/Profile";
import Settings from "./screens/settings/Settings";
import { ToastProvider } from "./components/toastProvider/ToastProvider";
import Lander from "./screens/lander/Lander";
import Wrapper from "./components/wrapper/Wrapper";
import { useState } from "react";
import { formDefaultVals } from "./utils/constants";
import type { UserDetails } from "./utils/interfaces";

const AppContent = () => {
  const [filterData, setFilterData] = useState<UserDetails>(formDefaultVals);

  return (
    <>
      <ToastProvider>
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Lander />} />
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
                  <Invitations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Wrapper>
                    <Settings />
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
