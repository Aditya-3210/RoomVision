import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Edit2, Mail, User, Save, Loader } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return alert("Image size should be less than 5MB");
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const res = await axios.put('http://localhost:5000/auth/profile',
                        { profilePicture: reader.result },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    updateUser({ profilePicture: res.data.profilePicture });
                } catch (err) {
                    alert('Failed to update profile picture');
                } finally {
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNameUpdate = async () => {
        if (!name.trim()) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.put('http://localhost:5000/auth/profile',
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            updateUser({ name: res.data.name });
            setEditing(false);
        } catch (err) {
            alert('Failed to update name');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8 border-b pb-4">My Profile</h1>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                {/* Left Section - Profile Pic */}
                <div className="md:w-1/3 bg-slate-50 p-10 flex flex-col items-center justify-center border-r border-slate-100">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                                    <User size={64} />
                                </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Camera className="text-white" size={32} />
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    <p className="mt-4 text-sm text-slate-500 font-medium">Click to change picture</p>
                </div>

                {/* Right Section - Details */}
                <div className="md:w-2/3 p-10 flex flex-col justify-center space-y-8">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Full Name</label>
                        <div className="flex items-center gap-4">
                            {editing ? (
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-lg font-bold text-slate-800"
                                        autoFocus
                                    />
                                    <button onClick={handleNameUpdate} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                                        <Save size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1 flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 group">
                                    <span className="text-xl font-bold text-slate-800">{user?.name}</span>
                                    <button onClick={() => setEditing(true)} className="text-slate-400 hover:text-blue-600 transition p-1 rounded-full hover:bg-white group-hover:text-blue-500">
                                        <Edit2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Email Address</label>
                        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-slate-600">
                            <Mail size={20} className="text-slate-400" />
                            <span className="font-medium flex-1">{user?.email}</span>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                Verified
                            </span>
                        </div>
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <Loader size={16} className="animate-spin" /> Saving changes...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
