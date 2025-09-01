    import { useContext } from "react";
    import { Navigate } from "react-router-dom";
    import { AuthContext } from "../context/AuthContext";

    type ProtectedRouteProps = {
    children: JSX.Element;
    clearance?: string; // e.g., "Tier1", "Tier2", "Tier3"
    };

    export default function ProtectedRoute({ children, clearance }: ProtectedRouteProps) {
    const auth = useContext(AuthContext);

    if (!auth || !auth.user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    // Clearance check
    if (clearance && auth.user.clearance !== clearance) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
    }
