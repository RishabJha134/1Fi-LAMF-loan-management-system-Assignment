import { useState, useEffect } from 'react';
import { getAllLoans, recordRepayment } from '../services/api';
import { Card, Badge, Button, Loading, Alert, PageHeader, Table } from '../components/common';
import { formatCurrency, formatDate, getStatusVariant } from '../utils/formatters';

function OngoingLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ACTIVE');

  useEffect(() => {
    fetchLoans();
  }, [filterStatus]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await getAllLoans(params);
      setLoans(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepayment = async (loanId) => {
    const amount = prompt('Enter repayment amount:');
    const reference = prompt('Enter reference number (optional):');
    
    if (amount && parseFloat(amount) > 0) {
      try {
        await recordRepayment(loanId, {
          amount: parseFloat(amount),
          referenceNumber: reference || undefined,
          notes: 'Manual repayment'
        });
        fetchLoans();
        alert('Repayment recorded successfully!');
      } catch (err) {
        alert('Failed to record repayment');
        console.error(err);
      }
    }
  };

  const calculateProgress = (disbursed, outstanding) => {
    const paid = disbursed - outstanding;
    const percentage = (paid / disbursed) * 100;
    return percentage.toFixed(1);
  };

  if (loading) return <Loading message="Loading loans..." />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ongoing Loans" 
        subtitle="Monitor and manage active loans"
        action={
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="CLOSED">CLOSED</option>
            <option value="DEFAULTED">DEFAULTED</option>
          </select>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Loans ({loans.length})</h2>
        <Table
          headers={['Customer', 'Product', 'Disbursed', 'Outstanding', 'Rate', 'Tenure', 'Progress', 'Status', 'End Date', 'Actions']}
          data={loans.map((loan) => ({
            customer: (
              <div>
                <div className="font-semibold text-gray-900">{loan.loanApplication.customer.name}</div>
                <div className="text-sm text-gray-500">{loan.loanApplication.customer.email}</div>
              </div>
            ),
            product: loan.loanApplication.loanProduct.name,
            disbursed: formatCurrency(loan.disbursedAmount),
            outstanding: (
              <span className={loan.outstandingAmount > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                {formatCurrency(loan.outstandingAmount)}
              </span>
            ),
            rate: `${loan.interestRate}% p.a.`,
            tenure: `${loan.tenureMonths} months`,
            progress: (
              <div className="w-full">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-green-500 h-4 text-white text-xs flex items-center justify-center"
                    style={{ width: `${calculateProgress(loan.disbursedAmount, loan.outstandingAmount)}%` }}
                  >
                    {calculateProgress(loan.disbursedAmount, loan.outstandingAmount)}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Paid: {formatCurrency(loan.disbursedAmount - loan.outstandingAmount)}
                </div>
              </div>
            ),
            status: <Badge variant={getStatusVariant(loan.status)}>{loan.status}</Badge>,
            endDate: formatDate(loan.endDate),
            actions: loan.status === 'ACTIVE' ? (
              <Button size="sm" onClick={() => handleRepayment(loan.id)}>
                Record Repayment
              </Button>
            ) : (
              <Badge variant="success">✓ Closed</Badge>
            )
          }))}
          emptyMessage="No loans found"
        />
      </Card>

      {/* Recent Transactions for each loan */}
      {loans.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
          {loans.slice(0, 3).map((loan) => (
            <div key={loan.id} className="mb-6 last:mb-0">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                {loan.loanApplication.customer.name} - {formatCurrency(loan.disbursedAmount)}
              </h3>
              <Table
                headers={['Date', 'Type', 'Amount', 'Reference', 'Notes']}
                data={loan.transactions.slice(0, 5).map((txn) => ({
                  date: formatDate(txn.transactionDate),
                  type: <Badge variant={
                    txn.type === 'DISBURSEMENT' ? 'info' : 
                    txn.type === 'REPAYMENT' ? 'success' : 'warning'
                  }>{txn.type}</Badge>,
                  amount: formatCurrency(txn.amount),
                  reference: <code className="text-sm bg-gray-100 px-2 py-1 rounded">{txn.referenceNumber}</code>,
                  notes: txn.notes
                }))}
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

export default OngoingLoans;
