import React, { useContext } from 'react';
import { Menu } from '@headlessui/react';
import { Link } from '../routing/Link';
import { IconCog, IconUserCircle, IconLogout } from '../svg/icons';
import { signOut } from '../../apis/firebase';
import { AuthContext } from '../../context';

export const UserMenu: React.FC = () => {
  const user = useContext(AuthContext);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 focus:outline-none">
        <IconUserCircle className="h-8 w-8 text-gray-600" />
      </Menu.Button>
      <Menu.Items className="py-2 w-56 absolute right-0 flex flex-col whitespace-nowrap focus:outline-none bg-white border-gray-100 rounded-md shadow-md text-sm">
        <div className="py-2 px-3 border-b border-gray-100">
          <p className="text-gray-700">Signed in as</p>
          <p className="font-medium truncate">{user?.email}</p>
        </div>
        <Menu.Item>
          {({ active }) => (
            <Link
              to="/dashboard/settings"
              className={`mt-2 py-2 px-3 flex items-center ${active && 'bg-gray-100'}`}
            >
              <IconCog className="h-5 w-5 text-gray-600" />
              <span className="ml-2">Account settings</span>
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`mt-2 py-2 px-3 flex items-center focus:outline-none ${
                active && 'bg-gray-100'
              }`}
              onClick={() => signOut()}
            >
              <IconLogout className="h-5 w-5 text-gray-600" />
              <span className="ml-2">Logout</span>
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};
