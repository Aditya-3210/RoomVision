import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box } from 'lucide-react';

const Catalog = () => {
    const [furniture, setFurniture] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const res = await axios.get('http://localhost:5000/furniture/all');
                setFurniture(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFurniture();
    }, []);

    if (loading) return <div className="text-center py-20">Loading Catalog...</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs">Library</span>
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4 mt-2">Furniture Catalog</h1>
                <p className="text-slate-500">Browse our collection of high-quality furniture items to add to your designs.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {furniture.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                        <div className="h-48 bg-slate-50 flex items-center justify-center p-6 group-hover:bg-blue-50/30 transition-colors">
                            {item.imageURL ? (
                                <img src={item.imageURL} alt={item.name} className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                <Box className="text-slate-300" size={48} />
                            )}
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">{item.category}</p>
                                <span className="text-xs text-slate-400 font-mono">{item.dimensions?.width}x{item.dimensions?.height}cm</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
