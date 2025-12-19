import { useState, useEffect } from 'react';
import { getAllCollaterals, updateCollateralStatus } from '../services/api';
import { Card, StatCard, Badge, Button, Loading, Alert, PageHeader, Table } from '../components/common';
import { formatCurrency, formatDate, getStatusVariant } from '../utils/formatters';

function CollateralManagement() {
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('PLEDGED');

  useEffect(() => {
    fetchCollaterals();
  }, [filterStatus]);

  const fetchCollaterals = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await getAllCollaterals(params);
      setCollaterals(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch collaterals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      try {
        await updateCollateralStatus(id, { status: newStatus });
        fetchCollaterals();
        alert('Collateral status updated successfully');
      } catch (err) {
        alert('Failed to update collateral status');
        console.error(err);
      }
    }
  };

  const calculateTotalValue = () => {
    return collaterals.reduce((sum, col) => sum + col.totalValue, 0);
  };

  if (loading) return <Loading message="Loading collaterals..." />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Collateral Management" 
        subtitle="Monitor and manage mutual fund collaterals"
        action={
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PLEDGED">PLEDGED</option>
            <option value="RELEASED">RELEASED</option>
          </select>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collaterals"
          value={collaterals.length}
          icon="📋"
          variant="primary"
        />
        <StatCard
          title="Total Value"
          value={formatCurrency(calculateTotalValue())}
          icon="💎"
          variant="success"
        />
        <StatCard
          title="Pledged"
          value={collaterals.filter(c => c.status === 'PLEDGED').length}
          icon="🔒"
          variant="info"
        />
        <StatCard
          title="Released"
          value={collaterals.filter(c => c.status === 'RELEASED').length}
          icon="✓"
          variant="success"
        />
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Mutual Fund Collaterals ({collaterals.length})</h2>
        <Table
          headers={['Customer', 'Mutual Fund', 'Units', 'NAV', 'Total Value', 'Pledge Date', 'Loan Status', 'Status', 'Actions']}
          data={collaterals.map((col) => ({
            customer: (
              <div>
                <div className="font-semibold text-gray-900">{col.loanApplication.customer.name}</div>
                <div className="text-sm text-gray-500">PAN: {col.loanApplication.customer.panCard}</div>
              </div>
            ),
            fund: (
              <div>
                <div className="font-semibold text-gray-900">{col.fundName}</div>
                <div className="text-sm text-gray-500">Folio: {col.folioNumber}</div>
              </div>
            ),
            units: col.units.toFixed(3),
            nav: `₹${col.navPerUnit.toFixed(2)}`,
            value: <span className="font-semibold text-green-600">{formatCurrency(col.totalValue)}</span>,
            pledgeDate: formatDate(col.pledgeDate),
            loanStatus: (
              <div>
                <Badge variant={getStatusVariant(col.loanApplication.status)}>
                  {col.loanApplication.status}
                </Badge>
                {col.loanApplication.loan && (
                  <div className="text-xs text-gray-500 mt-1">
                    Outstanding: {formatCurrency(col.loanApplication.loan.outstandingAmount)}
                  </div>
                )}
              </div>
            ),
            status: <Badge variant={col.status === 'PLEDGED' ? 'info' : 'success'}>{col.status}</Badge>,
            actions: (
              <>
                {col.status === 'PLEDGED' && col.loanApplication.loan?.status === 'CLOSED' && (
                  <Button variant="success" size="sm" onClick={() => handleStatusUpdate(col.id, 'RELEASED')}>
                    Release
                  </Button>
                )}
                {col.status === 'PLEDGED' && col.loanApplication.loan?.status === 'ACTIVE' && (
                  <Badge variant="info">Active Loan</Badge>
                )}
                {col.status === 'RELEASED' && (
                  <Badge variant="success">✓ Released</Badge>
                )}
                {col.status === 'PLEDGED' && !col.loanApplication.loan && (
                  <Badge variant="warning">Pending</Badge>
                )}
              </>
            )
          }))}
          emptyMessage="No collaterals found"
        />
      </Card>

      {/* Collateral by Product */}
      {collaterals.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Collateral Summary by Loan Product</h2>
          <Table
            headers={['Loan Product', 'No. of Collaterals', 'Total Value', 'Avg. Value per Collateral']}
            data={Object.entries(
              collaterals.reduce((acc, col) => {
                const productName = col.loanApplication.loanProduct.name;
                if (!acc[productName]) {
                  acc[productName] = { count: 0, totalValue: 0 };
                }
                acc[productName].count += 1;
                acc[productName].totalValue += col.totalValue;
                return acc;
              }, {})
            ).map(([productName, data]) => ({
              product: <span className="font-semibold text-gray-900">{productName}</span>,
              count: data.count,
              total: formatCurrency(data.totalValue),
              average: formatCurrency(data.totalValue / data.count)
            }))}
          />
        </Card>
      )}
    </div>
  );
}

export default CollateralManagement;
