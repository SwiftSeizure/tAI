import React, {useState} from "react";

export const CanvasCodeSettings = ({ onCanvasCodeChange }) => { 

    const [canvasCode, setCanvasCode] = useState(""); 

    const handleCanvasCodeChange = (code) => {
        setCanvasCode(code);
        onCanvasCodeChange(code);
    };


    return (
        <div className="w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                Canvas Code
            </h3>
            <div className="space-y-3"> 

                {/* Canvas Code Input */}
                <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Optional: Enter a Canvas code for your class.
                    </p>
                    <input
                        id="canvas-code-input"
                        type="text"
                        placeholder="Canvas Code"
                        value={canvasCode}
                        onChange={(e) => handleCanvasCodeChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
                                    dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
                                    focus:ring-blue-500 focus:outline-none transition-all duration-200
                                    hover:border-gray-400 dark:hover:border-gray-500"
                    />
                </div>
            </div>
        </div>
    );
};