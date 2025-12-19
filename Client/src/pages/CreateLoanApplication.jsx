import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLoanProducts, createLoanApplication } from '../services/api';
import { Card, Button, Loading, Alert, PageHeader } from '../components/common';
import { formatCurrency } from '../utils/formatters';

function CreateLoanApplication() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      panCard: '',
      address: '',
      city: '',
      pincode: ''
    },
    loanProductId: '',
    requestedAmount: '',
    collaterals: [
      {
        fundName: '',
        folioNumber: '',
        units: '',
        navPerUnit: ''
      }
    ]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllLoanProducts();
      setProducts(response.data.data.filter(p => p.status === 'ACTIVE'));
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleCustomerChange = (field, value) => {
    setFormData({
      ...formData,
      customer: {
        ...formData.customer,
        [field]: value
      }
    });
  };

  const handleCollateralChange = (index, field, value) => {
    const newCollaterals = [...formData.collaterals];
    newCollaterals[index][field] = value;
    setFormData({
      ...formData,
      collaterals: newCollaterals
    });
  };

  const addCollateral = () => {
    setFormData({
      ...formData,
      collaterals: [
        ...formData.collaterals,
        { fundName: '', folioNumber: '', units: '', navPerUnit: '' }
      ]
    });
  };

  const removeCollateral = (index) => {
    const newCollaterals = formData.collaterals.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      collaterals: newCollaterals
    });
  };

  const calculateTotalCollateralValue = () => {
    return formData.collaterals.reduce((sum, col) => {
      const value = parseFloat(col.units || 0) * parseFloat(col.navPerUnit || 0);
      return sum + value;
    }, 0);
  };

  const getSelectedProduct = () => {
    return products.find(p => p.id === formData.loanProductId);
  };

  const calculateMaxLoanAmount = () => {
    const product = getSelectedProduct();
    if (!product) return 0;
    const totalCollateral = calculateTotalCollateralValue();
    return totalCollateral * product.ltvRatio;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const product = getSelectedProduct();
    if (!product) {
      alert('Please select a loan product');
      return;
    }

    const requestedAmount = parseFloat(formData.requestedAmount);
    const maxAllowed = calculateMaxLoanAmount();

    if (requestedAmount > maxAllowed) {
      alert(`Maximum allowed loan amount based on LTV ratio (${(product.ltvRatio * 100).toFixed(0)}%) is ₹${maxAllowed.toFixed(2)}`);
      return;
    }

    if (requestedAmount < product.minLoanAmount || requestedAmount > product.maxLoanAmount) {
      alert(`Loan amount must be between ₹${product.minLoanAmount} and ₹${product.maxLoanAmount}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createLoanApplication(formData);
      alert('Loan application created successfully!');
      navigate('/loan-applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create loan application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create New Loan Application" 
        subtitle="Step-by-step loan application process"
        action={
          <Button variant="secondary" onClick={() => navigate('/loan-applications')}>
            ← Back
          </Button>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      {/* Progress Steps */}
      <Card>
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center mx-auto mb-2 font-semibold`}>
              1
            </div>
            <span className="text-sm text-gray-600">Customer Details</span>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center mx-auto mb-2 font-semibold`}>
              2
            </div>
            <span className="text-sm text-gray-600">Loan Details</span>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center mx-auto mb-2 font-semibold`}>
              3
            </div>
            <span className="text-sm text-gray-600">Collateral Details</span>
          </div>
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full ${step >= 4 ? 'bg-primary-600' : 'bg-gray-300'} text-white flex items-center justify-center mx-auto mb-2 font-semibold`}>
              4
            </div>
            <span className="text-sm text-gray-600">Review & Submit</span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Customer Details */}
        {step === 1 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Step 1: Customer Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.customer.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.customer.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+91-9876543210"
                  value={formData.customer.phone}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="ABCDE1234F"
                  value={formData.customer.panCard}
                  onChange={(e) => handleCustomerChange('panCard', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.customer.city}
                    onChange={(e) => handleCustomerChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={formData.customer.pincode}
                    onChange={(e) => handleCustomerChange('pincode', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.customer.address}
                  onChange={(e) => handleCustomerChange('address', e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="button" onClick={() => setStep(2)}>
                  Next →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Loan Details */}
        {step === 2 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Step 2: Loan Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Loan Product *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.loanProductId}
                  onChange={(e) => setFormData({...formData, loanProductId: e.target.value})}
                  required
                >
                  <option value="">Select a loan product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.interestRate}% p.a. (₹{product.minLoanAmount} - ₹{product.maxLoanAmount})
                    </option>
                  ))}
                </select>
              </div>

              {formData.loanProductId && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <strong className="text-gray-800">Product Details:</strong>
                  <ul className="mt-2 ml-6 space-y-1 text-gray-700">
                    <li>Interest Rate: {getSelectedProduct()?.interestRate}% p.a.</li>
                    <li>Max Tenure: {getSelectedProduct()?.maxTenure} months</li>
                    <li>Processing Fee: {getSelectedProduct()?.processingFee}%</li>
                    <li>LTV Ratio: {(getSelectedProduct()?.ltvRatio * 100).toFixed(0)}%</li>
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requested Loan Amount *</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter amount"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({...formData, requestedAmount: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  ← Previous
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Collateral Details */}
        {step === 3 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Step 3: Collateral Details (Mutual Funds)</h2>
            <div className="space-y-4">
              {formData.collaterals.map((collateral, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Mutual Fund {index + 1}</h3>
                    {formData.collaterals.length > 1 && (
                      <Button 
                        type="button" 
                        variant="danger"
                        size="sm"
                        onClick={() => removeCollateral(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., HDFC Equity Fund - Direct Growth"
                        value={collateral.fundName}
                        onChange={(e) => handleCollateralChange(index, 'fundName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Folio Number *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., HDC123456789"
                        value={collateral.folioNumber}
                        onChange={(e) => handleCollateralChange(index, 'folioNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Units *</label>
                        <input
                          type="number"
                          step="0.001"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., 1200"
                          value={collateral.units}
                          onChange={(e) => handleCollateralChange(index, 'units', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NAV per Unit *</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g., 650.50"
                          value={collateral.navPerUnit}
                          onChange={(e) => handleCollateralChange(index, 'navPerUnit', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {collateral.units && collateral.navPerUnit && (
                      <div className="bg-green-50 p-3 rounded-md">
                        <strong className="text-green-800">Total Value: {formatCurrency(parseFloat(collateral.units) * parseFloat(collateral.navPerUnit))}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Button type="button" variant="secondary" onClick={addCollateral}>
                + Add Another Mutual Fund
              </Button>

              {calculateTotalCollateralValue() > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-lg font-semibold text-gray-800">Total Collateral Value: {formatCurrency(calculateTotalCollateralValue())}</div>
                  {formData.loanProductId && (
                    <div className="mt-2 text-gray-700">
                      Max Loan Amount (based on LTV): {formatCurrency(calculateMaxLoanAmount())}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                  ← Previous
                </Button>
                <Button type="button" onClick={() => setStep(4)}>
                  Review →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Step 4: Review & Submit</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex"><span className="font-medium w-32">Name:</span><span>{formData.customer.name}</span></div>
                  <div className="flex"><span className="font-medium w-32">Email:</span><span>{formData.customer.email}</span></div>
                  <div className="flex"><span className="font-medium w-32">Phone:</span><span>{formData.customer.phone}</span></div>
                  <div className="flex"><span className="font-medium w-32">PAN Card:</span><span>{formData.customer.panCard}</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Loan Information</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex"><span className="font-medium w-32">Product:</span><span>{getSelectedProduct()?.name}</span></div>
                  <div className="flex"><span className="font-medium w-32">Amount:</span><span>{formatCurrency(parseFloat(formData.requestedAmount))}</span></div>
                  <div className="flex"><span className="font-medium w-32">Interest Rate:</span><span>{getSelectedProduct()?.interestRate}% p.a.</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Collaterals ({formData.collaterals.length})</h3>
                <div className="space-y-2">
                  {formData.collaterals.map((col, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-md">
                      <strong className="text-gray-800">{col.fundName}</strong>
                      <div className="text-sm text-gray-600 mt-1">
                        {col.units} units @ ₹{col.navPerUnit} = {formatCurrency(parseFloat(col.units) * parseFloat(col.navPerUnit))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 p-4 rounded-md mt-3">
                  <strong className="text-green-800 text-lg">Total Collateral Value: {formatCurrency(calculateTotalCollateralValue())}</strong>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="secondary" onClick={() => setStep(3)}>
                  ← Previous
                </Button>
                <Button type="submit" variant="success" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}

export default CreateLoanApplication;
