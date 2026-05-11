import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-surface">
    <Outlet />
  </div>
);

export default PublicLayout;
