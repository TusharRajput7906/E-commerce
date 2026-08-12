import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import api from "../services/api";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";

// Small inline SVG icon components to avoid external icon dependency resolution issues
const Svg = ({ children, size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        {children}
    </svg>
);
const ShoppingCart = ({ size }) => (
    <Svg size={size}><path d="M6 6h15l-1.5 9h-11L6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1" fill="currentColor"/><circle cx="18" cy="20" r="1" fill="currentColor"/></Svg>
);
const User = ({ size }) => (
    <Svg size={size}><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
const Home = ({ size }) => (
    <Svg size={size}><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
const Menu = ({ size }) => (
    <Svg size={size}><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
const Search = ({ size }) => (
    <Svg size={size}><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);
const Shield = ({ size }) => (
    <Svg size={size}><path d="M12 2l7 3v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></Svg>
);

const Navbar = () => {
    const {isAuthenticated, user} = useSelector((state)=>state.auth);
    const cartCount = useSelector((state) => state.cart?.items?.length || 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleLogout = async () => {
        try{
            await api.post('/auth/logout');
            dispatch(logout());
            toast.success('Logged out');
            navigate('/login');
        }catch(err){
            console.error(err);
            toast.error('Logout failed');
        }
    };

    const submitSearch = (e) => {
        if (e) e.preventDefault();
        const trimmed = (query || "").trim();
        if (trimmed) {
            navigate(`/?keyword=${encodeURIComponent(trimmed)}`);
        } else {
            navigate(`/`);
        }
    };

    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    return (
        <nav className="bg-gray-900 text-white px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-2xl font-bold">MyShop</Link>
                </div>

                {/* Center: Search */}
                <div className="flex-1">
                    <form onSubmit={submitSearch} className="hidden md:flex items-center w-full">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products..."
                            className="flex-1 px-3 py-2 rounded-l bg-gray-800 text-white outline-none"
                        />
                        <button type="submit" className="bg-blue-600 px-3 py-2 rounded-r hover:bg-blue-500">
                            <Search size={18} />
                        </button>
                    </form>

                    {/* Mobile: show search icon that expands into input */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="p-2 rounded hover:bg-gray-800">
                            <Search size={20} />
                        </button>
                        {showMobileSearch && (
                            <form onSubmit={submitSearch} className="flex-1 ml-2">
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-3 py-2 rounded bg-gray-800 text-white outline-none"
                                />
                            </form>
                        )}
                    </div>
                </div>

                {/* Right: Icon group */}
                <div className="flex items-center gap-4">
                    {/* Home link (icon on desktop) */}
                    <Link to="/" className="hidden md:flex items-center gap-2 p-2 rounded hover:bg-gray-800">
                        <Home size={20} />
                        <span className="text-sm">Home</span>
                    </Link>

                    {/* Cart icon with badge */}
                    <Link to="/cart" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
                        <span className="relative inline-flex">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                            )}
                        </span>
                        <span className="text-sm">Cart</span>
                    </Link>

                    {/* Admin pill */}
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link to="/admin" className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700">
                            <Shield size={16} />
                            <span>Admin</span>
                        </Link>
                    )}

                    {/* User avatar / menu */}
                    <div className="relative">
                        <button onClick={() => { setShowUserMenu(!showUserMenu); setShowMobileMenu(false); }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
                            {isAuthenticated ? (
                                <>
                                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">{user?.name?.charAt(0)?.toUpperCase()}</div>
                                    <span className="hidden md:inline text-sm">{user?.name?.split(' ')[0]}</span>
                                </>
                            ) : (
                                <>
                                    <User size={20} />
                                    <span className="hidden md:inline text-sm">Login</span>
                                </>
                            )}
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded shadow-lg z-30 overflow-hidden">
                                <div className="px-4 py-2 border-b text-sm">{isAuthenticated ? user?.name : 'Guest'}</div>
                                <div className="flex flex-col">
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/orders" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Home size={16} />My Orders</Link>
                                            <button onClick={handleLogout} className="text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                                        </>
                                    ) : (
                                        <Link to="/login" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><User size={16} />Login</Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 rounded hover:bg-gray-800">
                            <Menu size={20} />
                        </button>
                        {showMobileMenu && (
                            <div className="absolute right-4 top-14 w-56 bg-white text-gray-900 rounded shadow-lg z-30 overflow-hidden">
                                <Link to="/" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><Home size={18} />Home</Link>
                                <Link to="/cart" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><ShoppingCart size={18} />Cart</Link>
                                {isAuthenticated && <Link to="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><Home size={18} />My Orders</Link>}
                                {isAuthenticated && user?.role === 'admin' && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><Shield size={16} />Admin</Link>}
                                {isAuthenticated ? (
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                                ) : (
                                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><User size={18} />Login</Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
