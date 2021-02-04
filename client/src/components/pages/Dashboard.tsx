import { signOut } from '../../apis/firebase';
import { SidebarNav } from '../navigation/SidebarNav';
import { TopNav } from '../navigation/TopNav';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <SidebarNav />
      <div className="ml-64">
        <div className="fixed left-64 right-0">
          <TopNav />
        </div>
        <div className="pt-14">
          <h1>Dashboard</h1>
          <p className="inline bg-red-100" onClick={signOut}>
            Logout
          </p>
        </div>
      </div>
    </div>
  );
};
