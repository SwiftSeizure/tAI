import React, { useEffect, useState } from 'react';
import { NavBar } from '../../shared/components/NavBar';
import { useCurrentClass } from '../../store/class-store';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'; 
import { getAssignmentsPrompts } from '../../shared/services/get-assignments-prompts';
import { getMaterialsPrompts } from '../../shared/services/get-materials-prompts';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ClassStatisticsPage() {
    const { currentClass } = useCurrentClass(); 
    const [assignmentsPrompts, setAssignmentsPrompts] = useState([]);
    const [materialsPrompts, setMaterialsPrompts] = useState([]);

    const handlePieClick = (event, elements, chart) => {
        if (elements.length > 0) {
            const clickedElement = elements[0];
            const label = chart.data.labels[clickedElement.index];
            const value = chart.data.datasets[clickedElement.datasetIndex].data[clickedElement.index];
            console.log(`Clicked on ${label}: ${value}`);
            // Add your custom logic here
        }
    }; 

    const handleBarClick = (event, elements, chart) => {
        if (elements.length > 0) {
            const clickedElement = elements[0];
            const label = chart.data.labels[clickedElement.index];
            const value = chart.data.datasets[clickedElement.datasetIndex].data[clickedElement.index];
            console.log(`Clicked on ${label}: ${value}`);
            // Add your custom logic here
        }
    };   

    const fetchAssignmentsPrompts = async () => {
        try {
            const response = await getAssignmentsPrompts();
            setAssignmentsPrompts(response);
        } catch (error) {
            console.error('Error fetching assignments prompts:', error);
        }
    };

    const fetchMaterialsPrompts = async () => {
        try {
            const response = await getMaterialsPrompts();
            setMaterialsPrompts(response);
        } catch (error) {
            console.error('Error fetching materials prompts:', error);
        }
    };

    useEffect(() => {
        fetchAssignmentsPrompts();
        fetchMaterialsPrompts(); 
        console.log(assignmentsPrompts);
        console.log(materialsPrompts);
    }, []); 


    // All API calls bellow can give classID to the backend and the current userID unless noted otherwise

    // Mock data for assignments
    const assignmentQuestions = [
        { name: 'Assignment 1: Intro to React', assignmentID: 1, value: 45 },
        { name: 'Assignment 2: State Management', assignmentID: 2, value: 32 },
        { name: 'Assignment 3: API Integration', assignmentID: 3, value: 28 },
        { name: 'Assignment 4: Testing', assignmentID: 4, value: 15 },
    ];

    // Mock data for materials
    const materialQuestions = [
        { name: 'Module 1: Basics', materialID: 1, value: 52 },
        { name: 'Module 2: Advanced Concepts', materialID: 2, value: 38 },
        { name: 'Module 3: Best Practices', materialID: 3, value: 25 },
        { name: 'Module 4: Real-world Examples', materialID: 4, value: 19 },
    ]; 

    
    // This is so that we can display the stats for all students and which ones are asking the most questions
    // This will give an assingmentID or materialID to the backend
    const mockStudentsAssignmentAndMaterialsPromptCount = [
        {name: 'Student 1', studentID: 1, value: 10},
        {name: 'Student 2', studentID: 2, value: 15},
        {name: 'Student 3', studentID: 3, value: 20},
        {name: 'Student 4', studentID: 4, value: 25},
        {name: 'Student 5', studentID: 5, value: 30},
        {name: 'Student 6', studentID: 6, value: 35},
        {name: 'Student 7', studentID: 7, value: 40},
        {name: 'Student 8', studentID: 8, value: 45},
        {name: 'Student 9', studentID: 9, value: 50},
        {name: 'Student 10', studentID: 10, value: 55},
    ];

    // This is so that we can display the stats for a specific student. 
    // This will give an studentID to the backend
    const mockSpecificStudentStats = [
        {name: 'student 1', assignmentID: 1, value: 10},
        {name: 'student 1', assignmentID: 2, value: 15},
        {name: 'student 1', assignmentID: 3, value: 20},
        {name: 'student 1', assignmentID: 4, value: 25},
    ]; 

    // This is so that we can display the stats for all students and which ones are asking the most questions
    const mockAllStudentStats = [
        { name: 'Student 1', studentID: 1, value: 10 },
        { name: 'Student 2', studentID: 2, value: 15 },
        { name: 'Student 3', studentID: 3, value: 20 },
        { name: 'Student 4', studentID: 4, value: 25 },
    ];

    const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

    const assignmentData = {
        labels: assignmentQuestions.map(a => a.name),
        datasets: [
            {
                label: 'Questions',
                data: assignmentQuestions.map(a => a.value),
                backgroundColor: COLORS,
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };

    const materialData = {
        labels: materialQuestions.map(m => m.name),
        datasets: [
            {
                label: 'Questions',
                data: materialQuestions.map(m => m.value),
                backgroundColor: COLORS,
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        onClick: handlePieClick,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
    };

    // Bar chart data combining both
    const combinedBarData = {
        labels: ['Assignment 1', 'Assignment 2', 'Assignment 3', 'Assignment 4'],
        datasets: [
            {
                label: 'Assignment Questions',
                data: assignmentQuestions.map(a => a.value),
                backgroundColor: '#3b82f6',
                borderRadius: 6,
            },
            {
                label: 'Material Questions',
                data: materialQuestions.map(m => m.value),
                backgroundColor: '#8b5cf6',
                borderRadius: 6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true, 
        onClick: handleBarClick,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6',
                },
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                }
            },
        },
    }; 

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 bg-[length:200%_200%]" style={{animation: 'gradient-shift 15s ease-in-out infinite'}}>
                <NavBar title="Class Statistics" classID={currentClass?.id} />
                
                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    {/* Page Header */}
                    <div className="mx-auto bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 w-fit">
                        <div className="flex flex-col items-center">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Student Engagement Analytics
                            </h1>
                            <p className="text-gray-600 text-center mt-2">
                                Track student questions and engagement across assignments and materials. 
                                Click on any chart section to view detailed breakdowns by topic and student.
                            </p>
                        </div>
                    </div>

                    {/* Pie Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Assignment Questions Pie Chart */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                Questions by Assignment
                            </h2>
                            <div className="h-80 mb-4">
                                <Pie data={assignmentData} options={chartOptions} />
                            </div>
                            {/* Stats Summary */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Questions</span>
                                    <span className="font-semibold text-gray-900">
                                        {assignmentQuestions.reduce((sum, item) => sum + item.value, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Most Active</span>
                                    <span className="font-semibold text-gray-900">
                                        Assignment 1
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Average per Assignment</span>
                                    <span className="font-semibold text-gray-900">
                                        {Math.round(assignmentQuestions.reduce((sum, item) => sum + item.value, 0) / assignmentQuestions.length)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Material Questions Pie Chart */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                                Questions by Material
                            </h2>
                            <div className="h-80 mb-4">
                                <Pie data={materialData} options={chartOptions} />
                            </div>
                            {/* Stats Summary */}
                            <div className="space-y-2 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Questions</span>
                                    <span className="font-semibold text-gray-900">
                                        {materialQuestions.reduce((sum, item) => sum + item.value, 0)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Most Active</span>
                                    <span className="font-semibold text-gray-900">
                                        Module 1
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Average per Material</span>
                                    <span className="font-semibold text-gray-900">
                                        {Math.round(materialQuestions.reduce((sum, item) => sum + item.value, 0) / materialQuestions.length)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart Comparison */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Comparative Analysis
                        </h2>
                        <div className="h-96">
                            <Bar data={combinedBarData} options={barChartOptions} />
                        </div>
                    </div>

                    {/* Placeholder for future sections */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Coming Soon: Detailed Breakdowns
                        </h2>
                        <p className="text-gray-600 mb-3">
                            Click on chart sections above to view:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 ml-4">
                            <li>• Questions by specific topics within each assignment/material</li>
                            <li>• Individual student engagement metrics</li>
                            <li>• Time-based trends and patterns</li>
                            <li>• Question complexity analysis</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}