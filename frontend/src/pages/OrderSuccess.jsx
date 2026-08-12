import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Confirmation</h1>
      <p className="mb-2">Thank you! Your order <span className="font-semibold">{order._id}</span> has been placed.</p>

      <div className="border rounded p-4 mt-4">
        <h2 className="font-semibold">Shipping Address</h2>
        <p>{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      <div className="border rounded p-4 mt-4">
        <h2 className="font-semibold">Items</h2>
        <div className="mt-2 space-y-2">
          {order.items.map((it) => (
            <div key={it.product} className="flex justify-between">
              <div>{it.name} x {it.quantity}</div>
              <div>₹{it.price * it.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p>Items: <span className="font-semibold">₹{order.itemsPrice}</span></p>
        <p>Shipping: <span className="font-semibold">{order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice}`}</span></p>
        <p className="text-lg">Total: <span className="font-bold">₹{order.totalPrice}</span></p>
      </div>

      <div className="mt-6">
        <Link to="/" className="bg-gray-900 text-white px-4 py-2 rounded">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
