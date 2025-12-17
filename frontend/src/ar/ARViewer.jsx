import React from 'react';

const ARViewer = ({ modelURL }) => {
    if (!modelURL) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                <div className="text-6xl mb-4">🧊</div>
                <p className="text-xl font-medium">Select a 3D model to view in AR</p>
                <p className="text-sm mt-2 opacity-70">Use the catalog on the left</p>
            </div>
        );
    }

    return (
        <model-viewer
            src={modelURL}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            style={{ width: '100%', height: '100%' }}
        >
            <button
                slot="ar-button"
                className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 flex items-center gap-2"
            >
                📷 View in your space
            </button>
        </model-viewer>
    );
};

export default ARViewer;
