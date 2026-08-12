import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
    const {isAuthenticated, user} = useSelector((state)=>state.auth);
    const cartCount = useSelector((state) => state.cart?.items?.length || 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-xl font-bold">MyShop</Link>

        <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
                        <Link to="/cart" className="hover:text-gray-300 relative">Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>

                        {isAuthenticated ?(
                <>
                  <span className="text-sm">Hi, {user?.name}</span>
                                    <Link to="/orders" className="ml-4 hover:text-gray-300">My Orders</Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="ml-4 hover:text-gray-300">Admin</Link>
                                    )}
                  <button onClick={handleLogout} className="ml-2 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">Logout</button>
                </>
            ):(
                <Link to="/login" className="hover:text-gray-300">Login</Link>
            )}
        </div>
    </nav>
  );
};

export default Navbar
