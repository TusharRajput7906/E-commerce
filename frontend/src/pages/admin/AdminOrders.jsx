import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order updated');
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Order ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="px-4 py-2 border">{o._id}</td>
                <td className="px-4 py-2 border">{o.user?.name || o.user?.email || '—'}</td>
                <td className="px-4 py-2 border">${o.totalPrice}</td>
                <td className="px-4 py-2 border">{o.orderStatus}</td>
                <td className="px-4 py-2 border">
                  <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="border p-1">
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;
