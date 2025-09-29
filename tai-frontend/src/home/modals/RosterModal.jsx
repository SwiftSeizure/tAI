import React from "react";

const RosterModal = ({ isOpen, onClose, onRemoveStudent, classroom, enrolledStudents }) => {
    if (!isOpen){ 
        return null;
    }

    const handleRemoveClick = (student) => {
        onRemoveStudent(student);
    };

    return (
    <div
        id="roster-modal"
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
                        Students Enrolled in {classroom.name}
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
                <div className="p-4 md:p-5 space-y-4 max-h-[400px] overflow-y-auto">
                    {enrolledStudents.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                            {enrolledStudents.map((student) => (
                                <li
                                    key={student.id}
                                    className="py-3 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {student.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {student.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemoveClick(student)}
                                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 
                                               hover:bg-red-200 rounded-md transition-colors 
                                               dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No students are enrolled in {classroom.name}.
                    </p>
                )}
            </div>
            
            {/* Modal footer */}
            <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                    onClick={onClose}
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                           focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                           text-sm px-5 py-2.5 text-center dark:bg-blue-600 
                           dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
