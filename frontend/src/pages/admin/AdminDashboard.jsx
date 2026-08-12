import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4 h-screen">
        <h2 className="text-lg font-bold mb-4">Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/admin/products" className="text-blue-600">Products</Link>
          <Link to="/admin/orders" className="text-blue-600">Orders</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
