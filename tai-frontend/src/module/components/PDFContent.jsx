import React, { useState } from 'react';

const PDFContent = ({ fileURL }) => {
    const [scale, setScale] = useState(100);

    // Ability to add the custom controlls here 

    // Build the PDF URL with zoom parameter
    const getPDFUrl = () => {
        if (!fileURL) return '';
        return `${fileURL}#zoom=${scale}`;
    };

    return (
        <div className="flex flex-col h-full">

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto bg-gray-100 rounded-lg">
                <iframe 
                    key={getPDFUrl()} // Force reload when zoom changes
                    src={getPDFUrl()} 
                    width="100%" 
                    height="100%" 
                    title="PDF Viewer"
                    style={{ border: 'none', minHeight: '500px' }}
                />
            </div>
        </div>
    );
};  

export default PDFContent;