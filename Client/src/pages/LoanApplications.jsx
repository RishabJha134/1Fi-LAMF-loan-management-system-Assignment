import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLoanApplications, updateLoanApplicationStatus, deleteLoanApplication } from '../services/api';
import { Card, Badge, Button, Loading, Alert, PageHeader, Table } from '../components/common';
import { formatCurrency, formatDate, getStatusVariant } from '../utils/formatters';

function LoanApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await getAllLoanApplications(params);
      setApplications(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch loan applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const amount = prompt('Enter sanctioned amount:');
    const tenure = prompt('Enter tenure in months:');
    if (amount && tenure) {
      try {
        await updateLoanApplicationStatus(id, {
          status: 'DISBURSED',
          sanctionedAmount: parseFloat(amount),
          tenureMonths: parseInt(tenure)
        });
        fetchApplications();
        alert('Application approved and loan disbursed successfully!');
      } catch (err) {
        alert('Failed to approve application');
        console.error(err);
      }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await updateLoanApplicationStatus(id, {
          status: 'REJECTED',
          rejectionReason: reason
        });
        fetchApplications();
        alert('Application rejected');
      } catch (err) {
        alert('Failed to reject application');
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteLoanApplication(id);
        fetchApplications();
      } catch (err) {
        alert('Failed to delete application');
        console.error(err);
      }
    }
  };

  if (loading) return <Loading message="Loading applications..." />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Loan Applications" 
        subtitle="Manage and review loan applications"
        action={
          <Button onClick={() => navigate('/loan-applications/create')}>
            + Create New Application
          </Button>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All Applications ({applications.length})</h2>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="DISBURSED">DISBURSED</option>
          </select>
        </div>

        <Table
          headers={['Customer', 'Loan Product', 'Requested Amount', 'Collaterals', 'Status', 'Date', 'Actions']}
          data={applications.map((app) => ({
            customer: (
              <div>
                <div className="font-semibold text-gray-900">{app.customer.name}</div>
                <div className="text-sm text-gray-500">{app.customer.email}</div>
              </div>
            ),
            product: app.loanProduct.name,
            amount: formatCurrency(app.requestedAmount),
            collaterals: (
              <div>
                <div>{app.collaterals.length} mutual fund(s)</div>
                <div className="text-sm text-gray-500">
                  Total: {formatCurrency(app.collaterals.reduce((sum, col) => sum + col.totalValue, 0))}
                </div>
              </div>
            ),
            status: <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>,
            date: formatDate(app.applicationDate),
            actions: (
              <div className="flex gap-2">
                {(app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW') && (
                  <>
                    <Button variant="success" size="sm" onClick={() => handleApprove(app.id)}>
                      Approve
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleReject(app.id)}>
                      Reject
                    </Button>
                  </>
                )}
                {app.status === 'REJECTED' && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete(app.id)}>
                    Delete
                  </Button>
                )}
                {app.status === 'DISBURSED' && (
                  <Badge variant="success">✓ Disbursed</Badge>
                )}
              </div>
            )
          }))}
          emptyMessage="No applications found"
        />
      </Card>
    </div>
  );
}

export default LoanApplications;
