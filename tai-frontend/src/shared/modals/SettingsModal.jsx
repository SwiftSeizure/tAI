import React, { useState, useRef, useEffect } from "react";
import { ChatSettings } from "../components/ChatSettings";
import { ClassSettings } from "../components/ClassSettings";   
import { CanvasCodeSettings } from "../components/CanvasCodeSettings"; 


export const SettingsModal = ({ isOpen, onClose, classroom, onSaveSettings }) => {
	const modalRef = useRef(null);

	const handleClickOutside = (event) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			onClose();
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const [formData, setFormData] = useState({
		name: "",
		settings: {},
		canvasCode: ""
	}); 

    if (!isOpen) {
        return null;
    } 

	const handleClassNameChange = (className) => {
		setFormData((prev) => ({
			...prev,
			name: className
		}));
	};  

	const handleSettingsChange = (selectedSetting) => {
		setFormData((prev) => ({
			...prev,
			settings: selectedSetting
		}));
	};

	const handleSaveSettings = () => {
		// Call the parent's onSaveSettings with the current form data 
		console.log("This is the form data", formData);
		onSaveSettings(formData);
	}; 

	const handleCanvasCodeChange = (canvasCode) => {
		setFormData((prev) => ({
			...prev,
			canvasCode: canvasCode
		}));
	};

	const handleOnClose = () => {
		onClose();
	};

	return (
		<div
			id="settings-modal"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
		>
			<div ref={modalRef} className="relative p-4 w-full max-w-2xl max-h-full">
				{/* Modal content */}
				<div className="relative bg-white rounded-2xl shadow-2xl dark:bg-gray-700 overflow-hidden">
					{/* Modal header */}
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
							{/* TODO: Add class name here or render it for the chat settings*/}
							Settings
						</h3>
						<button
							type="button"
							onClick={handleOnClose}
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
										rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center 
										dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<svg
								className="w-3 h-3"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 14"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>

					{/* Modal body */}
					<div className="p-4 md:p-5 space-y-6 max-h-[400px] overflow-y-auto">
						
						<ClassSettings onClassNameChange={handleClassNameChange} />
						<ChatSettings onSettingsChange={handleSettingsChange} />  
						<CanvasCodeSettings onCanvasCodeChange={handleCanvasCodeChange} />
						
					</div>

					{/* Modal footer */}
					<div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 space-x-3">
						<button
							onClick={handleSaveSettings}
							type="button"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
										focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
										dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
						>
							Save
						</button>
						<button
							onClick={handleOnClose}
							type="button"
							className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border 
										border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 
										focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
										dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
