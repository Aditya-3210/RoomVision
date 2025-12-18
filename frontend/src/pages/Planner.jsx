import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { Save, RotateCcw, RotateCw, Trash2, Upload, Plus, Loader } from 'lucide-react';
import 'react-resizable/css/styles.css';

const Planner = () => {
    const { id } = useParams(); // If editing existing project
    const navigate = useNavigate();
    const [roomImage, setRoomImage] = useState(null);
    const [furniture, setFurniture] = useState([]); // Available items
    const [items, setItems] = useState([]); // Items on canvas: { id, uniqueId, x, y, width, height, rotation, imageURL }
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [title, setTitle] = useState('My New Room Design');
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const init = async () => {
            try {
                // Load Catalog
                const furnRes = await axios.get('http://localhost:5000/furniture/all');
                setFurniture(furnRes.data);

                // Load Project if ID exists
                if (id) {
                    const token = localStorage.getItem('token');
                    const projRes = await axios.get(`http://localhost:5000/projects/user/${JSON.parse(atob(token.split('.')[1])).id}`, { // Decoding token roughly or use context
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Find the specific project from the list (or backend should have get-by-id endpoint)
                    // Since we implemented get-all-user-projects, we filter here for simplicity or add get-one endpoint
                    const project = projRes.data.find(p => p._id === id);
                    if (project) {
                        setTitle(project.title);
                        setRoomImage(project.roomImageURL);
                        setItems(project.itemsUsed.map(i => ({
                            ...i,
                            uniqueId: Math.random().toString(36).substr(2, 9), // Regen unique IDs for UI
                            width: i.width || 100,
                            height: i.height || 100
                        })));
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRoomImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addItemToCanvas = (item) => {
        const newItem = {
            ...item,
            uniqueId: Math.random().toString(36).substr(2, 9),
            x: 50,
            y: 50,
            width: 100, // Default size
            height: 100,
            rotation: 0
        };
        setItems([...items, newItem]);
    };

    const updateItem = (uniqueId, updates) => {
        setItems(items.map(i => i.uniqueId === uniqueId ? { ...i, ...updates } : i));
    };

    const removeItem = (uniqueId) => {
        setItems(items.filter(i => i.uniqueId !== uniqueId));
        setSelectedItemId(null);
    };

    const saveProject = async () => {
        try {
            if (!roomImage) return alert("Please upload a room image first");
            const token = localStorage.getItem('token');
            const payload = {
                title,
                roomImageURL: roomImage,
                itemsUsed: items.map(({ uniqueId, ...rest }) => rest) // Remove frontend-only ID
            };

            if (id) {
                // Update existing project
                await axios.put(`http://localhost:5000/projects/update/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Design Updated Successfully!');
            } else {
                // Create new project
                await axios.post('http://localhost:5000/projects/save', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Design Saved Successfully!');
            }
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to save project');
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Loader className="animate-spin text-blue-600" size={48} />
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar - Furniture Catalog */}
            <div className="w-80 bg-white shadow-xl z-20 overflow-y-auto hidden md:flex flex-col border-r">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg mb-2">Furniture Items</h2>
                    <p className="text-sm text-gray-500">Click to add to canvas</p>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                    {furniture.map(item => (
                        <div
                            key={item._id}
                            onClick={() => addItemToCanvas(item)}
                            className="cursor-pointer border rounded hover:border-blue-500 hover:shadow transition p-2 text-center"
                        >
                            <img src={item.imageURL} alt={item.name} className="h-20 mx-auto object-contain mb-2" />
                            <p className="text-xs font-bold truncate">{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 bg-gray-100 relative flex flex-col">
                {/* Toolbar */}
                <div className="h-16 bg-white border-b flex items-center justify-between px-4 z-20">
                    <div className="flex items-center gap-4">
                        <input value={title} onChange={(e) => setTitle(e.target.value)} className="font-bold text-xl border-b border-transparent focus:border-blue-500 outline-none bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">
                            <Upload size={18} /> Upload Room
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                        <button onClick={saveProject} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            <Save size={18} /> Save Design
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-auto relative p-8 flex items-center justify-center bg-dots">
                    {/* Room Background */}
                    <div
                        className="relative shadow-2xl bg-white transition-all"
                        style={{
                            width: roomImage ? '800px' : '600px',
                            height: roomImage ? '600px' : '400px',
                            backgroundImage: roomImage ? `url(${roomImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!roomImage && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 m-4 rounded">
                                <Upload size={48} className="mb-4" />
                                <p>Upload a room photo to start</p>
                            </div>
                        )}

                        {/* Furniture Items */}
                        {items.map((item) => (
                            <DraggableItem
                                key={item.uniqueId}
                                item={item}
                                isSelected={selectedItemId === item.uniqueId}
                                onSelect={() => setSelectedItemId(item.uniqueId)}
                                onUpdate={(updates) => updateItem(item.uniqueId, updates)}
                                onRemove={() => removeItem(item.uniqueId)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for individual draggable items
const DraggableItem = ({ item, isSelected, onSelect, onUpdate, onRemove }) => {
    const nodeRef = useRef(null);

    return (
        <Draggable
            nodeRef={nodeRef}
            position={{ x: item.x, y: item.y }}
            onStop={(e, data) => onUpdate({ x: data.x, y: data.y })}
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className={`absolute cursor-move group`}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                style={{ zIndex: isSelected ? 100 : 1 }}
            >
                <ResizableBox
                    width={item.width}
                    height={item.height}
                    onResizeStop={(e, data) => onUpdate({ width: data.size.width, height: data.size.height })}
                    minConstraints={[50, 50]}
                    maxConstraints={[400, 400]}
                    lockAspectRatio={true}
                    handle={isSelected ? <span className="react-resizable-handle react-resizable-handle-se" /> : <span />}
                >
                    <div
                        className={`w-full h-full relative transition-transform ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                    >
                        <img
                            src={item.imageURL}
                            alt="Furniture"
                            className="w-full h-full object-contain pointer-events-none"
                        />

                        {/* Controls appearing only when selected */}
                        {isSelected && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow rounded flex gap-1 p-1 z-50">
                                <button onMouseDown={(e) => e.stopPropagation()} onClick={() => onUpdate({ rotation: item.rotation - 90 })} className="p-1 hover:bg-gray-100 rounded"><RotateCcw size={14} /></button>
                                <button onMouseDown={(e) => e.stopPropagation()} onClick={() => onUpdate({ rotation: item.rotation + 90 })} className="p-1 hover:bg-gray-100 rounded"><RotateCw size={14} /></button>
                                <button onMouseDown={(e) => e.stopPropagation()} onClick={onRemove} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                            </div>
                        )}
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
};

export default Planner;
