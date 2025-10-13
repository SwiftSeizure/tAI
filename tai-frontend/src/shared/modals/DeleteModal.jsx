import React, { useEffect, useRef } from "react";

export default function DeleteModal({ isOpen, onClose, onConfirmDelete, itemToDelete }) {
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

	const handleConfirmDelete = (e) => {
		e.stopPropagation();
		onConfirmDelete();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			id="delete-modal"
			tabIndex="-1"
			aria-hidden={!isOpen}
			className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
		>
			<div 
				ref={modalRef}
				className="relative p-4 w-full max-w-md"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Modal header */}
					<div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
						<h3 className="text-xl font-bold text-gray-900">
							Confirm Deletion
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="group flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
							aria-label="Close modal"
						>
							<svg
								className="w-4 h-4"
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
									d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
								/>
							</svg>
						</button>
					</div>
					
					{/* Modal body */}
					<div className="px-6 py-6 space-y-5">
						{/* Warning Icon */}
						<div className="flex justify-center">
							<div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full">
								<svg
									className="w-8 h-8 text-red-600"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</div>
						</div>

						{/* Message */}
						<div className="text-center space-y-3">
							<p className="text-base text-gray-700 leading-relaxed">
								Are you sure you want to delete{' '}
								<span className="font-semibold text-gray-900">
									{itemToDelete}
								</span>?
							</p>
							<div className="bg-red-50 border border-red-200 rounded-xl p-4"> 
								<p className="text-sm text-red-700 font-medium">
									This action cannot be undone
								</p>
								<p className="text-xs text-red-600 mt-1">
									Once deleted, this item cannot be recovered.
								</p>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col-reverse sm:flex-row gap-3 pt-2"> 
							<button
								onClick={handleConfirmDelete}
								type="button"
								className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200"
							>
								Delete
							</button>
							<button
								onClick={onClose}
								type="button"
								className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-200"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	); 
}