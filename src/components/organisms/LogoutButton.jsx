import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";

const LogoutButton = () => {
  const { logout } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
      className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-200"
      aria-label="Logout"
    >
      <ApperIcon name="LogOut" size={18} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;