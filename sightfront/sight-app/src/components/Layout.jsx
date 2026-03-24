import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
const Layout = ({ token, setToken }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar token={token} setToken={setToken} />
      <main className="flex-grow container mx-auto p-4 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
  