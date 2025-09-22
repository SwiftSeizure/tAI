import React from 'react';
import PDFContent from './PDFContent';

const MainContent = ({ displayType, currentUnit, selectedContent, selectedContentURL }) => {
    const renderContent = () => { 
        switch(displayType) { 
            case 'welcome': 
                return(  
                    <div className="welcome-container">  
                        <h1 className="welcome-heading">Welcome to {currentUnit?.name || 'Loading...'}</h1>
                        <p className="welcome-text"> Select a module and day from the menu to view materials and assignments. </p>
                    </div>
                );
            case 'material': 
                return (
                    <div className="content-container material-container"> 
                        <div className="content-header">   
                            <h2 className="content-title"> {selectedContent.name} </h2> 
                        </div>
                        <PDFContent fileURL={selectedContentURL} />
                    </div>
                );
            case 'assignment': 
                return( 
                    <div className="content-container material-container"> 
                        <div className="content-header"> 
                            <h2 className="content-title"> {selectedContent.name} </h2> 
                        </div>  
                        <PDFContent fileURL={selectedContentURL} />
                    </div>
                ); 
            case 'chat-settings': 
                return( 
                    <div className="min-h-max flex flex-col">  
                        <h1 className="font-nunito font-bold text-2xl text-[#2c3e50] mb-4">
                            Teacher Chat Settings 
                        </h1> 
                        <button 
                            className="block relative w-fit cursor-pointer border-2 border-[#e0e0e0] rounded-lg p-4 m-2 font-nunito font-bold text-[#2c3e50]
                            transition-all duration-300 ease-in-out
                            hover:border-[#a0a0a0] hover:-translate-y-[3px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]
                            checked:border-[#66b2ff] checked:bg-blue-300
                            focus:outline-none focus:border-[#66b2ff]"
                            inputTtype="radio"
                            name="do-not-provide-answers-button" 
                            value="true" 
                        >  
                            Do not provide answers to students
                        </button>
                    </div>
                ); 
            case 'error': 
                return( 
                    <div> 
                        <h1> Error loading this content </h1>
                        <p>An error occurred while loading this content, please try refreshing the page.</p>
                    </div>
                );
            default: 
                return( 
                    <div className="welcome-container">  
                        <h1 className="welcome-heading">Welcome to {currentUnit?.name || 'Loading...'}</h1>
                        <p className="welcome-text"> Select a module and day from the menu to view materials and assignments. </p>
                    </div>
                )
            }
        };

    return renderContent();
};

export default MainContent;