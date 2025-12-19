export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusVariant = (status) => {
  const statusMap = {
    'ACTIVE': 'success',
    'INACTIVE': 'secondary',
    'DRAFT': 'secondary',
    'SUBMITTED': 'info',
    'UNDER_REVIEW': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger',
    'DISBURSED': 'success',
    'CLOSED': 'secondary',
    'DEFAULTED': 'danger',
    'PLEDGED': 'info',
    'RELEASED': 'success',
    'DISBURSEMENT': 'info',
    'REPAYMENT': 'success',
    'INTEREST': 'warning',
  };
  return statusMap[status] || 'secondary';
};
