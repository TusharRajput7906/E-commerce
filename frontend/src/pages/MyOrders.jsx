import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 && <p>No orders found.</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <Link key={o._id} to={`/order-success/${o._id}`} className="block border rounded p-3 hover:shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Order #{o._id}</div>
                <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{o.totalPrice}</div>
                <div className="mt-1"><span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">{o.orderStatus}</span></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
