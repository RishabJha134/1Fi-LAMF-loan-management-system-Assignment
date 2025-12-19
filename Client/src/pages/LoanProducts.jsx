import { useState, useEffect } from 'react';
import { getAllLoanProducts, createLoanProduct, updateLoanProduct, deleteLoanProduct } from '../services/api';
import { Card, Badge, Button, Modal, Loading, Alert, PageHeader, Table } from '../components/common';
import { formatCurrency } from '../utils/formatters';

function LoanProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    interestRate: '',
    maxLoanAmount: '',
    minLoanAmount: '',
    maxTenure: '',
    processingFee: '',
    ltvRatio: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllLoanProducts();
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch loan products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateLoanProduct(editingProduct.id, formData);
      } else {
        await createLoanProduct(formData);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert('Failed to save loan product');
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      interestRate: product.interestRate,
      maxLoanAmount: product.maxLoanAmount,
      minLoanAmount: product.minLoanAmount,
      maxTenure: product.maxTenure,
      processingFee: product.processingFee,
      ltvRatio: product.ltvRatio,
      status: product.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this loan product?')) {
      try {
        await deleteLoanProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete loan product');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      interestRate: '',
      maxLoanAmount: '',
      minLoanAmount: '',
      maxTenure: '',
      processingFee: '',
      ltvRatio: '',
      status: 'ACTIVE'
    });
    setEditingProduct(null);
  };

  if (loading) return <Loading message="Loading loan products..." />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Loan Products" 
        subtitle="Manage loan products and their configurations"
        action={
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            + Create New Product
          </Button>
        }
      />

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <Table
          headers={['Product Name', 'Interest Rate', 'Loan Range', 'Max Tenure', 'LTV Ratio', 'Processing Fee', 'Status', 'Actions']}
          data={products.map((product) => ({
            name: (
              <div>
                <div className="font-semibold text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.description}</div>
              </div>
            ),
            rate: `${product.interestRate}% p.a.`,
            range: `${formatCurrency(product.minLoanAmount)} - ${formatCurrency(product.maxLoanAmount)}`,
            tenure: `${product.maxTenure} months`,
            ltv: `${(product.ltvRatio * 100).toFixed(0)}%`,
            fee: `${product.processingFee}%`,
            status: <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>{product.status}</Badge>,
            actions: (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </div>
            )
          }))}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (% p.a.) *</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.interestRate}
                onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee (%) *</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.processingFee}
                onChange={(e) => setFormData({...formData, processingFee: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Loan Amount *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.minLoanAmount}
                onChange={(e) => setFormData({...formData, minLoanAmount: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Loan Amount *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.maxLoanAmount}
                onChange={(e) => setFormData({...formData, maxLoanAmount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tenure (months) *</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.maxTenure}
                onChange={(e) => setFormData({...formData, maxTenure: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LTV Ratio (0-1) *</label>
              <input
                type="number"
                step="0.01"
                max="1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.ltvRatio}
                onChange={(e) => setFormData({...formData, ltvRatio: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LoanProducts;
