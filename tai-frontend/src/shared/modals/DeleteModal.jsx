import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirmDelete, itemToDelete }) {
	if (!isOpen) return null;

	const handleConfirmDelete = () => {
		onConfirmDelete();
		onClose();
	};

	return (
		<div
			id="delete-modal"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
		>
			<div className="relative p-4 w-full max-w-md max-h-full">
				{/* Modal content */}
				<div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
					{/* Modal header */}
					<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
							Confirm Delete
						</h3>
						<button
							type="button"
							onClick={onClose}
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
					<div className="p-4 md:p-5 space-y-4">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							Are you sure you want to delete{" "}
							<span className="font-semibold text-gray-900 dark:text-white">
								{itemToDelete}
							</span>
							?
						</p>
					</div>

					{/* Modal footer */}
					<div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 space-x-3">
						<button
							onClick={handleConfirmDelete}
							type="button"
							className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none 
										focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
										dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
						>
							Delete
						</button>
						<button
							onClick={onClose}
							type="button"
							className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border 
										border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 
										focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
										dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
