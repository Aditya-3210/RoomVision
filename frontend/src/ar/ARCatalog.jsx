import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Loader } from 'lucide-react';

const ARCatalog = ({ onSelectModel }) => {
    const [furniture, setFurniture] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const res = await axios.get('http://localhost:5000/furniture/all');
                // Filter only items that have a modelURL
                const arItems = res.data.filter(item => item.modelURL && item.modelURL.trim() !== '');
                setFurniture(arItems);
            } catch (err) {
                console.error("Failed to fetch furniture", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFurniture();
    }, []);

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader className="animate-spin text-blue-500" size={48} /></div>;
    }

    return (
        <div className="h-full overflow-y-auto p-4 bg-white border-r border-gray-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                <Box className="text-blue-600" /> 3D Catalog
            </h2>

            {furniture.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No 3D models available yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {furniture.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => onSelectModel(item.modelURL)}
                            className="group cursor-pointer border rounded-xl p-3 hover:border-blue-500 hover:shadow-md transition-all flex items-center gap-4"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {(item.modelThumbnailURL || item.imageURL) ? (
                                    <img
                                        src={item.modelThumbnailURL || item.imageURL}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Box className="text-gray-300" size={32} />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ARCatalog;
