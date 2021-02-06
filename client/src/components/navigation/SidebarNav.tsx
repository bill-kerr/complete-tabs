import { IconBriefcase } from '../svg/icons';
import { SidebarLink } from './SidebarLink';

export const SidebarNav: React.FC = () => {
  return (
    <nav className="p-3 fixed space-y-2 w-64 h-screen bg-gray-50 border-r border-gray-100">
      <div className="py-2 px-4 mb-6 flex items-center">
        <IconBriefcase className="h-6 w-6 flex-shrink-0 text-gray-600" />
        <span className="ml-2 font-bold truncate text-gray-700">
          Organization Name this is quite long so it should truncate
        </span>
      </div>
      <SidebarLink to="/dashboard" text="Home" icon="home" />
      <SidebarLink to="/dashboard/projects" text="Projects" icon="project" />
    </nav>
  );
};
