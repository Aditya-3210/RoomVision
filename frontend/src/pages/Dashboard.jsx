import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Trash2, FolderOpen } from 'lucide-react';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (user && token) {
                    const res = await axios.get(`http://localhost:5000/projects/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProjects(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        if (!loading && user) fetchProjects();
    }, [user, loading]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/projects/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(projects.filter(p => p._id !== id));
        } catch (err) {
            alert("Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Please Log In</h2>
                <p className="text-slate-500 mb-4">You need to be logged in to view your dashboard.</p>
                <Link to="/login" className="text-blue-600 font-bold hover:underline">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">My Dashboard</h1>
                    <p className="text-slate-500">Manage and view your saved interior designs.</p>
                </div>
                <Link to="/planner" className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200">
                    <Plus size={20} /> Start New Design
                </Link>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-700 border-b pb-4">My Saved Designs</h2>
                {projects.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FolderOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No designs yet</h3>
                        <p className="text-slate-500 mb-6">Create your first room design now!</p>
                        <Link to="/planner" className="text-blue-600 font-bold hover:underline">Start Designing &rarr;</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/planner/${project._id}`)}>
                                <div className="h-56 bg-slate-200 relative overflow-hidden">
                                    <img src={project.roomImageURL} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <button className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:bg-slate-50 transform hover:scale-105 transition-all">Edit Design</button>
                                    </div>
                                </div>
                                <div className="p-6 flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800 mb-1">{project.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(project._id); }}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
