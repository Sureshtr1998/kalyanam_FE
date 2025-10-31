import "./App.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/home/Home";
import ProtectedRoute from "./components/misc/ProtectedRoute";
import Invitations from "./screens/invitations/Invitations";
import Profile from "./screens/profile/Profile";
import Settings from "./screens/settings/Settings";
import { ToastProvider } from "./components/toastProvider/ToastProvider";
import Lander from "./screens/lander/Lander";

const AppContent = () => {
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
                  <Home />
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
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
