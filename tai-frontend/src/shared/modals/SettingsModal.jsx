import React, { useState } from "react";
import { ChatSettings } from "../components/ChatSettings";

export const SettingsModal = ({ onSave, onCancel, isLoading, isOpen }) => {

	const [formData, setFormData] = useState({
		name: "",
		settings: {}
	}); 

    if (!isOpen) {
        return null;
    } 

	const handleSettingsChange = (selectedSetting) => {
		setFormData((prev) => ({
			...prev,
			settings: selectedSetting
		}));
	};

	const handleSave = () => {
		if (!formData.name.trim() && Object.keys(formData.settings).length === 0) {
			// Optional error handling
			return;
		}
		onSave(formData);
	};

	return (
		<div
			id="settings-modal"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
		>
			<div className="relative p-4 w-full max-w-2xl max-h-full">
				{/* Modal content */}
				<div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
					{/* Modal header */}
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
							Settings
						</h3>
						<button
							type="button"
							onClick={onCancel}
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
						<div>
							<h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">
								Class Name
							</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
								Enter a name for your class (if left blank, the class name will
								stay the same).
							</p>
							<input
								type="text"
								placeholder="New Class Name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										name: e.target.value
									}))
								}
								className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
											dark:bg-gray-800 dark:text-white p-2.5 text-sm focus:ring-2 
											focus:ring-blue-500 focus:outline-none"
							/>
						</div>

						<div>
							<h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
								Chat Settings
							</h4>
							<ChatSettings onSettingsChange={handleSettingsChange} />
						</div>
					</div>

					{/* Modal footer */}
					<div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 space-x-3">
						<button
							onClick={handleSave}
							disabled={isLoading}
							type="button"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
										focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
										dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
						>
							{isLoading ? "Saving..." : "Save"}
						</button>
						<button
							onClick={onCancel}
							disabled={isLoading}
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
