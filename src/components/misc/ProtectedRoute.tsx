import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "@/lib/session";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  if (!isLoggedIn()) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
