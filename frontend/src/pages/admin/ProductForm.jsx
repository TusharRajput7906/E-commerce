import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    image: '',
  });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          category: data.category || '',
          brand: data.brand || '',
          stock: data.countInStock ?? data.stock ?? 0,
          image: data.image || '',
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        // backend has mixed expectations: some controllers use `image` (array) or `images`.
        image: form.image ? [{ url: form.image }] : [],
        images: form.image ? [{ url: form.image }] : [],
      };

      if (id) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Save failed');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{id ? 'Edit' : 'Add'} Product</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg">
          <div className="mb-2">
            <label className="block">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-2">
            <label className="block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-2">
            <label className="block">Price</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-2">
            <label className="block">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-2">
            <label className="block">Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-2">
            <label className="block">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="mb-4">
            <label className="block">Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductForm;
