import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import LoanProducts from './pages/LoanProducts';
import LoanApplications from './pages/LoanApplications';
import CreateLoanApplication from './pages/CreateLoanApplication';
import OngoingLoans from './pages/OngoingLoans';
import CollateralManagement from './pages/CollateralManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loan-products" element={<LoanProducts />} />
            <Route path="/loan-applications" element={<LoanApplications />} />
            <Route path="/loan-applications/create" element={<CreateLoanApplication />} />
            <Route path="/ongoing-loans" element={<OngoingLoans />} />
            <Route path="/collaterals" element={<CollateralManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
