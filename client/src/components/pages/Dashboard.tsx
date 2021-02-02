import { signOut } from '../../apis/firebase';
import { SidebarNav } from '../navigation/SidebarNav';
import { TopNav } from '../navigation/TopNav';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <SidebarNav />
      <div className="ml-64">
        <TopNav />
        <div className="pt-14">
          <h1>Dashboard</h1>
          <p onClick={signOut}>Logout</p>
        </div>
      </div>
    </div>
  );
};
