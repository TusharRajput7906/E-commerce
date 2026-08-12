import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setQty(data.stock > 0 ? 1 : 0);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!product) return null;

  const maxQty = product.stock || 0;

  const handleAddToCart = () => {
    console.log('Add to cart:', { productId: product._id, quantity: qty });
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white rounded shadow p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img
            src={product.image?.[0]?.url}
            alt={product.name}
            className="w-full h-96 object-cover rounded"
          />
        </div>

        <div className="md:w-1/2 space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-gray-500">Category: {product.category}</p>
          <p className="text-gray-500">Brand: {product.brand}</p>
          <p className="text-3xl font-bold mt-2">₹{product.price}</p>
          <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </p>

          <div>
            <h3 className="font-semibold">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min={1}
              max={maxQty}
              value={qty}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isNaN(v)) return;
                if (v < 1) setQty(1);
                else if (v > maxQty) setQty(maxQty);
                else setQty(v);
              }}
              className="w-24 border px-2 py-1 rounded"
            />
          </div>

          <div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
