import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductFilters from "../components/ProductFilters";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const params = { page: 1 };
                if (keyword) params.keyword = keyword;
                if (category) params.category = category;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;
                const res = await api.get('/products', { params });
                const data = res.data;
                const list = data?.products ?? data;
                setProducts(Array.isArray(list) ? list : []);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, category, minPrice, maxPrice]);

        if (loading) return <p className="text-center mt-10">Loading products...</p>
        if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
        return (
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64">
                            <ProductFilters />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">{keyword ? `Search results for "${keyword}"` : 'All products'}</h1>
                                {keyword && (
                                    <button onClick={() => navigate('/')} className="text-sm text-blue-600">Clear search</button>
                                )}
                            </div>

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
                    </div>
                </div>
    );
};

export default Home
