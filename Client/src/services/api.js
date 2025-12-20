import axios from 'axios';

const API_BASE_URL = 'https://onefi-lamf-loan-management-system.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardStats = () => api.get('/dashboard');

export const getAllLoanProducts = () => api.get('/loan-products');
export const getLoanProductById = (id) => api.get(`/loan-products/${id}`);
export const createLoanProduct = (data) => api.post('/loan-products', data);
export const updateLoanProduct = (id, data) => api.put(`/loan-products/${id}`, data);
export const deleteLoanProduct = (id) => api.delete(`/loan-products/${id}`);

export const getAllCustomers = () => api.get('/customers');
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const getAllLoanApplications = (params) => api.get('/loan-applications', { params });
export const getLoanApplicationById = (id) => api.get(`/loan-applications/${id}`);
export const createLoanApplication = (data) => api.post('/loan-applications', data);
export const updateLoanApplicationStatus = (id, data) => api.put(`/loan-applications/${id}/status`, data);
export const deleteLoanApplication = (id) => api.delete(`/loan-applications/${id}`);

export const getAllLoans = (params) => api.get('/loans', { params });
export const getLoanById = (id) => api.get(`/loans/${id}`);
export const recordRepayment = (id, data) => api.post(`/loans/${id}/repayment`, data);
export const updateLoanStatus = (id, data) => api.put(`/loans/${id}/status`, data);

export const getAllCollaterals = (params) => api.get('/collaterals', { params });
export const getCollateralsByApplicationId = (applicationId) => api.get(`/collaterals/application/${applicationId}`);
export const getCollateralById = (id) => api.get(`/collaterals/${id}`);
export const createCollateral = (data) => api.post('/collaterals', data);
export const updateCollateralStatus = (id, data) => api.put(`/collaterals/${id}/status`, data);
export const deleteCollateral = (id) => api.delete(`/collaterals/${id}`);

export default api;
