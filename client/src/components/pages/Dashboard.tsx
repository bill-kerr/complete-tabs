import { signOut } from '../../apis/firebase';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p onClick={signOut}>Logout</p>
    </div>
  );
};
