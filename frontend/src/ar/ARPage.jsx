import React, { useState, useRef } from 'react';
import ARViewer from './ARViewer';
import ARCatalog from './ARCatalog';
import { Maximize, Minimize } from 'lucide-react';

const ARPage = () => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const viewerContainerRef = useRef(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            viewerContainerRef.current.requestFullscreen().catch(err => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="h-[calc(100vh-65px)] flex flex-col bg-slate-50">
            <div className="flex flex-1 overflow-hidden relative">

                {/* Side Catalog - Width fixed */}
                <div className="w-80 h-full hidden md:block shadow-xl z-10 bg-white">
                    <ARCatalog onSelectModel={setSelectedModel} />
                </div>

                {/* Main AR View Area */}
                <div ref={viewerContainerRef} className="flex-1 relative bg-gray-100 group">
                    <ARViewer modelURL={selectedModel} />

                    {/* Fullscreen Toggle Button */}
                    <button
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-lg shadow-md hover:bg-white text-gray-700 transition-all z-20"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>

                    {/* Mobile Catalog Trigger (optional enhancement logic could go here) */}
                </div>
            </div>
        </div>
    );
};

export default ARPage;
