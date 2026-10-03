import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { getProductImageUrl } from "../utils/imageHelper";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.cart || { items: [], loading: false });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const validItems = Array.isArray(items) ? items.filter((item) => item && item.product) : [];

  const handleQtyChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const subtotal = validItems.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0);

  if (!loading && validItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-4"><Link to="/" className="text-blue-600 hover:underline">Go shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {validItems.map((item) => (
            <div key={item._id || item.product?._id} className="flex items-center gap-4 border rounded p-4">
              <img
                src={getProductImageUrl(item.product)}
                alt={item.product?.name || "Product"}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product?.name}</h3>
                <p className="text-gray-500">₹{item.product?.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={item.product?.stock || 99}
                  value={item.quantity}
                  onChange={(e) => handleQtyChange(item.product?._id, Number(e.target.value))}
                  className="w-20 border px-2 py-1 rounded"
                />
                <button onClick={() => handleRemove(item.product?._id)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </div>
              <div className="w-32 text-right font-semibold">₹{(item.product?.price || 0) * (item.quantity || 1)}</div>
            </div>
          ))}
        </div>

        <div className="border rounded p-4 h-fit bg-gray-50">
          <h2 className="font-semibold text-lg">Summary</h2>
          <p className="mt-4">Subtotal ({validItems.length} items): <span className="font-bold">₹{subtotal}</span></p>
          <button onClick={() => navigate('/checkout')} className="mt-4 w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
