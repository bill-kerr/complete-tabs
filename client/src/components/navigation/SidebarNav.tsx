import { SidebarLink } from './SidebarLink';

export const SidebarNav: React.FC = () => {
  return (
    <nav className="p-3 fixed space-y-2 w-64 h-screen bg-gray-50 border-r border-gray-100">
      <SidebarLink to="/dashboard" text="Home" icon="home" />
      <SidebarLink to="/dashboard/projects" text="Projects" icon="project" />
    </nav>
  );
};
