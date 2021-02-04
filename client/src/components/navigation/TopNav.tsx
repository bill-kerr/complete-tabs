import { UserMenu } from '../menus/UserMenu';

export const TopNav: React.FC = () => {
  return (
    <nav className="py-2 px-4 flex items-center justify-between bg-white border-b border-gray-100">
      <div>test</div>
      <UserMenu />
    </nav>
  );
};
