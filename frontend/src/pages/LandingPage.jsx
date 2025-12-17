import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Layout, PenTool, Save } from 'lucide-react';

const LandingPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-[#FFFFEB] flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-32 bg-[#FFFFEB] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-60 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                <div className="relative max-w-5xl mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 animate-fade-in-up">
                        Redefine your living space
                    </span>
                    <h1 className="text-6xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
                        Design Your Dream Room <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">in Seconds</span>
                    </h1>
                    <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600 leading-relaxed">
                        Upload a photo of your room, drag & drop furniture, and visualize your renovations instantly with our Pseudo-AR Planner.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link to={user ? "/planner" : "/signup"} className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full shadow-xl shadow-blue-200 hover:shadow-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300">
                            {user ? "Start Designing Now" : "Start Designing Free"}
                        </Link>
                        <Link to="/catalog" className="px-10 py-4 bg-white border border-gray-200 text-slate-700 font-bold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                            Browse Catalog
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                        <Layout size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Upload Your Space</h3>
                    <p className="text-slate-500 leading-relaxed">Simply take a photo of your room and upload it. It becomes your design canvas.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform duration-300">
                        <PenTool size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Drag & Drop Furniture</h3>
                    <p className="text-slate-500 leading-relaxed">Choose from our catalog and place items directly onto your room image.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                        <Save size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Save & Share</h3>
                    <p className="text-slate-500 leading-relaxed">Save your layouts to your profile and come back to them anytime.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
