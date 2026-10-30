import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";

export function AdminAuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light-bg">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-3"></div>
        <p className="text-sm font-medium text-brand-grey">Checking admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
}

export default AdminAuthLayout;
