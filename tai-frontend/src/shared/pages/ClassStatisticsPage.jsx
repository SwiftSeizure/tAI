import React, { useEffect, useState } from 'react';
import { NavBar } from '../../shared/components/NavBar';
import { useCurrentClass } from '../../store/class-store';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'; 
import { getAssignmentsPrompts } from '../services/get-assignments-prompt-count';
import { getMaterialsPrompts } from '../services/get-materials-prompt-count';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const NoDataMessage = ({ message = "No data available" }) => (
    <div className="flex flex-col items-center justify-center h-80 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg text-center">{message}</p>
    </div>
);   

const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        // Generate random hue between 0-360, with good saturation and lightness
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.random() * 30;  // 70-100%
        const lightness = 40 + Math.random() * 40;   // 40-80%
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
};

export default function ClassStatisticsPage() {
    const { currentClass } = useCurrentClass(); 
    const [assignmentsData, setAssignmentsData] = useState([]);
    const [materialsData, setMaterialsData] = useState([]); 

    const hasAssignments = assignmentsData.length > 0;
    const hasMaterials = materialsData.length > 0;

    const handlePieClick = (event, elements, chart) => {
        if (elements.length > 0) {
            const clickedElement = elements[0];
            const label = chart.data.labels[clickedElement.index];
            const value = chart.data.datasets[clickedElement.datasetIndex].data[clickedElement.index];
            console.log(`Clicked on ${label}: ${value}`);
        }
    }; 

const fetchAssignmentsPrompts = async () => {
    try {
        const response = await getAssignmentsPrompts();
        console.log("Assignments prompts in response:", response);
        
        // Handle the case where response is an object with numeric keys
        if (response && typeof response === 'object' && !Array.isArray(response)) {
            const formattedData = Object.entries(response).map(([id, item]) => ({
                assignmentID: id,
                name: item.assignment || `Assignment ${id}`,
                value: item.count || 0
            }));
            console.log("Formatted assignments data:", formattedData);
            setAssignmentsData(formattedData);
        } else {
            console.error("Unexpected response format:", response);
            setAssignmentsData([]);
        }
    } catch (error) {
        console.error('Error fetching assignments prompts:', error);
        setAssignmentsData([]);
    }
};

const fetchMaterialsPrompts = async () => {
    try {
        const response = await getMaterialsPrompts();
        console.log("Materials prompts in response:", response);
        
        // Handle the case where response is an object with numeric keys
        if (response && typeof response === 'object' && !Array.isArray(response)) {
            const formattedData = Object.entries(response).map(([id, item]) => ({
                materialID: id,
                name: item.material || item.assignment || `Material ${id}`,
                value: item.count || 0
            }));
            console.log("Formatted materials data:", formattedData);
            setMaterialsData(formattedData);
        } else {
            console.error("Unexpected response format:", response);
            setMaterialsData([]);
        }
    } catch (error) {
        console.error('Error fetching materials prompts:', error);
        setMaterialsData([]);
    }
};


    useEffect(() => {
        fetchAssignmentsPrompts(); 
        // Example return value: 
        // {
        //     "102": {
        //         "assignment": "Assignment 1",
        //         "count": 10
        //     },
        //     "103": {
        //         "assignment": "Assignment 2",
        //         "count": 20
        //     }
        // }
        fetchMaterialsPrompts(); 
        // Example return value: 
        // {
        //     "102": {
        //         "material": "Material 1",
        //         "count": 10
        //     },
        //     "103": {
        //         "material": "Material 2",
        //         "count": 20
        //     }
        // }
    }, []);

    const assignmentData = {
        labels: assignmentsData.map(a => a.name),
        datasets: [{
            label: 'Questions',
            data: assignmentsData.map(a => a.value),
            backgroundColor: generateRandomColors(assignmentsData.length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const materialData = {
        labels: materialsData.map(m => m.name),
        datasets: [{
            label: 'Questions',
            data: materialsData.map(m => m.value),
            backgroundColor: generateRandomColors(materialsData.length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
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
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} prompt${value !== 1 ? 's' : ''}`;
                    }
                },
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

    // Combined bar chart data
    const combinedBarData = {
        labels: assignmentsData.map(a => a.name),
        datasets: [
            {
                label: 'Assignment Prompts',
                data: assignmentsData.map(a => a.value),
                backgroundColor: generateRandomColors(assignmentsData.length, 0.8),
                borderRadius: 6,
            },
            {
                label: 'Material Prompts',
                data: materialsData.map(m => m.value),
                backgroundColor: generateRandomColors(materialsData.length, 0.6),
                borderRadius: 6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
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
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} prompt${value !== 1 ? 's' : ''}`;
                    }
                },
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
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    {currentClass?.name || 'Class'} Statistics
                </h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Assignments Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Assignment Prompts</h2>
                        {hasAssignments ? (
                            <div className="h-80">
                                <Pie data={assignmentData} options={chartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="No assignment prompts available" />
                        )}
                    </div>
                    
                    {/* Materials Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Material Prompts</h2>
                        {hasMaterials ? (
                            <div className="h-80">
                                <Pie data={materialData} options={chartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="No material prompts available" />
                        )}
                    </div>
                </div>
                    
                {/* Combined Bar Chart - Only show if we have both assignments and materials */}
                {(hasAssignments || hasMaterials) && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Material vs Assignment Prompt Comparison</h2>
                        {hasAssignments && hasMaterials ? (
                            <div className="h-96">
                                <Bar data={combinedBarData} options={barChartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="Unfortunately, there is not enough data to show a comparison. Great job teaching!" />
                        )}
                    </div>
                )}
            </div>
        </div>
    ); 
}
