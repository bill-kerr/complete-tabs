import React from 'react';
import { Menu } from '@headlessui/react';
import { Link } from '../routing/Link';
import { IconUserCircle } from '../svg/icons';

export const UserMenu: React.FC = () => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 focus:outline-none">
        <IconUserCircle className="h-8 w-8" />
      </Menu.Button>
      <Menu.Items className="py-2 w-56 absolute right-0 flex flex-col whitespace-nowrap focus:outline-none bg-white border-gray-100 rounded-md shadow text-sm">
        <div className="py-2 px-3 border-b border-gray-100">
          <p className="text-gray-700">Signed in as</p>
          <p className="font-medium truncate">bk7987@gmail.com</p>
        </div>
        <Menu.Item>
          {({ active }) => (
            <Link
              to="/dashboard/settings"
              className={`mt-2 block py-2 px-3 ${active && 'bg-gray-100'}`}
            >
              Account settings
            </Link>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};
