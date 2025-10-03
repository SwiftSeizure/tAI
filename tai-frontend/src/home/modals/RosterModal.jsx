import React, { useRef, useEffect } from "react";

const RosterModal = ({ isOpen, onClose, onRemoveStudent, classroom, enrolledStudents }) => {
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

    const handleRemoveClick = (student) => {
        onRemoveStudent(student);
    };

    if (!isOpen) return null;

    return (
        <div
            id="roster-modal"
            tabIndex="-1"
            aria-hidden={!isOpen}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm"
        >
            <div 
                ref={modalRef}
                className="relative p-4 w-full max-w-2xl max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Modal header */}
                    <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Students Enrolled in {classroom.name}
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
                    <div className="p-4 md:p-5 space-y-4 max-h-[400px] overflow-y-auto">
                        {enrolledStudents.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {enrolledStudents.map((student) => (
                                    <li
                                        key={student.id}
                                        className="py-3 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {student.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveClick(student)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No students are enrolled in {classroom.name}.
                            </p>
                        )}
                    </div>
                    
                    {/* Modal footer */}
                    <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RosterModal;