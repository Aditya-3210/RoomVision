import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, User, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 py-4 sticky top-0 z-50 transition-all">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2 tracking-tight">
                <Home size={26} className="text-blue-600" /> RoomVision
            </Link>
            <div className="flex gap-8 items-center font-medium text-gray-600">
                {user ? (
                    <>
                        <Link to="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
                        <Link to="/catalog" className="hover:text-blue-600 transition-colors duration-200">Catalog</Link>
                        <Link to="/ar" className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-all duration-200">
                            Live AR <span className="text-xs ml-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-md">NEW</span>
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">Admin Panel</Link>
                        )}

                        <div className="relative ml-2" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:text-blue-600 transition-colors focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden border border-blue-200 flex items-center justify-center">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={18} className="text-blue-600" />
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                                <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in-up">
                                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                                        <User size={16} /> My Profile
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors" onClick={() => setDropdownOpen(false)}>
                                        <Settings size={16} /> Settings
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300">
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
