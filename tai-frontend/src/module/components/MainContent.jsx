import React from 'react';
import PDFContent from './PDFContent';

const MainContent = ({ displayType, currentUnit, selectedContent, selectedContentURL }) => {
    const renderContent = () => { 
        switch(displayType) { 
            case 'welcome': 
                return(  
                    <div className="flex flex-col items-center justify-center h-full text-center">  
                        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                            Welcome to {currentUnit?.name || 'Loading...'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Select a module and day from the menu to view materials and assignments.
                        </p>
                    </div>
                );
            case 'material': 
                return (
                    <div className="flex flex-col h-full"> 
                        <div className="text-center mb-6">   
                            <h2 className="text-2xl font-semibold text-gray-900">{selectedContent.name}</h2> 
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <PDFContent fileURL={selectedContentURL} />
                        </div>
                    </div>
                );
            case 'assignment': 
                return( 
                    <div className="flex flex-col h-full"> 
                        <div className="text-center mb-6"> 
                            <h2 className="text-2xl font-semibold text-gray-900">{selectedContent.name}</h2> 
                        </div>  
                        <div className="flex-1 overflow-hidden">
                            <PDFContent fileURL={selectedContentURL} />
                        </div>
                    </div>
                ); 
            case 'chat-settings': 
                return( 
                    <div className="flex flex-col">  
                        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                            Teacher Chat Settings 
                        </h1> 
                        <button 
                            className="w-fit px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-900
                            transition-all duration-300 ease-in-out
                            hover:border-gray-400 hover:-translate-y-1 hover:shadow-lg
                            active:-translate-y-0.5 active:shadow-md
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            type="button"
                            name="do-not-provide-answers-button" 
                            value="true" 
                        >  
                            Do not provide answers to students
                        </button>
                    </div>
                ); 
            case 'error': 
                return( 
                    <div className="flex flex-col items-center justify-center h-full text-center"> 
                        <h1 className="text-2xl font-semibold text-red-600 mb-4">
                            Error loading this content
                        </h1>
                        <p className="text-gray-600">
                            An error occurred while loading this content, please try refreshing the page.
                        </p>
                    </div>
                );
            default: 
                return( 
                    <div className="flex flex-col items-center justify-center h-full text-center">  
                        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                            Welcome to {currentUnit?.name || 'Loading...'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Select a module and day from the menu to view materials and assignments.
                        </p>
                    </div>
                )
            }
        };

    return renderContent();
};

export default MainContent;