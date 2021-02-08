import { SidebarLink } from './SidebarLink';

export const SidebarNav: React.FC = () => {
  return (
    <nav className="p-3 fixed space-y-2 w-64 h-screen bg-gray-50 border-r border-gray-100">
      <button className="py-2 px-4 w-full text-sm text-white bg-indigo-600 rounded focus:outline-none focus:ring">
        Create Project
      </button>
      <SidebarLink to="/dashboard" text="Home" icon="home" />
      <SidebarLink to="/dashboard/projects" text="Projects" icon="project" />
    </nav>
  );
};
