import { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { fetchSales, addSaleRecord, deleteSaleRecord } from '../services/api';

export default function SalesDetails() {
  const [sales, setSales] = useState([]);
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');

  const loadSales = () => {
    fetchSales().then((res) => setSales(res.data)).catch(console.error);
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleAddSale = async (e) => {
    e.preventDefault();
    await addSaleRecord({ productName, customerName, amount: parseFloat(amount) });
    setProductName('');
    setCustomerName('');
    setAmount('');
    loadSales();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sale entry?')) {
      await deleteSaleRecord(id);
      loadSales();
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div>
      <div className="panel-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Total Boutique Revenue</p>
          <h2 className="serif-title" style={{ fontSize: '2rem', color: 'var(--gold)' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </h2>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{sales.length} Orders</span>
      </div>

      <form onSubmit={handleAddSale} className="panel-card" style={{ display: 'grid', gap: 12 }}>
        <h3 style={{ fontSize: '1rem' }}>Record New Sale</h3>
        <input
          className="input-field"
          placeholder="Dress / Saree Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Customer Name (Optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit" className="btn-gold">
          <PlusCircle size={18} /> Add Sale Record
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sales.map((s) => (
          <div
            key={s.id}
            className="panel-card"
            style={{ marginBottom: 0, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>{s.productName}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {s.customerName || 'Walk-in Customer'} • {new Date(s.saleDate).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>₹{s.amount}</span>
              <button className="btn-danger" onClick={() => handleDelete(s.id)} style={{ padding: 6 }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}