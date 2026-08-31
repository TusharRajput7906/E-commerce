import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'];

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  // Local form state initialized from URL params
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    // try to extract categories from some products (first page)
    const load = async () => {
      try {
        const { data } = await api.get('/products');
        const list = data?.products ?? [];
        const unique = Array.from(new Set(list.map((p) => p.category).filter(Boolean)));
        if (unique.length > 0) setCategories(unique);
        else setCategories(DEFAULT_CATEGORIES);
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    };
    load();
  }, []);

  const apply = (e) => {
    if (e) e.preventDefault();
    const params = {};
    // keep keyword if present
    const kw = searchParams.get('keyword');
    if (kw) params.keyword = kw;
    if (category) params.category = category;
    if (minPrice) params.minPrice = String(minPrice);
    if (maxPrice) params.maxPrice = String(maxPrice);
    // reset to first page
    params.page = '1';
    setSearchParams(params);
  };

  const clear = () => {
    const params = {};
    const kw = searchParams.get('keyword');
    if (kw) params.keyword = kw; // keep keyword when clearing filters per spec
    setSearchParams(params);
  };

  const formKey = `${searchParams.get('category') || ''}_${searchParams.get('minPrice') || ''}_${searchParams.get('maxPrice') || ''}`;

  return (
    <aside className="w-full md:w-64 bg-white md:bg-transparent p-4 md:p-0">
      <form key={formKey} onSubmit={apply} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-2 py-1">
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Apply</button>
          <button type="button" onClick={clear} className="bg-gray-200 px-3 py-1 rounded">Clear Filters</button>
        </div>
      </form>
    </aside>
  );
};

export default ProductFilters;
