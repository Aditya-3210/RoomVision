import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [deleteStep, setDeleteStep] = useState(0); // 0: Idle, 1: Confirm

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) return alert("New passwords don't match");

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/auth/password',
                { currentPassword: passwords.current, newPassword: passwords.new },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Password updated successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete('http://localhost:5000/auth/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            logout();
            navigate('/', { replace: true });
            alert('Your account has been permanently deleted.');
        } catch (err) {
            alert('Failed to delete account');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8 border-b pb-4">Account Settings</h1>

            {/* Change Password Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" /> Security
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                className="w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passwords.current}
                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label={showPasswords.current ? "Hide password" : "Show password"}
                            >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                className="w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passwords.new}
                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label={showPasswords.new ? "Hide password" : "Show password"}
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                className="w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                            >
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-900 transition mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Delete Account Section */}
            <div className="bg-red-50 rounded-3xl border border-red-100 p-8">
                <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    <AlertTriangle /> Danger Zone
                </h2>
                <p className="text-red-600 mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                {deleteStep === 0 ? (
                    <button
                        onClick={() => setDeleteStep(1)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        Delete Account
                    </button>
                ) : (
                    <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm animate-pulse-once">
                        <h3 className="font-bold text-red-700 text-lg mb-2">Are you absolutely sure?</h3>
                        <p className="text-slate-600 mb-4 text-sm">
                            This action will permanently delete your account, verified email status, and
                            <span className="font-bold"> all saved designs</span>. This cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                            >
                                Yes, Delete My Account
                            </button>
                            <button
                                onClick={() => setDeleteStep(0)}
                                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-300 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
