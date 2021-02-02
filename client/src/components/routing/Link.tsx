import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { escapePath } from '../../utils';

export type LinkProps = React.PropsWithoutRef<NavLinkProps<unknown>> &
  React.RefAttributes<HTMLAnchorElement>;

export const Link: React.FC<LinkProps> = props => {
  const location = useLocation();

  return (
    <NavLink
      isActive={params => {
        const matches = params?.path === escapePath(location.pathname);
        return matches;
      }}
      {...props}
    />
  );
};
