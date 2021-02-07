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
        <div className="pt-16">
          <h1>Dashboard</h1>
        </div>
      </div>
    </div>
  );
};
