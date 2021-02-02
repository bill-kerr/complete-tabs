import { useMemo } from 'react';
import { useIsActivePath } from '../../hooks/useIsActivePath';
import { Link, LinkProps } from '../routing/Link';
import { IconHome, IconOfficeBuilding } from '../svg/icons';

type IconType = 'home' | 'project';

interface SidebarLinkProps extends LinkProps {
  icon: IconType;
  text: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, text, ...props }) => {
  const isActive = useIsActivePath(props.to.toString());
  const renderedIcon = useMemo(() => getIcon(icon, isActive), [icon, isActive]);

  return (
    <Link
      exact
      activeClassName="bg-indigo-50"
      className="py-2 px-4 flex items-center group text-sm"
      {...props}
    >
      {renderedIcon}
      <span
        className={`ml-2 ${
          isActive ? 'text-indigo-800 font-bold' : 'text-gray-700 group-hover:text-gray-800'
        }`}
      >
        {text}
      </span>
    </Link>
  );
};

const getIcon = (iconType: IconType, isActive: boolean) => {
  const baseClasses = 'h-4 w-4';
  const inactiveClasses = 'text-gray-600 group-hover:text-gray-800';
  const activeClasses = 'text-indigo-600';
  const iconClasses = `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;

  switch (iconType) {
    case 'home':
      return <IconHome className={iconClasses} />;
    case 'project':
      return <IconOfficeBuilding className={iconClasses} />;
    default:
      return <div className={iconClasses}></div>;
  }
};
