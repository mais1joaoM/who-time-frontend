import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: Props) {

  const token =
    localStorage.getItem("token");

  /* SEM TOKEN */
  if (!token) {
    return <Navigate to="/login" />;
  }

  /* COM TOKEN */
  return children;
}

export default ProtectedRoute;