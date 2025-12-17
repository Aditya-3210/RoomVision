import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const { login, loading: authLoading } = useContext(AuthContext); // Use authLoading if needed, but we mostly use local loading for button state
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        // Email Validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password Validation
        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (!validate()) return;

        setLocalLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            alert('Login Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to manage your projects</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all ${touched.email && errors.email
                                    ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value.trim());
                                if (touched.email) validate();
                            }}
                            onBlur={() => handleBlur('email')}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all ${touched.password && errors.password
                                    ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (touched.password) validate();
                            }}
                            onBlur={() => handleBlur('password')}
                        />
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={localLoading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {localLoading ? <Loader className="animate-spin" size={20} /> : "Sign In"}
                    </button>
                    <p className="mt-4 text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create one now</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    // Validations Regex
    const NAME_REGEX = /^[a-zA-Z\s]{2,}$/;
    // Regex: At least 8 chars, 1 upper, 1 lower, 1 number, 1 special char
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validate = () => {
        const newErrors = {};

        // Name Validation
        if (!name) {
            newErrors.name = 'Name is required';
        } else if (!NAME_REGEX.test(name)) {
            newErrors.name = 'Name must be at least 2 chars and contain only letters';
        }

        // Email Validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password Validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!PASSWORD_REGEX.test(password)) {
            newErrors.password = 'Password must correspond to strong security requirements';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        validate();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });

        if (!validate()) return;

        setLoading(true);
        try {
            await signup(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            alert('Signup Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
                    <p className="text-slate-500 mt-2">Start designing your dream room today</p>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all ${touched.name && errors.name
                                    ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (touched.name) validate();
                            }}
                            onBlur={() => handleBlur('name')}
                        />
                        {touched.name && errors.name && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all ${touched.email && errors.email
                                    ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value.trim());
                                if (touched.email) validate();
                            }}
                            onBlur={() => handleBlur('email')}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-4 transition-all ${touched.password && errors.password
                                    ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                    : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                                }`}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (touched.password) validate();
                            }}
                            onBlur={() => handleBlur('password')}
                        />
                        {touched.password && errors.password ? (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>
                        ) : (
                            <p className="text-slate-400 text-xs mt-1">Min 8 chars, 1 UPPER, 1 lower, 1 number, 1 special</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : "Sign Up Free"}
                    </button>
                    <p className="mt-4 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};
