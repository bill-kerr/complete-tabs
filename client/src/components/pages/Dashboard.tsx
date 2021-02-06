import { useContext } from 'react';
import { AuthContext } from '../../context';
import { SidebarNav } from '../navigation/SidebarNav';
import { TopNav } from '../navigation/TopNav';

export const Dashboard: React.FC = () => {
  const user = useContext(AuthContext);

  const leaveOrg = async () => {
    await fetch('http://localhost:3333/api/v1/organizations', {
      method: 'delete',
      headers: new Headers({
        Authorization: `Bearer ${user?.token}` || '',
      }),
    }).then(json => console.log(json));
    return '';
  };

  return (
    <div>
      <SidebarNav />
      <div className="ml-64">
        <div className="fixed left-64 right-0">
          <TopNav />
        </div>
        <div className="pt-16">
          <h1>Dashboard</h1>
          <p>{user?.organizationId}</p>
          <button onClick={leaveOrg}>Leave org</button>
        </div>
      </div>
    </div>
  );
};
