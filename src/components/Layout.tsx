import { NavLink, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

function Layout() {
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);

  const base = "rounded px-3 py-1.5 text-sm";
  const activeLink = `${base} bg-blue-600 font-semibold text-white`;
  const idleLink = `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300`;
  const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? activeLink : idleLink);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <span className="mr-4 font-bold text-gray-900 dark:text-white">Submission Tracker</span>
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/courses" className={linkClass}>Courses</NavLink>
          <NavLink to="/submissions" className={linkClass}>Submissions</NavLink>
          {userName === null ? (
            <NavLink to="/login" className={linkClass}>Login</NavLink>
          ) : (
            <button onClick={logout} className="rounded px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
              Logout ({userName})
            </button>
          )}
          <button onClick={toggleDarkMode} className="ml-auto rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
