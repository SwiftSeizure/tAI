import React from 'react';

const RosterModal = ({ isOpen, onClose, onRemoveStudent, classroom, enrolledStudents }) => { 
    if (!isOpen) return null; 

    const handleRemoveClick = (student) => {
        onRemoveStudent(student);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Students Enrolled in {classroom.name}</h3>
                    
                    <div className="space-y-2">
                        {enrolledStudents.length > 0 ? (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {enrolledStudents.map((student) => (
                                    <li key={student.id} className="py-3 flex justify-between items-center">
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
                                            className="px-3 py-1 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                                        >
                                            Remove from {classroom.name}
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

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
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