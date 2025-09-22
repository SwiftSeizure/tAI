import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;


const PDFContent = ({ fileURL }) => {
    return (
        <div className="pdf-container" 
            style={{ 
                width: '100%', 
                height: '600px' 
            }}>
            <iframe 
                src={fileURL} 
                width="100%" 
                height="100%" 
                title="PDF Viewer"
                style={{ border: 'none' }}
            />
        </div>
    );
};  

export default PDFContent;

