import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Card, StatCard, Badge, Loading, Alert, PageHeader, Table } from '../components/common';
import { formatCurrency, formatDate, getStatusVariant } from '../utils/formatters';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your loan management system"
      />

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.overview.totalCustomers}
          icon="👥"
          variant="primary"
        />
        <StatCard
          title="Loan Products"
          value={stats.overview.totalLoanProducts}
          icon="📦"
          variant="secondary"
        />
        <StatCard
          title="Total Applications"
          value={stats.overview.totalApplications}
          icon="📋"
          variant="info"
        />
        <StatCard
          title="Active Loans"
          value={stats.overview.activeLoans}
          icon="💰"
          variant="success"
        />
      </div>

      {/* Financial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Disbursed"
          value={formatCurrency(stats.overview.totalDisbursed)}
          icon="💸"
          variant="success"
        />
        <StatCard
          title="Total Outstanding"
          value={formatCurrency(stats.overview.totalOutstanding)}
          icon="📊"
          variant="warning"
        />
        <StatCard
          title="Collateral Value"
          value={formatCurrency(stats.overview.totalCollateralValue)}
          icon="🔒"
          variant="info"
        />
      </div>

      {/* Application Status Summary */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-3xl font-bold text-yellow-600">{stats.applications.pending}</h3>
            <p className="text-gray-600 mt-2">Pending Review</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h3 className="text-3xl font-bold text-green-600">{stats.applications.approved}</h3>
            <p className="text-gray-600 mt-2">Approved</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <h3 className="text-3xl font-bold text-red-600">{stats.applications.rejected}</h3>
            <p className="text-gray-600 mt-2">Rejected</p>
          </div>
        </div>
      </Card>

      {/* Recent Applications */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Loan Applications</h2>
        <Table
          headers={['Customer', 'Product', 'Amount', 'Status', 'Date']}
          data={stats.recentApplications.map((app) => ({
            customer: app.customer.name,
            product: app.loanProduct.name,
            amount: formatCurrency(app.requestedAmount),
            status: <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>,
            date: formatDate(app.applicationDate)
          }))}
        />
      </Card>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <Table
          headers={['Customer', 'Type', 'Amount', 'Reference', 'Date']}
          data={stats.recentTransactions.map((txn) => ({
            customer: txn.loan.loanApplication.customer.name,
            type: <Badge variant={getStatusVariant(txn.type)}>{txn.type}</Badge>,
            amount: formatCurrency(txn.amount),
            reference: txn.referenceNumber,
            date: formatDate(txn.transactionDate)
          }))}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
