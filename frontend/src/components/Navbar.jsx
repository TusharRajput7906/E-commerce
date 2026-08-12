import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
    const {isAuthenticated, user} = useSelector((state)=>state.auth);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">

        <Link to="/" className="text-xl font-bold">MyShop</Link>

        <div className="flex gap-6 items-center">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/cart" className="hover:text-gray-300">Cart</Link>

            {isAuthenticated ?(
                <span className="text-sm">Hi, {user?.name}</span>
            ):(
                <Link to="/login" className="hover:text-gray-300">Login</Link>
            )}
        </div>
    </nav>
  );
};

export default Navbar
