import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const { data } = await api.get('/products');
        const list = data?.products ?? data;
        if (!ignore) setProducts(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load products');
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => navigate('/admin/products/new')} className="bg-blue-600 text-white px-3 py-1 rounded">+ Add Product</button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Brand</th>
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">₹{p.price}</td>
                <td className="px-4 py-2 border">{p.category}</td>
                <td className="px-4 py-2 border">{p.brand}</td>
                <td className="px-4 py-2 border">{p.countInStock ?? p.stock ?? 0}</td>
                <td className="px-4 py-2 border">
                  <button onClick={() => navigate(`/admin/products/${p._id}/edit`)} className="mr-2 bg-yellow-500 px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
