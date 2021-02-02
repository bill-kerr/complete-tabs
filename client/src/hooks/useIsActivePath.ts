import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { escapePath } from '../utils';

export const useIsActivePath = (pathToCheck: string) => {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const escapedPathToCheck = escapePath(pathToCheck);
    const escapedCurrentPath = escapePath(location.pathname);
    setActive(escapedPathToCheck === escapedCurrentPath);
  }, [location]);

  return active;
};
