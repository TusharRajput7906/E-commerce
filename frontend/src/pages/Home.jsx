import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/products");
                setProducts(data.products);
            } catch (err) {
                setError("Failed to load products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p className="text-center mt-10">Loading products...</p>
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">All products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => {
                                    return (
                                    <Link key={product._id} to={`/product/${product._id}`} className="block">
                                        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition h-full">
                                                <img src={product.image?.[0]?.url} alt={product.name} className="w-full h-48 object-cover mb-3" />

                                                <h2 className="font-semibold text-lg">{product.name}</h2>
                                                <p className="text-gray-500 text-sm">{product.category}</p>
                                                <p className="font-bold mt-2">₹{product.price}</p>
                                        </div>
                                    </Link>
                                    );
                                })}
            </div>
            {products.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No products found.</p>
            )}
        </div>
    );
};

export default Home
