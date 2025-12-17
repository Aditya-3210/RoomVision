import { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const AdminPanel = () => {
    const [furniture, setFurniture] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        imageURL: '',
        modelURL: '',
        dimensions: { width: 50, height: 50, depth: 0 }
    });
    const [activeTab, setActiveTab] = useState('furniture'); // furniture, users, projects
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchFurniture();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'projects') fetchProjects();
    }, [activeTab]);

    const fetchFurniture = async () => {
        try {
            const res = await axios.get('http://localhost:5000/furniture/all');
            setFurniture(res.data);
        } catch (err) {
            console.error("Error fetching furniture:", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin/users', { headers });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/admin/projects', { headers });
            setProjects(res.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageURL: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleModelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, modelURL: reader.result }); // Save 3D model as Base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddFurniture = async (e) => {
        e.preventDefault();

        // Validation: At least one file must be uploaded
        if (!formData.imageURL && !formData.modelURL) {
            alert('Please upload either a 2D Image or a 3D Model.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/furniture/add', formData, { headers });
            alert('Furniture added successfully!');
            setFormData({
                name: '',
                category: '',
                imageURL: '',
                modelURL: '',
                dimensions: { width: 50, height: 50, depth: 0 }
            });
            fetchFurniture();
        } catch (err) {
            console.error(err);
            alert('Error adding furniture');
        }
    };

    const handleDeleteFurniture = async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            await axios.delete(`http://localhost:5000/furniture/delete/${id}`, { headers });
            fetchFurniture();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

            <div className="flex gap-4 mb-8 border-b">
                <button onClick={() => setActiveTab('furniture')} className={`pb-2 px-4 ${activeTab === 'furniture' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Furniture</button>
                <button onClick={() => setActiveTab('users')} className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Users</button>
                <button onClick={() => setActiveTab('projects')} className={`pb-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-blue-600 font-bold' : ''}`}>Projects</button>
            </div>

            {activeTab === 'furniture' && (
                <div>
                    {/* Add Form */}
                    <form onSubmit={handleAddFurniture} className="bg-white p-6 rounded shadow mb-8">
                        <h2 className="text-xl font-bold mb-4">Add New Furniture</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-1">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Category</label>
                                <input
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Width (cm)</label>
                                <input
                                    type="number"
                                    value={formData.dimensions.width}
                                    onChange={e => setFormData({ ...formData, dimensions: { ...formData.dimensions, width: parseInt(e.target.value) || 0 } })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={formData.dimensions.height}
                                    onChange={e => setFormData({ ...formData, dimensions: { ...formData.dimensions, height: parseInt(e.target.value) || 0 } })}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mt-2">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload 2D Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full p-2 border border-blue-200 bg-blue-50 rounded focus:border-blue-500 outline-none"
                                    />
                                    {formData.imageURL && <p className="text-xs text-green-600 mt-1">Image Loaded!</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Upload 3D Model (.glb)</label>
                                    <input
                                        type="file"
                                        accept=".glb,.gltf"
                                        onChange={handleModelUpload}
                                        className="w-full p-2 border border-purple-200 bg-purple-50 rounded focus:border-purple-500 outline-none"
                                    />
                                    {formData.modelURL && <p className="text-xs text-green-600 mt-1">3D Model Loaded!</p>}
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="mt-6 bg-green-600 text-white px-6 py-2 rounded font-bold flex items-center gap-2 hover:bg-green-700 transition">
                            <Plus size={18} /> Add Furniture Item
                        </button>
                    </form>

                    {/* List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {furniture.map(item => (
                            <div key={item._id} className="bg-white p-4 rounded shadow border flex justify-between items-center group hover:shadow-md transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                                        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                        {item.modelURL && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">3D READY</span>}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteFurniture(item._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition"><Trash2 size={20} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 font-bold text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="p-4">{u.name}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                                    <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="grid gap-4">
                    {projects.map(p => (
                        <div key={p._id} className="bg-white p-6 rounded shadow border">
                            <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                            <p className="text-sm text-gray-600">By: <span className="font-semibold">{p.userId?.name}</span> ({p.userId?.email})</p>
                            <p className="text-xs text-gray-400 mt-2">Items Used: {p.itemsUsed.length}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
