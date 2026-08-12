import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-toastify";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart || { items: [] });
  const { isAuthenticated } = useSelector((state) => state.auth || { isAuthenticated: false });

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const validate = () => {
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return toast.error("Please complete the form");

    setLoading(true);
    try {
      const body = {
        shippingAddress: { fullName, address, city, postalCode, country, phone },
        paymentMethod,
      };

      const { data } = await api.post("/orders", body);

      // clear local cart state
      dispatch(clearCart());

      navigate(`/order-success/${data._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form className="md:col-span-2 space-y-4" onSubmit={handleSubmit}>
          <h2 className="font-semibold">Shipping Address</h2>
          {error && <p className="text-red-600">{error}</p>}
          <div>
            <label className="block text-sm">Full name*</label>
            <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full border px-2 py-1 rounded" required />
          </div>
          <div>
            <label className="block text-sm">Address*</label>
            <input value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full border px-2 py-1 rounded" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">City*</label>
              <input value={city} onChange={(e)=>setCity(e.target.value)} className="w-full border px-2 py-1 rounded" required />
            </div>
            <div>
              <label className="block text-sm">Postal Code*</label>
              <input value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} className="w-full border px-2 py-1 rounded" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Country*</label>
              <input value={country} onChange={(e)=>setCountry(e.target.value)} className="w-full border px-2 py-1 rounded" required />
            </div>
            <div>
              <label className="block text-sm">Phone*</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full border px-2 py-1 rounded" required />
            </div>
          </div>

          <h2 className="font-semibold mt-4">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="COD" checked={paymentMethod==="COD"} onChange={()=>setPaymentMethod("COD")} /> COD
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="Card" checked={paymentMethod==="Card"} onChange={()=>setPaymentMethod("Card")} /> Card
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" value="UPI" checked={paymentMethod==="UPI"} onChange={()=>setPaymentMethod("UPI")} /> UPI
            </label>
          </div>

          <button disabled={loading} className="mt-4 bg-gray-900 text-white py-2 px-4 rounded">
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </form>

        <aside className="border rounded p-4">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it._id} className="flex justify-between">
                <div>
                  <div className="font-medium">{it.product.name} x {it.quantity}</div>
                  <div className="text-sm text-gray-500">₹{it.product.price} each</div>
                </div>
                <div className="font-semibold">₹{it.product.price * it.quantity}</div>
              </div>
            ))}
          </div>
          <hr className="my-3" />
          <p>Subtotal: <span className="font-bold">₹{subtotal}</span></p>
          <p>Shipping: <span className="font-bold">{shipping === 0 ? "Free" : `₹${shipping}`}</span></p>
          <p className="mt-2 text-lg">Total: <span className="font-bold">₹{total}</span></p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
