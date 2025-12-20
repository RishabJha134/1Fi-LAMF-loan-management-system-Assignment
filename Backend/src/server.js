import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loanProductRoutes from './routes/loanProduct.routes.js';
import customerRoutes from './routes/customer.routes.js';
import loanApplicationRoutes from './routes/loanApplication.routes.js';
import loanRoutes from './routes/loan.routes.js';
import collateralRoutes from './routes/collateral.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to LMS (Loan Management System) - LAMF API',
    version: '1.0.0',
    endpoints: {
      loanProducts: '/api/loan-products',
      customers: '/api/customers',
      loanApplications: '/api/loan-applications',
      loans: '/api/loans',
      collaterals: '/api/collaterals',
      dashboard: '/api/dashboard'
    }
  });
});

app.use('/api/loan-products', loanProductRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/loan-applications', loanApplicationRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/collaterals', collateralRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 LMS Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

export default app;
