import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/loan-products', label: 'Loan Products' },
    { path: '/loan-applications', label: 'Applications' },
    { path: '/ongoing-loans', label: 'Ongoing Loans' },
    { path: '/collaterals', label: 'Collaterals' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              <span className="text-3xl">🏦</span>
              LMS - Loan Management System
            </h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-800 text-white border-b-2 border-blue-400'
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
